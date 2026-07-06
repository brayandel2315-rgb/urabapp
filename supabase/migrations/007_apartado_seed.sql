-- Urabapp Fase 1: datos Apartadó + trigger usuarios anónimos

UPDATE public.businesses SET
  delivery_fee = 5000,
  zone = CASE id::text
    WHEN 'a0000001-0000-0000-0000-000000000001' THEN 'Centro'
    WHEN 'a0000001-0000-0000-0000-000000000002' THEN 'Ortiz'
    WHEN 'a0000001-0000-0000-0000-000000000003' THEN 'Laureles'
    WHEN 'a0000001-0000-0000-0000-000000000004' THEN 'Vélez'
    ELSE zone
  END,
  commission_pct = 12
WHERE municipio = 'Apartadó';

UPDATE public.banners SET
  title = 'Validación Fase 1',
  subtitle = 'Apartadó — pedidos reales, entrega local'
WHERE title = 'Envío gratis hoy';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      'Usuario'
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
