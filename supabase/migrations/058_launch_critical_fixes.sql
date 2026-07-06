-- Urabapp — 8 bloqueadores críticos de lanzamiento
-- 1) Comercio no puede auto-aprobar
-- 2) RLS pedidos: mensajero solo asignado + dueño comercio
-- 3) Envíos cash: INSERT shipment_payments
-- 4) RPCs envío con autorización
-- 5) assign_best_rider solo caller autorizado

-- ─── 1. Bloquear auto-aprobación comercio (verificación / publicación) ───────
CREATE OR REPLACE FUNCTION public.guard_business_verification_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.verification_status IS DISTINCT FROM 'pending'
       AND NEW.verification_status IS NOT NULL THEN
      NEW.verification_status := 'pending';
    END IF;
    IF NEW.is_published IS DISTINCT FROM FALSE
       AND NEW.is_published IS NOT NULL THEN
      NEW.is_published := FALSE;
    END IF;
    NEW.approved_at := NULL;
    NEW.approved_by := NULL;
    RETURN NEW;
  END IF;

  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status
     OR NEW.is_published IS DISTINCT FROM OLD.is_published
     OR NEW.approved_at IS DISTINCT FROM OLD.approved_at
     OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
     OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason
  THEN
    RAISE EXCEPTION 'verification_fields_locked'
      USING HINT = 'Solo Urabapp (admin) puede aprobar o publicar comercios';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_business_verification ON public.businesses;
CREATE TRIGGER trg_guard_business_verification
  BEFORE INSERT OR UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_business_verification_fields();

-- ─── 2. RLS pedidos: reemplazar orders_staff_update permisivo ────────────────
DROP POLICY IF EXISTS "orders_staff_update" ON public.orders;
DROP POLICY IF EXISTS orders_staff_update ON public.orders;

DROP POLICY IF EXISTS orders_business_owner_update ON public.orders;
CREATE POLICY orders_business_owner_update ON public.orders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS orders_rider_assigned_update ON public.orders;
CREATE POLICY orders_rider_assigned_update ON public.orders
  FOR UPDATE
  USING (
    public.auth_driver_id() IS NOT NULL
    AND (
      driver_id = public.auth_driver_id()
      OR (
        driver_id IS NULL
        AND status IN ('pending', 'accepted', 'preparing')
      )
    )
  )
  WITH CHECK (
    public.auth_driver_id() IS NOT NULL
    AND driver_id = public.auth_driver_id()
  );

-- Lectura mensajero: solo pedidos asignados o disponibles en su municipio
DROP POLICY IF EXISTS orders_driver_read ON public.orders;
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
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

-- ─── 3. Envíos cash: INSERT en shipment_payments ─────────────────────────────
DROP POLICY IF EXISTS shipment_payments_customer_insert ON public.shipment_payments;
CREATE POLICY shipment_payments_customer_insert ON public.shipment_payments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND s.customer_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS shipment_payments_customer_update ON public.shipment_payments;
CREATE POLICY shipment_payments_customer_update ON public.shipment_payments
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND s.customer_id = auth.uid()
    )
    OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND s.customer_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ─── 4. RPCs envío: autorización caller ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.assert_shipment_actor(p_shipment_id UUID, p_allow_customer BOOLEAN DEFAULT TRUE)
RETURNS public.shipment_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shipment public.shipment_orders%ROWTYPE;
BEGIN
  SELECT * INTO v_shipment FROM public.shipment_orders WHERE id = p_shipment_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Envío no encontrado';
  END IF;

  IF public.is_admin() OR auth.uid() IS NULL THEN
    RETURN v_shipment;
  END IF;

  IF p_allow_customer AND v_shipment.customer_id = auth.uid() THEN
    RETURN v_shipment;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.drivers d
    WHERE d.user_id = auth.uid()
      AND (
        d.id = v_shipment.assigned_driver_id
        OR EXISTS (
          SELECT 1 FROM public.shipment_assignments sa
          WHERE sa.shipment_id = p_shipment_id
            AND sa.driver_id = d.id
            AND sa.status IN ('pending', 'accepted')
        )
      )
  ) THEN
    RETURN v_shipment;
  END IF;

  RAISE EXCEPTION 'unauthorized_shipment_action'
    USING HINT = 'No tienes permiso sobre este envío';
END;
$$;

