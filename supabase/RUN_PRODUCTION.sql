-- Urabapp — SQL de producción (todo en uno)
-- Proyecto: ekqaocauvoajpjyraeyo
-- Generado: 2026-07-05
-- Migraciones incluidas: 001–025 + 37 adicionales (hasta 057_client_security_hardening.sql)
--
-- CÓMO EJECUTAR:
-- 1. Supabase Dashboard → SQL Editor → New query
-- 2. Pegar TODO este archivo y Run
-- 3. Activar Auth: Email, Google, Anonymous (Authentication → Providers)
-- 4. Inicia sesión en la app con tu email admin
-- 5. Ejecutar supabase/migrations/002_admin_brayan.sql (personalizado)
--
-- NOTA: 002 NO está incluido — requiere que exista tu perfil en public.users.
-- Alternativa recomendada: supabase db push (CLI)

-- ═══ PASO 1: Esquema base (001) ═══

-- Urabapp — Esquema inicial
-- Ejecutar en Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

-- USUARIOS (perfil extendido)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  full_name TEXT NOT NULL DEFAULT 'Usuario',
  avatar_url TEXT,
  municipio TEXT DEFAULT 'Apartadó'
    CHECK (municipio IN ('Apartadó','Turbo','Carepa','Chigorodó','Necoclí')),
  role TEXT DEFAULT 'CLIENT'
    CHECK (role IN ('CLIENT','BUSINESS','RIDER','ADMIN')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CATEGORÍAS
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- NEGOCIOS
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🏪',
  logo_url TEXT,
  cover_url TEXT,
  phone TEXT,
  municipio TEXT NOT NULL DEFAULT 'Apartadó',
  address TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  is_open BOOLEAN DEFAULT TRUE,
  opens_at TIME DEFAULT '08:00',
  closes_at TIME DEFAULT '22:00',
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_ratings INTEGER DEFAULT 0,
  delivery_fee INTEGER DEFAULT 3000,
  min_order INTEGER DEFAULT 10000,
  delivery_time INTEGER DEFAULT 25,
  commission_pct DECIMAL(5,2) DEFAULT 15.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUCTOS
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT,
  image_url TEXT,
  price INTEGER NOT NULL,
  category TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DIRECCIONES
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  municipio TEXT NOT NULL,
  barrio TEXT,
  address TEXT NOT NULL,
  reference TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  is_default BOOLEAN DEFAULT FALSE,
  label TEXT DEFAULT 'Casa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DOMICILIARIOS
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.users(id),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle TEXT DEFAULT 'moto',
  plate TEXT,
  municipio TEXT DEFAULT 'Apartadó',
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  is_online BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_deliveries INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PEDIDOS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE DEFAULT 'URA-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0'),
  customer_id UUID NOT NULL REFERENCES public.users(id),
  business_id UUID REFERENCES public.businesses(id),
  driver_id UUID REFERENCES public.drivers(id),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','accepted','preparing','on_the_way','delivered','cancelled')),
  dest_municipio TEXT NOT NULL,
  dest_address TEXT NOT NULL,
  dest_reference TEXT,
  dest_latitude DECIMAL(9,6),
  dest_longitude DECIMAL(9,6),
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 3000,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending',
  notes TEXT,
  estimated_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ
);

-- ITEMS DEL PEDIDO
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  name TEXT NOT NULL,
  emoji TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  notes TEXT
);

-- PAGOS
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id),
  amount INTEGER NOT NULL,
  method TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RESEÑAS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID UNIQUE REFERENCES public.orders(id),
  user_id UUID REFERENCES public.users(id),
  business_id UUID REFERENCES public.businesses(id),
  driver_id UUID REFERENCES public.drivers(id),
  business_rating INTEGER CHECK (business_rating BETWEEN 1 AND 5),
  driver_rating INTEGER CHECK (driver_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICACIONES
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'order',
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CUPONES
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT DEFAULT 'fixed',
  discount_value INTEGER NOT NULL,
  min_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BANNERS
CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link TEXT,
  municipio TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Usuario'),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS básico
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own" ON public.users;
CREATE POLICY "users_read_own" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "users_update_own" ON public.users;
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "businesses_public_read" ON public.businesses;
CREATE POLICY "businesses_public_read" ON public.businesses FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "products_public_read" ON public.products;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (is_available = true);
DROP POLICY IF EXISTS "orders_own" ON public.orders;
CREATE POLICY "orders_own" ON public.orders FOR SELECT USING (auth.uid() = customer_id);
DROP POLICY IF EXISTS "orders_insert_own" ON public.orders;
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
DROP POLICY IF EXISTS "addresses_own" ON public.addresses;
CREATE POLICY "addresses_own" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- ═══ PASO 2: Datos iniciales (seed) ═══

-- Seed inicial Urabapp — Apartadó
INSERT INTO public.categories (id, name, emoji, sort_order) VALUES
  ('comida', 'Comida', '🍔', 1),
  ('farmacia', 'Farmacia', '💊', 2),
  ('mercado', 'Mercado', '🛒', 3),
  ('mandados', 'Mandados', '📦', 4),
  ('mascotas', 'Mascotas', '🐾', 5),
  ('tecnologia', 'Tecnología', '📱', 6),
  ('licoreria', 'Licorería', '🍺', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.banners (title, subtitle, municipio, sort_order) VALUES
  ('Envío gratis hoy', 'En pedidos mayores a $25.000', 'Apartadó', 1),
  ('Conexión local', 'Pide de tus tiendas favoritas', 'Apartadó', 2);

-- Negocios (IDs fijos para referencia en productos)
INSERT INTO public.businesses (id, name, category, description, emoji, municipio, delivery_fee, min_order, delivery_time, rating) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Restaurante El Bananero', 'comida', 'Comida típica urabaense', '🍌', 'Apartadó', 3000, 15000, 25, 4.8),
  ('a0000001-0000-0000-0000-000000000002', 'Mecato La Esquina', 'comida', 'Snacks y comida rápida', '🍟', 'Apartadó', 2500, 10000, 15, 4.5),
  ('a0000001-0000-0000-0000-000000000003', 'Farmacia San Rafael', 'farmacia', 'Medicamentos y aseo', '💊', 'Apartadó', 2000, 8000, 20, 4.9),
  ('a0000001-0000-0000-0000-000000000004', 'Supermercado El Ahorro', 'mercado', 'Mercado del barrio', '🛒', 'Apartadó', 3500, 20000, 30, 4.6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (business_id, name, description, emoji, price, category) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Sancocho de pescado', 'Con plátano y yuca', '🍲', 18000, 'Platos'),
  ('a0000001-0000-0000-0000-000000000001', 'Patacón con hogao', 'Crujiente y casero', '🍌', 12000, 'Platos'),
  ('a0000001-0000-0000-0000-000000000001', 'Jugo natural', 'Mango o lulo', '🥤', 5000, 'Bebidas'),
  ('a0000001-0000-0000-0000-000000000002', 'Perro caliente', 'Con salsas', '🌭', 8000, 'Rápida'),
  ('a0000001-0000-0000-0000-000000000002', 'Salchipapas', 'Grande', '🍟', 12000, 'Rápida'),
  ('a0000001-0000-0000-0000-000000000003', 'Acetaminofén x10', '500mg', '💊', 6000, 'Medicamentos'),
  ('a0000001-0000-0000-0000-000000000004', 'Arroz 1kg', 'Diana o Flor', '🍚', 4500, 'Granos'),
  ('a0000001-0000-0000-0000-000000000004', 'Huevos x12', 'Frescos', '🥚', 9000, 'Lácteos');

INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order, is_active) VALUES
  ('URABA10', '10% en tu primer pedido', 'percent', 10, 15000, FALSE),
  ('ENVIOGRATIS', 'Envío gratis', 'fixed', 3000, 25000, FALSE)
ON CONFLICT (code) DO UPDATE SET is_active = EXCLUDED.is_active;

-- ═══ PASO 3: 004 operational ═══

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

-- ═══ PASO 4: 005 admin read orders ═══

DROP POLICY IF EXISTS "orders_admin_read" ON public.orders;
CREATE POLICY "orders_admin_read" ON public.orders
  FOR SELECT USING (public.is_admin());

-- ═══ PASO 5: 006 onboarding ═══

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

-- ═══ PASO 6: 007 apartado seed ═══

-- Urabapp Fase 1: datos Apartadó + trigger usuarios anónimos

UPDATE public.businesses SET
  delivery_fee = 5000,
  zone = CASE id::text
    WHEN 'a0000001-0000-0000-0000-000000000001' THEN 'Centro'
    WHEN 'a0000001-0000-0000-0000-000000000002' THEN 'Ortiz'
    WHEN 'a0000001-0000-0000-0000-000000000003' THEN 'Laureles'
    WHEN 'a0000001-0000-0000-0000-000000000004' THEN 'Vélez'
    ELSE zone
  END,
  commission_pct = 12
WHERE municipio = 'Apartadó';

UPDATE public.banners SET
  title = 'Validación Fase 1',
  subtitle = 'Apartadó — pedidos reales, entrega local'
WHERE title = 'Envío gratis hoy';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'Usuario'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ═══ PASO 7: 008 realtime ═══

-- Habilitar Realtime en pedidos (tracking en vivo)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;

-- ═══ PASO 8: 009 production ═══

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

-- ═══ PASO 9: 010 seed 20 comercios ═══

-- 20 comercios Apartadó — Fase 1 operación
-- Ejecutar después de 001-009. Productos opcionales por comercio.

INSERT INTO public.businesses (id, name, category, description, emoji, municipio, zone, delivery_fee, min_order, delivery_time, rating, is_open, is_active) VALUES
  ('b0000001-0000-0000-0000-000000000005', 'Asados El Prado', 'comida', 'Carnes y parrilla', '🥩', 'Apartadó', 'Centro', 5000, 18000, 30, 4.7, true, true),
  ('b0000001-0000-0000-0000-000000000006', 'Pizza Roma', 'comida', 'Pizzas y pastas', '🍕', 'Apartadó', 'Centro', 5000, 20000, 35, 4.6, true, true),
  ('b0000001-0000-0000-0000-000000000007', 'Café La Parada', 'comida', 'Café y panadería', '☕', 'Apartadó', 'Ortiz', 5000, 12000, 20, 4.8, true, true),
  ('b0000001-0000-0000-0000-000000000008', 'Pollería El Corral', 'comida', 'Pollo broaster', '🍗', 'Apartadó', 'Ortiz', 5000, 15000, 25, 4.5, true, true),
  ('b0000001-0000-0000-0000-000000000009', 'Sushi Wok', 'comida', 'Sushi y wok', '🍣', 'Apartadó', 'Laureles', 5000, 25000, 40, 4.4, true, true),
  ('b0000001-0000-0000-0000-000000000010', 'Heladería Polar', 'comida', 'Helados y postres', '🍦', 'Apartadó', 'Laureles', 5000, 10000, 15, 4.9, true, true),
  ('b0000001-0000-0000-0000-000000000011', 'Droguería El Ahorro', 'farmacia', 'Medicamentos', '💊', 'Apartadó', 'Vélez', 5000, 8000, 20, 4.7, true, true),
  ('b0000001-0000-0000-0000-000000000012', 'Tienda Don Pedro', 'mercado', 'Abarrotes del barrio', '🏪', 'Apartadó', 'Vélez', 5000, 15000, 25, 4.5, true, true),
  ('b0000001-0000-0000-0000-000000000013', 'Panadería San José', 'mercado', 'Pan fresco diario', '🥖', 'Apartadó', 'Centro', 5000, 10000, 20, 4.8, true, true),
  ('b0000001-0000-0000-0000-000000000014', 'Frutas El Campo', 'mercado', 'Frutas y verduras', '🍎', 'Apartadó', 'Ortiz', 5000, 12000, 25, 4.6, true, true),
  ('b0000001-0000-0000-0000-000000000015', 'Papelería Estudiantil', 'tiendas', 'Útiles y copias', '📚', 'Apartadó', 'Centro', 5000, 10000, 20, 4.5, true, true),
  ('b0000001-0000-0000-0000-000000000016', 'TecnoUrabá', 'tecnologia', 'Accesorios celular', '📱', 'Apartadó', 'Laureles', 5000, 20000, 30, 4.4, true, true),
  ('b0000001-0000-0000-0000-000000000017', 'Mascotas Felices', 'mascotas', 'Alimento y accesorios', '🐾', 'Apartadó', 'Vélez', 5000, 15000, 25, 4.7, true, true),
  ('b0000001-0000-0000-0000-000000000018', 'Licores Centro', 'licoreria', 'Cerveza y licores', '🍺', 'Apartadó', 'Centro', 5000, 25000, 20, 4.3, true, true),
  ('b0000001-0000-0000-0000-000000000019', 'Arepas Doña Rosa', 'comida', 'Arepas y huevos', '🫓', 'Apartadó', 'Ortiz', 5000, 10000, 15, 4.9, true, true),
  ('b0000001-0000-0000-0000-000000000020', 'Cevichería El Mar', 'comida', 'Ceviches y cocteles', '🦐', 'Apartadó', 'Laureles', 5000, 22000, 35, 4.6, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (business_id, name, description, emoji, price, category) VALUES
  ('b0000001-0000-0000-0000-000000000005', 'Picada familiar', 'Para 4 personas', '🥩', 45000, 'Platos'),
  ('b0000001-0000-0000-0000-000000000006', 'Pizza hawaiana', 'Mediana', '🍕', 28000, 'Pizzas'),
  ('b0000001-0000-0000-0000-000000000007', 'Café con leche + pandebono', 'Desayuno', '☕', 8000, 'Desayunos'),
  ('b0000001-0000-0000-0000-000000000008', 'Combo broaster', 'Con papas y gaseosa', '🍗', 22000, 'Combos'),
  ('b0000001-0000-0000-0000-000000000019', 'Arepa de huevo', 'Doble', '🫓', 7000, 'Arepas'),
  ('b0000001-0000-0000-0000-000000000020', 'Ceviche mixto', 'Porción grande', '🦐', 28000, 'Ceviches');

-- ═══ PASO 10: 011 seed products all ═══

-- Productos para comercios sin menú + segundo plato en comida
INSERT INTO public.products (business_id, name, description, emoji, price, category)
SELECT b.id,
  CASE b.category
    WHEN 'comida' THEN 'Combo del día'
    WHEN 'farmacia' THEN 'Consulta básica'
    WHEN 'mercado' THEN 'Canasta básica'
    WHEN 'licoreria' THEN 'Sixpack cerveza'
    WHEN 'mascotas' THEN 'Alimento mascota 1kg'
    WHEN 'tecnologia' THEN 'Cable USB-C'
    ELSE 'Producto destacado'
  END,
  'Disponible para pedido en Urabapp',
  CASE b.category
    WHEN 'comida' THEN '🍽️'
    WHEN 'farmacia' THEN '💊'
    WHEN 'mercado' THEN '🛒'
    WHEN 'licoreria' THEN '🍺'
    WHEN 'mascotas' THEN '🐾'
    WHEN 'tecnologia' THEN '📱'
    ELSE '⭐'
  END,
  GREATEST(b.min_order, 8000),
  'General'
FROM public.businesses b
WHERE b.is_active = true
  AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.business_id = b.id);

INSERT INTO public.products (business_id, name, description, emoji, price, category)
SELECT b.id, 'Segundo plato', 'Opción adicional del menú', '🍴', GREATEST(b.min_order + 2000, 10000), 'Platos'
FROM public.businesses b
WHERE b.is_active = true AND b.category = 'comida'
  AND (SELECT COUNT(*) FROM public.products p WHERE p.business_id = b.id) = 1;

-- ═══ PASO 11: 012 restrict customer order update ═══

-- 012: Los clientes no deben poder cambiar el estado del pedido (solo staff/negocio)
DROP POLICY IF EXISTS "orders_update_own" ON public.orders;

-- ═══ PASO 12: 013 phase2 50 comercios ═══

-- Fase 2: 30 comercios adicionales (total 50) + categoría envíos

INSERT INTO public.categories (id, name, emoji, sort_order) VALUES
  ('envios', 'Envíos', '📦', 8),
  ('tiendas', 'Tiendas', '🏪', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.businesses (id, name, category, description, emoji, municipio, zone, delivery_fee, min_order, delivery_time, rating, is_open, is_active) VALUES
  ('c0000002-0000-0000-0000-000000000021', 'Burger Urban', 'comida', 'Hamburguesas artesanales', '🍔', 'Apartadó', 'Centro', 5000, 15000, 25, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000022', 'Empanadas El Rincón', 'comida', 'Empanadas y jugos', '🥟', 'Apartadó', 'Centro', 5000, 10000, 20, 4.8, true, true),
  ('c0000002-0000-0000-0000-000000000023', 'Carnes Frías Don Luis', 'mercado', 'Carnes y embutidos', '🥓', 'Apartadó', 'Centro', 5000, 18000, 25, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000024', 'Óptica Visión', 'tiendas', 'Lentes y monturas', '👓', 'Apartadó', 'Centro', 5000, 20000, 30, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000025', 'Ropa Sport Urabá', 'tiendas', 'Ropa deportiva', '👕', 'Apartadó', 'Centro', 5000, 25000, 30, 4.3, true, true),
  ('c0000002-0000-0000-0000-000000000026', 'Tacos México', 'comida', 'Tacos y burritos', '🌮', 'Apartadó', 'Ortiz', 5000, 12000, 25, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000027', 'Jugos Naturales', 'comida', 'Jugos y batidos', '🥤', 'Apartadó', 'Ortiz', 5000, 8000, 15, 4.9, true, true),
  ('c0000002-0000-0000-0000-000000000028', 'Ferretería El Martillo', 'tiendas', 'Herramientas y materiales', '🔨', 'Apartadó', 'Ortiz', 5000, 15000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000029', 'Pescadería El Golfo', 'mercado', 'Pescado fresco', '🐟', 'Apartadó', 'Ortiz', 5000, 15000, 25, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000030', 'Droguería Salud Total', 'farmacia', 'Medicamentos y cuidado', '💊', 'Apartadó', 'Ortiz', 5000, 8000, 20, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000031', 'Restaurante Veggie', 'comida', 'Comida saludable', '🥗', 'Apartadó', 'Laureles', 5000, 18000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000032', 'Pastelería Dulce Hogar', 'comida', 'Tortas y postres', '🎂', 'Apartadó', 'Laureles', 5000, 12000, 25, 4.8, true, true),
  ('c0000002-0000-0000-0000-000000000033', 'Librería Urabá', 'tiendas', 'Libros y útiles', '📖', 'Apartadó', 'Laureles', 5000, 10000, 25, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000034', 'Verduras La Huerta', 'mercado', 'Verduras orgánicas', '🥬', 'Apartadó', 'Laureles', 5000, 10000, 20, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000035', 'Cafetería Express', 'comida', 'Café para llevar', '☕', 'Apartadó', 'Laureles', 5000, 8000, 15, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000036', 'Pollería La Brasa', 'comida', 'Pollo a la brasa', '🍗', 'Apartadó', 'Vélez', 5000, 16000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000037', 'Mini Market 24h', 'mercado', 'Abierto hasta tarde', '🏪', 'Apartadó', 'Vélez', 5000, 12000, 20, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000038', 'Farmacia del Pueblo', 'farmacia', 'Farmacia de barrio', '💊', 'Apartadó', 'Vélez', 5000, 8000, 20, 4.8, true, true),
  ('c0000002-0000-0000-0000-000000000039', 'Zapatería Camina', 'tiendas', 'Calzado', '👟', 'Apartadó', 'Vélez', 5000, 20000, 30, 4.3, true, true),
  ('c0000002-0000-0000-0000-000000000040', 'Chuzos y Pinchos', 'comida', 'Pinchos y chorizos', '🍢', 'Apartadó', 'Vélez', 5000, 10000, 20, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000041', 'Comida Rápida Turbo', 'comida', 'Comida rápida puerto', '🍟', 'Turbo', NULL, 6000, 12000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000042', 'Mercado Turbo Centro', 'mercado', 'Abarrotes Turbo', '🛒', 'Turbo', NULL, 6000, 15000, 35, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000043', 'Farmacia Turbo', 'farmacia', 'Medicamentos Turbo', '💊', 'Turbo', NULL, 6000, 8000, 25, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000044', 'Restaurante Carepa', 'comida', 'Comida casera Carepa', '🍲', 'Carepa', NULL, 6000, 14000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000045', 'Tienda Carepa', 'mercado', 'Mercado Carepa', '🏪', 'Carepa', NULL, 6000, 12000, 25, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000046', 'Comida Chigorodó', 'comida', 'Platos del día', '🍽️', 'Chigorodó', NULL, 6000, 13000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000047', 'Mercado Chigorodó', 'mercado', 'Abarrotes', '🛒', 'Chigorodó', NULL, 6000, 12000, 25, 4.3, true, true),
  ('c0000002-0000-0000-0000-000000000048', 'Necoclí Express', 'comida', 'Comida rápida costa', '🦐', 'Necoclí', NULL, 7000, 15000, 35, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000049', 'Urabapp Envíos', 'envios', 'Hub logístico intermunicipal', '📦', 'Apartadó', 'Centro', 15000, 15000, 240, 5.0, true, true),
  ('c0000002-0000-0000-0000-000000000050', 'Mensajería Rápida Urabá', 'mandados', 'Mandados urgentes', '🛵', 'Apartadó', 'Centro', 5000, 8000, 20, 4.8, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (business_id, name, description, emoji, price, category)
SELECT b.id, 'Producto destacado', 'Disponible en Urabapp Fase 2', '⭐', GREATEST(b.min_order, 8000), 'General'
FROM public.businesses b
WHERE b.id::text LIKE 'c0000002%'
  AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.business_id = b.id);

-- ═══ PASO 13: 014 phase3 notifications ═══

-- Fase 3: notificaciones in-app + RLS

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
CREATE POLICY "notifications_own" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "notifications_insert_system" ON public.notifications;
CREATE POLICY "notifications_insert_system" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id OR public.is_staff() OR public.is_admin());

-- ═══ PASO 14: 015 phase4 economics ═══

-- Fase 4: modelo económico por pedido

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS commission_pct DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS commission_amount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS business_net INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rider_payout INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_gross INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS platform_margin INTEGER DEFAULT 0;

-- Backfill pedidos entregados (comisión 12% sobre subtotal)
UPDATE public.orders o
SET
  commission_pct = CASE WHEN o.business_id IS NOT NULL THEN 12 ELSE 0 END,
  commission_amount = CASE
    WHEN o.business_id IS NOT NULL THEN ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12)
    ELSE 0
  END,
  business_net = CASE
    WHEN o.business_id IS NOT NULL THEN GREATEST(o.subtotal - COALESCE(o.discount, 0), 0)
      - ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12)
    ELSE 0
  END,
  rider_payout = 4000,
  platform_gross = CASE
    WHEN o.business_id IS NOT NULL THEN ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12) + COALESCE(o.delivery_fee, 0)
    ELSE COALESCE(o.delivery_fee, 0)
  END,
  platform_margin = CASE
    WHEN o.business_id IS NOT NULL THEN ROUND(GREATEST(o.subtotal - COALESCE(o.discount, 0), 0) * 0.12) + COALESCE(o.delivery_fee, 0) - 4000 - 700 - 1500
    ELSE COALESCE(o.delivery_fee, 0) - 4000 - 700 - 1500
  END
WHERE o.status = 'delivered'
  AND (o.platform_gross IS NULL OR o.platform_gross = 0);

-- ═══ PASO 15: 016 phase5 differentiators ═══

-- Fase 5: tracking canal (WhatsApp / Instagram) en pedidos

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'pwa';

CREATE INDEX IF NOT EXISTS idx_orders_source ON public.orders(source);

-- ═══ PASO 16: 017 phase6 reviews ═══

-- Fase 6: reseñas + trigger rating comercio

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "reviews_public_read" ON public.reviews;
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "reviews_insert_own" ON public.reviews;
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.refresh_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.business_id IS NOT NULL THEN
    UPDATE public.businesses b
    SET rating = COALESCE((
      SELECT ROUND(AVG(r.business_rating)::numeric, 2)
      FROM public.reviews r
      WHERE r.business_id = NEW.business_id AND r.business_rating IS NOT NULL
    ), b.rating)
    WHERE b.id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_refresh_business_rating ON public.reviews;
CREATE TRIGGER trg_refresh_business_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.refresh_business_rating();

-- ═══ PASO 17: 018 crm platform ═══

-- Urabapp Fase 7 — CRM, analytics, carritos abandonados, soporte

-- Carritos abandonados (sync desde cliente autenticado)
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_name TEXT,
  items_json JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL DEFAULT 0,
  municipio TEXT,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

-- Eventos de analítica / embudo
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  session_id TEXT,
  properties JSONB DEFAULT '{}',
  municipio TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created
  ON public.analytics_events (event_name, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user
  ON public.analytics_events (user_id, created_at DESC);

-- Tickets de soporte
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_status
  ON public.support_tickets (status, created_at DESC);

-- Vista CRM clientes (LTV, frecuencia, churn risk básico)
CREATE OR REPLACE VIEW public.customer_crm_stats
WITH (security_invoker = true) AS
SELECT
  u.id,
  u.full_name,
  u.email,
  u.phone,
  u.municipio,
  u.created_at AS registered_at,
  u.is_active,
  COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') AS order_count,
  COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS ltv,
  COALESCE(AVG(o.total) FILTER (WHERE o.status = 'delivered'), 0) AS avg_ticket,
  MAX(o.created_at) AS last_order_at,
  MIN(o.created_at) FILTER (WHERE o.status <> 'cancelled') AS first_order_at,
  COUNT(o.id) FILTER (WHERE o.status = 'cancelled') AS cancellations,
  CASE
    WHEN MAX(o.created_at) IS NULL THEN 'lead'
    WHEN MAX(o.created_at) < NOW() - INTERVAL '30 days' THEN 'at_risk'
    WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') >= 3 THEN 'loyal'
    WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') = 1 THEN 'new'
    ELSE 'active'
  END AS segment
FROM public.users u
LEFT JOIN public.orders o ON o.customer_id = u.id
WHERE u.role = 'CLIENT'
GROUP BY u.id, u.full_name, u.email, u.phone, u.municipio, u.created_at, u.is_active;

-- Vista CRM comercios
CREATE OR REPLACE VIEW public.business_crm_stats
WITH (security_invoker = true) AS
SELECT
  b.id,
  b.name,
  b.emoji,
  b.municipio,
  b.zone,
  b.category,
  b.is_open,
  b.is_active,
  b.rating,
  b.owner_id,
  COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') AS orders_total,
  COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS orders_delivered,
  COUNT(o.id) FILTER (WHERE o.status = 'cancelled') AS orders_cancelled,
  COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0) AS gmv,
  COALESCE(SUM(o.commission_amount) FILTER (WHERE o.status = 'delivered'), 0) AS commission_total,
  COALESCE(AVG(
    EXTRACT(EPOCH FROM (o.accepted_at - o.created_at)) / 60
  ) FILTER (WHERE o.accepted_at IS NOT NULL), NULL) AS avg_accept_min,
  MAX(o.created_at) AS last_order_at
FROM public.businesses b
LEFT JOIN public.orders o ON o.business_id = b.id
GROUP BY b.id, b.name, b.emoji, b.municipio, b.zone, b.category,
         b.is_open, b.is_active, b.rating, b.owner_id;

-- Vista CRM mensajeros
CREATE OR REPLACE VIEW public.rider_crm_stats
WITH (security_invoker = true) AS
SELECT
  d.id,
  d.user_id,
  d.name,
  d.phone,
  d.municipio,
  d.is_online,
  d.is_verified,
  d.rating,
  d.total_deliveries,
  COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS deliveries_count,
  COALESCE(SUM(o.rider_payout) FILTER (WHERE o.status = 'delivered'), 0) AS earnings_total,
  COALESCE(SUM(o.rider_payout) FILTER (
    WHERE o.status = 'delivered' AND o.delivered_at >= date_trunc('month', NOW())
  ), 0) AS earnings_month,
  MAX(o.delivered_at) AS last_delivery_at
FROM public.drivers d
LEFT JOIN public.orders o ON o.driver_id = d.id
GROUP BY d.id, d.user_id, d.name, d.phone, d.municipio,
         d.is_online, d.is_verified, d.rating, d.total_deliveries;

-- RLS
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "abandoned_carts_own" ON public.abandoned_carts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "abandoned_carts_admin" ON public.abandoned_carts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

CREATE POLICY IF NOT EXISTS "analytics_events_insert" ON public.analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY IF NOT EXISTS "analytics_events_admin" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

CREATE POLICY IF NOT EXISTS "support_tickets_own" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "support_tickets_insert" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "support_tickets_admin" ON public.support_tickets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- Realtime: actividad de pedidos ya habilitada en 008
COMMENT ON VIEW public.customer_crm_stats IS 'CRM clientes: LTV, segmento, churn risk';
COMMENT ON VIEW public.business_crm_stats IS 'CRM comercios: ventas, aceptación, cancelaciones';
COMMENT ON VIEW public.rider_crm_stats IS 'CRM mensajeros: ingresos, entregas, ranking';

GRANT SELECT ON public.customer_crm_stats TO authenticated;
GRANT SELECT ON public.business_crm_stats TO authenticated;
GRANT SELECT ON public.rider_crm_stats TO authenticated;

-- ═══ PASO 18: 019 storage push marketing ═══

-- Urabapp Fase 7b — Storage, marketing admin, push subscriptions

-- ── Storage bucket público ──
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'urabapp-public',
  'urabapp-public',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Lectura pública
DROP POLICY IF EXISTS "urabapp_public_read" ON storage.objects;
CREATE POLICY "urabapp_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'urabapp-public');

-- Subida: admin o dueño del comercio (ruta businesses/{business_id}/...)
DROP POLICY IF EXISTS "urabapp_business_upload" ON storage.objects;
CREATE POLICY "urabapp_business_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'urabapp-public'
    AND (
      public.is_admin()
      OR (
        (storage.foldername(name))[1] = 'businesses'
        AND EXISTS (
          SELECT 1 FROM public.businesses b
          WHERE b.id::text = (storage.foldername(name))[2]
            AND b.owner_id = auth.uid()
        )
      )
      OR (
        (storage.foldername(name))[1] = 'marketing' AND public.is_admin()
      )
    )
  );

DROP POLICY IF EXISTS "urabapp_business_update" ON storage.objects;
CREATE POLICY "urabapp_business_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'urabapp-public'
    AND (
      public.is_admin()
      OR (
        (storage.foldername(name))[1] = 'businesses'
        AND EXISTS (
          SELECT 1 FROM public.businesses b
          WHERE b.id::text = (storage.foldername(name))[2]
            AND b.owner_id = auth.uid()
        )
      )
      OR (
        (storage.foldername(name))[1] = 'marketing' AND public.is_admin()
      )
    )
  );

DROP POLICY IF EXISTS "urabapp_business_delete" ON storage.objects;
CREATE POLICY "urabapp_business_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'urabapp-public'
    AND (
      public.is_admin()
      OR (
        (storage.foldername(name))[1] = 'businesses'
        AND EXISTS (
          SELECT 1 FROM public.businesses b
          WHERE b.id::text = (storage.foldername(name))[2]
            AND b.owner_id = auth.uid()
        )
      )
      OR (
        (storage.foldername(name))[1] = 'marketing' AND public.is_admin()
      )
    )
  );

-- ── Push subscriptions (Web Push) ──
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, endpoint)
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "push_subscriptions_own" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_own" ON public.push_subscriptions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "push_subscriptions_admin" ON public.push_subscriptions;
CREATE POLICY "push_subscriptions_admin" ON public.push_subscriptions
  FOR SELECT USING (public.is_admin());

