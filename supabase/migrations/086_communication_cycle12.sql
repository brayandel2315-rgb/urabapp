-- Ciclo 12 — historial/reenvío broadcasts, variables de plantilla, alertas SLA

ALTER TABLE public.communication_broadcasts
  ADD COLUMN IF NOT EXISTS parent_broadcast_id UUID REFERENCES public.communication_broadcasts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_comm_broadcasts_parent
  ON public.communication_broadcasts (parent_broadcast_id)
  WHERE parent_broadcast_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.communication_sla_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('latency', 'success_rate')),
  metric_value NUMERIC NOT NULL,
  threshold_value NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'acknowledged', 'resolved')),
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_comm_sla_alerts_open
  ON public.communication_sla_alerts (created_at DESC)
  WHERE status = 'open';

ALTER TABLE public.communication_sla_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_sla_alerts_admin ON public.communication_sla_alerts;
CREATE POLICY comm_sla_alerts_admin ON public.communication_sla_alerts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.resend_communication_broadcast(p_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_src communication_broadcasts%ROWTYPE;
  v_id UUID;
  v_total INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT * INTO v_src FROM communication_broadcasts WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'broadcast not found';
  END IF;

  v_total := count_broadcast_recipients(v_src.segment_type, v_src.segment_value);

  INSERT INTO communication_broadcasts (
    name, title, body, event_key, category, priority,
    segment_type, segment_value, recipients_total,
    parent_broadcast_id, created_by
  ) VALUES (
    v_src.name || ' (reenvío)',
    v_src.title,
    v_src.body,
    v_src.event_key,
    v_src.category,
    v_src.priority,
    v_src.segment_type,
    v_src.segment_value,
    v_total,
    p_id,
    auth.uid()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_broadcast_history(p_limit INTEGER DEFAULT 50)
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

  RETURN COALESCE((
    SELECT jsonb_agg(row_to_json(t) ORDER BY t.created_at DESC)
    FROM (
      SELECT
        b.id,
        b.name,
        b.title,
        b.body,
        b.event_key,
        b.segment_type,
        b.segment_value,
        b.status,
        b.recipients_total,
        b.recipients_sent,
        b.recipients_failed,
        b.parent_broadcast_id,
        b.created_at,
        b.completed_at,
        b.last_error,
        (SELECT COUNT(*)::INTEGER FROM communication_broadcasts c WHERE c.parent_broadcast_id = b.id) AS resend_count
      FROM communication_broadcasts b
      ORDER BY b.created_at DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_template_variables_for_event(p_event_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vars TEXT[] := ARRAY[]::TEXT[];
  v_tpl RECORD;
  v_match TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT title_template, body_template INTO v_tpl
  FROM communication_templates
  WHERE event_key = p_event_key AND is_active = TRUE
  LIMIT 1;

  IF v_tpl.title_template IS NOT NULL OR v_tpl.body_template IS NOT NULL THEN
    FOR v_match IN
      SELECT DISTINCT m[1]
      FROM regexp_matches(
        COALESCE(v_tpl.title_template, '') || ' ' || COALESCE(v_tpl.body_template, ''),
        '\{\{(\w+)\}\}',
        'g'
      ) AS m
    LOOP
      IF v_match IS NOT NULL AND NOT v_match = ANY(v_vars) THEN
        v_vars := array_append(v_vars, v_match);
      END IF;
    END LOOP;
  END IF;

  IF array_length(v_vars, 1) IS NULL THEN
    v_vars := CASE p_event_key
      WHEN 'order_created' THEN ARRAY['orderNumber', 'body']
      WHEN 'order_status_changed' THEN ARRAY['orderNumber', 'status', 'body']
      WHEN 'order_cancelled' THEN ARRAY['orderNumber', 'reason']
      WHEN 'payment_approved' THEN ARRAY['amount', 'reference']
      WHEN 'payment_failed' THEN ARRAY['amount', 'reason']
      WHEN 'business_campaign_sent' THEN ARRAY['businessName', 'body']
      WHEN 'daily_digest_sent' THEN ARRAY['digest_count', 'body']
      ELSE ARRAY['title', 'body']
    END;
  END IF;

  RETURN COALESCE((
    SELECT jsonb_agg(jsonb_build_object('key', k, 'placeholder', '{{' || k || '}}'))
    FROM unnest(v_vars) AS k
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.check_communication_sla_breaches(p_days INTEGER DEFAULT 7)
RETURNS SETOF public.communication_sla_alerts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - (GREATEST(p_days, 1) || ' days')::INTERVAL;
  v_row RECORD;
  v_alert communication_sla_alerts%ROWTYPE;
  v_p95 INTEGER;
  v_success NUMERIC;
  v_total INTEGER;
BEGIN
  FOR v_row IN
    SELECT s.channel, s.max_latency_ms, s.min_success_rate
    FROM communication_channel_sla s
    WHERE s.is_active = TRUE
  LOOP
    SELECT
      COUNT(*)::INTEGER,
      ROUND(
        100.0 * COUNT(*) FILTER (WHERE l.status = 'delivered')
        / NULLIF(COUNT(*) FILTER (WHERE l.status IN ('delivered', 'failed')), 0),
        1
      ),
      ROUND(
        PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY l.latency_ms)
        FILTER (WHERE l.status = 'delivered' AND l.latency_ms IS NOT NULL)
      )::INTEGER
    INTO v_total, v_success, v_p95
    FROM communication_delivery_log l
    WHERE l.channel = v_row.channel AND l.created_at >= v_since;

    IF COALESCE(v_total, 0) < 5 THEN
      CONTINUE;
    END IF;

    IF COALESCE(v_p95, 0) > v_row.max_latency_ms THEN
      IF NOT EXISTS (
        SELECT 1 FROM communication_sla_alerts a
        WHERE a.channel = v_row.channel
          AND a.alert_type = 'latency'
          AND a.status = 'open'
          AND a.created_at >= NOW() - INTERVAL '24 hours'
      ) THEN
        INSERT INTO communication_sla_alerts (channel, alert_type, metric_value, threshold_value, message)
        VALUES (
          v_row.channel,
          'latency',
          v_p95,
          v_row.max_latency_ms,
          format('Canal %s: latencia p95 %s ms supera objetivo %s ms', v_row.channel, v_p95, v_row.max_latency_ms)
        )
        RETURNING * INTO v_alert;
        RETURN NEXT v_alert;
      END IF;
    END IF;

    IF COALESCE(v_success, 100) < v_row.min_success_rate THEN
      IF NOT EXISTS (
        SELECT 1 FROM communication_sla_alerts a
        WHERE a.channel = v_row.channel
          AND a.alert_type = 'success_rate'
          AND a.status = 'open'
          AND a.created_at >= NOW() - INTERVAL '24 hours'
      ) THEN
        INSERT INTO communication_sla_alerts (channel, alert_type, metric_value, threshold_value, message)
        VALUES (
          v_row.channel,
          'success_rate',
          v_success,
          v_row.min_success_rate,
          format('Canal %s: éxito %s%% por debajo del objetivo %s%%', v_row.channel, v_success, v_row.min_success_rate)
        )
        RETURNING * INTO v_alert;
        RETURN NEXT v_alert;
      END IF;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_communication_sla_alerts(p_limit INTEGER DEFAULT 30)
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

  RETURN COALESCE((
    SELECT jsonb_agg(row_to_json(t) ORDER BY t.created_at DESC)
    FROM (
      SELECT id, channel, alert_type, metric_value, threshold_value, status, message, created_at, acknowledged_at
      FROM communication_sla_alerts
      ORDER BY created_at DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.acknowledge_sla_alert(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  UPDATE communication_sla_alerts
  SET status = 'acknowledged', acknowledged_at = NOW(), acknowledged_by = auth.uid()
  WHERE id = p_id AND status = 'open';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_user_ids()
RETURNS TABLE(user_id UUID)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM users WHERE role = 'ADMIN' AND is_active = TRUE;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_communication_overview()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'events_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_events WHERE created_at >= v_since),
    'notifications_7d', (SELECT COUNT(*)::INTEGER FROM public.notifications WHERE created_at >= v_since),
    'engagement_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since),
    'opened_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_engagement
      WHERE created_at >= v_since AND action = 'opened'
    ),
    'clicked_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_engagement
      WHERE created_at >= v_since AND action = 'clicked'
    ),
    'campaigns_7d', (
      SELECT COUNT(*)::INTEGER FROM public.business_customer_campaigns
      WHERE created_at >= v_since
    ),
    'webhooks_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_webhooks WHERE is_active = TRUE
    ),
    'templates_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_templates WHERE is_active = TRUE
    ),
    'ab_variants_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_template_variants WHERE is_active = TRUE
    ),
    'retries_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending'
    ),
    'retries_failed_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'failed' AND updated_at >= v_since
    ),
    'digest_subscribers', (
      SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE daily_digest_enabled = TRUE
    ),
    'deliveries_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_log WHERE created_at >= v_since
    ),
    'delivery_success_rate', COALESCE((
      SELECT ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'delivered')
        / NULLIF(COUNT(*) FILTER (WHERE status IN ('delivered', 'failed')), 0),
        1
      )
      FROM public.communication_delivery_log WHERE created_at >= v_since
    ), 0),
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
    ),
    'broadcasts_completed_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts
      WHERE status = 'completed' AND completed_at >= v_since
    ),
    'sla_alerts_open', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open'
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

GRANT EXECUTE ON FUNCTION public.resend_communication_broadcast(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_broadcast_history(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_template_variables_for_event(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_communication_sla_alerts(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.acknowledge_sla_alert(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_communication_sla_breaches(INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_admin_user_ids() TO service_role;
