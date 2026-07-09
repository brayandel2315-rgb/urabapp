-- Ciclo 28 — recuperación de cola: reset processing atascado + requeue fallidos

CREATE OR REPLACE FUNCTION public.get_admin_queue_recovery_stats()
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

  RETURN jsonb_build_object(
    'failed_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'failed'
    ),
    'stale_processing', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'processing' AND updated_at < NOW() - INTERVAL '15 minutes'
    ),
    'processing_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'processing'
    ),
    'requeueable_failed', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'failed'
    ),
    'oldest_failed_at', (
      SELECT MIN(created_at) FROM public.communication_delivery_queue WHERE status = 'failed'
    ),
    'by_event_key', COALESCE((
      SELECT jsonb_object_agg(event_key, cnt)
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM public.communication_delivery_queue
        WHERE status = 'failed'
        GROUP BY event_key
        ORDER BY cnt DESC
        LIMIT 8
      ) s
    ), '{}'::jsonb),
    'generated_at', NOW()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_queue_recovery_stats() TO authenticated;

CREATE OR REPLACE FUNCTION public.reset_stale_communication_queue(p_stale_minutes INTEGER DEFAULT 15)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reset INTEGER;
BEGIN
  UPDATE public.communication_delivery_queue
  SET status = 'pending',
      attempt_count = GREATEST(attempt_count - 1, 0),
      next_retry_at = NOW(),
      updated_at = NOW(),
      last_error = 'stale processing reset'
  WHERE status = 'processing'
    AND updated_at < NOW() - make_interval(mins => GREATEST(p_stale_minutes, 5));

  GET DIAGNOSTICS v_reset = ROW_COUNT;
  RETURN v_reset;
END;
$$;

REVOKE ALL ON FUNCTION public.reset_stale_communication_queue(INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reset_stale_communication_queue(INTEGER) TO service_role;

CREATE OR REPLACE FUNCTION public.requeue_failed_communications(
  p_limit INTEGER DEFAULT 50,
  p_event_key TEXT DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_requeued INTEGER;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN') THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  UPDATE public.communication_delivery_queue q
  SET status = 'pending',
      attempt_count = 0,
      next_retry_at = NOW(),
      last_error = NULL,
      updated_at = NOW()
  WHERE q.id IN (
    SELECT id FROM public.communication_delivery_queue
    WHERE status = 'failed'
      AND (p_event_key IS NULL OR event_key = p_event_key)
    ORDER BY updated_at DESC
    LIMIT GREATEST(LEAST(p_limit, 200), 1)
  );

  GET DIAGNOSTICS v_requeued = ROW_COUNT;
  RETURN v_requeued;
END;
$$;

GRANT EXECUTE ON FUNCTION public.requeue_failed_communications(INTEGER, TEXT) TO authenticated;
