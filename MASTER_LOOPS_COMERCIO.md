# LOOP MAESTRO — ÁREA COMERCIO DE URABAPP

> **Pregunta central:** ¿Cómo hacer que un comercio de Urabá diga *"Vender por UrabApp me genera más dinero y menos trabajo que vender solo por Instagram o WhatsApp"*?

**Métricas de éxito:** comercios registrados · comercios activos · pedidos · recompra · ingresos del comercio · satisfacción

**Alcance:** Solo módulo COMERCIO (vender dentro de UrabApp). Sin transporte, turismo ni servicios externos.

---

## 1. Investigación

### Contexto Urabá
- Comercios venden hoy por **WhatsApp + Instagram + efectivo/Nequi**.
- Dolor: pedidos dispersos, sin historial, sin métricas, cobros manuales, catálogo estático en stories.
- Oportunidad: **un solo panel** para catálogo, pedidos, promos y finanzas con clientes ya en la app.

### Estado actual en código (marzo 2026)

| Área | Estado | Archivos clave |
|------|--------|----------------|
| Onboarding express | ✅ 2 pasos, plantillas | `BusinessOnboarding.jsx` |
| Aprobación admin | ✅ `verification_status` | migración `045`, `AdminBusinessReview` |
| Dashboard | ✅ pedidos, catálogo, ofertas, finanzas, tienda | `BusinessDashboard.jsx` |
| Perfil público | ✅ portada, menú, promos, confianza | `BusinessPage.jsx` |
| Finanzas | ✅ neto hoy/7d/30d | `BusinessFinancesPanel.jsx` |
| Promos | 🟡 % y fijo (sin BOGO/combos UI) | `BusinessOffersPanel.jsx` |
| Modificadores | 🟡 DB sí, UI vendedor no | migración `047` |
| Verificación legal | ❌ sin upload documentos | BACKLOG P0 |
| Clientes / CRM | ❌ | roadmap Fase D |
| IA comercio | ❌ | roadmap Fase E |

### Benchmark mental
Instagram/WhatsApp ganan en **alcance social**. UrabApp debe ganar en **operación + conversión + confianza + datos**.

---

## 2. Flujos

### LOOP 1 — Adquisición (onboarding < 10 min)

```
Descubrir UrabApp → /info/registrar-comercio
    → Login (/negocio/onboarding)
    → Paso 1: nombre, categoría, teléfono, municipio, dirección
    → Paso 2: productos (manual o plantilla EXPRESS)
    → Crear negocio (pending) → Panel /negocio
    → Admin aprueba → is_published = true → Primera venta
```

**Fricción reducida:** opciones avanzadas de entrega colapsadas; plantilla de productos por categoría.

### LOOP 2 — Perfil público

```
Cliente abre /tienda/:slug
    → Portada + logo + promo activa
    → Indicadores confianza (verificado, prep, mínimo, reseñas)
    → Menú por categorías → Carrito → Checkout
```

### LOOP 3 — Dashboard

```
/negocio
    → Métricas hoy (pedidos, ventas, neto, comisión)
    → Tabs: Pedidos | Productos | Ofertas | Finanzas | Mi tienda
    → Toggle abierto/cerrado
    → Copiar link tienda
```

### LOOP 4 — Catálogo

```
Productos → crear (nombre, precio, categoría, foto)
    → duplicar | ocultar | eliminar
    → [futuro] variantes, extras, stock, import CSV
```

### LOOP 5 — Motor de ventas

```
Ofertas → promo % / fijo / flash / destacado
    → Métricas impresiones, CTR, conversión
    → [futuro] combos, cupones propios, carrito abandonado
```

### LOOP 6 — Pedidos

```
Estados: pending → accepted → preparing → on_the_way → delivered
    → Avance con un botón + chat por pedido
    → Historial reciente en mismo tab
    → [futuro] cancelar, ticket cocina, mapa repartidor
```

### LOOP 7–12 — Roadmap

| Loop | Foco | Próximo hito |
|------|------|--------------|
| 7 Clientes | CRM, campañas | Tab "Clientes" con recurrentes |
| 8 IA | descripciones, portadas | Edge function + prompts |
| 9 Reputación | calidad + cumplimiento | Score compuesto (no solo estrellas) |
| 10 Finanzas | ✅ MVP panel | Retiros Wompi automáticos |
| 11 Premium | microinteracciones | Stickers funcionales en panel |
| 12 MVP | recorte | Solo registro, perfil, catálogo, pedidos, panel, pagos |

---

## 3. Arquitectura

```
src/modules/business/          # UI vendedor
  pages/                       # Onboarding, Dashboard
  components/                  # Products, Offers, Store, Finances, TrustPills
src/modules/client/pages/      # BusinessPage (tienda pública)
src/services/
  business.service.js          # CRUD + stats + finanzas + duplicate
  order.service.js             # Pedidos negocio
  offers.service.js            # Motor promos
  storage.service.js           # logo, cover, product images
src/domains/commerce/          # Re-export (migrar a dominio completo)
supabase/migrations/           # businesses, products, orders, promotions
```

**Principios:**
- Supabase directo en MVP (sin NestJS bloqueante).
- `verification_status` + `is_published` como gate de calidad.
- Economía transparente: `business_net`, `commission_amount` en cada pedido.

---

## 4. Wireframes (texto)

### Panel negocio (mobile)
```
┌─────────────────────────────┐
│ [Abierto]  Mi Restaurante   │
│ Hoy: 12 ped · $340k neto    │
├─────────────────────────────┤
│ Pedidos│Prod│Ofert│$$│Tienda│
├─────────────────────────────┤
│ #UR-2847        Preparando  │
│ Cra 98 · $28.500            │
│ [Marcar listo]  [Chat]      │
├─────────────────────────────┤
│ Historial: #UR-2840 Entregado│
└─────────────────────────────┘
```