-- ── Admin CRUD banners y cupones ──
DROP POLICY IF EXISTS "banners_admin_write" ON public.banners;
CREATE POLICY "banners_admin_write" ON public.banners
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "coupons_admin_write" ON public.coupons;
CREATE POLICY "coupons_admin_write" ON public.coupons
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user
  ON public.push_subscriptions (user_id) WHERE is_active = true;

-- ═══ PASO 19: 020 platform integrations ═══

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

-- ═══ PASO 20: 021 notifications realtime ═══

-- Notificaciones en tiempo real (campanita instantánea)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;

-- ═══ PASO 21: 022 dev seed drivers ═══

-- Mensajeros demo para desarrollo / auto-asignación (sin user_id — solo operación)

INSERT INTO public.drivers (id, name, phone, municipio, vehicle, plate, latitude, longitude, is_online, is_verified, rating, total_deliveries)
VALUES
  ('d1000001-0000-4000-8000-000000000001', 'Carlos R.', '3001111001', 'Apartadó', 'moto', 'ABC-01', 7.885100, -75.755000, true, true, 4.90, 12),
  ('d1000002-0000-4000-8000-000000000002', 'María G.', '3001111002', 'Apartadó', 'moto', 'ABC-02', 7.881200, -75.748500, true, true, 4.85, 8),
  ('d1000003-0000-4000-8000-000000000003', 'Juan P.', '3001111003', 'Turbo', 'moto', 'TUR-01', 8.092600, -76.728400, true, true, 4.95, 15),
  ('d1000004-0000-4000-8000-000000000004', 'Laura M.', '3001111004', 'Carepa', 'moto', 'CAR-01', 7.906300, -76.652400, false, true, 4.80, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  municipio = EXCLUDED.municipio,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  is_online = EXCLUDED.is_online,
  is_verified = EXCLUDED.is_verified;

-- ═══ PASO 22: 023 coupons assign distance ═══

-- Cupones: tracking de uso + código en pedido
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS coupon_code TEXT;

ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS uses_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_uses INTEGER;

CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON public.orders(coupon_code);

-- Asignación por proximidad (haversine simplificado) + carga de entregas
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
  SELECT id, driver_id, status, dest_municipio, dest_latitude, dest_longitude,
         payment_method, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN v_order.driver_id; END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN NULL; END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'daviplata')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = true
    AND d.is_verified = true
    AND d.municipio = v_order.dest_municipio
  ORDER BY
    CASE
      WHEN v_order.dest_latitude IS NOT NULL AND d.latitude IS NOT NULL THEN
        POWER(d.latitude::float - v_order.dest_latitude::float, 2)
        + POWER(d.longitude::float - v_order.dest_longitude::float, 2)
      ELSE 999999
    END,
    d.total_deliveries ASC,
    d.rating DESC
  LIMIT 1;

  IF v_rider_id IS NULL THEN RETURN NULL; END IF;

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

-- ═══ PASO 23: 024 in app messaging ═══

-- Urabapp — Mensajería interna (soporte + chat por pedido)

CREATE OR REPLACE FUNCTION public.can_access_order_chat(p_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    LEFT JOIN public.businesses b ON b.id = o.business_id
    LEFT JOIN public.drivers d ON d.id = o.driver_id
    WHERE o.id = p_order_id
      AND (
        o.customer_id = auth.uid()
        OR b.owner_id = auth.uid()
        OR d.user_id = auth.uid()
        OR public.is_admin()
      )
  );
$$;

CREATE TABLE IF NOT EXISTS public.support_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  is_staff BOOLEAN NOT NULL DEFAULT FALSE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket
  ON public.support_messages (ticket_id, created_at ASC);

CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  sender_role TEXT NOT NULL DEFAULT 'client'
    CHECK (sender_role IN ('client', 'business', 'rider', 'support', 'system')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_messages_order
  ON public.order_messages (order_id, created_at ASC);

ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "support_messages_read" ON public.support_messages;
CREATE POLICY "support_messages_read" ON public.support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id
        AND (t.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "support_messages_insert" ON public.support_messages;
CREATE POLICY "support_messages_insert" ON public.support_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.support_tickets t
      WHERE t.id = ticket_id
        AND (
          (t.user_id = auth.uid() AND NOT is_staff)
          OR (public.is_admin() AND is_staff)
        )
    )
  );

DROP POLICY IF EXISTS "order_messages_read" ON public.order_messages;
CREATE POLICY "order_messages_read" ON public.order_messages
  FOR SELECT USING (public.can_access_order_chat(order_id));

DROP POLICY IF EXISTS "order_messages_insert" ON public.order_messages;
CREATE POLICY "order_messages_insert" ON public.order_messages
  FOR INSERT WITH CHECK (
    public.can_access_order_chat(order_id)
    AND sender_id = auth.uid()
    AND sender_role <> 'system'
  );

DROP POLICY IF EXISTS "support_tickets_update_own" ON public.support_tickets;
CREATE POLICY "support_tickets_update_own" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

GRANT SELECT, INSERT ON public.support_messages TO authenticated;
GRANT SELECT, INSERT ON public.order_messages TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'support_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'order_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_messages;
  END IF;
END $$;

COMMENT ON TABLE public.support_messages IS 'Hilo de chat de soporte técnico dentro de la app';
COMMENT ON TABLE public.order_messages IS 'Chat por pedido: cliente, comercio, mensajero';

-- ═══ PASO 24: 025 assign payment methods ═══

-- Incluir alias 'cards' en guard de pagos digitales (cliente usa cards y card)
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
  SELECT id, driver_id, status, dest_municipio, dest_latitude, dest_longitude,
         payment_method, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN v_order.driver_id; END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN NULL; END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'cards', 'daviplata')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  WHERE d.is_online = true
    AND d.is_verified = true
    AND d.municipio = v_order.dest_municipio
  ORDER BY
    CASE
      WHEN v_order.dest_latitude IS NOT NULL AND d.latitude IS NOT NULL THEN
        POWER(d.latitude::float - v_order.dest_latitude::float, 2)
        + POWER(d.longitude::float - v_order.dest_longitude::float, 2)
      ELSE 999999
    END,
    d.total_deliveries ASC,
    d.rating DESC
  LIMIT 1;

  IF v_rider_id IS NULL THEN RETURN NULL; END IF;

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

-- ═══ PASO 25: 025 explore banners apartado ═══

-- Banners de explorar: comercios reales de Apartadó (imágenes vía app hasta subir fotos propias)

UPDATE public.banners
SET
  title = 'Restaurante El Bananero',
  subtitle = 'Sancocho, patacón y comida típica urabaense — pide ya en Apartadó',
  link = '/tienda/restaurante-el-bananero',
  image_url = NULL,
  municipio = 'Apartadó',
  is_active = true,
  sort_order = 1
WHERE sort_order = 1;

UPDATE public.banners
SET
  title = 'Arepas Doña Rosa',
  subtitle = 'Arepas recién hechas en el barrio — domicilio desde $5.000',
  link = '/tienda/arepas-do-a-rosa-b0000001',
  image_url = NULL,
  municipio = 'Apartadó',
  is_active = true,
  sort_order = 2
WHERE sort_order = 2;

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT
  'Farmacia San Rafael',
  'Medicamentos y cuidado personal — te lo llevamos a la puerta',
  '/tienda/farmacia-san-rafael',
  NULL,
  'Apartadó',
  true,
  3
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE sort_order = 3);

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT
  'Jugos Naturales',
  'Jugos de mango, lulo y frutas de la región',
  '/tienda/jugos-naturales-c0000002',
  NULL,
  'Apartadó',
  true,
  4
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE sort_order = 4);

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT
  'Panadería San José',
  'Pan fresco y mecato del barrio — sin hacer fila',
  '/tienda/panader-a-san-jos--b0000001',
  NULL,
  'Apartadó',
  true,
  5
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE sort_order = 5);

-- ═══ MIGRACIÓN 003_rls_policies.sql ═══

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

-- ═══ MIGRACIÓN 026_business_covers_and_banner_images.sql ═══

-- Portadas de comercios + imágenes de banners (catálogo visual Urabá)

-- Comercios destacados por slug
UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=560&fit=crop&q=88'
WHERE slug = 'restaurante-el-bananero' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1590301157894-861180ed07b7?w=800&h=560&fit=crop&q=88'
WHERE slug IN ('arepas-do-a-rosa-b0000001', 'empanadas-el-rinc-n-c0000002') AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=560&fit=crop&q=88'
WHERE slug IN ('farmacia-san-rafael', 'farmacia-del-pueblo-c0000002') AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=800&h=560&fit=crop&q=88'
WHERE slug = 'jugos-naturales-c0000002' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=560&fit=crop&q=88'
WHERE slug = 'panader-a-san-jos--b0000001' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1563805044264-3e1b5491a7b5?w=800&h=560&fit=crop&q=88'
WHERE slug = 'helader-a-polar-b0000001' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1495474473867-e4fbf7ef9f2d?w=800&h=560&fit=crop&q=88'
WHERE slug = 'caf-la-parada-b0000001' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=560&fit=crop&q=88'
WHERE slug = 'pizza-roma-b0000001' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=560&fit=crop&q=88'
WHERE slug = 'mecato-la-esquina' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=560&fit=crop&q=88'
WHERE slug = 'supermercado-el-ahorro' AND cover_url IS NULL;

UPDATE public.businesses SET cover_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=560&fit=crop&q=88'
WHERE slug = 'asados-el-prado-b0000001' AND cover_url IS NULL;

-- Resto por categoría
UPDATE public.businesses SET cover_url = CASE category
  WHEN 'comida' THEN 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=560&fit=crop&q=88'
  WHEN 'farmacia' THEN 'https://images.unsplash.com/photo-1587854692152-cf660b4c8ea2?w=800&h=560&fit=crop&q=88'
  WHEN 'mercado' THEN 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=560&fit=crop&q=88'
  WHEN 'licoreria' THEN 'https://images.unsplash.com/photo-1569529465841-dfecdabbb3db?w=800&h=560&fit=crop&q=88'
  WHEN 'tiendas' THEN 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=560&fit=crop&q=88'
  WHEN 'mandados' THEN 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=560&fit=crop&q=88'
  WHEN 'envios' THEN 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=560&fit=crop&q=88'
  WHEN 'mascotas' THEN 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=560&fit=crop&q=88'
  WHEN 'tecnologia' THEN 'https://images.unsplash.com/photo-1468495240123-6ed6d9600500?w=800&h=560&fit=crop&q=88'
  ELSE 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=560&fit=crop&q=88'
END
WHERE cover_url IS NULL AND is_active = true;

-- Banners explorar — imágenes de comida/comercio
UPDATE public.banners SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1280&h=680&fit=crop&q=88'
WHERE link = '/tienda/restaurante-el-bananero';

UPDATE public.banners SET image_url = 'https://images.unsplash.com/photo-1590301157894-861180ed07b7?w=1280&h=680&fit=crop&q=88'
WHERE link = '/tienda/arepas-do-a-rosa-b0000001';

UPDATE public.banners SET image_url = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1280&h=680&fit=crop&q=88'
WHERE link = '/tienda/farmacia-san-rafael';

UPDATE public.banners SET image_url = 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=1280&h=680&fit=crop&q=88'
WHERE link = '/tienda/jugos-naturales-c0000002';

UPDATE public.banners SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1280&h=680&fit=crop&q=88'
WHERE link = '/tienda/panader-a-san-jos--b0000001';

-- ═══ MIGRACIÓN 027_full_catalog_visuals.sql ═══

-- Catálogo visual completo: 50 comercios + 62 productos (demo presentación)

