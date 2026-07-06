# Integraciones Urabapp

Stack de mapas y tiempo real:

| Capa | Tecnología |
|------|------------|
| Mapas | MapLibre GL |
| Datos | OpenStreetMap (tiles + Nominatim) |
| Rutas / ETA | OpenRouteService (Edge Function) |
| Tiempo real | Socket.IO (+ fallback Supabase Realtime) |
| Backend | Supabase |
| Hosting | Vercel |

## 1. MapLibre + OpenStreetMap

**Estado:** siempre activo (sin token).

| Componente | Uso |
|------------|-----|
| `map.service.js` | Geocoding Nominatim, rutas vía ORS |
| `lib/maplibre.js` | Estilo raster OSM + loader MapLibre |
| `AddressMapPicker` | Pin de entrega en checkout |
| `OrderTrackingMap` | Marcadores + ruta ORS |
| `StaticMapFallback` | Iframe OSM si no hay WebGL |

No requiere variables de entorno en el cliente.

---

## 2. OpenRouteService — rutas y ETA

**Edge Function:** `openroute-directions` (API key solo en servidor).

```bash
supabase secrets set ORS_API_KEY=tu_clave
supabase functions deploy openroute-directions
```

Sin `ORS_API_KEY`: el mapa dibuja una línea recta entre mensajero y destino.

Opcional en cliente:
```env
VITE_ORS_ENABLED=false   # desactiva llamadas a ORS
```

---

## 3. Socket.IO — tracking en tiempo real

| Componente | Uso |
|------------|-----|
| `server/socket-server.mjs` | Servidor WS (puerto 3001) |
| `socket.service.js` | Cliente Socket.IO |
| `useRiderLocationShare` | Emite GPS cada 15 s |
| `useDriverLocationRealtime` | Socket primario; fallback Supabase Realtime |

**Local:**
```bash
npm run dev:socket   # terminal 1
npm run dev          # terminal 2 — proxy /socket.io → :3001
```

**Producción:** Vercel no soporta WebSockets persistentes. Despliega `server/socket-server.mjs` en Railway, Fly.io o Render y configura:

```env
VITE_SOCKET_URL=https://tu-socket.ejemplo.com
SOCKET_CORS_ORIGINS=https://tu-app.vercel.app
```

Sin `VITE_SOCKET_URL`: tracking usa Supabase Realtime en tabla `drivers`.

---

## 4. Push completo (VAPID + Edge Function)

**Flujo:** cambio de estado → `notifications` + `send-push` Edge Function → `push-sw.js` en el SW.

| Evento | Destinatario |
|--------|--------------|
| Pedido creado | Cliente |
| Cambio de estado | Cliente |
| Auto-asignación | Mensajero (push + in-app) |

**Cliente:**
```env
VITE_VAPID_PUBLIC_KEY=BNxxx
```

**Supabase secrets + deploy:**
```bash
npx web-push generate-vapid-keys
supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... VAPID_SUBJECT=mailto:tu@email.com
supabase functions deploy send-push
```

Usuario activa en **Perfil → Notificaciones push**.

---

## 5. WhatsApp Business API

**Manual (siempre):** links `wa.me` vía `VITE_WHATSAPP_NUMBER`.

**Automático (opcional):** Edge Function `send-whatsapp` con Meta Cloud API.

```env
VITE_WHATSAPP_API_ENABLED=true
```

**Supabase secrets:**
```
WHATSAPP_API_TOKEN=EAAxxx
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_USE_TEMPLATES=true
WHATSAPP_TEMPLATE_LANG=es
```

```bash
supabase functions deploy send-whatsapp
```

---

## 6. App nativa (React Native)

**Hoy:** PWA con `vite-plugin-pwa`, banner `InstallBanner`, push vía service worker.

**Roadmap Expo (fase 2):**
- Monorepo: `apps/mobile` (Expo) + `packages/shared` (services, constants)
- Reutilizar `order.service`, `map.service`, Supabase auth
- Push: FCM en nativo; mantener VAPID para web

---

## 7. Motor de asignación de mensajeros

**SQL:** migración `020_platform_integrations.sql`
- RPC `assign_best_rider(order_id)` — mensajero en línea más cercano al destino
- Trigger auto en pedidos `cash` al insertar

**Edge Function:** `auto-assign-rider`

**Cliente:** `assignment.service.js` → `requestAutoAssignRider(orderId)`

**Admin:** pestaña **integraciones** + botón **Auto-asignar** en pedidos sin mensajero.

---

## Panel admin

`/admin` → pestaña **integraciones** — estado de cada integración, variables y pasos.

---

## Deploy

**Frontend (Vercel):**
```bash
npm run build
# vercel.json incluido para SPA routing
```

**Edge Functions:**
```bash
npm run deploy:functions
```

Funciones:
- `openroute-directions`
- `send-push`
- `send-whatsapp`
- `auto-assign-rider`
- `create-wompi-checkout`
- `wompi-webhook` (--no-verify-jwt)

**Webhook Wompi:**
```
https://ekqaocauvoajpjyraeyo.supabase.co/functions/v1/wompi-webhook
```

Plantilla de secrets: `supabase/functions/.env.secrets.example` → `.env.secrets` → `npm run setup:secrets`

Verificar con `npm run verify:integrations`.
