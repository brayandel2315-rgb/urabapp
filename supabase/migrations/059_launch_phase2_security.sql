-- Fase 2 lanzamiento: mensajeros en revisión, anti-fraude bienvenida, RLS planes/pagos

-- ─── 1. Restaurar revisión manual de mensajeros (revertir auto-approve MVP) ───
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
    is_verified = FALSE,
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver_id, 'onboarding_submitted', 'info', '{}'::jsonb);

  RETURN jsonb_build_object('success', true, 'status', 'in_review');
END;
$$;

CREATE OR REPLACE FUNCTION public.set_courier_availability(p_mode TEXT)
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

  IF v_driver.verification_status <> 'approved' THEN
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
    online_started_at = CASE WHEN p_mode = 'available' THEN NOW() ELSE NULL END,
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

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- assign_best_rider: solo mensajeros aprobados (sin prioridad demo)
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

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = TRUE
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

-- ─── 2. Entrega bienvenida: solo vía RPC (bloquear UPDATE directo) ───────────
CREATE OR REPLACE FUNCTION public.guard_users_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.role := OLD.role;
  NEW.account_status := OLD.account_status;
  NEW.email := OLD.email;

  IF current_setting('urabapp.allow_welcome_mark', true) = '1' THEN
    NULL;
  ELSE
    NEW.welcome_delivery_used_at := OLD.welcome_delivery_used_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.mark_welcome_delivery_used(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_order public.orders;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND customer_id = v_uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  IF NOT COALESCE(v_order.welcome_delivery_applied, FALSE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_applicable');
  END IF;

  PERFORM set_config('urabapp.allow_welcome_mark', '1', true);

  UPDATE public.users
  SET welcome_delivery_used_at = NOW(), updated_at = NOW()
  WHERE id = v_uid AND welcome_delivery_used_at IS NULL;

  PERFORM set_config('urabapp.allow_welcome_mark', '0', true);

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── 3. RLS membership_plans ─────────────────────────────────────────────────
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS membership_plans_public_read ON public.membership_plans;
CREATE POLICY membership_plans_public_read ON public.membership_plans
  FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS membership_plans_admin_write ON public.membership_plans;
CREATE POLICY membership_plans_admin_write ON public.membership_plans
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ─── 4. RLS payments ─────────────────────────────────────────────────────────
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payments_customer_read ON public.payments;
CREATE POLICY payments_customer_read ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.customer_id = auth.uid()
    )
    OR public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.businesses b ON b.id = o.business_id
      WHERE o.id = order_id AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS payments_admin_all ON public.payments;
CREATE POLICY payments_admin_all ON public.payments
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
