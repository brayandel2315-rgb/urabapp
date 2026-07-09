import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { Badge } from '@/design-system/ui/badge';
import { getOrderById, cancelOrderByCustomer } from '../../../services/order.service';
import { getBusinessById } from '../../../services/business.service';
import { canCustomerCancelOrder, orderItemsToCartLines, FULFILLMENT_STATUS_LABELS } from '../../../utils/order-client';
import { patchOrderStatusInCache, invalidateOrderQueries } from '../../../utils/order-cache';
import { useCartStore } from '../../../store/cartStore';
import { getReviewForOrder } from '../../../services/review.service';
import Button from '../../../components/ui/Button';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import CartStoreSwitchModal from '@/components/cart/CartStoreSwitchModal';
import Loader from '../../../components/ui/Loader';
import ReviewForm from '../../../components/reviews/ReviewForm';
import StarRating from '../../../components/reviews/StarRating';
import AppIcon from '@/design-system/icons/AppIcon';
import { ORDER_STATUS_LABELS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import { buildOrderUrl, copyToClipboard } from '../../../utils/app';
import OrderChat from '../../../components/messaging/OrderChat';
import { useOrderRealtime } from '../../../hooks/useOrderRealtime';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useAuthStore } from '../../../store/authStore';
import { STORE } from '@/utils/marketplace-copy';
import { getClientFulfillmentMessage } from '@/utils/order-fulfillment';
import { isCourierOrder } from '../../../services/courier.service';
import UnifiedTrackingPanel from '@/components/tracking/UnifiedTrackingPanel';
import OrderTimeline from '@/components/tracking/OrderTimeline';
import OrderIncidentReport from '@/components/tracking/OrderIncidentReport';
import DeliveryQrPanel from '@/components/tracking/DeliveryQrPanel';
import OrderRiderCard from '@/components/tracking/OrderRiderCard';
import ClientDeliveryHandoffPanel from '@/components/tracking/ClientDeliveryHandoffPanel';
import { getOrderEvents } from '@/services/order-tracking.service';
import { useOrderEventsRealtime } from '@/hooks/useOrderEventsRealtime';
import FareBreakdownCard from '@/components/courier/FareBreakdownCard';
import ServiceJourneyShowcase from '@/components/services/ServiceJourneyShowcase';
import { startWompiCheckout, isWompiEnabled, isDigitalPayment } from '../../../services/wompi.service';
import { toast } from '../../../utils/toast';

function courierJourneyFromOrder(order) {
  const phase = order?.courier_phase;
  if (order?.status === 'delivered') return 'done';
  if (['picked_up', 'en_route'].includes(phase) || order?.status === 'on_the_way') return 'track';
  if (['assigned', 'arriving_pickup'].includes(phase)) return 'match';
  if (phase === 'searching' || order?.status === 'pending') return 'match';
  return 'plan';
}

function fulfillmentHint(order) {
  if (!order || order.driver_id) return null;
  return getClientFulfillmentMessage(order) || (
    order.status === 'pending' && order.business_id
      ? STORE.waitingConfirm
      : `Buscando mensajero en ${order.dest_municipio}…`
  );
}

