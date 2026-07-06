# UrabApp — Módulo de Mensajería / Encomiendas

Documentación técnica del módulo courier (producción).  
Stack real: **React 19 + Vite + Supabase (Postgres, Realtime, Edge Functions) + MapLibre/OSM + OpenRouteService**.

> El brief original menciona Flutter/NestJS; en UrabApp la implementación vive en este monorepo PWA con Supabase como backend escalable.

---

## 1. Arquitectura

```
Cliente (MandadoPage)
    → quoteCourierDelivery()     [geocode + ruta ORS + motor tarifas]
    → createCourierOrder()       [orders.order_type = courier]
    → publish_courier_offers()   [RPC Postgres + Haversine]
    → courier_offers (Realtime)  [push a mensajeros]

Mensajero (RiderDashboard)
    → getPendingCourierOffers()
    → accept_courier_offer()     [atómico — primer aceptado gana]
    → set_courier_phase()        [tracking events]
    → verify_courier_delivery_otp()

Cliente (OrderDetailPage)
    → tracking map + CourierTrackingSteps + OTP entrega
```

### Servicios separados (lógica)

| Dominio | Ubicación |
|---------|-----------|
| Auth | `auth.service.js` |
| Orders base | `order.service.js` |
| Courier | `courier.service.js` |
| Tarifas | `utils/courier-fare.js` |
| Maps | `map.service.js` + Edge `openroute-directions` |
| Realtime | Supabase Realtime + `useCourierOffersRealtime` |
| Notificaciones | `notification.service.js` + push Edge |
| Pagos | Wompi Edge (opcional) |

---

## 2. Base de datos (migración `032_courier_module.sql`)

### `orders` (columnas nuevas)

- `order_type`: `commerce` \| `courier` \| `envio`
- `pickup_address`, `pickup_latitude`, `pickup_longitude`
- `distance_km`, `estimated_minutes`, `fare_breakdown` (JSONB)
- `courier_package_type`, `courier_weight_tier`, `courier_priority`
- `delivery_otp` (4 dígitos, generado en INSERT)
- `courier_phase`, `courier_search_radius_km`, `picked_up_at`

### Tablas nuevas

- **`courier_settings`** — `fare_config` editable por admin
- **`courier_offers`** — oferta por mensajero, TTL 10s
- **`courier_tracking_events`** — auditoría + mapa de calor

### RPCs

- `publish_courier_offers(order_id, radius_km)`
- `accept_courier_offer(order_id, driver_id)` — transaccional
- `reject_courier_offer(order_id, driver_id)`
- `verify_courier_delivery_otp(order_id, code, driver_id)`
- `set_courier_phase(order_id, phase, event_type, lat, lng)`

---

## 3. Motor de tarifas

Archivo: `src/utils/courier-fare.js`

```
total = max(minFare, base + distancia×perKm + pico + demanda) × express
```

- **Mínimo:** $15.000 COP  
- **Base:** $8.000  
- **Por km:** $850 (configurable en `courier_settings`)  
- **Gasolina:** solo `fuelCostInternal` — nunca visible al cliente  
- **Mensajero:** `riderPayout` = % del total (default 72%)

---

## 4. Estados (courier_phase)

| Fase | UI cliente |
|------|------------|
| `searching` | Buscando mensajero |
| `assigned` | Aceptado |
| `arriving_pickup` | Llegando a recoger |
| `picked_up` | Recogido → `status = on_the_way` |
| `en_route` | En camino |
| `delivered` | OTP verificado |

---

## 5. Pantallas

| Ruta | Componente | Perfil |
|------|------------|--------|
| `/mandado` | `MandadoPage` | Cliente — mapa + tarifa + buscar mensajero |
| `/pedidos/:id` | `OrderDetailPage` | Cliente — tracking + OTP |
| `/domiciliario` | `RiderDashboard` | Mensajero — ofertas + fases + OTP |
| `/envios` | `EnviosPage` | Cliente — intermunicipal (pendiente unificar) |

### Componentes reutilizables

- `CourierRouteMap` — mapa dual recogida/entrega  
- `FareBreakdownCard` — glassmorphism desglose  
- `CourierPackageForm` — tipo, peso, prioridad  
- `CourierOfferModal` — accept/reject 10s  
- `CourierTrackingSteps` — stepper premium  
- `DeliveryOtpPanel` — cliente (código) / rider (verificar)

---

## 6. Realtime

- **Supabase Realtime:** `courier_offers`, `courier_tracking_events`, `orders`, `drivers`
- **GPS mensajero:** cada 3s cuando está online (`useRiderLocationShare`)
- **Socket.IO opcional:** `socket.service.js` (Railway) — fallback/amplificación

---

## 7. Notificaciones

Eventos vía `createOrderNotification` + push:

- Cliente: pedido recibido, aceptado, recogido, en camino, entregado  
- Mensajero: nueva oferta (`notifyRiderNewOrder`)  
- WhatsApp respaldo: `whatsapp-api.service.js`

---

## 8. Despliegue migración

```bash
supabase db push
# o aplicar 032_courier_module.sql en SQL Editor de producción
```

---

## 9. Roadmap inmediato

- [ ] Unificar `/envios` con mismo motor courier + multi-municipio  
- [ ] Panel comercio: pedidos programados / masivos  
- [ ] Admin: mapa calor desde `courier_tracking_events`  
- [ ] Foto POD + firma en Storage  
- [ ] BullMQ/cron para expansión automática de radio sin polling cliente  
- [ ] Geohash index en `drivers` para escala >10k mensajeros

---

## 10. Modelo financiero (referencia)

Por pedido courier $16.000:

| Concepto | Valor |
|----------|-------|
| Total cliente | $16.000 |
| Pago mensajero (~72%) | $11.520 |
| Gasolina interna (~3 km) | ~$1.157 |
| Margen plataforma | ~$3.323 |

Actualizar `fuelPriceCop` mensualmente en `courier_settings.fare_config`.
