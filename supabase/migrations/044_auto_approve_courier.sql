-- Auto-approve couriers after onboarding (MVP). Admin can still suspend via panel.
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
    verification_status = 'approved',
    is_verified = true,
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver_id, 'onboarding_approved', 'info', '{"auto": true}'::jsonb);

  RETURN jsonb_build_object('success', true, 'status', 'approved');
END;
$$;

-- Unblock couriers stuck in manual review from earlier builds
UPDATE public.drivers
SET
  verification_status = 'approved',
  is_verified = true,
  updated_at = NOW()
WHERE verification_status IN ('in_review', 'pending')
  AND onboarding_step >= 4;
