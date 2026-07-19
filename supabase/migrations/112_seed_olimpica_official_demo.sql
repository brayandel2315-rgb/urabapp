-- Olímpica Demo — productos desde API pública olimpica.com (no Rappi)
-- Sede ref: https://www.tiendeo.com.co/Tiendas/apartado/olimpica-cc-nuestro-uraba/68693
ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;

UPDATE public.businesses SET
  name = 'Olímpica CC Nuestro Demo',
  description = 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio.

Sede: Centro Comercial Nuestro Urabá, Apartadó, Antioquia.
Ficha Tiendeo: https://www.tiendeo.com.co/Tiendas/apartado/olimpica-cc-nuestro-uraba/68693.
Catálogo: https://www.olimpica.com',
  address = 'Centro Comercial Nuestro Urabá, Apartadó, Antioquia',
  cover_url = COALESCE(NULLIF(cover_url, ''), '/previews/cover-mercado.jpg'),
  logo_url = COALESCE(NULLIF(logo_url, ''), '/previews/logo-mercado.png'),
  is_published = true,
  is_active = true,
  is_open = true,
  verification_status = 'approved',
  approved_at = COALESCE(approved_at, NOW())
WHERE id = 'b1100000-0000-4000-a110-000000000003';

DELETE FROM public.products
WHERE business_id = 'b1100000-0000-4000-a110-000000000003'
  AND (id::text LIKE 'a1100000%' OR id::text LIKE 'a1210000%');

