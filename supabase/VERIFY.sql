-- Urabapp — Verificación post-migración (001–025)
-- Ejecutar en SQL Editor después de RUN_PRODUCTION.sql + 002_admin_brayan.sql

-- 1. Tablas principales (esperado: 18+)
SELECT 'tablas_core' AS check_type, COUNT(*) AS total
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'users', 'businesses', 'products', 'orders', 'order_items', 'drivers',
    'categories', 'banners', 'coupons', 'notifications', 'reviews',
    'support_tickets', 'support_messages', 'order_messages',
    'abandoned_carts', 'push_subscriptions', 'payments', 'analytics_events'
  );

-- 2. Comercios activos (meta Fase 2: 50)
SELECT 'comercios_activos' AS check_type, COUNT(*) AS total
FROM public.businesses WHERE is_active = true;

-- 3. Mensajeros demo / registrados
SELECT 'mensajeros' AS check_type, COUNT(*) AS total,
  COUNT(*) FILTER (WHERE is_online) AS online
FROM public.drivers;

-- 4. Realtime publicado
SELECT 'realtime' AS check_type, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- 5. Funciones operativas
SELECT 'funciones' AS check_type, p.proname
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('is_admin', 'assign_best_rider', 'can_access_order_chat', 'handle_new_user');

-- 6. Trigger auto-asignación cash
SELECT 'trigger_auto_assign' AS check_type, tgname
FROM pg_trigger
WHERE tgname = 'trg_auto_assign_rider_on_order';

-- 7. Cupones activos
SELECT 'cupones' AS check_type, COUNT(*) AS total
FROM public.coupons WHERE is_active = true;

-- 8. Tu rol admin (después de 002_admin_brayan.sql)
SELECT 'tu_usuario' AS check_type, email, role, full_name
FROM public.users
WHERE email = 'brayandel001@gmail.com';
