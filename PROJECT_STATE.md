# UrabApp — PROJECT STATE

**Auditoría LOOP 0** · Fecha: 28 jun 2026  
**Producción:** https://urabapp.vercel.app  
**Supabase:** `ekqaocauvoajpjyraeyo` · `https://ekqaocauvoajpjyraeyo.supabase.co`  
**Alcance:** Solo lectura — sin modificaciones de código.

---

## 1. Resumen ejecutivo

UrabApp es un **marketplace regional multi-vertical** (comida, farmacia, mercado, tiendas, mandados urbanos, envíos intermunicipales) con cuatro superficies operativas:

| Superficie | Ruta base | Madurez | Valor real hoy |
|------------|-----------|---------|----------------|
| Cliente | `/` | **Alta** | Descubrir → comprar → pagar (efectivo) → rastrear |
| Comercio | `/negocio` | **Media-alta** | Onboarding express, pedidos activos, catálogo, ofertas |
| Mensajero | `/domiciliario` | **Alta** | Onboarding 4 pasos, ofertas, OTP, wallet, envíos |
| Admin | `/admin` | **Alta** | CRM, pedidos, envíos, marketing, mensajeros, KPIs |

**Fortalezas:** flujo pedido end-to-end, módulo courier, envíos intermunicipales, discovery/home, panel admin amplio, PWA con banner de actualización.

**Brechas críticas vs producto completo:** UrabApp Pro, wallet/loyalty unificado, pagos digitales en producción, registro comercios con aprobación manual obligatoria, área Mi Cuenta modular, legal versionado, analytics producto, retiros mensajero, tests automatizados.

**Estimación global:** ~55–60% del MASTER BUILD LOOPS 0–26.

---

## 2. Stack técnico

| Capa | Tecnología |
|------|------------|
| Frontend | React 19 + Vite 8 |
| Routing | React Router 7 |
| Estado servidor | TanStack Query 5 |
| Estado cliente | Zustand 5 (persist) |
| Backend | Supabase (Postgres + Auth + Storage + Realtime + Edge Functions) |
| Mapas | MapLibre GL + OSM + ORS (opcional) |
| Tiempo real | Supabase Realtime + Socket.IO (opcional) |
| Pagos | Wompi (feature-flag) |
| Analytics | PostHog (env-gated) |
| PWA | vite-plugin-pwa + Workbox |
| Deploy | Vercel |
| Lint | ESLint 10 |

**Monorepo secundario (no productivo):** `apps/api` (NestJS) y `apps/web` (Next.js) — prototipos/experimentos; **la app productiva es `src/`**.

---

## 3. Inventario de rutas y pantallas

### Cliente (`ClientLayout`)

| Ruta | Página | Estado |
|------|--------|--------|
| `/` | `modules/home/HomePage.jsx` | ✅ Completo |
| `/restaurantes`, `/mercado`, `/farmacia`, `/mensajeria`, `/tiendas` | `VerticalDiscoveryPage` | ✅ Completo |
| `/search` | `SearchPage` | ✅ Completo |
| `/business/:id`, `/tienda/:id` | `BusinessPage` | ✅ Completo |
| `/carrito` | `CartPage` | ✅ Completo |
| `/checkout` | `CheckoutPage` | ✅ Parcial (Wompi flag) |
| `/pedidos`, `/pedidos/:id` | `OrdersPage`, `OrderDetailPage` | ✅ Completo |
| `/mandado` | `MandadoPage` | ✅ Completo |
| `/envios`, `/envios/:id` | `EnviosPage`, `ShipmentDetailPage` | ✅ Completo |
| `/perfil` | `ProfilePage` | ⚠️ Parcial (no es área Mi Cuenta completa) |
| `/soporte` | `SupportPage` | ✅ Básico |
| `/quienes-somos` | `QuienesSomosPage` | ✅ Completo |
| `/ofertas` | `OffersPage` | ✅ Completo |

### Auth y misc

