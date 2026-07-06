-- Promover brayandel001@gmail.com a ADMIN después del primer login
-- Ejecutar en SQL Editor una vez que el usuario haya entrado al menos una vez

UPDATE public.users
SET role = 'ADMIN', full_name = 'Brayan Admin'
WHERE email = 'brayandel001@gmail.com';

-- Si el perfil aún no existe (usuario recién creado), usar:
-- UPDATE public.users SET role = 'ADMIN'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'brayandel001@gmail.com');
