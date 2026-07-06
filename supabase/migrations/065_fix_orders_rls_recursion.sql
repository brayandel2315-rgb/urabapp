-- 065: Evitar recursión orders <-> courier_offers en RLS

CREATE OR REPLACE FUNCTION public.driver_has_pending_offer(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.courier_offers co
    WHERE co.order_id = p_order_id
      AND co.driver_id = public.auth_driver_id()
      AND co.status = 'pending'
      AND co.expires_at > NOW()
  );
$$;

REVOKE ALL ON FUNCTION public.driver_has_pending_offer(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.driver_has_pending_offer(UUID) TO authenticated;

DROP POLICY IF EXISTS orders_driver_read ON public.orders;
CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.is_approved_driver()
      AND (
        driver_id = public.auth_driver_id()
        OR (
          driver_id IS NULL
          AND status IN ('pending', 'accepted', 'preparing', 'on_the_way')
          AND public.municipios_match(dest_municipio, public.auth_driver_municipio())
        )
        OR public.driver_has_pending_offer(id)
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
  );
