-- 20 comercios Apartadó — Fase 1 operación
-- Ejecutar después de 001-009. Productos opcionales por comercio.

INSERT INTO public.businesses (id, name, category, description, emoji, municipio, zone, delivery_fee, min_order, delivery_time, rating, is_open, is_active) VALUES
  ('b0000001-0000-0000-0000-000000000005', 'Asados El Prado', 'comida', 'Carnes y parrilla', '🥩', 'Apartadó', 'Centro', 5000, 18000, 30, 4.7, true, true),
  ('b0000001-0000-0000-0000-000000000006', 'Pizza Roma', 'comida', 'Pizzas y pastas', '🍕', 'Apartadó', 'Centro', 5000, 20000, 35, 4.6, true, true),
  ('b0000001-0000-0000-0000-000000000007', 'Café La Parada', 'comida', 'Café y panadería', '☕', 'Apartadó', 'Ortiz', 5000, 12000, 20, 4.8, true, true),
  ('b0000001-0000-0000-0000-000000000008', 'Pollería El Corral', 'comida', 'Pollo broaster', '🍗', 'Apartadó', 'Ortiz', 5000, 15000, 25, 4.5, true, true),
  ('b0000001-0000-0000-0000-000000000009', 'Sushi Wok', 'comida', 'Sushi y wok', '🍣', 'Apartadó', 'Laureles', 5000, 25000, 40, 4.4, true, true),
  ('b0000001-0000-0000-0000-000000000010', 'Heladería Polar', 'comida', 'Helados y postres', '🍦', 'Apartadó', 'Laureles', 5000, 10000, 15, 4.9, true, true),
  ('b0000001-0000-0000-0000-000000000011', 'Droguería El Ahorro', 'farmacia', 'Medicamentos', '💊', 'Apartadó', 'Vélez', 5000, 8000, 20, 4.7, true, true),
  ('b0000001-0000-0000-0000-000000000012', 'Tienda Don Pedro', 'mercado', 'Abarrotes del barrio', '🏪', 'Apartadó', 'Vélez', 5000, 15000, 25, 4.5, true, true),
  ('b0000001-0000-0000-0000-000000000013', 'Panadería San José', 'mercado', 'Pan fresco diario', '🥖', 'Apartadó', 'Centro', 5000, 10000, 20, 4.8, true, true),
  ('b0000001-0000-0000-0000-000000000014', 'Frutas El Campo', 'mercado', 'Frutas y verduras', '🍎', 'Apartadó', 'Ortiz', 5000, 12000, 25, 4.6, true, true),
  ('b0000001-0000-0000-0000-000000000015', 'Papelería Estudiantil', 'tiendas', 'Útiles y copias', '📚', 'Apartadó', 'Centro', 5000, 10000, 20, 4.5, true, true),
  ('b0000001-0000-0000-0000-000000000016', 'TecnoUrabá', 'tecnologia', 'Accesorios celular', '📱', 'Apartadó', 'Laureles', 5000, 20000, 30, 4.4, true, true),
  ('b0000001-0000-0000-0000-000000000017', 'Mascotas Felices', 'mascotas', 'Alimento y accesorios', '🐾', 'Apartadó', 'Vélez', 5000, 15000, 25, 4.7, true, true),
  ('b0000001-0000-0000-0000-000000000018', 'Licores Centro', 'licoreria', 'Cerveza y licores', '🍺', 'Apartadó', 'Centro', 5000, 25000, 20, 4.3, true, true),
  ('b0000001-0000-0000-0000-000000000019', 'Arepas Doña Rosa', 'comida', 'Arepas y huevos', '🫓', 'Apartadó', 'Ortiz', 5000, 10000, 15, 4.9, true, true),
  ('b0000001-0000-0000-0000-000000000020', 'Cevichería El Mar', 'comida', 'Ceviches y cocteles', '🦐', 'Apartadó', 'Laureles', 5000, 22000, 35, 4.6, true, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (business_id, name, description, emoji, price, category) VALUES
  ('b0000001-0000-0000-0000-000000000005', 'Picada familiar', 'Para 4 personas', '🥩', 45000, 'Platos'),
  ('b0000001-0000-0000-0000-000000000006', 'Pizza hawaiana', 'Mediana', '🍕', 28000, 'Pizzas'),
  ('b0000001-0000-0000-0000-000000000007', 'Café con leche + pandebono', 'Desayuno', '☕', 8000, 'Desayunos'),
  ('b0000001-0000-0000-0000-000000000008', 'Combo broaster', 'Con papas y gaseosa', '🍗', 22000, 'Combos'),
  ('b0000001-0000-0000-0000-000000000019', 'Arepa de huevo', 'Doble', '🫓', 7000, 'Arepas'),
  ('b0000001-0000-0000-0000-000000000020', 'Ceviche mixto', 'Porción grande', '🦐', 28000, 'Ceviches');
