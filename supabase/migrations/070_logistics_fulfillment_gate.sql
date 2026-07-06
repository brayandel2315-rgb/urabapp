-- 070: Flujo logístico tienda → preparación → mensajero (estilo Rappi/DiDi)
-- La tienda DEBE marcar "en preparación" antes de publicar ofertas a mensajeros.

-- ─── Al crear pedido de tienda: solo notificar, NO publicar ofertas ─────────
CREATE OR REPLACE FUNCTION public.process_business_order_on_create()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_business RECORD;
  v_offers INTEGER;
BEGIN
  IF NEW.business_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.order_type = 'courier' THEN RETURN NEW; END IF;

  SELECT b.id, b.name, b.owner_id INTO v_business
  FROM public.businesses b WHERE b.id = NEW.business_id;

  IF v_business.owner_id IS NULL THEN
    -- Tiendas demo/seed sin dueño: auto-preparar y despachar
    UPDATE public.orders
    SET status = 'preparing',
        accepted_at = COALESCE(accepted_at, NOW())
    WHERE id = NEW.id AND status = 'pending';

    v_offers := public.publish_courier_offers(NEW.id, 5);
    IF v_offers = 0 THEN
      PERFORM public.publish_courier_offers(NEW.id, 12);
    END IF;
  ELSE
    INSERT INTO public.notifications (user_id, title, body, type, data)
    VALUES (
      v_business.owner_id,
      'Nuevo pedido ' || COALESCE(NEW.order_number, ''),
      COALESCE(v_business.name, 'Tu tienda') || ' — acepta y luego marca en preparación para enviar mensajero',
      'order',
      jsonb_build_object('order_id', NEW.id, 'url', '/comercio')
    );
    -- Sin publish_courier_offers: esperar status = preparing
  END IF;

  RETURN NEW;
END;
$$;

-- ─── Publicar ofertas solo cuando la tienda está en preparación ─────────────
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
  v_muni_lat DOUBLE PRECISION;
  v_muni_lng DOUBLE PRECISION;
BEGIN
  PERFORM public.expire_stale_courier_offers();

  SELECT o.* INTO v_order FROM public.orders o WHERE o.id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN RETURN 0; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN 0; END IF;
  IF v_order.status IN ('cancelled', 'delivered', 'on_the_way') THEN RETURN 0; END IF;

  IF v_order.order_type = 'courier' THEN
    IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN 0; END IF;
    IF v_order.pickup_latitude IS NULL OR v_order.pickup_longitude IS NULL THEN RETURN 0; END IF;
    v_pickup_lat := v_order.pickup_latitude::DOUBLE PRECISION;
    v_pickup_lng := v_order.pickup_longitude::DOUBLE PRECISION;
    v_offer_ttl := INTERVAL '90 seconds';
  ELSIF v_order.order_type IN ('commerce', 'envio') OR v_order.order_type IS NULL THEN
    IF v_order.business_id IS NOT NULL THEN
      -- Pedido de tienda: solo cuando la tienda marcó en preparación
      IF v_order.status <> 'preparing' THEN RETURN 0; END IF;
    ELSIF v_order.status NOT IN ('pending', 'accepted', 'preparing') THEN
      RETURN 0;
    END IF;
  ELSE
    RETURN 0;
  END IF;

  IF v_order.order_type != 'courier' THEN
    SELECT b.latitude, b.longitude INTO v_business FROM public.businesses b WHERE b.id = v_order.business_id;
    SELECT mc.lat, mc.lng INTO v_muni_lat, v_muni_lng FROM public.municipio_center_coords(v_order.dest_municipio) mc;
    IF v_business.latitude IS NOT NULL THEN
      v_pickup_lat := v_business.latitude::DOUBLE PRECISION; v_pickup_lng := v_business.longitude::DOUBLE PRECISION;
    ELSIF v_order.pickup_latitude IS NOT NULL THEN
      v_pickup_lat := v_order.pickup_latitude::DOUBLE PRECISION; v_pickup_lng := v_order.pickup_longitude::DOUBLE PRECISION;
    ELSIF v_muni_lat IS NOT NULL THEN
      v_pickup_lat := v_muni_lat; v_pickup_lng := v_muni_lng;
    ELSIF v_order.dest_latitude IS NOT NULL THEN
      v_pickup_lat := v_order.dest_latitude::DOUBLE PRECISION; v_pickup_lng := v_order.dest_longitude::DOUBLE PRECISION;
    ELSE RETURN 0; END IF;
    v_offer_ttl := INTERVAL '180 seconds';
  END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata', 'cards')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN RETURN 0; END IF;

  v_expires := NOW() + v_offer_ttl;
  v_payout := COALESCE((v_order.fare_breakdown->>'riderPayout')::INT, v_order.rider_payout, 4000);

  IF v_order.order_type = 'courier' THEN
    UPDATE public.orders SET courier_search_radius_km = p_radius_km, courier_phase = 'searching' WHERE id = p_order_id;
  END IF;

  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude FROM public.drivers d
    WHERE (d.is_online OR d.availability_mode = 'available')
      AND d.verification_status = 'approved'
      AND public.municipios_match(d.municipio, v_order.dest_municipio)
      AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
      AND public.haversine_km(d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng) <= p_radius_km
    ORDER BY public.haversine_km(d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng) LIMIT 12
  LOOP
    INSERT INTO public.courier_offers (order_id, driver_id, payout_estimate, distance_to_pickup_km, expires_at)
    VALUES (p_order_id, v_driver.id, v_payout, public.haversine_km(v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng), v_expires)
    ON CONFLICT (order_id, driver_id) DO UPDATE SET status = 'pending', expires_at = v_expires, payout_estimate = EXCLUDED.payout_estimate, distance_to_pickup_km = EXCLUDED.distance_to_pickup_km, responded_at = NULL;
    v_count := v_count + 1;
  END LOOP;

  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude FROM public.drivers d
    WHERE (d.is_online OR d.availability_mode = 'available')
      AND d.verification_status = 'approved'
      AND public.municipios_match(d.municipio, v_order.dest_municipio)
      AND NOT EXISTS (SELECT 1 FROM public.courier_offers co WHERE co.order_id = p_order_id AND co.driver_id = d.id AND co.status = 'pending' AND co.expires_at > NOW())
    ORDER BY CASE WHEN d.latitude IS NOT NULL THEN public.haversine_km(d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng) ELSE 9999 END
    LIMIT GREATEST(0, 12 - v_count)
  LOOP
    INSERT INTO public.courier_offers (order_id, driver_id, payout_estimate, distance_to_pickup_km, expires_at)
    VALUES (p_order_id, v_driver.id, v_payout, CASE WHEN v_driver.latitude IS NOT NULL THEN public.haversine_km(v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng) ELSE NULL END, v_expires)
    ON CONFLICT (order_id, driver_id) DO UPDATE SET status = 'pending', expires_at = v_expires, payout_estimate = EXCLUDED.payout_estimate, distance_to_pickup_km = EXCLUDED.distance_to_pickup_km, responded_at = NULL;
    v_count := v_count + 1;
  END LOOP;

  IF v_count > 0 THEN PERFORM public.notify_riders_courier_offers(p_order_id); END IF;
  RETURN v_count;
