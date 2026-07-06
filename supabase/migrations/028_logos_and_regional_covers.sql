-- Logos demo + fotos regionales Urabá en comercios destacados

UPDATE public.businesses
SET logo_url = cover_url
WHERE is_active = true AND cover_url IS NOT NULL AND (logo_url IS NULL OR logo_url = '');

UPDATE public.businesses
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg',
    logo_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg'
WHERE slug = 'restaurante-el-bananero';

UPDATE public.businesses
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Amanecer_Playa_Simona-Turbo_Antioquia.jpg/1280px-Amanecer_Playa_Simona-Turbo_Antioquia.jpg'
WHERE slug IN ('comida-r-pida-turbo-c0000002', 'necocl-express-c0000002');

UPDATE public.businesses
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Colbanana09.jpg/1280px-Colbanana09.jpg'
WHERE slug = 'comida-chigorod--c0000002';

UPDATE public.banners
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Apartad%C3%B3_bananeras.jpg/1280px-Apartad%C3%B3_bananeras.jpg'
WHERE link = '/tienda/restaurante-el-bananero';