UPDATE public.businesses b SET cover_url = v.cover
FROM (VALUES
  ('restaurante-el-bananero', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=560&fit=crop&q=90&auto=format'),
  ('arepas-do-a-rosa-b0000001', 'https://images.unsplash.com/photo-1590301157894-861180ed07b7?w=800&h=560&fit=crop&q=90&auto=format'),
  ('asados-el-prado-b0000001', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=560&fit=crop&q=90&auto=format'),
  ('burger-urban-c0000002', 'https://images.unsplash.com/photo-1568901340865-4c42c4bd3921?w=800&h=560&fit=crop&q=90&auto=format'),
  ('caf-la-parada-b0000001', 'https://images.unsplash.com/photo-1495474473867-e4fbf7ef9f2d?w=800&h=560&fit=crop&q=90&auto=format'),
  ('cafeter-a-express-c0000002', 'https://images.unsplash.com/photo-1509042236130-df4c186b52e3?w=800&h=560&fit=crop&q=90&auto=format'),
  ('cevicher-a-el-mar-b0000001', 'https://images.unsplash.com/photo-1565680018434-b75d4c4d0474?w=800&h=560&fit=crop&q=90&auto=format'),
  ('chuzos-y-pinchos-c0000002', 'https://images.unsplash.com/photo-1529042410751-b472fad9b0b5?w=800&h=560&fit=crop&q=90&auto=format'),
  ('empanadas-el-rinc-n-c0000002', 'https://images.unsplash.com/photo-1626700051175-6814f7d4b03b?w=800&h=560&fit=crop&q=90&auto=format'),
  ('helader-a-polar-b0000001', 'https://images.unsplash.com/photo-1563805044264-3e1b5491a7b5?w=800&h=560&fit=crop&q=90&auto=format'),
  ('jugos-naturales-c0000002', 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mecato-la-esquina', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=560&fit=crop&q=90&auto=format'),
  ('pasteler-a-dulce-hogar-c0000002', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=560&fit=crop&q=90&auto=format'),
  ('pizza-roma-b0000001', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=560&fit=crop&q=90&auto=format'),
  ('poller-a-el-corral-b0000001', 'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=800&h=560&fit=crop&q=90&auto=format'),
  ('poller-a-la-brasa-c0000002', 'https://images.unsplash.com/photo-15981002010439-334710cb3e71?w=800&h=560&fit=crop&q=90&auto=format'),
  ('restaurante-veggie-c0000002', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=560&fit=crop&q=90&auto=format'),
  ('sushi-wok-b0000001', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tacos-m-xico-c0000002', 'https://images.unsplash.com/photo-1565299585323-3814c0c0b44c?w=800&h=560&fit=crop&q=90&auto=format'),
  ('farmacia-san-rafael', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=560&fit=crop&q=90&auto=format'),
  ('farmacia-del-pueblo-c0000002', 'https://images.unsplash.com/photo-1587854692152-cf660b4c8ea2?w=800&h=560&fit=crop&q=90&auto=format'),
  ('droguer-a-el-ahorro-b0000001', 'https://images.unsplash.com/photo-1576602975982-48f9fb0b5315?w=800&h=560&fit=crop&q=90&auto=format'),
  ('droguer-a-salud-total-c0000002', 'https://images.unsplash.com/photo-1587854692152-cf660b4c8ea2?w=800&h=560&fit=crop&q=90&auto=format'),
  ('licores-centro-b0000001', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&h=560&fit=crop&q=90&auto=format'),
  ('supermercado-el-ahorro', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=560&fit=crop&q=90&auto=format'),
  ('panader-a-san-jos--b0000001', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=560&fit=crop&q=90&auto=format'),
  ('frutas-el-campo-b0000001', 'https://images.unsplash.com/photo-1610831308542-7b1b7bdfc4fd?w=800&h=560&fit=crop&q=90&auto=format'),
  ('verduras-la-huerta-c0000002', 'https://images.unsplash.com/photo-1540420770143-907678b7e0c6?w=800&h=560&fit=crop&q=90&auto=format'),
  ('carnes-fr-as-don-luis-c0000002', 'https://images.unsplash.com/photo-1607623814075-4477acb3c0fc?w=800&h=560&fit=crop&q=90&auto=format'),
  ('pescader-a-el-golfo-c0000002', 'https://images.unsplash.com/photo-1544947950-f07eade5f4cc?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tienda-don-pedro-b0000001', 'https://images.unsplash.com/photo-1578662996442-48f601eca8e3?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mini-market-24h-c0000002', 'https://images.unsplash.com/photo-1578911373274-32fc53d2a369?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mascotas-felices-b0000001', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mensajer-a-r-pida-urab--c0000002', 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=560&fit=crop&q=90&auto=format'),
  ('urabapp-env-os-c0000002', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tecnourab--b0000001', 'https://images.unsplash.com/photo-1468495240123-6ed6d9600500?w=800&h=560&fit=crop&q=90&auto=format'),
  ('ferreter-a-el-martillo-c0000002', 'https://images.unsplash.com/photo-1504148455328-c376907a0e0c?w=800&h=560&fit=crop&q=90&auto=format'),
  ('librer-a-urab--c0000002', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=560&fit=crop&q=90&auto=format'),
  ('-ptica-visi-n-c0000002', 'https://images.unsplash.com/photo-1574258495973-f010dfbbce28?w=800&h=560&fit=crop&q=90&auto=format'),
  ('papeler-a-estudiantil-b0000001', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=560&fit=crop&q=90&auto=format'),
  ('ropa-sport-urab--c0000002', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=560&fit=crop&q=90&auto=format'),
  ('zapater-a-camina-c0000002', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=560&fit=crop&q=90&auto=format'),
  ('restaurante-carepa-c0000002', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tienda-carepa-c0000002', 'https://images.unsplash.com/photo-1578911373274-32fc53d2a369?w=800&h=560&fit=crop&q=90&auto=format'),
  ('comida-chigorod--c0000002', 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mercado-chigorod--c0000002', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=560&fit=crop&q=90&auto=format'),
  ('necocl-express-c0000002', 'https://images.unsplash.com/photo-1565299585323-3814c0c0b44c?w=800&h=560&fit=crop&q=90&auto=format'),
  ('comida-r-pida-turbo-c0000002', 'https://images.unsplash.com/photo-1572802413324-4d6442f04021?w=800&h=560&fit=crop&q=90&auto=format'),
  ('farmacia-turbo-c0000002', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mercado-turbo-centro-c0000002', 'https://images.unsplash.com/photo-1578662996442-48f601eca8e3?w=800&h=560&fit=crop&q=90&auto=format')
) AS v(slug, cover)
WHERE b.slug = v.slug AND b.is_active = true;

-- Productos: imágenes por emoji y nombre
UPDATE public.products SET image_url = CASE
  WHEN name ILIKE '%sancocho%' OR emoji = '🍲' THEN 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%patac%' OR emoji = '🍌' THEN 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%arepa%' OR emoji = '🫓' THEN 'https://images.unsplash.com/photo-1590301157894-861180ed07b7?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%ceviche%' OR emoji = '🦐' THEN 'https://images.unsplash.com/photo-1565680018434-b75d4c4d0474?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%jugo%' OR emoji = '🥤' THEN 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%perro%' OR emoji = '🌭' THEN 'https://images.unsplash.com/photo-1612392062798-2d1c8d3ad3f5?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%salchi%' OR emoji = '🍟' THEN 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%acetamin%' OR name ILIKE '%medic%' OR emoji = '💊' THEN 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%canasta%' OR emoji = '🛒' THEN 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%combo%' OR emoji = '🍽️' THEN 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%cerveza%' OR emoji = '🍺' THEN 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%mascota%' OR emoji = '🐾' THEN 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%pizza%' OR emoji = '🍕' THEN 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%pollo%' OR name ILIKE '%broaster%' OR emoji = '🍗' THEN 'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%café%' OR name ILIKE '%cafe%' OR emoji = '☕' THEN 'https://images.unsplash.com/photo-1495474473867-e4fbf7ef9f2d?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%picada%' OR emoji = '🥩' THEN 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%arroz%' OR emoji = '🍚' THEN 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%huevo%' OR emoji = '🥚' THEN 'https://images.unsplash.com/photo-1582722878405-44d4faab0ccb?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%cable%' OR name ILIKE '%usb%' OR emoji = '📱' THEN 'https://images.unsplash.com/photo-1468495240123-6ed6d9600500?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN emoji = '🍴' THEN 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=90&auto=format'
  ELSE image_url
END
WHERE is_available = true;

-- Productos destacados y resto: portada del comercio
UPDATE public.products p
SET image_url = b.cover_url
FROM public.businesses b
WHERE p.business_id = b.id
  AND p.is_available = true
  AND (p.image_url IS NULL OR p.emoji = '⭐');

-- Banners adicionales para carrusel demo
INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT 'Pizza Roma', 'Pizzas al horno y pastas — el sabor italiano en Apartadó', '/tienda/pizza-roma-b0000001',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1280&h=680&fit=crop&q=90&auto=format', 'Apartadó', true, 6
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE link = '/tienda/pizza-roma-b0000001');

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT 'Mecato La Esquina', 'Salchipapas, perros calientes y antojos — rápido y rico', '/tienda/mecato-la-esquina',
  'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1280&h=680&fit=crop&q=90&auto=format', 'Apartadó', true, 7
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE link = '/tienda/mecato-la-esquina');

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT 'Cevichería El Mar', 'Ceviches frescos y cocteles de mar — sabor costeño', '/tienda/cevicher-a-el-mar-b0000001',
  'https://images.unsplash.com/photo-1565680018434-b75d4c4d0474?w=1280&h=680&fit=crop&q=90&auto=format', 'Apartadó', true, 8
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE link = '/tienda/cevicher-a-el-mar-b0000001');

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT 'Supermercado El Ahorro', 'Tu mercado del barrio a domicilio — arroz, huevos y más', '/tienda/supermercado-el-ahorro',
  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1280&h=680&fit=crop&q=90&auto=format', 'Apartadó', true, 9
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE link = '/tienda/supermercado-el-ahorro');

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT 'Asados El Prado', 'Carnes a la parrilla y picadas familiares — para compartir', '/tienda/asados-el-prado-b0000001',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1280&h=680&fit=crop&q=90&auto=format', 'Apartadó', true, 10
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE link = '/tienda/asados-el-prado-b0000001');

-- ═══ MIGRACIÓN 028_logos_and_regional_covers.sql ═══

-- Logos demo + fotos regionales Urabá en comercios destacados

UPDATE public.businesses
SET logo_url = cover_url
WHERE is_active = true AND cover_url IS NOT NULL AND (logo_url IS NULL OR logo_url = '');

UPDATE public.businesses
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg',
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg'
WHERE slug = 'restaurante-el-bananero';

UPDATE public.businesses
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Amanecer_Playa_Simona-Turbo_Antioquia.jpg/1280px-Amanecer_Playa_Simona-Turbo_Antioquia.jpg'
WHERE slug IN ('comida-r-pida-turbo-c0000002', 'necocl-express-c0000002');

UPDATE public.businesses
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Colbanana09.jpg/1280px-Colbanana09.jpg'
WHERE slug = 'comida-chigorod--c0000002';

UPDATE public.banners
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg'
WHERE link = '/tienda/restaurante-el-bananero';

-- ═══ MIGRACIÓN 029_business_rating_sync.sql ═══

-- Sincroniza rating y total_ratings desde reseñas de clientes

CREATE OR REPLACE FUNCTION public.refresh_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.business_id IS NOT NULL THEN
    UPDATE public.businesses b
    SET
      rating = COALESCE((
        SELECT ROUND(AVG(r.business_rating)::numeric, 2)
        FROM public.reviews r
        WHERE r.business_id = NEW.business_id AND r.business_rating IS NOT NULL
      ), 0),
      total_ratings = COALESCE((
        SELECT COUNT(*)::integer
        FROM public.reviews r
        WHERE r.business_id = NEW.business_id AND r.business_rating IS NOT NULL
      ), 0)
    WHERE b.id = NEW.business_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Backfill desde reseñas existentes
UPDATE public.businesses b
SET
  rating = COALESCE(stats.avg_rating, 0),
  total_ratings = COALESCE(stats.cnt, 0)
FROM (
  SELECT
    business_id,
    ROUND(AVG(business_rating)::numeric, 2) AS avg_rating,
    COUNT(*)::integer AS cnt
  FROM public.reviews
  WHERE business_rating IS NOT NULL
  GROUP BY business_id
) AS stats
WHERE b.id = stats.business_id;

UPDATE public.businesses
SET rating = 0, total_ratings = 0
WHERE id NOT IN (
  SELECT DISTINCT business_id
  FROM public.reviews
  WHERE business_rating IS NOT NULL AND business_id IS NOT NULL
);

-- ═══ MIGRACIÓN 029_categories_admin_write.sql ═══

-- Admin puede gestionar categorías del catálogo (/explorar)

DROP POLICY IF EXISTS "categories_admin_write" ON public.categories;
CREATE POLICY "categories_admin_write" ON public.categories
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ═══ MIGRACIÓN 030_demo_reviews.sql ═══

-- Reseñas de demostración para poblar Top 3 por municipio (feedback con estrellas)

INSERT INTO public.reviews (business_id, business_rating, comment, created_at) VALUES
-- Apartadó — Top 1: Farmacia San Rafael (~4.93)
('a0000001-0000-0000-0000-000000000003', 5, 'Siempre tienen lo que necesito y llega rápido.', NOW() - INTERVAL '12 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Muy buena atención en mostrador.', NOW() - INTERVAL '11 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Domicilio puntual, recomendada.', NOW() - INTERVAL '10 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Precios justos y buen surtido.', NOW() - INTERVAL '9 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Excelente servicio en Apartadó.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'La mejor farmacia del barrio.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Pedí medicamentos y llegaron bien empacados.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Confiable para urgencias.', NOW() - INTERVAL '5 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Muy amables por WhatsApp.', NOW() - INTERVAL '4 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Siempre cumplen el tiempo de entrega.', NOW() - INTERVAL '3 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Volveré a pedir sin duda.', NOW() - INTERVAL '2 days'),
('a0000001-0000-0000-0000-000000000003', 5, 'Todo llegó correcto.', NOW() - INTERVAL '1 day'),
('a0000001-0000-0000-0000-000000000003', 5, 'Súper recomendados en Laureles.', NOW() - INTERVAL '20 hours'),
('a0000001-0000-0000-0000-000000000003', 5, 'Atención de primera.', NOW() - INTERVAL '10 hours'),
('a0000001-0000-0000-0000-000000000003', 4, 'Bien en general, solo tardó un poco un día.', NOW() - INTERVAL '2 hours'),

-- Apartadó — Top 2: Restaurante El Bananero (4.80)
('a0000001-0000-0000-0000-000000000001', 5, 'El sancocho es espectacular, sabor casero.', NOW() - INTERVAL '14 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Comida típica del Urabá bien servida.', NOW() - INTERVAL '13 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Patacón crujiente, me encantó.', NOW() - INTERVAL '12 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Porciones generosas y buen precio.', NOW() - INTERVAL '11 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Llegó caliente y a tiempo.', NOW() - INTERVAL '10 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Mi restaurante favorito en Apartadó.', NOW() - INTERVAL '9 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'El arroz con camarón es una delicia.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000001', 5, 'Muy buen sazón urabaense.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000001', 4, 'Rico todo, solo faltó un poco más de hogao.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000001', 4, 'Buen pedido, domicilio correcto.', NOW() - INTERVAL '5 days'),

-- Apartadó — Top 3: Mecato La Esquina (4.75)
('a0000001-0000-0000-0000-000000000002', 5, 'Salchipapas enormes, ideal para compartir.', NOW() - INTERVAL '10 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Rápidos y el perro caliente muy bueno.', NOW() - INTERVAL '9 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Perfecto para el mecato de la noche.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Llegó en menos de 20 minutos.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Buen precio y buena porción.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000002', 4, 'Todo bien, las salsas podrían traer más.', NOW() - INTERVAL '5 days'),
('a0000001-0000-0000-0000-000000000002', 4, 'Buen servicio en Ortiz.', NOW() - INTERVAL '4 days'),
('a0000001-0000-0000-0000-000000000002', 5, 'Recomendado para antojos.', NOW() - INTERVAL '3 days'),

-- Apartadó — otros comercios con reseñas
('a0000001-0000-0000-0000-000000000004', 5, 'Mercado completo y buenos precios.', NOW() - INTERVAL '8 days'),
('a0000001-0000-0000-0000-000000000004', 5, 'Frutas y víveres frescos.', NOW() - INTERVAL '7 days'),
('a0000001-0000-0000-0000-000000000004', 4, 'Buen surtido, volveré a pedir.', NOW() - INTERVAL '6 days'),
('a0000001-0000-0000-0000-000000000004', 4, 'Domicilio puntual.', NOW() - INTERVAL '5 days'),
('a0000001-0000-0000-0000-000000000004', 5, 'Muy práctico para la casa.', NOW() - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000020', 5, 'Ceviche fresco, sabor costeño.', NOW() - INTERVAL '6 days'),
('b0000001-0000-0000-0000-000000000020', 4, 'Muy rico, buena porción.', NOW() - INTERVAL '5 days'),
('b0000001-0000-0000-0000-000000000020', 4, 'Recomendado si te gusta el marisco.', NOW() - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000020', 5, 'Llegó bien empacado.', NOW() - INTERVAL '3 days'),
('b0000001-0000-0000-0000-000000000006', 4, 'Pizza buena para el precio.', NOW() - INTERVAL '5 days'),
('b0000001-0000-0000-0000-000000000006', 4, 'Llegó caliente.', NOW() - INTERVAL '4 days'),
('b0000001-0000-0000-0000-000000000006', 4, 'Sabor aceptable, pediría de nuevo.', NOW() - INTERVAL '3 days'),

-- Turbo
('c0000002-0000-0000-0000-000000000043', 5, 'Farmacia confiable en Turbo.', NOW() - INTERVAL '9 days'),
('c0000002-0000-0000-0000-000000000043', 5, 'Rápidos con el domicilio portuario.', NOW() - INTERVAL '8 days'),
('c0000002-0000-0000-0000-000000000043', 5, 'Buena atención.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000043', 5, 'Siempre encuentro lo que busco.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000043', 4, 'Muy bien en general.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000041', 5, 'Comida rápida sabrosa en el puerto.', NOW() - INTERVAL '8 days'),
('c0000002-0000-0000-0000-000000000041', 5, 'Buen precio para trabajadores.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000041', 4, 'Llegó a tiempo.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000041', 5, 'Recomendado en Turbo.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000042', 5, 'Mercado bien surtido.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000042', 4, 'Buen servicio.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000042', 4, 'Precios del barrio.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000042', 4, 'Volveré a pedir.', NOW() - INTERVAL '4 days'),

-- Carepa
('c0000002-0000-0000-0000-000000000044', 5, 'Comida casera muy rica en Carepa.', NOW() - INTERVAL '8 days'),
('c0000002-0000-0000-0000-000000000044', 5, 'Buen sazón y porción abundante.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000044', 5, 'Domicilio rápido.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000044', 4, 'Muy buena experiencia.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000045', 5, 'Tienda completa para la casa.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000045', 4, 'Buen surtido en Carepa.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000045', 4, 'Atención amable.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000045', 4, 'Recomendada.', NOW() - INTERVAL '4 days'),

-- Chigorodó
('c0000002-0000-0000-0000-000000000046', 5, 'Almuerzo delicioso en Chigorodó.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000046', 5, 'Sabor casero auténtico.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000046', 4, 'Buen pedido.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000046', 5, 'Llegó caliente y rápido.', NOW() - INTERVAL '4 days'),
('c0000002-0000-0000-0000-000000000047', 4, 'Mercado práctico del municipio.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000047', 4, 'Buenos precios.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000047', 4, 'Domicilio correcto.', NOW() - INTERVAL '4 days'),
('c0000002-0000-0000-0000-000000000047', 5, 'Surtido variado.', NOW() - INTERVAL '3 days'),

-- Necoclí
('c0000002-0000-0000-0000-000000000048', 5, 'Excelente comida en la costa.', NOW() - INTERVAL '7 days'),
('c0000002-0000-0000-0000-000000000048', 5, 'Sabor playero, muy recomendado.', NOW() - INTERVAL '6 days'),
('c0000002-0000-0000-0000-000000000048', 5, 'Rápido y fresco.', NOW() - INTERVAL '5 days'),
('c0000002-0000-0000-0000-000000000048', 4, 'Muy buena atención.', NOW() - INTERVAL '4 days'),
('c0000002-0000-0000-0000-000000000048', 5, 'El mejor de Necoclí en la app.', NOW() - INTERVAL '3 days');

-- ═══ MIGRACIÓN 031_business_promos_welcome_delivery.sql ═══

-- Promos por comercio + beneficio único de primera entrega (cédula) con subsidio al mensajero

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS promo_is_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promo_discount_type TEXT
    CHECK (promo_discount_type IS NULL OR promo_discount_type IN ('percent', 'fixed')),
  ADD COLUMN IF NOT EXISTS promo_discount_value INTEGER,
  ADD COLUMN IF NOT EXISTS promo_min_order INTEGER DEFAULT 0;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS document_number TEXT,
  ADD COLUMN IF NOT EXISTS welcome_delivery_used_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS users_document_number_unique
  ON public.users (document_number)
  WHERE document_number IS NOT NULL;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS business_discount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_subsidy INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS welcome_delivery_applied BOOLEAN DEFAULT FALSE;

-- Cupones globales confusos — desactivar (las ofertas pasan a ser por comercio)
UPDATE public.coupons
SET is_active = FALSE
WHERE code IN ('URABA10', 'ENVIOGRATIS');

-- Ejemplos de promos por comercio (solo si existen en seed)
UPDATE public.businesses
SET
  promo_is_active = TRUE,
  promo_discount_type = 'percent',
  promo_discount_value = 10,
  promo_min_order = 15000
WHERE slug IN ('restaurante-el-bananero', 'mecato-la-esquina')
  AND promo_is_active IS NOT TRUE;

UPDATE public.businesses
SET
  promo_is_active = TRUE,
  promo_discount_type = 'fixed',
  promo_discount_value = 2000,
  promo_min_order = 20000
WHERE slug = 'farmacia-san-rafael'
  AND promo_is_active IS NOT TRUE;

-- ═══ MIGRACIÓN 032_courier_module.sql ═══

-- UrabApp — Módulo de mensajería / encomiendas (producción)
-- Extiende orders + ofertas a mensajeros + tracking + OTP entrega

-- ─── Columnas courier en orders ───────────────────────────────────────────
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_type TEXT NOT NULL DEFAULT 'commerce',
  ADD COLUMN IF NOT EXISTS pickup_address TEXT,
  ADD COLUMN IF NOT EXISTS pickup_latitude DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS pickup_longitude DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS distance_km DECIMAL(8,2),
  ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER,
  ADD COLUMN IF NOT EXISTS fare_breakdown JSONB,
  ADD COLUMN IF NOT EXISTS courier_package_type TEXT,
  ADD COLUMN IF NOT EXISTS courier_weight_tier TEXT,
  ADD COLUMN IF NOT EXISTS courier_priority TEXT DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS delivery_otp TEXT,
  ADD COLUMN IF NOT EXISTS delivery_otp_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS courier_search_radius_km INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS courier_phase TEXT;

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_order_type_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_order_type_check
  CHECK (order_type IN ('commerce', 'courier', 'envio'));

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_courier_priority_check;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_courier_priority_check
  CHECK (courier_priority IS NULL OR courier_priority IN ('normal', 'express'));

CREATE INDEX IF NOT EXISTS idx_orders_courier_pending
  ON public.orders (dest_municipio, status)
  WHERE order_type = 'courier' AND status = 'pending' AND driver_id IS NULL;

-- ─── Configuración tarifas (admin) ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.courier_settings (key, value) VALUES
  ('fare_config', '{
    "base": 8000,
    "minFare": 15000,
    "perKm": 850,
    "expressMultiplier": 1.25,
    "peakMultiplier": 1.15,
    "demandMultiplier": 1.0,
    "fuelPriceCop": 13500,
    "fuelEfficiencyKmPerLiter": 35,
    "riderSharePct": 72
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ─── Ofertas a mensajeros (primer aceptado gana) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  payout_estimate INTEGER NOT NULL DEFAULT 0,
  distance_to_pickup_km DECIMAL(8,2),
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (order_id, driver_id)
);

CREATE INDEX IF NOT EXISTS idx_courier_offers_driver_pending
  ON public.courier_offers (driver_id, status, expires_at)
  WHERE status = 'pending';

-- ─── Eventos de tracking ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courier_tracking_order
  ON public.courier_tracking_events (order_id, created_at DESC);

-- ─── OTP automático para courier ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.generate_courier_delivery_otp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_type = 'courier' AND NEW.delivery_otp IS NULL THEN
    NEW.delivery_otp := LPAD((FLOOR(RANDOM() * 10000))::INT::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_courier_delivery_otp ON public.orders;
CREATE TRIGGER trg_courier_delivery_otp
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_courier_delivery_otp();

-- ─── Distancia Haversine (km) ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.haversine_km(
  lat1 DOUBLE PRECISION, lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION, lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION
LANGUAGE sql IMMUTABLE
AS $$
  SELECT 6371 * 2 * ASIN(SQRT(
    POWER(SIN(RADIANS(lat2 - lat1) / 2), 2) +
    COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
    POWER(SIN(RADIANS(lon2 - lon1) / 2), 2)
  ));
$$;

-- ─── Publicar ofertas a mensajeros cercanos ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.publish_courier_offers(
  p_order_id UUID,
  p_radius_km INTEGER DEFAULT 3
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_payout INTEGER;
  v_count INTEGER := 0;
  v_driver RECORD;
  v_expires TIMESTAMPTZ := NOW() + INTERVAL '10 seconds';
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN 0;
  END IF;
  IF v_order.pickup_latitude IS NULL OR v_order.pickup_longitude IS NULL THEN
    RETURN 0;
  END IF;

  v_payout := COALESCE((v_order.fare_breakdown->>'riderPayout')::INT, v_order.rider_payout, 4000);

  UPDATE public.orders
  SET courier_search_radius_km = p_radius_km, courier_phase = 'searching'
  WHERE id = p_order_id;

  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude
    FROM public.drivers d
    WHERE d.is_online = TRUE
      AND d.is_verified = TRUE
      AND d.municipio = v_order.dest_municipio
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND public.haversine_km(
        d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION,
        v_order.pickup_latitude::DOUBLE PRECISION, v_order.pickup_longitude::DOUBLE PRECISION
      ) <= p_radius_km
  LOOP
    INSERT INTO public.courier_offers (
      order_id, driver_id, payout_estimate,
      distance_to_pickup_km, expires_at
    ) VALUES (
      p_order_id,
      v_driver.id,
      v_payout,
      public.haversine_km(
        v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION,
        v_order.pickup_latitude::DOUBLE PRECISION, v_order.pickup_longitude::DOUBLE PRECISION
      ),
      v_expires
    )
    ON CONFLICT (order_id, driver_id) DO UPDATE
      SET status = 'pending',
          expires_at = v_expires,
          payout_estimate = EXCLUDED.payout_estimate,
          distance_to_pickup_km = EXCLUDED.distance_to_pickup_km,
          responded_at = NULL;

    v_count := v_count + 1;
  END LOOP;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'searching', jsonb_build_object('radius_km', p_radius_km, 'offers', v_count));

  RETURN v_count;
END;
$$;

-- ─── Aceptar oferta (atómico — primer mensajero gana) ───────────────────────
CREATE OR REPLACE FUNCTION public.accept_courier_offer(
  p_order_id UUID,
  p_driver_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;
  IF v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_courier');
  END IF;
  IF v_order.driver_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_assigned');
  END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.courier_offers
    WHERE order_id = p_order_id
      AND driver_id = p_driver_id
      AND status = 'pending'
      AND expires_at > NOW()
  ) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'offer_expired');
  END IF;

  UPDATE public.orders
  SET driver_id = p_driver_id,
      status = 'accepted',
      accepted_at = NOW(),
      courier_phase = 'assigned'
  WHERE id = p_order_id AND driver_id IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'race_lost');
  END IF;

  UPDATE public.courier_offers
  SET status = 'accepted', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id = p_driver_id;

  UPDATE public.courier_offers
  SET status = 'expired', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id <> p_driver_id AND status = 'pending';

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'accepted', jsonb_build_object('driver_id', p_driver_id));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── Rechazar oferta ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reject_courier_offer(
  p_order_id UUID,
  p_driver_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.courier_offers
  SET status = 'rejected', responded_at = NOW()
  WHERE order_id = p_order_id
    AND driver_id = p_driver_id
    AND status = 'pending';
END;
$$;

-- ─── Verificar OTP entrega ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.verify_courier_delivery_otp(
  p_order_id UUID,
  p_code TEXT,
  p_driver_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;
  IF p_driver_id IS NOT NULL AND v_order.driver_id IS DISTINCT FROM p_driver_id THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_assigned');
  END IF;
  IF v_order.delivery_otp IS NULL OR v_order.delivery_otp <> TRIM(p_code) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_code');
  END IF;
  IF v_order.delivery_otp_verified_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_verified', true);
  END IF;

  UPDATE public.orders
  SET delivery_otp_verified_at = NOW(),
      status = 'delivered',
      delivered_at = NOW(),
      courier_phase = 'delivered'
  WHERE id = p_order_id;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'delivered', jsonb_build_object('otp_verified', true));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── Actualizar fase courier + evento ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_courier_phase(
  p_order_id UUID,
  p_phase TEXT,
  p_event_type TEXT DEFAULT NULL,
  p_lat DECIMAL DEFAULT NULL,
  p_lng DECIMAL DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.orders SET courier_phase = p_phase WHERE id = p_order_id;

  IF p_event_type IS NOT NULL THEN
    INSERT INTO public.courier_tracking_events (order_id, event_type, latitude, longitude)
    VALUES (p_order_id, p_event_type, p_lat, p_lng);
  END IF;

  IF p_phase = 'picked_up' THEN
    UPDATE public.orders SET picked_up_at = NOW(), status = 'on_the_way'
    WHERE id = p_order_id AND order_type = 'courier';
  ELSIF p_phase = 'arriving_pickup' THEN
    UPDATE public.orders SET status = 'accepted', courier_phase = 'arriving_pickup'
    WHERE id = p_order_id AND order_type = 'courier';
  END IF;
END;
$$;

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.courier_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS courier_offers_driver_read ON public.courier_offers;
CREATE POLICY courier_offers_driver_read ON public.courier_offers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.id = courier_offers.driver_id AND d.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = courier_offers.order_id AND o.customer_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

DROP POLICY IF EXISTS courier_tracking_read ON public.courier_tracking_events;
CREATE POLICY courier_tracking_read ON public.courier_tracking_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = courier_tracking_events.order_id
        AND (o.customer_id = auth.uid()
          OR o.driver_id IN (SELECT id FROM public.drivers WHERE user_id = auth.uid()))
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

DROP POLICY IF EXISTS courier_settings_read ON public.courier_settings;
CREATE POLICY courier_settings_read ON public.courier_settings
  FOR SELECT USING (TRUE);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.courier_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courier_tracking_events;

-- ═══ MIGRACIÓN 033_promotions_engine.sql ═══

-- Motor de promociones Urabapp — campañas, misiones, analytics

CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  promo_type TEXT NOT NULL DEFAULT 'percent'
    CHECK (promo_type IN (
      'percent', 'fixed', 'bogo', 'free_delivery', 'combo',
      'tiered', 'cashback', 'flash', 'personalized'
    )),
  discount_value INTEGER,
  min_order INTEGER DEFAULT 0,
  image_url TEXT,
  badge TEXT CHECK (badge IS NULL OR badge IN ('TOP', 'NUEVO', 'HOT', 'EXPIRA_HOY')),
  category TEXT,
  is_flash BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_bundle BOOLEAN DEFAULT FALSE,
  bundle_items JSONB DEFAULT '[]'::jsonb,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  municipio TEXT,
  segment JSONB DEFAULT '{}'::jsonb,
  max_redemptions INTEGER,
  redemption_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  sort_weight INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS promotions_business_idx ON public.promotions (business_id);
CREATE INDEX IF NOT EXISTS promotions_active_idx ON public.promotions (is_active, ends_at);
CREATE INDEX IF NOT EXISTS promotions_municipio_idx ON public.promotions (municipio);
CREATE INDEX IF NOT EXISTS promotions_flash_idx ON public.promotions (is_flash) WHERE is_flash = TRUE;

CREATE TABLE IF NOT EXISTS public.user_saved_offers (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  promotion_id UUID NOT NULL REFERENCES public.promotions(id) ON DELETE CASCADE,
  remind_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, promotion_id)
);

CREATE TABLE IF NOT EXISTS public.user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  mission_type TEXT NOT NULL DEFAULT 'orders_count',
  title TEXT NOT NULL,
  description TEXT,
  target_count INTEGER NOT NULL DEFAULT 3,
  progress_count INTEGER DEFAULT 0,
  reward_type TEXT DEFAULT 'free_delivery',
  reward_value JSONB DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_missions_user_idx ON public.user_missions (user_id);

CREATE TABLE IF NOT EXISTS public.promo_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID REFERENCES public.promotions(id) ON DELETE SET NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'impression', 'click', 'save', 'unsave', 'share', 'remind', 'redeem', 'quick_buy'
  )),
  properties JSONB DEFAULT '{}'::jsonb,
  municipio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS promo_events_promotion_idx ON public.promo_events (promotion_id, event_type);
CREATE INDEX IF NOT EXISTS promo_events_business_idx ON public.promo_events (business_id, created_at DESC);

-- Campos extendidos en businesses (compatibilidad con motor legacy)
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS promo_title TEXT,
  ADD COLUMN IF NOT EXISTS promo_subtitle TEXT,
  ADD COLUMN IF NOT EXISTS promo_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS promo_badge TEXT,
  ADD COLUMN IF NOT EXISTS promo_is_flash BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS promo_is_featured BOOLEAN DEFAULT FALSE;

-- RLS
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS promotions_public_read ON public.promotions;
CREATE POLICY promotions_public_read ON public.promotions
  FOR SELECT USING (is_active = TRUE AND (ends_at IS NULL OR ends_at > NOW()));

DROP POLICY IF EXISTS promotions_business_write ON public.promotions;
CREATE POLICY promotions_business_write ON public.promotions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = promotions.business_id
        AND b.owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS user_saved_offers_own ON public.user_saved_offers;
CREATE POLICY user_saved_offers_own ON public.user_saved_offers
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS user_missions_own ON public.user_missions;
CREATE POLICY user_missions_own ON public.user_missions
  FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS promo_events_insert ON public.promo_events;
CREATE POLICY promo_events_insert ON public.promo_events
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS promo_events_admin_read ON public.promo_events;
CREATE POLICY promo_events_admin_read ON public.promo_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
    OR user_id = auth.uid()
  );

-- ═══ MIGRACIÓN 034_shipments_intermunicipal.sql ═══

-- UrabApp — Módulo envíos intermunicipales (producto separado de mandados/courier)

-- ─── Configuración tarifas ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_pricing (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.shipment_pricing (key, value) VALUES
  ('default', '{
    "baseFee": 8000,
    "minFee": 15000,
    "perKm": 200,
    "protectionFee": 1500,
    "demandMultiplier": 1.0,
    "weightFees": {"0-2": 0, "2-5": 2000, "5-10": 5000, "10-20": 10000}
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ─── Rutas activas ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  eta_hours INTEGER NOT NULL DEFAULT 4,
  base_fee INTEGER,
  capacity_slots INTEGER NOT NULL DEFAULT 12,
  slots_used INTEGER NOT NULL DEFAULT 0,
  demand_factor DECIMAL(4,2) NOT NULL DEFAULT 1.0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (origin_municipio, dest_municipio)
);

-- ─── Cotizaciones ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  route_id UUID REFERENCES public.shipment_routes(id) ON DELETE SET NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  eta_hours INTEGER NOT NULL,
  package_type TEXT,
  weight_tier TEXT,
  price_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_cop INTEGER NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Pedidos de envío ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_number TEXT UNIQUE NOT NULL DEFAULT 'SHP-' || LPAD((FLOOR(RANDOM() * 99999))::TEXT, 5, '0'),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES public.shipment_quotes(id) ON DELETE SET NULL,
  route_id UUID REFERENCES public.shipment_routes(id) ON DELETE SET NULL,
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN (
      'created', 'searching_carrier', 'accepted', 'pickup',
      'at_hub', 'in_transit', 'arriving', 'delivered', 'completed', 'cancelled'
    )),
  sender_name TEXT NOT NULL,
  sender_phone TEXT NOT NULL,
  sender_whatsapp TEXT,
  sender_document TEXT,
  package_type TEXT NOT NULL DEFAULT 'package',
  weight_tier TEXT NOT NULL DEFAULT '0-2',
  dimensions TEXT,
  declared_value INTEGER DEFAULT 0,
  package_notes TEXT,
  photo_url TEXT,
  pickup_address TEXT NOT NULL,
  pickup_reference TEXT,
  delivery_address TEXT NOT NULL,
  delivery_reference TEXT,
  distance_km DECIMAL(8,2),
  eta_hours INTEGER,
  eta_at TIMESTAMPTZ,
  price_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_cop INTEGER NOT NULL,
  assigned_driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL,
  current_latitude DECIMAL(9,6),
  current_longitude DECIMAL(9,6),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_orders_customer ON public.shipment_orders (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipment_orders_status ON public.shipment_orders (status, origin_municipio);
CREATE INDEX IF NOT EXISTS idx_shipment_orders_route ON public.shipment_orders (route_id, status);

-- ─── Asignaciones (ranking híbrido, no broadcast masivo) ─────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  rank_score DECIMAL(8,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (shipment_id, driver_id)
);

-- ─── Tracking en vivo ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  heading DECIMAL(5,2),
  speed_kmh DECIMAL(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_tracking_shipment ON public.shipment_tracking (shipment_id, recorded_at DESC);

-- ─── Eventos / historial ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  status TEXT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment ON public.shipment_events (shipment_id, created_at DESC);

-- ─── Pagos ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  amount_cop INTEGER NOT NULL,
  method TEXT NOT NULL DEFAULT 'cash',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Logs operativos ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.shipment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipment_orders(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Seed rutas Urabá ────────────────────────────────────────────────────────
INSERT INTO public.shipment_routes (origin_municipio, dest_municipio, distance_km, eta_hours, base_fee, capacity_slots) VALUES
  ('Turbo', 'Apartadó', 32, 4, 15000, 12),
  ('Apartadó', 'Turbo', 32, 4, 15000, 12),
  ('Turbo', 'Carepa', 48, 5, 17000, 10),
  ('Carepa', 'Turbo', 48, 5, 17000, 10),
  ('Turbo', 'Chigorodó', 68, 6, 18000, 8),
  ('Chigorodó', 'Turbo', 68, 6, 18000, 8),
  ('Apartadó', 'Carepa', 18, 3, 12000, 14),
  ('Carepa', 'Apartadó', 18, 3, 12000, 14),
  ('Apartadó', 'Chigorodó', 38, 4, 15000, 12),
  ('Chigorodó', 'Apartadó', 38, 4, 15000, 12),
  ('Carepa', 'Chigorodó', 22, 3, 12000, 12),
  ('Chigorodó', 'Carepa', 22, 3, 12000, 12),
  ('Necoclí', 'Turbo', 28, 4, 15000, 10),
  ('Turbo', 'Necoclí', 28, 4, 15000, 10),
  ('Necoclí', 'Apartadó', 58, 6, 18000, 8),
  ('Apartadó', 'Necoclí', 58, 6, 18000, 8),
  ('San Pedro', 'Apartadó', 42, 5, 16000, 8),
  ('Apartadó', 'San Pedro', 42, 5, 16000, 8),
  ('Arboletes', 'Apartadó', 55, 6, 17500, 8),
  ('Apartadó', 'Arboletes', 55, 6, 17500, 8)
ON CONFLICT (origin_municipio, dest_municipio) DO NOTHING;

-- ─── Helpers ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.touch_shipment_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS shipment_orders_updated ON public.shipment_orders;
CREATE TRIGGER shipment_orders_updated
  BEFORE UPDATE ON public.shipment_orders
  FOR EACH ROW EXECUTE FUNCTION public.touch_shipment_updated_at();

CREATE OR REPLACE FUNCTION public.log_shipment_event(
  p_shipment_id UUID,
  p_event_type TEXT,
  p_status TEXT DEFAULT NULL,
  p_lat DECIMAL DEFAULT NULL,
  p_lng DECIMAL DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.shipment_events (shipment_id, event_type, status, latitude, longitude, metadata)
  VALUES (p_shipment_id, p_event_type, p_status, p_lat, p_lng, p_metadata)
  RETURNING id INTO v_id;

  IF p_status IS NOT NULL THEN
    UPDATE public.shipment_orders SET status = p_status WHERE id = p_shipment_id;
  END IF;

  IF p_lat IS NOT NULL AND p_lng IS NOT NULL THEN
    UPDATE public.shipment_orders
    SET current_latitude = p_lat, current_longitude = p_lng
    WHERE id = p_shipment_id;

    INSERT INTO public.shipment_tracking (shipment_id, latitude, longitude)
    VALUES (p_shipment_id, p_lat, p_lng);
  END IF;

  RETURN v_id;
END;
$$;

-- Ranking híbrido: ruta activa > cercanía > capacidad > historial > disponibilidad
CREATE OR REPLACE FUNCTION public.publish_shipment_assignments(p_shipment_id UUID, p_limit INT DEFAULT 5)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shipment public.shipment_orders%ROWTYPE;
  v_inserted INT := 0;
BEGIN
  SELECT * INTO v_shipment FROM public.shipment_orders WHERE id = p_shipment_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Envío no encontrado';
  END IF;

  UPDATE public.shipment_assignments SET status = 'expired'
  WHERE shipment_id = p_shipment_id AND status = 'pending';

  INSERT INTO public.shipment_assignments (shipment_id, driver_id, rank_score, expires_at)
  SELECT
    p_shipment_id,
    d.id,
    (
      CASE WHEN d.municipio = v_shipment.origin_municipio THEN 40 ELSE 0 END
      + CASE WHEN d.is_online THEN 25 ELSE 0 END
      + LEAST(COALESCE(d.total_deliveries, 0), 50) * 0.3
      + COALESCE(d.rating, 5) * 4
      + CASE WHEN d.is_verified THEN 10 ELSE 0 END
    )::DECIMAL(8,2),
    NOW() + INTERVAL '8 minutes'
  FROM public.drivers d
  WHERE d.is_online = TRUE
    AND d.is_verified = TRUE
    AND d.municipio IN (v_shipment.origin_municipio, v_shipment.dest_municipio)
  ORDER BY (
      CASE WHEN d.municipio = v_shipment.origin_municipio THEN 40 ELSE 0 END
      + CASE WHEN d.is_online THEN 25 ELSE 0 END
      + LEAST(COALESCE(d.total_deliveries, 0), 50) * 0.3
      + COALESCE(d.rating, 5) * 4
      + CASE WHEN d.is_verified THEN 10 ELSE 0 END
    ) DESC
  LIMIT p_limit
  ON CONFLICT (shipment_id, driver_id) DO NOTHING;

  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  PERFORM public.log_shipment_event(
    p_shipment_id, 'assignment_published', 'searching_carrier', NULL, NULL,
    jsonb_build_object('candidates', v_inserted)
  );

  RETURN v_inserted;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_shipment_assignment(p_assignment_id UUID, p_driver_user_id UUID)
RETURNS public.shipment_orders
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assignment public.shipment_assignments%ROWTYPE;
  v_driver_id UUID;
  v_shipment public.shipment_orders%ROWTYPE;
BEGIN
  SELECT id INTO v_driver_id FROM public.drivers WHERE user_id = p_driver_user_id LIMIT 1;
  IF v_driver_id IS NULL THEN
    RAISE EXCEPTION 'No eres transportista registrado';
  END IF;

  SELECT * INTO v_assignment FROM public.shipment_assignments
  WHERE id = p_assignment_id AND driver_id = v_driver_id AND status = 'pending'
    AND expires_at > NOW()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Oferta no disponible';
  END IF;

  UPDATE public.shipment_assignments SET status = 'accepted', responded_at = NOW()
  WHERE id = p_assignment_id;

  UPDATE public.shipment_assignments SET status = 'expired'
  WHERE shipment_id = v_assignment.shipment_id AND id <> p_assignment_id AND status = 'pending';

  UPDATE public.shipment_orders
  SET assigned_driver_id = v_driver_id, status = 'accepted'
  WHERE id = v_assignment.shipment_id AND assigned_driver_id IS NULL
  RETURNING * INTO v_shipment;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'El envío ya fue asignado';
  END IF;

  PERFORM public.log_shipment_event(v_shipment.id, 'carrier_accepted', 'accepted', NULL, NULL,
    jsonb_build_object('driver_id', v_driver_id));

  RETURN v_shipment;
END;
$$;

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.shipment_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shipment_routes_public_read" ON public.shipment_routes FOR SELECT USING (is_active = TRUE);
CREATE POLICY "shipment_pricing_public_read" ON public.shipment_pricing FOR SELECT USING (TRUE);

CREATE POLICY "shipment_quotes_owner" ON public.shipment_quotes FOR ALL
  USING (customer_id = auth.uid() OR public.is_admin())
  WITH CHECK (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "shipment_orders_customer_read" ON public.shipment_orders FOR SELECT
  USING (customer_id = auth.uid() OR public.is_admin() OR public.is_staff());

CREATE POLICY "shipment_orders_customer_insert" ON public.shipment_orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "shipment_orders_admin_update" ON public.shipment_orders FOR UPDATE
  USING (public.is_admin() OR public.is_staff());

CREATE POLICY "shipment_events_read" ON public.shipment_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND (s.customer_id = auth.uid() OR public.is_admin() OR public.is_staff())
    )
    OR EXISTS (
      SELECT 1 FROM public.shipment_orders s
      JOIN public.drivers d ON d.id = s.assigned_driver_id
      WHERE s.id = shipment_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "shipment_tracking_read" ON public.shipment_tracking FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shipment_orders s
      WHERE s.id = shipment_id AND (s.customer_id = auth.uid() OR public.is_admin() OR public.is_staff())
    )
    OR EXISTS (
      SELECT 1 FROM public.shipment_orders s
      JOIN public.drivers d ON d.id = s.assigned_driver_id
      WHERE s.id = shipment_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "shipment_assignments_driver_read" ON public.shipment_assignments FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (SELECT 1 FROM public.drivers d WHERE d.id = driver_id AND d.user_id = auth.uid())
  );

CREATE POLICY "shipment_payments_read" ON public.shipment_payments FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.shipment_orders s WHERE s.id = shipment_id AND s.customer_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "shipment_logs_admin" ON public.shipment_logs FOR SELECT USING (public.is_admin());

-- Realtime
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_orders;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_events') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_events;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'shipment_tracking') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.shipment_tracking;
  END IF;
END $$;

GRANT EXECUTE ON FUNCTION public.log_shipment_event TO authenticated;
GRANT EXECUTE ON FUNCTION public.publish_shipment_assignments TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_shipment_assignment TO authenticated;

-- ═══ MIGRACIÓN 035_admin_owner_auto_role.sql ═══

-- Auto-promover email owner a ADMIN al registrarse o actualizar auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  assigned_role := CASE
    WHEN lower(trim(NEW.email)) = lower(trim('brayandel001@gmail.com')) THEN 'ADMIN'
    ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
  END;

  INSERT INTO public.users (id, email, phone, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'Usuario'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    role = CASE
      WHEN lower(trim(EXCLUDED.email)) = lower(trim('brayandel001@gmail.com')) THEN 'ADMIN'
      ELSE public.users.role
    END,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegurar admin en producción si el usuario ya existe
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(full_name, ''), 'Brayan Admin')
WHERE lower(trim(email)) = lower(trim('brayandel001@gmail.com'));

-- ═══ MIGRACIÓN 035_business_delivery_coverage.sql ═══

-- Cobertura de entrega e intermunicipal para comercios

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS intermunicipal_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS municipios_soportados TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prep_time_minutes INTEGER DEFAULT 25,
  ADD COLUMN IF NOT EXISTS daily_capacity INTEGER DEFAULT 100,
  ADD COLUMN IF NOT EXISTS delivery_radius_km NUMERIC(6,2) DEFAULT 8.0,
  ADD COLUMN IF NOT EXISTS service_hours JSONB DEFAULT NULL;

COMMENT ON COLUMN public.businesses.intermunicipal_enabled IS 'Si true, puede aparecer en otros municipios según municipios_soportados';
COMMENT ON COLUMN public.businesses.municipios_soportados IS 'Municipios destino admitidos; vacío = todos los de la red';

CREATE TABLE IF NOT EXISTS public.delivery_coverage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  municipio TEXT NOT NULL,
  barrio TEXT,
  min_fee INTEGER,
  eta_minutes INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_id, municipio, barrio)
);

CREATE INDEX IF NOT EXISTS idx_delivery_coverage_municipio ON public.delivery_coverage(municipio);
CREATE INDEX IF NOT EXISTS idx_businesses_intermunicipal ON public.businesses(intermunicipal_enabled) WHERE intermunicipal_enabled = true;

ALTER TABLE public.delivery_coverage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "delivery_coverage_public_read" ON public.delivery_coverage FOR SELECT USING (is_active = true);

-- Hub logístico: envíos intermunicipales activos
UPDATE public.businesses
SET
  intermunicipal_enabled = true,
  municipios_soportados = ARRAY['Apartadó','Turbo','Carepa','Chigorodó','Necoclí']::TEXT[]
WHERE category = 'envios' OR name ILIKE '%envío%' OR name ILIKE '%envio%';

-- ═══ MIGRACIÓN 035_shipments_rider_wompi.sql ═══

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

-- ═══ MIGRACIÓN 036_security_hardening.sql ═══

-- UrabApp — Endurecimiento de seguridad (RPC courier, RLS riders, OTP, permisos)

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_otp_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS delivery_otp_locked_until TIMESTAMPTZ;

-- Helper: driver del usuario autenticado
CREATE OR REPLACE FUNCTION public.auth_driver_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.drivers WHERE user_id = auth.uid() LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.auth_driver_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_driver_id() TO authenticated;

-- ─── publish_courier_offers: solo dueño del pedido o admin ───────────────────
CREATE OR REPLACE FUNCTION public.publish_courier_offers(
  p_order_id UUID,
  p_radius_km INTEGER DEFAULT 3
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_payout INTEGER;
  v_count INTEGER := 0;
  v_driver RECORD;
  v_expires TIMESTAMPTZ := NOW() + INTERVAL '10 seconds';
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN 0;
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN 0;
  END IF;
  IF v_order.customer_id IS DISTINCT FROM auth.uid() AND NOT public.is_admin() THEN
    RETURN 0;
  END IF;
  IF v_order.pickup_latitude IS NULL OR v_order.pickup_longitude IS NULL THEN
    RETURN 0;
  END IF;

  v_payout := COALESCE((v_order.fare_breakdown->>'riderPayout')::INT, v_order.rider_payout, 4000);

  UPDATE public.orders
  SET courier_search_radius_km = p_radius_km, courier_phase = 'searching'
  WHERE id = p_order_id;

  FOR v_driver IN
    SELECT d.id, d.latitude, d.longitude
    FROM public.drivers d
    WHERE d.is_online = TRUE
      AND d.is_verified = TRUE
      AND d.municipio = v_order.dest_municipio
      AND d.latitude IS NOT NULL
      AND d.longitude IS NOT NULL
      AND public.haversine_km(
        d.latitude::DOUBLE PRECISION, d.longitude::DOUBLE PRECISION,
        v_order.pickup_latitude::DOUBLE PRECISION, v_order.pickup_longitude::DOUBLE PRECISION
      ) <= p_radius_km
  LOOP
    INSERT INTO public.courier_offers (
      order_id, driver_id, payout_estimate,
      distance_to_pickup_km, expires_at
    ) VALUES (
      p_order_id,
      v_driver.id,
      v_payout,
      public.haversine_km(
        v_driver.latitude::DOUBLE PRECISION, v_driver.longitude::DOUBLE PRECISION,
        v_order.pickup_latitude::DOUBLE PRECISION, v_order.pickup_longitude::DOUBLE PRECISION
      ),
      v_expires
    )
    ON CONFLICT (order_id, driver_id) DO UPDATE
      SET status = 'pending',
          expires_at = v_expires,
          payout_estimate = EXCLUDED.payout_estimate,
          distance_to_pickup_km = EXCLUDED.distance_to_pickup_km,
          responded_at = NULL;

    v_count := v_count + 1;
  END LOOP;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'searching', jsonb_build_object('radius_km', p_radius_km, 'offers', v_count));

  RETURN v_count;
END;
$$;

-- ─── accept_courier_offer: solo el mensajero dueño de la oferta ─────────────
CREATE OR REPLACE FUNCTION public.accept_courier_offer(
  p_order_id UUID,
  p_driver_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;
  IF p_driver_id IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;
  IF v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_courier');
  END IF;
  IF v_order.driver_id IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'already_assigned');
  END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_status');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.courier_offers
    WHERE order_id = p_order_id
      AND driver_id = p_driver_id
      AND status = 'pending'
      AND expires_at > NOW()
  ) THEN
    RETURN jsonb_build_object('success', false, 'reason', 'offer_expired');
  END IF;

  UPDATE public.orders
  SET driver_id = p_driver_id,
      status = 'accepted',
      accepted_at = NOW(),
      courier_phase = 'assigned'
  WHERE id = p_order_id AND driver_id IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'race_lost');
  END IF;

  UPDATE public.courier_offers
  SET status = 'accepted', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id = p_driver_id;

  UPDATE public.courier_offers
  SET status = 'expired', responded_at = NOW()
  WHERE order_id = p_order_id AND driver_id <> p_driver_id AND status = 'pending';

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'accepted', jsonb_build_object('driver_id', p_driver_id));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── reject_courier_offer ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.reject_courier_offer(
  p_order_id UUID,
  p_driver_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;
  IF p_driver_id IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN;
  END IF;

  UPDATE public.courier_offers
  SET status = 'rejected', responded_at = NOW()
  WHERE order_id = p_order_id
    AND driver_id = p_driver_id
    AND status = 'pending';
END;
$$;

-- ─── verify_courier_delivery_otp: mensajero asignado + límite intentos ───────
CREATE OR REPLACE FUNCTION public.verify_courier_delivery_otp(
  p_order_id UUID,
  p_code TEXT,
  p_driver_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_driver UUID := COALESCE(p_driver_id, public.auth_driver_id());
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF v_order IS NULL OR v_order.order_type <> 'courier' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_found');
  END IF;

  IF v_driver IS NULL OR v_order.driver_id IS DISTINCT FROM v_driver THEN
    IF NOT public.is_admin() THEN
      RETURN jsonb_build_object('success', false, 'reason', 'not_assigned');
    END IF;
  ELSIF v_driver IS DISTINCT FROM public.auth_driver_id() AND NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  IF v_order.delivery_otp_locked_until IS NOT NULL AND v_order.delivery_otp_locked_until > NOW() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'locked');
  END IF;

  IF v_order.delivery_otp IS NULL OR v_order.delivery_otp <> TRIM(p_code) THEN
    UPDATE public.orders
    SET delivery_otp_attempts = delivery_otp_attempts + 1,
        delivery_otp_locked_until = CASE
          WHEN delivery_otp_attempts + 1 >= 5 THEN NOW() + INTERVAL '15 minutes'
          ELSE delivery_otp_locked_until
        END
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', false, 'reason', 'invalid_code');
  END IF;

  IF v_order.delivery_otp_verified_at IS NOT NULL THEN
    RETURN jsonb_build_object('success', true, 'already_verified', true);
  END IF;

  UPDATE public.orders
  SET delivery_otp_verified_at = NOW(),
      status = 'delivered',
      delivered_at = NOW(),
      courier_phase = 'delivered',
      delivery_otp_attempts = 0,
      delivery_otp_locked_until = NULL
  WHERE id = p_order_id;

  INSERT INTO public.courier_tracking_events (order_id, event_type, metadata)
  VALUES (p_order_id, 'delivered', jsonb_build_object('otp_verified', true));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── set_courier_phase: solo mensajero asignado ─────────────────────────────
CREATE OR REPLACE FUNCTION public.set_courier_phase(
  p_order_id UUID,
  p_phase TEXT,
  p_event_type TEXT DEFAULT NULL,
  p_lat DECIMAL DEFAULT NULL,
  p_lng DECIMAL DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  IF NOT public.is_admin() AND NOT EXISTS (
    SELECT 1 FROM public.orders o
    JOIN public.drivers d ON d.id = o.driver_id
    WHERE o.id = p_order_id AND d.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE public.orders SET courier_phase = p_phase WHERE id = p_order_id;

  IF p_event_type IS NOT NULL THEN
    INSERT INTO public.courier_tracking_events (order_id, event_type, latitude, longitude)
    VALUES (p_order_id, p_event_type, p_lat, p_lng);
  END IF;

  IF p_phase = 'picked_up' THEN
    UPDATE public.orders SET picked_up_at = NOW(), status = 'on_the_way'
    WHERE id = p_order_id AND order_type = 'courier';
  ELSIF p_phase = 'arriving_pickup' THEN
    UPDATE public.orders SET status = 'accepted', courier_phase = 'arriving_pickup'
    WHERE id = p_order_id AND order_type = 'courier';
  END IF;
END;
$$;

-- Permisos RPC: solo usuarios autenticados
REVOKE ALL ON FUNCTION public.publish_courier_offers(UUID, INTEGER) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_courier_offer(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reject_courier_offer(UUID, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.verify_courier_delivery_otp(UUID, TEXT, UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_courier_phase(UUID, TEXT, TEXT, DECIMAL, DECIMAL) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.publish_courier_offers(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_courier_offer(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_courier_offer(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.verify_courier_delivery_otp(UUID, TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_courier_phase(UUID, TEXT, TEXT, DECIMAL, DECIMAL) TO authenticated;

-- RLS: mensajeros pueden leer pedidos asignados o disponibles en su municipio
DROP POLICY IF EXISTS "orders_rider_read" ON public.orders;
DROP POLICY IF EXISTS orders_rider_read ON public.orders;

CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.drivers d
      WHERE d.user_id = auth.uid()
        AND (
          d.id = orders.driver_id
          OR (
            orders.driver_id IS NULL
            AND orders.status IN ('pending', 'accepted', 'preparing', 'on_the_way')
            AND orders.dest_municipio = d.municipio
          )
        )
    )
    OR (
      public.is_staff()
      AND orders.status IN ('accepted', 'preparing', 'on_the_way')
    )
  );

-- Tarifas courier: solo usuarios autenticados
DROP POLICY IF EXISTS courier_settings_read ON public.courier_settings;
CREATE POLICY courier_settings_read ON public.courier_settings
  FOR SELECT TO authenticated USING (TRUE);

-- Clientes: solo pueden cancelar pedidos pendientes (sin tocar driver/OTP)
DROP POLICY IF EXISTS "orders_update_own" ON public.orders;
DROP POLICY IF EXISTS orders_update_own ON public.orders;
DROP POLICY IF EXISTS orders_customer_cancel ON public.orders;

CREATE POLICY orders_customer_cancel ON public.orders
  FOR UPDATE
  USING (auth.uid() = customer_id AND status = 'pending')
  WITH CHECK (
    auth.uid() = customer_id
    AND status = 'cancelled'
    AND driver_id IS NULL
  );

-- ═══ MIGRACIÓN 037_discovery_search.sql ═══

-- Descubrimiento: índice de búsquedas + trending / popular

CREATE TABLE IF NOT EXISTS public.search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  municipio TEXT,
  vertical TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  result_count INT NOT NULL DEFAULT 0,
  clicked_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  led_to_order BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_events_normalized
  ON public.search_events (normalized_query, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_events_municipio
  ON public.search_events (municipio, created_at DESC);

ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "search_events_insert" ON public.search_events
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "search_events_read_admin" ON public.search_events
  FOR SELECT USING (public.is_admin() OR public.is_staff());

CREATE OR REPLACE FUNCTION public.get_trending_searches(
  p_municipio TEXT DEFAULT NULL,
  p_days INT DEFAULT 7,
  p_limit INT DEFAULT 8
)
RETURNS TABLE (term TEXT, score BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT normalized_query AS term, COUNT(*)::BIGINT AS score
  FROM public.search_events
  WHERE created_at >= NOW() - (p_days || ' days')::INTERVAL
    AND (p_municipio IS NULL OR municipio = p_municipio)
    AND length(normalized_query) >= 2
  GROUP BY normalized_query
  ORDER BY score DESC, MAX(created_at) DESC
  LIMIT GREATEST(p_limit, 1);
$$;

CREATE OR REPLACE FUNCTION public.get_popular_searches(
  p_municipio TEXT DEFAULT NULL,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (term TEXT, searches BIGINT, clicks BIGINT, orders BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    normalized_query AS term,
    COUNT(*)::BIGINT AS searches,
    COUNT(clicked_business_id)::BIGINT AS clicks,
    COUNT(*) FILTER (WHERE led_to_order)::BIGINT AS orders
  FROM public.search_events
  WHERE (p_municipio IS NULL OR municipio = p_municipio)
    AND length(normalized_query) >= 2
  GROUP BY normalized_query
  ORDER BY orders DESC, clicks DESC, searches DESC
  LIMIT GREATEST(p_limit, 1);
$$;

GRANT EXECUTE ON FUNCTION public.get_trending_searches TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_popular_searches TO anon, authenticated;

-- ═══ MIGRACIÓN 038_home_market_pulse.sql ═══

-- Pulso ligero para Home (1 llamada en lugar de 3)

CREATE OR REPLACE FUNCTION public.get_home_market_pulse(p_municipio TEXT DEFAULT NULL)
RETURNS JSON
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH start AS (
    SELECT date_trunc('day', NOW()) AS t
  )
  SELECT json_build_object(
    'activeOrders', (
      SELECT COUNT(*)::INT FROM public.orders
      WHERE status IN ('pending', 'accepted', 'preparing', 'on_the_way')
    ),
    'onlineRiders', (
      SELECT COUNT(*)::INT FROM public.drivers WHERE is_online = true
    ),
    'ordersToday', (
      SELECT COUNT(*)::INT FROM public.orders o, start s
      WHERE o.created_at >= s.t AND o.status <> 'cancelled'
        AND (p_municipio IS NULL OR o.dest_municipio = p_municipio)
    ),
    'avgDeliveryMin', 25
  );
$$;

GRANT EXECUTE ON FUNCTION public.get_home_market_pulse TO anon, authenticated;

-- Búsquedas: permitir registro anónimo (guest checkout / sin login)
DROP POLICY IF EXISTS "search_events_insert" ON public.search_events;
CREATE POLICY "search_events_insert" ON public.search_events
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- ═══ MIGRACIÓN 039_fix_drivers_rls_recursion.sql ═══

-- Fix: infinite recursion drivers <-> orders en políticas RLS
-- Causa: drivers_customer_assigned_read → orders → orders_driver_read → drivers

-- Municipio del mensajero autenticado (sin RLS)
CREATE OR REPLACE FUNCTION public.auth_driver_municipio()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT municipio FROM public.drivers WHERE user_id = auth.uid() LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.auth_driver_municipio() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.auth_driver_municipio() TO authenticated;

-- Cliente con pedido activo asignado a este mensajero (sin RLS en orders)
CREATE OR REPLACE FUNCTION public.customer_assigned_to_driver(p_driver_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.driver_id = p_driver_id
      AND o.customer_id = auth.uid()
      AND o.status IN ('accepted', 'preparing', 'on_the_way')
  );
$$;

REVOKE ALL ON FUNCTION public.customer_assigned_to_driver(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.customer_assigned_to_driver(UUID) TO authenticated;

-- ─── Políticas drivers (sin subconsulta circular a orders con RLS) ───────────
DROP POLICY IF EXISTS "drivers_customer_assigned_read" ON public.drivers;
DROP POLICY IF EXISTS drivers_customer_assigned_read ON public.drivers;
CREATE POLICY drivers_customer_assigned_read ON public.drivers
  FOR SELECT USING (public.customer_assigned_to_driver(id));

DROP POLICY IF EXISTS "drivers_own" ON public.drivers;
DROP POLICY IF EXISTS drivers_own ON public.drivers;
DROP POLICY IF EXISTS drivers_insert_own ON public.drivers;
DROP POLICY IF EXISTS drivers_update_own ON public.drivers;
DROP POLICY IF EXISTS drivers_select_own ON public.drivers;

CREATE POLICY drivers_insert_own ON public.drivers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY drivers_select_own ON public.drivers
  FOR SELECT USING (
    auth.uid() = user_id
    OR public.is_admin()
    OR public.is_staff()
    OR public.customer_assigned_to_driver(id)
  );

CREATE POLICY drivers_update_own ON public.drivers
  FOR UPDATE
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Admin ya cubierto por drivers_admin_read; evitar duplicar FOR ALL
DROP POLICY IF EXISTS "drivers_admin_read" ON public.drivers;
DROP POLICY IF EXISTS drivers_admin_read ON public.drivers;

-- ─── Políticas orders (usar auth_driver_id en lugar de subquery drivers) ─────
DROP POLICY IF EXISTS orders_driver_read ON public.orders;
DROP POLICY IF EXISTS "orders_rider_read" ON public.orders;
DROP POLICY IF EXISTS orders_rider_read ON public.orders;

CREATE POLICY orders_driver_read ON public.orders
  FOR SELECT USING (
    public.is_admin()
    OR (
      public.auth_driver_id() IS NOT NULL
      AND (
        driver_id = public.auth_driver_id()
        OR (
          driver_id IS NULL
          AND status IN ('pending', 'accepted', 'preparing', 'on_the_way')
          AND dest_municipio = public.auth_driver_municipio()
        )
      )
    )
    OR (
      public.is_staff()
      AND status IN ('accepted', 'preparing', 'on_the_way')
    )
  );

-- ─── RPC registro mensajero (atómico, evita edge cases RLS) ─────────────────
CREATE OR REPLACE FUNCTION public.register_driver(
  p_name TEXT,
  p_phone TEXT,
  p_municipio TEXT,
  p_vehicle TEXT DEFAULT 'moto',
  p_plate TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_name TEXT := TRIM(COALESCE(p_name, ''));
  v_phone TEXT := TRIM(COALESCE(p_phone, ''));
  v_municipio TEXT := TRIM(COALESCE(p_municipio, ''));
  v_vehicle TEXT := COALESCE(NULLIF(TRIM(p_vehicle), ''), 'moto');
  v_plate TEXT := TRIM(COALESCE(p_plate, ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;
  IF length(v_name) < 2 THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_name');
  END IF;
  IF length(regexp_replace(v_phone, '\D', '', 'g')) < 10 THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_phone');
  END IF;
  IF v_municipio = '' THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_municipio');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_exists', true,
      'driver', to_jsonb(v_driver)
    );
  END IF;

  INSERT INTO public.drivers (
    user_id, name, phone, municipio, vehicle, plate, is_online, is_verified
  ) VALUES (
    auth.uid(), v_name, v_phone, v_municipio, v_vehicle, v_plate, false, true
  )
  RETURNING * INTO v_driver;

  UPDATE public.users
  SET role = 'RIDER', updated_at = NOW()
  WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

CREATE OR REPLACE FUNCTION public.get_my_driver_profile()
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT to_jsonb(d)
  FROM public.drivers d
  WHERE d.user_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.register_driver(TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_my_driver_profile() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_driver(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_driver_profile() TO authenticated;

-- ═══ MIGRACIÓN 040_courier_panel.sql ═══

-- UrabApp · Panel mensajero completo (Colombia)
-- Extiende drivers + tablas courier_* (driver_id FK)

-- ─── Extender drivers ───────────────────────────────────────────────────────
ALTER TABLE public.drivers
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'CC',
  ADD COLUMN IF NOT EXISTS document_number TEXT,
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Urabá',
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS vehicle_capacity TEXT,
  ADD COLUMN IF NOT EXISTS intermunicipal_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS availability_mode TEXT DEFAULT 'offline',
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS correction_notes TEXT,
  ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS vehicle_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS acceptance_rate DECIMAL(5,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS completion_rate DECIMAL(5,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS punctuality_score DECIMAL(5,2) DEFAULT 100,
  ADD COLUMN IF NOT EXISTS incident_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS online_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS total_online_seconds BIGINT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS intermunicipal_schedule JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS consent_terms_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_privacy_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_location_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'drivers_availability_mode_check'
  ) THEN
    ALTER TABLE public.drivers
      ADD CONSTRAINT drivers_availability_mode_check
      CHECK (availability_mode IN ('available', 'paused', 'offline'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'drivers_verification_status_check'
  ) THEN
    ALTER TABLE public.drivers
      ADD CONSTRAINT drivers_verification_status_check
      CHECK (verification_status IN ('pending', 'in_review', 'approved', 'rejected', 'corrections'));
  END IF;
END $$;

UPDATE public.drivers
SET verification_status = CASE WHEN is_verified THEN 'approved' ELSE COALESCE(verification_status, 'pending') END
WHERE verification_status IS NULL OR verification_status = 'pending';

-- ─── Documentos ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL CHECK (doc_type IN (
    'id_front', 'id_back', 'license', 'vehicle_registration',
    'insurance', 'soat', 'profile_photo', 'vehicle_photo', 'other'
  )),
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  expires_at DATE,
  admin_notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.users(id),
  UNIQUE (driver_id, doc_type)
);

CREATE INDEX IF NOT EXISTS idx_courier_documents_driver ON public.courier_documents(driver_id);

-- ─── Vehículo extendido ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_vehicle (
  driver_id UUID PRIMARY KEY REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL DEFAULT 'moto',
  plate TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  color TEXT,
  capacity_kg DECIMAL(8,2),
  soat_expires_at DATE,
  insurance_expires_at DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Estado operativo (historial) ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_status_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('available', 'paused', 'offline')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

CREATE INDEX IF NOT EXISTS idx_courier_status_log_driver ON public.courier_status_log(driver_id, started_at DESC);

-- ─── Billetera ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_wallet (
  driver_id UUID PRIMARY KEY REFERENCES public.drivers(id) ON DELETE CASCADE,
  balance_available DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance_pending DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_earned DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'COP',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Pagos / retiros ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_payout (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  method TEXT DEFAULT 'bank_transfer',
  reference TEXT,
  period_start DATE,
  period_end DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_courier_payout_driver ON public.courier_payout(driver_id, created_at DESC);

-- ─── Eventos (seguridad / auditoría) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courier_events_driver ON public.courier_events(driver_id, created_at DESC);

-- ─── Rechazos de ofertas ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_offer_rejections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  offer_type TEXT DEFAULT 'courier',
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Regiones intermunicipales ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courier_regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  origin_municipio TEXT NOT NULL,
  dest_municipio TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  max_weight_kg DECIMAL(8,2),
  base_fee_cop DECIMAL(12,2),
  schedule JSONB DEFAULT '{}'::jsonb,
  UNIQUE (driver_id, origin_municipio, dest_municipio)
);

CREATE INDEX IF NOT EXISTS idx_courier_regions_driver ON public.courier_regions(driver_id);

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.courier_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_vehicle ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_payout ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_offer_rejections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courier_regions ENABLE ROW LEVEL SECURITY;

-- courier_documents
DROP POLICY IF EXISTS courier_documents_own ON public.courier_documents;
CREATE POLICY courier_documents_own ON public.courier_documents
  FOR ALL USING (
    driver_id = public.auth_driver_id() OR public.is_admin()
  )
  WITH CHECK (
    driver_id = public.auth_driver_id() OR public.is_admin()
  );

-- courier_vehicle
DROP POLICY IF EXISTS courier_vehicle_own ON public.courier_vehicle;
CREATE POLICY courier_vehicle_own ON public.courier_vehicle
  FOR ALL USING (driver_id = public.auth_driver_id() OR public.is_admin())
  WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_status_log
DROP POLICY IF EXISTS courier_status_log_own ON public.courier_status_log;
CREATE POLICY courier_status_log_own ON public.courier_status_log
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());
DROP POLICY IF EXISTS courier_status_log_insert ON public.courier_status_log;
CREATE POLICY courier_status_log_insert ON public.courier_status_log
  FOR INSERT WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_wallet
DROP POLICY IF EXISTS courier_wallet_own ON public.courier_wallet;
CREATE POLICY courier_wallet_own ON public.courier_wallet
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_payout
DROP POLICY IF EXISTS courier_payout_own ON public.courier_payout;
CREATE POLICY courier_payout_own ON public.courier_payout
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_events
DROP POLICY IF EXISTS courier_events_own ON public.courier_events;
CREATE POLICY courier_events_own ON public.courier_events
  FOR SELECT USING (driver_id = public.auth_driver_id() OR public.is_admin());
DROP POLICY IF EXISTS courier_events_insert ON public.courier_events;
CREATE POLICY courier_events_insert ON public.courier_events
  FOR INSERT WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_offer_rejections
DROP POLICY IF EXISTS courier_offer_rejections_own ON public.courier_offer_rejections;
CREATE POLICY courier_offer_rejections_own ON public.courier_offer_rejections
  FOR ALL USING (driver_id = public.auth_driver_id() OR public.is_admin())
  WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- courier_regions
DROP POLICY IF EXISTS courier_regions_own ON public.courier_regions;
CREATE POLICY courier_regions_own ON public.courier_regions
  FOR ALL USING (driver_id = public.auth_driver_id() OR public.is_admin())
  WITH CHECK (driver_id = public.auth_driver_id() OR public.is_admin());

-- ─── RPC: registro extendido paso 1 ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.register_courier_step1(
  p_first_name TEXT,
  p_last_name TEXT,
  p_document_type TEXT,
  p_document_number TEXT,
  p_birth_date DATE,
  p_phone TEXT,
  p_email TEXT,
  p_city TEXT,
  p_municipio TEXT,
  p_language TEXT DEFAULT 'es'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_name TEXT := TRIM(COALESCE(p_first_name, '') || ' ' || COALESCE(p_last_name, ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    UPDATE public.drivers SET
      first_name = TRIM(p_first_name),
      last_name = TRIM(p_last_name),
      name = v_name,
      document_type = COALESCE(p_document_type, 'CC'),
      document_number = TRIM(p_document_number),
      birth_date = p_birth_date,
      phone = TRIM(p_phone),
      email = TRIM(p_email),
      city = COALESCE(TRIM(p_city), 'Urabá'),
      municipio = TRIM(p_municipio),
      language = COALESCE(p_language, 'es'),
      onboarding_step = GREATEST(onboarding_step, 1),
      updated_at = NOW()
    WHERE user_id = auth.uid()
    RETURNING * INTO v_driver;
  ELSE
    INSERT INTO public.drivers (
      user_id, name, first_name, last_name, document_type, document_number,
      birth_date, phone, email, city, municipio, language,
      is_online, is_verified, verification_status, onboarding_step
    ) VALUES (
      auth.uid(), v_name, TRIM(p_first_name), TRIM(p_last_name),
      COALESCE(p_document_type, 'CC'), TRIM(p_document_number),
      p_birth_date, TRIM(p_phone), TRIM(p_email),
      COALESCE(TRIM(p_city), 'Urabá'), TRIM(p_municipio), COALESCE(p_language, 'es'),
      false, false, 'pending', 1
    )
    RETURNING * INTO v_driver;

    UPDATE public.users SET role = 'RIDER', updated_at = NOW()
    WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

    INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver.id)
    ON CONFLICT (driver_id) DO NOTHING;
  END IF;

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- ─── RPC: paso 2 operación ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.register_courier_step2(
  p_vehicle_type TEXT,
  p_plate TEXT DEFAULT '',
  p_capacity TEXT DEFAULT '',
  p_intermunicipal BOOLEAN DEFAULT FALSE,
  p_brand TEXT DEFAULT NULL,
  p_model TEXT DEFAULT NULL,
  p_capacity_kg DECIMAL DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    vehicle = COALESCE(NULLIF(TRIM(p_vehicle_type), ''), 'moto'),
    plate = TRIM(COALESCE(p_plate, '')),
    vehicle_capacity = TRIM(COALESCE(p_capacity, '')),
    intermunicipal_enabled = COALESCE(p_intermunicipal, false),
    onboarding_step = GREATEST(onboarding_step, 2),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_vehicle (driver_id, vehicle_type, plate, brand, model, capacity_kg)
  VALUES (v_driver_id, COALESCE(NULLIF(TRIM(p_vehicle_type), ''), 'moto'), TRIM(COALESCE(p_plate, '')),
          p_brand, p_model, p_capacity_kg)
  ON CONFLICT (driver_id) DO UPDATE SET
    vehicle_type = EXCLUDED.vehicle_type,
    plate = EXCLUDED.plate,
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    capacity_kg = EXCLUDED.capacity_kg,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: paso 3 consentimientos + enviar a revisión ────────────────────────
CREATE OR REPLACE FUNCTION public.submit_courier_for_review()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    consent_terms_at = COALESCE(consent_terms_at, NOW()),
    consent_privacy_at = COALESCE(consent_privacy_at, NOW()),
    consent_location_at = COALESCE(consent_location_at, NOW()),
    verification_status = 'in_review',
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver_id, 'onboarding_submitted', 'info', '{}'::jsonb);

  RETURN jsonb_build_object('success', true, 'status', 'in_review');
END;
$$;

-- ─── RPC: modo disponibilidad ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_courier_availability(
  p_mode TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_prev_mode TEXT;
  v_duration INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  IF v_driver.verification_status NOT IN ('approved') AND NOT v_driver.is_verified THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_approved');
  END IF;

  IF p_mode NOT IN ('available', 'paused', 'offline') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_mode');
  END IF;

  v_prev_mode := v_driver.availability_mode;

  IF v_prev_mode IS DISTINCT FROM p_mode AND v_driver.online_started_at IS NOT NULL THEN
    v_duration := EXTRACT(EPOCH FROM (NOW() - v_driver.online_started_at))::INTEGER;
    UPDATE public.courier_status_log
    SET ended_at = NOW(), duration_seconds = v_duration
    WHERE driver_id = v_driver.id AND ended_at IS NULL;
  END IF;

  UPDATE public.drivers SET
    availability_mode = p_mode,
    is_online = (p_mode = 'available'),
    online_started_at = CASE
      WHEN p_mode = 'available' THEN NOW()
      ELSE NULL
    END,
    total_online_seconds = CASE
      WHEN v_prev_mode = 'available' AND p_mode != 'available' AND v_driver.online_started_at IS NOT NULL
      THEN total_online_seconds + EXTRACT(EPOCH FROM (NOW() - v_driver.online_started_at))::BIGINT
      ELSE total_online_seconds
    END,
    updated_at = NOW()
  WHERE id = v_driver.id
  RETURNING * INTO v_driver;

  IF p_mode IN ('available', 'paused') THEN
    INSERT INTO public.courier_status_log (driver_id, mode) VALUES (v_driver.id, p_mode);
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, metadata)
  VALUES (v_driver.id, 'availability_changed', jsonb_build_object('mode', p_mode));

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- ─── RPC: rechazo con motivo ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_courier_offer_rejection(
  p_order_id UUID,
  p_reason TEXT,
  p_offer_type TEXT DEFAULT 'courier'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_offer_rejections (driver_id, order_id, reason, offer_type)
  VALUES (v_driver_id, p_order_id, TRIM(p_reason), COALESCE(p_offer_type, 'courier'));

  UPDATE public.drivers SET
    acceptance_rate = GREATEST(0, acceptance_rate - 0.5),
    updated_at = NOW()
  WHERE id = v_driver_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: admin revisión ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_review_courier(
  p_driver_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  IF p_action = 'approve' THEN
    UPDATE public.drivers SET
      verification_status = 'approved',
      is_verified = true,
      rejection_reason = NULL,
      correction_notes = NULL,
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'reject' THEN
    UPDATE public.drivers SET
      verification_status = 'rejected',
      is_verified = false,
      rejection_reason = p_notes,
      is_online = false,
      availability_mode = 'offline',
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'corrections' THEN
    UPDATE public.drivers SET
      verification_status = 'corrections',
      correction_notes = p_notes,
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'suspend' THEN
    UPDATE public.drivers SET
      is_online = false,
      availability_mode = 'offline',
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_action');
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (p_driver_id, 'admin_' || p_action, 'info', jsonb_build_object('notes', p_notes));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: wallet sync desde entregas ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_courier_wallet_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
  v_wallet public.courier_wallet%ROWTYPE;
  v_today NUMERIC := 0;
  v_week NUMERIC := 0;
  v_month NUMERIC := 0;
  v_pending_orders NUMERIC := 0;
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver_id)
  ON CONFLICT (driver_id) DO NOTHING;

  SELECT * INTO v_wallet FROM public.courier_wallet WHERE driver_id = v_driver_id;

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_today
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('day', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_week
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('week', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_month
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('month', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_pending_orders
  FROM public.orders
  WHERE driver_id = v_driver_id AND status IN ('accepted', 'preparing', 'on_the_way');

  RETURN jsonb_build_object(
    'success', true,
    'wallet', to_jsonb(v_wallet),
    'today', v_today,
    'week', v_week,
    'month', v_month,
    'pending_orders', v_pending_orders
  );
END;
$$;

-- ─── RPC: reputación ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_courier_reputation()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_avg_rating NUMERIC;
  v_total_offers BIGINT;
  v_accepted BIGINT;
  v_rejected BIGINT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  SELECT COALESCE(AVG(r.rating), v_driver.rating) INTO v_avg_rating
  FROM public.reviews r WHERE r.driver_id = v_driver.id;

  SELECT COUNT(*) INTO v_rejected FROM public.courier_offer_rejections WHERE driver_id = v_driver.id;
  SELECT COUNT(*) INTO v_accepted FROM public.courier_offers
  WHERE driver_id = v_driver.id AND status = 'accepted';
  v_total_offers := v_accepted + v_rejected;

  RETURN jsonb_build_object(
    'success', true,
    'rating', COALESCE(v_avg_rating, v_driver.rating),
    'acceptance_rate', v_driver.acceptance_rate,
    'completion_rate', v_driver.completion_rate,
    'punctuality_score', v_driver.punctuality_score,
    'incident_count', v_driver.incident_count,
    'level', v_driver.level,
    'total_deliveries', v_driver.total_deliveries,
    'offers_accepted', v_accepted,
    'offers_rejected', v_rejected,
    'tips', jsonb_build_array(
      jsonb_build_object('key', 'acceptance', 'label', 'Acepta más ofertas cercanas para subir tu tasa'),
      jsonb_build_object('key', 'punctuality', 'label', 'Llega a tiempo a recogida y entrega'),
      jsonb_build_object('key', 'rating', 'label', 'Pide confirmación amable al cliente')
    )
  );
END;
$$;

-- ─── RPC: evento seguridad ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_courier_security_event(
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (
    v_driver_id,
    p_event_type,
    CASE WHEN p_event_type IN ('emergency', 'sos') THEN 'critical' ELSE 'info' END,
    COALESCE(p_metadata, '{}'::jsonb)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── Actualizar register_driver: no auto-aprobar ────────────────────────────
CREATE OR REPLACE FUNCTION public.register_driver(
  p_name TEXT,
  p_phone TEXT,
  p_municipio TEXT,
  p_vehicle TEXT DEFAULT 'moto',
  p_plate TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    RETURN jsonb_build_object('success', true, 'already_exists', true, 'driver', to_jsonb(v_driver));
  END IF;

  INSERT INTO public.drivers (
    user_id, name, phone, municipio, vehicle, plate,
    is_online, is_verified, verification_status, onboarding_step
  ) VALUES (
    auth.uid(), TRIM(p_name), TRIM(p_phone), TRIM(p_municipio),
    COALESCE(NULLIF(TRIM(p_vehicle), ''), 'moto'), TRIM(COALESCE(p_plate, '')),
    false, false, 'pending', 1
  )
  RETURNING * INTO v_driver;

  INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver.id);

  UPDATE public.users SET role = 'RIDER', updated_at = NOW()
  WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- Grants
REVOKE ALL ON FUNCTION public.register_courier_step1 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_courier_step2 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_courier_for_review FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_courier_availability FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_courier_offer_rejection FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_review_courier FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_courier_wallet_summary FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_courier_reputation FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_courier_security_event FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.register_courier_step1 TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_courier_step2 TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_courier_for_review TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_courier_availability TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_courier_offer_rejection TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_courier TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courier_wallet_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courier_reputation TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_courier_security_event TO authenticated;

-- ═══ MIGRACIÓN 043_courier_panel_rpcs.sql ═══

-- ─── RPC: registro extendido paso 1 ───────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.register_courier_step1(
  p_first_name TEXT,
  p_last_name TEXT,
  p_document_type TEXT,
  p_document_number TEXT,
  p_birth_date DATE,
  p_phone TEXT,
  p_email TEXT,
  p_city TEXT,
  p_municipio TEXT,
  p_language TEXT DEFAULT 'es'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_name TEXT := TRIM(COALESCE(p_first_name, '') || ' ' || COALESCE(p_last_name, ''));
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    UPDATE public.drivers SET
      first_name = TRIM(p_first_name),
      last_name = TRIM(p_last_name),
      name = v_name,
      document_type = COALESCE(p_document_type, 'CC'),
      document_number = TRIM(p_document_number),
      birth_date = p_birth_date,
      phone = TRIM(p_phone),
      email = TRIM(p_email),
      city = COALESCE(TRIM(p_city), 'Urabá'),
      municipio = TRIM(p_municipio),
      language = COALESCE(p_language, 'es'),
      onboarding_step = GREATEST(onboarding_step, 1),
      updated_at = NOW()
    WHERE user_id = auth.uid()
    RETURNING * INTO v_driver;
  ELSE
    INSERT INTO public.drivers (
      user_id, name, first_name, last_name, document_type, document_number,
      birth_date, phone, email, city, municipio, language,
      is_online, is_verified, verification_status, onboarding_step
    ) VALUES (
      auth.uid(), v_name, TRIM(p_first_name), TRIM(p_last_name),
      COALESCE(p_document_type, 'CC'), TRIM(p_document_number),
      p_birth_date, TRIM(p_phone), TRIM(p_email),
      COALESCE(TRIM(p_city), 'Urabá'), TRIM(p_municipio), COALESCE(p_language, 'es'),
      false, false, 'pending', 1
    )
    RETURNING * INTO v_driver;

    UPDATE public.users SET role = 'RIDER', updated_at = NOW()
    WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

    INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver.id)
    ON CONFLICT (driver_id) DO NOTHING;
  END IF;

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- ─── RPC: paso 2 operación ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.register_courier_step2(
  p_vehicle_type TEXT,
  p_plate TEXT DEFAULT '',
  p_capacity TEXT DEFAULT '',
  p_intermunicipal BOOLEAN DEFAULT FALSE,
  p_brand TEXT DEFAULT NULL,
  p_model TEXT DEFAULT NULL,
  p_capacity_kg DECIMAL DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    vehicle = COALESCE(NULLIF(TRIM(p_vehicle_type), ''), 'moto'),
    plate = TRIM(COALESCE(p_plate, '')),
    vehicle_capacity = TRIM(COALESCE(p_capacity, '')),
    intermunicipal_enabled = COALESCE(p_intermunicipal, false),
    onboarding_step = GREATEST(onboarding_step, 2),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_vehicle (driver_id, vehicle_type, plate, brand, model, capacity_kg)
  VALUES (v_driver_id, COALESCE(NULLIF(TRIM(p_vehicle_type), ''), 'moto'), TRIM(COALESCE(p_plate, '')),
          p_brand, p_model, p_capacity_kg)
  ON CONFLICT (driver_id) DO UPDATE SET
    vehicle_type = EXCLUDED.vehicle_type,
    plate = EXCLUDED.plate,
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    capacity_kg = EXCLUDED.capacity_kg,
    updated_at = NOW();

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: paso 3 consentimientos + enviar a revisión ────────────────────────
CREATE OR REPLACE FUNCTION public.submit_courier_for_review()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    consent_terms_at = COALESCE(consent_terms_at, NOW()),
    consent_privacy_at = COALESCE(consent_privacy_at, NOW()),
    consent_location_at = COALESCE(consent_location_at, NOW()),
    verification_status = 'in_review',
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver_id, 'onboarding_submitted', 'info', '{}'::jsonb);

  RETURN jsonb_build_object('success', true, 'status', 'in_review');
END;
$$;

-- ─── RPC: modo disponibilidad ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_courier_availability(
  p_mode TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_prev_mode TEXT;
  v_duration INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  IF v_driver.verification_status NOT IN ('approved') AND NOT v_driver.is_verified THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_approved');
  END IF;

  IF p_mode NOT IN ('available', 'paused', 'offline') THEN
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_mode');
  END IF;

  v_prev_mode := v_driver.availability_mode;

  IF v_prev_mode IS DISTINCT FROM p_mode AND v_driver.online_started_at IS NOT NULL THEN
    v_duration := EXTRACT(EPOCH FROM (NOW() - v_driver.online_started_at))::INTEGER;
    UPDATE public.courier_status_log
    SET ended_at = NOW(), duration_seconds = v_duration
    WHERE driver_id = v_driver.id AND ended_at IS NULL;
  END IF;

  UPDATE public.drivers SET
    availability_mode = p_mode,
    is_online = (p_mode = 'available'),
    online_started_at = CASE
      WHEN p_mode = 'available' THEN NOW()
      ELSE NULL
    END,
    total_online_seconds = CASE
      WHEN v_prev_mode = 'available' AND p_mode != 'available' AND v_driver.online_started_at IS NOT NULL
      THEN total_online_seconds + EXTRACT(EPOCH FROM (NOW() - v_driver.online_started_at))::BIGINT
      ELSE total_online_seconds
    END,
    updated_at = NOW()
  WHERE id = v_driver.id
  RETURNING * INTO v_driver;

  IF p_mode IN ('available', 'paused') THEN
    INSERT INTO public.courier_status_log (driver_id, mode) VALUES (v_driver.id, p_mode);
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, metadata)
  VALUES (v_driver.id, 'availability_changed', jsonb_build_object('mode', p_mode));

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- ─── RPC: rechazo con motivo ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_courier_offer_rejection(
  p_order_id UUID,
  p_reason TEXT,
  p_offer_type TEXT DEFAULT 'courier'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_offer_rejections (driver_id, order_id, reason, offer_type)
  VALUES (v_driver_id, p_order_id, TRIM(p_reason), COALESCE(p_offer_type, 'courier'));

  UPDATE public.drivers SET
    acceptance_rate = GREATEST(0, acceptance_rate - 0.5),
    updated_at = NOW()
  WHERE id = v_driver_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: admin revisión ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.admin_review_courier(
  p_driver_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'reason', 'forbidden');
  END IF;

  IF p_action = 'approve' THEN
    UPDATE public.drivers SET
      verification_status = 'approved',
      is_verified = true,
      rejection_reason = NULL,
      correction_notes = NULL,
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'reject' THEN
    UPDATE public.drivers SET
      verification_status = 'rejected',
      is_verified = false,
      rejection_reason = p_notes,
      is_online = false,
      availability_mode = 'offline',
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'corrections' THEN
    UPDATE public.drivers SET
      verification_status = 'corrections',
      correction_notes = p_notes,
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSIF p_action = 'suspend' THEN
    UPDATE public.drivers SET
      is_online = false,
      availability_mode = 'offline',
      updated_at = NOW()
    WHERE id = p_driver_id;
  ELSE
    RETURN jsonb_build_object('success', false, 'reason', 'invalid_action');
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (p_driver_id, 'admin_' || p_action, 'info', jsonb_build_object('notes', p_notes));

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── RPC: wallet sync desde entregas ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_courier_wallet_summary()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
  v_wallet public.courier_wallet%ROWTYPE;
  v_today NUMERIC := 0;
  v_week NUMERIC := 0;
  v_month NUMERIC := 0;
  v_pending_orders NUMERIC := 0;
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver_id)
  ON CONFLICT (driver_id) DO NOTHING;

  SELECT * INTO v_wallet FROM public.courier_wallet WHERE driver_id = v_driver_id;

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_today
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('day', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_week
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('week', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_month
  FROM public.orders
  WHERE driver_id = v_driver_id AND status = 'delivered'
    AND delivered_at >= date_trunc('month', NOW());

  SELECT COALESCE(SUM(rider_payout), 0) INTO v_pending_orders
  FROM public.orders
  WHERE driver_id = v_driver_id AND status IN ('accepted', 'preparing', 'on_the_way');

  RETURN jsonb_build_object(
    'success', true,
    'wallet', to_jsonb(v_wallet),
    'today', v_today,
    'week', v_week,
    'month', v_month,
    'pending_orders', v_pending_orders
  );
END;
$$;

-- ─── RPC: reputación ────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_courier_reputation()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
  v_avg_rating NUMERIC;
  v_total_offers BIGINT;
  v_accepted BIGINT;
  v_rejected BIGINT;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  SELECT COALESCE(AVG(r.rating), v_driver.rating) INTO v_avg_rating
  FROM public.reviews r WHERE r.driver_id = v_driver.id;

  SELECT COUNT(*) INTO v_rejected FROM public.courier_offer_rejections WHERE driver_id = v_driver.id;
  SELECT COUNT(*) INTO v_accepted FROM public.courier_offers
  WHERE driver_id = v_driver.id AND status = 'accepted';
  v_total_offers := v_accepted + v_rejected;

  RETURN jsonb_build_object(
    'success', true,
    'rating', COALESCE(v_avg_rating, v_driver.rating),
    'acceptance_rate', v_driver.acceptance_rate,
    'completion_rate', v_driver.completion_rate,
    'punctuality_score', v_driver.punctuality_score,
    'incident_count', v_driver.incident_count,
    'level', v_driver.level,
    'total_deliveries', v_driver.total_deliveries,
    'offers_accepted', v_accepted,
    'offers_rejected', v_rejected,
    'tips', jsonb_build_array(
      jsonb_build_object('key', 'acceptance', 'label', 'Acepta más ofertas cercanas para subir tu tasa'),
      jsonb_build_object('key', 'punctuality', 'label', 'Llega a tiempo a recogida y entrega'),
      jsonb_build_object('key', 'rating', 'label', 'Pide confirmación amable al cliente')
    )
  );
END;
$$;

-- ─── RPC: evento seguridad ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.log_courier_security_event(
  p_event_type TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false);
  END IF;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (
    v_driver_id,
    p_event_type,
    CASE WHEN p_event_type IN ('emergency', 'sos') THEN 'critical' ELSE 'info' END,
    COALESCE(p_metadata, '{}'::jsonb)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- ─── Actualizar register_driver: no auto-aprobar ────────────────────────────
CREATE OR REPLACE FUNCTION public.register_driver(
  p_name TEXT,
  p_phone TEXT,
  p_municipio TEXT,
  p_vehicle TEXT DEFAULT 'moto',
  p_plate TEXT DEFAULT ''
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver public.drivers%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'unauthorized');
  END IF;

  SELECT * INTO v_driver FROM public.drivers WHERE user_id = auth.uid();
  IF FOUND THEN
    RETURN jsonb_build_object('success', true, 'already_exists', true, 'driver', to_jsonb(v_driver));
  END IF;

  INSERT INTO public.drivers (
    user_id, name, phone, municipio, vehicle, plate,
    is_online, is_verified, verification_status, onboarding_step
  ) VALUES (
    auth.uid(), TRIM(p_name), TRIM(p_phone), TRIM(p_municipio),
    COALESCE(NULLIF(TRIM(p_vehicle), ''), 'moto'), TRIM(COALESCE(p_plate, '')),
    false, false, 'pending', 1
  )
  RETURNING * INTO v_driver;

  INSERT INTO public.courier_wallet (driver_id) VALUES (v_driver.id);

  UPDATE public.users SET role = 'RIDER', updated_at = NOW()
  WHERE id = auth.uid() AND role IN ('CLIENT', 'RIDER');

  RETURN jsonb_build_object('success', true, 'driver', to_jsonb(v_driver));
END;
$$;

-- Grants
REVOKE ALL ON FUNCTION public.register_courier_step1 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.register_courier_step2 FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_courier_for_review FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_courier_availability FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_courier_offer_rejection FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_review_courier FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_courier_wallet_summary FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_courier_reputation FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_courier_security_event FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.register_courier_step1 TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_courier_step2 TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_courier_for_review TO authenticated;
GRANT EXECUTE ON FUNCTION public.set_courier_availability TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_courier_offer_rejection TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_courier TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courier_wallet_summary TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_courier_reputation TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_courier_security_event TO authenticated;

-- ═══ MIGRACIÓN 044_auto_approve_courier.sql ═══

-- Auto-approve couriers after onboarding (MVP). Admin can still suspend via panel.
CREATE OR REPLACE FUNCTION public.submit_courier_for_review()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID := public.auth_driver_id();
BEGIN
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_registered');
  END IF;

  UPDATE public.drivers SET
    consent_terms_at = COALESCE(consent_terms_at, NOW()),
    consent_privacy_at = COALESCE(consent_privacy_at, NOW()),
    consent_location_at = COALESCE(consent_location_at, NOW()),
    verification_status = 'approved',
    is_verified = true,
    onboarding_step = GREATEST(onboarding_step, 4),
    updated_at = NOW()
  WHERE id = v_driver_id;

  INSERT INTO public.courier_events (driver_id, event_type, severity, metadata)
  VALUES (v_driver_id, 'onboarding_approved', 'info', '{"auto": true}'::jsonb);

  RETURN jsonb_build_object('success', true, 'status', 'approved');
END;
$$;

-- Unblock couriers stuck in manual review from earlier builds
UPDATE public.drivers
SET
  verification_status = 'approved',
  is_verified = true,
  updated_at = NOW()
WHERE verification_status IN ('in_review', 'pending')
  AND onboarding_step >= 4;

-- ═══ MIGRACIÓN 045_platform_master_loops.sql ═══

-- UrabApp — MASTER BUILD LOOPS (3–11, 21)
-- Cuentas, comercios con aprobación, Pro, wallet, favoritos, legal, pagos guardados

-- ─── USUARIOS: estados de cuenta ─────────────────────────────────────────────
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS account_status TEXT NOT NULL DEFAULT 'active'
    CHECK (account_status IN ('active', 'pending', 'blocked', 'deleted')),
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_account_status ON public.users (account_status);

-- ─── COMERCIOS: verificación manual (solo admin publica) ────────────────────
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'approved', 'rejected', 'suspended')),
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.users(id);

CREATE INDEX IF NOT EXISTS idx_businesses_verification ON public.businesses (verification_status, is_published);

-- Comercios existentes quedan publicados
UPDATE public.businesses
SET verification_status = 'approved',
    is_published = TRUE,
    approved_at = COALESCE(approved_at, created_at)
WHERE verification_status = 'pending' AND is_published = FALSE
  AND created_at < NOW() - INTERVAL '1 minute';

-- ─── UrabApp Pro ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  benefits JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_plans(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

INSERT INTO public.membership_plans (id, name, price_monthly, benefits, sort_order)
VALUES
  ('free', 'UrabApp', 0, '["Catálogo local","Pedidos estándar"]', 0),
  ('pro', 'UrabApp Pro', 19900,
   '["Envíos reducidos","Prioridad en pedidos","Ofertas exclusivas","Cashback 5%","Historial extendido","Facturación avanzada"]', 1)
ON CONFLICT (id) DO NOTHING;

-- ─── Wallet / créditos ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_wallet (
  user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  points INTEGER NOT NULL DEFAULT 0 CHECK (points >= 0),
  cashback_pending INTEGER NOT NULL DEFAULT 0 CHECK (cashback_pending >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'cashback', 'points_earn', 'points_redeem', 'expire')),
  amount INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  reference_type TEXT,
  reference_id UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_tx_user ON public.wallet_transactions (user_id, created_at DESC);

-- ─── Favoritos ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (business_id IS NOT NULL OR product_id IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_business ON public.user_favorites (user_id, business_id) WHERE business_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_fav_product ON public.user_favorites (user_id, product_id) WHERE product_id IS NOT NULL;

-- ─── Métodos de pago guardados ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('card', 'transfer', 'cash')),
  label TEXT NOT NULL,
  last_four TEXT,
  brand TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.user_payment_methods (user_id);

-- ─── Legal versionado + consentimiento ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id TEXT NOT NULL,
  title TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, version)
);

CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  document_id TEXT NOT NULL,
  document_version TEXT NOT NULL,
  accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE (user_id, document_id, document_version)
);

INSERT INTO public.legal_documents (id, title, version, content, is_required)
VALUES
  ('privacy', 'Política de privacidad', '1.0', 'UrabApp respeta tu privacidad. Recopilamos datos de cuenta, pedidos y ubicación para operar entregas en Urabá. No vendemos datos personales.', TRUE),
  ('terms', 'Términos y condiciones', '1.0', 'Al usar UrabApp aceptas las reglas de la plataforma, pagos al recibir o digitales, y políticas de cancelación de pedidos.', TRUE),
  ('cookies', 'Política de cookies', '1.0', 'Usamos cookies y almacenamiento local para sesión, carrito, preferencias y PWA.', TRUE),
  ('data', 'Tratamiento de datos personales', '1.0', 'Tus datos se procesan conforme a la Ley 1581 de 2012 (Colombia). Puedes solicitar acceso o eliminación escribiendo a soporte.', TRUE),
  ('conditions', 'Condiciones de uso del marketplace', '1.0', 'Comercios y mensajeros son terceros verificados. UrabApp facilita la conexión pero cada parte es responsable de su operación.', TRUE)
ON CONFLICT (id, version) DO NOTHING;

-- ─── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_read_own_wallet" ON public.user_wallet FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_read_own_wallet_tx" ON public.wallet_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_favorites" ON public.user_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_payment_methods" ON public.user_payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users_manage_own_consents" ON public.user_consents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "legal_docs_public_read" ON public.legal_documents FOR SELECT USING (TRUE);

CREATE POLICY "admin_all_subscriptions" ON public.user_subscriptions FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));
CREATE POLICY "admin_all_wallet" ON public.user_wallet FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN'));

-- Catálogo público: solo comercios publicados y aprobados
-- (Las queries del cliente deben filtrar is_published = true)

-- RPC: aprobar comercio (solo admin)
CREATE OR REPLACE FUNCTION public.approve_business(p_business_id UUID)
RETURNS public.businesses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_row public.businesses;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_admin AND role = 'ADMIN') THEN
    RAISE EXCEPTION 'Solo administradores pueden aprobar comercios';
  END IF;
  UPDATE businesses
  SET verification_status = 'approved',
      is_published = TRUE,
      approved_at = NOW(),
      approved_by = v_admin,
      rejection_reason = NULL
  WHERE id = p_business_id
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_business(p_business_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS public.businesses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_row public.businesses;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE id = v_admin AND role = 'ADMIN') THEN
    RAISE EXCEPTION 'Solo administradores pueden rechazar comercios';
  END IF;
  UPDATE businesses
  SET verification_status = 'rejected',
      is_published = FALSE,
      rejection_reason = p_reason
  WHERE id = p_business_id
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

-- Wallet bootstrap on first access
CREATE OR REPLACE FUNCTION public.ensure_user_wallet(p_user_id UUID)
RETURNS public.user_wallet
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.user_wallet;
BEGIN
  INSERT INTO user_wallet (user_id) VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO v_row FROM user_wallet WHERE user_id = p_user_id;
  RETURN v_row;
END;
$$;

-- ═══ MIGRACIÓN 046_checkout_tip.sql ═══

-- LOOP 8 — Propina al domiciliario en checkout
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tip_amount INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.orders.tip_amount IS 'Propina voluntaria del cliente al domiciliario (COP, 100% rider)';

-- ═══ MIGRACIÓN 047_product_modifiers_fulfillment.sql ═══

-- Modificadores de producto, fulfillment parcial y configuración de cobro por comercio

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS allow_partial_fulfillment BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS payout_mode TEXT NOT NULL DEFAULT 'platform_settlement'
    CHECK (payout_mode IN ('platform_settlement', 'direct_wompi', 'hybrid')),
  ADD COLUMN IF NOT EXISTS wompi_recipient_id TEXT,
  ADD COLUMN IF NOT EXISTS settlement_frequency TEXT NOT NULL DEFAULT 'weekly'
    CHECK (settlement_frequency IN ('daily', 'weekly', 'biweekly'));

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_at_price INTEGER,
  ADD COLUMN IF NOT EXISTS requires_customization BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.product_modifier_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  selection_type TEXT NOT NULL DEFAULT 'single'
    CHECK (selection_type IN ('single', 'multiple')),
  min_select INTEGER NOT NULL DEFAULT 0,
  max_select INTEGER,
  is_required BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.product_modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES public.product_modifier_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_delta INTEGER NOT NULL DEFAULT 0,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_available BOOLEAN NOT NULL DEFAULT true,
  action_type TEXT NOT NULL DEFAULT 'add'
    CHECK (action_type IN ('add', 'remove', 'substitute')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (fulfillment_status IN ('pending', 'confirmed', 'unavailable', 'substituted', 'cancelled')),
  ADD COLUMN IF NOT EXISTS fulfilled_quantity INTEGER,
  ADD COLUMN IF NOT EXISTS modifiers_json JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_modifier_groups_product ON public.product_modifier_groups(product_id);
CREATE INDEX IF NOT EXISTS idx_modifier_groups_business ON public.product_modifier_groups(business_id);
CREATE INDEX IF NOT EXISTS idx_modifiers_group ON public.product_modifiers(group_id);
CREATE INDEX IF NOT EXISTS idx_order_items_fulfillment ON public.order_items(order_id, fulfillment_status);

ALTER TABLE public.product_modifier_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_modifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "modifier_groups_public_read" ON public.product_modifier_groups
  FOR SELECT USING (true);

CREATE POLICY "modifiers_public_read" ON public.product_modifiers
  FOR SELECT USING (true);

CREATE POLICY "modifier_groups_business_write" ON public.product_modifier_groups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = product_modifier_groups.business_id
        AND b.owner_id = auth.uid()
    )
  );

CREATE POLICY "modifiers_business_write" ON public.product_modifiers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.product_modifier_groups g
      JOIN public.businesses b ON b.id = g.business_id
      WHERE g.id = product_modifiers.group_id
        AND b.owner_id = auth.uid()
    )
  );

-- ═══ MIGRACIÓN 048_business_verification_docs.sql ═══

-- UrabApp — Comercio: documentos de verificación legal (LOOP 1 / P0)

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS nit TEXT,
  ADD COLUMN IF NOT EXISTS legal_representative_name TEXT,
  ADD COLUMN IF NOT EXISTS verification_documents JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS verification_submitted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.businesses.verification_documents IS
  'URLs de documentos: { "cedula": "...", "camara_comercio": "..." }';

CREATE INDEX IF NOT EXISTS idx_businesses_verification_submitted
  ON public.businesses (verification_submitted_at DESC)
  WHERE verification_status = 'pending';

-- ═══ MIGRACIÓN 049_business_customer_crm.sql ═══

-- UrabApp — CRM por comercio (LOOP 7)

CREATE OR REPLACE FUNCTION public.get_business_customers(
  p_business_id UUID,
  p_segment TEXT DEFAULT NULL
)
RETURNS TABLE (
  customer_id UUID,
  display_name TEXT,
  municipio TEXT,
  order_count BIGINT,
  delivered_count BIGINT,
  total_spent BIGINT,
  last_order_at TIMESTAMPTZ,
  first_order_at TIMESTAMPTZ,
  segment TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = p_business_id AND b.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  WITH agg AS (
    SELECT
      u.id AS customer_id,
      COALESCE(NULLIF(TRIM(u.full_name), ''), 'Cliente UrabApp') AS display_name,
      u.municipio,
      COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') AS order_count,
      COUNT(o.id) FILTER (WHERE o.status = 'delivered') AS delivered_count,
      COALESCE(SUM(o.total) FILTER (WHERE o.status <> 'cancelled'), 0)::BIGINT AS total_spent,
      MAX(o.created_at) AS last_order_at,
      MIN(o.created_at) FILTER (WHERE o.status <> 'cancelled') AS first_order_at,
      CASE
        WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') <= 1 THEN 'new'
        WHEN MAX(o.created_at) < NOW() - INTERVAL '30 days' THEN 'at_risk'
        WHEN COUNT(o.id) FILTER (WHERE o.status <> 'cancelled') >= 3 THEN 'loyal'
        ELSE 'recurring'
      END AS segment
    FROM public.orders o
    JOIN public.users u ON u.id = o.customer_id
    WHERE o.business_id = p_business_id
    GROUP BY u.id, u.full_name, u.municipio
  )
  SELECT * FROM agg
  WHERE p_segment IS NULL OR agg.segment = p_segment
  ORDER BY agg.last_order_at DESC NULLS LAST;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_business_crm_summary(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = p_business_id AND b.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT jsonb_build_object(
    'total_customers', COUNT(*),
    'new_customers', COUNT(*) FILTER (WHERE segment = 'new'),
    'recurring_customers', COUNT(*) FILTER (WHERE segment IN ('recurring', 'loyal')),
    'loyal_customers', COUNT(*) FILTER (WHERE segment = 'loyal'),
    'at_risk_customers', COUNT(*) FILTER (WHERE segment = 'at_risk'),
    'repeat_rate', CASE WHEN COUNT(*) > 0
      THEN ROUND(100.0 * COUNT(*) FILTER (WHERE segment IN ('recurring', 'loyal')) / COUNT(*), 1)
      ELSE 0 END,
    'total_ltv', COALESCE(SUM(total_spent), 0)
  ) INTO result
  FROM public.get_business_customers(p_business_id, NULL);

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_business_customers(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_business_crm_summary(UUID) TO authenticated;

-- ═══ MIGRACIÓN 049_business_legal_colombia.sql ═══

-- UrabApp — Registro legal comercio Colombia + documento merchant + storage PDF

ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS legal_entity_type TEXT DEFAULT 'natural'
    CHECK (legal_entity_type IN ('natural', 'juridica')),
  ADD COLUMN IF NOT EXISTS representative_document_number TEXT,
  ADD COLUMN IF NOT EXISTS registration_consent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.businesses.legal_entity_type IS 'natural | juridica';
COMMENT ON COLUMN public.businesses.representative_document_number IS 'Cédula del titular o representante legal';
COMMENT ON COLUMN public.businesses.verification_documents IS
  'URLs: rut, cedula_front, cedula_back, camara_comercio, invima, licencia_licores';

INSERT INTO public.legal_documents (id, title, version, content, is_required, published_at)
VALUES (
  'merchant',
  'Acuerdo de comercio aliado Urabapp',
  '1.0',
  E'ACUERDO DE COMERCIO ALIADO — URABAPP (Colombia)\n\n1. NATURALEZA. Urabapp actúa como marketplace digital que conecta comercios del Urabá con clientes y mensajeros.\n\n2. OBLIGACIONES DEL COMERCIO. (a) Información veraz sobre productos, precios e impuestos. (b) Documentación tributaria y sanitaria vigente según su actividad. (c) Preparación y entrega conforme a tiempos declarados. (d) Cumplimiento de la Ley 1581 de 2012 en datos de clientes.\n\n3. COMISIONES Y PAGOS. Urabapp retiene la comisión acordada por transacción. Los pagos al comercio se liquidan según el modo de settlement configurado.\n\n4. CONTENIDO. El comercio garantiza derechos sobre logo, fotos y descripciones. Urabapp puede usar el material para promoción del marketplace.\n\n5. SUSPENSIÓN. Urabapp puede suspender tiendas con documentación inválida, quejas graves o incumplimiento legal.\n\n6. LEY APLICABLE. Legislación de la República de Colombia. Controversias: tribunales del domicilio del comercio en el Urabá.',
  true,
  NOW()
)
ON CONFLICT (id, version) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  published_at = EXCLUDED.published_at;

-- Bucket: permitir PDF en verificación (8 MB)
UPDATE storage.buckets
SET
  file_size_limit = 8388608,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/pdf'
  ]
WHERE id = 'urabapp-public';

-- ═══ MIGRACIÓN 050_business_campaigns.sql ═══

-- UrabApp — Campañas CRM comercio → clientes (LOOP 7)

CREATE TABLE IF NOT EXISTS public.business_customer_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  campaign_type TEXT NOT NULL DEFAULT 'winback'
    CHECK (campaign_type IN ('winback', 'loyalty', 'promo')),
  message TEXT NOT NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_business_campaigns_business
  ON public.business_customer_campaigns (business_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_business_campaigns_customer
  ON public.business_customer_campaigns (customer_id, created_at DESC);

ALTER TABLE public.business_customer_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY business_campaigns_owner_read ON public.business_customer_campaigns
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.id = business_id AND b.owner_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

CREATE OR REPLACE FUNCTION public.log_business_customer_campaign(
  p_business_id UUID,
  p_customer_id UUID,
  p_message TEXT,
  p_campaign_type TEXT DEFAULT 'winback'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NOT (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = p_business_id AND b.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  ) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.business_id = p_business_id AND o.customer_id = p_customer_id
      AND o.status <> 'cancelled'
  ) THEN
    RAISE EXCEPTION 'Cliente sin pedidos en este comercio';
  END IF;

  INSERT INTO public.business_customer_campaigns (business_id, customer_id, message, campaign_type, created_by)
  VALUES (p_business_id, p_customer_id, LEFT(p_message, 500), COALESCE(p_campaign_type, 'winback'), auth.uid())
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_business_customer_campaign(UUID, UUID, TEXT, TEXT) TO authenticated;

-- ═══ MIGRACIÓN 051_platform_operational_completeness.sql ═══

-- UrabApp · Completitud operativa: membresía, cupones personales, retiros mensajero, notificaciones

-- ─── Membresía Pro: usuarios gestionan su suscripción ───────────────────────
DROP POLICY IF EXISTS users_manage_own_subscription ON public.user_subscriptions;
CREATE POLICY users_manage_own_subscription ON public.user_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Pagos de membresía vía Wompi
CREATE TABLE IF NOT EXISTS public.membership_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES public.membership_plans(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  wompi_reference TEXT UNIQUE,
  wompi_transaction_id TEXT,
  checkout_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_membership_payments_user ON public.membership_payments (user_id, created_at DESC);

ALTER TABLE public.membership_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS membership_payments_own_read ON public.membership_payments;
CREATE POLICY membership_payments_own_read ON public.membership_payments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS membership_payments_admin ON public.membership_payments;
CREATE POLICY membership_payments_admin ON public.membership_payments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- ─── Cupones personales ─────────────────────────────────────────────────────
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS is_personal BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS per_user_limit INTEGER DEFAULT 1;

CREATE TABLE IF NOT EXISTS public.user_coupon_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'platform',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  UNIQUE (user_id, coupon_id)
);

CREATE INDEX IF NOT EXISTS idx_user_coupon_assignments_user
  ON public.user_coupon_assignments (user_id, redeemed_at NULLS FIRST);

ALTER TABLE public.user_coupon_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_coupon_assignments_own ON public.user_coupon_assignments;
CREATE POLICY user_coupon_assignments_own ON public.user_coupon_assignments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_coupon_assignments_admin ON public.user_coupon_assignments;
CREATE POLICY user_coupon_assignments_admin ON public.user_coupon_assignments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'ADMIN')
  );

-- Cupón bienvenida personal (si no existe)
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order, is_active, is_personal, per_user_limit)
VALUES (
  'BIENVENIDAURABA',
  'Descuento de bienvenida en tu primer pedido',
  'percent',
  10,
  20000,
  TRUE,
  TRUE,
  1
)
ON CONFLICT (code) DO UPDATE SET
  is_personal = TRUE,
  is_active = TRUE,
  description = EXCLUDED.description;

-- ─── Retiros mensajero: datos bancarios ─────────────────────────────────────
ALTER TABLE public.courier_payout
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'ahorros'
    CHECK (account_type IS NULL OR account_type IN ('ahorros', 'corriente')),
  ADD COLUMN IF NOT EXISTS account_holder TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

ALTER TABLE public.courier_wallet
  ADD COLUMN IF NOT EXISTS bank_name TEXT,
  ADD COLUMN IF NOT EXISTS account_number TEXT,
  ADD COLUMN IF NOT EXISTS account_type TEXT,
  ADD COLUMN IF NOT EXISTS account_holder TEXT;

-- Acreditar billetera al entregar (idempotente)
CREATE OR REPLACE FUNCTION public.credit_courier_wallet_on_delivery()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payout INTEGER;
BEGIN
  IF NEW.status = 'delivered' AND (OLD.status IS DISTINCT FROM 'delivered') AND NEW.driver_id IS NOT NULL THEN
    v_payout := COALESCE(NEW.rider_payout, (NEW.fare_breakdown->>'riderPayout')::INT, 4000);
    INSERT INTO courier_wallet (driver_id, balance_available, total_earned, updated_at)
    VALUES (NEW.driver_id, v_payout, v_payout, NOW())
    ON CONFLICT (driver_id) DO UPDATE SET
      balance_available = courier_wallet.balance_available + EXCLUDED.balance_available,
      total_earned = courier_wallet.total_earned + EXCLUDED.total_earned,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_credit_courier_wallet ON public.orders;
CREATE TRIGGER trg_credit_courier_wallet
  AFTER UPDATE OF status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.credit_courier_wallet_on_delivery();

-- Solicitar retiro bancario
CREATE OR REPLACE FUNCTION public.request_courier_payout(
  p_amount NUMERIC,
  p_bank_name TEXT,
  p_account_number TEXT,
  p_account_type TEXT DEFAULT 'ahorros',
  p_account_holder TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_driver_id UUID;
  v_wallet public.courier_wallet;
  v_payout_id UUID;
  v_min NUMERIC := 20000;
BEGIN
  v_driver_id := public.auth_driver_id();
  IF v_driver_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_a_courier');
  END IF;

  IF p_amount IS NULL OR p_amount < v_min THEN
    RETURN jsonb_build_object('success', false, 'error', 'min_amount', 'min', v_min);
  END IF;

  IF COALESCE(trim(p_bank_name), '') = '' OR COALESCE(trim(p_account_number), '') = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'bank_required');
  END IF;

  SELECT * INTO v_wallet FROM courier_wallet WHERE driver_id = v_driver_id FOR UPDATE;
  IF v_wallet IS NULL OR v_wallet.balance_available < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'insufficient_balance');
  END IF;

  UPDATE courier_wallet
  SET balance_available = balance_available - p_amount,
      bank_name = p_bank_name,
      account_number = p_account_number,
      account_type = COALESCE(p_account_type, 'ahorros'),
      account_holder = COALESCE(p_account_holder, account_holder),
      updated_at = NOW()
  WHERE driver_id = v_driver_id;

  INSERT INTO courier_payout (
    driver_id, amount, status, method,
    bank_name, account_number, account_type, account_holder
  )
  VALUES (
    v_driver_id, p_amount, 'pending', 'bank_transfer',
    p_bank_name, p_account_number, COALESCE(p_account_type, 'ahorros'), p_account_holder
  )
  RETURNING id INTO v_payout_id;

  RETURN jsonb_build_object('success', true, 'payout_id', v_payout_id);
END;
$$;

REVOKE ALL ON FUNCTION public.request_courier_payout(NUMERIC, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.request_courier_payout(NUMERIC, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Asignar cupón de bienvenida
CREATE OR REPLACE FUNCTION public.assign_welcome_coupon(p_user_id UUID DEFAULT auth.uid())
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon_id UUID;
BEGIN
  IF p_user_id IS NULL OR p_user_id <> auth.uid() THEN
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ADMIN') THEN
      RETURN jsonb_build_object('success', false, 'error', 'forbidden');
    END IF;
  END IF;

  SELECT id INTO v_coupon_id FROM coupons
  WHERE code = 'BIENVENIDAURABA' AND is_active = TRUE
  LIMIT 1;

  IF v_coupon_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'coupon_not_found');
  END IF;

  INSERT INTO user_coupon_assignments (user_id, coupon_id, source)
  VALUES (p_user_id, v_coupon_id, 'welcome')
  ON CONFLICT (user_id, coupon_id) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'coupon_id', v_coupon_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.assign_welcome_coupon(UUID) TO authenticated;

-- Canjear cupón personal al validar pedido
CREATE OR REPLACE FUNCTION public.redeem_user_coupon(
  p_user_id UUID,
  p_coupon_code TEXT,
  p_order_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon public.coupons;
  v_assignment public.user_coupon_assignments;
BEGIN
  SELECT * INTO v_coupon FROM coupons
  WHERE upper(code) = upper(trim(p_coupon_code)) AND is_active = TRUE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_coupon.is_personal THEN
    SELECT * INTO v_assignment FROM user_coupon_assignments
    WHERE user_id = p_user_id AND coupon_id = v_coupon.id AND redeemed_at IS NULL
    LIMIT 1;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('success', false, 'error', 'not_assigned');
    END IF;

    UPDATE user_coupon_assignments
    SET redeemed_at = NOW(), order_id = p_order_id
    WHERE id = v_assignment.id;
  END IF;

  UPDATE coupons SET uses_count = COALESCE(uses_count, 0) + 1 WHERE id = v_coupon.id;

  RETURN jsonb_build_object('success', true, 'coupon_id', v_coupon.id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.redeem_user_coupon(UUID, TEXT, UUID) TO authenticated;

-- Notificación in-app con autorización
CREATE OR REPLACE FUNCTION public.dispatch_user_notification(
  p_user_id UUID,
  p_title TEXT,
  p_body TEXT,
  p_type TEXT DEFAULT 'order',
  p_data JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller UUID := auth.uid();
  v_allowed BOOLEAN := FALSE;
  v_id UUID;
BEGIN
  IF v_caller IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  IF v_caller = p_user_id THEN
    v_allowed := TRUE;
  ELSIF EXISTS (SELECT 1 FROM users WHERE id = v_caller AND role = 'ADMIN') THEN
    v_allowed := TRUE;
  ELSIF EXISTS (
    SELECT 1 FROM orders o
    JOIN businesses b ON b.id = o.business_id
    WHERE b.owner_id = v_caller AND o.customer_id = p_user_id
  ) THEN
    v_allowed := TRUE;
  ELSIF EXISTS (
    SELECT 1 FROM orders o
    JOIN drivers d ON d.id = o.driver_id
    WHERE d.user_id = v_caller AND o.customer_id = p_user_id
  ) THEN
    v_allowed := TRUE;
  ELSIF EXISTS (
    SELECT 1 FROM orders o
    JOIN drivers d ON d.id = o.driver_id
    WHERE o.customer_id = v_caller AND d.user_id = p_user_id
  ) THEN
    v_allowed := TRUE;
  END IF;

  IF NOT v_allowed THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO notifications (user_id, title, body, type, data)
  VALUES (p_user_id, p_title, p_body, p_type, p_data)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.dispatch_user_notification(UUID, TEXT, TEXT, TEXT, JSONB) TO authenticated;

-- ═══ MIGRACIÓN 052_admin_courier_payouts.sql ═══

-- Admin: gestión de retiros mensajero

DROP POLICY IF EXISTS courier_payout_admin ON public.courier_payout;
CREATE POLICY courier_payout_admin ON public.courier_payout
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.admin_process_courier_payout(
  p_payout_id UUID,
  p_action TEXT,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin UUID := auth.uid();
  v_payout public.courier_payout;
BEGIN
  IF NOT public.is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'forbidden');
  END IF;

  IF p_action NOT IN ('paid', 'failed', 'cancelled') THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_action');
  END IF;

  SELECT * INTO v_payout FROM courier_payout WHERE id = p_payout_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_found');
  END IF;

  IF v_payout.status NOT IN ('pending', 'processing') THEN
    RETURN jsonb_build_object('success', false, 'error', 'already_processed');
  END IF;

  IF p_action IN ('failed', 'cancelled') THEN
    UPDATE courier_wallet
    SET balance_available = balance_available + v_payout.amount,
        updated_at = NOW()
    WHERE driver_id = v_payout.driver_id;

    UPDATE courier_payout
    SET status = p_action,
        rejection_reason = p_notes,
        paid_at = NULL
    WHERE id = p_payout_id;
  ELSE
    UPDATE courier_payout
    SET status = 'paid',
        reference = COALESCE(p_notes, reference),
        paid_at = NOW()
    WHERE id = p_payout_id;
  END IF;

  INSERT INTO courier_events (driver_id, event_type, severity, metadata)
  VALUES (
    v_payout.driver_id,
    'payout_' || p_action,
    CASE WHEN p_action = 'paid' THEN 'info' ELSE 'warning' END,
    jsonb_build_object('payout_id', p_payout_id, 'amount', v_payout.amount, 'notes', p_notes, 'admin_id', v_admin)
  );

  RETURN jsonb_build_object('success', true, 'status', p_action);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_process_courier_payout(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_process_courier_payout(UUID, TEXT, TEXT) TO authenticated;

-- Promover owner a ADMIN si existe
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(trim(full_name), ''), 'Brayan Admin')
WHERE email = 'brayandel001@gmail.com';

-- ═══ MIGRACIÓN 053_superuser_rbac.sql ═══

-- UrabApp — Superusuario (ADMIN) y aislamiento de perfil por usuario
-- · Rol solo desde app_metadata (no user_metadata, editable por el usuario)
-- · Trigger impide escalación de privilegios vía UPDATE directo
-- · Admin conserva lectura/escritura global vía is_admin()

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  owner_email CONSTANT TEXT := 'brayandel001@gmail.com';
BEGIN
  assigned_role := CASE
    WHEN lower(trim(COALESCE(NEW.email, ''))) = lower(trim(owner_email)) THEN 'ADMIN'
    WHEN COALESCE(NEW.raw_app_meta_data->>'role', '') IN ('ADMIN', 'BUSINESS', 'RIDER', 'CLIENT')
      THEN NEW.raw_app_meta_data->>'role'
    ELSE 'CLIENT'
  END;

  INSERT INTO public.users (id, email, phone, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'Usuario'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    role = CASE
      WHEN lower(trim(COALESCE(EXCLUDED.email, public.users.email))) = lower(trim(owner_email)) THEN 'ADMIN'
      WHEN public.is_admin() THEN EXCLUDED.role
      ELSE public.users.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.guard_users_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.role := OLD.role;
  NEW.account_status := OLD.account_status;
  NEW.email := OLD.email;
  NEW.welcome_delivery_used_at := OLD.welcome_delivery_used_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_guard_users_privileged_columns ON public.users;
CREATE TRIGGER trg_guard_users_privileged_columns
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_users_privileged_columns();

-- Owner de plataforma siempre ADMIN
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(full_name, ''), 'Brayan Admin')
WHERE lower(trim(email)) = lower(trim('brayandel001@gmail.com'));

-- ═══ MIGRACIÓN 054_order_security_policies.sql ═══

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

-- ═══ MIGRACIÓN 055_demo_flow_scenarios.sql ═══

-- Escenarios demo: 1 cliente, 1 comercio, 1 mensajero con pedidos de prueba
-- Requiere cuentas auth: test.cliente@, test.tienda@, test.mensajero@urabapp.com

DO $$
DECLARE
  v_client UUID;
  v_business_user UUID;
  v_rider_user UUID;
  v_driver UUID;
  v_business UUID := 'a0000001-0000-0000-0000-000000000001';
  v_order_delivered UUID;
  v_order_active UUID;
  v_product_ok UUID;
  v_product_out UUID;
BEGIN
  SELECT id INTO v_client FROM auth.users WHERE email = 'test.cliente@urabapp.com';
  SELECT id INTO v_business_user FROM auth.users WHERE email = 'test.tienda@urabapp.com';
  SELECT id INTO v_rider_user FROM auth.users WHERE email = 'test.mensajero@urabapp.com';

  IF v_client IS NULL OR v_business_user IS NULL OR v_rider_user IS NULL THEN
    RAISE NOTICE 'Demo users missing — create test.cliente/tienda/mensajero@urabapp.com in Supabase Auth first';
    RETURN;
  END IF;

  INSERT INTO public.users (id, email, full_name, phone, role, document_number)
  VALUES
    (v_client, 'test.cliente@urabapp.com', 'Cliente Demo Urabapp', '3001110001', 'CLIENT', '1098765432'),
    (v_business_user, 'test.tienda@urabapp.com', 'Comercio Demo Urabapp', '3002220002', 'BUSINESS', NULL),
    (v_rider_user, 'test.mensajero@urabapp.com', 'Mensajero Demo Urabapp', '3003330003', 'RIDER', NULL)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    document_number = COALESCE(public.users.document_number, EXCLUDED.document_number);

  UPDATE public.businesses
  SET owner_id = v_business_user,
      verification_status = 'approved',
      is_active = TRUE,
      is_published = TRUE
  WHERE id = v_business;

  INSERT INTO public.drivers (user_id, name, phone, municipio, vehicle, plate, is_online, is_verified, verification_status)
  VALUES (v_rider_user, 'Mensajero Demo Urabapp', '3003330003', 'Apartadó', 'moto', 'DEMO-01', TRUE, TRUE, 'approved')
  ON CONFLICT (user_id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    is_verified = TRUE,
    verification_status = 'approved',
    is_online = TRUE
  RETURNING id INTO v_driver;

  IF v_driver IS NULL THEN
    SELECT id INTO v_driver FROM public.drivers WHERE user_id = v_rider_user;
  END IF;

  SELECT id INTO v_product_ok FROM public.products
  WHERE business_id = v_business AND name ILIKE '%Sancocho%' LIMIT 1;
  SELECT id INTO v_product_out FROM public.products
  WHERE business_id = v_business AND name ILIKE '%Patacón%' LIMIT 1;

  IF v_product_ok IS NULL THEN
    SELECT id INTO v_product_ok FROM public.products WHERE business_id = v_business LIMIT 1;
  END IF;
  IF v_product_out IS NULL OR v_product_out = v_product_ok THEN
    SELECT id INTO v_product_out FROM public.products
    WHERE business_id = v_business AND id <> COALESCE(v_product_ok, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;
  END IF;

  DELETE FROM public.order_items
  WHERE order_id IN (SELECT id FROM public.orders WHERE order_number LIKE 'URA-DEMO-%');
  DELETE FROM public.orders WHERE order_number LIKE 'URA-DEMO-%';

  -- Pedido entregado: ítem agotado parcialmente
  INSERT INTO public.orders (
    order_number, customer_id, business_id, driver_id, status,
    dest_municipio, dest_address, subtotal, delivery_fee, total,
    payment_method, payment_status, notes, delivered_at, created_at
  ) VALUES (
    'URA-DEMO-001', v_client, v_business, v_driver, 'delivered',
    'Apartadó', 'Calle 100 #45-20, Barrio El Progreso',
    30000, 3000, 30000,
    'cash', 'paid',
    'Comercio reportó agotado: Patacón con hogao. Se entregó el resto del pedido.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  )
  RETURNING id INTO v_order_delivered;

  IF v_product_ok IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status, notes)
    VALUES (v_order_delivered, v_product_ok, 'Sancocho de pescado', '🍲', 1, 18000, 18000, 'confirmed', NULL);
  END IF;
  IF v_product_out IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status, notes)
    VALUES (v_order_delivered, v_product_out, 'Patacón con hogao', '🍌', 1, 12000, 12000, 'unavailable', 'Agotado al preparar — no se cobró');
  END IF;

  -- Pedido activo: mensajero con demora en recogida
  INSERT INTO public.orders (
    order_number, customer_id, business_id, driver_id, status,
    dest_municipio, dest_address, subtotal, delivery_fee, total,
    payment_method, payment_status, notes, accepted_at, created_at
  ) VALUES (
    'URA-DEMO-002', v_client, v_business, v_driver, 'on_the_way',
    'Apartadó', 'Carrera 98 #50-10, Barrio La Esperanza',
    23000, 3000, 26000,
    'cash', 'pending',
    'Mensajero reportó demora en recogida: comercio confirmó preparación tardía. Cliente avisado.',
    NOW() - INTERVAL '35 minutes',
    NOW() - INTERVAL '45 minutes'
  )
  RETURNING id INTO v_order_active;

  IF v_product_ok IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status)
    VALUES (v_order_active, v_product_ok, 'Sancocho de pescado', '🍲', 1, 18000, 18000, 'confirmed');
  END IF;
  IF v_product_out IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status)
    VALUES (v_order_active, v_product_out, 'Jugo natural', '🥤', 1, 5000, 5000, 'confirmed');
  END IF;

  RAISE NOTICE 'Demo flow seeded: URA-DEMO-001 (delivered+agotado), URA-DEMO-002 (on_the_way+recogida)';
END $$;

-- ═══ MIGRACIÓN 056_demo_rider_priority.sql ═══

-- Mensajero demo recibe prioridad en asignación + siempre listo en Apartadó

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
  SELECT id, driver_id, status, dest_municipio, dest_latitude, dest_longitude,
         payment_method, payment_status
  INTO v_order
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_order.driver_id IS NOT NULL THEN RETURN v_order.driver_id; END IF;
  IF v_order.status NOT IN ('pending', 'accepted') THEN RETURN NULL; END IF;

  IF v_order.payment_method IN ('wompi', 'nequi', 'pse', 'card', 'cards', 'daviplata')
     AND v_order.payment_status IS DISTINCT FROM 'paid' THEN
    RETURN NULL;
  END IF;

  SELECT d.id INTO v_rider_id
  FROM public.drivers d
  LEFT JOIN public.users u ON u.id = d.user_id
  WHERE d.is_online = true
    AND d.is_verified = true
    AND (
      d.municipio = v_order.dest_municipio
      OR u.email = 'test.mensajero@urabapp.com'
    )
  ORDER BY
    CASE WHEN u.email = 'test.mensajero@urabapp.com' THEN 0 ELSE 1 END,
    CASE
      WHEN v_order.dest_latitude IS NOT NULL AND d.latitude IS NOT NULL THEN
        POWER(d.latitude::float - v_order.dest_latitude::float, 2)
        + POWER(d.longitude::float - v_order.dest_longitude::float, 2)
      ELSE 999999
    END,
    d.total_deliveries ASC,
    d.rating DESC
  LIMIT 1;

  IF v_rider_id IS NULL THEN RETURN NULL; END IF;

  UPDATE public.orders
  SET
    driver_id = v_rider_id,
    status = CASE WHEN status = 'pending' THEN 'accepted' ELSE status END,
    accepted_at = CASE WHEN status = 'pending' THEN NOW() ELSE accepted_at END
  WHERE id = p_order_id;

  RETURN v_rider_id;
END;
$$;

-- Demo rider: online, GPS en Apartadó, verificado
DO $$
DECLARE
  v_rider_user UUID;
  v_driver UUID;
BEGIN
  SELECT id INTO v_rider_user FROM auth.users WHERE email = 'test.mensajero@urabapp.com';
  IF v_rider_user IS NULL THEN
    RAISE NOTICE 'test.mensajero@urabapp.com no existe — omitiendo setup demo rider';
    RETURN;
  END IF;

  UPDATE public.drivers
  SET
    is_online = true,
    availability_mode = 'available',
    is_verified = true,
    verification_status = 'approved',
    municipio = 'Apartadó',
    latitude = 7.8833,
    longitude = -76.6333,
    onboarding_step = 4
  WHERE user_id = v_rider_user
  RETURNING id INTO v_driver;

  IF v_driver IS NULL THEN
    INSERT INTO public.drivers (
      user_id, name, phone, municipio, vehicle, plate,
      is_online, availability_mode, is_verified, verification_status,
      latitude, longitude, onboarding_step
    )
    VALUES (
      v_rider_user, 'Mensajero Demo Urabapp', '3003330003', 'Apartadó', 'moto', 'DEMO-01',
      true, 'available', true, 'approved',
      7.8833, -76.6333, 4
    );
  END IF;
END $$;

-- ═══ MIGRACIÓN 056_merge_guest_activity.sql ═══

-- Vincular pedidos/envíos de sesión invitada (anónima u otro perfil) al usuario autenticado por teléfono.

CREATE OR REPLACE FUNCTION public.merge_customer_activity(
  p_phone TEXT DEFAULT NULL,
  p_guest_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_digits TEXT;
  v_orders INT := 0;
  v_shipments INT := 0;
  v_addresses INT := 0;
  v_source_ids UUID[] := ARRAY[]::UUID[];
  v_guest_phone TEXT;
  v_target_phone TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  IF p_phone IS NOT NULL AND length(trim(p_phone)) > 0 THEN
    v_digits := right(regexp_replace(p_phone, '\D', '', 'g'), 10);
    IF length(v_digits) >= 10 THEN
      UPDATE public.users SET phone = trim(p_phone) WHERE id = v_uid;
      SELECT COALESCE(array_agg(u.id), ARRAY[]::UUID[])
      INTO v_source_ids
      FROM public.users u
      WHERE u.id <> v_uid
        AND right(regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g'), 10) = v_digits;
    END IF;
  END IF;

  IF p_guest_user_id IS NOT NULL AND p_guest_user_id <> v_uid THEN
    SELECT phone INTO v_guest_phone FROM public.users WHERE id = p_guest_user_id;
    SELECT phone INTO v_target_phone FROM public.users WHERE id = v_uid;

    IF v_guest_phone IS NULL
      OR v_target_phone IS NULL
      OR right(regexp_replace(v_guest_phone, '\D', '', 'g'), 10)
         = right(regexp_replace(COALESCE(v_target_phone, p_phone, ''), '\D', '', 'g'), 10) THEN
      v_source_ids := array_append(v_source_ids, p_guest_user_id);
    END IF;
  END IF;

  v_source_ids := ARRAY(SELECT DISTINCT unnest(v_source_ids));

  IF array_length(v_source_ids, 1) IS NULL THEN
    RETURN jsonb_build_object('success', true, 'orders', 0, 'shipments', 0, 'addresses', 0);
  END IF;

  UPDATE public.orders
  SET customer_id = v_uid
  WHERE customer_id = ANY(v_source_ids);
  GET DIAGNOSTICS v_orders = ROW_COUNT;

  UPDATE public.shipment_orders
  SET customer_id = v_uid
  WHERE customer_id = ANY(v_source_ids);
  GET DIAGNOSTICS v_shipments = ROW_COUNT;

  UPDATE public.addresses
  SET user_id = v_uid
  WHERE user_id = ANY(v_source_ids)
    AND NOT EXISTS (
      SELECT 1 FROM public.addresses a
      WHERE a.user_id = v_uid AND a.address = public.addresses.address
    );
  GET DIAGNOSTICS v_addresses = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'orders', v_orders,
    'shipments', v_shipments,
    'addresses', v_addresses
  );
END;
$$;

REVOKE ALL ON FUNCTION public.merge_customer_activity(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_customer_activity(TEXT, UUID) TO authenticated;

-- ═══ MIGRACIÓN 057_business_legal_immutable.sql ═══

-- Bloquear modificación de datos legales tras envío a revisión (excepto rechazado)

CREATE OR REPLACE FUNCTION public.guard_business_legal_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin puede modificar siempre
  IF EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid() AND u.role = 'ADMIN'
  ) THEN
    RETURN NEW;
  END IF;

  -- Sin envío previo: permitir
  IF OLD.verification_submitted_at IS NULL THEN
    RETURN NEW;
  END IF;

  -- Rechazado: permitir corrección
  IF OLD.verification_status = 'rejected' THEN
    RETURN NEW;
  END IF;

  -- En revisión o aprobado: bloquear campos legales
  IF NEW.legal_entity_type IS DISTINCT FROM OLD.legal_entity_type
     OR NEW.nit IS DISTINCT FROM OLD.nit
     OR NEW.legal_representative_name IS DISTINCT FROM OLD.legal_representative_name
     OR NEW.representative_document_number IS DISTINCT FROM OLD.representative_document_number
     OR NEW.verification_documents IS DISTINCT FROM OLD.verification_documents
     OR NEW.registration_consent_at IS DISTINCT FROM OLD.registration_consent_at
  THEN
    RAISE EXCEPTION 'legal_fields_locked'
      USING HINT = 'Los datos legales no pueden modificarse mientras están en revisión o verificados';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_business_legal ON public.businesses;
CREATE TRIGGER trg_guard_business_legal
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_business_legal_fields();

-- ═══ MIGRACIÓN 057_client_security_hardening.sql ═══

-- Seguridad cliente: anti-fraude perfil, entrega bienvenida, merge invitado

-- 1) Permitir marcar entrega bienvenida UNA sola vez (el trigger la bloqueaba siempre)
CREATE OR REPLACE FUNCTION public.guard_users_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.role := OLD.role;
  NEW.account_status := OLD.account_status;
  NEW.email := OLD.email;

  IF OLD.welcome_delivery_used_at IS NULL AND NEW.welcome_delivery_used_at IS NOT NULL THEN
    NULL;
  ELSE
    NEW.welcome_delivery_used_at := OLD.welcome_delivery_used_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2) Marcar entrega bienvenida solo tras pedido válido del mismo usuario
CREATE OR REPLACE FUNCTION public.mark_welcome_delivery_used(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_order public.orders;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_order
  FROM public.orders
  WHERE id = p_order_id AND customer_id = v_uid;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  IF NOT COALESCE(v_order.welcome_delivery_applied, FALSE) THEN
    RETURN jsonb_build_object('success', false, 'error', 'not_applicable');
  END IF;

  UPDATE public.users
  SET welcome_delivery_used_at = NOW(), updated_at = NOW()
  WHERE id = v_uid AND welcome_delivery_used_at IS NULL;

  RETURN jsonb_build_object('success', true);
END;
$$;

REVOKE ALL ON FUNCTION public.mark_welcome_delivery_used(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_welcome_delivery_used(UUID) TO authenticated;

-- 3) Merge invitado: solo sesión guest conocida — sin robar pedidos por teléfono ajeno
CREATE OR REPLACE FUNCTION public.merge_customer_activity(
  p_phone TEXT DEFAULT NULL,
  p_guest_user_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_orders INT := 0;
  v_shipments INT := 0;
  v_addresses INT := 0;
  v_guest_phone TEXT;
  v_target_phone TEXT;
  v_guest_digits TEXT;
  v_target_digits TEXT;
BEGIN
  IF v_uid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'reason', 'not_authenticated');
  END IF;

  IF p_phone IS NOT NULL AND length(trim(p_phone)) >= 10 THEN
    UPDATE public.users SET phone = trim(p_phone), updated_at = NOW() WHERE id = v_uid;
  END IF;

  IF p_guest_user_id IS NULL OR p_guest_user_id = v_uid THEN
    RETURN jsonb_build_object('success', true, 'orders', 0, 'shipments', 0, 'addresses', 0);
  END IF;

  SELECT phone INTO v_guest_phone FROM public.users WHERE id = p_guest_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'reason', 'guest_not_found');
  END IF;

  SELECT phone INTO v_target_phone FROM public.users WHERE id = v_uid;

  v_guest_digits := right(regexp_replace(COALESCE(v_guest_phone, ''), '\D', '', 'g'), 10);
  v_target_digits := right(regexp_replace(COALESCE(v_target_phone, p_phone, ''), '\D', '', 'g'), 10);

  IF length(v_guest_digits) >= 10 AND length(v_target_digits) >= 10 AND v_guest_digits <> v_target_digits THEN
    RETURN jsonb_build_object('success', false, 'reason', 'phone_mismatch');
  END IF;

  UPDATE public.orders SET customer_id = v_uid WHERE customer_id = p_guest_user_id;
  GET DIAGNOSTICS v_orders = ROW_COUNT;

  UPDATE public.shipment_orders SET customer_id = v_uid WHERE customer_id = p_guest_user_id;
  GET DIAGNOSTICS v_shipments = ROW_COUNT;

  UPDATE public.addresses
  SET user_id = v_uid
  WHERE user_id = p_guest_user_id
    AND NOT EXISTS (
      SELECT 1 FROM public.addresses a
      WHERE a.user_id = v_uid AND a.address = public.addresses.address
    );
  GET DIAGNOSTICS v_addresses = ROW_COUNT;

  RETURN jsonb_build_object(
    'success', true,
    'orders', v_orders,
    'shipments', v_shipments,
    'addresses', v_addresses
  );
END;
$$;

REVOKE ALL ON FUNCTION public.merge_customer_activity(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.merge_customer_activity(TEXT, UUID) TO authenticated;

-- 4) Perfil: columnas actualizables por el propio usuario (capa RLS)
DROP POLICY IF EXISTS users_update_own ON public.users;
CREATE POLICY users_update_own ON public.users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT u.role FROM public.users u WHERE u.id = auth.uid())
    AND account_status = (SELECT u.account_status FROM public.users u WHERE u.id = auth.uid())
    AND email = (SELECT u.email FROM public.users u WHERE u.id = auth.uid())
  );
