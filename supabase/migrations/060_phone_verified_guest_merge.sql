-- Recuperar pedidos de invitado en dispositivo nuevo: solo tras verificar celular por SMS.
-- Solo fusiona cuentas anónimas con el mismo número; nunca cuentas reales de terceros.

CREATE OR REPLACE FUNCTION public.merge_guest_activity_by_verified_phone()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_auth_phone TEXT;
  v_confirmed TIMESTAMPTZ;
  v_digits TEXT;
  v_orders INT := 0;
  v_shipments INT := 0;
  v_addresses INT := 0;
  v_source_id UUID;
  v_batch INT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  SELECT phone, phone_confirmed_at
  INTO v_auth_phone, v_confirmed
  FROM auth.users
  WHERE id = v_uid;

  IF v_auth_phone IS NULL OR v_confirmed IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'phone_not_verified');
  END IF;

  v_digits := right(regexp_replace(v_auth_phone, '\D', '', 'g'), 10);
  IF length(v_digits) < 10 THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_phone');
  END IF;

  UPDATE public.users
  SET phone = v_auth_phone, updated_at = NOW()
  WHERE id = v_uid;

  FOR v_source_id IN
    SELECT u.id
    FROM public.users u
    INNER JOIN auth.users au ON au.id = u.id
    WHERE u.id <> v_uid
      AND COALESCE(au.is_anonymous, false) = true
      AND right(regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g'), 10) = v_digits
  LOOP
    UPDATE public.orders SET customer_id = v_uid WHERE customer_id = v_source_id;
    GET DIAGNOSTICS v_batch = ROW_COUNT;
    v_orders := v_orders + v_batch;

    UPDATE public.shipment_orders SET customer_id = v_uid WHERE customer_id = v_source_id;
    GET DIAGNOSTICS v_batch = ROW_COUNT;
    v_shipments := v_shipments + v_batch;

    UPDATE public.addresses
    SET user_id = v_uid
    WHERE user_id = v_source_id
      AND NOT EXISTS (
        SELECT 1 FROM public.addresses a
        WHERE a.user_id = v_uid AND a.address = public.addresses.address
      );
    GET DIAGNOSTICS v_batch = ROW_COUNT;
    v_addresses := v_addresses + v_batch;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'orders', v_orders,
    'shipments', v_shipments,
    'addresses', v_addresses
  );
END;
$$;

REVOKE ALL ON FUNCTION public.merge_guest_activity_by_verified_phone() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_guest_activity_by_verified_phone() TO authenticated;
