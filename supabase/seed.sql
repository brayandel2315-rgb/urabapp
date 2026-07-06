-- Seed inicial Urabapp — Apartadó
INSERT INTO public.categories (id, name, emoji, sort_order) VALUES
  ('comida', 'Comida', '🍔', 1),
  ('farmacia', 'Farmacia', '💊', 2),
  ('mercado', 'Mercado', '🛒', 3),
  ('mandados', 'Mandados', '📦', 4),
  ('mascotas', 'Mascotas', '🐾', 5),
  ('tecnologia', 'Tecnología', '📱', 6),
  ('licoreria', 'Licorería', '🍺', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.banners (title, subtitle, municipio, sort_order) VALUES
  ('Envío gratis hoy', 'En pedidos mayores a $25.000', 'Apartadó', 1),
  ('Conexión local', 'Pide de tus tiendas favoritas', 'Apartadó', 2);

-- Negocios (IDs fijos para referencia en productos)
INSERT INTO public.businesses (id, name, category, description, emoji, municipio, delivery_fee, min_order, delivery_time, rating) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Restaurante El Bananero', 'comida', 'Comida típica urabaense', '🍌', 'Apartadó', 3000, 15000, 25, 4.8),
  ('a0000001-0000-0000-0000-000000000002', 'Mecato La Esquina', 'comida', 'Snacks y comida rápida', '🍟', 'Apartadó', 2500, 10000, 15, 4.5),
  ('a0000001-0000-0000-0000-000000000003', 'Farmacia San Rafael', 'farmacia', 'Medicamentos y aseo', '💊', 'Apartadó', 2000, 8000, 20, 4.9),
  ('a0000001-0000-0000-0000-000000000004', 'Supermercado El Ahorro', 'mercado', 'Mercado del barrio', '🛒', 'Apartadó', 3500, 20000, 30, 4.6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (business_id, name, description, emoji, price, category) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Sancocho de pescado', 'Con plátano y yuca', '🍲', 18000, 'Platos'),
  ('a0000001-0000-0000-0000-000000000001', 'Patacón con hogao', 'Crujiente y casero', '🍌', 12000, 'Platos'),
  ('a0000001-0000-0000-0000-000000000001', 'Jugo natural', 'Mango o lulo', '🥤', 5000, 'Bebidas'),
  ('a0000001-0000-0000-0000-000000000002', 'Perro caliente', 'Con salsas', '🌭', 8000, 'Rápida'),
  ('a0000001-0000-0000-0000-000000000002', 'Salchipapas', 'Grande', '🍟', 12000, 'Rápida'),
  ('a0000001-0000-0000-0000-000000000003', 'Acetaminofén x10', '500mg', '💊', 6000, 'Medicamentos'),
  ('a0000001-0000-0000-0000-000000000004', 'Arroz 1kg', 'Diana o Flor', '🍚', 4500, 'Granos'),
  ('a0000001-0000-0000-0000-000000000004', 'Huevos x12', 'Frescos', '🥚', 9000, 'Lácteos');

INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order, is_active) VALUES
  ('URABA10', '10% en tu primer pedido', 'percent', 10, 15000, FALSE),
  ('ENVIOGRATIS', 'Envío gratis', 'fixed', 3000, 25000, FALSE)
ON CONFLICT (code) DO UPDATE SET is_active = EXCLUDED.is_active;
