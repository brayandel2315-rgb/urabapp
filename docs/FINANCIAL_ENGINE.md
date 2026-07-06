# UrabApp Financial Engine — Auditoría y Arquitectura

## 1. Hallazgos de auditoría (estado previo)

### 1.1 Lo que existía

| Área | Estado | Archivos / tablas |
|------|--------|-------------------|
| Economía por pedido | ✅ | `orders.*`, `recalculate_order_economics()` |
| Pagos digitales | ✅ Wompi only | `payments`, edge `wompi-webhook` |
| Wallet mensajero | ⚠️ Parcial | `courier_wallet`, crédito inmediato en `delivered` |
| Retiros mensajero | ✅ | `courier_payout`, `request_courier_payout` |
| Wallet cliente | ❌ Solo lectura | `user_wallet`, `wallet_transactions` sin writes |
| Liquidación comercio | ❌ | `business_net` calculado, sin payout |
| Ledger contable | ❌ | Sin libro mayor append-only |
| Comisiones configurables | ⚠️ | `businesses.commission_pct` + hardcode 12% en RPC |
| ePayco | ❌ | No existe en el repo |
| Split payment | ❌ | `payout_mode` / `wompi_recipient_id` sin uso |
| Reembolsos | ❌ | Sin flujo financiero |
| Auditoría financiera | ⚠️ | `courier_events`, `order_events` no son ledger |

### 1.2 Inconsistencias detectadas

1. Comisión default **15%** en schema vs **12%** en `ECONOMICS` y `recalculate_order_economics`.
2. `credit_courier_wallet_on_delivery` acredita **balance_available** al instante (no hay fase pendiente).
3. `balance_pending` en `courier_wallet` nunca se escribía.
4. Bonos semanales crean `courier_payout` sin pasar por wallet.
5. Cliente calcula economía en `order.service.js`; servidor la sobrescribe vía trigger.
6. `payment_approved` se emite al **iniciar** checkout Wompi, no al confirmar pago.
7. Panel comercio “liquidaciones” muestra pedidos entregados, no transferencias reales.

### 1.3 Objetivo del Financial Engine

Motor **desacoplado** donde:

- **Payment Provider** = pasarela (Wompi, ePayco, Mock…) vía interfaz.
- **Settlement Engine** = liquida **solo** en `ENTREGADO`.
- **Ledger** = registro inmutable de movimientos.
- **Wallets** = saldos por actor (cliente, comercio, mensajero, plataforma).
- **Commission Engine** = reglas administrables.
- **Payout Engine** = lotes diarios/semanales/quincenales/mensuales.
- Todo vía **eventos**, nunca acoplamiento directo entre módulos de negocio.

---

## 2. Arquitectura de módulos (`src/financial-engine/`)

```
financial-engine/
├── index.js                    # API pública
├── types.js                    # Estados financieros, tipos de wallet
├── events.js                   # Nombres de eventos + emitFinEvent
├── providers/
│   ├── PaymentProvider.js      # Contrato abstracto
│   ├── WompiProvider.js        # Adaptador Wompi existente
│   ├── EPaycoProvider.js       # Stub listo para implementar
│   ├── MockProvider.js         # Tests / dev
│   └── index.js                # Registry + getPaymentProvider()
├── commission/CommissionEngine.js
├── ledger/LedgerService.js
├── wallet/WalletService.js
├── settlement/SettlementEngine.js
├── payout/PayoutEngine.js
├── refund/RefundService.js
├── accounting/AccountingService.js
├── audit/AuditService.js
├── notifications/FinanceNotificationService.js
└── transactions/TransactionService.js
```

### 2.1 Flujo de eventos

```
Pedido → status = delivered (DB trigger)
    ↓
fin_settle_order(order_id)     [idempotente, ACID]
    ↓
fin_ledger_entries (append-only)
    ↓
fin_wallet_accounts (pending balances)
    ↓
fin_settlements (registro de liquidación)
    ↓
communication event: finance_settlement_created
    ↓
Dashboards (admin / comercio / mensajero)
```

