-- Seed missing Cruz Verde onboarding previews
ALTER TABLE public.businesses DISABLE TRIGGER trg_guard_business_verification;
INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  'b1100000-0000-4000-a110-000000000005', 'Cruz Verde Plaza del Río · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Droguería Cruz Verde en Plaza del Río. Preview OTC/cuidado personal para onboarding (sin medicamentos con fórmula).', '💊',
  'Apartadó', 'Villa del Río', 'CC Plaza del Río Local 1129, Calle 99C # 100-117, Apartadó',
  7.8842, -76.6292, '08:00'::time, '19:00'::time,
  4000, 12000, 25, 5, 4.7, 40,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-plaza-del-rio', NULL, '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = true,
  is_published = true,
  is_open = true,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url;
INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  'b1100000-0000-4000-a110-000000000006', 'Cruz Verde Nuevo Apartadó · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Sede Cruz Verde / Medicarte en Nuevo Apartadó. Vitrina demo UrabApp para domicilio de cuidado OTC.', '💊',
  'Apartadó', 'Nuevo Apartadó', 'Calle 95 # 105-36, Barrio Nuevo Apartadó',
  7.8785, -76.6325, '06:30'::time, '21:00'::time,
  4000, 12000, 25, 5, 4.6, 40,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-nuevo-apartado', '6048282324', '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = true,
  is_published = true,
  is_open = true,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url;
INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  'b1100000-0000-4000-a110-000000000007', 'Cruz Verde Turbo · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Presencia Cruz Verde en Turbo. Preview de onboarding para activar domicilio farmacéutico local.', '💊',
  'Turbo', 'Centro', 'Carrera 13 con Calle 101, Turbo',
  8.092, -76.7285, '07:00'::time, '20:00'::time,
  4500, 12000, 30, 5, 4.5, 40,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-turbo', '6048272068', '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = true,
  is_published = true,
  is_open = true,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url;
INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  'b1100000-0000-4000-a110-000000000008', 'Cruz Verde Chigorodó · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Sede Chigorodó. Vitrina demo para conversaciones comerciales UrabApp.', '💊',
  'Chigorodó', 'Centro', 'Carrera 100 # 96A-15, Chigorodó',
  7.6698, -76.6815, '07:00'::time, '20:00'::time,
  4500, 12000, 30, 5, 4.5, 40,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-chigorodo', NULL, '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = true,
  is_published = true,
  is_open = true,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url;
