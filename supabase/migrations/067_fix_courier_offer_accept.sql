-- Fix aceptación de ofertas: mensajeros aprobados, comercio/mandado, auto-aprobación con foto en vivo

-- Aprobar mensajeros que ya tienen foto en vivo (atascados en in_review)
UPDATE public.drivers
SET
  verification_status = 'approved',
  is_verified = TRUE,
  updated_at = NOW()
WHERE verification_status IN ('in_review', 'pending')
  AND profile_photo_url IS NOT NULL
  AND btrim(profile_photo_url) <> ''
  AND EXISTS (
    SELECT 1 FROM public.courier_documents cd
    WHERE cd.driver_id = drivers.id AND cd.doc_type = 'profile_photo'
  );

CREATE OR REPLACE FUNCTION public.submit_courier_for_review()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
BEGIN
  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  IF v_driver.profile_photo_url IS NULL OR btrim(v_driver.profile_photo_url) = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'profile_photo_required',
      'message', 'Debes tomar tu foto en vivo con la cámara antes de activar tu cuenta.'
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.courier_documents
    WHERE driver_id = v_driver.id AND doc_type = 'profile_photo'
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'reason', 'profile_photo_required',
      'message', 'Falta la foto de verificación en tiempo real.'
    );
  END IF;

  -- Foto en vivo = verificación mínima → puede operar; admin puede suspender después
  UPDATE public.drivers SET
    consent_terms_at = COALESCE(consent_terms_at, NOW()),
    consent_privacy_at = COALESCE(consent_privacy_at, NOW()),
    consent_location_at = COALESCE(consent_location_at, NOW()),
    verification_status = 'approved',
    is_verified = TRUE,
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver.id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver.id, 'onboarding_approved', 'info', jsonb_build_object(
    'auto', true,
    'profile_photo_captured_at', v_driver.profile_photo_captured_at
  ));

  RETURN jsonb_build_object('success', true, 'status', 'approved');
END;
$$;

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

REVOKE ALL ON FUNCTION public.submit_courier_for_review() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_courier_for_review() TO authenticated;
REVOKE ALL ON FUNCTION public.accept_courier_offer(UUID, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_courier_offer(UUID, UUID) TO authenticated;
