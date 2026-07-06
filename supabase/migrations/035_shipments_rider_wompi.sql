-- Envíos: transportista (reject/advance) + Wompi en shipment_payments

ALTER TABLE public.shipment_payments
  ADD COLUMN IF NOT EXISTS wompi_reference TEXT,
  ADD COLUMN IF NOT EXISTS checkout_url TEXT,
  ADD COLUMN IF NOT EXISTS wompi_transaction_id TEXT;

CREATE OR REPLACE FUNCTION public.reject_shipment_assignment(p_assignment_id UUID, p_driver_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_driver_id UUID;
BEGIN
  SELECT id INTO v_driver_id FROM public.drivers WHERE user_id = p_driver_user_id LIMIT 1;
  IF v_driver_id IS NULL THEN RAISE EXCEPTION 'No eres transportista'; END IF;
  UPDATE public.shipment_assignments
  SET status = 'rejected', responded_at = NOW()
  WHERE id = p_assignment_id AND driver_id = v_driver_id AND status = 'pending';
END;
$$;

CREATE OR REPLACE FUNCTION public.advance_shipment_status(
  p_shipment_id UUID,
  p_driver_user_id UUID,
  p_lat DECIMAL DEFAULT NULL,
  p_lng DECIMAL DEFAULT NULL
)
RETURNS public.shipment_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID;
  v_shipment public.shipment_orders%ROWTYPE;
  v_next TEXT;
BEGIN
  SELECT id INTO v_driver_id FROM public.drivers WHERE user_id = p_driver_user_id LIMIT 1;
  IF v_driver_id IS NULL THEN RAISE EXCEPTION 'No eres transportista'; END IF;

  SELECT * INTO v_shipment FROM public.shipment_orders
  WHERE id = p_shipment_id AND assigned_driver_id = v_driver_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Envío no asignado a ti'; END IF;

  v_next := CASE v_shipment.status
    WHEN 'accepted' THEN 'pickup'
    WHEN 'pickup' THEN 'at_hub'
    WHEN 'at_hub' THEN 'in_transit'
    WHEN 'in_transit' THEN 'arriving'
    WHEN 'arriving' THEN 'delivered'
    WHEN 'delivered' THEN 'completed'
    ELSE NULL
  END;

  IF v_next IS NULL THEN RAISE EXCEPTION 'No hay siguiente estado'; END IF;

  PERFORM public.log_shipment_event(p_shipment_id, 'rider_advance', v_next, p_lat, p_lng,
    jsonb_build_object('driver_id', v_driver_id));

  SELECT * INTO v_shipment FROM public.shipment_orders WHERE id = p_shipment_id;
  RETURN v_shipment;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS shipment_payments_shipment_id_unique ON public.shipment_payments(shipment_id);

DROP POLICY IF EXISTS "shipment_orders_driver_read" ON public.shipment_orders;
CREATE POLICY "shipment_orders_driver_read" ON public.shipment_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.id = assigned_driver_id AND d.user_id = auth.uid()
    )
  );

GRANT EXECUTE ON FUNCTION public.reject_shipment_assignment TO authenticated;
GRANT EXECUTE ON FUNCTION public.advance_shipment_status TO authenticated;

DROP POLICY IF EXISTS "shipment_assignments_driver_update" ON public.shipment_assignments;
CREATE POLICY "shipment_assignments_driver_update" ON public.shipment_assignments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
  );
