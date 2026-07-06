-- Ciclo 5 tracking: cierre operativo, auditoría unificada, replay admin

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_closed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS tracking_closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_tracking_closed
  ON public.orders (tracking_closed_at DESC NULLS LAST)
  WHERE tracking_closed_at IS NOT NULL;

-- Cerrar tracking (admin u operaciones tras entrega/cancelación)
CREATE OR REPLACE FUNCTION public.close_order_tracking(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.status NOT IN ('delivered', 'cancelled') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_terminal');
  END IF;

  IF v_order.tracking_closed_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_closed', true);
  END IF;

  UPDATE public.orders
  SET tracking_closed_at = NOW(),
      tracking_closed_by = auth.uid(),
      tracking_flags = COALESCE(tracking_flags, '{}'::jsonb) || jsonb_build_object('closed', true)
  WHERE id = p_order_id;

  PERFORM public.log_order_event(
    p_order_id, 'closed', auth.uid(), 'admin',
    v_order.dest_latitude, v_order.dest_longitude,
    'Tracking cerrado por operaciones',
    jsonb_build_object('closed_by', auth.uid())
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Auditoría unificada de un pedido
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
  v_ping_count INT;
  v_eta JSONB;
  v_push_count INT;
  v_duration_min INT;
BEGIN
  SELECT
    o.id, o.order_number, o.status, o.customer_id, o.business_id, o.driver_id,
    o.dest_address, o.dest_municipio, o.dest_latitude, o.dest_longitude,
    o.created_at, o.delivered_at, o.cancelled_at,
    o.delivery_proof_url, o.delivery_proof_at,
    o.delivery_signature_url, o.delivery_signature_at,
    o.delivery_qr_token, o.delivery_qr_verified_at,
    o.tracking_closed_at, o.tracking_closed_by, o.tracking_flags,
    o.eta_seconds, o.eta_updated_at
  INTO v_order
  FROM public.orders o
  WHERE o.id = p_order_id;

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF NOT public.is_admin()
     AND v_order.customer_id <> auth.uid()
     AND NOT EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = v_order.driver_id AND d.user_id = auth.uid())
     AND NOT EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = v_order.business_id AND b.owner_id = auth.uid())
  THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
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

  SELECT COUNT(*)::INT INTO v_push_count
  FROM public.tracking_push_outbox po
  WHERE po.order_id = p_order_id;

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

-- Pedidos recientes para replay/auditoría admin
CREATE OR REPLACE FUNCTION public.get_orders_for_tracking_audit(
  p_days INT DEFAULT 7,
  p_limit INT DEFAULT 40
)
RETURNS TABLE (
  id UUID,
  order_number TEXT,
  status TEXT,
  dest_municipio TEXT,
  created_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  tracking_closed_at TIMESTAMPTZ,
  driver_id UUID,
  has_incident BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    o.id,
    o.order_number,
    o.status,
    o.dest_municipio,
    o.created_at,
    o.delivered_at,
    o.tracking_closed_at,
    o.driver_id,
    COALESCE((o.tracking_flags->>'has_incident')::boolean, false) AS has_incident
  FROM public.orders o
  WHERE public.is_admin()
    AND o.status IN ('delivered', 'cancelled')
    AND o.created_at >= NOW() - (GREATEST(p_days, 1) || ' days')::INTERVAL
  ORDER BY COALESCE(o.delivered_at, o.created_at) DESC
  LIMIT GREATEST(p_limit, 1);
$$;

GRANT EXECUTE ON FUNCTION public.close_order_tracking TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_tracking_audit TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_orders_for_tracking_audit TO authenticated;
