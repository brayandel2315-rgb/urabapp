-- Onboarding PREVIEW storefronts — marcas con presencia en Urabá
-- Catálogos demo originales. NO contiene assets de Rappi u otros marketplaces.

ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES
(
  'b1100000-0000-4000-a110-000000000001', 'Éxito Plaza del Río · Preview UrabApp', 'mercado', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Hipermercado de referencia en Plaza del Río. Esta vitrina UrabApp es un preview de onboarding para activar domicilios locales.

Sitio oficial: https://www.exito.com', '🛒',
  'Apartadó', 'Villa del Río', 'CC Plaza del Río, Calle 103 con Carrera 100, Apartadó',
  7.8845, -76.6295, '08:00'::time, '21:00'::time,
  5000, 25000, 45, 5, 4.6, 87,
  true, true, true, 'approved', NOW(), 'preview-exito-plaza-del-rio', NULL, '/previews/cover-mercado.jpg', '/previews/logo-mercado.png'
),
(
  'b1100000-0000-4000-a110-000000000002', 'Éxito Carepa · Preview UrabApp', 'mercado', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Sede Éxito en Carepa. Preview UrabApp para presentar la operación de última milla en el municipio.

Sitio oficial: https://www.exito.com', '🛒',
  'Carepa', 'Centro', 'Carrera 80 # 68-40, CC Las Playas, Carepa',
  7.7588, -76.6542, '08:00'::time, '21:00'::time,
  5000, 25000, 40, 5, 4.5, 94,
  true, true, true, 'approved', NOW(), 'preview-exito-carepa', NULL, '/previews/cover-mercado.jpg', '/previews/logo-mercado.png'
),
(
  'b1100000-0000-4000-a110-000000000003', 'Olímpica CC Nuestro · Preview UrabApp', 'mercado', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Supermercado Olímpica en CC Nuestro. Vitrina demo para onboarding comercial UrabApp.

Sitio oficial: https://www.olimpica.com', '🛒',
  'Apartadó', 'Centro', 'Centro Comercial Nuestro, Apartadó',
  7.8832, -76.6268, '08:00'::time, '21:00'::time,
  4500, 22000, 40, 5, 4.5, 101,
  true, true, true, 'approved', NOW(), 'preview-olimpica-cc-nuestro', NULL, '/previews/cover-mercado.jpg', '/previews/logo-mercado.png'
),
(
  'b1100000-0000-4000-a110-000000000004', 'Tiendas D1 Apartadó · Preview UrabApp', 'mercado', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Formato hard-discount D1. Preview de catálogo demo para mostrar el potencial de pedidos rápidos en Urabá.

Sitio oficial: https://www.tiendasd1.com', '🏪',
  'Apartadó', 'Centro', 'Carrera 100 # 94-21, Apartadó',
  7.882, -76.628, '08:00'::time, '20:00'::time,
  4000, 15000, 30, 5, 4.4, 108,
  true, true, true, 'approved', NOW(), 'preview-tiendas-d1-apartado', NULL, '/previews/cover-mercado.jpg', '/previews/logo-mercado.png'
),
(
  'b1100000-0000-4000-a110-000000000005', 'Cruz Verde Plaza del Río · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Droguería Cruz Verde en Plaza del Río. Preview OTC/cuidado personal para onboarding (sin medicamentos con fórmula).

Sitio oficial: https://www.cruzverde.com.co', '💊',
  'Apartadó', 'Villa del Río', 'CC Plaza del Río Local 1129, Calle 99C # 100-117, Apartadó',
  7.8842, -76.6292, '08:00'::time, '19:00'::time,
  4000, 12000, 25, 5, 4.7, 115,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-plaza-del-rio', NULL, '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
),
(
  'b1100000-0000-4000-a110-000000000006', 'Cruz Verde Nuevo Apartadó · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Sede Cruz Verde / Medicarte en Nuevo Apartadó. Vitrina demo UrabApp para domicilio de cuidado OTC.

Sitio oficial: https://www.cruzverde.com.co', '💊',
  'Apartadó', 'Nuevo Apartadó', 'Calle 95 # 105-36, Barrio Nuevo Apartadó',
  7.8785, -76.6325, '06:30'::time, '21:00'::time,
  4000, 12000, 25, 5, 4.6, 122,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-nuevo-apartado', '6048282324', '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
),
(
  'b1100000-0000-4000-a110-000000000007', 'Cruz Verde Turbo · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Presencia Cruz Verde en Turbo. Preview de onboarding para activar domicilio farmacéutico local.

Sitio oficial: https://www.cruzverde.com.co', '💊',
  'Turbo', 'Centro', 'Carrera 13 con Calle 101, Turbo',
  8.092, -76.7285, '07:00'::time, '20:00'::time,
  4500, 12000, 30, 5, 4.5, 129,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-turbo', '6048272068', '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
),
(
  'b1100000-0000-4000-a110-000000000008', 'Cruz Verde Chigorodó · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Sede Chigorodó. Vitrina demo para conversaciones comerciales UrabApp.

Sitio oficial: https://www.cruzverde.com.co', '💊',
  'Chigorodó', 'Centro', 'Carrera 100 # 96A-15, Chigorodó',
  7.6698, -76.6815, '07:00'::time, '20:00'::time,
  4500, 12000, 30, 5, 4.5, 136,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-chigorodo', NULL, '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
),
(
  'b1100000-0000-4000-a110-000000000009', 'Cruz Verde Carepa · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Cobertura Carepa. Preview UrabApp orientado a onboarding de droguería.

Sitio oficial: https://www.cruzverde.com.co', '💊',
  'Carepa', 'Centro', 'Carepa, Antioquia (sede Botica Junín / Medicarte)',
  7.7585, -76.6555, '07:00'::time, '20:00'::time,
  4500, 12000, 30, 5, 4.5, 143,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-carepa', NULL, '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
),
(
  'b1100000-0000-4000-a110-000000000010', 'Supermercado Los Ibañez · Preview UrabApp', 'mercado', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Supermercado local de Urabá. Preview de vitrina para invitar al comercio a operar domicilios en UrabApp.', '🛒',
  'Apartadó', 'Centro', 'Calle 99 # 102-55, Apartadó',
  7.8828, -76.6272, '07:00'::time, '20:00'::time,
  4500, 18000, 35, 5, 4.6, 150,
  true, true, true, 'approved', NOW(), 'preview-supermercado-los-ibanez', '6048280287', '/previews/cover-mercado.jpg', '/previews/logo-mercado.png'
),
(
  'b1100000-0000-4000-a110-000000000011', 'Asadero Riko Pollo · Preview UrabApp', 'comida', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Asadero local referenciado en directorios de Urabá. Catálogo demo original para reunión comercial.', '🍗',
  'Apartadó', 'Apartadó', 'Apartadó, Antioquia',
  7.8815, -76.626, '10:00'::time, '21:00'::time,
  5000, 15000, 30, 5, 4.7, 157,
  true, true, true, 'approved', NOW(), 'preview-asadero-riko-pollo', NULL, '/previews/cover-comida.jpg', '/previews/logo-comida.png'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_published = true,
  verification_status = 'approved',
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url,
  delivery_radius_km = EXCLUDED.delivery_radius_km,
  phone = COALESCE(EXCLUDED.phone, public.businesses.phone);

INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES
(
  'a1100000-0000-4000-a101-000000000001', 'b1100000-0000-4000-a110-000000000001', 'Canasta fresca demo', 'Selección de frutas y verduras de temporada (muestra). Preview creado por UrabApp para onboarding comercial.', '🥬',
  18900, 'Frescos', '/previews/p-frescos.jpg', true, 0
),
(
  'a1100000-0000-4000-a101-000000000002', 'b1100000-0000-4000-a110-000000000001', 'Huevos AA x12 demo', 'Cartón demostración. Preview creado por UrabApp para onboarding comercial.', '🥚',
  12900, 'Lácteos', '/previews/p-lacteos.jpg', true, 1
),
(
  'a1100000-0000-4000-a101-000000000003', 'b1100000-0000-4000-a110-000000000001', 'Leche 1L demo', 'UHT demostración. Preview creado por UrabApp para onboarding comercial.', '🥛',
  5900, 'Lácteos', '/previews/p-lacteos.jpg', true, 2
),
(
  'a1100000-0000-4000-a101-000000000004', 'b1100000-0000-4000-a110-000000000001', 'Arroz 1kg demo', 'Presentación muestra. Preview creado por UrabApp para onboarding comercial.', '🍚',
  4900, 'Despensa', '/previews/p-despensa.jpg', true, 3
),
(
  'a1100000-0000-4000-a101-000000000005', 'b1100000-0000-4000-a110-000000000001', 'Aceite 1L demo', 'Vegetal — catálogo demo. Preview creado por UrabApp para onboarding comercial.', '🫒',
  12900, 'Despensa', '/previews/p-despensa.jpg', true, 4
),
(
  'a1100000-0000-4000-a101-000000000006', 'b1100000-0000-4000-a110-000000000001', 'Café molido 250g demo', 'Tueste medio demo. Preview creado por UrabApp para onboarding comercial.', '☕',
  11900, 'Despensa', '/previews/p-despensa.jpg', true, 5
),
(
  'a1100000-0000-4000-a101-000000000007', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado demo', 'Bolsa muestra. Preview creado por UrabApp para onboarding comercial.', '🍞',
  6200, 'Panadería', '/previews/p-despensa.jpg', true, 6
),
(
  'a1100000-0000-4000-a101-000000000008', 'b1100000-0000-4000-a110-000000000001', 'Pollo entero demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🍗',
  18900, 'Carnes', '/previews/p-pollo.jpg', true, 7
),
(
  'a1100000-0000-4000-a101-000000000009', 'b1100000-0000-4000-a110-000000000001', 'Carne molida 500g demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🥩',
  14900, 'Carnes', '/previews/p-pollo.jpg', true, 8
),
(
  'a1100000-0000-4000-a101-000000000010', 'b1100000-0000-4000-a110-000000000001', 'Detergente 1kg demo', 'Aseo hogar. Preview creado por UrabApp para onboarding comercial.', '🧺',
  12900, 'Aseo', '/previews/p-aseo.jpg', true, 9
),
(
  'a1100000-0000-4000-a101-000000000011', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico x4 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '🧻',
  10900, 'Aseo', '/previews/p-aseo.jpg', true, 10
),
(
  'a1100000-0000-4000-a101-000000000012', 'b1100000-0000-4000-a110-000000000001', 'Jabón líquido demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '🧴',
  7900, 'Cuidado', '/previews/p-cuidado.jpg', true, 11
),
(
  'a1100000-0000-4000-a101-000000000013', 'b1100000-0000-4000-a110-000000000001', 'Pañales etapa 3 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '👶',
  24900, 'Bebé', '/previews/p-cuidado.jpg', true, 12
),
(
  'a1100000-0000-4000-a101-000000000014', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa 1.5L demo', 'Bebida. Preview creado por UrabApp para onboarding comercial.', '🥤',
  7200, 'Bebidas', '/previews/p-bebidas.jpg', true, 13
),
(
  'a1100000-0000-4000-a101-000000000015', 'b1100000-0000-4000-a110-000000000001', 'Agua 6L demo', 'Bidón. Preview creado por UrabApp para onboarding comercial.', '💧',
  8200, 'Bebidas', '/previews/p-bebidas.jpg', true, 14
),
(
  'a1100000-0000-4000-a101-000000000016', 'b1100000-0000-4000-a110-000000000001', 'Snack papas demo', 'Bolsa. Preview creado por UrabApp para onboarding comercial.', '🥔',
  5900, 'Snacks', '/previews/p-combos.jpg', true, 15
),
(
  'a1100000-0000-4000-a101-000000000017', 'b1100000-0000-4000-a110-000000000001', 'Combo mercado día', 'Canasta + leche + pan (demo). Preview creado por UrabApp para onboarding comercial.', '🍱',
  34900, 'Combos', '/previews/p-combos.jpg', true, 16
),
(
  'a1100000-0000-4000-a101-000000000018', 'b1100000-0000-4000-a110-000000000001', 'Combo aseo', 'Detergente + papel + jabón (demo). Preview creado por UrabApp para onboarding comercial.', '🧼',
  28900, 'Combos', '/previews/p-combos.jpg', true, 17
),
(
  'a1100000-0000-4000-a101-000000000019', 'b1100000-0000-4000-a110-000000000001', 'Oferta fin de semana demo', 'Selección promocional muestra. Preview creado por UrabApp para onboarding comercial.', '🏷️',
  15900, 'Ofertas', '/previews/p-combos.jpg', true, 18
),
(
  'a1100000-0000-4000-a101-000000000020', 'b1100000-0000-4000-a110-000000000001', 'Fruta picada demo', 'Porción lista. Preview creado por UrabApp para onboarding comercial.', '🍓',
  8900, 'Frescos', '/previews/p-frescos.jpg', true, 19
),
(
  'a1100000-0000-4000-a102-000000000001', 'b1100000-0000-4000-a110-000000000002', 'Canasta fresca demo', 'Selección de frutas y verduras de temporada (muestra). Preview creado por UrabApp para onboarding comercial.', '🥬',
  18900, 'Frescos', '/previews/p-frescos.jpg', true, 20
),
(
  'a1100000-0000-4000-a102-000000000002', 'b1100000-0000-4000-a110-000000000002', 'Huevos AA x12 demo', 'Cartón demostración. Preview creado por UrabApp para onboarding comercial.', '🥚',
  12900, 'Lácteos', '/previews/p-lacteos.jpg', true, 21
),
(
  'a1100000-0000-4000-a102-000000000003', 'b1100000-0000-4000-a110-000000000002', 'Leche 1L demo', 'UHT demostración. Preview creado por UrabApp para onboarding comercial.', '🥛',
  5900, 'Lácteos', '/previews/p-lacteos.jpg', true, 22
),
(
  'a1100000-0000-4000-a102-000000000004', 'b1100000-0000-4000-a110-000000000002', 'Arroz 1kg demo', 'Presentación muestra. Preview creado por UrabApp para onboarding comercial.', '🍚',
  4900, 'Despensa', '/previews/p-despensa.jpg', true, 23
),
(
  'a1100000-0000-4000-a102-000000000005', 'b1100000-0000-4000-a110-000000000002', 'Aceite 1L demo', 'Vegetal — catálogo demo. Preview creado por UrabApp para onboarding comercial.', '🫒',
  12900, 'Despensa', '/previews/p-despensa.jpg', true, 24
),
(
  'a1100000-0000-4000-a102-000000000006', 'b1100000-0000-4000-a110-000000000002', 'Café molido 250g demo', 'Tueste medio demo. Preview creado por UrabApp para onboarding comercial.', '☕',
  11900, 'Despensa', '/previews/p-despensa.jpg', true, 25
),
(
  'a1100000-0000-4000-a102-000000000007', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado demo', 'Bolsa muestra. Preview creado por UrabApp para onboarding comercial.', '🍞',
  6200, 'Panadería', '/previews/p-despensa.jpg', true, 26
),
(
  'a1100000-0000-4000-a102-000000000008', 'b1100000-0000-4000-a110-000000000002', 'Pollo entero demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🍗',
  18900, 'Carnes', '/previews/p-pollo.jpg', true, 27
),
(
  'a1100000-0000-4000-a102-000000000009', 'b1100000-0000-4000-a110-000000000002', 'Carne molida 500g demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🥩',
  14900, 'Carnes', '/previews/p-pollo.jpg', true, 28
),
(
  'a1100000-0000-4000-a102-000000000010', 'b1100000-0000-4000-a110-000000000002', 'Detergente 1kg demo', 'Aseo hogar. Preview creado por UrabApp para onboarding comercial.', '🧺',
  12900, 'Aseo', '/previews/p-aseo.jpg', true, 29
),
(
  'a1100000-0000-4000-a102-000000000011', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico x4 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '🧻',
  10900, 'Aseo', '/previews/p-aseo.jpg', true, 30
),
(
  'a1100000-0000-4000-a102-000000000012', 'b1100000-0000-4000-a110-000000000002', 'Jabón líquido demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '🧴',
  7900, 'Cuidado', '/previews/p-cuidado.jpg', true, 31
),
(
  'a1100000-0000-4000-a102-000000000013', 'b1100000-0000-4000-a110-000000000002', 'Pañales etapa 3 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '👶',
  24900, 'Bebé', '/previews/p-cuidado.jpg', true, 32
),
(
  'a1100000-0000-4000-a102-000000000014', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa 1.5L demo', 'Bebida. Preview creado por UrabApp para onboarding comercial.', '🥤',
  7200, 'Bebidas', '/previews/p-bebidas.jpg', true, 33
),
(
  'a1100000-0000-4000-a102-000000000015', 'b1100000-0000-4000-a110-000000000002', 'Agua 6L demo', 'Bidón. Preview creado por UrabApp para onboarding comercial.', '💧',
  8200, 'Bebidas', '/previews/p-bebidas.jpg', true, 34
),
(
  'a1100000-0000-4000-a102-000000000016', 'b1100000-0000-4000-a110-000000000002', 'Snack papas demo', 'Bolsa. Preview creado por UrabApp para onboarding comercial.', '🥔',
  5900, 'Snacks', '/previews/p-combos.jpg', true, 35
),
(
  'a1100000-0000-4000-a102-000000000017', 'b1100000-0000-4000-a110-000000000002', 'Combo mercado día', 'Canasta + leche + pan (demo). Preview creado por UrabApp para onboarding comercial.', '🍱',
  34900, 'Combos', '/previews/p-combos.jpg', true, 36
),
(
  'a1100000-0000-4000-a102-000000000018', 'b1100000-0000-4000-a110-000000000002', 'Combo aseo', 'Detergente + papel + jabón (demo). Preview creado por UrabApp para onboarding comercial.', '🧼',
  28900, 'Combos', '/previews/p-combos.jpg', true, 37
),
(
  'a1100000-0000-4000-a102-000000000019', 'b1100000-0000-4000-a110-000000000002', 'Oferta fin de semana demo', 'Selección promocional muestra. Preview creado por UrabApp para onboarding comercial.', '🏷️',
  15900, 'Ofertas', '/previews/p-combos.jpg', true, 38
),
(
  'a1100000-0000-4000-a102-000000000020', 'b1100000-0000-4000-a110-000000000002', 'Fruta picada demo', 'Porción lista. Preview creado por UrabApp para onboarding comercial.', '🍓',
  8900, 'Frescos', '/previews/p-frescos.jpg', true, 39
),
(
  'a1100000-0000-4000-a103-000000000001', 'b1100000-0000-4000-a110-000000000003', 'Canasta fresca demo', 'Selección de frutas y verduras de temporada (muestra). Preview creado por UrabApp para onboarding comercial.', '🥬',
  18900, 'Frescos', '/previews/p-frescos.jpg', true, 40
),
(
  'a1100000-0000-4000-a103-000000000002', 'b1100000-0000-4000-a110-000000000003', 'Huevos AA x12 demo', 'Cartón demostración. Preview creado por UrabApp para onboarding comercial.', '🥚',
  12900, 'Lácteos', '/previews/p-lacteos.jpg', true, 41
),
(
  'a1100000-0000-4000-a103-000000000003', 'b1100000-0000-4000-a110-000000000003', 'Leche 1L demo', 'UHT demostración. Preview creado por UrabApp para onboarding comercial.', '🥛',
  5900, 'Lácteos', '/previews/p-lacteos.jpg', true, 42
),
(
  'a1100000-0000-4000-a103-000000000004', 'b1100000-0000-4000-a110-000000000003', 'Arroz 1kg demo', 'Presentación muestra. Preview creado por UrabApp para onboarding comercial.', '🍚',
  4900, 'Despensa', '/previews/p-despensa.jpg', true, 43
),
(
  'a1100000-0000-4000-a103-000000000005', 'b1100000-0000-4000-a110-000000000003', 'Aceite 1L demo', 'Vegetal — catálogo demo. Preview creado por UrabApp para onboarding comercial.', '🫒',
  12900, 'Despensa', '/previews/p-despensa.jpg', true, 44
),
(
  'a1100000-0000-4000-a103-000000000006', 'b1100000-0000-4000-a110-000000000003', 'Café molido 250g demo', 'Tueste medio demo. Preview creado por UrabApp para onboarding comercial.', '☕',
  11900, 'Despensa', '/previews/p-despensa.jpg', true, 45
),
(
  'a1100000-0000-4000-a103-000000000007', 'b1100000-0000-4000-a110-000000000003', 'Pan tajado demo', 'Bolsa muestra. Preview creado por UrabApp para onboarding comercial.', '🍞',
  6200, 'Panadería', '/previews/p-despensa.jpg', true, 46
),
(
  'a1100000-0000-4000-a103-000000000008', 'b1100000-0000-4000-a110-000000000003', 'Pollo entero demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🍗',
  18900, 'Carnes', '/previews/p-pollo.jpg', true, 47
),
(
  'a1100000-0000-4000-a103-000000000009', 'b1100000-0000-4000-a110-000000000003', 'Carne molida 500g demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🥩',
  14900, 'Carnes', '/previews/p-pollo.jpg', true, 48
),
(
  'a1100000-0000-4000-a103-000000000010', 'b1100000-0000-4000-a110-000000000003', 'Detergente 1kg demo', 'Aseo hogar. Preview creado por UrabApp para onboarding comercial.', '🧺',
  12900, 'Aseo', '/previews/p-aseo.jpg', true, 49
),
(
  'a1100000-0000-4000-a103-000000000011', 'b1100000-0000-4000-a110-000000000003', 'Papel higiénico x4 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '🧻',
  10900, 'Aseo', '/previews/p-aseo.jpg', true, 0
),
(
  'a1100000-0000-4000-a103-000000000012', 'b1100000-0000-4000-a110-000000000003', 'Jabón líquido demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '🧴',
  7900, 'Cuidado', '/previews/p-cuidado.jpg', true, 1
),
(
  'a1100000-0000-4000-a103-000000000013', 'b1100000-0000-4000-a110-000000000003', 'Pañales etapa 3 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '👶',
  24900, 'Bebé', '/previews/p-cuidado.jpg', true, 2
),
(
  'a1100000-0000-4000-a103-000000000014', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa 1.5L demo', 'Bebida. Preview creado por UrabApp para onboarding comercial.', '🥤',
  7200, 'Bebidas', '/previews/p-bebidas.jpg', true, 3
),
(
  'a1100000-0000-4000-a103-000000000015', 'b1100000-0000-4000-a110-000000000003', 'Agua 6L demo', 'Bidón. Preview creado por UrabApp para onboarding comercial.', '💧',
  8200, 'Bebidas', '/previews/p-bebidas.jpg', true, 4
),
(
  'a1100000-0000-4000-a103-000000000016', 'b1100000-0000-4000-a110-000000000003', 'Snack papas demo', 'Bolsa. Preview creado por UrabApp para onboarding comercial.', '🥔',
  5900, 'Snacks', '/previews/p-combos.jpg', true, 5
),
(
  'a1100000-0000-4000-a103-000000000017', 'b1100000-0000-4000-a110-000000000003', 'Combo mercado día', 'Canasta + leche + pan (demo). Preview creado por UrabApp para onboarding comercial.', '🍱',
  34900, 'Combos', '/previews/p-combos.jpg', true, 6
),
(
  'a1100000-0000-4000-a103-000000000018', 'b1100000-0000-4000-a110-000000000003', 'Combo aseo', 'Detergente + papel + jabón (demo). Preview creado por UrabApp para onboarding comercial.', '🧼',
  28900, 'Combos', '/previews/p-combos.jpg', true, 7
),
(
  'a1100000-0000-4000-a103-000000000019', 'b1100000-0000-4000-a110-000000000003', 'Oferta fin de semana demo', 'Selección promocional muestra. Preview creado por UrabApp para onboarding comercial.', '🏷️',
  15900, 'Ofertas', '/previews/p-combos.jpg', true, 8
),
(
  'a1100000-0000-4000-a103-000000000020', 'b1100000-0000-4000-a110-000000000003', 'Fruta picada demo', 'Porción lista. Preview creado por UrabApp para onboarding comercial.', '🍓',
  8900, 'Frescos', '/previews/p-frescos.jpg', true, 9
),
(
  'a1100000-0000-4000-a104-000000000001', 'b1100000-0000-4000-a110-000000000004', 'Canasta fresca demo', 'Selección de frutas y verduras de temporada (muestra). Preview creado por UrabApp para onboarding comercial.', '🥬',
  18900, 'Frescos', '/previews/p-frescos.jpg', true, 10
),
(
  'a1100000-0000-4000-a104-000000000002', 'b1100000-0000-4000-a110-000000000004', 'Huevos AA x12 demo', 'Cartón demostración. Preview creado por UrabApp para onboarding comercial.', '🥚',
  12900, 'Lácteos', '/previews/p-lacteos.jpg', true, 11
),
(
  'a1100000-0000-4000-a104-000000000003', 'b1100000-0000-4000-a110-000000000004', 'Leche 1L demo', 'UHT demostración. Preview creado por UrabApp para onboarding comercial.', '🥛',
  5900, 'Lácteos', '/previews/p-lacteos.jpg', true, 12
),
(
  'a1100000-0000-4000-a104-000000000004', 'b1100000-0000-4000-a110-000000000004', 'Arroz 1kg demo', 'Presentación muestra. Preview creado por UrabApp para onboarding comercial.', '🍚',
  4900, 'Despensa', '/previews/p-despensa.jpg', true, 13
),
(
  'a1100000-0000-4000-a104-000000000005', 'b1100000-0000-4000-a110-000000000004', 'Aceite 1L demo', 'Vegetal — catálogo demo. Preview creado por UrabApp para onboarding comercial.', '🫒',
  12900, 'Despensa', '/previews/p-despensa.jpg', true, 14
),
(
  'a1100000-0000-4000-a104-000000000006', 'b1100000-0000-4000-a110-000000000004', 'Café molido 250g demo', 'Tueste medio demo. Preview creado por UrabApp para onboarding comercial.', '☕',
  11900, 'Despensa', '/previews/p-despensa.jpg', true, 15
),
(
  'a1100000-0000-4000-a104-000000000007', 'b1100000-0000-4000-a110-000000000004', 'Pan tajado demo', 'Bolsa muestra. Preview creado por UrabApp para onboarding comercial.', '🍞',
  6200, 'Panadería', '/previews/p-despensa.jpg', true, 16
),
(
  'a1100000-0000-4000-a104-000000000008', 'b1100000-0000-4000-a110-000000000004', 'Pollo entero demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🍗',
  18900, 'Carnes', '/previews/p-pollo.jpg', true, 17
),
(
  'a1100000-0000-4000-a104-000000000009', 'b1100000-0000-4000-a110-000000000004', 'Carne molida 500g demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🥩',
  14900, 'Carnes', '/previews/p-pollo.jpg', true, 18
),
(
  'a1100000-0000-4000-a104-000000000010', 'b1100000-0000-4000-a110-000000000004', 'Detergente 1kg demo', 'Aseo hogar. Preview creado por UrabApp para onboarding comercial.', '🧺',
  12900, 'Aseo', '/previews/p-aseo.jpg', true, 19
),
(
  'a1100000-0000-4000-a104-000000000011', 'b1100000-0000-4000-a110-000000000004', 'Papel higiénico x4 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '🧻',
  10900, 'Aseo', '/previews/p-aseo.jpg', true, 20
),
(
  'a1100000-0000-4000-a104-000000000012', 'b1100000-0000-4000-a110-000000000004', 'Jabón líquido demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '🧴',
  7900, 'Cuidado', '/previews/p-cuidado.jpg', true, 21
),
(
  'a1100000-0000-4000-a104-000000000013', 'b1100000-0000-4000-a110-000000000004', 'Pañales etapa 3 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '👶',
  24900, 'Bebé', '/previews/p-cuidado.jpg', true, 22
),
(
  'a1100000-0000-4000-a104-000000000014', 'b1100000-0000-4000-a110-000000000004', 'Gaseosa 1.5L demo', 'Bebida. Preview creado por UrabApp para onboarding comercial.', '🥤',
  7200, 'Bebidas', '/previews/p-bebidas.jpg', true, 23
),
(
  'a1100000-0000-4000-a104-000000000015', 'b1100000-0000-4000-a110-000000000004', 'Agua 6L demo', 'Bidón. Preview creado por UrabApp para onboarding comercial.', '💧',
  8200, 'Bebidas', '/previews/p-bebidas.jpg', true, 24
),
(
  'a1100000-0000-4000-a104-000000000016', 'b1100000-0000-4000-a110-000000000004', 'Snack papas demo', 'Bolsa. Preview creado por UrabApp para onboarding comercial.', '🥔',
  5900, 'Snacks', '/previews/p-combos.jpg', true, 25
),
(
  'a1100000-0000-4000-a104-000000000017', 'b1100000-0000-4000-a110-000000000004', 'Combo mercado día', 'Canasta + leche + pan (demo). Preview creado por UrabApp para onboarding comercial.', '🍱',
  34900, 'Combos', '/previews/p-combos.jpg', true, 26
),
(
  'a1100000-0000-4000-a104-000000000018', 'b1100000-0000-4000-a110-000000000004', 'Combo aseo', 'Detergente + papel + jabón (demo). Preview creado por UrabApp para onboarding comercial.', '🧼',
  28900, 'Combos', '/previews/p-combos.jpg', true, 27
),
(
  'a1100000-0000-4000-a104-000000000019', 'b1100000-0000-4000-a110-000000000004', 'Oferta fin de semana demo', 'Selección promocional muestra. Preview creado por UrabApp para onboarding comercial.', '🏷️',
  15900, 'Ofertas', '/previews/p-combos.jpg', true, 28
),
(
  'a1100000-0000-4000-a104-000000000020', 'b1100000-0000-4000-a110-000000000004', 'Fruta picada demo', 'Porción lista. Preview creado por UrabApp para onboarding comercial.', '🍓',
  8900, 'Frescos', '/previews/p-frescos.jpg', true, 29
),
(
  'a1100000-0000-4000-a105-000000000001', 'b1100000-0000-4000-a110-000000000005', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', '💊',
  8900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 30
),
(
  'a1100000-0000-4000-a105-000000000002', 'b1100000-0000-4000-a110-000000000005', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', '💊',
  9900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 31
),
(
  'a1100000-0000-4000-a105-000000000003', 'b1100000-0000-4000-a110-000000000005', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', '🍊',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 32
),
(
  'a1100000-0000-4000-a105-000000000004', 'b1100000-0000-4000-a110-000000000005', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '☀️',
  35900, 'Cuidado', '/previews/p-cuidado.jpg', true, 33
),
(
  'a1100000-0000-4000-a105-000000000005', 'b1100000-0000-4000-a110-000000000005', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', '🧴',
  6900, 'Cuidado', '/previews/p-cuidado.jpg', true, 34
),
(
  'a1100000-0000-4000-a105-000000000006', 'b1100000-0000-4000-a110-000000000005', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', '🩹',
  6900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 35
),
(
  'a1100000-0000-4000-a105-000000000007', 'b1100000-0000-4000-a110-000000000005', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', '🧪',
  3900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 36
),
(
  'a1100000-0000-4000-a105-000000000008', 'b1100000-0000-4000-a110-000000000005', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🦟',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 37
),
(
  'a1100000-0000-4000-a105-000000000009', 'b1100000-0000-4000-a110-000000000005', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  28900, 'Bebé', '/previews/p-cuidado.jpg', true, 38
),
(
  'a1100000-0000-4000-a105-000000000010', 'b1100000-0000-4000-a110-000000000005', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  18900, 'Cuidado', '/previews/p-cuidado.jpg', true, 39
),
(
  'a1100000-0000-4000-a105-000000000011', 'b1100000-0000-4000-a110-000000000005', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  22900, 'Cuidado', '/previews/p-cuidado.jpg', true, 40
),
(
  'a1100000-0000-4000-a105-000000000012', 'b1100000-0000-4000-a110-000000000005', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', '🌡️',
  25900, 'Bienestar', '/previews/p-farmacia.jpg', true, 41
),
(
  'a1100000-0000-4000-a105-000000000013', 'b1100000-0000-4000-a110-000000000005', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', '🧰',
  25900, 'Kits', '/previews/p-farmacia.jpg', true, 42
),
(
  'a1100000-0000-4000-a105-000000000014', 'b1100000-0000-4000-a110-000000000005', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', '😷',
  8900, 'Bienestar', '/previews/p-farmacia.jpg', true, 43
),
(
  'a1100000-0000-4000-a105-000000000015', 'b1100000-0000-4000-a110-000000000005', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', '💊',
  32900, 'Bienestar', '/previews/p-farmacia.jpg', true, 44
),
(
  'a1100000-0000-4000-a105-000000000016', 'b1100000-0000-4000-a110-000000000005', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  9900, 'Bebé', '/previews/p-cuidado.jpg', true, 45
),
(
  'a1100000-0000-4000-a105-000000000017', 'b1100000-0000-4000-a110-000000000005', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', '👁️',
  22900, 'Bienestar', '/previews/p-farmacia.jpg', true, 46
),
(
  'a1100000-0000-4000-a105-000000000018', 'b1100000-0000-4000-a110-000000000005', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', '🧼',
  5900, 'Cuidado', '/previews/p-cuidado.jpg', true, 47
),
(
  'a1100000-0000-4000-a105-000000000019', 'b1100000-0000-4000-a110-000000000005', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', '🎁',
  49900, 'Combos', '/previews/p-combos.jpg', true, 48
),
(
  'a1100000-0000-4000-a105-000000000020', 'b1100000-0000-4000-a110-000000000005', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  5900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 49
),
(
  'a1100000-0000-4000-a106-000000000001', 'b1100000-0000-4000-a110-000000000006', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', '💊',
  8900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 0
),
(
  'a1100000-0000-4000-a106-000000000002', 'b1100000-0000-4000-a110-000000000006', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', '💊',
  9900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 1
),
(
  'a1100000-0000-4000-a106-000000000003', 'b1100000-0000-4000-a110-000000000006', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', '🍊',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 2
),
(
  'a1100000-0000-4000-a106-000000000004', 'b1100000-0000-4000-a110-000000000006', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '☀️',
  35900, 'Cuidado', '/previews/p-cuidado.jpg', true, 3
),
(
  'a1100000-0000-4000-a106-000000000005', 'b1100000-0000-4000-a110-000000000006', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', '🧴',
  6900, 'Cuidado', '/previews/p-cuidado.jpg', true, 4
),
(
  'a1100000-0000-4000-a106-000000000006', 'b1100000-0000-4000-a110-000000000006', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', '🩹',
  6900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 5
),
(
  'a1100000-0000-4000-a106-000000000007', 'b1100000-0000-4000-a110-000000000006', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', '🧪',
  3900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 6
),
(
  'a1100000-0000-4000-a106-000000000008', 'b1100000-0000-4000-a110-000000000006', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🦟',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 7
),
(
  'a1100000-0000-4000-a106-000000000009', 'b1100000-0000-4000-a110-000000000006', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  28900, 'Bebé', '/previews/p-cuidado.jpg', true, 8
),
(
  'a1100000-0000-4000-a106-000000000010', 'b1100000-0000-4000-a110-000000000006', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  18900, 'Cuidado', '/previews/p-cuidado.jpg', true, 9
),
(
  'a1100000-0000-4000-a106-000000000011', 'b1100000-0000-4000-a110-000000000006', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  22900, 'Cuidado', '/previews/p-cuidado.jpg', true, 10
),
(
  'a1100000-0000-4000-a106-000000000012', 'b1100000-0000-4000-a110-000000000006', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', '🌡️',
  25900, 'Bienestar', '/previews/p-farmacia.jpg', true, 11
),
(
  'a1100000-0000-4000-a106-000000000013', 'b1100000-0000-4000-a110-000000000006', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', '🧰',
  25900, 'Kits', '/previews/p-farmacia.jpg', true, 12
),
(
  'a1100000-0000-4000-a106-000000000014', 'b1100000-0000-4000-a110-000000000006', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', '😷',
  8900, 'Bienestar', '/previews/p-farmacia.jpg', true, 13
),
(
  'a1100000-0000-4000-a106-000000000015', 'b1100000-0000-4000-a110-000000000006', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', '💊',
  32900, 'Bienestar', '/previews/p-farmacia.jpg', true, 14
),
(
  'a1100000-0000-4000-a106-000000000016', 'b1100000-0000-4000-a110-000000000006', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  9900, 'Bebé', '/previews/p-cuidado.jpg', true, 15
),
(
  'a1100000-0000-4000-a106-000000000017', 'b1100000-0000-4000-a110-000000000006', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', '👁️',
  22900, 'Bienestar', '/previews/p-farmacia.jpg', true, 16
),
(
  'a1100000-0000-4000-a106-000000000018', 'b1100000-0000-4000-a110-000000000006', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', '🧼',
  5900, 'Cuidado', '/previews/p-cuidado.jpg', true, 17
),
(
  'a1100000-0000-4000-a106-000000000019', 'b1100000-0000-4000-a110-000000000006', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', '🎁',
  49900, 'Combos', '/previews/p-combos.jpg', true, 18
),
(
  'a1100000-0000-4000-a106-000000000020', 'b1100000-0000-4000-a110-000000000006', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  5900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 19
),
(
  'a1100000-0000-4000-a107-000000000001', 'b1100000-0000-4000-a110-000000000007', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', '💊',
  8900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 20
),
(
  'a1100000-0000-4000-a107-000000000002', 'b1100000-0000-4000-a110-000000000007', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', '💊',
  9900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 21
),
(
  'a1100000-0000-4000-a107-000000000003', 'b1100000-0000-4000-a110-000000000007', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', '🍊',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 22
),
(
  'a1100000-0000-4000-a107-000000000004', 'b1100000-0000-4000-a110-000000000007', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '☀️',
  35900, 'Cuidado', '/previews/p-cuidado.jpg', true, 23
),
(
  'a1100000-0000-4000-a107-000000000005', 'b1100000-0000-4000-a110-000000000007', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', '🧴',
  6900, 'Cuidado', '/previews/p-cuidado.jpg', true, 24
),
(
  'a1100000-0000-4000-a107-000000000006', 'b1100000-0000-4000-a110-000000000007', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', '🩹',
  6900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 25
),
(
  'a1100000-0000-4000-a107-000000000007', 'b1100000-0000-4000-a110-000000000007', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', '🧪',
  3900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 26
),
(
  'a1100000-0000-4000-a107-000000000008', 'b1100000-0000-4000-a110-000000000007', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🦟',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 27
),
(
  'a1100000-0000-4000-a107-000000000009', 'b1100000-0000-4000-a110-000000000007', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  28900, 'Bebé', '/previews/p-cuidado.jpg', true, 28
),
(
  'a1100000-0000-4000-a107-000000000010', 'b1100000-0000-4000-a110-000000000007', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  18900, 'Cuidado', '/previews/p-cuidado.jpg', true, 29
),
(
  'a1100000-0000-4000-a107-000000000011', 'b1100000-0000-4000-a110-000000000007', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  22900, 'Cuidado', '/previews/p-cuidado.jpg', true, 30
),
(
  'a1100000-0000-4000-a107-000000000012', 'b1100000-0000-4000-a110-000000000007', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', '🌡️',
  25900, 'Bienestar', '/previews/p-farmacia.jpg', true, 31
),
(
  'a1100000-0000-4000-a107-000000000013', 'b1100000-0000-4000-a110-000000000007', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', '🧰',
  25900, 'Kits', '/previews/p-farmacia.jpg', true, 32
),
(
  'a1100000-0000-4000-a107-000000000014', 'b1100000-0000-4000-a110-000000000007', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', '😷',
  8900, 'Bienestar', '/previews/p-farmacia.jpg', true, 33
),
(
  'a1100000-0000-4000-a107-000000000015', 'b1100000-0000-4000-a110-000000000007', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', '💊',
  32900, 'Bienestar', '/previews/p-farmacia.jpg', true, 34
),
(
  'a1100000-0000-4000-a107-000000000016', 'b1100000-0000-4000-a110-000000000007', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  9900, 'Bebé', '/previews/p-cuidado.jpg', true, 35
),
(
  'a1100000-0000-4000-a107-000000000017', 'b1100000-0000-4000-a110-000000000007', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', '👁️',
  22900, 'Bienestar', '/previews/p-farmacia.jpg', true, 36
),
(
  'a1100000-0000-4000-a107-000000000018', 'b1100000-0000-4000-a110-000000000007', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', '🧼',
  5900, 'Cuidado', '/previews/p-cuidado.jpg', true, 37
),
(
  'a1100000-0000-4000-a107-000000000019', 'b1100000-0000-4000-a110-000000000007', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', '🎁',
  49900, 'Combos', '/previews/p-combos.jpg', true, 38
),
(
  'a1100000-0000-4000-a107-000000000020', 'b1100000-0000-4000-a110-000000000007', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  5900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 39
),
(
  'a1100000-0000-4000-a108-000000000001', 'b1100000-0000-4000-a110-000000000008', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', '💊',
  8900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 40
),
(
  'a1100000-0000-4000-a108-000000000002', 'b1100000-0000-4000-a110-000000000008', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', '💊',
  9900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 41
),
(
  'a1100000-0000-4000-a108-000000000003', 'b1100000-0000-4000-a110-000000000008', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', '🍊',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 42
),
(
  'a1100000-0000-4000-a108-000000000004', 'b1100000-0000-4000-a110-000000000008', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '☀️',
  35900, 'Cuidado', '/previews/p-cuidado.jpg', true, 43
),
(
  'a1100000-0000-4000-a108-000000000005', 'b1100000-0000-4000-a110-000000000008', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', '🧴',
  6900, 'Cuidado', '/previews/p-cuidado.jpg', true, 44
),
(
  'a1100000-0000-4000-a108-000000000006', 'b1100000-0000-4000-a110-000000000008', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', '🩹',
  6900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 45
),
(
  'a1100000-0000-4000-a108-000000000007', 'b1100000-0000-4000-a110-000000000008', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', '🧪',
  3900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 46
),
(
  'a1100000-0000-4000-a108-000000000008', 'b1100000-0000-4000-a110-000000000008', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🦟',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 47
),
(
  'a1100000-0000-4000-a108-000000000009', 'b1100000-0000-4000-a110-000000000008', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  28900, 'Bebé', '/previews/p-cuidado.jpg', true, 48
),
(
  'a1100000-0000-4000-a108-000000000010', 'b1100000-0000-4000-a110-000000000008', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  18900, 'Cuidado', '/previews/p-cuidado.jpg', true, 49
),
(
  'a1100000-0000-4000-a108-000000000011', 'b1100000-0000-4000-a110-000000000008', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  22900, 'Cuidado', '/previews/p-cuidado.jpg', true, 0
),
(
  'a1100000-0000-4000-a108-000000000012', 'b1100000-0000-4000-a110-000000000008', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', '🌡️',
  25900, 'Bienestar', '/previews/p-farmacia.jpg', true, 1
),
(
  'a1100000-0000-4000-a108-000000000013', 'b1100000-0000-4000-a110-000000000008', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', '🧰',
  25900, 'Kits', '/previews/p-farmacia.jpg', true, 2
),
(
  'a1100000-0000-4000-a108-000000000014', 'b1100000-0000-4000-a110-000000000008', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', '😷',
  8900, 'Bienestar', '/previews/p-farmacia.jpg', true, 3
),
(
  'a1100000-0000-4000-a108-000000000015', 'b1100000-0000-4000-a110-000000000008', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', '💊',
  32900, 'Bienestar', '/previews/p-farmacia.jpg', true, 4
),
(
  'a1100000-0000-4000-a108-000000000016', 'b1100000-0000-4000-a110-000000000008', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  9900, 'Bebé', '/previews/p-cuidado.jpg', true, 5
),
(
  'a1100000-0000-4000-a108-000000000017', 'b1100000-0000-4000-a110-000000000008', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', '👁️',
  22900, 'Bienestar', '/previews/p-farmacia.jpg', true, 6
),
(
  'a1100000-0000-4000-a108-000000000018', 'b1100000-0000-4000-a110-000000000008', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', '🧼',
  5900, 'Cuidado', '/previews/p-cuidado.jpg', true, 7
),
(
  'a1100000-0000-4000-a108-000000000019', 'b1100000-0000-4000-a110-000000000008', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', '🎁',
  49900, 'Combos', '/previews/p-combos.jpg', true, 8
),
(
  'a1100000-0000-4000-a108-000000000020', 'b1100000-0000-4000-a110-000000000008', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  5900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 9
),
(
  'a1100000-0000-4000-a109-000000000001', 'b1100000-0000-4000-a110-000000000009', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', '💊',
  8900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 10
),
(
  'a1100000-0000-4000-a109-000000000002', 'b1100000-0000-4000-a110-000000000009', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', '💊',
  9900, 'Analgésicos', '/previews/p-farmacia.jpg', true, 11
),
(
  'a1100000-0000-4000-a109-000000000003', 'b1100000-0000-4000-a110-000000000009', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', '🍊',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 12
),
(
  'a1100000-0000-4000-a109-000000000004', 'b1100000-0000-4000-a110-000000000009', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '☀️',
  35900, 'Cuidado', '/previews/p-cuidado.jpg', true, 13
),
(
  'a1100000-0000-4000-a109-000000000005', 'b1100000-0000-4000-a110-000000000009', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', '🧴',
  6900, 'Cuidado', '/previews/p-cuidado.jpg', true, 14
),
(
  'a1100000-0000-4000-a109-000000000006', 'b1100000-0000-4000-a110-000000000009', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', '🩹',
  6900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 15
),
(
  'a1100000-0000-4000-a109-000000000007', 'b1100000-0000-4000-a110-000000000009', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', '🧪',
  3900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 16
),
(
  'a1100000-0000-4000-a109-000000000008', 'b1100000-0000-4000-a110-000000000009', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🦟',
  18900, 'Bienestar', '/previews/p-farmacia.jpg', true, 17
),
(
  'a1100000-0000-4000-a109-000000000009', 'b1100000-0000-4000-a110-000000000009', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  28900, 'Bebé', '/previews/p-cuidado.jpg', true, 18
),
(
  'a1100000-0000-4000-a109-000000000010', 'b1100000-0000-4000-a110-000000000009', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  18900, 'Cuidado', '/previews/p-cuidado.jpg', true, 19
),
(
  'a1100000-0000-4000-a109-000000000011', 'b1100000-0000-4000-a110-000000000009', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  22900, 'Cuidado', '/previews/p-cuidado.jpg', true, 20
),
(
  'a1100000-0000-4000-a109-000000000012', 'b1100000-0000-4000-a110-000000000009', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', '🌡️',
  25900, 'Bienestar', '/previews/p-farmacia.jpg', true, 21
),
(
  'a1100000-0000-4000-a109-000000000013', 'b1100000-0000-4000-a110-000000000009', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', '🧰',
  25900, 'Kits', '/previews/p-farmacia.jpg', true, 22
),
(
  'a1100000-0000-4000-a109-000000000014', 'b1100000-0000-4000-a110-000000000009', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', '😷',
  8900, 'Bienestar', '/previews/p-farmacia.jpg', true, 23
),
(
  'a1100000-0000-4000-a109-000000000015', 'b1100000-0000-4000-a110-000000000009', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', '💊',
  32900, 'Bienestar', '/previews/p-farmacia.jpg', true, 24
),
(
  'a1100000-0000-4000-a109-000000000016', 'b1100000-0000-4000-a110-000000000009', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', '👶',
  9900, 'Bebé', '/previews/p-cuidado.jpg', true, 25
),
(
  'a1100000-0000-4000-a109-000000000017', 'b1100000-0000-4000-a110-000000000009', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', '👁️',
  22900, 'Bienestar', '/previews/p-farmacia.jpg', true, 26
),
(
  'a1100000-0000-4000-a109-000000000018', 'b1100000-0000-4000-a110-000000000009', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', '🧼',
  5900, 'Cuidado', '/previews/p-cuidado.jpg', true, 27
),
(
  'a1100000-0000-4000-a109-000000000019', 'b1100000-0000-4000-a110-000000000009', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', '🎁',
  49900, 'Combos', '/previews/p-combos.jpg', true, 28
),
(
  'a1100000-0000-4000-a109-000000000020', 'b1100000-0000-4000-a110-000000000009', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', '🧴',
  5900, 'Primeros auxilios', '/previews/p-farmacia.jpg', true, 29
),
(
  'a1100000-0000-4000-a110-000000000001', 'b1100000-0000-4000-a110-000000000010', 'Canasta fresca demo', 'Selección de frutas y verduras de temporada (muestra). Preview creado por UrabApp para onboarding comercial.', '🥬',
  18900, 'Frescos', '/previews/p-frescos.jpg', true, 30
),
(
  'a1100000-0000-4000-a110-000000000002', 'b1100000-0000-4000-a110-000000000010', 'Huevos AA x12 demo', 'Cartón demostración. Preview creado por UrabApp para onboarding comercial.', '🥚',
  12900, 'Lácteos', '/previews/p-lacteos.jpg', true, 31
),
(
  'a1100000-0000-4000-a110-000000000003', 'b1100000-0000-4000-a110-000000000010', 'Leche 1L demo', 'UHT demostración. Preview creado por UrabApp para onboarding comercial.', '🥛',
  5900, 'Lácteos', '/previews/p-lacteos.jpg', true, 32
),
(
  'a1100000-0000-4000-a110-000000000004', 'b1100000-0000-4000-a110-000000000010', 'Arroz 1kg demo', 'Presentación muestra. Preview creado por UrabApp para onboarding comercial.', '🍚',
  4900, 'Despensa', '/previews/p-despensa.jpg', true, 33
),
(
  'a1100000-0000-4000-a110-000000000005', 'b1100000-0000-4000-a110-000000000010', 'Aceite 1L demo', 'Vegetal — catálogo demo. Preview creado por UrabApp para onboarding comercial.', '🫒',
  12900, 'Despensa', '/previews/p-despensa.jpg', true, 34
),
(
  'a1100000-0000-4000-a110-000000000006', 'b1100000-0000-4000-a110-000000000010', 'Café molido 250g demo', 'Tueste medio demo. Preview creado por UrabApp para onboarding comercial.', '☕',
  11900, 'Despensa', '/previews/p-despensa.jpg', true, 35
),
(
  'a1100000-0000-4000-a110-000000000007', 'b1100000-0000-4000-a110-000000000010', 'Pan tajado demo', 'Bolsa muestra. Preview creado por UrabApp para onboarding comercial.', '🍞',
  6200, 'Panadería', '/previews/p-despensa.jpg', true, 36
),
(
  'a1100000-0000-4000-a110-000000000008', 'b1100000-0000-4000-a110-000000000010', 'Pollo entero demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🍗',
  18900, 'Carnes', '/previews/p-pollo.jpg', true, 37
),
(
  'a1100000-0000-4000-a110-000000000009', 'b1100000-0000-4000-a110-000000000010', 'Carne molida 500g demo', 'Referencia de precio. Preview creado por UrabApp para onboarding comercial.', '🥩',
  14900, 'Carnes', '/previews/p-pollo.jpg', true, 38
),
(
  'a1100000-0000-4000-a110-000000000010', 'b1100000-0000-4000-a110-000000000010', 'Detergente 1kg demo', 'Aseo hogar. Preview creado por UrabApp para onboarding comercial.', '🧺',
  12900, 'Aseo', '/previews/p-aseo.jpg', true, 39
),
(
  'a1100000-0000-4000-a110-000000000011', 'b1100000-0000-4000-a110-000000000010', 'Papel higiénico x4 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '🧻',
  10900, 'Aseo', '/previews/p-aseo.jpg', true, 40
),
(
  'a1100000-0000-4000-a110-000000000012', 'b1100000-0000-4000-a110-000000000010', 'Jabón líquido demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', '🧴',
  7900, 'Cuidado', '/previews/p-cuidado.jpg', true, 41
),
(
  'a1100000-0000-4000-a110-000000000013', 'b1100000-0000-4000-a110-000000000010', 'Pañales etapa 3 demo', 'Pack muestra. Preview creado por UrabApp para onboarding comercial.', '👶',
  24900, 'Bebé', '/previews/p-cuidado.jpg', true, 42
),
(
  'a1100000-0000-4000-a110-000000000014', 'b1100000-0000-4000-a110-000000000010', 'Gaseosa 1.5L demo', 'Bebida. Preview creado por UrabApp para onboarding comercial.', '🥤',
  7200, 'Bebidas', '/previews/p-bebidas.jpg', true, 43
),
(
  'a1100000-0000-4000-a110-000000000015', 'b1100000-0000-4000-a110-000000000010', 'Agua 6L demo', 'Bidón. Preview creado por UrabApp para onboarding comercial.', '💧',
  8200, 'Bebidas', '/previews/p-bebidas.jpg', true, 44
),
(
  'a1100000-0000-4000-a110-000000000016', 'b1100000-0000-4000-a110-000000000010', 'Snack papas demo', 'Bolsa. Preview creado por UrabApp para onboarding comercial.', '🥔',
  5900, 'Snacks', '/previews/p-combos.jpg', true, 45
),
(
  'a1100000-0000-4000-a110-000000000017', 'b1100000-0000-4000-a110-000000000010', 'Combo mercado día', 'Canasta + leche + pan (demo). Preview creado por UrabApp para onboarding comercial.', '🍱',
  34900, 'Combos', '/previews/p-combos.jpg', true, 46
),
(
  'a1100000-0000-4000-a110-000000000018', 'b1100000-0000-4000-a110-000000000010', 'Combo aseo', 'Detergente + papel + jabón (demo). Preview creado por UrabApp para onboarding comercial.', '🧼',
  28900, 'Combos', '/previews/p-combos.jpg', true, 47
),
(
  'a1100000-0000-4000-a110-000000000019', 'b1100000-0000-4000-a110-000000000010', 'Oferta fin de semana demo', 'Selección promocional muestra. Preview creado por UrabApp para onboarding comercial.', '🏷️',
  15900, 'Ofertas', '/previews/p-combos.jpg', true, 48
),
(
  'a1100000-0000-4000-a110-000000000020', 'b1100000-0000-4000-a110-000000000010', 'Fruta picada demo', 'Porción lista. Preview creado por UrabApp para onboarding comercial.', '🍓',
  8900, 'Frescos', '/previews/p-frescos.jpg', true, 49
),
(
  'a1100000-0000-4000-a111-000000000001', 'b1100000-0000-4000-a110-000000000011', 'Combo pollo familiar demo', 'Piezas + papas + bebida (muestra). Preview creado por UrabApp para onboarding comercial.', '🍗',
  45900, 'Combos', '/previews/p-combos.jpg', true, 0
),
(
  'a1100000-0000-4000-a111-000000000002', 'b1100000-0000-4000-a110-000000000011', '1/4 pollo + papas demo', 'Porción individual demo. Preview creado por UrabApp para onboarding comercial.', '🍗',
  18900, 'Pollo', '/previews/p-pollo.jpg', true, 1
),
(
  'a1100000-0000-4000-a111-000000000003', 'b1100000-0000-4000-a110-000000000011', 'Alitas BBQ x6 demo', 'Glaseadas — catálogo demo. Preview creado por UrabApp para onboarding comercial.', '🍗',
  17900, 'Alitas', '/previews/p-pollo.jpg', true, 2
),
(
  'a1100000-0000-4000-a111-000000000004', 'b1100000-0000-4000-a110-000000000011', 'Hamburguesa clásica demo', 'Con papas. Preview creado por UrabApp para onboarding comercial.', '🍔',
  19900, 'Hamburguesas', '/previews/p-burger.jpg', true, 3
),
(
  'a1100000-0000-4000-a111-000000000005', 'b1100000-0000-4000-a110-000000000011', 'Salchipapa especial demo', 'Salsas a elección. Preview creado por UrabApp para onboarding comercial.', '🍟',
  14900, 'Platos', '/previews/p-combos.jpg', true, 4
),
(
  'a1100000-0000-4000-a111-000000000006', 'b1100000-0000-4000-a110-000000000011', 'Arepa rellena demo', 'Queso y hogao. Preview creado por UrabApp para onboarding comercial.', '🫓',
  8900, 'Criollo', '/previews/p-combos.jpg', true, 5
),
(
  'a1100000-0000-4000-a111-000000000007', 'b1100000-0000-4000-a110-000000000011', 'Nuggets kids demo', '6 und + papa + jugo. Preview creado por UrabApp para onboarding comercial.', '🧒',
  14900, 'Kids', '/previews/p-fries.jpg', true, 6
),
(
  'a1100000-0000-4000-a111-000000000008', 'b1100000-0000-4000-a110-000000000011', 'Ensalada fresca demo', 'Vegetales del día. Preview creado por UrabApp para onboarding comercial.', '🥗',
  12900, 'Ensaladas', '/previews/p-frescos.jpg', true, 7
),
(
  'a1100000-0000-4000-a111-000000000009', 'b1100000-0000-4000-a110-000000000011', 'Papa criolla demo', 'Acompañamiento. Preview creado por UrabApp para onboarding comercial.', '🥔',
  7900, 'Acompañamientos', '/previews/p-fries.jpg', true, 8
),
(
  'a1100000-0000-4000-a111-000000000010', 'b1100000-0000-4000-a110-000000000011', 'Yuca frita demo', 'Con suero. Preview creado por UrabApp para onboarding comercial.', '🥔',
  6900, 'Acompañamientos', '/previews/p-fries.jpg', true, 9
),
(
  'a1100000-0000-4000-a111-000000000011', 'b1100000-0000-4000-a110-000000000011', 'Limonada natural demo', '16oz. Preview creado por UrabApp para onboarding comercial.', '🍋',
  5900, 'Bebidas', '/previews/p-bebidas.jpg', true, 10
),
(
  'a1100000-0000-4000-a111-000000000012', 'b1100000-0000-4000-a110-000000000011', 'Gaseosa personal demo', '350ml. Preview creado por UrabApp para onboarding comercial.', '🥤',
  3900, 'Bebidas', '/previews/p-bebidas.jpg', true, 11
),
(
  'a1100000-0000-4000-a111-000000000013', 'b1100000-0000-4000-a110-000000000011', 'Brownie demo', 'Postre. Preview creado por UrabApp para onboarding comercial.', '🍫',
  7900, 'Postres', '/previews/p-combos.jpg', true, 12
),
(
  'a1100000-0000-4000-a111-000000000014', 'b1100000-0000-4000-a110-000000000011', 'Combo ejecutivo demo', 'Pollo + bebida. Preview creado por UrabApp para onboarding comercial.', '🍱',
  21900, 'Combos', '/previews/p-combos.jpg', true, 13
),
(
  'a1100000-0000-4000-a111-000000000015', 'b1100000-0000-4000-a110-000000000011', 'Ají de la casa demo', 'Porción. Preview creado por UrabApp para onboarding comercial.', '🌶️',
  2000, 'Salsas', '/previews/p-default.jpg', true, 14
),
(
  'a1100000-0000-4000-a111-000000000016', 'b1100000-0000-4000-a110-000000000011', 'Extra queso demo', 'Adición. Preview creado por UrabApp para onboarding comercial.', '🧀',
  3000, 'Extras', '/previews/p-default.jpg', true, 15
),
(
  'a1100000-0000-4000-a111-000000000017', 'b1100000-0000-4000-a110-000000000011', 'Picada para 2 demo', 'Surtido parrilla muestra. Preview creado por UrabApp para onboarding comercial.', '🥩',
  42900, 'Platos', '/previews/p-combos.jpg', true, 16
),
(
  'a1100000-0000-4000-a111-000000000018', 'b1100000-0000-4000-a110-000000000011', 'Jugo de mango demo', 'Natural. Preview creado por UrabApp para onboarding comercial.', '🥭',
  6900, 'Bebidas', '/previews/p-bebidas.jpg', true, 17
),
(
  'a1100000-0000-4000-a111-000000000019', 'b1100000-0000-4000-a110-000000000011', 'Menú infantil demo', 'Porción kids. Preview creado por UrabApp para onboarding comercial.', '🧒',
  13900, 'Kids', '/previews/p-fries.jpg', true, 18
),
(
  'a1100000-0000-4000-a111-000000000020', 'b1100000-0000-4000-a110-000000000011', 'Oferta mediodía demo', 'Solo lunch — muestra. Preview creado por UrabApp para onboarding comercial.', '🏷️',
  16900, 'Ofertas', '/previews/p-combos.jpg', true, 19
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  is_available = true;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;