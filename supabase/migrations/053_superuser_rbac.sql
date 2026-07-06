-- UrabApp — Superusuario (ADMIN) y aislamiento de perfil por usuario
-- · Rol solo desde app_metadata (no user_metadata, editable por el usuario)
-- · Trigger impide escalación de privilegios vía UPDATE directo
-- · Admin conserva lectura/escritura global vía is_admin()

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role TEXT;
  owner_email CONSTANT TEXT := 'brayandel001@gmail.com';
BEGIN
  assigned_role := CASE
    WHEN lower(trim(COALESCE(NEW.email, ''))) = lower(trim(owner_email)) THEN 'ADMIN'
    WHEN COALESCE(NEW.raw_app_meta_data->>'role', '') IN ('ADMIN', 'BUSINESS', 'RIDER', 'CLIENT')
      THEN NEW.raw_app_meta_data->>'role'
    ELSE 'CLIENT'
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
      WHEN lower(trim(COALESCE(EXCLUDED.email, public.users.email))) = lower(trim(owner_email)) THEN 'ADMIN'
      WHEN public.is_admin() THEN EXCLUDED.role
      ELSE public.users.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.guard_users_privileged_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  NEW.role := OLD.role;
  NEW.account_status := OLD.account_status;
  NEW.email := OLD.email;
  NEW.welcome_delivery_used_at := OLD.welcome_delivery_used_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_guard_users_privileged_columns ON public.users;
CREATE TRIGGER trg_guard_users_privileged_columns
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_users_privileged_columns();

-- Owner de plataforma siempre ADMIN
UPDATE public.users
SET role = 'ADMIN', full_name = COALESCE(NULLIF(full_name, ''), 'Brayan Admin')
WHERE lower(trim(email)) = lower(trim('brayandel001@gmail.com'));
