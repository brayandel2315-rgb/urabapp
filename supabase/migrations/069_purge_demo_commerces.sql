-- Elimina comercios seed/demo de producción.
-- Conserva comercios reales registrados por onboarding (p. ej. tienda lojo).

BEGIN;

CREATE TEMP TABLE tmp_demo_businesses ON COMMIT DROP AS
SELECT b.id
FROM public.businesses b
WHERE b.id::text ~ '^(a0000001|b0000001|c0000002)'
   OR lower(trim(b.name)) IN ('tienda prueba urabapp');

CREATE TEMP TABLE tmp_demo_users ON COMMIT DROP AS
SELECT u.id
FROM auth.users u
WHERE u.email IN (
  'test.cliente@urabapp.com',
  'test.tienda@urabapp.com',
  'test.mensajero@urabapp.com'
);

CREATE TEMP TABLE tmp_demo_drivers ON COMMIT DROP AS
SELECT d.id
FROM public.drivers d
WHERE d.id::text LIKE 'd1000001%'
   OR d.user_id IN (SELECT id FROM tmp_demo_users);

CREATE TEMP TABLE tmp_demo_orders ON COMMIT DROP AS
SELECT o.id
FROM public.orders o
WHERE o.order_number LIKE 'URA-DEMO-%'
   OR o.business_id IN (SELECT id FROM tmp_demo_businesses)
   OR o.customer_id IN (SELECT id FROM tmp_demo_users)
   OR o.driver_id IN (SELECT id FROM tmp_demo_drivers);

DELETE FROM public.payments
WHERE order_id IN (SELECT id FROM tmp_demo_orders);

DELETE FROM public.reviews
WHERE order_id IN (SELECT id FROM tmp_demo_orders)
   OR business_id IN (SELECT id FROM tmp_demo_businesses);

DELETE FROM public.orders
WHERE id IN (SELECT id FROM tmp_demo_orders);

DELETE FROM public.notifications
WHERE user_id IN (SELECT id FROM tmp_demo_users);

DELETE FROM public.businesses
WHERE id IN (SELECT id FROM tmp_demo_businesses);

DELETE FROM public.courier_offer_rejections
WHERE driver_id IN (SELECT id FROM tmp_demo_drivers);

DELETE FROM public.courier_offers
WHERE driver_id IN (SELECT id FROM tmp_demo_drivers);

DELETE FROM public.courier_tracking_events
WHERE order_id IN (
  SELECT o.id
  FROM public.orders o
  WHERE o.driver_id IN (SELECT id FROM tmp_demo_drivers)
);

DELETE FROM public.drivers
WHERE id IN (SELECT id FROM tmp_demo_drivers);

-- Solo quitar perfiles demo si ya no tienen comercio real activo
DELETE FROM public.users u
WHERE u.id IN (SELECT id FROM tmp_demo_users)
  AND NOT EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.owner_id = u.id
  );

COMMIT;
