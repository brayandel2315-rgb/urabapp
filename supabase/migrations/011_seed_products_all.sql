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
