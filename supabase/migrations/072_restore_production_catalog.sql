-- Catálogo operativo Apartadó (post-purge 069): comercios publicados y aprobados para el home.
-- Bypass trigger de verificación (solo admins en runtime; migración de datos operativa).

ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone,
  delivery_fee, min_order, delivery_time, rating, is_open, is_active,
  is_published, verification_status, approved_at, slug, latitude, longitude
) VALUES
  ('b0000001-0000-0000-0000-000000000005', 'Asados El Prado', 'comida', 'Carnes y parrilla', '🥩', 'Apartadó', 'Centro', 5000, 18000, 30, 4.7, true, true, true, 'approved', NOW(), 'asados-el-prado', 7.8830, -76.6259),
  ('b0000001-0000-0000-0000-000000000006', 'Pizza Roma', 'comida', 'Pizzas y pastas', '🍕', 'Apartadó', 'Centro', 5000, 20000, 35, 4.6, true, true, true, 'approved', NOW(), 'pizza-roma', 7.8832, -76.6255),
  ('b0000001-0000-0000-0000-000000000007', 'Café La Parada', 'comida', 'Café y panadería', '☕', 'Apartadó', 'Ortiz', 5000, 12000, 20, 4.8, true, true, true, 'approved', NOW(), 'cafe-la-parada', 7.8810, -76.6280),
  ('b0000001-0000-0000-0000-000000000008', 'Pollería El Corral', 'comida', 'Pollo broaster', '🍗', 'Apartadó', 'Ortiz', 5000, 15000, 25, 4.5, true, true, true, 'approved', NOW(), 'polleria-el-corral', 7.8812, -76.6278),
  ('b0000001-0000-0000-0000-000000000009', 'Sushi Wok', 'comida', 'Sushi y wok', '🍣', 'Apartadó', 'Laureles', 5000, 25000, 40, 4.4, true, true, true, 'approved', NOW(), 'sushi-wok', 7.8860, -76.6220),
  ('b0000001-0000-0000-0000-000000000010', 'Heladería Polar', 'comida', 'Helados y postres', '🍦', 'Apartadó', 'Laureles', 5000, 10000, 15, 4.9, true, true, true, 'approved', NOW(), 'heladeria-polar', 7.8862, -76.6218),
  ('b0000001-0000-0000-0000-000000000011', 'Droguería El Ahorro', 'farmacia', 'Medicamentos', '💊', 'Apartadó', 'Vélez', 5000, 8000, 20, 4.7, true, true, true, 'approved', NOW(), 'drogueria-el-ahorro', 7.8790, -76.6310),
  ('b0000001-0000-0000-0000-000000000012', 'Tienda Don Pedro', 'mercado', 'Abarrotes del barrio', '🏪', 'Apartadó', 'Vélez', 5000, 15000, 25, 4.5, true, true, true, 'approved', NOW(), 'tienda-don-pedro', 7.8792, -76.6308),
  ('b0000001-0000-0000-0000-000000000013', 'Panadería San José', 'mercado', 'Pan fresco diario', '🥖', 'Apartadó', 'Centro', 5000, 10000, 20, 4.8, true, true, true, 'approved', NOW(), 'panaderia-san-jose', 7.8828, -76.6262),
  ('b0000001-0000-0000-0000-000000000014', 'Frutas El Campo', 'mercado', 'Frutas y verduras', '🍎', 'Apartadó', 'Ortiz', 5000, 12000, 25, 4.6, true, true, true, 'approved', NOW(), 'frutas-el-campo', 7.8808, -76.6282),
  ('b0000001-0000-0000-0000-000000000015', 'Papelería Estudiantil', 'tiendas', 'Útiles y copias', '📚', 'Apartadó', 'Centro', 5000, 10000, 20, 4.5, true, true, true, 'approved', NOW(), 'papeleria-estudiantil', 7.8834, -76.6257),
  ('b0000001-0000-0000-0000-000000000016', 'TecnoUrabá', 'tecnologia', 'Accesorios celular', '📱', 'Apartadó', 'Laureles', 5000, 20000, 30, 4.4, true, true, true, 'approved', NOW(), 'tecnouraba', 7.8858, -76.6222),
  ('b0000001-0000-0000-0000-000000000017', 'Mascotas Felices', 'mascotas', 'Alimento y accesorios', '🐾', 'Apartadó', 'Vélez', 5000, 15000, 25, 4.7, true, true, true, 'approved', NOW(), 'mascotas-felices', 7.8788, -76.6312),
  ('b0000001-0000-0000-0000-000000000018', 'Licores Centro', 'licoreria', 'Cerveza y licores', '🍺', 'Apartadó', 'Centro', 5000, 25000, 20, 4.3, true, true, true, 'approved', NOW(), 'licores-centro', 7.8836, -76.6253),
  ('b0000001-0000-0000-0000-000000000019', 'Arepas Doña Rosa', 'comida', 'Arepas y huevos', '🫓', 'Apartadó', 'Ortiz', 5000, 10000, 15, 4.9, true, true, true, 'approved', NOW(), 'arepas-dona-rosa', 7.8814, -76.6276),
  ('b0000001-0000-0000-0000-000000000020', 'Cevichería El Mar', 'comida', 'Ceviches y cocteles', '🦐', 'Apartadó', 'Laureles', 5000, 22000, 35, 4.6, true, true, true, 'approved', NOW(), 'cevicheria-el-mar', 7.8864, -76.6216),
  ('c0000002-0000-0000-0000-000000000021', 'Burger Urban', 'comida', 'Hamburguesas artesanales', '🍔', 'Apartadó', 'Centro', 5000, 15000, 25, 4.6, true, true, true, 'approved', NOW(), 'burger-urban', 7.8826, -76.6264),
  ('c0000002-0000-0000-0000-000000000022', 'Empanadas El Rincón', 'comida', 'Empanadas y jugos', '🥟', 'Apartadó', 'Centro', 5000, 10000, 20, 4.8, true, true, true, 'approved', NOW(), 'empanadas-el-rincon', 7.8824, -76.6266),
  ('c0000002-0000-0000-0000-000000000026', 'Tacos México', 'comida', 'Tacos y burritos', '🌮', 'Apartadó', 'Ortiz', 5000, 12000, 25, 4.7, true, true, true, 'approved', NOW(), 'tacos-mexico', 7.8806, -76.6284),
  ('c0000002-0000-0000-0000-000000000027', 'Jugos Naturales', 'comida', 'Jugos y batidos', '🥤', 'Apartadó', 'Ortiz', 5000, 8000, 15, 4.9, true, true, true, 'approved', NOW(), 'jugos-naturales', 7.8804, -76.6286),
  ('c0000002-0000-0000-0000-000000000030', 'Droguería Salud Total', 'farmacia', 'Medicamentos y cuidado', '💊', 'Apartadó', 'Ortiz', 5000, 8000, 20, 4.7, true, true, true, 'approved', NOW(), 'drogueria-salud-total', 7.8802, -76.6288),
  ('c0000002-0000-0000-0000-000000000038', 'Farmacia del Pueblo', 'farmacia', 'Farmacia de barrio', '💊', 'Apartadó', 'Vélez', 5000, 8000, 20, 4.8, true, true, true, 'approved', NOW(), 'farmacia-del-pueblo', 7.8786, -76.6314)