INSERT INTO public.businesses (
  id, name, category, description, emoji, municipio, zone, address,
  latitude, longitude, opens_at, closes_at,
  delivery_fee, min_order, delivery_time, delivery_radius_km, rating, total_ratings,
  is_open, is_active, is_published, verification_status, approved_at, slug, phone, cover_url, logo_url
) VALUES (
  'b1100000-0000-4000-a110-000000000009', 'Cruz Verde Carepa · Preview UrabApp', 'farmacia', 'Preview creado por UrabApp para onboarding comercial. Los activos de marca pertenecen a sus titulares. Información, productos y branding finales serán revisados y aprobados por el comercio antes de publicarse.

Cobertura Carepa. Preview UrabApp orientado a onboarding de droguería.', '💊',
  'Carepa', 'Centro', 'Carepa, Antioquia (sede Botica Junín / Medicarte)',
  7.7585, -76.6555, '07:00'::time, '20:00'::time,
  4500, 12000, 30, 5, 4.5, 40,
  true, true, true, 'approved', NOW(), 'preview-cruz-verde-carepa', NULL, '/previews/cover-farmacia.jpg', '/previews/logo-farmacia.png'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  is_active = true,
  is_published = true,
  is_open = true,
  cover_url = EXCLUDED.cover_url,
  logo_url = EXCLUDED.logo_url;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000001', 'b1100000-0000-4000-a110-000000000005', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000002', 'b1100000-0000-4000-a110-000000000005', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000003', 'b1100000-0000-4000-a110-000000000005', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🍊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000004', 'b1100000-0000-4000-a110-000000000005', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', 35900,
    'Cuidado', '☀️', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000005', 'b1100000-0000-4000-a110-000000000005', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000006', 'b1100000-0000-4000-a110-000000000005', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Primeros auxilios', '🩹', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000007', 'b1100000-0000-4000-a110-000000000005', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', 3900,
    'Primeros auxilios', '🧪', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000008', 'b1100000-0000-4000-a110-000000000005', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🦟', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000009', 'b1100000-0000-4000-a110-000000000005', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 28900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000010', 'b1100000-0000-4000-a110-000000000005', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000011', 'b1100000-0000-4000-a110-000000000005', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000012', 'b1100000-0000-4000-a110-000000000005', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Bienestar', '🌡️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000013', 'b1100000-0000-4000-a110-000000000005', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Kits', '🧰', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000014', 'b1100000-0000-4000-a110-000000000005', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Bienestar', '😷', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000015', 'b1100000-0000-4000-a110-000000000005', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', 32900,
    'Bienestar', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000016', 'b1100000-0000-4000-a110-000000000005', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000017', 'b1100000-0000-4000-a110-000000000005', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Bienestar', '👁️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000018', 'b1100000-0000-4000-a110-000000000005', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Cuidado', '🧼', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000019', 'b1100000-0000-4000-a110-000000000005', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', 49900,
    'Combos', '🎁', '/previews/p-combos.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a105-000000000020', 'b1100000-0000-4000-a110-000000000005', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Primeros auxilios', '🧴', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000001', 'b1100000-0000-4000-a110-000000000006', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000002', 'b1100000-0000-4000-a110-000000000006', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000003', 'b1100000-0000-4000-a110-000000000006', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🍊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000004', 'b1100000-0000-4000-a110-000000000006', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', 35900,
    'Cuidado', '☀️', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000005', 'b1100000-0000-4000-a110-000000000006', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000006', 'b1100000-0000-4000-a110-000000000006', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Primeros auxilios', '🩹', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000007', 'b1100000-0000-4000-a110-000000000006', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', 3900,
    'Primeros auxilios', '🧪', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000008', 'b1100000-0000-4000-a110-000000000006', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🦟', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000009', 'b1100000-0000-4000-a110-000000000006', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 28900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000010', 'b1100000-0000-4000-a110-000000000006', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000011', 'b1100000-0000-4000-a110-000000000006', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000012', 'b1100000-0000-4000-a110-000000000006', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Bienestar', '🌡️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000013', 'b1100000-0000-4000-a110-000000000006', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Kits', '🧰', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000014', 'b1100000-0000-4000-a110-000000000006', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Bienestar', '😷', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000015', 'b1100000-0000-4000-a110-000000000006', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', 32900,
    'Bienestar', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000016', 'b1100000-0000-4000-a110-000000000006', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000017', 'b1100000-0000-4000-a110-000000000006', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Bienestar', '👁️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000018', 'b1100000-0000-4000-a110-000000000006', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Cuidado', '🧼', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000019', 'b1100000-0000-4000-a110-000000000006', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', 49900,
    'Combos', '🎁', '/previews/p-combos.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a106-000000000020', 'b1100000-0000-4000-a110-000000000006', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Primeros auxilios', '🧴', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000001', 'b1100000-0000-4000-a110-000000000007', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000002', 'b1100000-0000-4000-a110-000000000007', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000003', 'b1100000-0000-4000-a110-000000000007', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🍊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000004', 'b1100000-0000-4000-a110-000000000007', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', 35900,
    'Cuidado', '☀️', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000005', 'b1100000-0000-4000-a110-000000000007', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000006', 'b1100000-0000-4000-a110-000000000007', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Primeros auxilios', '🩹', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000007', 'b1100000-0000-4000-a110-000000000007', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', 3900,
    'Primeros auxilios', '🧪', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000008', 'b1100000-0000-4000-a110-000000000007', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🦟', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000009', 'b1100000-0000-4000-a110-000000000007', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 28900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000010', 'b1100000-0000-4000-a110-000000000007', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000011', 'b1100000-0000-4000-a110-000000000007', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000012', 'b1100000-0000-4000-a110-000000000007', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Bienestar', '🌡️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000013', 'b1100000-0000-4000-a110-000000000007', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Kits', '🧰', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000014', 'b1100000-0000-4000-a110-000000000007', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Bienestar', '😷', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000015', 'b1100000-0000-4000-a110-000000000007', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', 32900,
    'Bienestar', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000016', 'b1100000-0000-4000-a110-000000000007', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000017', 'b1100000-0000-4000-a110-000000000007', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Bienestar', '👁️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000018', 'b1100000-0000-4000-a110-000000000007', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Cuidado', '🧼', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000019', 'b1100000-0000-4000-a110-000000000007', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', 49900,
    'Combos', '🎁', '/previews/p-combos.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a107-000000000020', 'b1100000-0000-4000-a110-000000000007', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Primeros auxilios', '🧴', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000001', 'b1100000-0000-4000-a110-000000000008', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000002', 'b1100000-0000-4000-a110-000000000008', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000003', 'b1100000-0000-4000-a110-000000000008', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🍊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000004', 'b1100000-0000-4000-a110-000000000008', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', 35900,
    'Cuidado', '☀️', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000005', 'b1100000-0000-4000-a110-000000000008', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000006', 'b1100000-0000-4000-a110-000000000008', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Primeros auxilios', '🩹', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000007', 'b1100000-0000-4000-a110-000000000008', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', 3900,
    'Primeros auxilios', '🧪', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000008', 'b1100000-0000-4000-a110-000000000008', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🦟', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000009', 'b1100000-0000-4000-a110-000000000008', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 28900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000010', 'b1100000-0000-4000-a110-000000000008', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000011', 'b1100000-0000-4000-a110-000000000008', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000012', 'b1100000-0000-4000-a110-000000000008', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Bienestar', '🌡️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000013', 'b1100000-0000-4000-a110-000000000008', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Kits', '🧰', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000014', 'b1100000-0000-4000-a110-000000000008', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Bienestar', '😷', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000015', 'b1100000-0000-4000-a110-000000000008', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', 32900,
    'Bienestar', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000016', 'b1100000-0000-4000-a110-000000000008', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000017', 'b1100000-0000-4000-a110-000000000008', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Bienestar', '👁️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000018', 'b1100000-0000-4000-a110-000000000008', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Cuidado', '🧼', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000019', 'b1100000-0000-4000-a110-000000000008', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', 49900,
    'Combos', '🎁', '/previews/p-combos.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a108-000000000020', 'b1100000-0000-4000-a110-000000000008', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Primeros auxilios', '🧴', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000001', 'b1100000-0000-4000-a110-000000000009', 'Acetaminofén 500mg demo', 'OTC — catálogo demostración. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000002', 'b1100000-0000-4000-a110-000000000009', 'Ibuprofeno 400mg demo', 'OTC demo. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Analgésicos', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000003', 'b1100000-0000-4000-a110-000000000009', 'Vitamina C efervescente demo', 'Bienestar. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🍊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000004', 'b1100000-0000-4000-a110-000000000009', 'Protector solar FPS50 demo', 'Cuidado personal. Preview creado por UrabApp para onboarding comercial.', 35900,
    'Cuidado', '☀️', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000005', 'b1100000-0000-4000-a110-000000000009', 'Alcohol gel 60ml demo', 'Antibacterial. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000006', 'b1100000-0000-4000-a110-000000000009', 'Curitas x20 demo', 'Primeros auxilios. Preview creado por UrabApp para onboarding comercial.', 6900,
    'Primeros auxilios', '🩹', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000007', 'b1100000-0000-4000-a110-000000000009', 'Suero oral demo', 'Sobre. Preview creado por UrabApp para onboarding comercial.', 3900,
    'Primeros auxilios', '🧪', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000008', 'b1100000-0000-4000-a110-000000000009', 'Repelente spray demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Bienestar', '🦟', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000009', 'b1100000-0000-4000-a110-000000000009', 'Pañales etapa 2 demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 28900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000010', 'b1100000-0000-4000-a110-000000000009', 'Crema humectante demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 18900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000011', 'b1100000-0000-4000-a110-000000000009', 'Shampoo anticaspa demo', '400ml. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Cuidado', '🧴', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000012', 'b1100000-0000-4000-a110-000000000009', 'Termómetro digital demo', 'Unidad. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Bienestar', '🌡️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000013', 'b1100000-0000-4000-a110-000000000009', 'Kit viaje básico demo', 'Curitas + gel + acetaminofén. Preview creado por UrabApp para onboarding comercial.', 25900,
    'Kits', '🧰', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000014', 'b1100000-0000-4000-a110-000000000009', 'Mascarillas x10 demo', 'Desechables. Preview creado por UrabApp para onboarding comercial.', 8900,
    'Bienestar', '😷', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000015', 'b1100000-0000-4000-a110-000000000009', 'Multivitamínico x30 demo', 'Tabletas. Preview creado por UrabApp para onboarding comercial.', 32900,
    'Bienestar', '💊', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000016', 'b1100000-0000-4000-a110-000000000009', 'Pañitos húmedos demo', 'Bebé. Preview creado por UrabApp para onboarding comercial.', 9900,
    'Bebé', '👶', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000017', 'b1100000-0000-4000-a110-000000000009', 'Gotas oculares demo', 'Lubricantes. Preview creado por UrabApp para onboarding comercial.', 22900,
    'Bienestar', '👁️', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000018', 'b1100000-0000-4000-a110-000000000009', 'Jabón neutro demo', 'Barra. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Cuidado', '🧼', '/previews/p-cuidado.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000019', 'b1100000-0000-4000-a110-000000000009', 'Combo bienestar demo', 'Vitamina C + protector. Preview creado por UrabApp para onboarding comercial.', 49900,
    'Combos', '🎁', '/previews/p-combos.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
INSERT INTO public.products (
    id, business_id, name, description, price, category, emoji, image_url, is_available, sort_order
  ) VALUES (
    'a1100000-0000-4000-a109-000000000020', 'b1100000-0000-4000-a110-000000000009', 'Alcohol antiséptico demo', '120ml. Preview creado por UrabApp para onboarding comercial.', 5900,
    'Primeros auxilios', '🧴', '/previews/p-farmacia.jpg', true, 0
  ) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, is_available = true;
ALTER TABLE public.businesses ENABLE TRIGGER trg_guard_business_verification;
