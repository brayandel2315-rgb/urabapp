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
