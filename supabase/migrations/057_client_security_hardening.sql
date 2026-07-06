-- Seguridad cliente: anti-fraude perfil, entrega bienvenida, merge invitado

-- 1) Permitir marcar entrega bienvenida UNA sola vez (el trigger la bloqueaba siempre)
CREATE OR REPLACE FUNCTION public.guard_users_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.role := OLD.role;
  NEW.account_status := OLD.account_status;
  NEW.email := OLD.email;

  IF OLD.welcome_delivery_used_at IS NULL AND NEW.welcome_delivery_used_at IS NOT NULL THEN
    NULL;
  ELSE
    NEW.welcome_delivery_used_at := OLD.welcome_delivery_used_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2) Marcar entrega bienvenida solo tras pedido válido del mismo usuario
CREATE OR REPLACE FUNCTION public.mark_welcome_delivery_used(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_order public.orders;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND customer_id = v_uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  IF NOT COALESCE(v_order.welcome_delivery_applied, FALSE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_applicable');
  END IF;

  UPDATE public.users
  SET welcome_delivery_used_at = NOW(), updated_at = NOW()
  WHERE id = v_uid AND welcome_delivery_used_at IS NULL;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.mark_welcome_delivery_used(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_welcome_delivery_used(UUID) TO authenticated;

-- 3) Merge invitado: solo sesión guest conocida — sin robar pedidos por teléfono ajeno
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
  v_orders INT := 0;
  v_shipments INT := 0;
  v_addresses INT := 0;
  v_guest_phone TEXT;
  v_target_phone TEXT;
  v_guest_digits TEXT;
  v_target_digits TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  IF p_phone IS NOT NULL AND length(trim(p_phone)) >= 10 THEN
    UPDATE public.users SET phone = trim(p_phone), updated_at = NOW() WHERE id = v_uid;
  END IF;

  IF p_guest_user_id IS NULL OR p_guest_user_id = v_uid THEN
    RETURN jsonb_build_object('success', true, 'orders', 0, 'shipments', 0, 'addresses', 0);
  END IF;

  SELECT phone INTO v_guest_phone FROM public.users WHERE id = p_guest_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'guest_not_found');
  END IF;

  SELECT phone INTO v_target_phone FROM public.users WHERE id = v_uid;

  v_guest_digits := right(regexp_replace(COALESCE(v_guest_phone, ''), '\D', '', 'g'), 10);
  v_target_digits := right(regexp_replace(COALESCE(v_target_phone, p_phone, ''), '\D', '', 'g'), 10);

  IF length(v_guest_digits) >= 10 AND length(v_target_digits) >= 10 AND v_guest_digits <> v_target_digits THEN
    RETURN jsonb_build_object('success', false, 'reason', 'phone_mismatch');
  END IF;

  UPDATE public.orders SET customer_id = v_uid WHERE customer_id = p_guest_user_id;
  GET DIAGNOSTICS v_orders = ROW_COUNT;

  UPDATE public.shipment_orders SET customer_id = v_uid WHERE customer_id = p_guest_user_id;
  GET DIAGNOSTICS v_shipments = ROW_COUNT;

  UPDATE public.addresses
  SET user_id = v_uid
  WHERE user_id = p_guest_user_id
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

-- 4) Perfil: columnas actualizables por el propio usuario (capa RLS)
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT u.role FROM public.users u WHERE u.id = auth.uid())
    AND account_status = (SELECT u.account_status FROM public.users u WHERE u.id = auth.uid())
    AND email = (SELECT u.email FROM public.users u WHERE u.id = auth.uid())
  );
