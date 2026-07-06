-- Imágenes realistas por negocio/producto + personalización de pedidos (comida)

-- Portadas específicas por slug (producción Apartadó + legacy)
UPDATE public.businesses b SET cover_url = v.cover
FROM (VALUES
  ('asados-el-prado', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=560&fit=crop&q=90&auto=format'),
  ('pizza-roma', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=560&fit=crop&q=90&auto=format'),
  ('cafe-la-parada', 'https://images.unsplash.com/photo-1495474473867-e4fbf7ef9f2d?w=800&h=560&fit=crop&q=90&auto=format'),
  ('polleria-el-corral', 'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=800&h=560&fit=crop&q=90&auto=format'),
  ('sushi-wok', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=560&fit=crop&q=90&auto=format'),
  ('heladeria-polar', 'https://images.unsplash.com/photo-1563805044264-3e1b5491a7b5?w=800&h=560&fit=crop&q=90&auto=format'),
  ('drogueria-el-ahorro', 'https://images.unsplash.com/photo-1576602975982-48f9fb0b5315?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tienda-don-pedro', 'https://images.unsplash.com/photo-1578911373274-32fc53d2a369?w=800&h=560&fit=crop&q=90&auto=format'),
  ('panaderia-san-jose', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=560&fit=crop&q=90&auto=format'),
  ('frutas-el-campo', 'https://images.unsplash.com/photo-1610831308542-7b1b7bdfc4fd?w=800&h=560&fit=crop&q=90&auto=format'),
  ('papeleria-estudiantil', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tecnouraba', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mascotas-felices', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=560&fit=crop&q=90&auto=format'),
  ('licores-centro', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=560&fit=crop&q=90&auto=format'),
  ('arepas-dona-rosa', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Arepa_con_queso.jpg/800px-Arepa_con_queso.jpg'),
  ('cevicheria-el-mar', 'https://images.unsplash.com/photo-1565680018434-b75d4c4d0474?w=800&h=560&fit=crop&q=90&auto=format'),
  ('burger-urban', 'https://images.unsplash.com/photo-1568901340865-4c42c4bd3921?w=800&h=560&fit=crop&q=90&auto=format'),
  ('empanadas-el-rincon', 'https://images.unsplash.com/photo-1626700051175-6814f7d4b03b?w=800&h=560&fit=crop&q=90&auto=format'),
  ('tacos-mexico', 'https://images.unsplash.com/photo-1565299585323-3814c0c0b44c?w=800&h=560&fit=crop&q=90&auto=format'),
  ('jugos-naturales', 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=800&h=560&fit=crop&q=90&auto=format'),
  ('drogueria-salud-total', 'https://images.unsplash.com/photo-1587854692152-cf660b4c8ea2?w=800&h=560&fit=crop&q=90&auto=format'),
  ('farmacia-del-pueblo', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=560&fit=crop&q=90&auto=format'),
  ('farmacia-san-rafael', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=560&fit=crop&q=90&auto=format'),
  ('restaurante-el-bananero', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg'),
  ('supermercado-el-ahorro', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&h=560&fit=crop&q=90&auto=format'),
  ('mecato-la-esquina', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=560&fit=crop&q=90&auto=format')
) AS v(slug, cover)
WHERE b.slug = v.slug AND b.is_active = true;

-- Imágenes de producto por nombre / emoji
UPDATE public.products SET image_url = CASE
  WHEN name ILIKE '%picada%' OR name ILIKE '%asado%' THEN 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%pizza%' OR emoji = '🍕' THEN 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%café%' OR name ILIKE '%cafe%' OR name ILIKE '%pandebono%' OR emoji = '☕' THEN 'https://images.unsplash.com/photo-1495474473867-e4fbf7ef9f2d?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%broaster%' OR name ILIKE '%pollo%' OR emoji = '🍗' THEN 'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%arepa%' OR emoji = '🫓' THEN 'https://images.unsplash.com/photo-1590301157894-861180ed07b7?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%ceviche%' OR emoji = '🦐' THEN 'https://images.unsplash.com/photo-1565680018434-b75d4c4d0474?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%burger%' OR name ILIKE '%hamburg%' OR emoji = '🍔' THEN 'https://images.unsplash.com/photo-1568901340865-4c42c4bd3921?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%empanada%' OR emoji = '🥟' THEN 'https://images.unsplash.com/photo-1626700051175-6814f7d4b03b?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%jugo%' OR name ILIKE '%batido%' OR emoji = '🥤' THEN 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%helado%' OR name ILIKE '%sundae%' OR emoji = '🍦' THEN 'https://images.unsplash.com/photo-1497034824048-ba4db4de4c83?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%sushi%' OR name ILIKE '%wok%' OR emoji = '🍣' THEN 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%taco%' OR emoji = '🌮' THEN 'https://images.unsplash.com/photo-1565299585323-3814c0c0b44c?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%combo%' OR emoji = '🍽️' THEN 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%acetamin%' OR name ILIKE '%medic%' OR name ILIKE '%consulta%' OR emoji = '💊' THEN 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%canasta%' OR name ILIKE '%abarrote%' OR emoji = '🛒' THEN 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%pan %' OR name ILIKE '%panader%' OR emoji = '🥖' THEN 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%fruta%' OR name ILIKE '%verdura%' OR emoji = '🍎' THEN 'https://images.unsplash.com/photo-1610831308542-7b1b7bdfc4fd?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%cerveza%' OR name ILIKE '%sixpack%' OR emoji = '🍺' THEN 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%mascota%' OR name ILIKE '%alimento%' OR emoji = '🐾' THEN 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%cable%' OR name ILIKE '%usb%' OR emoji = '📱' THEN 'https://images.unsplash.com/photo-1468495240123-6ed6d9600500?w=400&h=400&fit=crop&q=90&auto=format'
  WHEN name ILIKE '%papeler%' OR name ILIKE '%útiles%' OR name ILIKE '%utiles%' OR emoji = '📚' THEN 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop&q=90&auto=format'
  ELSE image_url
END
WHERE is_available = true;

-- Productos genéricos: imagen según el negocio
UPDATE public.products p SET image_url = v.img
FROM public.businesses b,
(VALUES
  ('heladeria-polar', 'https://images.unsplash.com/photo-1497034824048-ba4db4de4c83?w=400&h=400&fit=crop&q=90&auto=format'),
  ('sushi-wok', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=400&fit=crop&q=90&auto=format'),
  ('tacos-mexico', 'https://images.unsplash.com/photo-1565299585323-3814c0c0b44c?w=400&h=400&fit=crop&q=90&auto=format'),
  ('asados-el-prado', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop&q=90&auto=format'),
  ('polleria-el-corral', 'https://images.unsplash.com/photo-1626082927389-6c245bec07ff?w=400&h=400&fit=crop&q=90&auto=format'),
  ('pizza-roma', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop&q=90&auto=format'),
  ('cafe-la-parada', 'https://images.unsplash.com/photo-1495474473867-e4fbf7ef9f2d?w=400&h=400&fit=crop&q=90&auto=format'),
  ('burger-urban', 'https://images.unsplash.com/photo-1568901340865-4c42c4bd3921?w=400&h=400&fit=crop&q=90&auto=format'),
  ('empanadas-el-rincon', 'https://images.unsplash.com/photo-1626700051175-6814f7d4b03b?w=400&h=400&fit=crop&q=90&auto=format'),
  ('arepas-dona-rosa', 'https://images.unsplash.com/photo-1590301157894-861180ed07b7?w=400&h=400&fit=crop&q=90&auto=format'),
  ('cevicheria-el-mar', 'https://images.unsplash.com/photo-1565680018434-b75d4c4d0474?w=400&h=400&fit=crop&q=90&auto=format'),
  ('jugos-naturales', 'https://images.unsplash.com/photo-1622597467836-fbc3f3586384?w=400&h=400&fit=crop&q=90&auto=format'),
  ('drogueria-el-ahorro', 'https://images.unsplash.com/photo-1576602975982-48f9fb0b5315?w=400&h=400&fit=crop&q=90&auto=format'),
  ('drogueria-salud-total', 'https://images.unsplash.com/photo-1587854692152-cf660b4c8ea2?w=400&h=400&fit=crop&q=90&auto=format'),
  ('farmacia-del-pueblo', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop&q=90&auto=format'),
  ('tienda-don-pedro', 'https://images.unsplash.com/photo-1578911373274-32fc53d2a369?w=400&h=400&fit=crop&q=90&auto=format'),
  ('panaderia-san-jose', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&q=90&auto=format'),
  ('frutas-el-campo', 'https://images.unsplash.com/photo-1610831308542-7b1b7bdfc4fd?w=400&h=400&fit=crop&q=90&auto=format'),
  ('papeleria-estudiantil', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=400&fit=crop&q=90&auto=format'),
  ('tecnouraba', 'https://images.unsplash.com/photo-1468495240123-6ed6d9600500?w=400&h=400&fit=crop&q=90&auto=format'),
  ('mascotas-felices', 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop&q=90&auto=format'),
  ('licores-centro', 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop&q=90&auto=format')
) AS v(slug, img)
WHERE p.business_id = b.id
  AND b.slug = v.slug
  AND p.is_available = true
  AND (
    p.name ILIKE '%combo%'
    OR p.name ILIKE '%destacado%'
    OR p.name ILIKE '%consulta%'
    OR p.name ILIKE '%canasta%'
    OR p.emoji IN ('⭐', '🍽️', '🛒', '💊', '🍺', '🐾', '📱', '📚')
  );

-- Comida: abrir personalizador (adiciones + bebidas)
UPDATE public.products p SET requires_customization = true
FROM public.businesses b
WHERE p.business_id = b.id
  AND b.category = 'comida'
  AND p.is_available = true
  AND NOT (
    COALESCE(p.category, '') ILIKE '%jugo%'
    OR p.name ILIKE '%jugo%'
    OR p.name ILIKE '%batido%'
  );
