-- Ciclo 21 — consolidar procesador: claim_communication_retries maneja tracking push y demás canales

DROP FUNCTION IF EXISTS public.claim_tracking_push_deliveries(INTEGER);

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
    'unified_processor', 'process-comm-retries',
    'dispatch_tracking_push_compat', TRUE,
    'generated_at', NOW()
  )
  WHERE public.is_admin() OR auth.uid() IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_comm_retry_processor_stats() TO authenticated;

-- Stats tracking: alineado con procesador unificado
CREATE OR REPLACE FUNCTION public.get_tracking_push_queue_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    public.get_comm_retry_processor_stats()
    || jsonb_build_object(
      'queue_pending', (
        SELECT COUNT(*)::INT FROM public.communication_delivery_queue
        WHERE status = 'pending' AND event_key = 'order_tracking_update' AND channel = 'push'
      ),
      'queue_processing', (
        SELECT COUNT(*)::INT FROM public.communication_delivery_queue
        WHERE status = 'processing' AND event_key = 'order_tracking_update' AND channel = 'push'
      ),
      'queue_completed_7d', (
        SELECT COUNT(*)::INT FROM public.communication_delivery_queue
        WHERE status = 'completed' AND event_key = 'order_tracking_update' AND channel = 'push'
          AND updated_at >= NOW() - INTERVAL '7 days'
      ),
      'queue_failed_7d', (
        SELECT COUNT(*)::INT FROM public.communication_delivery_queue
        WHERE status = 'failed' AND event_key = 'order_tracking_update' AND channel = 'push'
          AND updated_at >= NOW() - INTERVAL '7 days'
      ),
      'archive_rows', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox_archive),
      'outbox_retired', TRUE,
      'unified', TRUE
    )
  )
  WHERE public.is_admin() OR auth.uid() IS NOT NULL;
$$;
