-- 060: Motor unificado de asignación — oferta + aceptación (comercio + mandado + courier)
-- Estándar marketplace: el mensajero que acepta es quien recoge y entrega.

-- ─── Publicar ofertas (commerce, courier, envio en orders) ─────────────────────
CREATE OR REPLACE FUNCTION public.publish_courier_offers(
  p_order_id UUID,
  p_radius_km INTEGER DEFAULT 5
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_business RECORD;
  v_payout INTEGER;
  v_count INTEGER := 0;
  v_driver RECORD;
  v_pickup_lat DOUBLE PRECISION;
  v_pickup_lng DOUBLE PRECISION;
  v_offer_ttl INTERVAL;
  v_expires TIMESTAMPTZ;
BEGIN
  SELECT o.* INTO v_order
  FROM public.orders o
  WHERE o.id = p_order_id
  FOR UPDATE;

  IF v_order IS NULL THEN RETURN 0; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN 0; END IF;
  IF v_order.status IN ('cancelled', 'delivered', 'on_the_way') THEN RETURN 0; END IF;

  IF v_order.order_type = 'courier' THEN
    IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN 0; END IF;
    IF v_order.pickup_latitude IS NULL OR v_order.pickup_longitude IS NULL THEN RETURN 0; END IF;
    v_pickup_lat := v_order.pickup_latitude::DOUBLE PRECISION;
    v_pickup_lng := v_order.pickup_longitude::DOUBLE PRECISION;
    v_offer_ttl := INTERVAL '30 seconds';
  ELSIF v_order.order_type IN ('commerce', 'envio') OR v_order.order_type IS NULL THEN
    IF v_order.business_id IS NOT NULL AND v_order.status NOT IN ('accepted', 'preparing') THEN
      RETURN 0;
    END IF;
    IF v_order.business_id IS NULL AND v_order.status NOT IN ('pending', 'accepted', 'preparing') THEN
      RETURN 0;
    END IF;
  ELSE
    RETURN 0;
  END IF;

  IF v_order.order_type = 'courier' THEN
    NULL;
  ELSE
    SELECT b.latitude, b.longitude, b.address, b.municipio
    INTO v_business
    FROM public.businesses b
    WHERE b.id = v_order.business_id;

    IF v_business.latitude IS NOT NULL AND v_business.longitude IS NOT NULL THEN
      v_pickup_lat := v_business.latitude::DOUBLE PRECISION;
      v_pickup_lng := v_business.longitude::DOUBLE PRECISION;
    ELSIF v_order.dest_latitude IS NOT NULL AND v_order.dest_longitude IS NOT NULL THEN
      v_pickup_lat := v_order.dest_latitude::DOUBLE PRECISION;
      v_pickup_lng := v_order.dest_longitude::DOUBLE PRECISION;
    ELSE
      RETURN 0;
    END IF;
    v_offer_ttl := INTERVAL '45 seconds';
  END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata', 'cards')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN 0;
  END IF;

  v_expires := NOW() + v_offer_ttl;
  v_payout := COALESCE((v_order.fare_breakdown->>'riderPayout')::INT, v_order.rider_payout, 4000);

  IF v_order.order_type = 'courier' THEN
    UPDATE public.orders
    SET courier_search_radius_km = p_radius_km, courier_phase = 'searching'
    WHERE id = p_order_id;
  END IF;

  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude
    FROM public.drivers d
    WHERE d.is_online = TRUE
      AND d.verification_status = 'approved'
      AND d.municipio = v_order.dest_municipio
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND public.haversine_km(
        d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION,
        v_pickup_lat, v_pickup_lng
      ) <= p_radius_km
    ORDER BY public.haversine_km(
      d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION,
      v_pickup_lat, v_pickup_lng
    )
    LIMIT 12
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
        v_pickup_lat, v_pickup_lng
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

  IF v_order.order_type = 'courier' THEN
    INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
    VALUES (p_order_id, 'searching', jsonb_build_object('radius_km', p_radius_km, 'offers', v_count));
  END IF;

  RETURN v_count;
END;
$$;

-- ─── Aceptar oferta — primer mensajero gana; él recoge y entrega ─────────────
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
  v_driver RECORD;
BEGIN
  IF p_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'missing_driver');
  END IF;

  SELECT * INTO v_driver
  FROM public.drivers
  WHERE id = p_driver_id
    AND verification_status = 'approved'
    AND is_online = TRUE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'driver_not_available');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;
  IF v_order.order_type NOT IN ('courier', 'commerce', 'envio') AND v_order.order_type IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unsupported_type');
  END IF;
  IF v_order.driver_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_assigned');
  END IF;
  IF v_order.status IN ('cancelled', 'delivered', 'on_the_way') THEN
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

  IF v_order.order_type = 'courier' THEN
    UPDATE public.orders
    SET driver_id = p_driver_id,
        status = 'accepted',
        accepted_at = COALESCE(accepted_at, NOW()),
        courier_phase = 'assigned'
    WHERE id = p_order_id AND driver_id IS NULL;
  ELSE
  -- Comercio: el mensajero queda asignado sin saltarse el flujo del comercio
    UPDATE public.orders
    SET driver_id = p_driver_id
    WHERE id = p_order_id AND driver_id IS NULL;
  END IF;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'race_lost');
  END IF;

  UPDATE public.courier_offers
  SET status = 'accepted', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id = p_driver_id;

  UPDATE public.courier_offers
  SET status = 'expired', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id <> p_driver_id AND status = 'pending';

  IF v_order.order_type = 'courier' THEN
    INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
    VALUES (p_order_id, 'accepted', jsonb_build_object('driver_id', p_driver_id));
  END IF;

  RETURN jsonb_build_object('success', true, 'driver_id', p_driver_id);