### 2.2 Estados financieros

`PENDING` → `AUTHORIZED` → `CAPTURED` → `HELD` → `SPLIT_PENDING` → `SETTLED` → `PAID`  
Fallas: `FAILED` | `REFUNDED` | `PARTIALLY_REFUNDED` | `CANCELLED`

### 2.3 División del dinero (ejemplo)

| Concepto | Monto |
|----------|-------|
| Cliente paga | $100.000 |
| Producto (subtotal) | $80.000 |
| Envío | $20.000 |
| Comisión UrabApp 10% | $8.000 |
| Comercio (`business_net`) | $72.000 |
| Mensajero (`rider_payout`) | $20.000 base + propina |
| Plataforma (`commission` + margen envío) | según `recalculate_order_economics` |

Reglas en `fin_commission_rules` (global, municipio, comercio, categoría, campaña).

### 2.4 Payment Provider

```javascript
const provider = getPaymentProvider(); // env: VITE_PAYMENT_PROVIDER=wompi|epayco|mock
await provider.createCheckout({ orderId, amount, currency });
await provider.capture(paymentId);
await provider.refund(paymentId, amount);
provider.supportsSplit(); // si true → SPLIT_PENDING en settlement
```

El resto del sistema **nunca** importa Wompi/ePayco directamente.

---

## 3. Esquema de base de datos (migración `085_financial_engine.sql`)

| Tabla | Propósito |
|-------|-----------|
| `fin_wallet_accounts` | Billetera por `owner_type` + `owner_id` |
| `fin_ledger_entries` | Libro mayor (solo INSERT) |
| `fin_settlements` | Liquidación por pedido entregado |
| `fin_settlement_lines` | Líneas de split por actor |
| `fin_commission_rules` | Reglas de comisión |
| `fin_payout_batches` | Lotes de liquidación |
| `fin_payout_batch_items` | Ítems del lote |
| `fin_payment_intents` | Intento de pago + proveedor |
| `fin_audit_log` | Auditoría append-only |
| `fin_idempotency_keys` | Anti doble liquidación |

### 3.1 RPCs principales

- `fin_settle_order(p_order_id)` — llamado por trigger en `delivered`
- `fin_get_wallet_dashboard(p_owner_type, p_owner_id)` — UI mensajero/comercio
- `fin_get_platform_dashboard()` — admin
- `fin_create_payout_batch(p_cycle, p_owner_type)` — lotes
- `fin_process_refund(p_order_id, p_reason)` — reembolsos
- `fin_resolve_commission(p_order_id)` — comisión aplicada

### 3.2 Compatibilidad legacy

- `courier_wallet` se sincroniza desde `fin_wallet_accounts` (mensajero).
- `get_courier_wallet_summary()` actualizado para leer Financial Engine.
- Trigger `trg_credit_courier_wallet` **reemplazado** por `trg_fin_settle_on_delivery`.

---

## 4. Escalabilidad y seguridad

- **Idempotencia**: `fin_idempotency_keys` + `UNIQUE(order_id)` en settlements.
- **ACID**: funciones `SECURITY DEFINER` con `FOR UPDATE` en wallets.
- **Append-only**: triggers bloquean UPDATE/DELETE en ledger y audit.
- **RLS**: cada actor ve solo su wallet y ledger.
- **Concurrencia**: bloqueo optimista vía `updated_at` en wallets.

---

## 5. Roadmap post-MVP

1. Implementar split nativo Wompi cuando `supportsSplit()`.
2. ePaycoProvider producción.
3. Reconciliación bancaria automática.
4. Reportes DIAN / facturación electrónica.
5. Worker de lotes (pg_cron) para ciclos de payout.

---

## 6. Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `VITE_PAYMENT_PROVIDER` | `wompi` \| `epayco` \| `mock` |
| `WOMPI_*` | Secrets existentes (edge functions) |
| `EPAYCO_*` | Futuro (no requerido hoy) |
