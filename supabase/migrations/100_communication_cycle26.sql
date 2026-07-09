-- Ciclo 26 — export CSV historial cola + métricas overview

CREATE OR REPLACE FUNCTION public.get_admin_queue_health_export(p_hours INTEGER DEFAULT 168)
RETURNS TABLE (
  captured_at TIMESTAMPTZ,
  metric_key TEXT,
  label TEXT,
  current_value INTEGER,
  threshold_value INTEGER,
  status TEXT,
  utilization_pct NUMERIC
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  v_since := NOW() - make_interval(hours => GREATEST(LEAST(p_hours, 168), 1));

  RETURN QUERY
  SELECT
    s.captured_at,
    s.metric_key,
    COALESCE(t.label, s.metric_key) AS label,
    s.current_value,
    s.threshold_value,
    s.status,
    CASE
      WHEN s.threshold_value > 0 THEN ROUND((s.current_value::NUMERIC / s.threshold_value) * 100, 1)
      ELSE 0::NUMERIC
    END AS utilization_pct
  FROM public.communication_queue_health_snapshots s
  LEFT JOIN public.communication_queue_thresholds t ON t.metric_key = s.metric_key
  WHERE s.captured_at >= v_since
  ORDER BY s.captured_at DESC, s.metric_key;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_health_export(INTEGER) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_communication_overview()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
  v_since_24h TIMESTAMPTZ := NOW() - INTERVAL '24 hours';
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'events_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_events WHERE created_at >= v_since),
    'notifications_7d', (SELECT COUNT(*)::INTEGER FROM public.notifications WHERE created_at >= v_since),
    'engagement_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since),
    'opened_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since AND event_type = 'opened'),
    'clicked_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_engagement WHERE created_at >= v_since AND event_type = 'clicked'),
    'campaigns_7d', (SELECT COUNT(*)::INTEGER FROM public.business_campaigns WHERE sent_at >= v_since AND status = 'sent'),
    'webhooks_active', (SELECT COUNT(*)::INTEGER FROM public.communication_webhooks WHERE is_active = TRUE),
    'templates_active', (SELECT COUNT(*)::INTEGER FROM public.communication_templates WHERE is_active = TRUE),
    'retries_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending'),
    'retries_critical', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'pending' AND priority >= 4),
    'digest_subscribers', (SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE daily_digest_enabled = TRUE),
    'marketing_opt_in', (SELECT COUNT(*)::INTEGER FROM public.communication_preferences WHERE marketing_enabled = TRUE),
    'finance_events_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_events WHERE created_at >= v_since AND event_key LIKE 'finance_%'),
    'consent_changes_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_consent_changes WHERE status = 'pending'),
    'consent_webhooks_active', (SELECT COUNT(*)::INTEGER FROM public.communication_consent_webhooks WHERE is_active = TRUE),
    'deliveries_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_delivery_log WHERE created_at >= v_since),
    'delivery_success_rate', COALESCE((SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'delivered') / NULLIF(COUNT(*), 0), 1) FROM public.communication_delivery_log WHERE created_at >= v_since), 0),
    'ab_variants_active', (SELECT COUNT(*)::INTEGER FROM public.communication_template_variants WHERE is_active = TRUE),
    'scheduled_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_scheduled WHERE status = 'pending'),
    'scheduled_sent_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_scheduled WHERE status = 'sent' AND sent_at >= v_since),
    'broadcasts_pending', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts WHERE status IN ('pending', 'processing') AND (scheduled_at IS NULL OR scheduled_at <= NOW())),
    'broadcasts_scheduled', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts WHERE status = 'pending' AND scheduled_at IS NOT NULL AND scheduled_at > NOW()),
    'broadcasts_completed_7d', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcasts WHERE status = 'completed' AND completed_at >= v_since),
    'sla_alerts_open', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open'),
    'sla_alerts_escalated', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open' AND escalation_level > 0),
    'queue_alerts_open', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts WHERE status = 'open' AND channel = 'queue'),
    'queue_snapshots_24h', (SELECT COUNT(*)::INTEGER FROM public.communication_queue_health_snapshots WHERE captured_at >= v_since_24h),
    'queue_breaches_24h', (SELECT COUNT(*)::INTEGER FROM public.communication_queue_health_snapshots WHERE captured_at >= v_since_24h AND status = 'breach'),
    'broadcast_templates_active', (SELECT COUNT(*)::INTEGER FROM public.communication_broadcast_templates WHERE is_active = TRUE),
    'sla_webhooks_active', (SELECT COUNT(*)::INTEGER FROM public.communication_sla_webhooks WHERE is_active = TRUE),
    'by_category', COALESCE((SELECT jsonb_object_agg(category, cnt) FROM (SELECT category, COUNT(*)::INTEGER AS cnt FROM public.communication_events WHERE created_at >= v_since GROUP BY category) s), '{}'::jsonb),
    'recent_events', COALESCE((SELECT jsonb_agg(row_to_json(t)) FROM (SELECT event_key, category, title, recipient_id, created_at FROM public.communication_events ORDER BY created_at DESC LIMIT 12) t), '[]'::jsonb)
  );
END;
$$;
