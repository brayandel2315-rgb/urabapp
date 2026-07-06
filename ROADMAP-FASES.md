# Urabapp — Roadmap por fases

**Posicionamiento:** Urabapp — todo lo que necesitas en Urabá, entregado localmente.

No es “el Rappi de Urabá”. Es infraestructura local para comida, mensajería, tiendas y envíos intermunicipales.

---

## Fase 0 — Posicionamiento (2 semanas)

| Acción | Estado |
|--------|--------|
| Nuevo tagline y landing pública | ✅ Implementado |
| Verticales definidas (sin lanzar todo junto) | ✅ UI |
| Quitar narrativa “copia de Rappi” | ✅ En curso |

**Verticales iniciales:** Comida · Mensajería · Tiendas locales · Envíos intermunicipales · Reparaciones (fase 2)

---

## Fase 1 — Validación sin desarrollar más (15–30 días)

**Objetivo:** 100 pedidos reales antes de ampliar el producto.

### Construir solo

- [x] Landing web (`/`)
- [x] Panel comercio (`/negocio`)
- [x] Panel mensajero (`/domiciliario`)
- [x] Flujo pedido (catálogo → carrito → checkout → tracking)
- [x] WhatsApp como canal
- [ ] Sin mapa
- [ ] Sin Urapuntos
- [ ] Sin IA

### Flujo operativo

```
Cliente → WhatsApp / PWA → Operador → Mensajero → Entrega
```

### Metas

| Métrica | Meta |
|---------|------|
| Comercios | 20 |
| Mensajeros | 10 |
| Usuarios | 100 |
| Pedidos | 100 |

### KPIs a medir

- Costo por pedido
- Tiempo promedio de entrega
- Comercios activos
- Tasa de recompra

---

## Fase 2 — Lanzamiento por zonas (60 días)

**Ciudad 1:** Apartadó (densidad, comercios, estudiantes, tráfico digital)

**Cobertura:** Centro → Ortiz → Laureles → Vélez

| Acción | Estado |
|--------|--------|
| 50 comercios en catálogo | ✅ Seed SQL 013 |
| Envíos intermunicipales `/envios` | ✅ Implementado |
| Direcciones guardadas | ✅ Perfil + checkout |
| Expansión Turbo, Carepa, Chigorodó, Necoclí | ✅ Seed parcial |
| KPIs admin Fase 2 | ✅ LaunchChecklist |

| Métrica | Meta |
|---------|------|
| Comercios | 50 |
| Mensajeros | 30 |
| Usuarios | 1.000 |

---

## Fase 3 — Producto mínimo real

| Acción | Estado |
|--------|--------|
| Cupones en checkout (`URABA10`, `ENVIOGRATIS`) | ✅ |
| Notificaciones in-app al cambiar estado | ✅ |
| Horarios de tienda (abre/cierra) | ✅ |
| Config tienda: domicilio, mínimo, teléfono | ✅ |
| Cancelar pedido (cliente, solo pending) | ✅ |
| KPIs admin Fase 3 | ✅ LaunchChecklist |
| Métricas panel negocio (hoy) | ✅ |

### Mantener

- Login celular
- Catálogo
- Carrito
- Pago contra entrega
- Tracking básico
- Panel comercio

### Posponer

- Urapuntos
- Referidos
- Recompensas
- Analytics avanzado (PostHog)
- Push avanzadas

| Métrica | Meta |
|---------|------|
| Pedidos | 1.500 |
| Comercios activos | 40 |
| Tasa recompra | 25% |

---

## Fase 4 — Modelo económico

| Acción | Estado |
|--------|--------|
| Comisión por pedido (12%) en BD | ✅ |
| Desglose: comisión, domicilio, mensajero, margen | ✅ |
| Panel admin unit economics | ✅ AdminEconomicsPanel |
| Neto comercio + comisión en panel negocio | ✅ |
| Ganancia mensajero por pedido | ✅ |
| KPIs Fase 4 (1.500 pedidos/mes) | ✅ LaunchChecklist |

Ejemplo por pedido de $35.000:

| Concepto | Valor |
|----------|-------|
| Comisión comercio (12%) | $4.200 |
| Domicilio | $5.000 |
| **Ingresos** | **$9.200** |
| Mensajero | $4.000 |
| Infraestructura | $700 |
| Marketing | $1.500 |
| **Margen** | **~$3.000** |

**Meta:** 1.500 pedidos/mes · ~$13.8M ingresos plataforma · ~$4.5M margen

---

## Fase 5 — Diferenciadores

| Acción | Estado |
|--------|--------|
| Comercio Express (onboarding + plantillas + share WA) | ✅ |
| Envíos intermunicipales `/envios` | ✅ Fase 2 |
| Funnel WhatsApp (Instagram → WA → link) | ✅ WhatsappFunnel |
| Tracking canal `orders.source` | ✅ Migración 016 |
| Ranking mensajeros + bonos semanales | ✅ RiderLeaderboard |
| KPIs admin Fase 5 | ✅ AdminDifferentiatorsPanel |

1. **Comercio Express** — tienda en 10 minutos
2. **Envíos intermunicipales** — Turbo↔Apartadó, Carepa↔Chigorodó
3. **WhatsApp como canal principal** — Instagram → WhatsApp → Link → Urabapp
4. **Red de repartidores** — ganancia fija + bonos + ranking

| Métrica | Meta |
|---------|------|
| Comercios Express/mes | 20 |
| Pedidos vía WhatsApp/mes | 200 |
| Envíos intermunicipales/mes | 50 |
| Mensajeros activos | 25 |

---

## Fase 6 — Post-MVP (sin Wompi)

| Acción | Estado |
|--------|--------|
| Panel medios de pago (manual uso digital) | ✅ PaymentMethodsPanel |
| Reseñas tienda + mensajero | ✅ ReviewForm |
| GPS en checkout | ✅ useGeolocation |
| Cupones en checkout | ✅ Fase 3 |
| Integración Wompi | ⏸ Pospuesto |

Presentación según manual digital: retícula, secciones, márgenes, variante positiva.
Sin sellos PCI ni logo Wompi hasta integración real.

| Métrica | Meta |
|---------|------|
| Reseñas | 100 |
| Pedidos con GPS/mes | 200 |

---

## Arquitectura operativa

```
Cliente
  ↓
PWA (Urabapp)
  ↓
Supabase
  ↓
Motor asignación (futuro)
  ↓
Panel comercio / Panel mensajero / Dashboard admin
```

### Infraestructura futura

| Servicio | Uso |
|----------|-----|
| Redis | Colas de asignación |
| PostHog | Analítica (Fase 3+) |
| Cloudflare | CDN |
| Sentry | Errores |

---

## Rutas actuales

| Ruta | Uso |
|------|-----|
| `/` | Landing pública |
| `/explorar` | Catálogo y pedidos (PWA) |
| `/negocio` | Panel comercio |
| `/domiciliario` | Panel mensajero |
| `/admin` | Operación |

---

*Actualizar este documento al cerrar cada fase.*
