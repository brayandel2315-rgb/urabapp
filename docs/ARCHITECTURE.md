# UrabApp — Arquitectura por dominios

**LOOP 1** · Fuente de verdad para boundaries del código.

## Principio

- **Dominios** = lógica de negocio y datos (`src/domains/`)
- **Módulos** = UI por rol (`src/modules/client`, `business`, `rider`, `admin`, `account`)
- **Servicios legacy** (`src/services/`) re-exportan desde dominios durante la migración

## Dominios

```
auth          → autenticación OAuth, OTP, sesión
users         → perfiles, estados cuenta, roles
commerce      → comercios genéricos, catálogo
restaurants   → vertical comida (extiende commerce)
delivery      → mandados urbanos, courier
shipments     → envíos intermunicipales
orders        → pedidos comercio, carrito, checkout
payments      → Wompi, métodos guardados, facturación
loyalty       → wallet, puntos, cupones, Pro
notifications → push, in-app, preferencias
settings      → tema, idioma, moneda, preferencias globales
support       → tickets, ayuda, FAQ
admin         → operación, moderación, analytics
```

## Reglas de dependencia

```
orders → payments, users, commerce
delivery → orders, users
shipments → payments, users
commerce → users (owner)
loyalty → users, orders
admin → * (lectura operativa)
```

**Prohibido:** un dominio importa componentes React de otro dominio.  
**Permitido:** módulos UI importan servicios de dominios.

## Estructura

```
src/
  domains/
    <domain>/
      index.js      # re-exports públicos
      constants.js  # opcional
  modules/          # UI por rol
  services/         # compat — re-exporta domains
  store/            # estado cliente global
```

## Migración incremental

1. Crear `domains/<name>/index.js` re-exportando `services/*.js`
2. Nuevos imports: `@/domains/orders` o `@/services/order.service`
3. No mover archivos físicos hasta estabilizar boundaries

## Rutas por actor

| Actor | Base | Módulo |
|-------|------|--------|
| Cliente | `/`, `/cuenta/*` | `client`, `account`, `home` |
| Comercio | `/negocio` | `business` |
| Mensajero | `/domiciliario` | `rider` |
| Admin | `/admin` | `admin` |

## Base de datos

Ver `supabase/migrations/` — dominios mapean a tablas:

| Dominio | Tablas |
|---------|--------|
| users | `users` |
| commerce | `businesses`, `products`, `categories` |
| orders | `orders`, `order_items` |
| payments | `payments`, `user_payment_methods` |
| delivery | `courier_*`, `drivers` |
| shipments | `shipment_*` |
| loyalty | `user_wallet`, `wallet_transactions`, `coupons`, `user_subscriptions` |
| support | `support_tickets`, `support_messages` |
| legal | `legal_documents`, `user_consents` |
