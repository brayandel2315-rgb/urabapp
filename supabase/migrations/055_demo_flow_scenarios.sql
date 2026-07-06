-- Escenarios demo: 1 cliente, 1 comercio, 1 mensajero con pedidos de prueba
-- Requiere cuentas auth: test.cliente@, test.tienda@, test.mensajero@urabapp.com

DO $$
DECLARE
  v_client UUID;
  v_business_user UUID;
  v_rider_user UUID;
  v_driver UUID;
  v_business UUID := 'a0000001-0000-0000-0000-000000000001';
  v_order_delivered UUID;
  v_order_active UUID;
  v_product_ok UUID;
  v_product_out UUID;
BEGIN
  SELECT id INTO v_client FROM auth.users WHERE email = 'test.cliente@urabapp.com';
  SELECT id INTO v_business_user FROM auth.users WHERE email = 'test.tienda@urabapp.com';
  SELECT id INTO v_rider_user FROM auth.users WHERE email = 'test.mensajero@urabapp.com';

  IF v_client IS NULL OR v_business_user IS NULL OR v_rider_user IS NULL THEN
    RAISE NOTICE 'Demo users missing — create test.cliente/tienda/mensajero@urabapp.com in Supabase Auth first';
    RETURN;
  END IF;

  INSERT INTO public.users (id, email, full_name, phone, role, document_number)
  VALUES
    (v_client, 'test.cliente@urabapp.com', 'Cliente Demo Urabapp', '3001110001', 'CLIENT', '1098765432'),
    (v_business_user, 'test.tienda@urabapp.com', 'Comercio Demo Urabapp', '3002220002', 'BUSINESS', NULL),
    (v_rider_user, 'test.mensajero@urabapp.com', 'Mensajero Demo Urabapp', '3003330003', 'RIDER', NULL)
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    document_number = COALESCE(public.users.document_number, EXCLUDED.document_number);

  UPDATE public.businesses
  SET owner_id = v_business_user,
      verification_status = 'approved',
      is_active = TRUE,
      is_published = TRUE
  WHERE id = v_business;

  INSERT INTO public.drivers (user_id, name, phone, municipio, vehicle, plate, is_online, is_verified, verification_status)
  VALUES (v_rider_user, 'Mensajero Demo Urabapp', '3003330003', 'Apartadó', 'moto', 'DEMO-01', TRUE, TRUE, 'approved')
  ON CONFLICT (user_id) DO UPDATE SET
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    is_verified = TRUE,
    verification_status = 'approved',
    is_online = TRUE
  RETURNING id INTO v_driver;

  IF v_driver IS NULL THEN
    SELECT id INTO v_driver FROM public.drivers WHERE user_id = v_rider_user;
  END IF;

  SELECT id INTO v_product_ok FROM public.products
  WHERE business_id = v_business AND name ILIKE '%Sancocho%' LIMIT 1;
  SELECT id INTO v_product_out FROM public.products
  WHERE business_id = v_business AND name ILIKE '%Patacón%' LIMIT 1;

  IF v_product_ok IS NULL THEN
    SELECT id INTO v_product_ok FROM public.products WHERE business_id = v_business LIMIT 1;
  END IF;
  IF v_product_out IS NULL OR v_product_out = v_product_ok THEN
    SELECT id INTO v_product_out FROM public.products
    WHERE business_id = v_business AND id <> COALESCE(v_product_ok, '00000000-0000-0000-0000-000000000000'::uuid)
    LIMIT 1;
  END IF;

  DELETE FROM public.order_items
  WHERE order_id IN (SELECT id FROM public.orders WHERE order_number LIKE 'URA-DEMO-%');
  DELETE FROM public.orders WHERE order_number LIKE 'URA-DEMO-%';

  -- Pedido entregado: ítem agotado parcialmente
  INSERT INTO public.orders (
    order_number, customer_id, business_id, driver_id, status,
    dest_municipio, dest_address, subtotal, delivery_fee, total,
    payment_method, payment_status, notes, delivered_at, created_at
  ) VALUES (
    'URA-DEMO-001', v_client, v_business, v_driver, 'delivered',
    'Apartadó', 'Calle 100 #45-20, Barrio El Progreso',
    30000, 3000, 30000,
    'cash', 'paid',
    'Comercio reportó agotado: Patacón con hogao. Se entregó el resto del pedido.',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  )
  RETURNING id INTO v_order_delivered;

  IF v_product_ok IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status, notes)
    VALUES (v_order_delivered, v_product_ok, 'Sancocho de pescado', '🍲', 1, 18000, 18000, 'confirmed', NULL);
  END IF;
  IF v_product_out IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status, notes)
    VALUES (v_order_delivered, v_product_out, 'Patacón con hogao', '🍌', 1, 12000, 12000, 'unavailable', 'Agotado al preparar — no se cobró');
  END IF;

  -- Pedido activo: mensajero con demora en recogida
  INSERT INTO public.orders (
    order_number, customer_id, business_id, driver_id, status,
    dest_municipio, dest_address, subtotal, delivery_fee, total,
    payment_method, payment_status, notes, accepted_at, created_at
  ) VALUES (
    'URA-DEMO-002', v_client, v_business, v_driver, 'on_the_way',
    'Apartadó', 'Carrera 98 #50-10, Barrio La Esperanza',
    23000, 3000, 26000,
    'cash', 'pending',
    'Mensajero reportó demora en recogida: comercio confirmó preparación tardía. Cliente avisado.',
    NOW() - INTERVAL '35 minutes',
    NOW() - INTERVAL '45 minutes'
  )
  RETURNING id INTO v_order_active;

  IF v_product_ok IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status)
    VALUES (v_order_active, v_product_ok, 'Sancocho de pescado', '🍲', 1, 18000, 18000, 'confirmed');
  END IF;
  IF v_product_out IS NOT NULL THEN
    INSERT INTO public.order_items (order_id, product_id, name, emoji, quantity, unit_price, total_price, fulfillment_status)
    VALUES (v_order_active, v_product_out, 'Jugo natural', '🥤', 1, 5000, 5000, 'confirmed');
  END IF;

  RAISE NOTICE 'Demo flow seeded: URA-DEMO-001 (delivered+agotado), URA-DEMO-002 (on_the_way+recogida)';
END $$;
