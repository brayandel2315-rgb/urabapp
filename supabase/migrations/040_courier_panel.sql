-- UrabApp · Panel mensajero completo (Colombia)
-- Extiende drivers + tablas courier_* (driver_id FK)

-- ─── Extender drivers ───────────────────────────────────────────────────────
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CC',
  ADD COLUMN IF NOT EXISTS document_number TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Urabá',
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS vehicle_capacity TEXT,
  ADD COLUMN IF NOT EXISTS intermunicipal_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS availability_mode TEXT DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS correction_notes TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS punctuality_score DECIMAL(5,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS incident_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS online_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_online_seconds BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS intermunicipal_schedule JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS consent_terms_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_privacy_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_location_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'drivers_availability_mode_check'
  ) THEN
    ALTER TABLE public.drivers
      ADD CONSTRAINT drivers_availability_mode_check
      CHECK (availability_mode IN ('available', 'paused', 'offline'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'drivers_verification_status_check'
  ) THEN
    ALTER TABLE public.drivers
      ADD CONSTRAINT drivers_verification_status_check
      CHECK (verification_status IN ('pending', 'in_review', 'approved', 'rejected', 'corrections'));
  END IF;
END $$;

UPDATE public.drivers
SET verification_status = CASE WHEN is_verified THEN 'approved' ELSE COALESCE(verification_status, 'pending') END
WHERE verification_status IS NULL OR verification_status = 'pending';

-- ─── Documentos ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN (
    'id_front', 'id_back', 'license', 'vehicle_registration',
    'insurance', 'soat', 'profile_photo', 'vehicle_photo', 'other'
  )),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expires_at DATE,
  admin_notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id),
  UNIQUE (driver_id, doc_type)
);

CREATE INDEX IF NOT EXISTS idx_courier_documents_driver ON public.courier_documents(driver_id);

-- ─── Vehículo extendido ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_vehicle (
  driver_id UUID PRIMARY KEY REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL DEFAULT 'moto',
  plate TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  color TEXT,
  capacity_kg DECIMAL(8,2),
  soat_expires_at DATE,
  insurance_expires_at DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Estado operativo (historial) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('available', 'paused', 'offline')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

CREATE INDEX IF NOT EXISTS idx_courier_status_log_driver ON public.courier_status_log(driver_id, started_at DESC);

-- ─── Billetera ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_wallet (
  driver_id UUID PRIMARY KEY REFERENCES public.drivers(id) ON DELETE CASCADE,
  balance_available DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance_pending DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_earned DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'COP',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Pagos / retiros ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_payout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  method TEXT DEFAULT 'bank_transfer',
  reference TEXT,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_courier_payout_driver ON public.courier_payout(driver_id, created_at DESC);

-- ─── Eventos (seguridad / auditoría) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courier_events_driver ON public.courier_events(driver_id, created_at DESC);

-- ─── Rechazos de ofertas ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_offer_rejections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  offer_type TEXT DEFAULT 'courier',
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Regiones intermunicipales ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  max_weight_kg DECIMAL(8,2),
  base_fee_cop DECIMAL(12,2),
  schedule JSONB DEFAULT '{}'::jsonb,
  UNIQUE (driver_id, origin_municipio, dest_municipio)
);

CREATE INDEX IF NOT EXISTS idx_courier_regions_driver ON public.courier_regions(driver_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.courier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_payout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_offer_rejections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_regions ENABLE ROW LEVEL SECURITY;

-- courier_documents
DROP POLICY IF EXISTS courier_documents_own ON public.courier_documents;
CREATE POLICY courier_documents_own ON public.courier_documents
  FOR ALL USING (
    driver_id = public.auth_driver_id() OR public.is_admin()
  )
  WITH CHECK (
    driver_id = public.auth_driver_id() OR public.is_admin()
  );

-- courier_vehicle
DROP POLICY IF EXISTS courier_vehicle_own ON public.courier_vehicle;
CREATE POLICY courier_vehicle_own ON public.courier_vehicle
  FOR ALL USING (driver_id = public.auth_driver_id() OR public.is_admin())
  WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_status_log
DROP POLICY IF EXISTS courier_status_log_own ON public.courier_status_log;
CREATE POLICY courier_status_log_own ON public.courier_status_log
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());
DROP POLICY IF EXISTS courier_status_log_insert ON public.courier_status_log;
CREATE POLICY courier_status_log_insert ON public.courier_status_log
  FOR INSERT WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_wallet
DROP POLICY IF EXISTS courier_wallet_own ON public.courier_wallet;
CREATE POLICY courier_wallet_own ON public.courier_wallet
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_payout
DROP POLICY IF EXISTS courier_payout_own ON public.courier_payout;
CREATE POLICY courier_payout_own ON public.courier_payout
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_events
DROP POLICY IF EXISTS courier_events_own ON public.courier_events;
CREATE POLICY courier_events_own ON public.courier_events
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());
DROP POLICY IF EXISTS courier_events_insert ON public.courier_events;
CREATE POLICY courier_events_insert ON public.courier_events
  FOR INSERT WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_offer_rejections
