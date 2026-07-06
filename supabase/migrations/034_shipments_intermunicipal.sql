-- UrabApp — Módulo envíos intermunicipales (producto separado de mandados/courier)

-- ─── Configuración tarifas ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_pricing (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.shipment_pricing (key, value) VALUES
  ('default', '{
    "baseFee": 8000,
    "minFee": 15000,
    "perKm": 200,
    "protectionFee": 1500,
    "demandMultiplier": 1.0,
    "weightFees": {"0-2": 0, "2-5": 2000, "5-10": 5000, "10-20": 10000}
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ─── Rutas activas ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  eta_hours INTEGER NOT NULL DEFAULT 4,
  base_fee INTEGER,
  capacity_slots INTEGER NOT NULL DEFAULT 12,
  slots_used INTEGER NOT NULL DEFAULT 0,
  demand_factor DECIMAL(4,2) NOT NULL DEFAULT 1.0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (origin_municipio, dest_municipio)
);

-- ─── Cotizaciones ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  route_id UUID REFERENCES public.shipment_routes(id) ON DELETE SET NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  eta_hours INTEGER NOT NULL,
  package_type TEXT,
  weight_tier TEXT,
  price_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_cop INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Pedidos de envío ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT UNIQUE NOT NULL DEFAULT 'SHP-' || LPAD((FLOOR(RANDOM() * 99999))::TEXT, 5, '0'),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES public.shipment_quotes(id) ON DELETE SET NULL,
  route_id UUID REFERENCES public.shipment_routes(id) ON DELETE SET NULL,
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN (
      'created', 'searching_carrier', 'accepted', 'pickup',
      'at_hub', 'in_transit', 'arriving', 'delivered', 'completed', 'cancelled'
    )),
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_whatsapp TEXT,
  sender_document TEXT,
  package_type TEXT NOT NULL DEFAULT 'package',
  weight_tier TEXT NOT NULL DEFAULT '0-2',
  dimensions TEXT,
  declared_value INTEGER DEFAULT 0,
  package_notes TEXT,
  photo_url TEXT,
  pickup_address TEXT NOT NULL,
  pickup_reference TEXT,
  delivery_address TEXT NOT NULL,
  delivery_reference TEXT,
  distance_km DECIMAL(8,2),
  eta_hours INTEGER,
  eta_at TIMESTAMPTZ,
  price_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_cop INTEGER NOT NULL,
  assigned_driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  current_latitude DECIMAL(9,6),
  current_longitude DECIMAL(9,6),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_orders_customer ON public.shipment_orders (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipment_orders_status ON public.shipment_orders (status, origin_municipio);
CREATE INDEX IF NOT EXISTS idx_shipment_orders_route ON public.shipment_orders (route_id, status);

-- ─── Asignaciones (ranking híbrido, no broadcast masivo) ─────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  rank_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (shipment_id, driver_id)
);

