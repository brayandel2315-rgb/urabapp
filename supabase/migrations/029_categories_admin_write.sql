-- Admin puede gestionar categorías del catálogo (/explorar)

DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
CREATE POLICY "categories_admin_write" ON public.categories
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