### Tienda pública
```
┌─────────────────────────────┐
│ ███████ PORTADA ███████████ │
│ [logo] Nombre    [Abierto]  │
│ ★ 4.8 · Verificado · 25 min │
│ 🏷 15% descuento hoy        │
│ [Menú] [Bebidas] [Postres]  │
│ Producto + precio      [+]  │
│ [Ver carrito $45.000]       │
└─────────────────────────────┘
```

---

## 5. UI implementada (esta iteración)

- Tab **Finanzas** con neto hoy / 7d / 30d y últimos pedidos liquidados.
- **Historial** de pedidos en tab Pedidos.
- **Portada** editable en Mi tienda.
- **Duplicar producto** + campo categoría en catálogo.
- **Banner promo** + **BusinessTrustPills** en tienda pública.
- Onboarding: opciones avanzadas colapsadas + estimación de tiempo.

---

## 6. Backend

| Función | Servicio |
|---------|----------|
| `createBusiness` | Insert + pending verification |
| `getBusinessStats` | Agregados del día |
| `getBusinessFinanceSummary` | Agregados 7d/30d + liquidados |
| `duplicateProduct` | Clon rápido de catálogo |
| `getBusinessOrders` | Pedidos con items |
| `updateOrderStatus` | Flujo operativo |
| `upsertBusinessPromotion` | Motor ofertas |
| `uploadBusinessCover` | Storage Supabase |

**RPC admin:** `approve_business`, `reject_business` (migración 045).

---

## 7. APIs

| Endpoint / función | Consumidor | Estado |
|--------------------|------------|--------|
| Supabase `businesses` | Panel, tienda pública | ✅ |
| Supabase `products` | Catálogo | ✅ |
| Supabase `orders` | Pedidos + finanzas | ✅ |
| Supabase `promotions` | Hub ofertas | ✅ |
| Nest `GET /businesses/near` | Discovery | ⬜ stub |

---

## 8. Base de datos (tablas comercio)

```sql
businesses       -- identidad, horarios, promos, verificación, payout
products         -- catálogo, categoría, sort_order, compare_at_price
orders           -- total, business_net, commission_amount, status
order_items      -- modifiers_json, fulfillment_status
promotions       -- motor avanzado de ofertas
promo_events     -- analytics impresiones/clicks
product_modifier_groups / product_modifiers  -- personalización
delivery_coverage -- tarifas por barrio (sin UI vendedor)
```

Migraciones críticas: `001`, `006`, `031`, `033`, `035`, `045`, `047`.

---

## 9. KPIs

### North Star (comercio)
**Pedidos entregados por comercio activo / semana**

### Adquisición (Loop 1)
- Tiempo onboarding → publicación (meta: < 10 min)
- % que completa paso 2 productos
- Tiempo hasta primera aprobación admin

### Activación (Loop 2–4)
- % comercios con ≥ 5 productos + portada + logo
- Tiempo subir 20 productos (meta: < 10 min con duplicar/plantilla)

### Operación (Loop 6)
- Tiempo medio pending → delivered
- % pedidos avanzados sin soporte humano

### Monetización (Loop 10)
- GMV por comercio
- Neto comercio vs comisión UrabApp
- Tasa recompra (mismo cliente, 30 días)

### Calidad (Loop 9)
- Rating promedio + volumen reseñas
- % pedidos entregados a tiempo

---

## 10. Roadmap

### Fase A — MVP operativo ✅ (actual)
Registro, perfil, catálogo, pedidos, panel, promos básicas, finanzas resumen.

### Fase B — Confianza y conversión (2–3 semanas)
- Upload documentos verificación
- Promo visible en tienda ✅
- Score reputación compuesto
- Notificación push nuevo pedido

### Fase C — Escala catálogo (3–4 semanas)
- UI modificadores/variantes
- Import CSV productos
- Combos y cupones propios del comercio

### Fase D — Fidelización (4–6 semanas)
- Tab clientes (nuevos vs recurrentes)
- Campañas WhatsApp/in-app
- Carrito abandonado

### Fase E — IA comercio (6–8 semanas)
- Generar descripción producto
- Sugerir precio según categoría/zona
- Portada asistida

### Fase F — Pagos automáticos
- Wompi split / retiros programados
- Estado de cuenta descargable

---

## LOOP FINAL — Veredicto

### ¿Este comercio vendería más dentro de UrabApp que fuera?

**Hoy: SÍ, con condiciones.**

| Vs Instagram/WhatsApp | Ventaja UrabApp |
|----------------------|-----------------|
| Pedidos en DM | Panel unificado + estados + historial |
| Sin métricas | Ventas, neto, comisión visibles |
| Catálogo en stories | Tienda permanente con link |
| Cobro manual | Checkout integrado (en evolución) |
| Sin confianza | Verificación + reseñas + indicadores |

**Condiciones para respuesta clara SÍ:**
1. Aprobación rápida (< 48 h) ✅ diseñado
2. Primera venta en < 7 días tras aprobación → medir
3. Neto del comercio > esfuerzo de gestionar WhatsApp → finanzas transparentes ✅
4. Tráfico local en app → depende growth cliente

**Iterar si:** onboarding > 10 min, sin pedidos en 14 días, o comercio no entiende su neto.

---

*Última actualización: implementación tab Finanzas, historial pedidos, portada, duplicar producto, confianza pública.*
