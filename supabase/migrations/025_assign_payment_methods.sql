-- Incluir alias 'cards' en guard de pagos digitales (cliente usa cards y card)
CREATE OR REPLACE FUNCTION public.assign_best_rider(p_order_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_rider_id UUID;
BEGIN
  SELECT id, driver_id, status, dest_municipio, dest_latitude, dest_longitude,
         payment_method, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN v_order.driver_id; END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN NULL; END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'cards', 'daviplata')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = true
    AND d.is_verified = true
    AND d.municipio = v_order.dest_municipio
  ORDER BY
    CASE
      WHEN v_order.dest_latitude IS NOT NULL AND d.latitude IS NOT NULL THEN
        POWER(d.latitude::float - v_order.dest_latitude::float, 2)
        + POWER(d.longitude::float - v_order.dest_longitude::float, 2)
      ELSE 999999
    END,
    d.total_deliveries ASC,
    d.rating DESC
  LIMIT 1;

  IF v_rider_id IS NULL THEN RETURN NULL; END IF;

  UPDATE public.orders
  SET
    driver_id = v_rider_id,
    status = CASE WHEN status = 'pending' THEN 'accepted' ELSE status END,
    accepted_at = CASE WHEN status = 'pending' THEN NOW() ELSE accepted_at END
  WHERE id = p_order_id;

  RETURN v_rider_id;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_best_rider(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_best_rider(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_best_rider(UUID) TO authenticated;
