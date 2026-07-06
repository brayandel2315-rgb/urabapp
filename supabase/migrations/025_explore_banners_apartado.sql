-- Banners de explorar: comercios reales de Apartadó (imágenes vía app hasta subir fotos propias)

UPDATE public.banners
SET
  title = 'Restaurante El Bananero',
  subtitle = 'Sancocho, patacón y comida típica urabaense — pide ya en Apartadó',
  link = '/tienda/restaurante-el-bananero',
  image_url = NULL,
  municipio = 'Apartadó',
  is_active = true,
  sort_order = 1
WHERE sort_order = 1;

UPDATE public.banners
SET
  title = 'Arepas Doña Rosa',
  subtitle = 'Arepas recién hechas en el barrio — domicilio desde $5.000',
  link = '/tienda/arepas-do-a-rosa-b0000001',
  image_url = NULL,
  municipio = 'Apartadó',
  is_active = true,
  sort_order = 2
WHERE sort_order = 2;

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT
  'Farmacia San Rafael',
  'Medicamentos y cuidado personal — te lo llevamos a la puerta',
  '/tienda/farmacia-san-rafael',
  NULL,
  'Apartadó',
  true,
  3
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE sort_order = 3);

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT
  'Jugos Naturales',
  'Jugos de mango, lulo y frutas de la región',
  '/tienda/jugos-naturales-c0000002',
  NULL,
  'Apartadó',
  true,
  4
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE sort_order = 4);

INSERT INTO public.banners (title, subtitle, link, image_url, municipio, is_active, sort_order)
SELECT
  'Panadería San José',
  'Pan fresco y mecato del barrio — sin hacer fila',
  '/tienda/panader-a-san-jos--b0000001',
  NULL,
  'Apartadó',
  true,
  5
WHERE NOT EXISTS (SELECT 1 FROM public.banners WHERE sort_order = 5);
