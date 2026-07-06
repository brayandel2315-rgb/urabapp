-- Ciclo 8 — plantillas por evento, cola de reintentos, digest diario

ALTER TABLE public.communication_preferences
  ADD COLUMN IF NOT EXISTS daily_digest_enabled BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.communication_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL,
  body_template TEXT,
  channels_override JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_templates_active
  ON public.communication_templates (event_key) WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS public.communication_delivery_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.communication_events(id) ON DELETE SET NULL,
  event_key TEXT NOT NULL,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL
    CHECK (channel IN ('push', 'email', 'sms', 'whatsapp', 'webhook')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  next_retry_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_delivery_queue_pending
  ON public.communication_delivery_queue (next_retry_at)
  WHERE status = 'pending';

ALTER TABLE public.communication_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_delivery_queue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_templates_admin ON public.communication_templates;
CREATE POLICY comm_templates_admin ON public.communication_templates
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

DROP POLICY IF EXISTS comm_templates_read ON public.communication_templates;
CREATE POLICY comm_templates_read ON public.communication_templates
  FOR SELECT TO authenticated
  USING (is_active = TRUE);

DROP POLICY IF EXISTS comm_delivery_queue_admin ON public.communication_delivery_queue;
CREATE POLICY comm_delivery_queue_admin ON public.communication_delivery_queue
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

-- Plantilla activa por event_key (público para clientes autenticados)
CREATE OR REPLACE FUNCTION public.get_communication_template(p_event_key TEXT)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(t)
  FROM communication_templates t
  WHERE t.event_key = p_event_key AND t.is_active = TRUE
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_communication_template(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_communication_template(
  p_event_key TEXT,
  p_title_template TEXT,
  p_body_template TEXT DEFAULT NULL,
  p_channels_override JSONB DEFAULT NULL,
  p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) INTO v_is_admin;
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  INSERT INTO communication_templates (
    event_key, title_template, body_template, channels_override, is_active, updated_by, updated_at
  ) VALUES (
    p_event_key, p_title_template, p_body_template, p_channels_override, p_is_active, auth.uid(), NOW()
  )
  ON CONFLICT (event_key) DO UPDATE SET
    title_template = EXCLUDED.title_template,
    body_template = EXCLUDED.body_template,
    channels_override = EXCLUDED.channels_override,
    is_active = EXCLUDED.is_active,
    updated_by = auth.uid(),
    updated_at = NOW()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_communication_template(TEXT, TEXT, TEXT, JSONB, BOOLEAN) TO authenticated;

CREATE OR REPLACE FUNCTION public.enqueue_communication_retry(
  p_event_key TEXT,
  p_recipient_id UUID,
  p_channel TEXT,
  p_payload JSONB DEFAULT '{}'::jsonb,
  p_event_id UUID DEFAULT NULL,
  p_error TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_delay INTERVAL;
BEGIN
  IF p_recipient_id IS NULL OR p_channel IS NULL THEN
    RETURN NULL;
  END IF;

  v_delay := INTERVAL '2 minutes';

  INSERT INTO communication_delivery_queue (
    event_id, event_key, recipient_id, channel, payload, next_retry_at, last_error
  ) VALUES (
    p_event_id, p_event_key, p_recipient_id, p_channel, p_payload, NOW() + v_delay, p_error
  )
  RETURNING id INTO v_id;

  IF p_event_id IS NOT NULL THEN
    UPDATE communication_events
    SET retry_count = retry_count + 1,
        audit_trail = audit_trail || jsonb_build_array(jsonb_build_object(
          'at', NOW(),
          'action', 'retry_enqueued',
          'channel', p_channel,
          'queue_id', v_id
        ))
    WHERE id = p_event_id;
  END IF;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enqueue_communication_retry(TEXT, UUID, TEXT, JSONB, UUID, TEXT) TO authenticated;

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
    ORDER BY next_retry_at
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
END;
$$;

-- Solo service role / edge functions
REVOKE ALL ON FUNCTION public.claim_communication_retries(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_communication_retries(INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.finish_communication_retry(
  p_queue_id UUID,
  p_success BOOLEAN,
  p_error TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row communication_delivery_queue%ROWTYPE;
  v_backoff INTERVAL;
BEGIN
  SELECT * INTO v_row FROM communication_delivery_queue WHERE id = p_queue_id;
  IF NOT FOUND THEN RETURN; END IF;

  IF p_success THEN
    UPDATE communication_delivery_queue
    SET status = 'completed', last_error = NULL, updated_at = NOW()
    WHERE id = p_queue_id;
    RETURN;
  END IF;

  IF v_row.attempt_count >= v_row.max_attempts THEN
    UPDATE communication_delivery_queue
    SET status = 'failed', last_error = p_error, updated_at = NOW()
    WHERE id = p_queue_id;
    RETURN;
  END IF;

  v_backoff := (POWER(2, v_row.attempt_count) * INTERVAL '1 minute');

  UPDATE communication_delivery_queue
  SET status = 'pending',
      last_error = p_error,
      next_retry_at = NOW() + v_backoff,
      updated_at = NOW()
  WHERE id = p_queue_id;
END;
$$;

REVOKE ALL ON FUNCTION public.finish_communication_retry(UUID, BOOLEAN, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.finish_communication_retry(UUID, BOOLEAN, TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.get_daily_digest_recipients()
RETURNS TABLE (user_id UUID, email TEXT, unread_count INTEGER, items JSONB)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email,
    COUNT(n.id)::INTEGER AS unread_count,
    COALESCE((
      SELECT jsonb_agg(row_to_json(s))
      FROM (
        SELECT n2.title, n2.body, n2.category, n2.created_at
        FROM notifications n2
        WHERE n2.user_id = u.id
          AND n2.is_read = FALSE
          AND n2.is_archived = FALSE
          AND n2.created_at >= NOW() - INTERVAL '24 hours'
        ORDER BY n2.created_at DESC
        LIMIT 8
      ) s
    ), '[]'::jsonb) AS items
  FROM users u
  INNER JOIN communication_preferences cp ON cp.user_id = u.id AND cp.daily_digest_enabled = TRUE
  LEFT JOIN notifications n ON n.user_id = u.id
    AND n.is_read = FALSE
    AND n.is_archived = FALSE
    AND n.created_at >= NOW() - INTERVAL '24 hours'
  WHERE u.email IS NOT NULL AND u.email <> ''
  GROUP BY u.id, u.email
  HAVING COUNT(n.id) > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.get_daily_digest_recipients() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_daily_digest_recipients() TO service_role;

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
