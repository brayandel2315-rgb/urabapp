-- D1 Demo — top ventas desde API pública d1.com.co (no Rappi)
ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

UPDATE public.businesses SET
  name = 'Tiendas D1 Apartadó Demo',
  description = 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.

Sede: Carrera 100 # 94-21, Apartadó, Antioquia.
Catálogo: https://www.d1.com.co
Selección: productos más pedidos (OrderByTopSaleDESC) orientados a consumo típico en Urabá.',
  address = 'Carrera 100 # 94-21, Apartadó, Antioquia',
  cover_url = COALESCE(NULLIF(cover_url, ''), '/previews/cover-mercado.jpg'),
  logo_url = COALESCE(NULLIF(logo_url, ''), '/previews/logo-mercado.png'),
  is_published = true,
  is_active = true,
  is_open = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW())
WHERE id = 'b1100000-0000-4000-a110-000000000004';

DELETE FROM public.products
WHERE business_id = 'b1100000-0000-4000-a110-000000000004'
  AND (id::text LIKE 'a1100000%' OR id::text LIKE 'a1220000%');

INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES
(
  'a1220000-0000-4000-a104-000000000001', 'b1100000-0000-4000-a110-000000000004', 'AZÚCAR BLANCA 1000 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/azucar-blanca-1000g-12000249/p. Marca: RIOPAILA/MAYAGÜ/SÚKA. Nombre del producto: Azúcar Blanca 1000 g Descripción del producto: Disfruta de la Azúcar Blanca, ideal para endulzar bebidas, preparar postres y realzar tus recetas favoritas. Características del Producto: Tamaño: 20cm x 13cm Peso: 100',
  '🛒', 3390, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204384/azucar-blanca-1000-grs-12000249.png?v=639190439827730000',
  true, 0
),
(
  'a1220000-0000-4000-a104-000000000002', 'b1100000-0000-4000-a110-000000000004', 'ATÚN EN AGUA CARLO FORTE 170 G NETO Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/atun-en-agua-carlo-forte-170g-12004370/p. Marca: CARLO FORTE. Nombre del producto: Atún en Agua 170g - Carlo Forte Descripción del producto: Atún en Agua Carlo Forte es una opción práctica y versátil para tus comidas diarias. Viene en una presentación de 170 gramos, ideal para quienes buscan una ',
  '🛒', 4450, 'Enlatados y envasados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201969/lomitos-de-atun-en-agua-111gr-12004370-01.png.png?v=639179700324700000',
  true, 1
),
(
  'a1220000-0000-4000-a104-000000000003', 'b1100000-0000-4000-a110-000000000004', 'SAL REFISAL 1000 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/sal-refisal-1000g-12002874/p. Marca: REFISAL. Nombre del producto: Sal Refisal 1000g - Refisal Descripción del producto: La Sal Refisal de 1000 gramos es ideal para el consumo diario en el hogar. Esta sal es reconocida por su alta pureza, blancura y textura, lo que la hace más suelta y fácil de u',
  '🛒', 2900, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200929/sal-alta-pureza-refisal-1kg-12002874-01.png.png?v=639179671225000000',
  true, 2
),
(
  'a1220000-0000-4000-a104-000000000004', 'b1100000-0000-4000-a110-000000000004', 'LENTEJA EL ESTÍO 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/lenteja-el-estio-500g-12000042/p. Marca: EL ESTIO. Nombre del producto: Lenteja El Estío 500g Descripción del producto: Lentejas ideales para preparar sopas, guisos y platos tradicionales. Perfectas para cualquier tipo de ocasión. Características del Producto: Tamaño: 19cm x 12cm Peso: 500 g Modo',
  '🛒', 2100, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198845/lenteja-el-estio-500grs-12000042-01.png.png?v=639179627775400000',
  true, 3
),
(
  'a1220000-0000-4000-a104-000000000005', 'b1100000-0000-4000-a110-000000000004', 'SALSA DE TOMATE ZEV 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salsa-de-tomate-zev-500g-12000266/p. Marca: ZEV. Nombre del producto: Salsa de Tomate ZEV 500 g Descripción del producto: La Salsa de Tomate ZEV es ideal para acompañar una variedad de platos como pastas, carnes, pollo, frijoles, papas fritas, y más. Su sabor natural y su textura perfecta la hace',
  '🛒', 4490, 'Salsas y aderezos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199259/salsa-de-tomate-zev-500gr-12000266-01.png.png?v=639179636675430000',
  true, 4
),
(
  'a1220000-0000-4000-a104-000000000006', 'b1100000-0000-4000-a110-000000000004', 'ARROZ PREMIUM 2500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/arroz-premium-albar-12002416/p. Marca: ALBAR. Nombre del producto: Arroz Premium 2500g Descripción del producto: Arroz blanco premium, cuidadosamente seleccionado para ofrecerte una opción de alta calidad. Perfecto para tus recetas diarias, brindando el mejor sabor y textura en cada preparación. ',
  '🛒', 9850, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200594/arroz-blanco-premium-albar-2500-g-12002416-01.png.png?v=639179664265570000',
  true, 5
),
(
  'a1220000-0000-4000-a104-000000000007', 'b1100000-0000-4000-a110-000000000004', 'HARINA DE MAIZ BLANCA PAN 1000 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/harina-maiz-blanca-pan-1000g-12005433/p. Marca: PAN. Nombre del producto: Harina de Maíz Blanca PAN 800 G Descripción del producto: Disfruta de la deliciosa Harina de Maíz Blanca PAN, perfecta para preparar arepas, empanadas y otros platillos tradicionales. Características del Producto: Tamaño: 1',
  '🛒', 2900, 'Harinas y pre-mezclas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202277/harina-de-maiz-blanco-pan-800gr-12005433-01.png.png?v=639179705512530000',
  true, 6
),
(
  'a1220000-0000-4000-a104-000000000008', 'b1100000-0000-4000-a110-000000000004', 'AZÚCAR MORENA 1000 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/azucar-morena-1000g-12000250/p. Marca: RIOPAILA/MAYAGÜ. Nombre del producto: Azúcar Morena 1000g Descripción del producto: Disfruta de la Azúcar Morena de Mayagüez, un producto refinado y empacado industrialmente, ideal para endulzar tus recetas. Características del Producto: Tamaño: 22cm x 13cm ',
  '🛒', 3400, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204385/azucar-morena-1000g-12000250-00.png?v=639190441384300000',
  true, 7
),
(
  'a1220000-0000-4000-a104-000000000009', 'b1100000-0000-4000-a110-000000000004', 'ARROZ DIANA 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/arroz-diana-500g-12002073/p. Marca: DIANA. Nombre del producto: Arroz Diana 500 g Descripción del producto: Arroz blanco de alta calidad, ideal para preparar tus comidas favoritas. Presentación de 500 gramos. Características del Producto: Tamaño: 18cm x 12cm Peso: 500 g Modo de fabricación: Indus',
  '🛒', 1850, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200450/arroz-diana-500gr-12002073-01.png.png?v=639179661139300000',
  true, 8
),
(
  'a1220000-0000-4000-a104-000000000010', 'b1100000-0000-4000-a110-000000000004', 'MIX DE VERDURAS COOLTIVO 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mix-verduras-cooltivo-500g-12002532/p. Marca: COOLTIVO. Nombre del producto: Mix de Verduras 500g - Cooltivo Descripción del producto: El Mix de Verduras Cooltivo es una combinación práctica y saludable de zanahoria, arveja y maíz, ideal para complementar tus comidas diarias. Elaborado con ingred',
  '🛒', 5700, 'Enlatados y envasados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200704/mix-de-verduras-cooltivo-500gr-12002532-01.png.png?v=639179666853000000',
  true, 9
),
(
  'a1220000-0000-4000-a104-000000000011', 'b1100000-0000-4000-a110-000000000004', 'TORTILLA FAJITA 12 UND CRACHOS 360 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tortilla-fajita-crachos-12-und-360g-12000224/p. Marca: CRACHOS. Nombre del Producto: Tortilla Fajita Crachos 12 Und Descripción del producto: Las Tortillas de Harina de Trigo son un producto alimenticio de alta calidad. Estas tortillas están listas para el consumo y son ideales para preparar una ',
  '🛒', 5490, 'Snacks', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199246/tortillas-de-harina-crachos-360gr-12000224-01.png.png?v=639179636462570000',
  true, 10
),
(
  'a1220000-0000-4000-a104-000000000012', 'b1100000-0000-4000-a110-000000000004', 'ATÚN EN ACEITE CARLO FORTE 170 G NETO Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/atun-en-aceite-carlo-forte-170g-12004360/p. Marca: CARLO FORTE. Nombre del producto: Atún en Aceite 170g - Carlo Forte Descripción del producto: El Atún en Aceite Carlo Forte es una alternativa deliciosa y lista para consumir en cualquier momento. Su presentación de 170 gramos es perfecta para ac',
  '🛒', 5400, 'Enlatados y envasados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201954/atun-en-aceite-carlo-forte-170gr-12004360-01.png.png?v=639179699055200000',
  true, 11
),
(
  'a1220000-0000-4000-a104-000000000013', 'b1100000-0000-4000-a110-000000000004', 'PENNE DELIZIARE 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/penne-deliziare-500g-12000287/p. Marca: DELIZIARE. Nombre del producto: Penne Deliziare 500 g Descripción del producto: Disfruta del auténtico sabor italiano con el Penne Deliziare, ideal para preparar platos clásicos, esta pasta ofrece una textura firme y una excelente absorción de salsas. Carac',
  '🛒', 3990, 'Corta', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199336/penne-deliziare-500gr-12000287-01.png.png?v=639179637970400000',
  true, 12
),
(
  'a1220000-0000-4000-a104-000000000014', 'b1100000-0000-4000-a110-000000000004', 'ACEITE OLIVA EXTRAVIR CASTELL D F 500 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/aceite-oliva-extravirgen-castell-de-ferro-12000330/p. Marca: CASTELL DE FERRO. Nombre del producto: Aceite de Oliva Extravirgen Castell D F 500 mL Descripción del producto: El Aceite de Oliva Extravirgen Castell D F es un aceite de oliva de categoría superior, ideal para todo tipo de preparación ',
  '🛒', 16950, 'Oliva', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199446/aceite--de-oliva-extravirgen-castell-del-ferro-500ml-12000330-01.png.png?v=639179640353070000',
  true, 13
),
(
  'a1220000-0000-4000-a104-000000000015', 'b1100000-0000-4000-a110-000000000004', 'AJO GRANULADO SPECIARIA 28 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/ajo-granulado-speciaria-28g-12003293/p. Marca: SPECIARIA. Nombre del producto: Ajo Granulado Speciaria 28g Descripción del producto: Hecho de dientes de ajo enteros, el Ajo Granulado Speciaria es una opción práctica y sabrosa para enriquecer tus comidas favoritas. Su textura y sabor lo convierten',
  '🛒', 1990, 'Condimentos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201132/ajo-granulado-puro-speciaria-28gr-12003293-01.png.png?v=639179676054930000',
  true, 14
),
(
  'a1220000-0000-4000-a104-000000000016', 'b1100000-0000-4000-a110-000000000004', 'SPAGHETTI DELIZIARE 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/spaghetti-deliziare-500g-12000286/p. Marca: DELIZIARE. Nombre del producto: Spaghetti Deliziare 500 g Descripción del producto: Spaghetti Deliziare es una pasta alimenticia larga de origen italiano, elaborada con sémola de trigo duro. Ideal para preparar recetas tradicionales con una textura firm',
  '🛒', 3990, 'Larga', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199332/spaghetti-deliziare-500gr-12000286-01.png.png?v=639179637916800000',
  true, 15
),
(
  'a1220000-0000-4000-a104-000000000017', 'b1100000-0000-4000-a110-000000000004', 'SALSA DE SOYA ZEV 178 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salsa-de-soya-zev-178ml-12000440/p. Marca: ZEV. Nombre del producto: Salsa de Soya ZEV 178 ml Descripción del producto: La Salsa de Soya ZEV, en su presentación de 178 ml, es ideal como sazonador para todo tipo de preparaciones. Su sabor único le da un toque especial a tus platos. Características',
  '🛒', 1850, 'Salsas y aderezos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199683/salsa-de-soya-zev-178ml-12000440-01.png.png?v=639179644794530000',
  true, 16
),
(
  'a1220000-0000-4000-a104-000000000018', 'b1100000-0000-4000-a110-000000000004', 'PAPAS A LA FRANCESA TOASTATAS 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papas-francesa-toastatas-500g-12000434/p. Marca: TOASTATAS. Nombre del producto: Papas a la Francesa 500 g - Toastatas Descripción del producto: Disfruta el auténtico sabor europeo con las Papas a la Francesa Toastatas, precocidas, prefreídas y congeladas para que puedas prepararlas fácil y rápid',
  '🛒', 4950, 'Congelados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199667/papas-a-la-francesa-toastatas-500gr-12000434-01.png.png?v=639179644376300000',
  true, 17
),
(
  'a1220000-0000-4000-a104-000000000019', 'b1100000-0000-4000-a110-000000000004', 'MAÍZ DULCE CONGELADO COOLTIVO 500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/maiz-dulce-congelado-cooltivo-500g-12006460/p. Marca: COOLTIVO. Nombre del producto: Maíz Dulce Congelado COOLTIVO 500 g Descripción del producto: El Maíz Dulce Congelado COOLTIVO es ideal para acompañar tus comidas con un toque natural y dulce. Gracias a su proceso de congelación, conserva su fr',
  '🛒', 5990, 'Congelados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202924/granos-de-maiz-congelados-cooltivo-500gr-12006460-01.png.png?v=639179829092900000',
  true, 18
),
(
  'a1220000-0000-4000-a104-000000000020', 'b1100000-0000-4000-a110-000000000004', 'PANELA FRACCIONADA 1000 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panela-fraccionada-el-refugio-1000g-12000121/p. Marca: EL REFUGIO. PANELA FRACCIONADA 1000 GR',
  '🛒', 7200, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198996/panela-fraccionada-el-refugio-1000g-12000121-01.png.png?v=639179631157170000',
  true, 19
),
(
  'a1220000-0000-4000-a104-000000000021', 'b1100000-0000-4000-a110-000000000004', 'FRÍJOL CARGAMANTO ROJO EL ESTÍO 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/frijol-cargamanto-rojo-el-estio-500g-12000041/p. Marca: EL ESTIO. Nombre del producto: Fríjol Cargamanto Rojo El Estío 500g Descripción del producto: Ideal para preparar guisos, sopas y platos tradicionales. Presentación de 500 gramos lista para cocción en recetas caseras. Características del Pro',
  '🛒', 5850, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198841/frijol-cargamanto-rojo-500gr-12000041-1.png.png?v=639179627679600000',
  true, 20
),
(
  'a1220000-0000-4000-a104-000000000022', 'b1100000-0000-4000-a110-000000000004', 'MAÍZ TIERNO COOLTIVO 340 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/maiz-tierno-cooltivo-340g-12000191/p. Marca: COOLTIVO. Nombre del producto: Maíz Tierno Cooltivo 340g Descripción del producto: El Maíz Tierno Cooltivo es un vegetal en conserva listo para el consumo, ideal como ingrediente o acompañante en ensaladas, arroces y muchas otras preparaciones. Viene e',
  '🛒', 5250, 'Enlatados y envasados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199101/maiz-tierno-en-conserva-cooltivo-285gr-12000191-01.png.png?v=639179633323200000',
  true, 21
),
(
  'a1220000-0000-4000-a104-000000000023', 'b1100000-0000-4000-a110-000000000004', 'VINAGRE BLANCO ZEV 1000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/vinagre-blanco-zev-12003655/p. Marca: ZEV. Nombre del producto: Vinagre Blanco ZEV x 1000 mL Descripción del producto: El Vinagre Blanco ZEV de 1000 mL es perfecto para aderezar verduras, legumbres crudas y otras preparaciones. Es ideal para darle un toque ácido y fresco a tus platillos. Caracter',
  '🛒', 2850, 'Salsas y aderezos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201425/vinagre-blanco-zev-1000ml-12003655-01.png.png?v=639179689290230000',
  true, 22
),
(
  'a1220000-0000-4000-a104-000000000024', 'b1100000-0000-4000-a110-000000000004', 'PAN DE YUCA BACKEREI 8 UNDS 160 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-de-yuca-backerei-8-und-160g-12004870/p. Marca: BACKEREI. Nombre del producto: Pan de Yuca 160 g (8 unidades) - Backerei Descripción del producto: Deléitate con el tradicional Pan de Yuca Backerei, una masa congelada lista para cocinar, ideal para disfrutar al desayuno, como refrigerio o en cu',
  '🛒', 6990, 'Congelados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202075/masa-de-pandeyuca-congelado-backerei-unds-160gr-12004870-01.png.png?v=639179701909470000',
  true, 23
),
(
  'a1220000-0000-4000-a104-000000000025', 'b1100000-0000-4000-a110-000000000004', 'AREPA MINI TELA 10 UND MASMAI Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/arepa-mini-tela-masmai-10-und-12006921/p. Marca: MASMAI. Nombre del producto: Arepa de Puro Maíz Blanco Mini Tela 600g Descripción del producto: Disfruta de la tradicional Arepa de Puro Maíz Blanco, elaborada con ingredientes naturales y seleccionados. Ideal para acompañar tus desayunos o cualqui',
  '🛒', 2150, 'Arepas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203498/arepa-de-maiz-blanco-minitela-masmai-600g-12006921-01.png.png?v=639179860767770000',
  true, 24
),
(
  'a1220000-0000-4000-a104-000000000026', 'b1100000-0000-4000-a110-000000000004', 'AREPA DE CHÓCOLO 5 UND MASMAÍ 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/arepa-chocolo-masmai-5-und-400g-12000024/p. Marca: MASMAI. Nombre del producto: Arepa de Chócolo 5 UND x 400 g - Masmai Descripción del producto: Las Arepas de Chócolo de Masmai son una deliciosa opción para tus desayunos y comidas. Su combinación de maíz chócolo con un toque dulce y suave textur',
  '🛒', 3250, 'Arepas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198821/arepa-chocolo-masmai-400g-5und-12000024-1.png.png?v=639179626554970000',
  true, 25
),
(
  'a1220000-0000-4000-a104-000000000027', 'b1100000-0000-4000-a110-000000000004', 'GARBANZO EL ESTÍO 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/garbanzo-el-estio-500g-12000044/p. Marca: EL ESTIO. Nombre del producto: Garbanzos El Estío 500g Descripción del producto: Garbanzos ideales para preparar guisos, sopas, ensaladas y otras recetas nutritivas. Características del Producto: Tamaño: 19cm x 12cm Peso: 500 g Modo de fabricación: Indust',
  '🛒', 2690, 'Granos azucar y panela', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198853/garbanzo-el-estio-500gr-12000044-01.png.png?v=639179628061100000',
  true, 26
),
(
  'a1220000-0000-4000-a104-000000000028', 'b1100000-0000-4000-a110-000000000004', 'CAFÉ TOSTADO/MOLIDO VIEJO MOLINO 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cafe-tostado-molido-viejo-molino-12000184/p. Marca: VIEJO MOLINO. Nombre del Producto: Café Tostado y Molido Viejo Molino 125 g Descripción del producto: Café puro, tostado y molido con tostión oscura y molienda fina. Ofrece un sabor fuerte, aromático e intenso. Características del Producto: Tama',
  '🛒', 19900, 'Cafés y chocolates', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199098/cafe-tostado-y-molido-viejo-molino-500g-12000184-01.png.png?v=639179633287930000',
  true, 27
),
(
  'a1220000-0000-4000-a104-000000000029', 'b1100000-0000-4000-a110-000000000004', 'ESPARCIBLE VEGETAL DON OLIO 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/esparcible-vegetal-don-olio-500g-12000335/p. Marca: DON OLIO. Nombre del producto: Esparcible Vegetal Don Olio 500 g Descripción del producto: La Esparcible Vegetal Don Olio de 500 g es una margarina elaborada con una mezcla de aceites y grasas vegetales refinadas, ideal para toda preparación en ',
  '🛒', 7450, 'Margarinas y aceites', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199478/esparcible-mesa-cocina-don-olio-500gr-12000335-01.png.png?v=639179640593970000',
  true, 28
),
(
  'a1220000-0000-4000-a104-000000000030', 'b1100000-0000-4000-a110-000000000004', 'BARRA ESPARCIBLE DON OLIO 125 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/barra-esparcible-don-olio-125g-12000478/p. Marca: DON OLIO. Nombre del producto: Barra Esparcible Don Olio 125 g Descripción del producto: La Barra Esparcible Don Olio de 125 g es una opción práctica y versátil para tus preparaciones culinarias. Ideal para freír, dorar o utilizar como ingrediente',
  '🛒', 1400, 'Margarinas y aceites', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199728/esparcible-en-barra-don-olio-125gr-12000478-01.png.png?v=639179645768770000',
  true, 29
),
(
  'a1220000-0000-4000-a104-000000000031', 'b1100000-0000-4000-a110-000000000004', 'CHOCOLATE DE LA TAZA CLAVOS CANELA 500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chocolate-de-la-taza-500g-12000646/p. Marca: DE LA TAZA. Nombre del Producto: Chocolate De La Taza Clavos y Canela 500 g Descripción del producto: Chocolate de mesa con azúcar, clavos y canela, ideal para preparar para el desayuno o cualquier momento de el día. Características del Producto: Tamañ',
  '🛒', 10850, 'Cafés y chocolates', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199885/chocolate-de-mesa-con-azucar-clavos-y-canela-de-la-taza-500gr-12000646-01.png.png?v=639179648831400000',
  true, 30
),
(
  'a1220000-0000-4000-a104-000000000032', 'b1100000-0000-4000-a110-000000000004', 'ACEITE DE GIRASOL DON OLIO 2000ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/aceite-girasol-don-olio-12000775/p. Marca: DON OLIO. Nombre del producto: Aceite de Girasol Don Olio 2000 mL Descripción del producto: El Aceite de Girasol Don Olio es un aceite vegetal refinado de alta calidad. Ideal para el uso en cocina y preparación de alimentos, especialmente en frituras, ad',
  '🛒', 18950, 'Girasol', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199957/aceite-de-girasol-don-olio-2000ml-12000775-01.png.png?v=639179650423900000',
  true, 31
),
(
  'a1220000-0000-4000-a104-000000000033', 'b1100000-0000-4000-a110-000000000004', 'YOGURT GRIEGO NATURAL VITA LATTI 330 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/yogurt-griego-natural-vita-latti-330g-12003254/p. Marca: VITA LATTI. Nombre del producto: Yogurt Griego Natural 330g - Vita Latti Descripción del producto: Disfruta del Yogurt Griego Natural de Vita Latti, un producto funcional, cremoso y sin dulce añadido. Perfecto para consumir solo o acompañad',
  '🛒', 7600, 'Yogures', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201078/yogurt-griego-vita-latti-330gr-12003254-01.png.png?v=639179674502970000',
  true, 32
),
(
  'a1220000-0000-4000-a104-000000000034', 'b1100000-0000-4000-a110-000000000004', 'QUESO MOZZARELLA TAJADO LATTI 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-mozzarella-tajado-latti-12000084/p. Marca: LATTI. Nombre del producto: Queso Mozzarella Tajado Latti 400 g Descripción del producto: Disfruta del delicioso Queso Mozzarella Tajado de Latti, ideal para tus recetas diarias. Este queso fresco, semigraso y semiduro es perfecto para gratinar, fu',
  '🛒', 10500, 'Queso tajado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198944/queso-mozzarella-tajado-latti-400gr-12000084-01.png.png?v=639179629969770000',
  true, 33
),
(
  'a1220000-0000-4000-a104-000000000035', 'b1100000-0000-4000-a110-000000000004', 'CREMA DE LECHE LARGA VIDA 200 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crema-de-leche-larga-vida-200ml-12001250/p. Marca: LATTI. Nombre del producto: Crema de Leche Larga Vida 200 mL - Latti Descripción del producto: Disfruta de la Crema de Leche Larga Vida de Latti, una opción semientera ideal para todas tus preparaciones culinarias. Es práctica, versátil y perfect',
  '🛒', 2400, 'Otros derivados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200208/crema-de-leche-latti-200gr-12001250-01.png.png?v=639179655748870000',
  true, 34
),
(
  'a1220000-0000-4000-a104-000000000036', 'b1100000-0000-4000-a110-000000000004', 'MANTEQUILLA SIN SAL LATTI X 200GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mantequilla-sin-sal-latti-x-200gr-12005810/p. Marca: LATTI. Nombre del producto: Mantequilla sin Sal Latti 200 g Descripción del producto: La Mantequilla sin Sal Latti es ideal para quienes prefieren un sabor suave y natural. Elaborada con crema de leche pasteurizada, es perfecta para consumir di',
  '🛒', 10350, 'Mantequillas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202430/mantequilla-latti-200gr-12005810-01.png.png?v=639179727717130000',
  true, 35
),
(
  'a1220000-0000-4000-a104-000000000037', 'b1100000-0000-4000-a110-000000000004', 'HUEVO TIPO A SOL NACIENTE 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/huevo-tipo-a-sol-naciente-30-und-12000344/p. Marca: SOL NACIENTE. Nombre del producto: Huevo Tipo A Sol Naciente 30 Und Descripción del producto: Los Huevos Tipo A Sol Naciente son perfectos para tus recetas y preparaciones diarias. Son ideales para todo tipo de preparaciones, desde omelets hasta',
  '🥛', 11490, 'Huevos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199498/huevo-tipo-a-sol-naciente-30und-12000344-01.png.png?v=639179641011170000',
  true, 36
),
(
  'a1220000-0000-4000-a104-000000000038', 'b1100000-0000-4000-a110-000000000004', 'LECHE ENTERA BOLSA UHT LATTI 900 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-entera-bolsa-uht-latti-900ml-12000094/p. Marca: LATTI. Nombre del producto: Leche Entera Bolsa UHT Latti 900 mL Descripción del producto: Disfruta de la Leche Entera UHT Latti ideal para toda la familia. Su presentación en bolsa de 900 mL es perfecta para el uso diario. Características del ',
  '🛒', 3090, 'Entera', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198962/leche-entera-latti-900ml-12000094-01.png.png?v=639179630422500000',
  true, 37
),
(
  'a1220000-0000-4000-a104-000000000039', 'b1100000-0000-4000-a110-000000000004', 'LECHE DESLACTOSADA BOLSA UHT LATTI 900ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-deslactosada-bolsa-uht-latti-900ml-12005757/p. Marca: LATTI. Nombre del producto: Leche Deslactosada UHT 900 mL - Latti Descripción del producto: La Leche Deslactosada UHT de Latti se presenta en un práctico empaque en bolsa de 900 mL, ideal para el uso diario en el hogar. esta leche semide',
  '🥛', 3100, 'Deslactosada', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202354/leche-deslactosada-latti-900ml-12005757-01.png.png?v=639179726428470000',
  true, 38
),
(
  'a1220000-0000-4000-a104-000000000040', 'b1100000-0000-4000-a110-000000000004', 'LECHE DESLAC TETRAPAK UHT LATTI 900 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-deslac-tetrapak-uht-latti-900ml-12000245/p. Marca: LATTI. Nombre del producto: Leche Deslactosada Tetrapak UHT Latti 900 mL Descripción del producto: Disfruta de la Leche Deslactosada Tetrapak UHT Latti, ideal para tener en el hogar. Características del Producto: Tamaño: 20 cm x 7 cm Peso: ',
  '🥛', 3700, 'Deslactosada', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199194/leche-deslactosada-latti-900ml-12000245-01.png.png?v=639179635419670000',
  true, 39
),
(
  'a1220000-0000-4000-a104-000000000041', 'b1100000-0000-4000-a110-000000000004', 'QUESO CREMA LATTI 200 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-crema-latti-200g-12000341/p. Marca: LATTI. Nombre del producto: Queso Crema Latti 200 g Descripción del producto: El Queso Crema Latti es un queso fresco, blando y semigraso, ideal para untar y disfrutar en tus preparaciones. Características del Producto: Tamaño: 10 cm x 7 cm Peso: 200 g Mo',
  '🛒', 3400, 'Esparcibles', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199486/queso-crema-latti-200gr-12000341-01.png.png?v=639179640712870000',
  true, 40
),
(
  'a1220000-0000-4000-a104-000000000042', 'b1100000-0000-4000-a110-000000000004', 'LECHE ENTERA TETRAPAK UHT LATTI 900 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-entera-tetrapak-uht-latti-900ml-12000543/p. Marca: LATTI. Nombre del producto: Leche Entera UHT 900 mL - Latti Descripción del producto: La Leche Entera UHT de Latti viene en una práctica presentación de 900 mL, empacada en envase Tetra Pak para facilitar su almacenamiento y uso diario. Est',
  '🛒', 3500, 'Entera', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199818/leche-entera-latti-900ml-12000543-01.png.png?v=639179647707170000',
  true, 41
),
(
  'a1220000-0000-4000-a104-000000000043', 'b1100000-0000-4000-a110-000000000004', 'CUAJADA LATTI 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cuajada-latti-400g-12000055/p. Marca: LATTI. Nombre del producto: Cuajada Latti 400g Descripción del producto: Disfruta de la frescura y suavidad de la Cuajada Latti, un queso fresco, semiblando y semigraso, ideal para consumir directamente, su sabor auténtico la convierte en una excelente opción',
  '🛒', 9450, 'Queso en bloque', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198880/queso-cuajada-latti-400gr-12000055-01.png.png?v=639179628687630000',
  true, 42
),
(
  'a1220000-0000-4000-a104-000000000044', 'b1100000-0000-4000-a110-000000000004', 'QUESO PARMESANO LATTI 100 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-parmesano-latti-100g-12000139/p. Marca: LATTI. Nombre del producto: Queso Parmesano Latti 100 g Descripción del producto: El Queso Parmesano Latti de 100 gramos es un queso maduro, semigraso y duro, ideal para complementar tus platos favoritos con su sabor intenso. Perfecto para pastas, sop',
  '🛒', 7550, 'Queso delikatessen', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199020/queso-parmesano-latti-100gr-12000139-01.png.png?v=639179631616500000',
  true, 43
),
(
  'a1220000-0000-4000-a104-000000000045', 'b1100000-0000-4000-a110-000000000004', 'QUESO TAJADO VITA LATTI 249 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-tajado-vita-latti-249g-12003514/p. Marca: VITA LATTI. Nombre del producto: Queso Tajado Vita Latti 249g Descripción del producto: El Queso Tajado Vita Latti es un queso fresco semigraso semiduro de alta calidad, ideal para consumo directo. Con un sabor suave y versátil, este queso es perfec',
  '🛒', 9490, 'Queso tajado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201277/queso-semigraso-vita-latti-249gr-12003514-01.png.png?v=639179679354570000',
  true, 44
),
(
  'a1220000-0000-4000-a104-000000000046', 'b1100000-0000-4000-a110-000000000004', 'QUESO PARMESANO ALPINA 120 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-parmesano-alpina-120g-12004307/p. Marca: ALPINA. Nombre del producto: Queso Parmesano Alpina 120 g Descripción del producto: El Queso Parmesano Alpina de 120 gramos es una opción deliciosa y práctica para agregar sabor y textura a tus comidas, ideal para pastas, ensaladas y más. Característ',
  '🛒', 15350, 'Queso delikatessen', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201910/queso-parmesano-alpina-120gr-12004307-01.png.png?v=639179698267500000',
  true, 45
),
(
  'a1220000-0000-4000-a104-000000000047', 'b1100000-0000-4000-a110-000000000004', 'QUESILLO TAJADO LATTI 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/quesillo-tajado-latti-400g-12000169/p. Marca: LATTI. Nombre del producto: Quesillo Tajado Latti 400 g Descripción del producto: El Quesillo Tajado Latti es un queso fresco, semigraso y semiduro, ideal para preparar múltiples recetas o disfrutarlo solo. Características del Producto: Tamaño: 14.5 c',
  '🛒', 10500, 'Queso tajado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199080/queso-en-tajadas-quesillo-latti-400gr-12000169-01.png.png?v=639179632987800000',
  true, 46
),
(
  'a1220000-0000-4000-a104-000000000048', 'b1100000-0000-4000-a110-000000000004', 'HUEVO TIPO AA SOL NACIENTE 12 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/huevo-tipo-aa-sol-naciente-12-und-12000291/p. Marca: SOL NACIENTE. Nombre del Producto: Huevos de Gallina Sol Naciente AA x 12 Descripción del producto: Estos huevos de gallina son ideales para el consumo directo como alimento cocido o como ingrediente en la preparación de alimentos. Con un conte',
  '🥛', 7490, 'Huevos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199348/huevo-tipo-aa-sol-naciente-12und-12000291-01.png.png?v=639179638161400000',
  true, 47
),
(
  'a1220000-0000-4000-a104-000000000049', 'b1100000-0000-4000-a110-000000000004', 'LECHE EQUILIBRIO TETRAPAK UHTLATTI 900ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-equilibrio-tetrapak-uhtlatti-900ml-12005778/p. Marca: LATTI. Nombre del producto: Leche Equilibrio UHT 900 mL - Latti Descripción del producto: La Leche Equilibrio UHT de Latti, en presentación de 900 mL, viene en envase Tetra Pak. Es una leche semidescremada de larga vida, ideal para uso d',
  '🛒', 3300, 'Especializada', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202394/leche-equilibrio-latti-900ml-12005778-01.png.png?v=639179726879300000',
  true, 48
),
(
  'a1220000-0000-4000-a104-000000000050', 'b1100000-0000-4000-a110-000000000004', 'HUEVO TIPO AA 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/huevo-tipo-aa-30-und-12003315/p. Marca: SOL NACIENTE. Nombre del producto: Huevo Tipo AA Sol Naciente 30 Und Descripción del producto: Los Huevos Tipo AA Sol Naciente son perfectos para tus recetas y preparaciones diarias. Son ideales para todo tipo de preparaciones, desde omelets hasta postres, ',
  '🥛', 12990, 'Huevos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204535/huevo-tipo-aa-30-und-12003315-01.png?v=639190869027830000',
  true, 49
),
(
  'a1220000-0000-4000-a104-000000000051', 'b1100000-0000-4000-a110-000000000004', 'QUESITO FRESCO LATTI 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/quesito-fresco-latti-400g-12000054/p. Marca: LATTI. Quesito Fresco Latti 400 Grs Encuéntralo en Tiendas D1. Compra Ya',
  '🛒', 8250, 'Queso en bloque', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204137/quesito-fresco-latti-400-grs-01.png?v=639189475053130000',
  true, 50
),
(
  'a1220000-0000-4000-a104-000000000052', 'b1100000-0000-4000-a110-000000000004', 'BEBIDA DE YOGURT MORA LATTI 1000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bebida-yogurt-mora-latti-12000152/p. Marca: LATTI. Nombre del producto: Bebida de Yogurt Mora Latti 1000 ML - Latti Descripción del producto: Disfruta de la Bebida de Yogurt Mora Latti, una deliciosa bebida láctea con dulce y sabor artificial a mora. Es ideal para compartir en familia o disfrutar',
  '🛒', 4250, 'Yogures', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204055/bebida-de-yogurt-mora-latti-1000-ml-01.png?v=639189393705800000',
  true, 51
),
(
  'a1220000-0000-4000-a104-000000000053', 'b1100000-0000-4000-a110-000000000004', 'FOURPACK YOX MULTISABOR DE ALPINA 400 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/fourpack-yox-multisabor-de-alpina-400g-12000549/p. Marca: YOX. Nombre del Producto: Fourpack Yox Multisabor Alpina 400 g Descripción del producto: Fourpack Yox Multisabor de Alpina es un alimento lácteo fermentado con cultivos probióticos, ideal para quienes buscan opciones funcionales para su sa',
  '🛒', 10650, 'Yogures', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199822/yox-surtido-fresa-y-melocoton-alpina-400gr-4-und-12000549-01.png.png?v=639179647763700000',
  true, 52
),
(
  'a1220000-0000-4000-a104-000000000054', 'b1100000-0000-4000-a110-000000000004', 'QUESO CAMPESINO BLOQUE LATTI X350G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-campesino-bloque-latti-x350g-12006219/p. Marca: LATTI. Nombre del producto: Queso Campesino Bloque Latti 350 g Descripción del producto: El Queso Campesino Bloque Latti es un queso fresco, semigraso y semiblando, ideal para acompañar tus preparaciones o disfrutar directamente. Característic',
  '🛒', 8990, 'Queso en bloque', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202711/queso-en-bloque-campesino-latti-350gr-12006219-01.png.png?v=639179735702500000',
  true, 53
),
(
  'a1220000-0000-4000-a104-000000000055', 'b1100000-0000-4000-a110-000000000004', 'SIXPACK CHEESE STICK VITA LATTI 180GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/sixpack-cheese-stick-vita-latti-180gr-12003446/p. Marca: VITA LATTI. Nombre del producto: Sixpack Cheese Stick Vita Latti 180g Descripción del producto: El Sixpack Cheese Stick Vita Latti es un delicioso queso fresco de pasta hilada, semigraso y semiblando, variedad paliqueso, este producto es id',
  '🛒', 7990, 'Queso en bloque', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201206/cheese-stick-vita-latti-6und-12003446-01.png.png?v=639179677802900000',
  true, 54
),
(
  'a1220000-0000-4000-a104-000000000056', 'b1100000-0000-4000-a110-000000000004', 'QUESO MOZZARELLA TAJADO X 250G LATTI Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-mozzarella-tajado-latti-12006207/p. Marca: LATTI. Nombre del producto: Queso Mozzarella Tajado x 250g Latti Descripción del producto: Disfruta del Queso Mozzarella Tajado Latti en su presentación de 250 gramos, ideal para tus comidas y preparaciones favoritas. Este queso fresco, semigraso y',
  '🛒', 9100, 'Queso tajado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202694/queso-mozzarella-latti-250gr-12006207-01.png.png?v=639179735310130000',
  true, 55
),
(
  'a1220000-0000-4000-a104-000000000057', 'b1100000-0000-4000-a110-000000000004', 'QUESO MOZZARELLA BLOQUE LATTI 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-mozzarella-bloque-latti-400g-12000164/p. Marca: LATTI. Nombre del producto: Queso Mozzarella Bloque Latti 400 g Descripción del producto: El Queso Mozzarella Bloque Latti es un queso fresco, semigraso y semiduro, ideal para ser consumido tal cual o utilizado en preparaciones. Característica',
  '🛒', 10500, 'Queso en bloque', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199048/queso-mozzarella-bloque-latti-400gr-12000164-01.png.png?v=639179632275200000',
  true, 56
),
(
  'a1220000-0000-4000-a104-000000000058', 'b1100000-0000-4000-a110-000000000004', 'LECHE EN POLVO ENTERA LATTI 350 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-en-polvo-entera-latti-12003513/p. Marca: LATTI. Nombre del producto: Leche en Polvo Entera Latti 350 g Descripción del producto: La Leche en Polvo Entera Latti es una excelente opción para aquellos que buscan una leche de alta calidad en polvo. Perfecta para múltiples aplicaciones en la coc',
  '🛒', 8400, 'Polvo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201273/leche-en-polvo-entera-latti-1000gr-12003513-01.png.png?v=639179679286300000',
  true, 57
),
(
  'a1220000-0000-4000-a104-000000000059', 'b1100000-0000-4000-a110-000000000004', 'QUESO BRIE CREAMY 125 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-brie-creamy-125g-12004326/p. Marca: GHALIA. Nombre del producto: Queso Madurado Semiduro “Creamy &amp; Mild” 125g Descripción del producto: Disfruta del sabor suave y cremoso del queso madurado semiduro “Creamy &amp; Mild” de GHALIA. Ideal para consumir solo o acompañado. Características de',
  '🛒', 12800, 'Queso delikatessen', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201918/queso-ghalia-brie-125gr--12004326-01.png.png?v=639179698540570000',
  true, 58
),
(
  'a1220000-0000-4000-a104-000000000060', 'b1100000-0000-4000-a110-000000000004', 'LECHE SÚPER CREMOSA LATTI X900ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-super-cremosa-latti-x900ml-12006667/p. Marca: LATTI. Nombre del producto: Leche Súper Cremosa Latti x900 mL Descripción del producto: Disfruta de la Leche Súper Cremosa Latti, una leche premium larga vida de vaca, sin adiciones, saborizantes ni conservantes. Su textura cremosa y alto conten',
  '🛒', 4700, 'Especializada', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203076/leche-entera-25proteina-super-cremosa-latti-900ml-12006667-01.png.png?v=639179831760230000',
  true, 59
),
(
  'a1220000-0000-4000-a104-000000000061', 'b1100000-0000-4000-a110-000000000004', 'LECHE EN POLVO ENTERA LATTI 1000 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-en-polvo-entera-latti-12000270/p. Marca: LATTI. Nombre del producto: Leche en Polvo Entera Latti 1000 g Descripción del producto: La Leche en Polvo Entera Latti es una excelente opción para aquellos que buscan una leche de alta calidad en polvo. Perfecta para múltiples aplicaciones en la co',
  '🛒', 21600, 'Polvo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199284/leche-en-polvo-entera-1000gr-12000270-01.png.png?v=639179637179070000',
  true, 60
),
(
  'a1220000-0000-4000-a104-000000000062', 'b1100000-0000-4000-a110-000000000004', 'LECHE DESLACTO DESCREMA TETRAPAK 900 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/leche-deslacto-descrema-tetrapak-900ml-12001742/p. Marca: LATTI. Nombre del producto: Leche Deslactosada Descremada UHT 900 mL - Latti Descripción del producto: La Leche Deslactosada Descremada UHT de Latti se presenta en un envase Tetra Pak de 900 mL, ideal para el consumo cotidiano y perfecta p',
  '🥛', 3950, 'Deslactosada', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200336/leche-descremada-0-grasa-latti-900ml-12001742-01.png.png?v=639179658428100000',
  true, 61
),
(
  'a1220000-0000-4000-a104-000000000063', 'b1100000-0000-4000-a110-000000000004', 'SUERO COSTEÑO 200GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/suero-costeno-200gr-12004973/p. Marca: LATTI. Nombre del producto: Suero Costeño 200g Descripción del producto: Disfruta de la tradicional crema para untar tipo suero costeño, ideal como acompañante de pasabocas o para enriquecer tus preparaciones como pastas y salsas. Características del Product',
  '🛒', 4350, 'Otros derivados', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202095/suero-costeno-latti-200gr-12004973-01.png.png?v=639179702351170000',
  true, 62
),
(
  'a1220000-0000-4000-a104-000000000064', 'b1100000-0000-4000-a110-000000000004', 'QUESO HOLANDES GHALIA 150 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/queso-holandes-ghalia-150g-12005247/p. Marca: GHALIA. Nombre del producto: Queso Holandés Ghalia 150 g Descripción del producto: El Queso Holandés Ghalia es un queso maduro, semiduro y graso, tipo Gouda. Es ideal para picadas, tablas de queso, pastas, sándwiches y pizzas. Características del Prod',
  '🛒', 9450, 'Queso delikatessen', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202219/queso-holandes-ghalia-150gr-12005247-01.png.png?v=639179704596000000',
  true, 63
),
(
  'a1220000-0000-4000-a104-000000000065', 'b1100000-0000-4000-a110-000000000004', 'JUGO NARANJA FRESCO TREE FRUTS 1 LT Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jugo-naranja-fresco-tree-fruts-1-lt-12000380/p. Marca: TREE FRUTS. Nombre del Producto: Jugo Naranja Fresco Tree Fruits 1 LT Descripción del producto: Jugo Naranja Fresco Tree Fruits es un jugo natural con tratamiento térmico, listo para el consumo. Envasado en presentación de 1 litro, es ideal p',
  '🛒', 6600, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199552/jugo-de-naranja-tree-fruts-1l-12000380-01.png.png?v=639179642093600000',
  true, 64
),
(
  'a1220000-0000-4000-a104-000000000066', 'b1100000-0000-4000-a110-000000000004', 'AGUA SIN GAS OMI 5000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-sin-gas-omi-5000ml-12001022/p. Marca: OMI. Nombre del Producto: Agua Sin Gas OMI 5000 ML Descripción del producto: Agua Sin Gas OMI es un producto listo para el consumo. Su presentación de 5 litros es ideal para el uso diario en hogares, oficinas o eventos. Garantiza frescura y pureza. Consé',
  '🥤', 3750, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200112/agua-omi-5l-12001022-01.png.png?v=639179653681370000',
  true, 65
),
(
  'a1220000-0000-4000-a104-000000000067', 'b1100000-0000-4000-a110-000000000004', 'SODA WHITE CROWN 1.7LTS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/soda-white-crown-1-7l-12004175/p. Marca: WHITE CROWN. Nombre del Producto: Soda White Crown 1.7 LTS Descripción del producto: Soda White Crown es una bebida gaseosa, elaborada a base de agua y gas carbónico. Es ideal para cualquier momento del día. Características del Producto: Tamaño: 37 cm x 8 ',
  '🧹', 2100, 'Gaseosas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201805/soda-izots-1700ml-12004175-01.png.png?v=639179696640600000',
  true, 66
),
(
  'a1220000-0000-4000-a104-000000000068', 'b1100000-0000-4000-a110-000000000004', 'JUGO DE LIMON TAHITI 250 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jugo-de-limon-tahiti-250ml-12002197/p. Marca: TREE FRUTS. Nombre del Producto: Jugo de Limón Tahití 250 ml Descripción del producto: El Jugo de Limón Tahití de 250 ml es un producto natural, ideal para la preparación de bebidas refrescantes, recetas culinarias y cócteles,. Está listo para su cons',
  '🛒', 3350, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200495/zumo-de-limon-tree-fruts-250ml-12002197-01.png.png?v=639179662267470000',
  true, 67
),
(
  'a1220000-0000-4000-a104-000000000069', 'b1100000-0000-4000-a110-000000000004', 'AROMÁTICA 20 BOLSAS KANPUR 15 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/aromatica-kanpur-20-bolsas-15g-12000302/p. Marca: KANPUR. Nombre del Producto: Aromáticas Hierbabuena/Manzanilla Descripción del producto: Disfruta de la frescura y el sabor natural de nuestras aromáticas de Hierbabuena y Manzanilla. Cada paquete contiene 20 bolsas de 15 gramos cada una. Caracter',
  '🛒', 1990, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199377/aromatica-bolsas-kanpur-15gr-20-bolsas-12000302-00.png.png?v=639179638831070000',
  true, 68
),
(
  'a1220000-0000-4000-a104-000000000070', 'b1100000-0000-4000-a110-000000000004', 'TÉ HELADO LIMÓN EISTEE 200 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/te-helado-limon-eistee-200g-12005172/p. Marca: EISTEE. Nombre del Producto: Té Helado Limón EISTEE 200 g Descripción del producto: El Té Helado Limón EISTEE es una mezcla en polvo para preparar una deliciosa bebida con sabor artificial a limón. Es perfecto para refrescarte en días calurosos. Cara',
  '🛒', 3990, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202182/te-helado-limon-eistee-202gr-12005172-01.png.png?v=639179703905570000',
  true, 69
),
(
  'a1220000-0000-4000-a104-000000000071', 'b1100000-0000-4000-a110-000000000004', 'AGUA OMI LIMON 1700 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-omi-limon-12001918/p. Marca: OMI. Nombre del Producto: Agua OMI Limón 1700 ML Descripción del producto: Agua OMI sabor lima limón con gas es una bebida refrescante lista para el consumo. Su presentación de 1.7 litros es ideal para compartir y disfrutar en cualquier momento. Producto tratado ',
  '🥤', 2750, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200368/agua-con-gas-limon-omi-1700ml-12001918-01.png.png?v=639179659338930000',
  true, 70
),
(
  'a1220000-0000-4000-a104-000000000072', 'b1100000-0000-4000-a110-000000000004', 'BEBIDA NUTRI FIT MILO DOYPACK 300GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bebida-nutri-fit-milo-doypack-300g-12001822/p. Marca: MILO. Nombre del Producto: Bebida Nutri Fit Milo Doypack 300g Descripción del producto: Bebida achocolatada en polvo con menos azúcar añadida. Nutri Fit Milo con ACTIV-GO es un complemento nutricional ideal para desayunos y meriendas. Caracter',
  '🛒', 14800, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200356/milo-nestle-300gr-12001822-01.png.png?v=639179658855170000',
  true, 71
),
(
  'a1220000-0000-4000-a104-000000000073', 'b1100000-0000-4000-a110-000000000004', 'COCA COLA SIN AZÚCAR 1750 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/gaseosa-coca-cola-sin-azucar-12002693/p. Marca: COCA COLA. Nombre del Producto: Coca-Cola Sin Azúcar 1750 ML Descripción del producto: Coca-Cola Sin Azúcar es una refrescante bebida gaseosa, este producto viene en un envase de plástico que garantiza su frescura, es perfecta para disfrutar fría en',
  '🧹', 6490, 'Gaseosas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200771/gaseosa-zero-coca-cola-1750ml-12002693-01.png.png?v=639179668663500000',
  true, 72
),
(
  'a1220000-0000-4000-a104-000000000074', 'b1100000-0000-4000-a110-000000000004', 'AGUA SIN GAS CRISTAL 300 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-sin-gas-cristal-300ml-12007109/p. Marca: CRISTAL. Agua Sin Gas Cristal 300 Ml Encuéntralo en Tiendas D1. Compra Ya',
  '🥤', 550, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204182/agua-sin-gas-cristal-300ml-12007109-01.png?v=639189506737970000',
  true, 73
),
(
  'a1220000-0000-4000-a104-000000000075', 'b1100000-0000-4000-a110-000000000004', 'INFUSIÓN FRUTAL F ROJOS KANPUR 10U 10G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/infusion-frutal-frutos-rojos-kanpur-10-und-12000623/p. Marca: KANPUR. Nombre del Producto: Infusión Frutal Frutos Rojos Kanpur 10U 10g Descripción del producto: La Infusión Frutal Frutos Rojos Kanpur es una mezcla natural de mora, fresa y flor de Jamaica, ideal para preparar bebidas calientes o f',
  '🛒', 4750, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199866/infusion-frutos-rojos-kanpur-10gr-12000623-01.png.png?v=639179648434330000',
  true, 74
),
(
  'a1220000-0000-4000-a104-000000000076', 'b1100000-0000-4000-a110-000000000004', 'GASEOSA COCA COLA SIN AZUCAR PET 250ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/gaseosa-coca-cola-sin-azucar-12004549/p. Marca: COCA COLA. Nombre del Producto: Gaseosa Coca-Cola Sin Azúcar PET 250 ml Descripción del producto: Gaseosa Coca-Cola Sin Azúcar en presentación de 250 ml. Esta bebida es ideal para refrescarse sin azúcar. Consumir fría para una mejor experiencia. Car',
  '🧹', 1350, 'Gaseosas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202000/gaseosa-zero-coca-cola-250ml-12004549-01.png.png?v=639179700798670000',
  true, 75
),
(
  'a1220000-0000-4000-a104-000000000077', 'b1100000-0000-4000-a110-000000000004', 'AGUA OMI MANZANA 1700 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-omi-manzana-12006243/p. Marca: OMI. Nombre del Producto: Agua OMI Manzana 600 ML Descripción del producto: Agua OMI sabor manzana con gas es una bebida refrescante lista para el consumo. Su presentación de 1700mL es ideal para disfrutar en cualquier momento. Producto tratado con procesos tec',
  '🥤', 2750, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203198/agua-con-gas-manzana-omi-1700ml-12006243-01.png?v=639179847182770000',
  true, 76
),
(
  'a1220000-0000-4000-a104-000000000078', 'b1100000-0000-4000-a110-000000000004', 'REFRESCOS 6 UN SABORES FRUTA SURT 200 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/refrescos-6-un-sabores-fruta-surt-200ml-12000297/p. Marca: TREE FRUTS. Nombre del Producto: Refrescos 6 Un Sabores Fruta Surtido 200 mL Descripción del producto: Disfruta de una práctica y refrescante presentación de jugos pasteurizados en sabores surtidos de fruta como mango, mora y tropical. Es',
  '🛒', 5490, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199360/refrescos-sabor-frutas-tree-fruts-6und-12000297-01.png.png?v=639179638409970000',
  true, 77
),
(
  'a1220000-0000-4000-a104-000000000079', 'b1100000-0000-4000-a110-000000000004', 'AGUA SIN GAS OMI 1000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-sin-gas-omi-1000ml-12000403/p. Marca: OMI. Nombre del Producto: Agua Sin Gas OMI 1000 ML Descripción del producto: Agua OMI sin gas es un producto listo para el consumo, ideal para mantenerse hidratado en cualquier momento. Su presentación de 1000 mL es práctica y conveniente. Se recomienda ',
  '🥤', 990, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199609/agua-potable-tratada-omi-1000ml-12000403-01.png.png?v=639179643349170000',
  true, 78
),
(
  'a1220000-0000-4000-a104-000000000080', 'b1100000-0000-4000-a110-000000000004', 'AGUA CON GAS OMI 600 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-con-gas-omi-600ml-12000489/p. Marca: OMI. AGUA CON GAS OMI 600 ML',
  '🥤', 990, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199744/agua-con-gas-omi-600ml-12000489-01.png.png?v=639179646100530000',
  true, 79
),
(
  'a1220000-0000-4000-a104-000000000081', 'b1100000-0000-4000-a110-000000000004', 'JUGO DE MANDARINA TREE FRUTS 1 LT Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jugo-de-mandarina-tree-fruts-1-lt-12000444/p. Marca: TREE FRUTS. Nombre del Producto: Jugo de Mandarina Tree Fruits 1 L Descripción del producto: El Jugo de Mandarina Tree Fruits de 1 litro es un producto fruta natural, ideal para preparar bebidas refrescantes, recetas y cócteles. Características',
  '🛒', 8250, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199691/jugo-de-mandarina-tree-fruts-1l-12000444-01.png.png?v=639179644968730000',
  true, 80
),
(
  'a1220000-0000-4000-a104-000000000082', 'b1100000-0000-4000-a110-000000000004', 'AGUA CON GAS MARACUYÁ OMI 1700 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-con-gas-maracuya-omi-1700ml-12003265/p. Marca: OMI. Nombre del Producto: Agua con Gas Maracuyá OMI 1700 ML Descripción del producto: Agua OMI sabor maracuyá con gas es una bebida refrescante lista para el consumo. Su presentación de 1.7 litros es ideal para compartir y disfrutar en cualquier',
  '🥤', 2750, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201082/agua-con-gas-maracuya-omi-1700ml-12003265-01.png.png?v=639179674579500000',
  true, 81
),
(
  'a1220000-0000-4000-a104-000000000083', 'b1100000-0000-4000-a110-000000000004', 'TE HATSU SURTIDO 200 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/te-hatsu-surtido-200ml-12006510/p. Marca: HATSU. Nombre del Producto: Té Hatsu Surtido 200 ML Descripción del producto: El Té Hatsu Surtido es una bebida refrescante ideal para consumir fría y disfrutar de su alta calidad y variedad de sabores. Características del Producto: Tamaño: 15 cm x 12 cm ',
  '🛒', 5050, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202976/te-hatsu-surtido-200ml-6und-12006510-01.png.png?v=639179829877900000',
  true, 82
),
(
  'a1220000-0000-4000-a104-000000000084', 'b1100000-0000-4000-a110-000000000004', 'PONY MALTA GO PET 200ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pony-malta-go-pet-200ml-12006967/p. Marca: PONY MALTA. Pony Malta Go Pet 200Ml Encuéntralo en Tiendas D1. Compra Ya',
  '🛒', 1400, 'Isotónica y energizantes', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203518/pony-malta-go-200ml-12006967-01.png.png?v=639179861227130000',
  true, 83
),
(
  'a1220000-0000-4000-a104-000000000085', 'b1100000-0000-4000-a110-000000000004', 'NECTARES SABORES SURTIDOS SIXPACK 200 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/nectares-sabores-surtidos-sixpack-200ml-12000729/p. Marca: TREE FRUTS. Nombre del Producto: Néctares Sabores Surtidos Sixpack 200 ML Descripción del producto: Néctares Sabores Surtidos es un delicioso combo de bebidas de fruta en presentación individual de 200 ml cada una. Con sabores variados co',
  '🛒', 6050, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199925/jugo-nectar-surtido-tree-fruts-200ml-6und-12000729-01.png.png?v=639179649705000000',
  true, 84
),
(
  'a1220000-0000-4000-a104-000000000086', 'b1100000-0000-4000-a110-000000000004', 'AROMÁTICA DECISIÓN NATURAL JAIBEL 20B Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/aromatica-natural-jaibel-20-bolsas-12003459/p. Marca: JAIBEL. Nombre del Producto: Aromática Decisión Natural Jaibel 20B Descripción del producto: La Aromática Decisión Natural Jaibel es una infusión de hierbas cuidadosamente seleccionadas para brindar una experiencia natural y reconfortante. Car',
  '🛒', 7600, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201231/aromatica-decision-natural-surtido-jaibel-20und-12003459-00.png.png?v=639179678377230000',
  true, 85
),
(
  'a1220000-0000-4000-a104-000000000087', 'b1100000-0000-4000-a110-000000000004', 'JUGO DEL VALLE FRUTAS CITRICAS 1500ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jugo-del-valle-frutas-citricas-1500ml-12004550/p. Marca: DEL VALLE. Nombre del Producto: Jugo Del Valle Frutas Cítricas 1500 ML Descripción del producto: Jugo Del Valle Frutas Cítricas es una bebida refrescante. Con un contenido neto de 1500 ml, viene en una botella plástica ideal para compartir.',
  '🛒', 3800, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202004/jugo-frutas-citricas-del-valle-1500ml-12004550-01.png.png?v=639179700815070000',
  true, 86
),
(
  'a1220000-0000-4000-a104-000000000088', 'b1100000-0000-4000-a110-000000000004', 'PONY MALTA GO PET 2 L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pony-malta-go-pet-2l-12006703/p. Marca: PONY MALTA. Nombre del Producto: Pony Malta GO PET 2L Descripción del producto: Pony Malta GO es una bebida refrescante ideal para disfrutar en cualquier momento del día. Su sabor característico y presentación familiar la hacen perfecta para compartir. Cons',
  '🛒', 6400, 'Isotónica y energizantes', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203343/malta-go-pony-2000ml-12006703-01.png.png?v=639179858789000000',
  true, 87
),
(
  'a1220000-0000-4000-a104-000000000089', 'b1100000-0000-4000-a110-000000000004', 'COMBO GASEOSA COCA COLA X2 UND 2.5L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/combo-gaseosa-coca-cola-2-und-25l-12005528/p. Marca: COCA COLA. Nombre del Producto: Combo Gaseosa Coca Cola X2 Und 2.5L Descripción del producto: Combo de dos botellas de Coca-Cola de 2.5L cada una. Una bebida gaseosa refrescante ideal para consumo frío. Características del Producto: Tamaño: 22 ',
  '🧹', 14950, 'Gaseosas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202320/gaseosa-sabor-original-coca-cola-2.5l-2und-12005528-01.png.png?v=639179706510900000',
  true, 88
),
(
  'a1220000-0000-4000-a104-000000000090', 'b1100000-0000-4000-a110-000000000004', 'AGUA OMI LIMON 600 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/agua-omi-limon-12001118/p. Marca: OMI. Nombre del Producto: Agua OMI Limón 600 ML Descripción del producto: Agua OMI sabor lima limón con gas es una bebida refrescante lista para el consumo. Su presentación de 1.7 litros es ideal para compartir y disfrutar en cualquier momento. Producto tratado c',
  '🥤', 1250, 'Aguas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200148/bebida-carbonizada-sabor-lima-limon-omi-600ml-12001118-01.png.png?v=639179654374930000',
  true, 89
),
(
  'a1220000-0000-4000-a104-000000000091', 'b1100000-0000-4000-a110-000000000004', 'GASEOSA COCA COLA 1750 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/gaseosa-coca-cola-12002106/p. Marca: COCA COLA. Nombre del Producto: Gaseosa Coca-Cola 1750 Ml Descripción del producto: Gaseosa Coca-Cola en presentación de 1750 ml. Esta bebida gaseosa está elaborada con agua carbonatada, azúcar, colorante caramelo, ácido fosfórico, y aromas naturales, incluyen',
  '🧹', 6490, 'Gaseosas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200479/gaseosa-coca-cola-1750ml-12002106-01.png.png?v=639179661999670000',
  true, 90
),
(
  'a1220000-0000-4000-a104-000000000092', 'b1100000-0000-4000-a110-000000000004', 'GASEOSA SCHWEPPES GINGER ALE PET 1500ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/gaseosa-schweppes-ginger-ale-1500ml-12004749/p. Marca: SCHWEPPES. Nombre del Producto: Gaseosa Schweppes Ginger Ale PET 1500 ml Descripción del producto: Schweppes Ginger Ale es una bebida gaseosa con sabor a jengibre, perfecta para refrescarte en cualquier momento. Su presentación de 1500 ml en ',
  '🧹', 4750, 'Gaseosas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202067/gaseosa-ginger-ale-schweppes-1500ml-12004749-01.png.png?v=639179701817030000',
  true, 91
),
(
  'a1220000-0000-4000-a104-000000000093', 'b1100000-0000-4000-a110-000000000004', 'INFUSIÓN JENGIBRE LIMÓN HINDÚ 15 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/infusion-jengibre-limon-hindu-15g-12005230/p. Marca: HINDÚ. Nombre del Producto: Infusión Jengibre Limón Hindú 15 g Descripción del producto: La Infusión Jengibre Limón Hindú es una bebida natural elaborada con jengibre y limón, reconocida por sus beneficios antioxidantes y digestivos. Presentada',
  '🛒', 4550, 'Infusiones, té', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202215/infusion-jengibre-limon-hindu-15gr-12005230-01.png.png?v=639179704450830000',
  true, 92
),
(
  'a1220000-0000-4000-a104-000000000094', 'b1100000-0000-4000-a110-000000000004', 'PULPA CONGELADA TREE FRUTS 3UND 480 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pulpa-congelada-tree-fruts-3und-480g-12001656/p. Marca: TREE FRUTS. Nombre del producto: Pulpa Congelada Tree Fruts 480g Descripción del producto: Disfruta de la frescura y el sabor natural de nuestra Pulpa de Fruta Congelada TREE FRUTS. Perfecta para preparar jugos, batidos y postres, esta pulpa',
  '🛒', 6350, 'Jugos refrescos y néctares', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200293/pulpa-de-fruta-congelada-tree-fruts-480gr-3und-12001656-01.png.png?v=639179657572600000',
  true, 93
),
(
  'a1220000-0000-4000-a104-000000000095', 'b1100000-0000-4000-a110-000000000004', 'BEBIDA ALMEND SIN AZUCAR ALMONDEE 1000ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bebida-almendra-sin-azucar-almondee-1000ml-12004193/p. Marca: ALMONDEE. Nombre del Producto: Bebida de Almendra Sin Azúcar ALMONDEE 1000 mL Descripción del producto: La Bebida de Almendra Sin Azúcar ALMONDEE es una bebida vegetal UHT de larga vida, sin endulzantes añadidos, ideal para personas qu',
  '🥤', 8250, 'Bebidas vegetales', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201816/bebida-de-almendras-sin-endulzar-almondee-1000ml-12004193-01.png.png?v=639179696749600000',
  true, 94
),
(
  'a1220000-0000-4000-a104-000000000096', 'b1100000-0000-4000-a110-000000000004', 'BEBIDA ALMENDRA ORIGINAL ALMONDEE 1000ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bebida-almendra-almondee-1000ml-12004192/p. Marca: ALMONDEE. Nombre del Producto: Bebida de Almendra Original ALMONDEE 1000 mL Descripción del producto: La Bebida de Almendra Original ALMONDEE es una bebida vegetal UHT, elaborada en Colombia, ideal para quienes buscan una alternativa libre de lác',
  '🥤', 8250, 'Bebidas vegetales', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201812/bebida-de-almendras-original-almondee-1000ml-12004192-01.png.png?v=639179696694400000',
  true, 95
),
(
  'a1220000-0000-4000-a104-000000000097', 'b1100000-0000-4000-a110-000000000004', 'FILETES DE PECHUGA BRASSET 600 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/filetes-pechuga-brasset-600g-12002595/p. Marca: BRASSET. Nombre del producto: Filetes de Pechuga Brasset 600 g Descripción del producto: Filetes de pechuga de pollo marinados mediante inyección con solución salina, para mejorar su textura y jugosidad. Producto crudo de 600 gramos, ideal para dife',
  '🥩', 16800, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200735/filetes-de-pechuga-brasset-600gr-12002595-01.png.png?v=639179667481570000',
  true, 96
),
(
  'a1220000-0000-4000-a104-000000000098', 'b1100000-0000-4000-a110-000000000004', 'NUGGETS DE POLLO PREMIUM BRASSET 300 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/nuggets-pollo-premium-brasset-300g-12002529/p. Marca: BRASSET. Nombre del producto: Nuggets de Pollo Premium 300g - Brasset Descripción del producto: Disfruta de los deliciosos Nuggets de Pollo Premium Brasset, ideales para una comida rápida y sabrosa. Elaborados con ingredientes seleccionados y ',
  '🥩', 7850, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200692/nuggets-de-pollo-apanados-premium-brasset-300gr-12002529-01.png.png?v=639179666509300000',
  true, 97
),
(
  'a1220000-0000-4000-a104-000000000099', 'b1100000-0000-4000-a110-000000000004', 'PECHUGAS DE POLLO BRASSET 1200 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pechugas-pollo-brasset-1200g-12005094/p. Marca: BRASSET. PECHUGAS DE POLLO BRASSET 1200 G',
  '🥩', 17400, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204197/pechugas-de-pollo-brasset-1200-g-01.png?v=639189513446900000',
  true, 98
),
(
  'a1220000-0000-4000-a104-000000000100', 'b1100000-0000-4000-a110-000000000004', 'FILETES DE TILAPIA CAPTAIN BAY X 400 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/filetes-tilapia-captain-bay-400g-12001958/p. Marca: CAPTAIN BAY. Nombre del producto: Filete de Tilapia 400g - Captain Bay Descripción del producto: Disfruta del sabor tradicional del Filete de Tilapia Captain Bay, una excelente opción para tus comidas diarias. Este producto de 400 gramos netos e',
  '🥩', 13950, 'Pescado y mariscos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200404/filete-de-tilapia-captain-bay-400gr-12001958-01.png.png?v=639179660158400000',
  true, 99
),
(
  'a1220000-0000-4000-a104-000000000101', 'b1100000-0000-4000-a110-000000000004', 'FILETES DE SALMÓN CAPTAIN BAY X 350 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/filetes-salmon-captain-bay-350g-12001957/p. Marca: CAPTAIN BAY. Nombre del producto: Filete de Salmón 350g - Captain Bay Descripción del producto: Disfruta del auténtico sabor del mar con el Filete de Salmón Captain Bay. Este producto congelado, de 350 gramos, es ideal para preparar platos delici',
  '🥩', 21950, 'Pescado y mariscos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200400/filete-de-salmon-captain-bay-350gr-12001957-01.png.png?v=639179660029500000',
  true, 100
),
(
  'a1220000-0000-4000-a104-000000000102', 'b1100000-0000-4000-a110-000000000004', 'MUSLOS DE POLLO IMPORTADOS BRASSET 800 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/muslos-pollo-brasset-800g-12001273/p. Marca: BRASSET. Nombre del producto: Muslos de Pollo Importados 800g - Brasset Descripción del producto: Los Muslos de Pollo Importados Brasset son una excelente fuente de proteína para tus comidas. Provenientes de Estados Unidos y empacados en una presentaci',
  '🥩', 9990, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200224/muslos-de-pollo-brasset-800gr-12001273-01.png.png?v=639179656143500000',
  true, 101
),
(
  'a1220000-0000-4000-a104-000000000103', 'b1100000-0000-4000-a110-000000000004', 'PINCHOS DE POLLO APANADO BRASSET 200 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pinchos-pollo-apanado-brasset-200g-12002327/p. Marca: BRASSET. Nombre del producto: Pinchos de Pollo Apanado 200 g - Brasset Descripción del producto: Disfruta de los sabrosos Pinchos de Pollo Apanado Brasset, ideales para una comida rápida y deliciosa. Este producto está elaborado con carne de p',
  '🥩', 6600, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200561/pinchos-de-pollo-apanado-brasset-200gr-4-und-12002327-01.png.png?v=639179663647700000',
  true, 102
),
(
  'a1220000-0000-4000-a104-000000000104', 'b1100000-0000-4000-a110-000000000004', 'PECHUGAS DE POLLO BRASSET 1100 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pechugas-pollo-brasset-1100g-12001287/p. Marca: BRASSET. Nombre del producto: Pechugas de Pollo Marinadas 1100 g - Brasset Descripción del producto: Disfruta de las Pechugas de Pollo Marinadas Brasset, ideales para diversas preparaciones culinarias. Este producto está elaborado con ingredientes d',
  '🥩', 15950, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200240/pechugas-de-pollo-marinadas-brasset-1100gr-12001287-01.png.png?v=639179656498800000',
  true, 103
),
(
  'a1220000-0000-4000-a104-000000000105', 'b1100000-0000-4000-a110-000000000004', 'LOMO DE CERDO RED CUT X 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/lomo-cerdo-red-cut-500g-12001637/p. Marca: RED CUT. Nombre del producto: Lomo de Cerdo Red Cut 500g Descripción del producto: Disfruta del Lomo de Cerdo Red Cut, un corte crudo y congelado de alta calidad, ideal para tus preparaciones favoritas. Empacado en una presentación de 500 gramos, este pr',
  '🥩', 13450, 'Carne de cerdo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200281/lomo-de-cerdo-red-cut-500gr-12001637-01.png.png?v=639179657312630000',
  true, 104
),
(
  'a1220000-0000-4000-a104-000000000106', 'b1100000-0000-4000-a110-000000000004', 'CHICHARRÓN 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chicharron-fazenda-500g-12005983/p. Marca: FAZENDA. Nombre del producto: Chicharrón 500 g Descripción del producto: Disfruta del delicioso Chicharrón 500 g, ideal para preparar platos tradicionales con todo el sabor característico de la carne de cerdo. Perfecto para freír, hornear o asar, y compa',
  '🥩', 7950, 'Carne de cerdo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202564/carne-de-cerdo-chicharron-500gr-12005983-01.png.png?v=639179730121600000',
  true, 105
),
(
  'a1220000-0000-4000-a104-000000000107', 'b1100000-0000-4000-a110-000000000004', 'TROZOS DE PECHUGA IMPORTADOS BRASSET 500 Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/trozos-pechuga-pollo-brasset-500g-12001277/p. Marca: BRASSET. Nombre del producto: Trozos de Pechuga Importados Brasset 500g Descripción del producto: Disfruta de la calidad y frescura de los Trozos de Pechuga Importados Brasset. Este producto es ideal para preparar una variedad de platillos, man',
  '🥩', 9490, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204191/trozos-de-pechuga-brasset-newchiken-500g-01.png?v=639189509832870000',
  true, 106
),
(
  'a1220000-0000-4000-a104-000000000108', 'b1100000-0000-4000-a110-000000000004', 'CARNE MOLIDA DE CERDO 500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/carne-molida-cerdo-fazenda-500g-12006291/p. Marca: FAZENDA. Nombre del producto: Carne Molida de Cerdo 500 g Descripción del producto: La Carne Molida de Cerdo 500 g, ideal para preparar recetas como albóndigas, salsas, rellenos y mucho más. Características del Producto: Tamaño: 15 cm x 13 cm Can',
  '🥩', 11450, 'Carne de cerdo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202783/carne-molida-de-cerdo-la-fazenda-500gr-12006291-01.png.png?v=639179827514700000',
  true, 107
),
(
  'a1220000-0000-4000-a104-000000000109', 'b1100000-0000-4000-a110-000000000004', 'COSTILLA CARNUDA DE RES RED CUT 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/costilla-carnuda-res-red-cut-500g-12006572/p. Marca: RED CUT. Nombre del producto: Costilla Carnuda de Res Red Cut 500 g Descripción del producto: La Costilla Carnuda de Res Red Cut 500 g es un corte seleccionado ideal para asar, hornear o preparar a la parrilla, perfecta para disfrutar en tus co',
  '🥩', 10850, 'Carne de res', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203024/costilla-carnuda-de-res-red-cut-500gr-12006572-01.png.png?v=639179830914100000',
  true, 108
),
(
  'a1220000-0000-4000-a104-000000000110', 'b1100000-0000-4000-a110-000000000004', 'ENTREMUSLOS SIN RABADILLA BRASSET 700 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/entremuslos-sin-rabadilla-brasset-700g-12001283/p. Marca: BRASSET. Nombre del Producto: Entremuslos de Pollo Marinados Descripción del producto: Ideal para diversas preparaciones culinarias, estos entremuslos están marinados con agua y tripolifosfato de sodio, lo que ayuda a retener la humedad, m',
  '🥩', 7990, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200236/entremuslos-de-pollo-marinados-brasset-700gr-12001283-01.png.png?v=639179656375570000',
  true, 109
),
(
  'a1220000-0000-4000-a104-000000000111', 'b1100000-0000-4000-a110-000000000004', 'MILANESA DE CERDO RED CUT 500 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/milanesa-cerdo-red-cut-500g-12001633/p. Marca: RED CUT. Nombre del producto: Milanesa de Cerdo Red Cut 500g Descripción del producto: Disfruta de la Milanesa de Cerdo Red Cut, un corte crudo y congelado, elaborado a partir de brazo y pernil de cerdo. Ideal para preparar asada o frita, esta presen',
  '🥩', 12450, 'Carne de cerdo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200277/milanesa-de-cerdo-red-cut-500gr-12001633-01.png.png?v=639179657230370000',
  true, 110
),
(
  'a1220000-0000-4000-a104-000000000112', 'b1100000-0000-4000-a110-000000000004', 'MILANESA DE POLLO APANADA 320 G BRASSET Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/milanesa-pollo-apanada-brasset-320g-12006081/p. Marca: BRASSET. Nombre del producto: Milanesa de Pollo Apanada 320g - Brasset Descripción del producto: Disfruta de la Milanesa de Pollo Apanada Brasset, una opción práctica y deliciosa para tus comidas. Elaborada con una mezcla de carne de pollo, e',
  '🥩', 8490, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202630/milanesa-de-pollo-apanada-brasset-320gr-12006081-01.png.png?v=639179734371470000',
  true, 111
),
(
  'a1220000-0000-4000-a104-000000000113', 'b1100000-0000-4000-a110-000000000004', 'MOLIDA DE RES 85/15 RED CUT 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/molida-res-85-15-red-cut-500g-12006573/p. Marca: RED CUT. Nombre del producto: Molida de Res 85/15 Red Cut 500 g Descripción del producto: La Molida de Res 85/15 Red Cut 500 g es una excelente opción para preparar hamburguesas, albóndigas o cualquier receta que requiera carne molida de calidad, o',
  '🥩', 14950, 'Carne de res', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203028/carne-de-res-molida-premium-red-cut-500gr-12006573-01.png.png?v=639179831005500000',
  true, 112
),
(
  'a1220000-0000-4000-a104-000000000114', 'b1100000-0000-4000-a110-000000000004', 'CAMARÓN PRECOCIDO CAPTAIN BAY X 400 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/camaron-precocido-captain-bay-400g-12001961/p. Marca: CAPTAIN BAY. Nombre del producto: Camarón Precocido Captain Bay 400g Descripción del producto: Disfruta del Camarón Precocido Captain Bay, una excelente opción para preparar ceviches, arroces, paellas, cazuelas de mariscos o para decorar plato',
  '🥩', 20950, 'Pescado y mariscos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200408/camaron-precocido-desvenado-captain-bay-400gr-12001961-01.png.png?v=639179660242200000',
  true, 113
),
(
  'a1220000-0000-4000-a104-000000000115', 'b1100000-0000-4000-a110-000000000004', 'CARNE DE RES PARA ASAR RED CUT 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/carne-res-para-asar-red-cut-500g-12006599/p. Marca: RED CUT. Nombre del producto: Carne de Res para Asar Red Cut 500 g Descripción del producto: La Carne de Res para Asar Red Cut 500 g proviene de cortes selectos como la cadera o pierna de res. Es ideal para asar, freír o cocinar, ofreciendo cali',
  '🥩', 18950, 'Carne de res', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203040/carne-para-asar-red-cut-500gr-12006599-01.png.png?v=639179831162600000',
  true, 114
),
(
  'a1220000-0000-4000-a104-000000000116', 'b1100000-0000-4000-a110-000000000004', 'HAMBURGUESA DE RES VIANDE 450 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/hamburguesa-res-viande-450g-12000575/p. Marca: VIANDÉ. Nombre del producto: Hamburguesa de Res Viandé 450 g Descripción del producto: Disfruta de la Hamburguesa de Res Viandé, preasada y lista para preparar en pocos minutos. Ideal para una comida rápida, deliciosa y con auténtico sabor a carne de',
  '🥩', 10400, 'Carne de res', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199842/hamburguesa-precocida-de-res-viande-450gr-12000575-01.png.png?v=639179648094730000',
  true, 115
),
(
  'a1220000-0000-4000-a104-000000000117', 'b1100000-0000-4000-a110-000000000004', 'MENUDENCIAS/VÍSCERAS FINAS BRASSET 500GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/menudencias-visceras-brasset-500g-12001690/p. Marca: BRASSET. Nombre del producto: Menudencias/Vísceras Finas 500g - Brasset Descripción del producto: Disfruta de las Menudencias Finas de Pollo Brasset, una excelente opción para preparar recetas tradicionales y nutritivas. Este producto incluye m',
  '🥩', 3850, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204145/menudencias-visceras-brasset-500gr-01.png?v=639189483416800000',
  true, 116
),
(
  'a1220000-0000-4000-a104-000000000118', 'b1100000-0000-4000-a110-000000000004', 'CARNE MOLIDA DE POLLO 500 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/carne-molida-pollo-friko-500g-12002453/p. Marca: FRIKO. Carne Molida De Pollo 500 Gr Encuéntralo en Tiendas D1. Compra Ya',
  '🥩', 5290, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204147/carne-molida-de-pollo-500-gr-01.png?v=639189486831330000',
  true, 117
),
(
  'a1220000-0000-4000-a104-000000000119', 'b1100000-0000-4000-a110-000000000004', 'FILETE DE ATUN 300G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/filete-atun-comerpes-300g-12007080/p. Marca: COMERPES. Filete De Atun 300G Encuéntralo en Tiendas D1. Compra Ya',
  '🥩', 17950, 'Pescado y mariscos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203558/steak-de-atun-pesqueros-300gr-12007080-01.png.png?v=639179861610970000',
  true, 118
),
(
  'a1220000-0000-4000-a104-000000000120', 'b1100000-0000-4000-a110-000000000004', 'POSTAS DE BASA CAPTAIN BAY X 400 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/postas-basa-captain-bay-400g-12001954/p. Marca: CAPTAIN BAY. Nombre del producto: Postas de Basa Captain Bay 400 g Descripción del producto: Disfruta de las Postas de Basa Captain Bay, un pescado fresco de alta calidad, con piel y espinas, proveniente de cultivo en Vietnam. Presentado en una pres',
  '🥩', 7990, 'Pescado y mariscos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200396/posta-de-basa-captain-bay-400gr-12001954-01.png.png?v=639179659936570000',
  true, 119
),
(
  'a1220000-0000-4000-a104-000000000121', 'b1100000-0000-4000-a110-000000000004', 'ALITAS DE POLLO BRASSET BBQ 900G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alitas-pollo-bbq-brasset-900g-12001704/p. Marca: BRASSET. Nombre del Producto: Alitas de Pollo Brasset BBQ 900 g Descripción del producto: Alitas de pollo marinadas con adobo sabor BBQ, listas para ser cocinadas mediante calor húmedo, seco o en microondas, ideal para preparaciones culinarias. Pre',
  '🥩', 15700, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200317/alitas-bbq-brasset-900gr-12001704-01.png.png?v=639179658026170000',
  true, 120
),
(
  'a1220000-0000-4000-a104-000000000122', 'b1100000-0000-4000-a110-000000000004', 'SURTIDA DE POLLO MARINADA 500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/surtida-pollo-marinada-brasset-500g-12005876/p. Marca: BRASSET. Nombre del Producto: Surtida de Pollo Marinada 500 g Descripción del producto: Surtida de pollo marinada de origen colombiano. Este producto premium está compuesto por piernas, muslos de pollo o entremuslos con rabadilla, agua, sal, ',
  '🥩', 5200, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202491/surtida-de-pollomarinada-brasset-500gr-12005876-01.png.png?v=639179728761570000',
  true, 121
),
(
  'a1220000-0000-4000-a104-000000000123', 'b1100000-0000-4000-a110-000000000004', 'SUDAR DE RES RED CUT 500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/sudado-res-red-cut-500g-12006276/p. Marca: RED CUT. Nombre del producto: Sudar de Res Red Cut 500 g Descripción del producto: El Sudar de Res Red Cut 500 g es un corte seleccionado ideal para preparaciones a fuego lento. Proveniente del brazo, centro o bola de res, ofrece sabor y textura ideales ',
  '🥩', 16100, 'Carne de res', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203240/carne-de-res-sudar-red-cut-500gr-12006276-01.png?v=639179849987000000',
  true, 122
),
(
  'a1220000-0000-4000-a104-000000000124', 'b1100000-0000-4000-a110-000000000004', 'TRUCHA CAPTAIN BAY X 800 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/trucha-captain-bay-800g-12003683/p. Marca: CAPTAIN BAY. Nombre del producto: Trucha Captain Bay x 800 g Descripción del producto: Disfruta de la frescura y sabor natural de la Trucha Arcoiris Captain Bay. Ideal para una dieta saludable y equilibrada, esta trucha es perfecta para preparar diversas',
  '🥩', 23900, 'Pescado y mariscos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201443/trucha-arcoiris-captain-bay-800gr-12003683-01.png.png?v=639179689517300000',
  true, 123
),
(
  'a1220000-0000-4000-a104-000000000125', 'b1100000-0000-4000-a110-000000000004', 'PINCHOS CON TOCINETA BRASSET 540G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pinchos-con-tocineta-brasset-540g-12001705/p. Marca: BRASSET. Nombre del producto: Pinchos de Pollo Marinado con Tocineta 540 g - Brasset Descripción del producto: Disfruta de los deliciosos Pinchos de Pollo Marinado con Tocineta Brasset, ideales para una comida rápida y sabrosa. Este producto es',
  '🥩', 17990, 'Pollo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200372/pinchos-de-pollo-marinados-con-tocineta-brasset-540gr-12001705-01.png.png?v=639179659416300000',
  true, 124
),
(
  'a1220000-0000-4000-a104-000000000126', 'b1100000-0000-4000-a110-000000000004', 'MOLIDA DE RES 95/5 RED CUT 500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/molida-res-95-5-red-cut-500g-12006574/p. Marca: RED CUT. Nombre del producto: Molida de Res 95/5 Red Cut 500g Descripción del producto: Disfruta de la deliciosa Molida de Res 95/5 Red Cut , ideal para preparar una gran variedad de recetas. Es perfecta para asar, freír u hornear, aportando un sabo',
  '🥩', 17050, 'Carne de res', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203032/carne-de-res-molida-premium-red-cut-500gr-12006574-01.png.png?v=639179831035200000',
  true, 125
),
(
  'a1220000-0000-4000-a104-000000000127', 'b1100000-0000-4000-a110-000000000004', 'COSTILLA AHUMADA VIANDE PARRILLA 450 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/costilla-cerdo-ahumada-big-bob-450g-12000442/p. Marca: VIANDÉ. Nombre del producto: Costilla de Cerdo Ahumada Viandé 450 g Descripción del producto: Disfruta de la deliciosa costilla de cerdo ahumada Big Bob, ideal para preparar al horno, asar o freír. Su sabor ahumado natural y jugosidad la conv',
  '🥩', 18400, 'Carne de cerdo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204049/costilla-ahumada-viande-parrila-450g-12000442-01.png?v=639189364369230000',
  true, 126
),
(
  'a1220000-0000-4000-a104-000000000128', 'b1100000-0000-4000-a110-000000000004', 'TOCINO CARNUDO 500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tocino-carnudo-red-cut-500g-12001763/p. Marca: RED CUT. Nombre del Producto: Tocino Carnudo 500 g Descripción del producto: Tocino de cerdo crudo y congelado, ideal para preparaciones culinarias. Presentación de 500 g. Características del Producto: Tamaño: 19 cm x 13 cm Modo fabricación: Industri',
  '🥩', 9990, 'Carne de cerdo', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200340/tocino-carnudo-red-cut-500gr-12001763-01.png.png?v=639179658504800000',
  true, 127
),
(
  'a1220000-0000-4000-a104-000000000129', 'b1100000-0000-4000-a110-000000000004', 'PAN TAJADO BLANCO HORNEADITOS 450 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-tajado-blanco-horneaditos-450g-12000050/p. Marca: HORNEADITOS. Nombre del producto: Pan Tajado Blanco Horneaditos 450 g Descripción del producto: Disfruta del Pan Tajado Blanco Horneaditos, ideal para tus desayunos, meriendas o para preparar sándwiches. Características del Producto: Tamaño: 4',
  '🛒', 2990, 'Blanco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198872/pan-tajado-blanco-horneaditos-450gr-12000050-01.png.png?v=639179628525000000',
  true, 128
),
(
  'a1220000-0000-4000-a104-000000000130', 'b1100000-0000-4000-a110-000000000004', 'GALLETA SALTIN NOEL 5 TACOS 410 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-saltin-noel-5-tacos-410g-12003986/p. Marca: NOEL. Nombre del producto: Galleta Saltín Noel 5 Tacos 410g Descripción del producto: Disfruta de las tradicionales Galletas Saltín Noel, ideales para acompañar tus comidas o consumir como snack. Características del Producto: Tamaño: 42 cm x 10 ',
  '🍞', 6600, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201692/galletas-salin-5-tacos-noel-410gr-12003986-01.png.png?v=639179694558230000',
  true, 129
),
(
  'a1220000-0000-4000-a104-000000000131', 'b1100000-0000-4000-a110-000000000004', 'MINI CROISSANT HORNEADITOS 340 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mini-croissant-horneaditos-340g-12000046/p. Marca: HORNEADITOS. Nombre del producto: Mini Croissant Horneaditos 340g Descripción del producto: Deliciosos mini croissants horneados, ideales para disfrutar en cualquier momento como snack o en el desayuno. Características del Producto: Tamaño: 30 cm',
  '🍞', 3990, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198857/croissant-horneaditos-340gr-12000046-01.png.png?v=639179628157700000',
  true, 130
),
(
  'a1220000-0000-4000-a104-000000000132', 'b1100000-0000-4000-a110-000000000004', 'GALLETA OREO 6 PQ 216G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-oreo-6-pack-216g-12004310/p. Marca: OREO. GALLETA OREO 6 PQ 216 G',
  '🍞', 6800, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201914/galleta-original-oreo-216gr-6-und-12004310-01.png.png?v=639179698399700000',
  true, 131
),
(
  'a1220000-0000-4000-a104-000000000133', 'b1100000-0000-4000-a110-000000000004', 'GALLETA 2 TACOS DUCALES NOEL 241 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-ducales-noel-2-tacos-241g-12000096/p. Marca: NOEL. Nombre del producto: Galleta 2 Tacos Ducales Noel 241g Descripción del producto: Disfruta de las tradicionales Galletas Ducales, perfectas como snack o para acompañar tus comidas. Su sabor y textura las hacen una opción ideal para cualqui',
  '🍞', 5950, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198966/galletas-ducales-241gr-12000096-01.png.png?v=639179630518830000',
  true, 132
),
(
  'a1220000-0000-4000-a104-000000000134', 'b1100000-0000-4000-a110-000000000004', 'PAN TAJADO MANTEQUILLA 450G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-tajado-mantequilla-horneaditos-450g-12005834/p. Marca: HORNEADITOS. Nombre del producto: Pan Tajado Mantequilla 450g Descripción del producto: Pan tajado con sabor mantequilla, suave y esponjoso, ideal para acompañar desayunos, meriendas o preparar sándwiches. Elaborado de forma industrial co',
  '🛒', 3650, 'Mantequilla', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202462/pan-tajado-mantequilla-horneaditos-450gr-12005834-01.png.png?v=639179728481330000',
  true, 133
),
(
  'a1220000-0000-4000-a104-000000000135', 'b1100000-0000-4000-a110-000000000004', 'PAN LECHE HORNEADITOS 10 UND 440 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-leche-horneaditos-10-und-440g-12000069/p. Marca: HORNEADITOS. Nombre del producto: Pan de Leche Horneaditos 10 und 440 g Descripción del producto: Disfruta del suave y delicioso Pan de Leche Horneaditos, ideal para acompañar tus comidas o disfrutar como snack. Características del Producto: Ta',
  '🍞', 4400, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198912/pan-leche-horneaditos-440gr-10und-12000069-01.png.png?v=639179629245470000',
  true, 134
),
(
  'a1220000-0000-4000-a104-000000000136', 'b1100000-0000-4000-a110-000000000004', 'TOSTADAS CON FINAS HIERBAS 14 UND 90 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tostadas-finas-hierbas-horneaditos-14-und-90g-12000613/p. Marca: HORNEADITOS. Nombre del producto: Tostadas con Finas Hierbas 90g Descripción del producto: Disfruta de las deliciosas Tostadas con Finas Hierbas, ideales para acompañar tus comidas o como un snack crujiente. Con un toque de especias',
  '🍞', 2300, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199862/tostadas-finas-hierbas-horneaditos-90gr-12000613-01.png.png?v=639179648348130000',
  true, 135
),
(
  'a1220000-0000-4000-a104-000000000137', 'b1100000-0000-4000-a110-000000000004', 'TOSTADA MULTICEREAL/MAÍZ NATRI 70 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tostada-multicereal-maiz-natri-70g-12000992/p. Marca: NATRI. Nombre del producto: Tostada Multicereal/Maíz Natri 70g Descripción del producto: Tostadas elaboradas con una mezcla de granos y cereales, ideales para acompañar tus comidas o disfrutar como snack saludable. Producto listo para el consu',
  '🛒', 3800, 'Multigranos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200088/tostada-multicerealmaiz-natri-panaderia-12000992-0.png.png?v=639179653218100000',
  true, 136
),
(
  'a1220000-0000-4000-a104-000000000138', 'b1100000-0000-4000-a110-000000000004', 'GALLETAS SALTISIMAS MEGA 6 TACOS 454 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galletas-saltisimas-mega-6-tacos-454g-12002839/p. Marca: SALTISIMAS. Nombre del producto: Galletas Saltísimas Mega 6 Tacos 454 g Descripción del producto: Galleta salada tipo cracker, perfecta para el consumo diario. Ideal como acompañamiento o aperitivo con su característico sabor y textura cruj',
  '🍞', 5600, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200913/galletas-saladas-saltisimas-454rg-6-tacos-12002839-01.png.png?v=639179671063530000',
  true, 137
),
(
  'a1220000-0000-4000-a104-000000000139', 'b1100000-0000-4000-a110-000000000004', 'ACHIRAS X 120 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/achiras-del-huila-120g-12001107/p. Marca: ACHIRAS DEL HUILA. Nombre del producto: Achiras Tradición 120g - Productora de Alimentos Ermita Descripción del producto: Deléitate con las tradicionales Achiras, este bizcocho típico colombiano ofrece una textura crocante y un sabor auténtico, ideal como',
  '🍞', 7850, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200144/bizcochos-de-achiras-achiras-del-huila-120gr-12001107-01.png.png?v=639179654298500000',
  true, 138
),
(
  'a1220000-0000-4000-a104-000000000140', 'b1100000-0000-4000-a110-000000000004', 'GALLETA TOSH CREMADA 144 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-tosh-cremada-144g-12006681/p. Marca: TOSH. Nombre del producto: Galleta TOSH Cremada 144g Descripción del producto: Disfruta de la Galleta TOSH Cremada, una deliciosa opción, ideal para acompañar tus comidas o disfrutar como snack energético. Características del Producto: Tamaño: 22cm x 9',
  '🍞', 7990, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203318/galleta-tosh-cremada-144gr-12006681-00.png.png?v=639179858342430000',
  true, 139
),
(
  'a1220000-0000-4000-a104-000000000141', 'b1100000-0000-4000-a110-000000000004', 'TOSTADA INTEGRAL HORNEADITOS 10 UND 150G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tostada-integral-horneaditos-10-und-150g-12000048/p. Marca: HORNEADITOS. Nombre del producto: Tostada Integral Horneaditos 150g Descripción del producto: Deliciosas tostadas integrales listas para consumir. Perfectas para acompañar tus comidas o disfrutar como snack saludable. Características del',
  '🛒', 1950, 'Integral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198864/tostadas-integrales-horneaditos-150gr-12000048-01.png.png?v=639179628375600000',
  true, 140
),
(
  'a1220000-0000-4000-a104-000000000142', 'b1100000-0000-4000-a110-000000000004', 'PAN PERRO HORNEADITOS 6 UND 370 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-perro-horneaditos-6-und-370g-12000061/p. Marca: HORNEADITOS. Nombre del producto: Pan Perro Horneaditos 6 und 370 g Descripción del producto: El Pan Perro Horneaditos con ajonjolí es ideal para preparar tus perros calientes favoritos. Suave, sabroso y decorado con ajonjolí, viene listo para e',
  '🍞', 3750, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198884/pan-perro-con-ajonjoli-horneaditos-370gr-6und-12000061-01.png.png?v=639179628763400000',
  true, 141
),
(
  'a1220000-0000-4000-a104-000000000143', 'b1100000-0000-4000-a110-000000000004', 'GALLETAS VAINILLA 18UN WAFER NOEL 432 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galletas-vainilla-wafer-noel-18-und-432g-12000134/p. Marca: NOEL. Nombre del producto: Galletas Vainilla 18un Wafer Noel 432g Descripción del producto: Disfruta de las deliciosas Galletas Vainilla Wafer Noel, un snack perfecto para cualquier momento del día. Estas galletas crujientes con un toque',
  '🍞', 9800, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199016/galletas-wafers-rellenas-noel-432gr-12000134-01.png.png?v=639179631512700000',
  true, 142
),
(
  'a1220000-0000-4000-a104-000000000144', 'b1100000-0000-4000-a110-000000000004', 'ROSQUILLAS 12 UND HORNEADITOS 192 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/rosquillas-horneaditos-12-und-192g-12000258/p. Marca: HORNEADITOS. Nombre del producto: Rosquillas 12 und Horneaditos 192 g Descripción del producto: Disfruta las tradicionales rosquillas horneadas, elaboradas con almidón de yuca y queso, ideales para tus meriendas o compartir en familia. Caracte',
  '🍞', 9750, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199235/rosquillas-horneaditos-192gr-12und-12000258-01.png.png?v=639179636265670000',
  true, 143
),
(
  'a1220000-0000-4000-a104-000000000145', 'b1100000-0000-4000-a110-000000000004', 'TOSTADAS CON AJO 14 UND 90 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tostadas-con-ajo-horneaditos-14-und-90g-12000692/p. Marca: HORNEADITOS. Nombre del producto: Tostadas con Ajo 90g Descripción del producto: Tostadas con sabor a ajo, crocantes y listas para disfrutar en cualquier momento del día. Ideales como acompañamiento o snack. Características del Producto: ',
  '🍞', 2300, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199897/tostadas-con-ajo-horneaditas-90gr-12000692-01.png.png?v=639179649107000000',
  true, 144
),
(
  'a1220000-0000-4000-a104-000000000146', 'b1100000-0000-4000-a110-000000000004', 'PAN TAJADO INTEGRAL HORNEADITOS 450 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-tajado-integral-horneaditos-450g-12004887/p. Marca: HORNEADITOS. Nombre del producto: Pan Tajado Integral Horneaditos 450 g Descripción del producto: El Pan Tajado Integral Horneaditos es una excelente opción para quienes buscan una alternativa más sencilla. Características del Producto: Tama',
  '🛒', 3650, 'Integral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202079/pan-tajado-integral-horneaditos-450gr-12004887-01.png.png?v=639179702021200000',
  true, 145
),
(
  'a1220000-0000-4000-a104-000000000147', 'b1100000-0000-4000-a110-000000000004', 'PAN TAJADO MULTIGRANOS 450 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-tajado-multigranos-natri-450g-12005835/p. Marca: NATRI. Nombre del producto: Pan Tajado Multigranos 450 g Descripción del producto: El Pan Tajado Multigranos es una deliciosa opción para quienes buscan un pan más nutritivo. Su textura suave y su mezcla única de ingredientes hacen de este pan ',
  '🛒', 5990, 'Multigranos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202466/pan-tajado-multigrano-natri-450g-12005835-01.png.png?v=639179728502800000',
  true, 146
),
(
  'a1220000-0000-4000-a104-000000000148', 'b1100000-0000-4000-a110-000000000004', 'GALLETA MUUU LECHE COLOMBINA 216 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-muuu-leche-colombina-216g-12000019/p. Marca: MUUU. Nombre del producto: Galleta Muuu Leche Colombina 216g Descripción del producto: Disfruta de la deliciosa Galleta Muuu Leche Colombina, una opción ideal para los más pequeños y toda la familia. Esta galleta es perfecta para acompañar las ',
  '🍞', 5490, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198817/-galleta-de-leche-muuu-colombina-216grs-18und-12000019-01.png?v=639179621656570000',
  true, 147
),
(
  'a1220000-0000-4000-a104-000000000149', 'b1100000-0000-4000-a110-000000000004', 'GALLETA INTEGRAL CON MIEL NATRI 216G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-integral-con-miel-natri-216g-12002511/p. Marca: NATRI. Nombre del producto: Galleta Integral con Miel Natri 216g Descripción del producto: Disfruta de las Galletas Integrales con Miel Natri, ideales para quienes buscan cuidar su alimentación sin renunciar al sabor. Características del Pro',
  '🍞', 4200, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200685/galletas-con-miel-natri-216gr-12002511-01.png.png?v=639179666361130000',
  true, 148
),
(
  'a1220000-0000-4000-a104-000000000150', 'b1100000-0000-4000-a110-000000000004', 'GALLETAS MINI CHIPS 8 PQ 280G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galletas-mini-chips-festival-8-pack-280g-12003939/p. Marca: FESTIVAL. Nombre del producto: Galletas Mini Chips 8 pq 280g Descripción del producto: Las Galletas Mini Chips son mini galletas con chispas de chocolate, ideales como snack para disfrutar en cualquier momento del día. Su presentación en',
  '🍞', 10450, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201661/galletas-mini-chips-festival-280gr-8und-12003939-01.png.png?v=639179694071970000',
  true, 149
),
(
  'a1220000-0000-4000-a104-000000000151', 'b1100000-0000-4000-a110-000000000004', 'PAN TAJADO BRIOCHE HORNEADITOS 380 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-tajado-brioche-horneaditos-380g-12004942/p. Marca: HORNEADITOS. Nombre del producto: Pan Tajado Brioche Horneaditos 380 g Descripción del producto: El Pan Tajado Brioche Horneaditos es una deliciosa opción con un toque dulce y suave textura, perfecto para desayunos y meriendas. Característica',
  '🛒', 6990, 'Brioche', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204236/pan-tajado-brioche-horneaditos-380-g-01.png?v=639189538530000000',
  true, 150
),
(
  'a1220000-0000-4000-a104-000000000152', 'b1100000-0000-4000-a110-000000000004', 'GALLETAS HAPPY WAFER X 12 UND 288G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galletas-happy-wafer-12-und-288g-12005070/p. Marca: HAPPY WAFER. Nombre del producto: Galletas Happy Wafer x 12 und 288g Descripción del producto: Las Galletas Happy Wafer con crema sabor a vainilla son la combinación perfecta entre textura crujiente y dulzura suave. Empacadas en porciones indivi',
  '🍞', 4990, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202126/galletas-wafer-vainilla-happy-wafer-288gr-12005070-01.png.png?v=639179702935130000',
  true, 151
),
(
  'a1220000-0000-4000-a104-000000000153', 'b1100000-0000-4000-a110-000000000004', 'TOSTADA CLÁSICA HORNEADITOS 10 UND 150 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tostada-clasica-horneaditos-10-und-150g-12000047/p. Marca: HORNEADITOS. Nombre del producto: Tostada Clásica Horneaditos 150g Descripción del producto: Tostadas clásicas horneadas, perfectas para acompañar tus desayunos, onces o comidas. Prácticas, crocantes y listas para consumir en cualquier mo',
  '🍞', 1800, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198861/tostadas-clasicas-horneaditos-150gr-12000047-01.png.png?v=639179628289230000',
  true, 152
),
(
  'a1220000-0000-4000-a104-000000000154', 'b1100000-0000-4000-a110-000000000004', 'GALLETA BISCOLATA RELLENA Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-biscolata-rellena-12000744/p. Marca: BISCOLATA. Nombre del producto: Galleta Biscolata Rellena 115g Descripción del producto: Deliciosas galletas rellenas de crema de chocolate, esponjosas y con un sabor intenso. Perfectas como snack dulce para cualquier momento del día. Características d',
  '🍞', 6990, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199933/galleta-rellena-de-chocolate-biscolata-115gr-12000744-01.png.png?v=639179649934100000',
  true, 153
),
(
  'a1220000-0000-4000-a104-000000000155', 'b1100000-0000-4000-a110-000000000004', 'GALLETA RITZ TACO 52.5 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-ritz-taco-52g-12006000/p. Marca: RITZ. Nombre del producto: Galleta Ritz Taco 52.5g Descripción del producto: Galletas saladas Ritz, ideales como snack o para acompañar tus comidas favoritas, brindan una textura crujiente y un sabor clásico. Perfectas para llevar contigo a cualquier lugar',
  '🍞', 1990, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202572/galletas-ritz-52gr-12006000-01.png.png?v=639179730237130000',
  true, 154
),
(
  'a1220000-0000-4000-a104-000000000156', 'b1100000-0000-4000-a110-000000000004', 'GANSITO RAMO 6 UND 222 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/gansito-ramo-6-und-222g-12002951/p. Marca: RAMO. Nombre del producto: Gansito Ramo 6 und 222g Descripción del producto: El Gansito Ramo es un pastelito tradicional colombiano, relleno de crema y cubierto de chocolate, ideal para disfrutar como snack o postre. Su sabor dulce y textura esponjosa lo',
  '🍞', 11700, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200964/ponque-gansito-ramo-222gr-12002951-01.png.png?v=639179671979000000',
  true, 155
),
(
  'a1220000-0000-4000-a104-000000000157', 'b1100000-0000-4000-a110-000000000004', 'RECREO MIX BIMBO 5 UND 148 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/recreo-mix-bimbo-5-und-148g-12005301/p. Marca: BIMBO. Nombre del producto: Recreo Mix Bimbo 5 UND 148 G Descripción del producto: Disfruta de los deliciosos pasteles esponjosos rellenos con cremas saborizadas de Bimbo, ideales para meriendas o como postre. Características del Producto: Tamaño: 26',
  '🍞', 6400, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202248/recreo-mix-bimbo-148gr-5und-12005301-01.png.png?v=639179705205400000',
  true, 156
),
(
  'a1220000-0000-4000-a104-000000000158', 'b1100000-0000-4000-a110-000000000004', 'PAN MINI BAGUETTE HORNEADITOS 320GR 6UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pan-mini-baguette-horneaditos-320g-6-und-12007333/p. Marca: HORNEADITOS. Pan Mini Baguette Horneaditos 320Gr 6Und Encuéntralo en Tiendas D1. Compra Ya',
  '🍞', 4990, 'Panadería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203658/pan-baguette-horneaditos-320g-6und-12007333-01.png.png?v=639179862587300000',
  true, 157
),
(
  'a1220000-0000-4000-a104-000000000159', 'b1100000-0000-4000-a110-000000000004', 'TOSTADA CLÁSICA MANTEQUILLA 150 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tostada-clasica-mantequilla-horneaditos-150g-12006636/p. Marca: HORNEADITOS. Nombre del producto: Tostada Clásica Mantequilla 150g Descripción del producto: Tostadas con sabor a mantequilla, crocantes y listas para consumir. Una opción práctica para acompañar tus comidas o disfrutar como snack. C',
  '🛒', 2600, 'Mantequilla', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204183/tostada-clasica-mantequilla-150-grs-01.png?v=639189507195130000',
  true, 158
),
(
  'a1220000-0000-4000-a104-000000000160', 'b1100000-0000-4000-a110-000000000004', 'GALLETA CHIPS DE CHOCOLATE 6 PQ Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galleta-chips-chocolate-6-pack-12000435/p. Marca: HAPPY CHIPS. Nombre del producto: Galleta Chips de Chocolate 6 PQ - Happy Chips 270g Descripción del producto: Deliciosas galletas con chips sabor a chocolate, perfectas para los más pequeños o para cualquier momento del día. Características del P',
  '🍞', 8250, 'Galletería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199671/galletas-chips-chocolate-happy-chips-270gr-12-porciones12000435-01.png.png?v=639179644498000000',
  true, 159
),
(
  'a1220000-0000-4000-a104-000000000161', 'b1100000-0000-4000-a110-000000000004', 'BLANQUEADOR BRILLA KING 2000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/blanqueador-brilla-king-2000ml-12000089/p. Marca: BRILLA KING. Nombre del producto: Blanqueador Brilla King 2000 ml Descripción del producto: El Blanqueador Brilla King es un desinfectante natural de uso doméstico que ayuda a desmanchar, despercudir y desinfectar superficies y ropa blanca. Ideal ',
  '🧴', 3100, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198954/blanqueador-desinfectante-brilla-king-2000ml-12000089-01.png.png?v=639179630189930000',
  true, 160
),
(
  'a1220000-0000-4000-a104-000000000162', 'b1100000-0000-4000-a110-000000000004', 'SUAVIZANTE FLORAL BONAROPA 3 L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/suavizante-bonaropa-floral-12003533/p. Marca: BONAROPA. Nombre del producto: Suavizante Floral Bonaropa 3L Descripción del producto: Disfruta del Suavizante Floral Bonaropa, diseñado para brindar frescura y suavidad duradera a tus prendas. Su fórmula avanzada con cápsulas de perfume inteligentes ',
  '🧴', 9990, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201289/suavizante-floral-xtra-aroma-bonaropa-3l-12003533-01.png.png?v=639179679556870000',
  true, 161
),
(
  'a1220000-0000-4000-a104-000000000163', 'b1100000-0000-4000-a110-000000000004', 'LÍQUIDO LAVALOZA BRILLA KING 500 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/lavaloza-liquido-brilla-king-500ml-12000231/p. Marca: BRILLA KING. Nombre del producto: Líquido Lávaloza Brilla King 500 mL Descripción del producto: El Líquido Lávaloza Brilla King de 500 mL está formulado para una limpieza efectiva de tu loza y cristalería. Su fórmula con mezcla de tensoactivos',
  '🧴', 2750, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199178/lavaloza-liquido-limon-aloe-vera-brilla-king-500ml-12000231-01.png.png?v=639179635203300000',
  true, 162
),
(
  'a1220000-0000-4000-a104-000000000164', 'b1100000-0000-4000-a110-000000000004', 'BOLSA PAPELERA TIDY HOUSE 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bolsa-papelera-tidy-house-30-und-12000276/p. Marca: TIDY HOUSE. Nombre del producto: Bolsa para basura papelera Tidy House Descripción del producto: Las Bolsas para basura papelera Tidy House son la solución práctica y eficiente para la recolección de residuos ligeros en papeleras del hogar u ofi',
  '🛒', 2350, 'Pilas bombillos y desechables', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199300/bolsa-basura-blanca-papelera-tidy-house-30und-12000276-01.png.png?v=639179637425800000',
  true, 163
),
(
  'a1220000-0000-4000-a104-000000000165', 'b1100000-0000-4000-a110-000000000004', 'BOLSA HOGAR TIDY HOUSE 10 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bolsa-hogar-tidy-house-10-und-12000273/p. Marca: TIDY HOUSE. Nombre del producto: Bolsa para basura residencial negra Tidy House 10 und Descripción del producto: Las Bolsas para basura residencial negra Tidy House son ideales para la recolección de residuos no aprovechables en el hogar, como pape',
  '🛒', 2050, 'Pilas bombillos y desechables', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199288/bolsa-basura-tidy-house-10und-12000273-01.png.png?v=639179637259570000',
  true, 164
),
(
  'a1220000-0000-4000-a104-000000000166', 'b1100000-0000-4000-a110-000000000004', 'DETERGENTE LÍQUIDO BONAROPA 3 LITROS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/detergente-liquido-bonaropa-12002741/p. Marca: BONAROPA. Nombre del producto: Detergente Líquido Bonaropa 3 Litros Descripción del producto: Bonaropa es un detergente líquido ideal para el cuidado de tu ropa. Ofrece colores radiantes, protección de las prendas y un aroma fresco comprobado. Su pre',
  '🧴', 13900, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200826/detergente-liquido-poder-frescura-bonaropa-3l-12002741-01.png.png?v=639179669519730000',
  true, 165
),
(
  'a1220000-0000-4000-a104-000000000167', 'b1100000-0000-4000-a110-000000000004', 'BOLSA BLANCA TIDY HOUSE 10 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bolsa-blanca-tidy-house-10-und-12000275/p. Marca: TIDY HOUSE. Nombre del producto: Bolsa para basura residencial blanca Tidy House 10 und Descripción del producto: Las Bolsas para basura residencial blanca Tidy House son prácticas y resistentes, ideales para la disposición de residuos en el hogar',
  '🛒', 2350, 'Pilas bombillos y desechables', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199296/bolsa-basura-blanca-tidy-house-10und-12000275-01.png.png?v=639179637351370000',
  true, 166
),
(
  'a1220000-0000-4000-a104-000000000168', 'b1100000-0000-4000-a110-000000000004', 'ESPONJA MULTIUSOS ABRASIVA TIDYHOUSE 2U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/esponja-multiusos-abrasiva-tidy-house-2-und-12005925/p. Marca: TIDY HOUSE. Nombre del producto: Esponja Multiusos Azul-Plata 2U - Tidy House Descripción del producto: La Esponja Multiusos Azul-Plata de Tidy House es ideal para la limpieza eficiente de cocinas y todo tipo de superficies. Diseñada ',
  '🧹', 2400, 'Accesorios limpieza', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202503/esponja-multiusos-abrasiva-tidyhouse-12005925-00.png.png?v=639179728900300000',
  true, 167
),
(
  'a1220000-0000-4000-a104-000000000169', 'b1100000-0000-4000-a110-000000000004', 'LIMPIADOR BICARBONATO BRILLA KING 3L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/limpiador-bicarbonato-brilla-king-3l-12006903/p. Marca: BRILLA KING. " Nombre del producto: Limpiapisos Desinfectante Brilla King con Bicarbonato 3L Descripción del producto: Disfruta de la limpieza y desinfección profunda con el Limpia pisos Desinfectante Brilla King. Formulado con bicarbonato d',
  '🧴', 6900, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204149/limpiador-bicarbonato-brilla-king-aseo-hogar-12006903-01.png?v=639189489060900000',
  true, 168
),
(
  'a1220000-0000-4000-a104-000000000170', 'b1100000-0000-4000-a110-000000000004', 'SERVILLETA DOBLADA RENDY 200 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/servilleta-rendy-200-und-12000176/p. Marca: RENDY. Nombre del producto: Servilleta Doblada Rendy x200 unidades Descripción del producto: Las Servilletas Dobladas Rendy son ideales para el hogar, eventos o cualquier ocasión especial. Están elaboradas con fibra de celulosa de alta calidad, ofrecien',
  '🛒', 4150, 'Pilas bombillos y desechables', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199071/servilletas-dobladas-rendy-200und-12000176-01.png.png?v=639179632855470000',
  true, 169
),
(
  'a1220000-0000-4000-a104-000000000171', 'b1100000-0000-4000-a110-000000000004', 'DESENGRASANTE BRILLA KING 500 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/desengrasante-brilla-king-500ml-12000240/p. Marca: BRILLA KING. Nombre del producto: Desengrasante Brilla King 500 mL Descripción del producto: El Desengrasante Brilla King de 500 mL es ideal para la limpieza y desengrase profundo en cocinas. Su poderosa fórmula elimina el 99.9% de bacterias y re',
  '🧴', 2500, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199182/desengrasante-desinfectante-brilla-king-500ml-12000240-01.png.png?v=639179635284970000',
  true, 170
),
(
  'a1220000-0000-4000-a104-000000000172', 'b1100000-0000-4000-a110-000000000004', 'LIMPIADOR LAVANDA JAZMÍN BRILLA KING 3L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/limpiador-lavanda-jazmin-brilla-king-3l-12005840/p. Marca: BRILLA KING. Nombre del producto: Limpiapisos Lavanda Jazmín Brilla King 3L Descripción del producto: El Limpiapisos Lavanda Jazmín Brilla King ofrece limpieza profunda, desinfección, brillo y una fresca fragancia para todo tipo de pisos ',
  '🧴', 6550, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202474/limpiapisos-lavanda-jazmin-brilla-king-3000ml-12005840-01.png.png?v=639179728631800000',
  true, 171
),
(
  'a1220000-0000-4000-a104-000000000173', 'b1100000-0000-4000-a110-000000000004', 'TOALLA COCINA TRIPLE HOJA RENDY 80 HOJAS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toalla-cocina-triple-hoja-rendy-80h-12006851/p. Marca: RENDY. Nombre del producto: Toalla Cocina Triple Hoja Rendy 80 hojas Descripción del producto: Toallas de cocina Rendy triple hoja, altamente absorbentes y resistentes. Ideales para mantener la limpieza y frescura en tu cocina. Fabricadas en ',
  '🧴', 3650, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203473/toalla-cocina-triple-hoja-rendy-80h-12006851-01.png.png?v=639179860519370000',
  true, 172
),
(
  'a1220000-0000-4000-a104-000000000174', 'b1100000-0000-4000-a110-000000000004', 'TOALLA DE COCINA RENDY DOBLE HOJA Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toalla-cocina-rendy-doble-hoja-12000177/p. Marca: RENDY. Nombre del producto: Toallas de Cocina 2H Rendy Descripción del producto: Las Toallas de Cocina 2H Rendy están hechas de fibra de celulosa, brindando una excelente absorción para tareas de limpieza y secado en la cocina. Su diseño de doble ',
  '🧴', 1750, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199075/toalla-de-cocina-doble-hoja-rendy-50h-12000177-01.png.png?v=639179632894670000',
  true, 173
),
(
  'a1220000-0000-4000-a104-000000000175', 'b1100000-0000-4000-a110-000000000004', 'DETERGENTE MULTIUSOS BONAROPA 2800 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/detergente-multiusos-bonaropa-12000310/p. Marca: BONAROPA. Nombre del producto: Detergente en Polvo Multiusos BONAROPA 2800g Descripción del producto: Descubre la eficacia del Detergente en Polvo Multiusos BONAROPA, ideal para el lavado de ropa, limpieza de pisos, paredes, cocinas y baños. Con un',
  '🧴', 10850, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199406/detergente-en-polvo-multiusos-bonaropa-2800gr-12000310-01.png.png?v=639179639341530000',
  true, 174
),
(
  'a1220000-0000-4000-a104-000000000176', 'b1100000-0000-4000-a110-000000000004', 'LIMPIADOR BICARBONAT BRILLA KING 1000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/limpiador-bicarbonato-brilla-king-1000ml-12000347/p. Marca: BRILLA KING. Nombre del producto: Limpiapisos Desinfectante Brilla King con Bicarbonato 1000 mL Descripción del producto: Disfruta de la limpieza y desinfección profunda con el Limpiapisos Desinfectante Brilla King. Formulado con bicarbo',
  '🧴', 2650, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199505/limpiapisos-bicarbonato-brilla-king-1000ml-12000347-01.png.png?v=639179641139200000',
  true, 175
),
(
  'a1220000-0000-4000-a104-000000000177', 'b1100000-0000-4000-a110-000000000004', 'PAÑO REUTILIZABLE DURAMAX 50 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pano-reutilizable-duramax-scott-50-und-12004388/p. Marca: SCOTT. Nombre del producto: Paño Reutilizable Scott Duramax x 50 unidades Descripción del producto: El Paño Reutilizable Scott Duramax es ideal para tareas de limpieza doméstica. Ofrece alta resistencia en seco y húmedo, es lavable, reutil',
  '🧹', 7950, 'Aseo y limpieza', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201973/pano-en-rollo-neutralizable-durama-scott-50und-12004388-01.png.png?v=639179700340170000',
  true, 176
),
(
  'a1220000-0000-4000-a104-000000000178', 'b1100000-0000-4000-a110-000000000004', 'CREMA LAVALOZA BRILLA KING 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crema-lavaloza-brilla-king-500g-12000131/p. Marca: BRILLA KING. Nombre del producto: Crema Lavaloza Antibacterial Brilla King Descripción del producto: La Crema Lavaloza Antibacterial Brilla King es ideal para la limpieza de utensilios de cocina. Con una fórmula que neutraliza los malos olores y ',
  '🧹', 2750, 'Aseo y limpieza', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199012/crema-lavaloza-brilla-king-500gr-12000131-01.png.png?v=639179631422930000',
  true, 177
),
(
  'a1220000-0000-4000-a104-000000000179', 'b1100000-0000-4000-a110-000000000004', 'GUANTE DOMÉSTICO TIDY HOUSE TALLA M Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/guante-domestico-tidy-house-talla-m-12000218/p. Marca: TIDY HOUSE. Nombre del producto: Guante Doméstico - TIDY HOUSE Descripción del producto: El Guante Doméstico TIDY HOUSE está diseñado para brindar protección durante tareas del hogar. Fabricado con látex natural, ofrece un diseño anatómico, g',
  '🧹', 2600, 'Accesorios limpieza', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199158/guante-domestico-tallam-tidy-house-1par-12000218-01.png.png?v=639179634554530000',
  true, 178
),
(
  'a1220000-0000-4000-a104-000000000180', 'b1100000-0000-4000-a110-000000000004', 'LAVALOZA LÍQUIDO BRILLA KING 750ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/lavaloza-liquido-brilla-king-750ml-12003567/p. Marca: BRILLA KING. Nombre del producto: Lavaloza Líquido Brilla King 750ml Descripción del producto: El Lavaloza Líquido Brilla King es un potente limpiador antibacterial diseñado para el lavado de platos. Su fórmula especial arranca grasa, seca ráp',
  '🧴', 6300, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201347/lavaloza-liquido-brilla-king-750ml-12003567-01.png.png?v=639179680774470000',
  true, 179
),
(
  'a1220000-0000-4000-a104-000000000181', 'b1100000-0000-4000-a110-000000000004', 'JABÓN DE BARRA LÍQUIDO BRILLA KING 1L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-barra-liquido-brilla-king-1l-12002044/p. Marca: BRILLA KING. Nombre del producto: Jabón de Barra Líquido Brilla King 1L Descripción del producto: Descubre el poder de limpieza del Jabón de Barra Líquido Brilla King, ideal para remover suciedad, despercudir, desmanchar y neutralizar malos ol',
  '🧴', 5400, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200434/jabon-de-barra-liquido-brilla-king-1000ml-12002044-01.png.png?v=639179660777700000',
  true, 180
),
(
  'a1220000-0000-4000-a104-000000000182', 'b1100000-0000-4000-a110-000000000004', 'BLANQUEADOR EN GEL BRILLA KING 1 LT Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/blanqueador-gel-brilla-king-1l-12002695/p. Marca: BRILLA KING. Nombre del producto: Blanqueador Desinfectante En Gel BRILLA KING 1000 mL Descripción del producto: Es un blanqueador desinfectante de uso doméstico e industrial, ideal para la limpieza profunda de ropa blanca, baños, cocinas y pisos,',
  '🧴', 5850, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200775/blanqueador-en-gel-brilla-king-1000ml-12002695-01.png.png?v=639179668706200000',
  true, 181
),
(
  'a1220000-0000-4000-a104-000000000183', 'b1100000-0000-4000-a110-000000000004', 'PASTILLAS PARA TANQUE BRILLA KING 1 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pastillas-tanque-brilla-king-12003991/p. Marca: BRILLA KING. Nombre del producto: Pastilla para Tanque Brilla King 48 g Descripción del producto: La Pastilla para Tanque Brilla King está diseñada para mantener la limpieza e higiene de las superficies internas del inodoro en cada descarga. Previen',
  '🧹', 3490, 'Aseo y limpieza', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201696/pastillas-para-tanque-brilla-king-48gr-12003991-01.png.png?v=639179694645430000',
  true, 182
),
(
  'a1220000-0000-4000-a104-000000000184', 'b1100000-0000-4000-a110-000000000004', 'PAPEL ALUMINIO TIDY HOUSE 13 MTS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papel-aluminio-tidy-house-13mts-12000192/p. Marca: TIDY HOUSE. Nombre del producto: Papel Aluminio Tidy House 13 metros Descripción del producto: El Papel Aluminio Tidy House de 13 metros es ideal para cocinar, hornear, proteger, aislar y conservar alimentos. Además, es perfecto para forrar super',
  '🧹', 4990, 'Otros hogar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199105/papel-aluminio-tidy-house-13mts-12000192-01.png.png?v=639179633393800000',
  true, 183
),
(
  'a1220000-0000-4000-a104-000000000185', 'b1100000-0000-4000-a110-000000000004', 'DETERGENTE LÍQUIDO BONAROPA 1000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/detergente-liquido-bonaropa-12000246/p. Marca: BONAROPA. Nombre del producto: Detergente Líquido Bonaropa 1000 mL Descripción del producto: El Detergente Líquido Bonaropa es perfecto para mantener tu ropa limpia, radiando colores vibrantes y un fresco aroma. Su fórmula avanzada con tecnología de ',
  '🧴', 5750, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204001/detergente-liquido-bonaropa-1000-ml-01.png?v=639188992490830000',
  true, 184
),
(
  'a1220000-0000-4000-a104-000000000186', 'b1100000-0000-4000-a110-000000000004', 'BOLSA RESELLABLE SURTIDA TIDY HOUSE 20U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bolsa-resellable-surtida-tidy-house-20-und-12002031/p. Marca: TIDY HOUSE. Nombre del Producto: Bolsas con Doble Selle Hermético Tidy House Descripción del producto: Las Bolsas con Doble Selle Hermético, son un producto versátil y de alta calidad. Estas bolsas son ideales para guardar y conservar ',
  '🛒', 4900, 'Pilas bombillos y desechables', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200422/bolsa-hermetica-tidy-house-10und-12002031-01.png.png?v=639179660466800000',
  true, 185
),
(
  'a1220000-0000-4000-a104-000000000187', 'b1100000-0000-4000-a110-000000000004', 'LIMPIADOR MANZANA CANELA BRILLA KING 1L Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/limpiador-manzana-canela-brilla-king-1l-12002510/p. Marca: BRILLA KING. Nombre del producto: Limpiador Manzana Canela Brilla King 1L Descripción del producto: El Limpiador Manzana Canela Brilla King es un limpiapisos multiusos que limpia, desinfecta, neutraliza malos olores y perfuma con una frag',
  '🧴', 2450, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200681/limpiapisos-manzana-canela-brilla-king-1000ml-12002510-01.png.png?v=639179666305570000',
  true, 186
),
(
  'a1220000-0000-4000-a104-000000000188', 'b1100000-0000-4000-a110-000000000004', 'DESINFECT Y ELIMINA OLORES HOSH 360 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/desinfectante-elimina-olores-hosh-360ml-12005724/p. Marca: HOSH. Nombre del producto: Desinfectante y Eliminador de Olores Fresh 360mL - Hosh Descripción del producto: El Desinfectante y Eliminador de Olores Fresh de Hosh es ideal para mantener tu hogar libre de hongos, bacterias y malos olores. ',
  '🧴', 5990, 'Cuidado del aire', 'https://d1tiendas.vteximg.com.br/arquivos/ids/205162/desinfect-y-elimina-olores-hosh-aseo-hogar-12005724-01.png?v=639198421808230000',
  true, 187
),
(
  'a1220000-0000-4000-a104-000000000189', 'b1100000-0000-4000-a110-000000000004', 'QUITAMANCHAS BLANCO POLVO BONAROPA 450G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/quitamanchas-polvo-blanco-bonaropa-450g-12005926/p. Marca: BONAROPA. Nombre del producto: Quitamanchas Blanco Polvo Bonaropa 450 g Descripción del producto: El Quitamanchas Bonaropa en polvo sin cloro es ideal para eliminar manchas difíciles de la ropa blanca sin dañar los tejidos. Su fórmula ava',
  '🧴', 9700, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202510/quitamanchas-ropa-blanca-bonaropa-450gr-12005926-01.png.png?v=639179728948800000',
  true, 188
),
(
  'a1220000-0000-4000-a104-000000000190', 'b1100000-0000-4000-a110-000000000004', 'TOALLA COCINA SUPER ROLLO RENDY 660H Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toalla-cocina-super-rollo-rendy-660h-12005688/p. Marca: RENDY. Nombre del producto: Toalla Multiusos x660 Rendy Descripción del producto: La Toalla Multiusos x660 Rendy es ideal para una variedad de tareas del hogar, ofreciendo una excelente absorción y resistencia. Fabricada con 100% fibra de ce',
  '🧴', 16300, 'Cuidado de superficies y cocina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203176/toallas-cocina-super-rollo-rendy-694g-12005688-01.png?v=639179844029270000',
  true, 189
),
(
  'a1220000-0000-4000-a104-000000000191', 'b1100000-0000-4000-a110-000000000004', 'ESPONJA MALLA TIDY HOUSE Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/esponja-malla-tidy-house-12006751/p. Marca: TIDY HOUSE. Esponja Malla Tidy House Encuéntralo en Tiendas D1. Compra Ya',
  '🧹', 1800, 'Accesorios limpieza', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203402/esponja-malla-tidy-house-3und-12006751-00.png.png?v=639179859594000000',
  true, 190
),
(
  'a1220000-0000-4000-a104-000000000192', 'b1100000-0000-4000-a110-000000000004', 'QUITAMANCHAS LÍQUIDO BONAROPA 1000 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/quitamanchas-liquido-bonaropa-1000ml-12000128/p. Marca: BONAROPA. Nombre del producto: Quitamanchas Líquido BONAROPA 1000 mL Descripción del producto: BONAROPA es un quitamanchas líquido diseñado para eliminar manchas en ropa blanca y de color. Su fórmula combina peróxido de hidrógeno y agentes t',
  '🧴', 4050, 'Cuidado de la ropa', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199000/quitamanchas-liquido-bonaropa-1000ml-12000128-01.png.png?v=639179631202230000',
  true, 191
),
(
  'a1220000-0000-4000-a104-000000000193', 'b1100000-0000-4000-a110-000000000004', 'TOCINETA AHUMADA VIANDÉ 150 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tocineta-ahumada-viande-150g-12000078/p. Marca: VIANDÉ. Nombre del producto: Tocineta Ahumada Viandé 150 g Descripción del producto: Deliciosa tocineta cocida y ahumada, ideal para acompañar desayunos o preparar recetas especiales. Producto de origen colombiano, elaborado bajo altos estándares de',
  '🥓', 6900, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198927/tocineta-ahumada-viande-150gr-12000078-01.png.png?v=639179629629430000',
  true, 192
),
(
  'a1220000-0000-4000-a104-000000000194', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA RANCHERA X 230 G X 7 UD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-ranchera-zenu-230g-7-und-12005929/p. Marca: ZENU. Nombre del producto: Salchicha Ranchera X 230g X 7 UD Descripción del producto: La Salchicha Ranchera X 230g X 7 UD está elaborada con carne de cerdo y especias, perfecta para tus parrilladas o platos de siempre. Características del Prod',
  '🛒', 13950, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202518/salchicha-premium-ranchera-230gr-7und-12005929-01.png.png?v=639179729098000000',
  true, 193
),
(
  'a1220000-0000-4000-a104-000000000195', 'b1100000-0000-4000-a110-000000000004', 'JAMON SERRANO VALDECAVA 80 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-serrano-valdecava-80g-12000480/p. Marca: VALDECAVA. Nombre del producto: Jamón Serrano Valdecava 80g Descripción del producto: Delicioso jamón serrano en lonchas, ideal para disfrutar en ensaladas, tapas o como aperitivo. Un sabor auténtico, tradicional y refinado. Características del Produ',
  '🥓', 9150, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199736/jamon-serrano-cerdo-80gr-12000480-01.png.png?v=639179645945000000',
  true, 194
),
(
  'a1220000-0000-4000-a104-000000000196', 'b1100000-0000-4000-a110-000000000004', 'JAMÓN DE CERDO/SAND PREMI VIANDÉ 300 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-cerdo-sandwich-premium-viande-300g-12000388/p. Marca: VIANDÉ. Nombre del producto: Jamón de Cerdo/Sand Premi Viandé 300g Descripción del producto: Disfruta del delicioso Jamón de Cerdo Sand Premi Viandé, ideal para preparar sándwiches, platos fríos o en tus preparaciones gourmet favoritas. ',
  '🥓', 9490, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199580/jamon-sandwich-viande-300gr-12000388-01.png.png?v=639179642756100000',
  true, 195
),
(
  'a1220000-0000-4000-a104-000000000197', 'b1100000-0000-4000-a110-000000000004', 'JAMÓN DE CERDO VIANDÉ 400 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-cerdo-viande-400g-12000077/p. Marca: VIANDÉ. Nombre del producto: Jamón de Cerdo Viandé 400g Descripción del producto: Disfruta del Jamón de Cerdo Viandé, un producto alimenticio delicioso y listo para el consumo. Perfecto para preparar sándwiches, ensaladas o como aperitivo, este jamón coc',
  '🥓', 8850, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198923/jamon-de-cerdo-viande-400gr-12000077-01.png.png?v=639179629546870000',
  true, 196
),
(
  'a1220000-0000-4000-a104-000000000198', 'b1100000-0000-4000-a110-000000000004', 'JAMÓN PIETRÁN ESTANDAR 230G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-pietran-estandar-230g-12006001/p. Marca: PIETRAN. Nombre del producto: Jamón Pietrán Estándar 230g Descripción del producto: Disfruta del Jamón Pietrán Estándar, una opción de excelente calidad que te ofrece un sabor intenso a carne de cerdo. Perfecto para acompañar tus platos, sándwiches o',
  '🥓', 14950, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202576/jamon-de-cerdo-pietran-230gr-12006001-01.png.png?v=639179730259800000',
  true, 197
),
(
  'a1220000-0000-4000-a104-000000000199', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA TRADICIONAL VIANDE 400 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-tradicional-viande-400g-12005816/p. Marca: VIANDÉ. Nombre del producto: Salchicha Tradicional Viandé 400 g Descripción del producto: Disfruta de la Salchicha Tradicional Viandé, una combinación ideal de carne de pollo y cerdo con un sabor auténtico y tradicional. Es perfecta para acompa',
  '🛒', 6750, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202442/salchicha-tradicional-viande-400gr-12005816-01.png.png?v=639179727969900000',
  true, 198
),
(
  'a1220000-0000-4000-a104-000000000200', 'b1100000-0000-4000-a110-000000000004', 'CHORIZO SANTARROSANO VIANDÉ 225 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chorizo-santarrosano-viande-225g-12000298/p. Marca: VIANDÉ. Nombre del producto: Chorizo Santarrosano Viandé 225 g Descripción del producto: El Chorizo Santarrosano Viandé está elaborado con carne de cerdo y una mezcla especial de especias tradicionales. Ideal para freír o asar, brinda un sabor a',
  '🛒', 7400, 'Chorizos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199364/chorizo-santarrosano-viande-225gr-12000298-01.png.png?v=639179638521330000',
  true, 199
),
(
  'a1220000-0000-4000-a104-000000000201', 'b1100000-0000-4000-a110-000000000004', 'CHORIZO VELA + SALAMI LOURISIERRA 80 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chorizo-vela-salami-valdecava-80g-12002478/p. Marca: VALDECAVA. Nombre del Producto: Duopack Chorizo Vela + Salami Lourisierra 80gr Descripción del producto: Producto cárnico procesado compuesto por chorizo vela y salami, contiene dos unidades listas para consumir directamente o cocinadas. Ideal ',
  '🛒', 8400, 'Chorizos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200653/chorizo-vela-salami-centurion-80gr-12002478-01.png.png?v=639179665663800000',
  true, 200
),
(
  'a1220000-0000-4000-a104-000000000202', 'b1100000-0000-4000-a110-000000000004', 'JAMÓN DE POLLO PREMIUM BRAKEL 250 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-pollo-premium-brakel-250g-12000360/p. Marca: BRAKEL. Nombre del producto: Jamón de Pollo Premium Brakel 250g Descripción del producto: Disfruta del Jamón de Pollo Premium Brakel, un delicioso producto alimenticio, ideal para tus sándwiches, ensaladas o como aperitivo. Con su sabor suave y s',
  '🥓', 7850, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199537/jamon-de-pechuga-premium-brakel-250gr-12000360-01.png.png?v=639179641886330000',
  true, 201
),
(
  'a1220000-0000-4000-a104-000000000203', 'b1100000-0000-4000-a110-000000000004', 'JAMÓN DE PAVO WHITE HOLLAND 225 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-pavo-white-holland-225g-12005984/p. Marca: WHITE HOLLAND. Jamón De Pavo White Holland 225 G Encuéntralo en Tiendas D1. Compra Ya',
  '🥓', 11500, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202568/jamon-de-pavo-premiun-white-holland-225g-12005984-01.png.png?v=639179730220400000',
  true, 202
),
(
  'a1220000-0000-4000-a104-000000000204', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA PARRILLA VIANDE 230 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-parrilla-viande-230g-12006381/p. Marca: VIANDÉ. Nombre del producto: Salchicha Parrilla Viandé 230 g Descripción del producto: Disfruta de la Salchicha Parrilla Viandé, es perfecta para tus asados o comidas rápidas con todo el sabor tradicional. Características del Producto: Tamaño: 18.',
  '🛒', 9300, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202889/salchicha-parrilla-viande-230gr-12006381-01.png.png?v=639179828729370000',
  true, 203
),
(
  'a1220000-0000-4000-a104-000000000205', 'b1100000-0000-4000-a110-000000000004', 'TOCINETA SANDWICH VIANDE 200 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tocineta-sandwich-viande-200g-12000770/p. Marca: VIANDÉ. Nombre del producto: Tocineta Sandwich Viande 200 g Descripción del producto: La Tocineta Sandwich Viande es una deliciosa opción de carne de cerdo ahumada cocida, perfecta para acompañar tus desayunos, sándwiches o recetas favoritas. Carac',
  '🥓', 9950, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199953/tocineta-sandwich-viande-200gr-12000770-01.png.png?v=639179650353800000',
  true, 204
),
(
  'a1220000-0000-4000-a104-000000000206', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA PERRO CALIENTE ZENU X 240G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-perro-caliente-zenu-240g-12005949/p. Marca: ZENU. Nombre del producto: Salchicha Perro Caliente Zenu 240g Descripción del producto: Disfruta de la deliciosa Salchicha Perro Caliente Zenu, ideal para preparar los mejores perros calientes, sándwiches o como complemento de tus recetas. Car',
  '🛒', 9750, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202531/salchicha-perro-caliente-zenu-240gr-6und-12005949-01.png.png?v=639179729394970000',
  true, 205
),
(
  'a1220000-0000-4000-a104-000000000207', 'b1100000-0000-4000-a110-000000000004', 'JAMON PAVO F HIERBAS WHITE HOLLAND 227 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-pavo-finas-hierbas-white-holland-227g-12005366/p. Marca: WHITE HOLLAND. Nombre del producto: Jamón de Pavo Finas Hierbas White Holland 227g Descripción del producto: Disfruta del Jamón de Pavo Finas Hierbas White Holland, una opción deliciosa y saludable, ideal para tus sándwiches, ensalada',
  '🥓', 13150, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202260/jamon-de-pavo-finas-hiervas-white-holland-227gr-12005366-01.png.png?v=639179705366970000',
  true, 206
),
(
  'a1220000-0000-4000-a104-000000000208', 'b1100000-0000-4000-a110-000000000004', 'JAMON ASADO AL HORNO CENTURION 100G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-asado-al-horno-centurion-100g-12005921/p. Marca: VIANDÉ. Nombre del producto: Jamón Asado al Horno Centurión 100g Descripción del producto: Disfruta del delicioso Jamón Asado al Horno Centurión, elaborado con carne de cerdo y especias seleccionadas. Perfecto para sándwiches, ensaladas o ape',
  '🥓', 9900, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202499/jamon-asado-al-horno-centurion-100gr-12005921-01.png.png?v=639179728880870000',
  true, 207
),
(
  'a1220000-0000-4000-a104-000000000209', 'b1100000-0000-4000-a110-000000000004', 'MORTADELA POLLO PREMIUM BRAKEL 250 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mortadela-pollo-premium-brakel-250g-12000331/p. Marca: BRAKEL. Nombre del producto: Mortadela Pollo Premium Brakel 250g Descripción del producto: Disfruta de la deliciosa Mortadela Pollo Premium Brakel, una mezcla de carne de pollo y cerdo ideal para sándwiches, platos fríos o preparaciones gourm',
  '🥓', 4150, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199450/jamon-de-pechuga-de-pollo-premium-brakel-250gr-12000331-01.png.png?v=639179640415470000',
  true, 208
),
(
  'a1220000-0000-4000-a104-000000000210', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA SÚPER PERRO VIANDÉ Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-super-perro-viande-12006261/p. Marca: VIANDÉ. Nombre del producto: Salchicha Súper Perro Viandé Descripción del producto: Disfruta de la deliciosa Salchicha Súper Perro Viandé, una mezcla perfecta de carne de cerdo y pollo. Ideal para tus parrilladas y comidas en familia, con un sabor i',
  '🛒', 9990, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203215/salchicha-super-perro-viande-400gr-12006261-01.png?v=639179848314300000',
  true, 209
),
(
  'a1220000-0000-4000-a104-000000000211', 'b1100000-0000-4000-a110-000000000004', 'PEPPERONI TAJADO VALDECAVA 60 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pepperoni-tajado-valdecava-60g-12005920/p. Marca: VALDECAVA. Nombre del producto: Pepperoni Tajado Valdecava 60g Descripción del producto: Disfruta de la deliciosa Pepperoni Tajado Valdecava, un producto cárnico ideal para pizzas y aperitivos. Con su sabor picante y su alta calidad, es perfecto p',
  '🥓', 4990, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202495/pepperoni-tajado-valdecava-60gr-12005920-01.png.png?v=639179728801630000',
  true, 210
),
(
  'a1220000-0000-4000-a104-000000000212', 'b1100000-0000-4000-a110-000000000004', 'CHORIZO ANTIOQUEÑO VIANDÉ 225G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chorizo-antioqueno-viande-225g-12006283/p. Marca: VIANDÉ. Nombre del producto: Chorizo Antioqueño Viandé 225 g Descripción del producto: El Chorizo Antioqueño Viandé es una deliciosa opción de carne curada con un sabor auténtico y tradicional. Ideal para preparar en sartén o parrilla. Característ',
  '🛒', 7990, 'Chorizos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203248/chorizo-antioqueno-viande-225gr-12006283-01.png?v=639179850632570000',
  true, 211
),
(
  'a1220000-0000-4000-a104-000000000213', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA PARRILLA/CAMPESINA VIANDE 400G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-parrilla-viande-12005613/p. Marca: VIANDÉ. Nombre del producto: Salchicha Parrilla/Campesina Viandé 400g Descripción del producto: Disfruta de la deliciosa Salchicha Parrilla/Campesina Viandé, una opción ideal para parrilladas, salchipapas o como aperitivo, su textura es perfecta para c',
  '🛒', 8990, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203133/salchicha-campestre-viande-400gr-12005613-01.png?v=639179839671130000',
  true, 212
),
(
  'a1220000-0000-4000-a104-000000000214', 'b1100000-0000-4000-a110-000000000004', 'MORTADELA FINA VIANDÉ 225 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mortadela-fina-viande-225g-12000079/p. Marca: VIANDÉ. Nombre del producto: Mortadela Fina Viandé 225g Descripción del producto: La Mortadela Fina Viandé es una deliciosa combinación de carne de pollo y cerdo, ideal para sándwiches, platos fríos o preparaciones gourmet. Con un sabor único que te a',
  '🥓', 2600, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198931/mortadela-fina-viande-225g-12000079-01.png.png?v=639179629694870000',
  true, 213
),
(
  'a1220000-0000-4000-a104-000000000215', 'b1100000-0000-4000-a110-000000000004', 'MORCILLA VIANDÉ 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/morcilla-viande-500g-12000108/p. Marca: VIANDÉ. Nombre del producto: Morcilla Viandé 500g Descripción del producto: Disfruta del auténtico sabor de la morcilla de cerdo, ideal para asar o hornear sin necesidad de añadir aceite. Un producto listo para consumir que conserva todo el sabor de la trad',
  '🥓', 8800, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198974/morcilla-tradicional-viande-500gr-12000108-01.png.png?v=639179630815400000',
  true, 214
),
(
  'a1220000-0000-4000-a104-000000000216', 'b1100000-0000-4000-a110-000000000004', 'CHORIZO CON TERNERA VIANDÉ 225G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chorizo-con-ternera-viande-225g-12006286/p. Marca: VIANDÉ. Nombre del producto: Chorizo con Ternera Viandé 225 g Descripción del producto: El Chorizo con Ternera Viandé combina la jugosidad del cerdo con la intensidad de la carne de ternera. Su mezcla especial de condimentos y especias lo convier',
  '🛒', 7200, 'Chorizos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203270/chorizo-con-ternera-viande-225gr-12006286-01.png?v=639179851685170000',
  true, 215
),
(
  'a1220000-0000-4000-a104-000000000217', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA PERRO VIANDÉ 240G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-perro-viande-240g-12006267/p. Marca: VIANDÉ. Nombre del producto: Salchicha Perro Viandé 240g Descripción del producto: Disfruta de la deliciosa Salchicha Perro Viandé, ideal para tus perros calientes o como complemento en parrilladas. Características del Producto: Tamaño: 23cm x 14cm P',
  '🛒', 7100, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203236/salchicha-perro-caliente-viande-240gr-12006267-01.png?v=639179849674500000',
  true, 216
),
(
  'a1220000-0000-4000-a104-000000000218', 'b1100000-0000-4000-a110-000000000004', 'CHORIZO CAMPES/TRADICIONAL VIANDÉ 225GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/chorizo-campesino-tradicional-viande-225g-12000081/p. Marca: VIANDÉ. Nombre del producto: Chorizo Campesino Viandé 225 g Descripción del producto: El Chorizo Campesino Viandé es una deliciosa combinación de carne de cerdo y pollo, ideal para tus comidas tradicionales. Su mezcla de especias y text',
  '🛒', 5200, 'Chorizos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198935/chorizo-campesino-viande-225gr-6und-12000081-01.png.png?v=639179629746000000',
  true, 217
),
(
  'a1220000-0000-4000-a104-000000000219', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHON DE POLLO BRAKEL 500 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchichon-pollo-brakel-500g-12000591/p. Marca: BRAKEL. Nombre del producto: Salchichón de Pollo Brakel 500 g Descripción del producto: El Salchichón de Pollo Brakel es una excelente opción para la cocina, ideal para compartir en familia o como parte de tus recetas favoritas. Características del ',
  '🥓', 5350, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199854/salchichon-de-pollo-brakel-500gr-12000591-01.png.png?v=639179648268200000',
  true, 218
),
(
  'a1220000-0000-4000-a104-000000000220', 'b1100000-0000-4000-a110-000000000004', 'COMBO TRADICIONAL VIANDE 900 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/combo-tradicional-viande-900g-12003882/p. Marca: VIANDÉ. Nombre del producto: Combo Tradicional Viandé 900 g Descripción del producto: El Combo Tradicional Viandé incluye una práctica selección de carnes frías, ideal para compartir en familia o preparar múltiples recetas, listo para el consumo y ',
  '🥓', 10950, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201635/supercombo-tradicional-viande-900gr-12003882-01.png.png?v=639179693333900000',
  true, 219
),
(
  'a1220000-0000-4000-a104-000000000221', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHON CERVERONI X900G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchichon-cerveroni-zenu-900g-12005950/p. Marca: ZENU. Nombre del producto: Salchichón Cerveroni x 900 g Descripción del producto: El Salchichón Cerveroni es una opción ideal para quienes buscan un sabor intenso a carne de cerdo en sus comidas. Perfecto para compartir, este producto ofrece una e',
  '🥓', 24950, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202535/salchichon-cerveroni-zenu-900gr-12005950-01.png.png?v=639179729415170000',
  true, 220
),
(
  'a1220000-0000-4000-a104-000000000222', 'b1100000-0000-4000-a110-000000000004', 'JAMON DE CERDO VIANDE LIFE 230 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jamon-cerdo-viande-life-230g-12006364/p. Marca: VIANDE LIFE. Nombre del producto: Jamón de Cerdo Viandé Life 230 g Descripción del producto: Disfruta del delicioso Jamón de Cerdo Viandé Life, una opción premium elaborada con carne de cerdo, ideal para tus comidas diarias. Su sabor auténtico y sua',
  '🥓', 9700, 'Jamones', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202885/jamon-de-cerdo-viande-life-230g-12006364-01.png.png?v=639179828714730000',
  true, 221
),
(
  'a1220000-0000-4000-a104-000000000223', 'b1100000-0000-4000-a110-000000000004', 'MORTADELA JAMONADA VIANDE 400 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mortadela-jamonada-viande-400-g-12007468/p. Marca: VIANDÉ. MORTADELA JAMONADA VIANDE 400 G',
  '🥓', 5990, 'Otros embutidos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204525/Mortadela-jamonada-12007468-1.png?v=639190857492430000',
  true, 222
),
(
  'a1220000-0000-4000-a104-000000000224', 'b1100000-0000-4000-a110-000000000004', 'SALCHICHA MINIMANGUE VIANDÉ 480 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/salchicha-minimangue-viande-480g-12000913/p. Marca: VIANDÉ. Nombre del producto: Salchicha Minimangue Viandé 480g Descripción del producto: Disfruta de la deliciosa Salchicha Minimangue Viandé, ideal para preparar salchipapas y perros calientes. Es perfecto para añadir un toque delicioso a tus co',
  '🛒', 7150, 'Salchichas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204023/salchicha-minimanguera-viande-480-g-01.png?v=639189012670530000',
  true, 223
),
(
  'a1220000-0000-4000-a104-000000000225', 'b1100000-0000-4000-a110-000000000004', 'ARANDANOS 125 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/arandanos-125g-12002590/p. Marca: D1. Nombre de el producto: Arándanos Descripción del producto: Pequeños, jugosos y llenos de sabor, los arándanos frescos son perfectos para disfrutar solos o como complemento en una gran variedad de recetas. Su textura firme y su característico sabor ligeramente',
  '🛒', 6500, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200732/arandanos-la-huerta-125gr-12002590-01.png.png?v=639179667427970000',
  true, 224
),
(
  'a1220000-0000-4000-a104-000000000226', 'b1100000-0000-4000-a110-000000000004', 'TOMATE CHONTO X 1000 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tomate-chonto-x-1000g-12005556/p. Marca: D1. Nombre del producto: Tomate Chonto X 1000 G Descripción del producto: El tomate chonto es una variedad de tamaño mediano, piel lisa y color rojo intenso, ideal para todo tipo de preparaciones. Su pulpa jugosa y consistencia firme lo hacen perfecto para',
  '🛒', 4700, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203109/tomante-chonto-la-huerta-1000gr-12005556-01.png?v=639179837110530000',
  true, 225
),
(
  'a1220000-0000-4000-a104-000000000227', 'b1100000-0000-4000-a110-000000000004', 'LIMON TAHITI X 1000 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/limon-tahiti-x-1000g-12005541/p. Marca: D1. Nombre del producto: Limón Tahití Descripción del producto: Disfruta de el limón Tahití se caracteriza por su tamaño mediano a grande, piel lisa de color verde intenso y un jugo abundante con un sabor cítrico equilibrado. Es perfecto para aderezar comid',
  '🛒', 3900, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202326/limon-tahiti-la-huerta-500gr-12002011-01.png.png?v=639179706570070000',
  true, 226
),
(
  'a1220000-0000-4000-a104-000000000228', 'b1100000-0000-4000-a110-000000000004', 'PAPA CAPIRA X 2500 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papa-capira-x-2500g-12006191/p. Marca: D1. Nombre del producto: Papa Capira Descripción del producto: Disfruta de la papa capira es una variedad de piel amarilla y textura firme, muy apreciada por su sabor y versatilidad en la cocina. Es ideal para freír, hervir, hornear o preparar guisos y sopas',
  '🛒', 9990, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202687/papa-capira-la.huerta-2500g-12006191-01.png.png?v=639179735218770000',
  true, 227
),
(
  'a1220000-0000-4000-a104-000000000229', 'b1100000-0000-4000-a110-000000000004', 'FRESA CONGELADA TREE FRUTS 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/fresa-congelada-tree-fruts-500g-12002531/p. Marca: TREE FRUTS. Nombre del producto: Fresa Congelada 500g - Tree Fruts Descripción del producto: Disfruta del sabor natural y refrescante de la Fresa Congelada Tree Fruts. Este producto natural es ideal para preparar jugos, postres, mermeladas y sals',
  '🛒', 6450, 'Congelado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200700/fresa-congelada-tree-fruts-500gr-12002531-01.png.png?v=639179666737830000',
  true, 228
),
(
  'a1220000-0000-4000-a104-000000000230', 'b1100000-0000-4000-a110-000000000004', 'CEBOLLA CABEZONA X 1000G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cebolla-cabezona-x-1000g-12005767/p. Marca: D1. Nombre del producto: Cebolla Cabezona X 1000 G Descripción del producto: La cebolla cabezona es un ingrediente básico en la cocina, apreciado por su sabor característico y su versatilidad. Con una textura firme y una piel externa seca, es ideal para',
  '🛒', 4900, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202370/cebolla-cabezona-la-huerta-12005767-01.png.png?v=639179726585700000',
  true, 229
),
(
  'a1220000-0000-4000-a104-000000000231', 'b1100000-0000-4000-a110-000000000004', 'LECHUGA VERDE CRESPA X 180 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/lechuga-verde-crespa-x-180g-12005805/p. Marca: D1. Nombre del producto: Lechuga Verde Crespa Descripción del producto: Disfruta de la lechuga verde crespa, se distingue por sus hojas rizadas, frescas y de color vibrante. Su textura crujiente y su sabor suave la hacen perfecta para ensaladas, wrap',
  '🛒', 2600, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202423/lechuga-verde-crespa-la-huerta-180g-12005805-01.png.png?v=639179727456970000',
  true, 230
),
(
  'a1220000-0000-4000-a104-000000000232', 'b1100000-0000-4000-a110-000000000004', 'ZANAHORIA X 1000 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/zanahoria-x-1000g-12002258/p. Marca: D1. Nombre del producto: Zanahoria Descripción del producto: La zanahoria es una hortaliza versátil y deliciosa, perfecta para consumir cruda como snack, en jugos, ensaladas, guisos, cremas y muchas preparaciones más. Su textura crujiente y sabor ligeramente d',
  '🛒', 3200, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200516/zanahoria-la-huerta-1000g-12002258-01.png.png?v=639179662568030000',
  true, 231
),
(
  'a1220000-0000-4000-a104-000000000233', 'b1100000-0000-4000-a110-000000000004', 'AJO MALLA 3 UNIDADES Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/ajo-malla-3-und-100g-12002709/p. Marca: D1. Nombre del producto: Ajo malla 3 unidades Descripción del producto: Disfruta del ajo, es un ingrediente esencial en la cocina, reconocido por su sabor intenso y aroma inconfundible. Cada cabeza contiene múltiples dientes que se pueden utilizar frescos, ',
  '🛒', 1050, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200818/ajo-malla-la-huerta-100gr-12002709-01.png.png?v=639179669388300000',
  true, 232
),
(
  'a1220000-0000-4000-a104-000000000234', 'b1100000-0000-4000-a110-000000000004', 'PLÁTANO X 1000 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/platano-harton-x-1000g-12000110/p. Marca: D1. Nombre del producto: Plátano x 1000 G Descripción del producto: No puede faltar en tu cocina el plátano hartón, es una variedad tradicional de gran tamaño, con piel gruesa y firme, ideal para cocinar. Versátil y sabroso, es perfecto para preparar rece',
  '🛒', 3400, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198981/platano-verde-la-huerta-1000gr-12000110-01.png.png?v=639179630902370000',
  true, 233
),
(
  'a1220000-0000-4000-a104-000000000235', 'b1100000-0000-4000-a110-000000000004', 'MANZANA ROYAL GALA 1000 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/manzana-royal-gala-1000g-12000109/p. Marca: D1. Nombre del producto: Manzana Descripción del producto: Disfruta la manzana, crujiente, jugosa y con un equilibrio perfecto entre dulzura y acidez, la manzana es una fruta clásica que se disfruta en cualquier momento del día. Ideal para consumir sola',
  '🛒', 10800, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198978/manzana-royal-gala-la-huerta-1000g-12000109-01.png.png?v=639179630887830000',
  true, 234
),
(
  'a1220000-0000-4000-a104-000000000236', 'b1100000-0000-4000-a110-000000000004', 'PIMENTÓN UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pimenton-unidad-12005183/p. Marca: D1. Nombre del producto: Pimentón Descripción del producto: Disfruta de el pimentón es una hortaliza de piel brillante y crujiente, con un sabor dulce y suave, es perfecto para añadir color y sabor a una gran variedad de platos, desde ensaladas hasta sofritos, g',
  '🛒', 1300, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202199/pimenton-1-und-la-huerta-12003371-01.png.png?v=639179704158630000',
  true, 235
),
(
  'a1220000-0000-4000-a104-000000000237', 'b1100000-0000-4000-a110-000000000004', 'BANANO UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/banano-12005468/p. Marca: D1. Nombre del producto: Banano Descripción del producto: Disfruta del banano es una fruta tropical de pulpa suave, dulce y de sabor agradable. Su cáscara fácil de pelar lo convierte en una opción práctica para consumir en cualquier momento del día, ya sea solo, en batid',
  '🛒', 550, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202285/banano-la-huerta-1-und-12005468-01.png.png?v=639179705665300000',
  true, 236
),
(
  'a1220000-0000-4000-a104-000000000238', 'b1100000-0000-4000-a110-000000000004', 'PIÑAS GOLDEN UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pinas-golden-12003720/p. Marca: D1. Nombre del producto: Piña Descripción del producto: Disfruta de la piña es una fruta tropical con una piel exterior gruesa y espinosa, que oculta una pulpa jugosa y dulce. Su sabor refrescante y su aroma intenso la convierten en el complemento ideal para disfru',
  '🛒', 6990, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201459/pina-golden-la-huerta-1-und-12003720-01.png.png?v=639179689864270000',
  true, 237
),
(
  'a1220000-0000-4000-a104-000000000239', 'b1100000-0000-4000-a110-000000000004', 'CEBOLLA ROJA X 1000 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cebolla-roja-x-1000g-12006186/p. Marca: D1. Nombre del producto: Cebolla roja X 1000 G Descripción del producto: Con su distintivo color morado intenso y sabor ligeramente dulce, la cebolla roja es perfecta para darle color y carácter a una gran variedad de platos. Es ideal para usar en ensaladas',
  '🛒', 5900, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202672/cebolla-roja-la-huerta-1000gr-12006186-01.png.png?v=639179735045400000',
  true, 238
),
(
  'a1220000-0000-4000-a104-000000000240', 'b1100000-0000-4000-a110-000000000004', 'KIWI ESTUCHE X 400 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/kiwi-estuche-x-400g-12006189/p. Marca: D1. Nombre del producto: KIWI Descripción del producto: Disfruta del kiwi, es una fruta exótica de pulpa verde vibrante, sabor dulce con un toque ácido y una textura jugosa. Su piel marrón y ligeramente vellosa protege un interior lleno de sabor, perfecto pa',
  '🛒', 8300, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202684/kiwi-la-huerta-400g-12006189-01.png.png?v=639179735189230000',
  true, 239
),
(
  'a1220000-0000-4000-a104-000000000241', 'b1100000-0000-4000-a110-000000000004', 'MANGO VARIEDAD UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mango-12006220/p. Marca: D1. Nombre del producto: Mango Descripción del producto: Disfruta del el mango, es una fruta tropical de pulpa jugosa, aroma intenso y sabor dulce con un toque ácido. Su piel puede variar entre tonos verdes, amarillos y rojizos, mientras que su interior es suave y vibrant',
  '🛒', 5300, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202715/mango-la-huerta-1und-12006220-01.png.png?v=639179735801430000',
  true, 240
),
(
  'a1220000-0000-4000-a104-000000000242', 'b1100000-0000-4000-a110-000000000004', 'PAPAYA UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papaya-12006187/p. Marca: D1. Nombre del producto: Papaya Descripción del producto: Disfruta de la papaya es una fruta tropical de pulpa suave, jugosa y de sabor dulce, con un color vibrante que va desde el naranja hasta el rojo. Ideal para disfrutar sola, en batidos, ensaladas de frutas o como i',
  '🛒', 6600, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202676/papaya-la-huerta-1und-12006187-01.png.png?v=639179735105700000',
  true, 241
),
(
  'a1220000-0000-4000-a104-000000000243', 'b1100000-0000-4000-a110-000000000004', 'ESPINACA X 200G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/espinaca-x-200g-12006666/p. Marca: D1. Nombre del producto: Espinaca Descripción del producto: La espinaca es una hoja verde de textura suave y sabor delicado, ideal para usar en ensaladas, salteados, sopas, pastas, tortillas y muchas otras recetas. Su color vibrante y su versatilidad en la cocin',
  '🛒', 4200, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203072/espinaca-la-huerta-200g-12006666-01.png.png?v=639179831656430000',
  true, 242
),
(
  'a1220000-0000-4000-a104-000000000244', 'b1100000-0000-4000-a110-000000000004', 'AGUACATE Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/aguacate-12002754/p. Marca: D1. Nombre de el producto: Aguacate Descripción del producto: Disfruta del exquisito sabor del aguacate, se caracteriza por su tamaño generoso, pulpa firme y sabor suave. Su cáscara lisa y delgada facilita la preparación, haciéndolo ideal para acompañar comidas, prepar',
  '🛒', 6950, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200852/aguacate-la-huerta-1und-12002754-01.png.png?v=639179669944270000',
  true, 243
),
(
  'a1220000-0000-4000-a104-000000000245', 'b1100000-0000-4000-a110-000000000004', 'MANZANA VERDE 850 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/manzana-verde-850g-12006029/p. Marca: D1. Nombre del producto: Manzana Verde Descripción del producto: Disfruta la manzana verde, se reconoce por su piel brillante, textura crujiente y sabor intensamente ácido con un toque refrescante. Es ideal para disfrutar sola, añadir a ensaladas, postres, ju',
  '🛒', 10100, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202599/manzana-verde-la-huerta-850g-12006029-01.png.png?v=639179730423900000',
  true, 244
),
(
  'a1220000-0000-4000-a104-000000000246', 'b1100000-0000-4000-a110-000000000004', 'PEPINO COHOMBRO UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pepino-cohombro-12007747/p. Marca: D1. Pepino Cohombro Unidad Encuéntralo en Tiendas D1. Compra Ya',
  '🥬', 1200, 'Verduras', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203735/pepino-cohombro-la-huerta-1-und-12007747-01.png.png?v=639179863838330000',
  true, 245
),
(
  'a1220000-0000-4000-a104-000000000247', 'b1100000-0000-4000-a110-000000000004', 'MORA CONGELADA TREE FRUTS 500 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mora-congelada-tree-fruts-500g-12002530/p. Marca: TREE FRUTS. Nombre del producto: Mora Congelada 500g - Tree Fruits Descripción del producto: Disfruta de la frescura natural de la Mora Congelada Tree Fruits, perfecta para preparar jugos, smoothies o consumir en fresco, ideal para quienes buscan ',
  '🛒', 6700, 'Congelado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200696/mora-congelada-tree-fruts-500gr-12002530-01.png.png?v=639179666631270000',
  true, 246
),
(
  'a1220000-0000-4000-a104-000000000248', 'b1100000-0000-4000-a110-000000000004', 'CEBOLLA LARGA 500 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cebolla-larga-500g-12003363/p. Marca: D1. Nombre del producto: Cebolla larga Descripción del producto: Disfruta la cebolla larga, también conocida como cebolla verde o junca, es un ingrediente imprescindible en la cocina por su sabor suave y fresco. Su tallo alargado y hojas verdes se utilizan ta',
  '🛒', 3500, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201165/cebolla-larga-la-huerta-500gr-12003363-01.png.png?v=639179676745470000',
  true, 247
),
(
  'a1220000-0000-4000-a104-000000000249', 'b1100000-0000-4000-a110-000000000004', 'TOMATE CHERRY 250 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/tomate-cherry-250g-12003716/p. Marca: D1. Nombre del producto: Tomate Cherry Descripción del producto: Pequeños, brillantes y llenos de sabor, los tomates cherry son perfectos para añadir un toque fresco y colorido a tus platos. Su tamaño compacto y su sabor naturalmente dulce los hacen ideales p',
  '🛒', 4700, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/205157/tomate-cherry-la-huerta-250g-12003716-01.png?v=639198412174670000',
  true, 248
),
(
  'a1220000-0000-4000-a104-000000000250', 'b1100000-0000-4000-a110-000000000004', 'CHAMPIÑON 250 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/champinon-250g-12006032/p. Marca: D1. Nombre del producto: Champiñón blanco Descripción del producto: Disfruta del champiñón blanco es un ingrediente versátil y apreciado por su suave sabor y textura delicada. Perfecto para saltear, asar, agregar a pastas, pizzas, ensaladas o preparar como acompa',
  '🛒', 7200, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202602/champinon-blanco-surtido-setas-doradas-250gr-12006032-a-01.png.png?v=639179730440600000',
  true, 249
),
(
  'a1220000-0000-4000-a104-000000000251', 'b1100000-0000-4000-a110-000000000004', 'PAPA PAREJA 2500G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/12009027	papa-pareja-2500g/p. Marca: 20.09. PAPA PAREJA 2500G',
  '🥬', 6900, 'Hortalizas', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204297/papa-pareja-la-huerta-2500g-12009027-01.png?v=639190341359130000',
  true, 250
),
(
  'a1220000-0000-4000-a104-000000000252', 'b1100000-0000-4000-a110-000000000004', 'CILANTRO UNIDAD 100G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cilantro-unidad-100g/p. Marca: D1. CILANTRO UNIDAD 100G',
  '🥬', 2990, 'Verduras', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204290/cilantro-Fruver-12007450-1.png?v=639199149979600000',
  true, 251
),
(
  'a1220000-0000-4000-a104-000000000253', 'b1100000-0000-4000-a110-000000000004', 'PAPA CRIOLLA 1000G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/12007453	papa-criolla-1000g/p. Marca: D1. PAPA CRIOLLA 1000G',
  '🥬', 6900, 'Frutas y verduras', 'https://d1tiendas.vteximg.com.br/arquivos/ids/205153/papa-criolla-verduras-y-frutas-12007453-01.png?v=639198409977100000',
  true, 252
),
(
  'a1220000-0000-4000-a104-000000000254', 'b1100000-0000-4000-a110-000000000004', 'AHUYAMA VARIEDAD UNIDAD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/ahuyama-variedad-unidad-12006188/p. Marca: D1. Nombre del producto: Ahuyama Descripción del producto: Descubre el sabor y los beneficios de la ahuyama, también conocida como calabaza o zapallo. Cultivada con prácticas sostenibles, ideal para una alimentación equilibrada. Su textura suave y sabor ',
  '🛒', 2900, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202680/ahuyama-la-huerta-1-und-12006188-01.png.png?v=639179735142370000',
  true, 253
),
(
  'a1220000-0000-4000-a104-000000000255', 'b1100000-0000-4000-a110-000000000004', 'MANDARINA IMPORTADA X 600G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mandarina-importada-x-600g-12006783/p. Marca: D1. Nombre del producto: Mandarina Descripción del producto: La mandarina es una fruta cítrica de piel delgada y fácil de pelar, con gajos jugosos y un sabor dulce con un toque ácido. Su aroma fresco y su practicidad la hacen perfecta para disfrutar c',
  '🛒', 8400, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/205154/mandarina-importada-600g-12006783-01.png?v=639198410941170000',
  true, 254
),
(
  'a1220000-0000-4000-a104-000000000256', 'b1100000-0000-4000-a110-000000000004', 'NARANJA X 2000 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/naranja-x-2000g-12000182/p. Marca: D1. Nombre del producto: Naranja Descripción del producto: Disfruta de la Naranja, jugosa, aromática y con un sabor naturalmente dulce, es una fruta versátil ideal para consumir fresca, preparar jugos, postres o usar en una amplia variedad de recetas. Su pulpa c',
  '🛒', 6600, 'Fresco', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199090/naranja-la-huerta-2000gr-12000182-01.png.png?v=639179633124970000',
  true, 255
),
(
  'a1220000-0000-4000-a104-000000000257', 'b1100000-0000-4000-a110-000000000004', 'TOALLAS HÚMEDAS 99.9% AGUA LITTLE ANGELS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toallitas-humedas-99-agua-little-angels-12007311/p. Marca: LITTLE ANGELS. Toallas Húmedas 99.9% Agua Little Angels Encuéntralo en Tiendas D1. Compra Ya',
  '👶', 5990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204762/toallitas-humedas-little-angels-60-und-12007311-01.png.png?v=639191268710430000',
  true, 256
),
(
  'a1220000-0000-4000-a104-000000000258', 'b1100000-0000-4000-a110-000000000004', 'COPITOS LITTLE ANGELS 100 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/copitos-little-angels-100-und-12000964/p. Marca: LITTLE ANGELS. Nombre del producto: Copitos LITTLE ANGELS 100 und - C2 SOLUCIONES S.A.S. Descripción del producto: Los Copitos LITTLE ANGELS están elaborados con algodón absorbente, bambú y aglutinante, lo que los hace biodegradables, suaves y alta',
  '👶', 2490, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200072/copitos-de-algodon-little-angels-100und-12000964-01.png.png?v=639179652955370000',
  true, 257
),
(
  'a1220000-0000-4000-a104-000000000259', 'b1100000-0000-4000-a110-000000000004', 'CREMA DERMOPROTECTORA LITTLE ANGELS 150G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crema-dermoprotectora-little-angels-150g-12000700/p. Marca: LITTLE ANGELS. Nombre del producto: Crema Dermoprotectora LITTLE ANGELS 150g Descripción del producto: La Crema Dermoprotectora LITTLE ANGELS está diseñada para proteger y humectar la piel del bebé. Contiene ingredientes como aloe vera, ',
  '👶', 6990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199901/crema-dermoprotectora-little-angels-150gr-12000700-01.png.png?v=639179649199700000',
  true, 258
),
(
  'a1220000-0000-4000-a104-000000000260', 'b1100000-0000-4000-a110-000000000004', 'JABÓN LITTLE ANGELS 110G 3U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-little-angels-110g-3-und-12005498/p. Marca: LITTLE ANGELS. Nombre del Producto: Jabón Cremoso LITTLE ANGELS Descripción del producto: Descubre el Jabón Cremoso de la marca LITTLE ANGELS, especialmente formulado para limpiar y suavizar la piel de los bebés y niños. Es ideal para el cuidado d',
  '👶', 5300, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204717/jabon-little-angels-110g-3u-01.png?v=639191256554370000',
  true, 259
),
(
  'a1220000-0000-4000-a104-000000000261', 'b1100000-0000-4000-a110-000000000004', 'ALGODÓN LITTLE ANGELS 50 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/algodon-little-angels-50g-12000965/p. Marca: LITTLE ANGELS. Nombre del producto: Algodón 50 g LITTLE ANGELS Descripción del producto: Algodón purificado de la marca Little Angels, ideal para uso medicinal y aplicación de medicamentos tópicos. Producto suave, resistente y absorbente, elaborado par',
  '👶', 1990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204723/algodon-little-angels-50gr-12000965-01.png.png?v=639191261841300000',
  true, 260
),
(
  'a1220000-0000-4000-a104-000000000262', 'b1100000-0000-4000-a110-000000000004', 'SHAMPOO PARA BEBE LITTLE ANGELS 360 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/shampoo-para-bebe-little-angels-360ml-12002443/p. Marca: LITTLE ANGELS. SHAMPOO PARA BEBE LITTLE ANGELS 360 ML',
  '👶', 4990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200629/shampoo-para-bebe-little-angels-360ml-12002443-01.png.png?v=639179665046270000',
  true, 261
),
(
  'a1220000-0000-4000-a104-000000000263', 'b1100000-0000-4000-a110-000000000004', 'PAÑAL LITTLE ANGELS TALLA XXG 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panal-little-angels-30-und-12002425/p. Marca: LITTLE ANGELS. Nombre del producto: Pañales Desechables LITTLE ANGELS Talla XXG 30 und Descripción del producto: Los Pañales Desechables LITTLE ANGELS Talla XXG están diseñados para ofrecer una protección completa y máxima comodidad para tu bebé. Fabr',
  '🛒', 28950, 'Etapa 3', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204737/panal-talla-xxg-little-angels-30-und-01.png?v=639191265375970000',
  true, 262
),
(
  'a1220000-0000-4000-a104-000000000264', 'b1100000-0000-4000-a110-000000000004', 'SHAMPOO GEL DE BAÑO LITTLE ANGELS 400ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/shampoo-gel-bano-little-angels-400ml-12006223/p. Marca: LITTLE ANGELS. Nombre del producto: Shampoo &amp; Gel de Baño LITTLE ANGELS 400 ml Descripción del producto: El Shampoo &amp; Gel de Baño LITTLE ANGELS 2 en 1 es ideal para la delicada piel y el cabello del bebé. Su fórmula suave y hipoalerg',
  '👶', 6990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204718/shampoo-gel-de-bano-little-angels-400ml-01.png?v=639191257644700000',
  true, 263
),
(
  'a1220000-0000-4000-a104-000000000265', 'b1100000-0000-4000-a110-000000000004', 'PAÑAL LITTLE ANGELS TALLA G 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panal-little-angels-30-und-12002040/p. Marca: LITTLE ANGELS. Nombre del producto: Pañales Desechables LITTLE ANGELS Talla G 30 und Descripción del producto: Los Pañales Desechables LITTLE ANGELS Talla G ofrecen comodidad, protección y absorción para tu bebé. Diseñados con materiales de alta calid',
  '👶', 22250, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204748/panal-little-angels-infantil-30-und-12002040-01.png.png?v=639191266529100000',
  true, 264
),
(
  'a1220000-0000-4000-a104-000000000266', 'b1100000-0000-4000-a110-000000000004', 'PAÑAL LITTLE ANGELS TALLA XG 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panal-little-angels-30-und-12002043/p. Marca: LITTLE ANGELS. Nombre del producto: Pañales Desechables LITTLE ANGELS Talla XG 30 und Descripción del producto: Los Pañales Desechables LITTLE ANGELS Talla XG están diseñados para brindar comodidad y máxima absorción para tu bebé. Fabricados con mater',
  '👶', 24950, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204742/panal-talla-xg-little-angels-30-und-01.png?v=639191265915330000',
  true, 265
),
(
  'a1220000-0000-4000-a104-000000000267', 'b1100000-0000-4000-a110-000000000004', 'PEINA FACIL LITTLE ANGELS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/peine-facil-little-angels-12006402/p. Marca: LITTLE ANGELS. Peina Facil Little Angels Encuéntralo en Tiendas D1. Compra Ya',
  '👶', 8500, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202904/peina-facil-little-angels-250ml-12006402-01.png.png?v=639179828848430000',
  true, 266
),
(
  'a1220000-0000-4000-a104-000000000268', 'b1100000-0000-4000-a110-000000000004', 'COLONIA LITTLE ANGELS 200 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/colonia-little-angels-200ml-12006222/p. Marca: LITTLE ANGELS. Nombre del producto: Colonia Bebé LITTLE ANGELS 200 ml Descripción del producto: La colonia para bebé LITTLE ANGELS ofrece una delicada fragancia hipoalergénica, sin alcohol, ideal para cuidar y perfumar la piel de los más pequeños. Pr',
  '👶', 6990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204721/colonia-bebe-little-angels-200ml-12006222-04.png.png?v=639191260512570000',
  true, 267
),
(
  'a1220000-0000-4000-a104-000000000269', 'b1100000-0000-4000-a110-000000000004', 'PAÑAL LITTLE ANGELS TALLA P 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panal-little-angels-30-und-12002042/p. Marca: LITTLE ANGELS. Nombre del producto: Pañales Desechables LITTLE ANGELS Talla P 30 und Descripción del producto: Los Pañales Desechables LITTLE ANGELS Talla P ofrecen una absorción eficiente y un ajuste cómodo para los recién nacidos. Fabricados con mat',
  '👶', 14950, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204732/panal-talla-p-little-angels-30-und-01.png?v=639191264500770000',
  true, 268
),
(
  'a1220000-0000-4000-a104-000000000270', 'b1100000-0000-4000-a110-000000000004', 'PAÑAL LITTLE ANGELS TALLA M 30 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panal-little-angels-30-und-12002041/p. Marca: LITTLE ANGELS. Nombre del producto: Pañales Desechables LITTLE ANGELS Talla M 30 und Descripción del producto: Los Pañales Desechables LITTLE ANGELS Talla M están diseñados para brindar protección, absorción y comodidad durante más tiempo. Con materia',
  '👶', 17950, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204753/panal-etapa-2-m-little-angels-infantil-30-und-12002041-01.png.png?v=639191267093100000',
  true, 269
),
(
  'a1220000-0000-4000-a104-000000000271', 'b1100000-0000-4000-a110-000000000004', 'COMPOTA SABORES SURTIDOS CHIQUI CHUPS 120G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/compota-sabores-surtidos-chiqui-chups-120-g-12007939/p. Marca: CHIQUI CHUPS. COMPOTA SABORES SURTIDOS CHIQUI CHUPS 120G',
  '🛒', 1850, 'Alimentación', 'https://d1tiendas.vteximg.com.br/arquivos/ids/205098/compota-chiqui-chups-12007939-0.png?v=639198300646930000',
  true, 270
),
(
  'a1220000-0000-4000-a104-000000000272', 'b1100000-0000-4000-a110-000000000004', 'CREMA HUMECTANTE LITTLE ANGELS 400 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crema-humectante-little-angels-400-ml-12007925/p. Marca: LITTLE ANGELS. CREMA HUMECTANTE LITTLE ANGELS 400 ML',
  '👶', 6990, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/205094/crema-humectante-bebe-little-angels-12007925-1.png?v=639198295828800000',
  true, 271
),
(
  'a1220000-0000-4000-a104-000000000273', 'b1100000-0000-4000-a110-000000000004', 'CUADERNO DOBLE O 80 HOJAS RAYADO ( 21 CM X 28 CM) T26 ALETRÍA X1 U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cuaderno-doble-o-80h-aletria-12004957/p. Marca: ALETRIA. Nombre del Producto: Cuaderno Argollado 80 Hojas RAYADO T25 Descripción del producto: Cuaderno argollado con diseño atractivo y práctico. Ideal para actividades escolares, universitarias o de oficina. Cuenta con hojas rayadas para facilitar',
  '🛒', 4490, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203924/cuaderno-argollado-rayado-12004957-01.png?v=639188777217900000',
  true, 272
),
(
  'a1220000-0000-4000-a104-000000000274', 'b1100000-0000-4000-a110-000000000004', 'LÁPICES TRIANGULARES HB T26 ALETRÍA X6UDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/lapices-triangulares-hb-aletria-6-und-12004899/p. Marca: ALETRIA. Nombre del Producto: Lápices Triangulares HB T25 x 6 UDS Descripción del producto: Set de lápices triangulares ergonómicos ideales para escritura, delineado y dibujo. Ofrecen un trazo suave y preciso gracias a su mina resistente y ',
  '🛒', 2200, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203945/lapices-triangulares-12004899-01.png?v=639188915705270000',
  true, 273
),
(
  'a1220000-0000-4000-a104-000000000275', 'b1100000-0000-4000-a110-000000000004', 'CRAYONES ALETRÍA X12UDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crayones-aletria-12-und-12005818/p. Marca: ALETRIA. Nombre del Producto: Crayones x12 UDS Descripción del producto: Set de crayones ideales para que los niños desarrollen su creatividad a través del dibujo y el color. Fáciles de usar, seguros y con colores intensos. Características del Producto: ',
  '🛒', 4990, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203944/crayones-12005818-01.png?v=639188915392670000',
  true, 274
),
(
  'a1220000-0000-4000-a104-000000000276', 'b1100000-0000-4000-a110-000000000004', 'CARPA DE JUEGO PLEGABLE SPACE DOT X1U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/carpa-juego-plegable-space-dot-12007577/p. Marca: SPACE DOT. Carpa De Juego Plegable Space Dot X1U. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 49900, 'Juguetería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203970/carpa-de-juego-plegable-12007577.png?v=639188923860630000',
  true, 275
),
(
  'a1220000-0000-4000-a104-000000000277', 'b1100000-0000-4000-a110-000000000004', 'CARRO DE FRICCION RUEDAS GRANDES SPACE DOT X1U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/carro-friccion-ruedas-grandes-space-dot-12007580/p. Marca: SPACE DOT. Carro De Friccion Ruedas Grandes Space Dot X1U. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 29900, 'Juguetería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203956/carro-de-friccion-ruedas-grandes-12007580.png?v=639188919295500000',
  true, 276
),
(
  'a1220000-0000-4000-a104-000000000278', 'b1100000-0000-4000-a110-000000000004', 'SET DE ARENA FRUTAS MÁGICAS SPACE DOT X1U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/set-arena-frutas-magicas-space-dot-12007676/p. Marca: SPACE DOT. Set De Arena Frutas Mágicas Space Dot X1U. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 34900, 'Juguetería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203967/set-arena-frutas-magicas-12007676.png?v=639188922799100000',
  true, 277
),
(
  'a1220000-0000-4000-a104-000000000279', 'b1100000-0000-4000-a110-000000000004', 'SET CARROS METALICOS SPACE DOT X2 Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/set-carros-metalicos-space-dot-x2-12007666/p. Marca: SPACE DOT. Set Carros Metalicos Space Dot X2. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 10900, 'Juguetería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203966/set-carros-metalicos-coleccionables-12007666.png?v=639188922497670000',
  true, 278
),
(
  'a1220000-0000-4000-a104-000000000280', 'b1100000-0000-4000-a110-000000000004', 'MARCADORES PERMANENTES DELGADOS X 10 UDS ALETRÍA X1 U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/marcadores-permanentes-delgados-aletria-10-und-12007683/p. Marca: ALETRIA. Marcadores Permanentes Delgados X 10 Uds Aletría X1 U. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 5900, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203918/marcadores-permanentes-delgados-12007683-01.png?v=639188773897000000',
  true, 279
),
(
  'a1220000-0000-4000-a104-000000000281', 'b1100000-0000-4000-a110-000000000004', 'SET BOLÍGRAFO GRIP - GEL (2 AZULES 1 ROJO) ALETRÍA X3UDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/set-boligrafo-grip-gel-azul-rojo-aletria-3-und-12007694/p. Marca: ALETRIA. Set Bolígrafo Grip - Gel (2 Azules 1 Rojo) Aletría X3Uds. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 4900, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203912/set-boligrafo-grip-gel-azules-rojo-12007694-01.png?v=639188768939670000',
  true, 280
),
(
  'a1220000-0000-4000-a104-000000000282', 'b1100000-0000-4000-a110-000000000004', 'MARCADOR PERMANENTE GRUESO ALETRÍA X4 UDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/marcador-permanente-grueso-aletria-4-und-12007760/p. Marca: ALETRIA. Marcador Permanente Grueso Aletría X4 Uds. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 4900, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203919/marcador-permanente-grueso-12007760-01.png?v=639188774135230000',
  true, 281
),
(
  'a1220000-0000-4000-a104-000000000283', 'b1100000-0000-4000-a110-000000000004', 'BOLÍGRAFOS COLORES ALETRÍA X5 UDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/boligrafos-colores-aletria-5-und-12007820/p. Marca: ALETRIA. Bolígrafos Colores Aletría X5 Uds. Encuentra en Tiendas D1. Compra Ya',
  '🛒', 4900, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203922/boligrafos-colores-12007820-01.png?v=639188776018970000',
  true, 282
),
(
  'a1220000-0000-4000-a104-000000000284', 'b1100000-0000-4000-a110-000000000004', 'SET TEMPERAS Y PINCEL T26 ALETRÍA X6 U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/set-temperas-pincel-aletria-6-und-12004892/p. Marca: ALETRIA. Nombre del Producto: Cuaderno 3D Infantil Aletría Descripción del producto: Divertido cuaderno infantil con diseños animados en 3D. Ideal para estimular la creatividad de los niños y hacer más entretenidas sus actividades escolares y p',
  '🛒', 3750, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203943/set-temperas-y-pincel-12004892-01.png?v=639188915054700000',
  true, 283
),
(
  'a1220000-0000-4000-a104-000000000285', 'b1100000-0000-4000-a110-000000000004', 'MINI GRAPADORA CON GANCHOS ALETRÍA X1 U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mini-grapadora-ganchos-aletria-12005763/p. Marca: ALETRIA. Nombre del Producto: Mini Grapadora con Ganchos Descripción del producto: Mini grapadora de tamaño práctico, ligera y fácil de transportar. Ideal para uso en el hogar, la oficina o el estudio. Características del Producto: Compacta y livi',
  '🛒', 5900, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203942/mini-grapadora-con-ganchos-12005763-01.png?v=639188914760000000',
  true, 284
),
(
  'a1220000-0000-4000-a104-000000000286', 'b1100000-0000-4000-a110-000000000004', 'SHAMPOO JOHNSON''S BABY ORIGINAL 200ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/shampoo-johnsons-baby-original-200ml-12005826/p. Marca: JOHNSON''S BABY. Nombre del producto: Johnson''s Baby Original Shampoo 200 mL Descripción del producto: Johnson''s Baby Original Shampoo está diseñado para ofrecer una limpieza suave y segura para el cabello y cuero cabelludo del bebé. Su fórmu',
  '👶', 14950, 'Cuidado del bebé', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202446/shampoo-johnsons-baby-12005826-01.png.png?v=639179727999300000',
  true, 285
),
(
  'a1220000-0000-4000-a104-000000000287', 'b1100000-0000-4000-a110-000000000004', 'CUADERNO DOBLE O 80 HOJAS CUADRICULADO ( 21 CM X 28 CM) T26 ALETRÍA X1 U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cuaderno-doble-o-80h-aletria-12004956/p. Marca: ALETRIA. Nombre del Producto: Cuaderno Doble O 80 Hojas CUADRICULADO ( ) T25 Descripción del producto: Cuaderno con diseño moderno y práctico, ideal para el uso escolar o profesional. Cuenta con hojas cuadriculadas que facilitan el orden y la organi',
  '🛒', 4490, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203925/cuaderno-argollado-cuadriculado-12004956-01.png?v=639188777420570000',
  true, 286
),
(
  'a1220000-0000-4000-a104-000000000288', 'b1100000-0000-4000-a110-000000000004', 'ETIQUETAS ADHESIVAS PARA MARCAR ALETRÍA X64UDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/etiquetas-adhesivas-marcar-aletria-64-und-12006689/p. Marca: ALETRIA. Nombre del Producto: Etiquetas Adhesivas para Marcar x64 uds Descripción del producto: Set de etiquetas adhesivas resistentes, en dos tamaños, ideales para personalizar y marcar objetos escolares, personales y de uso diario. Ca',
  '🛒', 4900, 'Escolar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203941/etiquetas-adhesivas-para-marcar-12006689-01.png?v=639188914502030000',
  true, 287
),
(
  'a1220000-0000-4000-a104-000000000289', 'b1100000-0000-4000-a110-000000000004', 'ARENA PARA GATOS 4 5 KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/arena-para-gatos-magic-friends-4-5kg-12000556/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Arena Sanitaria para Gatos 4.5 kg Descripción del producto: Magic Friends Arena Sanitaria para Gatos, una solución natural y eficaz para el manejo de desechos felinos. Características del Pro',
  '🛒', 14850, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203968/arena-para-gato-magic-friends-4500g-12000556-01.png?v=639188923455570000',
  true, 288
),
(
  'a1220000-0000-4000-a104-000000000290', 'b1100000-0000-4000-a110-000000000004', 'BOLSAS DESECHOS DE MASCOTAS M FRIENDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/bolsas-desecho-mascotas-magic-friends-12002831/p. Marca: MAGIC FRIENDS. Nombre del producto: Bolsas Desechos de Mascotas Magic Friends Descripción del producto: Las Bolsas Desechos de Mascotas Magic Friends son la solución perfecta para mantener tu hogar limpio y libre de residuos de mascotas. Co',
  '🧹', 4300, 'Aseo de mascota', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200901/bolsa-desechos-mascotas-magic-friends-60-und-12002831-01.png.png?v=639179670866430000',
  true, 289
),
(
  'a1220000-0000-4000-a104-000000000291', 'b1100000-0000-4000-a110-000000000004', 'PAÑOS HÚMEDOS MAGIC FRIENDS 48 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panos-humedos-magic-friends-48-und-12005526/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Pañitos Húmedos x 50 Descripción del producto: Magic Friends Pañitos Húmedos son ideales para la limpieza externa de tus mascotas (perros y gatos). Fabricados con materiales de alta calidad, ay',
  '🧹', 3950, 'Aseo de mascota', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202316/panos-humedos-mascotas-magic-friends-48und-12005526-01.png.png?v=639179706430300000',
  true, 290
),
(
  'a1220000-0000-4000-a104-000000000292', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO HÚMEDO PARA GATOS WHISKAS 85 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-humedo-gatos-whiskas-85g-12000930/p. Marca: WHISKAS. Nombre del producto: Whiskas Alimento Húmedo para Gatos Adultos 85g Descripción del producto: Whiskas Alimento Húmedo para Gatos Adultos es una opción completa y balanceada que brinda una nutrición de alta calidad. Su fórmula favorece ',
  '🛒', 2750, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200046/alimento-humedo-para-gatos-salmon-carne-pollo-whiskas-85gr-12000930-00.png.png?v=639179652400300000',
  true, 291
),
(
  'a1220000-0000-4000-a104-000000000293', 'b1100000-0000-4000-a110-000000000004', 'GALLETAS PARA GATOS MAGIC FRIENDS 75G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galletas-gatos-magic-friends-75g-12002655/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Galletas para Gatos 75g Descripción del producto: Magic Friends Galletas para Gatos son un suplemento alimenticio diseñado para gatos de todas las razas y edades. Características del Producto: Ta',
  '🛒', 2200, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200743/galletas-para-gato--higado-de-pollo-magic-friends-75gr-12002655-01.png.png?v=639179667758400000',
  true, 292
),
(
  'a1220000-0000-4000-a104-000000000294', 'b1100000-0000-4000-a110-000000000004', 'CÁBANO MAGIC FRIENDS 12 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cabano-magic-friends-12-und-12003748/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Cábano x 12 Descripción del producto: Magic Friends Cábano x 12 es un snack elaborado con Carnaza natural, ideal para perros de todas las razas, edades y tamaños. Diseñado para entretener a tu mascota',
  '🛒', 1990, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201479/cabano-magic-friends-100gr-12003748-01.png.png?v=639179690287800000',
  true, 293
),
(
  'a1220000-0000-4000-a104-000000000295', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO HÚMEDO PERROS PEDIGREE 100 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-humedo-perros-pedigree-100g-12000931/p. Marca: PEDIGREE. Nombre del producto: Alimento Húmedo para Perros Pedigree 100 g Descripción del producto: Nutre a tu mascota con el Alimento Húmedo para Perros Pedigree, una opción deliciosa, completa y balanceada, ideal para perros adultos y cach',
  '🛒', 2750, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204040/alimento-humedo-para-perros-pedigree-100-g-01.png?v=639189036927430000',
  true, 294
),
(
  'a1220000-0000-4000-a104-000000000296', 'b1100000-0000-4000-a110-000000000004', 'GALLETAS PARA PERROS MAGIC FRIENDS 150 G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/galletas-perros-magic-friends-150g-12002319/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Galletas para Perros 150g Descripción del producto: Magic Friends Galletas para Perros son un suplemento alimenticio diseñado para perros de todas las razas y edades. Características del Produc',
  '🛒', 2900, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200549/galletas-para-perros-magic-friends-150gr-12002319-01.png.png?v=639179663312470000',
  true, 295
),
(
  'a1220000-0000-4000-a104-000000000297', 'b1100000-0000-4000-a110-000000000004', 'SNACK CREMOSO PARA GATOS MAGIC FRIENDS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/snack-cremoso-gatos-magic-friends-12006295/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Snack Cremoso para Gatos 56 g Descripción del producto: El snack cremoso Magic Friends es un suplemento alimenticio delicioso y nutritivo para gatos de todas las edades y razas. Elaborado con sa',
  '🛒', 7600, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202795/snack-cremoso-salmon-atun-gatos-magic-friends-56gr-4und-12006295-01.png.png?v=639179827739730000',
  true, 296
),
(
  'a1220000-0000-4000-a104-000000000298', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO P GATOS MAGIC FRIENDS 1000 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-gatos-magic-friends-1000g-12005304/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Concentrado para Gatos Premium 1kg Descripción del producto: Magic Friends Concentrado para Gatos Premium es un alimento seco extruido, completo y balanceado, diseñado para gatos adultos de tod',
  '🛒', 11500, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202252/alimento-completo-para-gatos-premium-magic-friends-1kg-12005304-01.png.png?v=639179705258970000',
  true, 297
),
(
  'a1220000-0000-4000-a104-000000000299', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO PARA GATOS MAGIC FRIENDS 1KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-para-gatos-magic-friends-1kg-12001128/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Alimento para Gatos Adultos 1kg Descripción del producto: Magic Friends Alimento para Gatos Adultos es un concentrado seco completo, diseñado para gatos adultos de todas las razas. Caracterí',
  '🛒', 6250, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200156/alimento-para-gatos-magic-friends1kg-12001128-01.png.png?v=639179654604800000',
  true, 298
),
(
  'a1220000-0000-4000-a104-000000000300', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO COMPLETO PARA PERROS MF 400 GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-completo-perros-magic-friends-400g-12006466/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Alimento Húmedo para Perros Pollo 400g Descripción del producto: Magic Friends presenta su alimento húmedo con sabor a pollo, ideal para cachorros desde los 3 meses y perros adultos de',
  '🛒', 6990, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202940/alimento-completo-para-perros-magic-friends-400gr-12006466-01.png.png?v=639179829246900000',
  true, 299
),
(
  'a1220000-0000-4000-a104-000000000301', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO HÚMEDO GATITOS 85G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-humedo-gatitos-whiskas-85g-12003277/p. Marca: WHISKAS. Nombre del producto: Whiskas Alimento Húmedo para Gatitos Sabor Pollo 85g Descripción del producto: Whiskas Alimento Húmedo para Gatitos sabor pollo ofrece una nutrición diaria completa para gatitos en crecimiento, ideal para facilit',
  '🛒', 2750, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201086/comida-humeda-surtida-gatitos-whiskas-85gr-12003277-00.png.png?v=639179674635100000',
  true, 300
),
(
  'a1220000-0000-4000-a104-000000000302', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO PARA PERRO MAGIC FRIENDS 8KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-para-perro-magic-friends-8kg-12001971/p. Marca: MAGIC FRIENDS. Nombre del Producto: Magic Friends Alimento para Perro 8kg Descripción del producto: Magic Friends Alimento para Perro 8kg es un alimento completo y extruido para perros adultos de todas las razas. Características: Tamaño: 55',
  '🛒', 33950, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200412/alimento-para-perro-magic-friends-8kg-12001971-01.png.png?v=639179660306200000',
  true, 301
),
(
  'a1220000-0000-4000-a104-000000000303', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO HÚMEDO CACHORROS 100G Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-humedo-cachorros-pedigree-100g-12003278/p. Marca: PEDIGREE. Nombre del producto: Pedigree Alimento Húmedo para Cachorros Sabor Carne 100g Descripción del producto: El alimento húmedo Pedigree es una excelente opción para estimular el apetito de cachorros en crecimiento, es práctico y fác',
  '🛒', 2750, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201095/comida-humeda-cachorros-pedigree-100gr-12003278-00.png.png?v=639179674982830000',
  true, 302
),
(
  'a1220000-0000-4000-a104-000000000304', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO PREMIUM PERRO MAGIC FRIENDS 2KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-premium-perro-magic-friends-2kg-12001130/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Alimento Premium para Perros 2kg Descripción del producto: Magic Friends Alimento Premium para Perros es un concentrado seco completo para perros adultos de todas las razas. Característic',
  '🛒', 10500, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200164/alimento-para-perros-seco-magic-friends-premium-2kg-12001130-01.png.png?v=639179654831730000',
  true, 303
),
(
  'a1220000-0000-4000-a104-000000000305', 'b1100000-0000-4000-a110-000000000004', 'MIRRINGO ORIGINAL ADULTOS 1KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/mirringo-original-adultos-1kg-12007662/p. Marca: MIRRINGO. Mirringo Original Adultos 1Kg Encuéntralo en Tiendas D1. Compra Ya',
  '🛒', 10400, 'Alimentación gatos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204041/mirringo-original-adultos-1kg-12007662-01.png?v=639189038479930000',
  true, 304
),
(
  'a1220000-0000-4000-a104-000000000306', 'b1100000-0000-4000-a110-000000000004', 'RINGO ORIGINAL ADULTOS 1KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/ringo-original-adultos-1kg-12007663/p. Marca: RINGO. Ringo Original Adultos 1Kg Encuéntralo en Tiendas D1. Compra Ya',
  '🛒', 6250, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204045/ringo-original-adultos-1kg-12007663-01.png?v=639189039047130000',
  true, 305
),
(
  'a1220000-0000-4000-a104-000000000307', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO CACHORROS MAGIC FRIENDS 1KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-cachorros-magic-friends-1kg-12001129/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Alimento para Cachorros 1kg Descripción del producto: Magic Friends es un alimento diseñado especialmente para cachorros de todas las razas. Características del Producto: Tamaño: 29cm x 18cm ',
  '🛒', 5550, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200160/alimento-cachorros-magic-friends-1kg-12001129-01.png.png?v=639179654723170000',
  true, 306
),
(
  'a1220000-0000-4000-a104-000000000308', 'b1100000-0000-4000-a110-000000000004', 'CABANITOS PARA PERRO MAGIC FRIENDS 100GR Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/cabanitos-para-perro-magic-friends-100-g-12007534/p. Marca: MAGIC FRIENDS. CABANITOS PARA PERRO MAGIC FRIENDS 100GR',
  '🛒', 4490, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204886/cabanitos-para-perro-magic-friends-100gr-12007534-00.png?v=639197289783600000',
  true, 307
),
(
  'a1220000-0000-4000-a104-000000000309', 'b1100000-0000-4000-a110-000000000004', 'ALIMENTO PARA PERRO MAGIC FRIENDS 2KG Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alimento-para-perro-magic-friends-2kg-12001131/p. Marca: MAGIC FRIENDS. Nombre del producto: Magic Friends Alimento para Perro 2kg Descripción del producto: Magic Friends Alimento para Perro es un concentrado seco completo, extruido y formulado para perros adultos de todas las razas. Característi',
  '🛒', 9900, 'Alimentación perros', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200168/alimento-para-perro-magic-friends-2kg-12001131-01.png.png?v=639179654962400000',
  true, 308
),
(
  'a1220000-0000-4000-a104-000000000310', 'b1100000-0000-4000-a110-000000000004', 'PAPEL HIGIÉNICO PREMIUM 3H 12U RENDY 32M Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papel-higienico-premium-rendy-3h-12-und-32mts-12004367/p. Marca: RENDY. Nombre del producto: Papel Higiénico Premium 3H 12U Rendy 32M Descripción del producto: El Papel Higiénico Premium Rendy de triple hoja ofrece una experiencia superior gracias a su suavidad, resistencia y calidad. Característ',
  '🛒', 19500, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203098/papel-higienico-premium-953gr-12-und-12004367-01.png?v=639179835386500000',
  true, 309
),
(
  'a1220000-0000-4000-a104-000000000311', 'b1100000-0000-4000-a110-000000000004', 'TOALLITAS HÚMEDAS LITTLE ANGELS 72 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toallitas-humedas-little-angels-72-und-12000222/p. Marca: LITTLE ANGELS. Nombre del producto: Toallitas Húmedas x72 LITTLE ANGELS Descripción del producto: Toallitas húmedas LITTLE ANGELS en presentación de 72 unidades, ideales para la limpieza suave y efectiva de la piel del bebé. Enriquecidas c',
  '🛒', 3450, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199162/toallitas-humedas-little-angels72-und-12000222-01.png.png?v=639179634652800000',
  true, 310
),
(
  'a1220000-0000-4000-a104-000000000312', 'b1100000-0000-4000-a110-000000000004', 'PAPEL HIGIÉNICO 3 H 12 UN RENDY 33 MTS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papel-higienico-rendy-3h-33mts-12004365/p. Marca: RENDY. Nombre del producto: Papel Higiénico 3H 12 UN Rendy 33 MTS Descripción del producto: El Papel Higiénico Familiar Rendy de triple hoja brinda una experiencia superior de limpieza con suavidad y absorción. Características del Producto: Tamaño',
  '🛒', 14800, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201962/papel-higienico-rendy-12und-12004365-01.png.png?v=639179699221300000',
  true, 311
),
(
  'a1220000-0000-4000-a104-000000000313', 'b1100000-0000-4000-a110-000000000004', 'CREMA DENTAL TRI ACCIÓN COLGATE 100 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crema-dental-tri-accion-colgate-100ml-12000106/p. Marca: COLGATE. Nombre del producto: Crema Dental Tri Acción Colgate 100 ml Descripción del producto: Crema dental de uso diario con flúor que ofrece limpieza profunda, protección anticaries y blanqueamiento dental. Es ideal para toda la familia, ',
  '🧴', 5950, 'Cuidado oral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204082/crema-dental-triple-accion-colgate-12000106-01.png?v=639189456699170000',
  true, 312
),
(
  'a1220000-0000-4000-a104-000000000314', 'b1100000-0000-4000-a110-000000000004', 'POMOS DE ALGODÓN N. FEELING 50 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/pomos-algodon-natural-feeling-50-und-12001225/p. Marca: NATURAL FEELING. Nombre del Producto: Pomos Algodón Natural Feeling 50 UND Descripción del producto: Producto de uso externo para remover el maquillaje y limpiar la piel. Aséptico pero no estéril. Resistencia y suavidad por ambas caras, limp',
  '🛒', 3150, 'Cosmética y maquillaje', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200200/pomos-de-algodon-natural-feeling-50und-1200125-01.png.png?v=639179655609270000',
  true, 313
),
(
  'a1220000-0000-4000-a104-000000000315', 'b1100000-0000-4000-a110-000000000004', 'ALCOHOL ANTISÉPTICO PURIX 375 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/alcohol-antiseptico-purix-375ml-12003210/p. Marca: PURIX. Nombre del Producto: Alcohol Antiséptico Purix 375 ML Descripción del producto: El Alcohol Antiséptico Purix es una solución tópica recomendada a uso externo únicamente, manteniéndolo alejado de fuentes de calor y fuera del alcance de los ',
  '🛒', 3150, 'Botiquín OTC', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201041/alcohol-antiseptico-purix-375ml-12003210-01.png.png?v=639179673776800000',
  true, 314
),
(
  'a1220000-0000-4000-a104-000000000316', 'b1100000-0000-4000-a110-000000000004', 'TOALLAS HÚMEDAS LITTLE ANGELS 10 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toallitas-humedas-little-angels-10-und-12000384/p. Marca: LITTLE ANGELS. Nombre del producto: Toallitas Húmedas x10 LITTLE ANGELS Descripción del producto: Toallitas húmedas LITTLE ANGELS ideales para la limpieza y el cuidado diario de la piel del bebé. Con aloe vera, vitamina E y fórmula sin alc',
  '🛒', 1100, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204758/toallitas-humedas-little-angels-10und-12000384-01.png.png?v=639191267875900000',
  true, 315
),
(
  'a1220000-0000-4000-a104-000000000317', 'b1100000-0000-4000-a110-000000000004', 'JABÓN NATURAL FEELING 4 UN 440 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-natural-feeling-4-und-440g-12005519/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Natural Feeling 4 Unidades 440g Descripción del producto: Descubre el Jabón Natural Feeling con aloe y pepino, una combinación perfecta para hidratar, proteger y brindar una limpieza suave. Presentació',
  '🛒', 5350, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202297/jabon-natural-feeling-440g-4und-12005519-01.png.png?v=639179706019370000',
  true, 316
),
(
  'a1220000-0000-4000-a104-000000000318', 'b1100000-0000-4000-a110-000000000004', 'JABÓN TOCADOR AVENA NF 110G 3U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-natural-feeling-110g-3-und-12005520/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Tocador Avena NF 110G 3U - Natural Feeling Descripción del producto: El Jabón de Tocador Antibacterial Natural Feeling con avena y coco ofrece nutrición, protección e hidratación. Su fórmula suave deja',
  '🛒', 5200, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202299/jabon-tocador-avena-natural-feeling-330g-3und-12005520-01.png.png?v=639179706068800000',
  true, 317
),
(
  'a1220000-0000-4000-a104-000000000319', 'b1100000-0000-4000-a110-000000000004', 'JABÓN LÍQUIDO NF AVENA Y COCO 1000ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-liquido-nf-avena-coco-12006237/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Líquido NF Avena y Coco 1000ml Descripción del producto: El Jabón Líquido NF Avena y Coco 1000ml de Natural Feeling es ideal para mantener tus manos limpias. Este producto es perfecto para el uso diario. Ca',
  '🛒', 5650, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202756/jabon-liquido-antibact-avena-coco-1000ml-12006237-01.png.png?v=639179736250900000',
  true, 318
),
(
  'a1220000-0000-4000-a104-000000000320', 'b1100000-0000-4000-a110-000000000004', 'TOALLAS PARA MANOS RENDY 80 UN Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toallas-para-manos-rendy-80-und-12003392/p. Marca: RENDY. Nombre del producto: Toallas para Manos Rendy 80 UN Descripción del producto: Las Toallas para Manos Rendy ofrecen una solución práctica e higiénica para el secado de manos. Estas toallas son resistentes, absorbentes y suaves al tacto. Dis',
  '🧴', 4750, 'Cuidado corporal', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201190/toallas-para-manos-rendy-80und-12003392-01.png.png?v=639179677539770000',
  true, 319
),
(
  'a1220000-0000-4000-a104-000000000321', 'b1100000-0000-4000-a110-000000000004', 'PAPEL HIGIÉNICO 3 H 2 UN RENDY 33 MTS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papel-higienico-rendy-3h-33mts-12004364/p. Marca: RENDY. Nombre del producto: Papel Higiénico 3H 2 UN Rendy 33 MTS Descripción del producto: El Papel Higiénico Familiar Rendy de triple hoja ofrece una limpieza suave y efectiva. Su tamaño compacto lo hace perfecto para espacios reducidos o para ll',
  '🛒', 2950, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201958/papel-higienico-rendy-2und-12004364-01.png.png?v=639179699129600000',
  true, 320
),
(
  'a1220000-0000-4000-a104-000000000322', 'b1100000-0000-4000-a110-000000000004', 'MÁQUINA PARA AFEITAR 3H MUJER XEN 2 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/maquina-afeitar-xen-2-und-12000088/p. Marca: XEN. Nombre del producto: Máquina para Afeitar 3H Mujer XEN 2 und Descripción del producto: La Máquina para Afeitar 3H Mujer XEN ha sido diseñada especialmente para brindar una experiencia de afeitado cómoda y eficaz. Cuenta con mangos ergonómicos, cab',
  '🛒', 2990, 'Afeitado', 'https://d1tiendas.vteximg.com.br/arquivos/ids/198952/maquina-para-afeitar-3h-mujer-fresh-free-2und-12000088-01.png.png?v=639179630149400000',
  true, 321
),
(
  'a1220000-0000-4000-a104-000000000323', 'b1100000-0000-4000-a110-000000000004', 'JABÓN LÍQUIDO NF OASIS SPA 1000ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-liquido-nf-oasis-spa-12006245/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Líquido NF Oasis Spa 1000ml Descripción del producto: El Jabón Líquido Oasis Spa 1000ml de Natural Feeling ofrece una limpieza profunda, formulado con extractos naturales como aloe vera es ideal para el uso ',
  '🛒', 5650, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203202/jabon-liquido-hierbas-aromaticas-natural-feeling-1000ml-12006245-00.png?v=639179847614500000',
  true, 322
),
(
  'a1220000-0000-4000-a104-000000000324', 'b1100000-0000-4000-a110-000000000004', 'PAPEL HIG 3H ULTRASUAVE RENDY 4UND 32MTS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/papel-higienico-ultrasuave-rendy-3h-4-und-32mts-12006808/p. Marca: RENDY. Nombre del producto: Papel Higiénico 3H Ultrasuave Rendy 4UN 32MTS Descripción del producto: El Papel Higiénico 3H Ultrasuave Rendy está diseñado para ofrecer la máxima suavidad y comodidad en su uso. Es ideal para el hogar',
  '🛒', 7100, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203446/papel-higienico-ultra-suave-rendy-4und-12006808-01.png.png?v=639179860160530000',
  true, 323
),
(
  'a1220000-0000-4000-a104-000000000325', 'b1100000-0000-4000-a110-000000000004', 'ENJUAGUE CERO ALCOHOL BUCARINE 500 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/enjuague-bucal-cero-alcohol-bucarine-500ml-12000185/p. Marca: BUCARINE. Nombre del producto: Enjuague Cero Alcohol Bucarine 500 ml Descripción del producto: Enjuague bucal sin alcohol con flúor para protección anticaries. Proporciona un aliento fresco. Ideal para complementar la higiene bucal dia',
  '🧴', 6550, 'Cuidado oral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204140/enjuague-bucal-cero-alcohol-bucarine-12000185-01.png?v=639189481168600000',
  true, 324
),
(
  'a1220000-0000-4000-a104-000000000326', 'b1100000-0000-4000-a110-000000000004', 'PAÑUELO FACIAL RENDY 4 POR 10 UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panuelo-facial-rendy-4-pack-10-und-12000171/p. Marca: RENDY. Nombre del Producto: Pañuelo Facial Rendy 4 por 10 unidades Descripción del producto: Los Pañuelos Faciales Rendy ofrecen una experiencia de higiene suave y efectiva. Con triple hoja y una textura delicada, son ideales para el cuidado f',
  '🛒', 3150, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199058/panuelo-facial-rendy-4und-12000171-01.png.png?v=639179632632230000',
  true, 325
),
(
  'a1220000-0000-4000-a104-000000000327', 'b1100000-0000-4000-a110-000000000004', 'CREMA DENTAL LUMINOUS WHITE COLGATE 61ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/crema-dental-luminous-white-colgate-61ml-12006294/p. Marca: COLGATE. Nombre del producto: Crema Dental Luminous White Colgate 61 ml Descripción del producto: La Crema Dental Luminous White de Colgate ofrece una limpieza profunda, protección contra caries y un efecto blanqueador para una sonrisa m',
  '🧴', 9950, 'Cuidado oral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202791/crema-dental-luminous-white-colgate-81gr-12006294-01.png.png?v=639179827685000000',
  true, 326
),
(
  'a1220000-0000-4000-a104-000000000328', 'b1100000-0000-4000-a110-000000000004', 'TOALLA FEMENINA NOCTURNA FRESH & FREE 8UD Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toalla-femenina-nocturna-fresh-free-8-und-12001739/p. Marca: FRESH AND FREE. Nombre del producto: Toalla Femenina Nocturna Fresh &amp; Free 8 UND Descripción del producto: Las Toallas Femeninas Nocturnas Fresh &amp; Free están diseñadas para brindar máxima protección y confort durante la noche. S',
  '🛒', 3150, 'Protección femenina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/204701/toalla-femenina-nocturna-fresh-free-aseo-personal-12001739-01.png?v=639191239148830000',
  true, 327
),
(
  'a1220000-0000-4000-a104-000000000329', 'b1100000-0000-4000-a110-000000000004', 'PAÑOS MICRO FIBRA Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/panos-micro-fibra-tidy-house-12006843/p. Marca: TIDY HOUSE. Paños Micro Fibra Encuéntralo en Tiendas D1. Compra Ya',
  '🛒', 4700, 'Papel higiénico y pañuelos', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203465/panos-microfibra-multiusos-tidy-house-3und-12006843-01.png.png?v=639179860414270000',
  true, 328
),
(
  'a1220000-0000-4000-a104-000000000330', 'b1100000-0000-4000-a110-000000000004', 'TALCO ANTIBACTERIAL XEN 150 GRS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/talco-antibacterial-xen-150g-12000242/p. Marca: XEN. Nombre del producto: Talco Antibacterial XEN 150 g Descripción del producto: El Talco Antibacterial XEN está formulado para mantener los pies secos, frescos y libres de mal olor. Su acción antibacterial combate los microorganismos causantes del',
  '🧴', 4650, 'Cuidado corporal', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199186/talco-para-pies-xen-150gr-12000242-01.png.png?v=639179635339870000',
  true, 329
),
(
  'a1220000-0000-4000-a104-000000000331', 'b1100000-0000-4000-a110-000000000004', 'TOALLA FEMENINA INVISIBLE NOSOTRAS 24UND Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/toalla-femenina-invisible-nosotras-24-und-12002481/p. Marca: NOSOTRAS. Nombre del producto: Toalla Femenina Invisible Nosotras 24UND Descripción del producto: Toallas femeninas invisibles con tela tipo algodón, extracto de manzanilla y aloe vera. Diseñadas para brindar comodidad, protección y con',
  '🛒', 8550, 'Protección femenina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200657/toallas-femeninas-econo-pack-nosotras-24-und-12002481-01.png.png?v=639179665745930000',
  true, 330
),
(
  'a1220000-0000-4000-a104-000000000332', 'b1100000-0000-4000-a110-000000000004', 'GEL BAÑO BOTANICALS NAT FEELING 750 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/gel-bano-botanicals-natural-feeling-750ml-12004230/p. Marca: NATURAL FEELING. Nombre del producto: Gel de Baño Botanical''s Natural Feeling 750 ml Descripción del producto: Disfruta de una experiencia de purificación e hidratación con el Gel de Baño Botanical''s Natural Feeling. Formulado con extra',
  '🧴', 7490, 'Cuidado corporal', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201837/gel-de-bano-botanicals-natural-feeling-750ml-12004230-00.png.png?v=639179697041530000',
  true, 331
),
(
  'a1220000-0000-4000-a104-000000000333', 'b1100000-0000-4000-a110-000000000004', 'SHAMPOO SAVITAL AMINOACIDOS 490 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/shampoo-savital-aminoacidos-490ml-12006773/p. Marca: SAVITAL. Nombre del producto: Shampoo Savital Aminoácidos 490 ml Descripción del producto: El Shampoo Savital Aminoácidos de 490 ml ofrece una limpieza profunda, hidratación y restauración para cabellos dañados y quebradizos. Brinda una sensaci',
  '🧴', 13350, 'Cuidado capilar', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203427/shampoo-aminoacidos-savital-490ml-12006773-01.png.png?v=639179859934400000',
  true, 332
),
(
  'a1220000-0000-4000-a104-000000000334', 'b1100000-0000-4000-a110-000000000004', 'SEDA DENTAL BUCARINE 50 MTS Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/seda-dental-bucarine-50mts-12000209/p. Marca: BUCARINE. Nombre del producto: Seda Dental Bucarine 50 mts Descripción del producto: Seda dental Bucarine con sabor a menta fresca, ideal para complementar la higiene bucal diaria. Remueve eficazmente los residuos de comida y placa bacteriana en los e',
  '🧴', 2490, 'Cuidado oral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/199133/seda-dental-menta-fresca-bucarine-12000209-01.png.png?v=639179633993700000',
  true, 333
),
(
  'a1220000-0000-4000-a104-000000000335', 'b1100000-0000-4000-a110-000000000004', 'JABÓN LÍQUIDO NF OASIS SPA 500ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-liquido-nf-oasis-spa-12006238/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Líquido NF Oasis Spa 500ml Descripción del producto: Disfruta de una experiencia protectora con el Jabón Líquido Oasis Spa de 500ml de Natural Feeling. Su fórmula con extracto de aloe vera limpia profundamen',
  '🛒', 3650, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202760/jabon-liquido-vainilla-arandanos-natural-feeling-500ml-12006238-00.png.png?v=639179736374730000',
  true, 334
),
(
  'a1220000-0000-4000-a104-000000000336', 'b1100000-0000-4000-a110-000000000004', 'JABÓN LÍQUIDO NF AVENA Y COCO 500ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-liquido-nf-avena-coco-12006236/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Líquido NF Avena y Coco 500ml Descripción del producto: El Jabón Líquido NF Avena y Coco 500ml de Natural Feeling es ideal para mantener tus manos limpias y protegidas. Su fragancia agradable lo hace perfec',
  '🛒', 3650, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202752/jabon-liquido-avena-coco-natural-feeling-500ml12006236-01.png.png?v=639179736155870000',
  true, 335
),
(
  'a1220000-0000-4000-a104-000000000337', 'b1100000-0000-4000-a110-000000000004', 'ENJUAGUE BUCAL LISTERINE COOL MINT 360ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/enjuague-bucal-listerine-cool-mint-360ml-12003313/p. Marca: LISTERINE. Nombre del Producto: Enjuague Bucal LISTERINE® Cool Mint 360 mL Descripción del producto: LISTERINE® Cool Mint es un enjuague bucal antibacteriano que elimina hasta el 99.9% de los gérmenes que causan mal aliento, placa y prob',
  '🧴', 15950, 'Cuidado oral', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201140/enjuague-bucal-listerine-cool-mint-360ml-12003313-01.png.png?v=639179676213600000',
  true, 336
),
(
  'a1220000-0000-4000-a104-000000000338', 'b1100000-0000-4000-a110-000000000004', 'DESODORANTE PARA PIES XEN 260 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/desodorante-para-pies-xen-260ml-12002952/p. Marca: XEN. Nombre del producto: Desodorante para Pies Antitranspirante XEN 260 ml Descripción del producto: El Desodorante para Pies Antitranspirante XEN está formulado para combatir eficazmente el sudor y el mal olor. Su fórmula avanzada ofrece protec',
  '🛒', 8900, 'Desodorantes', 'https://d1tiendas.vteximg.com.br/arquivos/ids/200968/desodorante-para-pies-xen-260ml-12002952-01.png.png?v=639179672044870000',
  true, 337
),
(
  'a1220000-0000-4000-a104-000000000339', 'b1100000-0000-4000-a110-000000000004', 'JABÓN ESPUMOSO ANTIBACTERIAL 270 ML Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-espumoso-antibacterial-milefiore-270ml-12003638/p. Marca: MILEFIORE. Nombre del producto: Jabón Espumoso Antibacterial 270 mL Descripción del producto: Jabón espumoso antibacterial para manos, ideal para una limpieza profunda y efectiva. Formulado con extracto de Aloe Vera y fragancia Herba',
  '🛒', 5950, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/201392/jabon-espumoso-surtido-milefiore-270ml-12003638-00.png.png?v=639179688647470000',
  true, 338
),
(
  'a1220000-0000-4000-a104-000000000340', 'b1100000-0000-4000-a110-000000000004', 'JABÓN TOCADOR ANTIBACTERIAL NF 110 G 3U Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-natural-feeling-110g-3-und-12005477/p. Marca: NATURAL FEELING. Nombre del producto: Jabón Tocador Antibacterial NF 110 g 3 Unidades Descripción del producto: El Jabón de Tocador Antibacterial Natural Feeling con aloe y pepino está diseñado para brindar una limpieza profunda. Su fórmula está',
  '🛒', 5200, 'Jabonería', 'https://d1tiendas.vteximg.com.br/arquivos/ids/202289/jabon-menta-natural-feeling-330g-3und-12005477-01.png.png?v=639179705755800000',
  true, 339
),
(
  'a1220000-0000-4000-a104-000000000341', 'b1100000-0000-4000-a110-000000000004', 'JABÓN INTIMO Y GEL PARA AFEITAR F & F Demo', 'Demo UrabApp — productos más pedidos (top ventas) según catálogo público de d1.com.co. Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.d1.com.co/jabon-intimo-gel-afeitar-fresh-free-12006598/p. Marca: FRESH AND FREE. Nombre del producto: Jabón Íntimo y Gel para Afeitar 2 en 1 - Fresh & Free Descripción del producto: Descubre el Jabón Íntimo y Gel para Afeitar 2 en 1 Fresh & Free, su acción doble permite una limpieza delicada diaria. Caract',
  '🛒', 3750, 'Protección femenina', 'https://d1tiendas.vteximg.com.br/arquivos/ids/203036/jabon-intimo-gel-para-afeitar-fresh-free-300ml-12006598-01.png.png?v=639179831112000000',
  true, 340
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_available = true;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;