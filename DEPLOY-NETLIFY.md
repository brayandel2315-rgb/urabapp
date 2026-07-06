# Desplegar Urabapp en Netlify

> **Deprecado.** Producción canónica: **https://urabapp.vercel.app** — ver `DEPLOY-VERCEL.md`.

**Producción (legacy):** https://urabapp-uraba.netlify.app

## Requisitos

- Cuenta en [Netlify](https://app.netlify.com)
- Proyecto Supabase `ekqaocauvoajpjyraeyo` configurado
- Variables de entorno (mismas que `.env.local`)

---

## Opción A — Conectar repositorio Git (recomendado)

1. Sube el proyecto a GitHub/GitLab/Bitbucket
2. En Netlify: **Add new site → Import an existing project**
3. Elige el repo **Urabapp**
4. Netlify detecta `netlify.toml` automáticamente:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. En **Site configuration → Environment variables**, agrega:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://ekqaocauvoajpjyraeyo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | tu publishable key (`sb_publishable_...`) |
| `VITE_OWNER_EMAIL` | `brayandel001@gmail.com` |

6. **Deploy site**

Cada push a `main` redeploya automáticamente.

---

## Opción B — Netlify CLI (sin Git)

```powershell
cd "c:\Users\braya\OneDrive\Desktop\Urabapp"
npm run build
npx netlify login
npx netlify init
npx netlify deploy --prod --dir=dist
```

En `netlify init` elige **Create & configure a new project** y nombre `urabapp`.

Luego configura las variables de entorno:

```powershell
npx netlify env:set VITE_SUPABASE_URL "https://ekqaocauvoajpjyraeyo.supabase.co"
npx netlify env:set VITE_SUPABASE_ANON_KEY "sb_publishable_TU_KEY"
npx netlify env:set VITE_OWNER_EMAIL "brayandel001@gmail.com"
```

Vuelve a desplegar después de setear env vars:

```powershell
npm run build
npx netlify deploy --prod --dir=dist
```

---

## Opción C — Arrastrar carpeta `dist`

1. `npm run build`
2. En Netlify: **Sites → Add new site → Deploy manually**
3. Arrastra la carpeta `dist`

> Las variables `VITE_*` deben estar en Netlify **antes** del build. Con drag-and-drop el build es local, así que corre `npm run build` con `.env.local` presente.

---

## Sincronizar Supabase con Netlify (obligatorio para auth)

Cuando tengas la URL de Netlify (ej: `https://urabapp.netlify.app`):

### 1. URL Configuration

[Supabase → Auth → URL Configuration](https://supabase.com/dashboard/project/ekqaocauvoajpjyraeyo/auth/url-configuration)

| Campo | Valor |
|-------|-------|
| **Site URL** | `https://TU-SITIO.netlify.app` |
| **Redirect URLs** | `https://TU-SITIO.netlify.app/**` |
| (mantener local) | `http://localhost:5173/**` |

### 2. Google OAuth (si lo usas)

En Google Cloud Console, agrega a **URIs de redireccionamiento autorizados**:

```
https://ekqaocauvoajpjyraeyo.supabase.co/auth/v1/callback
```

(No cambia — Supabase maneja el callback.)

### 3. Verificar

1. Abre `https://TU-SITIO.netlify.app/login`
2. Entra con email o Google
3. Debe redirigir a `/perfil` sin error

---

## Scripts npm

```bash
npm run build          # Build producción
npm run deploy:netlify # Build + deploy a Netlify (requiere CLI + login)

## Keep-alive Supabase (evitar pausa en plan gratuito)

Los proyectos Supabase gratuitos se **pausan por inactividad**. Urabapp incluye scripts que hacen ping periódico a la BD.

### Opción A — Tarea programada Windows (recomendada en tu PC)

```powershell
powershell -ExecutionPolicy Bypass -File scripts/keep-supabase-alive.ps1 -InstallTask -IntervalMinutes 20
```

Desinstalar: `scripts/keep-supabase-alive.ps1 -UninstallTask`

### Opción B — Bucle en primer plano

```powershell
npm run keep-alive:supabase:loop
# o una sola vez:
npm run keep-alive:supabase
```

### Opción C — GitHub Actions (24/7 sin depender del PC)

Sube el repo a GitHub y configura secrets:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

El workflow `.github/workflows/keep-supabase-alive.yml` hace ping cada 6 horas.

**Nota:** La solución definitiva es el plan **Pro** de Supabase (no se pausa). Los pings reducen el riesgo en plan gratuito.
```

---

## Dominio personalizado (opcional)

Netlify → **Domain management → Add custom domain** → ej: `urabapp.com`

Luego actualiza en Supabase las Redirect URLs con el dominio final.
