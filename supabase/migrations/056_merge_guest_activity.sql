-- Vincular pedidos/envíos de sesión invitada (anónima u otro perfil) al usuario autenticado por teléfono.

CREATE OR REPLACE FUNCTION public.merge_customer_activity(
  p_phone TEXT DEFAULT NULL,
  p_guest_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_digits TEXT;
  v_orders INT := 0;
  v_shipments INT := 0;
  v_addresses INT := 0;
  v_source_ids UUID[] := ARRAY[]::UUID[];
  v_guest_phone TEXT;
  v_target_phone TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  IF p_phone IS NOT NULL AND length(trim(p_phone)) > 0 THEN
    v_digits := right(regexp_replace(p_phone, '\D', '', 'g'), 10);
    IF length(v_digits) >= 10 THEN
      UPDATE public.users SET phone = trim(p_phone) WHERE id = v_uid;
      SELECT COALESCE(array_agg(u.id), ARRAY[]::UUID[])
      INTO v_source_ids
      FROM public.users u
      WHERE u.id <> v_uid
        AND right(regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g'), 10) = v_digits;
    END IF;
  END IF;

  IF p_guest_user_id IS NOT NULL AND p_guest_user_id <> v_uid THEN
    SELECT phone INTO v_guest_phone FROM public.users WHERE id = p_guest_user_id;
    SELECT phone INTO v_target_phone FROM public.users WHERE id = v_uid;

    IF v_guest_phone IS NULL
      OR v_target_phone IS NULL
      OR right(regexp_replace(v_guest_phone, '\D', '', 'g'), 10)
         = right(regexp_replace(COALESCE(v_target_phone, p_phone, ''), '\D', '', 'g'), 10) THEN
      v_source_ids := array_append(v_source_ids, p_guest_user_id);
    END IF;
  END IF;

  v_source_ids := ARRAY(SELECT DISTINCT unnest(v_source_ids));

  IF array_length(v_source_ids, 1) IS NULL THEN
    RETURN jsonb_build_object('success', true, 'orders', 0, 'shipments', 0, 'addresses', 0);
  END IF;

  UPDATE public.orders
  SET customer_id = v_uid
  WHERE customer_id = ANY(v_source_ids);
  GET DIAGNOSTICS v_orders = ROW_COUNT;

  UPDATE public.shipment_orders
  SET customer_id = v_uid
  WHERE customer_id = ANY(v_source_ids);
  GET DIAGNOSTICS v_shipments = ROW_COUNT;

  UPDATE public.addresses
  SET user_id = v_uid
  WHERE user_id = ANY(v_source_ids)
    AND NOT EXISTS (
      SELECT 1 FROM public.addresses a
      WHERE a.user_id = v_uid AND a.address = public.addresses.address
    );
  GET DIAGNOSTICS v_addresses = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'orders', v_orders,
    'shipments', v_shipments,
    'addresses', v_addresses
  );
END;
$$;

REVOKE ALL ON FUNCTION public.merge_customer_activity(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_customer_activity(TEXT, UUID) TO authenticated;
