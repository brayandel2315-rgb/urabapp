# Urabapp — Guía de inicio rápido

## 1. Instalar y correr

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## 2. Sincronizar con tu cuenta (brayandel001@gmail.com)

**Estado:** Proyecto `ekqaocauvoajpjyraeyo` — migraciones 001–012 aplicadas, 20 comercios, admin configurado.

```bash
npm run verify:supabase
```

Guía local sin Netlify: **`LOCAL.md`**

**Auth en Supabase:** Email + Google + **Anonymous** activos. Redirect: `http://localhost:5173/**`

## 3. Rutas disponibles

| Ruta | Módulo |
|------|--------|
| `/` | Landing pública |
| `/explorar` | Home cliente (PWA) |
| `/tienda/:id` | Detalle tienda + menú |
| `/carrito` | Carrito |
| `/mandado` | Solicitar mensajería |
| `/pedidos` | Historial |
| `/pedidos/:id` | Seguimiento |
| `/perfil` | Perfil + acceso paneles |
| `/login` | Auth celular / Google / email |
| `/negocio` | Panel comercio |
| `/negocio/onboarding` | Comercio Express (10 min) |
| `/domiciliario` | Panel repartidor |
| `/domiciliario/registro` | Registro mensajero |
| `/admin` | Panel administrador |
| `/brandboard` | Identidad visual |
| `/informe` | Estado del proyecto |

## 4. Flujo de prueba

1. Home (`/explorar`) → elige tienda → agrega productos
2. Carrito → Pedir ahora → ingresa dirección → Confirmar
3. Ve a `/pedidos` para ver el pedido
4. En `/negocio` cambia estados del pedido
5. En `/domiciliario` actívate y completa entrega

## 5. PWA

En móvil, abre la URL y usa "Agregar a pantalla de inicio".

Build producción: `npm run build && npm run preview`

## 6. Deploy en Vercel

Guía completa: `DEPLOY-VERCEL.md` — URL canónica: **https://urabapp.vercel.app**

```bash
npm run deploy:production
```

Ejecuta migraciones en orden en Supabase SQL Editor (ver carpeta `supabase/migrations/`).

Después del deploy, sincroniza Supabase Auth:

```powershell
npm run sync:vercel -- -VercelUrl "https://urabapp.vercel.app"
```

## 7. Checklist producción (antes del deploy)

- [ ] Migraciones aplicadas en Supabase
- [ ] Auth: Google + Email + Phone + **Anonymous** activos
- [ ] Variables en Vercel: `VITE_SUPABASE_*`, `VITE_WHATSAPP_NUMBER`, `VITE_APP_URL=https://urabapp.vercel.app`
- [ ] Redirect URLs en Supabase: `https://urabapp.vercel.app/**` (+ localhost)
- [ ] Secret `APP_URL=https://urabapp.vercel.app` en Edge Functions (Supabase)
- [ ] `npm run build` sin errores
- [ ] Probar flujo: pedido guest → admin → mensajero → entregado

## 8. Migración Fase 1 (Supabase)

Ejecuta en SQL Editor, en orden: `001` → `006_onboarding.sql` + `seed.sql`

Variables recomendadas en `.env.local`:

```env
VITE_WHATSAPP_NUMBER=57XXXXXXXXXX
VITE_APP_URL=http://localhost:5173
VITE_AUTO_WHATSAPP_NOTIFY=false
```
