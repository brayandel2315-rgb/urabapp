-- UrabApp marketplace seed v1 — 5 municipios (datos originales)
-- Generado por scripts/generate-uraba-marketplace-seed.mjs
-- NO contiene contenido de terceros (Rappi u otros).

ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone
) VALUES
(
  'b1090000-0000-4000-0101-000000001001', 'Parrilla Brasa Apartadó', 'comida', 'Carnes a la brasa y picadas familiares en Apartadó. Sabor de casa, listo para domicilio.', '🥩',
  'Apartadó', 'Centro', 'Calle 10 # 20-15, Centro',
  7.8799, -76.6289, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.4, 40,
  true, true, true, 'approved', NOW(), 'parrilla-brasa-apartado', '6048000000'
),
(
  'b1090000-0000-4000-0102-000000001002', 'Hornito Apartadó', 'comida', 'Pizzas al horno, pastas y combos para compartir en Apartadó.', '🍕',
  'Apartadó', 'Ortiz', 'Calle 11 # 20-16, Ortiz',
  7.8811, -76.6265, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.5, 57,
  true, true, true, 'approved', NOW(), 'hornito-apartado', '6048000011'
),
(
  'b1090000-0000-4000-0103-000000001003', 'Broaster Don Pollo Apartadó', 'comida', 'Pollo crocante, alitas y combos familiares con entrega rápida en Apartadó.', '🍗',
  'Apartadó', 'Vélez', 'Calle 12 # 20-17, Vélez',
  7.8823, -76.6241, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.6, 74,
  true, true, true, 'approved', NOW(), 'broaster-don-pollo-apartado', '6048000022'
),
(
  'b1090000-0000-4000-0104-000000001004', 'Smash Calle Apartadó', 'comida', 'Hamburguesas smash, papas caseras y malteadas en Apartadó.', '🍔',
  'Apartadó', 'Laureles', 'Calle 13 # 20-18, Laureles',
  7.8835, -76.6217, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.7, 91,
  true, true, true, 'approved', NOW(), 'smash-calle-apartado', '6048000033'
),
(
  'b1090000-0000-4000-0105-000000001005', 'Café Puerto Verde Apartadó', 'comida', 'Café de origen, desayunos y panadería fresca en Apartadó.', '☕',
  'Apartadó', 'Centro', 'Calle 14 # 20-19, Centro',
  7.8847, -76.6277, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.8, 108,
  true, true, true, 'approved', NOW(), 'cafe-puerto-verde-apartado', '6048000044'
),
(
  'b1090000-0000-4000-0106-000000001006', 'Arepas La Costeña Apartadó', 'comida', 'Arepas de huevo, empanadas y desayunos criollos de Apartadó.', '🫓',
  'Apartadó', 'Ortiz', 'Calle 15 # 20-20, Ortiz',
  7.8859, -76.6253, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.4, 125,
  true, true, true, 'approved', NOW(), 'arepas-la-costena-apartado', '6048000055'
),
(
  'b1090000-0000-4000-0107-000000001007', 'Mercadito del Golfo Apartadó', 'mercado', 'Abarrotes, frescos y aseo para el día a día en Apartadó.', '🛒',
  'Apartadó', 'Vélez', 'Calle 16 # 20-21, Vélez',
  7.8871, -76.6229, '08:00'::time, '21:30'::time,
  4500, 10000, 20, 4.5, 142,
  true, true, true, 'approved', NOW(), 'mercadito-del-golfo-apartado', '6048000066'
),
(
  'b1090000-0000-4000-0108-000000001008', 'Droguería Bienestar Apartadó', 'farmacia', 'Cuidado OTC, bebé y bienestar con domicilio en Apartadó.', '💊',
  'Apartadó', 'Laureles', 'Calle 17 # 20-22, Laureles',
  7.8799, -76.6289, '08:00'::time, '21:30'::time,
  4000, 8000, 25, 4.6, 159,
  true, true, true, 'approved', NOW(), 'drogueria-bienestar-apartado', '6048000077'
),
(
  'b1090000-0000-4000-0109-000000001009', 'Helados Brisa Apartadó', 'comida', 'Helados, malteadas y postres fríos en Apartadó.', '🍦',
  'Apartadó', 'Centro', 'Calle 18 # 20-23, Centro',
  7.8811, -76.6265, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.7, 176,
  true, true, true, 'approved', NOW(), 'helados-brisa-apartado', '6048000088'
),
(
  'b1090000-0000-4000-0201-000000002001', 'Parrilla Brasa Turbo', 'comida', 'Carnes a la brasa y picadas familiares en Turbo. Sabor de casa, listo para domicilio.', '🥩',
  'Turbo', 'Centro', 'Calle 10 # 21-15, Centro',
  8.0908, -76.7299, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.4, 49,
  true, true, true, 'approved', NOW(), 'parrilla-brasa-turbo', '6048010000'
),
(
  'b1090000-0000-4000-0202-000000002002', 'Hornito Turbo', 'comida', 'Pizzas al horno, pastas y combos para compartir en Turbo.', '🍕',
  'Turbo', 'El Progreso', 'Calle 11 # 21-16, El Progreso',
  8.092, -76.7275, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.5, 66,
  true, true, true, 'approved', NOW(), 'hornito-turbo', '6048010011'
),
(
  'b1090000-0000-4000-0203-000000002003', 'Broaster Don Pollo Turbo', 'comida', 'Pollo crocante, alitas y combos familiares con entrega rápida en Turbo.', '🍗',
  'Turbo', 'Nuevo Horizonte', 'Calle 12 # 21-17, Nuevo Horizonte',
  8.0932, -76.7251, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.6, 83,
  true, true, true, 'approved', NOW(), 'broaster-don-pollo-turbo', '6048010022'
),
(
  'b1090000-0000-4000-0204-000000002004', 'Smash Calle Turbo', 'comida', 'Hamburguesas smash, papas caseras y malteadas en Turbo.', '🍔',
  'Turbo', 'Centro', 'Calle 13 # 21-18, Centro',
  8.0944, -76.7311, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.7, 100,
  true, true, true, 'approved', NOW(), 'smash-calle-turbo', '6048010033'
),
(
  'b1090000-0000-4000-0205-000000002005', 'Café Puerto Verde Turbo', 'comida', 'Café de origen, desayunos y panadería fresca en Turbo.', '☕',
  'Turbo', 'El Progreso', 'Calle 14 # 21-19, El Progreso',
  8.0956, -76.7287, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.8, 117,
  true, true, true, 'approved', NOW(), 'cafe-puerto-verde-turbo', '6048010044'
),
(
  'b1090000-0000-4000-0206-000000002006', 'Arepas La Costeña Turbo', 'comida', 'Arepas de huevo, empanadas y desayunos criollos de Turbo.', '🫓',
  'Turbo', 'Nuevo Horizonte', 'Calle 15 # 21-20, Nuevo Horizonte',
  8.0968, -76.7263, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.4, 134,
  true, true, true, 'approved', NOW(), 'arepas-la-costena-turbo', '6048010055'
),
(
  'b1090000-0000-4000-0207-000000002007', 'Mercadito del Golfo Turbo', 'mercado', 'Abarrotes, frescos y aseo para el día a día en Turbo.', '🛒',
  'Turbo', 'Centro', 'Calle 16 # 21-21, Centro',
  8.0896, -76.7239, '08:00'::time, '21:30'::time,
  4500, 10000, 20, 4.5, 151,
  true, true, true, 'approved', NOW(), 'mercadito-del-golfo-turbo', '6048010066'
),
(
  'b1090000-0000-4000-0208-000000002008', 'Droguería Bienestar Turbo', 'farmacia', 'Cuidado OTC, bebé y bienestar con domicilio en Turbo.', '💊',
  'Turbo', 'El Progreso', 'Calle 17 # 21-22, El Progreso',
  8.0908, -76.7299, '08:00'::time, '21:30'::time,
  4000, 8000, 25, 4.6, 168,
  true, true, true, 'approved', NOW(), 'drogueria-bienestar-turbo', '6048010077'
),
(
  'b1090000-0000-4000-0209-000000002009', 'TecnoBahía Turbo', 'tecnologia', 'Cargadores, audio y accesorios móviles en Turbo.', '📱',
  'Turbo', 'Nuevo Horizonte', 'Calle 18 # 21-23, Nuevo Horizonte',
  8.092, -76.7275, '08:00'::time, '21:30'::time,
  5000, 10000, 20, 4.7, 185,
  true, true, true, 'approved', NOW(), 'tecnobahia-turbo', '6048010088'
),
(
  'b1090000-0000-4000-0301-000000003001', 'Parrilla Brasa Carepa', 'comida', 'Carnes a la brasa y picadas familiares en Carepa. Sabor de casa, listo para domicilio.', '🥩',
  'Carepa', 'Centro', 'Calle 10 # 22-15, Centro',
  7.7577, -76.6556, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.4, 58,
  true, true, true, 'approved', NOW(), 'parrilla-brasa-carepa', '6048020000'
),
(
  'b1090000-0000-4000-0302-000000003002', 'Hornito Carepa', 'comida', 'Pizzas al horno, pastas y combos para compartir en Carepa.', '🍕',
  'Carepa', 'La Esperanza', 'Calle 11 # 22-16, La Esperanza',
  7.7589, -76.6532, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.5, 75,
  true, true, true, 'approved', NOW(), 'hornito-carepa', '6048020011'
),
(
  'b1090000-0000-4000-0303-000000003003', 'Broaster Don Pollo Carepa', 'comida', 'Pollo crocante, alitas y combos familiares con entrega rápida en Carepa.', '🍗',
  'Carepa', 'El Bosque', 'Calle 12 # 22-17, El Bosque',
  7.7601, -76.6508, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.6, 92,
  true, true, true, 'approved', NOW(), 'broaster-don-pollo-carepa', '6048020022'
),
(
  'b1090000-0000-4000-0304-000000003004', 'Smash Calle Carepa', 'comida', 'Hamburguesas smash, papas caseras y malteadas en Carepa.', '🍔',
  'Carepa', 'Centro', 'Calle 13 # 22-18, Centro',
  7.7613, -76.6568, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.7, 109,
  true, true, true, 'approved', NOW(), 'smash-calle-carepa', '6048020033'
),
(
  'b1090000-0000-4000-0305-000000003005', 'Café Puerto Verde Carepa', 'comida', 'Café de origen, desayunos y panadería fresca en Carepa.', '☕',
  'Carepa', 'La Esperanza', 'Calle 14 # 22-19, La Esperanza',
  7.7625, -76.6544, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.8, 126,
  true, true, true, 'approved', NOW(), 'cafe-puerto-verde-carepa', '6048020044'
),
(
  'b1090000-0000-4000-0306-000000003006', 'Arepas La Costeña Carepa', 'comida', 'Arepas de huevo, empanadas y desayunos criollos de Carepa.', '🫓',
  'Carepa', 'El Bosque', 'Calle 15 # 22-20, El Bosque',
  7.7553, -76.652, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.4, 143,
  true, true, true, 'approved', NOW(), 'arepas-la-costena-carepa', '6048020055'
),
(
  'b1090000-0000-4000-0307-000000003007', 'Mercadito del Golfo Carepa', 'mercado', 'Abarrotes, frescos y aseo para el día a día en Carepa.', '🛒',
  'Carepa', 'Centro', 'Calle 16 # 22-21, Centro',
  7.7565, -76.658, '08:00'::time, '21:30'::time,
  4500, 10000, 20, 4.5, 160,
  true, true, true, 'approved', NOW(), 'mercadito-del-golfo-carepa', '6048020066'
),
(
  'b1090000-0000-4000-0308-000000003008', 'Droguería Bienestar Carepa', 'farmacia', 'Cuidado OTC, bebé y bienestar con domicilio en Carepa.', '💊',
  'Carepa', 'La Esperanza', 'Calle 17 # 22-22, La Esperanza',
  7.7577, -76.6556, '08:00'::time, '21:30'::time,
  4000, 8000, 25, 4.6, 177,
  true, true, true, 'approved', NOW(), 'drogueria-bienestar-carepa', '6048020077'
),
(
  'b1090000-0000-4000-0309-000000003009', 'Pet Urabá Carepa', 'mascotas', 'Alimento y cuidados para perros y gatos en Carepa.', '🐾',
  'Carepa', 'El Bosque', 'Calle 18 # 22-23, El Bosque',
  7.7589, -76.6532, '08:00'::time, '21:30'::time,
  5000, 10000, 20, 4.7, 194,
  true, true, true, 'approved', NOW(), 'pet-uraba-carepa', '6048020088'
),
(
  'b1090000-0000-4000-0401-000000004001', 'Parrilla Brasa Chigorodó', 'comida', 'Carnes a la brasa y picadas familiares en Chigorodó. Sabor de casa, listo para domicilio.', '🥩',
  'Chigorodó', 'Centro', 'Calle 10 # 23-15, Centro',
  7.67, -76.6805, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.4, 67,
  true, true, true, 'approved', NOW(), 'parrilla-brasa-chigorodo', '6048030000'
),
(
  'b1090000-0000-4000-0402-000000004002', 'Hornito Chigorodó', 'comida', 'Pizzas al horno, pastas y combos para compartir en Chigorodó.', '🍕',
  'Chigorodó', 'Santander', 'Calle 11 # 23-16, Santander',
  7.6712, -76.6781, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.5, 84,
  true, true, true, 'approved', NOW(), 'hornito-chigorodo', '6048030011'
),
(
  'b1090000-0000-4000-0403-000000004003', 'Broaster Don Pollo Chigorodó', 'comida', 'Pollo crocante, alitas y combos familiares con entrega rápida en Chigorodó.', '🍗',
  'Chigorodó', 'Los Almendros', 'Calle 12 # 23-17, Los Almendros',
  7.6724, -76.6841, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.6, 101,
  true, true, true, 'approved', NOW(), 'broaster-don-pollo-chigorodo', '6048030022'
),
(
  'b1090000-0000-4000-0404-000000004004', 'Smash Calle Chigorodó', 'comida', 'Hamburguesas smash, papas caseras y malteadas en Chigorodó.', '🍔',
  'Chigorodó', 'Centro', 'Calle 13 # 23-18, Centro',
  7.6736, -76.6817, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.7, 118,
  true, true, true, 'approved', NOW(), 'smash-calle-chigorodo', '6048030033'
),
(
  'b1090000-0000-4000-0405-000000004005', 'Café Puerto Verde Chigorodó', 'comida', 'Café de origen, desayunos y panadería fresca en Chigorodó.', '☕',
  'Chigorodó', 'Santander', 'Calle 14 # 23-19, Santander',
  7.6664, -76.6793, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.8, 135,
  true, true, true, 'approved', NOW(), 'cafe-puerto-verde-chigorodo', '6048030044'
),
(
  'b1090000-0000-4000-0406-000000004006', 'Arepas La Costeña Chigorodó', 'comida', 'Arepas de huevo, empanadas y desayunos criollos de Chigorodó.', '🫓',
  'Chigorodó', 'Los Almendros', 'Calle 15 # 23-20, Los Almendros',
  7.6676, -76.6769, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.4, 152,
  true, true, true, 'approved', NOW(), 'arepas-la-costena-chigorodo', '6048030055'
),
(
  'b1090000-0000-4000-0407-000000004007', 'Mercadito del Golfo Chigorodó', 'mercado', 'Abarrotes, frescos y aseo para el día a día en Chigorodó.', '🛒',
  'Chigorodó', 'Centro', 'Calle 16 # 23-21, Centro',
  7.6688, -76.6829, '08:00'::time, '21:30'::time,
  4500, 10000, 20, 4.5, 169,
  true, true, true, 'approved', NOW(), 'mercadito-del-golfo-chigorodo', '6048030066'
),
(
  'b1090000-0000-4000-0408-000000004008', 'Droguería Bienestar Chigorodó', 'farmacia', 'Cuidado OTC, bebé y bienestar con domicilio en Chigorodó.', '💊',
  'Chigorodó', 'Santander', 'Calle 17 # 23-22, Santander',
  7.67, -76.6805, '08:00'::time, '21:30'::time,
  4000, 8000, 25, 4.6, 186,
  true, true, true, 'approved', NOW(), 'drogueria-bienestar-chigorodo', '6048030077'
),
(
  'b1090000-0000-4000-0409-000000004009', 'TodoHogar Chigorodó', 'tiendas', 'Belleza, papelería y hogar en Chigorodó.', '🏪',
  'Chigorodó', 'Los Almendros', 'Calle 18 # 23-23, Los Almendros',
  7.6712, -76.6781, '08:00'::time, '21:30'::time,
  5000, 10000, 20, 4.7, 203,
  true, true, true, 'approved', NOW(), 'todohogar-chigorodo', '6048030088'
),
(
  'b1090000-0000-4000-0501-000000005001', 'Parrilla Brasa Necoclí', 'comida', 'Carnes a la brasa y picadas familiares en Necoclí. Sabor de casa, listo para domicilio.', '🥩',
  'Necoclí', 'Centro', 'Calle 10 # 24-15, Centro',
  8.4279, -76.7851, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.4, 76,
  true, true, true, 'approved', NOW(), 'parrilla-brasa-necocli', '6048040000'
),
(
  'b1090000-0000-4000-0502-000000005002', 'Hornito Necoclí', 'comida', 'Pizzas al horno, pastas y combos para compartir en Necoclí.', '🍕',
  'Necoclí', 'Playa', 'Calle 11 # 24-16, Playa',
  8.4291, -76.7827, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.5, 93,
  true, true, true, 'approved', NOW(), 'hornito-necocli', '6048040011'
),
(
  'b1090000-0000-4000-0503-000000005003', 'Broaster Don Pollo Necoclí', 'comida', 'Pollo crocante, alitas y combos familiares con entrega rápida en Necoclí.', '🍗',
  'Necoclí', 'El Poblado', 'Calle 12 # 24-17, El Poblado',
  8.4303, -76.7887, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.6, 110,
  true, true, true, 'approved', NOW(), 'broaster-don-pollo-necocli', '6048040022'
),
(
  'b1090000-0000-4000-0504-000000005004', 'Smash Calle Necoclí', 'comida', 'Hamburguesas smash, papas caseras y malteadas en Necoclí.', '🍔',
  'Necoclí', 'Centro', 'Calle 13 # 24-18, Centro',
  8.4231, -76.7863, '08:00'::time, '21:30'::time,
  5000, 12000, 25, 4.7, 127,
  true, true, true, 'approved', NOW(), 'smash-calle-necocli', '6048040033'
),
(
  'b1090000-0000-4000-0505-000000005005', 'Café Puerto Verde Necoclí', 'comida', 'Café de origen, desayunos y panadería fresca en Necoclí.', '☕',
  'Necoclí', 'Playa', 'Calle 14 # 24-19, Playa',
  8.4243, -76.7839, '08:00'::time, '21:30'::time,
  5000, 12000, 30, 4.8, 144,
  true, true, true, 'approved', NOW(), 'cafe-puerto-verde-necocli', '6048040044'
),
(
  'b1090000-0000-4000-0506-000000005006', 'Arepas La Costeña Necoclí', 'comida', 'Arepas de huevo, empanadas y desayunos criollos de Necoclí.', '🫓',
  'Necoclí', 'El Poblado', 'Calle 15 # 24-20, El Poblado',
  8.4255, -76.7899, '08:00'::time, '21:30'::time,
  5000, 12000, 35, 4.4, 161,
  true, true, true, 'approved', NOW(), 'arepas-la-costena-necocli', '6048040055'
),
(
  'b1090000-0000-4000-0507-000000005007', 'Mercadito del Golfo Necoclí', 'mercado', 'Abarrotes, frescos y aseo para el día a día en Necoclí.', '🛒',
  'Necoclí', 'Centro', 'Calle 16 # 24-21, Centro',
  8.4267, -76.7875, '08:00'::time, '21:30'::time,
  4500, 10000, 20, 4.5, 178,
  true, true, true, 'approved', NOW(), 'mercadito-del-golfo-necocli', '6048040066'
),
(
  'b1090000-0000-4000-0508-000000005008', 'Droguería Bienestar Necoclí', 'farmacia', 'Cuidado OTC, bebé y bienestar con domicilio en Necoclí.', '💊',
  'Necoclí', 'Playa', 'Calle 17 # 24-22, Playa',
  8.4279, -76.7851, '08:00'::time, '21:30'::time,
  4000, 8000, 25, 4.6, 195,
  true, true, true, 'approved', NOW(), 'drogueria-bienestar-necocli', '6048040077'
),
(
  'b1090000-0000-4000-0509-000000005009', 'Licores La Playa Necoclí', 'licoreria', 'Cervezas, licores y hielo con entrega responsable en Necoclí.', '🍺',
  'Necoclí', 'El Poblado', 'Calle 18 # 24-23, El Poblado',
  8.4291, -76.7827, '08:00'::time, '23:00'::time,
  5000, 10000, 20, 4.7, 212,
  true, true, true, 'approved', NOW(), 'licores-la-playa-necocli', '6048040088'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  is_published = true,
  verification_status = 'approved',
  is_active = true,
  approved_at = COALESCE(public.businesses.approved_at, EXCLUDED.approved_at),
  slug = EXCLUDED.slug,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  delivery_fee = EXCLUDED.delivery_fee,
  min_order = EXCLUDED.min_order,
  delivery_time = EXCLUDED.delivery_time,
  phone = COALESCE(public.businesses.phone, EXCLUDED.phone);

INSERT INTO public.products (
  id, business_id, name, description, emoji, price, compare_at_price, category, is_available, sort_order
) VALUES
(
  'p1090000-0000-4000-0101-000000000001', 'b1090000-0000-4000-0101-000000001001', 'Picada Urabá (2 pers.)', 'Carne, chorizo, chicharrón, arepa y guacamole', '🥩',
  42000, 48000, 'Platos', true, 0
),
(
  'p1090000-0000-4000-0101-000000000002', 'b1090000-0000-4000-0101-000000001001', 'Picada familiar (4 pers.)', 'Bandeja surtida de parrilla con acompañamientos', '🥩',
  78000, NULL, 'Platos', true, 1
),
(
  'p1090000-0000-4000-0101-000000000003', 'b1090000-0000-4000-0101-000000001001', 'Punta de anca 300g', 'Término a elección, papa criolla y ensalada', '🥩',
  32000, NULL, 'Carnes', true, 2
),
(
  'p1090000-0000-4000-0101-000000000004', 'b1090000-0000-4000-0101-000000001001', 'Costilla BBQ', 'Costilla glaseada, yuca y ensalada', '🍖',
  35000, 39000, 'Carnes', true, 3
),
(
  'p1090000-0000-4000-0101-000000000005', 'b1090000-0000-4000-0101-000000001001', 'Churrasco 350g', 'Corte jugoso, chimichurri de la casa', '🥩',
  38000, NULL, 'Carnes', true, 4
),
(
  'p1090000-0000-4000-0101-000000000006', 'b1090000-0000-4000-0101-000000001001', 'Chorizo artesanal x4', 'Con arepa y hogao', '🌭',
  16000, NULL, 'Entradas', true, 5
),
(
  'p1090000-0000-4000-0101-000000000007', 'b1090000-0000-4000-0101-000000001001', 'Morcilla criolla x3', 'Con limón y ají', '🌭',
  14000, NULL, 'Entradas', true, 6
),
(
  'p1090000-0000-4000-0101-000000000008', 'b1090000-0000-4000-0101-000000001001', 'Chicharrón crocante', 'Porción generosa, limón', '🥓',
  18000, NULL, 'Entradas', true, 7
),
(
  'p1090000-0000-4000-0101-000000000009', 'b1090000-0000-4000-0101-000000001001', 'Arepa de queso', 'Arepa asada rellena', '🫓',
  6000, NULL, 'Acompañamientos', true, 8
),
(
  'p1090000-0000-4000-0101-000000000010', 'b1090000-0000-4000-0101-000000001001', 'Papa criolla salteada', 'Con sal de ajo', '🥔',
  8000, NULL, 'Acompañamientos', true, 9
),
(
  'p1090000-0000-4000-0101-000000000011', 'b1090000-0000-4000-0101-000000001001', 'Yuca frita', 'Con suero costeño', '🥔',
  7000, NULL, 'Acompañamientos', true, 10
),
(
  'p1090000-0000-4000-0101-000000000012', 'b1090000-0000-4000-0101-000000001001', 'Ensalada fresca', 'Lechuga, tomate, cebolla y vinagreta', '🥗',
  7000, NULL, 'Acompañamientos', true, 11
),
(
  'p1090000-0000-4000-0101-000000000013', 'b1090000-0000-4000-0101-000000001001', 'Guacamole casero', 'Porción para compartir', '🥑',
  5000, NULL, 'Salsas', true, 12
),
(
  'p1090000-0000-4000-0101-000000000014', 'b1090000-0000-4000-0101-000000001001', 'Ají de la casa', 'Picante medio', '🌶️',
  2000, NULL, 'Salsas', true, 13
),
(
  'p1090000-0000-4000-0101-000000000015', 'b1090000-0000-4000-0101-000000001001', 'Combo parrillero 1', 'Carne 250g + papa + gaseosa', '🍱',
  28000, 32000, 'Combos', true, 14
),
(
  'p1090000-0000-4000-0101-000000000016', 'b1090000-0000-4000-0101-000000001001', 'Combo parrillero 2', 'Chorizo + chicharrón + arepa + gaseosa', '🍱',
  24000, NULL, 'Combos', true, 15
),
(
  'p1090000-0000-4000-0101-000000000017', 'b1090000-0000-4000-0101-000000001001', 'Menú infantil carne', 'Carne molida, papa y jugo', '🧒',
  16000, NULL, 'Kids', true, 16
),
(
  'p1090000-0000-4000-0101-000000000018', 'b1090000-0000-4000-0101-000000001001', 'Brownie con helado', 'Postre caliente', '🍫',
  12000, NULL, 'Postres', true, 17
),
(
  'p1090000-0000-4000-0101-000000000019', 'b1090000-0000-4000-0101-000000001001', 'Limonada natural 16oz', 'Recién exprimida', '🍋',
  5000, NULL, 'Bebidas', true, 18
),
(
  'p1090000-0000-4000-0101-000000000020', 'b1090000-0000-4000-0101-000000001001', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 19
),
(
  'p1090000-0000-4000-0101-000000000021', 'b1090000-0000-4000-0101-000000001001', 'Agua botella', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 20
),
(
  'p1090000-0000-4000-0101-000000000022', 'b1090000-0000-4000-0101-000000001001', 'Cerveza nacional', 'Unidad fría', '🍺',
  6000, NULL, 'Bebidas', true, 21
),
(
  'p1090000-0000-4000-0101-000000000023', 'b1090000-0000-4000-0101-000000001001', 'Alitas BBQ x8', 'Glaseadas, papas', '🍗',
  26000, NULL, 'Platos', true, 22
),
(
  'p1090000-0000-4000-0101-000000000024', 'b1090000-0000-4000-0101-000000001001', 'Hamburguesa de res', '140g, queso, papas', '🍔',
  22000, NULL, 'Platos', true, 23
),
(
  'p1090000-0000-4000-0101-000000000025', 'b1090000-0000-4000-0101-000000001001', 'Salchipapa especial', 'Salchicha, papa, salsas', '🍟',
  15000, NULL, 'Platos', true, 24
),
(
  'p1090000-0000-4000-0101-000000000026', 'b1090000-0000-4000-0101-000000001001', 'Patacón con hogao', 'Entrada criolla', '🍌',
  9000, NULL, 'Entradas', true, 25
),
(
  'p1090000-0000-4000-0101-000000000027', 'b1090000-0000-4000-0101-000000001001', 'Combo ejecutivo', 'Carne del día + jugo', '🍱',
  20000, NULL, 'Combos', true, 26
),
(
  'p1090000-0000-4000-0101-000000000028', 'b1090000-0000-4000-0101-000000001001', 'Edición plátano maduro', 'Maduro asado con queso', '🍌',
  10000, NULL, 'Edición limitada', true, 27
),
(
  'p1090000-0000-4000-0102-000000000001', 'b1090000-0000-4000-0102-000000001002', 'Pizza margarita mediana', 'Salsa, mozzarella, albahaca', '🍕',
  26000, NULL, 'Pizzas', true, 28
),
(
  'p1090000-0000-4000-0102-000000000002', 'b1090000-0000-4000-0102-000000001002', 'Pizza hawaiana mediana', 'Piña y jamón', '🍕',
  28000, 32000, 'Pizzas', true, 29
),
(
  'p1090000-0000-4000-0102-000000000003', 'b1090000-0000-4000-0102-000000001002', 'Pizza pepperoni mediana', 'Pepperoni extra queso', '🍕',
  30000, NULL, 'Pizzas', true, 30
),
(
  'p1090000-0000-4000-0102-000000000004', 'b1090000-0000-4000-0102-000000001002', 'Pizza pollo BBQ mediana', 'Pollo, cebolla, BBQ', '🍕',
  32000, NULL, 'Pizzas', true, 31
),
(
  'p1090000-0000-4000-0102-000000000005', 'b1090000-0000-4000-0102-000000001002', 'Pizza vegetariana', 'Champiñón, pimentón, aceituna', '🍕',
  29000, NULL, 'Pizzas', true, 32
),
(
  'p1090000-0000-4000-0102-000000000006', 'b1090000-0000-4000-0102-000000001002', 'Pizza familiar 4 sabores', 'Para 4 personas', '🍕',
  52000, NULL, 'Pizzas', true, 33
),
(
  'p1090000-0000-4000-0102-000000000007', 'b1090000-0000-4000-0102-000000001002', 'Pizza premium trufa', 'Champiñón y aceite de trufa', '🍕',
  42000, NULL, 'Premium', true, 34
),
(
  'p1090000-0000-4000-0102-000000000008', 'b1090000-0000-4000-0102-000000001002', 'Lasagna boloñesa', 'Porción individual', '🍝',
  24000, NULL, 'Pastas', true, 35
),
(
  'p1090000-0000-4000-0102-000000000009', 'b1090000-0000-4000-0102-000000001002', 'Spaghetti a la carbonara', 'Crema y tocineta', '🍝',
  22000, NULL, 'Pastas', true, 36
),
(
  'p1090000-0000-4000-0102-000000000010', 'b1090000-0000-4000-0102-000000001002', 'Raviolis de ricotta', 'Salsa pomodoro', '🍝',
  23000, NULL, 'Pastas', true, 37
),
(
  'p1090000-0000-4000-0102-000000000011', 'b1090000-0000-4000-0102-000000001002', 'Pan de ajo', '4 unidades', '🥖',
  9000, NULL, 'Entradas', true, 38
),
(
  'p1090000-0000-4000-0102-000000000012', 'b1090000-0000-4000-0102-000000001002', 'Deditos de queso x6', 'Con salsa ranch', '🧀',
  14000, NULL, 'Entradas', true, 39
),
(
  'p1090000-0000-4000-0102-000000000013', 'b1090000-0000-4000-0102-000000001002', 'Alitas buffalo x6', 'Picante medio', '🍗',
  18000, NULL, 'Entradas', true, 40
),
(
  'p1090000-0000-4000-0102-000000000014', 'b1090000-0000-4000-0102-000000001002', 'Ensalada César', 'Pollo opcional +2000', '🥗',
  16000, NULL, 'Ensaladas', true, 41
),
(
  'p1090000-0000-4000-0102-000000000015', 'b1090000-0000-4000-0102-000000001002', 'Combo pizza + gaseosa', 'Mediana + 1.5L', '🍱',
  34000, 38000, 'Combos', true, 42
),
(
  'p1090000-0000-4000-0102-000000000016', 'b1090000-0000-4000-0102-000000001002', 'Combo pareja', '2 personales + postre', '🍱',
  45000, NULL, 'Combos', true, 43
),
(
  'p1090000-0000-4000-0102-000000000017', 'b1090000-0000-4000-0102-000000001002', 'Pizza kids', 'Personal queso', '🧒',
  15000, NULL, 'Kids', true, 44
),
(
  'p1090000-0000-4000-0102-000000000018', 'b1090000-0000-4000-0102-000000001002', 'Tiramisú', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 45
),
(
  'p1090000-0000-4000-0102-000000000019', 'b1090000-0000-4000-0102-000000001002', 'Gelato 2 bolas', 'Sabores del día', '🍦',
  9000, NULL, 'Postres', true, 46
),
(
  'p1090000-0000-4000-0102-000000000020', 'b1090000-0000-4000-0102-000000001002', 'Limonada de coco', '16oz', '🥥',
  7000, NULL, 'Bebidas', true, 47
),
(
  'p1090000-0000-4000-0102-000000000021', 'b1090000-0000-4000-0102-000000001002', 'Gaseosa 1.5L', 'Para compartir', '🥤',
  7000, NULL, 'Bebidas', true, 48
),
(
  'p1090000-0000-4000-0102-000000000022', 'b1090000-0000-4000-0102-000000001002', 'Té helado', 'Durazno o limón', '🧋',
  5000, NULL, 'Bebidas', true, 49
),
(
  'p1090000-0000-4000-0102-000000000023', 'b1090000-0000-4000-0102-000000001002', 'Extra queso', 'Adición', '🧀',
  4000, NULL, 'Extras', true, 50
),
(
  'p1090000-0000-4000-0102-000000000024', 'b1090000-0000-4000-0102-000000001002', 'Extra pepperoni', 'Adición', '🍕',
  4500, NULL, 'Extras', true, 51
),
(
  'p1090000-0000-4000-0102-000000000025', 'b1090000-0000-4000-0102-000000001002', 'Borde relleno queso', 'Solo medianas/familiares', '🧀',
  6000, NULL, 'Extras', true, 52
),
(
  'p1090000-0000-4000-0102-000000000026', 'b1090000-0000-4000-0102-000000001002', 'Calzone jamón', 'Cerrado al horno', '🥟',
  25000, NULL, 'Platos', true, 53
),
(
  'p1090000-0000-4000-0102-000000000027', 'b1090000-0000-4000-0102-000000001002', 'Focaccia del día', 'Aceite y romero', '🍞',
  10000, NULL, 'Entradas', true, 54
),
(
  'p1090000-0000-4000-0102-000000000028', 'b1090000-0000-4000-0102-000000001002', 'Promo martes 2x1 personal', 'Solo martes, queso', '🏷️',
  18000, NULL, 'Edición limitada', true, 55
),
(
  'p1090000-0000-4000-0103-000000000001', 'b1090000-0000-4000-0103-000000001003', '1/4 pollo broaster', 'Pierna o pechuga, papas', '🍗',
  16000, NULL, 'Pollo', true, 56
),
(
  'p1090000-0000-4000-0103-000000000002', 'b1090000-0000-4000-0103-000000001003', '1/2 pollo broaster', 'Con papas y ensalada', '🍗',
  28000, 32000, 'Pollo', true, 57
),
(
  'p1090000-0000-4000-0103-000000000003', 'b1090000-0000-4000-0103-000000001003', 'Pollo entero broaster', 'Familiar, 8 piezas aprox.', '🍗',
  48000, NULL, 'Pollo', true, 58
),
(
  'p1090000-0000-4000-0103-000000000004', 'b1090000-0000-4000-0103-000000001003', 'Combo 2 piezas', '2 piezas + papas + gaseosa', '🍱',
  18000, NULL, 'Combos', true, 59
),
(
  'p1090000-0000-4000-0103-000000000005', 'b1090000-0000-4000-0103-000000001003', 'Combo 3 piezas', '3 piezas + papas + gaseosa', '🍱',
  22000, 25000, 'Combos', true, 60
),
(
  'p1090000-0000-4000-0103-000000000006', 'b1090000-0000-4000-0103-000000001003', 'Combo familiar', '8 piezas + papas familiares + 1.5L', '🍱',
  62000, NULL, 'Combos', true, 61
),
(
  'p1090000-0000-4000-0103-000000000007', 'b1090000-0000-4000-0103-000000001003', 'Nuggets x10', 'Con salsa a elegir', '🧒',
  14000, NULL, 'Kids', true, 62
),
(
  'p1090000-0000-4000-0103-000000000008', 'b1090000-0000-4000-0103-000000001003', 'Alitas BBQ x6', 'Glaseadas', '🍗',
  17000, NULL, 'Alitas', true, 63
),
(
  'p1090000-0000-4000-0103-000000000009', 'b1090000-0000-4000-0103-000000001003', 'Alitas buffalo x6', 'Picante', '🌶️',
  17000, NULL, 'Alitas', true, 64
),
(
  'p1090000-0000-4000-0103-000000000010', 'b1090000-0000-4000-0103-000000001003', 'Papas grandes', 'Sal y orégano', '🍟',
  8000, NULL, 'Acompañamientos', true, 65
),
(
  'p1090000-0000-4000-0103-000000000011', 'b1090000-0000-4000-0103-000000001003', 'Papas familiares', 'Para compartir', '🍟',
  14000, NULL, 'Acompañamientos', true, 66
),
(
  'p1090000-0000-4000-0103-000000000012', 'b1090000-0000-4000-0103-000000001003', 'Aroz con verduras', 'Porción', '🍚',
  6000, NULL, 'Acompañamientos', true, 67
),
(
  'p1090000-0000-4000-0103-000000000013', 'b1090000-0000-4000-0103-000000001003', 'Ensalada coleslaw', 'Crema ligera', '🥗',
  5000, NULL, 'Acompañamientos', true, 68
),
(
  'p1090000-0000-4000-0103-000000000014', 'b1090000-0000-4000-0103-000000001003', 'Arepa sencilla', 'Asada', '🫓',
  3500, NULL, 'Acompañamientos', true, 69
),
(
  'p1090000-0000-4000-0103-000000000015', 'b1090000-0000-4000-0103-000000001003', 'Salsa BBQ', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 70
),
(
  'p1090000-0000-4000-0103-000000000016', 'b1090000-0000-4000-0103-000000001003', 'Salsa ajo', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 71
),
(
  'p1090000-0000-4000-0103-000000000017', 'b1090000-0000-4000-0103-000000001003', 'Salsa picante', 'Nivel alto', '🌶️',
  2000, NULL, 'Salsas', true, 72
),
(
  'p1090000-0000-4000-0103-000000000018', 'b1090000-0000-4000-0103-000000001003', 'Hamburguesa de pollo', 'Crispy, lechuga, tomate', '🍔',
  19000, NULL, 'Platos', true, 73
),
(
  'p1090000-0000-4000-0103-000000000019', 'b1090000-0000-4000-0103-000000001003', 'Wrap de pollo', 'Tortilla, vegetales', '🌯',
  18000, NULL, 'Platos', true, 74
),
(
  'p1090000-0000-4000-0103-000000000020', 'b1090000-0000-4000-0103-000000001003', 'Menú infantil nuggets', '6 nuggets + papa + jugo', '🧒',
  15000, NULL, 'Kids', true, 75
),
(
  'p1090000-0000-4000-0103-000000000021', 'b1090000-0000-4000-0103-000000001003', 'Postre brownie', 'Unidad', '🍫',
  7000, NULL, 'Postres', true, 76
),
(
  'p1090000-0000-4000-0103-000000000022', 'b1090000-0000-4000-0103-000000001003', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 77
),
(
  'p1090000-0000-4000-0103-000000000023', 'b1090000-0000-4000-0103-000000001003', 'Jugo hit', 'Personal', '🧃',
  4000, NULL, 'Bebidas', true, 78
),
(
  'p1090000-0000-4000-0103-000000000024', 'b1090000-0000-4000-0103-000000001003', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 79
),
(
  'p1090000-0000-4000-0103-000000000025', 'b1090000-0000-4000-0103-000000001003', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 80
),
(
  'p1090000-0000-4000-0103-000000000026', 'b1090000-0000-4000-0103-000000001003', 'Pollo a la plancha', 'Opción más liviana', '🍗',
  20000, NULL, 'Premium', true, 81
),
(
  'p1090000-0000-4000-0103-000000000027', 'b1090000-0000-4000-0103-000000001003', 'Combo oficina', '2 piezas + arroz + té', '🍱',
  17000, NULL, 'Combos', true, 82
),
(
  'p1090000-0000-4000-0103-000000000028', 'b1090000-0000-4000-0103-000000001003', 'Edición miel mostaza', 'Alitas x8', '🍯',
  19000, NULL, 'Edición limitada', true, 83
),
(
  'p1090000-0000-4000-0104-000000000001', 'b1090000-0000-4000-0104-000000001004', 'Clásica Urabá', 'Carne 140g, queso, vegetales', '🍔',
  18000, NULL, 'Hamburguesas', true, 84
),
(
  'p1090000-0000-4000-0104-000000000002', 'b1090000-0000-4000-0104-000000001004', 'Doble smash', 'Dos carnes smash, cheddar', '🍔',
  24000, 27000, 'Hamburguesas', true, 85
),
(
  'p1090000-0000-4000-0104-000000000003', 'b1090000-0000-4000-0104-000000001004', 'BBQ bacon', 'Tocineta, BBQ, cebolla crispy', '🍔',
  26000, NULL, 'Hamburguesas', true, 86
),
(
  'p1090000-0000-4000-0104-000000000004', 'b1090000-0000-4000-0104-000000001004', 'Pollo crispy', 'Pechuga empanizada', '🍔',
  20000, NULL, 'Hamburguesas', true, 87
),
(
  'p1090000-0000-4000-0104-000000000005', 'b1090000-0000-4000-0104-000000001004', 'Veggie bean', 'Hamburguesa de frijol y avena', '🌱',
  19000, NULL, 'Hamburguesas', true, 88
),
(
  'p1090000-0000-4000-0104-000000000006', 'b1090000-0000-4000-0104-000000001004', 'Premium angus', 'Carne 180g, cebolla caramelizada', '🍔',
  32000, NULL, 'Premium', true, 89
),
(
  'p1090000-0000-4000-0104-000000000007', 'b1090000-0000-4000-0104-000000001004', 'Combo clásico', 'Burger + papas + gaseosa', '🍱',
  25000, 28000, 'Combos', true, 90
),
(
  'p1090000-0000-4000-0104-000000000008', 'b1090000-0000-4000-0104-000000001004', 'Combo doble', 'Doble smash + papas + gaseosa', '🍱',
  32000, NULL, 'Combos', true, 91
),
(
  'p1090000-0000-4000-0104-000000000009', 'b1090000-0000-4000-0104-000000001004', 'Papas caseras', 'Porción', '🍟',
  7000, NULL, 'Acompañamientos', true, 92
),
(
  'p1090000-0000-4000-0104-000000000010', 'b1090000-0000-4000-0104-000000001004', 'Papas con queso', 'Cheddar fundido', '🍟',
  10000, NULL, 'Acompañamientos', true, 93
),
(
  'p1090000-0000-4000-0104-000000000011', 'b1090000-0000-4000-0104-000000001004', 'Aros de cebolla', 'Porción', '🧅',
  9000, NULL, 'Acompañamientos', true, 94
),
(
  'p1090000-0000-4000-0104-000000000012', 'b1090000-0000-4000-0104-000000001004', 'Onion rings BBQ', 'Con dip', '🧅',
  10000, NULL, 'Acompañamientos', true, 95
),
(
  'p1090000-0000-4000-0104-000000000013', 'b1090000-0000-4000-0104-000000001004', 'Extra carne', '140g', '🥩',
  7000, NULL, 'Extras', true, 96
),
(
  'p1090000-0000-4000-0104-000000000014', 'b1090000-0000-4000-0104-000000001004', 'Extra tocineta', '2 lonjas', '🥓',
  4000, NULL, 'Extras', true, 97
),
(
  'p1090000-0000-4000-0104-000000000015', 'b1090000-0000-4000-0104-000000001004', 'Extra queso', 'Cheddar', '🧀',
  3000, NULL, 'Extras', true, 98
),
(
  'p1090000-0000-4000-0104-000000000016', 'b1090000-0000-4000-0104-000000001004', 'Kids mini burger', 'Mini + papa + jugo', '🧒',
  14000, NULL, 'Kids', true, 99
),
(
  'p1090000-0000-4000-0104-000000000017', 'b1090000-0000-4000-0104-000000001004', 'Malteada vainilla', '16oz', '🥛',
  10000, NULL, 'Bebidas', true, 0
),
(
  'p1090000-0000-4000-0104-000000000018', 'b1090000-0000-4000-0104-000000001004', 'Malteada chocolate', '16oz', '🍫',
  10000, NULL, 'Bebidas', true, 1
),
(
  'p1090000-0000-4000-0104-000000000019', 'b1090000-0000-4000-0104-000000001004', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 2
),
(
  'p1090000-0000-4000-0104-000000000020', 'b1090000-0000-4000-0104-000000001004', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 3
),
(
  'p1090000-0000-4000-0104-000000000021', 'b1090000-0000-4000-0104-000000001004', 'Hot dog ranchero', 'Con papas', '🌭',
  15000, NULL, 'Platos', true, 4
),
(
  'p1090000-0000-4000-0104-000000000022', 'b1090000-0000-4000-0104-000000001004', 'Salchipapa urbana', 'Salsas a elección', '🍟',
  14000, NULL, 'Platos', true, 5
),
(
  'p1090000-0000-4000-0104-000000000023', 'b1090000-0000-4000-0104-000000001004', 'Brownie', 'Casero', '🍫',
  8000, NULL, 'Postres', true, 6
),
(
  'p1090000-0000-4000-0104-000000000024', 'b1090000-0000-4000-0104-000000001004', 'Cookie con chips', 'Caliente', '🍪',
  6000, NULL, 'Postres', true, 7
),
(
  'p1090000-0000-4000-0104-000000000025', 'b1090000-0000-4000-0104-000000001004', 'Combo noche', 'Burger + malteada', '🌙',
  27000, NULL, 'Combos', true, 8
),
(
  'p1090000-0000-4000-0104-000000000026', 'b1090000-0000-4000-0104-000000001004', 'Salsa de la casa', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 9
),
(
  'p1090000-0000-4000-0104-000000000027', 'b1090000-0000-4000-0104-000000001004', 'Pickles extra', 'Porción', '🥒',
  1500, NULL, 'Extras', true, 10
),
(
  'p1090000-0000-4000-0104-000000000028', 'b1090000-0000-4000-0104-000000001004', 'Edición ají dulce', 'Burger con hogao costeño', '🌶️',
  22000, NULL, 'Edición limitada', true, 11
),
(
  'p1090000-0000-4000-0105-000000000001', 'b1090000-0000-4000-0105-000000001005', 'Café americano', '12oz', '☕',
  4000, NULL, 'Café', true, 12
),
(
  'p1090000-0000-4000-0105-000000000002', 'b1090000-0000-4000-0105-000000001005', 'Café con leche', '12oz', '☕',
  5000, NULL, 'Café', true, 13
),
(
  'p1090000-0000-4000-0105-000000000003', 'b1090000-0000-4000-0105-000000001005', 'Cappuccino', 'Espuma cremosa', '☕',
  7000, NULL, 'Café', true, 14
),
(
  'p1090000-0000-4000-0105-000000000004', 'b1090000-0000-4000-0105-000000001005', 'Latte', '12oz', '☕',
  7500, NULL, 'Café', true, 15
),
(
  'p1090000-0000-4000-0105-000000000005', 'b1090000-0000-4000-0105-000000001005', 'Chocolate caliente', 'Con marshmallow', '🍫',
  7000, NULL, 'Café', true, 16
),
(
  'p1090000-0000-4000-0105-000000000006', 'b1090000-0000-4000-0105-000000001005', 'Tinto costeño', 'Pequeño', '☕',
  2500, NULL, 'Café', true, 17
),
(
  'p1090000-0000-4000-0105-000000000007', 'b1090000-0000-4000-0105-000000001005', 'Desayuno completo', 'Huevos, arepa, queso, café', '🍳',
  14000, 16000, 'Desayunos', true, 18
),
(
  'p1090000-0000-4000-0105-000000000008', 'b1090000-0000-4000-0105-000000001005', 'Desayuno light', 'Yogurt, fruta, granola', '🥣',
  12000, NULL, 'Desayunos', true, 19
),
(
  'p1090000-0000-4000-0105-000000000009', 'b1090000-0000-4000-0105-000000001005', 'Calentado antioqueño', 'Frijol, arroz, carne, huevo', '🍛',
  16000, NULL, 'Desayunos', true, 20
),
(
  'p1090000-0000-4000-0105-000000000010', 'b1090000-0000-4000-0105-000000001005', 'Pandebono x3', 'Calientes', '🧀',
  6000, NULL, 'Panadería', true, 21
),
(
  'p1090000-0000-4000-0105-000000000011', 'b1090000-0000-4000-0105-000000001005', 'Almojábana x2', 'Recién horneada', '🍞',
  5000, NULL, 'Panadería', true, 22
),
(
  'p1090000-0000-4000-0105-000000000012', 'b1090000-0000-4000-0105-000000001005', 'Croissant jamón queso', 'Horno del día', '🥐',
  8000, NULL, 'Panadería', true, 23
),
(
  'p1090000-0000-4000-0105-000000000013', 'b1090000-0000-4000-0105-000000001005', 'Brownie', 'Porción', '🍫',
  7000, NULL, 'Postres', true, 24
),
(
  'p1090000-0000-4000-0105-000000000014', 'b1090000-0000-4000-0105-000000001005', 'Cheesecake frutos rojos', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 25
),
(
  'p1090000-0000-4000-0105-000000000015', 'b1090000-0000-4000-0105-000000001005', 'Muffin del día', 'Sabor rotativo', '🧁',
  5500, NULL, 'Panadería', true, 26
),
(
  'p1090000-0000-4000-0105-000000000016', 'b1090000-0000-4000-0105-000000001005', 'Jugo de naranja', 'Natural 12oz', '🍊',
  6000, NULL, 'Bebidas', true, 27
),
(
  'p1090000-0000-4000-0105-000000000017', 'b1090000-0000-4000-0105-000000001005', 'Limonada de hierbabuena', '16oz', '🍋',
  5500, NULL, 'Bebidas', true, 28
),
(
  'p1090000-0000-4000-0105-000000000018', 'b1090000-0000-4000-0105-000000001005', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 29
),
(
  'p1090000-0000-4000-0105-000000000019', 'b1090000-0000-4000-0105-000000001005', 'Sándwich pollo', 'Pan artesanal', '🥪',
  13000, NULL, 'Platos', true, 30
),
(
  'p1090000-0000-4000-0105-000000000020', 'b1090000-0000-4000-0105-000000001005', 'Sándwich vegetariano', 'Queso y vegetales', '🥪',
  12000, NULL, 'Platos', true, 31
),
(
  'p1090000-0000-4000-0105-000000000021', 'b1090000-0000-4000-0105-000000001005', 'Empanada de carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 32
),
(
  'p1090000-0000-4000-0105-000000000022', 'b1090000-0000-4000-0105-000000001005', 'Combo tarde', 'Café + pandebono', '🍱',
  9000, 11000, 'Combos', true, 33
),
(
  'p1090000-0000-4000-0105-000000000023', 'b1090000-0000-4000-0105-000000001005', 'Combo oficina', 'Sándwich + jugo', '🍱',
  16000, NULL, 'Combos', true, 34
),
(
  'p1090000-0000-4000-0105-000000000024', 'b1090000-0000-4000-0105-000000001005', 'Kids hotcakes', 'Con miel', '🧒',
  10000, NULL, 'Kids', true, 35
),
(
  'p1090000-0000-4000-0105-000000000025', 'b1090000-0000-4000-0105-000000001005', 'Té chai latte', 'Especiado', '🧋',
  8000, NULL, 'Café', true, 36
),
(
  'p1090000-0000-4000-0105-000000000026', 'b1090000-0000-4000-0105-000000001005', 'Affogato', 'Helado + espresso', '🍨',
  9000, NULL, 'Postres', true, 37
),
(
  'p1090000-0000-4000-0105-000000000027', 'b1090000-0000-4000-0105-000000001005', 'Galleta avena', 'Unidad', '🍪',
  3500, NULL, 'Panadería', true, 38
),
(
  'p1090000-0000-4000-0105-000000000028', 'b1090000-0000-4000-0105-000000001005', 'Edición café de Urabá', 'Origen regional 12oz', '☕',
  8500, NULL, 'Edición limitada', true, 39
),
(
  'p1090000-0000-4000-0106-000000000001', 'b1090000-0000-4000-0106-000000001006', 'Arepa de huevo', 'Frita, huevo adentro', '🫓',
  7000, NULL, 'Arepas', true, 40
),
(
  'p1090000-0000-4000-0106-000000000002', 'b1090000-0000-4000-0106-000000001006', 'Arepa de huevo doble', 'Doble huevo', '🫓',
  9000, NULL, 'Arepas', true, 41
),
(
  'p1090000-0000-4000-0106-000000000003', 'b1090000-0000-4000-0106-000000001006', 'Arepa con queso', 'Queso costeño', '🫓',
  6000, NULL, 'Arepas', true, 42
),
(
  'p1090000-0000-4000-0106-000000000004', 'b1090000-0000-4000-0106-000000001006', 'Arepa con todo', 'Huevo, queso, hogao', '🫓',
  10000, NULL, 'Arepas', true, 43
),
(
  'p1090000-0000-4000-0106-000000000005', 'b1090000-0000-4000-0106-000000001006', 'Arepa de pollo', 'Pollo desmechado', '🫓',
  11000, NULL, 'Arepas', true, 44
),
(
  'p1090000-0000-4000-0106-000000000006', 'b1090000-0000-4000-0106-000000001006', 'Arepa de carne', 'Carne desmechada', '🫓',
  12000, NULL, 'Arepas', true, 45
),
(
  'p1090000-0000-4000-0106-000000000007', 'b1090000-0000-4000-0106-000000001006', 'Arepa de chorizo', 'Chorizo y hogao', '🫓',
  11000, NULL, 'Arepas', true, 46
),
(
  'p1090000-0000-4000-0106-000000000008', 'b1090000-0000-4000-0106-000000001006', 'Combo desayuno', 'Arepa huevo + café + jugo', '🍱',
  14000, 16000, 'Combos', true, 47
),
(
  'p1090000-0000-4000-0106-000000000009', 'b1090000-0000-4000-0106-000000001006', 'Combo almuerzo', 'Arepa carne + limonada', '🍱',
  15000, NULL, 'Combos', true, 48
),
(
  'p1090000-0000-4000-0106-000000000010', 'b1090000-0000-4000-0106-000000001006', 'Empanada carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 49
),
(
  'p1090000-0000-4000-0106-000000000011', 'b1090000-0000-4000-0106-000000001006', 'Empanada pollo', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 50
),
(
  'p1090000-0000-4000-0106-000000000012', 'b1090000-0000-4000-0106-000000001006', 'Empanada papa-carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 51
),
(
  'p1090000-0000-4000-0106-000000000013', 'b1090000-0000-4000-0106-000000001006', 'Buñuelo x2', 'Calientes', '🍩',
  4000, NULL, 'Snacks', true, 52
),
(
  'p1090000-0000-4000-0106-000000000014', 'b1090000-0000-4000-0106-000000001006', 'Jugo de mango', 'Natural', '🥭',
  6000, NULL, 'Bebidas', true, 53
),
(
  'p1090000-0000-4000-0106-000000000015', 'b1090000-0000-4000-0106-000000001006', 'Jugo de lulo', 'Natural', '🧃',
  6000, NULL, 'Bebidas', true, 54
),
(
  'p1090000-0000-4000-0106-000000000016', 'b1090000-0000-4000-0106-000000001006', 'Café con leche', 'Vaso', '☕',
  4000, NULL, 'Bebidas', true, 55
),
(
  'p1090000-0000-4000-0106-000000000017', 'b1090000-0000-4000-0106-000000001006', 'Tinto', 'Pequeño', '☕',
  2000, NULL, 'Bebidas', true, 56
),
(
  'p1090000-0000-4000-0106-000000000018', 'b1090000-0000-4000-0106-000000001006', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 57
),
(
  'p1090000-0000-4000-0106-000000000019', 'b1090000-0000-4000-0106-000000001006', 'Suero costeño', 'Porción', '🥛',
  3000, NULL, 'Extras', true, 58
),
(
  'p1090000-0000-4000-0106-000000000020', 'b1090000-0000-4000-0106-000000001006', 'Ají', 'Porción', '🌶️',
  1500, NULL, 'Salsas', true, 59
),
(
  'p1090000-0000-4000-0106-000000000021', 'b1090000-0000-4000-0106-000000001006', 'Hogao', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 60
),
(
  'p1090000-0000-4000-0106-000000000022', 'b1090000-0000-4000-0106-000000001006', 'Kids arepa queso', 'Pequeña + jugo', '🧒',
  9000, NULL, 'Kids', true, 61
),
(
  'p1090000-0000-4000-0106-000000000023', 'b1090000-0000-4000-0106-000000001006', 'Patacón con queso', 'Entrada', '🍌',
  8000, NULL, 'Platos', true, 62
),
(
  'p1090000-0000-4000-0106-000000000024', 'b1090000-0000-4000-0106-000000001006', 'Caldo de costilla', 'Taza', '🍲',
  10000, NULL, 'Platos', true, 63
),
(
  'p1090000-0000-4000-0106-000000000025', 'b1090000-0000-4000-0106-000000001006', 'Changua', 'Desayuno', '🥣',
  9000, NULL, 'Desayunos', true, 64
),
(
  'p1090000-0000-4000-0106-000000000026', 'b1090000-0000-4000-0106-000000001006', 'Huevos pericos', 'Con arepa', '🍳',
  10000, NULL, 'Desayunos', true, 65
),
(
  'p1090000-0000-4000-0106-000000000027', 'b1090000-0000-4000-0106-000000001006', 'Mazamorra', 'Vaso', '🥛',
  5000, NULL, 'Postres', true, 66
),
(
  'p1090000-0000-4000-0106-000000000028', 'b1090000-0000-4000-0106-000000001006', 'Edición arepa de camarón', 'Fines de semana', '🦐',
  14000, NULL, 'Edición limitada', true, 67
),
(
  'p1090000-0000-4000-0107-000000000001', 'b1090000-0000-4000-0107-000000001007', 'Huevos AA x12', 'Cartón', '🥚',
  12000, NULL, 'Lácteos y huevos', true, 68
),
(
  'p1090000-0000-4000-0107-000000000002', 'b1090000-0000-4000-0107-000000001007', 'Leche entera 1L', 'UHT', '🥛',
  5500, NULL, 'Lácteos y huevos', true, 69
),
(
  'p1090000-0000-4000-0107-000000000003', 'b1090000-0000-4000-0107-000000001007', 'Queso costeño 250g', 'Fresco', '🧀',
  9000, NULL, 'Lácteos y huevos', true, 70
),
(
  'p1090000-0000-4000-0107-000000000004', 'b1090000-0000-4000-0107-000000001007', 'Yogurt bebible', 'Unidad', '🥛',
  3500, NULL, 'Lácteos y huevos', true, 71
),
(
  'p1090000-0000-4000-0107-000000000005', 'b1090000-0000-4000-0107-000000001007', 'Pan tajado', 'Bolsa', '🍞',
  6000, NULL, 'Panadería', true, 72
),
(
  'p1090000-0000-4000-0107-000000000006', 'b1090000-0000-4000-0107-000000001007', 'Arroz 1kg', 'Blanco', '🍚',
  4500, NULL, 'Despensa', true, 73
),
(
  'p1090000-0000-4000-0107-000000000007', 'b1090000-0000-4000-0107-000000001007', 'Aceite 1L', 'Vegetal', '🫒',
  12000, 14000, 'Despensa', true, 74
),
(
  'p1090000-0000-4000-0107-000000000008', 'b1090000-0000-4000-0107-000000001007', 'Azúcar 1kg', 'Blanca', '🧂',
  4500, NULL, 'Despensa', true, 75
),
(
  'p1090000-0000-4000-0107-000000000009', 'b1090000-0000-4000-0107-000000001007', 'Sal 1kg', 'Refinada', '🧂',
  2500, NULL, 'Despensa', true, 76
),
(
  'p1090000-0000-4000-0107-000000000010', 'b1090000-0000-4000-0107-000000001007', 'Pasta spaghetti 500g', 'Caja', '🍝',
  4000, NULL, 'Despensa', true, 77
),
(
  'p1090000-0000-4000-0107-000000000011', 'b1090000-0000-4000-0107-000000001007', 'Atún lata', 'Agua o aceite', '🐟',
  5500, NULL, 'Despensa', true, 78
),
(
  'p1090000-0000-4000-0107-000000000012', 'b1090000-0000-4000-0107-000000001007', 'Frijol cargamanto 500g', 'Bolsa', '🫘',
  5000, NULL, 'Despensa', true, 79
),
(
  'p1090000-0000-4000-0107-000000000013', 'b1090000-0000-4000-0107-000000001007', 'Plátano maduro x3', 'Unidad aprox.', '🍌',
  4000, NULL, 'Frutas y verduras', true, 80
),
(
  'p1090000-0000-4000-0107-000000000014', 'b1090000-0000-4000-0107-000000001007', 'Tomate chonto 500g', 'Fresco', '🍅',
  3500, NULL, 'Frutas y verduras', true, 81
),
(
  'p1090000-0000-4000-0107-000000000015', 'b1090000-0000-4000-0107-000000001007', 'Cebolla cabezona 500g', 'Fresco', '🧅',
  3000, NULL, 'Frutas y verduras', true, 82
),
(
  'p1090000-0000-4000-0107-000000000016', 'b1090000-0000-4000-0107-000000001007', 'Papa pastusa 1kg', 'Fresco', '🥔',
  4500, NULL, 'Frutas y verduras', true, 83
),
(
  'p1090000-0000-4000-0107-000000000017', 'b1090000-0000-4000-0107-000000001007', 'Banano x6', 'Racimo pequeño', '🍌',
  4000, NULL, 'Frutas y verduras', true, 84
),
(
  'p1090000-0000-4000-0107-000000000018', 'b1090000-0000-4000-0107-000000001007', 'Limón x5', 'Ácidos', '🍋',
  2500, NULL, 'Frutas y verduras', true, 85
),
(
  'p1090000-0000-4000-0107-000000000019', 'b1090000-0000-4000-0107-000000001007', 'Pollo entero congelado', 'Aprox 1.5kg', '🍗',
  18000, NULL, 'Congelados', true, 86
),
(
  'p1090000-0000-4000-0107-000000000020', 'b1090000-0000-4000-0107-000000001007', 'Carne molida 500g', 'Res', '🥩',
  14000, NULL, 'Carnes', true, 87
),
(
  'p1090000-0000-4000-0107-000000000021', 'b1090000-0000-4000-0107-000000001007', 'Jabón en barra x3', 'Ropa', '🧼',
  8000, NULL, 'Aseo', true, 88
),
(
  'p1090000-0000-4000-0107-000000000022', 'b1090000-0000-4000-0107-000000001007', 'Detergente 1kg', 'En polvo', '🧺',
  12000, NULL, 'Aseo', true, 89
),
(
  'p1090000-0000-4000-0107-000000000023', 'b1090000-0000-4000-0107-000000001007', 'Papel higiénico x4', 'Doble hoja', '🧻',
  10000, 12000, 'Aseo', true, 90
),
(
  'p1090000-0000-4000-0107-000000000024', 'b1090000-0000-4000-0107-000000001007', 'Jabón antibacterial', 'Líquido 250ml', '🧴',
  7000, NULL, 'Cuidado personal', true, 91
),
(
  'p1090000-0000-4000-0107-000000000025', 'b1090000-0000-4000-0107-000000001007', 'Pasta dental', 'Tubo', '🦷',
  6500, NULL, 'Cuidado personal', true, 92
),
(
  'p1090000-0000-4000-0107-000000000026', 'b1090000-0000-4000-0107-000000001007', 'Pañales etapa 3 x10', 'Pack', '👶',
  22000, NULL, 'Bebé', true, 93
),
(
  'p1090000-0000-4000-0107-000000000027', 'b1090000-0000-4000-0107-000000001007', 'Pañitos húmedos', 'Paquete', '👶',
  9000, NULL, 'Bebé', true, 94
),
(
  'p1090000-0000-4000-0107-000000000028', 'b1090000-0000-4000-0107-000000001007', 'Gaseosa 1.5L', 'Sabor a elegir', '🥤',
  7000, NULL, 'Bebidas', true, 95
),
(
  'p1090000-0000-4000-0107-000000000029', 'b1090000-0000-4000-0107-000000001007', 'Agua 6L', 'Bidón', '💧',
  8000, NULL, 'Bebidas', true, 96
),
(
  'p1090000-0000-4000-0107-000000000030', 'b1090000-0000-4000-0107-000000001007', 'Snack papas 150g', 'Bolsa', '🥔',
  5500, NULL, 'Snacks', true, 97
),
(
  'p1090000-0000-4000-0107-000000000031', 'b1090000-0000-4000-0107-000000001007', 'Galletas surtidas', 'Paquete', '🍪',
  4500, NULL, 'Snacks', true, 98
),
(
  'p1090000-0000-4000-0107-000000000032', 'b1090000-0000-4000-0107-000000001007', 'Café molido 250g', 'Tradicional', '☕',
  11000, NULL, 'Despensa', true, 99
),
(
  'p1090000-0000-4000-0108-000000000001', 'b1090000-0000-4000-0108-000000001008', 'Acetaminofén 500mg x20', 'Uso OTC', '💊',
  8000, NULL, 'Analgésicos', true, 0
),
(
  'p1090000-0000-4000-0108-000000000002', 'b1090000-0000-4000-0108-000000001008', 'Ibuprofeno 400mg x10', 'Uso OTC', '💊',
  9000, NULL, 'Analgésicos', true, 1
),
(
  'p1090000-0000-4000-0108-000000000003', 'b1090000-0000-4000-0108-000000001008', 'Suero oral', 'Sobre', '🧪',
  3500, NULL, 'Primeros auxilios', true, 2
),
(
  'p1090000-0000-4000-0108-000000000004', 'b1090000-0000-4000-0108-000000001008', 'Curitas x20', 'Surtidas', '🩹',
  6000, NULL, 'Primeros auxilios', true, 3
),
(
  'p1090000-0000-4000-0108-000000000005', 'b1090000-0000-4000-0108-000000001008', 'Alcohol antiséptico 120ml', 'Botella', '🧴',
  5000, NULL, 'Primeros auxilios', true, 4
),
(
  'p1090000-0000-4000-0108-000000000006', 'b1090000-0000-4000-0108-000000001008', 'Agua oxigenada 120ml', 'Botella', '🧴',
  4500, NULL, 'Primeros auxilios', true, 5
),
(
  'p1090000-0000-4000-0108-000000000007', 'b1090000-0000-4000-0108-000000001008', 'Gasas estériles', 'Paquete', '🩹',
  7000, NULL, 'Primeros auxilios', true, 6
),
(
  'p1090000-0000-4000-0108-000000000008', 'b1090000-0000-4000-0108-000000001008', 'Termómetro digital', 'Unidad', '🌡️',
  25000, NULL, 'Bienestar', true, 7
),
(
  'p1090000-0000-4000-0108-000000000009', 'b1090000-0000-4000-0108-000000001008', 'Vitamina C efervescente', 'Tubo', '🍊',
  18000, 22000, 'Bienestar', true, 8
),
(
  'p1090000-0000-4000-0108-000000000010', 'b1090000-0000-4000-0108-000000001008', 'Multivitamínico x30', 'Tabletas', '💊',
  32000, NULL, 'Bienestar', true, 9
),
(
  'p1090000-0000-4000-0108-000000000011', 'b1090000-0000-4000-0108-000000001008', 'Protector solar FPS50', 'Crema 60ml', '☀️',
  35000, NULL, 'Cuidado personal', true, 10
),
(
  'p1090000-0000-4000-0108-000000000012', 'b1090000-0000-4000-0108-000000001008', 'Crema humectante', '120ml', '🧴',
  18000, NULL, 'Cuidado personal', true, 11
),
(
  'p1090000-0000-4000-0108-000000000013', 'b1090000-0000-4000-0108-000000001008', 'Shampoo anticaspa', '400ml', '🧴',
  22000, NULL, 'Cuidado personal', true, 12
),
(
  'p1090000-0000-4000-0108-000000000014', 'b1090000-0000-4000-0108-000000001008', 'Jabón íntimo', '200ml', '🧴',
  16000, NULL, 'Cuidado personal', true, 13
),
(
  'p1090000-0000-4000-0108-000000000015', 'b1090000-0000-4000-0108-000000001008', 'Toallas higiénicas x10', 'Paquete', '📦',
  9000, NULL, 'Cuidado personal', true, 14
),
(
  'p1090000-0000-4000-0108-000000000016', 'b1090000-0000-4000-0108-000000001008', 'Pañales etapa 2 x12', 'Pack', '👶',
  28000, NULL, 'Bebé', true, 15
),
(
  'p1090000-0000-4000-0108-000000000017', 'b1090000-0000-4000-0108-000000001008', 'Crema antipañalitis', 'Tubo', '👶',
  20000, NULL, 'Bebé', true, 16
),
(
  'p1090000-0000-4000-0108-000000000018', 'b1090000-0000-4000-0108-000000001008', 'Repelente spray', '120ml', '🦟',
  18000, NULL, 'Bienestar', true, 17
),
(
  'p1090000-0000-4000-0108-000000000019', 'b1090000-0000-4000-0108-000000001008', 'Sales de rehidratación', 'Caja x5', '🧪',
  10000, NULL, 'Primeros auxilios', true, 18
),
(
  'p1090000-0000-4000-0108-000000000020', 'b1090000-0000-4000-0108-000000001008', 'Pastillas para la garganta', 'Caja', '🍬',
  8000, NULL, 'Analgésicos', true, 19
),
(
  'p1090000-0000-4000-0108-000000000021', 'b1090000-0000-4000-0108-000000001008', 'Alcohol en gel 60ml', 'Antibacterial', '🧴',
  6000, NULL, 'Cuidado personal', true, 20
),
(
  'p1090000-0000-4000-0108-000000000022', 'b1090000-0000-4000-0108-000000001008', 'Mascarillas x10', 'Desechables', '😷',
  8000, NULL, 'Bienestar', true, 21
),
(
  'p1090000-0000-4000-0108-000000000023', 'b1090000-0000-4000-0108-000000001008', 'Preservativos x3', 'Caja', '📦',
  9000, NULL, 'Cuidado personal', true, 22
),
(
  'p1090000-0000-4000-0108-000000000024', 'b1090000-0000-4000-0108-000000001008', 'Prueba de embarazo', 'Unidad', '🧪',
  12000, NULL, 'Bienestar', true, 23
),
(
  'p1090000-0000-4000-0108-000000000025', 'b1090000-0000-4000-0108-000000001008', 'Algodón 50g', 'Bolsa', '☁️',
  4000, NULL, 'Primeros auxilios', true, 24
),
(
  'p1090000-0000-4000-0108-000000000026', 'b1090000-0000-4000-0108-000000001008', 'Gotas lubricantes oculares', 'Frasco', '👁️',
  22000, NULL, 'Bienestar', true, 25
),
(
  'p1090000-0000-4000-0108-000000000027', 'b1090000-0000-4000-0108-000000001008', 'Jabón neutro', 'Barra', '🧼',
  5000, NULL, 'Cuidado personal', true, 26
),
(
  'p1090000-0000-4000-0108-000000000028', 'b1090000-0000-4000-0108-000000001008', 'Kit viaje básicos', 'Curitas + gel + acetaminofén', '🧰',
  25000, NULL, 'Kits', true, 27
),
(
  'p1090000-0000-4000-0108-000000000029', 'b1090000-0000-4000-0108-000000001008', 'Suero fisiológico', 'Frasco', '💧',
  7000, NULL, 'Primeros auxilios', true, 28
),
(
  'p1090000-0000-4000-0108-000000000030', 'b1090000-0000-4000-0108-000000001008', 'Talco mentolado', '120g', '🧴',
  9000, NULL, 'Cuidado personal', true, 29
),
(
  'p1090000-0000-4000-0109-000000000001', 'b1090000-0000-4000-0109-000000001009', 'Copa 2 sabores', 'Elige tus favoritos', '🍦',
  8000, NULL, 'Helados', true, 30
),
(
  'p1090000-0000-4000-0109-000000000002', 'b1090000-0000-4000-0109-000000001009', 'Copa 3 sabores', 'Con salsa y chispas', '🍦',
  11000, NULL, 'Helados', true, 31
),
(
  'p1090000-0000-4000-0109-000000000003', 'b1090000-0000-4000-0109-000000001009', 'Milkshake fresa', '16oz', '🥤',
  12000, NULL, 'Malteadas', true, 32
),
(
  'p1090000-0000-4000-0109-000000000004', 'b1090000-0000-4000-0109-000000001009', 'Milkshake chocolate', '16oz', '🍫',
  12000, NULL, 'Malteadas', true, 33
),
(
  'p1090000-0000-4000-0109-000000000005', 'b1090000-0000-4000-0109-000000001009', 'Milkshake oreo style', 'Galleta triturada', '🍪',
  13000, NULL, 'Malteadas', true, 34
),
(
  'p1090000-0000-4000-0109-000000000006', 'b1090000-0000-4000-0109-000000001009', 'Sundae brownie', 'Helado + brownie caliente', '🍨',
  14000, 16000, 'Copas', true, 35
),
(
  'p1090000-0000-4000-0109-000000000007', 'b1090000-0000-4000-0109-000000001009', 'Banana split', 'Clásico 3 bolas', '🍌',
  16000, NULL, 'Copas', true, 36
),
(
  'p1090000-0000-4000-0109-000000000008', 'b1090000-0000-4000-0109-000000001009', 'Açaí bowl', 'Granola y fruta', '🫐',
  15000, NULL, 'Bowls', true, 37
),
(
  'p1090000-0000-4000-0109-000000000009', 'b1090000-0000-4000-0109-000000001009', 'Paleta artesanal', 'Sabores del día', '🍡',
  5000, NULL, 'Paletas', true, 38
),
(
  'p1090000-0000-4000-0109-000000000010', 'b1090000-0000-4000-0109-000000001009', 'Paleta cremosa', 'Leche condensada', '🍡',
  5500, NULL, 'Paletas', true, 39
),
(
  'p1090000-0000-4000-0109-000000000011', 'b1090000-0000-4000-0109-000000001009', 'Cono sencillo', '1 bola', '🍦',
  5000, NULL, 'Helados', true, 40
),
(
  'p1090000-0000-4000-0109-000000000012', 'b1090000-0000-4000-0109-000000001009', 'Cono doble', '2 bolas', '🍦',
  8000, NULL, 'Helados', true, 41
),
(
  'p1090000-0000-4000-0109-000000000013', 'b1090000-0000-4000-0109-000000001009', 'Waffle con helado', 'Waffle fresco', '🧇',
  14000, NULL, 'Postres', true, 42
),
(
  'p1090000-0000-4000-0109-000000000014', 'b1090000-0000-4000-0109-000000001009', 'Crepe Nutella', 'Con helado', '🍫',
  15000, NULL, 'Postres', true, 43
),
(
  'p1090000-0000-4000-0109-000000000015', 'b1090000-0000-4000-0109-000000001009', 'Affogato tropical', 'Helado + espresso', '☕',
  10000, NULL, 'Postres', true, 44
),
(
  'p1090000-0000-4000-0109-000000000016', 'b1090000-0000-4000-0109-000000001009', 'Kids mini copa', '1 bola + chispas', '🧒',
  6000, NULL, 'Kids', true, 45
),
(
  'p1090000-0000-4000-0109-000000000017', 'b1090000-0000-4000-0109-000000001009', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 46
),
(
  'p1090000-0000-4000-0109-000000000018', 'b1090000-0000-4000-0109-000000001009', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 47
),
(
  'p1090000-0000-4000-0109-000000000019', 'b1090000-0000-4000-0109-000000001009', 'Limonada de coco', '16oz', '🥥',
  7000, NULL, 'Bebidas', true, 48
),
(
  'p1090000-0000-4000-0109-000000000020', 'b1090000-0000-4000-0109-000000001009', 'Topping Oreo', 'Extra', '🍪',
  2000, NULL, 'Extras', true, 49
),
(
  'p1090000-0000-4000-0109-000000000021', 'b1090000-0000-4000-0109-000000001009', 'Topping salsa chocolate', 'Extra', '🍫',
  1500, NULL, 'Extras', true, 50
),
(
  'p1090000-0000-4000-0109-000000000022', 'b1090000-0000-4000-0109-000000001009', 'Topping frutos secos', 'Extra', '🥜',
  2000, NULL, 'Extras', true, 51
),
(
  'p1090000-0000-4000-0109-000000000023', 'b1090000-0000-4000-0109-000000001009', 'Combo pareja', '2 copas 2 sabores', '🍱',
  15000, NULL, 'Combos', true, 52
),
(
  'p1090000-0000-4000-0109-000000000024', 'b1090000-0000-4000-0109-000000001009', 'Combo familia', 'Copa familiar 1L', '🍱',
  28000, NULL, 'Combos', true, 53
),
(
  'p1090000-0000-4000-0109-000000000025', 'b1090000-0000-4000-0109-000000001009', 'Helado literario', '1 litro para llevar', '📦',
  22000, NULL, 'Para llevar', true, 54
),
(
  'p1090000-0000-4000-0109-000000000026', 'b1090000-0000-4000-0109-000000001009', 'Granizado lulo', 'Vaso', '🧊',
  7000, NULL, 'Granizados', true, 55
),
(
  'p1090000-0000-4000-0109-000000000027', 'b1090000-0000-4000-0109-000000001009', 'Granizado maracuyá', 'Vaso', '🧊',
  7000, NULL, 'Granizados', true, 56
),
(
  'p1090000-0000-4000-0109-000000000028', 'b1090000-0000-4000-0109-000000001009', 'Edición mango biche', 'Temporada', '🥭',
  9000, NULL, 'Edición limitada', true, 57
),
(
  'p1090000-0000-4000-0201-000000000001', 'b1090000-0000-4000-0201-000000002001', 'Picada Urabá (2 pers.)', 'Carne, chorizo, chicharrón, arepa y guacamole', '🥩',
  42000, 48000, 'Platos', true, 58
),
(
  'p1090000-0000-4000-0201-000000000002', 'b1090000-0000-4000-0201-000000002001', 'Picada familiar (4 pers.)', 'Bandeja surtida de parrilla con acompañamientos', '🥩',
  78000, NULL, 'Platos', true, 59
),
(
  'p1090000-0000-4000-0201-000000000003', 'b1090000-0000-4000-0201-000000002001', 'Punta de anca 300g', 'Término a elección, papa criolla y ensalada', '🥩',
  32000, NULL, 'Carnes', true, 60
),
(
  'p1090000-0000-4000-0201-000000000004', 'b1090000-0000-4000-0201-000000002001', 'Costilla BBQ', 'Costilla glaseada, yuca y ensalada', '🍖',
  35000, 39000, 'Carnes', true, 61
),
(
  'p1090000-0000-4000-0201-000000000005', 'b1090000-0000-4000-0201-000000002001', 'Churrasco 350g', 'Corte jugoso, chimichurri de la casa', '🥩',
  38000, NULL, 'Carnes', true, 62
),
(
  'p1090000-0000-4000-0201-000000000006', 'b1090000-0000-4000-0201-000000002001', 'Chorizo artesanal x4', 'Con arepa y hogao', '🌭',
  16000, NULL, 'Entradas', true, 63
),
(
  'p1090000-0000-4000-0201-000000000007', 'b1090000-0000-4000-0201-000000002001', 'Morcilla criolla x3', 'Con limón y ají', '🌭',
  14000, NULL, 'Entradas', true, 64
),
(
  'p1090000-0000-4000-0201-000000000008', 'b1090000-0000-4000-0201-000000002001', 'Chicharrón crocante', 'Porción generosa, limón', '🥓',
  18000, NULL, 'Entradas', true, 65
),
(
  'p1090000-0000-4000-0201-000000000009', 'b1090000-0000-4000-0201-000000002001', 'Arepa de queso', 'Arepa asada rellena', '🫓',
  6000, NULL, 'Acompañamientos', true, 66
),
(
  'p1090000-0000-4000-0201-000000000010', 'b1090000-0000-4000-0201-000000002001', 'Papa criolla salteada', 'Con sal de ajo', '🥔',
  8000, NULL, 'Acompañamientos', true, 67
),
(
  'p1090000-0000-4000-0201-000000000011', 'b1090000-0000-4000-0201-000000002001', 'Yuca frita', 'Con suero costeño', '🥔',
  7000, NULL, 'Acompañamientos', true, 68
),
(
  'p1090000-0000-4000-0201-000000000012', 'b1090000-0000-4000-0201-000000002001', 'Ensalada fresca', 'Lechuga, tomate, cebolla y vinagreta', '🥗',
  7000, NULL, 'Acompañamientos', true, 69
),
(
  'p1090000-0000-4000-0201-000000000013', 'b1090000-0000-4000-0201-000000002001', 'Guacamole casero', 'Porción para compartir', '🥑',
  5000, NULL, 'Salsas', true, 70
),
(
  'p1090000-0000-4000-0201-000000000014', 'b1090000-0000-4000-0201-000000002001', 'Ají de la casa', 'Picante medio', '🌶️',
  2000, NULL, 'Salsas', true, 71
),
(
  'p1090000-0000-4000-0201-000000000015', 'b1090000-0000-4000-0201-000000002001', 'Combo parrillero 1', 'Carne 250g + papa + gaseosa', '🍱',
  28000, 32000, 'Combos', true, 72
),
(
  'p1090000-0000-4000-0201-000000000016', 'b1090000-0000-4000-0201-000000002001', 'Combo parrillero 2', 'Chorizo + chicharrón + arepa + gaseosa', '🍱',
  24000, NULL, 'Combos', true, 73
),
(
  'p1090000-0000-4000-0201-000000000017', 'b1090000-0000-4000-0201-000000002001', 'Menú infantil carne', 'Carne molida, papa y jugo', '🧒',
  16000, NULL, 'Kids', true, 74
),
(
  'p1090000-0000-4000-0201-000000000018', 'b1090000-0000-4000-0201-000000002001', 'Brownie con helado', 'Postre caliente', '🍫',
  12000, NULL, 'Postres', true, 75
),
(
  'p1090000-0000-4000-0201-000000000019', 'b1090000-0000-4000-0201-000000002001', 'Limonada natural 16oz', 'Recién exprimida', '🍋',
  5000, NULL, 'Bebidas', true, 76
),
(
  'p1090000-0000-4000-0201-000000000020', 'b1090000-0000-4000-0201-000000002001', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 77
),
(
  'p1090000-0000-4000-0201-000000000021', 'b1090000-0000-4000-0201-000000002001', 'Agua botella', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 78
),
(
  'p1090000-0000-4000-0201-000000000022', 'b1090000-0000-4000-0201-000000002001', 'Cerveza nacional', 'Unidad fría', '🍺',
  6000, NULL, 'Bebidas', true, 79
),
(
  'p1090000-0000-4000-0201-000000000023', 'b1090000-0000-4000-0201-000000002001', 'Alitas BBQ x8', 'Glaseadas, papas', '🍗',
  26000, NULL, 'Platos', true, 80
),
(
  'p1090000-0000-4000-0201-000000000024', 'b1090000-0000-4000-0201-000000002001', 'Hamburguesa de res', '140g, queso, papas', '🍔',
  22000, NULL, 'Platos', true, 81
),
(
  'p1090000-0000-4000-0201-000000000025', 'b1090000-0000-4000-0201-000000002001', 'Salchipapa especial', 'Salchicha, papa, salsas', '🍟',
  15000, NULL, 'Platos', true, 82
),
(
  'p1090000-0000-4000-0201-000000000026', 'b1090000-0000-4000-0201-000000002001', 'Patacón con hogao', 'Entrada criolla', '🍌',
  9000, NULL, 'Entradas', true, 83
),
(
  'p1090000-0000-4000-0201-000000000027', 'b1090000-0000-4000-0201-000000002001', 'Combo ejecutivo', 'Carne del día + jugo', '🍱',
  20000, NULL, 'Combos', true, 84
),
(
  'p1090000-0000-4000-0201-000000000028', 'b1090000-0000-4000-0201-000000002001', 'Edición plátano maduro', 'Maduro asado con queso', '🍌',
  10000, NULL, 'Edición limitada', true, 85
),
(
  'p1090000-0000-4000-0202-000000000001', 'b1090000-0000-4000-0202-000000002002', 'Pizza margarita mediana', 'Salsa, mozzarella, albahaca', '🍕',
  26000, NULL, 'Pizzas', true, 86
),
(
  'p1090000-0000-4000-0202-000000000002', 'b1090000-0000-4000-0202-000000002002', 'Pizza hawaiana mediana', 'Piña y jamón', '🍕',
  28000, 32000, 'Pizzas', true, 87
),
(
  'p1090000-0000-4000-0202-000000000003', 'b1090000-0000-4000-0202-000000002002', 'Pizza pepperoni mediana', 'Pepperoni extra queso', '🍕',
  30000, NULL, 'Pizzas', true, 88
),
(
  'p1090000-0000-4000-0202-000000000004', 'b1090000-0000-4000-0202-000000002002', 'Pizza pollo BBQ mediana', 'Pollo, cebolla, BBQ', '🍕',
  32000, NULL, 'Pizzas', true, 89
),
(
  'p1090000-0000-4000-0202-000000000005', 'b1090000-0000-4000-0202-000000002002', 'Pizza vegetariana', 'Champiñón, pimentón, aceituna', '🍕',
  29000, NULL, 'Pizzas', true, 90
),
(
  'p1090000-0000-4000-0202-000000000006', 'b1090000-0000-4000-0202-000000002002', 'Pizza familiar 4 sabores', 'Para 4 personas', '🍕',
  52000, NULL, 'Pizzas', true, 91
),
(
  'p1090000-0000-4000-0202-000000000007', 'b1090000-0000-4000-0202-000000002002', 'Pizza premium trufa', 'Champiñón y aceite de trufa', '🍕',
  42000, NULL, 'Premium', true, 92
),
(
  'p1090000-0000-4000-0202-000000000008', 'b1090000-0000-4000-0202-000000002002', 'Lasagna boloñesa', 'Porción individual', '🍝',
  24000, NULL, 'Pastas', true, 93
),
(
  'p1090000-0000-4000-0202-000000000009', 'b1090000-0000-4000-0202-000000002002', 'Spaghetti a la carbonara', 'Crema y tocineta', '🍝',
  22000, NULL, 'Pastas', true, 94
),
(
  'p1090000-0000-4000-0202-000000000010', 'b1090000-0000-4000-0202-000000002002', 'Raviolis de ricotta', 'Salsa pomodoro', '🍝',
  23000, NULL, 'Pastas', true, 95
),
(
  'p1090000-0000-4000-0202-000000000011', 'b1090000-0000-4000-0202-000000002002', 'Pan de ajo', '4 unidades', '🥖',
  9000, NULL, 'Entradas', true, 96
),
(
  'p1090000-0000-4000-0202-000000000012', 'b1090000-0000-4000-0202-000000002002', 'Deditos de queso x6', 'Con salsa ranch', '🧀',
  14000, NULL, 'Entradas', true, 97
),
(
  'p1090000-0000-4000-0202-000000000013', 'b1090000-0000-4000-0202-000000002002', 'Alitas buffalo x6', 'Picante medio', '🍗',
  18000, NULL, 'Entradas', true, 98
),
(
  'p1090000-0000-4000-0202-000000000014', 'b1090000-0000-4000-0202-000000002002', 'Ensalada César', 'Pollo opcional +2000', '🥗',
  16000, NULL, 'Ensaladas', true, 99
),
(
  'p1090000-0000-4000-0202-000000000015', 'b1090000-0000-4000-0202-000000002002', 'Combo pizza + gaseosa', 'Mediana + 1.5L', '🍱',
  34000, 38000, 'Combos', true, 0
),
(
  'p1090000-0000-4000-0202-000000000016', 'b1090000-0000-4000-0202-000000002002', 'Combo pareja', '2 personales + postre', '🍱',
  45000, NULL, 'Combos', true, 1
),
(
  'p1090000-0000-4000-0202-000000000017', 'b1090000-0000-4000-0202-000000002002', 'Pizza kids', 'Personal queso', '🧒',
  15000, NULL, 'Kids', true, 2
),
(
  'p1090000-0000-4000-0202-000000000018', 'b1090000-0000-4000-0202-000000002002', 'Tiramisú', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 3
),
(
  'p1090000-0000-4000-0202-000000000019', 'b1090000-0000-4000-0202-000000002002', 'Gelato 2 bolas', 'Sabores del día', '🍦',
  9000, NULL, 'Postres', true, 4
),
(
  'p1090000-0000-4000-0202-000000000020', 'b1090000-0000-4000-0202-000000002002', 'Limonada de coco', '16oz', '🥥',
  7000, NULL, 'Bebidas', true, 5
),
(
  'p1090000-0000-4000-0202-000000000021', 'b1090000-0000-4000-0202-000000002002', 'Gaseosa 1.5L', 'Para compartir', '🥤',
  7000, NULL, 'Bebidas', true, 6
),
(
  'p1090000-0000-4000-0202-000000000022', 'b1090000-0000-4000-0202-000000002002', 'Té helado', 'Durazno o limón', '🧋',
  5000, NULL, 'Bebidas', true, 7
),
(
  'p1090000-0000-4000-0202-000000000023', 'b1090000-0000-4000-0202-000000002002', 'Extra queso', 'Adición', '🧀',
  4000, NULL, 'Extras', true, 8
),
(
  'p1090000-0000-4000-0202-000000000024', 'b1090000-0000-4000-0202-000000002002', 'Extra pepperoni', 'Adición', '🍕',
  4500, NULL, 'Extras', true, 9
),
(
  'p1090000-0000-4000-0202-000000000025', 'b1090000-0000-4000-0202-000000002002', 'Borde relleno queso', 'Solo medianas/familiares', '🧀',
  6000, NULL, 'Extras', true, 10
),
(
  'p1090000-0000-4000-0202-000000000026', 'b1090000-0000-4000-0202-000000002002', 'Calzone jamón', 'Cerrado al horno', '🥟',
  25000, NULL, 'Platos', true, 11
),
(
  'p1090000-0000-4000-0202-000000000027', 'b1090000-0000-4000-0202-000000002002', 'Focaccia del día', 'Aceite y romero', '🍞',
  10000, NULL, 'Entradas', true, 12
),
(
  'p1090000-0000-4000-0202-000000000028', 'b1090000-0000-4000-0202-000000002002', 'Promo martes 2x1 personal', 'Solo martes, queso', '🏷️',
  18000, NULL, 'Edición limitada', true, 13
),
(
  'p1090000-0000-4000-0203-000000000001', 'b1090000-0000-4000-0203-000000002003', '1/4 pollo broaster', 'Pierna o pechuga, papas', '🍗',
  16000, NULL, 'Pollo', true, 14
),
(
  'p1090000-0000-4000-0203-000000000002', 'b1090000-0000-4000-0203-000000002003', '1/2 pollo broaster', 'Con papas y ensalada', '🍗',
  28000, 32000, 'Pollo', true, 15
),
(
  'p1090000-0000-4000-0203-000000000003', 'b1090000-0000-4000-0203-000000002003', 'Pollo entero broaster', 'Familiar, 8 piezas aprox.', '🍗',
  48000, NULL, 'Pollo', true, 16
),
(
  'p1090000-0000-4000-0203-000000000004', 'b1090000-0000-4000-0203-000000002003', 'Combo 2 piezas', '2 piezas + papas + gaseosa', '🍱',
  18000, NULL, 'Combos', true, 17
),
(
  'p1090000-0000-4000-0203-000000000005', 'b1090000-0000-4000-0203-000000002003', 'Combo 3 piezas', '3 piezas + papas + gaseosa', '🍱',
  22000, 25000, 'Combos', true, 18
),
(
  'p1090000-0000-4000-0203-000000000006', 'b1090000-0000-4000-0203-000000002003', 'Combo familiar', '8 piezas + papas familiares + 1.5L', '🍱',
  62000, NULL, 'Combos', true, 19
),
(
  'p1090000-0000-4000-0203-000000000007', 'b1090000-0000-4000-0203-000000002003', 'Nuggets x10', 'Con salsa a elegir', '🧒',
  14000, NULL, 'Kids', true, 20
),
(
  'p1090000-0000-4000-0203-000000000008', 'b1090000-0000-4000-0203-000000002003', 'Alitas BBQ x6', 'Glaseadas', '🍗',
  17000, NULL, 'Alitas', true, 21
),
(
  'p1090000-0000-4000-0203-000000000009', 'b1090000-0000-4000-0203-000000002003', 'Alitas buffalo x6', 'Picante', '🌶️',
  17000, NULL, 'Alitas', true, 22
),
(
  'p1090000-0000-4000-0203-000000000010', 'b1090000-0000-4000-0203-000000002003', 'Papas grandes', 'Sal y orégano', '🍟',
  8000, NULL, 'Acompañamientos', true, 23
),
(
  'p1090000-0000-4000-0203-000000000011', 'b1090000-0000-4000-0203-000000002003', 'Papas familiares', 'Para compartir', '🍟',
  14000, NULL, 'Acompañamientos', true, 24
),
(
  'p1090000-0000-4000-0203-000000000012', 'b1090000-0000-4000-0203-000000002003', 'Aroz con verduras', 'Porción', '🍚',
  6000, NULL, 'Acompañamientos', true, 25
),
(
  'p1090000-0000-4000-0203-000000000013', 'b1090000-0000-4000-0203-000000002003', 'Ensalada coleslaw', 'Crema ligera', '🥗',
  5000, NULL, 'Acompañamientos', true, 26
),
(
  'p1090000-0000-4000-0203-000000000014', 'b1090000-0000-4000-0203-000000002003', 'Arepa sencilla', 'Asada', '🫓',
  3500, NULL, 'Acompañamientos', true, 27
),
(
  'p1090000-0000-4000-0203-000000000015', 'b1090000-0000-4000-0203-000000002003', 'Salsa BBQ', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 28
),
(
  'p1090000-0000-4000-0203-000000000016', 'b1090000-0000-4000-0203-000000002003', 'Salsa ajo', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 29
),
(
  'p1090000-0000-4000-0203-000000000017', 'b1090000-0000-4000-0203-000000002003', 'Salsa picante', 'Nivel alto', '🌶️',
  2000, NULL, 'Salsas', true, 30
),
(
  'p1090000-0000-4000-0203-000000000018', 'b1090000-0000-4000-0203-000000002003', 'Hamburguesa de pollo', 'Crispy, lechuga, tomate', '🍔',
  19000, NULL, 'Platos', true, 31
),
(
  'p1090000-0000-4000-0203-000000000019', 'b1090000-0000-4000-0203-000000002003', 'Wrap de pollo', 'Tortilla, vegetales', '🌯',
  18000, NULL, 'Platos', true, 32
),
(
  'p1090000-0000-4000-0203-000000000020', 'b1090000-0000-4000-0203-000000002003', 'Menú infantil nuggets', '6 nuggets + papa + jugo', '🧒',
  15000, NULL, 'Kids', true, 33
),
(
  'p1090000-0000-4000-0203-000000000021', 'b1090000-0000-4000-0203-000000002003', 'Postre brownie', 'Unidad', '🍫',
  7000, NULL, 'Postres', true, 34
),
(
  'p1090000-0000-4000-0203-000000000022', 'b1090000-0000-4000-0203-000000002003', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 35
),
(
  'p1090000-0000-4000-0203-000000000023', 'b1090000-0000-4000-0203-000000002003', 'Jugo hit', 'Personal', '🧃',
  4000, NULL, 'Bebidas', true, 36
),
(
  'p1090000-0000-4000-0203-000000000024', 'b1090000-0000-4000-0203-000000002003', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 37
),
(
  'p1090000-0000-4000-0203-000000000025', 'b1090000-0000-4000-0203-000000002003', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 38
),
(
  'p1090000-0000-4000-0203-000000000026', 'b1090000-0000-4000-0203-000000002003', 'Pollo a la plancha', 'Opción más liviana', '🍗',
  20000, NULL, 'Premium', true, 39
),
(
  'p1090000-0000-4000-0203-000000000027', 'b1090000-0000-4000-0203-000000002003', 'Combo oficina', '2 piezas + arroz + té', '🍱',
  17000, NULL, 'Combos', true, 40
),
(
  'p1090000-0000-4000-0203-000000000028', 'b1090000-0000-4000-0203-000000002003', 'Edición miel mostaza', 'Alitas x8', '🍯',
  19000, NULL, 'Edición limitada', true, 41
),
(
  'p1090000-0000-4000-0204-000000000001', 'b1090000-0000-4000-0204-000000002004', 'Clásica Urabá', 'Carne 140g, queso, vegetales', '🍔',
  18000, NULL, 'Hamburguesas', true, 42
),
(
  'p1090000-0000-4000-0204-000000000002', 'b1090000-0000-4000-0204-000000002004', 'Doble smash', 'Dos carnes smash, cheddar', '🍔',
  24000, 27000, 'Hamburguesas', true, 43
),
(
  'p1090000-0000-4000-0204-000000000003', 'b1090000-0000-4000-0204-000000002004', 'BBQ bacon', 'Tocineta, BBQ, cebolla crispy', '🍔',
  26000, NULL, 'Hamburguesas', true, 44
),
(
  'p1090000-0000-4000-0204-000000000004', 'b1090000-0000-4000-0204-000000002004', 'Pollo crispy', 'Pechuga empanizada', '🍔',
  20000, NULL, 'Hamburguesas', true, 45
),
(
  'p1090000-0000-4000-0204-000000000005', 'b1090000-0000-4000-0204-000000002004', 'Veggie bean', 'Hamburguesa de frijol y avena', '🌱',
  19000, NULL, 'Hamburguesas', true, 46
),
(
  'p1090000-0000-4000-0204-000000000006', 'b1090000-0000-4000-0204-000000002004', 'Premium angus', 'Carne 180g, cebolla caramelizada', '🍔',
  32000, NULL, 'Premium', true, 47
),
(
  'p1090000-0000-4000-0204-000000000007', 'b1090000-0000-4000-0204-000000002004', 'Combo clásico', 'Burger + papas + gaseosa', '🍱',
  25000, 28000, 'Combos', true, 48
),
(
  'p1090000-0000-4000-0204-000000000008', 'b1090000-0000-4000-0204-000000002004', 'Combo doble', 'Doble smash + papas + gaseosa', '🍱',
  32000, NULL, 'Combos', true, 49
),
(
  'p1090000-0000-4000-0204-000000000009', 'b1090000-0000-4000-0204-000000002004', 'Papas caseras', 'Porción', '🍟',
  7000, NULL, 'Acompañamientos', true, 50
),
(
  'p1090000-0000-4000-0204-000000000010', 'b1090000-0000-4000-0204-000000002004', 'Papas con queso', 'Cheddar fundido', '🍟',
  10000, NULL, 'Acompañamientos', true, 51
),
(
  'p1090000-0000-4000-0204-000000000011', 'b1090000-0000-4000-0204-000000002004', 'Aros de cebolla', 'Porción', '🧅',
  9000, NULL, 'Acompañamientos', true, 52
),
(
  'p1090000-0000-4000-0204-000000000012', 'b1090000-0000-4000-0204-000000002004', 'Onion rings BBQ', 'Con dip', '🧅',
  10000, NULL, 'Acompañamientos', true, 53
),
(
  'p1090000-0000-4000-0204-000000000013', 'b1090000-0000-4000-0204-000000002004', 'Extra carne', '140g', '🥩',
  7000, NULL, 'Extras', true, 54
),
(
  'p1090000-0000-4000-0204-000000000014', 'b1090000-0000-4000-0204-000000002004', 'Extra tocineta', '2 lonjas', '🥓',
  4000, NULL, 'Extras', true, 55
),
(
  'p1090000-0000-4000-0204-000000000015', 'b1090000-0000-4000-0204-000000002004', 'Extra queso', 'Cheddar', '🧀',
  3000, NULL, 'Extras', true, 56
),
(
  'p1090000-0000-4000-0204-000000000016', 'b1090000-0000-4000-0204-000000002004', 'Kids mini burger', 'Mini + papa + jugo', '🧒',
  14000, NULL, 'Kids', true, 57
),
(
  'p1090000-0000-4000-0204-000000000017', 'b1090000-0000-4000-0204-000000002004', 'Malteada vainilla', '16oz', '🥛',
  10000, NULL, 'Bebidas', true, 58
),
(
  'p1090000-0000-4000-0204-000000000018', 'b1090000-0000-4000-0204-000000002004', 'Malteada chocolate', '16oz', '🍫',
  10000, NULL, 'Bebidas', true, 59
),
(
  'p1090000-0000-4000-0204-000000000019', 'b1090000-0000-4000-0204-000000002004', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 60
),
(
  'p1090000-0000-4000-0204-000000000020', 'b1090000-0000-4000-0204-000000002004', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 61
),
(
  'p1090000-0000-4000-0204-000000000021', 'b1090000-0000-4000-0204-000000002004', 'Hot dog ranchero', 'Con papas', '🌭',
  15000, NULL, 'Platos', true, 62
),
(
  'p1090000-0000-4000-0204-000000000022', 'b1090000-0000-4000-0204-000000002004', 'Salchipapa urbana', 'Salsas a elección', '🍟',
  14000, NULL, 'Platos', true, 63
),
(
  'p1090000-0000-4000-0204-000000000023', 'b1090000-0000-4000-0204-000000002004', 'Brownie', 'Casero', '🍫',
  8000, NULL, 'Postres', true, 64
),
(
  'p1090000-0000-4000-0204-000000000024', 'b1090000-0000-4000-0204-000000002004', 'Cookie con chips', 'Caliente', '🍪',
  6000, NULL, 'Postres', true, 65
),
(
  'p1090000-0000-4000-0204-000000000025', 'b1090000-0000-4000-0204-000000002004', 'Combo noche', 'Burger + malteada', '🌙',
  27000, NULL, 'Combos', true, 66
),
(
  'p1090000-0000-4000-0204-000000000026', 'b1090000-0000-4000-0204-000000002004', 'Salsa de la casa', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 67
),
(
  'p1090000-0000-4000-0204-000000000027', 'b1090000-0000-4000-0204-000000002004', 'Pickles extra', 'Porción', '🥒',
  1500, NULL, 'Extras', true, 68
),
(
  'p1090000-0000-4000-0204-000000000028', 'b1090000-0000-4000-0204-000000002004', 'Edición ají dulce', 'Burger con hogao costeño', '🌶️',
  22000, NULL, 'Edición limitada', true, 69
),
(
  'p1090000-0000-4000-0205-000000000001', 'b1090000-0000-4000-0205-000000002005', 'Café americano', '12oz', '☕',
  4000, NULL, 'Café', true, 70
),
(
  'p1090000-0000-4000-0205-000000000002', 'b1090000-0000-4000-0205-000000002005', 'Café con leche', '12oz', '☕',
  5000, NULL, 'Café', true, 71
),
(
  'p1090000-0000-4000-0205-000000000003', 'b1090000-0000-4000-0205-000000002005', 'Cappuccino', 'Espuma cremosa', '☕',
  7000, NULL, 'Café', true, 72
),
(
  'p1090000-0000-4000-0205-000000000004', 'b1090000-0000-4000-0205-000000002005', 'Latte', '12oz', '☕',
  7500, NULL, 'Café', true, 73
),
(
  'p1090000-0000-4000-0205-000000000005', 'b1090000-0000-4000-0205-000000002005', 'Chocolate caliente', 'Con marshmallow', '🍫',
  7000, NULL, 'Café', true, 74
),
(
  'p1090000-0000-4000-0205-000000000006', 'b1090000-0000-4000-0205-000000002005', 'Tinto costeño', 'Pequeño', '☕',
  2500, NULL, 'Café', true, 75
),
(
  'p1090000-0000-4000-0205-000000000007', 'b1090000-0000-4000-0205-000000002005', 'Desayuno completo', 'Huevos, arepa, queso, café', '🍳',
  14000, 16000, 'Desayunos', true, 76
),
(
  'p1090000-0000-4000-0205-000000000008', 'b1090000-0000-4000-0205-000000002005', 'Desayuno light', 'Yogurt, fruta, granola', '🥣',
  12000, NULL, 'Desayunos', true, 77
),
(
  'p1090000-0000-4000-0205-000000000009', 'b1090000-0000-4000-0205-000000002005', 'Calentado antioqueño', 'Frijol, arroz, carne, huevo', '🍛',
  16000, NULL, 'Desayunos', true, 78
),
(
  'p1090000-0000-4000-0205-000000000010', 'b1090000-0000-4000-0205-000000002005', 'Pandebono x3', 'Calientes', '🧀',
  6000, NULL, 'Panadería', true, 79
),
(
  'p1090000-0000-4000-0205-000000000011', 'b1090000-0000-4000-0205-000000002005', 'Almojábana x2', 'Recién horneada', '🍞',
  5000, NULL, 'Panadería', true, 80
),
(
  'p1090000-0000-4000-0205-000000000012', 'b1090000-0000-4000-0205-000000002005', 'Croissant jamón queso', 'Horno del día', '🥐',
  8000, NULL, 'Panadería', true, 81
),
(
  'p1090000-0000-4000-0205-000000000013', 'b1090000-0000-4000-0205-000000002005', 'Brownie', 'Porción', '🍫',
  7000, NULL, 'Postres', true, 82
),
(
  'p1090000-0000-4000-0205-000000000014', 'b1090000-0000-4000-0205-000000002005', 'Cheesecake frutos rojos', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 83
),
(
  'p1090000-0000-4000-0205-000000000015', 'b1090000-0000-4000-0205-000000002005', 'Muffin del día', 'Sabor rotativo', '🧁',
  5500, NULL, 'Panadería', true, 84
),
(
  'p1090000-0000-4000-0205-000000000016', 'b1090000-0000-4000-0205-000000002005', 'Jugo de naranja', 'Natural 12oz', '🍊',
  6000, NULL, 'Bebidas', true, 85
),
(
  'p1090000-0000-4000-0205-000000000017', 'b1090000-0000-4000-0205-000000002005', 'Limonada de hierbabuena', '16oz', '🍋',
  5500, NULL, 'Bebidas', true, 86
),
(
  'p1090000-0000-4000-0205-000000000018', 'b1090000-0000-4000-0205-000000002005', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 87
),
(
  'p1090000-0000-4000-0205-000000000019', 'b1090000-0000-4000-0205-000000002005', 'Sándwich pollo', 'Pan artesanal', '🥪',
  13000, NULL, 'Platos', true, 88
),
(
  'p1090000-0000-4000-0205-000000000020', 'b1090000-0000-4000-0205-000000002005', 'Sándwich vegetariano', 'Queso y vegetales', '🥪',
  12000, NULL, 'Platos', true, 89
),
(
  'p1090000-0000-4000-0205-000000000021', 'b1090000-0000-4000-0205-000000002005', 'Empanada de carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 90
),
(
  'p1090000-0000-4000-0205-000000000022', 'b1090000-0000-4000-0205-000000002005', 'Combo tarde', 'Café + pandebono', '🍱',
  9000, 11000, 'Combos', true, 91
),
(
  'p1090000-0000-4000-0205-000000000023', 'b1090000-0000-4000-0205-000000002005', 'Combo oficina', 'Sándwich + jugo', '🍱',
  16000, NULL, 'Combos', true, 92
),
(
  'p1090000-0000-4000-0205-000000000024', 'b1090000-0000-4000-0205-000000002005', 'Kids hotcakes', 'Con miel', '🧒',
  10000, NULL, 'Kids', true, 93
),
(
  'p1090000-0000-4000-0205-000000000025', 'b1090000-0000-4000-0205-000000002005', 'Té chai latte', 'Especiado', '🧋',
  8000, NULL, 'Café', true, 94
),
(
  'p1090000-0000-4000-0205-000000000026', 'b1090000-0000-4000-0205-000000002005', 'Affogato', 'Helado + espresso', '🍨',
  9000, NULL, 'Postres', true, 95
),
(
  'p1090000-0000-4000-0205-000000000027', 'b1090000-0000-4000-0205-000000002005', 'Galleta avena', 'Unidad', '🍪',
  3500, NULL, 'Panadería', true, 96
),
(
  'p1090000-0000-4000-0205-000000000028', 'b1090000-0000-4000-0205-000000002005', 'Edición café de Urabá', 'Origen regional 12oz', '☕',
  8500, NULL, 'Edición limitada', true, 97
),
(
  'p1090000-0000-4000-0206-000000000001', 'b1090000-0000-4000-0206-000000002006', 'Arepa de huevo', 'Frita, huevo adentro', '🫓',
  7000, NULL, 'Arepas', true, 98
),
(
  'p1090000-0000-4000-0206-000000000002', 'b1090000-0000-4000-0206-000000002006', 'Arepa de huevo doble', 'Doble huevo', '🫓',
  9000, NULL, 'Arepas', true, 99
),
(
  'p1090000-0000-4000-0206-000000000003', 'b1090000-0000-4000-0206-000000002006', 'Arepa con queso', 'Queso costeño', '🫓',
  6000, NULL, 'Arepas', true, 0
),
(
  'p1090000-0000-4000-0206-000000000004', 'b1090000-0000-4000-0206-000000002006', 'Arepa con todo', 'Huevo, queso, hogao', '🫓',
  10000, NULL, 'Arepas', true, 1
),
(
  'p1090000-0000-4000-0206-000000000005', 'b1090000-0000-4000-0206-000000002006', 'Arepa de pollo', 'Pollo desmechado', '🫓',
  11000, NULL, 'Arepas', true, 2
),
(
  'p1090000-0000-4000-0206-000000000006', 'b1090000-0000-4000-0206-000000002006', 'Arepa de carne', 'Carne desmechada', '🫓',
  12000, NULL, 'Arepas', true, 3
),
(
  'p1090000-0000-4000-0206-000000000007', 'b1090000-0000-4000-0206-000000002006', 'Arepa de chorizo', 'Chorizo y hogao', '🫓',
  11000, NULL, 'Arepas', true, 4
),
(
  'p1090000-0000-4000-0206-000000000008', 'b1090000-0000-4000-0206-000000002006', 'Combo desayuno', 'Arepa huevo + café + jugo', '🍱',
  14000, 16000, 'Combos', true, 5
),
(
  'p1090000-0000-4000-0206-000000000009', 'b1090000-0000-4000-0206-000000002006', 'Combo almuerzo', 'Arepa carne + limonada', '🍱',
  15000, NULL, 'Combos', true, 6
),
(
  'p1090000-0000-4000-0206-000000000010', 'b1090000-0000-4000-0206-000000002006', 'Empanada carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 7
),
(
  'p1090000-0000-4000-0206-000000000011', 'b1090000-0000-4000-0206-000000002006', 'Empanada pollo', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 8
),
(
  'p1090000-0000-4000-0206-000000000012', 'b1090000-0000-4000-0206-000000002006', 'Empanada papa-carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 9
),
(
  'p1090000-0000-4000-0206-000000000013', 'b1090000-0000-4000-0206-000000002006', 'Buñuelo x2', 'Calientes', '🍩',
  4000, NULL, 'Snacks', true, 10
),
(
  'p1090000-0000-4000-0206-000000000014', 'b1090000-0000-4000-0206-000000002006', 'Jugo de mango', 'Natural', '🥭',
  6000, NULL, 'Bebidas', true, 11
),
(
  'p1090000-0000-4000-0206-000000000015', 'b1090000-0000-4000-0206-000000002006', 'Jugo de lulo', 'Natural', '🧃',
  6000, NULL, 'Bebidas', true, 12
),
(
  'p1090000-0000-4000-0206-000000000016', 'b1090000-0000-4000-0206-000000002006', 'Café con leche', 'Vaso', '☕',
  4000, NULL, 'Bebidas', true, 13
),
(
  'p1090000-0000-4000-0206-000000000017', 'b1090000-0000-4000-0206-000000002006', 'Tinto', 'Pequeño', '☕',
  2000, NULL, 'Bebidas', true, 14
),
(
  'p1090000-0000-4000-0206-000000000018', 'b1090000-0000-4000-0206-000000002006', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 15
),
(
  'p1090000-0000-4000-0206-000000000019', 'b1090000-0000-4000-0206-000000002006', 'Suero costeño', 'Porción', '🥛',
  3000, NULL, 'Extras', true, 16
),
(
  'p1090000-0000-4000-0206-000000000020', 'b1090000-0000-4000-0206-000000002006', 'Ají', 'Porción', '🌶️',
  1500, NULL, 'Salsas', true, 17
),
(
  'p1090000-0000-4000-0206-000000000021', 'b1090000-0000-4000-0206-000000002006', 'Hogao', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 18
),
(
  'p1090000-0000-4000-0206-000000000022', 'b1090000-0000-4000-0206-000000002006', 'Kids arepa queso', 'Pequeña + jugo', '🧒',
  9000, NULL, 'Kids', true, 19
),
(
  'p1090000-0000-4000-0206-000000000023', 'b1090000-0000-4000-0206-000000002006', 'Patacón con queso', 'Entrada', '🍌',
  8000, NULL, 'Platos', true, 20
),
(
  'p1090000-0000-4000-0206-000000000024', 'b1090000-0000-4000-0206-000000002006', 'Caldo de costilla', 'Taza', '🍲',
  10000, NULL, 'Platos', true, 21
),
(
  'p1090000-0000-4000-0206-000000000025', 'b1090000-0000-4000-0206-000000002006', 'Changua', 'Desayuno', '🥣',
  9000, NULL, 'Desayunos', true, 22
),
(
  'p1090000-0000-4000-0206-000000000026', 'b1090000-0000-4000-0206-000000002006', 'Huevos pericos', 'Con arepa', '🍳',
  10000, NULL, 'Desayunos', true, 23
),
(
  'p1090000-0000-4000-0206-000000000027', 'b1090000-0000-4000-0206-000000002006', 'Mazamorra', 'Vaso', '🥛',
  5000, NULL, 'Postres', true, 24
),
(
  'p1090000-0000-4000-0206-000000000028', 'b1090000-0000-4000-0206-000000002006', 'Edición arepa de camarón', 'Fines de semana', '🦐',
  14000, NULL, 'Edición limitada', true, 25
),
(
  'p1090000-0000-4000-0207-000000000001', 'b1090000-0000-4000-0207-000000002007', 'Huevos AA x12', 'Cartón', '🥚',
  12000, NULL, 'Lácteos y huevos', true, 26
),
(
  'p1090000-0000-4000-0207-000000000002', 'b1090000-0000-4000-0207-000000002007', 'Leche entera 1L', 'UHT', '🥛',
  5500, NULL, 'Lácteos y huevos', true, 27
),
(
  'p1090000-0000-4000-0207-000000000003', 'b1090000-0000-4000-0207-000000002007', 'Queso costeño 250g', 'Fresco', '🧀',
  9000, NULL, 'Lácteos y huevos', true, 28
),
(
  'p1090000-0000-4000-0207-000000000004', 'b1090000-0000-4000-0207-000000002007', 'Yogurt bebible', 'Unidad', '🥛',
  3500, NULL, 'Lácteos y huevos', true, 29
),
(
  'p1090000-0000-4000-0207-000000000005', 'b1090000-0000-4000-0207-000000002007', 'Pan tajado', 'Bolsa', '🍞',
  6000, NULL, 'Panadería', true, 30
),
(
  'p1090000-0000-4000-0207-000000000006', 'b1090000-0000-4000-0207-000000002007', 'Arroz 1kg', 'Blanco', '🍚',
  4500, NULL, 'Despensa', true, 31
),
(
  'p1090000-0000-4000-0207-000000000007', 'b1090000-0000-4000-0207-000000002007', 'Aceite 1L', 'Vegetal', '🫒',
  12000, 14000, 'Despensa', true, 32
),
(
  'p1090000-0000-4000-0207-000000000008', 'b1090000-0000-4000-0207-000000002007', 'Azúcar 1kg', 'Blanca', '🧂',
  4500, NULL, 'Despensa', true, 33
),
(
  'p1090000-0000-4000-0207-000000000009', 'b1090000-0000-4000-0207-000000002007', 'Sal 1kg', 'Refinada', '🧂',
  2500, NULL, 'Despensa', true, 34
),
(
  'p1090000-0000-4000-0207-000000000010', 'b1090000-0000-4000-0207-000000002007', 'Pasta spaghetti 500g', 'Caja', '🍝',
  4000, NULL, 'Despensa', true, 35
),
(
  'p1090000-0000-4000-0207-000000000011', 'b1090000-0000-4000-0207-000000002007', 'Atún lata', 'Agua o aceite', '🐟',
  5500, NULL, 'Despensa', true, 36
),
(
  'p1090000-0000-4000-0207-000000000012', 'b1090000-0000-4000-0207-000000002007', 'Frijol cargamanto 500g', 'Bolsa', '🫘',
  5000, NULL, 'Despensa', true, 37
),
(
  'p1090000-0000-4000-0207-000000000013', 'b1090000-0000-4000-0207-000000002007', 'Plátano maduro x3', 'Unidad aprox.', '🍌',
  4000, NULL, 'Frutas y verduras', true, 38
),
(
  'p1090000-0000-4000-0207-000000000014', 'b1090000-0000-4000-0207-000000002007', 'Tomate chonto 500g', 'Fresco', '🍅',
  3500, NULL, 'Frutas y verduras', true, 39
),
(
  'p1090000-0000-4000-0207-000000000015', 'b1090000-0000-4000-0207-000000002007', 'Cebolla cabezona 500g', 'Fresco', '🧅',
  3000, NULL, 'Frutas y verduras', true, 40
),
(
  'p1090000-0000-4000-0207-000000000016', 'b1090000-0000-4000-0207-000000002007', 'Papa pastusa 1kg', 'Fresco', '🥔',
  4500, NULL, 'Frutas y verduras', true, 41
),
(
  'p1090000-0000-4000-0207-000000000017', 'b1090000-0000-4000-0207-000000002007', 'Banano x6', 'Racimo pequeño', '🍌',
  4000, NULL, 'Frutas y verduras', true, 42
),
(
  'p1090000-0000-4000-0207-000000000018', 'b1090000-0000-4000-0207-000000002007', 'Limón x5', 'Ácidos', '🍋',
  2500, NULL, 'Frutas y verduras', true, 43
),
(
  'p1090000-0000-4000-0207-000000000019', 'b1090000-0000-4000-0207-000000002007', 'Pollo entero congelado', 'Aprox 1.5kg', '🍗',
  18000, NULL, 'Congelados', true, 44
),
(
  'p1090000-0000-4000-0207-000000000020', 'b1090000-0000-4000-0207-000000002007', 'Carne molida 500g', 'Res', '🥩',
  14000, NULL, 'Carnes', true, 45
),
(
  'p1090000-0000-4000-0207-000000000021', 'b1090000-0000-4000-0207-000000002007', 'Jabón en barra x3', 'Ropa', '🧼',
  8000, NULL, 'Aseo', true, 46
),
(
  'p1090000-0000-4000-0207-000000000022', 'b1090000-0000-4000-0207-000000002007', 'Detergente 1kg', 'En polvo', '🧺',
  12000, NULL, 'Aseo', true, 47
),
(
  'p1090000-0000-4000-0207-000000000023', 'b1090000-0000-4000-0207-000000002007', 'Papel higiénico x4', 'Doble hoja', '🧻',
  10000, 12000, 'Aseo', true, 48
),
(
  'p1090000-0000-4000-0207-000000000024', 'b1090000-0000-4000-0207-000000002007', 'Jabón antibacterial', 'Líquido 250ml', '🧴',
  7000, NULL, 'Cuidado personal', true, 49
),
(
  'p1090000-0000-4000-0207-000000000025', 'b1090000-0000-4000-0207-000000002007', 'Pasta dental', 'Tubo', '🦷',
  6500, NULL, 'Cuidado personal', true, 50
),
(
  'p1090000-0000-4000-0207-000000000026', 'b1090000-0000-4000-0207-000000002007', 'Pañales etapa 3 x10', 'Pack', '👶',
  22000, NULL, 'Bebé', true, 51
),
(
  'p1090000-0000-4000-0207-000000000027', 'b1090000-0000-4000-0207-000000002007', 'Pañitos húmedos', 'Paquete', '👶',
  9000, NULL, 'Bebé', true, 52
),
(
  'p1090000-0000-4000-0207-000000000028', 'b1090000-0000-4000-0207-000000002007', 'Gaseosa 1.5L', 'Sabor a elegir', '🥤',
  7000, NULL, 'Bebidas', true, 53
),
(
  'p1090000-0000-4000-0207-000000000029', 'b1090000-0000-4000-0207-000000002007', 'Agua 6L', 'Bidón', '💧',
  8000, NULL, 'Bebidas', true, 54
),
(
  'p1090000-0000-4000-0207-000000000030', 'b1090000-0000-4000-0207-000000002007', 'Snack papas 150g', 'Bolsa', '🥔',
  5500, NULL, 'Snacks', true, 55
),
(
  'p1090000-0000-4000-0207-000000000031', 'b1090000-0000-4000-0207-000000002007', 'Galletas surtidas', 'Paquete', '🍪',
  4500, NULL, 'Snacks', true, 56
),
(
  'p1090000-0000-4000-0207-000000000032', 'b1090000-0000-4000-0207-000000002007', 'Café molido 250g', 'Tradicional', '☕',
  11000, NULL, 'Despensa', true, 57
),
(
  'p1090000-0000-4000-0208-000000000001', 'b1090000-0000-4000-0208-000000002008', 'Acetaminofén 500mg x20', 'Uso OTC', '💊',
  8000, NULL, 'Analgésicos', true, 58
),
(
  'p1090000-0000-4000-0208-000000000002', 'b1090000-0000-4000-0208-000000002008', 'Ibuprofeno 400mg x10', 'Uso OTC', '💊',
  9000, NULL, 'Analgésicos', true, 59
),
(
  'p1090000-0000-4000-0208-000000000003', 'b1090000-0000-4000-0208-000000002008', 'Suero oral', 'Sobre', '🧪',
  3500, NULL, 'Primeros auxilios', true, 60
),
(
  'p1090000-0000-4000-0208-000000000004', 'b1090000-0000-4000-0208-000000002008', 'Curitas x20', 'Surtidas', '🩹',
  6000, NULL, 'Primeros auxilios', true, 61
),
(
  'p1090000-0000-4000-0208-000000000005', 'b1090000-0000-4000-0208-000000002008', 'Alcohol antiséptico 120ml', 'Botella', '🧴',
  5000, NULL, 'Primeros auxilios', true, 62
),
(
  'p1090000-0000-4000-0208-000000000006', 'b1090000-0000-4000-0208-000000002008', 'Agua oxigenada 120ml', 'Botella', '🧴',
  4500, NULL, 'Primeros auxilios', true, 63
),
(
  'p1090000-0000-4000-0208-000000000007', 'b1090000-0000-4000-0208-000000002008', 'Gasas estériles', 'Paquete', '🩹',
  7000, NULL, 'Primeros auxilios', true, 64
),
(
  'p1090000-0000-4000-0208-000000000008', 'b1090000-0000-4000-0208-000000002008', 'Termómetro digital', 'Unidad', '🌡️',
  25000, NULL, 'Bienestar', true, 65
),
(
  'p1090000-0000-4000-0208-000000000009', 'b1090000-0000-4000-0208-000000002008', 'Vitamina C efervescente', 'Tubo', '🍊',
  18000, 22000, 'Bienestar', true, 66
),
(
  'p1090000-0000-4000-0208-000000000010', 'b1090000-0000-4000-0208-000000002008', 'Multivitamínico x30', 'Tabletas', '💊',
  32000, NULL, 'Bienestar', true, 67
),
(
  'p1090000-0000-4000-0208-000000000011', 'b1090000-0000-4000-0208-000000002008', 'Protector solar FPS50', 'Crema 60ml', '☀️',
  35000, NULL, 'Cuidado personal', true, 68
),
(
  'p1090000-0000-4000-0208-000000000012', 'b1090000-0000-4000-0208-000000002008', 'Crema humectante', '120ml', '🧴',
  18000, NULL, 'Cuidado personal', true, 69
),
(
  'p1090000-0000-4000-0208-000000000013', 'b1090000-0000-4000-0208-000000002008', 'Shampoo anticaspa', '400ml', '🧴',
  22000, NULL, 'Cuidado personal', true, 70
),
(
  'p1090000-0000-4000-0208-000000000014', 'b1090000-0000-4000-0208-000000002008', 'Jabón íntimo', '200ml', '🧴',
  16000, NULL, 'Cuidado personal', true, 71
),
(
  'p1090000-0000-4000-0208-000000000015', 'b1090000-0000-4000-0208-000000002008', 'Toallas higiénicas x10', 'Paquete', '📦',
  9000, NULL, 'Cuidado personal', true, 72
),
(
  'p1090000-0000-4000-0208-000000000016', 'b1090000-0000-4000-0208-000000002008', 'Pañales etapa 2 x12', 'Pack', '👶',
  28000, NULL, 'Bebé', true, 73
),
(
  'p1090000-0000-4000-0208-000000000017', 'b1090000-0000-4000-0208-000000002008', 'Crema antipañalitis', 'Tubo', '👶',
  20000, NULL, 'Bebé', true, 74
),
(
  'p1090000-0000-4000-0208-000000000018', 'b1090000-0000-4000-0208-000000002008', 'Repelente spray', '120ml', '🦟',
  18000, NULL, 'Bienestar', true, 75
),
(
  'p1090000-0000-4000-0208-000000000019', 'b1090000-0000-4000-0208-000000002008', 'Sales de rehidratación', 'Caja x5', '🧪',
  10000, NULL, 'Primeros auxilios', true, 76
),
(
  'p1090000-0000-4000-0208-000000000020', 'b1090000-0000-4000-0208-000000002008', 'Pastillas para la garganta', 'Caja', '🍬',
  8000, NULL, 'Analgésicos', true, 77
),
(
  'p1090000-0000-4000-0208-000000000021', 'b1090000-0000-4000-0208-000000002008', 'Alcohol en gel 60ml', 'Antibacterial', '🧴',
  6000, NULL, 'Cuidado personal', true, 78
),
(
  'p1090000-0000-4000-0208-000000000022', 'b1090000-0000-4000-0208-000000002008', 'Mascarillas x10', 'Desechables', '😷',
  8000, NULL, 'Bienestar', true, 79
),
(
  'p1090000-0000-4000-0208-000000000023', 'b1090000-0000-4000-0208-000000002008', 'Preservativos x3', 'Caja', '📦',
  9000, NULL, 'Cuidado personal', true, 80
),
(
  'p1090000-0000-4000-0208-000000000024', 'b1090000-0000-4000-0208-000000002008', 'Prueba de embarazo', 'Unidad', '🧪',
  12000, NULL, 'Bienestar', true, 81
),
(
  'p1090000-0000-4000-0208-000000000025', 'b1090000-0000-4000-0208-000000002008', 'Algodón 50g', 'Bolsa', '☁️',
  4000, NULL, 'Primeros auxilios', true, 82
),
(
  'p1090000-0000-4000-0208-000000000026', 'b1090000-0000-4000-0208-000000002008', 'Gotas lubricantes oculares', 'Frasco', '👁️',
  22000, NULL, 'Bienestar', true, 83
),
(
  'p1090000-0000-4000-0208-000000000027', 'b1090000-0000-4000-0208-000000002008', 'Jabón neutro', 'Barra', '🧼',
  5000, NULL, 'Cuidado personal', true, 84
),
(
  'p1090000-0000-4000-0208-000000000028', 'b1090000-0000-4000-0208-000000002008', 'Kit viaje básicos', 'Curitas + gel + acetaminofén', '🧰',
  25000, NULL, 'Kits', true, 85
),
(
  'p1090000-0000-4000-0208-000000000029', 'b1090000-0000-4000-0208-000000002008', 'Suero fisiológico', 'Frasco', '💧',
  7000, NULL, 'Primeros auxilios', true, 86
),
(
  'p1090000-0000-4000-0208-000000000030', 'b1090000-0000-4000-0208-000000002008', 'Talco mentolado', '120g', '🧴',
  9000, NULL, 'Cuidado personal', true, 87
),
(
  'p1090000-0000-4000-0209-000000000001', 'b1090000-0000-4000-0209-000000002009', 'Cargador USB-C 20W', 'Carga rápida', '🔌',
  35000, 42000, 'Cargadores', true, 88
),
(
  'p1090000-0000-4000-0209-000000000002', 'b1090000-0000-4000-0209-000000002009', 'Cable USB-C 1m', 'Reforzado', '🔌',
  18000, NULL, 'Cables', true, 89
),
(
  'p1090000-0000-4000-0209-000000000003', 'b1090000-0000-4000-0209-000000002009', 'Cable Lightning compatible', '1m', '🔌',
  22000, NULL, 'Cables', true, 90
),
(
  'p1090000-0000-4000-0209-000000000004', 'b1090000-0000-4000-0209-000000002009', 'Power bank 10000mAh', 'Compacto', '🔋',
  65000, 75000, 'Energía', true, 91
),
(
  'p1090000-0000-4000-0209-000000000005', 'b1090000-0000-4000-0209-000000002009', 'Audífonos in-ear', 'Con micrófono', '🎧',
  28000, NULL, 'Audio', true, 92
),
(
  'p1090000-0000-4000-0209-000000000006', 'b1090000-0000-4000-0209-000000002009', 'Audífonos Bluetooth', 'Over-ear livianos', '🎧',
  85000, NULL, 'Audio', true, 93
),
(
  'p1090000-0000-4000-0209-000000000007', 'b1090000-0000-4000-0209-000000002009', 'Case transparente universal', 'TPU', '📱',
  15000, NULL, 'Fundas', true, 94
),
(
  'p1090000-0000-4000-0209-000000000008', 'b1090000-0000-4000-0209-000000002009', 'Case antichoque', 'Bordes reforzados', '📱',
  25000, NULL, 'Fundas', true, 95
),
(
  'p1090000-0000-4000-0209-000000000009', 'b1090000-0000-4000-0209-000000002009', 'Vidrio templado', 'Universal 6.1–6.7"', '🛡️',
  18000, NULL, 'Protectores', true, 96
),
(
  'p1090000-0000-4000-0209-000000000010', 'b1090000-0000-4000-0209-000000002009', 'Soporte para carro', 'Magnético', '🚗',
  30000, NULL, 'Accesorios', true, 97
),
(
  'p1090000-0000-4000-0209-000000000011', 'b1090000-0000-4000-0209-000000002009', 'Mouse inalámbrico', 'USB', '🖱️',
  45000, NULL, 'Computación', true, 98
),
(
  'p1090000-0000-4000-0209-000000000012', 'b1090000-0000-4000-0209-000000002009', 'Teclado compacto', 'USB', '⌨️',
  55000, NULL, 'Computación', true, 99
),
(
  'p1090000-0000-4000-0209-000000000013', 'b1090000-0000-4000-0209-000000002009', 'Memoria USB 32GB', 'USB 3.0', '💾',
  28000, NULL, 'Almacenamiento', true, 0
),
(
  'p1090000-0000-4000-0209-000000000014', 'b1090000-0000-4000-0209-000000002009', 'Memoria USB 64GB', 'USB 3.0', '💾',
  40000, NULL, 'Almacenamiento', true, 1
),
(
  'p1090000-0000-4000-0209-000000000015', 'b1090000-0000-4000-0209-000000002009', 'Adaptador HDMI', 'USB-C a HDMI', '🖥️',
  48000, NULL, 'Adaptadores', true, 2
),
(
  'p1090000-0000-4000-0209-000000000016', 'b1090000-0000-4000-0209-000000002009', 'Lámpara LED USB', 'Flexible', '💡',
  22000, NULL, 'Smart home', true, 3
),
(
  'p1090000-0000-4000-0209-000000000017', 'b1090000-0000-4000-0209-000000002009', 'Enchufe smart WiFi', 'App', '🔌',
  70000, NULL, 'Smart home', true, 4
),
(
  'p1090000-0000-4000-0209-000000000018', 'b1090000-0000-4000-0209-000000002009', 'Control TV universal', 'Compatible', '📺',
  35000, NULL, 'Accesorios', true, 5
),
(
  'p1090000-0000-4000-0209-000000000019', 'b1090000-0000-4000-0209-000000002009', 'Parlante Bluetooth mini', 'Resistente', '🔊',
  90000, 110000, 'Audio', true, 6
),
(
  'p1090000-0000-4000-0209-000000000020', 'b1090000-0000-4000-0209-000000002009', 'Gamepad Bluetooth', 'Android/PC', '🎮',
  95000, NULL, 'Gaming', true, 7
),
(
  'p1090000-0000-4000-0209-000000000021', 'b1090000-0000-4000-0209-000000002009', 'Base cooler laptop', 'USB', '💻',
  60000, NULL, 'Computación', true, 8
),
(
  'p1090000-0000-4000-0209-000000000022', 'b1090000-0000-4000-0209-000000002009', 'Hub USB 4 puertos', 'USB 3.0', '🔌',
  40000, NULL, 'Adaptadores', true, 9
),
(
  'p1090000-0000-4000-0209-000000000023', 'b1090000-0000-4000-0209-000000002009', 'Cargador de carro dual', 'USB-A + USB-C', '🚗',
  32000, NULL, 'Cargadores', true, 10
),
(
  'p1090000-0000-4000-0209-000000000024', 'b1090000-0000-4000-0209-000000002009', 'Soporte celular escritorio', 'Ajustable', '📱',
  20000, NULL, 'Accesorios', true, 11
),
(
  'p1090000-0000-4000-0209-000000000025', 'b1090000-0000-4000-0209-000000002009', 'Kit limpieza pantallas', 'Spray + paño', '🧹',
  15000, NULL, 'Accesorios', true, 12
),
(
  'p1090000-0000-4000-0209-000000000026', 'b1090000-0000-4000-0209-000000002009', 'Tarjeta microSD 64GB', 'Clase 10', '💾',
  45000, NULL, 'Almacenamiento', true, 13
),
(
  'p1090000-0000-4000-0209-000000000027', 'b1090000-0000-4000-0209-000000002009', 'Auriculares gaming', 'Mic boom', '🎧',
  120000, NULL, 'Gaming', true, 14
),
(
  'p1090000-0000-4000-0209-000000000028', 'b1090000-0000-4000-0209-000000002009', 'Cable HDMI 2m', 'Full HD', '🖥️',
  25000, NULL, 'Cables', true, 15
),
(
  'p1090000-0000-4000-0301-000000000001', 'b1090000-0000-4000-0301-000000003001', 'Picada Urabá (2 pers.)', 'Carne, chorizo, chicharrón, arepa y guacamole', '🥩',
  42000, 48000, 'Platos', true, 16
),
(
  'p1090000-0000-4000-0301-000000000002', 'b1090000-0000-4000-0301-000000003001', 'Picada familiar (4 pers.)', 'Bandeja surtida de parrilla con acompañamientos', '🥩',
  78000, NULL, 'Platos', true, 17
),
(
  'p1090000-0000-4000-0301-000000000003', 'b1090000-0000-4000-0301-000000003001', 'Punta de anca 300g', 'Término a elección, papa criolla y ensalada', '🥩',
  32000, NULL, 'Carnes', true, 18
),
(
  'p1090000-0000-4000-0301-000000000004', 'b1090000-0000-4000-0301-000000003001', 'Costilla BBQ', 'Costilla glaseada, yuca y ensalada', '🍖',
  35000, 39000, 'Carnes', true, 19
),
(
  'p1090000-0000-4000-0301-000000000005', 'b1090000-0000-4000-0301-000000003001', 'Churrasco 350g', 'Corte jugoso, chimichurri de la casa', '🥩',
  38000, NULL, 'Carnes', true, 20
),
(
  'p1090000-0000-4000-0301-000000000006', 'b1090000-0000-4000-0301-000000003001', 'Chorizo artesanal x4', 'Con arepa y hogao', '🌭',
  16000, NULL, 'Entradas', true, 21
),
(
  'p1090000-0000-4000-0301-000000000007', 'b1090000-0000-4000-0301-000000003001', 'Morcilla criolla x3', 'Con limón y ají', '🌭',
  14000, NULL, 'Entradas', true, 22
),
(
  'p1090000-0000-4000-0301-000000000008', 'b1090000-0000-4000-0301-000000003001', 'Chicharrón crocante', 'Porción generosa, limón', '🥓',
  18000, NULL, 'Entradas', true, 23
),
(
  'p1090000-0000-4000-0301-000000000009', 'b1090000-0000-4000-0301-000000003001', 'Arepa de queso', 'Arepa asada rellena', '🫓',
  6000, NULL, 'Acompañamientos', true, 24
),
(
  'p1090000-0000-4000-0301-000000000010', 'b1090000-0000-4000-0301-000000003001', 'Papa criolla salteada', 'Con sal de ajo', '🥔',
  8000, NULL, 'Acompañamientos', true, 25
),
(
  'p1090000-0000-4000-0301-000000000011', 'b1090000-0000-4000-0301-000000003001', 'Yuca frita', 'Con suero costeño', '🥔',
  7000, NULL, 'Acompañamientos', true, 26
),
(
  'p1090000-0000-4000-0301-000000000012', 'b1090000-0000-4000-0301-000000003001', 'Ensalada fresca', 'Lechuga, tomate, cebolla y vinagreta', '🥗',
  7000, NULL, 'Acompañamientos', true, 27
),
(
  'p1090000-0000-4000-0301-000000000013', 'b1090000-0000-4000-0301-000000003001', 'Guacamole casero', 'Porción para compartir', '🥑',
  5000, NULL, 'Salsas', true, 28
),
(
  'p1090000-0000-4000-0301-000000000014', 'b1090000-0000-4000-0301-000000003001', 'Ají de la casa', 'Picante medio', '🌶️',
  2000, NULL, 'Salsas', true, 29
),
(
  'p1090000-0000-4000-0301-000000000015', 'b1090000-0000-4000-0301-000000003001', 'Combo parrillero 1', 'Carne 250g + papa + gaseosa', '🍱',
  28000, 32000, 'Combos', true, 30
),
(
  'p1090000-0000-4000-0301-000000000016', 'b1090000-0000-4000-0301-000000003001', 'Combo parrillero 2', 'Chorizo + chicharrón + arepa + gaseosa', '🍱',
  24000, NULL, 'Combos', true, 31
),
(
  'p1090000-0000-4000-0301-000000000017', 'b1090000-0000-4000-0301-000000003001', 'Menú infantil carne', 'Carne molida, papa y jugo', '🧒',
  16000, NULL, 'Kids', true, 32
),
(
  'p1090000-0000-4000-0301-000000000018', 'b1090000-0000-4000-0301-000000003001', 'Brownie con helado', 'Postre caliente', '🍫',
  12000, NULL, 'Postres', true, 33
),
(
  'p1090000-0000-4000-0301-000000000019', 'b1090000-0000-4000-0301-000000003001', 'Limonada natural 16oz', 'Recién exprimida', '🍋',
  5000, NULL, 'Bebidas', true, 34
),
(
  'p1090000-0000-4000-0301-000000000020', 'b1090000-0000-4000-0301-000000003001', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 35
),
(
  'p1090000-0000-4000-0301-000000000021', 'b1090000-0000-4000-0301-000000003001', 'Agua botella', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 36
),
(
  'p1090000-0000-4000-0301-000000000022', 'b1090000-0000-4000-0301-000000003001', 'Cerveza nacional', 'Unidad fría', '🍺',
  6000, NULL, 'Bebidas', true, 37
),
(
  'p1090000-0000-4000-0301-000000000023', 'b1090000-0000-4000-0301-000000003001', 'Alitas BBQ x8', 'Glaseadas, papas', '🍗',
  26000, NULL, 'Platos', true, 38
),
(
  'p1090000-0000-4000-0301-000000000024', 'b1090000-0000-4000-0301-000000003001', 'Hamburguesa de res', '140g, queso, papas', '🍔',
  22000, NULL, 'Platos', true, 39
),
(
  'p1090000-0000-4000-0301-000000000025', 'b1090000-0000-4000-0301-000000003001', 'Salchipapa especial', 'Salchicha, papa, salsas', '🍟',
  15000, NULL, 'Platos', true, 40
),
(
  'p1090000-0000-4000-0301-000000000026', 'b1090000-0000-4000-0301-000000003001', 'Patacón con hogao', 'Entrada criolla', '🍌',
  9000, NULL, 'Entradas', true, 41
),
(
  'p1090000-0000-4000-0301-000000000027', 'b1090000-0000-4000-0301-000000003001', 'Combo ejecutivo', 'Carne del día + jugo', '🍱',
  20000, NULL, 'Combos', true, 42
),
(
  'p1090000-0000-4000-0301-000000000028', 'b1090000-0000-4000-0301-000000003001', 'Edición plátano maduro', 'Maduro asado con queso', '🍌',
  10000, NULL, 'Edición limitada', true, 43
),
(
  'p1090000-0000-4000-0302-000000000001', 'b1090000-0000-4000-0302-000000003002', 'Pizza margarita mediana', 'Salsa, mozzarella, albahaca', '🍕',
  26000, NULL, 'Pizzas', true, 44
),
(
  'p1090000-0000-4000-0302-000000000002', 'b1090000-0000-4000-0302-000000003002', 'Pizza hawaiana mediana', 'Piña y jamón', '🍕',
  28000, 32000, 'Pizzas', true, 45
),
(
  'p1090000-0000-4000-0302-000000000003', 'b1090000-0000-4000-0302-000000003002', 'Pizza pepperoni mediana', 'Pepperoni extra queso', '🍕',
  30000, NULL, 'Pizzas', true, 46
),
(
  'p1090000-0000-4000-0302-000000000004', 'b1090000-0000-4000-0302-000000003002', 'Pizza pollo BBQ mediana', 'Pollo, cebolla, BBQ', '🍕',
  32000, NULL, 'Pizzas', true, 47
),
(
  'p1090000-0000-4000-0302-000000000005', 'b1090000-0000-4000-0302-000000003002', 'Pizza vegetariana', 'Champiñón, pimentón, aceituna', '🍕',
  29000, NULL, 'Pizzas', true, 48
),
(
  'p1090000-0000-4000-0302-000000000006', 'b1090000-0000-4000-0302-000000003002', 'Pizza familiar 4 sabores', 'Para 4 personas', '🍕',
  52000, NULL, 'Pizzas', true, 49
),
(
  'p1090000-0000-4000-0302-000000000007', 'b1090000-0000-4000-0302-000000003002', 'Pizza premium trufa', 'Champiñón y aceite de trufa', '🍕',
  42000, NULL, 'Premium', true, 50
),
(
  'p1090000-0000-4000-0302-000000000008', 'b1090000-0000-4000-0302-000000003002', 'Lasagna boloñesa', 'Porción individual', '🍝',
  24000, NULL, 'Pastas', true, 51
),
(
  'p1090000-0000-4000-0302-000000000009', 'b1090000-0000-4000-0302-000000003002', 'Spaghetti a la carbonara', 'Crema y tocineta', '🍝',
  22000, NULL, 'Pastas', true, 52
),
(
  'p1090000-0000-4000-0302-000000000010', 'b1090000-0000-4000-0302-000000003002', 'Raviolis de ricotta', 'Salsa pomodoro', '🍝',
  23000, NULL, 'Pastas', true, 53
),
(
  'p1090000-0000-4000-0302-000000000011', 'b1090000-0000-4000-0302-000000003002', 'Pan de ajo', '4 unidades', '🥖',
  9000, NULL, 'Entradas', true, 54
),
(
  'p1090000-0000-4000-0302-000000000012', 'b1090000-0000-4000-0302-000000003002', 'Deditos de queso x6', 'Con salsa ranch', '🧀',
  14000, NULL, 'Entradas', true, 55
),
(
  'p1090000-0000-4000-0302-000000000013', 'b1090000-0000-4000-0302-000000003002', 'Alitas buffalo x6', 'Picante medio', '🍗',
  18000, NULL, 'Entradas', true, 56
),
(
  'p1090000-0000-4000-0302-000000000014', 'b1090000-0000-4000-0302-000000003002', 'Ensalada César', 'Pollo opcional +2000', '🥗',
  16000, NULL, 'Ensaladas', true, 57
),
(
  'p1090000-0000-4000-0302-000000000015', 'b1090000-0000-4000-0302-000000003002', 'Combo pizza + gaseosa', 'Mediana + 1.5L', '🍱',
  34000, 38000, 'Combos', true, 58
),
(
  'p1090000-0000-4000-0302-000000000016', 'b1090000-0000-4000-0302-000000003002', 'Combo pareja', '2 personales + postre', '🍱',
  45000, NULL, 'Combos', true, 59
),
(
  'p1090000-0000-4000-0302-000000000017', 'b1090000-0000-4000-0302-000000003002', 'Pizza kids', 'Personal queso', '🧒',
  15000, NULL, 'Kids', true, 60
),
(
  'p1090000-0000-4000-0302-000000000018', 'b1090000-0000-4000-0302-000000003002', 'Tiramisú', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 61
),
(
  'p1090000-0000-4000-0302-000000000019', 'b1090000-0000-4000-0302-000000003002', 'Gelato 2 bolas', 'Sabores del día', '🍦',
  9000, NULL, 'Postres', true, 62
),
(
  'p1090000-0000-4000-0302-000000000020', 'b1090000-0000-4000-0302-000000003002', 'Limonada de coco', '16oz', '🥥',
  7000, NULL, 'Bebidas', true, 63
),
(
  'p1090000-0000-4000-0302-000000000021', 'b1090000-0000-4000-0302-000000003002', 'Gaseosa 1.5L', 'Para compartir', '🥤',
  7000, NULL, 'Bebidas', true, 64
),
(
  'p1090000-0000-4000-0302-000000000022', 'b1090000-0000-4000-0302-000000003002', 'Té helado', 'Durazno o limón', '🧋',
  5000, NULL, 'Bebidas', true, 65
),
(
  'p1090000-0000-4000-0302-000000000023', 'b1090000-0000-4000-0302-000000003002', 'Extra queso', 'Adición', '🧀',
  4000, NULL, 'Extras', true, 66
),
(
  'p1090000-0000-4000-0302-000000000024', 'b1090000-0000-4000-0302-000000003002', 'Extra pepperoni', 'Adición', '🍕',
  4500, NULL, 'Extras', true, 67
),
(
  'p1090000-0000-4000-0302-000000000025', 'b1090000-0000-4000-0302-000000003002', 'Borde relleno queso', 'Solo medianas/familiares', '🧀',
  6000, NULL, 'Extras', true, 68
),
(
  'p1090000-0000-4000-0302-000000000026', 'b1090000-0000-4000-0302-000000003002', 'Calzone jamón', 'Cerrado al horno', '🥟',
  25000, NULL, 'Platos', true, 69
),
(
  'p1090000-0000-4000-0302-000000000027', 'b1090000-0000-4000-0302-000000003002', 'Focaccia del día', 'Aceite y romero', '🍞',
  10000, NULL, 'Entradas', true, 70
),
(
  'p1090000-0000-4000-0302-000000000028', 'b1090000-0000-4000-0302-000000003002', 'Promo martes 2x1 personal', 'Solo martes, queso', '🏷️',
  18000, NULL, 'Edición limitada', true, 71
),
(
  'p1090000-0000-4000-0303-000000000001', 'b1090000-0000-4000-0303-000000003003', '1/4 pollo broaster', 'Pierna o pechuga, papas', '🍗',
  16000, NULL, 'Pollo', true, 72
),
(
  'p1090000-0000-4000-0303-000000000002', 'b1090000-0000-4000-0303-000000003003', '1/2 pollo broaster', 'Con papas y ensalada', '🍗',
  28000, 32000, 'Pollo', true, 73
),
(
  'p1090000-0000-4000-0303-000000000003', 'b1090000-0000-4000-0303-000000003003', 'Pollo entero broaster', 'Familiar, 8 piezas aprox.', '🍗',
  48000, NULL, 'Pollo', true, 74
),
(
  'p1090000-0000-4000-0303-000000000004', 'b1090000-0000-4000-0303-000000003003', 'Combo 2 piezas', '2 piezas + papas + gaseosa', '🍱',
  18000, NULL, 'Combos', true, 75
),
(
  'p1090000-0000-4000-0303-000000000005', 'b1090000-0000-4000-0303-000000003003', 'Combo 3 piezas', '3 piezas + papas + gaseosa', '🍱',
  22000, 25000, 'Combos', true, 76
),
(
  'p1090000-0000-4000-0303-000000000006', 'b1090000-0000-4000-0303-000000003003', 'Combo familiar', '8 piezas + papas familiares + 1.5L', '🍱',
  62000, NULL, 'Combos', true, 77
),
(
  'p1090000-0000-4000-0303-000000000007', 'b1090000-0000-4000-0303-000000003003', 'Nuggets x10', 'Con salsa a elegir', '🧒',
  14000, NULL, 'Kids', true, 78
),
(
  'p1090000-0000-4000-0303-000000000008', 'b1090000-0000-4000-0303-000000003003', 'Alitas BBQ x6', 'Glaseadas', '🍗',
  17000, NULL, 'Alitas', true, 79
),
(
  'p1090000-0000-4000-0303-000000000009', 'b1090000-0000-4000-0303-000000003003', 'Alitas buffalo x6', 'Picante', '🌶️',
  17000, NULL, 'Alitas', true, 80
),
(
  'p1090000-0000-4000-0303-000000000010', 'b1090000-0000-4000-0303-000000003003', 'Papas grandes', 'Sal y orégano', '🍟',
  8000, NULL, 'Acompañamientos', true, 81
),
(
  'p1090000-0000-4000-0303-000000000011', 'b1090000-0000-4000-0303-000000003003', 'Papas familiares', 'Para compartir', '🍟',
  14000, NULL, 'Acompañamientos', true, 82
),
(
  'p1090000-0000-4000-0303-000000000012', 'b1090000-0000-4000-0303-000000003003', 'Aroz con verduras', 'Porción', '🍚',
  6000, NULL, 'Acompañamientos', true, 83
),
(
  'p1090000-0000-4000-0303-000000000013', 'b1090000-0000-4000-0303-000000003003', 'Ensalada coleslaw', 'Crema ligera', '🥗',
  5000, NULL, 'Acompañamientos', true, 84
),
(
  'p1090000-0000-4000-0303-000000000014', 'b1090000-0000-4000-0303-000000003003', 'Arepa sencilla', 'Asada', '🫓',
  3500, NULL, 'Acompañamientos', true, 85
),
(
  'p1090000-0000-4000-0303-000000000015', 'b1090000-0000-4000-0303-000000003003', 'Salsa BBQ', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 86
),
(
  'p1090000-0000-4000-0303-000000000016', 'b1090000-0000-4000-0303-000000003003', 'Salsa ajo', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 87
),
(
  'p1090000-0000-4000-0303-000000000017', 'b1090000-0000-4000-0303-000000003003', 'Salsa picante', 'Nivel alto', '🌶️',
  2000, NULL, 'Salsas', true, 88
),
(
  'p1090000-0000-4000-0303-000000000018', 'b1090000-0000-4000-0303-000000003003', 'Hamburguesa de pollo', 'Crispy, lechuga, tomate', '🍔',
  19000, NULL, 'Platos', true, 89
),
(
  'p1090000-0000-4000-0303-000000000019', 'b1090000-0000-4000-0303-000000003003', 'Wrap de pollo', 'Tortilla, vegetales', '🌯',
  18000, NULL, 'Platos', true, 90
),
(
  'p1090000-0000-4000-0303-000000000020', 'b1090000-0000-4000-0303-000000003003', 'Menú infantil nuggets', '6 nuggets + papa + jugo', '🧒',
  15000, NULL, 'Kids', true, 91
),
(
  'p1090000-0000-4000-0303-000000000021', 'b1090000-0000-4000-0303-000000003003', 'Postre brownie', 'Unidad', '🍫',
  7000, NULL, 'Postres', true, 92
),
(
  'p1090000-0000-4000-0303-000000000022', 'b1090000-0000-4000-0303-000000003003', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 93
),
(
  'p1090000-0000-4000-0303-000000000023', 'b1090000-0000-4000-0303-000000003003', 'Jugo hit', 'Personal', '🧃',
  4000, NULL, 'Bebidas', true, 94
),
(
  'p1090000-0000-4000-0303-000000000024', 'b1090000-0000-4000-0303-000000003003', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 95
),
(
  'p1090000-0000-4000-0303-000000000025', 'b1090000-0000-4000-0303-000000003003', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 96
),
(
  'p1090000-0000-4000-0303-000000000026', 'b1090000-0000-4000-0303-000000003003', 'Pollo a la plancha', 'Opción más liviana', '🍗',
  20000, NULL, 'Premium', true, 97
),
(
  'p1090000-0000-4000-0303-000000000027', 'b1090000-0000-4000-0303-000000003003', 'Combo oficina', '2 piezas + arroz + té', '🍱',
  17000, NULL, 'Combos', true, 98
),
(
  'p1090000-0000-4000-0303-000000000028', 'b1090000-0000-4000-0303-000000003003', 'Edición miel mostaza', 'Alitas x8', '🍯',
  19000, NULL, 'Edición limitada', true, 99
),
(
  'p1090000-0000-4000-0304-000000000001', 'b1090000-0000-4000-0304-000000003004', 'Clásica Urabá', 'Carne 140g, queso, vegetales', '🍔',
  18000, NULL, 'Hamburguesas', true, 0
),
(
  'p1090000-0000-4000-0304-000000000002', 'b1090000-0000-4000-0304-000000003004', 'Doble smash', 'Dos carnes smash, cheddar', '🍔',
  24000, 27000, 'Hamburguesas', true, 1
),
(
  'p1090000-0000-4000-0304-000000000003', 'b1090000-0000-4000-0304-000000003004', 'BBQ bacon', 'Tocineta, BBQ, cebolla crispy', '🍔',
  26000, NULL, 'Hamburguesas', true, 2
),
(
  'p1090000-0000-4000-0304-000000000004', 'b1090000-0000-4000-0304-000000003004', 'Pollo crispy', 'Pechuga empanizada', '🍔',
  20000, NULL, 'Hamburguesas', true, 3
),
(
  'p1090000-0000-4000-0304-000000000005', 'b1090000-0000-4000-0304-000000003004', 'Veggie bean', 'Hamburguesa de frijol y avena', '🌱',
  19000, NULL, 'Hamburguesas', true, 4
),
(
  'p1090000-0000-4000-0304-000000000006', 'b1090000-0000-4000-0304-000000003004', 'Premium angus', 'Carne 180g, cebolla caramelizada', '🍔',
  32000, NULL, 'Premium', true, 5
),
(
  'p1090000-0000-4000-0304-000000000007', 'b1090000-0000-4000-0304-000000003004', 'Combo clásico', 'Burger + papas + gaseosa', '🍱',
  25000, 28000, 'Combos', true, 6
),
(
  'p1090000-0000-4000-0304-000000000008', 'b1090000-0000-4000-0304-000000003004', 'Combo doble', 'Doble smash + papas + gaseosa', '🍱',
  32000, NULL, 'Combos', true, 7
),
(
  'p1090000-0000-4000-0304-000000000009', 'b1090000-0000-4000-0304-000000003004', 'Papas caseras', 'Porción', '🍟',
  7000, NULL, 'Acompañamientos', true, 8
),
(
  'p1090000-0000-4000-0304-000000000010', 'b1090000-0000-4000-0304-000000003004', 'Papas con queso', 'Cheddar fundido', '🍟',
  10000, NULL, 'Acompañamientos', true, 9
),
(
  'p1090000-0000-4000-0304-000000000011', 'b1090000-0000-4000-0304-000000003004', 'Aros de cebolla', 'Porción', '🧅',
  9000, NULL, 'Acompañamientos', true, 10
),
(
  'p1090000-0000-4000-0304-000000000012', 'b1090000-0000-4000-0304-000000003004', 'Onion rings BBQ', 'Con dip', '🧅',
  10000, NULL, 'Acompañamientos', true, 11
),
(
  'p1090000-0000-4000-0304-000000000013', 'b1090000-0000-4000-0304-000000003004', 'Extra carne', '140g', '🥩',
  7000, NULL, 'Extras', true, 12
),
(
  'p1090000-0000-4000-0304-000000000014', 'b1090000-0000-4000-0304-000000003004', 'Extra tocineta', '2 lonjas', '🥓',
  4000, NULL, 'Extras', true, 13
),
(
  'p1090000-0000-4000-0304-000000000015', 'b1090000-0000-4000-0304-000000003004', 'Extra queso', 'Cheddar', '🧀',
  3000, NULL, 'Extras', true, 14
),
(
  'p1090000-0000-4000-0304-000000000016', 'b1090000-0000-4000-0304-000000003004', 'Kids mini burger', 'Mini + papa + jugo', '🧒',
  14000, NULL, 'Kids', true, 15
),
(
  'p1090000-0000-4000-0304-000000000017', 'b1090000-0000-4000-0304-000000003004', 'Malteada vainilla', '16oz', '🥛',
  10000, NULL, 'Bebidas', true, 16
),
(
  'p1090000-0000-4000-0304-000000000018', 'b1090000-0000-4000-0304-000000003004', 'Malteada chocolate', '16oz', '🍫',
  10000, NULL, 'Bebidas', true, 17
),
(
  'p1090000-0000-4000-0304-000000000019', 'b1090000-0000-4000-0304-000000003004', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 18
),
(
  'p1090000-0000-4000-0304-000000000020', 'b1090000-0000-4000-0304-000000003004', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 19
),
(
  'p1090000-0000-4000-0304-000000000021', 'b1090000-0000-4000-0304-000000003004', 'Hot dog ranchero', 'Con papas', '🌭',
  15000, NULL, 'Platos', true, 20
),
(
  'p1090000-0000-4000-0304-000000000022', 'b1090000-0000-4000-0304-000000003004', 'Salchipapa urbana', 'Salsas a elección', '🍟',
  14000, NULL, 'Platos', true, 21
),
(
  'p1090000-0000-4000-0304-000000000023', 'b1090000-0000-4000-0304-000000003004', 'Brownie', 'Casero', '🍫',
  8000, NULL, 'Postres', true, 22
),
(
  'p1090000-0000-4000-0304-000000000024', 'b1090000-0000-4000-0304-000000003004', 'Cookie con chips', 'Caliente', '🍪',
  6000, NULL, 'Postres', true, 23
),
(
  'p1090000-0000-4000-0304-000000000025', 'b1090000-0000-4000-0304-000000003004', 'Combo noche', 'Burger + malteada', '🌙',
  27000, NULL, 'Combos', true, 24
),
(
  'p1090000-0000-4000-0304-000000000026', 'b1090000-0000-4000-0304-000000003004', 'Salsa de la casa', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 25
),
(
  'p1090000-0000-4000-0304-000000000027', 'b1090000-0000-4000-0304-000000003004', 'Pickles extra', 'Porción', '🥒',
  1500, NULL, 'Extras', true, 26
),
(
  'p1090000-0000-4000-0304-000000000028', 'b1090000-0000-4000-0304-000000003004', 'Edición ají dulce', 'Burger con hogao costeño', '🌶️',
  22000, NULL, 'Edición limitada', true, 27
),
(
  'p1090000-0000-4000-0305-000000000001', 'b1090000-0000-4000-0305-000000003005', 'Café americano', '12oz', '☕',
  4000, NULL, 'Café', true, 28
),
(
  'p1090000-0000-4000-0305-000000000002', 'b1090000-0000-4000-0305-000000003005', 'Café con leche', '12oz', '☕',
  5000, NULL, 'Café', true, 29
),
(
  'p1090000-0000-4000-0305-000000000003', 'b1090000-0000-4000-0305-000000003005', 'Cappuccino', 'Espuma cremosa', '☕',
  7000, NULL, 'Café', true, 30
),
(
  'p1090000-0000-4000-0305-000000000004', 'b1090000-0000-4000-0305-000000003005', 'Latte', '12oz', '☕',
  7500, NULL, 'Café', true, 31
),
(
  'p1090000-0000-4000-0305-000000000005', 'b1090000-0000-4000-0305-000000003005', 'Chocolate caliente', 'Con marshmallow', '🍫',
  7000, NULL, 'Café', true, 32
),
(
  'p1090000-0000-4000-0305-000000000006', 'b1090000-0000-4000-0305-000000003005', 'Tinto costeño', 'Pequeño', '☕',
  2500, NULL, 'Café', true, 33
),
(
  'p1090000-0000-4000-0305-000000000007', 'b1090000-0000-4000-0305-000000003005', 'Desayuno completo', 'Huevos, arepa, queso, café', '🍳',
  14000, 16000, 'Desayunos', true, 34
),
(
  'p1090000-0000-4000-0305-000000000008', 'b1090000-0000-4000-0305-000000003005', 'Desayuno light', 'Yogurt, fruta, granola', '🥣',
  12000, NULL, 'Desayunos', true, 35
),
(
  'p1090000-0000-4000-0305-000000000009', 'b1090000-0000-4000-0305-000000003005', 'Calentado antioqueño', 'Frijol, arroz, carne, huevo', '🍛',
  16000, NULL, 'Desayunos', true, 36
),
(
  'p1090000-0000-4000-0305-000000000010', 'b1090000-0000-4000-0305-000000003005', 'Pandebono x3', 'Calientes', '🧀',
  6000, NULL, 'Panadería', true, 37
),
(
  'p1090000-0000-4000-0305-000000000011', 'b1090000-0000-4000-0305-000000003005', 'Almojábana x2', 'Recién horneada', '🍞',
  5000, NULL, 'Panadería', true, 38
),
(
  'p1090000-0000-4000-0305-000000000012', 'b1090000-0000-4000-0305-000000003005', 'Croissant jamón queso', 'Horno del día', '🥐',
  8000, NULL, 'Panadería', true, 39
),
(
  'p1090000-0000-4000-0305-000000000013', 'b1090000-0000-4000-0305-000000003005', 'Brownie', 'Porción', '🍫',
  7000, NULL, 'Postres', true, 40
),
(
  'p1090000-0000-4000-0305-000000000014', 'b1090000-0000-4000-0305-000000003005', 'Cheesecake frutos rojos', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 41
),
(
  'p1090000-0000-4000-0305-000000000015', 'b1090000-0000-4000-0305-000000003005', 'Muffin del día', 'Sabor rotativo', '🧁',
  5500, NULL, 'Panadería', true, 42
),
(
  'p1090000-0000-4000-0305-000000000016', 'b1090000-0000-4000-0305-000000003005', 'Jugo de naranja', 'Natural 12oz', '🍊',
  6000, NULL, 'Bebidas', true, 43
),
(
  'p1090000-0000-4000-0305-000000000017', 'b1090000-0000-4000-0305-000000003005', 'Limonada de hierbabuena', '16oz', '🍋',
  5500, NULL, 'Bebidas', true, 44
),
(
  'p1090000-0000-4000-0305-000000000018', 'b1090000-0000-4000-0305-000000003005', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 45
),
(
  'p1090000-0000-4000-0305-000000000019', 'b1090000-0000-4000-0305-000000003005', 'Sándwich pollo', 'Pan artesanal', '🥪',
  13000, NULL, 'Platos', true, 46
),
(
  'p1090000-0000-4000-0305-000000000020', 'b1090000-0000-4000-0305-000000003005', 'Sándwich vegetariano', 'Queso y vegetales', '🥪',
  12000, NULL, 'Platos', true, 47
),
(
  'p1090000-0000-4000-0305-000000000021', 'b1090000-0000-4000-0305-000000003005', 'Empanada de carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 48
),
(
  'p1090000-0000-4000-0305-000000000022', 'b1090000-0000-4000-0305-000000003005', 'Combo tarde', 'Café + pandebono', '🍱',
  9000, 11000, 'Combos', true, 49
),
(
  'p1090000-0000-4000-0305-000000000023', 'b1090000-0000-4000-0305-000000003005', 'Combo oficina', 'Sándwich + jugo', '🍱',
  16000, NULL, 'Combos', true, 50
),
(
  'p1090000-0000-4000-0305-000000000024', 'b1090000-0000-4000-0305-000000003005', 'Kids hotcakes', 'Con miel', '🧒',
  10000, NULL, 'Kids', true, 51
),
(
  'p1090000-0000-4000-0305-000000000025', 'b1090000-0000-4000-0305-000000003005', 'Té chai latte', 'Especiado', '🧋',
  8000, NULL, 'Café', true, 52
),
(
  'p1090000-0000-4000-0305-000000000026', 'b1090000-0000-4000-0305-000000003005', 'Affogato', 'Helado + espresso', '🍨',
  9000, NULL, 'Postres', true, 53
),
(
  'p1090000-0000-4000-0305-000000000027', 'b1090000-0000-4000-0305-000000003005', 'Galleta avena', 'Unidad', '🍪',
  3500, NULL, 'Panadería', true, 54
),
(
  'p1090000-0000-4000-0305-000000000028', 'b1090000-0000-4000-0305-000000003005', 'Edición café de Urabá', 'Origen regional 12oz', '☕',
  8500, NULL, 'Edición limitada', true, 55
),
(
  'p1090000-0000-4000-0306-000000000001', 'b1090000-0000-4000-0306-000000003006', 'Arepa de huevo', 'Frita, huevo adentro', '🫓',
  7000, NULL, 'Arepas', true, 56
),
(
  'p1090000-0000-4000-0306-000000000002', 'b1090000-0000-4000-0306-000000003006', 'Arepa de huevo doble', 'Doble huevo', '🫓',
  9000, NULL, 'Arepas', true, 57
),
(
  'p1090000-0000-4000-0306-000000000003', 'b1090000-0000-4000-0306-000000003006', 'Arepa con queso', 'Queso costeño', '🫓',
  6000, NULL, 'Arepas', true, 58
),
(
  'p1090000-0000-4000-0306-000000000004', 'b1090000-0000-4000-0306-000000003006', 'Arepa con todo', 'Huevo, queso, hogao', '🫓',
  10000, NULL, 'Arepas', true, 59
),
(
  'p1090000-0000-4000-0306-000000000005', 'b1090000-0000-4000-0306-000000003006', 'Arepa de pollo', 'Pollo desmechado', '🫓',
  11000, NULL, 'Arepas', true, 60
),
(
  'p1090000-0000-4000-0306-000000000006', 'b1090000-0000-4000-0306-000000003006', 'Arepa de carne', 'Carne desmechada', '🫓',
  12000, NULL, 'Arepas', true, 61
),
(
  'p1090000-0000-4000-0306-000000000007', 'b1090000-0000-4000-0306-000000003006', 'Arepa de chorizo', 'Chorizo y hogao', '🫓',
  11000, NULL, 'Arepas', true, 62
),
(
  'p1090000-0000-4000-0306-000000000008', 'b1090000-0000-4000-0306-000000003006', 'Combo desayuno', 'Arepa huevo + café + jugo', '🍱',
  14000, 16000, 'Combos', true, 63
),
(
  'p1090000-0000-4000-0306-000000000009', 'b1090000-0000-4000-0306-000000003006', 'Combo almuerzo', 'Arepa carne + limonada', '🍱',
  15000, NULL, 'Combos', true, 64
),
(
  'p1090000-0000-4000-0306-000000000010', 'b1090000-0000-4000-0306-000000003006', 'Empanada carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 65
),
(
  'p1090000-0000-4000-0306-000000000011', 'b1090000-0000-4000-0306-000000003006', 'Empanada pollo', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 66
),
(
  'p1090000-0000-4000-0306-000000000012', 'b1090000-0000-4000-0306-000000003006', 'Empanada papa-carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 67
),
(
  'p1090000-0000-4000-0306-000000000013', 'b1090000-0000-4000-0306-000000003006', 'Buñuelo x2', 'Calientes', '🍩',
  4000, NULL, 'Snacks', true, 68
),
(
  'p1090000-0000-4000-0306-000000000014', 'b1090000-0000-4000-0306-000000003006', 'Jugo de mango', 'Natural', '🥭',
  6000, NULL, 'Bebidas', true, 69
),
(
  'p1090000-0000-4000-0306-000000000015', 'b1090000-0000-4000-0306-000000003006', 'Jugo de lulo', 'Natural', '🧃',
  6000, NULL, 'Bebidas', true, 70
),
(
  'p1090000-0000-4000-0306-000000000016', 'b1090000-0000-4000-0306-000000003006', 'Café con leche', 'Vaso', '☕',
  4000, NULL, 'Bebidas', true, 71
),
(
  'p1090000-0000-4000-0306-000000000017', 'b1090000-0000-4000-0306-000000003006', 'Tinto', 'Pequeño', '☕',
  2000, NULL, 'Bebidas', true, 72
),
(
  'p1090000-0000-4000-0306-000000000018', 'b1090000-0000-4000-0306-000000003006', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 73
),
(
  'p1090000-0000-4000-0306-000000000019', 'b1090000-0000-4000-0306-000000003006', 'Suero costeño', 'Porción', '🥛',
  3000, NULL, 'Extras', true, 74
),
(
  'p1090000-0000-4000-0306-000000000020', 'b1090000-0000-4000-0306-000000003006', 'Ají', 'Porción', '🌶️',
  1500, NULL, 'Salsas', true, 75
),
(
  'p1090000-0000-4000-0306-000000000021', 'b1090000-0000-4000-0306-000000003006', 'Hogao', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 76
),
(
  'p1090000-0000-4000-0306-000000000022', 'b1090000-0000-4000-0306-000000003006', 'Kids arepa queso', 'Pequeña + jugo', '🧒',
  9000, NULL, 'Kids', true, 77
),
(
  'p1090000-0000-4000-0306-000000000023', 'b1090000-0000-4000-0306-000000003006', 'Patacón con queso', 'Entrada', '🍌',
  8000, NULL, 'Platos', true, 78
),
(
  'p1090000-0000-4000-0306-000000000024', 'b1090000-0000-4000-0306-000000003006', 'Caldo de costilla', 'Taza', '🍲',
  10000, NULL, 'Platos', true, 79
),
(
  'p1090000-0000-4000-0306-000000000025', 'b1090000-0000-4000-0306-000000003006', 'Changua', 'Desayuno', '🥣',
  9000, NULL, 'Desayunos', true, 80
),
(
  'p1090000-0000-4000-0306-000000000026', 'b1090000-0000-4000-0306-000000003006', 'Huevos pericos', 'Con arepa', '🍳',
  10000, NULL, 'Desayunos', true, 81
),
(
  'p1090000-0000-4000-0306-000000000027', 'b1090000-0000-4000-0306-000000003006', 'Mazamorra', 'Vaso', '🥛',
  5000, NULL, 'Postres', true, 82
),
(
  'p1090000-0000-4000-0306-000000000028', 'b1090000-0000-4000-0306-000000003006', 'Edición arepa de camarón', 'Fines de semana', '🦐',
  14000, NULL, 'Edición limitada', true, 83
),
(
  'p1090000-0000-4000-0307-000000000001', 'b1090000-0000-4000-0307-000000003007', 'Huevos AA x12', 'Cartón', '🥚',
  12000, NULL, 'Lácteos y huevos', true, 84
),
(
  'p1090000-0000-4000-0307-000000000002', 'b1090000-0000-4000-0307-000000003007', 'Leche entera 1L', 'UHT', '🥛',
  5500, NULL, 'Lácteos y huevos', true, 85
),
(
  'p1090000-0000-4000-0307-000000000003', 'b1090000-0000-4000-0307-000000003007', 'Queso costeño 250g', 'Fresco', '🧀',
  9000, NULL, 'Lácteos y huevos', true, 86
),
(
  'p1090000-0000-4000-0307-000000000004', 'b1090000-0000-4000-0307-000000003007', 'Yogurt bebible', 'Unidad', '🥛',
  3500, NULL, 'Lácteos y huevos', true, 87
),
(
  'p1090000-0000-4000-0307-000000000005', 'b1090000-0000-4000-0307-000000003007', 'Pan tajado', 'Bolsa', '🍞',
  6000, NULL, 'Panadería', true, 88
),
(
  'p1090000-0000-4000-0307-000000000006', 'b1090000-0000-4000-0307-000000003007', 'Arroz 1kg', 'Blanco', '🍚',
  4500, NULL, 'Despensa', true, 89
),
(
  'p1090000-0000-4000-0307-000000000007', 'b1090000-0000-4000-0307-000000003007', 'Aceite 1L', 'Vegetal', '🫒',
  12000, 14000, 'Despensa', true, 90
),
(
  'p1090000-0000-4000-0307-000000000008', 'b1090000-0000-4000-0307-000000003007', 'Azúcar 1kg', 'Blanca', '🧂',
  4500, NULL, 'Despensa', true, 91
),
(
  'p1090000-0000-4000-0307-000000000009', 'b1090000-0000-4000-0307-000000003007', 'Sal 1kg', 'Refinada', '🧂',
  2500, NULL, 'Despensa', true, 92
),
(
  'p1090000-0000-4000-0307-000000000010', 'b1090000-0000-4000-0307-000000003007', 'Pasta spaghetti 500g', 'Caja', '🍝',
  4000, NULL, 'Despensa', true, 93
),
(
  'p1090000-0000-4000-0307-000000000011', 'b1090000-0000-4000-0307-000000003007', 'Atún lata', 'Agua o aceite', '🐟',
  5500, NULL, 'Despensa', true, 94
),
(
  'p1090000-0000-4000-0307-000000000012', 'b1090000-0000-4000-0307-000000003007', 'Frijol cargamanto 500g', 'Bolsa', '🫘',
  5000, NULL, 'Despensa', true, 95
),
(
  'p1090000-0000-4000-0307-000000000013', 'b1090000-0000-4000-0307-000000003007', 'Plátano maduro x3', 'Unidad aprox.', '🍌',
  4000, NULL, 'Frutas y verduras', true, 96
),
(
  'p1090000-0000-4000-0307-000000000014', 'b1090000-0000-4000-0307-000000003007', 'Tomate chonto 500g', 'Fresco', '🍅',
  3500, NULL, 'Frutas y verduras', true, 97
),
(
  'p1090000-0000-4000-0307-000000000015', 'b1090000-0000-4000-0307-000000003007', 'Cebolla cabezona 500g', 'Fresco', '🧅',
  3000, NULL, 'Frutas y verduras', true, 98
),
(
  'p1090000-0000-4000-0307-000000000016', 'b1090000-0000-4000-0307-000000003007', 'Papa pastusa 1kg', 'Fresco', '🥔',
  4500, NULL, 'Frutas y verduras', true, 99
),
(
  'p1090000-0000-4000-0307-000000000017', 'b1090000-0000-4000-0307-000000003007', 'Banano x6', 'Racimo pequeño', '🍌',
  4000, NULL, 'Frutas y verduras', true, 0
),
(
  'p1090000-0000-4000-0307-000000000018', 'b1090000-0000-4000-0307-000000003007', 'Limón x5', 'Ácidos', '🍋',
  2500, NULL, 'Frutas y verduras', true, 1
),
(
  'p1090000-0000-4000-0307-000000000019', 'b1090000-0000-4000-0307-000000003007', 'Pollo entero congelado', 'Aprox 1.5kg', '🍗',
  18000, NULL, 'Congelados', true, 2
),
(
  'p1090000-0000-4000-0307-000000000020', 'b1090000-0000-4000-0307-000000003007', 'Carne molida 500g', 'Res', '🥩',
  14000, NULL, 'Carnes', true, 3
),
(
  'p1090000-0000-4000-0307-000000000021', 'b1090000-0000-4000-0307-000000003007', 'Jabón en barra x3', 'Ropa', '🧼',
  8000, NULL, 'Aseo', true, 4
),
(
  'p1090000-0000-4000-0307-000000000022', 'b1090000-0000-4000-0307-000000003007', 'Detergente 1kg', 'En polvo', '🧺',
  12000, NULL, 'Aseo', true, 5
),
(
  'p1090000-0000-4000-0307-000000000023', 'b1090000-0000-4000-0307-000000003007', 'Papel higiénico x4', 'Doble hoja', '🧻',
  10000, 12000, 'Aseo', true, 6
),
(
  'p1090000-0000-4000-0307-000000000024', 'b1090000-0000-4000-0307-000000003007', 'Jabón antibacterial', 'Líquido 250ml', '🧴',
  7000, NULL, 'Cuidado personal', true, 7
),
(
  'p1090000-0000-4000-0307-000000000025', 'b1090000-0000-4000-0307-000000003007', 'Pasta dental', 'Tubo', '🦷',
  6500, NULL, 'Cuidado personal', true, 8
),
(
  'p1090000-0000-4000-0307-000000000026', 'b1090000-0000-4000-0307-000000003007', 'Pañales etapa 3 x10', 'Pack', '👶',
  22000, NULL, 'Bebé', true, 9
),
(
  'p1090000-0000-4000-0307-000000000027', 'b1090000-0000-4000-0307-000000003007', 'Pañitos húmedos', 'Paquete', '👶',
  9000, NULL, 'Bebé', true, 10
),
(
  'p1090000-0000-4000-0307-000000000028', 'b1090000-0000-4000-0307-000000003007', 'Gaseosa 1.5L', 'Sabor a elegir', '🥤',
  7000, NULL, 'Bebidas', true, 11
),
(
  'p1090000-0000-4000-0307-000000000029', 'b1090000-0000-4000-0307-000000003007', 'Agua 6L', 'Bidón', '💧',
  8000, NULL, 'Bebidas', true, 12
),
(
  'p1090000-0000-4000-0307-000000000030', 'b1090000-0000-4000-0307-000000003007', 'Snack papas 150g', 'Bolsa', '🥔',
  5500, NULL, 'Snacks', true, 13
),
(
  'p1090000-0000-4000-0307-000000000031', 'b1090000-0000-4000-0307-000000003007', 'Galletas surtidas', 'Paquete', '🍪',
  4500, NULL, 'Snacks', true, 14
),
(
  'p1090000-0000-4000-0307-000000000032', 'b1090000-0000-4000-0307-000000003007', 'Café molido 250g', 'Tradicional', '☕',
  11000, NULL, 'Despensa', true, 15
),
(
  'p1090000-0000-4000-0308-000000000001', 'b1090000-0000-4000-0308-000000003008', 'Acetaminofén 500mg x20', 'Uso OTC', '💊',
  8000, NULL, 'Analgésicos', true, 16
),
(
  'p1090000-0000-4000-0308-000000000002', 'b1090000-0000-4000-0308-000000003008', 'Ibuprofeno 400mg x10', 'Uso OTC', '💊',
  9000, NULL, 'Analgésicos', true, 17
),
(
  'p1090000-0000-4000-0308-000000000003', 'b1090000-0000-4000-0308-000000003008', 'Suero oral', 'Sobre', '🧪',
  3500, NULL, 'Primeros auxilios', true, 18
),
(
  'p1090000-0000-4000-0308-000000000004', 'b1090000-0000-4000-0308-000000003008', 'Curitas x20', 'Surtidas', '🩹',
  6000, NULL, 'Primeros auxilios', true, 19
),
(
  'p1090000-0000-4000-0308-000000000005', 'b1090000-0000-4000-0308-000000003008', 'Alcohol antiséptico 120ml', 'Botella', '🧴',
  5000, NULL, 'Primeros auxilios', true, 20
),
(
  'p1090000-0000-4000-0308-000000000006', 'b1090000-0000-4000-0308-000000003008', 'Agua oxigenada 120ml', 'Botella', '🧴',
  4500, NULL, 'Primeros auxilios', true, 21
),
(
  'p1090000-0000-4000-0308-000000000007', 'b1090000-0000-4000-0308-000000003008', 'Gasas estériles', 'Paquete', '🩹',
  7000, NULL, 'Primeros auxilios', true, 22
),
(
  'p1090000-0000-4000-0308-000000000008', 'b1090000-0000-4000-0308-000000003008', 'Termómetro digital', 'Unidad', '🌡️',
  25000, NULL, 'Bienestar', true, 23
),
(
  'p1090000-0000-4000-0308-000000000009', 'b1090000-0000-4000-0308-000000003008', 'Vitamina C efervescente', 'Tubo', '🍊',
  18000, 22000, 'Bienestar', true, 24
),
(
  'p1090000-0000-4000-0308-000000000010', 'b1090000-0000-4000-0308-000000003008', 'Multivitamínico x30', 'Tabletas', '💊',
  32000, NULL, 'Bienestar', true, 25
),
(
  'p1090000-0000-4000-0308-000000000011', 'b1090000-0000-4000-0308-000000003008', 'Protector solar FPS50', 'Crema 60ml', '☀️',
  35000, NULL, 'Cuidado personal', true, 26
),
(
  'p1090000-0000-4000-0308-000000000012', 'b1090000-0000-4000-0308-000000003008', 'Crema humectante', '120ml', '🧴',
  18000, NULL, 'Cuidado personal', true, 27
),
(
  'p1090000-0000-4000-0308-000000000013', 'b1090000-0000-4000-0308-000000003008', 'Shampoo anticaspa', '400ml', '🧴',
  22000, NULL, 'Cuidado personal', true, 28
),
(
  'p1090000-0000-4000-0308-000000000014', 'b1090000-0000-4000-0308-000000003008', 'Jabón íntimo', '200ml', '🧴',
  16000, NULL, 'Cuidado personal', true, 29
),
(
  'p1090000-0000-4000-0308-000000000015', 'b1090000-0000-4000-0308-000000003008', 'Toallas higiénicas x10', 'Paquete', '📦',
  9000, NULL, 'Cuidado personal', true, 30
),
(
  'p1090000-0000-4000-0308-000000000016', 'b1090000-0000-4000-0308-000000003008', 'Pañales etapa 2 x12', 'Pack', '👶',
  28000, NULL, 'Bebé', true, 31
),
(
  'p1090000-0000-4000-0308-000000000017', 'b1090000-0000-4000-0308-000000003008', 'Crema antipañalitis', 'Tubo', '👶',
  20000, NULL, 'Bebé', true, 32
),
(
  'p1090000-0000-4000-0308-000000000018', 'b1090000-0000-4000-0308-000000003008', 'Repelente spray', '120ml', '🦟',
  18000, NULL, 'Bienestar', true, 33
),
(
  'p1090000-0000-4000-0308-000000000019', 'b1090000-0000-4000-0308-000000003008', 'Sales de rehidratación', 'Caja x5', '🧪',
  10000, NULL, 'Primeros auxilios', true, 34
),
(
  'p1090000-0000-4000-0308-000000000020', 'b1090000-0000-4000-0308-000000003008', 'Pastillas para la garganta', 'Caja', '🍬',
  8000, NULL, 'Analgésicos', true, 35
),
(
  'p1090000-0000-4000-0308-000000000021', 'b1090000-0000-4000-0308-000000003008', 'Alcohol en gel 60ml', 'Antibacterial', '🧴',
  6000, NULL, 'Cuidado personal', true, 36
),
(
  'p1090000-0000-4000-0308-000000000022', 'b1090000-0000-4000-0308-000000003008', 'Mascarillas x10', 'Desechables', '😷',
  8000, NULL, 'Bienestar', true, 37
),
(
  'p1090000-0000-4000-0308-000000000023', 'b1090000-0000-4000-0308-000000003008', 'Preservativos x3', 'Caja', '📦',
  9000, NULL, 'Cuidado personal', true, 38
),
(
  'p1090000-0000-4000-0308-000000000024', 'b1090000-0000-4000-0308-000000003008', 'Prueba de embarazo', 'Unidad', '🧪',
  12000, NULL, 'Bienestar', true, 39
),
(
  'p1090000-0000-4000-0308-000000000025', 'b1090000-0000-4000-0308-000000003008', 'Algodón 50g', 'Bolsa', '☁️',
  4000, NULL, 'Primeros auxilios', true, 40
),
(
  'p1090000-0000-4000-0308-000000000026', 'b1090000-0000-4000-0308-000000003008', 'Gotas lubricantes oculares', 'Frasco', '👁️',
  22000, NULL, 'Bienestar', true, 41
),
(
  'p1090000-0000-4000-0308-000000000027', 'b1090000-0000-4000-0308-000000003008', 'Jabón neutro', 'Barra', '🧼',
  5000, NULL, 'Cuidado personal', true, 42
),
(
  'p1090000-0000-4000-0308-000000000028', 'b1090000-0000-4000-0308-000000003008', 'Kit viaje básicos', 'Curitas + gel + acetaminofén', '🧰',
  25000, NULL, 'Kits', true, 43
),
(
  'p1090000-0000-4000-0308-000000000029', 'b1090000-0000-4000-0308-000000003008', 'Suero fisiológico', 'Frasco', '💧',
  7000, NULL, 'Primeros auxilios', true, 44
),
(
  'p1090000-0000-4000-0308-000000000030', 'b1090000-0000-4000-0308-000000003008', 'Talco mentolado', '120g', '🧴',
  9000, NULL, 'Cuidado personal', true, 45
),
(
  'p1090000-0000-4000-0309-000000000001', 'b1090000-0000-4000-0309-000000003009', 'Croqueta perro adulto 2kg', 'Pollo', '🐕',
  28000, NULL, 'Alimento perro', true, 46
),
(
  'p1090000-0000-4000-0309-000000000002', 'b1090000-0000-4000-0309-000000003009', 'Croqueta perro adulto 4kg', 'Pollo', '🐕',
  52000, 58000, 'Alimento perro', true, 47
),
(
  'p1090000-0000-4000-0309-000000000003', 'b1090000-0000-4000-0309-000000003009', 'Croqueta cachorro 2kg', 'Crecimiento', '🐶',
  30000, NULL, 'Alimento perro', true, 48
),
(
  'p1090000-0000-4000-0309-000000000004', 'b1090000-0000-4000-0309-000000003009', 'Croqueta gato 1.5kg', 'Salmón', '🐈',
  32000, NULL, 'Alimento gato', true, 49
),
(
  'p1090000-0000-4000-0309-000000000005', 'b1090000-0000-4000-0309-000000003009', 'Snack dental perro', 'Bolsa', '🦴',
  12000, NULL, 'Snacks', true, 50
),
(
  'p1090000-0000-4000-0309-000000000006', 'b1090000-0000-4000-0309-000000003009', 'Snack crema gato', 'Pack x5', '🐈',
  14000, NULL, 'Snacks', true, 51
),
(
  'p1090000-0000-4000-0309-000000000007', 'b1090000-0000-4000-0309-000000003009', 'Arena aglomerante 4kg', 'Lavanda', '🐈',
  22000, NULL, 'Higiene', true, 52
),
(
  'p1090000-0000-4000-0309-000000000008', 'b1090000-0000-4000-0309-000000003009', 'Pala para arena', 'Plástica', '🧹',
  8000, NULL, 'Higiene', true, 53
),
(
  'p1090000-0000-4000-0309-000000000009', 'b1090000-0000-4000-0309-000000003009', 'Collar ajustable M', 'Nylon', '🦮',
  15000, NULL, 'Accesorios', true, 54
),
(
  'p1090000-0000-4000-0309-000000000010', 'b1090000-0000-4000-0309-000000003009', 'Correa 1.5m', 'Nylon', '🦮',
  18000, NULL, 'Accesorios', true, 55
),
(
  'p1090000-0000-4000-0309-000000000011', 'b1090000-0000-4000-0309-000000003009', 'Plato doble', 'Acero', '🥣',
  20000, NULL, 'Accesorios', true, 56
),
(
  'p1090000-0000-4000-0309-000000000012', 'b1090000-0000-4000-0309-000000003009', 'Juguete cuerda', 'Resistente', '🧸',
  10000, NULL, 'Juguetes', true, 57
),
(
  'p1090000-0000-4000-0309-000000000013', 'b1090000-0000-4000-0309-000000003009', 'Pelota con cascabel', 'Gato', '🎾',
  8000, NULL, 'Juguetes', true, 58
),
(
  'p1090000-0000-4000-0309-000000000014', 'b1090000-0000-4000-0309-000000003009', 'Cama mediana', 'Suave', '🛏️',
  65000, NULL, 'Descanso', true, 59
),
(
  'p1090000-0000-4000-0309-000000000015', 'b1090000-0000-4000-0309-000000003009', 'Shampoo hipoalergénico', '250ml', '🧴',
  22000, NULL, 'Higiene', true, 60
),
(
  'p1090000-0000-4000-0309-000000000016', 'b1090000-0000-4000-0309-000000003009', ' Antipulgas collar', 'Perro M', '🪲',
  45000, NULL, 'Salud', true, 61
),
(
  'p1090000-0000-4000-0309-000000000017', 'b1090000-0000-4000-0309-000000003009', 'Pañitos húmedos pet', 'Pack', '🧻',
  12000, NULL, 'Higiene', true, 62
),
(
  'p1090000-0000-4000-0309-000000000018', 'b1090000-0000-4000-0309-000000003009', 'Transportadora blanda', 'Talla S', '👜',
  80000, NULL, 'Viaje', true, 63
),
(
  'p1090000-0000-4000-0309-000000000019', 'b1090000-0000-4000-0309-000000003009', 'Bebedero portátil', '500ml', '💧',
  25000, NULL, 'Viaje', true, 64
),
(
  'p1090000-0000-4000-0309-000000000020', 'b1090000-0000-4000-0309-000000003009', 'Premios entrenamiento', 'Bolsa', '🦴',
  15000, NULL, 'Snacks', true, 65
),
(
  'p1090000-0000-4000-0309-000000000021', 'b1090000-0000-4000-0309-000000003009', 'Rascador vertical', 'Sisal', '🐈',
  70000, NULL, 'Gatos', true, 66
),
(
  'p1090000-0000-4000-0309-000000000022', 'b1090000-0000-4000-0309-000000003009', 'Arnés reflectivo M', 'Seguridad', '🦮',
  35000, NULL, 'Accesorios', true, 67
),
(
  'p1090000-0000-4000-0309-000000000023', 'b1090000-0000-4000-0309-000000003009', 'Comedero automático mini', 'Programable', '⏱️',
  120000, NULL, 'Accesorios', true, 68
),
(
  'p1090000-0000-4000-0309-000000000024', 'b1090000-0000-4000-0309-000000003009', 'Kit primerizas cachorro', 'Plato + juguete + snack', '🎁',
  45000, NULL, 'Kits', true, 69
),
(
  'p1090000-0000-4000-0309-000000000025', 'b1090000-0000-4000-0309-000000003009', 'Galletas avena pet', 'Snack natural', '🍪',
  11000, NULL, 'Snacks', true, 70
),
(
  'p1090000-0000-4000-0309-000000000026', 'b1090000-0000-4000-0309-000000003009', 'Toalla baño pet', 'Absorbente', '🧺',
  18000, NULL, 'Higiene', true, 71
),
(
  'p1090000-0000-4000-0309-000000000027', 'b1090000-0000-4000-0309-000000003009', 'Juguete mordedor', 'Caucho', '🦴',
  16000, NULL, 'Juguetes', true, 72
),
(
  'p1090000-0000-4000-0309-000000000028', 'b1090000-0000-4000-0309-000000003009', 'Vitaminas pet jarabe', 'Suplemento', '💊',
  38000, NULL, 'Salud', true, 73
),
(
  'p1090000-0000-4000-0401-000000000001', 'b1090000-0000-4000-0401-000000004001', 'Picada Urabá (2 pers.)', 'Carne, chorizo, chicharrón, arepa y guacamole', '🥩',
  42000, 48000, 'Platos', true, 74
),
(
  'p1090000-0000-4000-0401-000000000002', 'b1090000-0000-4000-0401-000000004001', 'Picada familiar (4 pers.)', 'Bandeja surtida de parrilla con acompañamientos', '🥩',
  78000, NULL, 'Platos', true, 75
),
(
  'p1090000-0000-4000-0401-000000000003', 'b1090000-0000-4000-0401-000000004001', 'Punta de anca 300g', 'Término a elección, papa criolla y ensalada', '🥩',
  32000, NULL, 'Carnes', true, 76
),
(
  'p1090000-0000-4000-0401-000000000004', 'b1090000-0000-4000-0401-000000004001', 'Costilla BBQ', 'Costilla glaseada, yuca y ensalada', '🍖',
  35000, 39000, 'Carnes', true, 77
),
(
  'p1090000-0000-4000-0401-000000000005', 'b1090000-0000-4000-0401-000000004001', 'Churrasco 350g', 'Corte jugoso, chimichurri de la casa', '🥩',
  38000, NULL, 'Carnes', true, 78
),
(
  'p1090000-0000-4000-0401-000000000006', 'b1090000-0000-4000-0401-000000004001', 'Chorizo artesanal x4', 'Con arepa y hogao', '🌭',
  16000, NULL, 'Entradas', true, 79
),
(
  'p1090000-0000-4000-0401-000000000007', 'b1090000-0000-4000-0401-000000004001', 'Morcilla criolla x3', 'Con limón y ají', '🌭',
  14000, NULL, 'Entradas', true, 80
),
(
  'p1090000-0000-4000-0401-000000000008', 'b1090000-0000-4000-0401-000000004001', 'Chicharrón crocante', 'Porción generosa, limón', '🥓',
  18000, NULL, 'Entradas', true, 81
),
(
  'p1090000-0000-4000-0401-000000000009', 'b1090000-0000-4000-0401-000000004001', 'Arepa de queso', 'Arepa asada rellena', '🫓',
  6000, NULL, 'Acompañamientos', true, 82
),
(
  'p1090000-0000-4000-0401-000000000010', 'b1090000-0000-4000-0401-000000004001', 'Papa criolla salteada', 'Con sal de ajo', '🥔',
  8000, NULL, 'Acompañamientos', true, 83
),
(
  'p1090000-0000-4000-0401-000000000011', 'b1090000-0000-4000-0401-000000004001', 'Yuca frita', 'Con suero costeño', '🥔',
  7000, NULL, 'Acompañamientos', true, 84
),
(
  'p1090000-0000-4000-0401-000000000012', 'b1090000-0000-4000-0401-000000004001', 'Ensalada fresca', 'Lechuga, tomate, cebolla y vinagreta', '🥗',
  7000, NULL, 'Acompañamientos', true, 85
),
(
  'p1090000-0000-4000-0401-000000000013', 'b1090000-0000-4000-0401-000000004001', 'Guacamole casero', 'Porción para compartir', '🥑',
  5000, NULL, 'Salsas', true, 86
),
(
  'p1090000-0000-4000-0401-000000000014', 'b1090000-0000-4000-0401-000000004001', 'Ají de la casa', 'Picante medio', '🌶️',
  2000, NULL, 'Salsas', true, 87
),
(
  'p1090000-0000-4000-0401-000000000015', 'b1090000-0000-4000-0401-000000004001', 'Combo parrillero 1', 'Carne 250g + papa + gaseosa', '🍱',
  28000, 32000, 'Combos', true, 88
),
(
  'p1090000-0000-4000-0401-000000000016', 'b1090000-0000-4000-0401-000000004001', 'Combo parrillero 2', 'Chorizo + chicharrón + arepa + gaseosa', '🍱',
  24000, NULL, 'Combos', true, 89
),
(
  'p1090000-0000-4000-0401-000000000017', 'b1090000-0000-4000-0401-000000004001', 'Menú infantil carne', 'Carne molida, papa y jugo', '🧒',
  16000, NULL, 'Kids', true, 90
),
(
  'p1090000-0000-4000-0401-000000000018', 'b1090000-0000-4000-0401-000000004001', 'Brownie con helado', 'Postre caliente', '🍫',
  12000, NULL, 'Postres', true, 91
),
(
  'p1090000-0000-4000-0401-000000000019', 'b1090000-0000-4000-0401-000000004001', 'Limonada natural 16oz', 'Recién exprimida', '🍋',
  5000, NULL, 'Bebidas', true, 92
),
(
  'p1090000-0000-4000-0401-000000000020', 'b1090000-0000-4000-0401-000000004001', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 93
),
(
  'p1090000-0000-4000-0401-000000000021', 'b1090000-0000-4000-0401-000000004001', 'Agua botella', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 94
),
(
  'p1090000-0000-4000-0401-000000000022', 'b1090000-0000-4000-0401-000000004001', 'Cerveza nacional', 'Unidad fría', '🍺',
  6000, NULL, 'Bebidas', true, 95
),
(
  'p1090000-0000-4000-0401-000000000023', 'b1090000-0000-4000-0401-000000004001', 'Alitas BBQ x8', 'Glaseadas, papas', '🍗',
  26000, NULL, 'Platos', true, 96
),
(
  'p1090000-0000-4000-0401-000000000024', 'b1090000-0000-4000-0401-000000004001', 'Hamburguesa de res', '140g, queso, papas', '🍔',
  22000, NULL, 'Platos', true, 97
),
(
  'p1090000-0000-4000-0401-000000000025', 'b1090000-0000-4000-0401-000000004001', 'Salchipapa especial', 'Salchicha, papa, salsas', '🍟',
  15000, NULL, 'Platos', true, 98
),
(
  'p1090000-0000-4000-0401-000000000026', 'b1090000-0000-4000-0401-000000004001', 'Patacón con hogao', 'Entrada criolla', '🍌',
  9000, NULL, 'Entradas', true, 99
),
(
  'p1090000-0000-4000-0401-000000000027', 'b1090000-0000-4000-0401-000000004001', 'Combo ejecutivo', 'Carne del día + jugo', '🍱',
  20000, NULL, 'Combos', true, 0
),
(
  'p1090000-0000-4000-0401-000000000028', 'b1090000-0000-4000-0401-000000004001', 'Edición plátano maduro', 'Maduro asado con queso', '🍌',
  10000, NULL, 'Edición limitada', true, 1
),
(
  'p1090000-0000-4000-0402-000000000001', 'b1090000-0000-4000-0402-000000004002', 'Pizza margarita mediana', 'Salsa, mozzarella, albahaca', '🍕',
  26000, NULL, 'Pizzas', true, 2
),
(
  'p1090000-0000-4000-0402-000000000002', 'b1090000-0000-4000-0402-000000004002', 'Pizza hawaiana mediana', 'Piña y jamón', '🍕',
  28000, 32000, 'Pizzas', true, 3
),
(
  'p1090000-0000-4000-0402-000000000003', 'b1090000-0000-4000-0402-000000004002', 'Pizza pepperoni mediana', 'Pepperoni extra queso', '🍕',
  30000, NULL, 'Pizzas', true, 4
),
(
  'p1090000-0000-4000-0402-000000000004', 'b1090000-0000-4000-0402-000000004002', 'Pizza pollo BBQ mediana', 'Pollo, cebolla, BBQ', '🍕',
  32000, NULL, 'Pizzas', true, 5
),
(
  'p1090000-0000-4000-0402-000000000005', 'b1090000-0000-4000-0402-000000004002', 'Pizza vegetariana', 'Champiñón, pimentón, aceituna', '🍕',
  29000, NULL, 'Pizzas', true, 6
),
(
  'p1090000-0000-4000-0402-000000000006', 'b1090000-0000-4000-0402-000000004002', 'Pizza familiar 4 sabores', 'Para 4 personas', '🍕',
  52000, NULL, 'Pizzas', true, 7
),
(
  'p1090000-0000-4000-0402-000000000007', 'b1090000-0000-4000-0402-000000004002', 'Pizza premium trufa', 'Champiñón y aceite de trufa', '🍕',
  42000, NULL, 'Premium', true, 8
),
(
  'p1090000-0000-4000-0402-000000000008', 'b1090000-0000-4000-0402-000000004002', 'Lasagna boloñesa', 'Porción individual', '🍝',
  24000, NULL, 'Pastas', true, 9
),
(
  'p1090000-0000-4000-0402-000000000009', 'b1090000-0000-4000-0402-000000004002', 'Spaghetti a la carbonara', 'Crema y tocineta', '🍝',
  22000, NULL, 'Pastas', true, 10
),
(
  'p1090000-0000-4000-0402-000000000010', 'b1090000-0000-4000-0402-000000004002', 'Raviolis de ricotta', 'Salsa pomodoro', '🍝',
  23000, NULL, 'Pastas', true, 11
),
(
  'p1090000-0000-4000-0402-000000000011', 'b1090000-0000-4000-0402-000000004002', 'Pan de ajo', '4 unidades', '🥖',
  9000, NULL, 'Entradas', true, 12
),
(
  'p1090000-0000-4000-0402-000000000012', 'b1090000-0000-4000-0402-000000004002', 'Deditos de queso x6', 'Con salsa ranch', '🧀',
  14000, NULL, 'Entradas', true, 13
),
(
  'p1090000-0000-4000-0402-000000000013', 'b1090000-0000-4000-0402-000000004002', 'Alitas buffalo x6', 'Picante medio', '🍗',
  18000, NULL, 'Entradas', true, 14
),
(
  'p1090000-0000-4000-0402-000000000014', 'b1090000-0000-4000-0402-000000004002', 'Ensalada César', 'Pollo opcional +2000', '🥗',
  16000, NULL, 'Ensaladas', true, 15
),
(
  'p1090000-0000-4000-0402-000000000015', 'b1090000-0000-4000-0402-000000004002', 'Combo pizza + gaseosa', 'Mediana + 1.5L', '🍱',
  34000, 38000, 'Combos', true, 16
),
(
  'p1090000-0000-4000-0402-000000000016', 'b1090000-0000-4000-0402-000000004002', 'Combo pareja', '2 personales + postre', '🍱',
  45000, NULL, 'Combos', true, 17
),
(
  'p1090000-0000-4000-0402-000000000017', 'b1090000-0000-4000-0402-000000004002', 'Pizza kids', 'Personal queso', '🧒',
  15000, NULL, 'Kids', true, 18
),
(
  'p1090000-0000-4000-0402-000000000018', 'b1090000-0000-4000-0402-000000004002', 'Tiramisú', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 19
),
(
  'p1090000-0000-4000-0402-000000000019', 'b1090000-0000-4000-0402-000000004002', 'Gelato 2 bolas', 'Sabores del día', '🍦',
  9000, NULL, 'Postres', true, 20
),
(
  'p1090000-0000-4000-0402-000000000020', 'b1090000-0000-4000-0402-000000004002', 'Limonada de coco', '16oz', '🥥',
  7000, NULL, 'Bebidas', true, 21
),
(
  'p1090000-0000-4000-0402-000000000021', 'b1090000-0000-4000-0402-000000004002', 'Gaseosa 1.5L', 'Para compartir', '🥤',
  7000, NULL, 'Bebidas', true, 22
),
(
  'p1090000-0000-4000-0402-000000000022', 'b1090000-0000-4000-0402-000000004002', 'Té helado', 'Durazno o limón', '🧋',
  5000, NULL, 'Bebidas', true, 23
),
(
  'p1090000-0000-4000-0402-000000000023', 'b1090000-0000-4000-0402-000000004002', 'Extra queso', 'Adición', '🧀',
  4000, NULL, 'Extras', true, 24
),
(
  'p1090000-0000-4000-0402-000000000024', 'b1090000-0000-4000-0402-000000004002', 'Extra pepperoni', 'Adición', '🍕',
  4500, NULL, 'Extras', true, 25
),
(
  'p1090000-0000-4000-0402-000000000025', 'b1090000-0000-4000-0402-000000004002', 'Borde relleno queso', 'Solo medianas/familiares', '🧀',
  6000, NULL, 'Extras', true, 26
),
(
  'p1090000-0000-4000-0402-000000000026', 'b1090000-0000-4000-0402-000000004002', 'Calzone jamón', 'Cerrado al horno', '🥟',
  25000, NULL, 'Platos', true, 27
),
(
  'p1090000-0000-4000-0402-000000000027', 'b1090000-0000-4000-0402-000000004002', 'Focaccia del día', 'Aceite y romero', '🍞',
  10000, NULL, 'Entradas', true, 28
),
(
  'p1090000-0000-4000-0402-000000000028', 'b1090000-0000-4000-0402-000000004002', 'Promo martes 2x1 personal', 'Solo martes, queso', '🏷️',
  18000, NULL, 'Edición limitada', true, 29
),
(
  'p1090000-0000-4000-0403-000000000001', 'b1090000-0000-4000-0403-000000004003', '1/4 pollo broaster', 'Pierna o pechuga, papas', '🍗',
  16000, NULL, 'Pollo', true, 30
),
(
  'p1090000-0000-4000-0403-000000000002', 'b1090000-0000-4000-0403-000000004003', '1/2 pollo broaster', 'Con papas y ensalada', '🍗',
  28000, 32000, 'Pollo', true, 31
),
(
  'p1090000-0000-4000-0403-000000000003', 'b1090000-0000-4000-0403-000000004003', 'Pollo entero broaster', 'Familiar, 8 piezas aprox.', '🍗',
  48000, NULL, 'Pollo', true, 32
),
(
  'p1090000-0000-4000-0403-000000000004', 'b1090000-0000-4000-0403-000000004003', 'Combo 2 piezas', '2 piezas + papas + gaseosa', '🍱',
  18000, NULL, 'Combos', true, 33
),
(
  'p1090000-0000-4000-0403-000000000005', 'b1090000-0000-4000-0403-000000004003', 'Combo 3 piezas', '3 piezas + papas + gaseosa', '🍱',
  22000, 25000, 'Combos', true, 34
),
(
  'p1090000-0000-4000-0403-000000000006', 'b1090000-0000-4000-0403-000000004003', 'Combo familiar', '8 piezas + papas familiares + 1.5L', '🍱',
  62000, NULL, 'Combos', true, 35
),
(
  'p1090000-0000-4000-0403-000000000007', 'b1090000-0000-4000-0403-000000004003', 'Nuggets x10', 'Con salsa a elegir', '🧒',
  14000, NULL, 'Kids', true, 36
),
(
  'p1090000-0000-4000-0403-000000000008', 'b1090000-0000-4000-0403-000000004003', 'Alitas BBQ x6', 'Glaseadas', '🍗',
  17000, NULL, 'Alitas', true, 37
),
(
  'p1090000-0000-4000-0403-000000000009', 'b1090000-0000-4000-0403-000000004003', 'Alitas buffalo x6', 'Picante', '🌶️',
  17000, NULL, 'Alitas', true, 38
),
(
  'p1090000-0000-4000-0403-000000000010', 'b1090000-0000-4000-0403-000000004003', 'Papas grandes', 'Sal y orégano', '🍟',
  8000, NULL, 'Acompañamientos', true, 39
),
(
  'p1090000-0000-4000-0403-000000000011', 'b1090000-0000-4000-0403-000000004003', 'Papas familiares', 'Para compartir', '🍟',
  14000, NULL, 'Acompañamientos', true, 40
),
(
  'p1090000-0000-4000-0403-000000000012', 'b1090000-0000-4000-0403-000000004003', 'Aroz con verduras', 'Porción', '🍚',
  6000, NULL, 'Acompañamientos', true, 41
),
(
  'p1090000-0000-4000-0403-000000000013', 'b1090000-0000-4000-0403-000000004003', 'Ensalada coleslaw', 'Crema ligera', '🥗',
  5000, NULL, 'Acompañamientos', true, 42
),
(
  'p1090000-0000-4000-0403-000000000014', 'b1090000-0000-4000-0403-000000004003', 'Arepa sencilla', 'Asada', '🫓',
  3500, NULL, 'Acompañamientos', true, 43
),
(
  'p1090000-0000-4000-0403-000000000015', 'b1090000-0000-4000-0403-000000004003', 'Salsa BBQ', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 44
),
(
  'p1090000-0000-4000-0403-000000000016', 'b1090000-0000-4000-0403-000000004003', 'Salsa ajo', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 45
),
(
  'p1090000-0000-4000-0403-000000000017', 'b1090000-0000-4000-0403-000000004003', 'Salsa picante', 'Nivel alto', '🌶️',
  2000, NULL, 'Salsas', true, 46
),
(
  'p1090000-0000-4000-0403-000000000018', 'b1090000-0000-4000-0403-000000004003', 'Hamburguesa de pollo', 'Crispy, lechuga, tomate', '🍔',
  19000, NULL, 'Platos', true, 47
),
(
  'p1090000-0000-4000-0403-000000000019', 'b1090000-0000-4000-0403-000000004003', 'Wrap de pollo', 'Tortilla, vegetales', '🌯',
  18000, NULL, 'Platos', true, 48
),
(
  'p1090000-0000-4000-0403-000000000020', 'b1090000-0000-4000-0403-000000004003', 'Menú infantil nuggets', '6 nuggets + papa + jugo', '🧒',
  15000, NULL, 'Kids', true, 49
),
(
  'p1090000-0000-4000-0403-000000000021', 'b1090000-0000-4000-0403-000000004003', 'Postre brownie', 'Unidad', '🍫',
  7000, NULL, 'Postres', true, 50
),
(
  'p1090000-0000-4000-0403-000000000022', 'b1090000-0000-4000-0403-000000004003', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 51
),
(
  'p1090000-0000-4000-0403-000000000023', 'b1090000-0000-4000-0403-000000004003', 'Jugo hit', 'Personal', '🧃',
  4000, NULL, 'Bebidas', true, 52
),
(
  'p1090000-0000-4000-0403-000000000024', 'b1090000-0000-4000-0403-000000004003', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 53
),
(
  'p1090000-0000-4000-0403-000000000025', 'b1090000-0000-4000-0403-000000004003', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 54
),
(
  'p1090000-0000-4000-0403-000000000026', 'b1090000-0000-4000-0403-000000004003', 'Pollo a la plancha', 'Opción más liviana', '🍗',
  20000, NULL, 'Premium', true, 55
),
(
  'p1090000-0000-4000-0403-000000000027', 'b1090000-0000-4000-0403-000000004003', 'Combo oficina', '2 piezas + arroz + té', '🍱',
  17000, NULL, 'Combos', true, 56
),
(
  'p1090000-0000-4000-0403-000000000028', 'b1090000-0000-4000-0403-000000004003', 'Edición miel mostaza', 'Alitas x8', '🍯',
  19000, NULL, 'Edición limitada', true, 57
),
(
  'p1090000-0000-4000-0404-000000000001', 'b1090000-0000-4000-0404-000000004004', 'Clásica Urabá', 'Carne 140g, queso, vegetales', '🍔',
  18000, NULL, 'Hamburguesas', true, 58
),
(
  'p1090000-0000-4000-0404-000000000002', 'b1090000-0000-4000-0404-000000004004', 'Doble smash', 'Dos carnes smash, cheddar', '🍔',
  24000, 27000, 'Hamburguesas', true, 59
),
(
  'p1090000-0000-4000-0404-000000000003', 'b1090000-0000-4000-0404-000000004004', 'BBQ bacon', 'Tocineta, BBQ, cebolla crispy', '🍔',
  26000, NULL, 'Hamburguesas', true, 60
),
(
  'p1090000-0000-4000-0404-000000000004', 'b1090000-0000-4000-0404-000000004004', 'Pollo crispy', 'Pechuga empanizada', '🍔',
  20000, NULL, 'Hamburguesas', true, 61
),
(
  'p1090000-0000-4000-0404-000000000005', 'b1090000-0000-4000-0404-000000004004', 'Veggie bean', 'Hamburguesa de frijol y avena', '🌱',
  19000, NULL, 'Hamburguesas', true, 62
),
(
  'p1090000-0000-4000-0404-000000000006', 'b1090000-0000-4000-0404-000000004004', 'Premium angus', 'Carne 180g, cebolla caramelizada', '🍔',
  32000, NULL, 'Premium', true, 63
),
(
  'p1090000-0000-4000-0404-000000000007', 'b1090000-0000-4000-0404-000000004004', 'Combo clásico', 'Burger + papas + gaseosa', '🍱',
  25000, 28000, 'Combos', true, 64
),
(
  'p1090000-0000-4000-0404-000000000008', 'b1090000-0000-4000-0404-000000004004', 'Combo doble', 'Doble smash + papas + gaseosa', '🍱',
  32000, NULL, 'Combos', true, 65
),
(
  'p1090000-0000-4000-0404-000000000009', 'b1090000-0000-4000-0404-000000004004', 'Papas caseras', 'Porción', '🍟',
  7000, NULL, 'Acompañamientos', true, 66
),
(
  'p1090000-0000-4000-0404-000000000010', 'b1090000-0000-4000-0404-000000004004', 'Papas con queso', 'Cheddar fundido', '🍟',
  10000, NULL, 'Acompañamientos', true, 67
),
(
  'p1090000-0000-4000-0404-000000000011', 'b1090000-0000-4000-0404-000000004004', 'Aros de cebolla', 'Porción', '🧅',
  9000, NULL, 'Acompañamientos', true, 68
),
(
  'p1090000-0000-4000-0404-000000000012', 'b1090000-0000-4000-0404-000000004004', 'Onion rings BBQ', 'Con dip', '🧅',
  10000, NULL, 'Acompañamientos', true, 69
),
(
  'p1090000-0000-4000-0404-000000000013', 'b1090000-0000-4000-0404-000000004004', 'Extra carne', '140g', '🥩',
  7000, NULL, 'Extras', true, 70
),
(
  'p1090000-0000-4000-0404-000000000014', 'b1090000-0000-4000-0404-000000004004', 'Extra tocineta', '2 lonjas', '🥓',
  4000, NULL, 'Extras', true, 71
),
(
  'p1090000-0000-4000-0404-000000000015', 'b1090000-0000-4000-0404-000000004004', 'Extra queso', 'Cheddar', '🧀',
  3000, NULL, 'Extras', true, 72
),
(
  'p1090000-0000-4000-0404-000000000016', 'b1090000-0000-4000-0404-000000004004', 'Kids mini burger', 'Mini + papa + jugo', '🧒',
  14000, NULL, 'Kids', true, 73
),
(
  'p1090000-0000-4000-0404-000000000017', 'b1090000-0000-4000-0404-000000004004', 'Malteada vainilla', '16oz', '🥛',
  10000, NULL, 'Bebidas', true, 74
),
(
  'p1090000-0000-4000-0404-000000000018', 'b1090000-0000-4000-0404-000000004004', 'Malteada chocolate', '16oz', '🍫',
  10000, NULL, 'Bebidas', true, 75
),
(
  'p1090000-0000-4000-0404-000000000019', 'b1090000-0000-4000-0404-000000004004', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 76
),
(
  'p1090000-0000-4000-0404-000000000020', 'b1090000-0000-4000-0404-000000004004', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 77
),
(
  'p1090000-0000-4000-0404-000000000021', 'b1090000-0000-4000-0404-000000004004', 'Hot dog ranchero', 'Con papas', '🌭',
  15000, NULL, 'Platos', true, 78
),
(
  'p1090000-0000-4000-0404-000000000022', 'b1090000-0000-4000-0404-000000004004', 'Salchipapa urbana', 'Salsas a elección', '🍟',
  14000, NULL, 'Platos', true, 79
),
(
  'p1090000-0000-4000-0404-000000000023', 'b1090000-0000-4000-0404-000000004004', 'Brownie', 'Casero', '🍫',
  8000, NULL, 'Postres', true, 80
),
(
  'p1090000-0000-4000-0404-000000000024', 'b1090000-0000-4000-0404-000000004004', 'Cookie con chips', 'Caliente', '🍪',
  6000, NULL, 'Postres', true, 81
),
(
  'p1090000-0000-4000-0404-000000000025', 'b1090000-0000-4000-0404-000000004004', 'Combo noche', 'Burger + malteada', '🌙',
  27000, NULL, 'Combos', true, 82
),
(
  'p1090000-0000-4000-0404-000000000026', 'b1090000-0000-4000-0404-000000004004', 'Salsa de la casa', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 83
),
(
  'p1090000-0000-4000-0404-000000000027', 'b1090000-0000-4000-0404-000000004004', 'Pickles extra', 'Porción', '🥒',
  1500, NULL, 'Extras', true, 84
),
(
  'p1090000-0000-4000-0404-000000000028', 'b1090000-0000-4000-0404-000000004004', 'Edición ají dulce', 'Burger con hogao costeño', '🌶️',
  22000, NULL, 'Edición limitada', true, 85
),
(
  'p1090000-0000-4000-0405-000000000001', 'b1090000-0000-4000-0405-000000004005', 'Café americano', '12oz', '☕',
  4000, NULL, 'Café', true, 86
),
(
  'p1090000-0000-4000-0405-000000000002', 'b1090000-0000-4000-0405-000000004005', 'Café con leche', '12oz', '☕',
  5000, NULL, 'Café', true, 87
),
(
  'p1090000-0000-4000-0405-000000000003', 'b1090000-0000-4000-0405-000000004005', 'Cappuccino', 'Espuma cremosa', '☕',
  7000, NULL, 'Café', true, 88
),
(
  'p1090000-0000-4000-0405-000000000004', 'b1090000-0000-4000-0405-000000004005', 'Latte', '12oz', '☕',
  7500, NULL, 'Café', true, 89
),
(
  'p1090000-0000-4000-0405-000000000005', 'b1090000-0000-4000-0405-000000004005', 'Chocolate caliente', 'Con marshmallow', '🍫',
  7000, NULL, 'Café', true, 90
),
(
  'p1090000-0000-4000-0405-000000000006', 'b1090000-0000-4000-0405-000000004005', 'Tinto costeño', 'Pequeño', '☕',
  2500, NULL, 'Café', true, 91
),
(
  'p1090000-0000-4000-0405-000000000007', 'b1090000-0000-4000-0405-000000004005', 'Desayuno completo', 'Huevos, arepa, queso, café', '🍳',
  14000, 16000, 'Desayunos', true, 92
),
(
  'p1090000-0000-4000-0405-000000000008', 'b1090000-0000-4000-0405-000000004005', 'Desayuno light', 'Yogurt, fruta, granola', '🥣',
  12000, NULL, 'Desayunos', true, 93
),
(
  'p1090000-0000-4000-0405-000000000009', 'b1090000-0000-4000-0405-000000004005', 'Calentado antioqueño', 'Frijol, arroz, carne, huevo', '🍛',
  16000, NULL, 'Desayunos', true, 94
),
(
  'p1090000-0000-4000-0405-000000000010', 'b1090000-0000-4000-0405-000000004005', 'Pandebono x3', 'Calientes', '🧀',
  6000, NULL, 'Panadería', true, 95
),
(
  'p1090000-0000-4000-0405-000000000011', 'b1090000-0000-4000-0405-000000004005', 'Almojábana x2', 'Recién horneada', '🍞',
  5000, NULL, 'Panadería', true, 96
),
(
  'p1090000-0000-4000-0405-000000000012', 'b1090000-0000-4000-0405-000000004005', 'Croissant jamón queso', 'Horno del día', '🥐',
  8000, NULL, 'Panadería', true, 97
),
(
  'p1090000-0000-4000-0405-000000000013', 'b1090000-0000-4000-0405-000000004005', 'Brownie', 'Porción', '🍫',
  7000, NULL, 'Postres', true, 98
),
(
  'p1090000-0000-4000-0405-000000000014', 'b1090000-0000-4000-0405-000000004005', 'Cheesecake frutos rojos', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 99
),
(
  'p1090000-0000-4000-0405-000000000015', 'b1090000-0000-4000-0405-000000004005', 'Muffin del día', 'Sabor rotativo', '🧁',
  5500, NULL, 'Panadería', true, 0
),
(
  'p1090000-0000-4000-0405-000000000016', 'b1090000-0000-4000-0405-000000004005', 'Jugo de naranja', 'Natural 12oz', '🍊',
  6000, NULL, 'Bebidas', true, 1
),
(
  'p1090000-0000-4000-0405-000000000017', 'b1090000-0000-4000-0405-000000004005', 'Limonada de hierbabuena', '16oz', '🍋',
  5500, NULL, 'Bebidas', true, 2
),
(
  'p1090000-0000-4000-0405-000000000018', 'b1090000-0000-4000-0405-000000004005', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 3
),
(
  'p1090000-0000-4000-0405-000000000019', 'b1090000-0000-4000-0405-000000004005', 'Sándwich pollo', 'Pan artesanal', '🥪',
  13000, NULL, 'Platos', true, 4
),
(
  'p1090000-0000-4000-0405-000000000020', 'b1090000-0000-4000-0405-000000004005', 'Sándwich vegetariano', 'Queso y vegetales', '🥪',
  12000, NULL, 'Platos', true, 5
),
(
  'p1090000-0000-4000-0405-000000000021', 'b1090000-0000-4000-0405-000000004005', 'Empanada de carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 6
),
(
  'p1090000-0000-4000-0405-000000000022', 'b1090000-0000-4000-0405-000000004005', 'Combo tarde', 'Café + pandebono', '🍱',
  9000, 11000, 'Combos', true, 7
),
(
  'p1090000-0000-4000-0405-000000000023', 'b1090000-0000-4000-0405-000000004005', 'Combo oficina', 'Sándwich + jugo', '🍱',
  16000, NULL, 'Combos', true, 8
),
(
  'p1090000-0000-4000-0405-000000000024', 'b1090000-0000-4000-0405-000000004005', 'Kids hotcakes', 'Con miel', '🧒',
  10000, NULL, 'Kids', true, 9
),
(
  'p1090000-0000-4000-0405-000000000025', 'b1090000-0000-4000-0405-000000004005', 'Té chai latte', 'Especiado', '🧋',
  8000, NULL, 'Café', true, 10
),
(
  'p1090000-0000-4000-0405-000000000026', 'b1090000-0000-4000-0405-000000004005', 'Affogato', 'Helado + espresso', '🍨',
  9000, NULL, 'Postres', true, 11
),
(
  'p1090000-0000-4000-0405-000000000027', 'b1090000-0000-4000-0405-000000004005', 'Galleta avena', 'Unidad', '🍪',
  3500, NULL, 'Panadería', true, 12
),
(
  'p1090000-0000-4000-0405-000000000028', 'b1090000-0000-4000-0405-000000004005', 'Edición café de Urabá', 'Origen regional 12oz', '☕',
  8500, NULL, 'Edición limitada', true, 13
),
(
  'p1090000-0000-4000-0406-000000000001', 'b1090000-0000-4000-0406-000000004006', 'Arepa de huevo', 'Frita, huevo adentro', '🫓',
  7000, NULL, 'Arepas', true, 14
),
(
  'p1090000-0000-4000-0406-000000000002', 'b1090000-0000-4000-0406-000000004006', 'Arepa de huevo doble', 'Doble huevo', '🫓',
  9000, NULL, 'Arepas', true, 15
),
(
  'p1090000-0000-4000-0406-000000000003', 'b1090000-0000-4000-0406-000000004006', 'Arepa con queso', 'Queso costeño', '🫓',
  6000, NULL, 'Arepas', true, 16
),
(
  'p1090000-0000-4000-0406-000000000004', 'b1090000-0000-4000-0406-000000004006', 'Arepa con todo', 'Huevo, queso, hogao', '🫓',
  10000, NULL, 'Arepas', true, 17
),
(
  'p1090000-0000-4000-0406-000000000005', 'b1090000-0000-4000-0406-000000004006', 'Arepa de pollo', 'Pollo desmechado', '🫓',
  11000, NULL, 'Arepas', true, 18
),
(
  'p1090000-0000-4000-0406-000000000006', 'b1090000-0000-4000-0406-000000004006', 'Arepa de carne', 'Carne desmechada', '🫓',
  12000, NULL, 'Arepas', true, 19
),
(
  'p1090000-0000-4000-0406-000000000007', 'b1090000-0000-4000-0406-000000004006', 'Arepa de chorizo', 'Chorizo y hogao', '🫓',
  11000, NULL, 'Arepas', true, 20
),
(
  'p1090000-0000-4000-0406-000000000008', 'b1090000-0000-4000-0406-000000004006', 'Combo desayuno', 'Arepa huevo + café + jugo', '🍱',
  14000, 16000, 'Combos', true, 21
),
(
  'p1090000-0000-4000-0406-000000000009', 'b1090000-0000-4000-0406-000000004006', 'Combo almuerzo', 'Arepa carne + limonada', '🍱',
  15000, NULL, 'Combos', true, 22
),
(
  'p1090000-0000-4000-0406-000000000010', 'b1090000-0000-4000-0406-000000004006', 'Empanada carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 23
),
(
  'p1090000-0000-4000-0406-000000000011', 'b1090000-0000-4000-0406-000000004006', 'Empanada pollo', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 24
),
(
  'p1090000-0000-4000-0406-000000000012', 'b1090000-0000-4000-0406-000000004006', 'Empanada papa-carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 25
),
(
  'p1090000-0000-4000-0406-000000000013', 'b1090000-0000-4000-0406-000000004006', 'Buñuelo x2', 'Calientes', '🍩',
  4000, NULL, 'Snacks', true, 26
),
(
  'p1090000-0000-4000-0406-000000000014', 'b1090000-0000-4000-0406-000000004006', 'Jugo de mango', 'Natural', '🥭',
  6000, NULL, 'Bebidas', true, 27
),
(
  'p1090000-0000-4000-0406-000000000015', 'b1090000-0000-4000-0406-000000004006', 'Jugo de lulo', 'Natural', '🧃',
  6000, NULL, 'Bebidas', true, 28
),
(
  'p1090000-0000-4000-0406-000000000016', 'b1090000-0000-4000-0406-000000004006', 'Café con leche', 'Vaso', '☕',
  4000, NULL, 'Bebidas', true, 29
),
(
  'p1090000-0000-4000-0406-000000000017', 'b1090000-0000-4000-0406-000000004006', 'Tinto', 'Pequeño', '☕',
  2000, NULL, 'Bebidas', true, 30
),
(
  'p1090000-0000-4000-0406-000000000018', 'b1090000-0000-4000-0406-000000004006', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 31
),
(
  'p1090000-0000-4000-0406-000000000019', 'b1090000-0000-4000-0406-000000004006', 'Suero costeño', 'Porción', '🥛',
  3000, NULL, 'Extras', true, 32
),
(
  'p1090000-0000-4000-0406-000000000020', 'b1090000-0000-4000-0406-000000004006', 'Ají', 'Porción', '🌶️',
  1500, NULL, 'Salsas', true, 33
),
(
  'p1090000-0000-4000-0406-000000000021', 'b1090000-0000-4000-0406-000000004006', 'Hogao', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 34
),
(
  'p1090000-0000-4000-0406-000000000022', 'b1090000-0000-4000-0406-000000004006', 'Kids arepa queso', 'Pequeña + jugo', '🧒',
  9000, NULL, 'Kids', true, 35
),
(
  'p1090000-0000-4000-0406-000000000023', 'b1090000-0000-4000-0406-000000004006', 'Patacón con queso', 'Entrada', '🍌',
  8000, NULL, 'Platos', true, 36
),
(
  'p1090000-0000-4000-0406-000000000024', 'b1090000-0000-4000-0406-000000004006', 'Caldo de costilla', 'Taza', '🍲',
  10000, NULL, 'Platos', true, 37
),
(
  'p1090000-0000-4000-0406-000000000025', 'b1090000-0000-4000-0406-000000004006', 'Changua', 'Desayuno', '🥣',
  9000, NULL, 'Desayunos', true, 38
),
(
  'p1090000-0000-4000-0406-000000000026', 'b1090000-0000-4000-0406-000000004006', 'Huevos pericos', 'Con arepa', '🍳',
  10000, NULL, 'Desayunos', true, 39
),
(
  'p1090000-0000-4000-0406-000000000027', 'b1090000-0000-4000-0406-000000004006', 'Mazamorra', 'Vaso', '🥛',
  5000, NULL, 'Postres', true, 40
),
(
  'p1090000-0000-4000-0406-000000000028', 'b1090000-0000-4000-0406-000000004006', 'Edición arepa de camarón', 'Fines de semana', '🦐',
  14000, NULL, 'Edición limitada', true, 41
),
(
  'p1090000-0000-4000-0407-000000000001', 'b1090000-0000-4000-0407-000000004007', 'Huevos AA x12', 'Cartón', '🥚',
  12000, NULL, 'Lácteos y huevos', true, 42
),
(
  'p1090000-0000-4000-0407-000000000002', 'b1090000-0000-4000-0407-000000004007', 'Leche entera 1L', 'UHT', '🥛',
  5500, NULL, 'Lácteos y huevos', true, 43
),
(
  'p1090000-0000-4000-0407-000000000003', 'b1090000-0000-4000-0407-000000004007', 'Queso costeño 250g', 'Fresco', '🧀',
  9000, NULL, 'Lácteos y huevos', true, 44
),
(
  'p1090000-0000-4000-0407-000000000004', 'b1090000-0000-4000-0407-000000004007', 'Yogurt bebible', 'Unidad', '🥛',
  3500, NULL, 'Lácteos y huevos', true, 45
),
(
  'p1090000-0000-4000-0407-000000000005', 'b1090000-0000-4000-0407-000000004007', 'Pan tajado', 'Bolsa', '🍞',
  6000, NULL, 'Panadería', true, 46
),
(
  'p1090000-0000-4000-0407-000000000006', 'b1090000-0000-4000-0407-000000004007', 'Arroz 1kg', 'Blanco', '🍚',
  4500, NULL, 'Despensa', true, 47
),
(
  'p1090000-0000-4000-0407-000000000007', 'b1090000-0000-4000-0407-000000004007', 'Aceite 1L', 'Vegetal', '🫒',
  12000, 14000, 'Despensa', true, 48
),
(
  'p1090000-0000-4000-0407-000000000008', 'b1090000-0000-4000-0407-000000004007', 'Azúcar 1kg', 'Blanca', '🧂',
  4500, NULL, 'Despensa', true, 49
),
(
  'p1090000-0000-4000-0407-000000000009', 'b1090000-0000-4000-0407-000000004007', 'Sal 1kg', 'Refinada', '🧂',
  2500, NULL, 'Despensa', true, 50
),
(
  'p1090000-0000-4000-0407-000000000010', 'b1090000-0000-4000-0407-000000004007', 'Pasta spaghetti 500g', 'Caja', '🍝',
  4000, NULL, 'Despensa', true, 51
),
(
  'p1090000-0000-4000-0407-000000000011', 'b1090000-0000-4000-0407-000000004007', 'Atún lata', 'Agua o aceite', '🐟',
  5500, NULL, 'Despensa', true, 52
),
(
  'p1090000-0000-4000-0407-000000000012', 'b1090000-0000-4000-0407-000000004007', 'Frijol cargamanto 500g', 'Bolsa', '🫘',
  5000, NULL, 'Despensa', true, 53
),
(
  'p1090000-0000-4000-0407-000000000013', 'b1090000-0000-4000-0407-000000004007', 'Plátano maduro x3', 'Unidad aprox.', '🍌',
  4000, NULL, 'Frutas y verduras', true, 54
),
(
  'p1090000-0000-4000-0407-000000000014', 'b1090000-0000-4000-0407-000000004007', 'Tomate chonto 500g', 'Fresco', '🍅',
  3500, NULL, 'Frutas y verduras', true, 55
),
(
  'p1090000-0000-4000-0407-000000000015', 'b1090000-0000-4000-0407-000000004007', 'Cebolla cabezona 500g', 'Fresco', '🧅',
  3000, NULL, 'Frutas y verduras', true, 56
),
(
  'p1090000-0000-4000-0407-000000000016', 'b1090000-0000-4000-0407-000000004007', 'Papa pastusa 1kg', 'Fresco', '🥔',
  4500, NULL, 'Frutas y verduras', true, 57
),
(
  'p1090000-0000-4000-0407-000000000017', 'b1090000-0000-4000-0407-000000004007', 'Banano x6', 'Racimo pequeño', '🍌',
  4000, NULL, 'Frutas y verduras', true, 58
),
(
  'p1090000-0000-4000-0407-000000000018', 'b1090000-0000-4000-0407-000000004007', 'Limón x5', 'Ácidos', '🍋',
  2500, NULL, 'Frutas y verduras', true, 59
),
(
  'p1090000-0000-4000-0407-000000000019', 'b1090000-0000-4000-0407-000000004007', 'Pollo entero congelado', 'Aprox 1.5kg', '🍗',
  18000, NULL, 'Congelados', true, 60
),
(
  'p1090000-0000-4000-0407-000000000020', 'b1090000-0000-4000-0407-000000004007', 'Carne molida 500g', 'Res', '🥩',
  14000, NULL, 'Carnes', true, 61
),
(
  'p1090000-0000-4000-0407-000000000021', 'b1090000-0000-4000-0407-000000004007', 'Jabón en barra x3', 'Ropa', '🧼',
  8000, NULL, 'Aseo', true, 62
),
(
  'p1090000-0000-4000-0407-000000000022', 'b1090000-0000-4000-0407-000000004007', 'Detergente 1kg', 'En polvo', '🧺',
  12000, NULL, 'Aseo', true, 63
),
(
  'p1090000-0000-4000-0407-000000000023', 'b1090000-0000-4000-0407-000000004007', 'Papel higiénico x4', 'Doble hoja', '🧻',
  10000, 12000, 'Aseo', true, 64
),
(
  'p1090000-0000-4000-0407-000000000024', 'b1090000-0000-4000-0407-000000004007', 'Jabón antibacterial', 'Líquido 250ml', '🧴',
  7000, NULL, 'Cuidado personal', true, 65
),
(
  'p1090000-0000-4000-0407-000000000025', 'b1090000-0000-4000-0407-000000004007', 'Pasta dental', 'Tubo', '🦷',
  6500, NULL, 'Cuidado personal', true, 66
),
(
  'p1090000-0000-4000-0407-000000000026', 'b1090000-0000-4000-0407-000000004007', 'Pañales etapa 3 x10', 'Pack', '👶',
  22000, NULL, 'Bebé', true, 67
),
(
  'p1090000-0000-4000-0407-000000000027', 'b1090000-0000-4000-0407-000000004007', 'Pañitos húmedos', 'Paquete', '👶',
  9000, NULL, 'Bebé', true, 68
),
(
  'p1090000-0000-4000-0407-000000000028', 'b1090000-0000-4000-0407-000000004007', 'Gaseosa 1.5L', 'Sabor a elegir', '🥤',
  7000, NULL, 'Bebidas', true, 69
),
(
  'p1090000-0000-4000-0407-000000000029', 'b1090000-0000-4000-0407-000000004007', 'Agua 6L', 'Bidón', '💧',
  8000, NULL, 'Bebidas', true, 70
),
(
  'p1090000-0000-4000-0407-000000000030', 'b1090000-0000-4000-0407-000000004007', 'Snack papas 150g', 'Bolsa', '🥔',
  5500, NULL, 'Snacks', true, 71
),
(
  'p1090000-0000-4000-0407-000000000031', 'b1090000-0000-4000-0407-000000004007', 'Galletas surtidas', 'Paquete', '🍪',
  4500, NULL, 'Snacks', true, 72
),
(
  'p1090000-0000-4000-0407-000000000032', 'b1090000-0000-4000-0407-000000004007', 'Café molido 250g', 'Tradicional', '☕',
  11000, NULL, 'Despensa', true, 73
),
(
  'p1090000-0000-4000-0408-000000000001', 'b1090000-0000-4000-0408-000000004008', 'Acetaminofén 500mg x20', 'Uso OTC', '💊',
  8000, NULL, 'Analgésicos', true, 74
),
(
  'p1090000-0000-4000-0408-000000000002', 'b1090000-0000-4000-0408-000000004008', 'Ibuprofeno 400mg x10', 'Uso OTC', '💊',
  9000, NULL, 'Analgésicos', true, 75
),
(
  'p1090000-0000-4000-0408-000000000003', 'b1090000-0000-4000-0408-000000004008', 'Suero oral', 'Sobre', '🧪',
  3500, NULL, 'Primeros auxilios', true, 76
),
(
  'p1090000-0000-4000-0408-000000000004', 'b1090000-0000-4000-0408-000000004008', 'Curitas x20', 'Surtidas', '🩹',
  6000, NULL, 'Primeros auxilios', true, 77
),
(
  'p1090000-0000-4000-0408-000000000005', 'b1090000-0000-4000-0408-000000004008', 'Alcohol antiséptico 120ml', 'Botella', '🧴',
  5000, NULL, 'Primeros auxilios', true, 78
),
(
  'p1090000-0000-4000-0408-000000000006', 'b1090000-0000-4000-0408-000000004008', 'Agua oxigenada 120ml', 'Botella', '🧴',
  4500, NULL, 'Primeros auxilios', true, 79
),
(
  'p1090000-0000-4000-0408-000000000007', 'b1090000-0000-4000-0408-000000004008', 'Gasas estériles', 'Paquete', '🩹',
  7000, NULL, 'Primeros auxilios', true, 80
),
(
  'p1090000-0000-4000-0408-000000000008', 'b1090000-0000-4000-0408-000000004008', 'Termómetro digital', 'Unidad', '🌡️',
  25000, NULL, 'Bienestar', true, 81
),
(
  'p1090000-0000-4000-0408-000000000009', 'b1090000-0000-4000-0408-000000004008', 'Vitamina C efervescente', 'Tubo', '🍊',
  18000, 22000, 'Bienestar', true, 82
),
(
  'p1090000-0000-4000-0408-000000000010', 'b1090000-0000-4000-0408-000000004008', 'Multivitamínico x30', 'Tabletas', '💊',
  32000, NULL, 'Bienestar', true, 83
),
(
  'p1090000-0000-4000-0408-000000000011', 'b1090000-0000-4000-0408-000000004008', 'Protector solar FPS50', 'Crema 60ml', '☀️',
  35000, NULL, 'Cuidado personal', true, 84
),
(
  'p1090000-0000-4000-0408-000000000012', 'b1090000-0000-4000-0408-000000004008', 'Crema humectante', '120ml', '🧴',
  18000, NULL, 'Cuidado personal', true, 85
),
(
  'p1090000-0000-4000-0408-000000000013', 'b1090000-0000-4000-0408-000000004008', 'Shampoo anticaspa', '400ml', '🧴',
  22000, NULL, 'Cuidado personal', true, 86
),
(
  'p1090000-0000-4000-0408-000000000014', 'b1090000-0000-4000-0408-000000004008', 'Jabón íntimo', '200ml', '🧴',
  16000, NULL, 'Cuidado personal', true, 87
),
(
  'p1090000-0000-4000-0408-000000000015', 'b1090000-0000-4000-0408-000000004008', 'Toallas higiénicas x10', 'Paquete', '📦',
  9000, NULL, 'Cuidado personal', true, 88
),
(
  'p1090000-0000-4000-0408-000000000016', 'b1090000-0000-4000-0408-000000004008', 'Pañales etapa 2 x12', 'Pack', '👶',
  28000, NULL, 'Bebé', true, 89
),
(
  'p1090000-0000-4000-0408-000000000017', 'b1090000-0000-4000-0408-000000004008', 'Crema antipañalitis', 'Tubo', '👶',
  20000, NULL, 'Bebé', true, 90
),
(
  'p1090000-0000-4000-0408-000000000018', 'b1090000-0000-4000-0408-000000004008', 'Repelente spray', '120ml', '🦟',
  18000, NULL, 'Bienestar', true, 91
),
(
  'p1090000-0000-4000-0408-000000000019', 'b1090000-0000-4000-0408-000000004008', 'Sales de rehidratación', 'Caja x5', '🧪',
  10000, NULL, 'Primeros auxilios', true, 92
),
(
  'p1090000-0000-4000-0408-000000000020', 'b1090000-0000-4000-0408-000000004008', 'Pastillas para la garganta', 'Caja', '🍬',
  8000, NULL, 'Analgésicos', true, 93
),
(
  'p1090000-0000-4000-0408-000000000021', 'b1090000-0000-4000-0408-000000004008', 'Alcohol en gel 60ml', 'Antibacterial', '🧴',
  6000, NULL, 'Cuidado personal', true, 94
),
(
  'p1090000-0000-4000-0408-000000000022', 'b1090000-0000-4000-0408-000000004008', 'Mascarillas x10', 'Desechables', '😷',
  8000, NULL, 'Bienestar', true, 95
),
(
  'p1090000-0000-4000-0408-000000000023', 'b1090000-0000-4000-0408-000000004008', 'Preservativos x3', 'Caja', '📦',
  9000, NULL, 'Cuidado personal', true, 96
),
(
  'p1090000-0000-4000-0408-000000000024', 'b1090000-0000-4000-0408-000000004008', 'Prueba de embarazo', 'Unidad', '🧪',
  12000, NULL, 'Bienestar', true, 97
),
(
  'p1090000-0000-4000-0408-000000000025', 'b1090000-0000-4000-0408-000000004008', 'Algodón 50g', 'Bolsa', '☁️',
  4000, NULL, 'Primeros auxilios', true, 98
),
(
  'p1090000-0000-4000-0408-000000000026', 'b1090000-0000-4000-0408-000000004008', 'Gotas lubricantes oculares', 'Frasco', '👁️',
  22000, NULL, 'Bienestar', true, 99
),
(
  'p1090000-0000-4000-0408-000000000027', 'b1090000-0000-4000-0408-000000004008', 'Jabón neutro', 'Barra', '🧼',
  5000, NULL, 'Cuidado personal', true, 0
),
(
  'p1090000-0000-4000-0408-000000000028', 'b1090000-0000-4000-0408-000000004008', 'Kit viaje básicos', 'Curitas + gel + acetaminofén', '🧰',
  25000, NULL, 'Kits', true, 1
),
(
  'p1090000-0000-4000-0408-000000000029', 'b1090000-0000-4000-0408-000000004008', 'Suero fisiológico', 'Frasco', '💧',
  7000, NULL, 'Primeros auxilios', true, 2
),
(
  'p1090000-0000-4000-0408-000000000030', 'b1090000-0000-4000-0408-000000004008', 'Talco mentolado', '120g', '🧴',
  9000, NULL, 'Cuidado personal', true, 3
),
(
  'p1090000-0000-4000-0409-000000000001', 'b1090000-0000-4000-0409-000000004009', 'Cepillo dental x2', 'Suave', '🪥',
  8000, NULL, 'Cuidado personal', true, 4
),
(
  'p1090000-0000-4000-0409-000000000002', 'b1090000-0000-4000-0409-000000004009', 'Desodorante roll-on', 'Unisex', '🧴',
  12000, NULL, 'Cuidado personal', true, 5
),
(
  'p1090000-0000-4000-0409-000000000003', 'b1090000-0000-4000-0409-000000004009', 'Crema de manos', '60ml', '💅',
  10000, NULL, 'Belleza', true, 6
),
(
  'p1090000-0000-4000-0409-000000000004', 'b1090000-0000-4000-0409-000000004009', 'Esmalte básico', 'Color a elegir', '💅',
  9000, NULL, 'Belleza', true, 7
),
(
  'p1090000-0000-4000-0409-000000000005', 'b1090000-0000-4000-0409-000000004009', 'Labial hidratante', 'Transparente', '💄',
  11000, NULL, 'Belleza', true, 8
),
(
  'p1090000-0000-4000-0409-000000000006', 'b1090000-0000-4000-0409-000000004009', 'Peine y cepillo set', 'Cabello', '💇',
  15000, NULL, 'Belleza', true, 9
),
(
  'p1090000-0000-4000-0409-000000000007', 'b1090000-0000-4000-0409-000000004009', 'Velas aromáticas', 'Pack x2', '🕯️',
  18000, NULL, 'Hogar', true, 10
),
(
  'p1090000-0000-4000-0409-000000000008', 'b1090000-0000-4000-0409-000000004009', 'Organizador plástico', 'Multiusos', '📦',
  22000, NULL, 'Hogar', true, 11
),
(
  'p1090000-0000-4000-0409-000000000009', 'b1090000-0000-4000-0409-000000004009', 'Trapero microfibra', 'Unidad', '🧹',
  14000, NULL, 'Hogar', true, 12
),
(
  'p1090000-0000-4000-0409-000000000010', 'b1090000-0000-4000-0409-000000004009', 'Guantes de cocina', 'Par', '🧤',
  12000, NULL, 'Hogar', true, 13
),
(
  'p1090000-0000-4000-0409-000000000011', 'b1090000-0000-4000-0409-000000004009', 'Termo 500ml', 'Acero', '🥤',
  35000, 42000, 'Hogar', true, 14
),
(
  'p1090000-0000-4000-0409-000000000012', 'b1090000-0000-4000-0409-000000004009', 'Lonchera térmica', 'Escuela/oficina', '👜',
  28000, NULL, 'Hogar', true, 15
),
(
  'p1090000-0000-4000-0409-000000000013', 'b1090000-0000-4000-0409-000000004009', 'Cuaderno universitario', '100 hojas', '📓',
  6000, NULL, 'Papelería', true, 16
),
(
  'p1090000-0000-4000-0409-000000000014', 'b1090000-0000-4000-0409-000000004009', 'Lapiceros x4', 'Azul', '✏️',
  5000, NULL, 'Papelería', true, 17
),
(
  'p1090000-0000-4000-0409-000000000015', 'b1090000-0000-4000-0409-000000004009', 'Marcadores x6', 'Colores', '🖍️',
  9000, NULL, 'Papelería', true, 18
),
(
  'p1090000-0000-4000-0409-000000000016', 'b1090000-0000-4000-0409-000000004009', 'Cinta adhesiva', 'Transparente', '📎',
  4000, NULL, 'Papelería', true, 19
),
(
  'p1090000-0000-4000-0409-000000000017', 'b1090000-0000-4000-0409-000000004009', 'Bolsas reutilizables x3', 'Mercado', '🛍️',
  12000, NULL, 'Hogar', true, 20
),
(
  'p1090000-0000-4000-0409-000000000018', 'b1090000-0000-4000-0409-000000004009', 'Paraguas compacto', 'Negro', '☂️',
  25000, NULL, 'Hogar', true, 21
),
(
  'p1090000-0000-4000-0409-000000000019', 'b1090000-0000-4000-0409-000000004009', 'Gafas de sol', 'UV', '🕶️',
  30000, NULL, 'Moda', true, 22
),
(
  'p1090000-0000-4000-0409-000000000020', 'b1090000-0000-4000-0409-000000004009', 'Gorra básica', 'Ajustable', '🧢',
  22000, NULL, 'Moda', true, 23
),
(
  'p1090000-0000-4000-0409-000000000021', 'b1090000-0000-4000-0409-000000004009', 'Medias deportivas x3', 'Pack', '🧦',
  18000, NULL, 'Moda', true, 24
),
(
  'p1090000-0000-4000-0409-000000000022', 'b1090000-0000-4000-0409-000000004009', 'Toalla facial', 'Algodón', '🧺',
  12000, NULL, 'Hogar', true, 25
),
(
  'p1090000-0000-4000-0409-000000000023', 'b1090000-0000-4000-0409-000000004009', 'Juego cubiertos viaje', 'Acero', '🍴',
  20000, NULL, 'Hogar', true, 26
),
(
  'p1090000-0000-4000-0409-000000000024', 'b1090000-0000-4000-0409-000000004009', 'Florero pequeño', 'Cerámica', '🏺',
  28000, NULL, 'Hogar', true, 27
),
(
  'p1090000-0000-4000-0409-000000000025', 'b1090000-0000-4000-0409-000000004009', 'Ramo artificial', 'Decorativo', '💐',
  25000, NULL, 'Flores', true, 28
),
(
  'p1090000-0000-4000-0409-000000000026', 'b1090000-0000-4000-0409-000000004009', 'Kit manicure', 'Básico', '💅',
  22000, NULL, 'Belleza', true, 29
),
(
  'p1090000-0000-4000-0409-000000000027', 'b1090000-0000-4000-0409-000000004009', 'Cargador pared genérico', 'USB', '🔌',
  20000, NULL, 'Accesorios', true, 30
),
(
  'p1090000-0000-4000-0409-000000000028', 'b1090000-0000-4000-0409-000000004009', 'Llavero linterna', 'LED', '🔑',
  10000, NULL, 'Accesorios', true, 31
),
(
  'p1090000-0000-4000-0409-000000000029', 'b1090000-0000-4000-0409-000000004009', 'Caja organizadora zapatos', 'Plástico', '👟',
  18000, NULL, 'Hogar', true, 32
),
(
  'p1090000-0000-4000-0409-000000000030', 'b1090000-0000-4000-0409-000000004009', 'Ambientador spray', 'Lavanda', '🌸',
  12000, NULL, 'Hogar', true, 33
),
(
  'p1090000-0000-4000-0501-000000000001', 'b1090000-0000-4000-0501-000000005001', 'Picada Urabá (2 pers.)', 'Carne, chorizo, chicharrón, arepa y guacamole', '🥩',
  42000, 48000, 'Platos', true, 34
),
(
  'p1090000-0000-4000-0501-000000000002', 'b1090000-0000-4000-0501-000000005001', 'Picada familiar (4 pers.)', 'Bandeja surtida de parrilla con acompañamientos', '🥩',
  78000, NULL, 'Platos', true, 35
),
(
  'p1090000-0000-4000-0501-000000000003', 'b1090000-0000-4000-0501-000000005001', 'Punta de anca 300g', 'Término a elección, papa criolla y ensalada', '🥩',
  32000, NULL, 'Carnes', true, 36
),
(
  'p1090000-0000-4000-0501-000000000004', 'b1090000-0000-4000-0501-000000005001', 'Costilla BBQ', 'Costilla glaseada, yuca y ensalada', '🍖',
  35000, 39000, 'Carnes', true, 37
),
(
  'p1090000-0000-4000-0501-000000000005', 'b1090000-0000-4000-0501-000000005001', 'Churrasco 350g', 'Corte jugoso, chimichurri de la casa', '🥩',
  38000, NULL, 'Carnes', true, 38
),
(
  'p1090000-0000-4000-0501-000000000006', 'b1090000-0000-4000-0501-000000005001', 'Chorizo artesanal x4', 'Con arepa y hogao', '🌭',
  16000, NULL, 'Entradas', true, 39
),
(
  'p1090000-0000-4000-0501-000000000007', 'b1090000-0000-4000-0501-000000005001', 'Morcilla criolla x3', 'Con limón y ají', '🌭',
  14000, NULL, 'Entradas', true, 40
),
(
  'p1090000-0000-4000-0501-000000000008', 'b1090000-0000-4000-0501-000000005001', 'Chicharrón crocante', 'Porción generosa, limón', '🥓',
  18000, NULL, 'Entradas', true, 41
),
(
  'p1090000-0000-4000-0501-000000000009', 'b1090000-0000-4000-0501-000000005001', 'Arepa de queso', 'Arepa asada rellena', '🫓',
  6000, NULL, 'Acompañamientos', true, 42
),
(
  'p1090000-0000-4000-0501-000000000010', 'b1090000-0000-4000-0501-000000005001', 'Papa criolla salteada', 'Con sal de ajo', '🥔',
  8000, NULL, 'Acompañamientos', true, 43
),
(
  'p1090000-0000-4000-0501-000000000011', 'b1090000-0000-4000-0501-000000005001', 'Yuca frita', 'Con suero costeño', '🥔',
  7000, NULL, 'Acompañamientos', true, 44
),
(
  'p1090000-0000-4000-0501-000000000012', 'b1090000-0000-4000-0501-000000005001', 'Ensalada fresca', 'Lechuga, tomate, cebolla y vinagreta', '🥗',
  7000, NULL, 'Acompañamientos', true, 45
),
(
  'p1090000-0000-4000-0501-000000000013', 'b1090000-0000-4000-0501-000000005001', 'Guacamole casero', 'Porción para compartir', '🥑',
  5000, NULL, 'Salsas', true, 46
),
(
  'p1090000-0000-4000-0501-000000000014', 'b1090000-0000-4000-0501-000000005001', 'Ají de la casa', 'Picante medio', '🌶️',
  2000, NULL, 'Salsas', true, 47
),
(
  'p1090000-0000-4000-0501-000000000015', 'b1090000-0000-4000-0501-000000005001', 'Combo parrillero 1', 'Carne 250g + papa + gaseosa', '🍱',
  28000, 32000, 'Combos', true, 48
),
(
  'p1090000-0000-4000-0501-000000000016', 'b1090000-0000-4000-0501-000000005001', 'Combo parrillero 2', 'Chorizo + chicharrón + arepa + gaseosa', '🍱',
  24000, NULL, 'Combos', true, 49
),
(
  'p1090000-0000-4000-0501-000000000017', 'b1090000-0000-4000-0501-000000005001', 'Menú infantil carne', 'Carne molida, papa y jugo', '🧒',
  16000, NULL, 'Kids', true, 50
),
(
  'p1090000-0000-4000-0501-000000000018', 'b1090000-0000-4000-0501-000000005001', 'Brownie con helado', 'Postre caliente', '🍫',
  12000, NULL, 'Postres', true, 51
),
(
  'p1090000-0000-4000-0501-000000000019', 'b1090000-0000-4000-0501-000000005001', 'Limonada natural 16oz', 'Recién exprimida', '🍋',
  5000, NULL, 'Bebidas', true, 52
),
(
  'p1090000-0000-4000-0501-000000000020', 'b1090000-0000-4000-0501-000000005001', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 53
),
(
  'p1090000-0000-4000-0501-000000000021', 'b1090000-0000-4000-0501-000000005001', 'Agua botella', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 54
),
(
  'p1090000-0000-4000-0501-000000000022', 'b1090000-0000-4000-0501-000000005001', 'Cerveza nacional', 'Unidad fría', '🍺',
  6000, NULL, 'Bebidas', true, 55
),
(
  'p1090000-0000-4000-0501-000000000023', 'b1090000-0000-4000-0501-000000005001', 'Alitas BBQ x8', 'Glaseadas, papas', '🍗',
  26000, NULL, 'Platos', true, 56
),
(
  'p1090000-0000-4000-0501-000000000024', 'b1090000-0000-4000-0501-000000005001', 'Hamburguesa de res', '140g, queso, papas', '🍔',
  22000, NULL, 'Platos', true, 57
),
(
  'p1090000-0000-4000-0501-000000000025', 'b1090000-0000-4000-0501-000000005001', 'Salchipapa especial', 'Salchicha, papa, salsas', '🍟',
  15000, NULL, 'Platos', true, 58
),
(
  'p1090000-0000-4000-0501-000000000026', 'b1090000-0000-4000-0501-000000005001', 'Patacón con hogao', 'Entrada criolla', '🍌',
  9000, NULL, 'Entradas', true, 59
),
(
  'p1090000-0000-4000-0501-000000000027', 'b1090000-0000-4000-0501-000000005001', 'Combo ejecutivo', 'Carne del día + jugo', '🍱',
  20000, NULL, 'Combos', true, 60
),
(
  'p1090000-0000-4000-0501-000000000028', 'b1090000-0000-4000-0501-000000005001', 'Edición plátano maduro', 'Maduro asado con queso', '🍌',
  10000, NULL, 'Edición limitada', true, 61
),
(
  'p1090000-0000-4000-0502-000000000001', 'b1090000-0000-4000-0502-000000005002', 'Pizza margarita mediana', 'Salsa, mozzarella, albahaca', '🍕',
  26000, NULL, 'Pizzas', true, 62
),
(
  'p1090000-0000-4000-0502-000000000002', 'b1090000-0000-4000-0502-000000005002', 'Pizza hawaiana mediana', 'Piña y jamón', '🍕',
  28000, 32000, 'Pizzas', true, 63
),
(
  'p1090000-0000-4000-0502-000000000003', 'b1090000-0000-4000-0502-000000005002', 'Pizza pepperoni mediana', 'Pepperoni extra queso', '🍕',
  30000, NULL, 'Pizzas', true, 64
),
(
  'p1090000-0000-4000-0502-000000000004', 'b1090000-0000-4000-0502-000000005002', 'Pizza pollo BBQ mediana', 'Pollo, cebolla, BBQ', '🍕',
  32000, NULL, 'Pizzas', true, 65
),
(
  'p1090000-0000-4000-0502-000000000005', 'b1090000-0000-4000-0502-000000005002', 'Pizza vegetariana', 'Champiñón, pimentón, aceituna', '🍕',
  29000, NULL, 'Pizzas', true, 66
),
(
  'p1090000-0000-4000-0502-000000000006', 'b1090000-0000-4000-0502-000000005002', 'Pizza familiar 4 sabores', 'Para 4 personas', '🍕',
  52000, NULL, 'Pizzas', true, 67
),
(
  'p1090000-0000-4000-0502-000000000007', 'b1090000-0000-4000-0502-000000005002', 'Pizza premium trufa', 'Champiñón y aceite de trufa', '🍕',
  42000, NULL, 'Premium', true, 68
),
(
  'p1090000-0000-4000-0502-000000000008', 'b1090000-0000-4000-0502-000000005002', 'Lasagna boloñesa', 'Porción individual', '🍝',
  24000, NULL, 'Pastas', true, 69
),
(
  'p1090000-0000-4000-0502-000000000009', 'b1090000-0000-4000-0502-000000005002', 'Spaghetti a la carbonara', 'Crema y tocineta', '🍝',
  22000, NULL, 'Pastas', true, 70
),
(
  'p1090000-0000-4000-0502-000000000010', 'b1090000-0000-4000-0502-000000005002', 'Raviolis de ricotta', 'Salsa pomodoro', '🍝',
  23000, NULL, 'Pastas', true, 71
),
(
  'p1090000-0000-4000-0502-000000000011', 'b1090000-0000-4000-0502-000000005002', 'Pan de ajo', '4 unidades', '🥖',
  9000, NULL, 'Entradas', true, 72
),
(
  'p1090000-0000-4000-0502-000000000012', 'b1090000-0000-4000-0502-000000005002', 'Deditos de queso x6', 'Con salsa ranch', '🧀',
  14000, NULL, 'Entradas', true, 73
),
(
  'p1090000-0000-4000-0502-000000000013', 'b1090000-0000-4000-0502-000000005002', 'Alitas buffalo x6', 'Picante medio', '🍗',
  18000, NULL, 'Entradas', true, 74
),
(
  'p1090000-0000-4000-0502-000000000014', 'b1090000-0000-4000-0502-000000005002', 'Ensalada César', 'Pollo opcional +2000', '🥗',
  16000, NULL, 'Ensaladas', true, 75
),
(
  'p1090000-0000-4000-0502-000000000015', 'b1090000-0000-4000-0502-000000005002', 'Combo pizza + gaseosa', 'Mediana + 1.5L', '🍱',
  34000, 38000, 'Combos', true, 76
),
(
  'p1090000-0000-4000-0502-000000000016', 'b1090000-0000-4000-0502-000000005002', 'Combo pareja', '2 personales + postre', '🍱',
  45000, NULL, 'Combos', true, 77
),
(
  'p1090000-0000-4000-0502-000000000017', 'b1090000-0000-4000-0502-000000005002', 'Pizza kids', 'Personal queso', '🧒',
  15000, NULL, 'Kids', true, 78
),
(
  'p1090000-0000-4000-0502-000000000018', 'b1090000-0000-4000-0502-000000005002', 'Tiramisú', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 79
),
(
  'p1090000-0000-4000-0502-000000000019', 'b1090000-0000-4000-0502-000000005002', 'Gelato 2 bolas', 'Sabores del día', '🍦',
  9000, NULL, 'Postres', true, 80
),
(
  'p1090000-0000-4000-0502-000000000020', 'b1090000-0000-4000-0502-000000005002', 'Limonada de coco', '16oz', '🥥',
  7000, NULL, 'Bebidas', true, 81
),
(
  'p1090000-0000-4000-0502-000000000021', 'b1090000-0000-4000-0502-000000005002', 'Gaseosa 1.5L', 'Para compartir', '🥤',
  7000, NULL, 'Bebidas', true, 82
),
(
  'p1090000-0000-4000-0502-000000000022', 'b1090000-0000-4000-0502-000000005002', 'Té helado', 'Durazno o limón', '🧋',
  5000, NULL, 'Bebidas', true, 83
),
(
  'p1090000-0000-4000-0502-000000000023', 'b1090000-0000-4000-0502-000000005002', 'Extra queso', 'Adición', '🧀',
  4000, NULL, 'Extras', true, 84
),
(
  'p1090000-0000-4000-0502-000000000024', 'b1090000-0000-4000-0502-000000005002', 'Extra pepperoni', 'Adición', '🍕',
  4500, NULL, 'Extras', true, 85
),
(
  'p1090000-0000-4000-0502-000000000025', 'b1090000-0000-4000-0502-000000005002', 'Borde relleno queso', 'Solo medianas/familiares', '🧀',
  6000, NULL, 'Extras', true, 86
),
(
  'p1090000-0000-4000-0502-000000000026', 'b1090000-0000-4000-0502-000000005002', 'Calzone jamón', 'Cerrado al horno', '🥟',
  25000, NULL, 'Platos', true, 87
),
(
  'p1090000-0000-4000-0502-000000000027', 'b1090000-0000-4000-0502-000000005002', 'Focaccia del día', 'Aceite y romero', '🍞',
  10000, NULL, 'Entradas', true, 88
),
(
  'p1090000-0000-4000-0502-000000000028', 'b1090000-0000-4000-0502-000000005002', 'Promo martes 2x1 personal', 'Solo martes, queso', '🏷️',
  18000, NULL, 'Edición limitada', true, 89
),
(
  'p1090000-0000-4000-0503-000000000001', 'b1090000-0000-4000-0503-000000005003', '1/4 pollo broaster', 'Pierna o pechuga, papas', '🍗',
  16000, NULL, 'Pollo', true, 90
),
(
  'p1090000-0000-4000-0503-000000000002', 'b1090000-0000-4000-0503-000000005003', '1/2 pollo broaster', 'Con papas y ensalada', '🍗',
  28000, 32000, 'Pollo', true, 91
),
(
  'p1090000-0000-4000-0503-000000000003', 'b1090000-0000-4000-0503-000000005003', 'Pollo entero broaster', 'Familiar, 8 piezas aprox.', '🍗',
  48000, NULL, 'Pollo', true, 92
),
(
  'p1090000-0000-4000-0503-000000000004', 'b1090000-0000-4000-0503-000000005003', 'Combo 2 piezas', '2 piezas + papas + gaseosa', '🍱',
  18000, NULL, 'Combos', true, 93
),
(
  'p1090000-0000-4000-0503-000000000005', 'b1090000-0000-4000-0503-000000005003', 'Combo 3 piezas', '3 piezas + papas + gaseosa', '🍱',
  22000, 25000, 'Combos', true, 94
),
(
  'p1090000-0000-4000-0503-000000000006', 'b1090000-0000-4000-0503-000000005003', 'Combo familiar', '8 piezas + papas familiares + 1.5L', '🍱',
  62000, NULL, 'Combos', true, 95
),
(
  'p1090000-0000-4000-0503-000000000007', 'b1090000-0000-4000-0503-000000005003', 'Nuggets x10', 'Con salsa a elegir', '🧒',
  14000, NULL, 'Kids', true, 96
),
(
  'p1090000-0000-4000-0503-000000000008', 'b1090000-0000-4000-0503-000000005003', 'Alitas BBQ x6', 'Glaseadas', '🍗',
  17000, NULL, 'Alitas', true, 97
),
(
  'p1090000-0000-4000-0503-000000000009', 'b1090000-0000-4000-0503-000000005003', 'Alitas buffalo x6', 'Picante', '🌶️',
  17000, NULL, 'Alitas', true, 98
),
(
  'p1090000-0000-4000-0503-000000000010', 'b1090000-0000-4000-0503-000000005003', 'Papas grandes', 'Sal y orégano', '🍟',
  8000, NULL, 'Acompañamientos', true, 99
),
(
  'p1090000-0000-4000-0503-000000000011', 'b1090000-0000-4000-0503-000000005003', 'Papas familiares', 'Para compartir', '🍟',
  14000, NULL, 'Acompañamientos', true, 0
),
(
  'p1090000-0000-4000-0503-000000000012', 'b1090000-0000-4000-0503-000000005003', 'Aroz con verduras', 'Porción', '🍚',
  6000, NULL, 'Acompañamientos', true, 1
),
(
  'p1090000-0000-4000-0503-000000000013', 'b1090000-0000-4000-0503-000000005003', 'Ensalada coleslaw', 'Crema ligera', '🥗',
  5000, NULL, 'Acompañamientos', true, 2
),
(
  'p1090000-0000-4000-0503-000000000014', 'b1090000-0000-4000-0503-000000005003', 'Arepa sencilla', 'Asada', '🫓',
  3500, NULL, 'Acompañamientos', true, 3
),
(
  'p1090000-0000-4000-0503-000000000015', 'b1090000-0000-4000-0503-000000005003', 'Salsa BBQ', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 4
),
(
  'p1090000-0000-4000-0503-000000000016', 'b1090000-0000-4000-0503-000000005003', 'Salsa ajo', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 5
),
(
  'p1090000-0000-4000-0503-000000000017', 'b1090000-0000-4000-0503-000000005003', 'Salsa picante', 'Nivel alto', '🌶️',
  2000, NULL, 'Salsas', true, 6
),
(
  'p1090000-0000-4000-0503-000000000018', 'b1090000-0000-4000-0503-000000005003', 'Hamburguesa de pollo', 'Crispy, lechuga, tomate', '🍔',
  19000, NULL, 'Platos', true, 7
),
(
  'p1090000-0000-4000-0503-000000000019', 'b1090000-0000-4000-0503-000000005003', 'Wrap de pollo', 'Tortilla, vegetales', '🌯',
  18000, NULL, 'Platos', true, 8
),
(
  'p1090000-0000-4000-0503-000000000020', 'b1090000-0000-4000-0503-000000005003', 'Menú infantil nuggets', '6 nuggets + papa + jugo', '🧒',
  15000, NULL, 'Kids', true, 9
),
(
  'p1090000-0000-4000-0503-000000000021', 'b1090000-0000-4000-0503-000000005003', 'Postre brownie', 'Unidad', '🍫',
  7000, NULL, 'Postres', true, 10
),
(
  'p1090000-0000-4000-0503-000000000022', 'b1090000-0000-4000-0503-000000005003', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 11
),
(
  'p1090000-0000-4000-0503-000000000023', 'b1090000-0000-4000-0503-000000005003', 'Jugo hit', 'Personal', '🧃',
  4000, NULL, 'Bebidas', true, 12
),
(
  'p1090000-0000-4000-0503-000000000024', 'b1090000-0000-4000-0503-000000005003', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 13
),
(
  'p1090000-0000-4000-0503-000000000025', 'b1090000-0000-4000-0503-000000005003', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 14
),
(
  'p1090000-0000-4000-0503-000000000026', 'b1090000-0000-4000-0503-000000005003', 'Pollo a la plancha', 'Opción más liviana', '🍗',
  20000, NULL, 'Premium', true, 15
),
(
  'p1090000-0000-4000-0503-000000000027', 'b1090000-0000-4000-0503-000000005003', 'Combo oficina', '2 piezas + arroz + té', '🍱',
  17000, NULL, 'Combos', true, 16
),
(
  'p1090000-0000-4000-0503-000000000028', 'b1090000-0000-4000-0503-000000005003', 'Edición miel mostaza', 'Alitas x8', '🍯',
  19000, NULL, 'Edición limitada', true, 17
),
(
  'p1090000-0000-4000-0504-000000000001', 'b1090000-0000-4000-0504-000000005004', 'Clásica Urabá', 'Carne 140g, queso, vegetales', '🍔',
  18000, NULL, 'Hamburguesas', true, 18
),
(
  'p1090000-0000-4000-0504-000000000002', 'b1090000-0000-4000-0504-000000005004', 'Doble smash', 'Dos carnes smash, cheddar', '🍔',
  24000, 27000, 'Hamburguesas', true, 19
),
(
  'p1090000-0000-4000-0504-000000000003', 'b1090000-0000-4000-0504-000000005004', 'BBQ bacon', 'Tocineta, BBQ, cebolla crispy', '🍔',
  26000, NULL, 'Hamburguesas', true, 20
),
(
  'p1090000-0000-4000-0504-000000000004', 'b1090000-0000-4000-0504-000000005004', 'Pollo crispy', 'Pechuga empanizada', '🍔',
  20000, NULL, 'Hamburguesas', true, 21
),
(
  'p1090000-0000-4000-0504-000000000005', 'b1090000-0000-4000-0504-000000005004', 'Veggie bean', 'Hamburguesa de frijol y avena', '🌱',
  19000, NULL, 'Hamburguesas', true, 22
),
(
  'p1090000-0000-4000-0504-000000000006', 'b1090000-0000-4000-0504-000000005004', 'Premium angus', 'Carne 180g, cebolla caramelizada', '🍔',
  32000, NULL, 'Premium', true, 23
),
(
  'p1090000-0000-4000-0504-000000000007', 'b1090000-0000-4000-0504-000000005004', 'Combo clásico', 'Burger + papas + gaseosa', '🍱',
  25000, 28000, 'Combos', true, 24
),
(
  'p1090000-0000-4000-0504-000000000008', 'b1090000-0000-4000-0504-000000005004', 'Combo doble', 'Doble smash + papas + gaseosa', '🍱',
  32000, NULL, 'Combos', true, 25
),
(
  'p1090000-0000-4000-0504-000000000009', 'b1090000-0000-4000-0504-000000005004', 'Papas caseras', 'Porción', '🍟',
  7000, NULL, 'Acompañamientos', true, 26
),
(
  'p1090000-0000-4000-0504-000000000010', 'b1090000-0000-4000-0504-000000005004', 'Papas con queso', 'Cheddar fundido', '🍟',
  10000, NULL, 'Acompañamientos', true, 27
),
(
  'p1090000-0000-4000-0504-000000000011', 'b1090000-0000-4000-0504-000000005004', 'Aros de cebolla', 'Porción', '🧅',
  9000, NULL, 'Acompañamientos', true, 28
),
(
  'p1090000-0000-4000-0504-000000000012', 'b1090000-0000-4000-0504-000000005004', 'Onion rings BBQ', 'Con dip', '🧅',
  10000, NULL, 'Acompañamientos', true, 29
),
(
  'p1090000-0000-4000-0504-000000000013', 'b1090000-0000-4000-0504-000000005004', 'Extra carne', '140g', '🥩',
  7000, NULL, 'Extras', true, 30
),
(
  'p1090000-0000-4000-0504-000000000014', 'b1090000-0000-4000-0504-000000005004', 'Extra tocineta', '2 lonjas', '🥓',
  4000, NULL, 'Extras', true, 31
),
(
  'p1090000-0000-4000-0504-000000000015', 'b1090000-0000-4000-0504-000000005004', 'Extra queso', 'Cheddar', '🧀',
  3000, NULL, 'Extras', true, 32
),
(
  'p1090000-0000-4000-0504-000000000016', 'b1090000-0000-4000-0504-000000005004', 'Kids mini burger', 'Mini + papa + jugo', '🧒',
  14000, NULL, 'Kids', true, 33
),
(
  'p1090000-0000-4000-0504-000000000017', 'b1090000-0000-4000-0504-000000005004', 'Malteada vainilla', '16oz', '🥛',
  10000, NULL, 'Bebidas', true, 34
),
(
  'p1090000-0000-4000-0504-000000000018', 'b1090000-0000-4000-0504-000000005004', 'Malteada chocolate', '16oz', '🍫',
  10000, NULL, 'Bebidas', true, 35
),
(
  'p1090000-0000-4000-0504-000000000019', 'b1090000-0000-4000-0504-000000005004', 'Limonada', '16oz', '🍋',
  5000, NULL, 'Bebidas', true, 36
),
(
  'p1090000-0000-4000-0504-000000000020', 'b1090000-0000-4000-0504-000000005004', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 37
),
(
  'p1090000-0000-4000-0504-000000000021', 'b1090000-0000-4000-0504-000000005004', 'Hot dog ranchero', 'Con papas', '🌭',
  15000, NULL, 'Platos', true, 38
),
(
  'p1090000-0000-4000-0504-000000000022', 'b1090000-0000-4000-0504-000000005004', 'Salchipapa urbana', 'Salsas a elección', '🍟',
  14000, NULL, 'Platos', true, 39
),
(
  'p1090000-0000-4000-0504-000000000023', 'b1090000-0000-4000-0504-000000005004', 'Brownie', 'Casero', '🍫',
  8000, NULL, 'Postres', true, 40
),
(
  'p1090000-0000-4000-0504-000000000024', 'b1090000-0000-4000-0504-000000005004', 'Cookie con chips', 'Caliente', '🍪',
  6000, NULL, 'Postres', true, 41
),
(
  'p1090000-0000-4000-0504-000000000025', 'b1090000-0000-4000-0504-000000005004', 'Combo noche', 'Burger + malteada', '🌙',
  27000, NULL, 'Combos', true, 42
),
(
  'p1090000-0000-4000-0504-000000000026', 'b1090000-0000-4000-0504-000000005004', 'Salsa de la casa', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 43
),
(
  'p1090000-0000-4000-0504-000000000027', 'b1090000-0000-4000-0504-000000005004', 'Pickles extra', 'Porción', '🥒',
  1500, NULL, 'Extras', true, 44
),
(
  'p1090000-0000-4000-0504-000000000028', 'b1090000-0000-4000-0504-000000005004', 'Edición ají dulce', 'Burger con hogao costeño', '🌶️',
  22000, NULL, 'Edición limitada', true, 45
),
(
  'p1090000-0000-4000-0505-000000000001', 'b1090000-0000-4000-0505-000000005005', 'Café americano', '12oz', '☕',
  4000, NULL, 'Café', true, 46
),
(
  'p1090000-0000-4000-0505-000000000002', 'b1090000-0000-4000-0505-000000005005', 'Café con leche', '12oz', '☕',
  5000, NULL, 'Café', true, 47
),
(
  'p1090000-0000-4000-0505-000000000003', 'b1090000-0000-4000-0505-000000005005', 'Cappuccino', 'Espuma cremosa', '☕',
  7000, NULL, 'Café', true, 48
),
(
  'p1090000-0000-4000-0505-000000000004', 'b1090000-0000-4000-0505-000000005005', 'Latte', '12oz', '☕',
  7500, NULL, 'Café', true, 49
),
(
  'p1090000-0000-4000-0505-000000000005', 'b1090000-0000-4000-0505-000000005005', 'Chocolate caliente', 'Con marshmallow', '🍫',
  7000, NULL, 'Café', true, 50
),
(
  'p1090000-0000-4000-0505-000000000006', 'b1090000-0000-4000-0505-000000005005', 'Tinto costeño', 'Pequeño', '☕',
  2500, NULL, 'Café', true, 51
),
(
  'p1090000-0000-4000-0505-000000000007', 'b1090000-0000-4000-0505-000000005005', 'Desayuno completo', 'Huevos, arepa, queso, café', '🍳',
  14000, 16000, 'Desayunos', true, 52
),
(
  'p1090000-0000-4000-0505-000000000008', 'b1090000-0000-4000-0505-000000005005', 'Desayuno light', 'Yogurt, fruta, granola', '🥣',
  12000, NULL, 'Desayunos', true, 53
),
(
  'p1090000-0000-4000-0505-000000000009', 'b1090000-0000-4000-0505-000000005005', 'Calentado antioqueño', 'Frijol, arroz, carne, huevo', '🍛',
  16000, NULL, 'Desayunos', true, 54
),
(
  'p1090000-0000-4000-0505-000000000010', 'b1090000-0000-4000-0505-000000005005', 'Pandebono x3', 'Calientes', '🧀',
  6000, NULL, 'Panadería', true, 55
),
(
  'p1090000-0000-4000-0505-000000000011', 'b1090000-0000-4000-0505-000000005005', 'Almojábana x2', 'Recién horneada', '🍞',
  5000, NULL, 'Panadería', true, 56
),
(
  'p1090000-0000-4000-0505-000000000012', 'b1090000-0000-4000-0505-000000005005', 'Croissant jamón queso', 'Horno del día', '🥐',
  8000, NULL, 'Panadería', true, 57
),
(
  'p1090000-0000-4000-0505-000000000013', 'b1090000-0000-4000-0505-000000005005', 'Brownie', 'Porción', '🍫',
  7000, NULL, 'Postres', true, 58
),
(
  'p1090000-0000-4000-0505-000000000014', 'b1090000-0000-4000-0505-000000005005', 'Cheesecake frutos rojos', 'Porción', '🍰',
  11000, NULL, 'Postres', true, 59
),
(
  'p1090000-0000-4000-0505-000000000015', 'b1090000-0000-4000-0505-000000005005', 'Muffin del día', 'Sabor rotativo', '🧁',
  5500, NULL, 'Panadería', true, 60
),
(
  'p1090000-0000-4000-0505-000000000016', 'b1090000-0000-4000-0505-000000005005', 'Jugo de naranja', 'Natural 12oz', '🍊',
  6000, NULL, 'Bebidas', true, 61
),
(
  'p1090000-0000-4000-0505-000000000017', 'b1090000-0000-4000-0505-000000005005', 'Limonada de hierbabuena', '16oz', '🍋',
  5500, NULL, 'Bebidas', true, 62
),
(
  'p1090000-0000-4000-0505-000000000018', 'b1090000-0000-4000-0505-000000005005', 'Agua', '600 ml', '💧',
  3000, NULL, 'Bebidas', true, 63
),
(
  'p1090000-0000-4000-0505-000000000019', 'b1090000-0000-4000-0505-000000005005', 'Sándwich pollo', 'Pan artesanal', '🥪',
  13000, NULL, 'Platos', true, 64
),
(
  'p1090000-0000-4000-0505-000000000020', 'b1090000-0000-4000-0505-000000005005', 'Sándwich vegetariano', 'Queso y vegetales', '🥪',
  12000, NULL, 'Platos', true, 65
),
(
  'p1090000-0000-4000-0505-000000000021', 'b1090000-0000-4000-0505-000000005005', 'Empanada de carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 66
),
(
  'p1090000-0000-4000-0505-000000000022', 'b1090000-0000-4000-0505-000000005005', 'Combo tarde', 'Café + pandebono', '🍱',
  9000, 11000, 'Combos', true, 67
),
(
  'p1090000-0000-4000-0505-000000000023', 'b1090000-0000-4000-0505-000000005005', 'Combo oficina', 'Sándwich + jugo', '🍱',
  16000, NULL, 'Combos', true, 68
),
(
  'p1090000-0000-4000-0505-000000000024', 'b1090000-0000-4000-0505-000000005005', 'Kids hotcakes', 'Con miel', '🧒',
  10000, NULL, 'Kids', true, 69
),
(
  'p1090000-0000-4000-0505-000000000025', 'b1090000-0000-4000-0505-000000005005', 'Té chai latte', 'Especiado', '🧋',
  8000, NULL, 'Café', true, 70
),
(
  'p1090000-0000-4000-0505-000000000026', 'b1090000-0000-4000-0505-000000005005', 'Affogato', 'Helado + espresso', '🍨',
  9000, NULL, 'Postres', true, 71
),
(
  'p1090000-0000-4000-0505-000000000027', 'b1090000-0000-4000-0505-000000005005', 'Galleta avena', 'Unidad', '🍪',
  3500, NULL, 'Panadería', true, 72
),
(
  'p1090000-0000-4000-0505-000000000028', 'b1090000-0000-4000-0505-000000005005', 'Edición café de Urabá', 'Origen regional 12oz', '☕',
  8500, NULL, 'Edición limitada', true, 73
),
(
  'p1090000-0000-4000-0506-000000000001', 'b1090000-0000-4000-0506-000000005006', 'Arepa de huevo', 'Frita, huevo adentro', '🫓',
  7000, NULL, 'Arepas', true, 74
),
(
  'p1090000-0000-4000-0506-000000000002', 'b1090000-0000-4000-0506-000000005006', 'Arepa de huevo doble', 'Doble huevo', '🫓',
  9000, NULL, 'Arepas', true, 75
),
(
  'p1090000-0000-4000-0506-000000000003', 'b1090000-0000-4000-0506-000000005006', 'Arepa con queso', 'Queso costeño', '🫓',
  6000, NULL, 'Arepas', true, 76
),
(
  'p1090000-0000-4000-0506-000000000004', 'b1090000-0000-4000-0506-000000005006', 'Arepa con todo', 'Huevo, queso, hogao', '🫓',
  10000, NULL, 'Arepas', true, 77
),
(
  'p1090000-0000-4000-0506-000000000005', 'b1090000-0000-4000-0506-000000005006', 'Arepa de pollo', 'Pollo desmechado', '🫓',
  11000, NULL, 'Arepas', true, 78
),
(
  'p1090000-0000-4000-0506-000000000006', 'b1090000-0000-4000-0506-000000005006', 'Arepa de carne', 'Carne desmechada', '🫓',
  12000, NULL, 'Arepas', true, 79
),
(
  'p1090000-0000-4000-0506-000000000007', 'b1090000-0000-4000-0506-000000005006', 'Arepa de chorizo', 'Chorizo y hogao', '🫓',
  11000, NULL, 'Arepas', true, 80
),
(
  'p1090000-0000-4000-0506-000000000008', 'b1090000-0000-4000-0506-000000005006', 'Combo desayuno', 'Arepa huevo + café + jugo', '🍱',
  14000, 16000, 'Combos', true, 81
),
(
  'p1090000-0000-4000-0506-000000000009', 'b1090000-0000-4000-0506-000000005006', 'Combo almuerzo', 'Arepa carne + limonada', '🍱',
  15000, NULL, 'Combos', true, 82
),
(
  'p1090000-0000-4000-0506-000000000010', 'b1090000-0000-4000-0506-000000005006', 'Empanada carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 83
),
(
  'p1090000-0000-4000-0506-000000000011', 'b1090000-0000-4000-0506-000000005006', 'Empanada pollo', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 84
),
(
  'p1090000-0000-4000-0506-000000000012', 'b1090000-0000-4000-0506-000000005006', 'Empanada papa-carne', 'Unidad', '🥟',
  3500, NULL, 'Snacks', true, 85
),
(
  'p1090000-0000-4000-0506-000000000013', 'b1090000-0000-4000-0506-000000005006', 'Buñuelo x2', 'Calientes', '🍩',
  4000, NULL, 'Snacks', true, 86
),
(
  'p1090000-0000-4000-0506-000000000014', 'b1090000-0000-4000-0506-000000005006', 'Jugo de mango', 'Natural', '🥭',
  6000, NULL, 'Bebidas', true, 87
),
(
  'p1090000-0000-4000-0506-000000000015', 'b1090000-0000-4000-0506-000000005006', 'Jugo de lulo', 'Natural', '🧃',
  6000, NULL, 'Bebidas', true, 88
),
(
  'p1090000-0000-4000-0506-000000000016', 'b1090000-0000-4000-0506-000000005006', 'Café con leche', 'Vaso', '☕',
  4000, NULL, 'Bebidas', true, 89
),
(
  'p1090000-0000-4000-0506-000000000017', 'b1090000-0000-4000-0506-000000005006', 'Tinto', 'Pequeño', '☕',
  2000, NULL, 'Bebidas', true, 90
),
(
  'p1090000-0000-4000-0506-000000000018', 'b1090000-0000-4000-0506-000000005006', 'Gaseosa personal', '350 ml', '🥤',
  3500, NULL, 'Bebidas', true, 91
),
(
  'p1090000-0000-4000-0506-000000000019', 'b1090000-0000-4000-0506-000000005006', 'Suero costeño', 'Porción', '🥛',
  3000, NULL, 'Extras', true, 92
),
(
  'p1090000-0000-4000-0506-000000000020', 'b1090000-0000-4000-0506-000000005006', 'Ají', 'Porción', '🌶️',
  1500, NULL, 'Salsas', true, 93
),
(
  'p1090000-0000-4000-0506-000000000021', 'b1090000-0000-4000-0506-000000005006', 'Hogao', 'Porción', '🫙',
  2000, NULL, 'Salsas', true, 94
),
(
  'p1090000-0000-4000-0506-000000000022', 'b1090000-0000-4000-0506-000000005006', 'Kids arepa queso', 'Pequeña + jugo', '🧒',
  9000, NULL, 'Kids', true, 95
),
(
  'p1090000-0000-4000-0506-000000000023', 'b1090000-0000-4000-0506-000000005006', 'Patacón con queso', 'Entrada', '🍌',
  8000, NULL, 'Platos', true, 96
),
(
  'p1090000-0000-4000-0506-000000000024', 'b1090000-0000-4000-0506-000000005006', 'Caldo de costilla', 'Taza', '🍲',
  10000, NULL, 'Platos', true, 97
),
(
  'p1090000-0000-4000-0506-000000000025', 'b1090000-0000-4000-0506-000000005006', 'Changua', 'Desayuno', '🥣',
  9000, NULL, 'Desayunos', true, 98
),
(
  'p1090000-0000-4000-0506-000000000026', 'b1090000-0000-4000-0506-000000005006', 'Huevos pericos', 'Con arepa', '🍳',
  10000, NULL, 'Desayunos', true, 99
),
(
  'p1090000-0000-4000-0506-000000000027', 'b1090000-0000-4000-0506-000000005006', 'Mazamorra', 'Vaso', '🥛',
  5000, NULL, 'Postres', true, 0
),
(
  'p1090000-0000-4000-0506-000000000028', 'b1090000-0000-4000-0506-000000005006', 'Edición arepa de camarón', 'Fines de semana', '🦐',
  14000, NULL, 'Edición limitada', true, 1
),
(
  'p1090000-0000-4000-0507-000000000001', 'b1090000-0000-4000-0507-000000005007', 'Huevos AA x12', 'Cartón', '🥚',
  12000, NULL, 'Lácteos y huevos', true, 2
),
(
  'p1090000-0000-4000-0507-000000000002', 'b1090000-0000-4000-0507-000000005007', 'Leche entera 1L', 'UHT', '🥛',
  5500, NULL, 'Lácteos y huevos', true, 3
),
(
  'p1090000-0000-4000-0507-000000000003', 'b1090000-0000-4000-0507-000000005007', 'Queso costeño 250g', 'Fresco', '🧀',
  9000, NULL, 'Lácteos y huevos', true, 4
),
(
  'p1090000-0000-4000-0507-000000000004', 'b1090000-0000-4000-0507-000000005007', 'Yogurt bebible', 'Unidad', '🥛',
  3500, NULL, 'Lácteos y huevos', true, 5
),
(
  'p1090000-0000-4000-0507-000000000005', 'b1090000-0000-4000-0507-000000005007', 'Pan tajado', 'Bolsa', '🍞',
  6000, NULL, 'Panadería', true, 6
),
(
  'p1090000-0000-4000-0507-000000000006', 'b1090000-0000-4000-0507-000000005007', 'Arroz 1kg', 'Blanco', '🍚',
  4500, NULL, 'Despensa', true, 7
),
(
  'p1090000-0000-4000-0507-000000000007', 'b1090000-0000-4000-0507-000000005007', 'Aceite 1L', 'Vegetal', '🫒',
  12000, 14000, 'Despensa', true, 8
),
(
  'p1090000-0000-4000-0507-000000000008', 'b1090000-0000-4000-0507-000000005007', 'Azúcar 1kg', 'Blanca', '🧂',
  4500, NULL, 'Despensa', true, 9
),
(
  'p1090000-0000-4000-0507-000000000009', 'b1090000-0000-4000-0507-000000005007', 'Sal 1kg', 'Refinada', '🧂',
  2500, NULL, 'Despensa', true, 10
),
(
  'p1090000-0000-4000-0507-000000000010', 'b1090000-0000-4000-0507-000000005007', 'Pasta spaghetti 500g', 'Caja', '🍝',
  4000, NULL, 'Despensa', true, 11
),
(
  'p1090000-0000-4000-0507-000000000011', 'b1090000-0000-4000-0507-000000005007', 'Atún lata', 'Agua o aceite', '🐟',
  5500, NULL, 'Despensa', true, 12
),
(
  'p1090000-0000-4000-0507-000000000012', 'b1090000-0000-4000-0507-000000005007', 'Frijol cargamanto 500g', 'Bolsa', '🫘',
  5000, NULL, 'Despensa', true, 13
),
(
  'p1090000-0000-4000-0507-000000000013', 'b1090000-0000-4000-0507-000000005007', 'Plátano maduro x3', 'Unidad aprox.', '🍌',
  4000, NULL, 'Frutas y verduras', true, 14
),
(
  'p1090000-0000-4000-0507-000000000014', 'b1090000-0000-4000-0507-000000005007', 'Tomate chonto 500g', 'Fresco', '🍅',
  3500, NULL, 'Frutas y verduras', true, 15
),
(
  'p1090000-0000-4000-0507-000000000015', 'b1090000-0000-4000-0507-000000005007', 'Cebolla cabezona 500g', 'Fresco', '🧅',
  3000, NULL, 'Frutas y verduras', true, 16
),
(
  'p1090000-0000-4000-0507-000000000016', 'b1090000-0000-4000-0507-000000005007', 'Papa pastusa 1kg', 'Fresco', '🥔',
  4500, NULL, 'Frutas y verduras', true, 17
),
(
  'p1090000-0000-4000-0507-000000000017', 'b1090000-0000-4000-0507-000000005007', 'Banano x6', 'Racimo pequeño', '🍌',
  4000, NULL, 'Frutas y verduras', true, 18
),
(
  'p1090000-0000-4000-0507-000000000018', 'b1090000-0000-4000-0507-000000005007', 'Limón x5', 'Ácidos', '🍋',
  2500, NULL, 'Frutas y verduras', true, 19
),
(
  'p1090000-0000-4000-0507-000000000019', 'b1090000-0000-4000-0507-000000005007', 'Pollo entero congelado', 'Aprox 1.5kg', '🍗',
  18000, NULL, 'Congelados', true, 20
),
(
  'p1090000-0000-4000-0507-000000000020', 'b1090000-0000-4000-0507-000000005007', 'Carne molida 500g', 'Res', '🥩',
  14000, NULL, 'Carnes', true, 21
),
(
  'p1090000-0000-4000-0507-000000000021', 'b1090000-0000-4000-0507-000000005007', 'Jabón en barra x3', 'Ropa', '🧼',
  8000, NULL, 'Aseo', true, 22
),
(
  'p1090000-0000-4000-0507-000000000022', 'b1090000-0000-4000-0507-000000005007', 'Detergente 1kg', 'En polvo', '🧺',
  12000, NULL, 'Aseo', true, 23
),
(
  'p1090000-0000-4000-0507-000000000023', 'b1090000-0000-4000-0507-000000005007', 'Papel higiénico x4', 'Doble hoja', '🧻',
  10000, 12000, 'Aseo', true, 24
),
(
  'p1090000-0000-4000-0507-000000000024', 'b1090000-0000-4000-0507-000000005007', 'Jabón antibacterial', 'Líquido 250ml', '🧴',
  7000, NULL, 'Cuidado personal', true, 25
),
(
  'p1090000-0000-4000-0507-000000000025', 'b1090000-0000-4000-0507-000000005007', 'Pasta dental', 'Tubo', '🦷',
  6500, NULL, 'Cuidado personal', true, 26
),
(
  'p1090000-0000-4000-0507-000000000026', 'b1090000-0000-4000-0507-000000005007', 'Pañales etapa 3 x10', 'Pack', '👶',
  22000, NULL, 'Bebé', true, 27
),
(
  'p1090000-0000-4000-0507-000000000027', 'b1090000-0000-4000-0507-000000005007', 'Pañitos húmedos', 'Paquete', '👶',
  9000, NULL, 'Bebé', true, 28
),
(
  'p1090000-0000-4000-0507-000000000028', 'b1090000-0000-4000-0507-000000005007', 'Gaseosa 1.5L', 'Sabor a elegir', '🥤',
  7000, NULL, 'Bebidas', true, 29
),
(
  'p1090000-0000-4000-0507-000000000029', 'b1090000-0000-4000-0507-000000005007', 'Agua 6L', 'Bidón', '💧',
  8000, NULL, 'Bebidas', true, 30
),
(
  'p1090000-0000-4000-0507-000000000030', 'b1090000-0000-4000-0507-000000005007', 'Snack papas 150g', 'Bolsa', '🥔',
  5500, NULL, 'Snacks', true, 31
),
(
  'p1090000-0000-4000-0507-000000000031', 'b1090000-0000-4000-0507-000000005007', 'Galletas surtidas', 'Paquete', '🍪',
  4500, NULL, 'Snacks', true, 32
),
(
  'p1090000-0000-4000-0507-000000000032', 'b1090000-0000-4000-0507-000000005007', 'Café molido 250g', 'Tradicional', '☕',
  11000, NULL, 'Despensa', true, 33
),
(
  'p1090000-0000-4000-0508-000000000001', 'b1090000-0000-4000-0508-000000005008', 'Acetaminofén 500mg x20', 'Uso OTC', '💊',
  8000, NULL, 'Analgésicos', true, 34
),
(
  'p1090000-0000-4000-0508-000000000002', 'b1090000-0000-4000-0508-000000005008', 'Ibuprofeno 400mg x10', 'Uso OTC', '💊',
  9000, NULL, 'Analgésicos', true, 35
),
(
  'p1090000-0000-4000-0508-000000000003', 'b1090000-0000-4000-0508-000000005008', 'Suero oral', 'Sobre', '🧪',
  3500, NULL, 'Primeros auxilios', true, 36
),
(
  'p1090000-0000-4000-0508-000000000004', 'b1090000-0000-4000-0508-000000005008', 'Curitas x20', 'Surtidas', '🩹',
  6000, NULL, 'Primeros auxilios', true, 37
),
(
  'p1090000-0000-4000-0508-000000000005', 'b1090000-0000-4000-0508-000000005008', 'Alcohol antiséptico 120ml', 'Botella', '🧴',
  5000, NULL, 'Primeros auxilios', true, 38
),
(
  'p1090000-0000-4000-0508-000000000006', 'b1090000-0000-4000-0508-000000005008', 'Agua oxigenada 120ml', 'Botella', '🧴',
  4500, NULL, 'Primeros auxilios', true, 39
),
(
  'p1090000-0000-4000-0508-000000000007', 'b1090000-0000-4000-0508-000000005008', 'Gasas estériles', 'Paquete', '🩹',
  7000, NULL, 'Primeros auxilios', true, 40
),
(
  'p1090000-0000-4000-0508-000000000008', 'b1090000-0000-4000-0508-000000005008', 'Termómetro digital', 'Unidad', '🌡️',
  25000, NULL, 'Bienestar', true, 41
),
(
  'p1090000-0000-4000-0508-000000000009', 'b1090000-0000-4000-0508-000000005008', 'Vitamina C efervescente', 'Tubo', '🍊',
  18000, 22000, 'Bienestar', true, 42
),
(
  'p1090000-0000-4000-0508-000000000010', 'b1090000-0000-4000-0508-000000005008', 'Multivitamínico x30', 'Tabletas', '💊',
  32000, NULL, 'Bienestar', true, 43
),
(
  'p1090000-0000-4000-0508-000000000011', 'b1090000-0000-4000-0508-000000005008', 'Protector solar FPS50', 'Crema 60ml', '☀️',
  35000, NULL, 'Cuidado personal', true, 44
),
(
  'p1090000-0000-4000-0508-000000000012', 'b1090000-0000-4000-0508-000000005008', 'Crema humectante', '120ml', '🧴',
  18000, NULL, 'Cuidado personal', true, 45
),
(
  'p1090000-0000-4000-0508-000000000013', 'b1090000-0000-4000-0508-000000005008', 'Shampoo anticaspa', '400ml', '🧴',
  22000, NULL, 'Cuidado personal', true, 46
),
(
  'p1090000-0000-4000-0508-000000000014', 'b1090000-0000-4000-0508-000000005008', 'Jabón íntimo', '200ml', '🧴',
  16000, NULL, 'Cuidado personal', true, 47
),
(
  'p1090000-0000-4000-0508-000000000015', 'b1090000-0000-4000-0508-000000005008', 'Toallas higiénicas x10', 'Paquete', '📦',
  9000, NULL, 'Cuidado personal', true, 48
),
(
  'p1090000-0000-4000-0508-000000000016', 'b1090000-0000-4000-0508-000000005008', 'Pañales etapa 2 x12', 'Pack', '👶',
  28000, NULL, 'Bebé', true, 49
),
(
  'p1090000-0000-4000-0508-000000000017', 'b1090000-0000-4000-0508-000000005008', 'Crema antipañalitis', 'Tubo', '👶',
  20000, NULL, 'Bebé', true, 50
),
(
  'p1090000-0000-4000-0508-000000000018', 'b1090000-0000-4000-0508-000000005008', 'Repelente spray', '120ml', '🦟',
  18000, NULL, 'Bienestar', true, 51
),
(
  'p1090000-0000-4000-0508-000000000019', 'b1090000-0000-4000-0508-000000005008', 'Sales de rehidratación', 'Caja x5', '🧪',
  10000, NULL, 'Primeros auxilios', true, 52
),
(
  'p1090000-0000-4000-0508-000000000020', 'b1090000-0000-4000-0508-000000005008', 'Pastillas para la garganta', 'Caja', '🍬',
  8000, NULL, 'Analgésicos', true, 53
),
(
  'p1090000-0000-4000-0508-000000000021', 'b1090000-0000-4000-0508-000000005008', 'Alcohol en gel 60ml', 'Antibacterial', '🧴',
  6000, NULL, 'Cuidado personal', true, 54
),
(
  'p1090000-0000-4000-0508-000000000022', 'b1090000-0000-4000-0508-000000005008', 'Mascarillas x10', 'Desechables', '😷',
  8000, NULL, 'Bienestar', true, 55
),
(
  'p1090000-0000-4000-0508-000000000023', 'b1090000-0000-4000-0508-000000005008', 'Preservativos x3', 'Caja', '📦',
  9000, NULL, 'Cuidado personal', true, 56
),
(
  'p1090000-0000-4000-0508-000000000024', 'b1090000-0000-4000-0508-000000005008', 'Prueba de embarazo', 'Unidad', '🧪',
  12000, NULL, 'Bienestar', true, 57
),
(
  'p1090000-0000-4000-0508-000000000025', 'b1090000-0000-4000-0508-000000005008', 'Algodón 50g', 'Bolsa', '☁️',
  4000, NULL, 'Primeros auxilios', true, 58
),
(
  'p1090000-0000-4000-0508-000000000026', 'b1090000-0000-4000-0508-000000005008', 'Gotas lubricantes oculares', 'Frasco', '👁️',
  22000, NULL, 'Bienestar', true, 59
),
(
  'p1090000-0000-4000-0508-000000000027', 'b1090000-0000-4000-0508-000000005008', 'Jabón neutro', 'Barra', '🧼',
  5000, NULL, 'Cuidado personal', true, 60
),
(
  'p1090000-0000-4000-0508-000000000028', 'b1090000-0000-4000-0508-000000005008', 'Kit viaje básicos', 'Curitas + gel + acetaminofén', '🧰',
  25000, NULL, 'Kits', true, 61
),
(
  'p1090000-0000-4000-0508-000000000029', 'b1090000-0000-4000-0508-000000005008', 'Suero fisiológico', 'Frasco', '💧',
  7000, NULL, 'Primeros auxilios', true, 62
),
(
  'p1090000-0000-4000-0508-000000000030', 'b1090000-0000-4000-0508-000000005008', 'Talco mentolado', '120g', '🧴',
  9000, NULL, 'Cuidado personal', true, 63
),
(
  'p1090000-0000-4000-0509-000000000001', 'b1090000-0000-4000-0509-000000005009', 'Cerveza nacional lata', 'Unidad', '🍺',
  4000, NULL, 'Cervezas', true, 64
),
(
  'p1090000-0000-4000-0509-000000000002', 'b1090000-0000-4000-0509-000000005009', 'Sixpack cerveza nacional', '6 latas', '🍺',
  22000, 25000, 'Cervezas', true, 65
),
(
  'p1090000-0000-4000-0509-000000000003', 'b1090000-0000-4000-0509-000000005009', 'Cerveza importada', 'Unidad', '🍺',
  7000, NULL, 'Cervezas', true, 66
),
(
  'p1090000-0000-4000-0509-000000000004', 'b1090000-0000-4000-0509-000000005009', 'Aguardiente media', 'Botella', '🍾',
  45000, NULL, 'Licores', true, 67
),
(
  'p1090000-0000-4000-0509-000000000005', 'b1090000-0000-4000-0509-000000005009', 'Ron media', 'Botella', '🍾',
  55000, NULL, 'Licores', true, 68
),
(
  'p1090000-0000-4000-0509-000000000006', 'b1090000-0000-4000-0509-000000005009', 'Whisky media entrada', 'Botella', '🥃',
  85000, NULL, 'Licores', true, 69
),
(
  'p1090000-0000-4000-0509-000000000007', 'b1090000-0000-4000-0509-000000005009', 'Vino tinto', 'Botella 750ml', '🍷',
  40000, NULL, 'Vinos', true, 70
),
(
  'p1090000-0000-4000-0509-000000000008', 'b1090000-0000-4000-0509-000000005009', 'Vino blanco', 'Botella 750ml', '🍷',
  40000, NULL, 'Vinos', true, 71
),
(
  'p1090000-0000-4000-0509-000000000009', 'b1090000-0000-4000-0509-000000005009', 'Espumante', 'Botella', '🥂',
  48000, NULL, 'Vinos', true, 72
),
(
  'p1090000-0000-4000-0509-000000000010', 'b1090000-0000-4000-0509-000000005009', 'Gaseosa 1.5L', 'Para mezclar', '🥤',
  7000, NULL, 'Mixers', true, 73
),
(
  'p1090000-0000-4000-0509-000000000011', 'b1090000-0000-4000-0509-000000005009', 'Agua tónica', 'Unidad', '🥤',
  4500, NULL, 'Mixers', true, 74
),
(
  'p1090000-0000-4000-0509-000000000012', 'b1090000-0000-4000-0509-000000005009', 'Hielo bolsa 2kg', 'Bolsa', '🧊',
  5000, NULL, 'Hielo', true, 75
),
(
  'p1090000-0000-4000-0509-000000000013', 'b1090000-0000-4000-0509-000000005009', 'Hielo bolsa 5kg', 'Bolsa', '🧊',
  10000, NULL, 'Hielo', true, 76
),
(
  'p1090000-0000-4000-0509-000000000014', 'b1090000-0000-4000-0509-000000005009', 'Vasos desechables x25', 'Pack', '🥃',
  8000, NULL, 'Fiesta', true, 77
),
(
  'p1090000-0000-4000-0509-000000000015', 'b1090000-0000-4000-0509-000000005009', 'Servilletas x100', 'Pack', '🧻',
  6000, NULL, 'Fiesta', true, 78
),
(
  'p1090000-0000-4000-0509-000000000016', 'b1090000-0000-4000-0509-000000005009', 'Snacks surtidos', 'Bolsa', '🥔',
  7000, NULL, 'Snacks', true, 79
),
(
  'p1090000-0000-4000-0509-000000000017', 'b1090000-0000-4000-0509-000000005009', 'Maní salado', 'Bolsa', '🥜',
  5000, NULL, 'Snacks', true, 80
),
(
  'p1090000-0000-4000-0509-000000000018', 'b1090000-0000-4000-0509-000000005009', 'Combo six + hielo', 'Sixpack + 2kg hielo', '🍱',
  26000, NULL, 'Combos', true, 81
),
(
  'p1090000-0000-4000-0509-000000000019', 'b1090000-0000-4000-0509-000000005009', 'Combo fiesta', 'Aguardiente + gaseosa + hielo', '🎉',
  58000, NULL, 'Combos', true, 82
),
(
  'p1090000-0000-4000-0509-000000000020', 'b1090000-0000-4000-0509-000000005009', 'Cerveza artesanal local', 'Unidad', '🍺',
  9000, NULL, 'Cervezas', true, 83
),
(
  'p1090000-0000-4000-0509-000000000021', 'b1090000-0000-4000-0509-000000005009', 'Michelada prep kit', 'Sales y limón', '🍋',
  12000, NULL, 'Mixers', true, 84
),
(
  'p1090000-0000-4000-0509-000000000022', 'b1090000-0000-4000-0509-000000005009', 'Cooler blando', '6 latas', '🧊',
  45000, NULL, 'Accesorios', true, 85
),
(
  'p1090000-0000-4000-0509-000000000023', 'b1090000-0000-4000-0509-000000005009', 'Destapador', 'Metálico', '🔧',
  8000, NULL, 'Accesorios', true, 86
),
(
  'p1090000-0000-4000-0509-000000000024', 'b1090000-0000-4000-0509-000000005009', 'Jugo hit 1L', 'Para cocteles', '🧃',
  6000, NULL, 'Mixers', true, 87
),
(
  'p1090000-0000-4000-0509-000000000025', 'b1090000-0000-4000-0509-000000005009', 'Energizante', 'Lata', '⚡',
  7000, NULL, 'Bebidas', true, 88
),
(
  'p1090000-0000-4000-0509-000000000026', 'b1090000-0000-4000-0509-000000005009', 'Agua 1.5L', 'Botella', '💧',
  3500, NULL, 'Bebidas', true, 89
),
(
  'p1090000-0000-4000-0509-000000000027', 'b1090000-0000-4000-0509-000000005009', 'Pack latas importadas x4', 'Selección', '🍺',
  28000, NULL, 'Cervezas', true, 90
),
(
  'p1090000-0000-4000-0509-000000000028', 'b1090000-0000-4000-0509-000000005009', 'Promo finde sixpack', 'Solo viernes-domingo', '🏷️',
  20000, NULL, 'Edición limitada', true, 91
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_at_price = EXCLUDED.compare_at_price,
  category = EXCLUDED.category,
  emoji = EXCLUDED.emoji,
  is_available = true;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;

-- Stats: 45 negocios, 1292 productos, 5 municipios