| Ruta | Página | Estado |
|------|--------|--------|
| `/login` | `pages/Login.jsx` | ✅ Google/email/invitado |
| `/informe` | `pages/Informe.jsx` | ✅ Estado proyecto |
| `/brandboard` | Dev only | ✅ |
| `*` | `NotFound` | ✅ |

**Huérfana:** `pages/Landing.jsx` — no enrutada (home la reemplazó).

### Comercio (`/negocio`)

| Ruta | Estado |
|------|--------|
| `/negocio` | ✅ Dashboard (pedidos activos, productos, ofertas, tienda) |
| `/negocio/onboarding` | ✅ Multi-paso express |

### Mensajero (`/domiciliario`)

| Ruta | Estado |
|------|--------|
| `/domiciliario` | ✅ Operación + ofertas |
| `/domiciliario/registro` | ✅ Onboarding 4 pasos |
| `/domiciliario/ganancias` | ⚠️ Sin retiros bancarios |
| `/domiciliario/reputacion` | ✅ |
| `/domiciliario/cuenta` | ✅ |
| `/domiciliario/seguridad` | ✅ |
| `/domiciliario/entrega/:orderId` | ✅ Mapa + fases |

### Admin (`/admin`)

| Tab | Estado |
|-----|--------|
| Resumen / Launch checklist | ✅ |
| Soporte | ✅ |
| Integraciones | ✅ |
| Ejecutivo + charts | ✅ |
| CRM | ✅ |
| Marketing (banners, cupones) | ✅ |
| Categorías | ✅ |
| Envíos | ✅ |
| Pedidos | ✅ |
| Comercios | ⚠️ Solo lectura |
| Mensajeros | ✅ Revisión courier |
| Usuarios | ✅ Roles |

---

## 4. Módulos de dominio (`src/modules/`)

| Módulo | Archivos | Responsabilidad |
|--------|----------|-----------------|
| `home/` | ~35 | Landing, hero, discovery, categorías, ofertas, footer |
| `discovery/` | 4 | Verticales + búsqueda |
| `client/` | 13 páginas | Rutas cliente (re-export home) |
| `business/` | 6 | Panel comercio |
| `rider/` | 16 | Panel mensajero completo |
| `admin/` | 15 | Centro de control |

**Componentes compartidos:** `src/components/` (~80+), design system en `src/design-system/`.

---

## 5. Servicios (`src/services/` — 33 archivos)

| Dominio | Servicios |
|---------|-----------|
| Auth / users | `auth.service.js` |
| Direcciones | `address.service.js` |
| Comercios | `business.service.js`, `category.service.js` |
| Pedidos | `order.service.js`, `assignment.service.js` |
| Courier / mandado | `courier.service.js`, `courier-panel.service.js` |
| Envíos | `shipment.service.js` |
| Riders | `rider.service.js` |
| Discovery | `discovery.service.js`, `search.service.js`, `marketplace.service.js` |
| Ofertas / promos | `offers.service.js`, `promo.service.js`, `coupon.service.js`, `marketing.service.js` |
| Pagos | `wompi.service.js` |
| Mensajería | `messaging.service.js`, `notification.service.js`, `push.service.js` |
| CRM / admin | `crm.service.js`, `admin.service.js`, `review.service.js` |
| Geo / mapas | `location.service.js`, `map.service.js` |
| Infra | `api.js`, `edge.service.js`, `storage.service.js`, `socket.service.js`, `analytics.service.js`, `whatsapp-api.service.js`, `project.service.js` |

---

## 6. Estado cliente (Zustand)

| Store | Archivo | Persist | Versión |
|-------|---------|---------|---------|
| Auth | `authStore.js` | profile | — |
| Carrito | `cartStore.js` | sí | — |
| Ubicación | `locationStore.js` | sí | **v8** |
| Ofertas guardadas | `offersStore.js` | sí | — |
| Tema | `themeStore.js` | sí | light/dark |
| Búsqueda home | `homeSearchStore.js` | sí | max 8 |