DROP POLICY IF EXISTS courier_offer_rejections_own ON public.courier_offer_rejections;
CREATE POLICY courier_offer_rejections_own ON public.courier_offer_rejections
  FOR ALL USING (driver_id = public.auth_driver_id() OR public.is_admin())
  WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_regions
DROP POLICY IF EXISTS courier_regions_own ON public.courier_regions;
CREATE POLICY courier_regions_own ON public.courier_regions
  FOR ALL USING (driver_id = public.auth_driver_id() OR public.is_admin())
  WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- ─── RPC: registro extendido paso 1 ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.register_courier_step1(
  p_first_name TEXT,
  p_last_name TEXT,
  p_document_type TEXT,
  p_document_number TEXT,
  p_birth_date DATE,
  p_phone TEXT,
  p_email TEXT,
  p_city TEXT,
  p_municipio TEXT,
  p_language TEXT DEFAULT 'es'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_name TEXT := TRIM(COALESCE(p_first_name, '') || ' ' || COALESCE(p_last_name, ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    UPDATE public.drivers SET
      first_name = TRIM(p_first_name),
      last_name = TRIM(p_last_name),
      name = v_name,
      document_type = COALESCE(p_document_type, 'CC'),
      document_number = TRIM(p_document_number),
      birth_date = p_birth_date,
      phone = TRIM(p_phone),
      email = TRIM(p_email),
      city = COALESCE(TRIM(p_city), 'Urabá'),
      municipio = TRIM(p_municipio),
      language = COALESCE(p_language, 'es'),
      onboarding_step = GREATEST(onboarding_step, 1),
      updated_at = NOW()
    WHERE user_id = auth.uid()
    RETURNING * INTO v_driver;
  ELSE
    INSERT INTO public.drivers (
      user_id, name, first_name, last_name, document_type, document_number,
      birth_date, phone, email, city, municipio, language,
      is_online, is_verified, verification_status, onboarding_step
    ) VALUES (
      auth.uid(), v_name, TRIM(p_first_name), TRIM(p_last_name),
      COALESCE(p_document_type, 'CC'), TRIM(p_document_number),
      p_birth_date, TRIM(p_phone), TRIM(p_email),
      COALESCE(TRIM(p_city), 'Urabá'), TRIM(p_municipio), COALESCE(p_language, 'es'),
      false, false, 'pending', 1
    )
    RETURNING * INTO v_driver;

    UPDATE public.users SET role = 'RIDER', updated_at = NOW()
    WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

    INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver.id)
    ON CONFLICT (driver_id) DO NOTHING;
  END IF;

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- ─── RPC: paso 2 operación ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.register_courier_step2(
  p_vehicle_type TEXT,
  p_plate TEXT DEFAULT '',
  p_capacity TEXT DEFAULT '',
  p_intermunicipal BOOLEAN DEFAULT FALSE,
  p_brand TEXT DEFAULT NULL,
  p_model TEXT DEFAULT NULL,
  p_capacity_kg DECIMAL DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    vehicle = COALESCE(NULLIF(TRIM(p_vehicle_type), ''), 'moto'),
    plate = TRIM(COALESCE(p_plate, '')),
    vehicle_capacity = TRIM(COALESCE(p_capacity, '')),
    intermunicipal_enabled = COALESCE(p_intermunicipal, false),
    onboarding_step = GREATEST(onboarding_step, 2),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_vehicle (driver_id, vehicle_type, plate, brand, model, capacity_kg)
  VALUES (v_driver_id, COALESCE(NULLIF(TRIM(p_vehicle_type), ''), 'moto'), TRIM(COALESCE(p_plate, '')),
          p_brand, p_model, p_capacity_kg)
  ON CONFLICT (driver_id) DO UPDATE SET
    vehicle_type = EXCLUDED.vehicle_type,
    plate = EXCLUDED.plate,
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    capacity_kg = EXCLUDED.capacity_kg,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: paso 3 consentimientos + enviar a revisión ────────────────────────
CREATE OR REPLACE FUNCTION public.submit_courier_for_review()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    consent_terms_at = COALESCE(consent_terms_at, NOW()),
    consent_privacy_at = COALESCE(consent_privacy_at, NOW()),
    consent_location_at = COALESCE(consent_location_at, NOW()),
    verification_status = 'in_review',
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver_id, 'onboarding_submitted', 'info', '{}'::jsonb);

  RETURN jsonb_build_object('success', true, 'status', 'in_review');
END;
$$;

-- ─── RPC: modo disponibilidad ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_courier_availability(
  p_mode TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_prev_mode TEXT;
  v_duration INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  IF v_driver.verification_status NOT IN ('approved') AND NOT v_driver.is_verified THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_approved');
  END IF;

  IF p_mode NOT IN ('available', 'paused', 'offline') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_mode');
  END IF;

  v_prev_mode := v_driver.availability_mode;

  IF v_prev_mode IS DISTINCT FROM p_mode AND v_driver.online_started_at IS NOT NULL THEN
    v_duration := EXTRACT(EPOCH FROM (NOW() - v_driver.online_started_at))::INTEGER;
    UPDATE public.courier_status_log
    SET ended_at = NOW(), duration_seconds = v_duration
    WHERE driver_id = v_driver.id AND ended_at IS NULL;
  END IF;

  UPDATE public.drivers SET
    availability_mode = p_mode,
    is_online = (p_mode = 'available'),
    online_started_at = CASE
      WHEN p_mode = 'available' THEN NOW()
      ELSE NULL
    END,
    total_online_seconds = CASE
      WHEN v_prev_mode = 'available' AND p_mode != 'available' AND v_driver.online_started_at IS NOT NULL
      THEN total_online_seconds + EXTRACT(EPOCH FROM (NOW() - v_driver.online_started_at))::BIGINT
      ELSE total_online_seconds
    END,
    updated_at = NOW()
  WHERE id = v_driver.id
  RETURNING * INTO v_driver;

  IF p_mode IN ('available', 'paused') THEN
    INSERT INTO public.courier_status_log (driver_id, mode) VALUES (v_driver.id, p_mode);
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, metadata)
  VALUES (v_driver.id, 'availability_changed', jsonb_build_object('mode', p_mode));

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- ─── RPC: rechazo con motivo ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_courier_offer_rejection(
  p_order_id UUID,
  p_reason TEXT,
  p_offer_type TEXT DEFAULT 'courier'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_offer_rejections (driver_id, order_id, reason, offer_type)
  VALUES (v_driver_id, p_order_id, TRIM(p_reason), COALESCE(p_offer_type, 'courier'));

  UPDATE public.drivers SET
    acceptance_rate = GREATEST(0, acceptance_rate - 0.5),
    updated_at = NOW()
  WHERE id = v_driver_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: admin revisión ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_review_courier(
  p_driver_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  IF p_action = 'approve' THEN
    UPDATE public.drivers SET
      verification_status = 'approved',
      is_verified = true,
      rejection_reason = NULL,
      correction_notes = NULL,
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'reject' THEN
    UPDATE public.drivers SET
      verification_status = 'rejected',
      is_verified = false,
      rejection_reason = p_notes,
      is_online = false,
      availability_mode = 'offline',
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'corrections' THEN
    UPDATE public.drivers SET
      verification_status = 'corrections',
      correction_notes = p_notes,
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'suspend' THEN
    UPDATE public.drivers SET
      is_online = false,
      availability_mode = 'offline',
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_action');
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (p_driver_id, 'admin_' || p_action, 'info', jsonb_build_object('notes', p_notes));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: wallet sync desde entregas ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_courier_wallet_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
  v_wallet public.courier_wallet%ROWTYPE;
  v_today NUMERIC := 0;
  v_week NUMERIC := 0;
  v_month NUMERIC := 0;
  v_pending_orders NUMERIC := 0;
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver_id)
  ON CONFLICT (driver_id) DO NOTHING;

  SELECT * INTO v_wallet FROM public.courier_wallet WHERE driver_id = v_driver_id;

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_today
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('day', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_week
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('week', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_month
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('month', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_pending_orders
  FROM public.orders
  WHERE driver_id = v_driver_id AND status IN ('accepted', 'preparing', 'on_the_way');

  RETURN jsonb_build_object(
    'success', true,
    'wallet', to_jsonb(v_wallet),
    'today', v_today,
    'week', v_week,
    'month', v_month,
    'pending_orders', v_pending_orders
  );
END;
$$;

-- ─── RPC: reputación ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_courier_reputation()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_avg_rating NUMERIC;
  v_total_offers BIGINT;
  v_accepted BIGINT;
  v_rejected BIGINT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  SELECT COALESCE(AVG(r.rating), v_driver.rating) INTO v_avg_rating
  FROM public.reviews r WHERE r.driver_id = v_driver.id;

  SELECT COUNT(*) INTO v_rejected FROM public.courier_offer_rejections WHERE driver_id = v_driver.id;
  SELECT COUNT(*) INTO v_accepted FROM public.courier_offers
  WHERE driver_id = v_driver.id AND status = 'accepted';
  v_total_offers := v_accepted + v_rejected;

  RETURN jsonb_build_object(
    'success', true,
    'rating', COALESCE(v_avg_rating, v_driver.rating),
    'acceptance_rate', v_driver.acceptance_rate,
    'completion_rate', v_driver.completion_rate,
    'punctuality_score', v_driver.punctuality_score,
    'incident_count', v_driver.incident_count,
    'level', v_driver.level,
    'total_deliveries', v_driver.total_deliveries,
    'offers_accepted', v_accepted,
    'offers_rejected', v_rejected,
    'tips', jsonb_build_array(
      jsonb_build_object('key', 'acceptance', 'label', 'Acepta más ofertas cercanas para subir tu tasa'),
      jsonb_build_object('key', 'punctuality', 'label', 'Llega a tiempo a recogida y entrega'),
      jsonb_build_object('key', 'rating', 'label', 'Pide confirmación amable al cliente')
    )
  );
END;
$$;

-- ─── RPC: evento seguridad ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_courier_security_event(
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (
    v_driver_id,
    p_event_type,
    CASE WHEN p_event_type IN ('emergency', 'sos') THEN 'critical' ELSE 'info' END,
    COALESCE(p_metadata, '{}'::jsonb)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── Actualizar register_driver: no auto-aprobar ────────────────────────────
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
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    RETURN jsonb_build_object('success', true, 'already_exists', true, 'driver', to_jsonb(v_driver));
  END IF;

  INSERT INTO public.drivers (
    user_id, name, phone, municipio, vehicle, plate,
    is_online, is_verified, verification_status, onboarding_step
  ) VALUES (
    auth.uid(), TRIM(p_name), TRIM(p_phone), TRIM(p_municipio),
    COALESCE(NULLIF(TRIM(p_vehicle), ''), 'moto'), TRIM(COALESCE(p_plate, '')),
    false, false, 'pending', 1
  )
  RETURNING * INTO v_driver;

  INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver.id);

  UPDATE public.users SET role = 'RIDER', updated_at = NOW()
  WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- Grants
REVOKE ALL ON FUNCTION public.register_courier_step1 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_courier_step2 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_courier_for_review FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_courier_availability FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_courier_offer_rejection FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_review_courier FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_courier_wallet_summary FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_courier_reputation FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_courier_security_event FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.register_courier_step1 TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_courier_step2 TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_courier_for_review TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_courier_availability TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_courier_offer_rejection TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_courier TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courier_wallet_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courier_reputation TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_courier_security_event TO authenticated;