-- ─── Tracking en vivo ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  heading DECIMAL(5,2),
  speed_kmh DECIMAL(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_tracking_shipment ON public.shipment_tracking (shipment_id, recorded_at DESC);

-- ─── Eventos / historial ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  status TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment ON public.shipment_events (shipment_id, created_at DESC);

-- ─── Pagos ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  amount_cop INTEGER NOT NULL,
  method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Logs operativos ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed rutas Urabá ────────────────────────────────────────────────────────
INSERT INTO public.shipment_routes (origin_municipio, dest_municipio, distance_km, eta_hours, base_fee, capacity_slots) VALUES
  ('Turbo', 'Apartadó', 32, 4, 15000, 12),
  ('Apartadó', 'Turbo', 32, 4, 15000, 12),
  ('Turbo', 'Carepa', 48, 5, 17000, 10),
  ('Carepa', 'Turbo', 48, 5, 17000, 10),
  ('Turbo', 'Chigorodó', 68, 6, 18000, 8),
  ('Chigorodó', 'Turbo', 68, 6, 18000, 8),
  ('Apartadó', 'Carepa', 18, 3, 12000, 14),
  ('Carepa', 'Apartadó', 18, 3, 12000, 14),
  ('Apartadó', 'Chigorodó', 38, 4, 15000, 12),
  ('Chigorodó', 'Apartadó', 38, 4, 15000, 12),
  ('Carepa', 'Chigorodó', 22, 3, 12000, 12),
  ('Chigorodó', 'Carepa', 22, 3, 12000, 12),
  ('Necoclí', 'Turbo', 28, 4, 15000, 10),
  ('Turbo', 'Necoclí', 28, 4, 15000, 10),
  ('Necoclí', 'Apartadó', 58, 6, 18000, 8),
  ('Apartadó', 'Necoclí', 58, 6, 18000, 8),
  ('San Pedro', 'Apartadó', 42, 5, 16000, 8),
  ('Apartadó', 'San Pedro', 42, 5, 16000, 8),
  ('Arboletes', 'Apartadó', 55, 6, 17500, 8),
  ('Apartadó', 'Arboletes', 55, 6, 17500, 8)
ON CONFLICT (origin_municipio, dest_municipio) DO NOTHING;

-- ─── Helpers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_shipment_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS shipment_orders_updated ON public.shipment_orders;
CREATE TRIGGER shipment_orders_updated
  BEFORE UPDATE ON public.shipment_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_shipment_updated_at();

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

-- Ranking híbrido: ruta activa > cercanía > capacidad > historial > disponibilidad
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
  SELECT * INTO v_shipment FROM public.shipment_orders WHERE id = p_shipment_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Envío no encontrado';
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

CREATE OR REPLACE FUNCTION public.accept_shipment_assignment(p_assignment_id UUID, p_driver_user_id UUID)
RETURNS public.shipment_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assignment public.shipment_assignments%ROWTYPE;
  v_driver_id UUID;
  v_shipment public.shipment_orders%ROWTYPE;
BEGIN
  SELECT id INTO v_driver_id FROM public.drivers WHERE user_id = p_driver_user_id LIMIT 1;
  IF v_driver_id IS NULL THEN
    RAISE EXCEPTION 'No eres transportista registrado';
  END IF;

  SELECT * INTO v_assignment FROM public.shipment_assignments
  WHERE id = p_assignment_id AND driver_id = v_driver_id AND status = 'pending'
    AND expires_at > NOW()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Oferta no disponible';
  END IF;

  UPDATE public.shipment_assignments SET status = 'accepted', responded_at = NOW()
  WHERE id = p_assignment_id;

  UPDATE public.shipment_assignments SET status = 'expired'
  WHERE shipment_id = v_assignment.shipment_id AND id <> p_assignment_id AND status = 'pending';

  UPDATE public.shipment_orders
  SET assigned_driver_id = v_driver_id, status = 'accepted'
  WHERE id = v_assignment.shipment_id AND assigned_driver_id IS NULL
  RETURNING * INTO v_shipment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El envío ya fue asignado';
  END IF;

  PERFORM public.log_shipment_event(v_shipment.id, 'carrier_accepted', 'accepted', NULL, NULL,
    jsonb_build_object('driver_id', v_driver_id));

  RETURN v_shipment;
END;
$$;

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.shipment_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shipment_routes_public_read" ON public.shipment_routes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "shipment_pricing_public_read" ON public.shipment_pricing FOR SELECT USING (TRUE);

CREATE POLICY "shipment_quotes_owner" ON public.shipment_quotes FOR ALL
  USING (customer_id = auth.uid() OR public.is_admin())
  WITH CHECK (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "shipment_orders_customer_read" ON public.shipment_orders FOR SELECT
  USING (customer_id = auth.uid() OR public.is_admin() OR public.is_staff());

CREATE POLICY "shipment_orders_customer_insert" ON public.shipment_orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "shipment_orders_admin_update" ON public.shipment_orders FOR UPDATE
  USING (public.is_admin() OR public.is_staff());

CREATE POLICY "shipment_events_read" ON public.shipment_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND (s.customer_id = auth.uid() OR public.is_admin() OR public.is_staff())
    )
    OR EXISTS (
      SELECT 1 FROM public.shipment_orders s
      JOIN public.drivers d ON d.id = s.assigned_driver_id
      WHERE s.id = shipment_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "shipment_tracking_read" ON public.shipment_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND (s.customer_id = auth.uid() OR public.is_admin() OR public.is_staff())
    )
    OR EXISTS (
      SELECT 1 FROM public.shipment_orders s
      JOIN public.drivers d ON d.id = s.assigned_driver_id
      WHERE s.id = shipment_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "shipment_assignments_driver_read" ON public.shipment_assignments FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
  );

CREATE POLICY "shipment_payments_read" ON public.shipment_payments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.shipment_orders s WHERE s.id = shipment_id AND s.customer_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "shipment_logs_admin" ON public.shipment_logs FOR SELECT USING (public.is_admin());

-- Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_orders;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_events') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_events;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_tracking') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_tracking;
  END IF;
END $$;

GRANT EXECUTE ON FUNCTION public.log_shipment_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_shipment_assignments TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_shipment_assignment TO authenticated;
