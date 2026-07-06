# UrabApp — BACKLOG

**Generado en LOOP 0** · 28 jun 2026  
Prioridad: **pedido → entrega → confianza → retención**

Leyenda: ✅ Hecho · 🟡 Parcial · ⬜ Pendiente · 🔴 Bloqueante

---

## P0 — Bloqueantes para producto regional

| ID | Loop | Item | Estado | Dependencias |
|----|------|------|--------|--------------|
| P0-01 | 11 | Aprobación manual comercios — no publicar hasta admin apruebe | ⬜ | Admin comercios write |
| P0-02 | 21 | Páginas legales (privacidad, términos, cookies) + consentimiento | ⬜ | — |
| P0-03 | 8 | Activar Wompi en producción con webhook verificado | 🟡 | Edge functions |
| P0-04 | 1 | Estructura dominios sin romper rutas actuales | ⬜ | — |
| P0-05 | 25 | Smoke tests críticos (checkout, mandado, login) | ⬜ | — |

---

## P1 — Valor inmediato usuario

| ID | Loop | Item | Estado | Notas |
|----|------|------|--------|-------|
| P1-01 | 4 | Área Mi Cuenta modular (`/cuenta/*`) | ⬜ | Separar de `/perfil` |
| P1-02 | 4 | Métodos de pago guardados (UI) | ⬜ | Tras Wompi |
| P1-03 | 4 | Favoritos comercios/productos | ⬜ | Tabla + UI |
| P1-04 | 4 | Historial pedidos extendido + facturación | 🟡 | Lista básica existe |
| P1-05 | 6 | Wallet unificado (saldo, cashback, historial) | ⬜ | Extender `user_missions` |
| P1-06 | 5 | UrabApp Pro — plan, beneficios, cancelar | ⬜ | Nueva tabla `subscriptions` |
| P1-07 | 7 | Mapa direcciones + detección GPS en perfil | 🟡 | Existe en checkout |
| P1-08 | 7 | Validación cobertura por dirección | ⬜ | `delivery_coverage` |
| P1-09 | 10 | Estados comercio: pendiente, activo, suspendido | 🟡 | Parcial en DB |
| P1-10 | 15 | Retiros bancarios mensajero | ⬜ | `courier_payout` existe |
| P1-11 | 19 | FAQ + contacto + estado casos en centro ayuda | 🟡 | Tickets básicos |
| P1-12 | 20 | Landings: registrar comercio, ser domiciliario, cómo funciona | ⬜ | — |
| P1-13 | 3 | Recuperar cuenta (magic link / reset) | 🟡 | Supabase Auth |
| P1-14 | 3 | Verificación email/teléfono | ⬜ | — |
| P1-15 | 3 | Estados cuenta: activo, pendiente, bloqueado | ⬜ | `users.status` |

---

## P2 — Crecimiento y retención

| ID | Loop | Item | Estado |
|----|------|------|--------|
| P2-01 | 6 | Misiones gamificadas (ganar/usar/vencer) | 🟡 DB 033 |
| P2-02 | 6 | Cupones personalizados por segmento CRM | 🟡 |
| P2-03 | 9 | Dominio restaurantes separado (menú, cocina, combos) | ⬜ |
| P2-04 | 17 | Búsqueda por voz | ⬜ stub UI |
| P2-05 | 17 | Escáner QR producto | ⬜ stub UI |
| P2-06 | 18 | Preferencias notificación granulares | 🟡 |
| P2-07 | 18 | Email transaccional (pedido, envío) | ⬜ |
| P2-08 | 23 | Dashboard analytics producto (conversión, retención) | 🟡 |
| P2-09 | 24 | Rate limiting API / edge | ⬜ |
| P2-10 | 24 | Detección fraude básica (pedidos anómalos) | ⬜ |
| P2-11 | 2 | i18n (es/en) | ⬜ |
| P2-12 | 2 | Selector moneda (COP fijo hoy) | ⬜ |
| P2-13 | 22 | Moderación contenido comercios | ⬜ |
| P2-14 | 22 | Auditoría acciones admin | ⬜ |
| P2-15 | 26 | Monitoreo uptime + alertas | ⬜ |
| P2-16 | 26 | Backups automatizados documentados | ⬜ |
| P2-17 | 16 | Tracking unificado pedido + envío + mandado | 🟡 |
| P2-18 | 14 | Tarifas dinámicas envíos por ruta/peso | 🟡 |
| P2-19 | 13 | Cotización mandado tiempo real mejorada | 🟡 |
| P2-20 | 8 | Reembolsos UI admin + cliente | ⬜ |