INSERT INTO public.products (
  id, business_id, name, description, emoji, price, category, image_url, is_available, sort_order
) VALUES
(
  'a1210000-0000-4000-a103-000000000001', 'b1100000-0000-4000-a110-000000000003', 'Banano Maduro Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/banano-maduro/p. Marca: Sin Marca. Banano Maduro',
  '🥬', 3400, 'Frutas', 'https://olimpica.vteximg.com.br/arquivos/ids/1156556/24030526.jpg?v=638312539046900000',
  true, 0
),
(
  'a1210000-0000-4000-a103-000000000002', 'b1100000-0000-4000-a110-000000000003', 'Tomate Río Grande/Ciruelo Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/tomate-rio-grande-ciruelo/p. Marca: Sin Marca. Tomate Río Grande/Ciruelo',
  '🥬', 6400, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/865381/24030229.jpg?v=637908071082000000',
  true, 1
),
(
  'a1210000-0000-4000-a103-000000000003', 'b1100000-0000-4000-a110-000000000003', 'Cebolla Cabezona Roja Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cebolla-cabezona-roja/p. Marca: Sin Marca. Cebolla Cabezona Roja',
  '🥬', 6200, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1156554/24030496.jpg?v=638312538624030000',
  true, 2
),
(
  'a1210000-0000-4000-a103-000000000004', 'b1100000-0000-4000-a110-000000000003', 'Tomate La Económica Pera 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/tomate-pera-la-economica-1-kg-7701008112605-2569/p. Marca: La Economica. Tomate Pera La Económica 1 Kg. Aquí puedes encontrar más productos marca La Economica',
  '🥬', 5800, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/735563/7701008112605.jpg?v=638797172830330000',
  true, 3
),
(
  'a1210000-0000-4000-a103-000000000005', 'b1100000-0000-4000-a110-000000000003', 'Ajo Importado Malla 90 G X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/ajo-importado-malla-3-cabez-90-g-7709990662986/p. Marca: Sin Marca. Ajo Importado Malla 3 Cabeza 90 G',
  '🥬', 1600, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/739494/7709990662986.jpg?v=638816198097430000',
  true, 4
),
(
  'a1210000-0000-4000-a103-000000000006', 'b1100000-0000-4000-a110-000000000003', 'Pimentón Rojo x Kilo Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pimenton-rojo/p. Marca: Sin Marca. Pimentón Rojo',
  '🥬', 9800, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1156548/24030298.jpg?v=638312533469400000',
  true, 5
),
(
  'a1210000-0000-4000-a103-000000000007', 'b1100000-0000-4000-a110-000000000003', 'Limón Tahití 1,5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/limon-tahit-bolsa-1-5-kg/p. Marca: Sin Marca. Limón Tahití 1,5 Kg',
  '🥬', 7190, 'Frutas', 'https://olimpica.vteximg.com.br/arquivos/ids/735583/44530.jpg?v=638806729299270000',
  true, 6
),
(
  'a1210000-0000-4000-a103-000000000008', 'b1100000-0000-4000-a110-000000000003', 'Papa Clasificada X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-clasificada-24030489/p. Marca: Sin Marca. Papa Clasificada X Kg',
  '🥬', 5780, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1156553/24030489.jpg?v=638312538226400000',
  true, 7
),
(
  'a1210000-0000-4000-a103-000000000009', 'b1100000-0000-4000-a110-000000000003', 'Plátano Verde Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/platano-verde/p. Marca: Sin Marca. Plátano Verde',
  '🥬', 5100, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/865367/24651714.jpg?v=637908070902530000',
  true, 8
),
(
  'a1210000-0000-4000-a103-000000000010', 'b1100000-0000-4000-a110-000000000003', 'Brócoli Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/brocoli/p. Marca: Sin Marca. Brócoli',
  '🥬', 12900, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1086414/24651561.jpg?v=638181222285930000',
  true, 9
),
(
  'a1210000-0000-4000-a103-000000000011', 'b1100000-0000-4000-a110-000000000003', 'Cilantro Criollo 50 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cilantro-criollo-macito-por-50-g-7701008299016/p. Marca: Sin Marca. Cilantro Criollo Macito 50 G',
  '🥬', 2250, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/735478/7701008299016.jpg?v=638798079402400000',
  true, 10
),
(
  'a1210000-0000-4000-a103-000000000012', 'b1100000-0000-4000-a110-000000000003', 'Zanahoria Primera Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/zanahoria-primera/p. Marca: Sin Marca. Zanahoria Primera',
  '🥬', 4510, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/865307/24030236.jpg?v=637908070197470000',
  true, 11
),
(
  'a1210000-0000-4000-a103-000000000013', 'b1100000-0000-4000-a110-000000000003', 'Pepino Cohombro Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pepino-cohombro/p. Marca: Sin Marca. .body-tucan{box-sizing: border-box; font-size: 62.5%; margin: 0; padding: 0.625rem 2.0625rem 0rem 0.125rem;}.father-container{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; overflow-x: hidden',
  '🥬', 4400, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/865297/24030335.jpg?v=637908070057770000',
  true, 12
),
(
  'a1210000-0000-4000-a103-000000000014', 'b1100000-0000-4000-a110-000000000003', 'Cebolla Cabezona Blanca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cebolla-cabezona-blanca/p. Marca: Sin Marca. Cebolla Cabezona Blanca',
  '🥬', 7980, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/865293/24030267.jpg?v=637908069989870000',
  true, 13
),
(
  'a1210000-0000-4000-a103-000000000015', 'b1100000-0000-4000-a110-000000000003', 'Zanahoria 3X2 Lb Oferta Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/zanahoria-pag-2x3-lb-of-5333-533/p. Marca: Sin Marca. Zanahoria 3X2 Lb Oferta',
  '🥬', 5850, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1368014/DSC_0213.jpg?v=638483821446270000',
  true, 14
),
(
  'a1210000-0000-4000-a103-000000000016', 'b1100000-0000-4000-a110-000000000003', 'Mora Hacienda La Giralda Congelada 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mora-cong-haciend-la-giralda-500g/p. Marca: La Giralda. MORA CONG HACIEND LA GIRALDA 500g. Aquí puedes encontrar más productos marca La Giralda',
  '🥬', 9350, 'Frutas', 'https://olimpica.vteximg.com.br/arquivos/ids/1158831/7701008660687_A1N1_es_s01_B1.jpg?v=638313355506830000',
  true, 15
),
(
  'a1210000-0000-4000-a103-000000000017', 'b1100000-0000-4000-a110-000000000003', 'LECHUGA HIDROPONICA VERDE CRESPA LA GIRALDA 180g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lechuga-hidrop-vde-cresp-la-giralda-180g/p. Marca: La Giralda. LECHUGA HIDROP VDE CRESP LA GIRALDA 180g',
  '🥬', 5420, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1564256/7701008658998.jpg?v=638795051134870000',
  true, 16
),
(
  'a1210000-0000-4000-a103-000000000018', 'b1100000-0000-4000-a110-000000000003', 'Papa Empacada 1,5 Kg Oferta Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-empac-1-5-kg-of/p. Marca: Olimpica. Papa Empacada 1,5 Kg Oferta',
  '🥬', 4990, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1504142/7701008658516.jpg?v=638641775157270000',
  true, 17
),
(
  'a1210000-0000-4000-a103-000000000019', 'b1100000-0000-4000-a110-000000000003', 'Espinaca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/espinaca/p. Marca: Sin Marca. .body-tucan{box-sizing: border-box; font-size: 62.5%; margin: 0; padding: 0.625rem 2.0625rem 0rem 0.125rem;}.father-container{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; overflow-x: hidden; text-',
  '🥬', 14900, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/865419/24043410.jpg?v=637908071597500000',
  true, 18
),
(
  'a1210000-0000-4000-a103-000000000020', 'b1100000-0000-4000-a110-000000000003', 'Mandarina Importada Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mandarina-importada/p. Marca: Sin Marca. Mandarina Importada',
  '🥬', 18080, 'Frutas', 'https://olimpica.vteximg.com.br/arquivos/ids/1156413/24043403.jpg?v=638312528523530000',
  true, 19
),
(
  'a1210000-0000-4000-a103-000000000021', 'b1100000-0000-4000-a110-000000000003', 'Cebolla Junca 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cebolla-junca-por-250-gr-7700105000730-2742/p. Marca: La Granjita. Cebolla Junca 250 G',
  '🥬', 4800, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/735567/7700105000730.jpg?v=638816194721670000',
  true, 20
),
(
  'a1210000-0000-4000-a103-000000000022', 'b1100000-0000-4000-a110-000000000003', 'Piña Golden X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pina-golden-24030168/p. Marca: Sin Marca. .body-tucan{box-sizing: border-box; font-size: 62.5%; margin: 0; padding: 0.625rem 2.0625rem 0rem 0.125rem;}.father-container{font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; overflow-x: h',
  '🥬', 4700, 'Frutas', 'https://olimpica.vteximg.com.br/arquivos/ids/1156501/24030168.jpg?v=638312532092630000',
  true, 21
),
(
  'a1210000-0000-4000-a103-000000000023', 'b1100000-0000-4000-a110-000000000003', 'Plátano Verde 1,5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/platano-vde-bolsa-1-5-kg/p. Marca: Sin Marca. Plátano Verde 1,5 Kg',
  '🥬', 5850, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1491787/7700136632177.jpg?v=638775866131000000',
  true, 22
),
(
  'a1210000-0000-4000-a103-000000000024', 'b1100000-0000-4000-a110-000000000003', 'Aguacate Económico Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aguacate-economico-por-unidad-7701008659087/p. Marca: Sin Marca. Aguacate Económico Und X Kg',
  '🥬', 6000, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/735533/7701008659087.jpg?v=638815355405200000',
  true, 23
),
(
  'a1210000-0000-4000-a103-000000000025', 'b1100000-0000-4000-a110-000000000003', 'Guineo Verde Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/guineo-verde/p. Marca: Sin Marca. Guineo Verde',
  '🥬', 3490, 'Frutas', 'https://olimpica.vteximg.com.br/arquivos/ids/865393/24030533.jpg?v=639130022925330000',
  true, 24
),
(
  'a1210000-0000-4000-a103-000000000026', 'b1100000-0000-4000-a110-000000000003', 'Pimentón Verde Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pimenton-verde/p. Marca: Sin Marca. Pimentón Verde',
  '🥬', 10900, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1158832/24043427.jpg?v=638313356211570000',
  true, 25
),
(
  'a1210000-0000-4000-a103-000000000027', 'b1100000-0000-4000-a110-000000000003', 'Ají Dulce Topito Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aji-dulce-topito/p. Marca: Sin Marca. Ají Dulce Topito',
  '🥬', 10980, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1156550/24030342.jpg?v=638312534100270000',
  true, 26
),
(
  'a1210000-0000-4000-a103-000000000028', 'b1100000-0000-4000-a110-000000000003', 'Papa Criolla Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-criolla/p. Marca: Sin Marca. Papa Criolla X Kg',
  '🥬', 9900, 'Verduras', 'https://olimpica.vteximg.com.br/arquivos/ids/1156527/24030243.jpg?v=638312532629400000',
  true, 27
),
(
  'a1210000-0000-4000-a103-000000000029', 'b1100000-0000-4000-a110-000000000003', 'Carne Molida de Res Especial x Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/res-carne-molida-especial/p. Marca: Mercapollo. @import url(''https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;1,100;1,300;1,400&family=Rufina:wght@400;700&display=swap''); .body-tucan { box-sizing: border-box; font-siz',
  '🥩', 30980, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1478854/176910.png?v=638602828536230000',
  true, 28
),
(
  'a1210000-0000-4000-a103-000000000030', 'b1100000-0000-4000-a110-000000000003', 'Pulpa de Cerdo x Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cerdo-pulpa/p. Marca: Mercapollo. 1',
  '🥩', 23400, 'Carne De Cerdo', 'https://olimpica.vteximg.com.br/arquivos/ids/1404648/24010597.jpg?v=639133286738400000',
  true, 29
),
(
  'a1210000-0000-4000-a103-000000000031', 'b1100000-0000-4000-a110-000000000003', 'Muslo de Pollo Congelado Granel X Und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-muslo-cong-gnel-x-und/p. Marca: Sin Marca. POLLO MUSLO CONG GNEL X UND',
  '🛒', 2200, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/1779536/25073775.jpg.jpg?v=638750907830600000',
  true, 30
),
(
  'a1210000-0000-4000-a103-000000000032', 'b1100000-0000-4000-a110-000000000003', 'PEZ SALMON PREMIUN COHO 3 PORC X 450GR Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pez-salmon-premiun-coho-3-porc-x-450gr/p. Marca: Medalla De Oro. PEZ SALMON PREMIUN COHO 3 PORC X 450GR',
  '🛒', 27992, 'Pescadería', 'https://olimpica.vteximg.com.br/arquivos/ids/2358701/7701008845145.jpg?v=639081639586800000',
  true, 31
),
(
  'a1210000-0000-4000-a103-000000000033', 'b1100000-0000-4000-a110-000000000003', 'Chuleta de Cerdo Importada Oferta X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cerdo-chuleta-importada-oferta-24029698/p. Marca: Sin Marca. Chuleta de Cerdo Importada Oferta X Kg',
  '🥩', 15900, 'Carne De Cerdo', 'https://olimpica.vteximg.com.br/arquivos/ids/1404722/24029698.jpg?v=638506138818600000',
  true, 32
),
(
  'a1210000-0000-4000-a103-000000000034', 'b1100000-0000-4000-a110-000000000003', 'Lomo de Cerdo Cañón Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cerdo-lomo-cañon/p. Marca: Mercapollo. 1',
  '🥩', 28600, 'Carne De Cerdo', 'https://olimpica.vteximg.com.br/arquivos/ids/1404689/24039079.jpg?v=639198347622570000',
  true, 33
),
(
  'a1210000-0000-4000-a103-000000000035', 'b1100000-0000-4000-a110-000000000003', 'Filete de Pechuga de Pollo Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-filete-pechugaa/p. Marca: Mercapollo. 1',
  '🛒', 23920, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/711517/24019873.jpg?v=637741087026400000',
  true, 34
),
(
  'a1210000-0000-4000-a103-000000000036', 'b1100000-0000-4000-a110-000000000003', 'Res Capón/Palomilla/Tabla/Centro Tradicional Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/res-capon-o-tabla-o-centro-o-palomilla-tradicional-24010474-1434/p. Marca: C.Carnes. Res Capón/Palomilla Tradicional/Tabla/Centro X Kg',
  '🥩', 39400, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1404659/24010474.jpg?v=638506135797900000',
  true, 35
),
(
  'a1210000-0000-4000-a103-000000000037', 'b1100000-0000-4000-a110-000000000003', 'Res Espaldilla/Cascara/Carne para Desmechar Tradicional Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/res-espaldilla-cascara-carne-para-desmechar-tradicional/p. Marca: Mercapollo. 1',
  '🥩', 34280, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1404654/24010443.jpg?v=638506135686100000',
  true, 36
),
(
  'a1210000-0000-4000-a103-000000000038', 'b1100000-0000-4000-a110-000000000003', 'Mojarra Roja X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pez-mojarra-roja-24015455/p. Marca: Sin Marca. Pez Mojarra Roja X Kg',
  '🛒', 16600, 'Pescadería', 'https://olimpica.vteximg.com.br/arquivos/ids/711068/24015455.jpg?v=637741079141870000',
  true, 37
),
(
  'a1210000-0000-4000-a103-000000000039', 'b1100000-0000-4000-a110-000000000003', 'Pechuga de Pollo Olimpica Fresca Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-pechuga-fresca-o/p. Marca: Mercapollo. 1',
  '🛒', 20160, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/1284486/24649629.jpg?v=638410103368170000',
  true, 38
),
(
  'a1210000-0000-4000-a103-000000000040', 'b1100000-0000-4000-a110-000000000003', 'PEZ FILETE TILAPIA MEDALLA DE ORO 500G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pez-filete-tilapia-medalla-de oro 500g/p. Marca: Medalla De Oro. PEZ FILETE TILAPIA MEDALLA DE ORO 500G',
  '🛒', 16990, 'Pescadería', 'https://olimpica.vteximg.com.br/arquivos/ids/2358697/7701008846753.jpg?v=639081638739700000',
  true, 39
),
(
  'a1210000-0000-4000-a103-000000000041', 'b1100000-0000-4000-a110-000000000003', 'Contramuslo de Pollo Mercapollo Fresco Deshuesado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-contramuslo-fresco-mercapollo-deshuesado/p. Marca: Mercapollo. 1',
  '🛒', 19680, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/711574/24028141.jpg?v=637741087526370000',
  true, 40
),
(
  'a1210000-0000-4000-a103-000000000042', 'b1100000-0000-4000-a110-000000000003', 'Pechuga de Pollo Mercapollo Fresca sin Piel Bandeja Familiar X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-pechuga-fresca-mercapollo-sin-piel--bandeja-familiar-24028134-11590/p. Marca: Mercapollo. Pechuga de Pollo Fresca Mercapollo Sin Piel Bandeja Familiar',
  '🛒', 20160, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/711573/24028134.jpg?v=637741087518530000',
  true, 41
),
(
  'a1210000-0000-4000-a103-000000000043', 'b1100000-0000-4000-a110-000000000003', 'Filete de Tilapia Antillana al Vacío 450 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pez-filete-tilapia-antillana-al-vacio-450-g-7700695911591-6163/p. Marca: Antillana. Pez Filete De Tilapia Antillana Al Vacío 450 G',
  '🛒', 26145, 'Pescadería', 'https://olimpica.vteximg.com.br/arquivos/ids/2372309/7700695911591.jpg?v=639099663298430000',
  true, 42
),
(
  'a1210000-0000-4000-a103-000000000044', 'b1100000-0000-4000-a110-000000000003', 'Víscera Hígado Importado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/viscera-higado-importado/p. Marca: Mercapollo. 1',
  '🥩', 12800, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1404695/24039734.jpg?v=638506137206700000',
  true, 43
),
(
  'a1210000-0000-4000-a103-000000000045', 'b1100000-0000-4000-a110-000000000003', 'Lomo de Cerdo Congelado Importado Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cerdo-lomo-importado/p. Marca: Mercapollo. 1',
  '🥩', 20800, 'Carne De Cerdo', 'https://olimpica.vteximg.com.br/arquivos/ids/1404694/24039710.jpg?v=638763597883870000',
  true, 44
),
(
  'a1210000-0000-4000-a103-000000000046', 'b1100000-0000-4000-a110-000000000003', 'Pollo Vacío Mercapollo Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-vacio-mercapollo/p. Marca: Mercapollo. 1',
  '🛒', 8000, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/711513/24031844.jpg?v=637741086986530000',
  true, 45
),
(
  'a1210000-0000-4000-a103-000000000047', 'b1100000-0000-4000-a110-000000000003', 'Lomito de Pechuga de Pollo Mercapollo Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-lomito-pechuga-mercapollo/p. Marca: Mercapollo. 1',
  '🛒', 19700, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/711512/24649605.jpg?v=637741086974800000',
  true, 46
),
(
  'a1210000-0000-4000-a103-000000000048', 'b1100000-0000-4000-a110-000000000003', 'Costilla de Cerdo Súper Especial con Piel Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cerdo-costill-super-especial-con-piel-24010627-1418/p. Marca: C.Carnes. Costilla de Cerdo Súper Especial Con Piel X Kg',
  '🥩', 26900, 'Carne De Cerdo', 'https://olimpica.vteximg.com.br/arquivos/ids/1404656/24010627.jpg?v=638506135736330000',
  true, 47
),
(
  'a1210000-0000-4000-a103-000000000049', 'b1100000-0000-4000-a110-000000000003', 'Pechuga de Pollo Mercapollo Fresca sin Piel Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-pechuga-mercapollo-fresca-sin-piel/p. Marca: Mercapollo. 1',
  '🛒', 25000, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/1367866/24031622.jpg?v=638483617136530000',
  true, 48
),
(
  'a1210000-0000-4000-a103-000000000050', 'b1100000-0000-4000-a110-000000000003', 'Costilla de Res Súper Especial Tradicional Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/res-costill-super-especial-tradicional/p. Marca: Mercapollo. 1',
  '🥩', 26536, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1404634/24010580.jpg?v=638506135054570000',
  true, 49
),
(
  'a1210000-0000-4000-a103-000000000051', 'b1100000-0000-4000-a110-000000000003', 'Chicharrón de Cerdo Especial Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cerdo-chicharron-especial/p. Marca: Mercapollo. 1',
  '🥩', 27600, 'Carne De Cerdo', 'https://olimpica.vteximg.com.br/arquivos/ids/1284499/24014557.jpg?v=638410103618330000',
  true, 50
),
(
  'a1210000-0000-4000-a103-000000000052', 'b1100000-0000-4000-a110-000000000003', 'Lomo Ancho/Chata de Res sin Hueso Tradicional Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/res-lomo-ancho-o-chata-sin-hueso-tradicional-24010122-144/p. Marca: C.Carnes. @import url(''https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;1,100;1,300;1,400&family=Rufina:wght@400;700&display=swap''); .body-tucan{box-',
  '🥩', 47104, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1404615/24010122.jpg?v=638506134380130000',
  true, 51
),
(
  'a1210000-0000-4000-a103-000000000053', 'b1100000-0000-4000-a110-000000000003', 'Pechuga de Pollo Mercapollo Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-pechuga-mercapollo-24649421-86/p. Marca: Mercapollo. Pechuga de Pollo Mercapollo X Kg. Aquí puedes encontrar más productos Mercapollo',
  '🛒', 25620, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/1284458/24649421.jpg?v=638410102851330000',
  true, 52
),
(
  'a1210000-0000-4000-a103-000000000054', 'b1100000-0000-4000-a110-000000000003', 'Res Jarrete/Murillo/Pepino Tradicional Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/res-jarrete-murillo-pepino-tradicional/p. Marca: Mercapollo. 1',
  '🥩', 27880, 'Carnes De Res Y Otras', 'https://olimpica.vteximg.com.br/arquivos/ids/1404609/24010078.jpg?v=638506134209570000',
  true, 53
),
(
  'a1210000-0000-4000-a103-000000000055', 'b1100000-0000-4000-a110-000000000003', 'Pechuga de Pollo Avicampo sin Piel Bandeja Familia X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pollo-pechug-ef-sin-piel-bandeja-flia-avicam-24040501-14107/p. Marca: Avicampo. Pechuga de Pollo Avicampo Sin Piel Bandeja Familia',
  '🛒', 22792, 'Aves', 'https://olimpica.vteximg.com.br/arquivos/ids/1410371/24040501.jpg?v=638506229548530000',
  true, 54
),
(
  'a1210000-0000-4000-a103-000000000056', 'b1100000-0000-4000-a110-000000000003', 'Leche Alpina Uht Deslactosada 1,1 Lt X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-alpina-deslactosada-bolsa-11-l-x6-7702001029716-1478933/p. Marca: Alpina. Leche Uht Alpina Deslactosada 1,1 Lt X6 Unds. Aquí puedes encontrar más productos Alpina',
  '🥛', 29990, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424120/7702001029716.jpg?v=638815526900970000',
  true, 55
),
(
  'a1210000-0000-4000-a103-000000000057', 'b1100000-0000-4000-a110-000000000003', 'Huevo Kikes Rojo AA X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-aa-rojo-pet-kikes-30un-7707304621100-1353948/p. Marca: Kikes. Huevos AA Kikes Rojos X30 Unds. Aquí puedes encontrar más productos marca Kikes',
  '🥛', 18375, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/1474154/7707304621100-30L.jpg?v=638593694124970000',
  true, 56
),
(
  'a1210000-0000-4000-a103-000000000058', 'b1100000-0000-4000-a110-000000000003', 'HUEVO X 30 UNDS TIPO A Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-x-30-un-t-a/p. Marca: Acondesa. HUEVO X 30 UN T/A',
  '🥛', 14100, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/1490716/HUEVOS_1.jpg?v=638629800670230000',
  true, 57
),
(
  'a1210000-0000-4000-a103-000000000059', 'b1100000-0000-4000-a110-000000000003', 'Leche Medalla de Oro Uht Entera 900 Ml X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-medalla-oro-ent-900ml-x6un/p. Marca: Medalla De Oro. LECHE UHT MEDALLA ORO ENT 900ML X6un',
  '🥛', 18490, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1882330/7701008628281.jpg?v=638872427663100000',
  true, 58
),
(
  'a1210000-0000-4000-a103-000000000060', 'b1100000-0000-4000-a110-000000000003', 'Huevo Santa Anita Rojo A X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-santa-anita-a-rojo-30-und-panal-7706772301071-851093/p. Marca: Santa Anita. Huevos A Santa Anita Rojos X30 Unds',
  '🥛', 14100, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/625849/7706772301071.jpg?v=637626539696800000',
  true, 59
),
(
  'a1210000-0000-4000-a103-000000000061', 'b1100000-0000-4000-a110-000000000003', 'Queso Colanta Crema 230 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-crem-colanta-230-g/p. Marca: Colanta. Queso Crema Colanta 230 G',
  '🥛', 4492, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1423046/7702129025201.jpg?v=638808545079030000',
  true, 60
),
(
  'a1210000-0000-4000-a103-000000000062', 'b1100000-0000-4000-a110-000000000003', 'Leche Medalla de Oro Uht Deslactosada 900 Ml X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-medalla-oro-deslac-900ml-x6un/p. Marca: Medalla De Oro. LECHE UHT MEDALLA ORO DESLAC 900ML X6un',
  '🥛', 19190, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1882261/7701008628328.jpg?v=638872413974170000',
  true, 61
),
(
  'a1210000-0000-4000-a103-000000000063', 'b1100000-0000-4000-a110-000000000003', 'Queso Alpina Parmesano Rallado 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-parmesano-rallado-alpina-250-g-7702001012084-2007748/p. Marca: Alpina. Queso Alpina Parmesano Rallado 250 G',
  '🥛', 31500, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/2293944/7702001012084.jpg?v=638973414058700000',
  true, 62
),
(
  'a1210000-0000-4000-a103-000000000064', 'b1100000-0000-4000-a110-000000000003', 'Queso Alpina Parmesano Rallado 100 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-parmesano-rallado-alpina-100-g-7702001012053-2007746/p. Marca: Alpina. Queso Alpina Parmesano Rallado 100 G',
  '🥛', 13800, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/2293941/7702001012053.jpg?v=638973413804870000',
  true, 63
),
(
  'a1210000-0000-4000-a103-000000000065', 'b1100000-0000-4000-a110-000000000003', 'Leche Colanta Deslactosada 1,1 Lt X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-colanta-deslactosada-11-l-x-6-7702129006194-1653504/p. Marca: Colanta. LECHE COLANTA DESLACTOSADA 1.1 L X 6',
  '🥛', 33900, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1491269/7702129006194.jpg?v=638633875459730000',
  true, 64
),
(
  'a1210000-0000-4000-a103-000000000066', 'b1100000-0000-4000-a110-000000000003', 'Leche Colanta Uht Entera 1,1 Lt X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-colanta-entera-11-l-x6-7702129003612-1623329/p. Marca: Colanta. LECHE UHT COLANTA ENTERA 1.1 L X6',
  '🥛', 35290, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1491265/7702129003612.jpg?v=638633871589470000',
  true, 65
),
(
  'a1210000-0000-4000-a103-000000000067', 'b1100000-0000-4000-a110-000000000003', 'Queso Finesse Mozarella 450 G X30 Tajadas Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-alpina-finesse-tajado-450-g-7702001121786-1401106/p. Marca: Finesse. Queso Alpina Finesse Tajado 450 G. Aquí puedes encontrar más productos Finesse',
  '🥛', 26520, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1852795/7702001121786.png.png?v=638826779079730000',
  true, 66
),
(
  'a1210000-0000-4000-a103-000000000068', 'b1100000-0000-4000-a110-000000000003', 'Queso Finesse 239 G X15 Tajadas Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-alpina-finesse-tajado-239-g-7702001121779-1401105/p. Marca: Finesse. Queso Alpina Finesse 15 Tajado X239 G',
  '🥛', 15350, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1852796/7702001121779.png.png?v=638826779400430000',
  true, 67
),
(
  'a1210000-0000-4000-a103-000000000069', 'b1100000-0000-4000-a110-000000000003', 'Queso Alpina Mozzarella Tajado 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-alpina-mozarella-tajado-400-g-7702001121762-1401103/p. Marca: Alpina. Queso Alpina Mozzarella Tajado 400 G',
  '🥛', 19440, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424184/7702001121762.jpg?v=638514013610100000',
  true, 68
),
(
  'a1210000-0000-4000-a103-000000000070', 'b1100000-0000-4000-a110-000000000003', 'Queso Alpina Mozzarella 240 G X15 Tajadas Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-alpina-mozarella-tajado-240-g-7702001121755-1401102/p. Marca: Alpina. Queso Alpina Mozzarella 15 Tajado X240 G',
  '🥛', 12600, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1852797/7702001121755.png.png?v=638826779674430000',
  true, 69
),
(
  'a1210000-0000-4000-a103-000000000071', 'b1100000-0000-4000-a110-000000000003', 'Queso Colanta Campesino 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-campes-colanta-250-g/p. Marca: Colanta. Queso Campesino Colanta 250 G',
  '🥛', 8650, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1491258/7702129015523-.jpg?v=638633866000500000',
  true, 70
),
(
  'a1210000-0000-4000-a103-000000000072', 'b1100000-0000-4000-a110-000000000003', 'Bon Yurt Zucaritas 170 G X4 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-lacteo-bonyurt-zucaritas-multiempaque-170g-x4-7702001100736-1037781/p. Marca: Bonyurt. Bon Yurt Zucaritas 170 G X4 Unds',
  '🥛', 13880, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424156/7702001100736.jpg?v=638816295319000000',
  true, 71
),
(
  'a1210000-0000-4000-a103-000000000073', 'b1100000-0000-4000-a110-000000000003', 'Huevo Santa Anita Rojo B Amarrado X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-santa-anita-panal-amarrado-tipo-b-30-und-7706772300319-916381/p. Marca: Santa Anita. Huevos B Santa Anita Amarrado Rojos X30 Unds',
  '🥛', 12900, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/628238/7706772300319.jpg?v=637626543979830000',
  true, 72
),
(
  'a1210000-0000-4000-a103-000000000074', 'b1100000-0000-4000-a110-000000000003', 'Leche Alpina Uht Deslactosada 1 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-alpina-deslactosada-caja-1-l-7702001045310-507205/p. Marca: Alpina. Leche Uht Alpina Deslactosada 1 Lt',
  '🥛', 8600, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424066/7702001045310.jpg?v=638815436118670000',
  true, 73
),
(
  'a1210000-0000-4000-a103-000000000075', 'b1100000-0000-4000-a110-000000000003', 'Queso Colanta Mozzarella Tajado 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-mozar-colanta-taj-250-g/p. Marca: Colanta. Queso Mozzarella Colanta Tajado 250 G',
  '🥛', 12900, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1423080/7702129020800.jpg?v=638813987100000000',
  true, 74
),
(
  'a1210000-0000-4000-a103-000000000076', 'b1100000-0000-4000-a110-000000000003', 'Queso Colanta Crema 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-colanta-crem-400-g/p. Marca: Colanta. Queso Crema Colanta 400 G',
  '🥛', 8800, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1423047/7702129025157.jpg?v=638512991116330000',
  true, 75
),
(
  'a1210000-0000-4000-a103-000000000077', 'b1100000-0000-4000-a110-000000000003', 'QSO MEDALLA DE ORO T/MOZAR TAJ 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-medalla-de-oro-t-mozar-taj-400-g/p. Marca: Medalla De Oro. QSO MEDALLA DE ORO T/MOZAR TAJ 400 G',
  '🥛', 11990, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/2360689/7701008845398_1.jpg?v=639087538322470000',
  true, 76
),
(
  'a1210000-0000-4000-a103-000000000078', 'b1100000-0000-4000-a110-000000000003', 'HUEVO X 30 UND TIPO B Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-x-30-un-t-b/p. Marca: SIN MARCA 2. HUEVO X 30 UN T/B',
  '🥛', 12900, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/1490714/HUEVOS_2.jpg?v=638629800273000000',
  true, 77
),
(
  'a1210000-0000-4000-a103-000000000079', 'b1100000-0000-4000-a110-000000000003', 'Leche Alquería Original 1,1 Lt X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-alqueria-original-1100ml-x-6un/p. Marca: Alqueria. Leche Sabor Original Alqueria 1.1L x6unds',
  '🥛', 37350, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1881651/7702177022542.jpg?v=638871759024870000',
  true, 78
),
(
  'a1210000-0000-4000-a103-000000000080', 'b1100000-0000-4000-a110-000000000003', 'Huevo Nápoles Rojo AA X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-napoles-aar-x30-vitafilado-7700624102038-2037326/p. Marca: Napoles. Huevos AA Nápoles Rojos X30 Unds',
  '🥛', 24000, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/645420/7700624102038.jpg?v=638948477213470000',
  true, 79
),
(
  'a1210000-0000-4000-a103-000000000081', 'b1100000-0000-4000-a110-000000000003', 'Yogo Yogo Alpina Fresa 1000 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-lacteo-yogo-yogo-1000-g--fresa-7702001046409-2004783/p. Marca: Yogo Yogo. ALIMENTO LACTEO YOGO YOGO 1000 g, FRESA',
  '🥛', 6240, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/2266260/7702001046409.jpg?v=638954471884570000',
  true, 80
),
(
  'a1210000-0000-4000-a103-000000000082', 'b1100000-0000-4000-a110-000000000003', 'Queso ALPINA campesino x250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-campes-alpina-250-g/p. Marca: Alpina. Queso Alpina campesino x250g',
  '🥛', 13590, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/2253710/7702001016068.jpg?v=638941731014870000',
  true, 81
),
(
  'a1210000-0000-4000-a103-000000000083', 'b1100000-0000-4000-a110-000000000003', 'Leche Alpina Uht Entera 1,1 Lt X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-alpina-entera-bolsa-11-l-x6-7702001041411-1586145/p. Marca: Alpina. LECHE UHT ALPINA ENTERA BOLSA 1.1 L X6',
  '🥛', 45900, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424140/7702001041411.jpg?v=638811049795300000',
  true, 82
),
(
  'a1210000-0000-4000-a103-000000000084', 'b1100000-0000-4000-a110-000000000003', 'Salchicha Ranchera 480 G X14 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/salchicha-ranchera-480-g-7701101247266-1362715/p. Marca: Ranchera. La recompensa al mejor sabor del rancho se lo llevan esta jugosa y doradita salchicha. Prepárala asada y siente su inigualable sabor. Aquí puedes encontrar más productos Ranch',
  '🥩', 28790, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410187/7701101247266-1.jpg?v=639168748821600000',
  true, 83
),
(
  'a1210000-0000-4000-a103-000000000085', 'b1100000-0000-4000-a110-000000000003', 'Jamón de Cerdo Pietrán sin Conservantes 431 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jamon-pietran-estandar-sin-conservante-431g-7701101358542-2154425/p. Marca: Pietran. Delicioso jamón de cerdo sin conservantes, buena fuente de proteína, 97% libre de grasa y 25% reducido en sodio. Con empaque abre fácil que te brinda los ben',
  '🥩', 26150, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410256/7701101358542-1.jpg?v=639168751670530000',
  true, 84
),
(
  'a1210000-0000-4000-a103-000000000086', 'b1100000-0000-4000-a110-000000000003', 'Jamón de Cerdo Pietrán sin Conservantes 230 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jamon-pietran-estandar-sin-conservantes-230g-7701101356098-1521487/p. Marca: Pietran. Jamón Pietrán de Cerdo sin Conservantes 230 G',
  '🥩', 14250, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410251/7701101356098-1.jpg?v=639168751546730000',
  true, 85
),
(
  'a1210000-0000-4000-a103-000000000087', 'b1100000-0000-4000-a110-000000000003', 'Jamón Cunit 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jamon-cunit-x400g-7701101280799-1096549/p. Marca: Cunit. Jamón Cunit 400 G Aquí puedes encontrar más productos Cunit',
  '🥩', 13900, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410120/7701101280799-1.jpg?v=639168746136800000',
  true, 86
),
(
  'a1210000-0000-4000-a103-000000000088', 'b1100000-0000-4000-a110-000000000003', 'Salchicha Cunit Cazadora 500 G X16 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/salchicha-cunit-cazadora-500-g-7702398027982-964916/p. Marca: Cunit. Salchicha Cunit Cazadora 16 Unds X500 G',
  '🥩', 19900, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410115/7702398027982-1.jpg?v=639168745997730000',
  true, 87
),
(
  'a1210000-0000-4000-a103-000000000089', 'b1100000-0000-4000-a110-000000000003', 'Salchicha Ranchera 377 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/salchicha-ranchera-377g/p. Marca: Ranchera. SALCHICHA RANCHERA 377g',
  '🥩', 24150, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410202/7701101361023-1.jpg.jpg?v=639168749486500000',
  true, 88
),
(
  'a1210000-0000-4000-a103-000000000090', 'b1100000-0000-4000-a110-000000000003', 'Mortadela Cunit Linea Económica 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mortadela-cunit-linea-economica-250-g-7702348312045-2002020/p. Marca: Cunit. Mortadela Cunit Linea Económica 250 G',
  '🥩', 5450, 'Carnes Frías', 'https://olimpica.vteximg.com.br/arquivos/ids/2410141/7702348312045-1.jpg?v=639168746759200000',
  true, 89
),
(
  'a1210000-0000-4000-a103-000000000091', 'b1100000-0000-4000-a110-000000000003', 'Atún Van Camp''S Aceite Packs X2 320 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/atun-van-camp-s-aceite-packs-x2-320g/p. Marca: Van Camps. Atún Van Camp''s Aceite Packs X2 320 G',
  '🥩', 11990, 'Carnes Enlatadas', 'https://olimpica.vteximg.com.br/arquivos/ids/1395424/7702367801063.jpg?v=638496784113800000',
  true, 90
),
(
  'a1210000-0000-4000-a103-000000000092', 'b1100000-0000-4000-a110-000000000003', 'Harina Pan de Maíz Blanco 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/harina-de-maiz-blanco-pan-1-kg-7702084137520--2004701/p. Marca: Pan. Harina de Maíz Pan Blanco 1 Kg. Aquí puedes encontrar más productos marca Pan',
  '🛒', 3600, 'Harinas', 'https://olimpica.vteximg.com.br/arquivos/ids/685195/7702084137520.jpg?v=637684581490100000',
  true, 91
),
(
  'a1210000-0000-4000-a103-000000000093', 'b1100000-0000-4000-a110-000000000003', 'Aceite Medalla de Oro Mezcla 3 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aceite-medalla-oro-mezcla-3-l/p. Marca: Medalla De Oro. ACEITE MEDALLA ORO MEZCLA 3 L',
  '🛒', 19490, 'Aceites', 'https://olimpica.vteximg.com.br/arquivos/ids/2388491/7701008624894_1.jpg?v=639128955798630000',
  true, 92
),
(
  'a1210000-0000-4000-a103-000000000094', 'b1100000-0000-4000-a110-000000000003', 'Sal Refisal 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/sal-refisal-1-kg/p. Marca: Refisal. Sal Refisal 1 Kg. Aquí puedes encontrar más productos marca Refisal',
  '🛒', 2950, 'Salsas-Aderezos-Condimentos', 'https://olimpica.vteximg.com.br/arquivos/ids/822290/7703812101202.jpg?v=637872730400800000',
  true, 93
),
(
  'a1210000-0000-4000-a103-000000000095', 'b1100000-0000-4000-a110-000000000003', 'Azúcar Olimpica Blanca 2,5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/azucar-blanca-olimpica-2-5-kg/p. Marca: Olimpica. AZUCAR-BLANCA-OLIMPICA-2.5-KG',
  '🛒', 9500, 'Endulzantes', 'https://olimpica.vteximg.com.br/arquivos/ids/1735380/7701008661394.jpg?v=638732377526830000',
  true, 94
),
(
  'a1210000-0000-4000-a103-000000000096', 'b1100000-0000-4000-a110-000000000003', 'Aceite Premier de Girasol 2700 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aceite-premier-girasol-2700ml/p. Marca: Premier. ACEITE PREMIER GIRASOL 2700ML',
  '🛒', 43567, 'Aceites', 'https://olimpica.vteximg.com.br/arquivos/ids/1300141/7701018076430.jpg?v=638428552067630000',
  true, 95
),
(
  'a1210000-0000-4000-a103-000000000097', 'b1100000-0000-4000-a110-000000000003', 'Atún Van Camp''s Agua 320 G X2 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/atun-van-camp-s-agua-packs-x2-320g/p. Marca: Van Camps. Atún Van Camp''s Agua Packs X2 320 G',
  '🥩', 11990, 'Carnes Enlatadas', 'https://olimpica.vteximg.com.br/arquivos/ids/1395425/7702367686585.jpg?v=638496784174800000',
  true, 96
),
(
  'a1210000-0000-4000-a103-000000000098', 'b1100000-0000-4000-a110-000000000003', 'Azúcar Manuelita 2,5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/azucar-manuelita-poliet-2-5-kg/p. Marca: Manuelita. AZUCAR MANUELITA POLIET 2.5 kg Aquí puedes encontrar más productos marca Manuelita',
  '🛒', 8600, 'Endulzantes', 'https://olimpica.vteximg.com.br/arquivos/ids/1789448/7702406000150.jpg.jpg?v=638772425094970000',
  true, 97
),
(
  'a1210000-0000-4000-a103-000000000099', 'b1100000-0000-4000-a110-000000000003', 'Lenteja Olimpica 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lenteja-olimpica--500-g-7701008001374-2000171/p. Marca: Olimpica. Lenteja Olimpica 500 G',
  '🛒', 1190, 'Granos', 'https://olimpica.vteximg.com.br/arquivos/ids/2354806/7701008001374.jpg?v=639071317918770000',
  true, 98
),
(
  'a1210000-0000-4000-a103-000000000100', 'b1100000-0000-4000-a110-000000000003', 'Arroz Sabrosón 5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arroz-sabroson-5-kg-7707105805105-2000025/p. Marca: Sabroson. Arroz Sabrosón 5 Kg',
  '🛒', 20500, 'Arroces Empacados Y Granel', 'https://olimpica.vteximg.com.br/arquivos/ids/735866/7707105805105.jpg?v=638896015834200000',
  true, 99
),
(
  'a1210000-0000-4000-a103-000000000101', 'b1100000-0000-4000-a110-000000000003', 'Galleta Saltín Rojo Taco 500 G x5 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-saltin-rojo-taco-x5-500g/p. Marca: Saltin. GALLETA SALTIN ROJO TACO X5 500g',
  '🍿', 7990, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2373302/7702025136988_1.jpg?v=639100481846030000',
  true, 100
),
(
  'a1210000-0000-4000-a103-000000000102', 'b1100000-0000-4000-a110-000000000003', 'Lenteja Olimpica 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lenteja-olimpica-1-kg-7701008001367-990477/p. Marca: Olimpica. Lenteja Olimpica 1 Kg',
  '🛒', 4050, 'Granos', 'https://olimpica.vteximg.com.br/arquivos/ids/2354805/7701008001367.jpg?v=639071317779930000',
  true, 101
),
(
  'a1210000-0000-4000-a103-000000000103', 'b1100000-0000-4000-a110-000000000003', 'Arroz Diana 5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arroz-diana-5-kg-7702511000045-566554/p. Marca: Diana. Arroz Diana 5 Kg. Aquí puedes encontrar más productos marca Diana',
  '🛒', 17990, 'Arroces Empacados Y Granel', 'https://olimpica.vteximg.com.br/arquivos/ids/866350/7702511000045.jpg?v=637910008783030000',
  true, 102
),
(
  'a1210000-0000-4000-a103-000000000104', 'b1100000-0000-4000-a110-000000000003', 'Arroz Diana 3 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arroz-diana-3-kg-7702511000038-518233/p. Marca: Diana. Arroz Diana 3 Kg',
  '🛒', 12990, 'Arroces Empacados Y Granel', 'https://olimpica.vteximg.com.br/arquivos/ids/866346/7702511000038.jpg?v=637910007481170000',
  true, 103
),
(
  'a1210000-0000-4000-a103-000000000105', 'b1100000-0000-4000-a110-000000000003', 'Frijol Olimpica Riego Zaragoza Rosado 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/frijol-olimpica-rosado-riego-zaragoza-500-g-7701008001930-16365/p. Marca: Olimpica. Frijol Olimpica Riego Zaragoza Rosado 500 G',
  '🛒', 3990, 'Granos', 'https://olimpica.vteximg.com.br/arquivos/ids/2354812/7701008001930.jpg?v=639071318851070000',
  true, 104
),
(
  'a1210000-0000-4000-a103-000000000106', 'b1100000-0000-4000-a110-000000000003', 'LENTEJA DIANA 500G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lenteja-diana-500g/p. Marca: Diana. LENTEJA DIANA 500G',
  '🛒', 2390, 'Granos', 'https://olimpica.vteximg.com.br/arquivos/ids/1902356/7702511002933.jpg?v=638902630250730000',
  true, 105
),
(
  'a1210000-0000-4000-a103-000000000107', 'b1100000-0000-4000-a110-000000000003', 'ARROZ TAILANDES 2.500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arroz-tailandes-2-500-g/p. Marca: Tailandes. ARROZ TAILANDES 2.500 G',
  '🛒', 12500, 'Arroces Empacados Y Granel', 'https://olimpica.vteximg.com.br/arquivos/ids/1895417/7707105807055.jpg?v=638884560344400000',
  true, 106
),
(
  'a1210000-0000-4000-a103-000000000108', 'b1100000-0000-4000-a110-000000000003', 'HARINA TRIGO MEDALLA DE ORO FORTIFI 500G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/harina-trigo-medalla-de-oro-fortifi-500g/p. Marca: Medalla De Oro. HARINA TRIGO MEDALLA DE ORO FORTIFI 500G',
  '🛒', 1700, 'Harinas', 'https://olimpica.vteximg.com.br/arquivos/ids/2360691/7701008845541_1.jpg?v=639087538649900000',
  true, 107
),
(
  'a1210000-0000-4000-a103-000000000109', 'b1100000-0000-4000-a110-000000000003', 'Galleta Oreo 360 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-oreo-bsa-360-g-7622201764340/p. Marca: Oreo. GALLETA OREO BSA 360 G',
  '🛒', 9742, 'Galletas', 'https://olimpica.vteximg.com.br/arquivos/ids/1469272/7622201764340_1.jpg?v=638573859716400000',
  true, 108
),
(
  'a1210000-0000-4000-a103-000000000110', 'b1100000-0000-4000-a110-000000000003', 'Salsa Olimpica de Tomate 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/salsa-tom-olimpica-dp-500g/p. Marca: Olimpica. SALSA TOM OLIMPICA DP 500G',
  '🛒', 4490, 'Salsas-Aderezos-Condimentos', 'https://olimpica.vteximg.com.br/arquivos/ids/1837117/7701008844254.jpg.jpg?v=638797278308300000',
  true, 109
),
(
  'a1210000-0000-4000-a103-000000000111', 'b1100000-0000-4000-a110-000000000003', 'Arroz Diana Paca 12,5 Kg X25 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arroz-diana-paca-25-und-12-500-g/p. Marca: Diana. ARROZ DIANA PACA 25 UND 12.500 G',
  '🛒', 49990, 'Arroces Empacados Y Granel', 'https://olimpica.vteximg.com.br/arquivos/ids/1548941/7702511000052.jpg?v=638654026694500000',
  true, 110
),
(
  'a1210000-0000-4000-a103-000000000112', 'b1100000-0000-4000-a110-000000000003', 'Aceite Premier de Girasol 1800 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aceite-premier-girasol-1800ml/p. Marca: Premier. ACEITE PREMIER GIRASOL 1800ML',
  '🛒', 29392, 'Aceites', 'https://olimpica.vteximg.com.br/arquivos/ids/1300140/7701018076423.jpg?v=638428551522630000',
  true, 111
),
(
  'a1210000-0000-4000-a103-000000000113', 'b1100000-0000-4000-a110-000000000003', 'Aceite Premier de Girasol 900 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aceite-premier-girasol-900ml/p. Marca: Premier. ACEITE PREMIER GIRASOL 900ML',
  '🛒', 15037, 'Aceites', 'https://olimpica.vteximg.com.br/arquivos/ids/1463806/7701018076416.jpg?v=638566709341570000',
  true, 112
),
(
  'a1210000-0000-4000-a103-000000000114', 'b1100000-0000-4000-a110-000000000003', 'Aderezo Mostaza San Jorge 100 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/aderezo-s-jorge-mostaza-100gr/p. Marca: San Jorge. ADEREZO S/JORGE MOSTAZA 100gr',
  '🛒', 2212, 'Salsas-Aderezos-Condimentos', 'https://olimpica.vteximg.com.br/arquivos/ids/2201103/7702014924008_1.png?v=638925061442870000',
  true, 113
),
(
  'a1210000-0000-4000-a103-000000000115', 'b1100000-0000-4000-a110-000000000003', 'GALLETA DUCALES TACO X5 500g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-ducales-taco-x5-500g/p. Marca: Ducales. GALLETA DUCALES TACO X5 500g',
  '🛒', 14100, 'Galletas', 'https://olimpica.vteximg.com.br/arquivos/ids/1788908/7702025149520_1.png.png?v=638771506883570000',
  true, 114
),
(
  'a1210000-0000-4000-a103-000000000116', 'b1100000-0000-4000-a110-000000000003', 'CAFE SELLO ROJO 425G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cafe-sello-rojo-425g/p. Marca: Sello Rojo. CAFE SELLO ROJO 425G',
  '🛒', 22990, 'Cafés', 'https://olimpica.vteximg.com.br/arquivos/ids/2391640/7702032117833_1.png?v=639134999360470000',
  true, 115
),
(
  'a1210000-0000-4000-a103-000000000117', 'b1100000-0000-4000-a110-000000000003', 'Huevo Kikes Rojo AAA X15 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/huevo-aaa-jo-pet-x15-un-kikes-7707304621384-2136304/p. Marca: Kikes. Huevos AAA Kikes Jo Pet X15 Unds',
  '🥛', 10725, 'Huevos', 'https://olimpica.vteximg.com.br/arquivos/ids/1474151/7707304621384-15XL.jpg?v=638593691909730000',
  true, 116
),
(
  'a1210000-0000-4000-a103-000000000118', 'b1100000-0000-4000-a110-000000000003', 'CHOCOLATE CORONA 450G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/chocolate-corona-450g/p. Marca: CORONA. CHOCOLATE CORONA 450G',
  '🛒', 17250, 'Chocolates de Mesa', 'https://olimpica.vteximg.com.br/arquivos/ids/2391619/7702007084535_1.png?v=639134997650270000',
  true, 117
),
(
  'a1210000-0000-4000-a103-000000000119', 'b1100000-0000-4000-a110-000000000003', 'Café Sello Rojo Tradicional 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cafe-sello-rojo-250-g--costa/p. Marca: Sello Rojo. CAFE SELLO ROJO 250 g -COSTA',
  '🛒', 13900, 'Cafés', 'https://olimpica.vteximg.com.br/arquivos/ids/1784985/7702032252190.jpg?v=638767858815600000',
  true, 118
),
(
  'a1210000-0000-4000-a103-000000000120', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Tajado Mantequilla  550 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-tajado-mantequilla-olimpica-550-g-7701008216129--1622293/p. Marca: Olimpica. PAN TAJADO MANTEQUILLA OLIMPICA 550 g',
  '🛒', 5800, 'Pan Empacado', 'https://olimpica.vteximg.com.br/arquivos/ids/643897/7701008216129.jpg?v=639167043040300000',
  true, 119
),
(
  'a1210000-0000-4000-a103-000000000121', 'b1100000-0000-4000-a110-000000000003', 'Café Medalla de Oro Molido 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cafe-medalla-oro-mol-500-g/p. Marca: Medalla De Oro. CAFE MEDALLA ORO MOL 500 g. Aquí puedes encontrar más productos Medalla de Oro',
  '🛒', 19900, 'Cafés', 'https://olimpica.vteximg.com.br/arquivos/ids/2388481/7701008506237_1.jpg?v=639128954587970000',
  true, 120
),
(
  'a1210000-0000-4000-a103-000000000122', 'b1100000-0000-4000-a110-000000000003', 'Leche Olimpica Deslactosada 800 Ml X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-olimpica-deslactosada-800-ml-x6-unds/p. Marca: Olimpica. Leche Deslactosada Olimpica 800 Ml X6 Unds, Olimpica, olimpica, Leche, Leches, leche, leches, Leche de vaca, Leche vaca, leche de vaca, leche vaca, Bebida de proteina, Bebidas de ',
  '🥛', 18390, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1882332/7701008838819.jpg?v=638872434240400000',
  true, 121
),
(
  'a1210000-0000-4000-a103-000000000123', 'b1100000-0000-4000-a110-000000000003', 'Leche Alquería Deslactosada 900 Ml X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-alqueria-deslac-6x900-ml-7702177004814-1232541/p. Marca: Alqueria. Leche Deslactosada Alqueria 900ml x 6unds',
  '🥛', 22771, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1858396/7702177004814.jpg?v=638841295123900000',
  true, 122
),
(
  'a1210000-0000-4000-a103-000000000124', 'b1100000-0000-4000-a110-000000000003', 'Avena Quaker Hojuelas 1100 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/avena-quaker-hojuela-bsa-1100g/p. Marca: Quaker. AVENA QUAKER HOJUELA BSA 1100g. Aquí puedes encontrar más productos Quaker',
  '🛒', 8850, 'Cereales', 'https://olimpica.vteximg.com.br/arquivos/ids/1165367/7702193101313.jpg?v=638327997713970000',
  true, 123
),
(
  'a1210000-0000-4000-a103-000000000125', 'b1100000-0000-4000-a110-000000000003', 'Galleta Ducales Taco 315 G X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-ducales-taco-x3-315g/p. Marca: Ducales. GALLETA DUCALES TACO X3 315g',
  '🛒', 8750, 'Cafés', 'https://olimpica.vteximg.com.br/arquivos/ids/1788911/7702025147915_1.png.png?v=638771507796400000',
  true, 124
),
(
  'a1210000-0000-4000-a103-000000000126', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Tajado Blanco Tradicional 450 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-taj-bco-tradic-olimpica-450g/p. Marca: Olimpica. PAN-TAJ-BCO-TRADIC-OLIMPICA-450g',
  '🛒', 2990, 'Pan Empacado', 'https://olimpica.vteximg.com.br/arquivos/ids/1472066/2299068.png?v=638585424128870000',
  true, 125
),
(
  'a1210000-0000-4000-a103-000000000127', 'b1100000-0000-4000-a110-000000000003', 'Yogurt Alpina Griego Natural 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/yogur-alpina-griego-natural-500g/p. Marca: Alpina. Yogur Alpina Griego Natural 500 G',
  '🥛', 14413, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424318/7702001163885.jpg?v=638791956975730000',
  true, 126
),
(
  'a1210000-0000-4000-a103-000000000128', 'b1100000-0000-4000-a110-000000000003', 'Leche Colanta Uht Deslactosada 1000 Ml X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-colanta-deslactosada-1000ml-x6/p. Marca: Colanta. LECHE UHT COLANTA DESLACTOSADA 1000ML X6',
  '🥛', 32100, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1423494/7702129004985.jpg?v=638815563916470000',
  true, 127
),
(
  'a1210000-0000-4000-a103-000000000129', 'b1100000-0000-4000-a110-000000000003', 'Queso Colanta Costeño Bloque 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-colanta-costeno-bloque-500g/p. Marca: Colanta. Queso Colanta Costeño Bloque 500 G',
  '🥛', 15272, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1491260/7702129016421.jpg?v=638633867124330000',
  true, 128
),
(
  'a1210000-0000-4000-a103-000000000130', 'b1100000-0000-4000-a110-000000000003', 'Leche Olimpica Uht Entera 800 Ml X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/leche-uht-olimpica-ent-bsa-800ml-x6/p. Marca: Olimpica. LECHE UHT OLIMPICA ENT BSA 800ML X6',
  '🥛', 17590, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1882346/7701008838796.jpg?v=638872435553600000',
  true, 129
),
(
  'a1210000-0000-4000-a103-000000000131', 'b1100000-0000-4000-a110-000000000003', 'ATUN ZENU LOMO E/AGUA 160g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/atun-zenu-lomo-e-agua-160g/p. Marca: Zenu. ATUN ZENU LOMO E/AGUA 160g',
  '🛒', 8000, 'Cereales', 'https://olimpica.vteximg.com.br/arquivos/ids/2279740/7701101359594.jpg?v=639167045444700000',
  true, 130
),
(
  'a1210000-0000-4000-a103-000000000132', 'b1100000-0000-4000-a110-000000000003', 'ATUN ZENU LOMO E/ACEITE GIRASOL 160g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/atun-zenu-lomo-e-aceite-girasol-160g/p. Marca: Zenu. ATUN ZENU LOMO E/ACEITE GIRASOL 160g',
  '🛒', 8000, 'Cereales', 'https://olimpica.vteximg.com.br/arquivos/ids/2279739/7701101359587.jpg?v=639167045598670000',
  true, 131
),
(
  'a1210000-0000-4000-a103-000000000133', 'b1100000-0000-4000-a110-000000000003', 'Café Juan Valdez Colina Molido 454 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cafe-juan-valdez-col-454g/p. Marca: Juan Valdez. El Café Colina Juan Valdez es un café balanceado con notas de sabor a durazno y chocolate blanco. Un café premium seleccionado que nace del trabajo de nuestros caficultores colombianos. Present',
  '🛒', 47890, 'Cafés', 'https://olimpica.vteximg.com.br/arquivos/ids/1860787/7701362015956_a.jpg?v=638847541186300000',
  true, 132
),
(
  'a1210000-0000-4000-a103-000000000134', 'b1100000-0000-4000-a110-000000000003', 'Mantequilla Alpina sin Sal Barra 125 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mantequilla-alpina-sin-sal-125-g-7702001020096-2005982/p. Marca: Alpina. Margarina en Barra Alpina sin Sal x125 G',
  '🛒', 9040, 'Mantequilla y Margarina', 'https://olimpica.vteximg.com.br/arquivos/ids/1424126/7702001020096.jpg?v=638816290425270000',
  true, 133
),
(
  'a1210000-0000-4000-a103-000000000135', 'b1100000-0000-4000-a110-000000000003', 'Café Colcafé Clásico 85 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cafe-colcafe-clasico-85-g/p. Marca: Colcafe. CAFE COLCAFE CLASICO 85 g',
  '🛒', 12632, 'Cafés', 'https://olimpica.vteximg.com.br/arquivos/ids/1836244/7702032253135_1-1-.png.png?v=638793261099430000',
  true, 134
),
(
  'a1210000-0000-4000-a103-000000000136', 'b1100000-0000-4000-a110-000000000003', 'PAN BLANCO BIMBO 730GR Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-blanco-bimbo-730gr/p. Marca: Bimbo. PAN BLANCO BIMBO 730GR',
  '🍞', 9090, 'Panadería', 'https://olimpica.vteximg.com.br/arquivos/ids/2247223/7705326023261.jpg?v=638937356026470000',
  true, 135
),
(
  'a1210000-0000-4000-a103-000000000137', 'b1100000-0000-4000-a110-000000000003', 'GALLETA CLUB SOCIAL TACO 288G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-club-social-taco-288g/p. Marca: Club Social. GALLETA CLUB SOCIAL TACO 288G',
  '🍞', 10490, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2347435/7622202244759.jpg?v=639046093052030000',
  true, 136
),
(
  'a1210000-0000-4000-a103-000000000138', 'b1100000-0000-4000-a110-000000000003', 'LAMINAS DE MAIZ SANISSIMO 140G SALMAS Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/laminas-de-maiz-sanissimo-140g-salmas-/p. Marca: Sanissimo. LAMINAS DE MAIZ SANISSIMO 140G SALMAS',
  '🍞', 13000, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2335084/7705326254245.jpg?v=639033827367970000',
  true, 137
),
(
  'a1210000-0000-4000-a103-000000000139', 'b1100000-0000-4000-a110-000000000003', 'PAN BLANCO BIMBO 600GR Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-blanco-bimbo-600gr/p. Marca: Bimbo. PAN BLANCO BIMBO 600GR',
  '🍞', 7890, 'Panadería', 'https://olimpica.vteximg.com.br/arquivos/ids/2247222/7705326468727.jpg?v=638937355843700000',
  true, 138
),
(
  'a1210000-0000-4000-a103-000000000140', 'b1100000-0000-4000-a110-000000000003', 'AZUCAR MANUELITA DORADA NATURAL X 907 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/azucar-manuelita-dorada-natural-x-907-g/p. Marca: Manuelita. AZUCAR MANUELITA DORADA NATURAL X 907 G',
  '🛒', 5550, 'Endulzantes', 'https://olimpica.vteximg.com.br/arquivos/ids/1780138/7702406179139.jpg.jpg?v=638755032592270000',
  true, 139
),
(
  'a1210000-0000-4000-a103-000000000141', 'b1100000-0000-4000-a110-000000000003', 'PONQ RAMITO 8 UND 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/ponq-ramito-8-und-200-g/p. Marca: Ramo. 1',
  '🍞', 9590, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2409150/7702914603485.jpg?v=639167538893970000',
  true, 140
),
(
  'a1210000-0000-4000-a103-000000000142', 'b1100000-0000-4000-a110-000000000003', 'PAN BLANDITO OLIMPICA DESAYUNO X 20 UNID Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-blandito-olimpica-desayuno-x-20-unid/p. Marca: Olimpica. 1',
  '🍞', 70000, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/1601273/25073522.jpg?v=638695349735770000',
  true, 141
),
(
  'a1210000-0000-4000-a103-000000000143', 'b1100000-0000-4000-a110-000000000003', 'Pan Mauka de Sagú Tajado sin Gluten 450 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-sagu-s-gluten-taj-mauka-450g/p. Marca: Sin Marca. Pan Mauka de Sagú Tajado Sin Gluten x450 G',
  '🍞', 15990, 'Panadería', 'https://olimpica.vteximg.com.br/arquivos/ids/1853964/7709730504774.jpg.jpg?v=638829121511530000',
  true, 142
),
(
  'a1210000-0000-4000-a103-000000000144', 'b1100000-0000-4000-a110-000000000003', 'Panecillo Olimpica Mantequilla 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panecillo-olimpica-manteq-400-g/p. Marca: Olimpica. PANECILLO-OLIMPICA-MANTEQ-400-g',
  '🍞', 6500, 'Panadería', 'https://olimpica.vteximg.com.br/arquivos/ids/1472069/2266366.png?v=638585426461130000',
  true, 143
),
(
  'a1210000-0000-4000-a103-000000000145', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Aliñado 440 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-alinado-olimpica-440-g-25066821--1642065/p. Marca: Olimpica. Pan Aliñado Olimpica 440 G',
  '🍞', 7990, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/644170/25066821.jpg?v=637626591974630000',
  true, 144
),
(
  'a1210000-0000-4000-a103-000000000146', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Francés con Ajo y Queso 350 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-frances-olimpica-con-ajo-y-queso-350-g-25061901-804308/p. Marca: Olimpica. Pan Francés Olimpica Con Ajo y Queso 350 G',
  '🍞', 6990, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/624024/25061901.jpg?v=637626536170400000',
  true, 145
),
(
  'a1210000-0000-4000-a103-000000000147', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Ocañero 360 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-ocanero-olimpica-360-g-7701008250130--697355/p. Marca: Olimpica. Pan Ocañero Olimpica 360 G',
  '🍞', 5800, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/620373/7701008250130.jpg?v=638964094124630000',
  true, 146
),
(
  'a1210000-0000-4000-a103-000000000148', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Piñita Mojicón 290G X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-pinita-olimpica-mojicon-6un-290g-25060782-647739/p. Marca: Olimpica. Pan Piñita Olimpica Mojicón 290G X6 Unds',
  '🍞', 7390, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/735707/25060782.jpg?v=637782322092970000',
  true, 147
),
(
  'a1210000-0000-4000-a103-000000000149', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Roscón Bocadillo 180 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-roscon-olimpica-bocadillo-180-g-25060249--350508/p. Marca: Olimpica. Pan Roscón Olimpica Bocadillo 180 G',
  '🍞', 3990, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/803335/350508.jpg?v=637858161203500000',
  true, 148
),
(
  'a1210000-0000-4000-a103-000000000150', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Mantequilla Especial 360 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-mantequilla-olimpica-especial-360-g-25060393--35271/p. Marca: Olimpica. Pan Mantequilla Olimpica Especial 360 G',
  '🍞', 8500, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/735664/25060393.jpg?v=637782321642430000',
  true, 149
),
(
  'a1210000-0000-4000-a103-000000000151', 'b1100000-0000-4000-a110-000000000003', 'TORTILLA INTEGRAL MEDALLA DE ORO 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/tortilla-integral-medalla-de-oro-250-g/p. Marca: Medalla De Oro. TORTILLA INTEGRAL MEDALLA DE ORO 250 G',
  '🍞', 4050, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2388648/7701008848290_1.jpg?v=639129067278300000',
  true, 150
),
(
  'a1210000-0000-4000-a103-000000000152', 'b1100000-0000-4000-a110-000000000003', 'PONQ BIMBO CASERO VAINIL 200G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/ponq-bimbo-casero-vainil-200g/p. Marca: Bimbo. PONQ BIMBO CASERO VAINIL 200G',
  '🍞', 6800, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2365772/7705326218186.jpg?v=639094462444270000',
  true, 151
),
(
  'a1210000-0000-4000-a103-000000000153', 'b1100000-0000-4000-a110-000000000003', 'TOSTADA VITAL FRUTICEREAL 120G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/tostada-vital-fruticereal-120g/p. Marca: Guadalupe. TOSTADA VITAL FRUTICEREAL 120G',
  '🍞', 5590, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2152619/7705326263889.jpg?v=638913248184770000',
  true, 152
),
(
  'a1210000-0000-4000-a103-000000000154', 'b1100000-0000-4000-a110-000000000003', 'TORTILLA HARINA MEDALLA DE ORO 360 GR Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/tortilla-harina-medalla-de-oro-360-gr/p. Marca: Medalla De Oro. TORTILLA HARINA MEDALLA DE ORO 360 GR',
  '🍞', 6100, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/1780116/7701008845572.jpg.jpg?v=638754901321370000',
  true, 153
),
(
  'a1210000-0000-4000-a103-000000000155', 'b1100000-0000-4000-a110-000000000003', 'BIMBOLETES VAINILLA 8 UND 216G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bimboletes-vainilla-8-und-216g/p. Marca: Bimbo. BIMBOLETES VAINILLA 8 UND 216G',
  '🍞', 8990, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2358665/Bimboletes 8p 216g 7705326289209.jpg?v=639081546835470000',
  true, 154
),
(
  'a1210000-0000-4000-a103-000000000156', 'b1100000-0000-4000-a110-000000000003', 'AZUCAR MANUELITA BLANCA NATURAL X 907 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/azucar-manuelita-blanca-natural-x-907-g/p. Marca: Manuelita. AZUCAR MANUELITA BLANCA NATURAL X 907 G',
  '🛒', 5400, 'Endulzantes', 'https://olimpica.vteximg.com.br/arquivos/ids/1780140/7702406672678.jpg.jpg?v=638755033728170000',
  true, 155
),
(
  'a1210000-0000-4000-a103-000000000157', 'b1100000-0000-4000-a110-000000000003', 'AZUCAR MANUELITA DORADA NATURAL X 1800 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/azucar-manuelita-dorada-natural-x-1800-g/p. Marca: Manuelita. AZUCAR MANUELITA DORADA NATURAL X 1800 G',
  '🛒', 10900, 'Endulzantes', 'https://olimpica.vteximg.com.br/arquivos/ids/1780137/7702406118152.jpg.jpg?v=638755032205700000',
  true, 156
),
(
  'a1210000-0000-4000-a103-000000000158', 'b1100000-0000-4000-a110-000000000003', 'Pan de Arroz Spiga 360 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-arroz-spiga-360g/p. Marca: Sin Marca. Pan de Arroz Spiga x360 G',
  '🍞', 14350, 'Panadería', 'https://olimpica.vteximg.com.br/arquivos/ids/1882636/7709248488030.jpg?v=638875132967100000',
  true, 157
),
(
  'a1210000-0000-4000-a103-000000000159', 'b1100000-0000-4000-a110-000000000003', 'PONQ GANSITO RAMO X6 un 222 g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/ponq-gansito-ramo-x6-un-222-g/p. Marca: Ramo. 1',
  '🍞', 12650, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/2409148/7702914600859.jpg?v=639167538194400000',
  true, 158
),
(
  'a1210000-0000-4000-a103-000000000160', 'b1100000-0000-4000-a110-000000000003', 'Pan Fithub Trenza de Arroz 180 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-trenza-fithub-arroz-180g/p. Marca: FITHUB. Pan Fithub Trenza de Arroz x180 G',
  '🍞', 11600, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/1854113/7709998052192.jpg.jpg?v=638829165192400000',
  true, 159
),
(
  'a1210000-0000-4000-a103-000000000161', 'b1100000-0000-4000-a110-000000000003', 'Tostada Susanita Con Mantequilla 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/tost-susanita-mantq-250g/p. Marca: Susanita. TOST SUSANITA MANTQ 250g',
  '🍞', 12200, 'Panadería Empacada', 'https://olimpica.vteximg.com.br/arquivos/ids/1113475/7703517853703.jpg?v=638223506793730000',
  true, 160
),
(
  'a1210000-0000-4000-a103-000000000162', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica Integral con Uva y Miel Lonja 530 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-lonja-integral-con-uva-y-miel-olimpica-530g-25061079--1192842/p. Marca: Olimpica. Pan Lonja Integral Con Uva y Miel Olimpica 530 G',
  '🍞', 8900, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/739657/25061079-.jpg?v=637784153951600000',
  true, 161
),
(
  'a1210000-0000-4000-a103-000000000163', 'b1100000-0000-4000-a110-000000000003', 'Pan Olimpica con Queso 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pan-olimpica-con-queso-400-g-25060034--804320/p. Marca: Olimpica. Pan Olimpica Con Queso 400 G',
  '🍞', 9100, 'Panadería Fresca', 'https://olimpica.vteximg.com.br/arquivos/ids/803333/804320.jpg?v=637858155380600000',
  true, 162
),
(
  'a1210000-0000-4000-a103-000000000164', 'b1100000-0000-4000-a110-000000000003', 'Bolsa Compostable No 6 30x55 Cm Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bolsa-compostable-no-6-30-55cm/p. Marca: Sin Marca. BOLSA COMPOSTABLE NO 6 30*55CM',
  '🛒', 520, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/1479662/Correo-de-Hector.png?v=638604518290300000',
  true, 163
),
(
  'a1210000-0000-4000-a103-000000000165', 'b1100000-0000-4000-a110-000000000003', 'Lavaplatos Axion Limón Desengrasante Crema 450 G X2 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lavaloza-crema-axion-limon-450g-x2-p-esp-7702010880797--1245291/p. Marca: Axion. Mantén una higiene impecable en tu cocina con el Lavaplatos en Crema Axion Limón, su presentación de dos unidades por 450 g es ideal para ti y tu familia. Déjate',
  '🧴', 8990, 'Cuidado De Superficies', 'https://olimpica.vteximg.com.br/arquivos/ids/2373308/7702010880797_1.jpg?v=639100483435270000',
  true, 164
),
(
  'a1210000-0000-4000-a103-000000000166', 'b1100000-0000-4000-a110-000000000003', 'PAPEL HIGIENICO SUPPRA CARE TRIP HOJ 33 M X12 ROLL Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/p-hig-suprra-care-trip-hoj-33-m-x12-roll/p. Marca: Suppra Care. P/HIG SUPRRA CARE TRIP HOJ 33 M X12 ROLL',
  '🛒', 14800, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/2405358/7701008846296_1.jpg?v=639159282999770000',
  true, 165
),
(
  'a1210000-0000-4000-a103-000000000167', 'b1100000-0000-4000-a110-000000000003', 'Toalla de Cocina Ultralimp Doble Hoja X80 Hojas Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-coc-ultralimp-dob-hoj-x80-hojas/p. Marca: Ultralimp. TOALLA COC ULTRALIMP DOB HOJ X80 HOJAS',
  '🛒', 2800, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/2405394/7701008844513_1.jpg?v=639159286737430000',
  true, 166
),
(
  'a1210000-0000-4000-a103-000000000168', 'b1100000-0000-4000-a110-000000000003', 'Detergente Líquido UltraLimp Floral 4000 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/detergente-liquido-ultralimp-floral-4l/p. Marca: Ultralimp. DETERGENTE LIQUIDO ULTRALIMP FLORAL 4L',
  '🧴', 18490, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2405462/7701008844056_1.jpg?v=639159292751470000',
  true, 167
),
(
  'a1210000-0000-4000-a103-000000000169', 'b1100000-0000-4000-a110-000000000003', 'Papel Higiénico Familia Acolchamax Mega Rollo 29,6 Mts X12 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/p-higuienico-familia-acmax-mega-ca-29-6m-x12/p. Marca: Familia. Papel Higiénico Familia Acolchamax Mega Rollo 29.6M X12 Unds',
  '🛒', 24990, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/1538068/7702026148492_1.jpg?v=638652882018100000',
  true, 168
),
(
  'a1210000-0000-4000-a103-000000000170', 'b1100000-0000-4000-a110-000000000003', 'Detergente Polvo UltraLimp Aloe Bicarbonato 2,5Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deterg-polv-ultralimp-aloev-bicarb-2-5kg/p. Marca: Ultralimp. DETERG POLV ULTRALIMP ALOEV/BICARB 2.5kg',
  '🧴', 9490, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2405431/7701008841932_1.jpg?v=639159290033700000',
  true, 169
),
(
  'a1210000-0000-4000-a103-000000000171', 'b1100000-0000-4000-a110-000000000003', 'Bolsa de Basura Ultralimp para Papelera 43x48 Cm X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bsa-basur-ultralimp-papeler-43x48-x30un/p. Marca: Ultralimp. Bolsa de Basura Ultralimp para Papelera 43x48 X30 Unds',
  '🛒', 3290, 'Utensilios De Limpieza', 'https://olimpica.vteximg.com.br/arquivos/ids/2405524/7701008628595_1.jpg?v=639159300502000000',
  true, 170
),
(
  'a1210000-0000-4000-a103-000000000172', 'b1100000-0000-4000-a110-000000000003', 'Bolsa de Basura Ultralimp Negra 65x90 Cm X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bsa-basur-ultralimp-neg-65x90-x10un/p. Marca: Ultralimp. Bolsa de Basura Ultralimp Negra 65x90 X10 Unds',
  '🛒', 3150, 'Utensilios De Limpieza', 'https://olimpica.vteximg.com.br/arquivos/ids/2405518/7701008628564_1.jpg?v=639159300092170000',
  true, 171
),
(
  'a1210000-0000-4000-a103-000000000173', 'b1100000-0000-4000-a110-000000000003', 'Detergente en Polvo Ariel Triple Poder 5kg Jabón para Ropa Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/detergente-en-polvo-ariel-triple-poder-para-ropa-blanca-y-de-color-5kg/p. Marca: Ariel. ¿Buscas un detergente en polvo que remueva manchas y deje un aroma increíble en tu ropa? El detergente Ariel Triple Poder° es para ti! La fórmula del jabó',
  '🧴', 41990, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2402406/7500435140669_1.jpg?v=639148842480800000',
  true, 172
),
(
  'a1210000-0000-4000-a103-000000000174', 'b1100000-0000-4000-a110-000000000003', 'Blanqueador UltraLimp Desinfectante 2000 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/blanq-ultra-limp-desinf-2-l/p. Marca: Ultralimp. BLANQ ULTRA LIMP DESINF 2 L',
  '🧴', 2800, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/771218/7701008505025.jpg?v=637808846283800000',
  true, 173
),
(
  'a1210000-0000-4000-a103-000000000175', 'b1100000-0000-4000-a110-000000000003', 'Suavizante Suavitel Cuidado Superior Fresca Primavera 2x 1L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suavizante-suavitel-cuidado-superior-fresca-primavera-1-lt-x2-unds/p. Marca: Suavitel. body, html { margin: 0; padding: 0; } .nebula-nebula-wrapper { font-family: ''Helvetica Neue'', Arial, sans-serif; background: #e8e8e8; margin: 0; padding: 0',
  '🧴', 16440, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2418305/7702010780363_1.jpg?v=639185195755370000',
  true, 174
),
(
  'a1210000-0000-4000-a103-000000000176', 'b1100000-0000-4000-a110-000000000003', 'Toalla de Cocina Olimpica Triple Hoja X100 Uds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-cocina-olimpica-triple-hoja-x-100-7701008229280--787594/p. Marca: Olimpica. TOALLA COCINA OLIMPICA TRIPLE HOJA X 100',
  '🛒', 5590, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/2405605/7701008229280_1.jpg?v=639159307337730000',
  true, 175
),
(
  'a1210000-0000-4000-a103-000000000177', 'b1100000-0000-4000-a110-000000000003', 'Servilleta Olimpica Doble Faz X180 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/servilleta-olimpica-blanca-dob-x4paq-x180un-7701008228610--738148/p. Marca: Olimpica. SERVILLETA OLIMPICA BLANCA DOB X4PAQ X180un',
  '🛒', 3900, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/2405602/7701008228610_1.jpg?v=639159307120000000',
  true, 176
),
(
  'a1210000-0000-4000-a103-000000000178', 'b1100000-0000-4000-a110-000000000003', 'Suavizante Suavitel Cuidado Superior Fresca Primavera 2.3L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suavisante-suavitel-fresca-primavera-2-3l-7509546667683-2173640/p. Marca: Suavitel. Cuida de tus prendas favoritas utilizando el Suavizante de Ropa Suavitel Cuidado Superior Fresca Primavera en su presentación de 2.3 lt, que cuenta con una po',
  '🧴', 15992, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2244014/7509546667683_1--1-.jpg?v=638981203421770000',
  true, 177
),
(
  'a1210000-0000-4000-a103-000000000179', 'b1100000-0000-4000-a110-000000000003', 'Detergente Líquido UltraLimp Lavanda 4000 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deterg-liq-ultralimp-lavanda-4l/p. Marca: Ultralimp. DETERG LIQ ULTRALIMP LAVANDA 4L',
  '🧴', 18490, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2405463/7701008844063_1.jpg?v=639159292932030000',
  true, 178
),
(
  'a1210000-0000-4000-a103-000000000180', 'b1100000-0000-4000-a110-000000000003', 'Detergente Polvo Fab Ultra flash 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deterg-polv-fab-floral-2000g/p. Marca: Fab. Bioenzimas rápidas e inteligentes que despercuden y penetran profundamente las telas removiendo manchas dificiles como grase y comida aún sin remojar, ademas contiene cápsulas de perfume que dejan u',
  '🧴', 20990, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/1161190/7702191164327.jpg?v=638320407441170000',
  true, 179
),
(
  'a1210000-0000-4000-a103-000000000181', 'b1100000-0000-4000-a110-000000000003', 'Papel Higiénico Familia Expert 26 Mts X9 Rollos Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/p-higuienico-familia-expert-ca-26m-x9/p. Marca: Familia. P/HIGUIENICO FAMILIA EXPERT CA 26m X9',
  '🛒', 26050, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/1762174/7702026148539_1.jpg?v=638737747100370000',
  true, 180
),
(
  'a1210000-0000-4000-a103-000000000182', 'b1100000-0000-4000-a110-000000000003', 'Bolsa de Basura Ultralimp Negra 51x75 Cm X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bsa-basur-ultralimp-neg-51x75-x10un/p. Marca: Ultralimp. Bolsa de Basura Ultralimp Negra 51x75 X10 Unds',
  '🛒', 2050, 'Utensilios De Limpieza', 'https://olimpica.vteximg.com.br/arquivos/ids/2405521/7701008628588_1.jpg?v=639159300275000000',
  true, 181
),
(
  'a1210000-0000-4000-a103-000000000183', 'b1100000-0000-4000-a110-000000000003', 'Limpia Pisos Fabuloso Antibacterial Lavanda 2L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/limpia-pisos-fabuloso-antibacterial-lavanda-2-lt/p. Marca: Fabuloso. *{margin:0;padding:0} .nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8} .nebula-nebula-container-main{max-width:800px;margin:0 auto;ba',
  '🧴', 13500, 'Cuidado De Superficies', 'https://olimpica.vteximg.com.br/arquivos/ids/1832771/7702010225109_1.jpg.jpg?v=638787133236000000',
  true, 182
),
(
  'a1210000-0000-4000-a103-000000000184', 'b1100000-0000-4000-a110-000000000003', 'Blanqueador Clorox Original Botella 3.8 lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/blanq-clorox-regular-3-8-l/p. Marca: Clorox. El Blanqueador Clorox 5 en 1 Fórmula Original multiplica los beneficios en un solo producto: Limpia profundamente, Desinfecta eficazmente, Desengrasa, Elimina malos olores y Remueve moho. Su poder ',
  '🧴', 14437, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2347497/7702137624625_1.jpg?v=639046972238970000',
  true, 183
),
(
  'a1210000-0000-4000-a103-000000000185', 'b1100000-0000-4000-a110-000000000003', 'PAPEL HIGIENICO SUPPRA CARE BCO ECN 3H 20M X16 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/p-hig-suppra-care-bco-ecn-3h-20m-x16/p. Marca: Suppra Care. PAPEL HIGENICO SUPPRA CARE BCO ECN 3H 20M X16',
  '🛒', 14400, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/2241809/7701008846302_1.jpg?v=638931129108000000',
  true, 184
),
(
  'a1210000-0000-4000-a103-000000000186', 'b1100000-0000-4000-a110-000000000003', 'LAVALOZA ULTRALIMP CREM 500G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lavaloza-ultralimp-crem-500g/p. Marca: Ultralimp. LAVALOZA ULTRALIMP CREM 500G',
  '🧴', 2750, 'Cuidado De Superficies', 'https://olimpica.vteximg.com.br/arquivos/ids/2405376/7701008847156_1.jpg?v=639159284231600000',
  true, 185
),
(
  'a1210000-0000-4000-a103-000000000187', 'b1100000-0000-4000-a110-000000000003', 'PAPEL HIGIENICO SUPPRA CARE TRIP HOJ 33 M X4 ROLLO Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/p-hig-suppra-care-trip-hoj-33-m-x4-rollo/p. Marca: Suppra Care. PAPEL HIGENICO SUPPRA CARE TRIP HOJ 33 M X4 ROLLO',
  '🛒', 5990, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/2405428/7701008846289_1.jpg?v=639159289846000000',
  true, 186
),
(
  'a1210000-0000-4000-a103-000000000188', 'b1100000-0000-4000-a110-000000000003', 'LAVALOZA LIQUIDO ULTRALIMP VINAG CITRUS 3.7L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lavaloza-liquido-ultralimp-vinag-citrus-3-7l/p. Marca: Ultralimp. LAVALOZA LIQUIDO ULTRALIMP VINAG CITRUS 3.7L',
  '🧴', 18690, 'Cuidado De Superficies', 'https://olimpica.vteximg.com.br/arquivos/ids/2422501/7701008847002_1.jpg?v=639192124660300000',
  true, 187
),
(
  'a1210000-0000-4000-a103-000000000189', 'b1100000-0000-4000-a110-000000000003', 'Papel Higiénico Scott Cuidado Completo Triple Hoja 30 metros - 12 rollos Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/p-hig-scott-tri-hoj-30m-x12-unidades/p. Marca: Scott. Nuevo Papel Higiénico Scott® Cuidado Completo ahora con más metros por rollo, te brinda una higiene superior gracias a su suavidad superior, control de malos olores y limpieza efectiva. De',
  '🛒', 21290, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/1899131/7702425485488_1.jpg?v=638893119667530000',
  true, 188
),
(
  'a1210000-0000-4000-a103-000000000190', 'b1100000-0000-4000-a110-000000000003', 'PAPEL HIGIÉNICO ROSAL 3P PLUS MEGA PACK 20M X15R Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papel-higienico-rosal-3p-plus-mega-pack-20m-x15r/p. Marca: Rosal. PAPEL HIGIÉNICO ROSAL 3P PLUS MEGA PACK 20M X15R',
  '🛒', 21750, 'Papeles Desechables', 'https://olimpica.vteximg.com.br/arquivos/ids/1899423/7702120014297.jpg?v=638893337657300000',
  true, 189
),
(
  'a1210000-0000-4000-a103-000000000191', 'b1100000-0000-4000-a110-000000000003', 'Suavizante Suavitel Cuidado Superior Fresca Primavera 4.8L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suavte-soflan-suavit-primav-4-8l/p. Marca: Suavitel. body, html { margin: 0; padding: 0; } .nebula-nebula-wrapper { font-family: ''Helvetica Neue'', Arial, sans-serif; background: #e8e8e8; margin: 0; padding: 0; } .nebula-nebula-container-main ',
  '🧴', 36320, 'Cuidado De La Ropa', 'https://olimpica.vteximg.com.br/arquivos/ids/2244115/7509546693903_1--1-.jpg?v=638981207601530000',
  true, 190
),
(
  'a1210000-0000-4000-a103-000000000192', 'b1100000-0000-4000-a110-000000000003', 'Jabón Antibacterial PROTEX Avena Barra Pack 6 und 110 g - Protección Antibacteriana Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-protex-avena-110g-x6-sup-of/p. Marca: Protex. .nebula-wrapper, .nebula-wrapper{margin:0;padding:0}.nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;padding:0}.nebula-nebula-container-main{max',
  '🧴', 16800, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/2159273/7702010921681_1.jpg?v=638918333348700000',
  true, 191
),
(
  'a1210000-0000-4000-a103-000000000193', 'b1100000-0000-4000-a110-000000000003', 'Jabón Antibacterial Protex Avena 110 G X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-protex-avena-110g-x3/p. Marca: Protex. .nebula-wrapper, .nebula-wrapper{margin:0;padding:0}.nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;padding:0}.nebula-nebula-container-main{max-width:',
  '🧴', 11800, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/2318755/7702010920615_1.jpg?v=638990931837430000',
  true, 192
),
(
  'a1210000-0000-4000-a103-000000000194', 'b1100000-0000-4000-a110-000000000003', 'Jabon Antibacterial Protex Nutri Protect Macadamia Barra 110 G X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jabon-protex-macadamia-110g-x-6-unidades-7509546651736--2094507/p. Marca: Protex. .nebula-wrapper, .nebula-wrapper{margin:0;padding:0}.nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;padding:0}.',
  '🧴', 17990, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/1874742/7509546651736_1.jpg?v=638858587960770000',
  true, 193
),
(
  'a1210000-0000-4000-a103-000000000195', 'b1100000-0000-4000-a110-000000000003', 'Jabon Antibacterial Protex Limpieza Profunda Barra 110 G X6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jabon-protex-limpieza-profunda-110g-x-6-unidades-7509546651729--2094506/p. Marca: Protex. .nebula-wrapper, .nebula-wrapper{margin:0;padding:0}.nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;pad',
  '🧴', 22500, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/1830955/7509546651729_1.jpg.jpg?v=638845821073730000',
  true, 194
),
(
  'a1210000-0000-4000-a103-000000000196', 'b1100000-0000-4000-a110-000000000003', 'Jabón Antibacterial Protex Balance Saludable 110g x3 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-protex-balance-saludable-110g-x3/p. Marca: Protex. .nebula-wrapper, .nebula-wrapper{margin:0;padding:0}.nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;padding:0}.nebula-nebula-container-mai',
  '🧴', 9450, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/1832371/7702010921445_1.jpg.jpg?v=638845852246030000',
  true, 195
),
(
  'a1210000-0000-4000-a103-000000000197', 'b1100000-0000-4000-a110-000000000003', 'Crema Dental Colgate Triple Acción 125 Ml X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crem-dent-colgate-tripl-accion-125ml--x3/p. Marca: Colgate. Conoce todos los beneficios que te brinda la Crema Dental Colgate Triple Acción Menta Original, su uso diario te ayudará a conseguir una higiene completa y evitar los principales pad',
  '🧴', 23175, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/1496294/7509546652016_1.jpg?v=638954628213230000',
  true, 196
),
(
  'a1210000-0000-4000-a103-000000000198', 'b1100000-0000-4000-a110-000000000003', 'Crema Dental Colgate Max White Complete Clean100 Ml X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crem-dent-colgate-maxwhite-100ml--x3un/p. Marca: Colgate. Dale a tu sonrisa el cuidado que merece utilizando diariamente la Crema Dental Colgate Max White Complete Clean en su presentación de 100 ml x 3, elaborada con láminas de blancura que ',
  '🧴', 31950, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/1780924/7702010612084_1.jpg.jpg?v=638954634749800000',
  true, 197
),
(
  'a1210000-0000-4000-a103-000000000199', 'b1100000-0000-4000-a110-000000000003', 'Desodorante Lady Speed Stick Mujer Pote 24/7 Talc 100 g Pack 2 und - Protección Eficaz Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/desodorante-lady-speed-stick-crema-pote-100g-x-2-unidades-7702010971471--1608064/p. Marca: Lady Speed Stick. "Ahora estarás doblemente protegida contra los efectos de la sudoración, pues el Desodorante antitranspirante Lady Speed Stick 24/7 D',
  '🛒', 22300, 'Desodorante Y Antitranspirante', 'https://olimpica.vteximg.com.br/arquivos/ids/2318763/7702010971471_1.jpg?v=638990932248300000',
  true, 198
),
(
  'a1210000-0000-4000-a103-000000000200', 'b1100000-0000-4000-a110-000000000003', 'Gel Antitranspirante Gillette Specialized Antibacterial 113 g  x 2 Unidades Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/desodorante-gillette-antibacterial-gel-113g-x-2-unidades-7500435128315--1433689/p. Marca: Gillette. Mantente fresco y protegido con el antitranspirante Gillette Specialized Gel Invisible, que con su sistema 5? ACTIVE PROTECT te ofrece protecc',
  '🛒', 33600, 'Desodorante Y Antitranspirante', 'https://olimpica.vteximg.com.br/arquivos/ids/2408506/7500435128315_1.jpg?v=639167037913030000',
  true, 199
),
(
  'a1210000-0000-4000-a103-000000000201', 'b1100000-0000-4000-a110-000000000003', 'Crema Dental Colgate Triple Acción 75 Ml X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crem-dent-colgate-tripl-accion-75ml--x3/p. Marca: Colgate. Disfruta del mejor cepillado oral con la Crema Dental Colgate Triple Acción Menta Original, su uso diario te ayudará a mejorar visiblemente la salud de tu boca y reducir la formación ',
  '🧴', 19500, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/1422610/7753442351034.jpg?v=638954632276600000',
  true, 200
),
(
  'a1210000-0000-4000-a103-000000000202', 'b1100000-0000-4000-a110-000000000003', 'Crema Dental Colgate Total Original Mint Prevención Activa 3x75ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crem-dent-colgat-tot-clea-75ml-x3-p-esp-/p. Marca: Colgate. .nebula-wrapper,.nebula-container-main{margin:0;padding:0} .nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;padding:0} .nebula-nebula-',
  '🧴', 31300, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/2365336/7702010611131_1.jpg?v=639094385898330000',
  true, 201
),
(
  'a1210000-0000-4000-a103-000000000203', 'b1100000-0000-4000-a110-000000000003', 'GALLETA SALTIN ROJO TAC X8 640G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-saltin-rojo-tac-x8-640g/p. Marca: Saltin. GALLETA SALTIN ROJO TAC X8 640G',
  '🛒', 11850, 'Galletas', 'https://olimpica.vteximg.com.br/arquivos/ids/2317728/7702025150830_1.png?v=638990766198530000',
  true, 202
),
(
  'a1210000-0000-4000-a103-000000000204', 'b1100000-0000-4000-a110-000000000003', 'Papel Higiénico Familia Acolchamax Megarollo X4 Rollos Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papel-higienico-familia-acolchamax-megarollo-x4-rollos/p. Marca: Familia. Papel Higiénico Familia AcolchaMAX Megarollo X4 Rollos',
  '🛒', 11700, 'Protección Sanitaria', 'https://olimpica.vteximg.com.br/arquivos/ids/1538065/7702026147488_1.jpg?v=638652881548230000',
  true, 203
),
(
  'a1210000-0000-4000-a103-000000000205', 'b1100000-0000-4000-a110-000000000003', 'Jabon Antibacterial Protex Limpieza Profunda 110 G X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-protex-limpieza-prof-110g-x3/p. Marca: Protex. .nebula-wrapper, .nebula-wrapper{margin:0;padding:0}.nebula-nebula-wrapper{font-family:''Helvetica Neue'',Arial,sans-serif;background:#e8e8e8;margin:0;padding:0}.nebula-nebula-container-main{ma',
  '🧴', 13050, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/1415062/7702010920820.jpg?v=638845780887900000',
  true, 204
),
(
  'a1210000-0000-4000-a103-000000000206', 'b1100000-0000-4000-a110-000000000003', 'Jabón JOHNSON''S Original TRIPACK x 330 GR Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-johnson-original-110g-x3un/p. Marca: Johnson. Jabón JOHNSON''S Original tiene agentes hidratantes e ingredientes naturales que cuidan gentilmente de tu piel. Dermatológicamente comprobado.',
  '🧴', 12500, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/1860875/7702031407393_0.jpg?v=638847562956200000',
  true, 205
),
(
  'a1210000-0000-4000-a103-000000000207', 'b1100000-0000-4000-a110-000000000003', 'Jabón Olimpica Avena y Vitamina E 125 G X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-olimpica-avena---vit-e-125-g-x3/p. Marca: Olimpica. JAB OLIMPICA AVENA & VIT E 125 g X3',
  '🧴', 5890, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/2405322/8692624149757_1.jpg?v=639159279318070000',
  true, 206
),
(
  'a1210000-0000-4000-a103-000000000208', 'b1100000-0000-4000-a110-000000000003', 'Shampoo Head Shoulders Limpieza Renovadora Pack 375 ml + 180 ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/shampoo-head--shoulders-limpieza-renovadora-375ml--shampoo-180ml-7500435126809--2033363/p. Marca: H & S. El Shampoo Head & Shoulders Limpieza Renovadora limpia el cabello sin resecar y es recomendado para uso diario. Brinda una dosis diaria d',
  '🧴', 25240, 'Cuidado del Cabello', 'https://olimpica.vteximg.com.br/arquivos/ids/2399310/7500435126809_1.jpg?v=639142802256900000',
  true, 207
),
(
  'a1210000-0000-4000-a103-000000000209', 'b1100000-0000-4000-a110-000000000003', 'Dove Jabón Barra Original 90 G X3 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jabon-dove-original-90g-x-3-unidades-7891150046481--1451705/p. Marca: Dove. Dove Jabón Barra Original 3 Unidades X 90G',
  '🧴', 15855, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/1015007/7891150046481.jpg?v=638071799902300000',
  true, 208
),
(
  'a1210000-0000-4000-a103-000000000210', 'b1100000-0000-4000-a110-000000000003', 'Crema Dental Colgate Triple Acción 150 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crema-dental-colgate-triple-accion-150-ml/p. Marca: Colgate. "Déjate sorprender por la Crema Dental Colgate Triple Acción y mantén una higiene oral saludable, en su presentación de 150 ml. Evita la formación de manchas amarillas ocasionadas p',
  '🧴', 13800, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/1428104/7509546000350.jpg?v=638954882131400000',
  true, 209
),
(
  'a1210000-0000-4000-a103-000000000211', 'b1100000-0000-4000-a110-000000000003', 'Enjuague Bucal LISTERINE®  Coolmint Frescura Intensa 500ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/enjuague-bucal-listerine-cool-mint-500-ml-7702035432339/p. Marca: Listerine. LISTERINE® COOLMINT Frescura Intensa Alcanza donde el cepillado y el hilo no llegan. Con su exclusiva fórmula de 4 Aceites Esenciales (mentol, timol, eucaliptol y sa',
  '🧴', 26250, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/1786317/7702035432339_0.jpg.jpg?v=638763520378630000',
  true, 210
),
(
  'a1210000-0000-4000-a103-000000000212', 'b1100000-0000-4000-a110-000000000003', 'Desodorante Yodora Crema Clásico 60 G Gratis 32 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/desodorante-yodora-crema-clasico-60g-gratis-32g-7702057089290--53151/p. Marca: Yodora. DESODORANTE YODORA CREMA CLASICO 60G GRATIS 32G',
  '🛒', 24392, 'Desodorante Y Antitranspirante', 'https://olimpica.vteximg.com.br/arquivos/ids/2365412/7702057089290_DEO YODORA CREM CLASIC 60 g GTS 32 OF.jpg?v=639094402300600000',
  true, 211
),
(
  'a1210000-0000-4000-a103-000000000213', 'b1100000-0000-4000-a110-000000000003', 'Lavaplatos Axion Explosión Cítrica Líquido 3 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/l-plato-liq-axion-explosion-citrica-3l/p. Marca: Axion. Con el poder multiusos del lavaplatos Axion Explosión Cítrica 100% efectivo contra la grasa dejarás todo tipo de trastes rechinando de lo limpio y además podrás disfrutar su delicioso ar',
  '🧴', 23280, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/2357636/7509546701172_1.jpg?v=639076488468330000',
  true, 212
),
(
  'a1210000-0000-4000-a103-000000000214', 'b1100000-0000-4000-a110-000000000003', 'Crema Dental Blanqueadora Colgate Luminous White Color Correct 100 mL Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crem-dent-colgate-lum-wht-corr-col-100ml/p. Marca: Colgate. Descubre una sonrisa más blanca al instante* con la crema dental blnaqueadora Colgate Luminous White Color Correct Fresh Mint. Su fórmula con flúor y tecnología de color violeta neut',
  '🧴', 22600, 'Cuidado Oral', 'https://olimpica.vteximg.com.br/arquivos/ids/2365360/7509546700397_1.jpg?v=639094387334770000',
  true, 213
),
(
  'a1210000-0000-4000-a103-000000000215', 'b1100000-0000-4000-a110-000000000003', 'Shampoo Head & Shoulders Anti-Resequedad Nutrición Diaria 650 ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/shamp-h-s-antiresequedad-650-ml/p. Marca: HEAD & SHOULDERS. Head and Shoulders Anti-Resequedad* Nutrición Diaria es ideal para el cuidado del cuero cabelludo seco y el control de la caspa**. Nuestra fórmula más nutritiva nutre y alivia la res',
  '🧴', 32312, 'Cuidado del Cabello', 'https://olimpica.vteximg.com.br/arquivos/ids/2397283/7500435249331_1.jpg?v=639141077399800000',
  true, 214
),
(
  'a1210000-0000-4000-a103-000000000216', 'b1100000-0000-4000-a110-000000000003', 'Pack Shampoo Head & Shoulders Anti-Comezón con menta 375 ml + 180 ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/shamp-h-s-anticomezon-375-ml--180-ml/p. Marca: HEAD & SHOULDERS. ¡LIBÉRATE DE LA CASPA Y LA COMEZÓN! El shampoo para caspa y comezón Head & Shoulders, está formulado especialmente con menta y Piroctona Olamina,que generan una sensación inmedi',
  '🧴', 29080, 'Cuidado del Cabello', 'https://olimpica.vteximg.com.br/arquivos/ids/2408349/7500435247771_1.jpg?v=639167033498070000',
  true, 215
),
(
  'a1210000-0000-4000-a103-000000000217', 'b1100000-0000-4000-a110-000000000003', 'Jabón Líquido Suppra Care Antibacterial 3 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-liq-suppra-care-antibacterial-3l/p. Marca: Suppra Care. JAB LIQ SUPPRA CARE ANTIBACTERIAL 3L',
  '🧴', 16650, 'Cuidado De La Piel', 'https://olimpica.vteximg.com.br/arquivos/ids/2405410/7701008844629_1.jpg?v=639159288150730000',
  true, 216
),
(
  'a1210000-0000-4000-a103-000000000218', 'b1100000-0000-4000-a110-000000000003', 'Toalla Higiénica Nosotras Invisible Rapigel X40 Unds + 30 Protectores Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-nosotras-inv-rapigel-x40---30-pro/p. Marca: Nosotras. TOALLA NOSOTRAS INV RAPIGEL X40 + 30 PRO',
  '🛒', 22425, 'Protección Sanitaria', 'https://olimpica.vteximg.com.br/arquivos/ids/1643009/7702026155094.jpg?v=638705782103170000',
  true, 217
),
(
  'a1210000-0000-4000-a103-000000000219', 'b1100000-0000-4000-a110-000000000003', 'Shampoo Nutribela Reparación Intensiva 400 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/shampoo-nutribela-repar-intensiv-400-ml/p. Marca: Nutribela. SHAMPOO NUTRIBELA REPAR INTENSIV 400 ML',
  '🧴', 23690, 'Cuidado del Cabello', 'https://olimpica.vteximg.com.br/arquivos/ids/1601138/7702354956219.jpg?v=638695347236600000',
  true, 218
),
(
  'a1210000-0000-4000-a103-000000000220', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Coca Cola Zero 1,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-15-l-7702535011799-697667/p. Marca: Coca-Cola. Coca-Cola Zero, Gran sabor. ¿La mejor Coca-Cola? Atrévete a probarla.',
  '🧹', 5352, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2418161/7702535011799_0 -1-.jpg?v=639185177169200000',
  true, 219
),
(
  'a1210000-0000-4000-a103-000000000221', 'b1100000-0000-4000-a110-000000000003', 'BEB PONY MALTA GO PET 200ML X6 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/beb-pony-malta-go-pet-200ml-x6/p. Marca: Pony. BEB PONY MALTA GO PET 200ML X6',
  '🛒', 9800, 'Maltas', 'https://olimpica.vteximg.com.br/arquivos/ids/2354484/7702004025791.jpg?v=639070410697830000',
  true, 220
),
(
  'a1210000-0000-4000-a103-000000000222', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Coca-Cola ZERO 250ml x 6 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-250ml-x-6-unds/p. Marca: Coca-Cola. Coca-Cola Zero, Gran sabor. ¿La mejor Coca-Cola? Atrévete a probarla.',
  '🧹', 7040, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1848803/7702535029459.jpg?v=638820682985170000',
  true, 221
),
(
  'a1210000-0000-4000-a103-000000000223', 'b1100000-0000-4000-a110-000000000003', 'Agua Saborizada Brisa con Gas Manzana 1,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/agua-brisa-saborizada-manzana-15l-7702535027868-2172933/p. Marca: Brisa. Agua Brisa Saborizada Manzana Botella 1,5 Lt X 1 Und',
  '🛒', 3073, 'Aguas', 'https://olimpica.vteximg.com.br/arquivos/ids/1473123/7702535027868.jpg?v=638590259424370000',
  true, 222
),
(
  'a1210000-0000-4000-a103-000000000224', 'b1100000-0000-4000-a110-000000000003', 'GASEOSA COCA-COLA ORIGINAL 1.5L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-original-1-5l/p. Marca: Coca-Cola. GASEOSA COCA-COLA ORIGINAL 1.5L',
  '🧹', 6950, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2418158/7702535024423_0--1-.jpg?v=639185176970130000',
  true, 223
),
(
  'a1210000-0000-4000-a103-000000000225', 'b1100000-0000-4000-a110-000000000003', 'Agua Brisa Sin Gas Bidón 6L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/agua-brisa-bidon-6-l-7702535002650-986209/p. Marca: Brisa. Agua Brisa Bidón 6 Lt',
  '🛒', 9590, 'Aguas', 'https://olimpica.vteximg.com.br/arquivos/ids/1473128/7702535002650.jpg?v=638827639739900000',
  true, 224
),
(
  'a1210000-0000-4000-a103-000000000226', 'b1100000-0000-4000-a110-000000000003', 'Jugo Hit Surtido 200 Ml 12X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/refresc-hit-stdo-200ml-12x10/p. Marca: Hit. REFRESC HIT STDO 200ML 12X10',
  '🥛', 14990, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1836349/7707133016221.jpg.jpg?v=638793948478370000',
  true, 225
),
(
  'a1210000-0000-4000-a103-000000000227', 'b1100000-0000-4000-a110-000000000003', 'Agua Olimpica 4 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/agua-olimpica-4-l/p. Marca: Olimpica. 1',
  '🛒', 2720, 'Aguas', 'https://olimpica.vteximg.com.br/arquivos/ids/1600694/7701008843165.jpg?v=638694437589900000',
  true, 226
),
(
  'a1210000-0000-4000-a103-000000000228', 'b1100000-0000-4000-a110-000000000003', 'GASEOSA COCA-COLA 2.5L X2 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-2-5l-x2/p. Marca: Coca-Cola. GASEOSA COCA-COLA 2.5L X2',
  '🧹', 15000, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2335722/7702535024515_0.jpg?v=639034814066700000',
  true, 227
),
(
  'a1210000-0000-4000-a103-000000000229', 'b1100000-0000-4000-a110-000000000003', 'GASEOSA COCA-COLA ORIGINAL 2.5L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-original-2-5l/p. Marca: Coca-Cola. GASEOSA COCA-COLA ORIGINAL 2.5L',
  '🧹', 7497, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2335716/7702535024430_0.jpg?v=639034813727000000',
  true, 228
),
(
  'a1210000-0000-4000-a103-000000000230', 'b1100000-0000-4000-a110-000000000003', 'Jugo Frutto Néctar Surtido 200 Ml 10X7 Unds Oferta Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/nectar-frutto-alpina-surtido-200ml-10x7-oferta-7702001134410-1601341/p. Marca: Frutto. NECTAR FRUTTO ALPINA SURTIDO 200ML 10X7 OFERTA. Aquí puedes encontrar más productos marca Frutto',
  '🛒', 17050, 'Jugos', 'https://olimpica.vteximg.com.br/arquivos/ids/1424197/7702001134410.jpg?v=638514017163870000',
  true, 229
),
(
  'a1210000-0000-4000-a103-000000000231', 'b1100000-0000-4000-a110-000000000003', 'AGUA BRISA POTABLE S/GAS 280ML X24un Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/agua-brisa-potable-s-gas-280ml-x24un/p. Marca: Brisa. AGUA BRISA POTABLE S/GAS 280ML X24un',
  '🛒', 20072, 'Aguas', 'https://olimpica.vteximg.com.br/arquivos/ids/1778219/7702535017791_0.jpg.jpg?v=638750507187130000',
  true, 230
),
(
  'a1210000-0000-4000-a103-000000000232', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Coca Cola Zero 2,5 Lt X2 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-25-l-x2-7702535011935-1125355/p. Marca: Coca-Cola. Coca-Cola Zero, Gran sabor. ¿La mejor Coca-Cola? Atrévete a probarla.',
  '🧹', 16600, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2335710/7702535011935_0.jpg?v=639034813203430000',
  true, 231
),
(
  'a1210000-0000-4000-a103-000000000233', 'b1100000-0000-4000-a110-000000000003', 'Soda Bretaña 2,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mezcla-bretana-25-l-7702090020502-904838/p. Marca: Bretaña. Soda Bretaña Botella 2,5 Lt',
  '🧹', 4193, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1431476/7702090020502.jpg?v=638521685153370000',
  true, 232
),
(
  'a1210000-0000-4000-a103-000000000234', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Quatro Toronja Original 1,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-quatro-toronja-sabor-original-1-5l/p. Marca: Quatro. Gaseosa Quatro Toronja Sabor Original 1.5L',
  '🧹', 4790, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1884996/7702535011706.jpg?v=639118485622370000',
  true, 233
),
(
  'a1210000-0000-4000-a103-000000000235', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Schweppes Ginger Ale 1,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-schweppes-ginger-ale-1-5l/p. Marca: Schweppes. Gaseosa Schweppes Ginger Ale 1.5L - Los licores nacionales e importados no tienen cambio. - En los lugares donde sea decretada ley seca se despachará licor una vez se levante la medida y ',
  '🧹', 4190, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1763277/7702535011812_1.jpg.jpg?v=638742991284400000',
  true, 234
),
(
  'a1210000-0000-4000-a103-000000000236', 'b1100000-0000-4000-a110-000000000003', 'GASEOSA POSTOBON COLOMBIANA 1.5L Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-postobon-colombiana-1-5l/p. Marca: Postobon. GASEOSA POSTOBON COLOMBIANA 1.5L',
  '🧹', 5900, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2387566/7707151754952 -1-.jpg?v=639124645683900000',
  true, 235
),
(
  'a1210000-0000-4000-a103-000000000237', 'b1100000-0000-4000-a110-000000000003', 'BEBIDA HATSU SODA FRAMBUESA 310ML X6 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bebida-hatsu-soda-frambuesa-310ml-x6/p. Marca: Hatsu. BEBIDA HATSU SODA FRAMBUESA 310ML X6',
  '🧹', 18900, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1885099/7702090001396.jpg?v=638876936436730000',
  true, 236
),
(
  'a1210000-0000-4000-a103-000000000238', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Coca-Cola Zero 269ml x 6 Und Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-269ml-x-6-und/p. Marca: Coca-Cola. Coca-Cola sabor original es la bebida gaseosa favorita del mundo y se ha disfrutado desde 1886. Puedes encontrar Coca-Cola sabor original en una variedad de presentaciones que se adapt',
  '🧹', 15200, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2410852/7702535033487_-0-.jpg?v=639172163117470000',
  true, 237
),
(
  'a1210000-0000-4000-a103-000000000239', 'b1100000-0000-4000-a110-000000000003', 'REFRESCOS HIT STDO 200ML 6X5 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/refrescos-hit-stdo-200ml-6x5/p. Marca: Hit. REFRESCOS HIT STDO 200ML 6X5',
  '🛒', 7900, 'Jugos', 'https://olimpica.vteximg.com.br/arquivos/ids/1885056/7707133061122.jpg?v=638876906374670000',
  true, 238
),
(
  'a1210000-0000-4000-a103-000000000240', 'b1100000-0000-4000-a110-000000000003', 'Agua Olimpica 1000 Ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/agua-olimpica-1000ml/p. Marca: Olimpica. Agua Olimpica 1000 Ml',
  '🛒', 950, 'Aguas', 'https://olimpica.vteximg.com.br/arquivos/ids/1142031/7701008839342.jpg?v=638285653744430000',
  true, 239
),
(
  'a1210000-0000-4000-a103-000000000241', 'b1100000-0000-4000-a110-000000000003', 'Jugo Del Valle Fresh Frutas Cítricas 2,5 Lt X2 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bebida-del-valle-fresh-fruta-citrus-25l-x2-7702535024577-2095646/p. Marca: Del Valle. .body-tucan { font-size: 62.5%; font-family: ''Lato'', sans-serif; overflow-x: hidden; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased',
  '🛒', 11250, 'Jugos', 'https://olimpica.vteximg.com.br/arquivos/ids/1501824/7702535024577_1.jpg?v=638641063928700000',
  true, 240
),
(
  'a1210000-0000-4000-a103-000000000242', 'b1100000-0000-4000-a110-000000000003', 'Jugo Del Valle Fresh Frutas Cítricas 1,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bebida-del-valle-frutas-citricas-15l-7702535022061-2091461/p. Marca: Del Valle. .body-tucan { font-size: 62.5%; font-family: ''Lato'', sans-serif; overflow-x: hidden; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; -moz',
  '🛒', 3986, 'Jugos', 'https://olimpica.vteximg.com.br/arquivos/ids/1429267/7702535022061.jpg?v=638853330895900000',
  true, 241
),
(
  'a1210000-0000-4000-a103-000000000243', 'b1100000-0000-4000-a110-000000000003', 'Soda Bretaña 300 Ml X12 Unds Oferta Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-bretana-300ml-x12-of-7702090051797-2075288/p. Marca: Bretaña. Botella Soda Bretaña 300 Ml X 12 Unds Oferta',
  '🧹', 20650, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1431581/7702090051797.jpg?v=638521701537370000',
  true, 242
),
(
  'a1210000-0000-4000-a103-000000000244', 'b1100000-0000-4000-a110-000000000003', 'Té Hatsu Surtido 200 Ml X12 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/te-hatsu-surtido-tetrapack-200ml-x12-7702090049428-2056680/p. Marca: Hatsu. Té Hatsu Surtido 200 ML X12 Unds',
  '🛒', 22000, 'Té Frío', 'https://olimpica.vteximg.com.br/arquivos/ids/1432172/7702090049428.jpg?v=639038271425800000',
  true, 243
),
(
  'a1210000-0000-4000-a103-000000000245', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Coca Cola Zero 2,5 Lt Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-25-l-7702535007914-1549726/p. Marca: Coca-Cola. Coca-Cola Zero, Gran sabor. ¿La mejor Coca-Cola? Atrévete a probarla.',
  '🧹', 7471, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1463103/7702535007914_1.jpg?v=638561500818500000',
  true, 244
),
(
  'a1210000-0000-4000-a103-000000000246', 'b1100000-0000-4000-a110-000000000003', 'Agua Cristal 300 Ml X24 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/agua-cristal-300ml-x24-un/p. Marca: Cristal. AGUA CRISTAL 300ML X24 un',
  '🛒', 13930, 'Aguas', 'https://olimpica.vteximg.com.br/arquivos/ids/1475513/7702090044294.jpg?v=638599440128200000',
  true, 245
),
(
  'a1210000-0000-4000-a103-000000000247', 'b1100000-0000-4000-a110-000000000003', 'Gaseosa Coca-Cola ZERO 600ml Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-botella-600-ml-7702535006764-1504138/p. Marca: Coca-Cola. Coca-Cola Zero, Gran sabor. ¿La mejor Coca-Cola? Atrévete a probarla.',
  '🧹', 3350, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/1899950/7702535006764_0.jpg?v=638894011571370000',
  true, 246
),
(
  'a1210000-0000-4000-a103-000000000248', 'b1100000-0000-4000-a110-000000000003', 'Pasaboca Doritos Mega Queso 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-doritos-megaqueso-200g-7702189056771-2202524/p. Marca: Doritos. Aquí puedes encontrar más productos doritos',
  '🍿', 7360, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1535648/702189056771_1.jpg?v=638652244626200000',
  true, 247
),
(
  'a1210000-0000-4000-a103-000000000249', 'b1100000-0000-4000-a110-000000000003', 'Paquete Pasabocas Papas Margarita Pollo x12 unds. 25 gr C/U Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-papa-margarita-pollo-12x25-g/p. Marca: Margarita. Paquete Pasabocas Papas Margarita Pollo x12 unds. 25 gr C/U',
  '🍿', 26150, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1869345/7702189000200.jpg?v=638853401054030000',
  true, 248
),
(
  'a1210000-0000-4000-a103-000000000250', 'b1100000-0000-4000-a110-000000000003', 'PASABOCAS FRITOLAY MEGALONCHERA SURTIDO X22 586g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-fritolay-megaloncher-stdo-x22-586g/p. Marca: Fritolay. PASABOCAS FRITOLAY MEGALONCHERA SURTIDO X22 586g',
  '🍿', 26500, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1787814/7702189226884-1.jpg.jpg?v=638769656833430000',
  true, 249
),
(
  'a1210000-0000-4000-a103-000000000251', 'b1100000-0000-4000-a110-000000000003', 'Rosquitas Queso Pa Mi Gente 120 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/rosq-qso-pa-mi-gente-120g/p. Marca: Pa Mi Gente. Rosquitas Queso Pa Mi Gente 120 G',
  '🍿', 10492, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1410458/7705326002334.jpg?v=638965056389430000',
  true, 250
),
(
  'a1210000-0000-4000-a103-000000000252', 'b1100000-0000-4000-a110-000000000003', 'Pasaboca Detodito BBQ 165 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-detodito-bbq-165g/p. Marca: Detodito. Pasaboca Detodito BBQ 165 G',
  '🍿', 7600, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1787788/7702189057624-1.jpg.jpg?v=638769649956330000',
  true, 251
),
(
  'a1210000-0000-4000-a103-000000000253', 'b1100000-0000-4000-a110-000000000003', 'PASABOCA NATUCHIPS PLATANO VERDE 135g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pboca-natuchips-platano-verde-135g/p. Marca: Natuchips. PBOCA NATUCHIPS PLATANO VERDE 135g',
  '🛒', 8000, 'Saludable', 'https://olimpica.vteximg.com.br/arquivos/ids/1779878/7702189045720.jpg?v=638773959307900000',
  true, 252
),
(
  'a1210000-0000-4000-a103-000000000254', 'b1100000-0000-4000-a110-000000000003', 'PBOCA PAPA MARGARITA NATURAL 12X25G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pboca-papa-margarita-natural-12x25g/p. Marca: Margarita. PBOCA PAPA MARGARITA NATURAL 12X25G',
  '🍿', 25950, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2330300/7702189000064.jpg?v=639026369225800000',
  true, 253
),
(
  'a1210000-0000-4000-a103-000000000255', 'b1100000-0000-4000-a110-000000000003', 'Paquete Pasabocas Papas Margarita Limón x12 unds. 25 gr C/U Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-papa-margarita-limon-12x25-g/p. Marca: Margarita. Paquete Pasabocas Papas Margarita Limón x12 unds. 25 gr C/U',
  '🍿', 26150, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1869394/7702189000392.jpg?v=638853404963700000',
  true, 254
),
(
  'a1210000-0000-4000-a103-000000000256', 'b1100000-0000-4000-a110-000000000003', 'ROSQUITA SPIGA YUCA X6un Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/rosquita-spiga-yuca-x6un/p. Marca: Sin Marca. ROSQUITA SPIGA YUCA X6un',
  '🍿', 19200, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1829036/7709566575986.jpg?v=638911447707030000',
  true, 255
),
(
  'a1210000-0000-4000-a103-000000000257', 'b1100000-0000-4000-a110-000000000003', 'PASABOCAS FRITOLAY SUPERLONCHERA SURTIDO X12 271g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-fritolay-superlonche-stdo-x12-271g/p. Marca: Fritolay. PASABOCAS FRITOLAY SUPERLONCHERA SURTIDO X12 271g',
  '🍿', 15000, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1787812/7702189226877-1.jpg.jpg?v=638769656245300000',
  true, 256
),
(
  'a1210000-0000-4000-a103-000000000258', 'b1100000-0000-4000-a110-000000000003', 'PAPAS RIZADAS FRITAS MAYONESA 105g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papas-rizadas-fritas-mayonesa-105g/p. Marca: Rizadas. PAPAS RIZADAS FRITAS MAYONESA 105g',
  '🍿', 6800, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2357013/7703133010184.jpg?v=639076300891800000',
  true, 257
),
(
  'a1210000-0000-4000-a103-000000000259', 'b1100000-0000-4000-a110-000000000003', 'Rosquitas Sanissimo Multipack 120 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/rosq-sanissimo-multipack-120g/p. Marca: Sanissimo. Rosquitas Sanissimo Multipack 120 G',
  '🍿', 14590, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2405295/7705326002433_1.png?v=639159169431900000',
  true, 258
),
(
  'a1210000-0000-4000-a103-000000000260', 'b1100000-0000-4000-a110-000000000003', 'PASABOCA DETODITO MIX 165g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-detodito-mix-165g/p. Marca: Detodito. PASABOCA DETODITO MIX 165g',
  '🍿', 7600, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1566895/7702189057631_1.jpg?v=638659898487730000',
  true, 259
),
(
  'a1210000-0000-4000-a103-000000000261', 'b1100000-0000-4000-a110-000000000003', 'PASABOCA DETODITO MEZC NAT 165g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-detodito-mezc-nat-165g/p. Marca: Detodito. 1',
  '🍿', 7600, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1787786/7702189057617-1.jpg.jpg?v=638769649313370000',
  true, 260
),
(
  'a1210000-0000-4000-a103-000000000262', 'b1100000-0000-4000-a110-000000000003', 'Snack Papas Margarita Pollo 105 Gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-papa-margarita-105g-pollo-7702189053770-2072998/p. Marca: Margarita. Papas Margarita Pollo te ofrece el mejor sabor a pollo en cada papa. Crocantes, saboras y de calidad, estas papas fritas cultivadas por los agricultores colombianos',
  '🍿', 5600, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1567070/7702189053770_1.jpg?v=638659931170670000',
  true, 261
),
(
  'a1210000-0000-4000-a103-000000000263', 'b1100000-0000-4000-a110-000000000003', 'BEBIDA ACHOCOLATADA CHOCOLISTO BOLSA 200 g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/bebida-achocolatada-chocolisto-bolsa-200-g/p. Marca: Chocolisto. .body-tucan { font-size: 62.5%; font-family: ''Lato'', sans-serif; overflow-x: hidden; text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; -moz-osx-font-smoot',
  '🍿', 7550, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2391622/7702007216127_1.png?v=639134997863070000',
  true, 262
),
(
  'a1210000-0000-4000-a103-000000000264', 'b1100000-0000-4000-a110-000000000003', 'Pasaboca Cheetos Boliqueso 160 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-cheetos-boliqueso-160g-7702189045577-1233792/p. Marca: Cheetos. Pasaboca Cheetos Boliqueso 160 G',
  '🍿', 7700, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1161209/7702189045577_1.jpg?v=638320483739300000',
  true, 263
),
(
  'a1210000-0000-4000-a103-000000000265', 'b1100000-0000-4000-a110-000000000003', 'GALLETA DUCALES XL BOLSA 243 g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/galleta-ducales-xl-bolsa-243-g/p. Marca: Ducales. GALLETA DUCALES XL BOLSA 243 g',
  '🍿', 8050, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1836412/7702025133123_1.png.png?v=638795799136870000',
  true, 264
),
(
  'a1210000-0000-4000-a103-000000000266', 'b1100000-0000-4000-a110-000000000003', 'Snack Papas Margarita Crema Y Cebolla 110 Gr Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-papas-margarita-crem-ceboll-110g-7702189056719-2199817/p. Marca: Margarita. Papas Margarita Crema y Cebolla te ofrecen una experiencia deliciosa y llena de sabor en cada bocado. Sazonadas con el sabor gourmet de la crema y cebolla, e',
  '🍿', 8540, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1567501/7702189056719_1.jpg?v=638659999847000000',
  true, 265
),
(
  'a1210000-0000-4000-a103-000000000267', 'b1100000-0000-4000-a110-000000000003', 'PBOCA PAPA RIZADAS STDA 25G X12 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pboca-papa-rizadas-stda-25g-x12/p. Marca: Rizadas. PBOCA PAPA RIZADAS STDA 25G X12',
  '🍿', 23600, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2357039/7703133070393.jpg?v=639076311271700000',
  true, 266
),
(
  'a1210000-0000-4000-a103-000000000268', 'b1100000-0000-4000-a110-000000000003', 'Paquete Pasabocas Natuchips Plátano Maduro X12 und 336Gramos Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-natuchips-platan-madur-x12-336-g/p. Marca: Natuchips. Paquete Pasabocas Natuchips Plátano Maduro X12 und 336Gramos',
  '🍿', 24200, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1869388/7702189025319_1.jpg?v=638853404237630000',
  true, 267
),
(
  'a1210000-0000-4000-a103-000000000269', 'b1100000-0000-4000-a110-000000000003', 'MANI MEDALLA DE ORO SALAD 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mani-medalla-de-oro-salad-200-g/p. Marca: Medalla De Oro. MANI MEDALLA DE ORO SALAD 200 G',
  '🍿', 3832, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1901639/7701008845657.jpg?v=638900849124870000',
  true, 268
),
(
  'a1210000-0000-4000-a103-000000000270', 'b1100000-0000-4000-a110-000000000003', 'PASABOCA PAPA MARGARITA MULTIPACK X9 225G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasaboca-papa-margarita-multipack-x9-225g/p. Marca: Margarita. PASABOCA PAPA MARGARITA MULTIPACK X9 225G',
  '🍿', 23160, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1885916/7702189226969.jpg?v=638877175670300000',
  true, 269
),
(
  'a1210000-0000-4000-a103-000000000271', 'b1100000-0000-4000-a110-000000000003', 'MASMEL CHOCMELOS CUB BAND X14UN 90G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/masmel-chocmelos-cub-band-x14un-90g/p. Marca: Chocmelo. MASMEL CHOCMELOS CUB BAND X14UN 90G',
  '🛒', 8300, 'Confitería', 'https://olimpica.vteximg.com.br/arquivos/ids/1833837/7702011158406.jpg.jpg?v=638791144323100000',
  true, 270
),
(
  'a1210000-0000-4000-a103-000000000272', 'b1100000-0000-4000-a110-000000000003', 'Gomitas Trolli Anayconda 70 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gomas-trolli-anayconda-70g-/p. Marca: Trolli. Gomas Trolli Anayconda 70 Gr',
  '🛒', 2990, 'Confitería', 'https://olimpica.vteximg.com.br/arquivos/ids/1587561/7702174087773_Trolli_Anayconda.jpg?v=638671118344970000',
  true, 271
),
(
  'a1210000-0000-4000-a103-000000000273', 'b1100000-0000-4000-a110-000000000003', 'Maní Mani Moto Natural 44 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mani-mani-moto-nat-44g-und/p. Marca: Mani Moto. MANI MANI MOTO NAT 44G UND',
  '🍿', 1750, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/1600702/7702189058515.jpg?v=638694437818630000',
  true, 272
),
(
  'a1210000-0000-4000-a103-000000000274', 'b1100000-0000-4000-a110-000000000003', 'PBOCA YUPI LONCHERA DIVERPACK 431g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pboca-yupi-lonchera-diverpack-431g/p. Marca: Yupi. PBOCA YUPI LONCHERA DIVERPACK 431g',
  '🍿', 21390, 'Pasabocas', 'https://olimpica.vteximg.com.br/arquivos/ids/2357017/7703133012973.jpg?v=639076303336430000',
  true, 273
),
(
  'a1210000-0000-4000-a103-000000000275', 'b1100000-0000-4000-a110-000000000003', 'Deditos Medalla de Oro Queso 400 G X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deditos-qso-medalla-de-oro-x10-400g/p. Marca: Medalla De Oro. DEDITOS QSO MEDALLA DE ORO X10 400G',
  '🍿', 10312, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1763495/7701008844728.jpg.jpg?v=638743260770070000',
  true, 274
),
(
  'a1210000-0000-4000-a103-000000000276', 'b1100000-0000-4000-a110-000000000003', 'Papa Medalla de Oro a la Francesa 1000 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-medalla-oro-francesa-1000-g-7701008629578-2142591/p. Marca: Medalla De Oro. Papas Medalla De Oro a la Francesa 1000 G',
  '🧊', 9900, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/2405533/7701008629578_1.jpg?v=639159301143530000',
  true, 275
),
(
  'a1210000-0000-4000-a103-000000000277', 'b1100000-0000-4000-a110-000000000003', 'Mix de Vegetales Medalla de Oro Maíz/Arveja/Zanahoria 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mix-medalla-de-oro-maiz-avj-zanahoria-500g-7701008836600-2148662/p. Marca: Medalla De Oro. Mix de Vegetales Medalla De Oro Maíz/Arveja/Zanahoria 500 G',
  '🧊', 6690, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1901263/7701008836600_1.jpg?v=638900222844170000',
  true, 276
),
(
  'a1210000-0000-4000-a103-000000000278', 'b1100000-0000-4000-a110-000000000003', 'Maíz Medalla de Oro Dulce Congelado 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mraiz-medalla-de-oro-congelada-500g-7701008836617-2148663/p. Marca: Medalla De Oro. Maíz Medalla De Oro Dulce Congelado 500 G',
  '🧊', 7690, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1901264/7701008836617_1.jpg?v=638900223151670000',
  true, 277
),
(
  'a1210000-0000-4000-a103-000000000279', 'b1100000-0000-4000-a110-000000000003', 'DEDITO QSO MEDALLA DE ORO X12 300G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/dedito-qso-medalla-de-oro-x12-300g/p. Marca: Medalla De Oro. DEDITO QSO MEDALLA DE ORO X12 300G',
  '🍿', 7992, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/2360663/7701008847699_1.jpg?v=639087534917200000',
  true, 278
),
(
  'a1210000-0000-4000-a103-000000000280', 'b1100000-0000-4000-a110-000000000003', 'Empanada Zenú Coctel 300 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/empanada-zenu-coctel-300g/p. Marca: Zenu. EMPANADA ZENU COCTEL 300G',
  '🍿', 13200, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1828792/7701101362150-1.jpg.jpg?v=638786184022800000',
  true, 279
),
(
  'a1210000-0000-4000-a103-000000000281', 'b1100000-0000-4000-a110-000000000003', 'Deditos Del Origen Mini Origin 530 G X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deditos-del-origen-m-origin-x10un-530g/p. Marca: Del Origen. DEDITOS DEL ORIGEN M/ORIGIN X10un 530g',
  '🍿', 33200, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1853842/7709633971789.jpg.jpg?v=638828545056530000',
  true, 280
),
(
  'a1210000-0000-4000-a103-000000000282', 'b1100000-0000-4000-a110-000000000003', 'Papa McCain a la Francesa Papa Fácil 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-mc-cain-facil-1-kg-7707203351184-1650663/p. Marca: Mc Cain. Papas McCain A La Francesa Papa Fácil 1 Kg',
  '🧊', 19000, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1460334/7707203351184.jpg?v=638556250246830000',
  true, 281
),
(
  'a1210000-0000-4000-a103-000000000283', 'b1100000-0000-4000-a110-000000000003', 'Papa McCain Francesas Papa Fácil 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-mcain-francesa-papafacil-500-g-7707203351221-962269/p. Marca: Mc Cain. Papas McCain Francesas Papa Fácil 500 G',
  '🧊', 7130, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1458909/7707203351221.jpg?v=638550219375370000',
  true, 282
),
(
  'a1210000-0000-4000-a103-000000000284', 'b1100000-0000-4000-a110-000000000003', 'Papa McCain Delgadas Rapi Papa 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-mc-cain-delgada-1-kg-7707203350224-921463/p. Marca: Mc Cain. Papas McCain Delgadas Rapi Papa 1 Kg',
  '🧊', 20950, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1460324/7707203350224.jpg?v=638556240031200000',
  true, 283
),
(
  'a1210000-0000-4000-a103-000000000285', 'b1100000-0000-4000-a110-000000000003', 'Nuggets Kokoriko Coma 300 G X20 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/nugget-kokoriko-x20-300-g-7700512232090-909421/p. Marca: Kokoriko. Nuggets Kokoriko Coma 300 G X20 Unds',
  '🧊', 18000, 'Apanados Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/2257104/7700512232090.jpg?v=638947501891630000',
  true, 284
),
(
  'a1210000-0000-4000-a103-000000000286', 'b1100000-0000-4000-a110-000000000003', 'Papa McCain Tradicionales Rapi Papa 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/papa-tradicional-mc-cain-1-kg-7707203350071-830476/p. Marca: Mc Cain. Papas McCain Tradicionales Rapi Papa 1 Kg',
  '🧊', 21750, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1460322/7707203350071.jpg?v=638556239295170000',
  true, 285
),
(
  'a1210000-0000-4000-a103-000000000287', 'b1100000-0000-4000-a110-000000000003', 'Deditos Delicias Maja de Queso 250 G X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deditos-maja-queso-bandeja-10-250-g-7702711001316-25080/p. Marca: Maja. Deditos Delicias Maja De Queso 250 G X10 Unds',
  '🍿', 10400, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1530156/7702711001316.jpg?v=638651267840000000',
  true, 286
),
(
  'a1210000-0000-4000-a103-000000000288', 'b1100000-0000-4000-a110-000000000003', 'DEDITO QSO MEDALLA DE ORO B/LLO X12 300G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/dedito-qso-medalla-de-oro-b-llo-x12-300g/p. Marca: Medalla De Oro. DEDITO QSO MEDALLA DE ORO B/LLO X12 300G',
  '🍿', 7992, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/2360664/7701008847712_1.jpg?v=639087535051370000',
  true, 287
),
(
  'a1210000-0000-4000-a103-000000000289', 'b1100000-0000-4000-a110-000000000003', 'Nuggets De Pollo Zenú Apanado 320 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/nuggets-pollo-zenu-apanad-320g/p. Marca: Zenu. Nuggets de Pollo Zenú Apanado 320 G',
  '🧊', 25600, 'Apanados Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1899983/7701101360668_H1C1.jpg?v=638894019971070000',
  true, 288
),
(
  'a1210000-0000-4000-a103-000000000290', 'b1100000-0000-4000-a110-000000000003', 'Deditos Del Origen Origin X8 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deditos-del-origen-origin-x8-un/p. Marca: Del Origen. DEDITOS DEL ORIGEN ORIGIN X8 un',
  '🍿', 35950, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1853843/7709633971796.jpg.jpg?v=638828545562430000',
  true, 289
),
(
  'a1210000-0000-4000-a103-000000000291', 'b1100000-0000-4000-a110-000000000003', 'PULPA LA GIRALDA GUANABANA CONGEL 200 g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pulpa-la-giralda-guanabana-congel-200-g/p. Marca: La Giralda. PULPA LA GIRALDA GUANABANA CONGEL 200 g',
  '🥬', 3200, 'Frutas Congeladas', 'https://olimpica.vteximg.com.br/arquivos/ids/2384843/7701008836808_1.jpg?v=639118623053800000',
  true, 290
),
(
  'a1210000-0000-4000-a103-000000000292', 'b1100000-0000-4000-a110-000000000003', 'Nuggets Kokoriko Kokorisaurios Pollo Apanados 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/nuggets-kokoriko-pollo-apanados-400g-7700512521293-2125485/p. Marca: Kokoriko. Nuggets Kokoriko Kokorisaurios De Pollo Apanados 400 G',
  '🧊', 21400, 'Apanados Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1856991/7700512521293.jpg?v=638838917385470000',
  true, 291
),
(
  'a1210000-0000-4000-a103-000000000293', 'b1100000-0000-4000-a110-000000000003', 'Deditos Delicias Maja de Queso 550 G X22 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/dedito-queso-22-un-550-g-precio-especial-oferta-7702711002566-1404309/p. Marca: Maja. Deditos Delicias Maja De Queso 550 G X22 Unds',
  '🍿', 16195, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1530154/7702711002566.jpg?v=638651266660500000',
  true, 292
),
(
  'a1210000-0000-4000-a103-000000000294', 'b1100000-0000-4000-a110-000000000003', 'Yuca McCain Palitos Jumbo Rapi Yuca 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/croq-mc-cain-rapiyuca-yumbo-500-g/p. Marca: Mc Cain. Yuca McCain Palitos Jumbo Rapi Yuca 500 G',
  '🍿', 9690, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1460323/7707203350118.jpg?v=638556239640000000',
  true, 293
),
(
  'a1210000-0000-4000-a103-000000000295', 'b1100000-0000-4000-a110-000000000003', 'Yuca McCain Palitos Jumbo Rapi Yuca 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/yuca-mc-cain-croqueta-1-kg-7707203357476-830490/p. Marca: Mc Cain. Yuca McCain Palitos Jumbo Rapi Yuca 1 Kg',
  '🍿', 19100, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1460343/7707203357476.jpg?v=638556358642970000',
  true, 294
),
(
  'a1210000-0000-4000-a103-000000000296', 'b1100000-0000-4000-a110-000000000003', 'Hielo en Bolsa Olimpica Cubo 3 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/hielo-en-bolsa-olimpica-cubo-3-kg/p. Marca: Olimpica. Hielo en Bolsa Olimpica Cubo 3 Kg',
  '🛒', 4990, 'Hielo', 'https://olimpica.vteximg.com.br/arquivos/ids/1405071/7701008004603.jpg?v=638826483635700000',
  true, 295
),
(
  'a1210000-0000-4000-a103-000000000297', 'b1100000-0000-4000-a110-000000000003', 'Deditos Farah de Queso 400 G X20 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deditos-farah-queso-20-und-400-g-7702510937137-28584/p. Marca: Farah. Deditos Farah de Queso 400 G X20 Unds',
  '🍿', 33990, 'Pasabocas Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1898726/7702510937137.jpg?v=638890469958230000',
  true, 296
),
(
  'a1210000-0000-4000-a103-000000000298', 'b1100000-0000-4000-a110-000000000003', 'Pulpa La Giralda Mango Congelada 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pulpa-lagialda-mango-congelada-200g-7701008836716-2172363/p. Marca: La Giralda. Pulpa La Giralda Mango Congelada 200 G',
  '🥬', 3200, 'Frutas Congeladas', 'https://olimpica.vteximg.com.br/arquivos/ids/1841540/7701008836716.jpg.jpg?v=638808389813530000',
  true, 297
),
(
  'a1210000-0000-4000-a103-000000000299', 'b1100000-0000-4000-a110-000000000003', 'Lasagna Zenú Bolognesa 320 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lasagna-zenu-carne-320g-7701101359419-2202581/p. Marca: Zenu. Disfruta de esta deliciosa Lasagna con carne de res con sabor casero sin complicaciones para tu almuerzo o cena, gracias a su práctico empaque en el que podrás prepararla en horno ',
  '🧊', 23400, 'Comidas Preparadas Congeladas', 'https://olimpica.vteximg.com.br/arquivos/ids/1828396/7701101359419-1.jpg.jpg?v=638786006848670000',
  true, 298
),
(
  'a1210000-0000-4000-a103-000000000300', 'b1100000-0000-4000-a110-000000000003', 'Lasagna Zenú Con Pollo 320 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/lasagna-zenu-pollo-320g-7701101359426-2202582/p. Marca: Zenu. Disfruta de esta deliciosa Lasagna con pollo y con un típico sabor casero sin complicaciones para tu almuerzo o cena, gracias a su práctico empaque en el que podrás prepararla en h',
  '🧊', 23400, 'Comidas Preparadas Congeladas', 'https://olimpica.vteximg.com.br/arquivos/ids/1828400/7701101359433-1.jpg.jpg?v=638786008139270000',
  true, 299
),
(
  'a1210000-0000-4000-a103-000000000301', 'b1100000-0000-4000-a110-000000000003', 'Arverja Medalla de Oro Congelada 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arverja-medalla-de-oro-china-congelada-500g-7701008836624-2148664/p. Marca: Medalla De Oro. Arverjas Medalla De Oro Congelada 500 G',
  '🧊', 6990, 'Vegetales Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1897870/7701008836624.jpg?v=638888952412270000',
  true, 300
),
(
  'a1210000-0000-4000-a103-000000000302', 'b1100000-0000-4000-a110-000000000003', 'Milanesa Kokoriko Pollo Apanada 279 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/milanesa-kokoiko-pollo-apanada-279g-7700512521637-2167302/p. Marca: Kokoriko. Disfruta de la milanesa Kokoriko de pollo apanada, perfecta para una comida deliciosa y rápida. Ideal para compartir en familia. Pruébala hoy.',
  '🧊', 15200, 'Apanados Congelados', 'https://olimpica.vteximg.com.br/arquivos/ids/1856994/7700512521637.jpg?v=638838918378370000',
  true, 301
),
(
  'a1210000-0000-4000-a103-000000000303', 'b1100000-0000-4000-a110-000000000003', 'Toallitas Húmeda Pequeñin Vitamina E X80 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humed-pequenin-vitamina-e-x80un/p. Marca: PEQUEÑIN. TOALLA HUMED PEQUEÑIN VITAMINA E X80UN',
  '🧹', 4900, 'Aseo Del Bebe', 'https://olimpica.vteximg.com.br/arquivos/ids/1473390/7702026152550_1.jpg?v=638591173377970000',
  true, 302
),
(
  'a1210000-0000-4000-a103-000000000304', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Ultratrim Sec Etapa 3 X50 Unds + Toallas X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panal-winny-sec-etapa-3-x-50-unidades-gratis-toalla-x-10-unidades-7701021111845--850640/p. Marca: Winny. Pañales Winny Ultratrim Sec Etapa 3 X50 Unds + Toallas X10 Unds. Aquí puedes encontrar más productos Winny',
  '🧴', 47812, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357882/7701021111845_1.jpg?v=639077122227370000',
  true, 303
),
(
  'a1210000-0000-4000-a103-000000000305', 'b1100000-0000-4000-a110-000000000003', 'PAÑITO HUM PEQUEÑIN DERMA PROTEC 80UN Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pa-ito-hum-peque-in-derma-protec-80un/p. Marca: PEQUEÑIN. PA#ITO HUM PEQUE#IN DERMA PROTEC 80UN',
  '🧴', 6950, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2354792/DERMO COL X80_FRONTAL-4.jpg?v=639071313848800000',
  true, 304
),
(
  'a1210000-0000-4000-a103-000000000306', 'b1100000-0000-4000-a110-000000000003', 'PAÑITOS HÚMEDOS ALOE X 250 UND Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humeda-pequenin-aloe-x-250-unidades-7702026311858--1303521/p. Marca: Pequeñin. Las Toallitas Húmedas Pequeñín Aloe Vera, con su innovadora formula te brindan hasta 8 horas de hidratación total. Además te ofrecen una Suavidad Superior c',
  '🧴', 23163, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2345770/7702026311858_1.jpg?v=639040838579430000',
  true, 305
),
(
  'a1210000-0000-4000-a103-000000000307', 'b1100000-0000-4000-a110-000000000003', 'Toallitas Húmedas Winny Aloe Vera y Vitamina C X100 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humeda-winny-aloe-vera-x-70-unidades--toalla-x-30-unidades-7701021145949--1037607/p. Marca: Winny. Toallitas Húmedas Winny Aloe Vera y Vitamina C X100 Unds',
  '🧴', 9825, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2365402/7701021145949_1.jpg?v=639094396731170000',
  true, 306
),
(
  'a1210000-0000-4000-a103-000000000308', 'b1100000-0000-4000-a110-000000000003', 'Colada Maizena Vainilla 28 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/colada-maizena-vainillala-28g-7702047040058-2152500/p. Marca: Maizena. Colada Maizena Vainilla 28 G',
  '👶', 1365, 'Alimentación Del Bebé', 'https://olimpica.vteximg.com.br/arquivos/ids/2150589/7702047040058.jpg?v=638908633272970000',
  true, 307
),
(
  'a1210000-0000-4000-a103-000000000309', 'b1100000-0000-4000-a110-000000000003', 'Toallitas Húmedas Huggies Limpieza Diaria 112U Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humedas-huggies--x-112unidades/p. Marca: Huggies. Las Toallitas Húmedas Huggies Limpieza Diaria, con un mayor rendndimiento y limpia desde la primera pasada',
  '🧴', 6892, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/1897909/7702425632189_1.jpg?v=638889012223030000',
  true, 308
),
(
  'a1210000-0000-4000-a103-000000000310', 'b1100000-0000-4000-a110-000000000003', 'PAÑITOS HÚMEDOS ALMENDRA X 200 UND Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humed-peque-in-almend-x200un/p. Marca: PEQUEÑIN. Las Toallitas Húmedas Pequeñín Almendra, con su innovadora te brindan hasta 8 horas de hidratación total. Además te ofrecen una Suavidad Superior con la piel. Gracias a su tela suave y a',
  '🧴', 25600, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2345790/7702026149222_1.jpg?v=639040843492970000',
  true, 309
),
(
  'a1210000-0000-4000-a103-000000000311', 'b1100000-0000-4000-a110-000000000003', 'PAÑITOS HÚMEDOS ALMENDRA X 100 UND Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humed-peque-in-almend-x100un/p. Marca: PEQUEÑIN. Las Toallitas Húmedas Pequeñín Almendra, con su innovadora te brindan hasta 8 horas de hidratación total. Además te ofrecen una Suavidad Superior con la piel. Gracias a su tela suave y a',
  '🧴', 13150, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2345787/7702026147631_1.jpg?v=639040842957400000',
  true, 310
),
(
  'a1210000-0000-4000-a103-000000000312', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Pants Etapa 6 X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panal-winny-pants-etapa-6-x30un/p. Marca: Winny. Pañales Winny Pants Etapa 6 X30 Unds',
  '🧴', 44467, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357802/7701021118868_1.jpg?v=639077116958130000',
  true, 311
),
(
  'a1210000-0000-4000-a103-000000000313', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Pants Etapa 5 X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panal-winny-pants-etapa-5-x-30-unidades-7701021116666--2167110/p. Marca: Winny. Pañal Winny Pants Etapa 5 X30 Unds',
  '🧴', 41842, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357853/7701021116666_1.jpg?v=639077120814000000',
  true, 312
),
(
  'a1210000-0000-4000-a103-000000000314', 'b1100000-0000-4000-a110-000000000003', 'Jabón Bebé Johnson''s Original Tripack 330 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-johnson-baby-original-110g-x3-un/p. Marca: Johnson. El jabón cremoso JOHNSON’S Original limpia suavemente sin agredir la piel delicada del bebé. El jabón cremoso JOHNSON’S Original limpia suavemente sin agredir la piel delicada del bebé. ',
  '🧹', 15450, 'Aseo Del Bebe', 'https://olimpica.vteximg.com.br/arquivos/ids/1393771/7702031407263.jpg?v=638496739864630000',
  true, 313
),
(
  'a1210000-0000-4000-a103-000000000315', 'b1100000-0000-4000-a110-000000000003', 'PAÑITOS HÚMEDOS ALOE X 70 UND Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-humeda-pequenin-aloe-x-70-unidades-7702026314415--1566314/p. Marca: Pequeñin. Las Toallitas Húmedas Pequeñín Aloe Vera, con su innovadora formula te brindan hasta 8 horas de hidratación total. Además te ofrecen una Suavidad Superior co',
  '🧴', 7900, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2345780/7702026314415_1.jpg?v=639040840622370000',
  true, 314
),
(
  'a1210000-0000-4000-a103-000000000316', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Ultratrim Sec Etapa 4 X50 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panal-winny-sec-etapa-4-x-50-unidades-7701021147585--910823/p. Marca: Winny. Pañales Winny Ultratrim Sec Etapa 4 X50 Unds',
  '🧴', 83990, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357826/7701021147585_1.jpg?v=639077119412900000',
  true, 315
),
(
  'a1210000-0000-4000-a103-000000000317', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Ultratrim Sec Etapa 3 X30 Unds + Toallas X 10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panal-winny-sec-etapa-3-x-30-unidades--toalla-x-10-unidades-7701021111821--875773/p. Marca: Winny. Pañales Winny Ultratrim Sec Etapa 3 X30 Unds + Toallas X 10 Unds',
  '🧴', 28950, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357878/7701021111821_1.jpg?v=639077122061070000',
  true, 316
),
(
  'a1210000-0000-4000-a103-000000000318', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Ultratrim Sec Etapa 5 X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panal-winny-sec-etapa-5-x-30-unidades-7701021114174--862918/p. Marca: Winny. Pañales Winny Ultratrim Sec Etapa 5 X30 Unds',
  '🧴', 41842, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357893/7701021114174_1.jpg?v=639077122795470000',
  true, 317
),
(
  'a1210000-0000-4000-a103-000000000319', 'b1100000-0000-4000-a110-000000000003', 'Cereal infantil Nestlé Nestum Trigo Miel 350 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/cereal-infantil-nestum-trigo-miel-350-g-7613034027610--846292/p. Marca: Nestum. Cereal infantil NESTUM® Trigo Miel x 350g',
  '👶', 23900, 'Alimentación Del Bebé', 'https://olimpica.vteximg.com.br/arquivos/ids/1441717/7613034027610.jpg?v=638531058698000000',
  true, 318
),
(
  'a1210000-0000-4000-a103-000000000320', 'b1100000-0000-4000-a110-000000000003', 'DEO YODORA CREM CLASIC 32 g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/deo-yodora-crem-clasic-32-g/p. Marca: Yodora. DEO YODORA CREM CLASIC 32 g',
  '🧴', 8640, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/1855149/7702057080105.jpg.jpg?v=638833521621000000',
  true, 319
),
(
  'a1210000-0000-4000-a103-000000000321', 'b1100000-0000-4000-a110-000000000003', 'TOALLAS HUMEDAS WIPER NATURAL X100UN Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toallas-humedas-wiper-natural-x100un/p. Marca: WIPER NATURAL. TOALLAS HUMEDAS WIPER NATURAL X100UN',
  '🧴', 5550, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2388642/9944970601069_1.jpg?v=639129066682300000',
  true, 320
),
(
  'a1210000-0000-4000-a103-000000000322', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Gold Etapa 6 X30 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pa-al-winny-gold-etapa-6-x30un/p. Marca: Winny. PA#AL WINNY GOLD ETAPA 6 X30UN',
  '🧴', 50587, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357811/7701021118912_1.jpg?v=639077118698800000',
  true, 321
),
(
  'a1210000-0000-4000-a103-000000000323', 'b1100000-0000-4000-a110-000000000003', 'JAB LAK TROPICAL 110g X3un Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jab-lak-tropical-110g-x3un/p. Marca: Lak. JAB LAK TROPICAL 110g X3un',
  '🛒', 5990, 'Leche En Polvo Y Crema De Leche', 'https://olimpica.vteximg.com.br/arquivos/ids/1600670/7702310020930.jpg?v=638694433327030000',
  true, 322
),
(
  'a1210000-0000-4000-a103-000000000324', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Sec Etapa 2 X30 Unds + Gratis Toalla X10 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pa-al-winny-sec-et2-x30-gts-toax10un/p. Marca: Winny. PA#AL WINNY SEC ET2 X30 GTS TOAx10un',
  '🧴', 23550, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357842/7701021116536_1.jpg?v=639077120142470000',
  true, 323
),
(
  'a1210000-0000-4000-a103-000000000325', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Sec Etapa 1 X50 Unds + Gratis Toalla X20 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pa-al-winny-sec-et1-x50-gts-toax20un/p. Marca: Winny. 1',
  '🧴', 35692, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2357838/7701021116512_1.jpg?v=639077119962000000',
  true, 324
),
(
  'a1210000-0000-4000-a103-000000000326', 'b1100000-0000-4000-a110-000000000003', 'Pañal Winny Sec Etapa 1 X30 Unds + Gratis Toalla X20 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pa-al-winny-sec-et1-x30-gts-toax20un/p. Marca: Winny. PA#AL WINNY SEC ET1 X30 GTS TOAx20un',
  '🧹', 21375, 'Aseo Del Bebe', 'https://olimpica.vteximg.com.br/arquivos/ids/2357834/7701021116499_1.jpg?v=639077119786570000',
  true, 325
),
(
  'a1210000-0000-4000-a103-000000000327', 'b1100000-0000-4000-a110-000000000003', 'Pañales Huggies Triple Protección 4/XG 20 Un Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pañal-huggies-tripl-prot-xg-x20-un/p. Marca: Huggies. Los Pañales Huggies® Triple Protección® Brindan una protección completa, con doble barrera anti filtraciones y un centro reforzado que mantiene a tu bebé sequito y limpio durante mucho más',
  '🧴', 18990, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/2304185/7702425478350_1.jpg?v=638983828902470000',
  true, 326
),
(
  'a1210000-0000-4000-a103-000000000328', 'b1100000-0000-4000-a110-000000000003', 'Toalla Húmeda Arrurrú Avena y Karité 170 Unds X2 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-hum-arrurru-aven-y-karit-170un-x2/p. Marca: Arrurru. TOALLA HUM ARRURRU AVEN Y KARIT 170un X2',
  '🧴', 16850, 'Cuidado De La Nalguita', 'https://olimpica.vteximg.com.br/arquivos/ids/1323277/7702277243960.jpg?v=638447555638130000',
  true, 327
),
(
  'a1210000-0000-4000-a103-000000000329', 'b1100000-0000-4000-a110-000000000003', 'Compota Baby Fruit Manzana 90 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/compota-baby-fruit-manzana-90g/p. Marca: Baby Fruit. COMPOTA BABY FRUIT MANZANA 90g',
  '👶', 3490, 'Alimentación Del Bebé', 'https://olimpica.vteximg.com.br/arquivos/ids/1488546/7707262680102.jpg?v=638627260103000000',
  true, 328
),
(
  'a1210000-0000-4000-a103-000000000330', 'b1100000-0000-4000-a110-000000000003', 'TOALLA HUM WINNY GOLD AVEN 2PAQ80 +PAQ40 Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/toalla-hum-winny-gold-aven-2paq80--paq40/p. Marca: Winny. TOALLA HUM WINNY GOLD AVEN 2PAQ80 +PAQ40',
  '🛒', 24292, 'Desodorante Y Antitranspirante', 'https://olimpica.vteximg.com.br/arquivos/ids/2365404/7701021148933_1.jpg?v=639094396914670000',
  true, 329
),
(
  'a1210000-0000-4000-a103-000000000331', 'b1100000-0000-4000-a110-000000000003', 'Arena Unikat para Gatos Lavanda 4 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arena-unikat-p-gatos-lavanda-4kg/p. Marca: UNIKAT. ARENA UNIKAT P/GATOS LAVANDA 4kg',
  '🧹', 11475, 'Articulo de Aseo para Mascotas', 'https://olimpica.vteximg.com.br/arquivos/ids/1306315/7702084057422.jpg?v=638437127275230000',
  true, 330
),
(
  'a1210000-0000-4000-a103-000000000332', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gato Donkat 1,1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-gato-donkat-1-1kg/p. Marca: Donkat. ALIMENTO GATO DONKAT 1.1KG',
  '🛒', 12990, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1538058/7702084057446.jpg?v=638652873252870000',
  true, 331
),
(
  'a1210000-0000-4000-a103-000000000333', 'b1100000-0000-4000-a110-000000000003', 'ALIM GATO MIRRINGO ORIGINAL 1 KG Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-gato-mirringo-original-1-kg/p. Marca: Mirringo. ALIM GATO MIRRINGO ORIGINAL 1 KG',
  '🛒', 8812, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1775849/7703090732433.jpg.jpg?v=638748997681270000',
  true, 332
),
(
  'a1210000-0000-4000-a103-000000000334', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gato Donkat Adulto 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-gato-donkat/p. Marca: Donkat. ALIM GATO DONKAT',
  '🛒', 5617, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1354482/7702084057156.jpg?v=638476617456930000',
  true, 333
),
(
  'a1210000-0000-4000-a103-000000000335', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gato Easy Cat 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-gato-easy-cat-1-kg/p. Marca: Easy Cat. ALIM GATO EASY CAT 1 kg',
  '🛒', 4194, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/2388410/7707025802826_1.jpg?v=639128942785900000',
  true, 334
),
(
  'a1210000-0000-4000-a103-000000000336', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gatos Donkat Gaticos 1 a 12 Meses 1 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-gatos-donkat-gaticos-1-12meses-1kg-7702084057132--1339261/p. Marca: Donkat. ALIMENTO GATOS DONKAT GATICOS 1-12MESES 1kg',
  '🛒', 12790, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1127229/7702084057132.jpg?v=638258014419400000',
  true, 335
),
(
  'a1210000-0000-4000-a103-000000000337', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Chunky Adultos Pollo 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-chunky-pollo-adlto-2-kg--7707205156855--1254694/p. Marca: Chunky. ALIMENTO PERRO CHUNKY POLLO ADLTO 2 kg Aquí puedes encontrar más productos Chunky',
  '🛒', 19700, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/2322908/7707205156855.jpg?v=639001952938800000',
  true, 336
),
(
  'a1210000-0000-4000-a103-000000000338', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Dog Chow Adultos Medianos & Grandes con Carne y Pollo 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-adulto-dog-chow-raza-mediana-y-grande-x-2-000g-7702521104115--1108077/p. Marca: Dog Chow. DOG CHOW SALUD VISIBLE ADULTOS MEDIANOS Y GRANDES® ahora viene con EXTRALIFE. Una mezcla especial con antioxidantes que maximiza su calid',
  '🛒', 20152, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/1470184/7702521104115.jpg?v=638575687871400000',
  true, 337
),
(
  'a1210000-0000-4000-a103-000000000339', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gatos Cat Chow Adulto Vida Sana 1300 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-gatos-adulto-cat-chow-vida-sana-1-300g-7702521100612--692601/p. Marca: Cat Chow. ALIMENTO GATOS ADULTO CAT CHOW VIDA SANA 1.300g',
  '🛒', 33742, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1592078/7702521100612-2.jpg?v=638676443024430000',
  true, 338
),
(
  'a1210000-0000-4000-a103-000000000340', 'b1100000-0000-4000-a110-000000000003', 'Alpiste Olimpica 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alpiste-olimpica-500-g-7701008001039-2000079/p. Marca: Olimpica. Alpiste Olimpica 500 G',
  '🐶', 2625, 'Alimentos para otras Mascotas', 'https://olimpica.vteximg.com.br/arquivos/ids/2354796/7701008001039.jpg?v=639071316404570000',
  true, 339
),
(
  'a1210000-0000-4000-a103-000000000341', 'b1100000-0000-4000-a110-000000000003', 'ALIM PERRO CHUNKY ADUL RAZ PEQ NUG 1.5KG Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-perro-chunky-adul-raz-peq-nug-1-5kg/p. Marca: Chunky. ALIM PERRO CHUNKY ADUL RAZ PEQ NUG 1.5KG',
  '🛒', 14242, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/2322906/7707205154134.jpg?v=639001952560770000',
  true, 340
),
(
  'a1210000-0000-4000-a103-000000000342', 'b1100000-0000-4000-a110-000000000003', 'Pañitos Húmedos Tommy Pets X50 Unds Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/panitos-humed-tommy-pets-x50un/p. Marca: Tommy. PAÑITOS HUMED TOMMY PETS X50UN',
  '🧹', 4990, 'Articulo de Aseo para Mascotas', 'https://olimpica.vteximg.com.br/arquivos/ids/1834178/7708808596338--2-.jpg.jpg?v=638797288017600000',
  true, 341
),
(
  'a1210000-0000-4000-a103-000000000343', 'b1100000-0000-4000-a110-000000000003', 'Arena Tommy Lavanda 4,5 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/arena-tommy-lavanda-4-5-kg/p. Marca: Tommy. ARENA TOMMY LAVANDA 4.5 KG',
  '🧹', 13990, 'Articulo de Aseo para Mascotas', 'https://olimpica.vteximg.com.br/arquivos/ids/1834174/7709536781768--2-.jpg.jpg?v=638797287152730000',
  true, 342
),
(
  'a1210000-0000-4000-a103-000000000344', 'b1100000-0000-4000-a110-000000000003', 'Alimento para perro Dog Chow® Cachorros Gran Comienzo® Med y Gran x 1kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-para-perro-dog-chow®-cachorros-gran-comienzo®-med-y-gran-x-1kg/p. Marca: Dog Chow. Alimento para perro Dog Chow® Cachorros Gran Comienzo® Med y Gran x 1kg',
  '🛒', 13492, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/1471036/7702521193713--1-.png?v=638579444327970000',
  true, 343
),
(
  'a1210000-0000-4000-a103-000000000345', 'b1100000-0000-4000-a110-000000000003', 'Avena Medalla de Oro 1000 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/avena-medalla-oro-1000g/p. Marca: Medalla De Oro. AVENA MEDALLA ORO 1000g',
  '🥛', 5600, 'Lácteos', 'https://olimpica.vteximg.com.br/arquivos/ids/1897894/7701008843851.jpg?v=638888990069100000',
  true, 344
),
(
  'a1210000-0000-4000-a103-000000000346', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gato Felix Pack Surtido Precio Especial Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/comida-para-gatos-felix--pack-surtido-precio-especial/p. Marca: Felix. Comida para gatos Felix® Pack Surtido Precio Especial',
  '🛒', 14990, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1480445/7702521661366.jpg?v=638606227460700000',
  true, 345
),
(
  'a1210000-0000-4000-a103-000000000347', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Pedigree Húmedo Carne 100 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-perro-pedigree-r-peq-hum-carne-100g/p. Marca: Pedigree. ALIM PERRO PEDIGREE R PEQ HUM CARNE 100g',
  '🛒', 2467, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/1071215/706460249484.jpg?v=638168436563700000',
  true, 346
),
(
  'a1210000-0000-4000-a103-000000000348', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Pedigree Húmedos Adultos Pollo 100 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-perro-pedigree-adult-pollo-hum-100g/p. Marca: Pedigree. ALIM PERRO PEDIGREE ADULT POLLO HUM 100g',
  '🛒', 2392, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/1071226/706460249286.jpg?v=638168436843430000',
  true, 347
),
(
  'a1210000-0000-4000-a103-000000000349', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gato Felix Salmón Trocitos Jugosos 85 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-gato-felix-humed-salmon-85g/p. Marca: Felix. Alimento Para Gato Felix Salmón Trocitos Jugosos 85 G',
  '🛒', 2303, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1470130/7501072209849_1.jpg?v=638575672140600000',
  true, 348
),
(
  'a1210000-0000-4000-a103-000000000350', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gato Felix Húmedo Carne 85 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-gato-felix-humed-carne-85g/p. Marca: Felix. Alimento Gato Felix Húmedo Carne 85 G',
  '🛒', 2303, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1470109/7501072209788_1.jpg?v=638575665632470000',
  true, 349
),
(
  'a1210000-0000-4000-a103-000000000351', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Dogourmet Adultos Pavo Pollo 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alim-perro-dogourmet-pavo-2kg/p. Marca: Dogourmet. ALIM PERRO DOGOURMET PAVO 2kg',
  '🛒', 18500, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/898472/7702084051024.jpg?v=637986198366600000',
  true, 350
),
(
  'a1210000-0000-4000-a103-000000000352', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Top Dog Adultos 4 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-top-dog-adulto-4-kg-7707025802642--1401348/p. Marca: Top Dog. Alimento para Perros Top Dog Adulto 4 Kg',
  '🛒', 19990, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/2388408/7707025802642_1.jpg?v=639128942482870000',
  true, 351
),
(
  'a1210000-0000-4000-a103-000000000353', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Top Dog Cachorros 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-top-dog-cachorro-2-kg-7707025802628--1401346/p. Marca: Top Dog. Alimento para Perros Top Dog Cachorro 2 Kg',
  '🛒', 12190, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/2388483/7707025802628_1.jpg?v=639128954803930000',
  true, 352
),
(
  'a1210000-0000-4000-a103-000000000354', 'b1100000-0000-4000-a110-000000000003', 'Alimento para Gatos Ohmaigat Casero & Delicado 500 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-gatos-ohmaigat-casero--delicado-500g-7702084057095--1339260/p. Marca: Ohmaigat. Alimento para Gatos Ohmaigat Casero & Delicado 500 G',
  '🛒', 9450, 'Alimento para Gato', 'https://olimpica.vteximg.com.br/arquivos/ids/1354457/7702084057095.jpg?v=638807614139100000',
  true, 353
),
(
  'a1210000-0000-4000-a103-000000000355', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Chunky Cachorros Pollo 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-chunky--cachorro-pollo--2-kg-7707205157333--1255153/p. Marca: Chunky. Alimento para Perros Chunky Cachorro Pollo 2 Kg',
  '🛒', 23800, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/2322910/7707205157333.jpg?v=639001953358930000',
  true, 354
),
(
  'a1210000-0000-4000-a103-000000000356', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Dog Chow Adultos Medianos & Grandes con Carne y Pollo 4 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-adulto-dog-chow-raza-mediana-y-grande-x-4-000g-7702521104122--1108078/p. Marca: Dog Chow. DOG CHOW SALUD VISIBLE ADULTOS MEDIANOS Y GRANDES® ahora viene con EXTRALIFE. Una mezcla especial con antioxidantes que maximiza su calid',
  '🛒', 40500, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/1470189/7702521104122.jpg?v=638575689699700000',
  true, 355
),
(
  'a1210000-0000-4000-a103-000000000357', 'b1100000-0000-4000-a110-000000000003', 'Alimento Perro Dogourmet Cachorros Leche Deslactosada 2 Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/alimento-perro-dogourm-cachorro-leche-deslac-2kg-7702084050201-883826/p. Marca: Dogourmet. Alimento de Perro Dogourmet Cachorro Leche Deslactosada 2 Kg',
  '🛒', 20475, 'Alimento para Perro', 'https://olimpica.vteximg.com.br/arquivos/ids/1354453/7702084050201.jpg?v=638476616874400000',
  true, 356
),
(
  'a1210000-0000-4000-a103-000000000358', 'b1100000-0000-4000-a110-000000000003', 'Suero Klaren''s Costeño con Válvula 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/sueoklarens-costeno-c-valv-400g-7702705022020-1187223/p. Marca: Klaren''S. Conoce el Suero Klaren''s Costeño 400 G con Válvula, ideal para rehidratación efectiva. Perfecto para mantenerte activo y saludable. ¡Ordénalo ahora!',
  '🛒', 11800, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/718981/7702705022020.jpg?v=637756134111730000',
  true, 357
),
(
  'a1210000-0000-4000-a103-000000000359', 'b1100000-0000-4000-a110-000000000003', 'Suero Klaren''s Costeño con Válvula 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/sueoklarens-costeno-c-valv-200g-7702705022013-1187221/p. Marca: Klaren''S. Optimiza tu hidratación con Suero Klaren''s Costeño 200 G. Su válvula facilita la dosificación. Perfecto para mantenerte saludable y enérgico.',
  '🛒', 6300, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/718980/7702705022013.jpg?v=637756134096230000',
  true, 358
),
(
  'a1210000-0000-4000-a103-000000000360', 'b1100000-0000-4000-a110-000000000003', 'Combo Perro Caliente + Bebida Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/combo-peo-caliente-bebida-26293622-1600656/p. Marca: Olimpica. Disfruta del delicioso combo de perro caliente y bebida, perfecto para saciar tu hambre. Ideal para compartir en cualquier ocasión. Pide el tuyo hoy.',
  '🛒', 4990, 'Cafetería', 'https://olimpica.vteximg.com.br/arquivos/ids/2414003/ChatGPT-Image-Jun-19-2026-04_13_25-PM.png?v=639175005695270000',
  true, 359
),
(
  'a1210000-0000-4000-a103-000000000361', 'b1100000-0000-4000-a110-000000000003', 'Suero costeño Alqueria 400g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suero-alqueria-coste-o-400g/p. Marca: Alqueria. Suero costeño Alqueria 400g',
  '🛒', 8400, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1881641/7702177023648.jpg?v=638871749780270000',
  true, 360
),
(
  'a1210000-0000-4000-a103-000000000362', 'b1100000-0000-4000-a110-000000000003', 'Suero costeño Alqueria 200g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suero-alqueria-coste-o--200g/p. Marca: Alqueria. Suero costeño Alqueria 200g',
  '🛒', 5800, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1838052/7702177023631.jpg.jpg?v=638799890632930000',
  true, 361
),
(
  'a1210000-0000-4000-a103-000000000363', 'b1100000-0000-4000-a110-000000000003', 'QUESO FETA 250G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-feta-centurion-250gr/p. Marca: Centurion. QUESO DE TEXTURA DESMENUZABLE Y UN CARACTERISTICOSABOR SALADO CON NOTAS AGRIAS BIEN BALANCEADAS. IDEAL PARA ENSALADAS',
  '🛒', 21600, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412208/7708957687062.jpg?v=639173952945670000',
  true, 362
),
(
  'a1210000-0000-4000-a103-000000000364', 'b1100000-0000-4000-a110-000000000003', 'SUERO COSTEÑO LOS CAMPANOS 400g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suero-costeno-los-campanos-400g/p. Marca: Los Campanos. SUERO COSTEÑO LOS CAMPANOS 400g',
  '🛒', 7500, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1886022/7709522983114.jpg?v=638877628317200000',
  true, 363
),
(
  'a1210000-0000-4000-a103-000000000365', 'b1100000-0000-4000-a110-000000000003', 'PASTA ESPAGUETTI COMARRICO CLASICA 454g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/pasta-espaguetti-comarrico-clasica-454g/p. Marca: Comarrico. PASTA ESPAGUETTI COMARRICO CLASICA 454g',
  '🛒', 2660, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1785041/7707307963146.jpg?v=638767868804500000',
  true, 364
),
(
  'a1210000-0000-4000-a103-000000000366', 'b1100000-0000-4000-a110-000000000003', 'Suero Colanta Costeño 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/suero-colanta-coste--200-g/p. Marca: Colanta. SUERO COLANTA COSTE# 200 G',
  '🛒', 4500, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1391987/7702129035873.jpg?v=638495828457200000',
  true, 365
),
(
  'a1210000-0000-4000-a103-000000000367', 'b1100000-0000-4000-a110-000000000003', 'Queso Medalla de Oro Mozzarella Tajado X Kg Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-medalla-de-oro-t-moza-tajado-kg-24055123-779446/p. Marca: Medalla De Oro. Queso Medalla de Oro Mozzarella Tajado X Kg',
  '🛒', 37000, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/715537/24055123.jpg?v=637756088104000000',
  true, 366
),
(
  'a1210000-0000-4000-a103-000000000368', 'b1100000-0000-4000-a110-000000000003', 'POLLO ROSTIZADO 1.3KG Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/combo-pollo-ostiz-1-papa-1-3-kg-25109191-896627/p. Marca: Olimpica. Disfruta de un delicioso pollo rostizado de 1,3 kg. Perfecto para compartir en familia. ¡Haz tu pedido y saborea la tradición!',
  '🛒', 21900, 'Cafetería', 'https://olimpica.vteximg.com.br/arquivos/ids/2422144/896627.jpg?v=639191168600430000',
  true, 367
),
(
  'a1210000-0000-4000-a103-000000000369', 'b1100000-0000-4000-a110-000000000003', 'QUESO LONCHITAS MOZZARELLA X 16 UND 272G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-lonchita-mozzarella-x16-un-80g/p. Marca: SIN MARCA 2. LONCHAS DE QUESO DE FACIL FUNDIDO, CON TEXTURA SUAVE Y PRACTICA DE USO DIARIO. IDEAL PARA HAMBURGUESAS Y SANDWICHES.',
  '🛒', 8540, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412239/7702603072011.png?v=639173958926800000',
  true, 368
),
(
  'a1210000-0000-4000-a103-000000000370', 'b1100000-0000-4000-a110-000000000003', 'QUESO LONCHITA CHEDDAR X 16 UND 272G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-lonchita-cheddar-x16-un-80g/p. Marca: SIN MARCA 2. LONCHAS DE QUESO DE FACIL FUNDIDO, CON TEXTURA SUAVE Y PRACTICA DE USO DIARIO. IDEAL PARA HAMBURGUESAS Y SANDWICHES.',
  '🛒', 8540, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412237/7702603072004.jpg?v=639173958502300000',
  true, 369
),
(
  'a1210000-0000-4000-a103-000000000371', 'b1100000-0000-4000-a110-000000000003', 'JAMON SERRANO TAJADO 80G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/jamon-serrano-tajado-80g/p. Marca: IBAÑEZ. JAMON SERRANO TAJADO 80G',
  '🛒', 11200, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1837925/7700438881310.jpg?v=639173969317400000',
  true, 370
),
(
  'a1210000-0000-4000-a103-000000000372', 'b1100000-0000-4000-a110-000000000003', 'QUINUA DORIA E/GRANO 300g Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/quinua-doria-e-grano-300g/p. Marca: Doria. QUINUA DORIA E/GRANO 300g',
  '🛒', 9290, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1785043/7702085003473.jpg?v=638767869761570000',
  true, 371
),
(
  'a1210000-0000-4000-a103-000000000373', 'b1100000-0000-4000-a110-000000000003', 'COMBO HAMBURGUESA 320GR + COCA-COLA 12- OZ Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/combo-hamb-320-gr-coca-cola-12-oz/p. Marca: Olimpica. COMBO-HAMB-320-GR+COCA-COLA-12-OZ',
  '🛒', 9990, 'Cafetería', 'https://olimpica.vteximg.com.br/arquivos/ids/2414002/ChatGPT-Image-Jun-19-2026-04_12_03-PM.png?v=639175004703900000',
  true, 372
),
(
  'a1210000-0000-4000-a103-000000000374', 'b1100000-0000-4000-a110-000000000003', 'Crema Agria Colanta 200 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crema-agria-colanta-200g/p. Marca: Colanta. CREMA AGRIA COLANTA 200g',
  '🛒', 7900, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1423421/7702129035897.jpg?v=638513134078930000',
  true, 373
),
(
  'a1210000-0000-4000-a103-000000000375', 'b1100000-0000-4000-a110-000000000003', 'QUESO GOUDA AHUMADO TAJADO CENTURION 150 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-gouda-ahum-centurion-150-g/p. Marca: Centurion. QUESO SEMIDURO, TAJADO Y CON UN DELICADO SABOR A MANTEQUILLA, LIGERAMENTE DULCE Y AHUMADO. ES IDEAL PARA SANDWICHES, HAMBURGUESAS, ENTRADAS Y TABLAS DE QUESOS.',
  '🛒', 12000, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412232/7702603071618.png?v=639173957251600000',
  true, 374
),
(
  'a1210000-0000-4000-a103-000000000376', 'b1100000-0000-4000-a110-000000000003', 'QUESO MUENSTER TAJADO CENTURION 150G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-muenster-centurion-150g/p. Marca: Centurion. QUESO SEMIBLANDO CON SABOR SUAVE, Y CREMOSO. IDEAL PARA APERITIVOS, QUESADILLAS, SANDWICHES Y TABLAS DE QUESOS.',
  '🛒', 11100, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412234/7702603071632.png?v=639173957640070000',
  true, 375
),
(
  'a1210000-0000-4000-a103-000000000377', 'b1100000-0000-4000-a110-000000000003', 'QUESO COLBY JACK  TAJADO CENTURION 150G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-colby-jack-centurion-150g/p. Marca: Centurion. QUESO SEMIBLANDO CON TEXTURA CREMOSA Y SABOR SUAVE. SU EXCELENTE CAPACIDAD PARA FUNDIR LO HACE IDEAL PARA SANDWICHES Y TABLAS DE QUESOS, PERFECTO PARA COMPAÑAR CON VINOS SUAVES.',
  '🛒', 11400, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412233/7702603071625.png?v=639173957494230000',
  true, 376
),
(
  'a1210000-0000-4000-a103-000000000378', 'b1100000-0000-4000-a110-000000000003', 'QUESO BRIE 125 G CENTURION Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/qso-brie-kaserei-champignon-125g/p. Marca: Centurion. QUESO DE TEXTURA CREMOSA Y UNTUOSA. IDEAL PARA SALSAS, Y ACOMPAÑAR CON CONFITURAS.',
  '🛒', 20100, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/2412229/61104410607.png?v=639173956603230000',
  true, 377
),
(
  'a1210000-0000-4000-a103-000000000379', 'b1100000-0000-4000-a110-000000000003', 'GASEOSA COCA COLA ZERO 400 ML Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/gaseosa-coca-cola-zero-400-ml/p. Marca: Coca-Cola. GASEOSA COCA COLA ZERO 400 ML',
  '🧹', 3600, 'Gaseosas', 'https://olimpica.vteximg.com.br/arquivos/ids/2335706/7702535011119_0.jpg?v=639034812802130000',
  true, 378
),
(
  'a1210000-0000-4000-a103-000000000380', 'b1100000-0000-4000-a110-000000000003', 'Crema Agria 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/crema-agria-400-g/p. Marca: Colanta. CREMA AGRIA 400 g',
  '🛒', 13500, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1423338/7702129035859.jpg?v=638879407059500000',
  true, 379
),
(
  'a1210000-0000-4000-a103-000000000381', 'b1100000-0000-4000-a110-000000000003', 'QUESO COLANTA MOZARELLA Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/queso-colanta-mozarella/p. Marca: Colanta. QUESO COLANTA MOZARELLA',
  '🛒', 39075, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1836296/2935036000008.jpg.jpg?v=638793783907070000',
  true, 380
),
(
  'a1210000-0000-4000-a103-000000000382', 'b1100000-0000-4000-a110-000000000003', 'Mix Madurados Monticello 115 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/mix-maduad-monticello-115g-7701101357170-2077271/p. Marca: Monticello. Combinación de chorizo español de cerdo, jamón serrano y salami. Usado idealmente para montaditos, pasabocas, brochetas, sánduches, ensaladas, pizzas, focaccias, croquetas',
  '🛒', 28800, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/1599750/7701101357170-1.jpg?v=638690139284000000',
  true, 381
),
(
  'a1210000-0000-4000-a103-000000000383', 'b1100000-0000-4000-a110-000000000003', 'Suero Atoyabuey Bonga Del Sinú 250 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/sueo-atoyabuey-bonga-del-sinu-250g-7707279500028-1637971/p. Marca: La Bonga Del Sinu. Optimiza tus impresiones con el Cartucho Tóner HP 504A Magenta Original. Alta calidad y rendimiento garantizado para tus trabajos profesionales.',
  '🛒', 7000, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/765411/7707279500028.jpg?v=637806386773100000',
  true, 382
),
(
  'a1210000-0000-4000-a103-000000000384', 'b1100000-0000-4000-a110-000000000003', 'Suero Codelac Costeño Sinú Pasteurizado 400 G Demo', 'Demo UrabApp — catálogo de ejemplo basado en productos públicos de olimpica.com. Sede de referencia: Olímpica CC Nuestro Urabá (Apartadó). Precios e imágenes pueden variar. Información final sujeta a aprobación del comercio. Origen: https://www.olimpica.com/sueo-sinu-costeno-pasteuiz-codelac-400g-7707363590133-1241648/p. Marca: Codelac. Disfruta del auténtico sabor del Suero Codelac Costeño 400g, ideal para rehidratarte y nutrirte. Calidad garantizada para tu bienestar diario.',
  '🛒', 9200, 'Delicatessen', 'https://olimpica.vteximg.com.br/arquivos/ids/719926/7707363590133.jpg?v=637756146638930000',
  true, 383
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_available = true;

ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;