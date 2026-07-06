-- Urabapp: políticas operativas para pedidos, negocios y catálogo público

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(public.current_user_role() = 'ADMIN', false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(public.current_user_role() IN ('ADMIN', 'RIDER'), false);
$$ LANGUAGE sql SECURITY DEFINER STABLE;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_public_read" ON public.categories;
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "banners_public_read" ON public.banners;
CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "coupons_public_read" ON public.coupons;
CREATE POLICY "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "order_items_own" ON public.order_items;
CREATE POLICY "order_items_own" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
  );

DROP POLICY IF EXISTS "order_items_insert" ON public.order_items;
CREATE POLICY "order_items_insert" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
  );

DROP POLICY IF EXISTS "order_items_business_read" ON public.order_items;
CREATE POLICY "order_items_business_read" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.businesses b ON b.id = o.business_id
      WHERE o.id = order_id AND (b.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
CREATE POLICY "orders_update_own" ON public.orders
  FOR UPDATE USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "orders_business_read" ON public.orders;
CREATE POLICY "orders_business_read" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND (b.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "orders_staff_update" ON public.orders;
CREATE POLICY "orders_staff_update" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND (b.owner_id = auth.uid() OR public.is_admin())
    )
    OR public.is_staff()
  );

DROP POLICY IF EXISTS "orders_rider_read" ON public.orders;
CREATE POLICY "orders_rider_read" ON public.orders
  FOR SELECT USING (
    public.is_staff() AND status IN ('accepted', 'preparing', 'on_the_way')
  );

-- Vincular El Bananero al dueño de la app
UPDATE public.businesses
SET owner_id = (SELECT id FROM public.users WHERE email = 'brayandel001@gmail.com' LIMIT 1)
WHERE id = 'a0000001-0000-0000-0000-000000000001';
