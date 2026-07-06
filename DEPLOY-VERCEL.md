# Desplegar Urabapp en Vercel

**Producción:** https://urabapp.vercel.app

## Requisitos

- Cuenta en [Vercel](https://vercel.com)
- Proyecto Supabase `ekqaocauvoajpjyraeyo` configurado
- Variables de entorno (mismas que `.env.local`)

---

## Opción A — Un comando (recomendado)

```powershell
cd "D:\AREA DE TRABAJO\Urabapp"
npm run deploy:vercel
```

Esto:
1. Verifica Supabase (`verify:supabase`)
2. Sube variables `VITE_*` de `.env.local` a Vercel
3. Hace build y deploy a producción

---

## Opción B — Conectar repositorio Git

1. Sube el proyecto a GitHub
2. En Vercel: **Add New → Project → Import Git Repository**
3. Vercel detecta Vite automáticamente (`vercel.json` incluido)
4. En **Settings → Environment Variables**, agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://ekqaocauvoajpjyraeyo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | tu publishable key (`sb_publishable_...`) |
| `VITE_OWNER_EMAIL` | `brayandel001@gmail.com` |
| `VITE_WHATSAPP_NUMBER` | `57XXXXXXXXXX` |
| `VITE_APP_URL` | `https://tu-proyecto.vercel.app` |
| `VITE_AUTO_WHATSAPP_NOTIFY` | `false` |

5. **Deploy**

Cada push a `main` redeploya automáticamente.

---

## Opción C — Vercel CLI manual

```powershell
cd "D:\AREA DE TRABAJO\Urabapp"
npx vercel login
npx vercel link
powershell -ExecutionPolicy Bypass -File scripts/set-vercel-env.ps1
npm run build
npx vercel deploy --prod --yes
```

---

## Sincronizar Supabase con Vercel (obligatorio para auth)

Cuando tengas la URL de Vercel (ej: `https://urabapp.vercel.app`):

```powershell
npm run sync:vercel -- -VercelUrl "https://tu-proyecto.vercel.app"
```

### 1. URL Configuration

[Supabase → Auth → URL Configuration](https://supabase.com/dashboard/project/ekqaocauvoajpjyraeyo/auth/url-configuration)

| Campo | Valor |
|-------|-------|
| **Site URL** | `https://TU-SITIO.vercel.app` |
| **Redirect URLs** | `https://TU-SITIO.vercel.app/**` |
| (mantener local) | `http://localhost:5173/**` |

### 2. Edge Functions (secrets)

En Supabase → Edge Functions → Secrets:

```
APP_URL=https://TU-SITIO.vercel.app
```

### 3. Google OAuth (si lo usas)

En Google Cloud Console, el callback de Supabase no cambia:

```
https://ekqaocauvoajpjyraeyo.supabase.co/auth/v1/callback
```

### 4. Verificar

1. Abre `https://TU-SITIO.vercel.app/login`
2. Entra con email o Google
3. Debe redirigir a `/perfil` sin error

---

## Scripts npm

```bash
npm run deploy:vercel          # Deploy completo a producción
npm run deploy:vercel:preview  # Preview (sin --prod)
npm run sync:vercel            # Guía Supabase + variables
```

---

## Dominio personalizado (opcional)

Vercel → **Settings → Domains** → ej: `urabapp.com`

Actualiza `VITE_APP_URL` y Supabase Auth con el dominio final.

---

## Ventajas vs Netlify (plan gratuito)

| Recurso | Vercel Hobby | Netlify Free |
|---------|--------------|--------------|
| Bandwidth | 100 GB/mes | 100 GB/mes |
| Builds | 6000 min/mes | 300 min/mes |
| Serverless | 100 GB-hrs | Limitado |
| Proyectos | Ilimitados | 1 sitio activo* |

*Netlify pausa sitios tras inactividad en plan gratuito.

---

## Keep-alive Supabase

Los proyectos Supabase gratuitos se pausan por inactividad. Ver `DEPLOY-NETLIFY.md` sección keep-alive (mismos scripts aplican).
