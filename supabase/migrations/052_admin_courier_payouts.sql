-- Admin: gestión de retiros mensajero

DROP POLICY IF EXISTS courier_payout_admin ON public.courier_payout;
CREATE POLICY courier_payout_admin ON public.courier_payout
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.admin_process_courier_payout(
  p_payout_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_payout public.courier_payout;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;

  IF p_action NOT IN ('paid', 'failed', 'cancelled') THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_action');
  END IF;

  SELECT * INTO v_payout FROM courier_payout WHERE id = p_payout_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_payout.status NOT IN ('pending', 'processing') THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_processed');
  END IF;

  IF p_action IN ('failed', 'cancelled') THEN
    UPDATE courier_wallet
    SET balance_available = balance_available + v_payout.amount,
        updated_at = NOW()
    WHERE driver_id = v_payout.driver_id;

    UPDATE courier_payout
    SET status = p_action,
        rejection_reason = p_notes,
        paid_at = NULL
    WHERE id = p_payout_id;
  ELSE
    UPDATE courier_payout
    SET status = 'paid',
        reference = COALESCE(p_notes, reference),
        paid_at = NOW()
    WHERE id = p_payout_id;
  END IF;

  INSERT INTO courier_events (driver_id, event_type, severity, metadata)
  VALUES (
    v_payout.driver_id,
    'payout_' || p_action,
    CASE WHEN p_action = 'paid' THEN 'info' ELSE 'warning' END,
    jsonb_build_object('payout_id', p_payout_id, 'amount', v_payout.amount, 'notes', p_notes, 'admin_id', v_admin)
  );

  RETURN jsonb_build_object('success', true, 'status', p_action);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_process_courier_payout(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_process_courier_payout(UUID, TEXT, TEXT) TO authenticated;

-- Promover owner a ADMIN si existe
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(trim(full_name), ''), 'Brayan Admin')
WHERE email = 'brayandel001@gmail.com';
