-- Políticas RLS adicionales para Urabapp

CREATE POLICY IF NOT EXISTS "categories_public_read" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "banners_public_read" ON public.banners
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "coupons_public_read" ON public.coupons
  FOR SELECT USING (is_active = true);

CREATE POLICY IF NOT EXISTS "order_items_own" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "order_items_insert" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "orders_update_own" ON public.orders
  FOR UPDATE USING (auth.uid() = customer_id);
