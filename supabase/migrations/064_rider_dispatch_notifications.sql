-- 064: Despacho y notificaciones mensajero — municipio normalizado, ofertas al crear, RLS ofertas

-- ─── Normalización municipio (Apartadó vs Apartado, acentos) ─────────────────
CREATE OR REPLACE FUNCTION public.municipio_match_key(p_value TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(
    translate(
      trim(COALESCE(p_value, '')),
      'áàäâãéèëêíìïîóòöôõúùüûñÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÑ',
      'aaaaaeeeeiiiiooooouuuunAAAAAEEEEIIIIOOOOOUUUUN'
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.municipios_match(a TEXT, b TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT public.municipio_match_key(a) <> ''
    AND public.municipio_match_key(a) = public.municipio_match_key(b);
$$;

GRANT EXECUTE ON FUNCTION public.municipio_match_key(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.municipios_match(TEXT, TEXT) TO authenticated;

-- ─── RLS pedidos: mensajero ve pedidos de su zona u ofertas pendientes ───────
DROP POLICY IF EXISTS orders_driver_read ON public.orders;
CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.is_approved_driver()
      AND (
        driver_id = public.auth_driver_id()
        OR (
          driver_id IS NULL
          AND status IN ('pending', 'accepted', 'preparing', 'on_the_way')
          AND public.municipios_match(dest_municipio, public.auth_driver_municipio())
        )
        OR public.driver_has_pending_offer(id)
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );

-- ─── Republicar ofertas vencidas (municipio normalizado) ─────────────────────
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
      AND o.status IN ('pending', 'accepted', 'preparing')
      AND (o.order_type IS NULL OR o.order_type IN ('commerce', 'envio'))
      AND (p_municipio IS NULL OR public.municipios_match(o.dest_municipio, p_municipio))
      AND (
        o.payment_method = 'cash'
        OR o.payment_status = 'paid'
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.courier_offers co
        WHERE co.order_id = o.id
          AND co.status = 'pending'
          AND co.expires_at > NOW()
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
      AND (
        o.payment_method = 'cash'
        OR o.payment_status = 'paid'
      )
      AND NOT EXISTS (
        SELECT 1 FROM public.courier_offers co
        WHERE co.order_id = o.id
          AND co.status = 'pending'
          AND co.expires_at > NOW()
      )
  LOOP
    v_n := public.publish_courier_offers(v_order.id, 12);
    v_total := v_total + v_n;
  END LOOP;

  RETURN v_total;
END;
$$;

-- ─── Publicar ofertas a mensajeros ───────────────────────────────────────────
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
      IF v_order.status NOT IN ('accepted', 'preparing') THEN
        IF NOT (v_order.status = 'pending' AND v_order.payment_method = 'cash') THEN
          RETURN 0;
        END IF;
      END IF;
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
    v_offer_ttl := INTERVAL '120 seconds';
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

-- ─── Al crear pedido de comercio: notificar comercio + ofertas (efectivo) ────
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
      COALESCE(v_business.name, 'Tu comercio') || ' — confirma y prepara para enviar mensajero',
      'order',
      jsonb_build_object('order_id', NEW.id, 'url', '/comercio')
    );

    IF NEW.payment_method = 'cash' OR NEW.payment_status = 'paid' THEN
      v_offers := public.publish_courier_offers(NEW.id, 5);
      IF v_offers = 0 THEN
        PERFORM public.publish_courier_offers(NEW.id, 12);
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Asegurar trigger de despacho al aceptar/preparar
DROP TRIGGER IF EXISTS trg_dispatch_rider_on_preparing ON public.orders;
CREATE TRIGGER trg_dispatch_rider_on_preparing
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.dispatch_rider_on_preparing();

GRANT EXECUTE ON FUNCTION public.publish_courier_offers(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_courier_offers(UUID, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION public.refresh_open_order_offers(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_open_order_offers(TEXT) TO service_role;
