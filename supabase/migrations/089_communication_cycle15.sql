-- Ciclo 15 — cola prioritaria, auditoría de consentimiento, métricas de reintentos

ALTER TABLE public.communication_delivery_queue
  ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 2
    CHECK (priority BETWEEN 0 AND 4);

CREATE INDEX IF NOT EXISTS idx_comm_delivery_queue_priority
  ON public.communication_delivery_queue (priority DESC, next_retry_at)
  WHERE status = 'pending';

-- Mapea prioridad textual del evento a score numérico (critical=4 … silent=0)
CREATE OR REPLACE FUNCTION public.comm_priority_score(p_priority TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE COALESCE(NULLIF(TRIM(p_priority), ''), 'medium')
    WHEN 'critical' THEN 4
    WHEN 'high' THEN 3
    WHEN 'medium' THEN 2
    WHEN 'low' THEN 1
    WHEN 'silent' THEN 0
    ELSE 2
  END;
$$;

DROP FUNCTION IF EXISTS public.enqueue_communication_retry(TEXT, UUID, TEXT, JSONB, UUID, TEXT);

CREATE OR REPLACE FUNCTION public.enqueue_communication_retry(
  p_event_key TEXT,
  p_recipient_id UUID,
  p_channel TEXT,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_event_id UUID DEFAULT NULL,
  p_error TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT 'medium'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_delay INTERVAL;
  v_score INTEGER;
BEGIN
  IF p_recipient_id IS NULL OR p_channel IS NULL THEN
    RETURN NULL;
  END IF;

  v_score := public.comm_priority_score(p_priority);
  v_delay := CASE
    WHEN v_score >= 4 THEN INTERVAL '30 seconds'
    WHEN v_score >= 3 THEN INTERVAL '1 minute'
    ELSE INTERVAL '2 minutes'
  END;

  INSERT INTO communication_delivery_queue (
    event_id, event_key, recipient_id, channel, payload, next_retry_at, last_error, priority
  ) VALUES (
    p_event_id, p_event_key, p_recipient_id, p_channel, p_payload, NOW() + v_delay, p_error, v_score
  )
  RETURNING id INTO v_id;

  IF p_event_id IS NOT NULL THEN
    UPDATE communication_events
    SET retry_count = retry_count + 1,
        audit_trail = audit_trail || jsonb_build_array(jsonb_build_object(
          'at', NOW(),
          'action', 'retry_enqueued',
          'channel', p_channel,
          'queue_id', v_id,
          'priority', v_score
        ))
    WHERE id = p_event_id;
  END IF;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enqueue_communication_retry(TEXT, UUID, TEXT, JSONB, UUID, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_communication_retries(p_limit INTEGER DEFAULT 20)
RETURNS SETOF public.communication_delivery_queue
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE communication_delivery_queue q
  SET status = 'processing',
      attempt_count = attempt_count + 1,
      updated_at = NOW()
  WHERE q.id IN (
    SELECT id FROM communication_delivery_queue
    WHERE status = 'pending'
      AND next_retry_at <= NOW()
      AND attempt_count < max_attempts
    ORDER BY priority DESC, next_retry_at ASC
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_communication_retries(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_communication_retries(INTEGER) TO service_role;

-- Auditoría de consentimiento por canal y categoría
CREATE OR REPLACE FUNCTION public.get_admin_consent_audit()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_users INTEGER;
  v_with_prefs INTEGER;
  v_result JSONB;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_total_users FROM public.users WHERE role IS NOT NULL;
  SELECT COUNT(*)::INTEGER INTO v_with_prefs FROM public.communication_preferences;

  SELECT jsonb_build_object(
    'total_users', v_total_users,
    'with_preferences', v_with_prefs,
    'without_preferences', GREATEST(0, v_total_users - v_with_prefs),
    'marketing_opt_in', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = TRUE
    ),
    'marketing_opt_out', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = FALSE
    ),
    'digest_subscribers', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE daily_digest_enabled = TRUE
    ),
    'quiet_hours_configured', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences
      WHERE quiet_hours_start IS NOT NULL AND quiet_hours_end IS NOT NULL
    ),
    'channel_totals', jsonb_build_object(
      'push_enabled', (
        SELECT COUNT(*)::INTEGER FROM public.communication_preferences cp
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(cp.categories) cat
          WHERE (cat.value->>'push')::boolean IS DISTINCT FROM FALSE
        )
      ),
      'email_enabled', (
        SELECT COUNT(*)::INTEGER FROM public.communication_preferences cp
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(cp.categories) cat
          WHERE (cat.value->>'email')::boolean = TRUE
        )
      ),
      'in_app_enabled', (
        SELECT COUNT(*)::INTEGER FROM public.communication_preferences cp
        WHERE EXISTS (
          SELECT 1 FROM jsonb_each(cp.categories) cat
          WHERE (cat.value->>'in_app')::boolean IS DISTINCT FROM FALSE
        )
      )
    ),
    'by_category', COALESCE((
      SELECT jsonb_object_agg(cat_key, jsonb_build_object(
        'push_on', push_on,
        'push_off', push_off,
        'email_on', email_on,
        'in_app_on', in_app_on
      ))
      FROM (
        SELECT
          cat.key AS cat_key,
          COUNT(*) FILTER (WHERE (cat.value->>'push')::boolean IS DISTINCT FROM FALSE)::INTEGER AS push_on,
          COUNT(*) FILTER (WHERE (cat.value->>'push')::boolean = FALSE)::INTEGER AS push_off,
          COUNT(*) FILTER (WHERE (cat.value->>'email')::boolean = TRUE)::INTEGER AS email_on,
          COUNT(*) FILTER (WHERE (cat.value->>'in_app')::boolean IS DISTINCT FROM FALSE)::INTEGER AS in_app_on
        FROM public.communication_preferences cp,
        LATERAL jsonb_each(cp.categories) cat
        GROUP BY cat.key
      ) s
    ), '{}'::jsonb),
    'marketing_blocked_users', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT u.id, u.email, u.role, cp.updated_at
        FROM public.communication_preferences cp
        JOIN public.users u ON u.id = cp.user_id
        WHERE cp.marketing_enabled = FALSE
        ORDER BY cp.updated_at DESC NULLS LAST
        LIMIT 20
      ) t
    ), '[]'::jsonb),
    'generated_at', NOW()
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_consent_audit() TO authenticated;

