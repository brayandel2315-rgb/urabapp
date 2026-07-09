-- Ciclo 23 — alertas por umbral de cola communication_delivery_queue

ALTER TABLE public.communication_sla_alerts
  DROP CONSTRAINT IF EXISTS communication_sla_alerts_alert_type_check;

ALTER TABLE public.communication_sla_alerts
  ADD CONSTRAINT communication_sla_alerts_alert_type_check
  CHECK (alert_type IN (
    'latency', 'success_rate',
    'queue_pending', 'queue_tracking', 'queue_critical', 'processing_stale'
  ));

CREATE TABLE IF NOT EXISTS public.communication_queue_thresholds (
  metric_key TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  threshold_value INTEGER NOT NULL DEFAULT 50 CHECK (threshold_value > 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.communication_queue_thresholds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_queue_thresholds_admin ON public.communication_queue_thresholds;
CREATE POLICY comm_queue_thresholds_admin ON public.communication_queue_thresholds
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

INSERT INTO public.communication_queue_thresholds (metric_key, label, threshold_value)
VALUES
  ('pending_total', 'Cola total pendiente', 50),
  ('tracking_push_pending', 'Push tracking pendiente', 20),
  ('critical_pending', 'Pendientes prioridad crítica', 10),
  ('processing_stale', 'Atascados en processing (>15 min)', 5)
ON CONFLICT (metric_key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_admin_queue_thresholds()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  RETURN COALESCE((
    SELECT jsonb_agg(
      jsonb_build_object(
        'metric_key', t.metric_key,
        'label', t.label,
        'threshold_value', t.threshold_value,
        'is_active', t.is_active,
        'updated_at', t.updated_at
      ) ORDER BY t.metric_key
    )
    FROM public.communication_queue_thresholds t
  ), '[]'::jsonb);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_thresholds() TO authenticated;

CREATE OR REPLACE FUNCTION public.upsert_communication_queue_threshold(
  p_metric_key TEXT,
  p_threshold_value INTEGER,
  p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.communication_queue_thresholds%ROWTYPE;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  UPDATE public.communication_queue_thresholds
  SET threshold_value = GREATEST(p_threshold_value, 1),
      is_active = COALESCE(p_is_active, TRUE),
      updated_at = NOW()
  WHERE metric_key = p_metric_key
  RETURNING * INTO v_row;

  IF v_row.metric_key IS NULL THEN
    RAISE EXCEPTION 'unknown metric_key';
  END IF;

  RETURN jsonb_build_object(
    'metric_key', v_row.metric_key,
    'label', v_row.label,
    'threshold_value', v_row.threshold_value,
    'is_active', v_row.is_active
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_communication_queue_threshold(TEXT, INTEGER, BOOLEAN) TO authenticated;

CREATE OR REPLACE FUNCTION public.comm_queue_metric_value(p_metric_key TEXT)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE p_metric_key
    WHEN 'pending_total' THEN (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
    )
    WHEN 'tracking_push_pending' THEN (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'pending' AND event_key = 'order_tracking_update' AND channel = 'push'
        AND next_retry_at <= NOW() AND attempt_count < max_attempts
    )
    WHEN 'critical_pending' THEN (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'pending' AND priority >= 4
        AND next_retry_at <= NOW() AND attempt_count < max_attempts
    )
    WHEN 'processing_stale' THEN (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'processing' AND updated_at < NOW() - INTERVAL '15 minutes'
    )
    ELSE 0
  END;
$$;

CREATE OR REPLACE FUNCTION public.check_communication_queue_thresholds()
RETURNS SETOF public.communication_sla_alerts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cfg RECORD;
  v_value INTEGER;
  v_alert_type TEXT;
  v_message TEXT;
  v_alert public.communication_sla_alerts%ROWTYPE;
BEGIN
  FOR v_cfg IN
    SELECT * FROM public.communication_queue_thresholds WHERE is_active = TRUE
  LOOP
    v_value := public.comm_queue_metric_value(v_cfg.metric_key);
    IF v_value < v_cfg.threshold_value THEN
      CONTINUE;
    END IF;

    v_alert_type := CASE v_cfg.metric_key
      WHEN 'pending_total' THEN 'queue_pending'
      WHEN 'tracking_push_pending' THEN 'queue_tracking'
      WHEN 'critical_pending' THEN 'queue_critical'
      WHEN 'processing_stale' THEN 'processing_stale'
      ELSE 'queue_pending'
    END;

    IF EXISTS (
      SELECT 1 FROM public.communication_sla_alerts a
      WHERE a.channel = 'queue'
        AND a.alert_type = v_alert_type
        AND a.status = 'open'
        AND a.created_at >= NOW() - INTERVAL '2 hours'
    ) THEN
      CONTINUE;
    END IF;

    v_message := format(
      'Cola de comunicaciones: %s = %s (umbral %s)',
      v_cfg.label, v_value, v_cfg.threshold_value
    );

    INSERT INTO public.communication_sla_alerts (
      channel, alert_type, metric_value, threshold_value, message
    ) VALUES (
      'queue', v_alert_type, v_value, v_cfg.threshold_value, v_message
    )
    RETURNING * INTO v_alert;

    RETURN NEXT v_alert;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.check_communication_queue_thresholds() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_communication_queue_thresholds() TO service_role;
