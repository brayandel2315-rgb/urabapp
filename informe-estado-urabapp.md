# Informe de estado — Urabapp vs. app tipo Rappi

**Fecha:** Junio 2026  
**Objetivo:** Saber qué existe, qué falta y qué decisiones tomar para llegar a un MVP funcional estilo Rappi/Uber Eats enfocado en Urabá.

---

## 1. Resumen ejecutivo

| Indicador | Estado |
|-----------|--------|
| **Madurez general del proyecto** | ~8% (prototipo visual + auth básica) |
| **Listo para usuarios reales** | No |
| **Listo para comercios** | No |
| **Listo para domiciliarios** | No |
| **PWA instalable** | No |
| **Pagos funcionales** | No |

**Conclusión:** Urabapp hoy es un **front-end de demostración** con identidad visual definida. Para operar como Rappi necesitas construir el **núcleo transaccional** (catálogo → carrito → pedido → pago → entrega → seguimiento) y decidir el **stack backend** antes de avanzar.

---

## 2. Qué existe hoy

### Frontend
- React 19 + Vite + TailwindCSS
- 4 rutas: `/`, `/login`, `/brandboard`, `/informe`
- Identidad visual del logo (`logo.jpeg`) aplicada
- Tipografía unificada: **Montserrat** (alineada al logo)
- 5 componentes UI: Button, Card, Input, Loader, EmptyState
- Home con buscador, categorías mock y tarjeta de tienda de ejemplo
- Login con magic link por email (Supabase OTP)
- Carpetas vacías preparadas para módulos (`client`, `business`, `rider`, `admin`)

### Backend / datos
- Cliente Supabase configurado (sin tablas desplegadas en el código)
- Documento `urabapp-arquitectura.md` con esquema SQL detallado (no implementado)
- **No hay:** Express, Prisma, API REST, Firebase, PostgreSQL propio

### Dependencias instaladas vs. requeridas

| Requerido (spec original) | Estado |
|---------------------------|--------|
| React Router | Instalado |
| TailwindCSS | Instalado |
| Zustand | Instalado, **sin stores** |
| Axios | No instalado |
| React Query | No instalado |
| Firebase Auth | No |
| Google Maps | No |
| FCM (notificaciones) | No |
| vite-plugin-pwa | No |
| Node/Express/Prisma | No |

---

## 3. Comparativa funcional vs. Rappi

Leyenda: ✅ Existe · 🟡 Parcial · ❌ No existe

### 3.1 Módulo cliente (usuario final)

| Función Rappi | Urabapp | Prioridad MVP |
|---------------|---------|---------------|
| Login Google / teléfono | 🟡 Solo email OTP | Alta |
| Registro rápido | ❌ | Alta |
| GPS / ubicación automática | ❌ | Alta |
| Selección de municipio | 🟡 Texto fijo "Apartadó" | Alta |
| Buscar negocios | 🟡 UI sin datos reales | Alta |
| Categorías (comida, farmacia, etc.) | 🟡 UI estática | Alta |
| Listado de tiendas cercanas | ❌ | Alta |
| Detalle de tienda + menú | ❌ | Alta |
| Carrito de compras | ❌ | **Crítica** |
| Checkout / dirección | ❌ | **Crítica** |
| Métodos de pago | ❌ | **Crítica** |
| Crear pedido | ❌ | **Crítica** |
| Seguimiento en tiempo real | ❌ | Alta |
| Historial de pedidos | ❌ | Media |
| Perfil de usuario | ❌ | Media |
| Direcciones guardadas | ❌ | Alta |
| Calificaciones / reseñas | ❌ | Baja (post-MVP) |
| Cupones / promos | ❌ | Media |
| Notificaciones push | ❌ | Media |

### 3.2 Módulo negocios (comercios)

| Función | Urabapp | Prioridad MVP |
|---------|---------|---------------|
| Registro / crear negocio | ❌ | Alta |
| Subir logo y portada | ❌ | Media |
| CRUD productos | ❌ | **Crítica** |
| Horarios abierto/cerrado | ❌ | Alta |
| Recibir y gestionar pedidos | ❌ | **Crítica** |
| Dashboard de ventas | ❌ | Baja |
| Reportes | ❌ | Baja |

### 3.3 Módulo domiciliarios

| Función | Urabapp | Prioridad MVP |
|---------|---------|---------------|
| Login domiciliario | ❌ | Alta |
| Activarse / desactivarse | ❌ | Alta |
| Ver pedidos disponibles | ❌ | **Crítica** |
| Aceptar / rechazar pedido | ❌ | **Crítica** |
| Navegación GPS | ❌ | Alta |
| Historial y ganancias | ❌ | Media |

### 3.4 Panel administrador

