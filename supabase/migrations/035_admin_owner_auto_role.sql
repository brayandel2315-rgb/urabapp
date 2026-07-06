-- Auto-promover email owner a ADMIN al registrarse o actualizar auth

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
BEGIN
  assigned_role := CASE
    WHEN lower(trim(NEW.email)) = lower(trim('brayandel001@gmail.com')) THEN 'ADMIN'
    ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'CLIENT')
  END;

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
    assigned_role
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.users.email),
    phone = COALESCE(EXCLUDED.phone, public.users.phone),
    role = CASE
      WHEN lower(trim(EXCLUDED.email)) = lower(trim('brayandel001@gmail.com')) THEN 'ADMIN'
      ELSE public.users.role
    END,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Asegurar admin en producción si el usuario ya existe
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(full_name, ''), 'Brayan Admin')
WHERE lower(trim(email)) = lower(trim('brayandel001@gmail.com'));
