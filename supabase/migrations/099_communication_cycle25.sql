-- Ciclo 25 — historial de snapshots de salud de cola

CREATE TABLE IF NOT EXISTS public.communication_queue_health_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL,
  current_value INTEGER NOT NULL DEFAULT 0,
  threshold_value INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok', 'warning', 'breach', 'disabled')),
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_queue_health_snap_metric_time
  ON public.communication_queue_health_snapshots (metric_key, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_queue_health_snap_captured
  ON public.communication_queue_health_snapshots (captured_at DESC);

ALTER TABLE public.communication_queue_health_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS comm_queue_health_snapshots_admin ON public.communication_queue_health_snapshots;
CREATE POLICY comm_queue_health_snapshots_admin ON public.communication_queue_health_snapshots
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

CREATE OR REPLACE FUNCTION public.record_queue_health_snapshot()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cfg RECORD;
  v_value INTEGER;
  v_status TEXT;
  v_inserted INTEGER := 0;
BEGIN
  FOR v_cfg IN
    SELECT * FROM public.communication_queue_thresholds ORDER BY metric_key
  LOOP
    v_value := public.comm_queue_metric_value(v_cfg.metric_key);

    IF NOT v_cfg.is_active THEN
      v_status := 'disabled';
    ELSIF v_value >= v_cfg.threshold_value THEN
      v_status := 'breach';
    ELSIF v_value >= GREATEST(1, FLOOR(v_cfg.threshold_value * 0.8)) THEN
      v_status := 'warning';
    ELSE
      v_status := 'ok';
    END IF;

    INSERT INTO public.communication_queue_health_snapshots (
      metric_key, current_value, threshold_value, status
    ) VALUES (
      v_cfg.metric_key, v_value, v_cfg.threshold_value, v_status
    );

    v_inserted := v_inserted + 1;
  END LOOP;

  DELETE FROM public.communication_queue_health_snapshots
  WHERE captured_at < NOW() - INTERVAL '7 days';

  RETURN v_inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.record_queue_health_snapshot() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_queue_health_snapshot() TO service_role;

CREATE OR REPLACE FUNCTION public.get_admin_queue_health_history(p_hours INTEGER DEFAULT 24)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ;
  v_series JSONB := '{}'::jsonb;
  v_metric TEXT;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  v_since := NOW() - make_interval(hours => GREATEST(LEAST(p_hours, 168), 1));

  FOR v_metric IN
    SELECT DISTINCT metric_key FROM public.communication_queue_thresholds ORDER BY metric_key
  LOOP
    v_series := v_series || jsonb_build_object(
      v_metric,
      COALESCE((
        SELECT jsonb_agg(
          jsonb_build_object(
            'captured_at', s.captured_at,
            'current_value', s.current_value,
            'threshold_value', s.threshold_value,
            'status', s.status
          ) ORDER BY s.captured_at
        )
        FROM public.communication_queue_health_snapshots s
        WHERE s.metric_key = v_metric AND s.captured_at >= v_since
      ), '[]'::jsonb)
    );
  END LOOP;

  RETURN jsonb_build_object(
    'hours', GREATEST(LEAST(p_hours, 168), 1),
    'since', v_since,
    'snapshot_count', (
      SELECT COUNT(*)::INT FROM public.communication_queue_health_snapshots
      WHERE captured_at >= v_since
    ),
    'series', v_series,
    'generated_at', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_health_history(INTEGER) TO authenticated;
