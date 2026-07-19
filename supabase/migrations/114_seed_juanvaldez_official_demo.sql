-- Juan Valdez Plaza del Río Demo — sin DiDi/Rappi
ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  'b1100000-0000-4000-a110-000000000012', 'Juan Valdez Plaza del Río Demo', 'comida',
  'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio.

Cadena de bebidas de café, repostería y bebidas calientes/frías. Sede Plaza del Río (Apartadó). Horarios oficiales CC: Lun–Jue 8am–8pm; Vie–Sáb 8am–9pm; Dom/fest 9am–7pm.
Sede: https://plazadelriocc.com/directorio/juan-valdez-plaza-del-rio/
Web: https://juanvaldez.com',
  '☕', 'Apartadó', 'Villa del Río', 'CC Plaza del Río Local 1177, Carrera 100, Urbanización Villa del Río, Apartadó',
  7.884, -76.629, '08:00'::time, '20:00'::time,
  4000, 12000, 25, 5, 4.7, 120,
  true, true, true, 'approved', NOW(), 'preview-juan-valdez-plaza-del-rio', NULL,
  '/previews/cover-comida.jpg', '/previews/logo-comida.png'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url,
  is_published = true,
  verification_status = 'approved';

DELETE FROM public.products WHERE business_id = 'b1100000-0000-4000-a110-000000000012';

INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES
(
  'a1230000-0000-4000-a112-000000000001', 'b1100000-0000-4000-a110-000000000012', 'Tinto tradicional Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Café negro clásico Juan Valdez',
  '☕', 4900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 0
),
(
  'a1230000-0000-4000-a112-000000000002', 'b1100000-0000-4000-a110-000000000012', 'Americano Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Espresso alargado con agua caliente',
  '☕', 7900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 1
),
(
  'a1230000-0000-4000-a112-000000000003', 'b1100000-0000-4000-a110-000000000012', 'Espresso Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Shot intenso de café',
  '☕', 6900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 2
),
(
  'a1230000-0000-4000-a112-000000000004', 'b1100000-0000-4000-a110-000000000012', 'Capuccino Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Espresso, leche vaporizada y espuma',
  '☕', 10900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 3
),
(
  'a1230000-0000-4000-a112-000000000005', 'b1100000-0000-4000-a110-000000000012', 'Latte Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Espresso con abundante leche vaporizada',
  '☕', 10900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 4
),
(
  'a1230000-0000-4000-a112-000000000006', 'b1100000-0000-4000-a110-000000000012', 'Mocaccino Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Café, chocolate y leche',
  '☕', 12900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 5
),
(
  'a1230000-0000-4000-a112-000000000007', 'b1100000-0000-4000-a110-000000000012', 'Chocolate caliente Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Chocolate cremoso',
  '☕', 9900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 6
),
(
  'a1230000-0000-4000-a112-000000000008', 'b1100000-0000-4000-a110-000000000012', 'Té / Infusión Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Calientes. Selección de infusiones',
  '🍵', 7900, 'Bebidas Calientes', '/previews/p-drink.jpg',
  true, 7
),
(
  'a1230000-0000-4000-a112-000000000009', 'b1100000-0000-4000-a110-000000000012', 'Cold Brew Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Frías. Extracción en frío, suave y refrescante',
  '🧊', 13900, 'Bebidas Frías', '/previews/p-bebidas.jpg',
  true, 8
),
(
  'a1230000-0000-4000-a112-000000000010', 'b1100000-0000-4000-a110-000000000012', 'Frappé clásico Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Frías. Café helado batido',
  '🧊', 14900, 'Bebidas Frías', '/previews/p-bebidas.jpg',
  true, 9
),
(
  'a1230000-0000-4000-a112-000000000011', 'b1100000-0000-4000-a110-000000000012', 'Frappé avellana Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Frías. Café helado sabor avellana',
  '🧊', 15900, 'Bebidas Frías', '/previews/p-bebidas.jpg',
  true, 10
),
(
  'a1230000-0000-4000-a112-000000000012', 'b1100000-0000-4000-a110-000000000012', 'Latte helado Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Frías. Espresso con leche fría y hielo',
  '🧊', 12900, 'Bebidas Frías', '/previews/p-bebidas.jpg',
  true, 11
),
(
  'a1230000-0000-4000-a112-000000000013', 'b1100000-0000-4000-a110-000000000012', 'Granizado de café Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Frías. Café granizado',
  '🧊', 13900, 'Bebidas Frías', '/previews/p-bebidas.jpg',
  true, 12
),
(
  'a1230000-0000-4000-a112-000000000014', 'b1100000-0000-4000-a110-000000000012', 'Limonada de café Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Bebidas Frías. Refrescante con toque de café',
  '🍋', 11900, 'Bebidas Frías', '/previews/p-bebidas.jpg',
  true, 13
),
(
  'a1230000-0000-4000-a112-000000000015', 'b1100000-0000-4000-a110-000000000012', 'Capuccino dulce de leche Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Sabores vitales. Capuccino con dulce de leche',
  '☕', 13900, 'Sabores vitales', '/previews/p-drink.jpg',
  true, 14
),
(
  'a1230000-0000-4000-a112-000000000016', 'b1100000-0000-4000-a110-000000000012', 'Latte mocca Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Sabores vitales. Latte con chocolate',
  '☕', 13900, 'Sabores vitales', '/previews/p-drink.jpg',
  true, 15
),
(
  'a1230000-0000-4000-a112-000000000017', 'b1100000-0000-4000-a110-000000000012', 'Affogato caramelo Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Sabores vitales. Helado con espresso y caramelo',
  '🍨', 15900, 'Sabores vitales', '/previews/p-combos.jpg',
  true, 16
),
(
  'a1230000-0000-4000-a112-000000000018', 'b1100000-0000-4000-a110-000000000012', 'Croissant Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Pastelería / Desayunos. Hojaldre mantequilla',
  '🥐', 6900, 'Pastelería / Desayunos', '/previews/p-despensa.jpg',
  true, 17
),
(
  'a1230000-0000-4000-a112-000000000019', 'b1100000-0000-4000-a110-000000000012', 'Muffin Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Pastelería / Desayunos. Muffin del día',
  '🧁', 7900, 'Pastelería / Desayunos', '/previews/p-combos.jpg',
  true, 18
),
(
  'a1230000-0000-4000-a112-000000000020', 'b1100000-0000-4000-a110-000000000012', 'Brownie Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Pastelería / Desayunos. Brownie de chocolate',
  '🍫', 8900, 'Pastelería / Desayunos', '/previews/p-combos.jpg',
  true, 19
),
(
  'a1230000-0000-4000-a112-000000000021', 'b1100000-0000-4000-a110-000000000012', 'Galleta Juan Valdez Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Pastelería / Desayunos. Galleta acompañante',
  '🍪', 4900, 'Pastelería / Desayunos', '/previews/p-despensa.jpg',
  true, 20
),
(
  'a1230000-0000-4000-a112-000000000022', 'b1100000-0000-4000-a110-000000000012', 'Sandwich desayuno Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Pastelería / Desayunos. Pan, huevo y queso',
  '🥪', 14900, 'Pastelería / Desayunos', '/previews/p-combos.jpg',
  true, 21
),
(
  'a1230000-0000-4000-a112-000000000023', 'b1100000-0000-4000-a110-000000000012', 'Bowl avena Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Pastelería / Desayunos. Avena con frutas',
  '🥣', 12900, 'Pastelería / Desayunos', '/previews/p-frescos.jpg',
  true, 22
),
(
  'a1230000-0000-4000-a112-000000000024', 'b1100000-0000-4000-a110-000000000012', 'Shot espresso extra Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Adiciones. Adición de espresso',
  '➕', 3000, 'Adiciones', '/previews/p-default.jpg',
  true, 23
),
(
  'a1230000-0000-4000-a112-000000000025', 'b1100000-0000-4000-a110-000000000012', 'Leche vegetal Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Adiciones. Sustitución leche vegetal',
  '➕', 2500, 'Adiciones', '/previews/p-lacteos.jpg',
  true, 24
),
(
  'a1230000-0000-4000-a112-000000000026', 'b1100000-0000-4000-a110-000000000012', 'Sirope sabor Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Adiciones. Vainilla / caramelo / avellana',
  '➕', 2000, 'Adiciones', '/previews/p-default.jpg',
  true, 25
),
(
  'a1230000-0000-4000-a112-000000000027', 'b1100000-0000-4000-a110-000000000012', 'Crema batida Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Adiciones. Topping',
  '➕', 2000, 'Adiciones', '/previews/p-default.jpg',
  true, 26
),
(
  'a1230000-0000-4000-a112-000000000028', 'b1100000-0000-4000-a110-000000000012', 'Café Premium Colina 454gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Perfil de taza balanceado — retail oficial',
  '☕', 49900, 'Café empacado', '/previews/p-drink.jpg',
  true, 27
),
(
  'a1230000-0000-4000-a112-000000000029', 'b1100000-0000-4000-a110-000000000012', 'Café Premium Volcán 454gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Perfil de taza fuerte — retail oficial',
  '☕', 49900, 'Café empacado', '/previews/p-drink.jpg',
  true, 28
),
(
  'a1230000-0000-4000-a112-000000000030', 'b1100000-0000-4000-a110-000000000012', 'Café Premium Cumbre 454gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Perfil de taza fuerte — retail oficial',
  '☕', 49900, 'Café empacado', '/previews/p-drink.jpg',
  true, 29
),
(
  'a1230000-0000-4000-a112-000000000031', 'b1100000-0000-4000-a110-000000000012', 'Café Origen Sierra Nevada 454gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Café de origen — retail oficial',
  '☕', 67900, 'Café empacado', '/previews/p-drink.jpg',
  true, 30
),
(
  'a1230000-0000-4000-a112-000000000032', 'b1100000-0000-4000-a110-000000000012', 'Café Mujeres Cafeteras Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Edición especial mujeres cafeteras',
  '☕', 59900, 'Café empacado', '/previews/p-drink.jpg',
  true, 31
),
(
  'a1230000-0000-4000-a112-000000000033', 'b1100000-0000-4000-a110-000000000012', 'Café Liofilizado Dulce de Leche 95gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Soluble sabor dulce de leche',
  '☕', 35900, 'Café empacado', '/previews/p-drink.jpg',
  true, 32
),
(
  'a1230000-0000-4000-a112-000000000034', 'b1100000-0000-4000-a110-000000000012', 'Café Liofilizado Chocolate 95gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Soluble sabor chocolate',
  '☕', 35900, 'Café empacado', '/previews/p-drink.jpg',
  true, 33
),
(
  'a1230000-0000-4000-a112-000000000035', 'b1100000-0000-4000-a110-000000000012', 'Café Liofilizado Vanicanela 95gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Soluble vainilla-canela',
  '☕', 35900, 'Café empacado', '/previews/p-drink.jpg',
  true, 34
),
(
  'a1230000-0000-4000-a112-000000000036', 'b1100000-0000-4000-a110-000000000012', 'Café Liofilizado Descafeinado 95gr Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Soluble descafeinado',
  '☕', 35900, 'Café empacado', '/previews/p-drink.jpg',
  true, 35
),
(
  'a1230000-0000-4000-a112-000000000037', 'b1100000-0000-4000-a110-000000000012', 'Termo Montañas Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Artículos de marca. Termo artículos de marca',
  '🧴', 99000, 'Artículos de marca', '/previews/p-default.jpg',
  true, 36
),
(
  'a1230000-0000-4000-a112-000000000038', 'b1100000-0000-4000-a110-000000000012', 'Prensa Francesa Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Accesorios. Método de preparación',
  '☕', 89000, 'Accesorios', '/previews/p-default.jpg',
  true, 37
),
(
  'a1230000-0000-4000-a112-000000000039', 'b1100000-0000-4000-a110-000000000012', 'Café Drip monodosis Demo', 'Demo UrabApp — perfil de onboarding Juan Valdez. Menú de cafetería basado en categorías oficiales de juanvaldez.com; retail desde tiendajuanvaldez.com. No proviene de DiDi ni Rappi. Información final sujeta a aprobación del comercio. Categoría oficial menú: Café empacado. Monodosis para preparar en cualquier lugar',
  '☕', 24900, 'Café empacado', '/previews/p-drink.jpg',
  true, 38
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_available = true;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;