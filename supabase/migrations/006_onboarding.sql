-- Urabapp Fase 1: onboarding express, slugs y políticas de negocio

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS zone TEXT;

UPDATE public.businesses
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL;

CREATE OR REPLACE FUNCTION public.slugify_business_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.name, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS businesses_slug_trigger ON public.businesses;
CREATE TRIGGER businesses_slug_trigger
  BEFORE INSERT ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.slugify_business_name();

CREATE OR REPLACE FUNCTION public.set_business_owner_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.owner_id IS NOT NULL THEN
    UPDATE public.users SET role = 'BUSINESS', updated_at = NOW()
    WHERE id = NEW.owner_id AND role = 'CLIENT';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_business_created ON public.businesses;
CREATE TRIGGER on_business_created
  AFTER INSERT ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.set_business_owner_role();

CREATE OR REPLACE FUNCTION public.set_driver_role()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users SET role = 'RIDER', updated_at = NOW()
  WHERE id = NEW.user_id AND role = 'CLIENT';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_driver_created ON public.drivers;
CREATE TRIGGER on_driver_created
  AFTER INSERT ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.set_driver_role();

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "businesses_owner_insert" ON public.businesses;
CREATE POLICY "businesses_owner_insert" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = owner_id OR public.is_admin());

DROP POLICY IF EXISTS "businesses_owner_update" ON public.businesses;
CREATE POLICY "businesses_owner_update" ON public.businesses
  FOR UPDATE USING (auth.uid() = owner_id OR public.is_admin());

DROP POLICY IF EXISTS "products_owner_insert" ON public.products;
CREATE POLICY "products_owner_insert" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND (b.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "products_owner_update" ON public.products;
CREATE POLICY "products_owner_update" ON public.products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND (b.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "products_owner_delete" ON public.products;
CREATE POLICY "products_owner_delete" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND (b.owner_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "users_admin_read" ON public.users;
CREATE POLICY "users_admin_read" ON public.users
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "users_admin_update" ON public.users;
CREATE POLICY "users_admin_update" ON public.users
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "drivers_own" ON public.drivers;
CREATE POLICY "drivers_own" ON public.drivers
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "drivers_staff_read" ON public.drivers;
CREATE POLICY "drivers_staff_read" ON public.drivers
  FOR SELECT USING (public.is_staff());
