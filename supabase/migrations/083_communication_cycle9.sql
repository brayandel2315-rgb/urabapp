-- Ciclo 9 — métricas de entrega, rate limiting, A/B plantillas, inbox unificado

CREATE TABLE IF NOT EXISTS public.communication_delivery_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.communication_events(id) ON DELETE SET NULL,
  event_key TEXT NOT NULL,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'delivered'
    CHECK (status IN ('delivered', 'failed', 'skipped', 'rate_limited')),
  variant_key TEXT,
  error TEXT,
  latency_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comm_delivery_log_recipient
  ON public.communication_delivery_log (recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comm_delivery_log_channel
  ON public.communication_delivery_log (channel, status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.communication_template_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL,
  variant_key TEXT NOT NULL,
  title_template TEXT NOT NULL,
  body_template TEXT,
  weight INTEGER NOT NULL DEFAULT 50 CHECK (weight >= 0 AND weight <= 100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (event_key, variant_key)
);

CREATE INDEX IF NOT EXISTS idx_comm_template_variants_event
  ON public.communication_template_variants (event_key) WHERE is_active = TRUE;

ALTER TABLE public.communication_delivery_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_template_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_delivery_log_own ON public.communication_delivery_log;
CREATE POLICY comm_delivery_log_own ON public.communication_delivery_log
  FOR SELECT TO authenticated
  USING (
    recipient_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

DROP POLICY IF EXISTS comm_template_variants_admin ON public.communication_template_variants;
CREATE POLICY comm_template_variants_admin ON public.communication_template_variants
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.log_communication_delivery(
  p_event_key TEXT,
  p_recipient_id UUID,
  p_channel TEXT,
  p_status TEXT,
  p_event_id UUID DEFAULT NULL,
  p_variant_key TEXT DEFAULT NULL,
  p_error TEXT DEFAULT NULL,
  p_latency_ms INTEGER DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO communication_delivery_log (
    event_id, event_key, recipient_id, channel, status, variant_key, error, latency_ms
  ) VALUES (
    p_event_id, p_event_key, p_recipient_id, p_channel, p_status, p_variant_key, p_error, p_latency_ms
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_communication_delivery(TEXT, UUID, TEXT, TEXT, UUID, TEXT, TEXT, INTEGER) TO authenticated;

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
BEGIN
  IF p_recipient_id IS NULL THEN
    RETURN TRUE;
  END IF;

  v_max := CASE p_channel
    WHEN 'push' THEN 40
    WHEN 'email' THEN 12
    WHEN 'sms' THEN 6
    WHEN 'whatsapp' THEN 15
    ELSE 100
  END;

  SELECT COUNT(*)::INTEGER INTO v_count
  FROM communication_delivery_log
  WHERE recipient_id = p_recipient_id
    AND channel = p_channel
    AND status IN ('delivered', 'failed')
    AND created_at >= NOW() - INTERVAL '1 hour';

  RETURN v_count < v_max;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_communication_rate_limit(UUID, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.resolve_communication_template(
  p_event_key TEXT,
  p_recipient_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_variants JSONB;
  v_total INTEGER := 0;
  v_bucket INTEGER;
  v_cumulative INTEGER := 0;
  v_row RECORD;
  v_base RECORD;
BEGIN
  SELECT COALESCE(jsonb_agg(row_to_json(v) ORDER BY v.variant_key), '[]'::jsonb)
  INTO v_variants
  FROM communication_template_variants v
  WHERE v.event_key = p_event_key AND v.is_active = TRUE;

  IF jsonb_array_length(v_variants) > 0 THEN
    SELECT SUM((elem->>'weight')::INTEGER) INTO v_total
    FROM jsonb_array_elements(v_variants) elem;

    IF v_total > 0 AND p_recipient_id IS NOT NULL THEN
      v_bucket := abs(hashtext(p_recipient_id::text || ':' || p_event_key)) % v_total;
    ELSE
      v_bucket := floor(random() * v_total)::INTEGER;
    END IF;

    FOR v_row IN
      SELECT * FROM communication_template_variants
      WHERE event_key = p_event_key AND is_active = TRUE
      ORDER BY variant_key
    LOOP
      v_cumulative := v_cumulative + v_row.weight;
      IF v_bucket < v_cumulative THEN
        RETURN jsonb_build_object(
          'event_key', p_event_key,
          'title_template', v_row.title_template,
          'body_template', v_row.body_template,
          'variant_key', v_row.variant_key,
          'is_ab', TRUE
        );
      END IF;
    END LOOP;
  END IF;

  SELECT * INTO v_base
  FROM communication_templates
  WHERE event_key = p_event_key AND is_active = TRUE
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object(
      'event_key', v_base.event_key,
      'title_template', v_base.title_template,
      'body_template', v_base.body_template,
      'channels_override', v_base.channels_override,
      'variant_key', NULL,
      'is_ab', FALSE
    );
  END IF;

  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.resolve_communication_template(TEXT, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_unified_inbox(
  p_category TEXT DEFAULT NULL,
  p_priority TEXT DEFAULT NULL,
  p_filter TEXT DEFAULT 'all',
  p_search TEXT DEFAULT NULL,
  p_since TIMESTAMPTZ DEFAULT NULL,
  p_sort TEXT DEFAULT 'newest',
  p_limit INTEGER DEFAULT 50
)
RETURNS SETOF public.notifications
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT n.*
  FROM notifications n
  WHERE n.user_id = auth.uid()
    AND (p_category IS NULL OR p_category = 'all' OR n.category = p_category)
    AND (p_priority IS NULL OR p_priority = 'all' OR n.priority = p_priority)
    AND (
      p_filter = 'all' AND n.is_archived = FALSE
      OR p_filter = 'unread' AND n.is_read = FALSE AND n.is_archived = FALSE
      OR p_filter = 'favorite' AND n.is_favorite = TRUE AND n.is_archived = FALSE
      OR p_filter = 'archived' AND n.is_archived = TRUE
      OR p_filter = 'muted' AND n.is_muted = TRUE AND n.is_archived = FALSE
    )
    AND (p_since IS NULL OR n.created_at >= p_since)
    AND (
      p_search IS NULL OR p_search = ''
      OR n.title ILIKE '%' || p_search || '%'
      OR n.body ILIKE '%' || p_search || '%'
    )
  ORDER BY
    CASE WHEN p_sort = 'priority' THEN
      CASE n.priority
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
        ELSE 5
      END
    END NULLS LAST,
    CASE WHEN p_sort = 'oldest' THEN n.created_at END ASC NULLS LAST,
    CASE WHEN p_sort IN ('newest', 'priority') THEN n.created_at END DESC NULLS LAST
  LIMIT LEAST(p_limit, 100);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_unified_inbox(TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TEXT, INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_delivery_metrics()
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
    'by_channel', COALESCE((
      SELECT jsonb_object_agg(channel, stats)
      FROM (
        SELECT channel, jsonb_build_object(
          'delivered', COUNT(*) FILTER (WHERE status = 'delivered'),
          'failed', COUNT(*) FILTER (WHERE status = 'failed'),
          'rate_limited', COUNT(*) FILTER (WHERE status = 'rate_limited'),
          'skipped', COUNT(*) FILTER (WHERE status = 'skipped')
        ) AS stats
        FROM communication_delivery_log
        WHERE created_at >= v_since
        GROUP BY channel
      ) s
    ), '{}'::jsonb),
    'ab_variants', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT variant_key, event_key,
          COUNT(*) FILTER (WHERE status = 'delivered')::INTEGER AS delivered,
          COUNT(*)::INTEGER AS total
        FROM communication_delivery_log
        WHERE created_at >= v_since AND variant_key IS NOT NULL
        GROUP BY variant_key, event_key
        ORDER BY total DESC
        LIMIT 20
      ) t
    ), '[]'::jsonb),
    'delivery_rate', COALESCE((
      SELECT ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'delivered')
        / NULLIF(COUNT(*) FILTER (WHERE status IN ('delivered', 'failed')), 0),
        1
      )
      FROM communication_delivery_log
      WHERE created_at >= v_since
    ), 0)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_delivery_metrics() TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_template_variant(
  p_event_key TEXT,
  p_variant_key TEXT,
  p_title_template TEXT,
  p_body_template TEXT DEFAULT NULL,
  p_weight INTEGER DEFAULT 50,
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

  INSERT INTO communication_template_variants (
    event_key, variant_key, title_template, body_template, weight, is_active, updated_at
  ) VALUES (
    p_event_key, p_variant_key, p_title_template, p_body_template, p_weight, p_is_active, NOW()
  )
  ON CONFLICT (event_key, variant_key) DO UPDATE SET
    title_template = EXCLUDED.title_template,
    body_template = EXCLUDED.body_template,
    weight = EXCLUDED.weight,
    is_active = EXCLUDED.is_active,
    updated_at = NOW()
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_template_variant(TEXT, TEXT, TEXT, TEXT, INTEGER, BOOLEAN) TO authenticated;

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
