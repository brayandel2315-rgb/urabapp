-- UrabApp — Endurecimiento de seguridad (RPC courier, RLS riders, OTP, permisos)

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_otp_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_otp_locked_until TIMESTAMPTZ;

-- Helper: driver del usuario autenticado
CREATE OR REPLACE FUNCTION public.auth_driver_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.drivers WHERE user_id = auth.uid() LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.auth_driver_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_driver_id() TO authenticated;

-- ─── publish_courier_offers: solo dueño del pedido o admin ───────────────────
CREATE OR REPLACE FUNCTION public.publish_courier_offers(
  p_order_id UUID,
  p_radius_km INTEGER DEFAULT 3
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_payout INTEGER;
  v_count INTEGER := 0;
  v_driver RECORD;
  v_expires TIMESTAMPTZ := NOW() + INTERVAL '10 seconds';
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 0;
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN 0;
  END IF;
  IF v_order.customer_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RETURN 0;
  END IF;
  IF v_order.pickup_latitude IS NULL OR v_order.pickup_longitude IS NULL THEN
    RETURN 0;
  END IF;

  v_payout := COALESCE((v_order.fare_breakdown->>'riderPayout')::INT, v_order.rider_payout, 4000);

  UPDATE public.orders
  SET courier_search_radius_km = p_radius_km, courier_phase = 'searching'
  WHERE id = p_order_id;

  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude
    FROM public.drivers d
    WHERE d.is_online = TRUE
      AND d.is_verified = TRUE
      AND d.municipio = v_order.dest_municipio
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND public.haversine_km(
        d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION,
        v_order.pickup_latitude::DOUBLE PRECISION, v_order.pickup_longitude::DOUBLE PRECISION
      ) <= p_radius_km
  LOOP
    INSERT INTO public.courier_offers (
      order_id, driver_id, payout_estimate,
      distance_to_pickup_km, expires_at
    ) VALUES (
      p_order_id,
      v_driver.id,
      v_payout,
      public.haversine_km(
        v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION,
        v_order.pickup_latitude::DOUBLE PRECISION, v_order.pickup_longitude::DOUBLE PRECISION
      ),
      v_expires
    )
    ON CONFLICT (order_id, driver_id) DO UPDATE
      SET status = 'pending',
          expires_at = v_expires,
          payout_estimate = EXCLUDED.payout_estimate,
          distance_to_pickup_km = EXCLUDED.distance_to_pickup_km,
          responded_at = NULL;

    v_count := v_count + 1;
  END LOOP;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'searching', jsonb_build_object('radius_km', p_radius_km, 'offers', v_count));

  RETURN v_count;
END;
$$;

-- ─── accept_courier_offer: solo el mensajero dueño de la oferta ─────────────
CREATE OR REPLACE FUNCTION public.accept_courier_offer(
  p_order_id UUID,
  p_driver_id UUID
)
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
  IF p_driver_id IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;
  IF v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_courier');
  END IF;
  IF v_order.driver_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_assigned');
  END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.courier_offers
    WHERE order_id = p_order_id
      AND driver_id = p_driver_id
      AND status = 'pending'
      AND expires_at > NOW()
  ) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'offer_expired');
  END IF;

  UPDATE public.orders
  SET driver_id = p_driver_id,
      status = 'accepted',
      accepted_at = NOW(),
      courier_phase = 'assigned'
  WHERE id = p_order_id AND driver_id IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'race_lost');
  END IF;

  UPDATE public.courier_offers
  SET status = 'accepted', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id = p_driver_id;

  UPDATE public.courier_offers
  SET status = 'expired', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id <> p_driver_id AND status = 'pending';

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'accepted', jsonb_build_object('driver_id', p_driver_id));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── reject_courier_offer ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reject_courier_offer(
  p_order_id UUID,
  p_driver_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  IF p_driver_id IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN;
  END IF;

  UPDATE public.courier_offers
  SET status = 'rejected', responded_at = NOW()
  WHERE order_id = p_order_id
    AND driver_id = p_driver_id
    AND status = 'pending';
END;
$$;

-- ─── verify_courier_delivery_otp: mensajero asignado + límite intentos ───────
CREATE OR REPLACE FUNCTION public.verify_courier_delivery_otp(
  p_order_id UUID,
  p_code TEXT,
  p_driver_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_driver UUID := COALESCE(p_driver_id, public.auth_driver_id());
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_driver IS NULL OR v_order.driver_id IS DISTINCT FROM v_driver THEN
    IF NOT public.is_admin() THEN
      RETURN jsonb_build_object('success', false, 'reason', 'not_assigned');
    END IF;
  ELSIF v_driver IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  IF v_order.delivery_otp_locked_until IS NOT NULL AND v_order.delivery_otp_locked_until > NOW() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'locked');
  END IF;

  IF v_order.delivery_otp IS NULL OR v_order.delivery_otp <> TRIM(p_code) THEN
    UPDATE public.orders
    SET delivery_otp_attempts = delivery_otp_attempts + 1,
        delivery_otp_locked_until = CASE
          WHEN delivery_otp_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
          ELSE delivery_otp_locked_until
        END
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  IF v_order.delivery_otp_verified_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_verified', true);
  END IF;

  UPDATE public.orders
  SET delivery_otp_verified_at = NOW(),
      status = 'delivered',
      delivered_at = NOW(),
      courier_phase = 'delivered',
      delivery_otp_attempts = 0,
      delivery_otp_locked_until = NULL
  WHERE id = p_order_id;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'delivered', jsonb_build_object('otp_verified', true));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── set_courier_phase: solo mensajero asignado ─────────────────────────────
