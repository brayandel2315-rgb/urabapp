-- RLS: dueños leen siempre su comercio; admin lee todos (incl. inactivos / no publicados).
-- Sin SELECT explícito del dueño, UPDATE puede fallar silenciosamente bajo RLS de Postgres.

DROP POLICY IF EXISTS businesses_owner_read ON public.businesses;
CREATE POLICY businesses_owner_read ON public.businesses
  FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS businesses_admin_read ON public.businesses;
CREATE POLICY businesses_admin_read ON public.businesses
  FOR SELECT
  USING (public.is_admin());