END;
$$;

-- ─── Aceptar oferta: tienda debe estar en preparación ───────────────────────
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
  PERFORM public.expire_stale_courier_offers();

  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  IF p_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'missing_driver');
  END IF;

  IF p_driver_id IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver
  FROM public.drivers
  WHERE id = p_driver_id
    AND verification_status = 'approved'
    AND (is_online = TRUE OR availability_mode = 'available');

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

  IF v_order.status IN ('cancelled', 'delivered') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF v_order.business_id IS NOT NULL AND COALESCE(v_order.order_type, 'commerce') <> 'courier' THEN
    IF v_order.status <> 'preparing' THEN
      RETURN jsonb_build_object('success', false, 'reason', 'store_not_ready');
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.courier_offers
    WHERE order_id = p_order_id
      AND driver_id = p_driver_id
      AND status = 'pending'
      AND expires_at > NOW()
  ) THEN
    PERFORM public.republish_order_offers_if_needed(p_order_id);
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

-- ─── Refresh: pedidos de tienda solo en preparing ─────────────────────────
CREATE OR REPLACE FUNCTION public.refresh_open_order_offers(p_municipio TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_total INTEGER := 0;
  v_n INTEGER;
  v_caller UUID := auth.uid();
BEGIN
  IF v_caller IS NOT NULL AND p_municipio IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.user_id = v_caller
        AND public.municipios_match(d.municipio, p_municipio)
        AND d.verification_status = 'approved'
    ) AND NOT EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = v_caller AND u.role = 'ADMIN'
    ) THEN
      RETURN 0;
    END IF;
  END IF;

  FOR v_order IN
    SELECT o.id
    FROM public.orders o
    WHERE o.driver_id IS NULL
      AND (o.order_type IS NULL OR o.order_type IN ('commerce', 'envio'))
      AND (
        (o.business_id IS NOT NULL AND o.status = 'preparing')
        OR (o.business_id IS NULL AND o.status IN ('pending', 'accepted', 'preparing'))
      )
      AND (p_municipio IS NULL OR public.municipios_match(o.dest_municipio, p_municipio))
      AND (o.payment_method = 'cash' OR o.payment_status = 'paid')
      AND NOT EXISTS (
        SELECT 1 FROM public.courier_offers co
        WHERE co.order_id = o.id AND co.status = 'pending' AND co.expires_at > NOW()
      )
  LOOP
    v_n := public.publish_courier_offers(v_order.id, 12);
    v_total := v_total + v_n;
  END LOOP;

  FOR v_order IN
    SELECT o.id
    FROM public.orders o
    WHERE o.driver_id IS NULL
      AND o.order_type = 'courier'
      AND o.status IN ('pending', 'accepted')
      AND (p_municipio IS NULL OR public.municipios_match(o.dest_municipio, p_municipio))
      AND (o.payment_method = 'cash' OR o.payment_status = 'paid')
      AND NOT EXISTS (
        SELECT 1 FROM public.courier_offers co
        WHERE co.order_id = o.id AND co.status = 'pending' AND co.expires_at > NOW()
      )
  LOOP
    v_n := public.publish_courier_offers(v_order.id, 12);
    v_total := v_total + v_n;
  END LOOP;

  RETURN v_total;
END;
$$;

-- ─── Despacho al marcar preparación (sin cambios de lógica) ─────────────────
CREATE OR REPLACE FUNCTION public.dispatch_rider_on_preparing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_offers INTEGER;
BEGIN
  IF NEW.business_id IS NULL THEN RETURN NEW; END IF;
  IF NEW.order_type = 'courier' THEN RETURN NEW; END IF;
  IF NEW.driver_id IS NOT NULL THEN RETURN NEW; END IF;

  IF NEW.status = 'preparing'
     AND (OLD.status IS DISTINCT FROM 'preparing')
     AND NEW.status NOT IN ('cancelled', 'delivered') THEN
    v_offers := public.publish_courier_offers(NEW.id, 5);
    IF v_offers = 0 THEN
      PERFORM public.publish_courier_offers(NEW.id, 12);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;
