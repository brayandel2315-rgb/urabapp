-- Fase 2: 30 comercios adicionales (total 50) + categoría envíos

INSERT INTO public.categories (id, name, emoji, sort_order) VALUES
  ('envios', 'Envíos', '📦', 8),
  ('tiendas', 'Tiendas', '🏪', 9)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.businesses (id, name, category, description, emoji, municipio, zone, delivery_fee, min_order, delivery_time, rating, is_open, is_active) VALUES
  ('c0000002-0000-0000-0000-000000000021', 'Burger Urban', 'comida', 'Hamburguesas artesanales', '🍔', 'Apartadó', 'Centro', 5000, 15000, 25, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000022', 'Empanadas El Rincón', 'comida', 'Empanadas y jugos', '🥟', 'Apartadó', 'Centro', 5000, 10000, 20, 4.8, true, true),
  ('c0000002-0000-0000-0000-000000000023', 'Carnes Frías Don Luis', 'mercado', 'Carnes y embutidos', '🥓', 'Apartadó', 'Centro', 5000, 18000, 25, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000024', 'Óptica Visión', 'tiendas', 'Lentes y monturas', '👓', 'Apartadó', 'Centro', 5000, 20000, 30, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000025', 'Ropa Sport Urabá', 'tiendas', 'Ropa deportiva', '👕', 'Apartadó', 'Centro', 5000, 25000, 30, 4.3, true, true),
  ('c0000002-0000-0000-0000-000000000026', 'Tacos México', 'comida', 'Tacos y burritos', '🌮', 'Apartadó', 'Ortiz', 5000, 12000, 25, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000027', 'Jugos Naturales', 'comida', 'Jugos y batidos', '🥤', 'Apartadó', 'Ortiz', 5000, 8000, 15, 4.9, true, true),
  ('c0000002-0000-0000-0000-000000000028', 'Ferretería El Martillo', 'tiendas', 'Herramientas y materiales', '🔨', 'Apartadó', 'Ortiz', 5000, 15000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000029', 'Pescadería El Golfo', 'mercado', 'Pescado fresco', '🐟', 'Apartadó', 'Ortiz', 5000, 15000, 25, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000030', 'Droguería Salud Total', 'farmacia', 'Medicamentos y cuidado', '💊', 'Apartadó', 'Ortiz', 5000, 8000, 20, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000031', 'Restaurante Veggie', 'comida', 'Comida saludable', '🥗', 'Apartadó', 'Laureles', 5000, 18000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000032', 'Pastelería Dulce Hogar', 'comida', 'Tortas y postres', '🎂', 'Apartadó', 'Laureles', 5000, 12000, 25, 4.8, true, true),
  ('c0000002-0000-0000-0000-000000000033', 'Librería Urabá', 'tiendas', 'Libros y útiles', '📖', 'Apartadó', 'Laureles', 5000, 10000, 25, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000034', 'Verduras La Huerta', 'mercado', 'Verduras orgánicas', '🥬', 'Apartadó', 'Laureles', 5000, 10000, 20, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000035', 'Cafetería Express', 'comida', 'Café para llevar', '☕', 'Apartadó', 'Laureles', 5000, 8000, 15, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000036', 'Pollería La Brasa', 'comida', 'Pollo a la brasa', '🍗', 'Apartadó', 'Vélez', 5000, 16000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000037', 'Mini Market 24h', 'mercado', 'Abierto hasta tarde', '🏪', 'Apartadó', 'Vélez', 5000, 12000, 20, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000038', 'Farmacia del Pueblo', 'farmacia', 'Farmacia de barrio', '💊', 'Apartadó', 'Vélez', 5000, 8000, 20, 4.8, true, true),
  ('c0000002-0000-0000-0000-000000000039', 'Zapatería Camina', 'tiendas', 'Calzado', '👟', 'Apartadó', 'Vélez', 5000, 20000, 30, 4.3, true, true),
  ('c0000002-0000-0000-0000-000000000040', 'Chuzos y Pinchos', 'comida', 'Pinchos y chorizos', '🍢', 'Apartadó', 'Vélez', 5000, 10000, 20, 4.7, true, true),
  ('c0000002-0000-0000-0000-000000000041', 'Comida Rápida Turbo', 'comida', 'Comida rápida puerto', '🍟', 'Turbo', NULL, 6000, 12000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000042', 'Mercado Turbo Centro', 'mercado', 'Abarrotes Turbo', '🛒', 'Turbo', NULL, 6000, 15000, 35, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000043', 'Farmacia Turbo', 'farmacia', 'Medicamentos Turbo', '💊', 'Turbo', NULL, 6000, 8000, 25, 4.6, true, true),
  ('c0000002-0000-0000-0000-000000000044', 'Restaurante Carepa', 'comida', 'Comida casera Carepa', '🍲', 'Carepa', NULL, 6000, 14000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000045', 'Tienda Carepa', 'mercado', 'Mercado Carepa', '🏪', 'Carepa', NULL, 6000, 12000, 25, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000046', 'Comida Chigorodó', 'comida', 'Platos del día', '🍽️', 'Chigorodó', NULL, 6000, 13000, 30, 4.5, true, true),
  ('c0000002-0000-0000-0000-000000000047', 'Mercado Chigorodó', 'mercado', 'Abarrotes', '🛒', 'Chigorodó', NULL, 6000, 12000, 25, 4.3, true, true),
  ('c0000002-0000-0000-0000-000000000048', 'Necoclí Express', 'comida', 'Comida rápida costa', '🦐', 'Necoclí', NULL, 7000, 15000, 35, 4.4, true, true),
  ('c0000002-0000-0000-0000-000000000049', 'Urabapp Envíos', 'envios', 'Hub logístico intermunicipal', '📦', 'Apartadó', 'Centro', 15000, 15000, 240, 5.0, true, true),
  ('c0000002-0000-0000-0000-000000000050', 'Mensajería Rápida Urabá', 'mandados', 'Mandados urgentes', '🛵', 'Apartadó', 'Centro', 5000, 8000, 20, 4.8, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (business_id, name, description, emoji, price, category)
SELECT b.id, 'Producto destacado', 'Disponible en Urabapp Fase 2', '⭐', GREATEST(b.min_order, 8000), 'General'
FROM public.businesses b
WHERE b.id::text LIKE 'c0000002%'
  AND NOT EXISTS (SELECT 1 FROM public.products p WHERE p.business_id = b.id);
