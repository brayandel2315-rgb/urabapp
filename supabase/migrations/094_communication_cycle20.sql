-- Ciclo 20 — retirar tracking_push_outbox (archivo + cola unificada definitiva)

-- Migrar pendientes finales antes del retiro
DO $$
DECLARE
  v_result JSONB;
BEGIN
  IF to_regclass('public.tracking_push_outbox') IS NOT NULL THEN
    v_result := public.migrate_tracking_push_outbox_to_queue();
  END IF;
END;
$$;

-- Archivar histórico y eliminar tabla activa
CREATE TABLE IF NOT EXISTS public.tracking_push_outbox_archive (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  order_id UUID,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.tracking_push_outbox_archive (
  id, user_id, order_id, title, body, payload, status, created_at, sent_at, archived_at
)
SELECT id, user_id, order_id, title, body, payload, status, created_at, sent_at, NOW()
FROM public.tracking_push_outbox
ON CONFLICT (id) DO NOTHING;

DROP TABLE IF EXISTS public.tracking_push_outbox CASCADE;

DROP FUNCTION IF EXISTS public.migrate_tracking_push_outbox_to_queue();
DROP FUNCTION IF EXISTS public.mark_tracking_push_sent(UUID, TEXT);

CREATE OR REPLACE FUNCTION public.get_tracking_push_queue_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
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
    'unified', TRUE,
    'generated_at', NOW()
  )
  WHERE public.is_admin() OR auth.uid() IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_tracking_push_queue_stats() TO authenticated;

-- Compat: RPC anterior delega a cola unificada
CREATE OR REPLACE FUNCTION public.get_tracking_push_outbox_stats()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (
    public.get_tracking_push_queue_stats()
    || jsonb_build_object(
      'pending', 0,
      'sent', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox_archive WHERE status = 'sent'),
      'failed', (SELECT COUNT(*)::INT FROM public.tracking_push_outbox_archive WHERE status = 'failed'),
      'comm_queue_pending', (public.get_tracking_push_queue_stats()->>'queue_pending')::INT
    )
  )
  WHERE public.is_admin() OR auth.uid() IS NOT NULL;
$$;

GRANT EXECUTE ON FUNCTION public.get_tracking_push_outbox_stats() TO authenticated;

