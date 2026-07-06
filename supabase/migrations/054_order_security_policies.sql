-- Extiende cancelación del cliente (antes de mensajero) y fallback de pago Wompi → efectivo

DROP POLICY IF EXISTS orders_customer_cancel ON public.orders;

CREATE POLICY orders_customer_cancel ON public.orders
  FOR UPDATE
  USING (
    auth.uid() = customer_id
    AND driver_id IS NULL
    AND status IN ('pending', 'accepted', 'preparing')
  )
  WITH CHECK (
    auth.uid() = customer_id
    AND status = 'cancelled'
    AND driver_id IS NULL
  );

DROP POLICY IF EXISTS orders_customer_payment_fallback ON public.orders;

CREATE POLICY orders_customer_payment_fallback ON public.orders
  FOR UPDATE
  USING (
    auth.uid() = customer_id
    AND status = 'pending'
    AND payment_method = 'wompi'
  )
  WITH CHECK (
    auth.uid() = customer_id
    AND status = 'pending'
    AND payment_method = 'cash'
    AND payment_status = 'pending'
  );