END;
$$;

-- ─── assign_best_rider: solo fallback admin — no reemplaza aceptación ────────
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
  v_pickup_lat DOUBLE PRECISION;
  v_pickup_lng DOUBLE PRECISION;
BEGIN
  SELECT o.id, o.driver_id, o.status, o.dest_municipio, o.dest_latitude, o.dest_longitude,
         o.payment_method, o.payment_status, o.customer_id, o.business_id,
         o.order_type, o.pickup_latitude, o.pickup_longitude
  INTO v_order
  FROM public.orders o
  WHERE o.id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN v_order.driver_id; END IF;

  -- Courier y comercio usan ofertas con aceptación explícita
  IF v_order.order_type = 'courier' THEN RETURN NULL; END IF;
  IF v_order.business_id IS NOT NULL THEN RETURN NULL; END IF;
  IF v_order.status NOT IN ('pending', 'accepted', 'preparing') THEN RETURN NULL; END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata', 'cards')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  IF auth.uid() IS NULL OR public.is_admin()
     OR v_order.customer_id = auth.uid()
     OR (v_order.business_id IS NOT NULL AND EXISTS (
       SELECT 1 FROM public.businesses b WHERE b.id = v_order.business_id AND b.owner_id = auth.uid()
     )) THEN
    v_allowed := TRUE;
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'unauthorized_rider_assignment';
  END IF;

  IF v_order.pickup_latitude IS NOT NULL THEN
    v_pickup_lat := v_order.pickup_latitude::DOUBLE PRECISION;
    v_pickup_lng := v_order.pickup_longitude::DOUBLE PRECISION;
  ELSIF v_order.dest_latitude IS NOT NULL THEN
    v_pickup_lat := v_order.dest_latitude::DOUBLE PRECISION;
    v_pickup_lng := v_order.dest_longitude::DOUBLE PRECISION;
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = TRUE
    AND d.verification_status = 'approved'
    AND d.municipio = v_order.dest_municipio
  ORDER BY
    CASE
      WHEN v_pickup_lat IS NOT NULL AND d.latitude IS NOT NULL THEN
        POWER(d.latitude::float - v_pickup_lat, 2)
        + POWER(d.longitude::float - v_pickup_lng, 2)
      ELSE 999999
    END,
    d.total_deliveries ASC NULLS LAST,
    d.rating DESC NULLS LAST
  LIMIT 1;

  IF v_rider_id IS NULL THEN RETURN NULL; END IF;

  -- Solo asigna driver_id; no altera el estado del comercio
  UPDATE public.orders
  SET driver_id = v_rider_id
  WHERE id = p_order_id;

  RETURN v_rider_id;
END;
$$;

-- ─── Trigger: publicar ofertas al crear (no push-assign) ─────────────────────
CREATE OR REPLACE FUNCTION public.auto_assign_rider_on_cash_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Courier: ofertas vía publish_courier_offers en la app
  IF NEW.order_type = 'courier' THEN
    RETURN NEW;
  END IF;

  -- Comercio: esperar a que marque "en preparación"
  IF NEW.business_id IS NOT NULL THEN
    RETURN NEW;
  END IF;

  -- Mandado/envio sin comercio: publicar ofertas (efectivo o ya pagado)
  IF NEW.driver_id IS NULL
     AND NEW.status IN ('pending', 'accepted')
     AND (
       NEW.payment_method = 'cash'
       OR NEW.payment_status = 'paid'
     ) THEN
    PERFORM public.publish_courier_offers(NEW.id, 5);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_assign_rider_on_order ON public.orders;
CREATE TRIGGER trg_auto_assign_rider_on_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_rider_on_cash_order();

-- ─── Al pasar a "preparing": despachar ofertas a mensajeros cercanos ─────────
CREATE OR REPLACE FUNCTION public.dispatch_rider_on_preparing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.business_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.order_type = 'courier' THEN RETURN NEW; END IF;
  IF NEW.driver_id IS NOT NULL THEN RETURN NEW; END IF;

  IF NEW.status = 'preparing'
     AND (OLD.status IS DISTINCT FROM 'preparing')
     AND NEW.status NOT IN ('cancelled', 'delivered') THEN
    PERFORM public.publish_courier_offers(NEW.id, 5);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_dispatch_rider_on_preparing ON public.orders;
CREATE TRIGGER trg_dispatch_rider_on_preparing
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.dispatch_rider_on_preparing();

GRANT EXECUTE ON FUNCTION public.publish_courier_offers(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.publish_courier_offers(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_courier_offer(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.accept_courier_offer(UUID, UUID) TO authenticated;
