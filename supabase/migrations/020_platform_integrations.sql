-- Urabapp 100%: Wompi, tracking riders, auto-asignación, realtime drivers

-- Pagos Wompi
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS wompi_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS wompi_reference TEXT,
  ADD COLUMN IF NOT EXISTS checkout_url TEXT,
  ADD COLUMN IF NOT EXISTS webhook_payload JSONB;

CREATE INDEX IF NOT EXISTS idx_payments_wompi_ref ON public.payments(wompi_reference);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);

-- Índices operativos
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_drivers_online_municipio ON public.drivers(municipio, is_online)
  WHERE is_online = true;

-- Cliente puede ver ubicación del mensajero asignado a su pedido activo
DROP POLICY IF EXISTS "drivers_customer_assigned_read" ON public.drivers;
CREATE POLICY "drivers_customer_assigned_read" ON public.drivers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.driver_id = drivers.id
        AND o.customer_id = auth.uid()
        AND o.status IN ('accepted', 'preparing', 'on_the_way')
    )
  );

-- Realtime en mensajeros (tracking en vivo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'drivers'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.drivers;
  END IF;
END $$;

-- Asignar mejor mensajero disponible (municipio + online + verificado)
CREATE OR REPLACE FUNCTION public.assign_best_rider(p_order_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_rider_id UUID;
BEGIN
  SELECT id, driver_id, status, dest_municipio, payment_method, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF v_order.driver_id IS NOT NULL THEN
    RETURN v_order.driver_id;
  END IF;

  IF v_order.status NOT IN ('pending', 'accepted') THEN
    RETURN NULL;
  END IF;

  -- Pagos digitales: solo asignar cuando esté pagado
  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = true
    AND d.is_verified = true
    AND d.municipio = v_order.dest_municipio
  ORDER BY d.total_deliveries ASC, d.rating DESC
  LIMIT 1;

  IF v_rider_id IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.orders
  SET
    driver_id = v_rider_id,
    status = CASE WHEN status = 'pending' THEN 'accepted' ELSE status END,
    accepted_at = CASE WHEN status = 'pending' THEN NOW() ELSE accepted_at END
  WHERE id = p_order_id;

  RETURN v_rider_id;
END;
$$;

REVOKE ALL ON FUNCTION public.assign_best_rider(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.assign_best_rider(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_best_rider(UUID) TO authenticated;

-- Auto-asignar pedidos en efectivo al crearse
CREATE OR REPLACE FUNCTION public.auto_assign_rider_on_cash_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.payment_method = 'cash' AND NEW.driver_id IS NULL AND NEW.status = 'pending' THEN
    PERFORM public.assign_best_rider(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_assign_rider_on_order ON public.orders;
CREATE TRIGGER trg_auto_assign_rider_on_order
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_rider_on_cash_order();