| Función | Urabapp | Prioridad MVP |
|---------|---------|---------------|
| Gestión usuarios | ❌ | Media |
| Gestión negocios | ❌ | Alta |
| Gestión domiciliarios | ❌ | Alta |
| Comisiones | ❌ | Media |
| Municipios | ❌ | Alta |
| Banners / promos | ❌ | Media |
| Estadísticas | ❌ | Baja |
| Soporte | ❌ | Baja |

### 3.5 Infraestructura técnica

| Capa | Urabapp | Prioridad |
|------|---------|-----------|
| Base de datos (12 tablas spec) | ❌ | **Crítica** |
| API REST organizada | ❌ | **Crítica** |
| Autenticación con roles (CLIENT/BUSINESS/RIDER/ADMIN) | ❌ | **Crítica** |
| JWT + middleware seguridad | ❌ | Alta |
| PWA instalable (manifest, SW, iconos) | ❌ | Alta |
| Mapas (Google Maps o Mapbox) | ❌ | Alta |
| Notificaciones (FCM o alternativa) | ❌ | Media |
| Pagos Colombia (Wompi, PSE, Nequi, efectivo) | ❌ | **Crítica** |
| Deploy producción (Vercel + backend) | ❌ | Media |
| Rate limiting, helmet, CORS | ❌ | Media |

---

## 4. Flujo mínimo tipo Rappi (lo que DEBE existir para el MVP)

```
Usuario abre app
    → Elige municipio / GPS detecta ubicación
    → Ve tiendas y categorías reales (desde BD)
    → Entra a una tienda, ve productos
    → Agrega al carrito
    → Confirma dirección de entrega
    → Paga (efectivo o digital)
    → Pedido se crea en BD
    → Tienda recibe pedido y lo prepara
    → Domiciliario acepta y recoge
    → Usuario sigue el estado en tiempo real
    → Pedido entregado
```

**Hoy el flujo se corta en el paso 1.** No hay datos reales ni carrito ni pedidos.

---

## 5. Decisiones que debes tomar (bloqueantes)

Estas decisiones definen el 80% del trabajo restante. Sin resolverlas, el equipo puede construir en direcciones incompatibles.

### Decisión A — Stack backend (elige UNA ruta)

| Opción | Pros | Contras |
|--------|------|---------|
| **A1. Supabase** (ya iniciado + `urabapp-arquitectura.md`) | Rápido, auth+BD+realtime+storage en uno; menos código backend | Menos control; vendor lock-in |
| **A2. Express + Prisma + PostgreSQL** (spec original) | Control total, escalable, REST clásica | Más tiempo, más infra que mantener |
| **A3. Híbrido** (Supabase BD + Express para lógica) | Flexible | Más complejidad |

**Recomendación MVP:** **A1 Supabase** — ya tienes cliente configurado y esquema documentado. Migrar a Express después si creces.

---

### Decisión B — Autenticación

| Opción | Nota |
|--------|------|
| **B1. Supabase Auth** (email, Google, teléfono) | Coherente si eliges A1 |
| **B2. Firebase Auth** (spec original) | Requiere cambiar todo el auth actual |

**Recomendación:** **B1** si eliges Supabase. Agregar Google y teléfono SMS.

---

### Decisión C — Mapas

| Opción | Costo | Uso |
|--------|-------|-----|
| **C1. Google Maps** | API de pago tras crédito gratis | GPS, rutas, distancia |
| **C2. Mapbox** (en arquitectura.md) | Plan gratuito generoso | Tracking domiciliarios |

**Recomendación MVP:** **C2 Mapbox** para tracking; geocoding simple con API de Supabase o Mapbox.

---

### Decisión D — Pagos Colombia

| Opción | MVP |
|--------|-----|
| **D1. Solo efectivo** | Sí — lanza en 2 semanas |
| **D2. Wompi** (PSE, tarjeta, Nequi) | Fase 2 — requiere registro comercio |
| **D3. Ambos** | Ideal a mediano plazo |

**Recomendación MVP:** Empezar con **D1 efectivo** + preparar tabla `payments` para Wompi después.

---

### Decisión E — Alcance geográfico MVP

| Opción | Impacto |
|--------|---------|
| **E1. Un solo municipio** (Apartadó) | Menor complejidad logística |
| **E2. Los 5 municipios** | Más datos, más domiciliarios, más tiempo |

**Recomendación:** **E1 Apartadó** para validar, expandir después.

---

### Decisión F — ¿Quién construye primero?

| Orden sugerido | Razón |
|----------------|-------|
| 1. Cliente (pedir) | Genera demanda |
| 2. Negocios (recibir pedidos) | Sin esto no hay oferta |
| 3. Domiciliarios (entregar) | Puede ser manual al inicio (WhatsApp) |
| 4. Admin | Cuando haya volumen |

**Atajo MVP:** Domiciliario manual por WhatsApp mientras construyes el panel rider.

---

