-- UrabApp — Módulo de mensajería / encomiendas (producción)
-- Extiende orders + ofertas a mensajeros + tracking + OTP entrega

-- ─── Columnas courier en orders ───────────────────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_type TEXT NOT NULL DEFAULT 'commerce',
  ADD COLUMN IF NOT EXISTS pickup_address TEXT,
  ADD COLUMN IF NOT EXISTS pickup_latitude DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS pickup_longitude DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS distance_km DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS fare_breakdown JSONB,
  ADD COLUMN IF NOT EXISTS courier_package_type TEXT,
  ADD COLUMN IF NOT EXISTS courier_weight_tier TEXT,
  ADD COLUMN IF NOT EXISTS courier_priority TEXT DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS delivery_otp TEXT,
  ADD COLUMN IF NOT EXISTS delivery_otp_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS courier_search_radius_km INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS courier_phase TEXT;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_order_type_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_order_type_check
  CHECK (order_type IN ('commerce', 'courier', 'envio'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_courier_priority_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_courier_priority_check
  CHECK (courier_priority IS NULL OR courier_priority IN ('normal', 'express'));

CREATE INDEX IF NOT EXISTS idx_orders_courier_pending
  ON public.orders (dest_municipio, status)
  WHERE order_type = 'courier' AND status = 'pending' AND driver_id IS NULL;

-- ─── Configuración tarifas (admin) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.courier_settings (key, value) VALUES
  ('fare_config', '{
    "base": 8000,
    "minFare": 15000,
    "perKm": 850,
    "expressMultiplier": 1.25,
    "peakMultiplier": 1.15,
    "demandMultiplier": 1.0,
    "fuelPriceCop": 13500,
    "fuelEfficiencyKmPerLiter": 35,
    "riderSharePct": 72
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ─── Ofertas a mensajeros (primer aceptado gana) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  payout_estimate INTEGER NOT NULL DEFAULT 0,
  distance_to_pickup_km DECIMAL(8,2),
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (order_id, driver_id)
);

CREATE INDEX IF NOT EXISTS idx_courier_offers_driver_pending
  ON public.courier_offers (driver_id, status, expires_at)
  WHERE status = 'pending';

-- ─── Eventos de tracking ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courier_tracking_order
  ON public.courier_tracking_events (order_id, created_at DESC);

-- ─── OTP automático para courier ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_courier_delivery_otp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_type = 'courier' AND NEW.delivery_otp IS NULL THEN
    NEW.delivery_otp := LPAD((FLOOR(RANDOM() * 10000))::INT::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_courier_delivery_otp ON public.orders;
CREATE TRIGGER trg_courier_delivery_otp
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_courier_delivery_otp();

-- ─── Distancia Haversine (km) ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.haversine_km(
  lat1 DOUBLE PRECISION, lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION, lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION
LANGUAGE sql IMMUTABLE
AS $$
  SELECT 6371 * 2 * ASIN(SQRT(
    POWER(SIN(RADIANS(lat2 - lat1) / 2), 2) +
    COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
    POWER(SIN(RADIANS(lon2 - lon1) / 2), 2)
  ));
$$;

-- ─── Publicar ofertas a mensajeros cercanos ─────────────────────────────────
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
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
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

-- ─── Aceptar oferta (atómico — primer mensajero gana) ───────────────────────
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

-- ─── Rechazar oferta ────────────────────────────────────────────────────────
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
  UPDATE public.courier_offers
  SET status = 'rejected', responded_at = NOW()
  WHERE order_id = p_order_id
    AND driver_id = p_driver_id
    AND status = 'pending';
END;
$$;

-- ─── Verificar OTP entrega ──────────────────────────────────────────────────
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
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;
  IF p_driver_id IS NOT NULL AND v_order.driver_id IS DISTINCT FROM p_driver_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_assigned');
  END IF;
  IF v_order.delivery_otp IS NULL OR v_order.delivery_otp <> TRIM(p_code) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_code');
  END IF;
  IF v_order.delivery_otp_verified_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_verified', true);
  END IF;

  UPDATE public.orders
  SET delivery_otp_verified_at = NOW(),
      status = 'delivered',
      delivered_at = NOW(),
      courier_phase = 'delivered'
  WHERE id = p_order_id;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'delivered', jsonb_build_object('otp_verified', true));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── Actualizar fase courier + evento ───────────────────────────────────────
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

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.courier_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS courier_offers_driver_read ON public.courier_offers;
CREATE POLICY courier_offers_driver_read ON public.courier_offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.id = courier_offers.driver_id AND d.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = courier_offers.order_id AND o.customer_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

DROP POLICY IF EXISTS courier_tracking_read ON public.courier_tracking_events;
CREATE POLICY courier_tracking_read ON public.courier_tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = courier_tracking_events.order_id
        AND (o.customer_id = auth.uid()
          OR o.driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()))
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

DROP POLICY IF EXISTS courier_settings_read ON public.courier_settings;
CREATE POLICY courier_settings_read ON public.courier_settings
  FOR SELECT USING (TRUE);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.courier_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courier_tracking_events;
