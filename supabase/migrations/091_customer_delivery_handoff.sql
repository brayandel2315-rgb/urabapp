-- Cliente: leer OTP de entrega y confirmar recepción (cierra el ciclo sin depender solo del mensajero)

CREATE OR REPLACE FUNCTION public.get_customer_delivery_handoff(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT id, customer_id, status, driver_id, delivery_otp, delivery_otp_verified_at, order_number
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id;

  IF v_order.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_order.customer_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  IF v_order.status = 'delivered' THEN
    RETURN jsonb_build_object(
      'success', true,
      'status', 'delivered',
      'verified', v_order.delivery_otp_verified_at IS NOT NULL,
      'order_number', v_order.order_number
    );
  END IF;

  IF v_order.status <> 'on_the_way' THEN
    RETURN jsonb_build_object(
      'success', true,
      'status', v_order.status,
      'otp', NULL,
      'can_confirm', false,
      'order_number', v_order.order_number
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'status', v_order.status,
    'otp', v_order.delivery_otp,
    'verified', v_order.delivery_otp_verified_at IS NOT NULL,
    'can_confirm', v_order.driver_id IS NOT NULL,
    'order_number', v_order.order_number
  );
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

REVOKE ALL ON FUNCTION public.get_customer_delivery_handoff(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.customer_confirm_delivery(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_customer_delivery_handoff(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.customer_confirm_delivery(UUID) TO authenticated;