---

## Completado (no re-trabajar salvo mantenimiento)

| ID | Loop | Item | Estado |
|----|------|------|--------|
| D-01 | 12 | Carrito single-store + mínimo pedido | ✅ |
| D-02 | 12 | Checkout guest + direcciones + cupones | ✅ |
| D-03 | 12 | Order detail tracking + chat + reseñas | ✅ |
| D-04 | 13 | Mandado cotización → pedido → OTP | ✅ |
| D-05 | 14 | Envíos intermunicipales end-to-end | ✅ |
| D-06 | 15 | Panel mensajero completo | ✅ |
| D-07 | 16 | Mapas tracking + realtime | ✅ |
| D-08 | 17 | Búsqueda global + trending | ✅ |
| D-09 | 18 | Notificaciones in-app + push opcional | ✅ |
| D-10 | 22 | Admin dashboard 11 tabs | ✅ |
| D-11 | 2 | Tema claro/oscuro | ✅ |
| D-12 | 26 | PWA + deploy Vercel + banner actualización | ✅ |
| D-13 | 7 | CRUD direcciones en perfil | ✅ |
| D-14 | 10 | Onboarding comercio express | ✅ |
| D-15 | 6 | Cupones checkout + admin marketing | ✅ |

---

## Deuda técnica

| ID | Item | Prioridad |
|----|------|-----------|
| DT-01 | Eliminar o integrar `apps/api` y `apps/web` | P2 |
| DT-02 | Eliminar `pages/Landing.jsx` huérfana | P2 |
| DT-03 | Unificar keys React Query (evitar refetch loops) | P1 |
| DT-04 | Desactivar `044_auto_approve_courier` en prod | P0 |
| DT-05 | Historial pedidos entregados en panel comercio | P1 |
| DT-06 | Migrar `/perfil` monolítico a rutas `/cuenta/*` | P1 |
| DT-07 | Centralizar constantes de estados (orden, envío, courier) | P1 |
| DT-08 | Suite ESLint en CI | P1 |
| DT-09 | Documentar env vars en un solo lugar | P2 |
| DT-10 | OG image check real en LaunchChecklist | P2 |

---

## Bugs abiertos

| ID | Descripción | Severidad | Estado |
|----|-------------|-----------|--------|
| B-01 | Caché PWA sesión normal vs incógnito | Media | 🟡 Mitigado con banner |
| B-02 | Skeleton infinito si query keys inestables | Media | 🟡 Mitigado |
| B-03 | Fuera cobertura: ciudad detectada incorrecta en edge cases | Baja | Abierto |
| B-04 | Wompi redirect falla si env mal configurado | Alta | Abierto |
| B-05 | Socket.IO sin servidor en prod = solo Realtime | Baja | Esperado |

---

## Por LOOP — checklist detallado

### LOOP 1 — Arquitectura base
- [ ] Definir `src/domains/{auth,users,commerce,restaurants,delivery,shipments,orders,payments,loyalty,notifications,settings,support,admin}/`
- [ ] Mover servicios por dominio (re-exports compatibles)
- [ ] Barrel exports sin romper imports `@/`
- [ ] Documentar boundaries en `docs/ARCHITECTURE.md`

### LOOP 2 — Identidad + config
- [x] Tema oscuro
- [ ] Config global: idioma, moneda, notificaciones default
- [ ] `settings` store + persist
- [ ] Pantalla `/configuracion`

### LOOP 3 — Clientes
- [x] Registro/login Google/email
- [x] Guest checkout
- [ ] Recuperar cuenta UI
- [ ] Verificación identidad
- [ ] Estados cuenta en UI + admin

### LOOP 4 — Mi cuenta
- [x] Perfil básico en `/perfil`
- [x] Direcciones
- [x] Notificaciones
- [ ] Rutas: perfil, direcciones, pagos, facturación, historial, favoritos, cupones, créditos, membresía, seguridad, ayuda
- [ ] Cerrar sesión (✅ existe)

### LOOP 5 — UrabApp Pro
- [ ] Tabla `subscriptions` / `membership_plans`
- [ ] Beneficios: envío reducido, prioridad, cashback
- [ ] Panel `/cuenta/membresia`
- [ ] Cancelar / renovar

