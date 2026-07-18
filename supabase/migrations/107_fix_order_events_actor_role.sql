-- 107: Fix order_events actor_role check violations
-- Bug: customer_confirm_delivery passed 'customer' (invalid).
-- Allowed values: client | business | rider | admin | system

CREATE OR REPLACE FUNCTION public.normalize_order_event_actor_role(p_actor_role TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_role TEXT := lower(trim(COALESCE(p_actor_role, 'system')));
BEGIN
  IF v_role IN ('customer', 'user', 'buyer') THEN
    RETURN 'client';
  END IF;

  IF v_role IN ('courier', 'driver', 'mensajero', 'domiciliario') THEN
    RETURN 'rider';
  END IF;

  IF v_role IN ('merchant', 'store', 'owner', 'comercio') THEN
    RETURN 'business';
  END IF;

  IF v_role IN ('operator', 'ops', 'support') THEN
    RETURN 'admin';
  END IF;

  IF v_role IN ('client', 'business', 'rider', 'admin', 'system') THEN
    RETURN v_role;
  END IF;

  RETURN 'system';
END;
$$;

CREATE OR REPLACE FUNCTION public.log_order_event(
  p_order_id UUID,
  p_event_type TEXT,
  p_actor_id UUID DEFAULT NULL,
  p_actor_role TEXT DEFAULT 'system',
  p_latitude DECIMAL DEFAULT NULL,
  p_longitude DECIMAL DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_actor UUID;
  v_role TEXT;
  v_meta JSONB := COALESCE(p_metadata, '{}'::jsonb);
  v_skip_types TEXT[] := ARRAY[
    'arriving_300m', 'arriving_100m', 'arriving_50m', 'arrived', 'gps_ping'
  ];
BEGIN
  IF p_order_id IS NULL OR p_event_type IS NULL OR TRIM(p_event_type) = '' THEN
    RETURN NULL;
  END IF;

  v_role := public.normalize_order_event_actor_role(p_actor_role);
  v_actor := public.resolve_order_event_actor(p_actor_id, v_role);

  IF NOT (p_event_type = ANY(v_skip_types)) THEN
    IF EXISTS (
      SELECT 1 FROM public.order_events
      WHERE order_id = p_order_id
        AND event_type = p_event_type
        AND created_at > NOW() - INTERVAL '45 seconds'
    ) THEN
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO public.order_events (
    order_id, event_type, actor_id, actor_role,
    latitude, longitude, description, metadata
  ) VALUES (
    p_order_id, p_event_type, v_actor, v_role,
    p_latitude, p_longitude, p_description, v_meta
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.customer_confirm_delivery(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.customer_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  IF v_order.status = 'delivered' THEN
    RETURN jsonb_build_object('success', true, 'already_delivered', true);
  END IF;

  IF v_order.status <> 'on_the_way' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF v_order.driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'no_driver');
  END IF;

  UPDATE public.orders
  SET status = 'delivered',
      delivered_at = COALESCE(delivered_at, NOW()),
      delivery_otp_verified_at = COALESCE(delivery_otp_verified_at, NOW()),
      courier_phase = COALESCE(courier_phase, 'delivered')
  WHERE id = p_order_id;

  -- Must be 'client' (check constraint), never 'customer'
  PERFORM public.log_order_event(
    p_order_id,
    'customer_confirmed_delivery',
    auth.uid(),
    'client',
    v_order.dest_latitude,
    v_order.dest_longitude,
    'Cliente confirmó que recibió el pedido',
    jsonb_build_object('source', 'customer_confirm_delivery')
  );

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'delivered', jsonb_build_object('customer_confirmed', true));

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.normalize_order_event_actor_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_order_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.customer_confirm_delivery(UUID) TO authenticated;