function OrderDetailActions({
  order,
  user,
  canCancel,
  canReorder,
  payingWompi,
  setPayingWompi,
  setConfirmCancel,
  onReorder,
  onRefreshPayment,
  onCopyLink,
}) {
  const showWompi = isDigitalPayment(order.payment_method)
    && order.payment_status !== 'paid'
    && user?.id === order.customer_id;

  return (
    <div className="space-y-3 border-t border-[#D5E3EF] pt-4">
      {showWompi && isWompiEnabled() && (
        <Button
          className="w-full bg-[#0E6BA8] hover:bg-[#0B5A8C]"
          disabled={payingWompi}
          onClick={async () => {
            setPayingWompi(true);
            try {
              const { url } = await startWompiCheckout(order.id);
              if (url) window.location.href = url;
              else toast('No se pudo abrir el pago', 'error');
            } catch (err) {
              toast(err.message, 'error');
            } finally {
              setPayingWompi(false);
            }
          }}
        >
          {payingWompi ? 'Abriendo pago…' : 'Pagar con Wompi'}
        </Button>
      )}

      {canReorder && (
        <Button variant="outline" className="w-full" onClick={onReorder}>
          Volver a pedir
        </Button>
      )}

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
        {canCancel && (
          <button
            type="button"
            className="font-semibold text-destructive"
            onClick={() => setConfirmCancel(true)}
          >
            Cancelar pedido
          </button>
        )}
        {showWompi && (
          <button
            type="button"
            className="font-semibold text-[#0E6BA8]"
            onClick={onRefreshPayment}
          >
            Actualizar pago
          </button>
        )}
        <Link to="/soporte" className="font-semibold text-[#0E6BA8]">
          Ayuda
        </Link>
        <button
          type="button"
          className="font-semibold text-[#4A6278]"
          onClick={onCopyLink}
        >
          Copiar link
        </button>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const setCartFromReorder = useCartStore((s) => s.setCartFromReorder);
  const queryClient = useQueryClient();
  const [payingWompi, setPayingWompi] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [storeConflict, setStoreConflict] = useState(null);
  const pendingReorderRef = useRef(null);
  const online = useOnlineStatus();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id, user?.id],
    queryFn: () => getOrderById(id, { viewerId: user?.id }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && status !== 'delivered' && status !== 'cancelled' ? 8000 : false;
    },
  });

  useOrderRealtime(id);
  useOrderEventsRealtime(id);

  const { data: review } = useQuery({
    queryKey: ['review', id],
    queryFn: () => getReviewForOrder(id),
    enabled: !!id && order?.status === 'delivered',
  });

  const { data: orderEvents = [] } = useQuery({
    queryKey: ['order-events', id],
    queryFn: () => getOrderEvents(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (searchParams.get('payment') !== 'return') return undefined;
    toast('Pago en proceso — te avisamos cuando se confirme');
    queryClient.invalidateQueries({ queryKey: ['order', id] });

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      if (attempts >= 20) clearInterval(interval);
    }, 3000);

    return () => clearInterval(interval);
  }, [searchParams, id, queryClient]);

  useEffect(() => {
    if (order?.payment_status === 'paid' && searchParams.get('payment') === 'return') {
      toast('¡Pago confirmado!');
    }
  }, [order?.payment_status, searchParams]);

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrderByCustomer(id, user.id),
    onMutate: () => {
      setConfirmCancel(false);
      const previous = queryClient.getQueryData(['order', id, user?.id]);
      patchOrderStatusInCache(queryClient, id, 'cancelled', user?.id);
      return { previous };
    },
    onSuccess: (updated) => {
      if (updated) {
        queryClient.setQueryData(['order', id, user?.id], updated);
        patchOrderStatusInCache(queryClient, id, 'cancelled', user?.id, updated);
      }
      invalidateOrderQueries(queryClient, id, user?.id);
      toast('Pedido cancelado');
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['order', id, user?.id], ctx.previous);
      }
      toast(err.message, 'error');
    },
  });

  const finishReorder = (business, lines, options = {}) => {
    const result = setCartFromReorder(business, lines, options);
    if (result.conflict) {
      pendingReorderRef.current = { business, lines };
      setStoreConflict(result.conflict);
      return;
    }
    if (result.error) {
      toast(result.error, 'error');
      return;
    }
    toast('Productos agregados al carrito');
    navigate('/carrito');
  };

  const handleReorder = async () => {
    if (!order?.business_id) {
      toast('No se puede repetir este pedido', 'error');
      return;
    }
    try {
      const business = await getBusinessById(order.business_id);
      if (!business) {
        toast('La tienda ya no está disponible', 'error');
        return;
      }
      const lines = orderItemsToCartLines(order.order_items);
      finishReorder(business, lines);
    } catch (err) {
      toast(err.message || 'No se pudo repetir el pedido', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#F7FAFC]">
        <Loader size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <PageLayout title="Pedido" backTo="/pedidos" maxWidth="lg">
        <p className="py-8 text-center text-[#4A6278]">
          Pedido no encontrado o no tienes permiso para verlo.
        </p>
      </PageLayout>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const canCancel = canCustomerCancelOrder(order, user?.id);
  const canReorder = ['delivered', 'cancelled'].includes(order.status) && order.order_items?.length;
  const isActive = order.status !== 'delivered' && !isCancelled;
  const tipAmount = Number(order.tip_amount) || 0;
  const deliveryFee = Number(order.delivery_fee) || 0;
  const subtotal = Number(order.subtotal) || 0;
  const hint = fulfillmentHint(order);
  const showTracking = !isCancelled && ['pending', 'accepted', 'preparing', 'on_the_way'].includes(order.status);

  return (
    <PageLayout title={order.order_number || 'Pedido'} backTo="/pedidos" maxWidth="xl">
      <div className="client-page-split client-page-split--checkout">
        <div className="min-w-0 space-y-4">
        {!online && isActive && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center text-sm text-[#4A6278]">
            Sin conexión — el estado se actualizará al reconectar
          </p>
        )}

        <SurfaceCard className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant={isCancelled ? 'destructive' : 'success'}>
              {ORDER_STATUS_LABELS[order.status]}
            </Badge>
            {order.payment_method === 'wompi' && (
              <Badge variant={order.payment_status === 'paid' ? 'success' : 'muted'}>
                {order.payment_status === 'paid' ? 'Pagado' : 'Pago pendiente'}
              </Badge>
            )}
          </div>
          <p className="font-display text-2xl font-bold text-[#0D2B45]">{formatCOP(order.total)}</p>
          {hint && (
            <p className="text-sm text-[#4A6278]">{hint}</p>
          )}
          {order.driver_id && order.business_id && order.status === 'preparing' && (
            <p className="text-sm text-[#4A6278]">{STORE.riderAssignedToStore}</p>
          )}
        </SurfaceCard>

        {showTracking && (
          <div className="space-y-3">
            {isCourierOrder(order) && (
              <ServiceJourneyShowcase
                variant="courier"
                activeStep={courierJourneyFromOrder(order)}
                compact
              />
            )}
            <UnifiedTrackingPanel
              type={isCourierOrder(order) ? 'courier' : 'order'}
              order={order}
              courierPhase={order.courier_phase}
              viewer="client"
            />
            {order.driver_id && (
              <OrderRiderCard
                order={order}
                onReport={() => navigate('/soporte')}
              />
            )}
          </div>
        )}

        {isCancelled ? (
          <SurfaceCard className="text-center text-sm text-muted">
            Este pedido fue cancelado. Si necesitas ayuda, usa el{' '}
            <Link to="/soporte" className="font-semibold text-[#0E6BA8]">centro de soporte</Link>.
          </SurfaceCard>
        ) : (
          <OrderTimeline events={orderEvents} />
        )}

        {order.status === 'on_the_way' && user?.id === order.customer_id && (
          <>
            <ClientDeliveryHandoffPanel orderId={id} />
            <DeliveryQrPanel orderId={id} />
          </>
        )}

        {isActive && user?.id === order.customer_id && (
          <OrderIncidentReport orderId={id} />
        )}

        {isCourierOrder(order) && order.fare_breakdown && (
          <FareBreakdownCard
            fare={order.fare_breakdown}
            distanceKm={order.distance_km}
            estimatedMinutes={order.estimated_minutes}
          />
        )}

        {!isCancelled && user?.id && (
          <OrderChat order={order} />
        )}
        </div>

        <aside className="client-sticky-panel space-y-4">
        <SurfaceCard className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A6278]">Entrega</p>
            <p className="mt-1 font-semibold text-[#0D2B45]">{order.dest_address}</p>
            <p className="text-sm text-[#4A6278]">{order.dest_municipio}</p>
          </div>

          <div className="border-t border-[#D5E3EF] pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A6278]">Resumen</p>
            {(order.items || order.order_items || []).map((item) => {
              const fulfillment = item.fulfillment_status;
              const fulfillmentLabel = FULFILLMENT_STATUS_LABELS[fulfillment];
              return (
                <div key={item.productId || item.id} className="mt-2 flex justify-between gap-2 text-sm">
                  <span className="inline-flex min-w-0 flex-1 flex-col gap-1">
                    <span className="inline-flex items-center gap-2">
                      <AppIcon name={item.emoji || 'food'} size="xs" />
                      <span className={fulfillment === 'unavailable' || fulfillment === 'cancelled' ? 'line-through text-muted' : ''}>
                        {item.name} x{item.quantity}
                      </span>
                    </span>
                    {fulfillmentLabel && fulfillment !== 'confirmed' && fulfillment !== 'pending' && (
                      <Badge variant={fulfillment === 'unavailable' ? 'destructive' : 'muted'} className="w-fit text-[10px]">
                        {fulfillmentLabel}
                      </Badge>
                    )}
                  </span>
                  <span className={fulfillment === 'unavailable' || fulfillment === 'cancelled' ? 'line-through text-muted' : ''}>
                    {formatCOP(item.total_price || item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
            {order.notes && (
              <p className="mt-3 rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Notas: </span>
                {order.notes}
              </p>
            )}
            {subtotal > 0 && (
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
            )}
            {deliveryFee > 0 && (
              <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                <span>Domicilio</span>
                <span>{formatCOP(deliveryFee)}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="mt-1 flex justify-between text-sm text-[#0E6BA8]">
                <span>Descuento</span>
                <span>-{formatCOP(order.discount)}</span>
              </div>
            )}
            {tipAmount > 0 && (
              <div className="mt-1 flex justify-between text-sm text-muted-foreground">
                <span>Propina</span>
                <span>{formatCOP(tipAmount)}</span>
              </div>
            )}
            <div className="mt-3 flex justify-between border-t border-[#D5E3EF] pt-3 font-bold text-[#0D2B45]">
              <span>Total</span>
              <span>{formatCOP(order.total)}</span>
            </div>
          </div>
        </SurfaceCard>

        {order.status === 'delivered' && user?.id === order.customer_id && !review && (
          <ReviewForm order={order} userId={user.id} />
        )}

        {review && (
          <SurfaceCard className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#4A6278]">Tu calificación</p>
            <p className="text-sm text-foreground">Tienda:</p>
            <StarRating value={review.business_rating} readOnly size="sm" />
            {review.driver_rating && (
              <>
                <p className="text-sm text-foreground">Mensajero:</p>
                <StarRating value={review.driver_rating} readOnly size="sm" />
              </>
            )}
          </SurfaceCard>
        )}

        <OrderDetailActions
          order={order}
          user={user}
          canCancel={canCancel}
          canReorder={canReorder}
          payingWompi={payingWompi}
          setPayingWompi={setPayingWompi}
          setConfirmCancel={setConfirmCancel}
          onReorder={handleReorder}
          onRefreshPayment={() => queryClient.invalidateQueries({ queryKey: ['order', id] })}
          onCopyLink={async () => {
            const ok = await copyToClipboard(buildOrderUrl(order.id));
            toast(ok ? 'Link copiado' : 'No se pudo copiar', ok ? 'info' : 'error');
          }}
        />
        </aside>
      </div>

        <ConfirmModal
          open={confirmCancel && canCancel}
          onClose={() => setConfirmCancel(false)}
          title="¿Cancelar pedido?"
          message={STORE.preparingCancel}
          confirmLabel="Sí, cancelar"
          loading={cancelMutation.isPending}
          onConfirm={() => {
            if (!canCancel || cancelMutation.isPending) return;
            cancelMutation.mutate();
          }}
        />

        <CartStoreSwitchModal
          open={Boolean(storeConflict)}
          conflict={storeConflict}
          onClose={() => {
            pendingReorderRef.current = null;
            setStoreConflict(null);
          }}
          onConfirm={() => {
            const pending = pendingReorderRef.current;
            pendingReorderRef.current = null;
            setStoreConflict(null);
            if (pending) finishReorder(pending.business, pending.lines, { replaceCart: true });
          }}
        />
    </PageLayout>
  );
}