CREATE OR REPLACE FUNCTION public.set_courier_phase(
  p_order_id UUID,
  p_phase TEXT,
  p_event_type TEXT DEFAULT NULL,
  p_lat DECIMAL DEFAULT NULL,
  p_lng DECIMAL DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  IF NOT public.is_admin() AND NOT EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.drivers d ON d.id = o.driver_id
    WHERE o.id = p_order_id AND d.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE public.orders SET courier_phase = p_phase WHERE id = p_order_id;

  IF p_event_type IS NOT NULL THEN
    INSERT INTO public.courier_tracking_events (order_id, event_type, latitude, longitude)
    VALUES (p_order_id, p_event_type, p_lat, p_lng);
  END IF;

  IF p_phase = 'picked_up' THEN
    UPDATE public.orders SET picked_up_at = NOW(), status = 'on_the_way'
    WHERE id = p_order_id AND order_type = 'courier';
  ELSIF p_phase = 'arriving_pickup' THEN
    UPDATE public.orders SET status = 'accepted', courier_phase = 'arriving_pickup'
    WHERE id = p_order_id AND order_type = 'courier';
  END IF;
END;
$$;

-- Permisos RPC: solo usuarios autenticados
REVOKE ALL ON FUNCTION public.publish_courier_offers(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_courier_offer(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_courier_offer(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_courier_delivery_otp(UUID, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_courier_phase(UUID, TEXT, TEXT, DECIMAL, DECIMAL) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.publish_courier_offers(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_courier_offer(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_courier_offer(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_courier_delivery_otp(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_courier_phase(UUID, TEXT, TEXT, DECIMAL, DECIMAL) TO authenticated;

-- RLS: mensajeros pueden leer pedidos asignados o disponibles en su municipio
DROP POLICY IF EXISTS "orders_rider_read" ON public.orders;
DROP POLICY IF EXISTS orders_rider_read ON public.orders;

CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.user_id = auth.uid()
        AND (
          d.id = orders.driver_id
          OR (
            orders.driver_id IS NULL
            AND orders.status IN ('pending', 'accepted', 'preparing', 'on_the_way')
            AND orders.dest_municipio = d.municipio
          )
        )
    )
    OR (
      public.is_staff()
      AND orders.status IN ('accepted', 'preparing', 'on_the_way')
    )
  );

-- Tarifas courier: solo usuarios autenticados
DROP POLICY IF EXISTS courier_settings_read ON public.courier_settings;
CREATE POLICY courier_settings_read ON public.courier_settings
  FOR SELECT TO authenticated USING (TRUE);

-- Clientes: solo pueden cancelar pedidos pendientes (sin tocar driver/OTP)
DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
DROP POLICY IF EXISTS orders_update_own ON public.orders;
DROP POLICY IF EXISTS orders_customer_cancel ON public.orders;

CREATE POLICY orders_customer_cancel ON public.orders
  FOR UPDATE
  USING (auth.uid() = customer_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = customer_id
    AND status = 'cancelled'
    AND driver_id IS NULL
  );
