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
