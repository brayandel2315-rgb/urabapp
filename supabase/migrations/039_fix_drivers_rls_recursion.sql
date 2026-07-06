-- Fix: infinite recursion drivers <-> orders en políticas RLS
-- Causa: drivers_customer_assigned_read → orders → orders_driver_read → drivers

-- Municipio del mensajero autenticado (sin RLS)
CREATE OR REPLACE FUNCTION public.auth_driver_municipio()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT municipio FROM public.drivers WHERE user_id = auth.uid() LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.auth_driver_municipio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_driver_municipio() TO authenticated;

-- Cliente con pedido activo asignado a este mensajero (sin RLS en orders)
CREATE OR REPLACE FUNCTION public.customer_assigned_to_driver(p_driver_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.driver_id = p_driver_id
      AND o.customer_id = auth.uid()
      AND o.status IN ('accepted', 'preparing', 'on_the_way')
  );
$$;

REVOKE ALL ON FUNCTION public.customer_assigned_to_driver(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.customer_assigned_to_driver(UUID) TO authenticated;

-- ─── Políticas drivers (sin subconsulta circular a orders con RLS) ───────────
DROP POLICY IF EXISTS "drivers_customer_assigned_read" ON public.drivers;
DROP POLICY IF EXISTS drivers_customer_assigned_read ON public.drivers;
CREATE POLICY drivers_customer_assigned_read ON public.drivers
  FOR SELECT USING (public.customer_assigned_to_driver(id));

DROP POLICY IF EXISTS "drivers_own" ON public.drivers;
DROP POLICY IF EXISTS drivers_own ON public.drivers;
DROP POLICY IF EXISTS drivers_insert_own ON public.drivers;
DROP POLICY IF EXISTS drivers_update_own ON public.drivers;
DROP POLICY IF EXISTS drivers_select_own ON public.drivers;

CREATE POLICY drivers_insert_own ON public.drivers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY drivers_select_own ON public.drivers
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR public.is_staff()
    OR public.customer_assigned_to_driver(id)
  );

CREATE POLICY drivers_update_own ON public.drivers
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Admin ya cubierto por drivers_admin_read; evitar duplicar FOR ALL
DROP POLICY IF EXISTS "drivers_admin_read" ON public.drivers;
DROP POLICY IF EXISTS drivers_admin_read ON public.drivers;

-- ─── Políticas orders (usar auth_driver_id en lugar de subquery drivers) ─────
DROP POLICY IF EXISTS orders_driver_read ON public.orders;
DROP POLICY IF EXISTS "orders_rider_read" ON public.orders;
DROP POLICY IF EXISTS orders_rider_read ON public.orders;

CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.auth_driver_id() IS NOT NULL
      AND (
        driver_id = public.auth_driver_id()
        OR (
          driver_id IS NULL
          AND status IN ('pending', 'accepted', 'preparing', 'on_the_way')
          AND dest_municipio = public.auth_driver_municipio()
        )
      )
    )
    OR (
      public.is_staff()
      AND status IN ('accepted', 'preparing', 'on_the_way')
    )
  );

-- ─── RPC registro mensajero (atómico, evita edge cases RLS) ─────────────────
CREATE OR REPLACE FUNCTION public.register_driver(
  p_name TEXT,
  p_phone TEXT,
  p_municipio TEXT,
  p_vehicle TEXT DEFAULT 'moto',
  p_plate TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_name TEXT := TRIM(COALESCE(p_name, ''));
  v_phone TEXT := TRIM(COALESCE(p_phone, ''));
  v_municipio TEXT := TRIM(COALESCE(p_municipio, ''));
  v_vehicle TEXT := COALESCE(NULLIF(TRIM(p_vehicle), ''), 'moto');
  v_plate TEXT := TRIM(COALESCE(p_plate, ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;
  IF length(v_name) < 2 THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_name');
  END IF;
  IF length(regexp_replace(v_phone, '\D', '', 'g')) < 10 THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_phone');
  END IF;
  IF v_municipio = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_municipio');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_exists', true,
      'driver', to_jsonb(v_driver)
    );
  END IF;

  INSERT INTO public.drivers (
    user_id, name, phone, municipio, vehicle, plate, is_online, is_verified
  ) VALUES (
    auth.uid(), v_name, v_phone, v_municipio, v_vehicle, v_plate, false, true
  )
  RETURNING * INTO v_driver;

  UPDATE public.users
  SET role = 'RIDER', updated_at = NOW()
  WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_driver_profile()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(d)
  FROM public.drivers d
  WHERE d.user_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.register_driver(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_driver_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_driver(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_driver_profile() TO authenticated;
