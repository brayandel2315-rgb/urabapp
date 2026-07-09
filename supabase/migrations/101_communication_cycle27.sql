-- Ciclo 27 — informe semanal salud de cola

ALTER TABLE public.communication_sla_alerts
  ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.auto_resolve_queue_threshold_alerts()
RETURNS SETOF public.communication_sla_alerts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_alert public.communication_sla_alerts%ROWTYPE;
  v_metric_key TEXT;
  v_value INTEGER;
  v_threshold INTEGER;
BEGIN
  FOR v_alert IN
    SELECT *
    FROM public.communication_sla_alerts
    WHERE channel = 'queue'
      AND alert_type IN ('queue_pending', 'queue_tracking', 'queue_critical', 'processing_stale')
      AND status IN ('open', 'acknowledged')
  LOOP
    v_metric_key := public.queue_alert_metric_key(v_alert.alert_type);
    IF v_metric_key IS NULL THEN
      CONTINUE;
    END IF;

    SELECT t.threshold_value INTO v_threshold
    FROM public.communication_queue_thresholds t
    WHERE t.metric_key = v_metric_key AND t.is_active = TRUE;

    IF v_threshold IS NULL THEN
      CONTINUE;
    END IF;

    v_value := public.comm_queue_metric_value(v_metric_key);
    IF v_value >= v_threshold THEN
      CONTINUE;
    END IF;

    UPDATE public.communication_sla_alerts
    SET status = 'resolved', resolved_at = NOW()
    WHERE id = v_alert.id
    RETURNING * INTO v_alert;

    RETURN NEXT v_alert;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_queue_health_weekly_report()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
BEGIN
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN jsonb_build_object(
    'period_start', v_since,
    'period_end', NOW(),
    'snapshots_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_queue_health_snapshots
      WHERE captured_at >= v_since
    ),
    'breaches_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_queue_health_snapshots
      WHERE captured_at >= v_since AND status = 'breach'
    ),
    'warnings_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_queue_health_snapshots
      WHERE captured_at >= v_since AND status = 'warning'
    ),
    'queue_alerts_opened_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts
      WHERE channel = 'queue' AND created_at >= v_since
    ),
    'queue_alerts_resolved_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts
      WHERE channel = 'queue' AND status = 'resolved' AND resolved_at >= v_since
    ),
    'queue_alerts_open_now', (
      SELECT COUNT(*)::INTEGER FROM public.communication_sla_alerts
      WHERE channel = 'queue' AND status IN ('open', 'acknowledged')
    ),
    'pending_total_now', public.comm_queue_metric_value('pending_total'),
    'by_metric', COALESCE((
      SELECT jsonb_object_agg(s.metric_key, jsonb_build_object(
        'label', COALESCE(t.label, s.metric_key),
        'snapshots', s.snapshots,
        'breaches', s.breaches,
        'warnings', s.warnings,
        'peak_value', s.peak_value,
        'avg_value', s.avg_value,
        'threshold_value', COALESCE(t.threshold_value, 0),
        'current_value', public.comm_queue_metric_value(s.metric_key)
      ))
      FROM (
        SELECT
          metric_key,
          COUNT(*)::INTEGER AS snapshots,
          COUNT(*) FILTER (WHERE status = 'breach')::INTEGER AS breaches,
          COUNT(*) FILTER (WHERE status = 'warning')::INTEGER AS warnings,
          MAX(current_value)::INTEGER AS peak_value,
          ROUND(AVG(current_value), 1) AS avg_value
        FROM public.communication_queue_health_snapshots
        WHERE captured_at >= v_since
        GROUP BY metric_key
      ) s
      LEFT JOIN public.communication_queue_thresholds t ON t.metric_key = s.metric_key
    ), '{}'::jsonb),
    'generated_at', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_health_weekly_report() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_queue_health_weekly_report() TO service_role;
