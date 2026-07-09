-- Ciclo 22 — métricas procesador unificado para panel admin

CREATE OR REPLACE FUNCTION public.get_comm_retry_processor_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'queue_pending_total', (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
    ),
    'queue_tracking_push_pending', (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'pending' AND event_key = 'order_tracking_update' AND channel = 'push'
        AND next_retry_at <= NOW() AND attempt_count < max_attempts
    ),
    'queue_processing', (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue WHERE status = 'processing'
    ),
    'queue_completed_7d', (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'completed' AND updated_at >= NOW() - INTERVAL '7 days'
    ),
    'queue_failed_7d', (
      SELECT COUNT(*)::INT FROM public.communication_delivery_queue
      WHERE status = 'failed' AND updated_at >= NOW() - INTERVAL '7 days'
    ),
    'by_channel', COALESCE((
      SELECT jsonb_object_agg(channel, cnt)
      FROM (
        SELECT channel, COUNT(*)::INT AS cnt
        FROM public.communication_delivery_queue
        WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
        GROUP BY channel
      ) s
    ), '{}'::jsonb),
    'by_event_key', COALESCE((
      SELECT jsonb_object_agg(event_key, cnt)
      FROM (
        SELECT event_key, COUNT(*)::INT AS cnt
        FROM public.communication_delivery_queue
        WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
        GROUP BY event_key
        ORDER BY cnt DESC
        LIMIT 8
      ) s
    ), '{}'::jsonb),
    'unified_processor', 'process-comm-retries',
    'dispatch_tracking_push_compat', TRUE,
    'generated_at', NOW()
  )
  WHERE public.is_admin() OR auth.uid() IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_retry_queue_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_processor JSONB;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  v_processor := public.get_comm_retry_processor_stats();

  RETURN jsonb_build_object(
    'pending_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
    ),
    'processing', COALESCE((v_processor->>'queue_processing')::INT, 0),
    'failed_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue WHERE status = 'failed'
    ),
    'completed_7d', COALESCE((v_processor->>'queue_completed_7d')::INT, 0),
    'failed_7d', COALESCE((v_processor->>'queue_failed_7d')::INT, 0),
    'tracking_push_pending', COALESCE((v_processor->>'queue_tracking_push_pending')::INT, 0),
    'unified_processor', 'process-comm-retries',
    'by_channel', COALESCE(v_processor->'by_channel', '{}'::jsonb),
    'by_event_key', COALESCE(v_processor->'by_event_key', '{}'::jsonb),
    'by_priority', COALESCE((
      SELECT jsonb_object_agg(priority_label, cnt)
      FROM (
        SELECT
          CASE priority
            WHEN 4 THEN 'critical'
            WHEN 3 THEN 'high'
            WHEN 2 THEN 'medium'
            WHEN 1 THEN 'low'
            ELSE 'silent'
          END AS priority_label,
          COUNT(*)::INTEGER AS cnt
        FROM public.communication_delivery_queue
        WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
        GROUP BY priority
      ) s
    ), '{}'::jsonb),
    'oldest_pending_at', (
      SELECT MIN(created_at) FROM public.communication_delivery_queue
      WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
    ),
    'critical_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND priority >= 4
        AND next_retry_at <= NOW() AND attempt_count < max_attempts
    ),
    'recent', COALESCE((
      SELECT jsonb_agg(row_to_json(t))
      FROM (
        SELECT id, event_key, channel, priority, attempt_count, next_retry_at, created_at
        FROM public.communication_delivery_queue
        WHERE status = 'pending' AND next_retry_at <= NOW() AND attempt_count < max_attempts
        ORDER BY priority DESC, next_retry_at ASC
        LIMIT 15
      ) t
    ), '[]'::jsonb),
    'generated_at', NOW()
  );
END;
$$;
