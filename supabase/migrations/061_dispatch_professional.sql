-- 061: Despacho profesional — auto-confirm catálogo, fallback municipio, notificaciones rider

CREATE OR REPLACE FUNCTION public.municipio_center_coords(p_municipio TEXT)
RETURNS TABLE(lat DOUBLE PRECISION, lng DOUBLE PRECISION)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    CASE COALESCE(NULLIF(TRIM(p_municipio), ''), 'Apartadó')
      WHEN 'Necoclí' THEN 8.6603
      WHEN 'Turbo' THEN 8.0925
      WHEN 'Apartadó' THEN 7.8837
      WHEN 'Carepa' THEN 7.8044
      WHEN 'Chigorodó' THEN 7.6669
      WHEN 'San Pedro de Urabá' THEN 8.0000
      WHEN 'San Pedro' THEN 8.0000
      WHEN 'Arboletes' THEN 8.8500
      ELSE 7.8837
    END::DOUBLE PRECISION,
    CASE COALESCE(NULLIF(TRIM(p_municipio), ''), 'Apartadó')
      WHEN 'Necoclí' THEN -76.7894
      WHEN 'Turbo' THEN -76.7289
      WHEN 'Apartadó' THEN -76.6319
      WHEN 'Carepa' THEN -76.6803
      WHEN 'Chigorodó' THEN -76.6803
      WHEN 'San Pedro de Urabá' THEN -76.2000
      WHEN 'San Pedro' THEN -76.2000
      WHEN 'Arboletes' THEN -76.4300
      ELSE -76.6319
    END::DOUBLE PRECISION;
$$;

CREATE OR REPLACE FUNCTION public.notify_riders_courier_offers(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT order_number, dest_municipio INTO v_order
  FROM public.orders WHERE id = p_order_id;

  INSERT INTO public.notifications (user_id, title, body, type, data)
  SELECT DISTINCT d.user_id,
    'Nueva entrega disponible',
    'Pedido ' || COALESCE(v_order.order_number, LEFT(p_order_id::TEXT, 8))
      || ' en ' || COALESCE(v_order.dest_municipio, 'Urabá'),
    'order',
    jsonb_build_object('order_id', p_order_id, 'role', 'rider', 'url', '/domiciliario')
  FROM public.courier_offers co
  JOIN public.drivers d ON d.id = co.driver_id
  WHERE co.order_id = p_order_id
    AND co.status = 'pending'
    AND co.expires_at > NOW()
    AND d.user_id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM public.notifications n
      WHERE n.user_id = d.user_id
        AND n.type = 'order'
        AND n.data->>'order_id' = p_order_id::TEXT
        AND n.created_at > NOW() - INTERVAL '2 minutes'
    );
END;
$$;

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
    SELECT b.latitude, b.longitude, b.address, b.municipio
    INTO v_business
    FROM public.businesses b
    WHERE b.id = v_order.business_id;

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

  -- Fallback: todos los mensajeros online del mismo municipio (GPS impreciso / pruebas)
  IF v_count = 0 THEN
    FOR v_driver IN
      SELECT d.id, d.latitude, d.longitude
      FROM public.drivers d
      WHERE d.is_online = TRUE
        AND d.verification_status = 'approved'
        AND d.municipio = v_order.dest_municipio
      ORDER BY
        CASE WHEN d.latitude IS NOT NULL AND d.longitude IS NOT NULL THEN
          public.haversine_km(
            d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION,
            v_pickup_lat, v_pickup_lng
          )
        ELSE 9999 END
      LIMIT 12
    LOOP
      INSERT INTO public.courier_offers (
        order_id, driver_id, payout_estimate,
        distance_to_pickup_km, expires_at
      ) VALUES (
        p_order_id,
        v_driver.id,
        v_payout,
        CASE WHEN v_driver.latitude IS NOT NULL AND v_driver.longitude IS NOT NULL THEN
          public.haversine_km(
            v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION,
            v_pickup_lat, v_pickup_lng
          )
        ELSE NULL END,
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
  END IF;

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

-- Auto-confirmar pedidos de catálogo sin dueño + despachar mensajeros
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
  IF NEW.business_id IS NULL OR NEW.order_type = 'courier' THEN
    RETURN NEW;
  END IF;
  IF NEW.driver_id IS NOT NULL THEN RETURN NEW; END IF;

  IF NEW.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata', 'cards')
     AND NEW.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NEW;
  END IF;

  SELECT id, owner_id, is_open, name INTO v_business
  FROM public.businesses WHERE id = NEW.business_id;

  IF v_business.owner_id IS NULL THEN
    UPDATE public.orders
    SET status = 'preparing',
        accepted_at = COALESCE(accepted_at, NOW())
    WHERE id = NEW.id AND status = 'pending';

    v_offers := public.publish_courier_offers(NEW.id, 5);
    IF v_offers = 0 THEN
      PERFORM public.publish_courier_offers(NEW.id, 12);
    END IF;
  ELSIF v_business.owner_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, body, type, data)
    VALUES (
      v_business.owner_id,
      'Nuevo pedido ' || COALESCE(NEW.order_number, ''),
      COALESCE(v_business.name, 'Tu comercio') || ' — confirma y prepara para enviar mensajero',
      'order',
      jsonb_build_object('order_id', NEW.id, 'url', '/comercio')
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_process_business_order_on_create ON public.orders;
CREATE TRIGGER trg_process_business_order_on_create
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.process_business_order_on_create();

-- Despachar al aceptar o al marcar en preparación
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

  IF NEW.status IN ('accepted', 'preparing')
     AND (OLD.status IS DISTINCT FROM NEW.status)
     AND NEW.status NOT IN ('cancelled', 'delivered') THEN
    PERFORM public.publish_courier_offers(NEW.id, 5);
  END IF;

  RETURN NEW;
END;
$$;

GRANT EXECUTE ON FUNCTION public.municipio_center_coords(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.notify_riders_courier_offers(UUID) TO service_role;
