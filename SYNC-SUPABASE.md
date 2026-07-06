# Sincronizar Urabapp con tu cuenta Supabase

**Cuenta:** brayandel001@gmail.com  
**Proyecto:** Urabapp

---

## Proyecto sincronizado

| Campo | Valor |
|-------|-------|
| **Nombre en Supabase** | admin@urabapp.com |
| **Project ref** | `ekqaocauvoajpjyraeyo` |
| **URL** | `https://ekqaocauvoajpjyraeyo.supabase.co` |
| **Cuenta dueña app** | brayandel001@gmail.com |
| **Estado BD** | 13 tablas · 4 tiendas · 8 productos |

`.env.local` ya está actualizado con las credenciales correctas.

---

## Opción A — Script automático (recomendado)

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
cd "c:\Users\braya\OneDrive\Desktop\Urabapp"
npm run sync:supabase
```

El script te guía paso a paso:

1. Login en Supabase con **brayandel001@gmail.com**
2. Lista tus proyectos y vincula **Urabapp**
3. Actualiza `.env.local` con URL y API key correctas
4. Sube las migraciones (`db push`)

---

## Opción B — Manual desde el Dashboard

### 1. Entrar a Supabase

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Inicia sesión con **brayandel001@gmail.com**
3. Abre el proyecto **Urabapp** (o créalo si no existe)

### 2. Copiar credenciales

En **Project Settings → API**:

| Campo | Variable en `.env.local` |
|-------|--------------------------|
| Project URL | `VITE_SUPABASE_URL` |
| Publishable key (`sb_publishable_...`) | `VITE_SUPABASE_ANON_KEY` |

Crea/edita `.env.local`:

```env
VITE_SUPABASE_URL=https://TU-PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_TU_KEY
VITE_OWNER_EMAIL=brayandel001@gmail.com
```

### 3. Configurar Auth

En **Authentication → URL Configuration**:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173`, `http://127.0.0.1:5173`

En **Authentication → Providers**:

- Activa **Email**
- Activa **Google** (usa brayandel001@gmail.com como cuenta de prueba)

### 4. Crear base de datos

En **SQL Editor**, ejecuta en orden:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/seed.sql`

### 5. Hacerte administrador

1. Entra a la app: `npm run dev` → `/login`
2. Inicia sesión con **brayandel001@gmail.com**
3. En SQL Editor ejecuta: `supabase/migrations/002_admin_brayan.sql`

### 6. Verificar conexión

```bash
npm run verify:supabase
```

Debe mostrar ✅ en REST API y tablas.

---

## Vincular CLI (opcional)

```bash
npx supabase login
npx supabase link --project-ref TU-PROJECT-REF
npx supabase db push
```

---

## Después de sincronizar

- Los pedidos se guardan en Supabase (no solo local)
- Tu cuenta será **ADMIN** con acceso a `/admin`
- Google login funcionará con tu Gmail