---

## 7. Base de datos (46 migraciones)

### Tablas core (`001`)
`users`, `categories`, `businesses`, `products`, `addresses`, `drivers`, `orders`, `order_items`, `payments`, `reviews`, `notifications`, `coupons`, `banners`

### Dominios extendidos

| Dominio | Tablas clave | Migraciones |
|---------|--------------|-------------|
| CRM | `abandoned_carts`, `analytics_events`, `support_tickets` | 018 |
| Mensajería | `support_messages`, `order_messages` | 024 |
| Push | `push_subscriptions` | 019 |
| Courier | `courier_offers`, `courier_tracking_events`, `courier_settings` | 032 |
| Panel mensajero | `courier_documents`, `courier_wallet`, `courier_payout`, `courier_events`, … | 040, 043, 044 |
| Envíos | `shipment_orders`, `shipment_routes`, `shipment_assignments`, `shipment_tracking`, … | 034, 035 |
| Promociones | `promotions`, `user_saved_offers`, `user_missions`, `promo_events` | 033 |
| Discovery | `search_events` | 037 |
| Cobertura | `delivery_coverage` | 035 |

### Edge Functions (7)
`create-wompi-checkout`, `create-wompi-shipment-checkout`, `wompi-webhook`, `auto-assign-rider`, `openroute-directions`, `geocode-proxy`, `send-push`, `send-whatsapp`

### RPCs destacados
`assign_best_rider`, `get_trending_searches`, `get_home_market_pulse`, `submit_courier_for_review`, `accept_shipment_assignment`, `refresh_business_rating`

---

## 8. Matriz LOOP vs estado actual

| Loop | Tema | Estado | Notas |
|------|------|--------|-------|
| 0 | Auditoría | ✅ Este documento | — |
| 1 | Arquitectura base | ⚠️ 40% | Módulos por rol, no por dominio puro |
| 2 | Identidad + config | ⚠️ 50% | Tema oscuro sí; sin i18n/moneda global |
| 3 | Clientes auth | ✅ 75% | Falta verificación formal, estados cuenta |
| 4 | Mi cuenta | ⚠️ 35% | Todo en `/perfil` monolítico |
| 5 | UrabApp Pro | ❌ 0% | No existe |
| 6 | Loyalty + cupones | ⚠️ 45% | Cupones + misiones DB; sin wallet unificado |
| 7 | Direcciones | ✅ 70% | CRUD + mapa checkout; sin cobertura UI dedicada |
| 8 | Pagos | ⚠️ 40% | Efectivo OK; Wompi flag; sin reembolsos UI |
| 9 | Restaurantes | ⚠️ 60% | Como vertical de comercio, no dominio separado |
| 10 | Comercios | ⚠️ 55% | Auto-publicación onboarding; sin aprobación manual |
| 11 | Registro comercios | ⚠️ 50% | Onboarding sí; sin revisión admin obligatoria |
| 12 | Pedidos | ✅ 80% | Carrito → checkout → tracking completo |
| 13 | Mensajería mandados | ✅ 75% | Cotización, OTP, tracking |
| 14 | Envíos intermunicipales | ✅ 80% | Rutas, tarifas, Wompi opcional |
| 15 | Domiciliarios | ✅ 85% | Panel recién completado |
| 16 | Tracking | ✅ 70% | Realtime + mapas; Socket opcional |
| 17 | Buscador | ✅ 75% | Autocomplete, trending; voz/QR stub |
| 18 | Notificaciones | ✅ 65% | In-app + push; email parcial |
| 19 | Centro ayuda | ⚠️ 40% | Tickets básicos; sin FAQ legal |
| 20 | Más información | ⚠️ 45% | Quiénes somos; faltan landings dedicadas |
| 21 | Legal | ❌ 5% | Sin páginas legales versionadas |
| 22 | Admin | ✅ 75% | Amplio; comercios solo lectura |
| 23 | Analytics | ⚠️ 50% | PostHog + eventos BD; sin dashboard producto |
| 24 | Seguridad | ⚠️ 55% | RLS 036; sin rate limit app, fraude |
| 25 | QA | ❌ 10% | Sin suite de tests |
| 26 | Producción | ✅ 70% | Vercel + PWA; backups/monitoreo manual |

