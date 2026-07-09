-- Ciclo 13 — webhooks SLA, broadcasts programados, informe semanal

DROP FUNCTION IF EXISTS public.create_communication_broadcast(TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT);

ALTER TABLE public.communication_broadcasts
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_comm_broadcasts_scheduled
  ON public.communication_broadcasts (scheduled_at)
  WHERE status = 'pending' AND scheduled_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.communication_sla_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.communication_sla_webhooks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_sla_webhooks_admin ON public.communication_sla_webhooks;
CREATE POLICY comm_sla_webhooks_admin ON public.communication_sla_webhooks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.create_communication_broadcast(
  p_name TEXT,
  p_title TEXT,
  p_body TEXT DEFAULT NULL,
  p_segment_type TEXT DEFAULT 'all_active',
  p_segment_value JSONB DEFAULT '{}'::jsonb,
  p_event_key TEXT DEFAULT 'system_announcement',
  p_category TEXT DEFAULT 'system',
  p_priority TEXT DEFAULT 'medium',
  p_scheduled_at TIMESTAMPTZ DEFAULT NULL
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
    segment_type, segment_value, recipients_total, created_by, scheduled_at
  ) VALUES (
    TRIM(p_name), TRIM(p_title), NULLIF(TRIM(p_body), ''),
    COALESCE(NULLIF(TRIM(p_event_key), ''), 'system_announcement'),
    COALESCE(NULLIF(TRIM(p_category), ''), 'system'),
    COALESCE(NULLIF(TRIM(p_priority), ''), 'medium'),
    p_segment_type, COALESCE(p_segment_value, '{}'::jsonb),
    v_total, auth.uid(), p_scheduled_at
  )
  RETURNING id INTO v_id;

  RETURN v_id;
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
    AND (scheduled_at IS NULL OR scheduled_at <= NOW())
  ORDER BY COALESCE(scheduled_at, created_at)
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
        b.id, b.name, b.title, b.body, b.event_key, b.segment_type, b.segment_value,
        b.status, b.recipients_total, b.recipients_sent, b.recipients_failed,
        b.parent_broadcast_id, b.scheduled_at, b.created_at, b.completed_at, b.last_error,
        (SELECT COUNT(*)::INTEGER FROM communication_broadcasts c WHERE c.parent_broadcast_id = b.id) AS resend_count
      FROM communication_broadcasts b
      ORDER BY b.created_at DESC
      LIMIT GREATEST(p_limit, 1)
    ) t
  ), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_communication_weekly_report()
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
    'period_start', v_since,
    'period_end', NOW(),
    'events_total', (SELECT COUNT(*)::INTEGER FROM communication_events WHERE created_at >= v_since),
    'notifications_total', (SELECT COUNT(*)::INTEGER FROM notifications WHERE created_at >= v_since),
    'deliveries_total', (SELECT COUNT(*)::INTEGER FROM communication_delivery_log WHERE created_at >= v_since),
    'delivery_success_rate', COALESCE((
      SELECT ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'delivered')
        / NULLIF(COUNT(*) FILTER (WHERE status IN ('delivered', 'failed')), 0),
        1
      )
      FROM communication_delivery_log WHERE created_at >= v_since
    ), 0),
    'engagement_total', (SELECT COUNT(*)::INTEGER FROM communication_engagement WHERE created_at >= v_since),
    'opened_total', (
      SELECT COUNT(*)::INTEGER FROM communication_engagement
      WHERE created_at >= v_since AND action = 'opened'
    ),
    'clicked_total', (
      SELECT COUNT(*)::INTEGER FROM communication_engagement
      WHERE created_at >= v_since AND action = 'clicked'
    ),
    'broadcasts_completed', (
      SELECT COUNT(*)::INTEGER FROM communication_broadcasts
      WHERE status = 'completed' AND completed_at >= v_since
    ),
    'broadcasts_scheduled_pending', (
      SELECT COUNT(*)::INTEGER FROM communication_broadcasts
      WHERE status = 'pending' AND scheduled_at IS NOT NULL AND scheduled_at > NOW()
    ),
    'sla_alerts_open', (
      SELECT COUNT(*)::INTEGER FROM communication_sla_alerts WHERE status = 'open'
    ),
    'retries_pending', (
      SELECT COUNT(*)::INTEGER FROM communication_delivery_queue WHERE status = 'pending'
    ),
    'by_channel', COALESCE((
      SELECT jsonb_object_agg(channel, jsonb_build_object(
        'total', total,
        'delivered', delivered,
        'failed', failed
      ))
      FROM (
        SELECT
          channel,
          COUNT(*)::INTEGER AS total,
          COUNT(*) FILTER (WHERE status = 'delivered')::INTEGER AS delivered,
          COUNT(*) FILTER (WHERE status = 'failed')::INTEGER AS failed
        FROM communication_delivery_log
        WHERE created_at >= v_since
        GROUP BY channel
      ) s
    ), '{}'::jsonb),
    'by_category', COALESCE((
      SELECT jsonb_object_agg(category, cnt)
      FROM (
        SELECT category, COUNT(*)::INTEGER AS cnt
        FROM communication_events
        WHERE created_at >= v_since
        GROUP BY category
      ) s
    ), '{}'::jsonb),
    'top_events', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM communication_events
        WHERE created_at >= v_since
        GROUP BY event_key
        ORDER BY cnt DESC
        LIMIT 8
      ) t
    ), '[]'::jsonb)
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

GRANT EXECUTE ON FUNCTION public.create_communication_broadcast(TEXT, TEXT, TEXT, TEXT, JSONB, TEXT, TEXT, TEXT, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_communication_weekly_report() TO authenticated;