ON CONFLICT (id) DO UPDATE SET
  is_published = EXCLUDED.is_published,
  verification_status = EXCLUDED.verification_status,
  is_active = EXCLUDED.is_active,
  approved_at = COALESCE(public.businesses.approved_at, EXCLUDED.approved_at),
  slug = COALESCE(public.businesses.slug, EXCLUDED.slug),
  latitude = COALESCE(public.businesses.latitude, EXCLUDED.latitude),
  longitude = COALESCE(public.businesses.longitude, EXCLUDED.longitude);

-- Publicar comercios reales registrados por onboarding
UPDATE public.businesses
SET
  is_published = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW()),
  is_active = true
WHERE id IN (
  '40d865c0-926f-4338-b05d-fbd5007ad05e',
  '3eaee9d0-abbf-4b2b-b7e3-7d9bc0f13be4'
);

INSERT INTO public.products (business_id, name, description, emoji, price, category) VALUES
  ('b0000001-0000-0000-0000-000000000005', 'Picada familiar', 'Para 4 personas', '🥩', 45000, 'Platos'),
  ('b0000001-0000-0000-0000-000000000006', 'Pizza hawaiana', 'Mediana', '🍕', 28000, 'Pizzas'),
  ('b0000001-0000-0000-0000-000000000007', 'Café con leche + pandebono', 'Desayuno', '☕', 8000, 'Desayunos'),
  ('b0000001-0000-0000-0000-000000000008', 'Combo broaster', 'Con papas y gaseosa', '🍗', 22000, 'Combos'),
  ('b0000001-0000-0000-0000-000000000019', 'Arepa de huevo', 'Doble', '🫓', 7000, 'Arepas'),
  ('b0000001-0000-0000-0000-000000000020', 'Ceviche mixto', 'Porción grande', '🦐', 28000, 'Ceviches'),
  ('c0000002-0000-0000-0000-000000000021', 'Burger clásica', 'Con papas', '🍔', 18000, 'Hamburguesas'),
  ('c0000002-0000-0000-0000-000000000022', 'Empanada de carne', 'Unidad', '🥟', 3500, 'Empanadas'),
  ('c0000002-0000-0000-0000-000000000027', 'Jugo de mango', 'Natural 16oz', '🥤', 6000, 'Jugos');

-- Producto destacado para comercios sin menú
INSERT INTO public.products (business_id, name, description, emoji, price, category)
SELECT b.id,
  CASE b.category
    WHEN 'comida' THEN 'Combo del día'
    WHEN 'farmacia' THEN 'Consulta básica'
    WHEN 'mercado' THEN 'Canasta básica'
    WHEN 'licoreria' THEN 'Sixpack cerveza'
    WHEN 'mascotas' THEN 'Alimento mascota 1kg'
    WHEN 'tecnologia' THEN 'Cable USB-C'
    WHEN 'tiendas' THEN 'Producto destacado'
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
  AND b.is_published = true
  AND b.municipio = 'Apartadó'
  AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.business_id = b.id);

-- Portadas por categoría
UPDATE public.businesses SET cover_url = CASE category
  WHEN 'comida' THEN 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=560&fit=crop&q=88'
  WHEN 'farmacia' THEN 'https://images.unsplash.com/photo-1587854692152-cf660b4c8ea2?w=800&h=560&fit=crop&q=88'
  WHEN 'mercado' THEN 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=560&fit=crop&q=88'
  WHEN 'tecnologia' THEN 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=560&fit=crop&q=88'
  WHEN 'tiendas' THEN 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=560&fit=crop&q=88'
  WHEN 'licoreria' THEN 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=560&fit=crop&q=88'
  WHEN 'mascotas' THEN 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=560&fit=crop&q=88'
  ELSE cover_url
END
WHERE is_published = true AND municipio = 'Apartadó' AND cover_url IS NULL;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;
