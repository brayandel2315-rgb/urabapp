-- 062: Ofertas a TODOS los mensajeros online del municipio (no solo si radio vacío)

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
    v_offer_ttl := INTERVAL '60 seconds';
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
    SELECT b.latitude, b.longitude INTO v_business
    FROM public.businesses b WHERE b.id = v_order.business_id;

    SELECT mc.lat, mc.lng INTO v_muni_lat, v_muni_lng
    FROM public.municipio_center_coords(v_order.dest_municipio) mc;

    IF v_business.latitude IS NOT NULL AND v_business.longitude IS NOT NULL THEN
      v_pickup_lat := v_business.latitude::DOUBLE PRECISION;
      v_pickup_lng := v_business.longitude::DOUBLE PRECISION;
    ELSIF v_order.pickup_latitude IS NOT NULL AND v_order.pickup_longitude IS NOT NULL THEN
      v_pickup_lat := v_order.pickup_latitude::DOUBLE PRECISION;
      v_pickup_lng := v_order.pickup_longitude::DOUBLE PRECISION;
    ELSIF v_muni_lat IS NOT NULL THEN
      v_pickup_lat := v_muni_lat;
      v_pickup_lng := v_muni_lng;
    ELSIF v_order.dest_latitude IS NOT NULL AND v_order.dest_longitude IS NOT NULL THEN
      v_pickup_lat := v_order.dest_latitude::DOUBLE PRECISION;
      v_pickup_lng := v_order.dest_longitude::DOUBLE PRECISION;
    ELSE
      RETURN 0;
    END IF;
    v_offer_ttl := INTERVAL '90 seconds';
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

  -- 1) Mensajeros cercanos por radio
  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude
    FROM public.drivers d
    WHERE d.is_online = TRUE
      AND d.verification_status = 'approved'
      AND d.municipio = v_order.dest_municipio
      AND d.latitude IS NOT NULL AND d.longitude IS NOT NULL
      AND public.haversine_km(d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng) <= p_radius_km
    ORDER BY public.haversine_km(d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng)
    LIMIT 12
  LOOP
    INSERT INTO public.courier_offers (order_id, driver_id, payout_estimate, distance_to_pickup_km, expires_at)
    VALUES (p_order_id, v_driver.id, v_payout,
      public.haversine_km(v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng),
      v_expires)
    ON CONFLICT (order_id, driver_id) DO UPDATE
      SET status = 'pending', expires_at = v_expires, payout_estimate = EXCLUDED.payout_estimate,
          distance_to_pickup_km = EXCLUDED.distance_to_pickup_km, responded_at = NULL;
    v_count := v_count + 1;
  END LOOP;

  -- 2) Siempre incluir mensajeros online del mismo municipio (estándar Rappi/Uber)
  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude
    FROM public.drivers d
    WHERE d.is_online = TRUE
      AND d.verification_status = 'approved'
      AND d.municipio = v_order.dest_municipio
      AND NOT EXISTS (
        SELECT 1 FROM public.courier_offers co
        WHERE co.order_id = p_order_id AND co.driver_id = d.id AND co.status = 'pending' AND co.expires_at > NOW()
      )
    ORDER BY CASE WHEN d.latitude IS NOT NULL AND d.longitude IS NOT NULL THEN
      public.haversine_km(d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng)
    ELSE 9999 END
    LIMIT GREATEST(0, 12 - v_count)
  LOOP
    INSERT INTO public.courier_offers (order_id, driver_id, payout_estimate, distance_to_pickup_km, expires_at)
    VALUES (p_order_id, v_driver.id, v_payout,
      CASE WHEN v_driver.latitude IS NOT NULL THEN
        public.haversine_km(v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION, v_pickup_lat, v_pickup_lng)
      ELSE NULL END, v_expires)
    ON CONFLICT (order_id, driver_id) DO UPDATE
      SET status = 'pending', expires_at = v_expires, payout_estimate = EXCLUDED.payout_estimate,
          distance_to_pickup_km = EXCLUDED.distance_to_pickup_km, responded_at = NULL;
    v_count := v_count + 1;
  END LOOP;

  IF v_order.order_type = 'courier' THEN
    INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
    VALUES (p_order_id, 'searching', jsonb_build_object('radius_km', p_radius_km, 'offers', v_count));
  END IF;

  IF v_count > 0 THEN
    PERFORM public.notify_riders_courier_offers(p_order_id);
  END IF;

  RETURN v_count;
END;
$$;