### LOOP 6 — Loyalty
- [x] Cupones
- [x] Misiones DB (`user_missions`)
- [x] Ofertas guardadas
- [ ] Wallet UI unificado
- [ ] Puntos + cashback historial
- [ ] Vencimiento automático UI

### LOOP 7 — Direcciones
- [x] Casa/trabajo/otro labels
- [x] CRUD
- [ ] Mapa en gestión direcciones
- [ ] Favoritas / default visual
- [ ] Cobertura por pin

### LOOP 8 — Pagos
- [x] Efectivo checkout
- [x] Wompi edge functions
- [ ] Wompi prod activo
- [ ] Guardar tarjeta
- [ ] Historial pagos cliente
- [ ] Reembolsos

### LOOP 9 — Restaurantes
- [x] Vertical `/restaurantes`
- [ ] Menú estructurado (categorías cocina)
- [ ] Combos
- [ ] Horarios cocina vs tienda
- [ ] Promos restaurante

### LOOP 10 — Comercios
- [x] Catálogo productos
- [x] Estados open/closed
- [ ] Verificación documentos
- [ ] NO auto-publicar
- [ ] Cobertura entrega admin

### LOOP 11 — Registro comercios
- [x] Formulario onboarding
- [ ] Documentación legal upload
- [ ] Cola revisión admin
- [ ] Solo admin publica

### LOOP 12 — Pedidos
- [x] Carrito → checkout → tracking
- [ ] Reordenar pedido anterior
- [ ] Factura PDF

### LOOP 13 — Mensajería
- [x] Cotización + crear + OTP
- [ ] Mejorar ETA tiempo real
- [ ] Tracking fases mejorado

### LOOP 14 — Envíos
- [x] Rutas + tarifas + tracking
- [ ] Cobertura mapa regional
- [ ] Estados extendidos

### LOOP 15 — Domiciliarios
- [x] Registro 4 pasos
- [x] Ganancias wallet
- [ ] Retiros
- [ ] Documentación re-verificación

### LOOP 16 — Tracking
- [x] Cliente mapa pedido
- [x] Mensajero GPS share
- [ ] Comercio ve rider en mapa
- [ ] Unificar componente tracking

### LOOP 17 — Buscador
- [x] Productos + comercios
- [x] Trending + autocomplete
- [ ] Más buscado admin tuning
- [ ] Voz / QR

### LOOP 18 — Notificaciones
- [x] In-app
- [x] Push web
- [ ] Email
- [ ] Preferencias por tipo

### LOOP 19 — Centro ayuda
- [x] Tickets soporte
- [ ] FAQ searchable
- [ ] Reportes
- [ ] Estado caso timeline

### LOOP 20 — Más información
- [x] Quiénes somos
- [ ] Registrar comercio landing
- [ ] Ser domiciliario landing
- [ ] Cómo funciona
- [ ] Seguridad página

### LOOP 21 — Legal
- [ ] Política privacidad
- [ ] Tratamiento datos
- [ ] Términos uso
- [ ] Cookies
- [ ] Versionado + registro aceptación

### LOOP 22 — Admin
- [x] Dashboard completo
- [ ] Moderación comercios write
- [ ] Auditoría log
- [ ] Verificación documentos

### LOOP 23 — Analytics
- [x] Eventos BD + PostHog opcional
- [ ] Dashboard conversión
- [ ] Retención cohortes
- [ ] Ingresos por vertical

### LOOP 24 — Seguridad
- [x] RLS policies
- [ ] Logs centralizados
- [ ] Permisos granulares
- [ ] Rate limit
- [ ] Anti-fraude

### LOOP 25 — QA
- [ ] Unit tests utils críticos
- [ ] E2E Playwright flujos core
- [ ] Lighthouse CI
- [ ] Error boundary reporting

### LOOP 26 — Producción
- [x] Vercel deploy
- [x] PWA
- [ ] Checklist pre-release automatizado
- [ ] Monitoreo Sentry/Logflare
- [ ] Runbook incidentes
- [ ] Backup restore test

---

## Métricas de progreso backlog

| Prioridad | Total | Hecho | Parcial | Pendiente |
|-----------|-------|-------|---------|-----------|
| P0 | 5 | 0 | 1 | 4 |
| P1 | 15 | 0 | 4 | 11 |
| P2 | 20 | 0 | 6 | 14 |
| Completado | 15 | 15 | — | — |
| Deuda técnica | 10 | 0 | 1 | 9 |

**Velocidad sugerida:** 1 LOOP por sprint (1–2 semanas) respetando dependencias P0 → P1 → P2.
