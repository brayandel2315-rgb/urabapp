-- Ciclo 11 — broadcast por segmentos, SLA por canal, preview de plantillas

CREATE TABLE IF NOT EXISTS public.communication_channel_sla (
  channel TEXT PRIMARY KEY,
  max_latency_ms INTEGER NOT NULL CHECK (max_latency_ms > 0),
  min_success_rate NUMERIC(5,2) NOT NULL DEFAULT 90.00
    CHECK (min_success_rate >= 0 AND min_success_rate <= 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.communication_channel_sla (channel, max_latency_ms, min_success_rate) VALUES
  ('push', 3000, 92.00),
  ('email', 10000, 90.00),
  ('sms', 8000, 88.00),
  ('whatsapp', 5000, 90.00),
  ('in_app', 500, 99.00),
  ('webhook', 15000, 85.00),
  ('banner', 1000, 95.00),
  ('snackbar', 500, 95.00)
ON CONFLICT (channel) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.communication_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  event_key TEXT NOT NULL DEFAULT 'system_announcement',
  category TEXT NOT NULL DEFAULT 'system',
  priority TEXT NOT NULL DEFAULT 'medium',
  segment_type TEXT NOT NULL
    CHECK (segment_type IN ('all_active', 'role', 'marketing_opt_in', 'digest_subscribers', 'municipio')),
  segment_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'failed')),
  recipients_total INTEGER NOT NULL DEFAULT 0,
  recipients_sent INTEGER NOT NULL DEFAULT 0,
  recipients_failed INTEGER NOT NULL DEFAULT 0,
  batch_offset INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_broadcasts_pending
  ON public.communication_broadcasts (created_at)
  WHERE status IN ('pending', 'processing');

ALTER TABLE public.communication_channel_sla ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_broadcasts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_channel_sla_admin ON public.communication_channel_sla;
CREATE POLICY comm_channel_sla_admin ON public.communication_channel_sla
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

