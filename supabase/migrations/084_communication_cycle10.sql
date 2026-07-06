-- Ciclo 10 — límites configurables, export métricas, comunicaciones programadas

CREATE TABLE IF NOT EXISTS public.communication_rate_limits (
  channel TEXT PRIMARY KEY,
  max_per_hour INTEGER NOT NULL CHECK (max_per_hour > 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.communication_rate_limits (channel, max_per_hour) VALUES
  ('push', 40),
  ('email', 12),
  ('sms', 6),
  ('whatsapp', 15)
ON CONFLICT (channel) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.communication_scheduled (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL DEFAULT 'system_announcement',
  recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  category TEXT NOT NULL DEFAULT 'system',
  priority TEXT NOT NULL DEFAULT 'medium',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'sent', 'cancelled', 'failed')),
  last_error TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_scheduled_pending
  ON public.communication_scheduled (scheduled_at)
  WHERE status = 'pending';

ALTER TABLE public.communication_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_scheduled ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_rate_limits_admin ON public.communication_rate_limits;
CREATE POLICY comm_rate_limits_admin ON public.communication_rate_limits
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

DROP POLICY IF EXISTS comm_scheduled_admin ON public.communication_scheduled;
CREATE POLICY comm_scheduled_admin ON public.communication_scheduled
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.check_communication_rate_limit(
  p_recipient_id UUID,
  p_channel TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max INTEGER;
  v_count INTEGER;
  v_active BOOLEAN;
BEGIN
  IF p_recipient_id IS NULL THEN
    RETURN TRUE;
  END IF;

  SELECT max_per_hour, is_active INTO v_max, v_active
  FROM communication_rate_limits
  WHERE channel = p_channel;

  IF NOT FOUND THEN
    v_max := 100;
    v_active := TRUE;
  END IF;

  IF NOT v_active THEN
    RETURN TRUE;
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_count
  FROM communication_delivery_log
  WHERE recipient_id = p_recipient_id
    AND channel = p_channel
    AND status IN ('delivered', 'failed')
    AND created_at >= NOW() - INTERVAL '1 hour';

  RETURN v_count < v_max;
END;
$$;

CREATE OR REPLACE FUNCTION public.upsert_communication_rate_limit(
  p_channel TEXT,
  p_max_per_hour INTEGER,
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

  INSERT INTO communication_rate_limits (channel, max_per_hour, is_active, updated_by, updated_at)
  VALUES (p_channel, p_max_per_hour, p_is_active, auth.uid(), NOW())
  ON CONFLICT (channel) DO UPDATE SET
    max_per_hour = EXCLUDED.max_per_hour,
    is_active = EXCLUDED.is_active,
    updated_by = auth.uid(),
    updated_at = NOW();
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_communication_rate_limit(TEXT, INTEGER, BOOLEAN) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_communication_rate_limits()
RETURNS SETOF public.communication_rate_limits
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM communication_rate_limits ORDER BY channel;
$$;

GRANT EXECUTE ON FUNCTION public.get_communication_rate_limits() TO authenticated;

CREATE OR REPLACE FUNCTION public.schedule_communication(
  p_recipient_id UUID,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_scheduled_at TIMESTAMPTZ DEFAULT NULL,
  p_event_key TEXT DEFAULT 'system_announcement',
  p_category TEXT DEFAULT 'system',
  p_priority TEXT DEFAULT 'medium',
  p_payload JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  IF p_recipient_id IS NULL OR p_title IS NULL THEN
    RAISE EXCEPTION 'recipient_id y title requeridos';
  END IF;

  INSERT INTO communication_scheduled (
    event_key, recipient_id, title, body, payload, category, priority,
    scheduled_at, created_by
  ) VALUES (
    COALESCE(p_event_key, 'system_announcement'),
    p_recipient_id,
    p_title,
    p_body,
    COALESCE(p_payload, '{}'::jsonb),
    COALESCE(p_category, 'system'),
    COALESCE(p_priority, 'medium'),
    COALESCE(p_scheduled_at, NOW()),
    auth.uid()
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.schedule_communication(UUID, TEXT, TEXT, TIMESTAMPTZ, TEXT, TEXT, TEXT, JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_scheduled_communications(p_limit INTEGER DEFAULT 20)
RETURNS SETOF public.communication_scheduled
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE communication_scheduled s
  SET status = 'processing', updated_at = NOW()
  WHERE s.id IN (
    SELECT id FROM communication_scheduled
    WHERE status = 'pending' AND scheduled_at <= NOW()
    ORDER BY scheduled_at
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_scheduled_communications(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_scheduled_communications(INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.finish_scheduled_communication(
  p_id UUID,
  p_success BOOLEAN,
  p_error TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE communication_scheduled
  SET status = CASE WHEN p_success THEN 'sent' ELSE 'failed' END,
      last_error = p_error,
      sent_at = CASE WHEN p_success THEN NOW() ELSE sent_at END,
      updated_at = NOW()
  WHERE id = p_id;
END;
$$;

REVOKE ALL ON FUNCTION public.finish_scheduled_communication(UUID, BOOLEAN, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finish_scheduled_communication(UUID, BOOLEAN, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.cancel_scheduled_communication(p_id UUID)
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

  UPDATE communication_scheduled
  SET status = 'cancelled', updated_at = NOW()
  WHERE id = p_id AND status = 'pending';
END;
$$;

GRANT EXECUTE ON FUNCTION public.cancel_scheduled_communication(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_delivery_export(p_days INTEGER DEFAULT 7)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_since TIMESTAMPTZ := NOW() - (LEAST(GREATEST(p_days, 1), 90) || ' days')::INTERVAL;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN COALESCE((
    SELECT jsonb_agg(row_to_json(t))
    FROM (
      SELECT
        created_at,
        event_key,
        channel,
        status,
        variant_key,
        latency_ms,
        recipient_id,
        LEFT(error, 200) AS error
      FROM communication_delivery_log
      WHERE created_at >= v_since
      ORDER BY created_at DESC
      LIMIT 5000
    ) t
  ), '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_delivery_export(INTEGER) TO authenticated;

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