-- Auditoría: contar push desde cola unificada + archivo legacy
CREATE OR REPLACE FUNCTION public.get_order_tracking_audit(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_events JSONB;
  v_incidents JSONB;
  v_eta JSONB;
  v_ping_count INT;
  v_push_count INT;
  v_duration_min INT;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  IF NOT (
    public.is_admin()
    OR v_order.customer_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = v_order.driver_id AND d.user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = v_order.business_id AND b.owner_id = auth.uid())
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'access_denied');
  END IF;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', e.id,
      'event_type', e.event_type,
      'actor_role', e.actor_role,
      'description', e.description,
      'latitude', e.latitude,
      'longitude', e.longitude,
      'metadata', e.metadata,
      'created_at', e.created_at
    ) ORDER BY e.created_at ASC
  ), '[]'::jsonb)
  INTO v_events
  FROM public.order_events e
  WHERE e.order_id = p_order_id;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'id', e.id,
      'description', e.description,
      'metadata', e.metadata,
      'created_at', e.created_at
    ) ORDER BY e.created_at DESC
  ), '[]'::jsonb)
  INTO v_incidents
  FROM public.order_events e
  WHERE e.order_id = p_order_id AND e.event_type = 'incident';

  SELECT COUNT(*)::INT INTO v_ping_count
  FROM public.order_location_pings p
  WHERE p.order_id = p_order_id;

  SELECT COALESCE(jsonb_agg(
    jsonb_build_object(
      'eta_seconds', s.eta_seconds,
      'distance_km', s.distance_km,
      'recorded_at', s.recorded_at
    ) ORDER BY s.recorded_at ASC
  ), '[]'::jsonb)
  INTO v_eta
  FROM (
    SELECT * FROM public.order_eta_snapshots
    WHERE order_id = p_order_id
    ORDER BY recorded_at DESC
    LIMIT 60
  ) s;

  SELECT (
    (SELECT COUNT(*)::INT FROM public.communication_delivery_queue q
     WHERE q.event_key = 'order_tracking_update' AND q.channel = 'push'
       AND COALESCE(q.payload->>'order_id', q.payload->>'orderId')::uuid = p_order_id)
    +
    (SELECT COUNT(*)::INT FROM public.tracking_push_outbox_archive a
     WHERE a.order_id = p_order_id)
  ) INTO v_push_count;

  v_duration_min := CASE
    WHEN v_order.delivered_at IS NOT NULL THEN
      ROUND(EXTRACT(EPOCH FROM (v_order.delivered_at - v_order.created_at)) / 60.0)::INT
    WHEN v_order.cancelled_at IS NOT NULL THEN
      ROUND(EXTRACT(EPOCH FROM (v_order.cancelled_at - v_order.created_at)) / 60.0)::INT
    ELSE NULL
  END;

  RETURN jsonb_build_object(
    'success', true,
    'order', jsonb_build_object(
      'id', v_order.id,
      'order_number', v_order.order_number,
      'status', v_order.status,
      'dest_address', v_order.dest_address,
      'dest_municipio', v_order.dest_municipio,
      'dest_latitude', v_order.dest_latitude,
      'dest_longitude', v_order.dest_longitude,
      'created_at', v_order.created_at,
      'delivered_at', v_order.delivered_at,
      'delivery_proof_url', v_order.delivery_proof_url,
      'delivery_signature_url', v_order.delivery_signature_url,
      'delivery_qr_verified_at', v_order.delivery_qr_verified_at,
      'tracking_closed_at', v_order.tracking_closed_at,
      'eta_seconds', v_order.eta_seconds
    ),
    'events', v_events,
    'incidents', v_incidents,
    'ping_count', v_ping_count,
    'eta_snapshots', v_eta,
    'push_notifications', v_push_count,
    'summary', jsonb_build_object(
      'duration_min', v_duration_min,
      'has_proof', v_order.delivery_proof_url IS NOT NULL,
      'has_signature', v_order.delivery_signature_url IS NOT NULL,
      'has_qr_verified', v_order.delivery_qr_verified_at IS NOT NULL,
      'is_closed', v_order.tracking_closed_at IS NOT NULL,
      'incident_count', jsonb_array_length(v_incidents)
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_legacy_comm_migration_stats()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ := NOW() - INTERVAL '7 days';
  v_legacy_notifications INTEGER;
  v_comm_notifications INTEGER;
  v_total_notifications INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RAISE EXCEPTION 'access denied';
  END IF;

  SELECT COUNT(*)::INTEGER INTO v_legacy_notifications
  FROM public.notifications
  WHERE created_at >= v_since AND event_id IS NULL;

  SELECT COUNT(*)::INTEGER INTO v_comm_notifications
  FROM public.notifications
  WHERE created_at >= v_since AND event_id IS NOT NULL;

  v_total_notifications := v_legacy_notifications + v_comm_notifications;

  RETURN jsonb_build_object(
    'tracking_outbox_pending', 0,
    'tracking_outbox_retired', TRUE,
    'tracking_outbox_archive_rows', (
      SELECT COUNT(*)::INTEGER FROM public.tracking_push_outbox_archive
    ),
    'tracking_outbox_sent_7d', (
      SELECT COUNT(*)::INTEGER FROM public.tracking_push_outbox_archive
      WHERE status = 'sent' AND sent_at >= v_since
    ),
    'comm_queue_tracking_push_pending', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND channel = 'push' AND event_key = 'order_tracking_update'
    ),
    'comm_queue_push_pending_total', (
      SELECT COUNT(*)::INTEGER FROM public.communication_delivery_queue
      WHERE status = 'pending' AND channel = 'push'
    ),
    'sql_trigger_events_7d', COALESCE((
      SELECT jsonb_object_agg(event_key, cnt)
      FROM (
        SELECT event_key, COUNT(*)::INTEGER AS cnt
        FROM public.communication_events
        WHERE created_at >= v_since
          AND payload->>'source' LIKE '%trigger%'
        GROUP BY event_key
      ) s
    ), '{}'::jsonb),
    'tracking_events_7d', (
      SELECT COUNT(*)::INTEGER FROM public.communication_events
      WHERE created_at >= v_since AND event_key = 'order_tracking_update'
    ),
    'legacy_notifications_7d', v_legacy_notifications,
    'comm_notifications_7d', v_comm_notifications,
    'unified_notification_pct', CASE
      WHEN v_total_notifications > 0
      THEN ROUND(100.0 * v_comm_notifications / v_total_notifications, 1)
      ELSE 100
    END,
    'tracking_ab_variants_active', (
      SELECT COUNT(*)::INTEGER FROM public.communication_template_variants
      WHERE event_key = 'order_tracking_update' AND is_active = TRUE
    ),
    'generated_at', NOW()
  );
END;
$$;

ALTER TABLE public.tracking_push_outbox_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tracking_push_outbox_archive_admin ON public.tracking_push_outbox_archive;
CREATE POLICY tracking_push_outbox_archive_admin ON public.tracking_push_outbox_archive
  FOR SELECT TO authenticated
  USING (public.is_admin());