DROP POLICY IF EXISTS comm_broadcasts_admin ON public.communication_broadcasts;
CREATE POLICY comm_broadcasts_admin ON public.communication_broadcasts
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.count_broadcast_recipients(
  p_segment_type TEXT,
  p_segment_value JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  CASE p_segment_type
    WHEN 'all_active' THEN
      SELECT COUNT(*)::INTEGER INTO v_count FROM users WHERE is_active = TRUE;
    WHEN 'role' THEN
      SELECT COUNT(*)::INTEGER INTO v_count
      FROM users WHERE is_active = TRUE AND role = COALESCE(p_segment_value->>'role', 'CLIENT');
    WHEN 'marketing_opt_in' THEN
      SELECT COUNT(*)::INTEGER INTO v_count
      FROM users u
      INNER JOIN communication_preferences cp ON cp.user_id = u.id
      WHERE u.is_active = TRUE AND cp.marketing_enabled = TRUE;
    WHEN 'digest_subscribers' THEN
      SELECT COUNT(*)::INTEGER INTO v_count
      FROM users u
      INNER JOIN communication_preferences cp ON cp.user_id = u.id
      WHERE u.is_active = TRUE AND cp.daily_digest_enabled = TRUE;
    WHEN 'municipio' THEN
      SELECT COUNT(*)::INTEGER INTO v_count
      FROM users
      WHERE is_active = TRUE
        AND municipio = COALESCE(p_segment_value->>'municipio', 'Apartadó');
    ELSE
      v_count := 0;
  END CASE;

  RETURN COALESCE(v_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_broadcast_recipient_batch(
  p_segment_type TEXT,
  p_segment_value JSONB,
  p_offset INTEGER,
  p_limit INTEGER
)
RETURNS TABLE(user_id UUID)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  CASE p_segment_type
    WHEN 'all_active' THEN
      RETURN QUERY
      SELECT u.id FROM users u
      WHERE u.is_active = TRUE
      ORDER BY u.id
      OFFSET GREATEST(p_offset, 0) LIMIT GREATEST(p_limit, 1);
    WHEN 'role' THEN
      RETURN QUERY
      SELECT u.id FROM users u
      WHERE u.is_active = TRUE AND u.role = COALESCE(p_segment_value->>'role', 'CLIENT')
      ORDER BY u.id
      OFFSET GREATEST(p_offset, 0) LIMIT GREATEST(p_limit, 1);
    WHEN 'marketing_opt_in' THEN
      RETURN QUERY
      SELECT u.id FROM users u
      INNER JOIN communication_preferences cp ON cp.user_id = u.id
      WHERE u.is_active = TRUE AND cp.marketing_enabled = TRUE
      ORDER BY u.id
      OFFSET GREATEST(p_offset, 0) LIMIT GREATEST(p_limit, 1);
    WHEN 'digest_subscribers' THEN
      RETURN QUERY
      SELECT u.id FROM users u
      INNER JOIN communication_preferences cp ON cp.user_id = u.id
      WHERE u.is_active = TRUE AND cp.daily_digest_enabled = TRUE
      ORDER BY u.id
      OFFSET GREATEST(p_offset, 0) LIMIT GREATEST(p_limit, 1);
    WHEN 'municipio' THEN
      RETURN QUERY
      SELECT u.id FROM users u
      WHERE u.is_active = TRUE
        AND u.municipio = COALESCE(p_segment_value->>'municipio', 'Apartadó')
      ORDER BY u.id
      OFFSET GREATEST(p_offset, 0) LIMIT GREATEST(p_limit, 1);
    ELSE
      RETURN;
  END CASE;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_communication_broadcast(
  p_name TEXT,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_segment_type TEXT DEFAULT 'all_active',
  p_segment_value JSONB DEFAULT '{}'::jsonb,
  p_event_key TEXT DEFAULT 'system_announcement',
  p_category TEXT DEFAULT 'system',
  p_priority TEXT DEFAULT 'medium'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_total INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  v_total := count_broadcast_recipients(p_segment_type, p_segment_value);

  INSERT INTO communication_broadcasts (
    name, title, body, event_key, category, priority,
    segment_type, segment_value, recipients_total, created_by
  ) VALUES (
    TRIM(p_name), TRIM(p_title), NULLIF(TRIM(p_body), ''),
    COALESCE(NULLIF(TRIM(p_event_key), ''), 'system_announcement'),
    COALESCE(NULLIF(TRIM(p_category), ''), 'system'),
    COALESCE(NULLIF(TRIM(p_priority), ''), 'medium'),
    p_segment_type, COALESCE(p_segment_value, '{}'::jsonb),
    v_total, auth.uid()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_communication_broadcast(p_id UUID)
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

  UPDATE communication_broadcasts
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_id AND status IN ('pending', 'processing');
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_pending_broadcast()
RETURNS SETOF public.communication_broadcasts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row communication_broadcasts%ROWTYPE;
BEGIN
  SELECT * INTO v_row
  FROM communication_broadcasts
  WHERE status IN ('pending', 'processing')
  ORDER BY created_at
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  UPDATE communication_broadcasts
  SET
    status = 'processing',
    started_at = COALESCE(started_at, NOW()),
    updated_at = NOW()
  WHERE id = v_row.id
  RETURNING * INTO v_row;

  RETURN NEXT v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.advance_broadcast_batch(
  p_id UUID,
  p_sent INTEGER,
  p_failed INTEGER,
  p_next_offset INTEGER,
  p_done BOOLEAN,
  p_error TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE communication_broadcasts
  SET
    recipients_sent = recipients_sent + GREATEST(p_sent, 0),
    recipients_failed = recipients_failed + GREATEST(p_failed, 0),
    batch_offset = GREATEST(p_next_offset, 0),
    status = CASE
      WHEN p_done THEN 'completed'
      WHEN p_error IS NOT NULL AND p_sent = 0 AND p_failed = 0 THEN 'failed'
      ELSE 'processing'
    END,
    last_error = COALESCE(p_error, last_error),
    completed_at = CASE WHEN p_done THEN NOW() ELSE completed_at END,
    updated_at = NOW()
  WHERE id = p_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.preview_communication_template(
  p_title_template TEXT,
  p_body_template TEXT DEFAULT NULL,
  p_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_title TEXT := COALESCE(p_title_template, '');
  v_body TEXT := COALESCE(p_body_template, '');
  v_key TEXT;
  v_val TEXT;
BEGIN
  FOR v_key, v_val IN SELECT * FROM jsonb_each_text(COALESCE(p_payload, '{}'::jsonb))
  LOOP
    v_title := replace(v_title, '{{' || v_key || '}}', v_val);
    v_body := replace(v_body, '{{' || v_key || '}}', v_val);
  END LOOP;

  RETURN jsonb_build_object('title', v_title, 'body', v_body);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_channel_sla(p_days INTEGER DEFAULT 7)
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

  RETURN COALESCE((
    SELECT jsonb_agg(row_to_json(t) ORDER BY t.channel)
    FROM (
      SELECT
        s.channel,
        s.max_latency_ms,
        s.min_success_rate,
        s.is_active AS sla_active,
        COALESCE(d.total, 0) AS total,
        COALESCE(d.delivered, 0) AS delivered,
        COALESCE(d.failed, 0) AS failed,
        COALESCE(d.success_rate, 0) AS success_rate,
        COALESCE(d.avg_latency_ms, 0) AS avg_latency_ms,
        COALESCE(d.p95_latency_ms, 0) AS p95_latency_ms,
        CASE
          WHEN COALESCE(d.p95_latency_ms, 0) = 0 THEN TRUE
          ELSE COALESCE(d.p95_latency_ms, 0) <= s.max_latency_ms
        END AS sla_latency_met,
        CASE
          WHEN COALESCE(d.total, 0) = 0 THEN TRUE
          ELSE COALESCE(d.success_rate, 0) >= s.min_success_rate
        END AS sla_success_met,
        CASE
          WHEN COALESCE(d.total, 0) = 0 THEN TRUE
          ELSE (
            (COALESCE(d.p95_latency_ms, 0) = 0 OR COALESCE(d.p95_latency_ms, 0) <= s.max_latency_ms)
            AND COALESCE(d.success_rate, 0) >= s.min_success_rate
          )
        END AS sla_met
      FROM communication_channel_sla s
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::INTEGER AS total,
          COUNT(*) FILTER (WHERE l.status = 'delivered')::INTEGER AS delivered,
          COUNT(*) FILTER (WHERE l.status = 'failed')::INTEGER AS failed,
          ROUND(
            100.0 * COUNT(*) FILTER (WHERE l.status = 'delivered')
            / NULLIF(COUNT(*) FILTER (WHERE l.status IN ('delivered', 'failed')), 0),
            1
          ) AS success_rate,
          ROUND(AVG(l.latency_ms) FILTER (WHERE l.status = 'delivered' AND l.latency_ms IS NOT NULL))::INTEGER AS avg_latency_ms,
          ROUND(
            PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY l.latency_ms)
            FILTER (WHERE l.status = 'delivered' AND l.latency_ms IS NOT NULL)
          )::INTEGER AS p95_latency_ms
        FROM communication_delivery_log l
        WHERE l.channel = s.channel AND l.created_at >= v_since
      ) d ON TRUE
    ) t
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_communication_channel_sla(
  p_channel TEXT,
  p_max_latency_ms INTEGER,
  p_min_success_rate NUMERIC DEFAULT 90.00,
  p_is_active BOOLEAN DEFAULT TRUE
)
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

  INSERT INTO communication_channel_sla (channel, max_latency_ms, min_success_rate, is_active, updated_at)
  VALUES (p_channel, p_max_latency_ms, p_min_success_rate, p_is_active, NOW())
  ON CONFLICT (channel) DO UPDATE SET
    max_latency_ms = EXCLUDED.max_latency_ms,
    min_success_rate = EXCLUDED.min_success_rate,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();
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

GRANT EXECUTE ON FUNCTION public.count_broadcast_recipients(TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_communication_broadcast(TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_communication_broadcast(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.preview_communication_template(TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_channel_sla(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_communication_channel_sla(TEXT, INTEGER, NUMERIC, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_broadcast_recipient_batch(TEXT, JSONB, INTEGER, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_pending_broadcast() TO service_role;
GRANT EXECUTE ON FUNCTION public.advance_broadcast_batch(UUID, INTEGER, INTEGER, INTEGER, BOOLEAN, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_broadcast_recipients(TEXT, JSONB) TO service_role;
