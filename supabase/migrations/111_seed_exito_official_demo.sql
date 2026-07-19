-- Éxito Demo — productos desde API pública exito.com (no Rappi)
ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

UPDATE public.businesses SET
  name = 'Éxito Plaza del Río Demo',
  description = 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.

Vitrina Demo de Éxito para onboarding UrabApp en Urabá. Catálogo público de Mercado sincronizado desde exito.com.',
  cover_url = COALESCE(cover_url, '/previews/cover-mercado.jpg'),
  logo_url = COALESCE(logo_url, '/previews/logo-mercado.png'),
  is_published = true,
  is_active = true,
  is_open = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW())
WHERE id = 'b1100000-0000-4000-a110-000000000001';
UPDATE public.businesses SET
  name = 'Éxito Carepa Demo',
  description = 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.

Vitrina Demo de Éxito para onboarding UrabApp en Urabá. Catálogo público de Mercado sincronizado desde exito.com.',
  cover_url = COALESCE(cover_url, '/previews/cover-mercado.jpg'),
  logo_url = COALESCE(logo_url, '/previews/logo-mercado.png'),
  is_published = true,
  is_active = true,
  is_open = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW())
WHERE id = 'b1100000-0000-4000-a110-000000000002';

DELETE FROM public.products
WHERE business_id IN ('b1100000-0000-4000-a110-000000000001', 'b1100000-0000-4000-a110-000000000002')
  AND (id::text LIKE 'a1100000%' OR id::text LIKE 'a1200000%');

INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES
(
  'a1200000-0000-4000-a101-000000000001', 'b1100000-0000-4000-a110-000000000001', '5 x Bananos Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bananos-x-5-124210755/p. Marca: SM. Compra 5 unidades de bananos PLU 639180. Se podra recibir en racimo o por separado.',
  '🥬', 1840, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/29424717/Banano.jpg?v=638893300681300000',
  true, 0
),
(
  'a1200000-0000-4000-a101-000000000002', 'b1100000-0000-4000-a110-000000000001', 'ZANAHORIA FRESCAMPO 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/zanahoria-frescampo-x-1000-gr-832824/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido ZANAHORIA FRESCAMPO 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 4896, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/27275906/Zanahoria-Frescampo-X-1000-gr-1256_a.jpg?v=638803147353700000',
  true, 1
),
(
  'a1200000-0000-4000-a101-000000000003', 'b1100000-0000-4000-a110-000000000001', 'Arandanos (blue berrie)  125  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arandanos-blue-berrie-x-125g-81676/p. Marca: SM. ',
  '🥬', 5610, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/33568587/Arandanos-blue-Berrie-X-125g-918197_a.jpg?v=639156540801500000',
  true, 2
),
(
  'a1200000-0000-4000-a101-000000000004', 'b1100000-0000-4000-a110-000000000001', 'Limón Tahití Malla TAEQ 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/limon-tahiti-malla-1000g-43309/p. Marca: TAEQ. Características El limón es un cítrico imprescindible en cualquier cocina,su zumo lleno de vitaminas sirve de base a muchos platos,es también un remedio casero e incluso se puede emplear como limpiador,se usa idealmente para preparar limonadas,refrescos y com',
  '🥬', 2800, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/24439575/Limon-Tahiti-Malla-1000g-594130_a.jpg?v=638609239734670000',
  true, 3
),
(
  'a1200000-0000-4000-a101-000000000005', 'b1100000-0000-4000-a110-000000000001', '4 x Tomates Chonto Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/4xtomates/p. Marca: SM. Compra 4 tomates PLU 639051',
  '🥬', 4352, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/29626429/Tomates.jpg?v=638907003421970000',
  true, 4
),
(
  'a1200000-0000-4000-a101-000000000006', 'b1100000-0000-4000-a110-000000000001', '4 x Cebolla Blanca o Cabezona Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/4xcebollas/p. Marca: SM. Compra 4 cebollas blancas con el PLU 706261',
  '🥬', 6336, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/29626428/Cebolla-blanca.jpg?v=638907001534430000',
  true, 5
),
(
  'a1200000-0000-4000-a101-000000000007', 'b1100000-0000-4000-a110-000000000001', '3 x Aguacate Hass Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/3-x-aguacate-hass/p. Marca: SM. Compra 3 aguacates hass PLU 990580.',
  '🥬', 4800, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/29608221/Aguacate-Hass.jpg?v=638905460714070000',
  true, 6
),
(
  'a1200000-0000-4000-a101-000000000008', 'b1100000-0000-4000-a110-000000000001', 'Manzana Bolsa Insuperable TAEQ 800  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/manzana-bolsa-taeq-taeq-800-gr-3126845/p. Marca: TAEQ. Lleva a casa fácil y rápido Manzana Bolsa Insuperable TAEQ 800 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 8500, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/27515861/Manzana-Bolsa-Taeq-TAEQ-800-gr-3400686_a.jpg?v=638828184815470000',
  true, 7
),
(
  'a1200000-0000-4000-a101-000000000009', 'b1100000-0000-4000-a110-000000000001', 'Mango Tommy  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/mango-tommy-unidad-967198/p. Marca: SM. Lleva a casa fácil y rápido Mango Tommy 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 5248, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666256/MANGO-TOMMY-UNIDAD-804861_a.jpg?v=639082476566700000',
  true, 8
),
(
  'a1200000-0000-4000-a101-000000000010', 'b1100000-0000-4000-a110-000000000001', 'Ajo Malla Importado x3   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ajo-importado-malla-paquete-x-3u-847268/p. Marca: SM. Características Producto: Blanqueador desinfectante Blancox al 5,25% de concentracion de Hipoclorito de Sodio. Sin aroma. Contiene 1000ml Beneficios: Mas efectivo, 5,25% de hipoclorito de Sodio. Elimina el 99,9% de bacterias. Almacenamiento: Almacenar ',
  '🥬', 832, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/33809942/Ajo-Importado-Malla-Paquete-X-3u-1519_a.jpg?v=639178195361700000',
  true, 9
),
(
  'a1200000-0000-4000-a101-000000000011', 'b1100000-0000-4000-a110-000000000001', 'Platano Insuperable FRESCAMPO 1600  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/platano-ekono-1-6kg-795763/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Platano Insuperable FRESCAMPO 1600 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 7500, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/33434809/Platano-Ekono-1-6kg-157710_a.jpg?v=639144751368630000',
  true, 10
),
(
  'a1200000-0000-4000-a101-000000000012', 'b1100000-0000-4000-a110-000000000001', 'CILANTRO  100  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cilantro-x-100gr-311546/p. Marca: SM. ',
  '🥬', 2112, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32665819/Cilantro-X-100gr-894373_a.jpg?v=639082473098830000',
  true, 11
),
(
  'a1200000-0000-4000-a101-000000000013', 'b1100000-0000-4000-a110-000000000001', 'Cebolla Junca  500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cebolla-junca-x-500g-311544/p. Marca: SM. Características Es muy utilizada en la gastronomía,para realzar sabores y condimentar las comidas. Es muy rica en vitamina A,B,C,E. ayuda a rebajar el colesterol,triglicéridos y el ácido úrico de la sangre y una gran variedad de minerales como níquel,potasio,bromo',
  '🥬', 5120, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/30606467/Cebolla-Junca-X-500g-894372_a.jpg?v=638924360517300000',
  true, 12
),
(
  'a1200000-0000-4000-a101-000000000014', 'b1100000-0000-4000-a110-000000000001', 'Papaya Und  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papaya-unidad-202138/p. Marca: SM. Lleva a casa fácil y rápido Papaya Und 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 7032, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666236/PAPAYA-UNIDAD-676025_a.jpg?v=639082476408530000',
  true, 13
),
(
  'a1200000-0000-4000-a101-000000000015', 'b1100000-0000-4000-a110-000000000001', 'Piña   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pina-unidad-200117/p. Marca: SM. Lleva a casa fácil y rápido Piña 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 6048, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/25416173/PINA-UNIDAD-768871_a.jpg?v=638657246151300000',
  true, 14
),
(
  'a1200000-0000-4000-a101-000000000016', 'b1100000-0000-4000-a110-000000000001', 'Cebolla Roja   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cebolla-roja-unidad-170530/p. Marca: SM. Lleva a casa fácil y rápido Cebolla Roja 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 992, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/25417005/CEBOLLA-ROJA-UNIDAD-1601916_a.jpg?v=638657255800900000',
  true, 15
),
(
  'a1200000-0000-4000-a101-000000000017', 'b1100000-0000-4000-a110-000000000001', 'Pepino Cohombro   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pepino-cohombro-unidad-170483/p. Marca: SM. ',
  '🥬', 1552, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666197/PEPINO-COHOMBRO-UNIDAD-1601909_a.jpg?v=639196459469300000',
  true, 16
),
(
  'a1200000-0000-4000-a101-000000000018', 'b1100000-0000-4000-a110-000000000001', 'Platano Maduro Und  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/platano-maduro-unidad-170467/p. Marca: SM. Lleva a casa fácil y rápido Platano Maduro Und 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 880, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666194/PLATANO-MADURO-UNIDAD-1601907_a.jpg?v=639082475974200000',
  true, 17
),
(
  'a1200000-0000-4000-a101-000000000019', 'b1100000-0000-4000-a110-000000000001', 'Pimentón  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pimenton-unidad-170015/p. Marca: SM. Lleva a casa fácil y rápido Pimentón 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 1744, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666188/PIMENTON-UNIDAD-1601902_a.jpg?v=639082475917400000',
  true, 18
),
(
  'a1200000-0000-4000-a101-000000000020', 'b1100000-0000-4000-a110-000000000001', 'Tomate Chonto Insuperable FRESCAMPO 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tomate-chonto-frescampo-x-1000-gr-120787/p. Marca: FRESCAMPO. Características Tomate Chonto. Marca: Ekono. Características: Tomate chonto. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco.',
  '🥬', 4580, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32665830/Tomate-Chonto-Frescampo-X-1000-gr-506130_a.jpg?v=639082473178570000',
  true, 19
),
(
  'a1200000-0000-4000-a101-000000000021', 'b1100000-0000-4000-a110-000000000001', 'PAPA FRESCAMPO 2000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-frescampo-x-2000-kg-111023/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido PAPA FRESCAMPO 2000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 5700, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/33841616/Papa-Frescampo-X-2000-kg-520468_a.jpg?v=639180211362070000',
  true, 20
),
(
  'a1200000-0000-4000-a101-000000000022', 'b1100000-0000-4000-a110-000000000001', '3 x Granadilla Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/3-x-granadilla/p. Marca: SM. Compra 3 granadillas PLU 639420',
  '🥬', 4656, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/30890999/Combos-Fruver.jpg?v=638936814114200000',
  true, 21
),
(
  'a1200000-0000-4000-a101-000000000023', 'b1100000-0000-4000-a110-000000000001', '12 x Tomates Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/https---www-exito-com-12-x-tomates-p/p. Marca: SM. Compra 12 unidades de Tomates PLU 639051',
  '🥬', 13056, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/30805519/Combo-Tomates.jpg?v=638932477501370000',
  true, 22
),
(
  'a1200000-0000-4000-a101-000000000024', 'b1100000-0000-4000-a110-000000000001', 'Manzana Combinada   TAEQ 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/manzana-mix-carulla-1000-gr-3056495/p. Marca: TAEQ. Lleva a casa fácil y rápido Manzana Combinada TAEQ 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 8640, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/24652543/Manzana-Mix-CARULLA-1000-gr-3161785_a.jpg?v=638619455179030000',
  true, 23
),
(
  'a1200000-0000-4000-a101-000000000025', 'b1100000-0000-4000-a110-000000000001', 'Manzana Verde Bolsa Insuperable TAEQ 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/manzana-verde-bolsa-carulla-1000-gr-3056464/p. Marca: TAEQ. Lleva a casa fácil y rápido Manzana Verde Bolsa Insuperable TAEQ 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 7600, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/27514315/Manzana-Verde-Bolsa-CARULLA-1000-gr-3161760_a.jpg?v=638827668156900000',
  true, 24
),
(
  'a1200000-0000-4000-a101-000000000026', 'b1100000-0000-4000-a110-000000000001', 'Cebolla Blanca  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cebolla-blanca-unidad-956928/p. Marca: SM. .',
  '🥬', 1584, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/25506183/CEBOLLA-BLANCA-UNIDAD-706261_a.jpg?v=638926220215630000',
  true, 25
),
(
  'a1200000-0000-4000-a101-000000000027', 'b1100000-0000-4000-a110-000000000001', 'Banano   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/banano-unidad-937109/p. Marca: SM. ',
  '🥬', 368, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/32541000/Banano-Unidad-639180_a.jpg?v=639102198299970000',
  true, 26
),
(
  'a1200000-0000-4000-a101-000000000028', 'b1100000-0000-4000-a110-000000000001', 'Plátano Verde  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/platano-unidad-937108/p. Marca: SM. Lleva a casa fácil y rápido Plátano Verde 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 864, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666249/PLATANO-UNIDAD-639142_a.jpg?v=639082476517300000',
  true, 27
),
(
  'a1200000-0000-4000-a101-000000000029', 'b1100000-0000-4000-a110-000000000001', 'Tomate Chonto  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tomate-chonto-unidad-937107/p. Marca: SM. Lleva a casa fácil y rápido Tomate Chonto 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 1088, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666247/TOMATE-CHONTO-UNIDAD-639051_a.jpg?v=639082476503370000',
  true, 28
),
(
  'a1200000-0000-4000-a101-000000000030', 'b1100000-0000-4000-a110-000000000001', 'Fresa Extra   500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/fresa-extra-x-500gr-886957/p. Marca: SM. Compra Fresas Extra, seleccionadas con la mejor calidad para que disfrutes de la frescura del campo y al mejor precio. Pide las tuyas a domicilio. Consulta nuestra guia de sistema frescos para saber como conservar mejor tus frutas y verduras. Características',
  '🥬', 11392, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/33833564/Fresa-Extra-X-500gr-1720_a.jpg?v=639180028367670000',
  true, 29
),
(
  'a1200000-0000-4000-a101-000000000031', 'b1100000-0000-4000-a110-000000000001', 'Milanesa de res  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/milanesa-res-644019/p. Marca: SM. Lleva a casa fácil y rápido Milanesa de res fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 37980, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33698553/MILANESA-RES-616300_a.jpg?v=639167828393200000',
  true, 30
),
(
  'a1200000-0000-4000-a101-000000000032', 'b1100000-0000-4000-a110-000000000001', 'Molida de res  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-especial-937-si-506771/p. Marca: SM. Molida Especial Res 93/7 SI* Características ¡Compra ahora! Y disfruta los beneficios de nuestra Molida especial res 97/3 SI* en cada porción, ideal para freír/asar/cocinar. Cuidadosamente seleccionada para brindarte una calidad sin igual. ¡Realiza tu compra par',
  '🥩', 29732, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681640/MOLIDA-ESPECIAL-937-SI-804733_a.jpg?v=639166317248330000',
  true, 31
),
(
  'a1200000-0000-4000-a101-000000000033', 'b1100000-0000-4000-a110-000000000001', 'Carne de res asar freír  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/carnes-asar-freir-si-498107/p. Marca: SM. Lleva a casa fácil y rápido Carne de res asar freír fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 30980, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681774/CARNES-ASAR-FREIR-SI-237700_a.jpg?v=639166318726870000',
  true, 32
),
(
  'a1200000-0000-4000-a101-000000000034', 'b1100000-0000-4000-a110-000000000001', 'Costilla de cerdo  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/costilla-cerdo-487824/p. Marca: SM. Lleva a casa fácil y rápido Costilla de cerdo fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 25980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681616/COSTILLA-CERDO-875493_a.jpg?v=639166317084400000',
  true, 33
),
(
  'a1200000-0000-4000-a101-000000000035', 'b1100000-0000-4000-a110-000000000001', 'Tocineta o tocino carnudo  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tocineta-487451/p. Marca: SM. Lleva a casa fácil y rápido Tocineta o tocino carnudo fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 25900, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33730093/TOCINETA-867994_a.jpg?v=639168892649930000',
  true, 34
),
(
  'a1200000-0000-4000-a101-000000000036', 'b1100000-0000-4000-a110-000000000001', 'Carne de cerdo  económica Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/brazo-cerdo-487141/p. Marca: SM. Lleva a casa fácil y rápido Carne de cerdo económica. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 17800, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681746/BRAZO-CERDO-860794_a.jpg?v=639166318376570000',
  true, 35
),
(
  'a1200000-0000-4000-a101-000000000037', 'b1100000-0000-4000-a110-000000000001', 'Lomo de cerdo o cañón  fresco Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomo-cerdo-486966/p. Marca: SM. Lleva a casa fácil y rápido Lomo de cerdo o cañón fresco. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 24980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33730092/LOMO-CERDO-855053_a.jpg?v=639168892636700000',
  true, 36
),
(
  'a1200000-0000-4000-a101-000000000038', 'b1100000-0000-4000-a110-000000000001', 'Lomo de cerdo o cañón  congelado porcionado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomo-de-cerdo-cc-437688/p. Marca: SM. LOMO DE CERDO C/C Características Descubre el delicioso sabor del lomo de cerdo c/c. Deléitate con cortes jugosos de máxima calidad que te brindarán una experiencia gastronómica excepcional. Nuestra variedad de cortes de lomo de cerdo son ideales para freír/asar/cocin',
  '🥩', 23980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681580/LOMO-DE-CERDO-CC-372437_a.jpg?v=639166316827230000',
  true, 37
),
(
  'a1200000-0000-4000-a101-000000000039', 'b1100000-0000-4000-a110-000000000001', 'Chuleta Económica de Cerdo  económica Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chuleta-de-cerdo-economica-367565/p. Marca: SM. Lleva a casa fácil y rápido Chuleta Económica de Cerdo económica. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 13424, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681935/CHULETA-DE-CERDO-ECONOMICA-917541_a.jpg?v=639166320383770000',
  true, 38
),
(
  'a1200000-0000-4000-a101-000000000040', 'b1100000-0000-4000-a110-000000000001', 'Pierna Pernil De Pollo I.Marin Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pernil-de-pollo-insuperable-742702/p. Marca: SM. Pierna Pernil De Pollo I.Marin Características Despierta tu chef interior y prepara la receta perfecta con nuestra pierna pernil de pollo i.marín. Convierte cada comida en una experiencia memorable para toda la familia. Elige la calidad y la jugosidad de nu',
  '🥩', 9900, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688462/Pernil-De-Pollo-Insuperable-22247_a.jpg?v=639166744604370000',
  true, 39
),
(
  'a1200000-0000-4000-a101-000000000041', 'b1100000-0000-4000-a110-000000000001', 'Molida de res TAEQ fresco (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-lv-taeq-450g-741724/p. Marca: TAEQ. Lleva a casa fácil y rápido Molida de res TAEQ fresco (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 18900, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681702/MOLIDA-LV-TAEQ-450g-1030607_a.jpg?v=639166317920100000',
  true, 40
),
(
  'a1200000-0000-4000-a101-000000000042', 'b1100000-0000-4000-a110-000000000001', 'Chuleta de cerdo  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chuleta-especial-cerdo-682213/p. Marca: SM. Chuleta De Cerdo Gnl Caracteristicas Chuleta especial cerdo. Una chuleta de cerdo es un corte de carne realizado chope al espinado del cerdo que suele contener chope o parte de una vértebra,que se sirve como porción individual. Las chuletas de cerdo pueden vende',
  '🥩', 20980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33685538/Chuleta-Especial-Cerdo-754510_a.jpg?v=639166371632700000',
  true, 41
),
(
  'a1200000-0000-4000-a101-000000000043', 'b1100000-0000-4000-a110-000000000001', 'Pecho o carne de res para sudar  fresco Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pecho-522220/p. Marca: SM. Lleva a casa fácil y rápido Pecho o carne de res para sudar fresco. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 30480, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681825/PECHO-876865_a.jpg?v=639166319330600000',
  true, 42
),
(
  'a1200000-0000-4000-a101-000000000044', 'b1100000-0000-4000-a110-000000000001', 'Costilla de res  corriente Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/costilla-res-corriente-517408/p. Marca: SM. Lleva a casa fácil y rápido Costilla de res corriente. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 20383, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33687763/COSTILLA-RES-CORRIENTE-211363_a.jpg?v=639166412708000000',
  true, 43
),
(
  'a1200000-0000-4000-a101-000000000045', 'b1100000-0000-4000-a110-000000000001', 'Caderita de res o solomo extranjero  asar Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caderita-de-res-494402/p. Marca: SM. CADERITA DE RES ASAR Características Disfruta todo el sabor con nuestra caderita de res para asar, un corte de carne tierno y jugoso que transformará tus asados en experiencias culinarias inigualables. ¡Compra ahora y recógelo en nuestra tienda más cercana!&nbsp;',
  '🥩', 42980, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681635/CADERITA-DE-RES-104755_a.jpg?v=639166317207100000',
  true, 44
),
(
  'a1200000-0000-4000-a101-000000000046', 'b1100000-0000-4000-a110-000000000001', 'Tocino económico o tocino papada  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papada-487452/p. Marca: SM. Lleva a casa fácil y rápido Tocino económico o tocino papada fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 15480, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681535/Papada-868050_a.jpg?v=639166316266030000',
  true, 45
),
(
  'a1200000-0000-4000-a101-000000000047', 'b1100000-0000-4000-a110-000000000001', 'Pierna de cerdo o milanesa  fresco Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pierna-cerdo-corriente-486050/p. Marca: SM. Lleva a casa fácil y rápido Pierna de cerdo o milanesa fresco. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 16784, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681740/PIERNA-CERDO-CORRIENTE-824446_a.jpg?v=639166318294170000',
  true, 46
),
(
  'a1200000-0000-4000-a101-000000000048', 'b1100000-0000-4000-a110-000000000001', 'Hígado de res  congelado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/higado-de-res-mp-476775/p. Marca: SM. Lleva a casa fácil y rápido Hígado de res congelado. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 11150, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681533/Higado-De-Res-mp-45083_a.jpg?v=639166316232430000',
  true, 47
),
(
  'a1200000-0000-4000-a101-000000000049', 'b1100000-0000-4000-a110-000000000001', 'Nuggets de pollo FRESCAMPO apanados (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/nuggets-de-pollo-apanados-400158/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Nuggets de pollo FRESCAMPO apanados (300 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 10500, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688423/Nuggets-De-Pollo-Apanados-1444967_a.jpg?v=639166744181500000',
  true, 48
),
(
  'a1200000-0000-4000-a101-000000000050', 'b1100000-0000-4000-a110-000000000001', 'Pechuga de Pollo Marinada Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pechuga-marinada-281746/p. Marca: SM. Características Oferta Pechuga de Pollo Marinada. Marca: Pollocoa. Características: Medias pechugas congeladas de 6 a 8 unidades. Almacenamiento: Manténgase congelado para su conservación. Después de abierto consumirse en el menor tiempo posible.',
  '🥩', 14290, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688460/Pechuga-Marinada-599530_a.jpg?v=639166744562070000',
  true, 49
),
(
  'a1200000-0000-4000-a101-000000000051', 'b1100000-0000-4000-a110-000000000001', 'Filete de pechuga FRIKO HF marinado (850  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/filete-de-pechuga-de-10-unds-35563/p. Marca: FRIKO HF. CARACTERISTICAS Producto: Contiene 10 unidades de 1/2 Filetes de Pechuga abiertos marinados,empacados en bolsa. Beneficios: Cada filete viene empacado en bolsa individual, facilitando la separacion al estar congelado. Almacenamiento: Consérvese congel',
  '🥩', 32600, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688430/FILETE-DE-PECHUGA-DE-10-UNDS-237859_a.jpg?v=639166744250600000',
  true, 50
),
(
  'a1200000-0000-4000-a101-000000000052', 'b1100000-0000-4000-a110-000000000001', 'Churrasco FRIKO HF de pollo (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/churrasco-de-pollo-friko-x500-g-friko-hf-500-gr-3232718/p. Marca: FRIKO HF. Lleva a casa fácil y rápido Churrasco FRIKO HF de pollo (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 10500, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33684780/Churrasco-de-pollo-friko-x500-g-FRIKO-HF-500-gr-3778609_a.jpg?v=639166364539930000',
  true, 51
),
(
  'a1200000-0000-4000-a101-000000000053', 'b1100000-0000-4000-a110-000000000001', 'Filete de pechuga FRESCAMPO marinado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/filete-de-pechuga-de-pollo-frescampo-3122598/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Filete de pechuga FRESCAMPO marinado. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 30400, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33683872/Filete-de-Pechuga-de-Pollo-FRESCAMPO-3383007_a.jpg?v=639166358107370000',
  true, 52
),
(
  'a1200000-0000-4000-a101-000000000054', 'b1100000-0000-4000-a110-000000000001', 'Muslos de Pollo Marinado FRESCAMPO 750  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/muslos-de-pollo-marinado-frescampo-750-gr-3122597/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Muslos de Pollo Marinado FRESCAMPO 750 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 12900, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33683869/Muslos-de-Pollo-Marinado-FRESCAMPO-750-gr-3383006_a.jpg?v=639166358096530000',
  true, 53
),
(
  'a1200000-0000-4000-a101-000000000055', 'b1100000-0000-4000-a110-000000000001', 'Molida de res FRESCAMPO fresca (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-8020-lv-ev-frescampo-450-gr-3070492/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Molida de res FRESCAMPO fresca (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 12400, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33683450/molida-8020-lv-ev-FRESCAMPO-450-gr-3206849_a.jpg?v=639166355486600000',
  true, 54
),
(
  'a1200000-0000-4000-a101-000000000056', 'b1100000-0000-4000-a110-000000000001', 'Trozo De Pollo Marinado* SMN 900  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/trozo-de-pollo-marinado-smn-900-gr-853494/p. Marca: SMN. Lleva a casa fácil y rápido Trozo De Pollo Marinado* SMN 900 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 10400, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33683024/TROZO-DE-POLLO-MARINADO-SMN-900-gr-1702502_a.jpg?v=639166345698930000',
  true, 55
),
(
  'a1200000-0000-4000-a101-000000000057', 'b1100000-0000-4000-a110-000000000001', 'Pechuga Pollo Campesina Marina AQUA Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pechuga-pollo-campesina-836282/p. Marca: AQUA. Pechuga Pollo Campesina Marina Características Disfruta los beneficios de nuestra pechuga de pollo campesina marinada. Cortes frescos y sin procesar, para platos irresistibles, llevando a tu cocina la esencia de la tradición. ¡Compra ahora y recibe en casa!',
  '🥩', 15900, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688465/Pechuga-Pollo-Campesina-152478_a.jpg?v=639166744635030000',
  true, 56
),
(
  'a1200000-0000-4000-a101-000000000058', 'b1100000-0000-4000-a110-000000000001', 'Pollo PROMOCION entero despresado (1800  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pollo-entero-despresado-815478/p. Marca: PROMOCION. Lleva a casa fácil y rápido Pollo PROMOCION entero despresado (1800 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 20560, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33682153/POLLO-ENTERO-DESPRESADO-1580900_a.jpg?v=639166322946100000',
  true, 57
),
(
  'a1200000-0000-4000-a101-000000000059', 'b1100000-0000-4000-a110-000000000001', 'Muslo Pollo Blanco Und Marinad PROMOCION 1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/muslo-pollo-blanco-und-marinad-promocion-1-und-744667/p. Marca: PROMOCION. Lleva a casa fácil y rápido Muslo Pollo Blanco Und Marinad PROMOCION 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 1200, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33682786/Muslo-Pollo-Blanco-Und-Marinad-PROMOCION-1-und-1037525_a.jpg?v=639166339410700000',
  true, 58
),
(
  'a1200000-0000-4000-a101-000000000060', 'b1100000-0000-4000-a110-000000000001', 'Molida de res TAEQ fresca (950  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-lv-taeq-x-950-g-741725/p. Marca: TAEQ. Lleva a casa fácil y rápido Molida de res TAEQ fresca (950 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 35850, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33682063/Molida-lv-taeq-x-950-g-1030608_a.jpg?v=639166322513300000',
  true, 59
),
(
  'a1200000-0000-4000-a101-000000000061', 'b1100000-0000-4000-a110-000000000001', 'Leche deslactosada FRESCAMPO semidescremada UHT paquete (5400  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-frescampo-uht-semi-deslactosada-5400-ml-3225373/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche deslactosada FRESCAMPO semidescremada UHT paquete (5400 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18600, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672552/Leche-FRESCAMPO-Uht-Semi-Deslactosada-5400-ml-3750922_a.jpg?v=639166171330400000',
  true, 60
),
(
  'a1200000-0000-4000-a101-000000000062', 'b1100000-0000-4000-a110-000000000001', 'Queso crema COLANTA fresco semiblando (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-crema-x-400g-101497/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso crema COLANTA fresco semiblando (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 10600, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33670293/Queso-Crema-X-400g-895557_a.jpg?v=639166156163830000',
  true, 61
),
(
  'a1200000-0000-4000-a101-000000000063', 'b1100000-0000-4000-a110-000000000001', 'Leche FRESCAMPO entera UHT paquete (5400  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-frescampo-uht-entera-5400-ml-3225371/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche FRESCAMPO entera UHT paquete (5400 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18500, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672550/Leche-FRESCAMPO-Uht-Entera-5400-ml-3750920_a.jpg?v=639166171308300000',
  true, 62
),
(
  'a1200000-0000-4000-a101-000000000064', 'b1100000-0000-4000-a110-000000000001', 'Leche FRESCAMPO entera UHT maxilitro paquete (6600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-frescampo-uht-entera-6600-ml-3225369/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche FRESCAMPO entera UHT maxilitro paquete (6600 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22620, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672548/Leche-FRESCAMPO-Uht-Entera-6600-ml-3750918_a.jpg?v=639166171285800000',
  true, 63
),
(
  'a1200000-0000-4000-a101-000000000065', 'b1100000-0000-4000-a110-000000000001', 'Leche ALQUERIA semidescremada deslactosada sixpack (6000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-alqueria-semidescremada-deslactosada-sixpack-6000-ml-3188872/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Leche ALQUERIA semidescremada deslactosada sixpack (6000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 26920, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33678845/Leche-ALQUERIA-Semidescremada-Deslactosada-Sixpack-6000-ml-3616196_a.jpg?v=639166202195030000',
  true, 64
),
(
  'a1200000-0000-4000-a101-000000000066', 'b1100000-0000-4000-a110-000000000001', 'Crema de leche ALQUERIA semientera (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-leche-semi-entera-alqueria-400-gr-3096922/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Crema de leche ALQUERIA semientera (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8800, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33678453/Crema-Leche-Semi-Entera-ALQUERIA-400-gr-3313023_a.jpg?v=639166200361700000',
  true, 65
),
(
  'a1200000-0000-4000-a101-000000000067', 'b1100000-0000-4000-a110-000000000001', 'Leche COLANTA uht entera (6000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-uht-entera-colanta-6000-ml-3069107/p. Marca: COLANTA. Lleva a casa fácil y rápido Leche COLANTA uht entera (6000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 32600, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33671545/Leche-Uht-Entera-COLANTA-6000-ml-3202769_a.jpg?v=639166164985770000',
  true, 66
),
(
  'a1200000-0000-4000-a101-000000000068', 'b1100000-0000-4000-a110-000000000001', 'Jamón  COLANTA seleccionado (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-seleccionado-colanta-450-gr-3059799/p. Marca: COLANTA. Lleva a casa fácil y rápido Jamón COLANTA seleccionado (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 17050, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/31963274/Jamon-Seleccionado-COLANTA-450-gr-3165440_a.jpg?v=639003121860230000',
  true, 67
),
(
  'a1200000-0000-4000-a101-000000000069', 'b1100000-0000-4000-a110-000000000001', 'Salchicha ranchera RANCHERA premium x14und (480  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salchicha-ranchera-x-480-g-749935/p. Marca: RANCHERA. Lleva a casa fácil y rápido Salchicha ranchera RANCHERA premium x14und (480 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 26000, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/33876336/Salchicha-Ranchera-X-480-G-1047205_a.jpg?v=639186034613470000',
  true, 68
),
(
  'a1200000-0000-4000-a101-000000000070', 'b1100000-0000-4000-a110-000000000001', 'Huevos AA KIKES Rojo Pet (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-aa-rojo-30und-pet-744836/p. Marca: KIKES. Lleva a casa fácil y rápido Huevos AA KIKES Rojo Pet (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 23800, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/32900846/Huevo-Aa-Rojo-30und-Pet-1037843_a.jpg?v=639101333554500000',
  true, 69
),
(
  'a1200000-0000-4000-a101-000000000071', 'b1100000-0000-4000-a110-000000000001', 'Huevos A SMN rojo (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-rojo-a-x-30-insuperable-742696/p. Marca: SMN. Lleva a casa fácil y rápido Huevos A SMN rojo (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 10990, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/32892558/Huevo-Rojo-A-X-30-Insuperable-1032680_a.jpg?v=639100640567770000',
  true, 70
),
(
  'a1200000-0000-4000-a101-000000000072', 'b1100000-0000-4000-a110-000000000001', 'Huevos AA SMN rojo (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aa-rojo-de-30-amarr-avicola-triple-a-30-und-662450/p. Marca: SMN. Lleva a casa fácil y rápido Huevos AA SMN rojo (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 14900, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/33285898/AA-ROJO-DE-30-AMARR-AVICOLA-TRIPLE-A-30-und-429693_a.jpg?v=639135796352430000',
  true, 71
),
(
  'a1200000-0000-4000-a101-000000000073', 'b1100000-0000-4000-a110-000000000001', 'Alimento lácteo BON YURT zucaritas x4 und 170 g (680  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-lacteo-con-cereal-paq-x-4-unds-531236/p. Marca: BON YURT. Lleva a casa fácil y rápido Alimento lácteo BON YURT zucaritas x4 und 170 g (680 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 18650, 'Yogurt y bebidas lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33670153/Alimento-Lacteo-Con-Cereal-Paq-X-4-Unds-258583_a.jpg?v=639166153693500000',
  true, 72
),
(
  'a1200000-0000-4000-a101-000000000074', 'b1100000-0000-4000-a110-000000000001', 'Huevos AA NAPOLES rojo (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-napoles-de-30u-aa-rosado-subasta-30-und-496267/p. Marca: NAPOLES. Lleva a casa fácil y rápido Huevos AA NAPOLES rojo (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 23000, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/32919483/HUEVO-NAPOLES-DE-30U-AA-ROSADO-SUBASTA-30-und-172836_a.jpg?v=639104823133270000',
  true, 73
),
(
  'a1200000-0000-4000-a101-000000000075', 'b1100000-0000-4000-a110-000000000001', 'Queso KRAFT Fresco Semigraso Semiduro (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-kraft-fresco-semigraso-semiduro-250-gr-3251367/p. Marca: KRAFT. Lleva a casa fácil y rápido Queso KRAFT Fresco Semigraso Semiduro (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8800, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33820077/Queso-KRAFT-Fresco-Semigraso-Semiduro-250-gr-3843165_a.jpg?v=639179095340670000',
  true, 74
),
(
  'a1200000-0000-4000-a101-000000000076', 'b1100000-0000-4000-a110-000000000001', 'Crema de leche ALQUERIA ideal para preparaciones calientes (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-alqueria-leche-semientera-uat-400-gr-3193936/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Crema de leche ALQUERIA ideal para preparaciones calientes (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8400, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33678930/Crema-ALQUERIA-LECHE-SEMIENTERA-UAT-400-gr-3630447_a.jpg?v=639166202572570000',
  true, 75
),
(
  'a1200000-0000-4000-a101-000000000077', 'b1100000-0000-4000-a110-000000000001', 'Leche sabor original ALQUERIA pack x 6 unds (6000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-alqueria-semidescremada-original-sixpack-6000-ml-3188875/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Leche sabor original ALQUERIA pack x 6 unds (6000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 33650, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672305/Leche-ALQUERIA-Semidescremada-Original-Sixpack-6000-ml-3616199_a.jpg?v=639166169220370000',
  true, 76
),
(
  'a1200000-0000-4000-a101-000000000078', 'b1100000-0000-4000-a110-000000000001', 'Huevos AA NAPOLES libre jaula (1  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-subasta-libre-jaula-1-und-3184726/p. Marca: NAPOLES. Lleva a casa fácil y rápido Huevos AA NAPOLES libre jaula (1 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 21500, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/33563992/huevo-SUBASTA-libre-jaula-1-und-3598388_a.jpg?v=639155764002130000',
  true, 77
),
(
  'a1200000-0000-4000-a101-000000000079', 'b1100000-0000-4000-a110-000000000001', 'Salchicha CASA BLANCA premium (480  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salchicha-ahumada-parrillera-casa-blanca-480-gr-3172233/p. Marca: CASA BLANCA. Lleva a casa fácil y rápido Salchicha CASA BLANCA premium (480 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 15900, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/33864360/Salchicha-Ahumada-Parrillera-CASA-BLANCA-480-gr-3554086_a.jpg?v=639184432382230000',
  true, 78
),
(
  'a1200000-0000-4000-a101-000000000080', 'b1100000-0000-4000-a110-000000000001', 'Queso mozzarella EXITO MARCA PROPIA tajado (800  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-exito-exito-marca-propia-800-gr-3147133/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Queso mozzarella EXITO MARCA PROPIA tajado (800 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19980, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33672053/Queso-Mozzarella-Exito-EXITO-MARCA-PROPIA-800-gr-3479458_a.jpg?v=639166167129600000',
  true, 79
),
(
  'a1200000-0000-4000-a101-000000000081', 'b1100000-0000-4000-a110-000000000001', 'Crema de leche ALQUERIA semientera (180  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-leche-semi-entera-alqueria-180-gr-3096923/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Crema de leche ALQUERIA semientera (180 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4760, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33678445/Crema-Leche-Semi-Entera-ALQUERIA-180-gr-3313024_a.jpg?v=639166200326800000',
  true, 80
),
(
  'a1200000-0000-4000-a101-000000000082', 'b1100000-0000-4000-a110-000000000001', 'Queso mozzarella EXITO MARCA PROPIA tajado (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-tajado-exito-marca-propia-400-gr-3088958/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Queso mozzarella EXITO MARCA PROPIA tajado (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13980, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33675991/Queso-Mozzarella-Tajado-EXITO-MARCA-PROPIA-400-gr-3280456_a.jpg?v=639166187043100000',
  true, 81
),
(
  'a1200000-0000-4000-a101-000000000083', 'b1100000-0000-4000-a110-000000000001', 'Queso parmesano EXITO MARCA PROPIA madurado (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-parmesano-exito-marca-propia-100-gr-3088957/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Queso parmesano EXITO MARCA PROPIA madurado (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6940, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33675985/Queso-Parmesano-EXITO-MARCA-PROPIA-100-gr-3280455_a.jpg?v=639166187027230000',
  true, 82
),
(
  'a1200000-0000-4000-a101-000000000084', 'b1100000-0000-4000-a110-000000000001', 'Leche deslactosada ALPINA bolsa x6und 1100ml (6600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-deslactosada-sixpack-en-bolsa-x-11-litros-cu-957267/p. Marca: ALPINA. Características Leche Semidescremada Deslactosada UHT Larga Vida Paq x 6und (1.1Lt c/u). Marca: Alpina. Características: Leche semidescremada deslactosada UHT, sin preservantes, larga vida, maxilitro. Almacenamiento: Después de ab',
  '🛒', 37950, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33676739/Leche-Deslactosada-Sixpack-En-Bolsa-X-11-Litros-Cu-576258_a.jpg?v=639166192760000000',
  true, 83
),
(
  'a1200000-0000-4000-a101-000000000085', 'b1100000-0000-4000-a110-000000000001', 'Leche deslactosada COLANTA x6und (6600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-semidescremada-sixpack-en-bolsa-x-11-litros-cu-953434/p. Marca: COLANTA. Características Leche deslactosada colanta 6 unidades c-u x 1","1 litro en bolsa. Leche UAT larga vida adicionada con vitaminas A y D3 sin conservantes. La leche garantiza mayor porcentaje de proteína,producto fresco y natural,',
  '🛒', 34950, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33676447/Leche-Semidescremada-Sixpack-En-Bolsa-X-11-Litros-Cu-122939_a.jpg?v=639166190161970000',
  true, 84
),
(
  'a1200000-0000-4000-a101-000000000086', 'b1100000-0000-4000-a110-000000000001', 'Huevos AAA KIKES rojo pet (15  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-rojo-aaa-15und-pet-895234/p. Marca: KIKES. Lleva a casa fácil y rápido Huevos AAA KIKES rojo pet (15 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 9900, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/31986847/Huevo-Rojo-Aaa-15und-Pet-1232624_a.jpg?v=639005637481070000',
  true, 85
),
(
  'a1200000-0000-4000-a101-000000000087', 'b1100000-0000-4000-a110-000000000001', 'Kumis ALPINA bolsa (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/kumis-el-original-en-bolsa-x-1000-gr-878500/p. Marca: ALPINA. Lleva a casa fácil y rápido Kumis ALPINA bolsa (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 10200, 'Yogurt y bebidas lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33676773/Kumis-El-Original-En-Bolsa-X-1000-gr-818003_a.jpg?v=639166193003600000',
  true, 86
),
(
  'a1200000-0000-4000-a101-000000000088', 'b1100000-0000-4000-a110-000000000001', 'Chorizo COLANTA santarrosano (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chorizo-santarrosano-premium-x-500g-732892/p. Marca: COLANTA. CARACTERISTICA Chorizo de cerdo Santarrosano. Recomendaciones de uso: asar o freír. Conservación: manténgase en un lugar limpio y fresco,refrigerar de 0 a 4°C. Después de abierto,consúmase lo más pronto posible.',
  '🥩', 20400, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/31960851/Chorizo-Santarrosano-Premium-X-500g-679494_a.jpg?v=639003091092930000',
  true, 87
),
(
  'a1200000-0000-4000-a101-000000000089', 'b1100000-0000-4000-a110-000000000001', 'Jamón  PIETRAN de cerdo (230  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-estandar-libre-de-grasa-reducido-en-sodio-x-230g-711974/p. Marca: PIETRAN. Nombre del producto: Jamon PIETRAN de Cerdo 230 Gr Características del producto: Delicioso jamón de cerdo sin conservantes, buena fuente de proteína, 97% libre de grasa y 25% reducido en sodio. Con empaque abre fácil que te b',
  '🥩', 14950, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/31486116/Jamon-Estandar-Libre-De-Grasa-Reducido-En-Sodio-X-230g-342208_a.jpg?v=638974567543030000',
  true, 88
),
(
  'a1200000-0000-4000-a101-000000000090', 'b1100000-0000-4000-a110-000000000001', 'Salchichón Cerveroni ZENU 900  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salchichon-x-900-gr-684774/p. Marca: ZENU. Lleva a casa fácil y rápido Salchichón Cerveroni ZENU 900 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 25500, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/33876325/Salchichon-X-900-gr-246751_a.jpg?v=639186034563130000',
  true, 89
),
(
  'a1200000-0000-4000-a101-000000000091', 'b1100000-0000-4000-a110-000000000001', 'Galletas DUCALES x8 tacos (700  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galletas-ducales-ducales-tc-x-8-700gr-700-gr-3197630/p. Marca: DUCALES. Lleva a casa fácil y rápido Galletas DUCALES x8 tacos (700 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14350, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/33502652/Galletas-DUCALES-DUCALES-TC-X-8-700GR-700-gr-3640324_a.jpg?v=639153314189870000',
  true, 90
),
(
  'a1200000-0000-4000-a101-000000000092', 'b1100000-0000-4000-a110-000000000001', 'Aceite FRESCAMPO vegetal multiusos (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-vegetal-frescampo-3000-ml-3082931/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite FRESCAMPO vegetal multiusos (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 20850, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/33173636/Aceite-Vegetal-FRESCAMPO-3000-ml-3257073_a.jpg?v=639124918504470000',
  true, 91
),
(
  'a1200000-0000-4000-a101-000000000093', 'b1100000-0000-4000-a110-000000000001', 'Sal REFISAL alta pureza  (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/sal-refinada-1000-gr-345053/p. Marca: REFISAL. Lleva a casa fácil y rápido Sal REFISAL alta pureza (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2910, 'Sal', 'https://exitocol.vteximg.com.br/arquivos/ids/32006772/Sal-Refinada-1000-gr-125407_a.jpg?v=639010821199030000',
  true, 92
),
(
  'a1200000-0000-4000-a101-000000000094', 'b1100000-0000-4000-a110-000000000001', 'Chocolate CORONA tradicional pastillado (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolate-de-mesa-corona-tradicional-pastillado-450-gr-3190994/p. Marca: CORONA. Contenido suministrado a Almacenes Éxito directamente por NUTRESA Chocolate Características "Las presentaciones del producto estarán sujetas a disponibilidad del inventario al momento de la entrega de su compra".',
  '🥛', 15600, 'Café, chocolate y cremas no lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33502603/Chocolate-de-mesa-CORONA-TRADICIONAL-PASTILLADO-450-gr-3622642_a.jpg?v=639153313873930000',
  true, 93
),
(
  'a1200000-0000-4000-a101-000000000095', 'b1100000-0000-4000-a110-000000000001', 'Azúcar FRESCAMPO blanco (2500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/azucar-blanco-especial-frescampo-2500-gr-3096347/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Azúcar FRESCAMPO blanco (2500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8470, 'Azúcar, panela y endulzante', 'https://exitocol.vteximg.com.br/arquivos/ids/33546414/Azucar-Blanco-Especial-FRESCAMPO-2500-gr-3310407_a.jpg?v=639154582706400000',
  true, 94
),
(
  'a1200000-0000-4000-a101-000000000096', 'b1100000-0000-4000-a110-000000000001', 'Lenteja FRESCAMPO granos seleccionados  (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lenteja-837337/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Lenteja FRESCAMPO granos seleccionados (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 1990, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/28958849/Lenteja-1121547_a.jpg?v=638864600885130000',
  true, 95
),
(
  'a1200000-0000-4000-a101-000000000097', 'b1100000-0000-4000-a110-000000000001', 'Pastas LA MUNECA spaghetti (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasta-spaguetti-1000-gr-755424/p. Marca: LA MUNECA. Contenido suministrado a Almacenes Éxito directamente por HARINERA DEL VALLE S.A. PASTA LA MUÑECA ESPAGUETI 1000G Características Pasta La Muñeca tiene múltiples formas de preparación y es perfecto para acompañar salsas, carnes y verduras. Recárgate de m',
  '🛒', 6900, 'Pastas', 'https://exitocol.vteximg.com.br/arquivos/ids/32829808/Pasta-Spaguetti-1000-gr-603117_a.jpg?v=639095354058530000',
  true, 96
),
(
  'a1200000-0000-4000-a101-000000000098', 'b1100000-0000-4000-a110-000000000001', 'Arroz DIANA blanco vitamor (5000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arroz-diana-5000-gr-498671/p. Marca: DIANA. Lleva a casa fácil y rápido Arroz DIANA blanco vitamor (5000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19950, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/28955906/Arroz-Diana-5000-gr-814670_a.jpg?v=639154788988530000',
  true, 97
),
(
  'a1200000-0000-4000-a101-000000000099', 'b1100000-0000-4000-a110-000000000001', 'Arroz ROA blanco fortiplus (3000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arroz-blanco-fortificado-x-3000-g-480324/p. Marca: ROA. Arroz Blanco Fortificado X 3000 G Características Arroz Roa. Peso neto: 3000g. Descripción: con vitamina A y ácido fólico B9. Fortificado',
  '🛒', 9000, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/33261024/Arroz-Blanco-Fortificado-X-3000-G-694991_a.jpg?v=639130900461230000',
  true, 98
),
(
  'a1200000-0000-4000-a101-000000000100', 'b1100000-0000-4000-a110-000000000001', 'Harina PAN maíz blanco (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/harina-pan-maiz-blanca-x-1000-gr-370181/p. Marca: PAN. CARACTERISTICAS Conserve en un lugar fresco y seco. Una vez abierto consuma en el menor tiempo posible. A 1/4 de taza de agua añada sal al gusto y añada lentamente 1 taza de ahrina pan, mezcle con una cuchara continuamente hasta obtener una masa consi',
  '🛒', 3400, 'Harinas y mezclas para preparar', 'https://exitocol.vteximg.com.br/arquivos/ids/33496405/Harina-Pan-Maiz-Blanca-X-1000-gr-200963_a.jpg?v=639153133409500000',
  true, 99
),
(
  'a1200000-0000-4000-a101-000000000101', 'b1100000-0000-4000-a110-000000000001', 'Galletas SALTIN NOEL tradicional x6 tacos (531  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galletas-crakers-tradicionales-x-570-gr-x-6-tacos-104284/p. Marca: SALTIN NOEL. Características Galletas saltín noel tradicional. Contiene 6 tacos. 85% contenido de cereal. Conservar este producto en un lugar fresco y seco,protegido de la luz directa y alejado de olores fuertes.',
  '🛒', 9880, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/31753378/Galletas-Crakers-Tradicionales-X-570-Gr-X-6-Tacos-555910_a.jpg?v=638986363498870000',
  true, 100
),
(
  'a1200000-0000-4000-a101-000000000102', 'b1100000-0000-4000-a110-000000000001', 'Lenteja DIANA cuidadosamente seleccionadas (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lenteja-x500-gr-diana-500-gr-66557/p. Marca: DIANA. Lleva a casa fácil y rápido Lenteja DIANA cuidadosamente seleccionadas (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3840, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/28956011/LENTEJA-X500-GR-DIANA-500-gr-1408940_a.jpg?v=638864003230500000',
  true, 101
),
(
  'a1200000-0000-4000-a101-000000000103', 'b1100000-0000-4000-a110-000000000001', 'Azúcar MANUELITA alta pureza (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/azucar-alta-pureza-1-kg-64924/p. Marca: MANUELITA. CARACTERISTICAS Azúcar Blanca. Marca: Manuelita. Características: Sabor 100% natural, sin químicos. Almacenamiento: Consérvese en un lugar limpio, fresco y seco, después de abierto consúmase en el menor tiempo posible.',
  '🛒', 5950, 'Azúcar, panela y endulzante', 'https://exitocol.vteximg.com.br/arquivos/ids/31683068/Azucar-Alta-Pureza-1-kg-21986_a.jpg?v=638983789382800000',
  true, 102
),
(
  'a1200000-0000-4000-a101-000000000104', 'b1100000-0000-4000-a110-000000000001', 'Pastas DORIA corriente (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasta-clasica-spaghetti-x-500-gr-50578/p. Marca: DORIA. Nombre del producto: Pasta DORIA Corriente 500 Gr Características del producto: El Spaghetti es una pasta larga con múltiples y fáciles formas de preparación, perfecta para acompañar con salsas, carnes y verduras. Disfruta de un plato tradicional y n',
  '🛒', 2990, 'Pastas', 'https://exitocol.vteximg.com.br/arquivos/ids/31753517/Pasta-Clasica-Spaghetti-X-500-gr-13653_a.jpg?v=638986364723170000',
  true, 103
),
(
  'a1200000-0000-4000-a101-000000000105', 'b1100000-0000-4000-a110-000000000001', 'Harina de trigo HAZ DE OROS tradicional (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/harina-de-trigo-50356/p. Marca: HAZ DE OROS. Lleva a casa fácil y rápido Harina de trigo HAZ DE OROS tradicional (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2250, 'Harinas y mezclas para preparar', 'https://exitocol.vteximg.com.br/arquivos/ids/32873185/Harina-De-Trigo-13520_a.jpg?v=639099756168270000',
  true, 104
),
(
  'a1200000-0000-4000-a101-000000000106', 'b1100000-0000-4000-a110-000000000001', 'Lomitos de atún FRESCAMPO en agua (110.5  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomitos-de-atun-frescampo-agua-y-sal-1105-gr-3241101/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Lomitos de atún FRESCAMPO en agua (110.5 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4440, 'Enlatados y conservas', 'https://exitocol.vteximg.com.br/arquivos/ids/32275481/Lomitos-De-Atun-FRESCAMPO-Agua-y-Sal-1105-gr-3804672_a.jpg?v=639044338984930000',
  true, 105
),
(
  'a1200000-0000-4000-a101-000000000107', 'b1100000-0000-4000-a110-000000000001', 'Aceite de oliva FRESCAMPO extra virgen (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-oliva-frescampo-extra-virgen-500-ml-3224778/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite de oliva FRESCAMPO extra virgen (500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 16950, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/33502847/Aceite-Oliva-FRESCAMPO-Extra-Virgen-500-ml-3749226_a.jpg?v=639153315541330000',
  true, 106
),
(
  'a1200000-0000-4000-a101-000000000108', 'b1100000-0000-4000-a110-000000000001', 'Caldo De Gallina Desmenuzado Especias MAGGI desmenuzado (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caldo-de-gallina-desmenuzado-especias-maggi-especias-desmenuzado-90-gr-3204662/p. Marca: MAGGI. Lleva a casa fácil y rápido Caldo De Gallina Desmenuzado Especias MAGGI desmenuzado (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3840, 'Salsas, especias y condimentos', 'https://exitocol.vteximg.com.br/arquivos/ids/33502699/Caldo-De-Gallina-Desmenuzado-Especias-MAGGI-Especias-Desmenuzado-90-gr-3669641_a.jpg?v=639153314532570000',
  true, 107
),
(
  'a1200000-0000-4000-a101-000000000109', 'b1100000-0000-4000-a110-000000000001', 'Chocolate SOL pastillas de cocoa (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolate-sol-pastillas-de-cocoa-400-gr-3194334/p. Marca: SOL. Lleva a casa fácil y rápido Chocolate SOL pastillas de cocoa (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 6987, 'Café, chocolate y cremas no lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33498477/Chocolate-SOL-Pastillas-De-Cocoa-400-gr-3631704_a.jpg?v=639153205873630000',
  true, 108
),
(
  'a1200000-0000-4000-a101-000000000110', 'b1100000-0000-4000-a110-000000000001', 'Café TOSTAO tostado y molido (454  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cafe-tostao-tostado-y-molido-454-gr-3178996/p. Marca: TOSTAO. Lleva a casa fácil y rápido Café TOSTAO tostado y molido (454 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 26450, 'Café, chocolate y cremas no lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/30611642/Cafe-TOSTAO-Tostado-y-Molido-454-gr-3576787_a.jpg?v=638924426649270000',
  true, 109
),
(
  'a1200000-0000-4000-a101-000000000111', 'b1100000-0000-4000-a110-000000000001', 'Gelatina FRUTINO Precio Especial Sabores Surtidos x4 (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/precio-especial-mezc-polvo-sabores-surtido-frutino-56-gr-3162990/p. Marca: FRUTINO. Lleva a casa fácil y rápido Gelatina FRUTINO Precio Especial Sabores Surtidos x4 (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7210, 'Gelatinas en polvo', 'https://exitocol.vteximg.com.br/arquivos/ids/33064771/Precio-Especial-Mezc-Polvo-Sabores-Surtido-FRUTINO-56-gr-3541399_a.jpg?v=639118536139130000',
  true, 110
),
(
  'a1200000-0000-4000-a101-000000000112', 'b1100000-0000-4000-a110-000000000001', 'Cereal ZUCARITAS hojuelas de maíz azucaradas (610  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hojuelas-maiz-azucaradas-zucaritas-610-gr-3157053/p. Marca: ZUCARITAS. Contenido suministrado a Almacenes Éxito directamente por Kellogg''s Cereal Características Haz que tus hijos saquen el tigre que llevan dentro con Zucaritas de Cereales Kellogg’s, hecho con granos de maíz de origen natural, adicionado ',
  '🛒', 28900, 'Cereales y granolas', 'https://exitocol.vteximg.com.br/arquivos/ids/33339305/Hojuelas-Maiz-Azucaradas-ZUCARITAS-610-gr-3518883_a.jpg?v=639141283499300000',
  true, 111
),
(
  'a1200000-0000-4000-a101-000000000113', 'b1100000-0000-4000-a110-000000000001', 'Atún VAN CAMPS en aceite de oliva (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/atun-menos-acte-oliva-van-camps-180-gr-3154366/p. Marca: VAN CAMPS. Lleva a casa fácil y rápido Atún VAN CAMPS en aceite de oliva (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 15000, 'Enlatados y conservas', 'https://exitocol.vteximg.com.br/arquivos/ids/33870439/Atun-Menos-Acte-Oliva-VAN-CAMPS-180-gr-3507683_a.jpg?v=639185134885900000',
  true, 112
),
(
  'a1200000-0000-4000-a101-000000000114', 'b1100000-0000-4000-a110-000000000001', 'Aceite de girasol PREMIER multiusos (900  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-comestible-girasol-premier-900-ml-3139677/p. Marca: PREMIER. Lleva a casa fácil y rápido Aceite de girasol PREMIER multiusos (900 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14287, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/29609843/Aceite-Comestible-Girasol-PREMIER-900-ml-3452376_a.jpg?v=638906031378430000',
  true, 113
),
(
  'a1200000-0000-4000-a101-000000000115', 'b1100000-0000-4000-a110-000000000001', 'Avena En Hojuela Extracontenido QUAKER 1100  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/avena-en-hojuela-extracontenido-quaker-q1292-3133181/p. Marca: QUAKER. Lleva a casa fácil y rápido Avena En Hojuela Extracontenido QUAKER 1100 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9120, 'Avena en hojuelas y en polvo', 'https://exitocol.vteximg.com.br/arquivos/ids/29102290/Avena-En-Hojuela-Extracontenido-QUAKER-Q1292-3423348_a.jpg?v=638881203961770000',
  true, 114
),
(
  'a1200000-0000-4000-a101-000000000116', 'b1100000-0000-4000-a110-000000000001', 'Galletas DUCALES x3 tacos (315  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galleta-taco-x-3-ducales-315-gr-3126999/p. Marca: DUCALES. Lleva a casa fácil y rápido Galletas DUCALES x3 tacos (315 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9950, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/33338054/Galleta-Taco-X-3-DUCALES-315-gr-3401545_a.jpg?v=639141262252300000',
  true, 115
),
(
  'a1200000-0000-4000-a101-000000000117', 'b1100000-0000-4000-a110-000000000001', 'Aceite de girasol FRESCAMPO botella (2000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-de-girasol-frescampo-2000-ml-3126826/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite de girasol FRESCAMPO botella (2000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18940, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/30571149/Aceite-de-Girasol-FRESCAMPO-2000-ml-3400653_a.jpg?v=638923619729470000',
  true, 116
),
(
  'a1200000-0000-4000-a101-000000000118', 'b1100000-0000-4000-a110-000000000001', 'Atún BARY en aceite (104  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomos-atun-aceite-girasol-bary-160-gr-3090070/p. Marca: BARY. Lleva a casa fácil y rápido Atún BARY en aceite (104 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7470, 'Enlatados y conservas', 'https://exitocol.vteximg.com.br/arquivos/ids/31882427/Lomos-Atun-Aceite-Girasol-BARY-160-gr-3284573_a.jpg?v=638995998253030000',
  true, 117
),
(
  'a1200000-0000-4000-a101-000000000119', 'b1100000-0000-4000-a110-000000000001', 'Galletas SALTIN NOEL mix tradicional y queso mantequilla (510  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galletas-mix-saltin-noel-510-gr-3084896/p. Marca: SALTIN NOEL. Lleva a casa fácil y rápido Galletas SALTIN NOEL mix tradicional y queso mantequilla (510 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12000, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/33541054/Galletas-Mix-SALTIN-NOEL-510-gr-3266685_a.jpg?v=639154418767700000',
  true, 118
),
(
  'a1200000-0000-4000-a101-000000000120', 'b1100000-0000-4000-a110-000000000001', 'Aceite FRESCAMPO vegetal multiusos (900  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-vegetal-frescampo-900-ml-3082930/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite FRESCAMPO vegetal multiusos (900 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6950, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/33173635/Aceite-Vegetal-FRESCAMPO-900-ml-3257072_a.jpg?v=639124918493900000',
  true, 119
),
(
  'a1200000-0000-4000-a101-000000000121', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado BIMBO blanco suave esponjoso (730  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-blanco-suave-esponjoso-730-gr-3202794/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO blanco suave esponjoso (730 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 8860, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877733/Pan-BIMBO-BLANCO-SUAVE-ESPONJOSO-730-gr-3663322_a.jpg?v=639186166841270000',
  true, 120
),
(
  'a1200000-0000-4000-a101-000000000122', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado BIMBO blanco suave esponjoso (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-blanco-suave-esponjoso-600-gr-3202795/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO blanco suave esponjoso (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7700, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877734/Pan-BIMBO-BLANCO-SUAVE-ESPONJOSO-600-gr-3663323_a.jpg?v=639186166856030000',
  true, 121
),
(
  'a1200000-0000-4000-a101-000000000123', 'b1100000-0000-4000-a110-000000000001', 'Pan Perro BIMBO x6und (205  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-perro-medias-noches-x6-unidades-616697/p. Marca: BIMBO. Características Sin grasa Trans, fuente de hierro.',
  '🍞', 4280, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877638/Pan-Perro-Medias-Noches-X6-Unidades-529159_a.jpg?v=639186163690000000',
  true, 122
),
(
  'a1200000-0000-4000-a101-000000000124', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado FRESCAMPO blanco (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-frescampo-450-gr-3252766/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Pan tajado FRESCAMPO blanco (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 2990, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33797052/Pan-FRESCAMPO-450-gr-3848252_a.jpg?v=639176974543570000',
  true, 123
),
(
  'a1200000-0000-4000-a101-000000000125', 'b1100000-0000-4000-a110-000000000001', 'Pan BIMBO blanco masa madre (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-blanco-artes-mm-1p-500g-bolsa-bimbo-pan-blanco-masa-madre-500-gr-3245095/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan BIMBO blanco masa madre (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 6600, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877753/Pan-Blanco-Artes-MM-1p-500g-BOLSA-BIMBO-PAN-BLANCO-MASA-MADRE-500-gr-3821752_a.jpg?v=639186167065900000',
  true, 124
),
(
  'a1200000-0000-4000-a101-000000000126', 'b1100000-0000-4000-a110-000000000001', 'Pan  PAN ARTESANO artesano (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-artesano-500-gr-3244886/p. Marca: PAN ARTESANO. Lleva a casa fácil y rápido Pan PAN ARTESANO artesano (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7160, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/34056314/Pan-BIMBO-Artesano-500-gr-3821260_a.jpg?v=639196370000530000',
  true, 125
),
(
  'a1200000-0000-4000-a101-000000000127', 'b1100000-0000-4000-a110-000000000001', 'Pan COMAPAN blanco extralargo (520  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-comapan-blanco-extra-largo-520-gr-3237528/p. Marca: COMAPAN. Lleva a casa fácil y rápido Pan COMAPAN blanco extralargo (520 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7760, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/32094325/Pan-COMAPAN-BLANCO-EXTRA-LARGO-520-gr-3790182_a.jpg?v=639021225120300000',
  true, 126
),
(
  'a1200000-0000-4000-a101-000000000128', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado EXITO MARCA PROPIA mantequilla (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-tajado-mantequilla-exito-marca-propia-500-gr-3087762/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Pan tajado EXITO MARCA PROPIA mantequilla (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7080, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/27599335/Pan-Tajado-Mantequilla-EXITO-MARCA-PROPIA-500-gr-3276283_a.jpg?v=638830078120030000',
  true, 127
),
(
  'a1200000-0000-4000-a101-000000000129', 'b1100000-0000-4000-a110-000000000001', 'Ponque RAMO Tradicional (230  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ponque-ramo-tradicional-885833/p. Marca: RAMO. Lleva a casa fácil y rápido Ponque RAMO Tradicional (230 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 6900, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/29723195/Ponque-Ramo-Tradicional-1209602_a.jpg?v=638912269957570000',
  true, 128
),
(
  'a1200000-0000-4000-a101-000000000130', 'b1100000-0000-4000-a110-000000000001', 'Pan Blandito 10und  FRESCAMPO 420  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-blandito-10und-850017/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Pan Blandito 10und FRESCAMPO 420 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5300, 'Panadería fresca y artesanal', 'https://exitocol.vteximg.com.br/arquivos/ids/33053621/Pan-Blandito-10und-1151747_a.jpg?v=639117654187800000',
  true, 129
),
(
  'a1200000-0000-4000-a101-000000000131', 'b1100000-0000-4000-a110-000000000001', 'Pan Tajado GUADALUPE Integral Extralargo (570  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-integral-extralargo-827180/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Pan Tajado GUADALUPE Integral Extralargo (570 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 6400, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877692/PAN-INTEGRAL-EXTRALARGO-222429_a.jpg?v=639186166303500000',
  true, 130
),
(
  'a1200000-0000-4000-a101-000000000132', 'b1100000-0000-4000-a110-000000000001', 'Pan Tajado GUADALUPE Mantequilla (550  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-mantequilla-largo-827177/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Pan Tajado GUADALUPE Mantequilla (550 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5752, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877691/PAN-MANTEQUILLA-LARGO-222411_a.jpg?v=639186166288700000',
  true, 131
),
(
  'a1200000-0000-4000-a101-000000000133', 'b1100000-0000-4000-a110-000000000001', 'Chocoramo Barrita RAMO x5und  (200  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocobarra-5-und-770619/p. Marca: RAMO. Lleva a casa fácil y rápido Chocoramo Barrita RAMO x5und (200 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 10850, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/31961447/CHOCOBARRA-5-UND-837630_a.jpg?v=639003095812100000',
  true, 132
),
(
  'a1200000-0000-4000-a101-000000000134', 'b1100000-0000-4000-a110-000000000001', 'Pan Hamburguesa BIMBO Con Anjonjolí x4und (210  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-hamburguesa-bimbollos-210-gr-616699/p. Marca: BIMBO. Características Una vez abierto consuma en el menor tiempo posible. Mantenga en lugar limpio, fresco y seco, alejado de olores fuertes o penetrantes. Pan Hamburguesa con Ajonjolí Harina de trigo fortificada, agua, azucar, levadura, sal refinada, glu',
  '🍞', 4380, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877640/Pan-Hamburguesa-Bimbollos-210-gr-529161_a.jpg?v=639186163703270000',
  true, 133
),
(
  'a1200000-0000-4000-a101-000000000135', 'b1100000-0000-4000-a110-000000000001', 'Tostadas GUADALUPE Media Luna Integral (280  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostada-media-luna-integral-616168/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Tostadas GUADALUPE Media Luna Integral (280 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7248, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877690/TOSTADA-MEDIA-LUNA-INTEGRAL-524014_a.jpg?v=639186166277670000',
  true, 134
),
(
  'a1200000-0000-4000-a101-000000000136', 'b1100000-0000-4000-a110-000000000001', 'Tostadas GUADALUPE Media Luna Mantequilla (280  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostada-media-luna-mante-615362/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Tostadas GUADALUPE Media Luna Mantequilla (280 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7160, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877688/TOSTADA-MEDIA-LUNA-MANTE-301063_a.jpg?v=639186166266900000',
  true, 135
),
(
  'a1200000-0000-4000-a101-000000000137', 'b1100000-0000-4000-a110-000000000001', 'Ponqué CHOCORAMO x5und (325  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ponque-cubiert-de-choco-x5-und-270355/p. Marca: CHOCORAMO. Lleva a casa fácil y rápido Ponqué CHOCORAMO x5und (325 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 14950, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/31962151/PONQUE-CUBIERT-DE-CHOCO-X5-UND-1558824_a.jpg?v=639003106663970000',
  true, 136
),
(
  'a1200000-0000-4000-a101-000000000138', 'b1100000-0000-4000-a110-000000000001', 'Pan Perro BIMBO x6und (405  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-super-perro-x6-unidades-267093/p. Marca: BIMBO. Pan Super Perro X6 Unidades Características Una vez abierto consuma en el menor tiempo posible. Mantenga en lugar limpio, fresco y seco, alejado de olores fuertes o penetrantes. Pan super perro con ajonjolí. Harina de trigo fortificada, agua, azucar, lev',
  '🍞', 8390, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877632/Pan-Super-Perro-X6-Unidades-236948_a.jpg?v=639186163630470000',
  true, 137
),
(
  'a1200000-0000-4000-a101-000000000139', 'b1100000-0000-4000-a110-000000000001', 'Pan Tajado Bimbo VITAL 100% Natural Fruticereal (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-tajado-fruticereal-500-gr-93998/p. Marca: VITAL. Lleva a casa fácil y rápido Pan Tajado Bimbo VITAL 100% Natural Fruticereal (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 11300, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877626/Pan-Tajado-Fruticereal-500-gr-691618_a.jpg?v=639186163575330000',
  true, 138
),
(
  'a1200000-0000-4000-a101-000000000140', 'b1100000-0000-4000-a110-000000000001', 'Ponqué CHOCORAMO Mini x20und (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ponque-chocorramo-mini-x-20-unidades-25723/p. Marca: CHOCORAMO. CARACTERISTICAS Chocoramo mini. Tajaditas de ponqué cubiertas con chocolate. Contiene 20 unidades. Después de abierto consérvese en un lugar fresco y seco.',
  '🍞', 18500, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/31960392/Ponque-Chocorramo-Mini-X-20-Unidades-753611_a.jpg?v=639003086083270000',
  true, 139
),
(
  'a1200000-0000-4000-a101-000000000141', 'b1100000-0000-4000-a110-000000000001', 'Tostadas BIMBO Mantequilla (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostadas-mantequilla-x-20-unidades-4733/p. Marca: BIMBO. Lleva a casa fácil y rápido Tostadas BIMBO Mantequilla (300 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 9400, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877666/Tostadas-Mantequilla-X-20-Unidades-239453_a.jpg?v=639186164935800000',
  true, 140
),
(
  'a1200000-0000-4000-a101-000000000142', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado FRESCAMPO mantequilla (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-frescampo-450-gr-3252767/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Pan tajado FRESCAMPO mantequilla (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 3640, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33797053/Pan-FRESCAMPO-450-gr-3848253_a.jpg?v=639176974555530000',
  true, 141
),
(
  'a1200000-0000-4000-a101-000000000143', 'b1100000-0000-4000-a110-000000000001', 'Pan BIMBO integral masa madre (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-integral-artes-mm-1p-500g-bolsa-bimbo-pan-integral-masa-madre-500-gr-3244884/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan BIMBO integral masa madre (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7704, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877754/Pan-Integral-Artes-MM-1p-500g-BOLSA-BIMBO-PAN-INTEGRAL-MASA-MADRE-500-gr-3821258_a.jpg?v=639186167076800000',
  true, 142
),
(
  'a1200000-0000-4000-a101-000000000144', 'b1100000-0000-4000-a110-000000000001', 'Láminas SANISSIMO Maiz Horneadas Salmas (144  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/laminas-sanissimo-maiz-horneadas-salmas-144-gr-3233512/p. Marca: SANISSIMO. Lleva a casa fácil y rápido Láminas SANISSIMO Maiz Horneadas Salmas (144 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 13950, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877743/Laminas-SANISSIMO-Maiz-Horneadas-Salmas-144-gr-3781588_a.jpg?v=639186166985630000',
  true, 143
),
(
  'a1200000-0000-4000-a101-000000000145', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado BIMBO dorado (460  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-tajado-dorado-460-gr-3223191/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO dorado (460 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 8390, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33883720/Pan-BIMBO-Tajado-Dorado-460-gr-3743913_a.jpg?v=639186534203400000',
  true, 144
),
(
  'a1200000-0000-4000-a101-000000000146', 'b1100000-0000-4000-a110-000000000001', 'Tostada BIMBO Integral banano uvas pasas ciruela (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostada-bimbo-integral-banano-uvas-pasas-cir-120-gr-3216049/p. Marca: BIMBO. Lleva a casa fácil y rápido Tostada BIMBO Integral banano uvas pasas ciruela (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5140, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33883718/Tostada-BIMBO-Integral-Banano-Uvas-Pasas-Cir-120-gr-3715663_a.jpg?v=639186534184770000',
  true, 145
),
(
  'a1200000-0000-4000-a101-000000000147', 'b1100000-0000-4000-a110-000000000001', 'Pan tajado BIMBO blanco suave esponjoso (350  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-blanco-suave-esponjoso-350-gr-3202793/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO blanco suave esponjoso (350 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5080, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877731/Pan-BIMBO-BLANCO-SUAVE-ESPONJOSO-350-gr-3663321_a.jpg?v=639186166820270000',
  true, 146
),
(
  'a1200000-0000-4000-a101-000000000148', 'b1100000-0000-4000-a110-000000000001', 'Tostadas TAEQ de arroz con quinua (70  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostadas-de-arroz-con-quinua-taeq-70-gr-3079104/p. Marca: TAEQ. Contenido suministrado a Almacenes Éxito directamente por TAEQ Tostadas arroz Características Tostadas libres de guten, buena fuente de fibra y de proteína. Beneficios Libres de gluten, el gluten es un conjunto de proteínas responsables de ge',
  '🍞', 5200, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/29594144/Tostadas-De-Arroz-Con-Quinua-TAEQ-70-gr-3239904_a.jpg?v=638902742046900000',
  true, 147
),
(
  'a1200000-0000-4000-a101-000000000149', 'b1100000-0000-4000-a110-000000000001', 'Mogolla SANTA CLARA Tricereal miel (520  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/mogolla-tricereal-miel-santa-clara-520-gramo-3000718/p. Marca: SANTA CLARA. Lleva a casa fácil y rápido Mogolla SANTA CLARA Tricereal miel (520 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 8790, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/26866885/MOGOLLA-TRICEREAL-MIEL-SANTA-CLARA-520-Gramo-3001174_a.jpg?v=638756670432130000',
  true, 148
),
(
  'a1200000-0000-4000-a101-000000000150', 'b1100000-0000-4000-a110-000000000001', 'Pan Tajado BIMBO 100% Integral  (650  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-tajado-integral-x650-gramos-917968/p. Marca: BIMBO. Características Pan Integral que contiene buena fuente de fibra, libre de grasas Trans y buena fuente de proteína.',
  '🍞', 9440, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877662/Pan-Tajado-Integral-X650-Gramos-225710_a.jpg?v=639186164898070000',
  true, 149
),
(
  'a1200000-0000-4000-a101-000000000151', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico EKONO triple hoja (396  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-higienico-ekono-triple-hoja-396-mts-3226861/p. Marca: EKONO. Lleva a casa fácil y rápido Papel higiénico EKONO triple hoja (396 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14800, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32753065/Papel-Higienico-EKONO-Triple-Hoja-396-mts-3756865_a.jpg?v=639089252184930000',
  true, 150
),
(
  'a1200000-0000-4000-a101-000000000152', 'b1100000-0000-4000-a110-000000000001', 'Detergente en polvo FAB ultra flash (5000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-pvo-ultra-fab-5000-gr-3134948/p. Marca: FAB. Contenido suministrado a Almacenes Éxito directamente por FAB Detergente Polvo Ultra Características Despercude y remueve manchas de grasa y comida, tiene bio enzimas rápidas e inteligentes, con capsulas de perfume duraderas. Maxima Limpieza y cuidad',
  '🛒', 55600, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33490103/Detergente-Pvo-Ultra-FAB-5000-gr-3430343_a.jpg?v=639150774060270000',
  true, 151
),
(
  'a1200000-0000-4000-a101-000000000153', 'b1100000-0000-4000-a110-000000000001', 'Detergente en polvo FAB ultra flash (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-pvo-ultra-fab-4000-gr-3134947/p. Marca: FAB. Contenido suministrado a Almacenes Éxito directamente por FAB Detergente Polvo Ultra Características Despercude y remueve manchas de grasa y comida, tiene bio enzimas rápidas e inteligentes, con capsulas de perfume duraderas. Maxima Limpieza y cuidad',
  '🛒', 47850, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33490095/Detergente-Pvo-Ultra-FAB-4000-gr-3430342_a.jpg?v=639150774017800000',
  true, 152
),
(
  'a1200000-0000-4000-a101-000000000154', 'b1100000-0000-4000-a110-000000000001', 'Suavizante SUAVITEL cuidado superior fresca primavera (5600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suave-primaveral-bipack-suavitel-61028800-3090805/p. Marca: SUAVITEL. Contenido suministrado a Almacenes Éxito directamente por SUAVITEL Suavizante Suavitel Cuidado Superior Fresca Primavera 2.8L x2und Características Cuida de tus prendas favoritas utilizando el Suavizante de Ropa Suavitel Cuidado Superio',
  '🛒', 47850, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33640364/Suave-Primaveral-Bipack-SUAVITEL-61028800-3287702_a.jpg?v=639161801928230000',
  true, 153
),
(
  'a1200000-0000-4000-a101-000000000155', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico FAMILIA expert 4 hojas x12und (300  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-higienico-expert-familia-300-mts-3053625/p. Marca: FAMILIA. Lleva a casa fácil y rápido Papel higiénico FAMILIA expert 4 hojas x12und (300 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 23950, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32752249/Papel-Higienico-Expert-FAMILIA-300-mts-3153915_a.jpg?v=639089246086400000',
  true, 154
),
(
  'a1200000-0000-4000-a101-000000000156', 'b1100000-0000-4000-a110-000000000001', 'Blanqueador EKONO pureza cítrica (2000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/blanqueador-sin-fragancia-ekono-sin-ref-3016130/p. Marca: EKONO. Lleva a casa fácil y rápido Blanqueador EKONO pureza cítrica (2000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3100, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33873607/Blanqueador-sin-fragancia-EKONO-SIN-REF-3023705_a.jpg?v=639185383323700000',
  true, 155
),
(
  'a1200000-0000-4000-a101-000000000157', 'b1100000-0000-4000-a110-000000000001', 'Detergente líquido ARIEL limpieza profunda (3700  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-na-ariel-80351113-3001158/p. Marca: ARIEL. Contenido suministrado a Almacenes Éxito directamente por P&G Detergente Líquido Doble Poder Concentrado 3,7L Características Ariel Doble Poder Concentrado remueve manchas difíciles y de sudor. Limpia cuidando tu ropa blanca y de color. ¡Adquierelo ya!',
  '🛒', 63490, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33905848/DETERGENTE-NA-ARIEL-80351113-3001782_a.jpg?v=639189507528900000',
  true, 156
),
(
  'a1200000-0000-4000-a101-000000000158', 'b1100000-0000-4000-a110-000000000001', 'Lavaplatos líquido AXION limón (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaplatos-liquido-limon-1500-ml-853875/p. Marca: AXION. Contenido suministrado a Almacenes Éxito directamente por AXION Lavaplatos Liquido Axion Limon 1.5L Características Deja impecable tu vajilla con el Lavaplatos Líquido Axion Limón, su presentación de 1.1 L es ideal para ti y tu familia. Este Lavaloz',
  '🛒', 14760, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/33448781/Lavaplatos-Liquido-Limon-1500-ml-1157214_a.jpg?v=639148775402270000',
  true, 157
),
(
  'a1200000-0000-4000-a101-000000000159', 'b1100000-0000-4000-a110-000000000001', 'Jabón de barra REY original (900  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/oferta-jabon-azul-900-gr-792534/p. Marca: REY. Lleva a casa fácil y rápido Jabón de barra REY original (900 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9110, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/32665774/Oferta-Jabon-Azul-900-gr-263056_a.jpg?v=639082472685770000',
  true, 158
),
(
  'a1200000-0000-4000-a101-000000000160', 'b1100000-0000-4000-a110-000000000001', 'Detergente en polvo ARIEL triple poder (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-en-polvo-ariel-regular-4-kg-563348/p. Marca: ARIEL. Contenido suministrado a Almacenes Éxito directamente por ARIEL Ariel Triple Poder Detergente en Polvo de 4kg Beneficios REMUEVE MANCHAS Y OLORES DIFÍCILES: El detergente en polvo Ariel Triple Poder remueve manchas de sudor y olores difíciles ',
  '🛒', 40180, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33905491/Detergente-En-Polvo-Ariel-Regular-4-kg-802468_a.jpg?v=639189505328030000',
  true, 159
),
(
  'a1200000-0000-4000-a101-000000000161', 'b1100000-0000-4000-a110-000000000001', 'Detergente líquido BLANCOX protección color limpieza profunda (3800  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-regular-x-3800-ml-333497/p. Marca: BLANCOX. Lleva a casa fácil y rápido Detergente líquido BLANCOX protección color limpieza profunda (3800 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 36640, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/31164279/Detergente-regular-X-3800-ml-1696433_a.jpg?v=638956192165870000',
  true, 160
),
(
  'a1200000-0000-4000-a101-000000000162', 'b1100000-0000-4000-a110-000000000001', 'Toallas de cocina EKONO desechables (50  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/toalla-cocina-doble-hoja-x-50-gr-208591/p. Marca: EKONO. CARACTERISTICAS Toalla de cocina 1 rollo con 45 hojas dobles. Tamaño de la toalla 21 x 22.4 cm. CONSERVACION: Consérvese en un lugar limpio, fresco y ventilado, retirado de los rayos directos del sol y fuera del alcance de los niños y mascotas. INST',
  '🛒', 1750, 'Servilletas y toallas de cocina', 'https://exitocol.vteximg.com.br/arquivos/ids/33516600/Toalla-Cocina-Doble-Hoja-X-50-gr-598300_a.jpg?v=639154090442470000',
  true, 161
),
(
  'a1200000-0000-4000-a101-000000000163', 'b1100000-0000-4000-a110-000000000001', 'Detergente en polvo ARIEL triple poder (5000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-regular-p3-llv5-kg-146968/p. Marca: ARIEL. Contenido suministrado a Almacenes Éxito directamente por ARIEL Ariel Triple Poder Detergente en Polvo de 5kg Beneficios REMUEVE MANCHAS Y OLORES DIFÍCILES: El detergente en polvo Ariel Triple Poder remueve manchas de sudor y olores difíciles de la rop',
  '🛒', 43610, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33905523/Detergente-Regular-P3-Llv5-kg-1413539_a.jpg?v=639189505582730000',
  true, 162
),
(
  'a1200000-0000-4000-a101-000000000164', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico ROSAL triple hoja XG x30 rollos (750  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/precio-especial-papel-rosal-higienico-triple-hoja-xg-750-mts-3252522/p. Marca: ROSAL. Lleva a casa fácil y rápido Papel higiénico ROSAL triple hoja XG x30 rollos (750 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 31900, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/33533741/Precio-Especial-Papel-ROSAL-Higienico-Triple-Hoja-Xg-750-mts-3847638_a.jpg?v=639154364766800000',
  true, 163
),
(
  'a1200000-0000-4000-a101-000000000165', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico SCOTT cuidado completo (540  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-scott-higienico-triple-hoja-cuidado-540-mts-3219038/p. Marca: SCOTT. Contenido suministrado a Almacenes Éxito directamente por Huggies Papel Higiénico Scott Cuidado Completo Triple Hoja - 18R Características Nuevo Papel Higiénico Scott® Cuidado Completo ahora con más metros por rollo, te brinda una ',
  '🛒', 24750, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32753053/Papel-SCOTT-Higienico-Triple-Hoja-Cuidado-540-mts-3727036_a.jpg?v=639089252093700000',
  true, 164
),
(
  'a1200000-0000-4000-a101-000000000166', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico ROSAL triple hoja x6 rollos (150  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-rosal-higinico-triple-hoja-xg-ultra-6-unidad-3186685/p. Marca: ROSAL. Lleva a casa fácil y rápido Papel higiénico ROSAL triple hoja x6 rollos (150 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4712, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/33498278/Papel-ROSAL-HIGINICO-TRIPLE-HOJA-XG-ULTRA-6-UNIDAD-3606956_a.jpg?v=639153203805930000',
  true, 165
),
(
  'a1200000-0000-4000-a101-000000000167', 'b1100000-0000-4000-a110-000000000001', 'Detergente líquido EXITO MARCA PROPIA aroma floral (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-liquido-floral-exito-marca-propia-3000-ml-3150951/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Detergente líquido EXITO MARCA PROPIA aroma floral (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13900, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33550325/Detergente-Liquido-Floral-EXITO-MARCA-PROPIA-3000-ml-3491790_a.jpg?v=639154853419470000',
  true, 166
),
(
  'a1200000-0000-4000-a101-000000000168', 'b1100000-0000-4000-a110-000000000001', 'Suavizante AROMATEL fragancia floral x2und (1800  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suavizante-floral-x-2-unds-aromatel-1800-ml-3150138/p. Marca: AROMATEL. Contenido suministrado a Almacenes Éxito directamente por AROMATEL Suavizante Aromatel Floral 10x más Fragancia OFERTAX2 X900ML Características El Nuevo Aromatel 10X aroma Floral, con una fragancia 10 veces más intensa y 10 veces más ',
  '🛒', 13055, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33490165/Suavizante-Floral-X-2-Unds-AROMATEL-1800-ml-3488778_a.jpg?v=639150774425930000',
  true, 167
),
(
  'a1200000-0000-4000-a101-000000000169', 'b1100000-0000-4000-a110-000000000001', 'Bolsa para basura EKONO plástico negro 65x90 cm Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bolsa-de-basura-negra-ekono-sin-ref-3142198/p. Marca: EKONO. Lleva a casa fácil y rápido Bolsa para basura EKONO plástico negro 65x90 cm. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2050, 'Implementos para la limpieza', 'https://exitocol.vteximg.com.br/arquivos/ids/31822499/Bolsa-De-Basura-Negra-EKONO-SIN-REF-3462329_a.jpg?v=638990956423000000',
  true, 168
),
(
  'a1200000-0000-4000-a101-000000000170', 'b1100000-0000-4000-a110-000000000001', 'Blanqueador CLOROX pack limpia y desinfecta (2260  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/blanqueador-super-ahorro-clorox-628176-3139485/p. Marca: CLOROX. Lleva a casa fácil y rápido Blanqueador CLOROX pack limpia y desinfecta (2260 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8550, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33404765/Blanqueador-Super-Ahorro-CLOROX-628176-3451457_a.jpg?v=639143671480400000',
  true, 169
),
(
  'a1200000-0000-4000-a101-000000000171', 'b1100000-0000-4000-a110-000000000001', 'Jabón de barra REY líquido original (2  lt) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jabon-barra-liquido-original-rey-2-lt-3135839/p. Marca: REY. Lleva a casa fácil y rápido Jabón de barra REY líquido original (2 lt). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22250, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/32668350/Jabon-Barra-Liquido-Original-REY-2-lt-3433700_a.jpg?v=639082505957200000',
  true, 170
),
(
  'a1200000-0000-4000-a101-000000000172', 'b1100000-0000-4000-a110-000000000001', 'Suavizante DOWNY Adorable (900  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suavizante-de-ropa-concentrado-exp-downy-80734492-3113396/p. Marca: DOWNY. Contenido suministrado a Almacenes Éxito directamente por DOWNY Suavizante DOWNY adorable (900 ml) Características ¡Vístete de perfume todo el día con el suavizante downy! El suavizante downy adorable tiene un perfume sofisticado f',
  '🛒', 29750, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33906246/Suavizante-De-Ropa-Concentrado-Exp-DOWNY-80734492-3354381_a.jpg?v=639189509613500000',
  true, 171
),
(
  'a1200000-0000-4000-a101-000000000173', 'b1100000-0000-4000-a110-000000000001', 'Lavaloza EKONO en crema aroma a limón (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaloza-ekono-limon-ekono-sin-ref-3110753/p. Marca: EKONO. Lleva a casa fácil y rápido Lavaloza EKONO en crema aroma a limón (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2750, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/32031840/Lavaloza-Ekono-Limon-EKONO-Sin-Ref-3343468_a.jpg?v=639015804465400000',
  true, 172
),
(
  'a1200000-0000-4000-a101-000000000174', 'b1100000-0000-4000-a110-000000000001', 'Papel higiénico SUAVE triple hoja x12 rollos (384  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-higienico-triple-hoja-suave-gold-soft-care-384-mts-3103604/p. Marca: SUAVE. Lleva a casa fácil y rápido Papel higiénico SUAVE triple hoja x12 rollos (384 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 29900, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32752818/Papel-Higienico-Triple-Hoja-SUAVE-GOLD-SOFT-CARE-384-mts-3333394_a.jpg?v=639089249654700000',
  true, 173
),
(
  'a1200000-0000-4000-a101-000000000175', 'b1100000-0000-4000-a110-000000000001', 'Bolsa para basura EKONO papelera rollo 43x48 cm Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bolsa-basura-43x48-papelera-ekono-sin-ref-3039615/p. Marca: EKONO. Lleva a casa fácil y rápido Bolsa para basura EKONO papelera rollo 43x48 cm. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2200, 'Implementos para la limpieza', 'https://exitocol.vteximg.com.br/arquivos/ids/31822390/Bolsa-Basura-43x48-Papelera-EKONO-Sin-REF-3101013_a.jpg?v=638990954965230000',
  true, 174
),
(
  'a1200000-0000-4000-a101-000000000176', 'b1100000-0000-4000-a110-000000000001', 'Lavaloza líquido AXION limón (2300  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaplatos-liquido-axion-61017463-3033623/p. Marca: AXION. Contenido suministrado a Almacenes Éxito directamente por PALMOLIVE Lavaplatos Liquido Axion Limon 2.3L Características Deja tus platos rechinando de limpio gracias al lavaplatos líquido Axion Limón para trastes limpios en menos tiempo y esfuerzo.',
  '🛒', 26700, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/33449090/Lavaplatos-Liquido-AXION-61017463-3080212_a.jpg?v=639148776801470000',
  true, 175
),
(
  'a1200000-0000-4000-a101-000000000177', 'b1100000-0000-4000-a110-000000000001', 'Lavaloza  LOZA CREM líquido cuida las manos (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaloza-doypack-limon-963935/p. Marca: LOZA CREM. Lleva a casa fácil y rápido Lavaloza LOZA CREM líquido cuida las manos (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 15400, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/32031058/Lavaloza-Doypack-Limon-1344808_a.jpg?v=639015796816470000',
  true, 176
),
(
  'a1200000-0000-4000-a101-000000000178', 'b1100000-0000-4000-a110-000000000001', 'Lavaplatos en crema AXION limón (900  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/axion-limon-2-unds-p-especial-x-450-gr-675540/p. Marca: AXION. Contenido suministrado a Almacenes Éxito directamente por AXION Lavaplatos en Crema Axion Limon 450g x 2und Características Mantén una higiene impecable en tu cocina con el Lavaplatos en Crema Axion Limón, su presentación de dos unidades por 4',
  '🛒', 14100, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/33448765/Axion-Limon-2-Unds-P-Especial-X-450-gr-441781_a.jpg?v=639148775328230000',
  true, 177
),
(
  'a1200000-0000-4000-a101-000000000179', 'b1100000-0000-4000-a110-000000000001', 'Suavizante DERSA con cápsulas de fragancia (4000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suavizante-caps-fraganci-dersa-sin-ref-666427/p. Marca: DERSA. Lleva a casa fácil y rápido Suavizante DERSA con cápsulas de fragancia (4000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 29200, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33657702/Suavizante-Caps-Fraganci-DERSA-SIN-REF-833751_a.jpg?v=639162659907870000',
  true, 178
),
(
  'a1200000-0000-4000-a101-000000000180', 'b1100000-0000-4000-a110-000000000001', 'Blanqueador CLOROX gel lavanda (1000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/blanqueador-power-gel-lavanda-x-1000-ml-651813/p. Marca: CLOROX. Contenido suministrado a Almacenes Éxito directamente por Clorox Blanqueador en Gel Clorox Lavanda 1 lt Características Blanqueador en Gel Clorox 5 en 1 con aroma a lavanda: Limpia, desinfecta, elimina olores, desengrasa y remueve moho con p',
  '🛒', 9770, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/32030838/Blanqueador-Power-Gel-Lavanda-X-1000-ml-566445_a.jpg?v=639015795204330000',
  true, 179
),
(
  'a1200000-0000-4000-a101-000000000181', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas FRITO LAY surtidos (586  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/surtido-mega-lonchera-frito-lay-586-gr-3090203/p. Marca: FRITO LAY. Lleva a casa fácil y rápido Pasabocas FRITO LAY surtidos (586 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18200, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33267909/Surtido-Mega-Lonchera-FRITO-LAY-586-gr-3285022_a.jpg?v=639131827328070000',
  true, 180
),
(
  'a1200000-0000-4000-a101-000000000182', 'b1100000-0000-4000-a110-000000000001', 'Rosquitas SANISSIMO con chía quinua (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/rosquitas-sanissimo-sanissimo-120-gr-3071552/p. Marca: SANISSIMO. Lleva a casa fácil y rápido Rosquitas SANISSIMO con chía quinua (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14850, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33877715/Rosquitas-Sanissimo-SANISSIMO-120-gr-3210263_a.jpg?v=639186166586000000',
  true, 181
),
(
  'a1200000-0000-4000-a101-000000000183', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas DORITOS megaqueso (200  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-maiz-queso-doritos-200-gr-3027722/p. Marca: DORITOS. Lleva a casa fácil y rápido Pasabocas DORITOS megaqueso (200 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7360, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33178218/Pasabocas-Maiz-Queso-DORITOS-200-gr-3055858_a.jpg?v=639125431284930000',
  true, 182
),
(
  'a1200000-0000-4000-a101-000000000184', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA receta clásica alitas BBQ (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-receta-clasica-alitas-bbq-tamano-familiar-323230/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA receta clásica alitas BBQ (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9600, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172356/Papa-Receta-Clasica-Alitas-Bbq-Tamano-Familiar-609361_a.jpg?v=639124897515830000',
  true, 183
),
(
  'a1200000-0000-4000-a101-000000000185', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA receta clásica sal marina (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-receta-clasica-natural-tamano-familiar-323227/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA receta clásica sal marina (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172353/Papa-Receta-Clasica-Natural-Tamano-Familiar-609267_a.jpg?v=639124897499000000',
  true, 184
),
(
  'a1200000-0000-4000-a101-000000000186', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA de pollo (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-clasica-de-pollo-pqt-x-12-unids-244458/p. Marca: MARGARITA. Características: Papas fritas sabor a pollo margarita fruto lay 12 unidades. Papas seleccionadas,aceite vegetal,sal con sabor a pollo (sal,anticompactante (maltodextrina),sabor artificial,azúcar y resaltador de sabor (glutamanato monosódico)',
  '🛒', 17815, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172345/Papa-Clasica-De-Pollo-Pqt-X-12-Unids-391202_a.jpg?v=639124897435930000',
  true, 185
),
(
  'a1200000-0000-4000-a101-000000000187', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA de pollo (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-familiar-pollo-172445/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA de pollo (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6590, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172403/papa-familiar-pollo-1508926_a.jpg?v=639124899991500000',
  true, 186
),
(
  'a1200000-0000-4000-a101-000000000188', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA de limón (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-familiar-limon-172443/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA de limón (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5512, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172397/papa-familiar-limon-1508924_a.jpg?v=639124899958500000',
  true, 187
),
(
  'a1200000-0000-4000-a101-000000000189', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA de limón (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-clasica-de-limon-pqt-x-12-unids-60914/p. Marca: MARGARITA. Papa Clasica De Limon Pqt X 12 Unids Características Papas limón pack económico margarita. Almacenamiento: mantener en un lugar fresco y seco.',
  '🛒', 17640, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172339/Papa-Clasica-De-Limon-Pqt-X-12-Unids-20431_a.jpg?v=639124897402530000',
  true, 188
),
(
  'a1200000-0000-4000-a101-000000000190', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA caramelizada (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-margarita-caramelizada-120-gr-3183750/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA caramelizada (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33498220/Papas-MARGARITA-CARAMELIZADA-120-gr-3594318_a.jpg?v=639153203543600000',
  true, 189
),
(
  'a1200000-0000-4000-a101-000000000191', 'b1100000-0000-4000-a110-000000000001', 'Papas SUPER RICAS fritas fosforitos (160  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-fritas-fosforitos-super-ricas-160-gr-3148485/p. Marca: SUPER RICAS. Lleva a casa fácil y rápido Papas SUPER RICAS fritas fosforitos (160 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9130, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/32133639/Papas-Fritas-Fosforitos-SUPER-RICAS-160-gr-3483131_a.jpg?v=639023536351430000',
  true, 190
),
(
  'a1200000-0000-4000-a101-000000000192', 'b1100000-0000-4000-a110-000000000001', 'Papas MONTE ROJO de BBQ (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-bbq-dulce-monte-rojo-100-gr-3133769/p. Marca: MONTE ROJO. Lleva a casa fácil y rápido Papas MONTE ROJO de BBQ (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6900, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/32825213/Papas-Bbq-Dulce-MONTE-ROJO-100-gr-3425743_a.jpg?v=639095112746900000',
  true, 191
),
(
  'a1200000-0000-4000-a101-000000000193', 'b1100000-0000-4000-a110-000000000001', 'Frutos secos LA ESPECIAL nueces, almendra, marañón y maní (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-mezcla-nueces-la-especial-400-gr-3076068/p. Marca: LA ESPECIAL. Lleva a casa fácil y rápido Frutos secos LA ESPECIAL nueces, almendra, marañón y maní (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 24450, 'Nueces, pistachos y frutos secos', 'https://exitocol.vteximg.com.br/arquivos/ids/32133271/Pasabocas-Mezcla-Nueces-LA-ESPECIAL-400-gr-3228804_a.jpg?v=639023532334330000',
  true, 192
),
(
  'a1200000-0000-4000-a101-000000000194', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas DETODITO pasaboca (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasaboca-detodito-mix-detodito-165-gr-3062382/p. Marca: DETODITO. Lleva a casa fácil y rápido Pasabocas DETODITO pasaboca (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8075, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172696/Pasaboca-Detodito-Mix-DETODITO-165-gr-3177660_a.jpg?v=639124902827230000',
  true, 193
),
(
  'a1200000-0000-4000-a101-000000000195', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas DETODITO de BBQ (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-bbq-detodito-165-gr-3060364/p. Marca: DETODITO. Lleva a casa fácil y rápido Pasabocas DETODITO de BBQ (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7600, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33454394/Pasabocas-BBQ-DETODITO-165-gr-3168433_a.jpg?v=639148870372100000',
  true, 194
),
(
  'a1200000-0000-4000-a101-000000000196', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas DETODITO naturales (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasaboca-165-natural-detodito-165-gr-3059997/p. Marca: DETODITO. Lleva a casa fácil y rápido Pasabocas DETODITO naturales (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8075, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172687/Pasaboca-165-Natural-DETODITO-165-gr-3166476_a.jpg?v=639124902758370000',
  true, 195
),
(
  'a1200000-0000-4000-a101-000000000197', 'b1100000-0000-4000-a110-000000000001', 'Rosquitas BIMBO almidón de yuca y queso (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/multipack-rosquitas-bimbo-120-gr-3050603/p. Marca: BIMBO. Lleva a casa fácil y rápido Rosquitas BIMBO almidón de yuca y queso (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 11200, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33877713/Multipack-Rosquitas-BIMBO-120-gr-3141914_a.jpg?v=639186166521330000',
  true, 196
),
(
  'a1200000-0000-4000-a101-000000000198', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA crema cebolla (110  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-crema-cebolla-margarita-110-gr-3024868/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA crema cebolla (110 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5505, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33669934/Papas-crema-cebolla-MARGARITA-110-gr-3043695_a.jpg?v=639166126370970000',
  true, 197
),
(
  'a1200000-0000-4000-a101-000000000199', 'b1100000-0000-4000-a110-000000000001', 'Maní Recubierto LA ESPECIAL Kraks (140  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-recubierto-la-especial-140-gr-3023625/p. Marca: LA ESPECIAL. Lleva a casa fácil y rápido Maní Recubierto LA ESPECIAL Kraks (140 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5720, 'Nueces, pistachos y frutos secos', 'https://exitocol.vteximg.com.br/arquivos/ids/26690213/Pasabocas-Recubierto-LA-ESPECIAL-140-gr-3039624_a.jpg?v=638740645250930000',
  true, 198
),
(
  'a1200000-0000-4000-a101-000000000200', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA receta clásica limón pimienta (115  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-rec-clasica-lim-pim-famil-605798/p. Marca: MARGARITA. Características Papas Fritas Lima y Pimienta Bolsa x 145g. Marca: Margarita. Caracter?sticas: Nuevo sabor con la mejor receta cl?sica de las papas fritas Margarita con lima y pimienta negra, m?s gruesas, m?s doraditas, m?s crocantes y con c?scara.',
  '🛒', 9500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172373/Papa-Rec-Clasica-Lim-Pim-Famil-543184_a.jpg?v=639124899747830000',
  true, 199
),
(
  'a1200000-0000-4000-a101-000000000201', 'b1100000-0000-4000-a110-000000000001', 'Frutos secos LA ESPECIAL arándanos (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/mani-con-arandanos-almendras-y-maiz-tostado-x-450-gr-527455/p. Marca: LA ESPECIAL. Lleva a casa fácil y rápido Frutos secos LA ESPECIAL arándanos (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 24200, 'Nueces, pistachos y frutos secos', 'https://exitocol.vteximg.com.br/arquivos/ids/32133255/Mani-Con-Arandanos-Almendras-Y-Maiz-Tostado-X-450-gr-309034_a.jpg?v=639023532239900000',
  true, 200
),
(
  'a1200000-0000-4000-a101-000000000202', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas CHEETOS naturales (180  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cheetos-15-grs-x-12-unidades-471975/p. Marca: CHEETOS. Cheetos 15 Grs X 12 Unidades Características Cheetos horneados 12 unidades. Una vez abierto consuma en el menor tiempo posible. Conserve en un lugar fresco y seco Cheetos horneados,tamaño maxi,hechos de cereal de maíz,sin colorantes artificiales,25% r',
  '🛒', 14100, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172366/Cheetos-15-Grs-X-12-Unidades-243930_a.jpg?v=639124897589630000',
  true, 201
),
(
  'a1200000-0000-4000-a101-000000000203', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas TODO RICO de BBQ (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-mezcla-barbq-todo-rico-150-gramo-370027/p. Marca: TODO RICO. Contenido suministrado a Almacenes Éxito directamente por TODO RICO Todorico Bbq 150Gr X 1 Características Todo Ricos es una Mezcla de papas, chicharrones y platanos con sabor a BBQ Modo de uso Acompañantes de Comidas',
  '🛒', 8500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33538804/PASABOCAS-MEZCLA-BARBQ-TODO-RICO-150-Gramo-1774230_a.jpg?v=639154407782100000',
  true, 202
),
(
  'a1200000-0000-4000-a101-000000000204', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA receta clásica sal marina (228  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-mgta-rcta-clasica-nat-323229/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA receta clásica sal marina (228 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19700, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172418/PAPA-MGTA-RCTA-CLASICA-NAT-609299_a.jpg?v=639124900086900000',
  true, 203
),
(
  'a1200000-0000-4000-a101-000000000205', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA onduladas tomate (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-ondulada-tomate-172449/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA onduladas tomate (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4942, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172409/papa-ondulada-tomate-1508928_a.jpg?v=639124900025330000',
  true, 204
),
(
  'a1200000-0000-4000-a101-000000000206', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA onduladas mayonesa (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-ondulada-mayonesa-familia-172448/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA onduladas mayonesa (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5167, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172406/papa-ondulada-mayonesa-familia-1508927_a.jpg?v=639124900007570000',
  true, 205
),
(
  'a1200000-0000-4000-a101-000000000207', 'b1100000-0000-4000-a110-000000000001', 'Papas MARGARITA naturales (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-familiar-natural-172444/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA naturales (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5512, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172400/papa-familiar-natural-1508925_a.jpg?v=639124899976200000',
  true, 206
),
(
  'a1200000-0000-4000-a101-000000000208', 'b1100000-0000-4000-a110-000000000001', 'Platanitos NATUCHIPS verdes (336  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/natuchips-platano-verde-28-grs-x-12-unidades-137768/p. Marca: NATUCHIPS. Características Plátano verde natuchips 12 unidades. Hojuelas de plátano verde, naturalmente deliciosos. Plátano, aceite vegetal oleína de palma, azúcar. Advertencias: manténgase en un lugar fresco y seco.',
  '🛒', 24200, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33178159/Natuchips-Platano-Verde-28-Grs-X-12-Unidades-716033_a.jpg?v=639125430808730000',
  true, 207
),
(
  'a1200000-0000-4000-a101-000000000209', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas maizitos RAMO natural (360  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/maizitos-naturales-ramo-x-12-unidades-99668/p. Marca: RAMO. CARACTERISTICAS Maizitos naturales, pasabocas de puro maíz, libre de grasa trans. Consérvese en un lugar fresco. Una vez abierto consuma en el menor tiempo posible.',
  '🛒', 13950, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/32133392/Maizitos-Naturales-Ramo-X-12-Unidades-213056_a.jpg?v=639023533165700000',
  true, 208
),
(
  'a1200000-0000-4000-a101-000000000210', 'b1100000-0000-4000-a110-000000000001', 'Pasabocas DORITOS megaqueso (340  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/doritos-megaqueso-38-grs-x-10-unidades-89217/p. Marca: DORITOS. Doritos Megaqueso 38 Grs X 10 Unidades Características Una vez abierto consuma en el menor tiempo posible. Conserve en un lugar fresco y seco Pasabocas de maíz con sabor artificial a queso. Maíz, aceite vegetal, saborizante artificial a queso',
  '🛒', 22350, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33178153/Doritos-Megaqueso-38-Grs-X-10-Unidades-630182_a.jpg?v=639125430769130000',
  true, 209
),
(
  'a1200000-0000-4000-a101-000000000211', 'b1100000-0000-4000-a110-000000000001', 'Soda BRETANA botella  (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bretana-15-litros-963452/p. Marca: BRETANA. Características Consumir en el menor tiempo posible después de abierto Consumir preferiblemente antes de fecha de expiración. Consumir bien fria. Bebida carbonatada Agua carbonatada.',
  '🧹', 3500, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28928155/Bretana-15-Litros-839787_a.jpg?v=638859457997670000',
  true, 210
),
(
  'a1200000-0000-4000-a101-000000000212', 'b1100000-0000-4000-a110-000000000001', 'Soda BRETANA botella vidrio x12und  (3600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/of-soda-pague-9-lleve-12-365350/p. Marca: BRETANA. Lleva a casa fácil y rápido Soda BRETANA botella vidrio x12und (3600 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 23700, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32829826/Of-Soda-Pague-9-Lleve-12-1443507_a.jpg?v=639095354129330000',
  true, 211
),
(
  'a1200000-0000-4000-a101-000000000213', 'b1100000-0000-4000-a110-000000000001', 'Agua FRESCAMPO potable tratada (5000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-sin-gas-frescampo-5000-mililitro-256680/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Agua FRESCAMPO potable tratada (5000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3950, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/33497279/Agua-Sin-Gas-FRESCAMPO-5000-Mililitro-1512413_a.jpg?v=639153196979300000',
  true, 212
),
(
  'a1200000-0000-4000-a101-000000000214', 'b1100000-0000-4000-a110-000000000001', 'Malta PONY MALTA go x6und (1200  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-pony-malta-malta-1200-ml-3176913/p. Marca: PONY MALTA. Lleva a casa fácil y rápido Malta PONY MALTA go x6und (1200 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 7165, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28927458/Bebida-PONY-MALTA-Malta-1200-ml-3569537_a.jpg?v=638859452892970000',
  true, 213
),
(
  'a1200000-0000-4000-a101-000000000215', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa COCA COLA familiar (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gaseosa-cocacola-coca-cola-3000-ml-3048038/p. Marca: COCA COLA. Lleva a casa fácil y rápido Gaseosa COCA COLA familiar (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 8600, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32345607/GASEOSA-COCACOLA-COCA-COLA-3000-ml-3133440_a.jpg?v=639052296428470000',
  true, 214
),
(
  'a1200000-0000-4000-a101-000000000216', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa Coca Cola ZERO botella familiar (2500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/coca-cola-sin-azucar-x-2500-ml-904178/p. Marca: ZERO. Contenido suministrado a Almacenes Éxito directamente por INDUSTRIA NACIONAL DE GASEOSA Coca-Cola Sin Azucar 2.5 Lt',
  '🧹', 6400, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32345581/Coca-Cola-Sin-Azucar-X-2500-ml-308279_a.jpg?v=639052296350300000',
  true, 215
),
(
  'a1200000-0000-4000-a101-000000000217', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa Coca Cola ZERO botella (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/coca-cola-zero-1500-ml-594203/p. Marca: ZERO. Contenido suministrado a Almacenes Éxito directamente por INDUSTRIA NACIONAL DE GASEOSA Coca-Cola Sin Azucar 1.5 Lt',
  '🧹', 5017, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/34087937/Coca-Cola-Zero-1500-ml-185260_a.jpg?v=639197437960430000',
  true, 216
),
(
  'a1200000-0000-4000-a101-000000000218', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa COCA COLA original (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-gaseosa-original-316451/p. Marca: COCA COLA. Lleva a casa fácil y rápido Gaseosa COCA COLA original (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 6950, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/34087933/BEBIDA-GASEOSA-ORIGINAL-1554892_a.jpg?v=639197437946400000',
  true, 217
),
(
  'a1200000-0000-4000-a101-000000000219', 'b1100000-0000-4000-a110-000000000001', 'Agua con gas BRISA saborizada surtida x6und (6  UNIDAD) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-brisa-agua-saborizada-gas-manzana-li-6-unidad-3182500/p. Marca: BRISA. Lleva a casa fácil y rápido Agua con gas BRISA saborizada surtida x6und (6 UNIDAD). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8600, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/33503351/Bebida-BRISA-Agua-Saborizada-Gas-Manzana-Li-6-UNIDAD-3586858_a.jpg?v=639153326316000000',
  true, 218
),
(
  'a1200000-0000-4000-a101-000000000220', 'b1100000-0000-4000-a110-000000000001', 'Soda FRESCAMPO botella (1700  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/soda-frescampo-1700-ml-3091857/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Soda FRESCAMPO botella (1700 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 2100, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/33173737/Soda-FRESCAMPO-1700-ml-3293026_a.jpg?v=639124919946200000',
  true, 219
),
(
  'a1200000-0000-4000-a101-000000000221', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa Coca Cola ZERO botella x6und (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-gaseosa-sin-azucar-coca-cola-1500-ml-3037910/p. Marca: ZERO. Lleva a casa fácil y rápido Gaseosa Coca Cola ZERO botella x6und (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 8650, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32345601/Bebida-Gaseosa-Sin-Azucar-COCA-COLA-1500-ml-3095376_a.jpg?v=639052296409570000',
  true, 220
),
(
  'a1200000-0000-4000-a101-000000000222', 'b1100000-0000-4000-a110-000000000001', 'Agua con gas BRISA manzana (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-saborizada-manzana-brisa-1500-mililitro-3002638/p. Marca: BRISA. Lleva a casa fácil y rápido Agua con gas BRISA manzana (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3330, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28931581/BEBIDA-SABORIZADA-MANZANA-BRISA-1500-Mililitro-3003705_a.jpg?v=638859668154400000',
  true, 221
),
(
  'a1200000-0000-4000-a101-000000000223', 'b1100000-0000-4000-a110-000000000001', 'Agua FRESCAMPO sin gas  (1100  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-pura-sin-gas-985802/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Agua FRESCAMPO sin gas (1100 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 1250, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28929769/AGUA-PURA-SIN-GAS-1375498_a.jpg?v=638859482288400000',
  true, 222
),
(
  'a1200000-0000-4000-a101-000000000224', 'b1100000-0000-4000-a110-000000000001', 'Té HATSU surtido caja x12und 200ml (2400  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/te-tetrapak-surtido-x-12-933249/p. Marca: HATSU. Lleva a casa fácil y rápido Té HATSU surtido caja x12und 200ml (2400 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22200, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28931531/Te-Tetrapak-Surtido-X-12-1306243_a.jpg?v=638859665070870000',
  true, 223
),
(
  'a1200000-0000-4000-a101-000000000225', 'b1100000-0000-4000-a110-000000000001', 'Soda BRETANA botella x2und (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/duo-soda-929684/p. Marca: BRETANA. Lleva a casa fácil y rápido Soda BRETANA botella x2und (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 7910, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/33520367/Duo-Soda-1302067_a.jpg?v=639154123208300000',
  true, 224
),
(
  'a1200000-0000-4000-a101-000000000226', 'b1100000-0000-4000-a110-000000000001', 'Agua FRESCAMPO sin gas x12und (3720  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-pura-sin-gas-928420/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Agua FRESCAMPO sin gas x12und (3720 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6480, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28931286/Agua-Pura-Sin-Gas-1299743_a.jpg?v=638859656143130000',
  true, 225
),
(
  'a1200000-0000-4000-a101-000000000227', 'b1100000-0000-4000-a110-000000000001', 'Agua CRISTAL sin gas botella x24und 300ml (7200  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-ahorra-pack-pet-845228/p. Marca: CRISTAL. Lleva a casa fácil y rápido Agua CRISTAL sin gas botella x24und 300ml (7200 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19500, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28929745/Agua-Ahorra-Pack-Pet-1140185_a.jpg?v=638859482100200000',
  true, 226
),
(
  'a1200000-0000-4000-a101-000000000228', 'b1100000-0000-4000-a110-000000000001', 'Refresco HIT surtido caja x6und (1000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/of-hit-pague-5-lleve-6-821579/p. Marca: HIT. CARACTERISTICAS Bebida sabores surtidos pague 5 lleve 6 und. Marca: Hit. Características: bebida sabores surtidos x 200 ml por und. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco, despúes de abierto consúmase en el menor tiempo posibl',
  '🛒', 7510, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/29729170/Of-Hit-Pague-5-Lleve-6-569628_a.jpg?v=638912401999430000',
  true, 227
),
(
  'a1200000-0000-4000-a101-000000000229', 'b1100000-0000-4000-a110-000000000001', 'Bebida gasificada H2O lima limón (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/h2oh-lima-limon-pet-15-lts-675974/p. Marca: H2O. Lleva a casa fácil y rápido Bebida gasificada H2O lima limón (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4216, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/33520599/H2oh-Lima-Limon-Pet-15-Lts-16446_a.jpg?v=639154126861270000',
  true, 228
),
(
  'a1200000-0000-4000-a101-000000000230', 'b1100000-0000-4000-a110-000000000001', 'Soda SCHWEPPES botella (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/schweppes-soda-15-lt-594180/p. Marca: SCHWEPPES. Lleva a casa fácil y rápido Soda SCHWEPPES botella (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 3300, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28929336/Schweppes-Soda-15-lt-185163_a.jpg?v=638859476009830000',
  true, 229
),
(
  'a1200000-0000-4000-a101-000000000231', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa SCHWEPPES ginger ale botella vidrio (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/soda-ginger-594179/p. Marca: SCHWEPPES. Características Ginger Ale',
  '🧹', 5230, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32294520/Soda-Ginger-185142_a.jpg?v=639046066316270000',
  true, 230
),
(
  'a1200000-0000-4000-a101-000000000232', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa QUATRO toronja original (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gaseosa-593773/p. Marca: QUATRO. Características Bebida Gaseosa Sabor Toronja Botella X 1500Ml. Marca: Quatro. Información alergénica: Contiene tartrazina. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco, después de abierto consúmase en el menor tiempo posible.',
  '🧹', 3592, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28928003/Gaseosa-184661_a.jpg?v=638859456801800000',
  true, 231
),
(
  'a1200000-0000-4000-a101-000000000233', 'b1100000-0000-4000-a110-000000000001', 'Refresco HIT surtido caja x12und (2000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-surtido-pag10-llev12-283704/p. Marca: HIT. Características Bebida Hit Sabores Surtidos Paq.Paga 10 Lleva 12. Marca: Hit. Características: Bebida Hit Sabores Surtidos Paq.Paga 10 Lleva 12 x 200 ml por und. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco, después de abierto ',
  '🛒', 15750, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/29198116/Bebida-Surtido-Pag10-Llev12-913828_a.jpg?v=638885349726800000',
  true, 232
),
(
  'a1200000-0000-4000-a101-000000000234', 'b1100000-0000-4000-a110-000000000001', 'Bebida DEL VALLE fresh frutas cítricas (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-naranja-citrus-del-valle-1500-ml-158499/p. Marca: DEL VALLE. Lleva a casa fácil y rápido Bebida DEL VALLE fresh frutas cítricas (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3015, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929546/Bebida-Naranja-Citrus-DEL-VALLE-1500-ml-1559370_a.jpg?v=638859479403730000',
  true, 233
),
(
  'a1200000-0000-4000-a101-000000000235', 'b1100000-0000-4000-a110-000000000001', 'Refresco HIT frutas tropicales botella  (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hit-frutas-tropicales-pet-500-ml-90121/p. Marca: HIT. Características *Refresco de frutas tropicales pasterizado hit 500ml *Manténgase refrigerado. Después de abierto consuma en el menor tiempo posible.',
  '🛒', 3040, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929574/Hit-Frutas-Tropicales-Pet-500-ml-706526_a.jpg?v=638859479925870000',
  true, 234
),
(
  'a1200000-0000-4000-a101-000000000236', 'b1100000-0000-4000-a110-000000000001', 'Refresco HIT mora botella  (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hit-mora-pet-500-ml-88065/p. Marca: HIT. Características *Refresco de mora pasterizado hit 500ml *Manténgase refrigerado. Después de abierto consuma en el menor tiempo posible.',
  '🛒', 3040, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929587/Hit-Mora-Pet-500-ml-706101_a.jpg?v=638859480012030000',
  true, 235
),
(
  'a1200000-0000-4000-a101-000000000237', 'b1100000-0000-4000-a110-000000000001', 'Refresco HIT mango botella  (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hit-mango-pet-500-ml-86806/p. Marca: HIT. Características *Refresco de mango pasterizado Hit *Manténgase refrigerado. Después de abierto consuma en el menor tiempo posible.',
  '🛒', 3040, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929584/Hit-Mango-Pet-500-ml-706021_a.jpg?v=638859479991930000',
  true, 236
),
(
  'a1200000-0000-4000-a101-000000000238', 'b1100000-0000-4000-a110-000000000001', 'Gaseosa POSTOBON manzana botella (3125  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gaseosa-manzana-38971/p. Marca: POSTOBON. Lleva a casa fácil y rápido Gaseosa POSTOBON manzana botella (3125 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 7720, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28927929/Gaseosa-Manzana-987616_a.jpg?v=638859456380370000',
  true, 237
),
(
  'a1200000-0000-4000-a101-000000000239', 'b1100000-0000-4000-a110-000000000001', 'Bebida de almendras TAEQ sin azúcares añadidos (1000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-de-almendra-sin-azucar-taeq-1000-mililitro-26810/p. Marca: TAEQ. Lleva a casa fácil y rápido Bebida de almendras TAEQ sin azúcares añadidos (1000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥤', 9250, 'Bebidas de cereal', 'https://exitocol.vteximg.com.br/arquivos/ids/33497319/Bebida-de-almendra-sin-azucar-TAEQ-1000-Mililitro-1743103_a.jpg?v=639153197297700000',
  true, 238
),
(
  'a1200000-0000-4000-a101-000000000240', 'b1100000-0000-4000-a110-000000000001', 'Bebida hidratante HIDRALYTE con electrolitos, fresakiwi (640  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-hidralyte-hidratante-electrolitos-fresa-640-ml-3219502/p. Marca: HIDRALYTE. Lleva a casa fácil y rápido Bebida hidratante HIDRALYTE con electrolitos, fresa-kiwi (640 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4280, 'Hidratantes y energizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/31272549/Bebida-HIDRALYTE-Hidratante-Electrolitos-Fresa-640-ml-3728648_a.jpg?v=639162827556500000',
  true, 239
),
(
  'a1200000-0000-4000-a101-000000000241', 'b1100000-0000-4000-a110-000000000001', 'Papa Francesa FACIL 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-francesa-x500-gramos-632990/p. Marca: FACIL. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia PAPAFACIL PAPA DELGADA 9X9 500 GR Deliciosas papas a la francesa, acompañamiento perfecto para tus comidas.',
  '🥬', 7810, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757784/Papa-Francesa-X500-Gramos-680662_a.jpg?v=639089486306500000',
  true, 240
),
(
  'a1200000-0000-4000-a101-000000000242', 'b1100000-0000-4000-a110-000000000001', 'Papa delgada  RAPI 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-a-la-francesa-prefreida-y-congelada-delgada-x-1000-gr-250363/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN PAPA DELGADA 9X9 1000 GR El perfecto balance entre crocancia y suavidad, se llevan bien concualquier menú.Las papas a la francesa McCain son do',
  '🥬', 20950, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643574/Papa-A-La-Francesa-Prefreida-Y-Congelada-Delgada-X-1000-gr-661212_a.jpg?v=639077053939830000',
  true, 241
),
(
  'a1200000-0000-4000-a101-000000000243', 'b1100000-0000-4000-a110-000000000001', 'Papa kilo FACIL 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-a-la-francesa-prefreidas-y-congeladas-x1000gr-778558/p. Marca: FACIL. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia PAPAFACIL PAPA DELGADA 9X9 1000 GR Deliciosas papas a la francesa, acompañamiento perfecto para tus comidas.',
  '🥬', 18000, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643580/Papas-A-La-Francesa-Prefreidas-Y-Congeladas-X1000gr-381217_a.jpg?v=639077053982270000',
  true, 242
),
(
  'a1200000-0000-4000-a101-000000000244', 'b1100000-0000-4000-a110-000000000001', 'Papas Airfryer  MC CAIN 700  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-airfryer-rapi-700-gr-3083018/p. Marca: MC CAIN. Lleva a casa fácil y rápido Papas Airfryer MC CAIN 700 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 20750, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/33172870/Papas-Airfryer-RAPI-700-gr-3257352_a.jpg?v=639124903981800000',
  true, 243
),
(
  'a1200000-0000-4000-a101-000000000245', 'b1100000-0000-4000-a110-000000000001', 'Vegetales Mixtos Congelados FRESCAMPO 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/vegetales-mixtos-congelados-frescampo-500-gr-3079187/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Vegetales Mixtos Congelados FRESCAMPO 500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 8480, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32758577/Vegetales-Mixtos-Congelados-FRESCAMPO-500-gr-3240263_a.jpg?v=639089492789870000',
  true, 244
),
(
  'a1200000-0000-4000-a101-000000000246', 'b1100000-0000-4000-a110-000000000001', 'Papas Prefritas Congeladas FRESCAMPO 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-prefritas-congeladas-frescampo-1000-gr-3079186/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Papas Prefritas Congeladas FRESCAMPO 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 12500, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32650922/Papas-Prefritas-Congeladas-FRESCAMPO-1000-gr-3240262_a.jpg?v=639077954024300000',
  true, 245
),
(
  'a1200000-0000-4000-a101-000000000247', 'b1100000-0000-4000-a110-000000000001', 'Maiz Congelado FRESCAMPO 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/maiz-congelado-frescampo-500-gr-3079185/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Maiz Congelado FRESCAMPO 500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 9230, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32650921/Maiz-Congelado-FRESCAMPO-500-gr-3240261_a.jpg?v=639077954013630000',
  true, 246
),
(
  'a1200000-0000-4000-a101-000000000248', 'b1100000-0000-4000-a110-000000000001', 'Maíz Descranado x500gr  MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/maiz-desgranado-x-500g-613330/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL MAIZ EN GRANO 500 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorantes y conserva',
  '🥬', 16050, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643578/Maiz-Desgranado-X-500g-520889_a.jpg?v=639077053969700000',
  true, 247
),
(
  'a1200000-0000-4000-a101-000000000249', 'b1100000-0000-4000-a110-000000000001', 'Papa Tradicional x 1000gr  RAPI 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-a-la-francesa-prefreida-y-congelada-tradicional-x1000g-477676/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN TRADICIONAL 13X13 1000 GR Las favoritas de muchos, su corte hace que sean esponjosas y llenas de sabor.Las papas a la francesa McCain son dora',
  '🥬', 21750, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757778/Papa-A-La-Francesa-Prefreida-Y-Congelada-Tradicional-X1000g-760117_a.jpg?v=639089486262930000',
  true, 248
),
(
  'a1200000-0000-4000-a101-000000000250', 'b1100000-0000-4000-a110-000000000001', 'Chococono CREM HELADO cobertura chocolate x6und (540  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cono-chococono-pack-x6-crem-helado-540-gr-308182/p. Marca: CREM HELADO. Lleva a casa fácil y rápido Chococono CREM HELADO cobertura chocolate x6und (540 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 23700, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33552799/Cono-Chococono-Pack-X6-CREM-HELADO-540-gr-1752939_a.jpg?v=639154967470370000',
  true, 249
),
(
  'a1200000-0000-4000-a101-000000000251', 'b1100000-0000-4000-a110-000000000001', 'Yuca  RAPI 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/yuca-298679/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN YUCA JUMBO 500 GR Las Croquetas de Yuca McCain tienen un delicioso sabor, la calidad que siempre encontrará en los productos McCain ahora en un alimento de origen 100% Colombiano.',
  '🥬', 9000, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757772/Yuca-193140_a.jpg?v=639089486227270000',
  true, 250
),
(
  'a1200000-0000-4000-a101-000000000252', 'b1100000-0000-4000-a110-000000000001', 'Frambuesas FRANUI bañadas chocolate blanco y amargo (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/frambuesas-choc-franui-1-und-3173794/p. Marca: FRANUI. Lleva a casa fácil y rápido Frambuesas FRANUI bañadas chocolate blanco y amargo (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 29050, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33563965/Frambuesas-Choc-FRANUI-1-und-3559225_a.jpg?v=639155763798070000',
  true, 251
),
(
  'a1200000-0000-4000-a101-000000000253', 'b1100000-0000-4000-a110-000000000001', 'Palitos De Queso ZENU 252  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/palitos-de-queso-zenu-252-gr-3158779/p. Marca: ZENU. Lleva a casa fácil y rápido Palitos De Queso ZENU 252 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 17500, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/32758762/Palitos-De-Queso-ZENU-252-gr-3526207_a.jpg?v=639089495698370000',
  true, 252
),
(
  'a1200000-0000-4000-a101-000000000254', 'b1100000-0000-4000-a110-000000000001', 'Palitos Queso ZENU 440  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/palitos-queso-zenu-440-gr-3158762/p. Marca: ZENU. Lleva a casa fácil y rápido Palitos Queso ZENU 440 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 26350, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/32907608/Palitos-Queso-ZENU-440-gr-3526095_a.jpg?v=639101563274530000',
  true, 253
),
(
  'a1200000-0000-4000-a101-000000000255', 'b1100000-0000-4000-a110-000000000001', 'Arepa De Huevo Congelada FRESCAMPO 10  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arepa-de-huevo-congelada-frescampo-11-gr-3128162/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Arepa De Huevo Congelada FRESCAMPO 10 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 28800, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/33563667/Arepa-De-Huevo-Congelada-FRESCAMPO-11-gr-3405393_a.jpg?v=639155755999530000',
  true, 254
),
(
  'a1200000-0000-4000-a101-000000000256', 'b1100000-0000-4000-a110-000000000001', 'Empanada Con Carne Cong  FRESCAMPO 10  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/empanada-con-carne-cong-x-70g-frescampo-07-gr-3128116/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Empanada Con Carne Cong FRESCAMPO 10 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 19200, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/32758639/Empanada-Con-Carne-Cong-x-70g-FRESCAMPO-07-gr-3405347_a.jpg?v=639089495005070000',
  true, 255
),
(
  'a1200000-0000-4000-a101-000000000257', 'b1100000-0000-4000-a110-000000000001', 'Papas Zig Zag MC CAIN 1500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-rizadas-mega-mc-cain-1500-gr-3098985/p. Marca: MC CAIN. Lleva a casa fácil y rápido Papas Zig Zag MC CAIN 1500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 37350, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32758602/Papas-Rizadas-Mega-MC-CAIN-1500-gr-3320446_a.jpg?v=639089492938700000',
  true, 256
),
(
  'a1200000-0000-4000-a101-000000000258', 'b1100000-0000-4000-a110-000000000001', 'Papas Crispers MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-crispers-rapi-500-gr-3083017/p. Marca: MC CAIN. Lleva a casa fácil y rápido Papas Crispers MC CAIN 500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 12600, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/33172868/Papas-Crispers-RAPI-500-gr-3257351_a.jpg?v=639124903967670000',
  true, 257
),
(
  'a1200000-0000-4000-a101-000000000259', 'b1100000-0000-4000-a110-000000000001', 'Papas Delgadas ZENU 900  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-delgadas-zenu-900-gramo-3009452/p. Marca: ZENU. Lleva a casa fácil y rápido Papas Delgadas ZENU 900 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 17900, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757920/Papas-Delgadas-ZENU-900-Gramo-3013610_a.jpg?v=639089489803270000',
  true, 258
),
(
  'a1200000-0000-4000-a101-000000000260', 'b1100000-0000-4000-a110-000000000001', 'Pan baguette BIMBO mini tradicional  (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/baguette-tradicional-panettiere-400-gramo-3003556/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan baguette BIMBO mini tradicional (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧊', 8340, 'Comidas congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757904/BAGUETTE-TRADICIONAL-PANETTIERE-400-Gramo-3005737_a.jpg?v=639089489693600000',
  true, 259
),
(
  'a1200000-0000-4000-a101-000000000261', 'b1100000-0000-4000-a110-000000000001', 'Papa Zig Zag RAPI 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-a-la-francesa-prefreida-y-congelada-rizadas-x1000g-798138/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN PAPA RIZADA RT 1000 GR Un corte único para sorprender a todos en casa y variar los platos que más les gustan. Las papas Rizadas McCain son ideales',
  '🥬', 23200, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757788/Papa-A-La-Francesa-Prefreida-Y-Congelada-Rizadas-X1000g-307630_a.jpg?v=639089486337400000',
  true, 260
),
(
  'a1200000-0000-4000-a101-000000000262', 'b1100000-0000-4000-a110-000000000001', 'Vegetales Mixtos  MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cosecha-selecta-vegetales-mixtos-x-500-gr-613329/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL MIXTOS 500 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorante',
  '🥬', 16050, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757780/Cosecha-Selecta-Vegetales-Mixtos-X-500-gr-520888_a.jpg?v=639089486278330000',
  true, 261
),
(
  'a1200000-0000-4000-a101-000000000263', 'b1100000-0000-4000-a110-000000000001', 'Arveja x500gr  MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arvejas-ervilgas-x-500-gr-613327/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL ARVEJAS 500 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorantes y conservan t',
  '🥬', 17900, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643576/Arvejas-Ervilgas-X-500-gr-520886_a.jpg?v=639077053955130000',
  true, 262
),
(
  'a1200000-0000-4000-a101-000000000264', 'b1100000-0000-4000-a110-000000000001', 'Vegetales Mixtos MC CAIN 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/vegetales-mixtos-x-1000-g-610919/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL MIXTOS 1000 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorantes y conservan t',
  '🥬', 23200, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757877/Vegetales-mixtos-x-1000-g-702989_a.jpg?v=639089489481800000',
  true, 263
),
(
  'a1200000-0000-4000-a101-000000000265', 'b1100000-0000-4000-a110-000000000001', 'Paleta CREM HELADO mini polet sabores surtidos (270  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/palmini-polet-surt-pack-x6und-523103/p. Marca: CREM HELADO. Lleva a casa fácil y rápido Paleta CREM HELADO mini polet sabores surtidos (270 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 23900, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/34105206/PALMINI-POLET-SURT-PACK-X6UND-210411_a.jpg?v=639198304214970000',
  true, 264
),
(
  'a1200000-0000-4000-a101-000000000266', 'b1100000-0000-4000-a110-000000000001', 'Hashbrown triangulos de papx8u MC CAIN 300  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hashbrown-tringulos-de-papx8u-363645/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN HASHBROWN TRIANGLE 8UND 300 GR Deliciosos triangulitos de papa ideales para tener un desayuno diferente y delicioso en casa.',
  '🥬', 12400, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757794/Hashbrown-Tringulos-De-Papx8u-233301_a.jpg?v=639089486376230000',
  true, 265
),
(
  'a1200000-0000-4000-a101-000000000267', 'b1100000-0000-4000-a110-000000000001', 'Chococono CREM HELADO cobertura chocolate sabor vainilla (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chococono-156530/p. Marca: CREM HELADO. Lleva a casa fácil y rápido Chococono CREM HELADO cobertura chocolate sabor vainilla (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3900, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33294619/CHOCOCONO-1724600_a.jpg?v=639136647718530000',
  true, 266
),
(
  'a1200000-0000-4000-a101-000000000268', 'b1100000-0000-4000-a110-000000000001', 'Helado Ice & Joy vainilla (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/helado-ice-joy-vainilla-600-gr-3240330/p. Marca: Ice & Joy. Lleva a casa fácil y rápido Helado Ice & Joy vainilla (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14500, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33564093/Helado-Ice-Joy-Vainilla-600-gr-3799430_a.jpg?v=639155766035270000',
  true, 267
),
(
  'a1200000-0000-4000-a101-000000000269', 'b1100000-0000-4000-a110-000000000001', 'Helado Ice & Joy chocolate (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/helado-ice-joy-chocolate-600-gr-3240328/p. Marca: Ice & Joy. Lleva a casa fácil y rápido Helado Ice & Joy chocolate (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14500, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33564091/Helado-Ice-Joy-Chocolate-600-gr-3799428_a.jpg?v=639155766007470000',
  true, 268
),
(
  'a1200000-0000-4000-a101-000000000270', 'b1100000-0000-4000-a110-000000000001', 'Empanada Coctel ZENU 300  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/empanada-coctel-zenu-300-gr-3195644/p. Marca: ZENU. Lleva a casa fácil y rápido Empanada Coctel ZENU 300 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 12700, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/33564015/Empanada-Coctel-ZENU-300-gr-3635036_a.jpg?v=639155764179630000',
  true, 269
),
(
  'a1200000-0000-4000-a101-000000000271', 'b1100000-0000-4000-a110-000000000001', 'Jamón serrano 1901 AUTÉNTICO POR TRADICIÓN libre de lactosa (80  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-serrano-1901-80-gr-3010835/p. Marca: 1901 AUTÉNTICO POR TRADICIÓN. Lleva a casa fácil y rápido Jamón serrano 1901 AUTÉNTICO POR TRADICIÓN libre de lactosa (80 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 8990, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31928630/Jamon-Serrano-1901-80-gr-3015730_a.jpg?v=638999407340770000',
  true, 270
),
(
  'a1200000-0000-4000-a101-000000000272', 'b1100000-0000-4000-a110-000000000001', 'Queso CENTURION muenster tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-muenster-tjd-centurion-150-gr-1002396/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION muenster tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9890, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31005461/Queso-Muenster-Tjd-CENTURION-150-gr-1862828_a.jpg?v=638943298571370000',
  true, 271
),
(
  'a1200000-0000-4000-a101-000000000273', 'b1100000-0000-4000-a110-000000000001', 'Queso costeño COLANTA semimaduro Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-costeno-25kg-577690/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso costeño COLANTA semimaduro. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 28627, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716763/QUESO-COSTENO-25KG-482717_a.jpg?v=639086675116800000',
  true, 272
),
(
  'a1200000-0000-4000-a101-000000000274', 'b1100000-0000-4000-a110-000000000001', 'Queso mozzarella COLANTA porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-colanta-475057/p. Marca: COLANTA. Características: Queso mozzarella colanta. Queso fresco,semiduro,semigraso. CONSERVACIÓN: Consérvese en un lugar fresco. Una vez abierto consuma en el menor tiempo posible.',
  '🛒', 32127, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716766/Queso-Mozzarella-Colanta-651179_a.jpg?v=639086675148730000',
  true, 273
),
(
  'a1200000-0000-4000-a101-000000000275', 'b1100000-0000-4000-a110-000000000001', 'Queso Sabana ALPINA 25 tajadas   (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-sabana-x-25-tajadas-415-gr-269487/p. Marca: ALPINA. Queso Sabana X 25 Tajadas (415 Gr) Características Queso Sabana. Marca: Alpina. Características: Queso semiduro, fresco y graso, naturalmente libre de grasa trans, buena fuente de calcio. Almacenamiento: Consérvese en un lugar limpio y seco, despué',
  '🛒', 34050, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33676667/Queso-Sabana-X-25-Tajadas-415-Gr-391513_a.jpg?v=639166192246100000',
  true, 274
),
(
  'a1200000-0000-4000-a101-000000000276', 'b1100000-0000-4000-a110-000000000001', 'Queso Sabana ALPINA 15 tajadas   (240  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-sabana-x-15-tajadas-249-gr-269484/p. Marca: ALPINA. Queso Sabana X 15 Tajadas X 249 gr Características Endulzante con stevia en polvo éxito. Queso Sabana. Marca: Alpina. Características: Queso semiduro, fresco y graso, naturalmente libre de grasa trans, buena fuente de calcio. Almacenamiento: Consér',
  '🛒', 16680, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33676662/Queso-Sabana-X-15-Tajadas-249-Gr-391455_a.jpg?v=639166192207670000',
  true, 275
),
(
  'a1200000-0000-4000-a101-000000000277', 'b1100000-0000-4000-a110-000000000001', 'Jamón  FRESCAS & MADURADAS COLOMBIA york (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-york-bloque-191334/p. Marca: FRESCAS & MADURADAS COLOMBIA. Lleva a casa fácil y rápido Jamón FRESCAS & MADURADAS COLOMBIA york (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 26900, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31996114/JAMON-YORK-BLOQUE-1603774_a.jpg?v=639009693185900000',
  true, 276
),
(
  'a1200000-0000-4000-a101-000000000278', 'b1100000-0000-4000-a110-000000000001', 'Queso doble crema COLANTA porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-doblecrema-colanta-7955/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso doble crema COLANTA porcionado en tienda. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 26527, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716764/Queso-Doblecrema-Colanta-376884_a.jpg?v=639086675126230000',
  true, 277
),
(
  'a1200000-0000-4000-a101-000000000279', 'b1100000-0000-4000-a110-000000000001', 'Queso Mozzarella CENTURION Bloque (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-centurion-bloque-600-gr-3255200/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso Mozzarella CENTURION Bloque (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/34121581/Queso-Mozzarella-CENTURION-Bloque-600-gr-3856795_a.jpg?v=639199166500930000',
  true, 278
),
(
  'a1200000-0000-4000-a101-000000000280', 'b1100000-0000-4000-a110-000000000001', 'Queso Cottage LACTO LIFE Fresco Semiblando Graso (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-cottage-lacto-life-fresco-semiblando-graso-500-gr-3244032/p. Marca: LACTO LIFE. Lleva a casa fácil y rápido Queso Cottage LACTO LIFE Fresco Semiblando Graso (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22500, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33563853/Queso-Cottage-LACTO-LIFE-Fresco-Semiblando-Graso-500-gr-3817441_a.jpg?v=639155760111700000',
  true, 279
),
(
  'a1200000-0000-4000-a101-000000000281', 'b1100000-0000-4000-a110-000000000001', 'Queso mozzarella DIBUFALA ciliegine de búfala (230  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-ciliegine-dibufala-230-gr-3159692/p. Marca: DIBUFALA. Lleva a casa fácil y rápido Queso mozzarella DIBUFALA ciliegine de búfala (230 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6230, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32236792/Queso-Mozzarella-Ciliegine-DIBUFALA-230-gr-3528949_a.jpg?v=639039089655400000',
  true, 280
),
(
  'a1200000-0000-4000-a101-000000000282', 'b1100000-0000-4000-a110-000000000001', 'Queso CENTURION feta (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-feta-centurion-250-gr-3071449/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION feta (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 20900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/30896656/Queso-Feta-CENTURION-250-gr-3209938_a.jpg?v=638937241642400000',
  true, 281
),
(
  'a1200000-0000-4000-a101-000000000283', 'b1100000-0000-4000-a110-000000000001', 'Queso CENTURION gouda ahumado tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-gouda-ahumado-centurion-150-gr-1002559/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION gouda ahumado tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9890, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31005469/Queso-Gouda-Ahumado-CENTURION-150-gr-1862991_a.jpg?v=638943298615370000',
  true, 282
),
(
  'a1200000-0000-4000-a101-000000000284', 'b1100000-0000-4000-a110-000000000001', 'Queso CENTURION colby jack tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-colby-jack-centurion-150-gr-1002476/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION colby jack tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7630, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31005468/Queso-Colby-Jack-CENTURION-150-gr-1862908_a.jpg?v=638943298606270000',
  true, 283
),
(
  'a1200000-0000-4000-a101-000000000285', 'b1100000-0000-4000-a110-000000000001', 'Jamón de pavo TAEQ porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-pechuga-de-pavo-excelenz-954091/p. Marca: TAEQ. Jamón Pechuga De Pavo Excele Características Prueba el irresistible sabor del Jamón de Pavo una combinación única de sabor y tradición. Deléitate con deliciosos jamones madurados con textura jugosa y su aroma cautivador en cada porción. Nuestro jamón d',
  '🥩', 79200, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31960931/Jamon-Pechuga-De-Pavo-Excelenz-699039_a.jpg?v=639003091708500000',
  true, 284
),
(
  'a1200000-0000-4000-a101-000000000286', 'b1100000-0000-4000-a110-000000000001', 'Queso PRESIDENT tipo cheddar tajado (200  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/president-cheddar-tajado-908624/p. Marca: PRESIDENT. Lleva a casa fácil y rápido Queso PRESIDENT tipo cheddar tajado (200 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 10430, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/30892590/President-Cheddar-Tajado-1266324_a.jpg?v=638937208323330000',
  true, 285
),
(
  'a1200000-0000-4000-a101-000000000287', 'b1100000-0000-4000-a110-000000000001', 'Salami MONTICELLO de cerdo maduración artesanal (80  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salami-902073/p. Marca: MONTICELLO. Nombre del producto Salami MONTICELLO de cerdo maduración artesanal 80 Gr Características del producto Se obtiene de una mezcla de carne de cerdo y res junto con ingredientes y especias mediterráneas entre ellas la pimienta. Almacenamiento Mantener Refrigerado a tempera',
  '🥩', 22300, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31754458/SALAMI-1516719_a.jpg?v=638986381634900000',
  true, 286
),
(
  'a1200000-0000-4000-a101-000000000288', 'b1100000-0000-4000-a110-000000000001', 'Queso parmesano COLANTA madurado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-parmesano-cuna-colanta-x-100-gr-785653/p. Marca: COLANTA. Características Queso madurado,duro,semigraso. CONSERVACIÓN: Consérvese en un lugar fresco. Una vez abierto consuma en el menor tiempo posible.',
  '🛒', 72730, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32549936/Queso-Parmesano-Cuna-Colanta-X-100-gr-437997_a.jpg?v=639068711069330000',
  true, 287
),
(
  'a1200000-0000-4000-a101-000000000289', 'b1100000-0000-4000-a110-000000000001', 'Queso COLANTA para asar Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-para-asar-blq-286803/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso COLANTA para asar. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 47900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716757/Queso-Para-Asar-Blq-806692_a.jpg?v=639086675051800000',
  true, 288
),
(
  'a1200000-0000-4000-a101-000000000290', 'b1100000-0000-4000-a110-000000000001', 'Queso Pomona burrata (125  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-burrata-pomona-250-gr-268305/p. Marca: Pomona. Lleva a casa fácil y rápido Queso Pomona burrata (125 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 11830, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32236769/Queso-Burrata-Pomona-250-gr-1766263_a.jpg?v=639039089435170000',
  true, 289
),
(
  'a1200000-0000-4000-a101-000000000291', 'b1100000-0000-4000-a110-000000000001', 'Jamón  Pomona especial porcionado tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-cerdo-seleccion-especial-x-kg-216137/p. Marca: Pomona. Lleva a casa fácil y rápido Jamón Pomona especial porcionado tienda. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 34320, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32549874/Jamon-Cerdo-Seleccion-Especial-X-kg-437230_a.jpg?v=639068708475130000',
  true, 290
),
(
  'a1200000-0000-4000-a101-000000000292', 'b1100000-0000-4000-a110-000000000001', 'Tocineta FRESCAS & MADURADAS COLOMBIA ahumada (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tocineta-ahumada-400-gr-194644/p. Marca: FRESCAS & MADURADAS COLOMBIA. Lleva a casa fácil y rápido Tocineta FRESCAS & MADURADAS COLOMBIA ahumada (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 29950, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31996238/TOCINETA-AHUMADA-400-gr-1780899_a.jpg?v=639009714496500000',
  true, 291
),
(
  'a1200000-0000-4000-a101-000000000293', 'b1100000-0000-4000-a110-000000000001', 'Albondigón EKONO con verduras (425  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/albondigon-con-verduras-425gm-ekono-425-gr-3142347/p. Marca: EKONO. Lleva a casa fácil y rápido Albondigón EKONO con verduras (425 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 6300, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31964329/ALBONDIGON-CON-VERDURAS-425GM-EKONO-425-gr-3462665_a.jpg?v=639003133483030000',
  true, 292
),
(
  'a1200000-0000-4000-a101-000000000294', 'b1100000-0000-4000-a110-000000000001', 'Queso DIBUFALA burrata de búfala (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/burrata-de-bufala-dibufala-480-gr-3112432/p. Marca: DIBUFALA. Lleva a casa fácil y rápido Queso DIBUFALA burrata de búfala (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 30900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33178346/Burrata-De-Bufala-DIBUFALA-480-gr-3350830_a.jpg?v=639125432295700000',
  true, 293
),
(
  'a1200000-0000-4000-a101-000000000295', 'b1100000-0000-4000-a110-000000000001', 'Jamón  CATALAN 100% de cerdo (210  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-york-catalan-210-gr-3100870/p. Marca: CATALAN. Lleva a casa fácil y rápido Jamón CATALAN 100% de cerdo (210 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 22200, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33496489/Jamon-York-CATALAN-210-gr-3325629_a.jpg?v=639153157558470000',
  true, 294
),
(
  'a1200000-0000-4000-a101-000000000296', 'b1100000-0000-4000-a110-000000000001', 'Pastrami de pavo Pomona tajado (225  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pastrami-pavo-pomona-225-gr-3077665/p. Marca: Pomona. Lleva a casa fácil y rápido Pastrami de pavo Pomona tajado (225 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 17080, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31963428/Pastrami-Pavo-Pomona-225-gr-3234497_a.jpg?v=639003123111300000',
  true, 295
),
(
  'a1200000-0000-4000-a101-000000000297', 'b1100000-0000-4000-a110-000000000001', 'Queso CENTURION Pepper Jack Tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-pepper-jack-taj-centurion-150-gr-1002478/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION Pepper Jack Tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33563957/Queso-Pepper-Jack-Taj-CENTURION-150-gr-1862910_a.jpg?v=639155762840830000',
  true, 296
),
(
  'a1200000-0000-4000-a101-000000000298', 'b1100000-0000-4000-a110-000000000001', 'Queso Holandés ALPINA 15 tajadas   (282  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-holandes-x-15-tajadas-979050/p. Marca: ALPINA. CARACTERISTICAS Queso Holandés Lonchas. Marca: Alpina. Características: Queso semiduro, semimaduro y graso, naturalmente libre de grasa trans, buena fuente de calcio. Almacenamiento: Consérvese en un lugar limpio y seco, después de abierto consúmase en ',
  '🛒', 28000, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33670379/Queso-Holandes-X-15-Tajadas-508875_a.jpg?v=639166157022070000',
  true, 297
),
(
  'a1200000-0000-4000-a101-000000000299', 'b1100000-0000-4000-a110-000000000001', 'Queso COLANTA tipo cheddar porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-cheddar-x-100-gr-977165/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso COLANTA tipo cheddar porcionado en tienda. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 62227, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32718545/Queso-Cheddar-X-100-gr-738559_a.jpg?v=639087485015700000',
  true, 298
),
(
  'a1200000-0000-4000-a101-000000000300', 'b1100000-0000-4000-a110-000000000001', 'Jamón  KOLLER porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-cerdo-919728/p. Marca: KOLLER. Jamon Cerdo Características Jamón Cerdo x 5Kl. Marca: Koller. Características: Jamón Cerdo x 5Kl. Almacenamiento: Consuma antes de la fecha indicada en la etiqueta, una vez sacado de refrigeración consumir en el menor tiempo posible. Mantenga muy bien refrigerado.',
  '🥩', 138000, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32660637/Jamon-Cerdo-756882_a.jpg?v=639081677211270000',
  true, 299
),
(
  'a1200000-0000-4000-a101-000000000301', 'b1100000-0000-4000-a110-000000000001', 'Leche condensada LA LECHERA original doypack (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lache-condensada-doy-pack-la-lechera-600-gr-3025276/p. Marca: LA LECHERA. Lleva a casa fácil y rápido Leche condensada LA LECHERA original doypack (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 11160, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33671341/Lache-Condensada-Doy-Pack-LA-LECHERA-600-gr-3045632_a.jpg?v=639166164181200000',
  true, 300
),
(
  'a1200000-0000-4000-a101-000000000302', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina JET chocolate con leche (176  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jet-oft-p12-ll16-176-gr-3210654/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET chocolate con leche (176 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 14400, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31299772/Chocolatina-JET-Oft-P12-Ll16-176-gr-3693645_a.jpg?v=638961641554900000',
  true, 301
),
(
  'a1200000-0000-4000-a101-000000000303', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina JET con lámina chocolate con leche (132  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-leche-jet-132-gr-3147031/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET con lámina chocolate con leche (132 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 12000, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31299431/Chocolatina-Leche-JET-132-gr-3479122_a.jpg?v=638961638715070000',
  true, 302
),
(
  'a1200000-0000-4000-a101-000000000304', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina JUMBO chocolate con maní (170  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-mani-x-17g-jumbo-170-gr-3145716/p. Marca: JUMBO. Lleva a casa fácil y rápido Chocolatina JUMBO chocolate con maní (170 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 13900, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/32493649/CHOCOLATINA-MANI-X-17G-JUMBO-170-gr-3474853_a.jpg?v=639064989940570000',
  true, 303
),
(
  'a1200000-0000-4000-a101-000000000305', 'b1100000-0000-4000-a110-000000000001', 'Bocadillo FRESCAMPO en hoja de bijao (414  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bocadillo-dulce-en-hoja-de-bij-frescampo-414-gr-3102769/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Bocadillo FRESCAMPO en hoja de bijao (414 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 6360, 'Dulces típicos', 'https://exitocol.vteximg.com.br/arquivos/ids/34023297/Bocadillo-Dulce-En-Hoja-De-Bij-FRESCAMPO-414-gr-3331366_a.jpg?v=639192957772300000',
  true, 304
),
(
  'a1200000-0000-4000-a101-000000000306', 'b1100000-0000-4000-a110-000000000001', 'Dulces QUIPITOS explosión pops (40  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/quipitos-40g-5und-486270/p. Marca: QUIPITOS. Lleva a casa fácil y rápido Dulces QUIPITOS explosión pops (40 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3160, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/33172293/Quipitos-40g-5und-832704_a.jpg?v=639124897031530000',
  true, 305
),
(
  'a1200000-0000-4000-a101-000000000307', 'b1100000-0000-4000-a110-000000000001', 'Chocolate Relleno Dubai JET JET Chocolatina (29  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolate-relleno-dubai-jet-jet-chocolatina-29-gr-3253811/p. Marca: JET. Lleva a casa fácil y rápido Chocolate Relleno Dubai JET JET Chocolatina (29 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 3800, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/33722984/Chocolate-Relleno-Dubai-JET-JET-Chocolatina-29-gr-3853156_a.jpg?v=639168742360070000',
  true, 306
),
(
  'a1200000-0000-4000-a101-000000000308', 'b1100000-0000-4000-a110-000000000001', 'Gomitas TRULULU Frutal Nanos (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gomitas-trululu-frutal-nanos-100-gr-3244663/p. Marca: TRULULU. Lleva a casa fácil y rápido Gomitas TRULULU Frutal Nanos (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3590, 'Masmelos y gomitas', 'https://exitocol.vteximg.com.br/arquivos/ids/32719240/Gomitas-TRULULU-Frutal-Nanos-100-gr-3820419_a.jpg?v=639087560083670000',
  true, 307
),
(
  'a1200000-0000-4000-a101-000000000309', 'b1100000-0000-4000-a110-000000000001', 'Galletas JET mini wafer con chocolate (20  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/golosina-jet-chocolate-6-gr-3207504/p. Marca: JET. Lleva a casa fácil y rápido Galletas JET mini wafer con chocolate (20 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 10900, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31965189/Golosina-JET-Chocolate-6-gr-3682094_a.jpg?v=639003143595370000',
  true, 308
),
(
  'a1200000-0000-4000-a101-000000000310', 'b1100000-0000-4000-a110-000000000001', 'Gomitas TRULULU oka loka con nanos (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gomas-trululu-frutal-nanos-oka-loka-100-gr-3175755/p. Marca: TRULULU. Lleva a casa fácil y rápido Gomitas TRULULU oka loka con nanos (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3590, 'Masmelos y gomitas', 'https://exitocol.vteximg.com.br/arquivos/ids/33635185/Gomas-TRULULU-Frutal-Nanos-Oka-Loka-100-gr-3567567_a.jpg?v=639161030298970000',
  true, 309
),
(
  'a1200000-0000-4000-a101-000000000311', 'b1100000-0000-4000-a110-000000000001', 'Arequipe DULCES DEL VALLE de café (210  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-de-cafe-dulces-del-valle-210-gr-3154654/p. Marca: DULCES DEL VALLE. Lleva a casa fácil y rápido Arequipe DULCES DEL VALLE de café (210 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 10950, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33672094/Arequipe-de-Cafe-DULCES-DEL-VALLE-210-gr-3509180_a.jpg?v=639166167324400000',
  true, 310
),
(
  'a1200000-0000-4000-a101-000000000312', 'b1100000-0000-4000-a110-000000000001', 'Gomitas  BON BON BUM sabor a fresa (45  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gomitas-bbb-24bs145g-bon-bon-bum-45-gr-3154168/p. Marca: BON BON BUM. Lleva a casa fácil y rápido Gomitas BON BON BUM sabor a fresa (45 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2230, 'Masmelos y gomitas', 'https://exitocol.vteximg.com.br/arquivos/ids/33173403/GOMITAS-BBB-24BS145g-BON-BON-BUM-45-gr-3506931_a.jpg?v=639124911801430000',
  true, 311
),
(
  'a1200000-0000-4000-a101-000000000313', 'b1100000-0000-4000-a110-000000000001', 'Caramelos HALLS extra fuerte mentol eucalipto (24.75  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caramelo-duro-mentol-eucalipto-halls-2475-gr-3148341/p. Marca: HALLS. Lleva a casa fácil y rápido Caramelos HALLS extra fuerte mentol eucalipto (24.75 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 1770, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/31327095/Caramelo-Duro-Mentol-Eucalipto-HALLS-2475-gr-3482833_a.jpg?v=638962275630070000',
  true, 312
),
(
  'a1200000-0000-4000-a101-000000000314', 'b1100000-0000-4000-a110-000000000001', 'Cocadas DULCES DEL VALLE de leche con coco (102  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/dulce-de-leche-con-coco-dulces-del-valle-102-gr-3141745/p. Marca: DULCES DEL VALLE. Lleva a casa fácil y rápido Cocadas DULCES DEL VALLE de leche con coco (102 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 7380, 'Dulces típicos', 'https://exitocol.vteximg.com.br/arquivos/ids/33678550/Dulce-de-Leche-con-Coco-DULCES-DEL-VALLE-102-gr-3460455_a.jpg?v=639166200884630000',
  true, 313
),
(
  'a1200000-0000-4000-a101-000000000315', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina LYNE chocolate con leche (108  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-leche-lyne-108-gr-3123172/p. Marca: LYNE. Lleva a casa fácil y rápido Chocolatina LYNE chocolate con leche (108 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 15850, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31299223/Chocolatina-Leche-LYNE-108-gr-3384792_a.jpg?v=638961637509670000',
  true, 314
),
(
  'a1200000-0000-4000-a101-000000000316', 'b1100000-0000-4000-a110-000000000001', 'Leche condensada FRESCAMPO doy pack (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-condensada-semidescremada-frescampo-300-gr-3121690/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche condensada FRESCAMPO doy pack (300 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6530, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33671828/Leche-Condensada-Semidescremada-FRESCAMPO-300-gr-3380211_a.jpg?v=639166166581000000',
  true, 315
),
(
  'a1200000-0000-4000-a101-000000000317', 'b1100000-0000-4000-a110-000000000001', 'Chicles TRIDENT sabor a menta (61.2  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/goma-de-mascar-menta-esp-und-trident-61200-gramo-3005346/p. Marca: TRIDENT. Lleva a casa fácil y rápido Chicles TRIDENT sabor a menta (61.2 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7880, 'Chicles', 'https://exitocol.vteximg.com.br/arquivos/ids/31326637/Goma-de-Mascar-Menta-Esp-Und-TRIDENT-61200-Gramo-3007940_a.jpg?v=638962273954130000',
  true, 316
),
(
  'a1200000-0000-4000-a101-000000000318', 'b1100000-0000-4000-a110-000000000001', 'Crema NUCITA sabor a leche, chocolate, nueces (84  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-844588/p. Marca: NUCITA. Lleva a casa fácil y rápido Crema NUCITA sabor a leche, chocolate, nueces (84 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 5390, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/33043465/Crema-1136738_a.jpg?v=639117066314330000',
  true, 317
),
(
  'a1200000-0000-4000-a101-000000000319', 'b1100000-0000-4000-a110-000000000001', 'Arequipe ALPINA vaso (220  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-alpina-x-220-gr-514518/p. Marca: ALPINA. Contenido suministrado a Almacenes Éxito directamente por ALPINA Arequipe Alpina 220g Características Arequipe Alpina 220g Beneficios Almacenamiento Modo de uso Advertencias',
  '🛒', 7700, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33676852/Arequipe-Alpina-X-220-gr-104759_a.jpg?v=639166193476200000',
  true, 318
),
(
  'a1200000-0000-4000-a101-000000000320', 'b1100000-0000-4000-a110-000000000001', 'Arequipe COLANTA dulce de leche (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-doy-pack-colanta-250-gr-493102/p. Marca: COLANTA. Lleva a casa fácil y rápido Arequipe COLANTA dulce de leche (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6660, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33670974/Arequipe-Doy-Pack-COLANTA-250-gr-60736_a.jpg?v=639166161004970000',
  true, 319
),
(
  'a1200000-0000-4000-a101-000000000321', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina JET con leche y chocolate blanco (144  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-de-leche-y-chocolate-blanco-x-12-und-258423/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET con leche y chocolate blanco (144 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 12000, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31323820/Chocolatina-De-Leche-Y-Chocolate-Blanco-X-12-Und-522396_a.jpg?v=638962263610930000',
  true, 320
),
(
  'a1200000-0000-4000-a101-000000000322', 'b1100000-0000-4000-a110-000000000001', 'Leche condensada LA LECHERA original doypack (420  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-cond-la-lechera-x-420g-220715/p. Marca: LA LECHERA. Leche Condensada Azucarada Semidescremada LA LECHERA® tiene la textura, la cremosidad y sabor único, ideal para tus preparaciones dulces y para acompañar tus comidas o bebidas favoritas. Encuentra recetas fáciles y deliciosas en www.recetasnestle.c',
  '🛒', 9800, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33670503/Leche-Cond-La-Lechera-X-420g-11486_a.jpg?v=639166157909370000',
  true, 321
),
(
  'a1200000-0000-4000-a101-000000000323', 'b1100000-0000-4000-a110-000000000001', 'Chupetas BON BON BUM surtidos con chicle (456  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bon-bon-bum-surtido-176617/p. Marca: BON BON BUM. Características Bonbonbum surtido de fresa y mandarina. Almacenamiento: mantener en un lugar fresco y seco.',
  '🛒', 12250, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/31298111/Bon-Bon-Bum-Surtido-165524_a.jpg?v=638961628878270000',
  true, 322
),
(
  'a1200000-0000-4000-a101-000000000324', 'b1100000-0000-4000-a110-000000000001', 'Leche condensada LA LECHERA original doypack (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-condensada-doy-pack-la-lechera-90-gramo-148448/p. Marca: LA LECHERA. Leche Condensada Azucarada Semidescremada LA LECHERA® tiene la textura, la cremosidad y sabor único que la hacen perfecta como topping, realzando con un toque dulce y delicioso tus postres, frutas y bebidas favoritas. Inspírate y c',
  '🛒', 2320, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33671180/LECHE-CONDENSADA-DOY-PACK-LA-LECHERA-90-Gramo-1749811_a.jpg?v=639166163262300000',
  true, 323
),
(
  'a1200000-0000-4000-a101-000000000325', 'b1100000-0000-4000-a110-000000000001', 'Arequipe ALPINA vaso (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-vaso-61330/p. Marca: ALPINA. Contenido suministrado a Almacenes Éxito directamente por ALPINA Arequipe Alpina 500g Características Arequipe Alpina 500g Beneficios Almacenamiento Modo de uso Advertencias',
  '🛒', 15800, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33676840/Arequipe-Vaso-20680_a.jpg?v=639166193368330000',
  true, 324
),
(
  'a1200000-0000-4000-a101-000000000326', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina Jumbo Dubai JUMBO Chocolatina (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jumbo-dubai-jumbo-chocolatina-90-gr-3253808/p. Marca: JUMBO. Lleva a casa fácil y rápido Chocolatina Jumbo Dubai JUMBO Chocolatina (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 10200, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/33722986/Chocolatina-Jumbo-Dubai-JUMBO-Chocolatina-90-gr-3853153_a.jpg?v=639168742373230000',
  true, 325
),
(
  'a1200000-0000-4000-a101-000000000327', 'b1100000-0000-4000-a110-000000000001', 'Caramelos HALLS duros sin azúcar mentol (15  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caramelos-halls-duros-xs-sin-azucar-mentol-euc-15-gr-3229067/p. Marca: HALLS. Lleva a casa fácil y rápido Caramelos HALLS duros sin azúcar mentol (15 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2960, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/33150620/Caramelos-HALLS-Duros-Xs-Sin-Azucar-Mentol-Euc-15-gr-3764408_a.jpg?v=639123822768970000',
  true, 326
),
(
  'a1200000-0000-4000-a101-000000000328', 'b1100000-0000-4000-a110-000000000001', 'Arequipe SUPERCOCO con deliciosos trocitos (220  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-coco-supercoco-220-gr-3227474/p. Marca: SUPERCOCO. Lleva a casa fácil y rápido Arequipe SUPERCOCO con deliciosos trocitos (220 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8040, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33672581/Arequipe-Coco-SUPERCOCO-220-gr-3759446_a.jpg?v=639166171564200000',
  true, 327
),
(
  'a1200000-0000-4000-a101-000000000329', 'b1100000-0000-4000-a110-000000000001', 'Chocolates JET gool baloncitos (81  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jet-chocolatina-gol-baloncitos-81-gr-3225746/p. Marca: JET. Lleva a casa fácil y rápido Chocolates JET gool baloncitos (81 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 7630, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/32918360/Chocolatina-JET-Chocolatina-Gol-Baloncitos-81-gr-3751981_a.jpg?v=639104784211400000',
  true, 328
),
(
  'a1200000-0000-4000-a101-000000000330', 'b1100000-0000-4000-a110-000000000001', 'Chocolatina JET con relleno de caramelo (108  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jet-caramelo-108-gr-3225639/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET con relleno de caramelo (108 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 7440, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/32549500/Chocolatina-JET-Caramelo-108-gr-3751831_a.jpg?v=639068705499930000',
  true, 329
),
(
  'a1200000-0000-4000-a101-000000000331', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos MIRRINGO fuente proteína (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-gato-original-adultos-mirringo-1-gr-3103989/p. Marca: MIRRINGO. Lleva a casa fácil y rápido Comida para gatos MIRRINGO fuente proteína (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 10950, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572562/Alimento-Para-Gato-Original-Adultos-MIRRINGO-1-gr-3335339_a.jpg?v=639070324288930000',
  true, 330
),
(
  'a1200000-0000-4000-a101-000000000332', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos DON KAT adulto (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-gato-adulto-don-kat-1000-gr-3149883/p. Marca: DON KAT. Lleva a casa fácil y rápido Comida para gatos DON KAT adulto (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 13750, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572753/Alimento-Gato-Adulto-DON-KAT-1000-gr-3488044_a.jpg?v=639070325540370000',
  true, 331
),
(
  'a1200000-0000-4000-a101-000000000333', 'b1100000-0000-4000-a110-000000000001', 'Arena para gatos Unikat super poderes lavanda (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arena-gato-3-super-poderes-lavanda-unikat-arena-unikat-aroma-lavand-4kg-6und-3144218/p. Marca: Unikat. Lleva a casa fácil y rápido Arena para gatos Unikat super poderes lavanda (4000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 16500, 'Comida peces, aves y otras mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32667548/Arena-Gato-3-Super-Poderes-Lavanda-Unikat-ARENA-UNIKAT-AROMA-LAVAND-4KG-6UND-3470333_a.jpg?v=639082499221400000',
  true, 332
),
(
  'a1200000-0000-4000-a101-000000000334', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos FELIX sabor surtido (680  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-surtido-felix-680-gr-3129235/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida para Gato FELIX Pack Surtido x8 - Sobres Características Alimento balanceado y completo húmedo para gatos adultos en mantenimiento Beneficios Textura irresistible Deliciosa SalsaDelic',
  '🍿', 19050, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32955080/Felix-Surtido-FELIX-680-gr-3408373_a.jpg?v=639110802195330000',
  true, 333
),
(
  'a1200000-0000-4000-a101-000000000335', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros CHUNKY adulto sabor a pollo (2000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-pollo-adulto-494602/p. Marca: CHUNKY. Lleva a casa fácil y rápido Comida para perros CHUNKY adulto sabor a pollo (2000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 19700, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/32568771/Alimento-Pollo-Adulto-110131_a.jpg?v=639070299867370000',
  true, 334
),
(
  'a1200000-0000-4000-a101-000000000336', 'b1100000-0000-4000-a110-000000000001', 'Alimento Para Perro PURINA DOG CHOW Todos Los Tamaños (2000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perro-purina-dog-chow-todos-los-tamanos-2000-gr-3250400/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida para perro Dog Chow Adulto todos los tamaños x 2 kg Características Alimento completo para perros adultos de razas medianas y gr',
  '🍿', 25950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33594700/Alimento-Para-Perro-PURINA-DOG-CHOW-Todos-Los-Tamanos-2000-gr-3839380_a.jpg?v=639159439583930000',
  true, 335
),
(
  'a1200000-0000-4000-a101-000000000337', 'b1100000-0000-4000-a110-000000000001', 'Pañitos húmedos PETYS para mascotas limpieza superior (80  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/panos-petys-humedos-mascotas-limpieza-supe-3238183/p. Marca: PETYS. Lleva a casa fácil y rápido Pañitos húmedos PETYS para mascotas limpieza superior (80 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 20350, 'Accesorios&nbsp;para mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32573023/Panos-PETYS-Humedos-Mascotas-Limpieza-Supe-3792232_a.jpg?v=639070328467100000',
  true, 336
),
(
  'a1200000-0000-4000-a101-000000000338', 'b1100000-0000-4000-a110-000000000001', 'Arena para gatos Unikat primavera (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arena-gatos-calabaza-arena-4000-gr-3224952/p. Marca: Unikat. Lleva a casa fácil y rápido Arena para gatos Unikat primavera (4000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 16600, 'Arenas para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32756540/Arena-Gatos-CALABAZA-Arena-4000-gr-3749496_a.jpg?v=639089392973400000',
  true, 337
),
(
  'a1200000-0000-4000-a101-000000000339', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros PEDIGREE húmedo adulto salmón arroz integral (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-humedo-perros-adultos-salmon-a-pedigree-100-gr-3183631/p. Marca: PEDIGREE. Lleva a casa fácil y rápido Comida para perros PEDIGREE húmedo adulto salmón arroz integral (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3300, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33502526/Alimento-Humedo-Perros-Adultos-Salmon-A-PEDIGREE-100-gr-3593663_a.jpg?v=639153313378900000',
  true, 338
),
(
  'a1200000-0000-4000-a101-000000000340', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros PEDIGREE húmedo adultos pavo y zanahoria (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-humedo-perro-adulto-todas-raza-pedigree-100-gr-3183456/p. Marca: PEDIGREE. Lleva a casa fácil y rápido Comida para perros PEDIGREE húmedo adultos pavo y zanahoria (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3300, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33502528/Alimento-Humedo-Perro-Adulto-Todas-Raza-PEDIGREE-100-gr-3592943_a.jpg?v=639153313394630000',
  true, 339
),
(
  'a1200000-0000-4000-a101-000000000341', 'b1100000-0000-4000-a110-000000000001', 'Snack para gatos Churu atún con salmón (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tuna-with-salmon-recipe-churu-56-gr-3158790/p. Marca: Churu. Lleva a casa fácil y rápido Snack para gatos Churu atún con salmón (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12600, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34115516/Tuna-With-Salmon-Recipe-Churu-56-gr-3526218_a.jpg?v=639198931989430000',
  true, 340
),
(
  'a1200000-0000-4000-a101-000000000342', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos MIRRINGO concentrado adulto (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-gato-pro-mirringo-1-kg-3092701/p. Marca: MIRRINGO. Lleva a casa fácil y rápido Comida para gatos MIRRINGO concentrado adulto (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 17600, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572518/Alimento-Gato-PRO-MIRRINGO-1-kg-3296101_a.jpg?v=639070323887200000',
  true, 341
),
(
  'a1200000-0000-4000-a101-000000000343', 'b1100000-0000-4000-a110-000000000001', 'Arena para gatos PUKÍ retiene la humedad (4500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arena-para-gatos-puki-sin-ref-3089921/p. Marca: PUKÍ. Lleva a casa fácil y rápido Arena para gatos PUKÍ retiene la humedad (4500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 14850, 'Comida peces, aves y otras mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32300287/Arena-para-gatos-PUKI-Sin-ref-3283975_a.jpg?v=639046900831670000',
  true, 342
),
(
  'a1200000-0000-4000-a101-000000000344', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos WHISKAS húmedo adulto pollo (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aliment-masc-humed-adult-pollo-whiskas-85-gr-3084547/p. Marca: WHISKAS. Lleva a casa fácil y rápido Comida para gatos WHISKAS húmedo adulto pollo (85 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 2930, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572343/Aliment-Masc-Humed-Adult-Pollo-WHISKAS-85-gr-3265535_a.jpg?v=639070322112630000',
  true, 343
),
(
  'a1200000-0000-4000-a101-000000000345', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos WHISKAS húmedo adulto salmón (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aliment-masc-humed-adult-salmn-whiskas-85-gr-3084546/p. Marca: WHISKAS. Lleva a casa fácil y rápido Comida para gatos WHISKAS húmedo adulto salmón (85 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 2930, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572338/Aliment-Masc-Humed-Adult-Salmn-WHISKAS-85-gr-3265534_a.jpg?v=639070322086400000',
  true, 344
),
(
  'a1200000-0000-4000-a101-000000000346', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros PURINA DOG CHOW adulto medianos y grandes (2000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-dog-chow-adultos-raza-mediana-x-2-kg-418657/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida para perro Dog Chow Adulto medianos y grandes x 2 kg Características Alimento completo para perros adultos de razas medianas y grandes de 1 a 7 a',
  '🍿', 19462, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612736/Alimento-Dog-Chow-Adultos-Raza-Mediana-X-2-kg-774875_a.jpg?v=639160249791770000',
  true, 345
),
(
  'a1200000-0000-4000-a101-000000000347', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos FELIX pate pavo y menudencias en salsa (156  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-pate-pavo-y-menudencias-x-156-gr-273212/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida para gatos FELIX pate pavo y menudencias en salsa (156 gr) Características Comida húmeda para Gatos Purina® Felix® Pavo y Menudencias x 156 gr Beneficios Alimento balancead',
  '🍿', 6050, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32966940/Felix-Pate-Pavo-Y-Menudencias-X-156-gr-924283_a.jpg?v=639111051878700000',
  true, 346
),
(
  'a1200000-0000-4000-a101-000000000348', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos FELIX pate pescado y atún en salsa (156  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-pate-pescado-y-atun-x-156-gr-273207/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida húmeda para Gatos Purina® Felix® Pate pescado y atun en salsa x 156 gr Características Comida húmeda para Gatos Purina® Felix® Pate pescado y atun en salsa x 156 gr Beneficios ',
  '🍿', 5810, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32955135/Felix-Pate-Pescado-Y-Atun-X-156-gr-922460_a.jpg?v=639110802421970000',
  true, 347
),
(
  'a1200000-0000-4000-a101-000000000349', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos FELIX pate salmón (156  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-pate-de-salmon-x-156-gr-273205/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida húmeda para Gatos Purina® Felix® Salmon x 156 gr Características Comida húmeda para Gatos Purina® Felix® Salmon x 156 gr Beneficios Alimento balanceado y completo húmedo para gatos ',
  '🍿', 5980, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32971403/Felix-Pate-De-Salmon-X-156-gr-919247_a.jpg?v=639111258770270000',
  true, 348
),
(
  'a1200000-0000-4000-a101-000000000350', 'b1100000-0000-4000-a110-000000000001', 'Alimento Para Perros PURINA DOG CHOW Multipack (595  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perros-purina-dog-chow-multipack-595-gr-3250514/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® pack surtido x 7 sobres Características ALIMENTO HÚMEDO COMPLETO Y BALANCEADO para perros adultos de todos l',
  '🍿', 17750, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33594698/Alimento-Para-Perros-PURINA-DOG-CHOW-Multipack-595-gr-3839653_a.jpg?v=639159439561500000',
  true, 349
),
(
  'a1200000-0000-4000-a101-000000000351', 'b1100000-0000-4000-a110-000000000001', 'Alimento Para Perro PURINA DOG CHOW Todos Los Tamaños (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perro-purina-dog-chow-todos-los-tamanos-4000-gr-3250399/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida para perro Dog Chow Adulto todos los tamaños x 4 kg Características Alimento completo para perros adultos de razas medianas y gr',
  '🍿', 38100, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33594699/Alimento-Para-Perro-PURINA-DOG-CHOW-Todos-Los-Tamanos-4000-gr-3839379_a.jpg?v=639159439573400000',
  true, 350
),
(
  'a1200000-0000-4000-a101-000000000352', 'b1100000-0000-4000-a110-000000000001', 'Snack cremoso DON KAT atún x4und (48  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/snack-cremoso-gatos-atun-4-unidades-don-kat-48-gr-3240401/p. Marca: DON KAT. Lleva a casa fácil y rápido Snack cremoso DON KAT atún x4und (48 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7690, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34118162/Snack-Cremoso-Gatos-Atun-4-Unidades-DON-KAT-48-gr-3799726_a.jpg?v=639199037233500000',
  true, 351
),
(
  'a1200000-0000-4000-a101-000000000353', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros PURINA DOG CHOW adultos cerdo pavo y pescado (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perros-adlt-multiproteinas-purina-dog-chow-85-gr-3238696/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® Multiproteínas x85g Características Alimento húmedo para Perros Purina® Dog Chow® que ayudan a su h',
  '🍿', 2950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612764/ALIMENTO-PARA-PERROS-ADLT-MULTIPROTEINAS-PURINA-DOG-CHOW-85-gr-3794275_a.jpg?v=639160249904330000',
  true, 352
),
(
  'a1200000-0000-4000-a101-000000000354', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros PURINA DOG CHOW adultos carne cerdo y pollo (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perros-adlt-alta-prot-purina-dog-chow-85-gr-3238695/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® Alta Proteína x85g Características Alimento húmedo para Perros Purina® Dog Chow® que ayudan a su hidrata',
  '🍿', 2950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612763/ALIMENTO-PARA-PERROS-ADLT-ALTA-PROT-PURINA-DOG-CHOW-85-gr-3794274_a.jpg?v=639160249891700000',
  true, 353
),
(
  'a1200000-0000-4000-a101-000000000355', 'b1100000-0000-4000-a110-000000000001', 'Comida para perros PURINA DOG CHOW adultos sabor pollo (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-perro-adlt-pollo-purina-dog-chow-85-gr-3238694/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® Nutrición Reforzada sabor a pollo x85g Características Alimento húmedo para perros Purina® Dog Chow® Nutrición Ref',
  '🍿', 2950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612774/ALIMENTO-PERRO-ADLT-POLLO-PURINA-DOG-CHOW-85-gr-3794273_a.jpg?v=639160249963670000',
  true, 354
),
(
  'a1200000-0000-4000-a101-000000000356', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos 7 VIDAS pescado y camarón (75  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/trozos-sabores-del-mar-12-7-vidas-75-gr-3227812/p. Marca: 7 VIDAS. Lleva a casa fácil y rápido Comida para gatos 7 VIDAS pescado y camarón (75 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3260, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32573004/Trozos-Sabores-del-Mar-12-7-VIDAS-75-gr-3760235_a.jpg?v=639070328297270000',
  true, 355
),
(
  'a1200000-0000-4000-a101-000000000357', 'b1100000-0000-4000-a110-000000000001', 'Comida para gatos 7 VIDAS cordero y pavo (75  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/trozos-sabores-de-tierra-12-7-vidas-75-gr-3227811/p. Marca: 7 VIDAS. Lleva a casa fácil y rápido Comida para gatos 7 VIDAS cordero y pavo (75 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3260, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32573003/Trozos-Sabores-de-Tierra-12-7-VIDAS-75-gr-3760234_a.jpg?v=639070328288970000',
  true, 356
),
(
  'a1200000-0000-4000-a101-000000000358', 'b1100000-0000-4000-a110-000000000001', 'Pañitos húmedos PUKÍ para mascotas (50  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/panitos-humedos-para-mascotas-puki-sin-ref-3226975/p. Marca: PUKÍ. Lleva a casa fácil y rápido Pañitos húmedos PUKÍ para mascotas (50 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 4100, 'Comida peces, aves y otras mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32904917/Panitos-Humedos-Para-Mascotas-PUKI-SIN-REF-3757389_a.jpg?v=639101472440970000',
  true, 357
),
(
  'a1200000-0000-4000-a101-000000000359', 'b1100000-0000-4000-a110-000000000001', 'Snack para gatos Churu sabor atún y cangrejo (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tuna-recipe-with-crab-flavor-churu-56-gr-3223635/p. Marca: Churu. Lleva a casa fácil y rápido Snack para gatos Churu sabor atún y cangrejo (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12600, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34115521/Tuna-Recipe-With-Crab-Flavor-Churu-56-gr-3745151_a.jpg?v=639198932027570000',
  true, 358
),
(
  'a1200000-0000-4000-a101-000000000360', 'b1100000-0000-4000-a110-000000000001', 'Snack para gatos Churu sabor a pollo y cangrejo (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chicken-with-crab-flavor-recipe-churu-56-gr-3223634/p. Marca: Churu. Lleva a casa fácil y rápido Snack para gatos Churu sabor a pollo y cangrejo (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12600, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34115520/Chicken-With-Crab-Flavor-Recipe-Churu-56-gr-3745150_a.jpg?v=639198932019800000',
  true, 359
),
(
  'a1200000-0000-4000-a101-000000000361', 'b1100000-0000-4000-a110-000000000001', 'Compota MAH frutos del bosque (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-infantiles-mah-90-gr-3158817/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH frutos del bosque (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/31863869/Compota-Infantiles-MAH-90-gr-3526301_a.jpg?v=638993548315600000',
  true, 360
),
(
  'a1200000-0000-4000-a101-000000000362', 'b1100000-0000-4000-a110-000000000001', 'Compota MAH frutos tropicales (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-infantiles-mah-90-gr-191425/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH frutos tropicales (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821215/Compota-Infantiles-MAH-90-gr-1664587_a.jpg?v=638918957601030000',
  true, 361
),
(
  'a1200000-0000-4000-a101-000000000363', 'b1100000-0000-4000-a110-000000000001', 'Compota MAH zanahoriabatatamanzana (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-infantiles-mah-90-gr-3158818/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH zanahoria-batata-manzana (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33543975/Compota-Infantiles-MAH-90-gr-3526302_a.jpg?v=639154430392930000',
  true, 362
),
(
  'a1200000-0000-4000-a101-000000000364', 'b1100000-0000-4000-a110-000000000001', 'Compota BABYFRUIT manzana (90  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compt-de-manzana-pouch-90g-babyfruit-90-ml-3121148/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT manzana (90 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2790, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33542229/COMPT-DE-MANZANA-POUCH-90g-BABYFRUIT-90-ml-3377347_a.jpg?v=639154423661000000',
  true, 363
),
(
  'a1200000-0000-4000-a101-000000000365', 'b1100000-0000-4000-a110-000000000001', 'Compota BABYFRUIT pera (90  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-de-pera-pouch-90g-babyfruit-90-ml-3121114/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT pera (90 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2790, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32476076/COMPOTA-DE-PERA-POUCH-90g-BABYFRUIT-90-ml-3377252_a.jpg?v=639063466940200000',
  true, 364
),
(
  'a1200000-0000-4000-a101-000000000366', 'b1100000-0000-4000-a110-000000000001', 'Compota MAH bananamanzana (82  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organica-banana-manzana-x-90-gr-892111/p. Marca: MAH. Características Producto: EDAD: desde los 6 meses. ORIGEN: Chile. PRESENTACIÓN: pouch de 90 gr Puré de 100% fruta orgánica, sin azúcar añadida. Ideal para empezar la alimentación complementaria a partir de los 6 meses e introducir banana en la ',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33521266/Compota-organica-banana-manzana-x-90-gr-1221748_a.jpg?v=639154191836370000',
  true, 365
),
(
  'a1200000-0000-4000-a101-000000000367', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE pera (104  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-pera-frasco-vidiro-san-jorge-113-gramo-716707/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE pera (104 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5180, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804651/Compota-Pera-Frasco-Vidiro-SAN-JORGE-113-Gramo-613807_a.jpg?v=638932257056570000',
  true, 366
),
(
  'a1200000-0000-4000-a101-000000000368', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE manzana (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-manzana-frasco-vidrio-716706/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE manzana (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4400, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33525608/COMPOTA-MANZANA-FRASCO-VIDRIO-613671_a.jpg?v=639154276321700000',
  true, 367
),
(
  'a1200000-0000-4000-a101-000000000369', 'b1100000-0000-4000-a110-000000000001', 'Compota BABY EVOLUTION orgánica peramanoespinaca (99  GR) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-pera-mango-espinaca-x-99gr-871551/p. Marca: BABY EVOLUTION. Características Caracteristicas del producto Ingredientes organicos 100% fruta y verdura organica Empaque practico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto Por ser un p',
  '🛒', 7640, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821122/Compota-Organic-Baby-Evolution-Pera-Mango-Espinaca-X-99gr-1191291_a.jpg?v=638918957053670000',
  true, 368
),
(
  'a1200000-0000-4000-a101-000000000370', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE mango (103  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-mango-frasco-vidrio-718442/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE mango (103 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5180, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33525611/COMPOTA-MANGO-FRASCO-VIDRIO-618897_a.jpg?v=639154276341170000',
  true, 369
),
(
  'a1200000-0000-4000-a101-000000000371', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE melocotón (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-melocoton-san-jorge-113-gramo-716900/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE melocotón (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5180, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804654/Compota-melocoton-SAN-JORGE-113-Gramo-615145_a.jpg?v=638932257077830000',
  true, 370
),
(
  'a1200000-0000-4000-a101-000000000372', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE con trocitos de mango (145  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-mango-trocitos-fruta-san-jorge-145-gr-566226/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE con trocitos de mango (145 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5430, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804648/Compota-Mango-Trocitos-Fruta-SAN-JORGE-145-gr-778673_a.jpg?v=638932257035700000',
  true, 371
),
(
  'a1200000-0000-4000-a101-000000000373', 'b1100000-0000-4000-a110-000000000001', 'Compota BABYFRUIT pera (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-de-durazno-babyfruit-103-ml-560235/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT pera (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3550, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33526448/Compota-De-Durazno-BABYFRUIT-103-ml-492775_a.jpg?v=639154287378570000',
  true, 372
),
(
  'a1200000-0000-4000-a101-000000000374', 'b1100000-0000-4000-a110-000000000001', 'Compota BABYFRUIT manzana (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-de-manzana-babyfruit-103-ml-560234/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT manzana (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3550, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32476074/Compota-De-Manzana-BABYFRUIT-103-ml-492438_a.jpg?v=639063466919300000',
  true, 373
),
(
  'a1200000-0000-4000-a101-000000000375', 'b1100000-0000-4000-a110-000000000001', 'Compota HEINZ frutas tropicales (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-fruta-tropical-504682/p. Marca: HEINZ. Lleva a casa fácil y rápido Compota HEINZ frutas tropicales (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821181/Compota-Fruta-Tropical-834838_a.jpg?v=638918957383800000',
  true, 374
),
(
  'a1200000-0000-4000-a101-000000000376', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE con trocitos de manzana (145  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-trocitos-de-manzana-san-jorge-145-gr-411996/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE con trocitos de manzana (145 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5430, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804639/Compota-Trocitos-De-Manzana-SAN-JORGE-145-gr-79632_a.jpg?v=638932256975630000',
  true, 375
),
(
  'a1200000-0000-4000-a101-000000000377', 'b1100000-0000-4000-a110-000000000001', 'Compota HEINZ melocotón (113  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-melocoton-frasco-309392/p. Marca: HEINZ. Características Advertencia: La leche materna es el mejor alimento para el niño. El producto proporcionado solo es complementario de la leche materna después de los primeros cuatro (4) meses de edad del niño. Ley 1397 de 1992. Colado Melocotón x 113g. Marca',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33521260/Compota-Melocoton-Frasco-610571_a.jpg?v=639154191771000000',
  true, 376
),
(
  'a1200000-0000-4000-a101-000000000378', 'b1100000-0000-4000-a110-000000000001', 'Compota BABY EVOLUTION orgánica manzanabananoarándano (99  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-org-manz-ban-fre-aran-baby-evolution-99-gramo-191430/p. Marca: BABY EVOLUTION. Lleva a casa fácil y rápido Compota BABY EVOLUTION orgánica manzana-banano-arándano (99 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8090, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821131/COMPOTA-ORG-MANZ-BAN-FRE-ARAN-BABY-EVOLUTION-99-Gramo-1664589_a.jpg?v=638918957136000000',
  true, 377
),
(
  'a1200000-0000-4000-a101-000000000379', 'b1100000-0000-4000-a110-000000000001', 'Compota MAH manzana (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pure-organico-love-manzana-185094/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH manzana (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821211/Pure-Organico-Love-Manzana-1479070_a.jpg?v=638918957573870000',
  true, 378
),
(
  'a1200000-0000-4000-a101-000000000380', 'b1100000-0000-4000-a110-000000000001', 'Compota GERBER de manzana  (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/comporta-de-manzana-x-113-g-13244/p. Marca: GERBER. Compota GERBER® de manzana orgánica, para bebés a partir de los 6 meses. No tiene azúcar añadida, ni harinas, ni espesantes, ni conservantes. Primeras compotas con el sello del Ministerio de Agricultura para productos orgánicos en Colombia',
  '🛒', 5570, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33264086/Comporta-De-Manzana-x-113-g-1741755_a.jpg?v=639131629790400000',
  true, 379
),
(
  'a1200000-0000-4000-a101-000000000381', 'b1100000-0000-4000-a110-000000000001', 'Compota MAH mangomanzana (82  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organica-mango-manzana-x-90-gr-892113/p. Marca: MAH. Características EDAD: desde los 8 meses. ORIGEN: Chile. PRESENTACIÓN: pouch de 90 gr. Puré de 100% fruta orgánica, sin azúcar añadida. Ideal para empezar la alimentación complementaria a partir de los 8 meses e introducir mango en la dieta de tu',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33521269/Compota-organica-mango-manzana-x-90-gr-1221749_a.jpg?v=639154191856070000',
  true, 380
),
(
  'a1200000-0000-4000-a101-000000000382', 'b1100000-0000-4000-a110-000000000001', 'Compota BABY EVOLUTION orgánica manzanacalabazazanahoria (99  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-manzana-calabaza-zanahoria-871542/p. Marca: BABY EVOLUTION. Caraceristicas Ingredientes orgánicos y naturales 100% Fruta y Verdura Orgánica Empaque práctico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto: Por ser un producto 100% natu',
  '🛒', 7540, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821141/Compota-Organic-Baby-Evolution-Manzana-calabaza-zanahoria-1191290_a.jpg?v=638918957192100000',
  true, 381
),
(
  'a1200000-0000-4000-a101-000000000383', 'b1100000-0000-4000-a110-000000000001', 'Formula infantil ENFAGROW alimento lácteo etapa 3 niños (1650  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/enfagrow-bib-x-1650-g-679799/p. Marca: ENFAGROW. Contenido suministrado a Almacenes Éxito directamente por Enfagrow Alimento Lácteo Enfagrow Premium Promental Natural Etapa 3 - Caja 1650 G1. lavarse las manos con agua y jabon antes de preparar la formula. 2. lave y enjuague los recipientes. Luego hiervalo',
  '🛒', 183760, 'Leche de fórmula', 'https://exitocol.vteximg.com.br/arquivos/ids/32773957/Enfagrow-Bib-X-1650-G-303879_a.jpg?v=639090053021600000',
  true, 382
),
(
  'a1200000-0000-4000-a101-000000000384', 'b1100000-0000-4000-a110-000000000001', 'Compota BABY EVOLUTION orgánica bananoduraznomango (70.213  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-banano-durazno-mango-x99gr-666506/p. Marca: BABY EVOLUTION. Características Caracteristicas del producto Ingredientes orgánicos y naturales 100% Fruta y Verdura Orgánica Empaque práctico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto ',
  '🛒', 7730, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29825140/Compota-Organic-Baby-Evolution-Banano-Durazno-Mango-X99gr-842060_a.jpg?v=638919074018470000',
  true, 383
),
(
  'a1200000-0000-4000-a101-000000000385', 'b1100000-0000-4000-a110-000000000001', 'Compota BABY EVOLUTION orgánica manzanapera (73.333  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-manzana-pera-x-99-gr-666505/p. Marca: BABY EVOLUTION. Características Caracteristicas del producto Ingredientes orgánicos y naturales 100% Fruta y Verdura Orgánica Empaque práctico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto Por se',
  '🛒', 7630, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29825135/Compota-Organic-Baby-Evolution-Manzana-Pera-X-99-gr-842032_a.jpg?v=638919073995430000',
  true, 384
),
(
  'a1200000-0000-4000-a101-000000000386', 'b1100000-0000-4000-a110-000000000001', 'Compota HEINZ pera (113  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-pera-frasco-253535/p. Marca: HEINZ. Compota Pera Frasco Caracteristicas Compota Pera Heinz. Marca: Heinz. Características: Compota Pera Heinz con vitaminas y minerales, colado, sin colorantes, sin sabores artificiales, este producto solo es complementario de la leche materna después de los seis me',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821199/Compota-Pera-Frasco-420193_a.jpg?v=638918957498470000',
  true, 385
),
(
  'a1200000-0000-4000-a101-000000000387', 'b1100000-0000-4000-a110-000000000001', 'Compota HEINZ manzana (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-manzana-frasco-253534/p. Marca: HEINZ. Compota Manzana Frasco Caracteristicas Compota Manzana Heinz. Marca: Heinz. Características: Compota Manzana Heinz con vitaminas y minerales, colado, sin colorantes, sin sabores artificiales, este producto solo es complementario de la leche materna después de',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821190/Compota-Manzana-Frasco-420192_a.jpg?v=638918957446730000',
  true, 386
),
(
  'a1200000-0000-4000-a101-000000000388', 'b1100000-0000-4000-a110-000000000001', 'Compota HEINZ coctel de frutas (113  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-frutas-frasco-253533/p. Marca: HEINZ. Compota Frutas Frasco Caracteristicas Compota Coctel de Frutas Heinz. Marca: Heinz. Características: Compota Coctel de Frutas Heinz con vitaminas y minerales, colado, sin colorantes, sin sabores artificiales, este producto solo es complementario de la leche ma',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33545276/Compota-Frutas-Frasco-420190_a.jpg?v=639154438923170000',
  true, 387
),
(
  'a1200000-0000-4000-a101-000000000389', 'b1100000-0000-4000-a110-000000000001', 'Compota BABY EVOLUTION orgánica banano avenacanela (99  Gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-org-ban-avena-canela-baby-evolution-99-gramo-191431/p. Marca: BABY EVOLUTION. Lleva a casa fácil y rápido Compota BABY EVOLUTION orgánica banano- avena-canela (99 Gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7980, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821126/COMPOTA-ORG-BAN-AVENA-CANELA-BABY-EVOLUTION-99-Gramo-1664590_a.jpg?v=638918957090130000',
  true, 388
),
(
  'a1200000-0000-4000-a101-000000000390', 'b1100000-0000-4000-a110-000000000001', 'Compota SAN JORGE sabores surtidos x3und (339  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/of-prepack-compota-surtida-san-jorge-113-gramo-61622/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE sabores surtidos x3und (339 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14950, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33526468/Of-Prepack-Compota-Surtida-SAN-JORGE-113-Gramo-1594800_a.jpg?v=639154287559770000',
  true, 389
),
(
  'a1200000-0000-4000-a102-000000000001', 'b1100000-0000-4000-a110-000000000002', '5 x Bananos Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bananos-x-5-124210755/p. Marca: SM. Compra 5 unidades de bananos PLU 639180. Se podra recibir en racimo o por separado.',
  '🥬', 1840, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/29424717/Banano.jpg?v=638893300681300000',
  true, 0
),
(
  'a1200000-0000-4000-a102-000000000002', 'b1100000-0000-4000-a110-000000000002', 'ZANAHORIA FRESCAMPO 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/zanahoria-frescampo-x-1000-gr-832824/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido ZANAHORIA FRESCAMPO 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 4896, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/27275906/Zanahoria-Frescampo-X-1000-gr-1256_a.jpg?v=638803147353700000',
  true, 1
),
(
  'a1200000-0000-4000-a102-000000000003', 'b1100000-0000-4000-a110-000000000002', 'Arandanos (blue berrie)  125  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arandanos-blue-berrie-x-125g-81676/p. Marca: SM. ',
  '🥬', 5610, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/33568587/Arandanos-blue-Berrie-X-125g-918197_a.jpg?v=639156540801500000',
  true, 2
),
(
  'a1200000-0000-4000-a102-000000000004', 'b1100000-0000-4000-a110-000000000002', 'Limón Tahití Malla TAEQ 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/limon-tahiti-malla-1000g-43309/p. Marca: TAEQ. Características El limón es un cítrico imprescindible en cualquier cocina,su zumo lleno de vitaminas sirve de base a muchos platos,es también un remedio casero e incluso se puede emplear como limpiador,se usa idealmente para preparar limonadas,refrescos y com',
  '🥬', 2800, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/24439575/Limon-Tahiti-Malla-1000g-594130_a.jpg?v=638609239734670000',
  true, 3
),
(
  'a1200000-0000-4000-a102-000000000005', 'b1100000-0000-4000-a110-000000000002', '4 x Tomates Chonto Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/4xtomates/p. Marca: SM. Compra 4 tomates PLU 639051',
  '🥬', 4352, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/29626429/Tomates.jpg?v=638907003421970000',
  true, 4
),
(
  'a1200000-0000-4000-a102-000000000006', 'b1100000-0000-4000-a110-000000000002', '4 x Cebolla Blanca o Cabezona Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/4xcebollas/p. Marca: SM. Compra 4 cebollas blancas con el PLU 706261',
  '🥬', 6336, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/29626428/Cebolla-blanca.jpg?v=638907001534430000',
  true, 5
),
(
  'a1200000-0000-4000-a102-000000000007', 'b1100000-0000-4000-a110-000000000002', '3 x Aguacate Hass Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/3-x-aguacate-hass/p. Marca: SM. Compra 3 aguacates hass PLU 990580.',
  '🥬', 4800, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/29608221/Aguacate-Hass.jpg?v=638905460714070000',
  true, 6
),
(
  'a1200000-0000-4000-a102-000000000008', 'b1100000-0000-4000-a110-000000000002', 'Manzana Bolsa Insuperable TAEQ 800  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/manzana-bolsa-taeq-taeq-800-gr-3126845/p. Marca: TAEQ. Lleva a casa fácil y rápido Manzana Bolsa Insuperable TAEQ 800 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 8500, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/27515861/Manzana-Bolsa-Taeq-TAEQ-800-gr-3400686_a.jpg?v=638828184815470000',
  true, 7
),
(
  'a1200000-0000-4000-a102-000000000009', 'b1100000-0000-4000-a110-000000000002', 'Mango Tommy  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/mango-tommy-unidad-967198/p. Marca: SM. Lleva a casa fácil y rápido Mango Tommy 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 5248, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666256/MANGO-TOMMY-UNIDAD-804861_a.jpg?v=639082476566700000',
  true, 8
),
(
  'a1200000-0000-4000-a102-000000000010', 'b1100000-0000-4000-a110-000000000002', 'Ajo Malla Importado x3   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ajo-importado-malla-paquete-x-3u-847268/p. Marca: SM. Características Producto: Blanqueador desinfectante Blancox al 5,25% de concentracion de Hipoclorito de Sodio. Sin aroma. Contiene 1000ml Beneficios: Mas efectivo, 5,25% de hipoclorito de Sodio. Elimina el 99,9% de bacterias. Almacenamiento: Almacenar ',
  '🥬', 832, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/33809942/Ajo-Importado-Malla-Paquete-X-3u-1519_a.jpg?v=639178195361700000',
  true, 9
),
(
  'a1200000-0000-4000-a102-000000000011', 'b1100000-0000-4000-a110-000000000002', 'Platano Insuperable FRESCAMPO 1600  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/platano-ekono-1-6kg-795763/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Platano Insuperable FRESCAMPO 1600 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 7500, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/33434809/Platano-Ekono-1-6kg-157710_a.jpg?v=639144751368630000',
  true, 10
),
(
  'a1200000-0000-4000-a102-000000000012', 'b1100000-0000-4000-a110-000000000002', 'CILANTRO  100  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cilantro-x-100gr-311546/p. Marca: SM. ',
  '🥬', 2112, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32665819/Cilantro-X-100gr-894373_a.jpg?v=639082473098830000',
  true, 11
),
(
  'a1200000-0000-4000-a102-000000000013', 'b1100000-0000-4000-a110-000000000002', 'Cebolla Junca  500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cebolla-junca-x-500g-311544/p. Marca: SM. Características Es muy utilizada en la gastronomía,para realzar sabores y condimentar las comidas. Es muy rica en vitamina A,B,C,E. ayuda a rebajar el colesterol,triglicéridos y el ácido úrico de la sangre y una gran variedad de minerales como níquel,potasio,bromo',
  '🥬', 5120, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/30606467/Cebolla-Junca-X-500g-894372_a.jpg?v=638924360517300000',
  true, 12
),
(
  'a1200000-0000-4000-a102-000000000014', 'b1100000-0000-4000-a110-000000000002', 'Papaya Und  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papaya-unidad-202138/p. Marca: SM. Lleva a casa fácil y rápido Papaya Und 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 7032, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666236/PAPAYA-UNIDAD-676025_a.jpg?v=639082476408530000',
  true, 13
),
(
  'a1200000-0000-4000-a102-000000000015', 'b1100000-0000-4000-a110-000000000002', 'Piña   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pina-unidad-200117/p. Marca: SM. Lleva a casa fácil y rápido Piña 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 6048, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/25416173/PINA-UNIDAD-768871_a.jpg?v=638657246151300000',
  true, 14
),
(
  'a1200000-0000-4000-a102-000000000016', 'b1100000-0000-4000-a110-000000000002', 'Cebolla Roja   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cebolla-roja-unidad-170530/p. Marca: SM. Lleva a casa fácil y rápido Cebolla Roja 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 992, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/25417005/CEBOLLA-ROJA-UNIDAD-1601916_a.jpg?v=638657255800900000',
  true, 15
),
(
  'a1200000-0000-4000-a102-000000000017', 'b1100000-0000-4000-a110-000000000002', 'Pepino Cohombro   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pepino-cohombro-unidad-170483/p. Marca: SM. ',
  '🥬', 1552, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666197/PEPINO-COHOMBRO-UNIDAD-1601909_a.jpg?v=639196459469300000',
  true, 16
),
(
  'a1200000-0000-4000-a102-000000000018', 'b1100000-0000-4000-a110-000000000002', 'Platano Maduro Und  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/platano-maduro-unidad-170467/p. Marca: SM. Lleva a casa fácil y rápido Platano Maduro Und 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 880, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666194/PLATANO-MADURO-UNIDAD-1601907_a.jpg?v=639082475974200000',
  true, 17
),
(
  'a1200000-0000-4000-a102-000000000019', 'b1100000-0000-4000-a110-000000000002', 'Pimentón  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pimenton-unidad-170015/p. Marca: SM. Lleva a casa fácil y rápido Pimentón 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 1744, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666188/PIMENTON-UNIDAD-1601902_a.jpg?v=639082475917400000',
  true, 18
),
(
  'a1200000-0000-4000-a102-000000000020', 'b1100000-0000-4000-a110-000000000002', 'Tomate Chonto Insuperable FRESCAMPO 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tomate-chonto-frescampo-x-1000-gr-120787/p. Marca: FRESCAMPO. Características Tomate Chonto. Marca: Ekono. Características: Tomate chonto. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco.',
  '🥬', 4580, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32665830/Tomate-Chonto-Frescampo-X-1000-gr-506130_a.jpg?v=639082473178570000',
  true, 19
),
(
  'a1200000-0000-4000-a102-000000000021', 'b1100000-0000-4000-a110-000000000002', 'PAPA FRESCAMPO 2000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-frescampo-x-2000-kg-111023/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido PAPA FRESCAMPO 2000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 5700, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/33841616/Papa-Frescampo-X-2000-kg-520468_a.jpg?v=639180211362070000',
  true, 20
),
(
  'a1200000-0000-4000-a102-000000000022', 'b1100000-0000-4000-a110-000000000002', '3 x Granadilla Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/3-x-granadilla/p. Marca: SM. Compra 3 granadillas PLU 639420',
  '🥬', 4656, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/30890999/Combos-Fruver.jpg?v=638936814114200000',
  true, 21
),
(
  'a1200000-0000-4000-a102-000000000023', 'b1100000-0000-4000-a110-000000000002', '12 x Tomates Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/https---www-exito-com-12-x-tomates-p/p. Marca: SM. Compra 12 unidades de Tomates PLU 639051',
  '🥬', 13056, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/30805519/Combo-Tomates.jpg?v=638932477501370000',
  true, 22
),
(
  'a1200000-0000-4000-a102-000000000024', 'b1100000-0000-4000-a110-000000000002', 'Manzana Combinada   TAEQ 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/manzana-mix-carulla-1000-gr-3056495/p. Marca: TAEQ. Lleva a casa fácil y rápido Manzana Combinada TAEQ 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 8640, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/24652543/Manzana-Mix-CARULLA-1000-gr-3161785_a.jpg?v=638619455179030000',
  true, 23
),
(
  'a1200000-0000-4000-a102-000000000025', 'b1100000-0000-4000-a110-000000000002', 'Manzana Verde Bolsa Insuperable TAEQ 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/manzana-verde-bolsa-carulla-1000-gr-3056464/p. Marca: TAEQ. Lleva a casa fácil y rápido Manzana Verde Bolsa Insuperable TAEQ 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 7600, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/27514315/Manzana-Verde-Bolsa-CARULLA-1000-gr-3161760_a.jpg?v=638827668156900000',
  true, 24
),
(
  'a1200000-0000-4000-a102-000000000026', 'b1100000-0000-4000-a110-000000000002', 'Cebolla Blanca  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cebolla-blanca-unidad-956928/p. Marca: SM. .',
  '🥬', 1584, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/25506183/CEBOLLA-BLANCA-UNIDAD-706261_a.jpg?v=638926220215630000',
  true, 25
),
(
  'a1200000-0000-4000-a102-000000000027', 'b1100000-0000-4000-a110-000000000002', 'Banano   1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/banano-unidad-937109/p. Marca: SM. ',
  '🥬', 368, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/32541000/Banano-Unidad-639180_a.jpg?v=639102198299970000',
  true, 26
),
(
  'a1200000-0000-4000-a102-000000000028', 'b1100000-0000-4000-a110-000000000002', 'Plátano Verde  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/platano-unidad-937108/p. Marca: SM. Lleva a casa fácil y rápido Plátano Verde 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 864, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666249/PLATANO-UNIDAD-639142_a.jpg?v=639082476517300000',
  true, 27
),
(
  'a1200000-0000-4000-a102-000000000029', 'b1100000-0000-4000-a110-000000000002', 'Tomate Chonto  1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tomate-chonto-unidad-937107/p. Marca: SM. Lleva a casa fácil y rápido Tomate Chonto 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 1088, 'Verduras y hortalizas', 'https://exitocol.vteximg.com.br/arquivos/ids/32666247/TOMATE-CHONTO-UNIDAD-639051_a.jpg?v=639082476503370000',
  true, 28
),
(
  'a1200000-0000-4000-a102-000000000030', 'b1100000-0000-4000-a110-000000000002', 'Fresa Extra   500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/fresa-extra-x-500gr-886957/p. Marca: SM. Compra Fresas Extra, seleccionadas con la mejor calidad para que disfrutes de la frescura del campo y al mejor precio. Pide las tuyas a domicilio. Consulta nuestra guia de sistema frescos para saber como conservar mejor tus frutas y verduras. Características',
  '🥬', 11392, 'Frutas', 'https://exitocol.vteximg.com.br/arquivos/ids/33833564/Fresa-Extra-X-500gr-1720_a.jpg?v=639180028367670000',
  true, 29
),
(
  'a1200000-0000-4000-a102-000000000031', 'b1100000-0000-4000-a110-000000000002', 'Milanesa de res  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/milanesa-res-644019/p. Marca: SM. Lleva a casa fácil y rápido Milanesa de res fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 37980, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33698553/MILANESA-RES-616300_a.jpg?v=639167828393200000',
  true, 30
),
(
  'a1200000-0000-4000-a102-000000000032', 'b1100000-0000-4000-a110-000000000002', 'Molida de res  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-especial-937-si-506771/p. Marca: SM. Molida Especial Res 93/7 SI* Características ¡Compra ahora! Y disfruta los beneficios de nuestra Molida especial res 97/3 SI* en cada porción, ideal para freír/asar/cocinar. Cuidadosamente seleccionada para brindarte una calidad sin igual. ¡Realiza tu compra par',
  '🥩', 29732, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681640/MOLIDA-ESPECIAL-937-SI-804733_a.jpg?v=639166317248330000',
  true, 31
),
(
  'a1200000-0000-4000-a102-000000000033', 'b1100000-0000-4000-a110-000000000002', 'Carne de res asar freír  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/carnes-asar-freir-si-498107/p. Marca: SM. Lleva a casa fácil y rápido Carne de res asar freír fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 30980, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681774/CARNES-ASAR-FREIR-SI-237700_a.jpg?v=639166318726870000',
  true, 32
),
(
  'a1200000-0000-4000-a102-000000000034', 'b1100000-0000-4000-a110-000000000002', 'Costilla de cerdo  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/costilla-cerdo-487824/p. Marca: SM. Lleva a casa fácil y rápido Costilla de cerdo fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 25980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681616/COSTILLA-CERDO-875493_a.jpg?v=639166317084400000',
  true, 33
),
(
  'a1200000-0000-4000-a102-000000000035', 'b1100000-0000-4000-a110-000000000002', 'Tocineta o tocino carnudo  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tocineta-487451/p. Marca: SM. Lleva a casa fácil y rápido Tocineta o tocino carnudo fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 25900, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33730093/TOCINETA-867994_a.jpg?v=639168892649930000',
  true, 34
),
(
  'a1200000-0000-4000-a102-000000000036', 'b1100000-0000-4000-a110-000000000002', 'Carne de cerdo  económica Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/brazo-cerdo-487141/p. Marca: SM. Lleva a casa fácil y rápido Carne de cerdo económica. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 17800, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681746/BRAZO-CERDO-860794_a.jpg?v=639166318376570000',
  true, 35
),
(
  'a1200000-0000-4000-a102-000000000037', 'b1100000-0000-4000-a110-000000000002', 'Lomo de cerdo o cañón  fresco Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomo-cerdo-486966/p. Marca: SM. Lleva a casa fácil y rápido Lomo de cerdo o cañón fresco. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 24980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33730092/LOMO-CERDO-855053_a.jpg?v=639168892636700000',
  true, 36
),
(
  'a1200000-0000-4000-a102-000000000038', 'b1100000-0000-4000-a110-000000000002', 'Lomo de cerdo o cañón  congelado porcionado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomo-de-cerdo-cc-437688/p. Marca: SM. LOMO DE CERDO C/C Características Descubre el delicioso sabor del lomo de cerdo c/c. Deléitate con cortes jugosos de máxima calidad que te brindarán una experiencia gastronómica excepcional. Nuestra variedad de cortes de lomo de cerdo son ideales para freír/asar/cocin',
  '🥩', 23980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681580/LOMO-DE-CERDO-CC-372437_a.jpg?v=639166316827230000',
  true, 37
),
(
  'a1200000-0000-4000-a102-000000000039', 'b1100000-0000-4000-a110-000000000002', 'Chuleta Económica de Cerdo  económica Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chuleta-de-cerdo-economica-367565/p. Marca: SM. Lleva a casa fácil y rápido Chuleta Económica de Cerdo económica. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 13424, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681935/CHULETA-DE-CERDO-ECONOMICA-917541_a.jpg?v=639166320383770000',
  true, 38
),
(
  'a1200000-0000-4000-a102-000000000040', 'b1100000-0000-4000-a110-000000000002', 'Pierna Pernil De Pollo I.Marin Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pernil-de-pollo-insuperable-742702/p. Marca: SM. Pierna Pernil De Pollo I.Marin Características Despierta tu chef interior y prepara la receta perfecta con nuestra pierna pernil de pollo i.marín. Convierte cada comida en una experiencia memorable para toda la familia. Elige la calidad y la jugosidad de nu',
  '🥩', 9900, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688462/Pernil-De-Pollo-Insuperable-22247_a.jpg?v=639166744604370000',
  true, 39
),
(
  'a1200000-0000-4000-a102-000000000041', 'b1100000-0000-4000-a110-000000000002', 'Molida de res TAEQ fresco (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-lv-taeq-450g-741724/p. Marca: TAEQ. Lleva a casa fácil y rápido Molida de res TAEQ fresco (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 18900, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681702/MOLIDA-LV-TAEQ-450g-1030607_a.jpg?v=639166317920100000',
  true, 40
),
(
  'a1200000-0000-4000-a102-000000000042', 'b1100000-0000-4000-a110-000000000002', 'Chuleta de cerdo  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chuleta-especial-cerdo-682213/p. Marca: SM. Chuleta De Cerdo Gnl Caracteristicas Chuleta especial cerdo. Una chuleta de cerdo es un corte de carne realizado chope al espinado del cerdo que suele contener chope o parte de una vértebra,que se sirve como porción individual. Las chuletas de cerdo pueden vende',
  '🥩', 20980, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33685538/Chuleta-Especial-Cerdo-754510_a.jpg?v=639166371632700000',
  true, 41
),
(
  'a1200000-0000-4000-a102-000000000043', 'b1100000-0000-4000-a110-000000000002', 'Pecho o carne de res para sudar  fresco Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pecho-522220/p. Marca: SM. Lleva a casa fácil y rápido Pecho o carne de res para sudar fresco. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 30480, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681825/PECHO-876865_a.jpg?v=639166319330600000',
  true, 42
),
(
  'a1200000-0000-4000-a102-000000000044', 'b1100000-0000-4000-a110-000000000002', 'Costilla de res  corriente Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/costilla-res-corriente-517408/p. Marca: SM. Lleva a casa fácil y rápido Costilla de res corriente. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 20383, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33687763/COSTILLA-RES-CORRIENTE-211363_a.jpg?v=639166412708000000',
  true, 43
),
(
  'a1200000-0000-4000-a102-000000000045', 'b1100000-0000-4000-a110-000000000002', 'Caderita de res o solomo extranjero  asar Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caderita-de-res-494402/p. Marca: SM. CADERITA DE RES ASAR Características Disfruta todo el sabor con nuestra caderita de res para asar, un corte de carne tierno y jugoso que transformará tus asados en experiencias culinarias inigualables. ¡Compra ahora y recógelo en nuestra tienda más cercana!&nbsp;',
  '🥩', 42980, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681635/CADERITA-DE-RES-104755_a.jpg?v=639166317207100000',
  true, 44
),
(
  'a1200000-0000-4000-a102-000000000046', 'b1100000-0000-4000-a110-000000000002', 'Tocino económico o tocino papada  fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papada-487452/p. Marca: SM. Lleva a casa fácil y rápido Tocino económico o tocino papada fresca. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 15480, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681535/Papada-868050_a.jpg?v=639166316266030000',
  true, 45
),
(
  'a1200000-0000-4000-a102-000000000047', 'b1100000-0000-4000-a110-000000000002', 'Pierna de cerdo o milanesa  fresco Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pierna-cerdo-corriente-486050/p. Marca: SM. Lleva a casa fácil y rápido Pierna de cerdo o milanesa fresco. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 16784, 'Carne de cerdo', 'https://exitocol.vteximg.com.br/arquivos/ids/33681740/PIERNA-CERDO-CORRIENTE-824446_a.jpg?v=639166318294170000',
  true, 46
),
(
  'a1200000-0000-4000-a102-000000000048', 'b1100000-0000-4000-a110-000000000002', 'Hígado de res  congelado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/higado-de-res-mp-476775/p. Marca: SM. Lleva a casa fácil y rápido Hígado de res congelado. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 11150, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33681533/Higado-De-Res-mp-45083_a.jpg?v=639166316232430000',
  true, 47
),
(
  'a1200000-0000-4000-a102-000000000049', 'b1100000-0000-4000-a110-000000000002', 'Nuggets de pollo FRESCAMPO apanados (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/nuggets-de-pollo-apanados-400158/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Nuggets de pollo FRESCAMPO apanados (300 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 10500, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688423/Nuggets-De-Pollo-Apanados-1444967_a.jpg?v=639166744181500000',
  true, 48
),
(
  'a1200000-0000-4000-a102-000000000050', 'b1100000-0000-4000-a110-000000000002', 'Pechuga de Pollo Marinada Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pechuga-marinada-281746/p. Marca: SM. Características Oferta Pechuga de Pollo Marinada. Marca: Pollocoa. Características: Medias pechugas congeladas de 6 a 8 unidades. Almacenamiento: Manténgase congelado para su conservación. Después de abierto consumirse en el menor tiempo posible.',
  '🥩', 14290, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688460/Pechuga-Marinada-599530_a.jpg?v=639166744562070000',
  true, 49
),
(
  'a1200000-0000-4000-a102-000000000051', 'b1100000-0000-4000-a110-000000000002', 'Filete de pechuga FRIKO HF marinado (850  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/filete-de-pechuga-de-10-unds-35563/p. Marca: FRIKO HF. CARACTERISTICAS Producto: Contiene 10 unidades de 1/2 Filetes de Pechuga abiertos marinados,empacados en bolsa. Beneficios: Cada filete viene empacado en bolsa individual, facilitando la separacion al estar congelado. Almacenamiento: Consérvese congel',
  '🥩', 32600, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688430/FILETE-DE-PECHUGA-DE-10-UNDS-237859_a.jpg?v=639166744250600000',
  true, 50
),
(
  'a1200000-0000-4000-a102-000000000052', 'b1100000-0000-4000-a110-000000000002', 'Churrasco FRIKO HF de pollo (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/churrasco-de-pollo-friko-x500-g-friko-hf-500-gr-3232718/p. Marca: FRIKO HF. Lleva a casa fácil y rápido Churrasco FRIKO HF de pollo (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 10500, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33684780/Churrasco-de-pollo-friko-x500-g-FRIKO-HF-500-gr-3778609_a.jpg?v=639166364539930000',
  true, 51
),
(
  'a1200000-0000-4000-a102-000000000053', 'b1100000-0000-4000-a110-000000000002', 'Filete de pechuga FRESCAMPO marinado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/filete-de-pechuga-de-pollo-frescampo-3122598/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Filete de pechuga FRESCAMPO marinado. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 30400, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33683872/Filete-de-Pechuga-de-Pollo-FRESCAMPO-3383007_a.jpg?v=639166358107370000',
  true, 52
),
(
  'a1200000-0000-4000-a102-000000000054', 'b1100000-0000-4000-a110-000000000002', 'Muslos de Pollo Marinado FRESCAMPO 750  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/muslos-de-pollo-marinado-frescampo-750-gr-3122597/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Muslos de Pollo Marinado FRESCAMPO 750 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 12900, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33683869/Muslos-de-Pollo-Marinado-FRESCAMPO-750-gr-3383006_a.jpg?v=639166358096530000',
  true, 53
),
(
  'a1200000-0000-4000-a102-000000000055', 'b1100000-0000-4000-a110-000000000002', 'Molida de res FRESCAMPO fresca (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-8020-lv-ev-frescampo-450-gr-3070492/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Molida de res FRESCAMPO fresca (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 12400, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33683450/molida-8020-lv-ev-FRESCAMPO-450-gr-3206849_a.jpg?v=639166355486600000',
  true, 54
),
(
  'a1200000-0000-4000-a102-000000000056', 'b1100000-0000-4000-a110-000000000002', 'Trozo De Pollo Marinado* SMN 900  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/trozo-de-pollo-marinado-smn-900-gr-853494/p. Marca: SMN. Lleva a casa fácil y rápido Trozo De Pollo Marinado* SMN 900 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 10400, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33683024/TROZO-DE-POLLO-MARINADO-SMN-900-gr-1702502_a.jpg?v=639166345698930000',
  true, 55
),
(
  'a1200000-0000-4000-a102-000000000057', 'b1100000-0000-4000-a110-000000000002', 'Pechuga Pollo Campesina Marina AQUA Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pechuga-pollo-campesina-836282/p. Marca: AQUA. Pechuga Pollo Campesina Marina Características Disfruta los beneficios de nuestra pechuga de pollo campesina marinada. Cortes frescos y sin procesar, para platos irresistibles, llevando a tu cocina la esencia de la tradición. ¡Compra ahora y recibe en casa!',
  '🥩', 15900, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33688465/Pechuga-Pollo-Campesina-152478_a.jpg?v=639166744635030000',
  true, 56
),
(
  'a1200000-0000-4000-a102-000000000058', 'b1100000-0000-4000-a110-000000000002', 'Pollo PROMOCION entero despresado (1800  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pollo-entero-despresado-815478/p. Marca: PROMOCION. Lleva a casa fácil y rápido Pollo PROMOCION entero despresado (1800 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 20560, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33682153/POLLO-ENTERO-DESPRESADO-1580900_a.jpg?v=639166322946100000',
  true, 57
),
(
  'a1200000-0000-4000-a102-000000000059', 'b1100000-0000-4000-a110-000000000002', 'Muslo Pollo Blanco Und Marinad PROMOCION 1  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/muslo-pollo-blanco-und-marinad-promocion-1-und-744667/p. Marca: PROMOCION. Lleva a casa fácil y rápido Muslo Pollo Blanco Und Marinad PROMOCION 1 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 1200, 'Pollo', 'https://exitocol.vteximg.com.br/arquivos/ids/33682786/Muslo-Pollo-Blanco-Und-Marinad-PROMOCION-1-und-1037525_a.jpg?v=639166339410700000',
  true, 58
),
(
  'a1200000-0000-4000-a102-000000000060', 'b1100000-0000-4000-a110-000000000002', 'Molida de res TAEQ fresca (950  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/molida-lv-taeq-x-950-g-741725/p. Marca: TAEQ. Lleva a casa fácil y rápido Molida de res TAEQ fresca (950 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 35850, 'Carne de res', 'https://exitocol.vteximg.com.br/arquivos/ids/33682063/Molida-lv-taeq-x-950-g-1030608_a.jpg?v=639166322513300000',
  true, 59
),
(
  'a1200000-0000-4000-a102-000000000061', 'b1100000-0000-4000-a110-000000000002', 'Leche deslactosada FRESCAMPO semidescremada UHT paquete (5400  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-frescampo-uht-semi-deslactosada-5400-ml-3225373/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche deslactosada FRESCAMPO semidescremada UHT paquete (5400 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18600, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672552/Leche-FRESCAMPO-Uht-Semi-Deslactosada-5400-ml-3750922_a.jpg?v=639166171330400000',
  true, 60
),
(
  'a1200000-0000-4000-a102-000000000062', 'b1100000-0000-4000-a110-000000000002', 'Queso crema COLANTA fresco semiblando (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-crema-x-400g-101497/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso crema COLANTA fresco semiblando (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 10600, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33670293/Queso-Crema-X-400g-895557_a.jpg?v=639166156163830000',
  true, 61
),
(
  'a1200000-0000-4000-a102-000000000063', 'b1100000-0000-4000-a110-000000000002', 'Leche FRESCAMPO entera UHT paquete (5400  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-frescampo-uht-entera-5400-ml-3225371/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche FRESCAMPO entera UHT paquete (5400 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18500, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672550/Leche-FRESCAMPO-Uht-Entera-5400-ml-3750920_a.jpg?v=639166171308300000',
  true, 62
),
(
  'a1200000-0000-4000-a102-000000000064', 'b1100000-0000-4000-a110-000000000002', 'Leche FRESCAMPO entera UHT maxilitro paquete (6600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-frescampo-uht-entera-6600-ml-3225369/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche FRESCAMPO entera UHT maxilitro paquete (6600 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22620, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672548/Leche-FRESCAMPO-Uht-Entera-6600-ml-3750918_a.jpg?v=639166171285800000',
  true, 63
),
(
  'a1200000-0000-4000-a102-000000000065', 'b1100000-0000-4000-a110-000000000002', 'Leche ALQUERIA semidescremada deslactosada sixpack (6000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-alqueria-semidescremada-deslactosada-sixpack-6000-ml-3188872/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Leche ALQUERIA semidescremada deslactosada sixpack (6000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 26920, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33678845/Leche-ALQUERIA-Semidescremada-Deslactosada-Sixpack-6000-ml-3616196_a.jpg?v=639166202195030000',
  true, 64
),
(
  'a1200000-0000-4000-a102-000000000066', 'b1100000-0000-4000-a110-000000000002', 'Crema de leche ALQUERIA semientera (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-leche-semi-entera-alqueria-400-gr-3096922/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Crema de leche ALQUERIA semientera (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8800, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33678453/Crema-Leche-Semi-Entera-ALQUERIA-400-gr-3313023_a.jpg?v=639166200361700000',
  true, 65
),
(
  'a1200000-0000-4000-a102-000000000067', 'b1100000-0000-4000-a110-000000000002', 'Leche COLANTA uht entera (6000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-uht-entera-colanta-6000-ml-3069107/p. Marca: COLANTA. Lleva a casa fácil y rápido Leche COLANTA uht entera (6000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 32600, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33671545/Leche-Uht-Entera-COLANTA-6000-ml-3202769_a.jpg?v=639166164985770000',
  true, 66
),
(
  'a1200000-0000-4000-a102-000000000068', 'b1100000-0000-4000-a110-000000000002', 'Jamón  COLANTA seleccionado (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-seleccionado-colanta-450-gr-3059799/p. Marca: COLANTA. Lleva a casa fácil y rápido Jamón COLANTA seleccionado (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 17050, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/31963274/Jamon-Seleccionado-COLANTA-450-gr-3165440_a.jpg?v=639003121860230000',
  true, 67
),
(
  'a1200000-0000-4000-a102-000000000069', 'b1100000-0000-4000-a110-000000000002', 'Salchicha ranchera RANCHERA premium x14und (480  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salchicha-ranchera-x-480-g-749935/p. Marca: RANCHERA. Lleva a casa fácil y rápido Salchicha ranchera RANCHERA premium x14und (480 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 26000, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/33876336/Salchicha-Ranchera-X-480-G-1047205_a.jpg?v=639186034613470000',
  true, 68
),
(
  'a1200000-0000-4000-a102-000000000070', 'b1100000-0000-4000-a110-000000000002', 'Huevos AA KIKES Rojo Pet (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-aa-rojo-30und-pet-744836/p. Marca: KIKES. Lleva a casa fácil y rápido Huevos AA KIKES Rojo Pet (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 23800, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/32900846/Huevo-Aa-Rojo-30und-Pet-1037843_a.jpg?v=639101333554500000',
  true, 69
),
(
  'a1200000-0000-4000-a102-000000000071', 'b1100000-0000-4000-a110-000000000002', 'Huevos A SMN rojo (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-rojo-a-x-30-insuperable-742696/p. Marca: SMN. Lleva a casa fácil y rápido Huevos A SMN rojo (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 10990, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/32892558/Huevo-Rojo-A-X-30-Insuperable-1032680_a.jpg?v=639100640567770000',
  true, 70
),
(
  'a1200000-0000-4000-a102-000000000072', 'b1100000-0000-4000-a110-000000000002', 'Huevos AA SMN rojo (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aa-rojo-de-30-amarr-avicola-triple-a-30-und-662450/p. Marca: SMN. Lleva a casa fácil y rápido Huevos AA SMN rojo (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 14900, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/33285898/AA-ROJO-DE-30-AMARR-AVICOLA-TRIPLE-A-30-und-429693_a.jpg?v=639135796352430000',
  true, 71
),
(
  'a1200000-0000-4000-a102-000000000073', 'b1100000-0000-4000-a110-000000000002', 'Alimento lácteo BON YURT zucaritas x4 und 170 g (680  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-lacteo-con-cereal-paq-x-4-unds-531236/p. Marca: BON YURT. Lleva a casa fácil y rápido Alimento lácteo BON YURT zucaritas x4 und 170 g (680 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 18650, 'Yogurt y bebidas lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33670153/Alimento-Lacteo-Con-Cereal-Paq-X-4-Unds-258583_a.jpg?v=639166153693500000',
  true, 72
),
(
  'a1200000-0000-4000-a102-000000000074', 'b1100000-0000-4000-a110-000000000002', 'Huevos AA NAPOLES rojo (30  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-napoles-de-30u-aa-rosado-subasta-30-und-496267/p. Marca: NAPOLES. Lleva a casa fácil y rápido Huevos AA NAPOLES rojo (30 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 23000, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/32919483/HUEVO-NAPOLES-DE-30U-AA-ROSADO-SUBASTA-30-und-172836_a.jpg?v=639104823133270000',
  true, 73
),
(
  'a1200000-0000-4000-a102-000000000075', 'b1100000-0000-4000-a110-000000000002', 'Queso KRAFT Fresco Semigraso Semiduro (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-kraft-fresco-semigraso-semiduro-250-gr-3251367/p. Marca: KRAFT. Lleva a casa fácil y rápido Queso KRAFT Fresco Semigraso Semiduro (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8800, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33820077/Queso-KRAFT-Fresco-Semigraso-Semiduro-250-gr-3843165_a.jpg?v=639179095340670000',
  true, 74
),
(
  'a1200000-0000-4000-a102-000000000076', 'b1100000-0000-4000-a110-000000000002', 'Crema de leche ALQUERIA ideal para preparaciones calientes (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-alqueria-leche-semientera-uat-400-gr-3193936/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Crema de leche ALQUERIA ideal para preparaciones calientes (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8400, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33678930/Crema-ALQUERIA-LECHE-SEMIENTERA-UAT-400-gr-3630447_a.jpg?v=639166202572570000',
  true, 75
),
(
  'a1200000-0000-4000-a102-000000000077', 'b1100000-0000-4000-a110-000000000002', 'Leche sabor original ALQUERIA pack x 6 unds (6000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-alqueria-semidescremada-original-sixpack-6000-ml-3188875/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Leche sabor original ALQUERIA pack x 6 unds (6000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 33650, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33672305/Leche-ALQUERIA-Semidescremada-Original-Sixpack-6000-ml-3616199_a.jpg?v=639166169220370000',
  true, 76
),
(
  'a1200000-0000-4000-a102-000000000078', 'b1100000-0000-4000-a110-000000000002', 'Huevos AA NAPOLES libre jaula (1  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-subasta-libre-jaula-1-und-3184726/p. Marca: NAPOLES. Lleva a casa fácil y rápido Huevos AA NAPOLES libre jaula (1 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 21500, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/33563992/huevo-SUBASTA-libre-jaula-1-und-3598388_a.jpg?v=639155764002130000',
  true, 77
),
(
  'a1200000-0000-4000-a102-000000000079', 'b1100000-0000-4000-a110-000000000002', 'Salchicha CASA BLANCA premium (480  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salchicha-ahumada-parrillera-casa-blanca-480-gr-3172233/p. Marca: CASA BLANCA. Lleva a casa fácil y rápido Salchicha CASA BLANCA premium (480 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 15900, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/33864360/Salchicha-Ahumada-Parrillera-CASA-BLANCA-480-gr-3554086_a.jpg?v=639184432382230000',
  true, 78
),
(
  'a1200000-0000-4000-a102-000000000080', 'b1100000-0000-4000-a110-000000000002', 'Queso mozzarella EXITO MARCA PROPIA tajado (800  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-exito-exito-marca-propia-800-gr-3147133/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Queso mozzarella EXITO MARCA PROPIA tajado (800 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19980, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33672053/Queso-Mozzarella-Exito-EXITO-MARCA-PROPIA-800-gr-3479458_a.jpg?v=639166167129600000',
  true, 79
),
(
  'a1200000-0000-4000-a102-000000000081', 'b1100000-0000-4000-a110-000000000002', 'Crema de leche ALQUERIA semientera (180  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-leche-semi-entera-alqueria-180-gr-3096923/p. Marca: ALQUERIA. Lleva a casa fácil y rápido Crema de leche ALQUERIA semientera (180 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4760, 'Cremas de leche, queso cremas y sueros', 'https://exitocol.vteximg.com.br/arquivos/ids/33678445/Crema-Leche-Semi-Entera-ALQUERIA-180-gr-3313024_a.jpg?v=639166200326800000',
  true, 80
),
(
  'a1200000-0000-4000-a102-000000000082', 'b1100000-0000-4000-a110-000000000002', 'Queso mozzarella EXITO MARCA PROPIA tajado (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-tajado-exito-marca-propia-400-gr-3088958/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Queso mozzarella EXITO MARCA PROPIA tajado (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13980, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33675991/Queso-Mozzarella-Tajado-EXITO-MARCA-PROPIA-400-gr-3280456_a.jpg?v=639166187043100000',
  true, 81
),
(
  'a1200000-0000-4000-a102-000000000083', 'b1100000-0000-4000-a110-000000000002', 'Queso parmesano EXITO MARCA PROPIA madurado (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-parmesano-exito-marca-propia-100-gr-3088957/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Queso parmesano EXITO MARCA PROPIA madurado (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6940, 'Quesos, quesitos y cuajadas', 'https://exitocol.vteximg.com.br/arquivos/ids/33675985/Queso-Parmesano-EXITO-MARCA-PROPIA-100-gr-3280455_a.jpg?v=639166187027230000',
  true, 82
),
(
  'a1200000-0000-4000-a102-000000000084', 'b1100000-0000-4000-a110-000000000002', 'Leche deslactosada ALPINA bolsa x6und 1100ml (6600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-deslactosada-sixpack-en-bolsa-x-11-litros-cu-957267/p. Marca: ALPINA. Características Leche Semidescremada Deslactosada UHT Larga Vida Paq x 6und (1.1Lt c/u). Marca: Alpina. Características: Leche semidescremada deslactosada UHT, sin preservantes, larga vida, maxilitro. Almacenamiento: Después de ab',
  '🛒', 37950, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33676739/Leche-Deslactosada-Sixpack-En-Bolsa-X-11-Litros-Cu-576258_a.jpg?v=639166192760000000',
  true, 83
),
(
  'a1200000-0000-4000-a102-000000000085', 'b1100000-0000-4000-a110-000000000002', 'Leche deslactosada COLANTA x6und (6600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-semidescremada-sixpack-en-bolsa-x-11-litros-cu-953434/p. Marca: COLANTA. Características Leche deslactosada colanta 6 unidades c-u x 1","1 litro en bolsa. Leche UAT larga vida adicionada con vitaminas A y D3 sin conservantes. La leche garantiza mayor porcentaje de proteína,producto fresco y natural,',
  '🛒', 34950, 'Leche', 'https://exitocol.vteximg.com.br/arquivos/ids/33676447/Leche-Semidescremada-Sixpack-En-Bolsa-X-11-Litros-Cu-122939_a.jpg?v=639166190161970000',
  true, 84
),
(
  'a1200000-0000-4000-a102-000000000086', 'b1100000-0000-4000-a110-000000000002', 'Huevos AAA KIKES rojo pet (15  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/huevo-rojo-aaa-15und-pet-895234/p. Marca: KIKES. Lleva a casa fácil y rápido Huevos AAA KIKES rojo pet (15 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 9900, 'Huevos', 'https://exitocol.vteximg.com.br/arquivos/ids/31986847/Huevo-Rojo-Aaa-15und-Pet-1232624_a.jpg?v=639005637481070000',
  true, 85
),
(
  'a1200000-0000-4000-a102-000000000087', 'b1100000-0000-4000-a110-000000000002', 'Kumis ALPINA bolsa (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/kumis-el-original-en-bolsa-x-1000-gr-878500/p. Marca: ALPINA. Lleva a casa fácil y rápido Kumis ALPINA bolsa (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 10200, 'Yogurt y bebidas lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33676773/Kumis-El-Original-En-Bolsa-X-1000-gr-818003_a.jpg?v=639166193003600000',
  true, 86
),
(
  'a1200000-0000-4000-a102-000000000088', 'b1100000-0000-4000-a110-000000000002', 'Chorizo COLANTA santarrosano (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chorizo-santarrosano-premium-x-500g-732892/p. Marca: COLANTA. CARACTERISTICA Chorizo de cerdo Santarrosano. Recomendaciones de uso: asar o freír. Conservación: manténgase en un lugar limpio y fresco,refrigerar de 0 a 4°C. Después de abierto,consúmase lo más pronto posible.',
  '🥩', 20400, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/31960851/Chorizo-Santarrosano-Premium-X-500g-679494_a.jpg?v=639003091092930000',
  true, 87
),
(
  'a1200000-0000-4000-a102-000000000089', 'b1100000-0000-4000-a110-000000000002', 'Jamón  PIETRAN de cerdo (230  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-estandar-libre-de-grasa-reducido-en-sodio-x-230g-711974/p. Marca: PIETRAN. Nombre del producto: Jamon PIETRAN de Cerdo 230 Gr Características del producto: Delicioso jamón de cerdo sin conservantes, buena fuente de proteína, 97% libre de grasa y 25% reducido en sodio. Con empaque abre fácil que te b',
  '🥩', 14950, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/31486116/Jamon-Estandar-Libre-De-Grasa-Reducido-En-Sodio-X-230g-342208_a.jpg?v=638974567543030000',
  true, 88
),
(
  'a1200000-0000-4000-a102-000000000090', 'b1100000-0000-4000-a110-000000000002', 'Salchichón Cerveroni ZENU 900  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salchichon-x-900-gr-684774/p. Marca: ZENU. Lleva a casa fácil y rápido Salchichón Cerveroni ZENU 900 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 25500, 'Carnes frías y embutidos', 'https://exitocol.vteximg.com.br/arquivos/ids/33876325/Salchichon-X-900-gr-246751_a.jpg?v=639186034563130000',
  true, 89
),
(
  'a1200000-0000-4000-a102-000000000091', 'b1100000-0000-4000-a110-000000000002', 'Galletas DUCALES x8 tacos (700  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galletas-ducales-ducales-tc-x-8-700gr-700-gr-3197630/p. Marca: DUCALES. Lleva a casa fácil y rápido Galletas DUCALES x8 tacos (700 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14350, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/33502652/Galletas-DUCALES-DUCALES-TC-X-8-700GR-700-gr-3640324_a.jpg?v=639153314189870000',
  true, 90
),
(
  'a1200000-0000-4000-a102-000000000092', 'b1100000-0000-4000-a110-000000000002', 'Aceite FRESCAMPO vegetal multiusos (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-vegetal-frescampo-3000-ml-3082931/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite FRESCAMPO vegetal multiusos (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 20850, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/33173636/Aceite-Vegetal-FRESCAMPO-3000-ml-3257073_a.jpg?v=639124918504470000',
  true, 91
),
(
  'a1200000-0000-4000-a102-000000000093', 'b1100000-0000-4000-a110-000000000002', 'Sal REFISAL alta pureza  (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/sal-refinada-1000-gr-345053/p. Marca: REFISAL. Lleva a casa fácil y rápido Sal REFISAL alta pureza (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2910, 'Sal', 'https://exitocol.vteximg.com.br/arquivos/ids/32006772/Sal-Refinada-1000-gr-125407_a.jpg?v=639010821199030000',
  true, 92
),
(
  'a1200000-0000-4000-a102-000000000094', 'b1100000-0000-4000-a110-000000000002', 'Chocolate CORONA tradicional pastillado (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolate-de-mesa-corona-tradicional-pastillado-450-gr-3190994/p. Marca: CORONA. Contenido suministrado a Almacenes Éxito directamente por NUTRESA Chocolate Características "Las presentaciones del producto estarán sujetas a disponibilidad del inventario al momento de la entrega de su compra".',
  '🥛', 15600, 'Café, chocolate y cremas no lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33502603/Chocolate-de-mesa-CORONA-TRADICIONAL-PASTILLADO-450-gr-3622642_a.jpg?v=639153313873930000',
  true, 93
),
(
  'a1200000-0000-4000-a102-000000000095', 'b1100000-0000-4000-a110-000000000002', 'Azúcar FRESCAMPO blanco (2500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/azucar-blanco-especial-frescampo-2500-gr-3096347/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Azúcar FRESCAMPO blanco (2500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8470, 'Azúcar, panela y endulzante', 'https://exitocol.vteximg.com.br/arquivos/ids/33546414/Azucar-Blanco-Especial-FRESCAMPO-2500-gr-3310407_a.jpg?v=639154582706400000',
  true, 94
),
(
  'a1200000-0000-4000-a102-000000000096', 'b1100000-0000-4000-a110-000000000002', 'Lenteja FRESCAMPO granos seleccionados  (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lenteja-837337/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Lenteja FRESCAMPO granos seleccionados (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 1990, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/28958849/Lenteja-1121547_a.jpg?v=638864600885130000',
  true, 95
),
(
  'a1200000-0000-4000-a102-000000000097', 'b1100000-0000-4000-a110-000000000002', 'Pastas LA MUNECA spaghetti (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasta-spaguetti-1000-gr-755424/p. Marca: LA MUNECA. Contenido suministrado a Almacenes Éxito directamente por HARINERA DEL VALLE S.A. PASTA LA MUÑECA ESPAGUETI 1000G Características Pasta La Muñeca tiene múltiples formas de preparación y es perfecto para acompañar salsas, carnes y verduras. Recárgate de m',
  '🛒', 6900, 'Pastas', 'https://exitocol.vteximg.com.br/arquivos/ids/32829808/Pasta-Spaguetti-1000-gr-603117_a.jpg?v=639095354058530000',
  true, 96
),
(
  'a1200000-0000-4000-a102-000000000098', 'b1100000-0000-4000-a110-000000000002', 'Arroz DIANA blanco vitamor (5000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arroz-diana-5000-gr-498671/p. Marca: DIANA. Lleva a casa fácil y rápido Arroz DIANA blanco vitamor (5000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19950, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/28955906/Arroz-Diana-5000-gr-814670_a.jpg?v=639154788988530000',
  true, 97
),
(
  'a1200000-0000-4000-a102-000000000099', 'b1100000-0000-4000-a110-000000000002', 'Arroz ROA blanco fortiplus (3000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arroz-blanco-fortificado-x-3000-g-480324/p. Marca: ROA. Arroz Blanco Fortificado X 3000 G Características Arroz Roa. Peso neto: 3000g. Descripción: con vitamina A y ácido fólico B9. Fortificado',
  '🛒', 9000, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/33261024/Arroz-Blanco-Fortificado-X-3000-G-694991_a.jpg?v=639130900461230000',
  true, 98
),
(
  'a1200000-0000-4000-a102-000000000100', 'b1100000-0000-4000-a110-000000000002', 'Harina PAN maíz blanco (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/harina-pan-maiz-blanca-x-1000-gr-370181/p. Marca: PAN. CARACTERISTICAS Conserve en un lugar fresco y seco. Una vez abierto consuma en el menor tiempo posible. A 1/4 de taza de agua añada sal al gusto y añada lentamente 1 taza de ahrina pan, mezcle con una cuchara continuamente hasta obtener una masa consi',
  '🛒', 3400, 'Harinas y mezclas para preparar', 'https://exitocol.vteximg.com.br/arquivos/ids/33496405/Harina-Pan-Maiz-Blanca-X-1000-gr-200963_a.jpg?v=639153133409500000',
  true, 99
),
(
  'a1200000-0000-4000-a102-000000000101', 'b1100000-0000-4000-a110-000000000002', 'Galletas SALTIN NOEL tradicional x6 tacos (531  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galletas-crakers-tradicionales-x-570-gr-x-6-tacos-104284/p. Marca: SALTIN NOEL. Características Galletas saltín noel tradicional. Contiene 6 tacos. 85% contenido de cereal. Conservar este producto en un lugar fresco y seco,protegido de la luz directa y alejado de olores fuertes.',
  '🛒', 9880, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/31753378/Galletas-Crakers-Tradicionales-X-570-Gr-X-6-Tacos-555910_a.jpg?v=638986363498870000',
  true, 100
),
(
  'a1200000-0000-4000-a102-000000000102', 'b1100000-0000-4000-a110-000000000002', 'Lenteja DIANA cuidadosamente seleccionadas (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lenteja-x500-gr-diana-500-gr-66557/p. Marca: DIANA. Lleva a casa fácil y rápido Lenteja DIANA cuidadosamente seleccionadas (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3840, 'Granos y arroz', 'https://exitocol.vteximg.com.br/arquivos/ids/28956011/LENTEJA-X500-GR-DIANA-500-gr-1408940_a.jpg?v=638864003230500000',
  true, 101
),
(
  'a1200000-0000-4000-a102-000000000103', 'b1100000-0000-4000-a110-000000000002', 'Azúcar MANUELITA alta pureza (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/azucar-alta-pureza-1-kg-64924/p. Marca: MANUELITA. CARACTERISTICAS Azúcar Blanca. Marca: Manuelita. Características: Sabor 100% natural, sin químicos. Almacenamiento: Consérvese en un lugar limpio, fresco y seco, después de abierto consúmase en el menor tiempo posible.',
  '🛒', 5950, 'Azúcar, panela y endulzante', 'https://exitocol.vteximg.com.br/arquivos/ids/31683068/Azucar-Alta-Pureza-1-kg-21986_a.jpg?v=638983789382800000',
  true, 102
),
(
  'a1200000-0000-4000-a102-000000000104', 'b1100000-0000-4000-a110-000000000002', 'Pastas DORIA corriente (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasta-clasica-spaghetti-x-500-gr-50578/p. Marca: DORIA. Nombre del producto: Pasta DORIA Corriente 500 Gr Características del producto: El Spaghetti es una pasta larga con múltiples y fáciles formas de preparación, perfecta para acompañar con salsas, carnes y verduras. Disfruta de un plato tradicional y n',
  '🛒', 2990, 'Pastas', 'https://exitocol.vteximg.com.br/arquivos/ids/31753517/Pasta-Clasica-Spaghetti-X-500-gr-13653_a.jpg?v=638986364723170000',
  true, 103
),
(
  'a1200000-0000-4000-a102-000000000105', 'b1100000-0000-4000-a110-000000000002', 'Harina de trigo HAZ DE OROS tradicional (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/harina-de-trigo-50356/p. Marca: HAZ DE OROS. Lleva a casa fácil y rápido Harina de trigo HAZ DE OROS tradicional (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2250, 'Harinas y mezclas para preparar', 'https://exitocol.vteximg.com.br/arquivos/ids/32873185/Harina-De-Trigo-13520_a.jpg?v=639099756168270000',
  true, 104
),
(
  'a1200000-0000-4000-a102-000000000106', 'b1100000-0000-4000-a110-000000000002', 'Lomitos de atún FRESCAMPO en agua (110.5  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomitos-de-atun-frescampo-agua-y-sal-1105-gr-3241101/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Lomitos de atún FRESCAMPO en agua (110.5 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4440, 'Enlatados y conservas', 'https://exitocol.vteximg.com.br/arquivos/ids/32275481/Lomitos-De-Atun-FRESCAMPO-Agua-y-Sal-1105-gr-3804672_a.jpg?v=639044338984930000',
  true, 105
),
(
  'a1200000-0000-4000-a102-000000000107', 'b1100000-0000-4000-a110-000000000002', 'Aceite de oliva FRESCAMPO extra virgen (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-oliva-frescampo-extra-virgen-500-ml-3224778/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite de oliva FRESCAMPO extra virgen (500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 16950, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/33502847/Aceite-Oliva-FRESCAMPO-Extra-Virgen-500-ml-3749226_a.jpg?v=639153315541330000',
  true, 106
),
(
  'a1200000-0000-4000-a102-000000000108', 'b1100000-0000-4000-a110-000000000002', 'Caldo De Gallina Desmenuzado Especias MAGGI desmenuzado (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caldo-de-gallina-desmenuzado-especias-maggi-especias-desmenuzado-90-gr-3204662/p. Marca: MAGGI. Lleva a casa fácil y rápido Caldo De Gallina Desmenuzado Especias MAGGI desmenuzado (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3840, 'Salsas, especias y condimentos', 'https://exitocol.vteximg.com.br/arquivos/ids/33502699/Caldo-De-Gallina-Desmenuzado-Especias-MAGGI-Especias-Desmenuzado-90-gr-3669641_a.jpg?v=639153314532570000',
  true, 107
),
(
  'a1200000-0000-4000-a102-000000000109', 'b1100000-0000-4000-a110-000000000002', 'Chocolate SOL pastillas de cocoa (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolate-sol-pastillas-de-cocoa-400-gr-3194334/p. Marca: SOL. Lleva a casa fácil y rápido Chocolate SOL pastillas de cocoa (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 6987, 'Café, chocolate y cremas no lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/33498477/Chocolate-SOL-Pastillas-De-Cocoa-400-gr-3631704_a.jpg?v=639153205873630000',
  true, 108
),
(
  'a1200000-0000-4000-a102-000000000110', 'b1100000-0000-4000-a110-000000000002', 'Café TOSTAO tostado y molido (454  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cafe-tostao-tostado-y-molido-454-gr-3178996/p. Marca: TOSTAO. Lleva a casa fácil y rápido Café TOSTAO tostado y molido (454 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥛', 26450, 'Café, chocolate y cremas no lácteas', 'https://exitocol.vteximg.com.br/arquivos/ids/30611642/Cafe-TOSTAO-Tostado-y-Molido-454-gr-3576787_a.jpg?v=638924426649270000',
  true, 109
),
(
  'a1200000-0000-4000-a102-000000000111', 'b1100000-0000-4000-a110-000000000002', 'Gelatina FRUTINO Precio Especial Sabores Surtidos x4 (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/precio-especial-mezc-polvo-sabores-surtido-frutino-56-gr-3162990/p. Marca: FRUTINO. Lleva a casa fácil y rápido Gelatina FRUTINO Precio Especial Sabores Surtidos x4 (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7210, 'Gelatinas en polvo', 'https://exitocol.vteximg.com.br/arquivos/ids/33064771/Precio-Especial-Mezc-Polvo-Sabores-Surtido-FRUTINO-56-gr-3541399_a.jpg?v=639118536139130000',
  true, 110
),
(
  'a1200000-0000-4000-a102-000000000112', 'b1100000-0000-4000-a110-000000000002', 'Cereal ZUCARITAS hojuelas de maíz azucaradas (610  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hojuelas-maiz-azucaradas-zucaritas-610-gr-3157053/p. Marca: ZUCARITAS. Contenido suministrado a Almacenes Éxito directamente por Kellogg''s Cereal Características Haz que tus hijos saquen el tigre que llevan dentro con Zucaritas de Cereales Kellogg’s, hecho con granos de maíz de origen natural, adicionado ',
  '🛒', 28900, 'Cereales y granolas', 'https://exitocol.vteximg.com.br/arquivos/ids/33339305/Hojuelas-Maiz-Azucaradas-ZUCARITAS-610-gr-3518883_a.jpg?v=639141283499300000',
  true, 111
),
(
  'a1200000-0000-4000-a102-000000000113', 'b1100000-0000-4000-a110-000000000002', 'Atún VAN CAMPS en aceite de oliva (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/atun-menos-acte-oliva-van-camps-180-gr-3154366/p. Marca: VAN CAMPS. Lleva a casa fácil y rápido Atún VAN CAMPS en aceite de oliva (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 15000, 'Enlatados y conservas', 'https://exitocol.vteximg.com.br/arquivos/ids/33870439/Atun-Menos-Acte-Oliva-VAN-CAMPS-180-gr-3507683_a.jpg?v=639185134885900000',
  true, 112
),
(
  'a1200000-0000-4000-a102-000000000114', 'b1100000-0000-4000-a110-000000000002', 'Aceite de girasol PREMIER multiusos (900  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-comestible-girasol-premier-900-ml-3139677/p. Marca: PREMIER. Lleva a casa fácil y rápido Aceite de girasol PREMIER multiusos (900 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14287, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/29609843/Aceite-Comestible-Girasol-PREMIER-900-ml-3452376_a.jpg?v=638906031378430000',
  true, 113
),
(
  'a1200000-0000-4000-a102-000000000115', 'b1100000-0000-4000-a110-000000000002', 'Avena En Hojuela Extracontenido QUAKER 1100  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/avena-en-hojuela-extracontenido-quaker-q1292-3133181/p. Marca: QUAKER. Lleva a casa fácil y rápido Avena En Hojuela Extracontenido QUAKER 1100 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9120, 'Avena en hojuelas y en polvo', 'https://exitocol.vteximg.com.br/arquivos/ids/29102290/Avena-En-Hojuela-Extracontenido-QUAKER-Q1292-3423348_a.jpg?v=638881203961770000',
  true, 114
),
(
  'a1200000-0000-4000-a102-000000000116', 'b1100000-0000-4000-a110-000000000002', 'Galletas DUCALES x3 tacos (315  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galleta-taco-x-3-ducales-315-gr-3126999/p. Marca: DUCALES. Lleva a casa fácil y rápido Galletas DUCALES x3 tacos (315 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9950, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/33338054/Galleta-Taco-X-3-DUCALES-315-gr-3401545_a.jpg?v=639141262252300000',
  true, 115
),
(
  'a1200000-0000-4000-a102-000000000117', 'b1100000-0000-4000-a110-000000000002', 'Aceite de girasol FRESCAMPO botella (2000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-de-girasol-frescampo-2000-ml-3126826/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite de girasol FRESCAMPO botella (2000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18940, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/30571149/Aceite-de-Girasol-FRESCAMPO-2000-ml-3400653_a.jpg?v=638923619729470000',
  true, 116
),
(
  'a1200000-0000-4000-a102-000000000118', 'b1100000-0000-4000-a110-000000000002', 'Atún BARY en aceite (104  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lomos-atun-aceite-girasol-bary-160-gr-3090070/p. Marca: BARY. Lleva a casa fácil y rápido Atún BARY en aceite (104 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7470, 'Enlatados y conservas', 'https://exitocol.vteximg.com.br/arquivos/ids/31882427/Lomos-Atun-Aceite-Girasol-BARY-160-gr-3284573_a.jpg?v=638995998253030000',
  true, 117
),
(
  'a1200000-0000-4000-a102-000000000119', 'b1100000-0000-4000-a110-000000000002', 'Galletas SALTIN NOEL mix tradicional y queso mantequilla (510  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/galletas-mix-saltin-noel-510-gr-3084896/p. Marca: SALTIN NOEL. Lleva a casa fácil y rápido Galletas SALTIN NOEL mix tradicional y queso mantequilla (510 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12000, 'Galletas', 'https://exitocol.vteximg.com.br/arquivos/ids/33541054/Galletas-Mix-SALTIN-NOEL-510-gr-3266685_a.jpg?v=639154418767700000',
  true, 118
),
(
  'a1200000-0000-4000-a102-000000000120', 'b1100000-0000-4000-a110-000000000002', 'Aceite FRESCAMPO vegetal multiusos (900  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aceite-vegetal-frescampo-900-ml-3082930/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Aceite FRESCAMPO vegetal multiusos (900 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6950, 'Aceites y vinagres', 'https://exitocol.vteximg.com.br/arquivos/ids/33173635/Aceite-Vegetal-FRESCAMPO-900-ml-3257072_a.jpg?v=639124918493900000',
  true, 119
),
(
  'a1200000-0000-4000-a102-000000000121', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado BIMBO blanco suave esponjoso (730  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-blanco-suave-esponjoso-730-gr-3202794/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO blanco suave esponjoso (730 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 8860, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877733/Pan-BIMBO-BLANCO-SUAVE-ESPONJOSO-730-gr-3663322_a.jpg?v=639186166841270000',
  true, 120
),
(
  'a1200000-0000-4000-a102-000000000122', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado BIMBO blanco suave esponjoso (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-blanco-suave-esponjoso-600-gr-3202795/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO blanco suave esponjoso (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7700, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877734/Pan-BIMBO-BLANCO-SUAVE-ESPONJOSO-600-gr-3663323_a.jpg?v=639186166856030000',
  true, 121
),
(
  'a1200000-0000-4000-a102-000000000123', 'b1100000-0000-4000-a110-000000000002', 'Pan Perro BIMBO x6und (205  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-perro-medias-noches-x6-unidades-616697/p. Marca: BIMBO. Características Sin grasa Trans, fuente de hierro.',
  '🍞', 4280, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877638/Pan-Perro-Medias-Noches-X6-Unidades-529159_a.jpg?v=639186163690000000',
  true, 122
),
(
  'a1200000-0000-4000-a102-000000000124', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado FRESCAMPO blanco (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-frescampo-450-gr-3252766/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Pan tajado FRESCAMPO blanco (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 2990, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33797052/Pan-FRESCAMPO-450-gr-3848252_a.jpg?v=639176974543570000',
  true, 123
),
(
  'a1200000-0000-4000-a102-000000000125', 'b1100000-0000-4000-a110-000000000002', 'Pan BIMBO blanco masa madre (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-blanco-artes-mm-1p-500g-bolsa-bimbo-pan-blanco-masa-madre-500-gr-3245095/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan BIMBO blanco masa madre (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 6600, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877753/Pan-Blanco-Artes-MM-1p-500g-BOLSA-BIMBO-PAN-BLANCO-MASA-MADRE-500-gr-3821752_a.jpg?v=639186167065900000',
  true, 124
),
(
  'a1200000-0000-4000-a102-000000000126', 'b1100000-0000-4000-a110-000000000002', 'Pan  PAN ARTESANO artesano (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-artesano-500-gr-3244886/p. Marca: PAN ARTESANO. Lleva a casa fácil y rápido Pan PAN ARTESANO artesano (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7160, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/34056314/Pan-BIMBO-Artesano-500-gr-3821260_a.jpg?v=639196370000530000',
  true, 125
),
(
  'a1200000-0000-4000-a102-000000000127', 'b1100000-0000-4000-a110-000000000002', 'Pan COMAPAN blanco extralargo (520  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-comapan-blanco-extra-largo-520-gr-3237528/p. Marca: COMAPAN. Lleva a casa fácil y rápido Pan COMAPAN blanco extralargo (520 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7760, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/32094325/Pan-COMAPAN-BLANCO-EXTRA-LARGO-520-gr-3790182_a.jpg?v=639021225120300000',
  true, 126
),
(
  'a1200000-0000-4000-a102-000000000128', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado EXITO MARCA PROPIA mantequilla (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-tajado-mantequilla-exito-marca-propia-500-gr-3087762/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Pan tajado EXITO MARCA PROPIA mantequilla (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7080, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/27599335/Pan-Tajado-Mantequilla-EXITO-MARCA-PROPIA-500-gr-3276283_a.jpg?v=638830078120030000',
  true, 127
),
(
  'a1200000-0000-4000-a102-000000000129', 'b1100000-0000-4000-a110-000000000002', 'Ponque RAMO Tradicional (230  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ponque-ramo-tradicional-885833/p. Marca: RAMO. Lleva a casa fácil y rápido Ponque RAMO Tradicional (230 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 6900, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/29723195/Ponque-Ramo-Tradicional-1209602_a.jpg?v=638912269957570000',
  true, 128
),
(
  'a1200000-0000-4000-a102-000000000130', 'b1100000-0000-4000-a110-000000000002', 'Pan Blandito 10und  FRESCAMPO 420  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-blandito-10und-850017/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Pan Blandito 10und FRESCAMPO 420 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5300, 'Panadería fresca y artesanal', 'https://exitocol.vteximg.com.br/arquivos/ids/33053621/Pan-Blandito-10und-1151747_a.jpg?v=639117654187800000',
  true, 129
),
(
  'a1200000-0000-4000-a102-000000000131', 'b1100000-0000-4000-a110-000000000002', 'Pan Tajado GUADALUPE Integral Extralargo (570  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-integral-extralargo-827180/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Pan Tajado GUADALUPE Integral Extralargo (570 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 6400, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877692/PAN-INTEGRAL-EXTRALARGO-222429_a.jpg?v=639186166303500000',
  true, 130
),
(
  'a1200000-0000-4000-a102-000000000132', 'b1100000-0000-4000-a110-000000000002', 'Pan Tajado GUADALUPE Mantequilla (550  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-mantequilla-largo-827177/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Pan Tajado GUADALUPE Mantequilla (550 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5752, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877691/PAN-MANTEQUILLA-LARGO-222411_a.jpg?v=639186166288700000',
  true, 131
),
(
  'a1200000-0000-4000-a102-000000000133', 'b1100000-0000-4000-a110-000000000002', 'Chocoramo Barrita RAMO x5und  (200  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocobarra-5-und-770619/p. Marca: RAMO. Lleva a casa fácil y rápido Chocoramo Barrita RAMO x5und (200 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 10850, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/31961447/CHOCOBARRA-5-UND-837630_a.jpg?v=639003095812100000',
  true, 132
),
(
  'a1200000-0000-4000-a102-000000000134', 'b1100000-0000-4000-a110-000000000002', 'Pan Hamburguesa BIMBO Con Anjonjolí x4und (210  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-hamburguesa-bimbollos-210-gr-616699/p. Marca: BIMBO. Características Una vez abierto consuma en el menor tiempo posible. Mantenga en lugar limpio, fresco y seco, alejado de olores fuertes o penetrantes. Pan Hamburguesa con Ajonjolí Harina de trigo fortificada, agua, azucar, levadura, sal refinada, glu',
  '🍞', 4380, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877640/Pan-Hamburguesa-Bimbollos-210-gr-529161_a.jpg?v=639186163703270000',
  true, 133
),
(
  'a1200000-0000-4000-a102-000000000135', 'b1100000-0000-4000-a110-000000000002', 'Tostadas GUADALUPE Media Luna Integral (280  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostada-media-luna-integral-616168/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Tostadas GUADALUPE Media Luna Integral (280 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7248, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877690/TOSTADA-MEDIA-LUNA-INTEGRAL-524014_a.jpg?v=639186166277670000',
  true, 134
),
(
  'a1200000-0000-4000-a102-000000000136', 'b1100000-0000-4000-a110-000000000002', 'Tostadas GUADALUPE Media Luna Mantequilla (280  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostada-media-luna-mante-615362/p. Marca: GUADALUPE. Lleva a casa fácil y rápido Tostadas GUADALUPE Media Luna Mantequilla (280 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7160, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877688/TOSTADA-MEDIA-LUNA-MANTE-301063_a.jpg?v=639186166266900000',
  true, 135
),
(
  'a1200000-0000-4000-a102-000000000137', 'b1100000-0000-4000-a110-000000000002', 'Ponqué CHOCORAMO x5und (325  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ponque-cubiert-de-choco-x5-und-270355/p. Marca: CHOCORAMO. Lleva a casa fácil y rápido Ponqué CHOCORAMO x5und (325 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 14950, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/31962151/PONQUE-CUBIERT-DE-CHOCO-X5-UND-1558824_a.jpg?v=639003106663970000',
  true, 136
),
(
  'a1200000-0000-4000-a102-000000000138', 'b1100000-0000-4000-a110-000000000002', 'Pan Perro BIMBO x6und (405  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-super-perro-x6-unidades-267093/p. Marca: BIMBO. Pan Super Perro X6 Unidades Características Una vez abierto consuma en el menor tiempo posible. Mantenga en lugar limpio, fresco y seco, alejado de olores fuertes o penetrantes. Pan super perro con ajonjolí. Harina de trigo fortificada, agua, azucar, lev',
  '🍞', 8390, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877632/Pan-Super-Perro-X6-Unidades-236948_a.jpg?v=639186163630470000',
  true, 137
),
(
  'a1200000-0000-4000-a102-000000000139', 'b1100000-0000-4000-a110-000000000002', 'Pan Tajado Bimbo VITAL 100% Natural Fruticereal (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-tajado-fruticereal-500-gr-93998/p. Marca: VITAL. Lleva a casa fácil y rápido Pan Tajado Bimbo VITAL 100% Natural Fruticereal (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 11300, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877626/Pan-Tajado-Fruticereal-500-gr-691618_a.jpg?v=639186163575330000',
  true, 138
),
(
  'a1200000-0000-4000-a102-000000000140', 'b1100000-0000-4000-a110-000000000002', 'Ponqué CHOCORAMO Mini x20und (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/ponque-chocorramo-mini-x-20-unidades-25723/p. Marca: CHOCORAMO. CARACTERISTICAS Chocoramo mini. Tajaditas de ponqué cubiertas con chocolate. Contiene 20 unidades. Después de abierto consérvese en un lugar fresco y seco.',
  '🍞', 18500, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/31960392/Ponque-Chocorramo-Mini-X-20-Unidades-753611_a.jpg?v=639003086083270000',
  true, 139
),
(
  'a1200000-0000-4000-a102-000000000141', 'b1100000-0000-4000-a110-000000000002', 'Tostadas BIMBO Mantequilla (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostadas-mantequilla-x-20-unidades-4733/p. Marca: BIMBO. Lleva a casa fácil y rápido Tostadas BIMBO Mantequilla (300 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 9400, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877666/Tostadas-Mantequilla-X-20-Unidades-239453_a.jpg?v=639186164935800000',
  true, 140
),
(
  'a1200000-0000-4000-a102-000000000142', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado FRESCAMPO mantequilla (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-frescampo-450-gr-3252767/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Pan tajado FRESCAMPO mantequilla (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 3640, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33797053/Pan-FRESCAMPO-450-gr-3848253_a.jpg?v=639176974555530000',
  true, 141
),
(
  'a1200000-0000-4000-a102-000000000143', 'b1100000-0000-4000-a110-000000000002', 'Pan BIMBO integral masa madre (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-integral-artes-mm-1p-500g-bolsa-bimbo-pan-integral-masa-madre-500-gr-3244884/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan BIMBO integral masa madre (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 7704, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877754/Pan-Integral-Artes-MM-1p-500g-BOLSA-BIMBO-PAN-INTEGRAL-MASA-MADRE-500-gr-3821258_a.jpg?v=639186167076800000',
  true, 142
),
(
  'a1200000-0000-4000-a102-000000000144', 'b1100000-0000-4000-a110-000000000002', 'Láminas SANISSIMO Maiz Horneadas Salmas (144  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/laminas-sanissimo-maiz-horneadas-salmas-144-gr-3233512/p. Marca: SANISSIMO. Lleva a casa fácil y rápido Láminas SANISSIMO Maiz Horneadas Salmas (144 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 13950, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877743/Laminas-SANISSIMO-Maiz-Horneadas-Salmas-144-gr-3781588_a.jpg?v=639186166985630000',
  true, 143
),
(
  'a1200000-0000-4000-a102-000000000145', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado BIMBO dorado (460  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-tajado-dorado-460-gr-3223191/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO dorado (460 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 8390, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33883720/Pan-BIMBO-Tajado-Dorado-460-gr-3743913_a.jpg?v=639186534203400000',
  true, 144
),
(
  'a1200000-0000-4000-a102-000000000146', 'b1100000-0000-4000-a110-000000000002', 'Tostada BIMBO Integral banano uvas pasas ciruela (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostada-bimbo-integral-banano-uvas-pasas-cir-120-gr-3216049/p. Marca: BIMBO. Lleva a casa fácil y rápido Tostada BIMBO Integral banano uvas pasas ciruela (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5140, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33883718/Tostada-BIMBO-Integral-Banano-Uvas-Pasas-Cir-120-gr-3715663_a.jpg?v=639186534184770000',
  true, 145
),
(
  'a1200000-0000-4000-a102-000000000147', 'b1100000-0000-4000-a110-000000000002', 'Pan tajado BIMBO blanco suave esponjoso (350  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-bimbo-blanco-suave-esponjoso-350-gr-3202793/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan tajado BIMBO blanco suave esponjoso (350 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 5080, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877731/Pan-BIMBO-BLANCO-SUAVE-ESPONJOSO-350-gr-3663321_a.jpg?v=639186166820270000',
  true, 146
),
(
  'a1200000-0000-4000-a102-000000000148', 'b1100000-0000-4000-a110-000000000002', 'Tostadas TAEQ de arroz con quinua (70  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tostadas-de-arroz-con-quinua-taeq-70-gr-3079104/p. Marca: TAEQ. Contenido suministrado a Almacenes Éxito directamente por TAEQ Tostadas arroz Características Tostadas libres de guten, buena fuente de fibra y de proteína. Beneficios Libres de gluten, el gluten es un conjunto de proteínas responsables de ge',
  '🍞', 5200, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/29594144/Tostadas-De-Arroz-Con-Quinua-TAEQ-70-gr-3239904_a.jpg?v=638902742046900000',
  true, 147
),
(
  'a1200000-0000-4000-a102-000000000149', 'b1100000-0000-4000-a110-000000000002', 'Mogolla SANTA CLARA Tricereal miel (520  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/mogolla-tricereal-miel-santa-clara-520-gramo-3000718/p. Marca: SANTA CLARA. Lleva a casa fácil y rápido Mogolla SANTA CLARA Tricereal miel (520 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 8790, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/26866885/MOGOLLA-TRICEREAL-MIEL-SANTA-CLARA-520-Gramo-3001174_a.jpg?v=638756670432130000',
  true, 148
),
(
  'a1200000-0000-4000-a102-000000000150', 'b1100000-0000-4000-a110-000000000002', 'Pan Tajado BIMBO 100% Integral  (650  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pan-tajado-integral-x650-gramos-917968/p. Marca: BIMBO. Características Pan Integral que contiene buena fuente de fibra, libre de grasas Trans y buena fuente de proteína.',
  '🍞', 9440, 'Panadería y pastelería empacada', 'https://exitocol.vteximg.com.br/arquivos/ids/33877662/Pan-Tajado-Integral-X650-Gramos-225710_a.jpg?v=639186164898070000',
  true, 149
),
(
  'a1200000-0000-4000-a102-000000000151', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico EKONO triple hoja (396  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-higienico-ekono-triple-hoja-396-mts-3226861/p. Marca: EKONO. Lleva a casa fácil y rápido Papel higiénico EKONO triple hoja (396 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14800, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32753065/Papel-Higienico-EKONO-Triple-Hoja-396-mts-3756865_a.jpg?v=639089252184930000',
  true, 150
),
(
  'a1200000-0000-4000-a102-000000000152', 'b1100000-0000-4000-a110-000000000002', 'Detergente en polvo FAB ultra flash (5000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-pvo-ultra-fab-5000-gr-3134948/p. Marca: FAB. Contenido suministrado a Almacenes Éxito directamente por FAB Detergente Polvo Ultra Características Despercude y remueve manchas de grasa y comida, tiene bio enzimas rápidas e inteligentes, con capsulas de perfume duraderas. Maxima Limpieza y cuidad',
  '🛒', 55600, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33490103/Detergente-Pvo-Ultra-FAB-5000-gr-3430343_a.jpg?v=639150774060270000',
  true, 151
),
(
  'a1200000-0000-4000-a102-000000000153', 'b1100000-0000-4000-a110-000000000002', 'Detergente en polvo FAB ultra flash (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-pvo-ultra-fab-4000-gr-3134947/p. Marca: FAB. Contenido suministrado a Almacenes Éxito directamente por FAB Detergente Polvo Ultra Características Despercude y remueve manchas de grasa y comida, tiene bio enzimas rápidas e inteligentes, con capsulas de perfume duraderas. Maxima Limpieza y cuidad',
  '🛒', 47850, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33490095/Detergente-Pvo-Ultra-FAB-4000-gr-3430342_a.jpg?v=639150774017800000',
  true, 152
),
(
  'a1200000-0000-4000-a102-000000000154', 'b1100000-0000-4000-a110-000000000002', 'Suavizante SUAVITEL cuidado superior fresca primavera (5600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suave-primaveral-bipack-suavitel-61028800-3090805/p. Marca: SUAVITEL. Contenido suministrado a Almacenes Éxito directamente por SUAVITEL Suavizante Suavitel Cuidado Superior Fresca Primavera 2.8L x2und Características Cuida de tus prendas favoritas utilizando el Suavizante de Ropa Suavitel Cuidado Superio',
  '🛒', 47850, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33640364/Suave-Primaveral-Bipack-SUAVITEL-61028800-3287702_a.jpg?v=639161801928230000',
  true, 153
),
(
  'a1200000-0000-4000-a102-000000000155', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico FAMILIA expert 4 hojas x12und (300  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-higienico-expert-familia-300-mts-3053625/p. Marca: FAMILIA. Lleva a casa fácil y rápido Papel higiénico FAMILIA expert 4 hojas x12und (300 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 23950, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32752249/Papel-Higienico-Expert-FAMILIA-300-mts-3153915_a.jpg?v=639089246086400000',
  true, 154
),
(
  'a1200000-0000-4000-a102-000000000156', 'b1100000-0000-4000-a110-000000000002', 'Blanqueador EKONO pureza cítrica (2000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/blanqueador-sin-fragancia-ekono-sin-ref-3016130/p. Marca: EKONO. Lleva a casa fácil y rápido Blanqueador EKONO pureza cítrica (2000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3100, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33873607/Blanqueador-sin-fragancia-EKONO-SIN-REF-3023705_a.jpg?v=639185383323700000',
  true, 155
),
(
  'a1200000-0000-4000-a102-000000000157', 'b1100000-0000-4000-a110-000000000002', 'Detergente líquido ARIEL limpieza profunda (3700  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-na-ariel-80351113-3001158/p. Marca: ARIEL. Contenido suministrado a Almacenes Éxito directamente por P&G Detergente Líquido Doble Poder Concentrado 3,7L Características Ariel Doble Poder Concentrado remueve manchas difíciles y de sudor. Limpia cuidando tu ropa blanca y de color. ¡Adquierelo ya!',
  '🛒', 63490, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33905848/DETERGENTE-NA-ARIEL-80351113-3001782_a.jpg?v=639189507528900000',
  true, 156
),
(
  'a1200000-0000-4000-a102-000000000158', 'b1100000-0000-4000-a110-000000000002', 'Lavaplatos líquido AXION limón (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaplatos-liquido-limon-1500-ml-853875/p. Marca: AXION. Contenido suministrado a Almacenes Éxito directamente por AXION Lavaplatos Liquido Axion Limon 1.5L Características Deja impecable tu vajilla con el Lavaplatos Líquido Axion Limón, su presentación de 1.1 L es ideal para ti y tu familia. Este Lavaloz',
  '🛒', 14760, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/33448781/Lavaplatos-Liquido-Limon-1500-ml-1157214_a.jpg?v=639148775402270000',
  true, 157
),
(
  'a1200000-0000-4000-a102-000000000159', 'b1100000-0000-4000-a110-000000000002', 'Jabón de barra REY original (900  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/oferta-jabon-azul-900-gr-792534/p. Marca: REY. Lleva a casa fácil y rápido Jabón de barra REY original (900 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9110, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/32665774/Oferta-Jabon-Azul-900-gr-263056_a.jpg?v=639082472685770000',
  true, 158
),
(
  'a1200000-0000-4000-a102-000000000160', 'b1100000-0000-4000-a110-000000000002', 'Detergente en polvo ARIEL triple poder (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-en-polvo-ariel-regular-4-kg-563348/p. Marca: ARIEL. Contenido suministrado a Almacenes Éxito directamente por ARIEL Ariel Triple Poder Detergente en Polvo de 4kg Beneficios REMUEVE MANCHAS Y OLORES DIFÍCILES: El detergente en polvo Ariel Triple Poder remueve manchas de sudor y olores difíciles ',
  '🛒', 40180, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33905491/Detergente-En-Polvo-Ariel-Regular-4-kg-802468_a.jpg?v=639189505328030000',
  true, 159
),
(
  'a1200000-0000-4000-a102-000000000161', 'b1100000-0000-4000-a110-000000000002', 'Detergente líquido BLANCOX protección color limpieza profunda (3800  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-regular-x-3800-ml-333497/p. Marca: BLANCOX. Lleva a casa fácil y rápido Detergente líquido BLANCOX protección color limpieza profunda (3800 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 36640, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/31164279/Detergente-regular-X-3800-ml-1696433_a.jpg?v=638956192165870000',
  true, 160
),
(
  'a1200000-0000-4000-a102-000000000162', 'b1100000-0000-4000-a110-000000000002', 'Toallas de cocina EKONO desechables (50  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/toalla-cocina-doble-hoja-x-50-gr-208591/p. Marca: EKONO. CARACTERISTICAS Toalla de cocina 1 rollo con 45 hojas dobles. Tamaño de la toalla 21 x 22.4 cm. CONSERVACION: Consérvese en un lugar limpio, fresco y ventilado, retirado de los rayos directos del sol y fuera del alcance de los niños y mascotas. INST',
  '🛒', 1750, 'Servilletas y toallas de cocina', 'https://exitocol.vteximg.com.br/arquivos/ids/33516600/Toalla-Cocina-Doble-Hoja-X-50-gr-598300_a.jpg?v=639154090442470000',
  true, 161
),
(
  'a1200000-0000-4000-a102-000000000163', 'b1100000-0000-4000-a110-000000000002', 'Detergente en polvo ARIEL triple poder (5000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-regular-p3-llv5-kg-146968/p. Marca: ARIEL. Contenido suministrado a Almacenes Éxito directamente por ARIEL Ariel Triple Poder Detergente en Polvo de 5kg Beneficios REMUEVE MANCHAS Y OLORES DIFÍCILES: El detergente en polvo Ariel Triple Poder remueve manchas de sudor y olores difíciles de la rop',
  '🛒', 43610, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33905523/Detergente-Regular-P3-Llv5-kg-1413539_a.jpg?v=639189505582730000',
  true, 162
),
(
  'a1200000-0000-4000-a102-000000000164', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico ROSAL triple hoja XG x30 rollos (750  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/precio-especial-papel-rosal-higienico-triple-hoja-xg-750-mts-3252522/p. Marca: ROSAL. Lleva a casa fácil y rápido Papel higiénico ROSAL triple hoja XG x30 rollos (750 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 31900, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/33533741/Precio-Especial-Papel-ROSAL-Higienico-Triple-Hoja-Xg-750-mts-3847638_a.jpg?v=639154364766800000',
  true, 163
),
(
  'a1200000-0000-4000-a102-000000000165', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico SCOTT cuidado completo (540  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-scott-higienico-triple-hoja-cuidado-540-mts-3219038/p. Marca: SCOTT. Contenido suministrado a Almacenes Éxito directamente por Huggies Papel Higiénico Scott Cuidado Completo Triple Hoja - 18R Características Nuevo Papel Higiénico Scott® Cuidado Completo ahora con más metros por rollo, te brinda una ',
  '🛒', 24750, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32753053/Papel-SCOTT-Higienico-Triple-Hoja-Cuidado-540-mts-3727036_a.jpg?v=639089252093700000',
  true, 164
),
(
  'a1200000-0000-4000-a102-000000000166', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico ROSAL triple hoja x6 rollos (150  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-rosal-higinico-triple-hoja-xg-ultra-6-unidad-3186685/p. Marca: ROSAL. Lleva a casa fácil y rápido Papel higiénico ROSAL triple hoja x6 rollos (150 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4712, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/33498278/Papel-ROSAL-HIGINICO-TRIPLE-HOJA-XG-ULTRA-6-UNIDAD-3606956_a.jpg?v=639153203805930000',
  true, 165
),
(
  'a1200000-0000-4000-a102-000000000167', 'b1100000-0000-4000-a110-000000000002', 'Detergente líquido EXITO MARCA PROPIA aroma floral (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/detergente-liquido-floral-exito-marca-propia-3000-ml-3150951/p. Marca: EXITO MARCA PROPIA. Lleva a casa fácil y rápido Detergente líquido EXITO MARCA PROPIA aroma floral (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13900, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33550325/Detergente-Liquido-Floral-EXITO-MARCA-PROPIA-3000-ml-3491790_a.jpg?v=639154853419470000',
  true, 166
),
(
  'a1200000-0000-4000-a102-000000000168', 'b1100000-0000-4000-a110-000000000002', 'Suavizante AROMATEL fragancia floral x2und (1800  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suavizante-floral-x-2-unds-aromatel-1800-ml-3150138/p. Marca: AROMATEL. Contenido suministrado a Almacenes Éxito directamente por AROMATEL Suavizante Aromatel Floral 10x más Fragancia OFERTAX2 X900ML Características El Nuevo Aromatel 10X aroma Floral, con una fragancia 10 veces más intensa y 10 veces más ',
  '🛒', 13055, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33490165/Suavizante-Floral-X-2-Unds-AROMATEL-1800-ml-3488778_a.jpg?v=639150774425930000',
  true, 167
),
(
  'a1200000-0000-4000-a102-000000000169', 'b1100000-0000-4000-a110-000000000002', 'Bolsa para basura EKONO plástico negro 65x90 cm Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bolsa-de-basura-negra-ekono-sin-ref-3142198/p. Marca: EKONO. Lleva a casa fácil y rápido Bolsa para basura EKONO plástico negro 65x90 cm. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2050, 'Implementos para la limpieza', 'https://exitocol.vteximg.com.br/arquivos/ids/31822499/Bolsa-De-Basura-Negra-EKONO-SIN-REF-3462329_a.jpg?v=638990956423000000',
  true, 168
),
(
  'a1200000-0000-4000-a102-000000000170', 'b1100000-0000-4000-a110-000000000002', 'Blanqueador CLOROX pack limpia y desinfecta (2260  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/blanqueador-super-ahorro-clorox-628176-3139485/p. Marca: CLOROX. Lleva a casa fácil y rápido Blanqueador CLOROX pack limpia y desinfecta (2260 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8550, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/33404765/Blanqueador-Super-Ahorro-CLOROX-628176-3451457_a.jpg?v=639143671480400000',
  true, 169
),
(
  'a1200000-0000-4000-a102-000000000171', 'b1100000-0000-4000-a110-000000000002', 'Jabón de barra REY líquido original (2  lt) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jabon-barra-liquido-original-rey-2-lt-3135839/p. Marca: REY. Lleva a casa fácil y rápido Jabón de barra REY líquido original (2 lt). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22250, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/32668350/Jabon-Barra-Liquido-Original-REY-2-lt-3433700_a.jpg?v=639082505957200000',
  true, 170
),
(
  'a1200000-0000-4000-a102-000000000172', 'b1100000-0000-4000-a110-000000000002', 'Suavizante DOWNY Adorable (900  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suavizante-de-ropa-concentrado-exp-downy-80734492-3113396/p. Marca: DOWNY. Contenido suministrado a Almacenes Éxito directamente por DOWNY Suavizante DOWNY adorable (900 ml) Características ¡Vístete de perfume todo el día con el suavizante downy! El suavizante downy adorable tiene un perfume sofisticado f',
  '🛒', 29750, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33906246/Suavizante-De-Ropa-Concentrado-Exp-DOWNY-80734492-3354381_a.jpg?v=639189509613500000',
  true, 171
),
(
  'a1200000-0000-4000-a102-000000000173', 'b1100000-0000-4000-a110-000000000002', 'Lavaloza EKONO en crema aroma a limón (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaloza-ekono-limon-ekono-sin-ref-3110753/p. Marca: EKONO. Lleva a casa fácil y rápido Lavaloza EKONO en crema aroma a limón (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2750, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/32031840/Lavaloza-Ekono-Limon-EKONO-Sin-Ref-3343468_a.jpg?v=639015804465400000',
  true, 172
),
(
  'a1200000-0000-4000-a102-000000000174', 'b1100000-0000-4000-a110-000000000002', 'Papel higiénico SUAVE triple hoja x12 rollos (384  mts) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papel-higienico-triple-hoja-suave-gold-soft-care-384-mts-3103604/p. Marca: SUAVE. Lleva a casa fácil y rápido Papel higiénico SUAVE triple hoja x12 rollos (384 mts). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 29900, 'Papel higiénico', 'https://exitocol.vteximg.com.br/arquivos/ids/32752818/Papel-Higienico-Triple-Hoja-SUAVE-GOLD-SOFT-CARE-384-mts-3333394_a.jpg?v=639089249654700000',
  true, 173
),
(
  'a1200000-0000-4000-a102-000000000175', 'b1100000-0000-4000-a110-000000000002', 'Bolsa para basura EKONO papelera rollo 43x48 cm Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bolsa-basura-43x48-papelera-ekono-sin-ref-3039615/p. Marca: EKONO. Lleva a casa fácil y rápido Bolsa para basura EKONO papelera rollo 43x48 cm. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2200, 'Implementos para la limpieza', 'https://exitocol.vteximg.com.br/arquivos/ids/31822390/Bolsa-Basura-43x48-Papelera-EKONO-Sin-REF-3101013_a.jpg?v=638990954965230000',
  true, 174
),
(
  'a1200000-0000-4000-a102-000000000176', 'b1100000-0000-4000-a110-000000000002', 'Lavaloza líquido AXION limón (2300  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaplatos-liquido-axion-61017463-3033623/p. Marca: AXION. Contenido suministrado a Almacenes Éxito directamente por PALMOLIVE Lavaplatos Liquido Axion Limon 2.3L Características Deja tus platos rechinando de limpio gracias al lavaplatos líquido Axion Limón para trastes limpios en menos tiempo y esfuerzo.',
  '🛒', 26700, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/33449090/Lavaplatos-Liquido-AXION-61017463-3080212_a.jpg?v=639148776801470000',
  true, 175
),
(
  'a1200000-0000-4000-a102-000000000177', 'b1100000-0000-4000-a110-000000000002', 'Lavaloza  LOZA CREM líquido cuida las manos (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lavaloza-doypack-limon-963935/p. Marca: LOZA CREM. Lleva a casa fácil y rápido Lavaloza LOZA CREM líquido cuida las manos (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 15400, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/32031058/Lavaloza-Doypack-Limon-1344808_a.jpg?v=639015796816470000',
  true, 176
),
(
  'a1200000-0000-4000-a102-000000000178', 'b1100000-0000-4000-a110-000000000002', 'Lavaplatos en crema AXION limón (900  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/axion-limon-2-unds-p-especial-x-450-gr-675540/p. Marca: AXION. Contenido suministrado a Almacenes Éxito directamente por AXION Lavaplatos en Crema Axion Limon 450g x 2und Características Mantén una higiene impecable en tu cocina con el Lavaplatos en Crema Axion Limón, su presentación de dos unidades por 4',
  '🛒', 14100, 'Lavalozas y desengrasante', 'https://exitocol.vteximg.com.br/arquivos/ids/33448765/Axion-Limon-2-Unds-P-Especial-X-450-gr-441781_a.jpg?v=639148775328230000',
  true, 177
),
(
  'a1200000-0000-4000-a102-000000000179', 'b1100000-0000-4000-a110-000000000002', 'Suavizante DERSA con cápsulas de fragancia (4000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/suavizante-caps-fraganci-dersa-sin-ref-666427/p. Marca: DERSA. Lleva a casa fácil y rápido Suavizante DERSA con cápsulas de fragancia (4000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 29200, 'Suavizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/33657702/Suavizante-Caps-Fraganci-DERSA-SIN-REF-833751_a.jpg?v=639162659907870000',
  true, 178
),
(
  'a1200000-0000-4000-a102-000000000180', 'b1100000-0000-4000-a110-000000000002', 'Blanqueador CLOROX gel lavanda (1000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/blanqueador-power-gel-lavanda-x-1000-ml-651813/p. Marca: CLOROX. Contenido suministrado a Almacenes Éxito directamente por Clorox Blanqueador en Gel Clorox Lavanda 1 lt Características Blanqueador en Gel Clorox 5 en 1 con aroma a lavanda: Limpia, desinfecta, elimina olores, desengrasa y remueve moho con p',
  '🛒', 9770, 'Jabones, detergentes y limpiadores', 'https://exitocol.vteximg.com.br/arquivos/ids/32030838/Blanqueador-Power-Gel-Lavanda-X-1000-ml-566445_a.jpg?v=639015795204330000',
  true, 179
),
(
  'a1200000-0000-4000-a102-000000000181', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas FRITO LAY surtidos (586  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/surtido-mega-lonchera-frito-lay-586-gr-3090203/p. Marca: FRITO LAY. Lleva a casa fácil y rápido Pasabocas FRITO LAY surtidos (586 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 18200, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33267909/Surtido-Mega-Lonchera-FRITO-LAY-586-gr-3285022_a.jpg?v=639131827328070000',
  true, 180
),
(
  'a1200000-0000-4000-a102-000000000182', 'b1100000-0000-4000-a110-000000000002', 'Rosquitas SANISSIMO con chía quinua (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/rosquitas-sanissimo-sanissimo-120-gr-3071552/p. Marca: SANISSIMO. Lleva a casa fácil y rápido Rosquitas SANISSIMO con chía quinua (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14850, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33877715/Rosquitas-Sanissimo-SANISSIMO-120-gr-3210263_a.jpg?v=639186166586000000',
  true, 181
),
(
  'a1200000-0000-4000-a102-000000000183', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas DORITOS megaqueso (200  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-maiz-queso-doritos-200-gr-3027722/p. Marca: DORITOS. Lleva a casa fácil y rápido Pasabocas DORITOS megaqueso (200 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7360, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33178218/Pasabocas-Maiz-Queso-DORITOS-200-gr-3055858_a.jpg?v=639125431284930000',
  true, 182
),
(
  'a1200000-0000-4000-a102-000000000184', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA receta clásica alitas BBQ (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-receta-clasica-alitas-bbq-tamano-familiar-323230/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA receta clásica alitas BBQ (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9600, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172356/Papa-Receta-Clasica-Alitas-Bbq-Tamano-Familiar-609361_a.jpg?v=639124897515830000',
  true, 183
),
(
  'a1200000-0000-4000-a102-000000000185', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA receta clásica sal marina (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-receta-clasica-natural-tamano-familiar-323227/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA receta clásica sal marina (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172353/Papa-Receta-Clasica-Natural-Tamano-Familiar-609267_a.jpg?v=639124897499000000',
  true, 184
),
(
  'a1200000-0000-4000-a102-000000000186', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA de pollo (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-clasica-de-pollo-pqt-x-12-unids-244458/p. Marca: MARGARITA. Características: Papas fritas sabor a pollo margarita fruto lay 12 unidades. Papas seleccionadas,aceite vegetal,sal con sabor a pollo (sal,anticompactante (maltodextrina),sabor artificial,azúcar y resaltador de sabor (glutamanato monosódico)',
  '🛒', 17815, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172345/Papa-Clasica-De-Pollo-Pqt-X-12-Unids-391202_a.jpg?v=639124897435930000',
  true, 185
),
(
  'a1200000-0000-4000-a102-000000000187', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA de pollo (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-familiar-pollo-172445/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA de pollo (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6590, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172403/papa-familiar-pollo-1508926_a.jpg?v=639124899991500000',
  true, 186
),
(
  'a1200000-0000-4000-a102-000000000188', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA de limón (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-familiar-limon-172443/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA de limón (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5512, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172397/papa-familiar-limon-1508924_a.jpg?v=639124899958500000',
  true, 187
),
(
  'a1200000-0000-4000-a102-000000000189', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA de limón (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-clasica-de-limon-pqt-x-12-unids-60914/p. Marca: MARGARITA. Papa Clasica De Limon Pqt X 12 Unids Características Papas limón pack económico margarita. Almacenamiento: mantener en un lugar fresco y seco.',
  '🛒', 17640, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172339/Papa-Clasica-De-Limon-Pqt-X-12-Unids-20431_a.jpg?v=639124897402530000',
  true, 188
),
(
  'a1200000-0000-4000-a102-000000000190', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA caramelizada (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-margarita-caramelizada-120-gr-3183750/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA caramelizada (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33498220/Papas-MARGARITA-CARAMELIZADA-120-gr-3594318_a.jpg?v=639153203543600000',
  true, 189
),
(
  'a1200000-0000-4000-a102-000000000191', 'b1100000-0000-4000-a110-000000000002', 'Papas SUPER RICAS fritas fosforitos (160  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-fritas-fosforitos-super-ricas-160-gr-3148485/p. Marca: SUPER RICAS. Lleva a casa fácil y rápido Papas SUPER RICAS fritas fosforitos (160 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9130, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/32133639/Papas-Fritas-Fosforitos-SUPER-RICAS-160-gr-3483131_a.jpg?v=639023536351430000',
  true, 190
),
(
  'a1200000-0000-4000-a102-000000000192', 'b1100000-0000-4000-a110-000000000002', 'Papas MONTE ROJO de BBQ (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-bbq-dulce-monte-rojo-100-gr-3133769/p. Marca: MONTE ROJO. Lleva a casa fácil y rápido Papas MONTE ROJO de BBQ (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6900, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/32825213/Papas-Bbq-Dulce-MONTE-ROJO-100-gr-3425743_a.jpg?v=639095112746900000',
  true, 191
),
(
  'a1200000-0000-4000-a102-000000000193', 'b1100000-0000-4000-a110-000000000002', 'Frutos secos LA ESPECIAL nueces, almendra, marañón y maní (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-mezcla-nueces-la-especial-400-gr-3076068/p. Marca: LA ESPECIAL. Lleva a casa fácil y rápido Frutos secos LA ESPECIAL nueces, almendra, marañón y maní (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 24450, 'Nueces, pistachos y frutos secos', 'https://exitocol.vteximg.com.br/arquivos/ids/32133271/Pasabocas-Mezcla-Nueces-LA-ESPECIAL-400-gr-3228804_a.jpg?v=639023532334330000',
  true, 192
),
(
  'a1200000-0000-4000-a102-000000000194', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas DETODITO pasaboca (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasaboca-detodito-mix-detodito-165-gr-3062382/p. Marca: DETODITO. Lleva a casa fácil y rápido Pasabocas DETODITO pasaboca (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8075, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172696/Pasaboca-Detodito-Mix-DETODITO-165-gr-3177660_a.jpg?v=639124902827230000',
  true, 193
),
(
  'a1200000-0000-4000-a102-000000000195', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas DETODITO de BBQ (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-bbq-detodito-165-gr-3060364/p. Marca: DETODITO. Lleva a casa fácil y rápido Pasabocas DETODITO de BBQ (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7600, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33454394/Pasabocas-BBQ-DETODITO-165-gr-3168433_a.jpg?v=639148870372100000',
  true, 194
),
(
  'a1200000-0000-4000-a102-000000000196', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas DETODITO naturales (165  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasaboca-165-natural-detodito-165-gr-3059997/p. Marca: DETODITO. Lleva a casa fácil y rápido Pasabocas DETODITO naturales (165 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8075, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172687/Pasaboca-165-Natural-DETODITO-165-gr-3166476_a.jpg?v=639124902758370000',
  true, 195
),
(
  'a1200000-0000-4000-a102-000000000197', 'b1100000-0000-4000-a110-000000000002', 'Rosquitas BIMBO almidón de yuca y queso (120  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/multipack-rosquitas-bimbo-120-gr-3050603/p. Marca: BIMBO. Lleva a casa fácil y rápido Rosquitas BIMBO almidón de yuca y queso (120 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 11200, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33877713/Multipack-Rosquitas-BIMBO-120-gr-3141914_a.jpg?v=639186166521330000',
  true, 196
),
(
  'a1200000-0000-4000-a102-000000000198', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA crema cebolla (110  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-crema-cebolla-margarita-110-gr-3024868/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA crema cebolla (110 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5505, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33669934/Papas-crema-cebolla-MARGARITA-110-gr-3043695_a.jpg?v=639166126370970000',
  true, 197
),
(
  'a1200000-0000-4000-a102-000000000199', 'b1100000-0000-4000-a110-000000000002', 'Maní Recubierto LA ESPECIAL Kraks (140  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-recubierto-la-especial-140-gr-3023625/p. Marca: LA ESPECIAL. Lleva a casa fácil y rápido Maní Recubierto LA ESPECIAL Kraks (140 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5720, 'Nueces, pistachos y frutos secos', 'https://exitocol.vteximg.com.br/arquivos/ids/26690213/Pasabocas-Recubierto-LA-ESPECIAL-140-gr-3039624_a.jpg?v=638740645250930000',
  true, 198
),
(
  'a1200000-0000-4000-a102-000000000200', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA receta clásica limón pimienta (115  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-rec-clasica-lim-pim-famil-605798/p. Marca: MARGARITA. Características Papas Fritas Lima y Pimienta Bolsa x 145g. Marca: Margarita. Caracter?sticas: Nuevo sabor con la mejor receta cl?sica de las papas fritas Margarita con lima y pimienta negra, m?s gruesas, m?s doraditas, m?s crocantes y con c?scara.',
  '🛒', 9500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172373/Papa-Rec-Clasica-Lim-Pim-Famil-543184_a.jpg?v=639124899747830000',
  true, 199
),
(
  'a1200000-0000-4000-a102-000000000201', 'b1100000-0000-4000-a110-000000000002', 'Frutos secos LA ESPECIAL arándanos (450  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/mani-con-arandanos-almendras-y-maiz-tostado-x-450-gr-527455/p. Marca: LA ESPECIAL. Lleva a casa fácil y rápido Frutos secos LA ESPECIAL arándanos (450 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 24200, 'Nueces, pistachos y frutos secos', 'https://exitocol.vteximg.com.br/arquivos/ids/32133255/Mani-Con-Arandanos-Almendras-Y-Maiz-Tostado-X-450-gr-309034_a.jpg?v=639023532239900000',
  true, 200
),
(
  'a1200000-0000-4000-a102-000000000202', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas CHEETOS naturales (180  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cheetos-15-grs-x-12-unidades-471975/p. Marca: CHEETOS. Cheetos 15 Grs X 12 Unidades Características Cheetos horneados 12 unidades. Una vez abierto consuma en el menor tiempo posible. Conserve en un lugar fresco y seco Cheetos horneados,tamaño maxi,hechos de cereal de maíz,sin colorantes artificiales,25% r',
  '🛒', 14100, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172366/Cheetos-15-Grs-X-12-Unidades-243930_a.jpg?v=639124897589630000',
  true, 201
),
(
  'a1200000-0000-4000-a102-000000000203', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas TODO RICO de BBQ (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pasabocas-mezcla-barbq-todo-rico-150-gramo-370027/p. Marca: TODO RICO. Contenido suministrado a Almacenes Éxito directamente por TODO RICO Todorico Bbq 150Gr X 1 Características Todo Ricos es una Mezcla de papas, chicharrones y platanos con sabor a BBQ Modo de uso Acompañantes de Comidas',
  '🛒', 8500, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33538804/PASABOCAS-MEZCLA-BARBQ-TODO-RICO-150-Gramo-1774230_a.jpg?v=639154407782100000',
  true, 202
),
(
  'a1200000-0000-4000-a102-000000000204', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA receta clásica sal marina (228  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-mgta-rcta-clasica-nat-323229/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA receta clásica sal marina (228 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19700, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172418/PAPA-MGTA-RCTA-CLASICA-NAT-609299_a.jpg?v=639124900086900000',
  true, 203
),
(
  'a1200000-0000-4000-a102-000000000205', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA onduladas tomate (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-ondulada-tomate-172449/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA onduladas tomate (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4942, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172409/papa-ondulada-tomate-1508928_a.jpg?v=639124900025330000',
  true, 204
),
(
  'a1200000-0000-4000-a102-000000000206', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA onduladas mayonesa (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-ondulada-mayonesa-familia-172448/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA onduladas mayonesa (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5167, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172406/papa-ondulada-mayonesa-familia-1508927_a.jpg?v=639124900007570000',
  true, 205
),
(
  'a1200000-0000-4000-a102-000000000207', 'b1100000-0000-4000-a110-000000000002', 'Papas MARGARITA naturales (105  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-familiar-natural-172444/p. Marca: MARGARITA. Lleva a casa fácil y rápido Papas MARGARITA naturales (105 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5512, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33172400/papa-familiar-natural-1508925_a.jpg?v=639124899976200000',
  true, 206
),
(
  'a1200000-0000-4000-a102-000000000208', 'b1100000-0000-4000-a110-000000000002', 'Platanitos NATUCHIPS verdes (336  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/natuchips-platano-verde-28-grs-x-12-unidades-137768/p. Marca: NATUCHIPS. Características Plátano verde natuchips 12 unidades. Hojuelas de plátano verde, naturalmente deliciosos. Plátano, aceite vegetal oleína de palma, azúcar. Advertencias: manténgase en un lugar fresco y seco.',
  '🛒', 24200, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33178159/Natuchips-Platano-Verde-28-Grs-X-12-Unidades-716033_a.jpg?v=639125430808730000',
  true, 207
),
(
  'a1200000-0000-4000-a102-000000000209', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas maizitos RAMO natural (360  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/maizitos-naturales-ramo-x-12-unidades-99668/p. Marca: RAMO. CARACTERISTICAS Maizitos naturales, pasabocas de puro maíz, libre de grasa trans. Consérvese en un lugar fresco. Una vez abierto consuma en el menor tiempo posible.',
  '🛒', 13950, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/32133392/Maizitos-Naturales-Ramo-X-12-Unidades-213056_a.jpg?v=639023533165700000',
  true, 208
),
(
  'a1200000-0000-4000-a102-000000000210', 'b1100000-0000-4000-a110-000000000002', 'Pasabocas DORITOS megaqueso (340  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/doritos-megaqueso-38-grs-x-10-unidades-89217/p. Marca: DORITOS. Doritos Megaqueso 38 Grs X 10 Unidades Características Una vez abierto consuma en el menor tiempo posible. Conserve en un lugar fresco y seco Pasabocas de maíz con sabor artificial a queso. Maíz, aceite vegetal, saborizante artificial a queso',
  '🛒', 22350, 'Papas fritas y paquetes', 'https://exitocol.vteximg.com.br/arquivos/ids/33178153/Doritos-Megaqueso-38-Grs-X-10-Unidades-630182_a.jpg?v=639125430769130000',
  true, 209
),
(
  'a1200000-0000-4000-a102-000000000211', 'b1100000-0000-4000-a110-000000000002', 'Soda BRETANA botella  (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bretana-15-litros-963452/p. Marca: BRETANA. Características Consumir en el menor tiempo posible después de abierto Consumir preferiblemente antes de fecha de expiración. Consumir bien fria. Bebida carbonatada Agua carbonatada.',
  '🧹', 3500, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28928155/Bretana-15-Litros-839787_a.jpg?v=638859457997670000',
  true, 210
),
(
  'a1200000-0000-4000-a102-000000000212', 'b1100000-0000-4000-a110-000000000002', 'Soda BRETANA botella vidrio x12und  (3600  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/of-soda-pague-9-lleve-12-365350/p. Marca: BRETANA. Lleva a casa fácil y rápido Soda BRETANA botella vidrio x12und (3600 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 23700, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32829826/Of-Soda-Pague-9-Lleve-12-1443507_a.jpg?v=639095354129330000',
  true, 211
),
(
  'a1200000-0000-4000-a102-000000000213', 'b1100000-0000-4000-a110-000000000002', 'Agua FRESCAMPO potable tratada (5000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-sin-gas-frescampo-5000-mililitro-256680/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Agua FRESCAMPO potable tratada (5000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3950, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/33497279/Agua-Sin-Gas-FRESCAMPO-5000-Mililitro-1512413_a.jpg?v=639153196979300000',
  true, 212
),
(
  'a1200000-0000-4000-a102-000000000214', 'b1100000-0000-4000-a110-000000000002', 'Malta PONY MALTA go x6und (1200  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-pony-malta-malta-1200-ml-3176913/p. Marca: PONY MALTA. Lleva a casa fácil y rápido Malta PONY MALTA go x6und (1200 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 7165, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28927458/Bebida-PONY-MALTA-Malta-1200-ml-3569537_a.jpg?v=638859452892970000',
  true, 213
),
(
  'a1200000-0000-4000-a102-000000000215', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa COCA COLA familiar (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gaseosa-cocacola-coca-cola-3000-ml-3048038/p. Marca: COCA COLA. Lleva a casa fácil y rápido Gaseosa COCA COLA familiar (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 8600, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32345607/GASEOSA-COCACOLA-COCA-COLA-3000-ml-3133440_a.jpg?v=639052296428470000',
  true, 214
),
(
  'a1200000-0000-4000-a102-000000000216', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa Coca Cola ZERO botella familiar (2500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/coca-cola-sin-azucar-x-2500-ml-904178/p. Marca: ZERO. Contenido suministrado a Almacenes Éxito directamente por INDUSTRIA NACIONAL DE GASEOSA Coca-Cola Sin Azucar 2.5 Lt',
  '🧹', 6400, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32345581/Coca-Cola-Sin-Azucar-X-2500-ml-308279_a.jpg?v=639052296350300000',
  true, 215
),
(
  'a1200000-0000-4000-a102-000000000217', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa Coca Cola ZERO botella (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/coca-cola-zero-1500-ml-594203/p. Marca: ZERO. Contenido suministrado a Almacenes Éxito directamente por INDUSTRIA NACIONAL DE GASEOSA Coca-Cola Sin Azucar 1.5 Lt',
  '🧹', 5017, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/34087937/Coca-Cola-Zero-1500-ml-185260_a.jpg?v=639197437960430000',
  true, 216
),
(
  'a1200000-0000-4000-a102-000000000218', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa COCA COLA original (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-gaseosa-original-316451/p. Marca: COCA COLA. Lleva a casa fácil y rápido Gaseosa COCA COLA original (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 6950, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/34087933/BEBIDA-GASEOSA-ORIGINAL-1554892_a.jpg?v=639197437946400000',
  true, 217
),
(
  'a1200000-0000-4000-a102-000000000219', 'b1100000-0000-4000-a110-000000000002', 'Agua con gas BRISA saborizada surtida x6und (6  UNIDAD) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-brisa-agua-saborizada-gas-manzana-li-6-unidad-3182500/p. Marca: BRISA. Lleva a casa fácil y rápido Agua con gas BRISA saborizada surtida x6und (6 UNIDAD). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8600, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/33503351/Bebida-BRISA-Agua-Saborizada-Gas-Manzana-Li-6-UNIDAD-3586858_a.jpg?v=639153326316000000',
  true, 218
),
(
  'a1200000-0000-4000-a102-000000000220', 'b1100000-0000-4000-a110-000000000002', 'Soda FRESCAMPO botella (1700  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/soda-frescampo-1700-ml-3091857/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Soda FRESCAMPO botella (1700 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 2100, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/33173737/Soda-FRESCAMPO-1700-ml-3293026_a.jpg?v=639124919946200000',
  true, 219
),
(
  'a1200000-0000-4000-a102-000000000221', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa Coca Cola ZERO botella x6und (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-gaseosa-sin-azucar-coca-cola-1500-ml-3037910/p. Marca: ZERO. Lleva a casa fácil y rápido Gaseosa Coca Cola ZERO botella x6und (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 8650, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32345601/Bebida-Gaseosa-Sin-Azucar-COCA-COLA-1500-ml-3095376_a.jpg?v=639052296409570000',
  true, 220
),
(
  'a1200000-0000-4000-a102-000000000222', 'b1100000-0000-4000-a110-000000000002', 'Agua con gas BRISA manzana (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-saborizada-manzana-brisa-1500-mililitro-3002638/p. Marca: BRISA. Lleva a casa fácil y rápido Agua con gas BRISA manzana (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3330, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28931581/BEBIDA-SABORIZADA-MANZANA-BRISA-1500-Mililitro-3003705_a.jpg?v=638859668154400000',
  true, 221
),
(
  'a1200000-0000-4000-a102-000000000223', 'b1100000-0000-4000-a110-000000000002', 'Agua FRESCAMPO sin gas  (1100  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-pura-sin-gas-985802/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Agua FRESCAMPO sin gas (1100 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 1250, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28929769/AGUA-PURA-SIN-GAS-1375498_a.jpg?v=638859482288400000',
  true, 222
),
(
  'a1200000-0000-4000-a102-000000000224', 'b1100000-0000-4000-a110-000000000002', 'Té HATSU surtido caja x12und 200ml (2400  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/te-tetrapak-surtido-x-12-933249/p. Marca: HATSU. Lleva a casa fácil y rápido Té HATSU surtido caja x12und 200ml (2400 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22200, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28931531/Te-Tetrapak-Surtido-X-12-1306243_a.jpg?v=638859665070870000',
  true, 223
),
(
  'a1200000-0000-4000-a102-000000000225', 'b1100000-0000-4000-a110-000000000002', 'Soda BRETANA botella x2und (3000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/duo-soda-929684/p. Marca: BRETANA. Lleva a casa fácil y rápido Soda BRETANA botella x2und (3000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 7910, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/33520367/Duo-Soda-1302067_a.jpg?v=639154123208300000',
  true, 224
),
(
  'a1200000-0000-4000-a102-000000000226', 'b1100000-0000-4000-a110-000000000002', 'Agua FRESCAMPO sin gas x12und (3720  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-pura-sin-gas-928420/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Agua FRESCAMPO sin gas x12und (3720 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6480, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28931286/Agua-Pura-Sin-Gas-1299743_a.jpg?v=638859656143130000',
  true, 225
),
(
  'a1200000-0000-4000-a102-000000000227', 'b1100000-0000-4000-a110-000000000002', 'Agua CRISTAL sin gas botella x24und 300ml (7200  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/agua-ahorra-pack-pet-845228/p. Marca: CRISTAL. Lleva a casa fácil y rápido Agua CRISTAL sin gas botella x24und 300ml (7200 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 19500, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/28929745/Agua-Ahorra-Pack-Pet-1140185_a.jpg?v=638859482100200000',
  true, 226
),
(
  'a1200000-0000-4000-a102-000000000228', 'b1100000-0000-4000-a110-000000000002', 'Refresco HIT surtido caja x6und (1000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/of-hit-pague-5-lleve-6-821579/p. Marca: HIT. CARACTERISTICAS Bebida sabores surtidos pague 5 lleve 6 und. Marca: Hit. Características: bebida sabores surtidos x 200 ml por und. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco, despúes de abierto consúmase en el menor tiempo posibl',
  '🛒', 7510, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/29729170/Of-Hit-Pague-5-Lleve-6-569628_a.jpg?v=638912401999430000',
  true, 227
),
(
  'a1200000-0000-4000-a102-000000000229', 'b1100000-0000-4000-a110-000000000002', 'Bebida gasificada H2O lima limón (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/h2oh-lima-limon-pet-15-lts-675974/p. Marca: H2O. Lleva a casa fácil y rápido Bebida gasificada H2O lima limón (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4216, 'Agua y té', 'https://exitocol.vteximg.com.br/arquivos/ids/33520599/H2oh-Lima-Limon-Pet-15-Lts-16446_a.jpg?v=639154126861270000',
  true, 228
),
(
  'a1200000-0000-4000-a102-000000000230', 'b1100000-0000-4000-a110-000000000002', 'Soda SCHWEPPES botella (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/schweppes-soda-15-lt-594180/p. Marca: SCHWEPPES. Lleva a casa fácil y rápido Soda SCHWEPPES botella (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 3300, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28929336/Schweppes-Soda-15-lt-185163_a.jpg?v=638859476009830000',
  true, 229
),
(
  'a1200000-0000-4000-a102-000000000231', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa SCHWEPPES ginger ale botella vidrio (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/soda-ginger-594179/p. Marca: SCHWEPPES. Características Ginger Ale',
  '🧹', 5230, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/32294520/Soda-Ginger-185142_a.jpg?v=639046066316270000',
  true, 230
),
(
  'a1200000-0000-4000-a102-000000000232', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa QUATRO toronja original (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gaseosa-593773/p. Marca: QUATRO. Características Bebida Gaseosa Sabor Toronja Botella X 1500Ml. Marca: Quatro. Información alergénica: Contiene tartrazina. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco, después de abierto consúmase en el menor tiempo posible.',
  '🧹', 3592, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28928003/Gaseosa-184661_a.jpg?v=638859456801800000',
  true, 231
),
(
  'a1200000-0000-4000-a102-000000000233', 'b1100000-0000-4000-a110-000000000002', 'Refresco HIT surtido caja x12und (2000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-surtido-pag10-llev12-283704/p. Marca: HIT. Características Bebida Hit Sabores Surtidos Paq.Paga 10 Lleva 12. Marca: Hit. Características: Bebida Hit Sabores Surtidos Paq.Paga 10 Lleva 12 x 200 ml por und. Almacenamiento: Consérvese bien cerrado en un lugar limpio, fresco y seco, después de abierto ',
  '🛒', 15750, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/29198116/Bebida-Surtido-Pag10-Llev12-913828_a.jpg?v=638885349726800000',
  true, 232
),
(
  'a1200000-0000-4000-a102-000000000234', 'b1100000-0000-4000-a110-000000000002', 'Bebida DEL VALLE fresh frutas cítricas (1500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-naranja-citrus-del-valle-1500-ml-158499/p. Marca: DEL VALLE. Lleva a casa fácil y rápido Bebida DEL VALLE fresh frutas cítricas (1500 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3015, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929546/Bebida-Naranja-Citrus-DEL-VALLE-1500-ml-1559370_a.jpg?v=638859479403730000',
  true, 233
),
(
  'a1200000-0000-4000-a102-000000000235', 'b1100000-0000-4000-a110-000000000002', 'Refresco HIT frutas tropicales botella  (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hit-frutas-tropicales-pet-500-ml-90121/p. Marca: HIT. Características *Refresco de frutas tropicales pasterizado hit 500ml *Manténgase refrigerado. Después de abierto consuma en el menor tiempo posible.',
  '🛒', 3040, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929574/Hit-Frutas-Tropicales-Pet-500-ml-706526_a.jpg?v=638859479925870000',
  true, 234
),
(
  'a1200000-0000-4000-a102-000000000236', 'b1100000-0000-4000-a110-000000000002', 'Refresco HIT mora botella  (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hit-mora-pet-500-ml-88065/p. Marca: HIT. Características *Refresco de mora pasterizado hit 500ml *Manténgase refrigerado. Después de abierto consuma en el menor tiempo posible.',
  '🛒', 3040, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929587/Hit-Mora-Pet-500-ml-706101_a.jpg?v=638859480012030000',
  true, 235
),
(
  'a1200000-0000-4000-a102-000000000237', 'b1100000-0000-4000-a110-000000000002', 'Refresco HIT mango botella  (500  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hit-mango-pet-500-ml-86806/p. Marca: HIT. Características *Refresco de mango pasterizado Hit *Manténgase refrigerado. Después de abierto consuma en el menor tiempo posible.',
  '🛒', 3040, 'Jugos', 'https://exitocol.vteximg.com.br/arquivos/ids/28929584/Hit-Mango-Pet-500-ml-706021_a.jpg?v=638859479991930000',
  true, 236
),
(
  'a1200000-0000-4000-a102-000000000238', 'b1100000-0000-4000-a110-000000000002', 'Gaseosa POSTOBON manzana botella (3125  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gaseosa-manzana-38971/p. Marca: POSTOBON. Lleva a casa fácil y rápido Gaseosa POSTOBON manzana botella (3125 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧹', 7720, 'Gaseosas y sodas', 'https://exitocol.vteximg.com.br/arquivos/ids/28927929/Gaseosa-Manzana-987616_a.jpg?v=638859456380370000',
  true, 237
),
(
  'a1200000-0000-4000-a102-000000000239', 'b1100000-0000-4000-a110-000000000002', 'Bebida de almendras TAEQ sin azúcares añadidos (1000  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-de-almendra-sin-azucar-taeq-1000-mililitro-26810/p. Marca: TAEQ. Lleva a casa fácil y rápido Bebida de almendras TAEQ sin azúcares añadidos (1000 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥤', 9250, 'Bebidas de cereal', 'https://exitocol.vteximg.com.br/arquivos/ids/33497319/Bebida-de-almendra-sin-azucar-TAEQ-1000-Mililitro-1743103_a.jpg?v=639153197297700000',
  true, 238
),
(
  'a1200000-0000-4000-a102-000000000240', 'b1100000-0000-4000-a110-000000000002', 'Bebida hidratante HIDRALYTE con electrolitos, fresakiwi (640  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bebida-hidralyte-hidratante-electrolitos-fresa-640-ml-3219502/p. Marca: HIDRALYTE. Lleva a casa fácil y rápido Bebida hidratante HIDRALYTE con electrolitos, fresa-kiwi (640 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4280, 'Hidratantes y energizantes', 'https://exitocol.vteximg.com.br/arquivos/ids/31272549/Bebida-HIDRALYTE-Hidratante-Electrolitos-Fresa-640-ml-3728648_a.jpg?v=639162827556500000',
  true, 239
),
(
  'a1200000-0000-4000-a102-000000000241', 'b1100000-0000-4000-a110-000000000002', 'Papa Francesa FACIL 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-francesa-x500-gramos-632990/p. Marca: FACIL. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia PAPAFACIL PAPA DELGADA 9X9 500 GR Deliciosas papas a la francesa, acompañamiento perfecto para tus comidas.',
  '🥬', 7810, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757784/Papa-Francesa-X500-Gramos-680662_a.jpg?v=639089486306500000',
  true, 240
),
(
  'a1200000-0000-4000-a102-000000000242', 'b1100000-0000-4000-a110-000000000002', 'Papa delgada  RAPI 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-a-la-francesa-prefreida-y-congelada-delgada-x-1000-gr-250363/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN PAPA DELGADA 9X9 1000 GR El perfecto balance entre crocancia y suavidad, se llevan bien concualquier menú.Las papas a la francesa McCain son do',
  '🥬', 20950, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643574/Papa-A-La-Francesa-Prefreida-Y-Congelada-Delgada-X-1000-gr-661212_a.jpg?v=639077053939830000',
  true, 241
),
(
  'a1200000-0000-4000-a102-000000000243', 'b1100000-0000-4000-a110-000000000002', 'Papa kilo FACIL 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-a-la-francesa-prefreidas-y-congeladas-x1000gr-778558/p. Marca: FACIL. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia PAPAFACIL PAPA DELGADA 9X9 1000 GR Deliciosas papas a la francesa, acompañamiento perfecto para tus comidas.',
  '🥬', 18000, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643580/Papas-A-La-Francesa-Prefreidas-Y-Congeladas-X1000gr-381217_a.jpg?v=639077053982270000',
  true, 242
),
(
  'a1200000-0000-4000-a102-000000000244', 'b1100000-0000-4000-a110-000000000002', 'Papas Airfryer  MC CAIN 700  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-airfryer-rapi-700-gr-3083018/p. Marca: MC CAIN. Lleva a casa fácil y rápido Papas Airfryer MC CAIN 700 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 20750, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/33172870/Papas-Airfryer-RAPI-700-gr-3257352_a.jpg?v=639124903981800000',
  true, 243
),
(
  'a1200000-0000-4000-a102-000000000245', 'b1100000-0000-4000-a110-000000000002', 'Vegetales Mixtos Congelados FRESCAMPO 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/vegetales-mixtos-congelados-frescampo-500-gr-3079187/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Vegetales Mixtos Congelados FRESCAMPO 500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 8480, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32758577/Vegetales-Mixtos-Congelados-FRESCAMPO-500-gr-3240263_a.jpg?v=639089492789870000',
  true, 244
),
(
  'a1200000-0000-4000-a102-000000000246', 'b1100000-0000-4000-a110-000000000002', 'Papas Prefritas Congeladas FRESCAMPO 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-prefritas-congeladas-frescampo-1000-gr-3079186/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Papas Prefritas Congeladas FRESCAMPO 1000 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 12500, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32650922/Papas-Prefritas-Congeladas-FRESCAMPO-1000-gr-3240262_a.jpg?v=639077954024300000',
  true, 245
),
(
  'a1200000-0000-4000-a102-000000000247', 'b1100000-0000-4000-a110-000000000002', 'Maiz Congelado FRESCAMPO 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/maiz-congelado-frescampo-500-gr-3079185/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Maiz Congelado FRESCAMPO 500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 9230, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32650921/Maiz-Congelado-FRESCAMPO-500-gr-3240261_a.jpg?v=639077954013630000',
  true, 246
),
(
  'a1200000-0000-4000-a102-000000000248', 'b1100000-0000-4000-a110-000000000002', 'Maíz Descranado x500gr  MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/maiz-desgranado-x-500g-613330/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL MAIZ EN GRANO 500 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorantes y conserva',
  '🥬', 16050, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643578/Maiz-Desgranado-X-500g-520889_a.jpg?v=639077053969700000',
  true, 247
),
(
  'a1200000-0000-4000-a102-000000000249', 'b1100000-0000-4000-a110-000000000002', 'Papa Tradicional x 1000gr  RAPI 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-a-la-francesa-prefreida-y-congelada-tradicional-x1000g-477676/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN TRADICIONAL 13X13 1000 GR Las favoritas de muchos, su corte hace que sean esponjosas y llenas de sabor.Las papas a la francesa McCain son dora',
  '🥬', 21750, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757778/Papa-A-La-Francesa-Prefreida-Y-Congelada-Tradicional-X1000g-760117_a.jpg?v=639089486262930000',
  true, 248
),
(
  'a1200000-0000-4000-a102-000000000250', 'b1100000-0000-4000-a110-000000000002', 'Chococono CREM HELADO cobertura chocolate x6und (540  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cono-chococono-pack-x6-crem-helado-540-gr-308182/p. Marca: CREM HELADO. Lleva a casa fácil y rápido Chococono CREM HELADO cobertura chocolate x6und (540 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 23700, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33552799/Cono-Chococono-Pack-X6-CREM-HELADO-540-gr-1752939_a.jpg?v=639154967470370000',
  true, 249
),
(
  'a1200000-0000-4000-a102-000000000251', 'b1100000-0000-4000-a110-000000000002', 'Yuca  RAPI 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/yuca-298679/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN YUCA JUMBO 500 GR Las Croquetas de Yuca McCain tienen un delicioso sabor, la calidad que siempre encontrará en los productos McCain ahora en un alimento de origen 100% Colombiano.',
  '🥬', 9000, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757772/Yuca-193140_a.jpg?v=639089486227270000',
  true, 250
),
(
  'a1200000-0000-4000-a102-000000000252', 'b1100000-0000-4000-a110-000000000002', 'Frambuesas FRANUI bañadas chocolate blanco y amargo (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/frambuesas-choc-franui-1-und-3173794/p. Marca: FRANUI. Lleva a casa fácil y rápido Frambuesas FRANUI bañadas chocolate blanco y amargo (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 29050, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33563965/Frambuesas-Choc-FRANUI-1-und-3559225_a.jpg?v=639155763798070000',
  true, 251
),
(
  'a1200000-0000-4000-a102-000000000253', 'b1100000-0000-4000-a110-000000000002', 'Palitos De Queso ZENU 252  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/palitos-de-queso-zenu-252-gr-3158779/p. Marca: ZENU. Lleva a casa fácil y rápido Palitos De Queso ZENU 252 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 17500, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/32758762/Palitos-De-Queso-ZENU-252-gr-3526207_a.jpg?v=639089495698370000',
  true, 252
),
(
  'a1200000-0000-4000-a102-000000000254', 'b1100000-0000-4000-a110-000000000002', 'Palitos Queso ZENU 440  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/palitos-queso-zenu-440-gr-3158762/p. Marca: ZENU. Lleva a casa fácil y rápido Palitos Queso ZENU 440 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 26350, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/32907608/Palitos-Queso-ZENU-440-gr-3526095_a.jpg?v=639101563274530000',
  true, 253
),
(
  'a1200000-0000-4000-a102-000000000255', 'b1100000-0000-4000-a110-000000000002', 'Arepa De Huevo Congelada FRESCAMPO 10  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arepa-de-huevo-congelada-frescampo-11-gr-3128162/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Arepa De Huevo Congelada FRESCAMPO 10 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 28800, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/33563667/Arepa-De-Huevo-Congelada-FRESCAMPO-11-gr-3405393_a.jpg?v=639155755999530000',
  true, 254
),
(
  'a1200000-0000-4000-a102-000000000256', 'b1100000-0000-4000-a110-000000000002', 'Empanada Con Carne Cong  FRESCAMPO 10  und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/empanada-con-carne-cong-x-70g-frescampo-07-gr-3128116/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Empanada Con Carne Cong FRESCAMPO 10 und. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 19200, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/32758639/Empanada-Con-Carne-Cong-x-70g-FRESCAMPO-07-gr-3405347_a.jpg?v=639089495005070000',
  true, 255
),
(
  'a1200000-0000-4000-a102-000000000257', 'b1100000-0000-4000-a110-000000000002', 'Papas Zig Zag MC CAIN 1500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-rizadas-mega-mc-cain-1500-gr-3098985/p. Marca: MC CAIN. Lleva a casa fácil y rápido Papas Zig Zag MC CAIN 1500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 37350, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32758602/Papas-Rizadas-Mega-MC-CAIN-1500-gr-3320446_a.jpg?v=639089492938700000',
  true, 256
),
(
  'a1200000-0000-4000-a102-000000000258', 'b1100000-0000-4000-a110-000000000002', 'Papas Crispers MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-crispers-rapi-500-gr-3083017/p. Marca: MC CAIN. Lleva a casa fácil y rápido Papas Crispers MC CAIN 500 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 12600, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/33172868/Papas-Crispers-RAPI-500-gr-3257351_a.jpg?v=639124903967670000',
  true, 257
),
(
  'a1200000-0000-4000-a102-000000000259', 'b1100000-0000-4000-a110-000000000002', 'Papas Delgadas ZENU 900  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papas-delgadas-zenu-900-gramo-3009452/p. Marca: ZENU. Lleva a casa fácil y rápido Papas Delgadas ZENU 900 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥬', 17900, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757920/Papas-Delgadas-ZENU-900-Gramo-3013610_a.jpg?v=639089489803270000',
  true, 258
),
(
  'a1200000-0000-4000-a102-000000000260', 'b1100000-0000-4000-a110-000000000002', 'Pan baguette BIMBO mini tradicional  (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/baguette-tradicional-panettiere-400-gramo-3003556/p. Marca: BIMBO. Lleva a casa fácil y rápido Pan baguette BIMBO mini tradicional (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🧊', 8340, 'Comidas congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757904/BAGUETTE-TRADICIONAL-PANETTIERE-400-Gramo-3005737_a.jpg?v=639089489693600000',
  true, 259
),
(
  'a1200000-0000-4000-a102-000000000261', 'b1100000-0000-4000-a110-000000000002', 'Papa Zig Zag RAPI 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/papa-a-la-francesa-prefreida-y-congelada-rizadas-x1000g-798138/p. Marca: RAPI. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN PAPA RIZADA RT 1000 GR Un corte único para sorprender a todos en casa y variar los platos que más les gustan. Las papas Rizadas McCain son ideales',
  '🥬', 23200, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757788/Papa-A-La-Francesa-Prefreida-Y-Congelada-Rizadas-X1000g-307630_a.jpg?v=639089486337400000',
  true, 260
),
(
  'a1200000-0000-4000-a102-000000000262', 'b1100000-0000-4000-a110-000000000002', 'Vegetales Mixtos  MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/cosecha-selecta-vegetales-mixtos-x-500-gr-613329/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL MIXTOS 500 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorante',
  '🥬', 16050, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757780/Cosecha-Selecta-Vegetales-Mixtos-X-500-gr-520888_a.jpg?v=639089486278330000',
  true, 261
),
(
  'a1200000-0000-4000-a102-000000000263', 'b1100000-0000-4000-a110-000000000002', 'Arveja x500gr  MC CAIN 500  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arvejas-ervilgas-x-500-gr-613327/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL ARVEJAS 500 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorantes y conservan t',
  '🥬', 17900, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32643576/Arvejas-Ervilgas-X-500-gr-520886_a.jpg?v=639077053955130000',
  true, 262
),
(
  'a1200000-0000-4000-a102-000000000264', 'b1100000-0000-4000-a110-000000000002', 'Vegetales Mixtos MC CAIN 1000  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/vegetales-mixtos-x-1000-g-610919/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN VEGETAL MIXTOS 1000 GR Los vegetales McCain son procesados pocas horas después de la cosecha con la más moderna tecnología, no contienen aditivos ni colorantes y conservan t',
  '🥬', 23200, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757877/Vegetales-mixtos-x-1000-g-702989_a.jpg?v=639089489481800000',
  true, 263
),
(
  'a1200000-0000-4000-a102-000000000265', 'b1100000-0000-4000-a110-000000000002', 'Paleta CREM HELADO mini polet sabores surtidos (270  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/palmini-polet-surt-pack-x6und-523103/p. Marca: CREM HELADO. Lleva a casa fácil y rápido Paleta CREM HELADO mini polet sabores surtidos (270 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 23900, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/34105206/PALMINI-POLET-SURT-PACK-X6UND-210411_a.jpg?v=639198304214970000',
  true, 264
),
(
  'a1200000-0000-4000-a102-000000000266', 'b1100000-0000-4000-a110-000000000002', 'Hashbrown triangulos de papx8u MC CAIN 300  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/hashbrown-tringulos-de-papx8u-363645/p. Marca: MC CAIN. Contenido suministrado a Almacenes Éxito directamente por McCain Colombia MCCAIN HASHBROWN TRIANGLE 8UND 300 GR Deliciosos triangulitos de papa ideales para tener un desayuno diferente y delicioso en casa.',
  '🥬', 12400, 'Papas, yucas y verduras congeladas', 'https://exitocol.vteximg.com.br/arquivos/ids/32757794/Hashbrown-Tringulos-De-Papx8u-233301_a.jpg?v=639089486376230000',
  true, 265
),
(
  'a1200000-0000-4000-a102-000000000267', 'b1100000-0000-4000-a110-000000000002', 'Chococono CREM HELADO cobertura chocolate sabor vainilla (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chococono-156530/p. Marca: CREM HELADO. Lleva a casa fácil y rápido Chococono CREM HELADO cobertura chocolate sabor vainilla (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3900, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33294619/CHOCOCONO-1724600_a.jpg?v=639136647718530000',
  true, 266
),
(
  'a1200000-0000-4000-a102-000000000268', 'b1100000-0000-4000-a110-000000000002', 'Helado Ice & Joy vainilla (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/helado-ice-joy-vainilla-600-gr-3240330/p. Marca: Ice & Joy. Lleva a casa fácil y rápido Helado Ice & Joy vainilla (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14500, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33564093/Helado-Ice-Joy-Vainilla-600-gr-3799430_a.jpg?v=639155766035270000',
  true, 267
),
(
  'a1200000-0000-4000-a102-000000000269', 'b1100000-0000-4000-a110-000000000002', 'Helado Ice & Joy chocolate (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/helado-ice-joy-chocolate-600-gr-3240328/p. Marca: Ice & Joy. Lleva a casa fácil y rápido Helado Ice & Joy chocolate (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14500, 'Helados', 'https://exitocol.vteximg.com.br/arquivos/ids/33564091/Helado-Ice-Joy-Chocolate-600-gr-3799428_a.jpg?v=639155766007470000',
  true, 268
),
(
  'a1200000-0000-4000-a102-000000000270', 'b1100000-0000-4000-a110-000000000002', 'Empanada Coctel ZENU 300  gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/empanada-coctel-zenu-300-gr-3195644/p. Marca: ZENU. Lleva a casa fácil y rápido Empanada Coctel ZENU 300 gr. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍞', 12700, 'Pasabocas y panadería congelados', 'https://exitocol.vteximg.com.br/arquivos/ids/33564015/Empanada-Coctel-ZENU-300-gr-3635036_a.jpg?v=639155764179630000',
  true, 269
),
(
  'a1200000-0000-4000-a102-000000000271', 'b1100000-0000-4000-a110-000000000002', 'Jamón serrano 1901 AUTÉNTICO POR TRADICIÓN libre de lactosa (80  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-serrano-1901-80-gr-3010835/p. Marca: 1901 AUTÉNTICO POR TRADICIÓN. Lleva a casa fácil y rápido Jamón serrano 1901 AUTÉNTICO POR TRADICIÓN libre de lactosa (80 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 8990, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31928630/Jamon-Serrano-1901-80-gr-3015730_a.jpg?v=638999407340770000',
  true, 270
),
(
  'a1200000-0000-4000-a102-000000000272', 'b1100000-0000-4000-a110-000000000002', 'Queso CENTURION muenster tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-muenster-tjd-centurion-150-gr-1002396/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION muenster tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9890, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31005461/Queso-Muenster-Tjd-CENTURION-150-gr-1862828_a.jpg?v=638943298571370000',
  true, 271
),
(
  'a1200000-0000-4000-a102-000000000273', 'b1100000-0000-4000-a110-000000000002', 'Queso costeño COLANTA semimaduro Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-costeno-25kg-577690/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso costeño COLANTA semimaduro. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 28627, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716763/QUESO-COSTENO-25KG-482717_a.jpg?v=639086675116800000',
  true, 272
),
(
  'a1200000-0000-4000-a102-000000000274', 'b1100000-0000-4000-a110-000000000002', 'Queso mozzarella COLANTA porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-colanta-475057/p. Marca: COLANTA. Características: Queso mozzarella colanta. Queso fresco,semiduro,semigraso. CONSERVACIÓN: Consérvese en un lugar fresco. Una vez abierto consuma en el menor tiempo posible.',
  '🛒', 32127, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716766/Queso-Mozzarella-Colanta-651179_a.jpg?v=639086675148730000',
  true, 273
),
(
  'a1200000-0000-4000-a102-000000000275', 'b1100000-0000-4000-a110-000000000002', 'Queso Sabana ALPINA 25 tajadas   (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-sabana-x-25-tajadas-415-gr-269487/p. Marca: ALPINA. Queso Sabana X 25 Tajadas (415 Gr) Características Queso Sabana. Marca: Alpina. Características: Queso semiduro, fresco y graso, naturalmente libre de grasa trans, buena fuente de calcio. Almacenamiento: Consérvese en un lugar limpio y seco, despué',
  '🛒', 34050, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33676667/Queso-Sabana-X-25-Tajadas-415-Gr-391513_a.jpg?v=639166192246100000',
  true, 274
),
(
  'a1200000-0000-4000-a102-000000000276', 'b1100000-0000-4000-a110-000000000002', 'Queso Sabana ALPINA 15 tajadas   (240  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-sabana-x-15-tajadas-249-gr-269484/p. Marca: ALPINA. Queso Sabana X 15 Tajadas X 249 gr Características Endulzante con stevia en polvo éxito. Queso Sabana. Marca: Alpina. Características: Queso semiduro, fresco y graso, naturalmente libre de grasa trans, buena fuente de calcio. Almacenamiento: Consér',
  '🛒', 16680, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33676662/Queso-Sabana-X-15-Tajadas-249-Gr-391455_a.jpg?v=639166192207670000',
  true, 275
),
(
  'a1200000-0000-4000-a102-000000000277', 'b1100000-0000-4000-a110-000000000002', 'Jamón  FRESCAS & MADURADAS COLOMBIA york (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-york-bloque-191334/p. Marca: FRESCAS & MADURADAS COLOMBIA. Lleva a casa fácil y rápido Jamón FRESCAS & MADURADAS COLOMBIA york (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 26900, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31996114/JAMON-YORK-BLOQUE-1603774_a.jpg?v=639009693185900000',
  true, 276
),
(
  'a1200000-0000-4000-a102-000000000278', 'b1100000-0000-4000-a110-000000000002', 'Queso doble crema COLANTA porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-doblecrema-colanta-7955/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso doble crema COLANTA porcionado en tienda. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 26527, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716764/Queso-Doblecrema-Colanta-376884_a.jpg?v=639086675126230000',
  true, 277
),
(
  'a1200000-0000-4000-a102-000000000279', 'b1100000-0000-4000-a110-000000000002', 'Queso Mozzarella CENTURION Bloque (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-centurion-bloque-600-gr-3255200/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso Mozzarella CENTURION Bloque (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/34121581/Queso-Mozzarella-CENTURION-Bloque-600-gr-3856795_a.jpg?v=639199166500930000',
  true, 278
),
(
  'a1200000-0000-4000-a102-000000000280', 'b1100000-0000-4000-a110-000000000002', 'Queso Cottage LACTO LIFE Fresco Semiblando Graso (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-cottage-lacto-life-fresco-semiblando-graso-500-gr-3244032/p. Marca: LACTO LIFE. Lleva a casa fácil y rápido Queso Cottage LACTO LIFE Fresco Semiblando Graso (500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 22500, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33563853/Queso-Cottage-LACTO-LIFE-Fresco-Semiblando-Graso-500-gr-3817441_a.jpg?v=639155760111700000',
  true, 279
),
(
  'a1200000-0000-4000-a102-000000000281', 'b1100000-0000-4000-a110-000000000002', 'Queso mozzarella DIBUFALA ciliegine de búfala (230  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-mozzarella-ciliegine-dibufala-230-gr-3159692/p. Marca: DIBUFALA. Lleva a casa fácil y rápido Queso mozzarella DIBUFALA ciliegine de búfala (230 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6230, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32236792/Queso-Mozzarella-Ciliegine-DIBUFALA-230-gr-3528949_a.jpg?v=639039089655400000',
  true, 280
),
(
  'a1200000-0000-4000-a102-000000000282', 'b1100000-0000-4000-a110-000000000002', 'Queso CENTURION feta (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-feta-centurion-250-gr-3071449/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION feta (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 20900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/30896656/Queso-Feta-CENTURION-250-gr-3209938_a.jpg?v=638937241642400000',
  true, 281
),
(
  'a1200000-0000-4000-a102-000000000283', 'b1100000-0000-4000-a110-000000000002', 'Queso CENTURION gouda ahumado tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-gouda-ahumado-centurion-150-gr-1002559/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION gouda ahumado tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 9890, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31005469/Queso-Gouda-Ahumado-CENTURION-150-gr-1862991_a.jpg?v=638943298615370000',
  true, 282
),
(
  'a1200000-0000-4000-a102-000000000284', 'b1100000-0000-4000-a110-000000000002', 'Queso CENTURION colby jack tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-colby-jack-centurion-150-gr-1002476/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION colby jack tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7630, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31005468/Queso-Colby-Jack-CENTURION-150-gr-1862908_a.jpg?v=638943298606270000',
  true, 283
),
(
  'a1200000-0000-4000-a102-000000000285', 'b1100000-0000-4000-a110-000000000002', 'Jamón de pavo TAEQ porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-pechuga-de-pavo-excelenz-954091/p. Marca: TAEQ. Jamón Pechuga De Pavo Excele Características Prueba el irresistible sabor del Jamón de Pavo una combinación única de sabor y tradición. Deléitate con deliciosos jamones madurados con textura jugosa y su aroma cautivador en cada porción. Nuestro jamón d',
  '🥩', 79200, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31960931/Jamon-Pechuga-De-Pavo-Excelenz-699039_a.jpg?v=639003091708500000',
  true, 284
),
(
  'a1200000-0000-4000-a102-000000000286', 'b1100000-0000-4000-a110-000000000002', 'Queso PRESIDENT tipo cheddar tajado (200  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/president-cheddar-tajado-908624/p. Marca: PRESIDENT. Lleva a casa fácil y rápido Queso PRESIDENT tipo cheddar tajado (200 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 10430, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/30892590/President-Cheddar-Tajado-1266324_a.jpg?v=638937208323330000',
  true, 285
),
(
  'a1200000-0000-4000-a102-000000000287', 'b1100000-0000-4000-a110-000000000002', 'Salami MONTICELLO de cerdo maduración artesanal (80  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/salami-902073/p. Marca: MONTICELLO. Nombre del producto Salami MONTICELLO de cerdo maduración artesanal 80 Gr Características del producto Se obtiene de una mezcla de carne de cerdo y res junto con ingredientes y especias mediterráneas entre ellas la pimienta. Almacenamiento Mantener Refrigerado a tempera',
  '🥩', 22300, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31754458/SALAMI-1516719_a.jpg?v=638986381634900000',
  true, 286
),
(
  'a1200000-0000-4000-a102-000000000288', 'b1100000-0000-4000-a110-000000000002', 'Queso parmesano COLANTA madurado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-parmesano-cuna-colanta-x-100-gr-785653/p. Marca: COLANTA. Características Queso madurado,duro,semigraso. CONSERVACIÓN: Consérvese en un lugar fresco. Una vez abierto consuma en el menor tiempo posible.',
  '🛒', 72730, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32549936/Queso-Parmesano-Cuna-Colanta-X-100-gr-437997_a.jpg?v=639068711069330000',
  true, 287
),
(
  'a1200000-0000-4000-a102-000000000289', 'b1100000-0000-4000-a110-000000000002', 'Queso COLANTA para asar Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-para-asar-blq-286803/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso COLANTA para asar. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 47900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32716757/Queso-Para-Asar-Blq-806692_a.jpg?v=639086675051800000',
  true, 288
),
(
  'a1200000-0000-4000-a102-000000000290', 'b1100000-0000-4000-a110-000000000002', 'Queso Pomona burrata (125  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-burrata-pomona-250-gr-268305/p. Marca: Pomona. Lleva a casa fácil y rápido Queso Pomona burrata (125 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 11830, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32236769/Queso-Burrata-Pomona-250-gr-1766263_a.jpg?v=639039089435170000',
  true, 289
),
(
  'a1200000-0000-4000-a102-000000000291', 'b1100000-0000-4000-a110-000000000002', 'Jamón  Pomona especial porcionado tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-cerdo-seleccion-especial-x-kg-216137/p. Marca: Pomona. Lleva a casa fácil y rápido Jamón Pomona especial porcionado tienda. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 34320, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32549874/Jamon-Cerdo-Seleccion-Especial-X-kg-437230_a.jpg?v=639068708475130000',
  true, 290
),
(
  'a1200000-0000-4000-a102-000000000292', 'b1100000-0000-4000-a110-000000000002', 'Tocineta FRESCAS & MADURADAS COLOMBIA ahumada (400  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tocineta-ahumada-400-gr-194644/p. Marca: FRESCAS & MADURADAS COLOMBIA. Lleva a casa fácil y rápido Tocineta FRESCAS & MADURADAS COLOMBIA ahumada (400 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 29950, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31996238/TOCINETA-AHUMADA-400-gr-1780899_a.jpg?v=639009714496500000',
  true, 291
),
(
  'a1200000-0000-4000-a102-000000000293', 'b1100000-0000-4000-a110-000000000002', 'Albondigón EKONO con verduras (425  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/albondigon-con-verduras-425gm-ekono-425-gr-3142347/p. Marca: EKONO. Lleva a casa fácil y rápido Albondigón EKONO con verduras (425 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 6300, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31964329/ALBONDIGON-CON-VERDURAS-425GM-EKONO-425-gr-3462665_a.jpg?v=639003133483030000',
  true, 292
),
(
  'a1200000-0000-4000-a102-000000000294', 'b1100000-0000-4000-a110-000000000002', 'Queso DIBUFALA burrata de búfala (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/burrata-de-bufala-dibufala-480-gr-3112432/p. Marca: DIBUFALA. Lleva a casa fácil y rápido Queso DIBUFALA burrata de búfala (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 30900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33178346/Burrata-De-Bufala-DIBUFALA-480-gr-3350830_a.jpg?v=639125432295700000',
  true, 293
),
(
  'a1200000-0000-4000-a102-000000000295', 'b1100000-0000-4000-a110-000000000002', 'Jamón  CATALAN 100% de cerdo (210  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-york-catalan-210-gr-3100870/p. Marca: CATALAN. Lleva a casa fácil y rápido Jamón CATALAN 100% de cerdo (210 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 22200, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33496489/Jamon-York-CATALAN-210-gr-3325629_a.jpg?v=639153157558470000',
  true, 294
),
(
  'a1200000-0000-4000-a102-000000000296', 'b1100000-0000-4000-a110-000000000002', 'Pastrami de pavo Pomona tajado (225  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pastrami-pavo-pomona-225-gr-3077665/p. Marca: Pomona. Lleva a casa fácil y rápido Pastrami de pavo Pomona tajado (225 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🥩', 17080, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/31963428/Pastrami-Pavo-Pomona-225-gr-3234497_a.jpg?v=639003123111300000',
  true, 295
),
(
  'a1200000-0000-4000-a102-000000000297', 'b1100000-0000-4000-a110-000000000002', 'Queso CENTURION Pepper Jack Tajado (150  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-pepper-jack-taj-centurion-150-gr-1002478/p. Marca: CENTURION. Lleva a casa fácil y rápido Queso CENTURION Pepper Jack Tajado (150 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 13900, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33563957/Queso-Pepper-Jack-Taj-CENTURION-150-gr-1862910_a.jpg?v=639155762840830000',
  true, 296
),
(
  'a1200000-0000-4000-a102-000000000298', 'b1100000-0000-4000-a110-000000000002', 'Queso Holandés ALPINA 15 tajadas   (282  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-holandes-x-15-tajadas-979050/p. Marca: ALPINA. CARACTERISTICAS Queso Holandés Lonchas. Marca: Alpina. Características: Queso semiduro, semimaduro y graso, naturalmente libre de grasa trans, buena fuente de calcio. Almacenamiento: Consérvese en un lugar limpio y seco, después de abierto consúmase en ',
  '🛒', 28000, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/33670379/Queso-Holandes-X-15-Tajadas-508875_a.jpg?v=639166157022070000',
  true, 297
),
(
  'a1200000-0000-4000-a102-000000000299', 'b1100000-0000-4000-a110-000000000002', 'Queso COLANTA tipo cheddar porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/queso-cheddar-x-100-gr-977165/p. Marca: COLANTA. Lleva a casa fácil y rápido Queso COLANTA tipo cheddar porcionado en tienda. Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 62227, 'Quesos especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32718545/Queso-Cheddar-X-100-gr-738559_a.jpg?v=639087485015700000',
  true, 298
),
(
  'a1200000-0000-4000-a102-000000000300', 'b1100000-0000-4000-a110-000000000002', 'Jamón  KOLLER porcionado en tienda Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/jamon-cerdo-919728/p. Marca: KOLLER. Jamon Cerdo Características Jamón Cerdo x 5Kl. Marca: Koller. Características: Jamón Cerdo x 5Kl. Almacenamiento: Consuma antes de la fecha indicada en la etiqueta, una vez sacado de refrigeración consumir en el menor tiempo posible. Mantenga muy bien refrigerado.',
  '🥩', 138000, 'Carnes especiales', 'https://exitocol.vteximg.com.br/arquivos/ids/32660637/Jamon-Cerdo-756882_a.jpg?v=639081677211270000',
  true, 299
),
(
  'a1200000-0000-4000-a102-000000000301', 'b1100000-0000-4000-a110-000000000002', 'Leche condensada LA LECHERA original doypack (600  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/lache-condensada-doy-pack-la-lechera-600-gr-3025276/p. Marca: LA LECHERA. Lleva a casa fácil y rápido Leche condensada LA LECHERA original doypack (600 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 11160, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33671341/Lache-Condensada-Doy-Pack-LA-LECHERA-600-gr-3045632_a.jpg?v=639166164181200000',
  true, 300
),
(
  'a1200000-0000-4000-a102-000000000302', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina JET chocolate con leche (176  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jet-oft-p12-ll16-176-gr-3210654/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET chocolate con leche (176 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 14400, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31299772/Chocolatina-JET-Oft-P12-Ll16-176-gr-3693645_a.jpg?v=638961641554900000',
  true, 301
),
(
  'a1200000-0000-4000-a102-000000000303', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina JET con lámina chocolate con leche (132  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-leche-jet-132-gr-3147031/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET con lámina chocolate con leche (132 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 12000, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31299431/Chocolatina-Leche-JET-132-gr-3479122_a.jpg?v=638961638715070000',
  true, 302
),
(
  'a1200000-0000-4000-a102-000000000304', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina JUMBO chocolate con maní (170  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-mani-x-17g-jumbo-170-gr-3145716/p. Marca: JUMBO. Lleva a casa fácil y rápido Chocolatina JUMBO chocolate con maní (170 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 13900, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/32493649/CHOCOLATINA-MANI-X-17G-JUMBO-170-gr-3474853_a.jpg?v=639064989940570000',
  true, 303
),
(
  'a1200000-0000-4000-a102-000000000305', 'b1100000-0000-4000-a110-000000000002', 'Bocadillo FRESCAMPO en hoja de bijao (414  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bocadillo-dulce-en-hoja-de-bij-frescampo-414-gr-3102769/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Bocadillo FRESCAMPO en hoja de bijao (414 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 6360, 'Dulces típicos', 'https://exitocol.vteximg.com.br/arquivos/ids/34023297/Bocadillo-Dulce-En-Hoja-De-Bij-FRESCAMPO-414-gr-3331366_a.jpg?v=639192957772300000',
  true, 304
),
(
  'a1200000-0000-4000-a102-000000000306', 'b1100000-0000-4000-a110-000000000002', 'Dulces QUIPITOS explosión pops (40  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/quipitos-40g-5und-486270/p. Marca: QUIPITOS. Lleva a casa fácil y rápido Dulces QUIPITOS explosión pops (40 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3160, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/33172293/Quipitos-40g-5und-832704_a.jpg?v=639124897031530000',
  true, 305
),
(
  'a1200000-0000-4000-a102-000000000307', 'b1100000-0000-4000-a110-000000000002', 'Chocolate Relleno Dubai JET JET Chocolatina (29  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolate-relleno-dubai-jet-jet-chocolatina-29-gr-3253811/p. Marca: JET. Lleva a casa fácil y rápido Chocolate Relleno Dubai JET JET Chocolatina (29 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 3800, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/33722984/Chocolate-Relleno-Dubai-JET-JET-Chocolatina-29-gr-3853156_a.jpg?v=639168742360070000',
  true, 306
),
(
  'a1200000-0000-4000-a102-000000000308', 'b1100000-0000-4000-a110-000000000002', 'Gomitas TRULULU Frutal Nanos (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gomitas-trululu-frutal-nanos-100-gr-3244663/p. Marca: TRULULU. Lleva a casa fácil y rápido Gomitas TRULULU Frutal Nanos (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3590, 'Masmelos y gomitas', 'https://exitocol.vteximg.com.br/arquivos/ids/32719240/Gomitas-TRULULU-Frutal-Nanos-100-gr-3820419_a.jpg?v=639087560083670000',
  true, 307
),
(
  'a1200000-0000-4000-a102-000000000309', 'b1100000-0000-4000-a110-000000000002', 'Galletas JET mini wafer con chocolate (20  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/golosina-jet-chocolate-6-gr-3207504/p. Marca: JET. Lleva a casa fácil y rápido Galletas JET mini wafer con chocolate (20 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 10900, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31965189/Golosina-JET-Chocolate-6-gr-3682094_a.jpg?v=639003143595370000',
  true, 308
),
(
  'a1200000-0000-4000-a102-000000000310', 'b1100000-0000-4000-a110-000000000002', 'Gomitas TRULULU oka loka con nanos (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gomas-trululu-frutal-nanos-oka-loka-100-gr-3175755/p. Marca: TRULULU. Lleva a casa fácil y rápido Gomitas TRULULU oka loka con nanos (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3590, 'Masmelos y gomitas', 'https://exitocol.vteximg.com.br/arquivos/ids/33635185/Gomas-TRULULU-Frutal-Nanos-Oka-Loka-100-gr-3567567_a.jpg?v=639161030298970000',
  true, 309
),
(
  'a1200000-0000-4000-a102-000000000311', 'b1100000-0000-4000-a110-000000000002', 'Arequipe DULCES DEL VALLE de café (210  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-de-cafe-dulces-del-valle-210-gr-3154654/p. Marca: DULCES DEL VALLE. Lleva a casa fácil y rápido Arequipe DULCES DEL VALLE de café (210 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 10950, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33672094/Arequipe-de-Cafe-DULCES-DEL-VALLE-210-gr-3509180_a.jpg?v=639166167324400000',
  true, 310
),
(
  'a1200000-0000-4000-a102-000000000312', 'b1100000-0000-4000-a110-000000000002', 'Gomitas  BON BON BUM sabor a fresa (45  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/gomitas-bbb-24bs145g-bon-bon-bum-45-gr-3154168/p. Marca: BON BON BUM. Lleva a casa fácil y rápido Gomitas BON BON BUM sabor a fresa (45 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2230, 'Masmelos y gomitas', 'https://exitocol.vteximg.com.br/arquivos/ids/33173403/GOMITAS-BBB-24BS145g-BON-BON-BUM-45-gr-3506931_a.jpg?v=639124911801430000',
  true, 311
),
(
  'a1200000-0000-4000-a102-000000000313', 'b1100000-0000-4000-a110-000000000002', 'Caramelos HALLS extra fuerte mentol eucalipto (24.75  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caramelo-duro-mentol-eucalipto-halls-2475-gr-3148341/p. Marca: HALLS. Lleva a casa fácil y rápido Caramelos HALLS extra fuerte mentol eucalipto (24.75 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 1770, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/31327095/Caramelo-Duro-Mentol-Eucalipto-HALLS-2475-gr-3482833_a.jpg?v=638962275630070000',
  true, 312
),
(
  'a1200000-0000-4000-a102-000000000314', 'b1100000-0000-4000-a110-000000000002', 'Cocadas DULCES DEL VALLE de leche con coco (102  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/dulce-de-leche-con-coco-dulces-del-valle-102-gr-3141745/p. Marca: DULCES DEL VALLE. Lleva a casa fácil y rápido Cocadas DULCES DEL VALLE de leche con coco (102 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 7380, 'Dulces típicos', 'https://exitocol.vteximg.com.br/arquivos/ids/33678550/Dulce-de-Leche-con-Coco-DULCES-DEL-VALLE-102-gr-3460455_a.jpg?v=639166200884630000',
  true, 313
),
(
  'a1200000-0000-4000-a102-000000000315', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina LYNE chocolate con leche (108  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-leche-lyne-108-gr-3123172/p. Marca: LYNE. Lleva a casa fácil y rápido Chocolatina LYNE chocolate con leche (108 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 15850, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31299223/Chocolatina-Leche-LYNE-108-gr-3384792_a.jpg?v=638961637509670000',
  true, 314
),
(
  'a1200000-0000-4000-a102-000000000316', 'b1100000-0000-4000-a110-000000000002', 'Leche condensada FRESCAMPO doy pack (300  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-condensada-semidescremada-frescampo-300-gr-3121690/p. Marca: FRESCAMPO. Lleva a casa fácil y rápido Leche condensada FRESCAMPO doy pack (300 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6530, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33671828/Leche-Condensada-Semidescremada-FRESCAMPO-300-gr-3380211_a.jpg?v=639166166581000000',
  true, 315
),
(
  'a1200000-0000-4000-a102-000000000317', 'b1100000-0000-4000-a110-000000000002', 'Chicles TRIDENT sabor a menta (61.2  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/goma-de-mascar-menta-esp-und-trident-61200-gramo-3005346/p. Marca: TRIDENT. Lleva a casa fácil y rápido Chicles TRIDENT sabor a menta (61.2 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7880, 'Chicles', 'https://exitocol.vteximg.com.br/arquivos/ids/31326637/Goma-de-Mascar-Menta-Esp-Und-TRIDENT-61200-Gramo-3007940_a.jpg?v=638962273954130000',
  true, 316
),
(
  'a1200000-0000-4000-a102-000000000318', 'b1100000-0000-4000-a110-000000000002', 'Crema NUCITA sabor a leche, chocolate, nueces (84  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/crema-844588/p. Marca: NUCITA. Lleva a casa fácil y rápido Crema NUCITA sabor a leche, chocolate, nueces (84 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 5390, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/33043465/Crema-1136738_a.jpg?v=639117066314330000',
  true, 317
),
(
  'a1200000-0000-4000-a102-000000000319', 'b1100000-0000-4000-a110-000000000002', 'Arequipe ALPINA vaso (220  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-alpina-x-220-gr-514518/p. Marca: ALPINA. Contenido suministrado a Almacenes Éxito directamente por ALPINA Arequipe Alpina 220g Características Arequipe Alpina 220g Beneficios Almacenamiento Modo de uso Advertencias',
  '🛒', 7700, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33676852/Arequipe-Alpina-X-220-gr-104759_a.jpg?v=639166193476200000',
  true, 318
),
(
  'a1200000-0000-4000-a102-000000000320', 'b1100000-0000-4000-a110-000000000002', 'Arequipe COLANTA dulce de leche (250  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-doy-pack-colanta-250-gr-493102/p. Marca: COLANTA. Lleva a casa fácil y rápido Arequipe COLANTA dulce de leche (250 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 6660, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33670974/Arequipe-Doy-Pack-COLANTA-250-gr-60736_a.jpg?v=639166161004970000',
  true, 319
),
(
  'a1200000-0000-4000-a102-000000000321', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina JET con leche y chocolate blanco (144  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-de-leche-y-chocolate-blanco-x-12-und-258423/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET con leche y chocolate blanco (144 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 12000, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/31323820/Chocolatina-De-Leche-Y-Chocolate-Blanco-X-12-Und-522396_a.jpg?v=638962263610930000',
  true, 320
),
(
  'a1200000-0000-4000-a102-000000000322', 'b1100000-0000-4000-a110-000000000002', 'Leche condensada LA LECHERA original doypack (420  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-cond-la-lechera-x-420g-220715/p. Marca: LA LECHERA. Leche Condensada Azucarada Semidescremada LA LECHERA® tiene la textura, la cremosidad y sabor único, ideal para tus preparaciones dulces y para acompañar tus comidas o bebidas favoritas. Encuentra recetas fáciles y deliciosas en www.recetasnestle.c',
  '🛒', 9800, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33670503/Leche-Cond-La-Lechera-X-420g-11486_a.jpg?v=639166157909370000',
  true, 321
),
(
  'a1200000-0000-4000-a102-000000000323', 'b1100000-0000-4000-a110-000000000002', 'Chupetas BON BON BUM surtidos con chicle (456  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/bon-bon-bum-surtido-176617/p. Marca: BON BON BUM. Características Bonbonbum surtido de fresa y mandarina. Almacenamiento: mantener en un lugar fresco y seco.',
  '🛒', 12250, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/31298111/Bon-Bon-Bum-Surtido-165524_a.jpg?v=638961628878270000',
  true, 322
),
(
  'a1200000-0000-4000-a102-000000000324', 'b1100000-0000-4000-a110-000000000002', 'Leche condensada LA LECHERA original doypack (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/leche-condensada-doy-pack-la-lechera-90-gramo-148448/p. Marca: LA LECHERA. Leche Condensada Azucarada Semidescremada LA LECHERA® tiene la textura, la cremosidad y sabor único que la hacen perfecta como topping, realzando con un toque dulce y delicioso tus postres, frutas y bebidas favoritas. Inspírate y c',
  '🛒', 2320, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33671180/LECHE-CONDENSADA-DOY-PACK-LA-LECHERA-90-Gramo-1749811_a.jpg?v=639166163262300000',
  true, 323
),
(
  'a1200000-0000-4000-a102-000000000325', 'b1100000-0000-4000-a110-000000000002', 'Arequipe ALPINA vaso (500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-vaso-61330/p. Marca: ALPINA. Contenido suministrado a Almacenes Éxito directamente por ALPINA Arequipe Alpina 500g Características Arequipe Alpina 500g Beneficios Almacenamiento Modo de uso Advertencias',
  '🛒', 15800, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33676840/Arequipe-Vaso-20680_a.jpg?v=639166193368330000',
  true, 324
),
(
  'a1200000-0000-4000-a102-000000000326', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina Jumbo Dubai JUMBO Chocolatina (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jumbo-dubai-jumbo-chocolatina-90-gr-3253808/p. Marca: JUMBO. Lleva a casa fácil y rápido Chocolatina Jumbo Dubai JUMBO Chocolatina (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 10200, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/33722986/Chocolatina-Jumbo-Dubai-JUMBO-Chocolatina-90-gr-3853153_a.jpg?v=639168742373230000',
  true, 325
),
(
  'a1200000-0000-4000-a102-000000000327', 'b1100000-0000-4000-a110-000000000002', 'Caramelos HALLS duros sin azúcar mentol (15  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/caramelos-halls-duros-xs-sin-azucar-mentol-euc-15-gr-3229067/p. Marca: HALLS. Lleva a casa fácil y rápido Caramelos HALLS duros sin azúcar mentol (15 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2960, 'Confitería', 'https://exitocol.vteximg.com.br/arquivos/ids/33150620/Caramelos-HALLS-Duros-Xs-Sin-Azucar-Mentol-Euc-15-gr-3764408_a.jpg?v=639123822768970000',
  true, 326
),
(
  'a1200000-0000-4000-a102-000000000328', 'b1100000-0000-4000-a110-000000000002', 'Arequipe SUPERCOCO con deliciosos trocitos (220  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arequipe-coco-supercoco-220-gr-3227474/p. Marca: SUPERCOCO. Lleva a casa fácil y rápido Arequipe SUPERCOCO con deliciosos trocitos (220 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8040, 'Arequipe y leche condensada', 'https://exitocol.vteximg.com.br/arquivos/ids/33672581/Arequipe-Coco-SUPERCOCO-220-gr-3759446_a.jpg?v=639166171564200000',
  true, 327
),
(
  'a1200000-0000-4000-a102-000000000329', 'b1100000-0000-4000-a110-000000000002', 'Chocolates JET gool baloncitos (81  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jet-chocolatina-gol-baloncitos-81-gr-3225746/p. Marca: JET. Lleva a casa fácil y rápido Chocolates JET gool baloncitos (81 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 7630, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/32918360/Chocolatina-JET-Chocolatina-Gol-Baloncitos-81-gr-3751981_a.jpg?v=639104784211400000',
  true, 328
),
(
  'a1200000-0000-4000-a102-000000000330', 'b1100000-0000-4000-a110-000000000002', 'Chocolatina JET con relleno de caramelo (108  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chocolatina-jet-caramelo-108-gr-3225639/p. Marca: JET. Lleva a casa fácil y rápido Chocolatina JET con relleno de caramelo (108 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍫', 7440, 'Chocolatería', 'https://exitocol.vteximg.com.br/arquivos/ids/32549500/Chocolatina-JET-Caramelo-108-gr-3751831_a.jpg?v=639068705499930000',
  true, 329
),
(
  'a1200000-0000-4000-a102-000000000331', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos MIRRINGO fuente proteína (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-gato-original-adultos-mirringo-1-gr-3103989/p. Marca: MIRRINGO. Lleva a casa fácil y rápido Comida para gatos MIRRINGO fuente proteína (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 10950, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572562/Alimento-Para-Gato-Original-Adultos-MIRRINGO-1-gr-3335339_a.jpg?v=639070324288930000',
  true, 330
),
(
  'a1200000-0000-4000-a102-000000000332', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos DON KAT adulto (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-gato-adulto-don-kat-1000-gr-3149883/p. Marca: DON KAT. Lleva a casa fácil y rápido Comida para gatos DON KAT adulto (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 13750, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572753/Alimento-Gato-Adulto-DON-KAT-1000-gr-3488044_a.jpg?v=639070325540370000',
  true, 331
),
(
  'a1200000-0000-4000-a102-000000000333', 'b1100000-0000-4000-a110-000000000002', 'Arena para gatos Unikat super poderes lavanda (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arena-gato-3-super-poderes-lavanda-unikat-arena-unikat-aroma-lavand-4kg-6und-3144218/p. Marca: Unikat. Lleva a casa fácil y rápido Arena para gatos Unikat super poderes lavanda (4000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 16500, 'Comida peces, aves y otras mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32667548/Arena-Gato-3-Super-Poderes-Lavanda-Unikat-ARENA-UNIKAT-AROMA-LAVAND-4KG-6UND-3470333_a.jpg?v=639082499221400000',
  true, 332
),
(
  'a1200000-0000-4000-a102-000000000334', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos FELIX sabor surtido (680  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-surtido-felix-680-gr-3129235/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida para Gato FELIX Pack Surtido x8 - Sobres Características Alimento balanceado y completo húmedo para gatos adultos en mantenimiento Beneficios Textura irresistible Deliciosa SalsaDelic',
  '🍿', 19050, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32955080/Felix-Surtido-FELIX-680-gr-3408373_a.jpg?v=639110802195330000',
  true, 333
),
(
  'a1200000-0000-4000-a102-000000000335', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros CHUNKY adulto sabor a pollo (2000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-pollo-adulto-494602/p. Marca: CHUNKY. Lleva a casa fácil y rápido Comida para perros CHUNKY adulto sabor a pollo (2000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 19700, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/32568771/Alimento-Pollo-Adulto-110131_a.jpg?v=639070299867370000',
  true, 334
),
(
  'a1200000-0000-4000-a102-000000000336', 'b1100000-0000-4000-a110-000000000002', 'Alimento Para Perro PURINA DOG CHOW Todos Los Tamaños (2000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perro-purina-dog-chow-todos-los-tamanos-2000-gr-3250400/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida para perro Dog Chow Adulto todos los tamaños x 2 kg Características Alimento completo para perros adultos de razas medianas y gr',
  '🍿', 25950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33594700/Alimento-Para-Perro-PURINA-DOG-CHOW-Todos-Los-Tamanos-2000-gr-3839380_a.jpg?v=639159439583930000',
  true, 335
),
(
  'a1200000-0000-4000-a102-000000000337', 'b1100000-0000-4000-a110-000000000002', 'Pañitos húmedos PETYS para mascotas limpieza superior (80  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/panos-petys-humedos-mascotas-limpieza-supe-3238183/p. Marca: PETYS. Lleva a casa fácil y rápido Pañitos húmedos PETYS para mascotas limpieza superior (80 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 20350, 'Accesorios&nbsp;para mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32573023/Panos-PETYS-Humedos-Mascotas-Limpieza-Supe-3792232_a.jpg?v=639070328467100000',
  true, 336
),
(
  'a1200000-0000-4000-a102-000000000338', 'b1100000-0000-4000-a110-000000000002', 'Arena para gatos Unikat primavera (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arena-gatos-calabaza-arena-4000-gr-3224952/p. Marca: Unikat. Lleva a casa fácil y rápido Arena para gatos Unikat primavera (4000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 16600, 'Arenas para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32756540/Arena-Gatos-CALABAZA-Arena-4000-gr-3749496_a.jpg?v=639089392973400000',
  true, 337
),
(
  'a1200000-0000-4000-a102-000000000339', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros PEDIGREE húmedo adulto salmón arroz integral (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-humedo-perros-adultos-salmon-a-pedigree-100-gr-3183631/p. Marca: PEDIGREE. Lleva a casa fácil y rápido Comida para perros PEDIGREE húmedo adulto salmón arroz integral (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3300, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33502526/Alimento-Humedo-Perros-Adultos-Salmon-A-PEDIGREE-100-gr-3593663_a.jpg?v=639153313378900000',
  true, 338
),
(
  'a1200000-0000-4000-a102-000000000340', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros PEDIGREE húmedo adultos pavo y zanahoria (100  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-humedo-perro-adulto-todas-raza-pedigree-100-gr-3183456/p. Marca: PEDIGREE. Lleva a casa fácil y rápido Comida para perros PEDIGREE húmedo adultos pavo y zanahoria (100 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3300, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33502528/Alimento-Humedo-Perro-Adulto-Todas-Raza-PEDIGREE-100-gr-3592943_a.jpg?v=639153313394630000',
  true, 339
),
(
  'a1200000-0000-4000-a102-000000000341', 'b1100000-0000-4000-a110-000000000002', 'Snack para gatos Churu atún con salmón (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tuna-with-salmon-recipe-churu-56-gr-3158790/p. Marca: Churu. Lleva a casa fácil y rápido Snack para gatos Churu atún con salmón (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12600, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34115516/Tuna-With-Salmon-Recipe-Churu-56-gr-3526218_a.jpg?v=639198931989430000',
  true, 340
),
(
  'a1200000-0000-4000-a102-000000000342', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos MIRRINGO concentrado adulto (1000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-gato-pro-mirringo-1-kg-3092701/p. Marca: MIRRINGO. Lleva a casa fácil y rápido Comida para gatos MIRRINGO concentrado adulto (1000 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 17600, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572518/Alimento-Gato-PRO-MIRRINGO-1-kg-3296101_a.jpg?v=639070323887200000',
  true, 341
),
(
  'a1200000-0000-4000-a102-000000000343', 'b1100000-0000-4000-a110-000000000002', 'Arena para gatos PUKÍ retiene la humedad (4500  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/arena-para-gatos-puki-sin-ref-3089921/p. Marca: PUKÍ. Lleva a casa fácil y rápido Arena para gatos PUKÍ retiene la humedad (4500 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 14850, 'Comida peces, aves y otras mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32300287/Arena-para-gatos-PUKI-Sin-ref-3283975_a.jpg?v=639046900831670000',
  true, 342
),
(
  'a1200000-0000-4000-a102-000000000344', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos WHISKAS húmedo adulto pollo (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aliment-masc-humed-adult-pollo-whiskas-85-gr-3084547/p. Marca: WHISKAS. Lleva a casa fácil y rápido Comida para gatos WHISKAS húmedo adulto pollo (85 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 2930, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572343/Aliment-Masc-Humed-Adult-Pollo-WHISKAS-85-gr-3265535_a.jpg?v=639070322112630000',
  true, 343
),
(
  'a1200000-0000-4000-a102-000000000345', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos WHISKAS húmedo adulto salmón (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/aliment-masc-humed-adult-salmn-whiskas-85-gr-3084546/p. Marca: WHISKAS. Lleva a casa fácil y rápido Comida para gatos WHISKAS húmedo adulto salmón (85 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 2930, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32572338/Aliment-Masc-Humed-Adult-Salmn-WHISKAS-85-gr-3265534_a.jpg?v=639070322086400000',
  true, 344
),
(
  'a1200000-0000-4000-a102-000000000346', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros PURINA DOG CHOW adulto medianos y grandes (2000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-dog-chow-adultos-raza-mediana-x-2-kg-418657/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida para perro Dog Chow Adulto medianos y grandes x 2 kg Características Alimento completo para perros adultos de razas medianas y grandes de 1 a 7 a',
  '🍿', 19462, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612736/Alimento-Dog-Chow-Adultos-Raza-Mediana-X-2-kg-774875_a.jpg?v=639160249791770000',
  true, 345
),
(
  'a1200000-0000-4000-a102-000000000347', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos FELIX pate pavo y menudencias en salsa (156  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-pate-pavo-y-menudencias-x-156-gr-273212/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida para gatos FELIX pate pavo y menudencias en salsa (156 gr) Características Comida húmeda para Gatos Purina® Felix® Pavo y Menudencias x 156 gr Beneficios Alimento balancead',
  '🍿', 6050, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32966940/Felix-Pate-Pavo-Y-Menudencias-X-156-gr-924283_a.jpg?v=639111051878700000',
  true, 346
),
(
  'a1200000-0000-4000-a102-000000000348', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos FELIX pate pescado y atún en salsa (156  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-pate-pescado-y-atun-x-156-gr-273207/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida húmeda para Gatos Purina® Felix® Pate pescado y atun en salsa x 156 gr Características Comida húmeda para Gatos Purina® Felix® Pate pescado y atun en salsa x 156 gr Beneficios ',
  '🍿', 5810, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32955135/Felix-Pate-Pescado-Y-Atun-X-156-gr-922460_a.jpg?v=639110802421970000',
  true, 347
),
(
  'a1200000-0000-4000-a102-000000000349', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos FELIX pate salmón (156  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/felix-pate-de-salmon-x-156-gr-273205/p. Marca: FELIX. Contenido suministrado a Almacenes Éxito directamente por FELIX Comida húmeda para Gatos Purina® Felix® Salmon x 156 gr Características Comida húmeda para Gatos Purina® Felix® Salmon x 156 gr Beneficios Alimento balanceado y completo húmedo para gatos ',
  '🍿', 5980, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32971403/Felix-Pate-De-Salmon-X-156-gr-919247_a.jpg?v=639111258770270000',
  true, 348
),
(
  'a1200000-0000-4000-a102-000000000350', 'b1100000-0000-4000-a110-000000000002', 'Alimento Para Perros PURINA DOG CHOW Multipack (595  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perros-purina-dog-chow-multipack-595-gr-3250514/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® pack surtido x 7 sobres Características ALIMENTO HÚMEDO COMPLETO Y BALANCEADO para perros adultos de todos l',
  '🍿', 17750, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33594698/Alimento-Para-Perros-PURINA-DOG-CHOW-Multipack-595-gr-3839653_a.jpg?v=639159439561500000',
  true, 349
),
(
  'a1200000-0000-4000-a102-000000000351', 'b1100000-0000-4000-a110-000000000002', 'Alimento Para Perro PURINA DOG CHOW Todos Los Tamaños (4000  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perro-purina-dog-chow-todos-los-tamanos-4000-gr-3250399/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida para perro Dog Chow Adulto todos los tamaños x 4 kg Características Alimento completo para perros adultos de razas medianas y gr',
  '🍿', 38100, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33594699/Alimento-Para-Perro-PURINA-DOG-CHOW-Todos-Los-Tamanos-4000-gr-3839379_a.jpg?v=639159439573400000',
  true, 350
),
(
  'a1200000-0000-4000-a102-000000000352', 'b1100000-0000-4000-a110-000000000002', 'Snack cremoso DON KAT atún x4und (48  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/snack-cremoso-gatos-atun-4-unidades-don-kat-48-gr-3240401/p. Marca: DON KAT. Lleva a casa fácil y rápido Snack cremoso DON KAT atún x4und (48 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7690, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34118162/Snack-Cremoso-Gatos-Atun-4-Unidades-DON-KAT-48-gr-3799726_a.jpg?v=639199037233500000',
  true, 351
),
(
  'a1200000-0000-4000-a102-000000000353', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros PURINA DOG CHOW adultos cerdo pavo y pescado (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perros-adlt-multiproteinas-purina-dog-chow-85-gr-3238696/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® Multiproteínas x85g Características Alimento húmedo para Perros Purina® Dog Chow® que ayudan a su h',
  '🍿', 2950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612764/ALIMENTO-PARA-PERROS-ADLT-MULTIPROTEINAS-PURINA-DOG-CHOW-85-gr-3794275_a.jpg?v=639160249904330000',
  true, 352
),
(
  'a1200000-0000-4000-a102-000000000354', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros PURINA DOG CHOW adultos carne cerdo y pollo (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-para-perros-adlt-alta-prot-purina-dog-chow-85-gr-3238695/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® Alta Proteína x85g Características Alimento húmedo para Perros Purina® Dog Chow® que ayudan a su hidrata',
  '🍿', 2950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612763/ALIMENTO-PARA-PERROS-ADLT-ALTA-PROT-PURINA-DOG-CHOW-85-gr-3794274_a.jpg?v=639160249891700000',
  true, 353
),
(
  'a1200000-0000-4000-a102-000000000355', 'b1100000-0000-4000-a110-000000000002', 'Comida para perros PURINA DOG CHOW adultos sabor pollo (85  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/alimento-perro-adlt-pollo-purina-dog-chow-85-gr-3238694/p. Marca: PURINA DOG CHOW. Contenido suministrado a Almacenes Éxito directamente por PURINA DOG CHOW Comida húmeda para perro Dog Chow® Nutrición Reforzada sabor a pollo x85g Características Alimento húmedo para perros Purina® Dog Chow® Nutrición Ref',
  '🍿', 2950, 'Comida y snack para perros', 'https://exitocol.vteximg.com.br/arquivos/ids/33612774/ALIMENTO-PERRO-ADLT-POLLO-PURINA-DOG-CHOW-85-gr-3794273_a.jpg?v=639160249963670000',
  true, 354
),
(
  'a1200000-0000-4000-a102-000000000356', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos 7 VIDAS pescado y camarón (75  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/trozos-sabores-del-mar-12-7-vidas-75-gr-3227812/p. Marca: 7 VIDAS. Lleva a casa fácil y rápido Comida para gatos 7 VIDAS pescado y camarón (75 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3260, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32573004/Trozos-Sabores-del-Mar-12-7-VIDAS-75-gr-3760235_a.jpg?v=639070328297270000',
  true, 355
),
(
  'a1200000-0000-4000-a102-000000000357', 'b1100000-0000-4000-a110-000000000002', 'Comida para gatos 7 VIDAS cordero y pavo (75  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/trozos-sabores-de-tierra-12-7-vidas-75-gr-3227811/p. Marca: 7 VIDAS. Lleva a casa fácil y rápido Comida para gatos 7 VIDAS cordero y pavo (75 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🍿', 3260, 'Comida y snack para gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/32573003/Trozos-Sabores-de-Tierra-12-7-VIDAS-75-gr-3760234_a.jpg?v=639070328288970000',
  true, 356
),
(
  'a1200000-0000-4000-a102-000000000358', 'b1100000-0000-4000-a110-000000000002', 'Pañitos húmedos PUKÍ para mascotas (50  und) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/panitos-humedos-para-mascotas-puki-sin-ref-3226975/p. Marca: PUKÍ. Lleva a casa fácil y rápido Pañitos húmedos PUKÍ para mascotas (50 und). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🐶', 4100, 'Comida peces, aves y otras mascotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32904917/Panitos-Humedos-Para-Mascotas-PUKI-SIN-REF-3757389_a.jpg?v=639101472440970000',
  true, 357
),
(
  'a1200000-0000-4000-a102-000000000359', 'b1100000-0000-4000-a110-000000000002', 'Snack para gatos Churu sabor atún y cangrejo (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/tuna-recipe-with-crab-flavor-churu-56-gr-3223635/p. Marca: Churu. Lleva a casa fácil y rápido Snack para gatos Churu sabor atún y cangrejo (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12600, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34115521/Tuna-Recipe-With-Crab-Flavor-Churu-56-gr-3745151_a.jpg?v=639198932027570000',
  true, 358
),
(
  'a1200000-0000-4000-a102-000000000360', 'b1100000-0000-4000-a110-000000000002', 'Snack para gatos Churu sabor a pollo y cangrejo (56  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/chicken-with-crab-flavor-recipe-churu-56-gr-3223634/p. Marca: Churu. Lleva a casa fácil y rápido Snack para gatos Churu sabor a pollo y cangrejo (56 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 12600, 'Gatos', 'https://exitocol.vteximg.com.br/arquivos/ids/34115520/Chicken-With-Crab-Flavor-Recipe-Churu-56-gr-3745150_a.jpg?v=639198932019800000',
  true, 359
),
(
  'a1200000-0000-4000-a102-000000000361', 'b1100000-0000-4000-a110-000000000002', 'Compota MAH frutos del bosque (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-infantiles-mah-90-gr-3158817/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH frutos del bosque (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/31863869/Compota-Infantiles-MAH-90-gr-3526301_a.jpg?v=638993548315600000',
  true, 360
),
(
  'a1200000-0000-4000-a102-000000000362', 'b1100000-0000-4000-a110-000000000002', 'Compota MAH frutos tropicales (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-infantiles-mah-90-gr-191425/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH frutos tropicales (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821215/Compota-Infantiles-MAH-90-gr-1664587_a.jpg?v=638918957601030000',
  true, 361
),
(
  'a1200000-0000-4000-a102-000000000363', 'b1100000-0000-4000-a110-000000000002', 'Compota MAH zanahoriabatatamanzana (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-infantiles-mah-90-gr-3158818/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH zanahoria-batata-manzana (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33543975/Compota-Infantiles-MAH-90-gr-3526302_a.jpg?v=639154430392930000',
  true, 362
),
(
  'a1200000-0000-4000-a102-000000000364', 'b1100000-0000-4000-a110-000000000002', 'Compota BABYFRUIT manzana (90  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compt-de-manzana-pouch-90g-babyfruit-90-ml-3121148/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT manzana (90 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2790, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33542229/COMPT-DE-MANZANA-POUCH-90g-BABYFRUIT-90-ml-3377347_a.jpg?v=639154423661000000',
  true, 363
),
(
  'a1200000-0000-4000-a102-000000000365', 'b1100000-0000-4000-a110-000000000002', 'Compota BABYFRUIT pera (90  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-de-pera-pouch-90g-babyfruit-90-ml-3121114/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT pera (90 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 2790, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32476076/COMPOTA-DE-PERA-POUCH-90g-BABYFRUIT-90-ml-3377252_a.jpg?v=639063466940200000',
  true, 364
),
(
  'a1200000-0000-4000-a102-000000000366', 'b1100000-0000-4000-a110-000000000002', 'Compota MAH bananamanzana (82  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organica-banana-manzana-x-90-gr-892111/p. Marca: MAH. Características Producto: EDAD: desde los 6 meses. ORIGEN: Chile. PRESENTACIÓN: pouch de 90 gr Puré de 100% fruta orgánica, sin azúcar añadida. Ideal para empezar la alimentación complementaria a partir de los 6 meses e introducir banana en la ',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33521266/Compota-organica-banana-manzana-x-90-gr-1221748_a.jpg?v=639154191836370000',
  true, 365
),
(
  'a1200000-0000-4000-a102-000000000367', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE pera (104  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-pera-frasco-vidiro-san-jorge-113-gramo-716707/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE pera (104 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5180, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804651/Compota-Pera-Frasco-Vidiro-SAN-JORGE-113-Gramo-613807_a.jpg?v=638932257056570000',
  true, 366
),
(
  'a1200000-0000-4000-a102-000000000368', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE manzana (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-manzana-frasco-vidrio-716706/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE manzana (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4400, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33525608/COMPOTA-MANZANA-FRASCO-VIDRIO-613671_a.jpg?v=639154276321700000',
  true, 367
),
(
  'a1200000-0000-4000-a102-000000000369', 'b1100000-0000-4000-a110-000000000002', 'Compota BABY EVOLUTION orgánica peramanoespinaca (99  GR) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-pera-mango-espinaca-x-99gr-871551/p. Marca: BABY EVOLUTION. Características Caracteristicas del producto Ingredientes organicos 100% fruta y verdura organica Empaque practico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto Por ser un p',
  '🛒', 7640, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821122/Compota-Organic-Baby-Evolution-Pera-Mango-Espinaca-X-99gr-1191291_a.jpg?v=638918957053670000',
  true, 368
),
(
  'a1200000-0000-4000-a102-000000000370', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE mango (103  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-mango-frasco-vidrio-718442/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE mango (103 ml). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5180, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33525611/COMPOTA-MANGO-FRASCO-VIDRIO-618897_a.jpg?v=639154276341170000',
  true, 369
),
(
  'a1200000-0000-4000-a102-000000000371', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE melocotón (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-melocoton-san-jorge-113-gramo-716900/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE melocotón (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5180, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804654/Compota-melocoton-SAN-JORGE-113-Gramo-615145_a.jpg?v=638932257077830000',
  true, 370
),
(
  'a1200000-0000-4000-a102-000000000372', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE con trocitos de mango (145  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-mango-trocitos-fruta-san-jorge-145-gr-566226/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE con trocitos de mango (145 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5430, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804648/Compota-Mango-Trocitos-Fruta-SAN-JORGE-145-gr-778673_a.jpg?v=638932257035700000',
  true, 371
),
(
  'a1200000-0000-4000-a102-000000000373', 'b1100000-0000-4000-a110-000000000002', 'Compota BABYFRUIT pera (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-de-durazno-babyfruit-103-ml-560235/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT pera (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3550, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33526448/Compota-De-Durazno-BABYFRUIT-103-ml-492775_a.jpg?v=639154287378570000',
  true, 372
),
(
  'a1200000-0000-4000-a102-000000000374', 'b1100000-0000-4000-a110-000000000002', 'Compota BABYFRUIT manzana (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-de-manzana-babyfruit-103-ml-560234/p. Marca: BABYFRUIT. Lleva a casa fácil y rápido Compota BABYFRUIT manzana (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 3550, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/32476074/Compota-De-Manzana-BABYFRUIT-103-ml-492438_a.jpg?v=639063466919300000',
  true, 373
),
(
  'a1200000-0000-4000-a102-000000000375', 'b1100000-0000-4000-a110-000000000002', 'Compota HEINZ frutas tropicales (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-fruta-tropical-504682/p. Marca: HEINZ. Lleva a casa fácil y rápido Compota HEINZ frutas tropicales (113 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821181/Compota-Fruta-Tropical-834838_a.jpg?v=638918957383800000',
  true, 374
),
(
  'a1200000-0000-4000-a102-000000000376', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE con trocitos de manzana (145  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-trocitos-de-manzana-san-jorge-145-gr-411996/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE con trocitos de manzana (145 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 5430, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/30804639/Compota-Trocitos-De-Manzana-SAN-JORGE-145-gr-79632_a.jpg?v=638932256975630000',
  true, 375
),
(
  'a1200000-0000-4000-a102-000000000377', 'b1100000-0000-4000-a110-000000000002', 'Compota HEINZ melocotón (113  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-melocoton-frasco-309392/p. Marca: HEINZ. Características Advertencia: La leche materna es el mejor alimento para el niño. El producto proporcionado solo es complementario de la leche materna después de los primeros cuatro (4) meses de edad del niño. Ley 1397 de 1992. Colado Melocotón x 113g. Marca',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33521260/Compota-Melocoton-Frasco-610571_a.jpg?v=639154191771000000',
  true, 376
),
(
  'a1200000-0000-4000-a102-000000000378', 'b1100000-0000-4000-a110-000000000002', 'Compota BABY EVOLUTION orgánica manzanabananoarándano (99  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-org-manz-ban-fre-aran-baby-evolution-99-gramo-191430/p. Marca: BABY EVOLUTION. Lleva a casa fácil y rápido Compota BABY EVOLUTION orgánica manzana-banano-arándano (99 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 8090, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821131/COMPOTA-ORG-MANZ-BAN-FRE-ARAN-BABY-EVOLUTION-99-Gramo-1664589_a.jpg?v=638918957136000000',
  true, 377
),
(
  'a1200000-0000-4000-a102-000000000379', 'b1100000-0000-4000-a110-000000000002', 'Compota MAH manzana (90  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/pure-organico-love-manzana-185094/p. Marca: MAH. Lleva a casa fácil y rápido Compota MAH manzana (90 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821211/Pure-Organico-Love-Manzana-1479070_a.jpg?v=638918957573870000',
  true, 378
),
(
  'a1200000-0000-4000-a102-000000000380', 'b1100000-0000-4000-a110-000000000002', 'Compota GERBER de manzana  (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/comporta-de-manzana-x-113-g-13244/p. Marca: GERBER. Compota GERBER® de manzana orgánica, para bebés a partir de los 6 meses. No tiene azúcar añadida, ni harinas, ni espesantes, ni conservantes. Primeras compotas con el sello del Ministerio de Agricultura para productos orgánicos en Colombia',
  '🛒', 5570, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33264086/Comporta-De-Manzana-x-113-g-1741755_a.jpg?v=639131629790400000',
  true, 379
),
(
  'a1200000-0000-4000-a102-000000000381', 'b1100000-0000-4000-a110-000000000002', 'Compota MAH mangomanzana (82  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organica-mango-manzana-x-90-gr-892113/p. Marca: MAH. Características EDAD: desde los 8 meses. ORIGEN: Chile. PRESENTACIÓN: pouch de 90 gr. Puré de 100% fruta orgánica, sin azúcar añadida. Ideal para empezar la alimentación complementaria a partir de los 8 meses e introducir mango en la dieta de tu',
  '🛒', 4510, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33521269/Compota-organica-mango-manzana-x-90-gr-1221749_a.jpg?v=639154191856070000',
  true, 380
),
(
  'a1200000-0000-4000-a102-000000000382', 'b1100000-0000-4000-a110-000000000002', 'Compota BABY EVOLUTION orgánica manzanacalabazazanahoria (99  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-manzana-calabaza-zanahoria-871542/p. Marca: BABY EVOLUTION. Caraceristicas Ingredientes orgánicos y naturales 100% Fruta y Verdura Orgánica Empaque práctico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto: Por ser un producto 100% natu',
  '🛒', 7540, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821141/Compota-Organic-Baby-Evolution-Manzana-calabaza-zanahoria-1191290_a.jpg?v=638918957192100000',
  true, 381
),
(
  'a1200000-0000-4000-a102-000000000383', 'b1100000-0000-4000-a110-000000000002', 'Formula infantil ENFAGROW alimento lácteo etapa 3 niños (1650  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/enfagrow-bib-x-1650-g-679799/p. Marca: ENFAGROW. Contenido suministrado a Almacenes Éxito directamente por Enfagrow Alimento Lácteo Enfagrow Premium Promental Natural Etapa 3 - Caja 1650 G1. lavarse las manos con agua y jabon antes de preparar la formula. 2. lave y enjuague los recipientes. Luego hiervalo',
  '🛒', 183760, 'Leche de fórmula', 'https://exitocol.vteximg.com.br/arquivos/ids/32773957/Enfagrow-Bib-X-1650-G-303879_a.jpg?v=639090053021600000',
  true, 382
),
(
  'a1200000-0000-4000-a102-000000000384', 'b1100000-0000-4000-a110-000000000002', 'Compota BABY EVOLUTION orgánica bananoduraznomango (70.213  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-banano-durazno-mango-x99gr-666506/p. Marca: BABY EVOLUTION. Características Caracteristicas del producto Ingredientes orgánicos y naturales 100% Fruta y Verdura Orgánica Empaque práctico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto ',
  '🛒', 7730, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29825140/Compota-Organic-Baby-Evolution-Banano-Durazno-Mango-X99gr-842060_a.jpg?v=638919074018470000',
  true, 383
),
(
  'a1200000-0000-4000-a102-000000000385', 'b1100000-0000-4000-a110-000000000002', 'Compota BABY EVOLUTION orgánica manzanapera (73.333  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-organic-baby-evolution-manzana-pera-x-99-gr-666505/p. Marca: BABY EVOLUTION. Características Caracteristicas del producto Ingredientes orgánicos y naturales 100% Fruta y Verdura Orgánica Empaque práctico, seguro y amigable con el medio ambiente. Tapa anti-ahogamiento Beneficios del producto Por se',
  '🛒', 7630, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29825135/Compota-Organic-Baby-Evolution-Manzana-Pera-X-99-gr-842032_a.jpg?v=638919073995430000',
  true, 384
),
(
  'a1200000-0000-4000-a102-000000000386', 'b1100000-0000-4000-a110-000000000002', 'Compota HEINZ pera (113  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-pera-frasco-253535/p. Marca: HEINZ. Compota Pera Frasco Caracteristicas Compota Pera Heinz. Marca: Heinz. Características: Compota Pera Heinz con vitaminas y minerales, colado, sin colorantes, sin sabores artificiales, este producto solo es complementario de la leche materna después de los seis me',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821199/Compota-Pera-Frasco-420193_a.jpg?v=638918957498470000',
  true, 385
),
(
  'a1200000-0000-4000-a102-000000000387', 'b1100000-0000-4000-a110-000000000002', 'Compota HEINZ manzana (113  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-manzana-frasco-253534/p. Marca: HEINZ. Compota Manzana Frasco Caracteristicas Compota Manzana Heinz. Marca: Heinz. Características: Compota Manzana Heinz con vitaminas y minerales, colado, sin colorantes, sin sabores artificiales, este producto solo es complementario de la leche materna después de',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821190/Compota-Manzana-Frasco-420192_a.jpg?v=638918957446730000',
  true, 386
),
(
  'a1200000-0000-4000-a102-000000000388', 'b1100000-0000-4000-a110-000000000002', 'Compota HEINZ coctel de frutas (113  ml) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-frutas-frasco-253533/p. Marca: HEINZ. Compota Frutas Frasco Caracteristicas Compota Coctel de Frutas Heinz. Marca: Heinz. Características: Compota Coctel de Frutas Heinz con vitaminas y minerales, colado, sin colorantes, sin sabores artificiales, este producto solo es complementario de la leche ma',
  '🛒', 4900, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33545276/Compota-Frutas-Frasco-420190_a.jpg?v=639154438923170000',
  true, 387
),
(
  'a1200000-0000-4000-a102-000000000389', 'b1100000-0000-4000-a110-000000000002', 'Compota BABY EVOLUTION orgánica banano avenacanela (99  Gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/compota-org-ban-avena-canela-baby-evolution-99-gramo-191431/p. Marca: BABY EVOLUTION. Lleva a casa fácil y rápido Compota BABY EVOLUTION orgánica banano- avena-canela (99 Gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 7980, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/29821126/COMPOTA-ORG-BAN-AVENA-CANELA-BABY-EVOLUTION-99-Gramo-1664590_a.jpg?v=638918957090130000',
  true, 388
),
(
  'a1200000-0000-4000-a102-000000000390', 'b1100000-0000-4000-a110-000000000002', 'Compota SAN JORGE sabores surtidos x3und (339  gr) Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de exito.com. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.exito.com/of-prepack-compota-surtida-san-jorge-113-gramo-61622/p. Marca: SAN JORGE. Lleva a casa fácil y rápido Compota SAN JORGE sabores surtidos x3und (339 gr). Encuentra la mejor garantía. Compra seguro en exito.com',
  '🛒', 14950, 'Compotas', 'https://exitocol.vteximg.com.br/arquivos/ids/33526468/Of-Prepack-Compota-Surtida-SAN-JORGE-113-Gramo-1594800_a.jpg?v=639154287559770000',
  true, 389
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_available = true;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;