REVOKE ALL ON FUNCTION public.assert_shipment_actor(UUID, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assert_shipment_actor(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assert_shipment_actor(UUID, BOOLEAN) TO service_role;

CREATE OR REPLACE FUNCTION public.log_shipment_event(
  p_shipment_id UUID,
  p_event_type TEXT,
  p_status TEXT DEFAULT NULL,
  p_lat DECIMAL DEFAULT NULL,
  p_lng DECIMAL DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  PERFORM public.assert_shipment_actor(p_shipment_id, TRUE);

  INSERT INTO public.shipment_events (shipment_id, event_type, status, latitude, longitude, metadata)
  VALUES (p_shipment_id, p_event_type, p_status, p_lat, p_lng, p_metadata)
  RETURNING id INTO v_id;

  IF p_status IS NOT NULL THEN
    UPDATE public.shipment_orders SET status = p_status WHERE id = p_shipment_id;
  END IF;

  IF p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
    UPDATE public.shipment_orders
    SET current_latitude = p_lat, current_longitude = p_lng
    WHERE id = p_shipment_id;

    INSERT INTO public.shipment_tracking (shipment_id, latitude, longitude)
    VALUES (p_shipment_id, p_lat, p_lng);
  END IF;

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_shipment_assignments(p_shipment_id UUID, p_limit INT DEFAULT 5)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shipment public.shipment_orders%ROWTYPE;
  v_inserted INT := 0;
BEGIN
  SELECT * INTO v_shipment FROM public.assert_shipment_actor(p_shipment_id, TRUE);

  IF NOT public.is_admin() AND auth.uid() IS NOT NULL AND v_shipment.customer_id <> auth.uid() THEN
    RAISE EXCEPTION 'unauthorized_shipment_action';
  END IF;

  UPDATE public.shipment_assignments SET status = 'expired'
  WHERE shipment_id = p_shipment_id AND status = 'pending';

  INSERT INTO public.shipment_assignments (shipment_id, driver_id, rank_score, expires_at)
  SELECT
    p_shipment_id,
    d.id,
    (
      CASE WHEN d.municipio = v_shipment.origin_municipio THEN 40 ELSE 0 END
      + CASE WHEN d.is_online THEN 25 ELSE 0 END
      + LEAST(COALESCE(d.total_deliveries, 0), 50) * 0.3
      + COALESCE(d.rating, 5) * 4
      + CASE WHEN d.is_verified THEN 10 ELSE 0 END
    )::DECIMAL(8,2),
    NOW() + INTERVAL '8 minutes'
  FROM public.drivers d
  WHERE d.is_online = TRUE
    AND d.is_verified = TRUE
    AND d.municipio IN (v_shipment.origin_municipio, v_shipment.dest_municipio)
  ORDER BY (
      CASE WHEN d.municipio = v_shipment.origin_municipio THEN 40 ELSE 0 END
      + CASE WHEN d.is_online THEN 25 ELSE 0 END
      + LEAST(COALESCE(d.total_deliveries, 0), 50) * 0.3
      + COALESCE(d.rating, 5) * 4
      + CASE WHEN d.is_verified THEN 10 ELSE 0 END
    ) DESC
  LIMIT p_limit
  ON CONFLICT (shipment_id, driver_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  PERFORM public.log_shipment_event(
    p_shipment_id, 'assignment_published', 'searching_carrier', NULL, NULL,
    jsonb_build_object('candidates', v_inserted)
  );

  RETURN v_inserted;
END;
$$;

-- ─── 5. assign_best_rider: solo admin, cliente, dueño comercio o service ─────
CREATE OR REPLACE FUNCTION public.assign_best_rider(p_order_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_rider_id UUID;
  v_allowed BOOLEAN := FALSE;
BEGIN
  SELECT o.id, o.driver_id, o.status, o.dest_municipio, o.dest_latitude, o.dest_longitude,
         o.payment_method, o.payment_status, o.customer_id, o.business_id
  INTO v_order
  FROM public.orders o
  WHERE o.id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN v_order.driver_id; END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN NULL; END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  IF auth.uid() IS NULL THEN
    v_allowed := TRUE;
  ELSIF public.is_admin() THEN
    v_allowed := TRUE;
  ELSIF v_order.customer_id = auth.uid() THEN
    v_allowed := TRUE;
  ELSIF v_order.business_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = v_order.business_id AND b.owner_id = auth.uid()
  ) THEN
    v_allowed := TRUE;
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'unauthorized_rider_assignment';
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = TRUE
    AND d.is_verified = TRUE
    AND d.verification_status = 'approved'
    AND d.municipio = v_order.dest_municipio
  ORDER BY
    CASE
      WHEN v_order.dest_latitude IS NOT NULL AND d.latitude IS NOT NULL THEN
        POWER(d.latitude::float - v_order.dest_latitude::float, 2)
        + POWER(d.longitude::float - v_order.dest_longitude::float, 2)
      ELSE 999999
    END,
    d.total_deliveries ASC NULLS LAST,
    d.rating DESC NULLS LAST
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

GRANT EXECUTE ON FUNCTION public.log_shipment_event(UUID, TEXT, TEXT, DECIMAL, DECIMAL, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_shipment_assignments(UUID, INT) TO authenticated;
