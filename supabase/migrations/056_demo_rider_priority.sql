-- Mensajero demo recibe prioridad en asignación + siempre listo en Apartadó

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
  LEFT JOIN public.users u ON u.id = d.user_id
  WHERE d.is_online = true
    AND d.is_verified = true
    AND (
      d.municipio = v_order.dest_municipio
      OR u.email = 'test.mensajero@urabapp.com'
    )
  ORDER BY
    CASE WHEN u.email = 'test.mensajero@urabapp.com' THEN 0 ELSE 1 END,
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

-- Demo rider: online, GPS en Apartadó, verificado
DO $$
DECLARE
  v_rider_user UUID;
  v_driver UUID;
BEGIN
  SELECT id INTO v_rider_user FROM auth.users WHERE email = 'test.mensajero@urabapp.com';
  IF v_rider_user IS NULL THEN
    RAISE NOTICE 'test.mensajero@urabapp.com no existe — omitiendo setup demo rider';
    RETURN;
  END IF;

  UPDATE public.drivers
  SET
    is_online = true,
    availability_mode = 'available',
    is_verified = true,
    verification_status = 'approved',
    municipio = 'Apartadó',
    latitude = 7.8833,
    longitude = -76.6333,
    onboarding_step = 4
  WHERE user_id = v_rider_user
  RETURNING id INTO v_driver;

  IF v_driver IS NULL THEN
    INSERT INTO public.drivers (
      user_id, name, phone, municipio, vehicle, plate,
      is_online, availability_mode, is_verified, verification_status,
      latitude, longitude, onboarding_step
    )
    VALUES (
      v_rider_user, 'Mensajero Demo Urabapp', '3003330003', 'Apartadó', 'moto', 'DEMO-01',
      true, 'available', true, 'approved',
      7.8833, -76.6333, 4
    );
  END IF;
END $$;