## 6. Roadmap recomendado por fases

### Fase 1 — Base (2-3 semanas) ← ESTÁS AQUÍ (~40% de Fase 1)
- [x] Identidad visual y brandboard
- [x] Tipografía unificada
- [ ] Decisión de stack (A, B, C, D, E)
- [ ] Desplegar esquema BD (users, businesses, products, orders…)
- [ ] Auth con roles + rutas protegidas
- [ ] Layouts (cliente, negocio, admin)
- [ ] Zustand stores (auth, cart, location)

### Fase 2 — MVP Cliente (3-4 semanas)
- [ ] Home con datos reales (categorías, tiendas, promos)
- [ ] Detalle tienda + productos
- [ ] Carrito + checkout + dirección
- [ ] Crear pedido (efectivo)
- [ ] Lista "Mis pedidos" + estados básicos

### Fase 3 — MVP Negocios (2-3 semanas)
- [ ] Panel negocio: productos, horarios, pedidos entrantes
- [ ] Cambiar estado: preparando → listo

### Fase 4 — Entrega (2-3 semanas)
- [ ] Panel domiciliario O proceso manual
- [ ] Mapa seguimiento (Mapbox)
- [ ] Notificaciones de cambio de estado

### Fase 5 — PWA + producción (1-2 semanas)
- [ ] vite-plugin-pwa, manifest, iconos
- [ ] Deploy Vercel + Supabase Cloud
- [ ] SEO básico, performance

### Fase 6 — Pagos digitales + admin (post-MVP)
- [ ] Wompi
- [ ] Panel admin completo
- [ ] Cupones, reseñas, analytics

**Tiempo estimado hasta MVP usable:** 10-14 semanas (1 dev) o 6-8 semanas (2 devs).

---

## 7. Matriz de prioridad para tus decisiones

| # | Tarea | Impacto | Esfuerzo | ¿Bloquea MVP? |
|---|-------|---------|----------|---------------|
| 1 | Decidir stack backend (Supabase vs Express) | Alto | Bajo | **Sí** |
| 2 | Crear tablas en BD | Alto | Medio | **Sí** |
| 3 | Auth + roles | Alto | Medio | **Sí** |
| 4 | Catálogo tiendas/productos | Alto | Alto | **Sí** |
| 5 | Carrito + checkout | Alto | Alto | **Sí** |
| 6 | Flujo de pedido + estados | Alto | Alto | **Sí** |
| 7 | Panel negocio básico | Alto | Medio | **Sí** |
| 8 | GPS / municipios | Medio | Medio | Casi |
| 9 | PWA | Medio | Bajo | No (pero importante) |
| 10 | Mapas tiempo real | Medio | Alto | No (MVP manual) |
| 11 | Pagos Wompi | Medio | Alto | No (efectivo primero) |
| 12 | Panel admin | Bajo | Alto | No |
| 13 | Reseñas / cupones | Bajo | Medio | No |

---

## 8. Riesgos actuales

1. **Dos specs distintas:** El documento original pide Firebase+Express+Prisma; el proyecto usa Supabase. Hay que unificar.
2. **Auth incompleta:** Magic link sin roles ni perfil de usuario.
3. **Sin datos:** Toda la UI es mock; no hay seed de tiendas.
4. **Clave Supabase en código:** Mover a `.env` antes de producción.
5. **Sin PWA:** Usuarios no pueden "instalar" la app en el celular aún.
6. **TabBar huérfana:** Existe `TabBar.jsx` con rutas `/pedidos` que no existen.

---

## 9. Checklist de acción inmediata (esta semana)

- [ ] **Tú decides:** Supabase (recomendado) o Express+Prisma
- [ ] **Tú decides:** MVP solo Apartadó o 5 municipios
- [ ] **Tú decides:** Efectivo primero o pagos digitales desde día 1
- [ ] Ejecutar migraciones SQL en Supabase
- [ ] Implementar auth Google + perfil con rol CLIENT
- [ ] Crear 3-5 tiendas de prueba con productos (seed)
- [ ] Construir carrito (Zustand) y pantalla checkout
- [ ] Mover credenciales a `.env.local`

---

## 10. Definición de "listo como Rappi" (criterios de éxito MVP)

Urabapp estará al nivel MVP Rappi cuando un usuario real pueda:

1. Instalar/abrir la PWA en su celular
2. Registrarse en menos de 1 minuto
3. Ver tiendas reales de su municipio
4. Pedir comida o productos con carrito
5. Pagar (aunque sea en efectivo)
6. Recibir actualizaciones del pedido
7. Un comercio puede recibir y gestionar ese pedido
8. Un domiciliario (o operador manual) completa la entrega

**Hoy: 0 de 8 cumplidos.**

---

*Documento generado para apoyar decisiones de producto y técnica. Actualizar conforme avance el proyecto.*
