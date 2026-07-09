-- Ciclo 24 — salud de cola en vivo + auto-resolución de alertas de umbral

CREATE OR REPLACE FUNCTION public.queue_metric_alert_type(p_metric_key TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_metric_key
    WHEN 'pending_total' THEN 'queue_pending'
    WHEN 'tracking_push_pending' THEN 'queue_tracking'
    WHEN 'critical_pending' THEN 'queue_critical'
    WHEN 'processing_stale' THEN 'processing_stale'
    ELSE 'queue_pending'
  END;
$$;

CREATE OR REPLACE FUNCTION public.queue_alert_metric_key(p_alert_type TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE p_alert_type
    WHEN 'queue_pending' THEN 'pending_total'
    WHEN 'queue_tracking' THEN 'tracking_push_pending'
    WHEN 'queue_critical' THEN 'critical_pending'
    WHEN 'processing_stale' THEN 'processing_stale'
    ELSE NULL
  END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_queue_health()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows JSONB := '[]'::jsonb;
  v_cfg RECORD;
  v_value INTEGER;
  v_status TEXT;
  v_alert_type TEXT;
  v_open_alert_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  FOR v_cfg IN
    SELECT * FROM public.communication_queue_thresholds ORDER BY metric_key
  LOOP
    v_value := public.comm_queue_metric_value(v_cfg.metric_key);
    v_alert_type := public.queue_metric_alert_type(v_cfg.metric_key);

    IF NOT v_cfg.is_active THEN
      v_status := 'disabled';
    ELSIF v_value >= v_cfg.threshold_value THEN
      v_status := 'breach';
    ELSIF v_value >= GREATEST(1, FLOOR(v_cfg.threshold_value * 0.8)) THEN
      v_status := 'warning';
    ELSE
      v_status := 'ok';
    END IF;

    SELECT a.id INTO v_open_alert_id
    FROM public.communication_sla_alerts a
    WHERE a.channel = 'queue'
      AND a.alert_type = v_alert_type
      AND a.status IN ('open', 'acknowledged')
    ORDER BY a.created_at DESC
    LIMIT 1;

    v_rows := v_rows || jsonb_build_array(jsonb_build_object(
      'metric_key', v_cfg.metric_key,
      'label', v_cfg.label,
      'threshold_value', v_cfg.threshold_value,
      'current_value', v_value,
      'is_active', v_cfg.is_active,
      'status', v_status,
      'utilization_pct', CASE
        WHEN v_cfg.threshold_value > 0 THEN ROUND((v_value::NUMERIC / v_cfg.threshold_value) * 100, 1)
        ELSE 0
      END,
      'open_alert_id', v_open_alert_id
    ));
  END LOOP;

  RETURN v_rows;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_health() TO authenticated;

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
    SET status = 'resolved'
    WHERE id = v_alert.id
    RETURNING * INTO v_alert;

    RETURN NEXT v_alert;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.auto_resolve_queue_threshold_alerts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auto_resolve_queue_threshold_alerts() TO service_role;
