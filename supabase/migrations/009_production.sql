-- Urabapp 009: producción — timestamps, admin update, mensajeros

DROP POLICY IF EXISTS "orders_admin_update" ON public.orders;
CREATE POLICY "orders_admin_update" ON public.orders
  FOR UPDATE USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.orders_status_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'accepted' AND (OLD.accepted_at IS NULL OR OLD.status IS DISTINCT FROM 'accepted') THEN
    NEW.accepted_at = NOW();
  END IF;
  IF NEW.status = 'delivered' AND (OLD.delivered_at IS NULL OR OLD.status IS DISTINCT FROM 'delivered') THEN
    NEW.delivered_at = NOW();
  END IF;
  IF NEW.status = 'cancelled' AND (OLD.cancelled_at IS NULL OR OLD.status IS DISTINCT FROM 'cancelled') THEN
    NEW.cancelled_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_status_timestamps_trigger ON public.orders;
CREATE TRIGGER orders_status_timestamps_trigger
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_status_timestamps();

CREATE OR REPLACE FUNCTION public.orders_driver_delivered()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'delivered' AND OLD.status IS DISTINCT FROM 'delivered' AND NEW.driver_id IS NOT NULL THEN
    UPDATE public.drivers
    SET total_deliveries = total_deliveries + 1, updated_at = NOW()
    WHERE id = NEW.driver_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS orders_driver_delivered_trigger ON public.orders;
CREATE TRIGGER orders_driver_delivered_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.orders_driver_delivered();

DROP POLICY IF EXISTS "drivers_admin_read" ON public.drivers;
CREATE POLICY "drivers_admin_read" ON public.drivers
  FOR SELECT USING (public.is_admin() OR public.is_staff());
