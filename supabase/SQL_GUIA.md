# Guía SQL — Urabapp en Supabase

## Enlace directo

[SQL Editor — proyecto Urabapp](https://supabase.com/dashboard/project/ekqaocauvoajpjyraeyo/sql/new)

---

## Orden de ejecución

| Paso | Archivo | Cuándo |
|------|---------|--------|
| 1 | `RUN_PRODUCTION.sql` | Primera vez (o para actualizar BD) |
| 2 | Auth providers | Dashboard → Authentication → Providers |
| 3 | Login en la app | Google o email con `brayandel001@gmail.com` |
| 4 | `migrations/002_admin_brayan.sql` | Después del primer login |
| 5 | `VERIFY.sql` | Comprobar que todo quedó bien |

Regenerar `RUN_PRODUCTION.sql` si cambias migraciones:

```bash
node scripts/build-production-sql.mjs
```

---

## Paso 1 — Ejecutar RUN_PRODUCTION.sql

1. Abre el SQL Editor (enlace arriba).
2. **New query**.
3. Abre `supabase/RUN_PRODUCTION.sql` en tu editor local, copia **todo** el contenido.
4. Pega en Supabase y pulsa **Run**.
5. Debe terminar sin errores rojos. Si ves *"policy already exists"*, regenera el archivo con el script de arriba.

Incluye: esquema, seed, políticas RLS, onboarding, realtime, timestamps y 20 comercios.

**No incluye** `002` (admin) porque necesitas existir en `public.users` primero.

---

## Paso 2 — Activar autenticación

En **Authentication → Providers**:

- **Email** — activado
- **Google** — activado (configura OAuth si aún no)
- **Anonymous** — activado (checkout invitado)

En **Authentication → URL Configuration**, agrega tu URL local y Vercel:

- `http://localhost:5173/**`
- `https://urabapp.vercel.app/**`

---

## Paso 3 — Primer login

```bash
npm run dev
```

Entra con Google o email (`brayandel001@gmail.com`). Eso crea tu fila en `public.users` vía el trigger `handle_new_user`.

---

## Paso 4 — Hacerte ADMIN

En SQL Editor, ejecuta `supabase/migrations/002_admin_brayan.sql`:

```sql
UPDATE public.users
SET role = 'ADMIN', full_name = 'Brayan Admin'
WHERE email = 'brayandel001@gmail.com';
```

Si devuelve `0 rows`, el perfil aún no existe — repite el login y vuelve a ejecutar.

---

## Paso 5 — Verificar

**En Supabase:** ejecuta `supabase/VERIFY.sql`. Debes ver ~20 comercios y `realtime_orders = true`.

**En local:**

```bash
npm run verify:supabase
```

---

## Errores comunes

| Error | Solución |
|-------|----------|
| `relation "public.users" does not exist` | No corriste `RUN_PRODUCTION.sql` completo |
| `policy "users_read_own" already exists` | Regenera con `node scripts/build-production-sql.mjs` |
| `002` actualiza 0 filas | Inicia sesión en la app primero |
| `permission denied for table orders` | Falta `002` o RLS; revisa que seas ADMIN |
| Realtime no actualiza pedidos | Re-ejecuta la sección 008 o `VERIFY.sql` |

---

## Ejecutar migraciones una por una (alternativa)

Si prefieres ir paso a paso en lugar del archivo único:

1. `001_initial_schema.sql`
2. `seed.sql`
3. `004_operational.sql` (salta `003`, está duplicado)
4. `005` → `006` → `007` → `008` → `009` → `010`
5. Login → `002_admin_brayan.sql`