-- Estadísticas de cola de reintentos por prioridad
CREATE OR REPLACE FUNCTION public.get_admin_retry_queue_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'pending_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending'
    ),
    'processing', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'processing'
    ),
    'failed_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'failed'
    ),
    'by_priority', COALESCE((
      SELECT jsonb_object_agg(priority_label, cnt)
      FROM (
        SELECT
          CASE priority
            WHEN 4 THEN 'critical'
            WHEN 3 THEN 'high'
            WHEN 2 THEN 'medium'
            WHEN 1 THEN 'low'
            ELSE 'silent'
          END AS priority_label,
          COUNT(*)::INTEGER AS cnt
        FROM public.communication_delivery_queue
        WHERE status = 'pending'
        GROUP BY priority
      ) s
    ), '{}'::jsonb),
    'oldest_pending_at', (
      SELECT MIN(created_at) FROM public.communication_delivery_queue WHERE status = 'pending'
    ),
    'critical_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND priority >= 4
    ),
    'recent', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT id, event_key, channel, priority, attempt_count, next_retry_at, created_at
        FROM public.communication_delivery_queue
        WHERE status = 'pending'
        ORDER BY priority DESC, next_retry_at ASC
        LIMIT 15
      ) t
    ), '[]'::jsonb)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_retry_queue_stats() TO authenticated;

-- Extender overview admin
CREATE OR REPLACE FUNCTION public.get_admin_communication_overview()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'events_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_events WHERE created_at >= v_since
    ),
    'notifications_7d', (
      SELECT COUNT(*)::INTEGER FROM public.notifications WHERE created_at >= v_since
    ),
    'engagement_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since
    ),
    'opened_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_engagement
      WHERE created_at >= v_since AND event_type = 'opened'
    ),
    'clicked_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_engagement
      WHERE created_at >= v_since AND event_type = 'clicked'
    ),
    'campaigns_7d', (
      SELECT COUNT(*)::INTEGER FROM public.business_campaigns
      WHERE sent_at >= v_since AND status = 'sent'
    ),
    'webhooks_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_webhooks WHERE is_active = TRUE
    ),
    'templates_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_templates WHERE is_active = TRUE
    ),
    'retries_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending'
    ),
    'retries_critical', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND priority >= 4
    ),
    'digest_subscribers', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE daily_digest_enabled = TRUE
    ),
    'marketing_opt_in', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = TRUE
    ),
    'deliveries_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_log WHERE created_at >= v_since
    ),
    'delivery_success_rate', COALESCE((
      SELECT ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'delivered')
        / NULLIF(COUNT(*), 0), 1
      )
      FROM public.communication_delivery_log WHERE created_at >= v_since
    ), 0),
    'ab_variants_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_template_variants WHERE is_active = TRUE
    ),
    'scheduled_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_scheduled WHERE status = 'pending'
    ),
    'scheduled_sent_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_scheduled
      WHERE status = 'sent' AND sent_at >= v_since
    ),
    'broadcasts_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts
      WHERE status IN ('pending', 'processing')
        AND (scheduled_at IS NULL OR scheduled_at <= NOW())
    ),
    'broadcasts_scheduled', (
      SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts
      WHERE status = 'pending' AND scheduled_at IS NOT NULL AND scheduled_at > NOW()
    ),
    'broadcasts_completed_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts
      WHERE status = 'completed' AND completed_at >= v_since
    ),
    'sla_alerts_open', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open'
    ),
    'sla_alerts_escalated', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts
      WHERE status = 'open' AND escalation_level > 0
    ),
    'broadcast_templates_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_broadcast_templates WHERE is_active = TRUE
    ),
    'sla_webhooks_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_webhooks WHERE is_active = TRUE
    ),
    'by_category', COALESCE((
      SELECT jsonb_object_agg(category, cnt)
      FROM (
        SELECT category, COUNT(*)::INTEGER AS cnt
        FROM public.communication_events
        WHERE created_at >= v_since
        GROUP BY category
      ) s
    ), '{}'::jsonb),
    'recent_events', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT event_key, category, title, recipient_id, created_at
        FROM public.communication_events
        ORDER BY created_at DESC
        LIMIT 12
      ) t
    ), '[]'::jsonb)
  );
END;
$$;