---

## 9. Integraciones y feature flags

| Integración | Estado | Variable / nota |
|-------------|--------|-----------------|
| Supabase | ✅ Activo | Core |
| MapLibre + OSM | ✅ Activo | Sin token |
| OpenRouteService | ⚠️ Opcional | `ORS_API_KEY` |
| Socket.IO | ⚠️ Opcional | Railway / local :3001 |
| Wompi | ⚠️ Flag | `VITE_WOMPI_ENABLED` |
| Web Push (VAPID) | ⚠️ Opcional | `VITE_VAPID_PUBLIC_KEY` |
| WhatsApp API | ⚠️ Opcional | Edge `send-whatsapp` |
| PostHog | ⚠️ Opcional | `VITE_POSTHOG_KEY` |

---

## 10. Issues conocidos y riesgos

| Issue | Severidad | Detalle |
|-------|-----------|---------|
| Caché PWA obsoleta | Media | Resuelto con `AppUpdateBanner`; usuarios deben actualizar |
| GPS fuera de Urabá | Baja | `out_of_coverage` muestra ciudad + catálogo home |
| Comercios auto-publicados | Alta | Onboarding crea negocio sin revisión admin |
| Wompi no en prod | Alta | Solo efectivo en checkout real |
| `044_auto_approve_courier` | Media | Puede saltar revisión manual en dev |
| Sin tests E2E | Alta | Regresiones no detectadas |
| `apps/` divergente | Baja | Código Nest/Next no usado en prod |
| Historial pedidos comercio | Baja | Solo pedidos activos en panel |
| Retiros mensajero | Media | UI stub "próximamente" |
| Legal inexistente | Alta | Bloqueante para escala comercial |
| Reparaciones vertical | Baja | `comingSoon: true` en catálogo |

---

## 11. Dependencias npm (producción)

React 19, React Router 7, TanStack Query 5, Zustand 5, Supabase JS 2.106, MapLibre GL 5.6, Socket.IO 4.8, PostHog 1.39, Recharts 3.9, Motion 12, Radix UI (dialog, toast, label), Lucide, Iconify, Axios, vite-plugin-pwa, Workbox.

---

## 12. Scripts operativos

| Script | Uso |
|--------|-----|
| `npm run dev` | Desarrollo local |
| `npm run build` | Build producción |
| `npm run deploy:vercel` | Deploy prod |
| `npm run verify:supabase` | Verificar conexión |
| `npm run verify:integrations` | Estado integraciones |
| `npm run sync:supabase` | Sync migraciones |
| `npm run create:admin` | Crear admin |

---

## 13. Documentación existente

| Archivo | Contenido |
|---------|-----------|
| `ROADMAP-FASES.md` | Roadmap por fases 0–6 (pre-MASTER LOOPS) |
| `INTEGRATIONS.md` | Mapas, socket, Wompi, push |
| `DESIGN-SYSTEM.md` | Tokens y patrones |
| `DEPLOY-VERCEL.md` | Deploy |
| `docs/COURIER_MODULE.md` | Módulo courier |
| `/informe` | Dashboard estado en app |

---

## 14. Conclusión LOOP 0

UrabApp **no es un MVP vacío**: tiene loops operativos reales en pedido, entrega, mensajería y admin. El gap principal es **producto completo regional**: membresía, wallet, pagos digitales, compliance legal, arquitectura por dominios, QA y flujos de aprobación manual para comercios.

**Siguiente paso recomendado:** LOOP 1 — Arquitectura base por dominios sin romper módulos existentes.
