import { useState, useMemo } from 'react';
import { useOrderEventsRealtime } from '@/hooks/useOrderEventsRealtime';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import OrderChat from '../../../components/messaging/OrderChat';
import { updateOrderStatus, cancelOrderByBusiness } from '../../../services/order.service';
import { ORDER_STATUS_LABELS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import { canBusinessCancelOrder } from '../../../utils/order-client';
import {
  isActiveOrder,
  isHistoryOrder,
  formatPaymentStatus,
  parseCustomerPhoneFromNotes,
} from '../../../utils/order-filters';
import {
  formatOrderTime,
  paymentMethodLabel,
  ORDER_STATUS_VARIANT,
  invalidateBusinessOrderQueries,
} from '../../../utils/order-display';
import { toast } from '../../../utils/toast';
import { markOrderReady, getOrderEvents } from '../../../services/order-tracking.service';
import BusinessOrderTrackingMap from '@/components/tracking/BusinessOrderTrackingMap';
import OrderTimeline from '@/components/tracking/OrderTimeline';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { StatusBadge } from '@/design-system/patterns/MetricCard';
import { cn } from '@/lib/utils';

/** El comercio avanza hasta preparación; el mensajero marca "en camino" y "entregado". */
const NEXT_STATUS = {
  pending: 'accepted',
  accepted: 'preparing',
};

const ACTION_LABELS = {
  accepted: 'Aceptar pedido',
  preparing: 'Iniciar preparación y buscar mensajero',
  delivered: 'Confirmar entrega',
};

const HISTORY_PAGE = 20;

function OrderItemsList({ items = [] }) {
  if (!items.length) {
    return <p className="text-sm text-muted">Sin detalle de productos</p>;
  }

  return (
    <ul className="divide-y divide-border/60">
      {items.map((item) => {
        const modifiers = Array.isArray(item.modifiers_json) ? item.modifiers_json : [];
        const lineTotal = item.total_price ?? (Number(item.unit_price || item.price) * (item.quantity || 1));
        return (
          <li key={item.id || `${item.product_id}-${item.name}`} className="flex justify-between gap-3 py-2.5 text-sm">
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <AppIcon name={item.emoji || 'food'} size="xs" />
                  {item.name}
                  <span className="text-muted">×{item.quantity}</span>
                </span>
              </p>
              {modifiers.length > 0 && (
                <p className="mt-0.5 text-xs text-muted">
                  {modifiers.map((m) => m.name).join(' · ')}
                </p>
              )}
              {item.notes && (
                <p className="mt-0.5 text-xs text-muted">{item.notes}</p>
              )}
            </div>
            <span className="shrink-0 font-semibold text-foreground">{formatCOP(lineTotal)}</span>
          </li>
        );
      })}
    </ul>
  );
}

function BusinessOrderCard({
  order,
  onStatusChange,
  onCancelRequest,
  onMarkReady,
  pendingOrderId,
}) {
  const [expanded, setExpanded] = useState(['pending', 'accepted', 'preparing'].includes(order.status));
  useOrderEventsRealtime(expanded ? order.id : null);
  const { data: orderEvents = [] } = useQuery({
    queryKey: ['order-events', order.id],
    queryFn: () => getOrderEvents(order.id),
    enabled: expanded && !!order.id,
  });
  const items = order.order_items || order.items || [];
  const nextStatus = NEXT_STATUS[order.status];
  const canCancel = canBusinessCancelOrder(order);
  const isBusy = pendingOrderId === order.id;
  const customerPhone = parseCustomerPhoneFromNotes(order.notes);

  const needsAction = order.status === 'pending' || order.status === 'accepted';

  return (
    <SurfaceCard
      className={cn(
        'overflow-hidden rounded-[var(--radius-component)]',
        order.status === 'pending' && 'border-urgency/40 ring-2 ring-urgency/20',
        order.status === 'accepted' && 'border-primary/30 ring-1 ring-primary/15',
      )}
    >
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-display text-base font-bold text-foreground">
              {order.order_number || `#${order.id?.slice(0, 8)}`}
            </p>
            <StatusBadge status={ORDER_STATUS_VARIANT[order.status] || 'muted'}>
              {ORDER_STATUS_LABELS[order.status]}
            </StatusBadge>
            {order.status === 'pending' && (
              <span className="rounded-full bg-urgency/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-urgency">
                Acción
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted">{formatOrderTime(order.created_at)}</p>
          {customerPhone && (
            <p className="mt-1 text-xs font-medium text-foreground">Teléfono: {customerPhone}</p>
          )}
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{order.dest_address}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-lg font-bold tabular-nums text-primary">{formatCOP(order.total)}</p>
          <p className="text-xs text-muted">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
          <AppIcon
            name="chevronDown"
            size="xs"
            className={cn('ml-auto mt-1 text-muted transition-transform', expanded && 'rotate-180')}
          />
        </div>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-border/60 pt-4">
          <div>
            <p className="text-tagline text-muted">Productos del pedido</p>
            <OrderItemsList items={items} />
          </div>

          <div className="grid gap-2 rounded-xl bg-muted/30 p-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted">Entrega</p>
              <p className="font-medium text-foreground">{order.dest_address}</p>
              {order.dest_municipio && (
                <p className="text-xs text-muted">{order.dest_municipio}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-muted">Pago</p>
              <p className="font-medium text-foreground">{paymentMethodLabel(order.payment_method)}</p>
              <p className="text-xs text-muted">{formatPaymentStatus(order.payment_status)}</p>
            </div>
          </div>

          {order.status === 'on_the_way' && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm dark:border-emerald-900 dark:bg-emerald-950/30">
              <p className="font-semibold text-emerald-900 dark:text-emerald-100">En camino con el mensajero</p>
              <p className="mt-0.5 text-emerald-800 dark:text-emerald-200">
                El cliente verá el avance en su app. La entrega la confirma el mensajero.
              </p>
            </div>
          )}

          {order.status === 'accepted' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
              <p className="font-semibold text-amber-900 dark:text-amber-100">Pedido confirmado</p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-200">
                Cuando inicies la preparación, Urabapp buscará un mensajero. El mensajero solo puede aceptar cuando marques &quot;en preparación&quot;.
              </p>
            </div>
          )}

          {order.status === 'preparing' && (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm dark:border-sky-900 dark:bg-sky-950/30">
              <p className="font-semibold text-sky-900 dark:text-sky-100">
                {order.drivers?.name ? `Mensajero: ${order.drivers.name}` : 'Buscando mensajero…'}
              </p>
              <p className="mt-0.5 text-sky-800 dark:text-sky-200">
                {order.drivers?.name
                  ? 'El mensajero que aceptó recogerá el pedido en tu local.'
                  : 'Al marcar en preparación, Urabapp notifica a mensajeros cercanos. El que acepte vendrá a recoger.'}
              </p>
            </div>
          )}

          {order.notes && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900 dark:bg-amber-950/30">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">
                Notas del cliente
              </p>
              <p className="mt-1 text-amber-950 dark:text-amber-100">{order.notes}</p>
            </div>
          )}

          <div className="space-y-1 text-sm">
            {order.subtotal > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCOP(order.subtotal)}</span>
              </div>
            )}
            {order.delivery_fee > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Domicilio</span>
                <span>{formatCOP(order.delivery_fee)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-primary">
                <span>Descuento</span>
                <span>-{formatCOP(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground">
              <span>Total</span>
              <span>{formatCOP(order.total)}</span>
            </div>
            {order.business_net != null && (
              <p className="text-xs text-muted">
                Tu neto estimado: {formatCOP(order.business_net)}
                {order.commission_amount != null && ` · Comisión: ${formatCOP(order.commission_amount)}`}
              </p>
            )}
          </div>

          <div
            className={cn(
              'flex flex-col gap-2 sm:flex-row',
              needsAction && 'sticky bottom-20 z-10 rounded-[var(--radius-component)] border border-border/50 bg-card/95 p-2 shadow-soft backdrop-blur-md sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none sm:backdrop-blur-none',
            )}
          >
            {nextStatus && (
              <Button
                className="h-12 min-h-11 flex-1 text-base font-bold"
                disabled={!!pendingOrderId}
                onClick={() => onStatusChange(order.id, nextStatus)}
              >
                {isBusy ? 'Actualizando…' : (ACTION_LABELS[nextStatus] || `Marcar como ${ORDER_STATUS_LABELS[nextStatus]}`)}
              </Button>
            )}
            {order.status === 'preparing' && (
              <Button
                variant="outline"
                className="h-12 min-h-11 flex-1"
                disabled={!!pendingOrderId}
                onClick={() => onMarkReady(order.id)}
              >
                Marcar listo para recoger
              </Button>
            )}
            {canCancel && (
              <Button
                variant="outline"
                className="min-h-11 flex-1 text-destructive ring-destructive/20 hover:bg-destructive/5"
                disabled={!!pendingOrderId}
                onClick={() => onCancelRequest(order)}
              >
                Cancelar pedido
              </Button>
            )}
          </div>

          {orderEvents.length > 0 && <OrderTimeline events={orderEvents} compact />}

          <BusinessOrderTrackingMap order={order} />

          <OrderChat order={order} compact />
        </div>
      )}
    </SurfaceCard>
  );
}

export default function BusinessOrdersPanel({ businessId, orders = [], isLoading }) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('active');
  const [historyLimit, setHistoryLimit] = useState(HISTORY_PAGE);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [pendingOrderId, setPendingOrderId] = useState(null);

  const activeOrders = useMemo(() => orders.filter(isActiveOrder), [orders]);
  const historyOrders = useMemo(() => orders.filter(isHistoryOrder), [orders]);
  const visibleHistory = historyOrders.slice(0, historyLimit);
  const visibleOrders = filter === 'active' ? activeOrders : visibleHistory;

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onMutate: ({ orderId }) => setPendingOrderId(orderId),
    onSuccess: () => {
      invalidateBusinessOrderQueries(queryClient, businessId);
      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      toast('Estado actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
    onSettled: () => setPendingOrderId(null),
  });

  const readyMutation = useMutation({
    mutationFn: (orderId) => markOrderReady(orderId),
    onMutate: (orderId) => setPendingOrderId(orderId),
    onSuccess: () => {
      invalidateBusinessOrderQueries(queryClient, businessId);
      queryClient.invalidateQueries({ queryKey: ['order-events'] });
      toast('Pedido marcado como listo');
    },
    onError: (err) => toast(err.message, 'error'),
    onSettled: () => setPendingOrderId(null),
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId) => cancelOrderByBusiness(orderId, businessId),
    onMutate: (orderId) => setPendingOrderId(orderId),
    onSuccess: () => {
      invalidateBusinessOrderQueries(queryClient, businessId);
      setCancelTarget(null);
      toast('Pedido cancelado');
    },
    onError: (err) => toast(err.message, 'error'),
    onSettled: () => setPendingOrderId(null),
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFilter('active')}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
            filter === 'active'
              ? 'bg-secondary text-secondary-foreground shadow-soft'
              : 'bg-card text-muted ring-1 ring-border/50'
          }`}
        >
          Activos ({activeOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('history')}
          className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
            filter === 'history'
              ? 'bg-secondary text-secondary-foreground shadow-soft'
              : 'bg-card text-muted ring-1 ring-border/50'
          }`}
        >
          Historial ({historyOrders.length})
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader /></div>
      ) : visibleOrders.length === 0 ? (
        <SurfaceCard className="py-12 text-center">
          <AppIcon name="package" size="2xl" className="mx-auto text-muted" />
          <p className="mt-3 font-semibold text-foreground">
            {filter === 'active' ? 'Sin pedidos activos' : 'Sin historial aún'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {filter === 'active'
              ? 'Cuando un cliente compre en tu tienda, el pedido aparecerá aquí al instante.'
              : 'Los pedidos entregados o cancelados se listan en esta sección.'}
          </p>
        </SurfaceCard>
      ) : (
        <>
          {filter === 'active' && activeOrders.some((o) => o.status === 'pending') && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-900 dark:bg-amber-950/40">
              <p className="font-semibold text-amber-900 dark:text-amber-100">
                Tienes {activeOrders.filter((o) => o.status === 'pending').length} pedido(s) por aceptar
              </p>
              <p className="mt-0.5 text-amber-800 dark:text-amber-200">
                Acepta y actualiza el estado para que el cliente y el mensajero estén al tanto.
              </p>
            </div>
          )}

          <SectionTitle>
            {filter === 'active' ? 'Pedidos en curso' : 'Historial reciente'}
          </SectionTitle>

          {visibleOrders.map((order) => (
            <BusinessOrderCard
              key={order.id}
              order={order}
              pendingOrderId={pendingOrderId}
              onStatusChange={(orderId, status) => statusMutation.mutate({ orderId, status })}
              onCancelRequest={setCancelTarget}
              onMarkReady={(orderId) => readyMutation.mutate(orderId)}
            />
          ))}

          {filter === 'history' && historyOrders.length > historyLimit && (
            <Button variant="outline" className="w-full" onClick={() => setHistoryLimit((n) => n + HISTORY_PAGE)}>
              Cargar más ({historyOrders.length - historyLimit} restantes)
            </Button>
          )}
        </>
      )}

      <ConfirmModal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="¿Cancelar pedido?"
        message={`El cliente será notificado. Pedido ${cancelTarget?.order_number || ''}.`}
        confirmLabel="Sí, cancelar"
        loading={cancelMutation.isPending}
        onConfirm={() => cancelTarget && cancelMutation.mutate(cancelTarget.id)}
      />
    </div>
  );
}
