-- Ciclo 14 — plantillas de broadcast, escalado SLA, tendencias 30d

CREATE TABLE IF NOT EXISTS public.communication_broadcast_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  segment_type TEXT NOT NULL
    CHECK (segment_type IN ('all_active', 'role', 'marketing_opt_in', 'digest_subscribers', 'municipio')),
  segment_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  event_key TEXT NOT NULL DEFAULT 'broadcast_segment_sent',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.communication_sla_alerts
  ADD COLUMN IF NOT EXISTS escalation_level INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_comm_sla_alerts_escalate
  ON public.communication_sla_alerts (created_at)
  WHERE status = 'open';

ALTER TABLE public.communication_broadcast_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_broadcast_tpl_admin ON public.communication_broadcast_templates;
CREATE POLICY comm_broadcast_tpl_admin ON public.communication_broadcast_templates
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.upsert_broadcast_template(
  p_id UUID,
  p_name TEXT,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_segment_type TEXT DEFAULT 'all_active',
  p_segment_value JSONB DEFAULT '{}'::jsonb,
  p_event_key TEXT DEFAULT 'broadcast_segment_sent',
  p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  IF p_id IS NOT NULL THEN
    UPDATE communication_broadcast_templates SET
      name = TRIM(p_name),
      title = TRIM(p_title),
      body = NULLIF(TRIM(p_body), ''),
      segment_type = p_segment_type,
      segment_value = COALESCE(p_segment_value, '{}'::jsonb),
      event_key = COALESCE(NULLIF(TRIM(p_event_key), ''), 'broadcast_segment_sent'),
      is_active = p_is_active,
      updated_at = NOW()
    WHERE id = p_id
    RETURNING id INTO v_id;
    RETURN v_id;
  END IF;

  INSERT INTO communication_broadcast_templates (
    name, title, body, segment_type, segment_value, event_key, is_active, created_by
  ) VALUES (
    TRIM(p_name), TRIM(p_title), NULLIF(TRIM(p_body), ''),
    p_segment_type, COALESCE(p_segment_value, '{}'::jsonb),
    COALESCE(NULLIF(TRIM(p_event_key), ''), 'broadcast_segment_sent'),
    p_is_active, auth.uid()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_broadcast_from_template(
  p_template_id UUID,
  p_scheduled_at TIMESTAMPTZ DEFAULT NULL,
  p_name_suffix TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tpl communication_broadcast_templates%ROWTYPE;
  v_name TEXT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT * INTO v_tpl FROM communication_broadcast_templates
  WHERE id = p_template_id AND is_active = TRUE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'template not found';
  END IF;

  v_name := v_tpl.name || COALESCE(' ' || NULLIF(TRIM(p_name_suffix), ''), '');

  RETURN create_communication_broadcast(
    v_name,
    v_tpl.title,
    v_tpl.body,
    v_tpl.segment_type,
    v_tpl.segment_value,
    v_tpl.event_key,
    'system',
    'medium',
    p_scheduled_at
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.escalate_stale_sla_alerts(p_hours INTEGER DEFAULT 48)
RETURNS SETOF public.communication_sla_alerts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row communication_sla_alerts%ROWTYPE;
  v_cutoff TIMESTAMPTZ := NOW() - (GREATEST(p_hours, 1) || ' hours')::INTERVAL;
BEGIN
  FOR v_row IN
    SELECT * FROM communication_sla_alerts
    WHERE status = 'open'
      AND escalation_level < 2
      AND created_at < v_cutoff
      AND (escalated_at IS NULL OR escalated_at < v_cutoff)
    FOR UPDATE SKIP LOCKED
  LOOP
    UPDATE communication_sla_alerts
    SET
      escalation_level = escalation_level + 1,
      escalated_at = NOW()
    WHERE id = v_row.id
    RETURNING * INTO v_row;

    RETURN NEXT v_row;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_communication_trends(p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - (GREATEST(p_days, 1) || ' days')::INTERVAL;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'days', GREATEST(p_days, 1),
    'period_start', v_since,
    'period_end', NOW(),
    'daily_events', COALESCE((
      SELECT jsonb_agg(row_to_json(t) ORDER BY t.day)
      FROM (
        SELECT
          date_trunc('day', created_at)::DATE AS day,
          COUNT(*)::INTEGER AS total
        FROM communication_events
        WHERE created_at >= v_since
        GROUP BY 1
      ) t
    ), '[]'::jsonb),
    'daily_deliveries', COALESCE((
      SELECT jsonb_agg(row_to_json(t) ORDER BY t.day)
      FROM (
        SELECT
          date_trunc('day', created_at)::DATE AS day,
          COUNT(*)::INTEGER AS total,
          COUNT(*) FILTER (WHERE status = 'delivered')::INTEGER AS delivered,
          COUNT(*) FILTER (WHERE status = 'failed')::INTEGER AS failed
        FROM communication_delivery_log
        WHERE created_at >= v_since
        GROUP BY 1
      ) t
    ), '[]'::jsonb),
    'daily_engagement', COALESCE((
      SELECT jsonb_agg(row_to_json(t) ORDER BY t.day)
      FROM (
        SELECT
          date_trunc('day', created_at)::DATE AS day,
          COUNT(*)::INTEGER AS total,
          COUNT(*) FILTER (WHERE action = 'opened')::INTEGER AS opened,
          COUNT(*) FILTER (WHERE action = 'clicked')::INTEGER AS clicked
        FROM communication_engagement
        WHERE created_at >= v_since
        GROUP BY 1
      ) t
    ), '[]'::jsonb),
    'totals', jsonb_build_object(
      'events', (SELECT COUNT(*)::INTEGER FROM communication_events WHERE created_at >= v_since),
      'deliveries', (SELECT COUNT(*)::INTEGER FROM communication_delivery_log WHERE created_at >= v_since),
      'engagement', (SELECT COUNT(*)::INTEGER FROM communication_engagement WHERE created_at >= v_since),
      'broadcast_templates', (
        SELECT COUNT(*)::INTEGER FROM communication_broadcast_templates WHERE is_active = TRUE
      ),
      'sla_escalations_30d', (
        SELECT COUNT(*)::INTEGER FROM communication_sla_alerts
        WHERE escalation_level > 0 AND escalated_at >= v_since
      )
    )
  );
END;
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
    'sla_webhooks_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_webhooks WHERE is_active = TRUE
    ),
    'broadcast_templates_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_broadcast_templates WHERE is_active = TRUE
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

GRANT EXECUTE ON FUNCTION public.upsert_broadcast_template(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_broadcast_from_template(UUID, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_communication_trends(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.escalate_stale_sla_alerts(INTEGER) TO service_role;

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
      SELECT id, channel, alert_type, metric_value, threshold_value, status, message,
        escalation_level, escalated_at, created_at, acknowledged_at
      FROM communication_sla_alerts
      ORDER BY created_at DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  ), '[]'::jsonb);
END;
$$;
