-- Mensajeros: foto en vivo obligatoria antes de enviar registro a revisión

ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS profile_photo_captured_at TIMESTAMPTZ;

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

  UPDATE public.drivers SET
    consent_terms_at = COALESCE(consent_terms_at, NOW()),
    consent_privacy_at = COALESCE(consent_privacy_at, NOW()),
    consent_location_at = COALESCE(consent_location_at, NOW()),
    verification_status = 'in_review',
    is_verified = FALSE,
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver.id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver.id, 'onboarding_submitted', 'info', jsonb_build_object(
    'profile_photo_captured_at', v_driver.profile_photo_captured_at
  ));

  RETURN jsonb_build_object('success', true, 'status', 'in_review');
END;
$$;

REVOKE ALL ON FUNCTION public.submit_courier_for_review() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_courier_for_review() TO authenticated;
