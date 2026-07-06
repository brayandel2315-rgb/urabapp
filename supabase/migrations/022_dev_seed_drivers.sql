-- Mensajeros demo para desarrollo / auto-asignación (sin user_id — solo operación)

INSERT INTO public.drivers (id, name, phone, municipio, vehicle, plate, latitude, longitude, is_online, is_verified, rating, total_deliveries)
VALUES
  ('d1000001-0000-4000-8000-000000000001', 'Carlos R.', '3001111001', 'Apartadó', 'moto', 'ABC-01', 7.885100, -75.755000, true, true, 4.90, 12),
  ('d1000002-0000-4000-8000-000000000002', 'María G.', '3001111002', 'Apartadó', 'moto', 'ABC-02', 7.881200, -75.748500, true, true, 4.85, 8),
  ('d1000003-0000-4000-8000-000000000003', 'Juan P.', '3001111003', 'Turbo', 'moto', 'TUR-01', 8.092600, -76.728400, true, true, 4.95, 15),
  ('d1000004-0000-4000-8000-000000000004', 'Laura M.', '3001111004', 'Carepa', 'moto', 'CAR-01', 7.906300, -76.652400, false, true, 4.80, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  municipio = EXCLUDED.municipio,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  is_online = EXCLUDED.is_online,
  is_verified = EXCLUDED.is_verified;
