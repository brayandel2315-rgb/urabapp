import { useParams, useSearchParams } from 'react-router-dom';
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
import { buildLoginRedirect } from '@/utils/auth-routes';
import { Link, useNavigate } from 'react-router-dom';
import OrderChat from '../../../components/messaging/OrderChat';
import { useOrderRealtime } from '../../../hooks/useOrderRealtime';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { useAuthStore } from '../../../store/authStore';
import { STORE } from '@/utils/marketplace-copy';
import { getClientFulfillmentMessage } from '@/utils/order-fulfillment';
import { isCourierOrder } from '../../../services/courier.service';
import UnifiedTrackingPanel from '@/components/tracking/UnifiedTrackingPanel';
import OrderTimeline from '@/components/tracking/OrderTimeline';
import OrderGpsRouteReplay from '@/components/tracking/OrderGpsRouteReplay';
import OrderIncidentReport from '@/components/tracking/OrderIncidentReport';
import DeliveryQrPanel from '@/components/tracking/DeliveryQrPanel';
import OrderEtaHistoryChart from '@/components/tracking/OrderEtaHistoryChart';
import OrderRiderCard from '@/components/tracking/OrderRiderCard';
import DeliveryOtpPanel from '@/components/courier/DeliveryOtpPanel';
import { getOrderEvents } from '@/services/order-tracking.service';
import { useOrderEventsRealtime } from '@/hooks/useOrderEventsRealtime';
import { useDriverLocationRealtime } from '../../../hooks/useDriverLocationRealtime';
import { computeSmartEtaAsync, formatEtaCountdown } from '@/services/tracking-eta.service';
import FareBreakdownCard from '@/components/courier/FareBreakdownCard';
import { startWompiCheckout, isWompiEnabled, isDigitalPayment } from '../../../services/wompi.service';
import { toast } from '../../../utils/toast';

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

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id, user?.id],
    queryFn: () => getOrderById(id, { viewerId: user?.id }),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && status !== 'delivered' && status !== 'cancelled' ? 8000 : false;
    },
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

  const { data: review } = useQuery({
    queryKey: ['review', id],
    queryFn: () => getReviewForOrder(id),
    enabled: !!id && order?.status === 'delivered',
  });

  useOrderRealtime(id);
  useOrderEventsRealtime(id);
  const online = useOnlineStatus();

  const { data: orderEvents = [] } = useQuery({
    queryKey: ['order-events', id],
    queryFn: () => getOrderEvents(id),
    enabled: !!id,
  });

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
          {user ? 'Pedido no encontrado o no tienes permiso para verlo.' : 'Inicia sesión para ver el detalle de tu pedido.'}
        </p>
        {!user && (
          <Link to={buildLoginRedirect(`/pedidos/${id}`)} className="mt-4 block text-center font-semibold text-primary">
            Entrar
          </Link>
        )}
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

  const riderLocation = useDriverLocationRealtime(order?.driver_id, { orderId: id });
  const [smartEta, setSmartEta] = useState(null);

  useEffect(() => {
    if (!isActive || !order?.dest_latitude) {
      setSmartEta(null);
      return;
    }
    let cancelled = false;
    computeSmartEtaAsync({
      riderLat: riderLocation?.latitude,
      riderLng: riderLocation?.longitude,
      destLat: Number(order.dest_latitude),
      destLng: Number(order.dest_longitude),
      municipio: order.dest_municipio,
      orderStatus: order.status,
      routeSeconds: order.eta_seconds,
    }).then((eta) => {
      if (!cancelled) setSmartEta(eta);
    });
    return () => { cancelled = true; };
  }, [
    isActive,
    order?.dest_latitude,
    order?.dest_longitude,
    order?.dest_municipio,
    order?.status,
    order?.eta_seconds,
    riderLocation?.latitude,
    riderLocation?.longitude,
  ]);

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

  return (
    <PageLayout title={order.order_number || 'Pedido'} backTo="/pedidos" maxWidth="lg">
      <div className="space-y-4">
        {!online && isActive && (
          <SurfaceCard variant="accent" className="text-center text-sm font-semibold">
            Sin conexión — el estado se actualizará al reconectar
          </SurfaceCard>
        )}
        {online && isActive && (
          <SurfaceCard variant="highlight" className="text-center text-sm font-semibold text-primary-dark">
            Actualizando en tiempo real…
          </SurfaceCard>
        )}

        <SurfaceCard>
          <p className="text-tagline text-muted">Estado</p>
          <p className={`text-heading text-xl ${isCancelled ? 'text-destructive' : 'text-primary'}`}>
            {ORDER_STATUS_LABELS[order.status]}
          </p>
          {order.payment_method === 'wompi' && (
            <p className="mt-2 text-sm text-muted">
              Pago digital:{' '}
              <Badge variant={order.payment_status === 'paid' ? 'success' : 'muted'}>
                {order.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
              </Badge>
            </p>
          )}
        </SurfaceCard>

        {!isCancelled && ['pending', 'accepted', 'preparing', 'on_the_way'].includes(order.status) && (
          <div className="space-y-3">
            {!order.driver_id && (
              <SurfaceCard className="text-sm font-medium text-primary">
                {getClientFulfillmentMessage(order) || (
                  order.status === 'pending' && order.business_id
                    ? STORE.waitingConfirm
                    : `Buscando mensajero disponible en ${order.dest_municipio}…`
                )}
              </SurfaceCard>
            )}
            {order.driver_id && order.business_id && order.status === 'preparing' && (
              <SurfaceCard className="text-sm font-medium text-primary">
                {STORE.riderAssignedToStore}
              </SurfaceCard>
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
            {smartEta && (
              <SurfaceCard className="ring-1 ring-primary/15">
                <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Tiempo estimado
                </p>
                <p className="mt-1 font-display text-2xl font-black text-primary">
                  {smartEta.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Aprox. {formatEtaCountdown(smartEta.seconds)} restantes
                </p>
              </SurfaceCard>
            )}
          </div>
        )}

        {isCancelled ? (
          <SurfaceCard className="text-center text-sm text-muted">
            Este pedido fue cancelado. Si necesitas ayuda, usa el{' '}
            <Link to="/soporte" className="font-semibold text-primary">centro de soporte</Link>.
          </SurfaceCard>
        ) : (
        <OrderTimeline events={orderEvents} />
        )}

        {order.status === 'on_the_way' && user?.id === order.customer_id && (
          <DeliveryQrPanel orderId={id} />
        )}

        {isActive && order.driver_id && (
          <SurfaceCard className="space-y-3">
            <p className="text-tagline text-muted">Histórico ETA</p>
            <OrderEtaHistoryChart orderId={id} />
          </SurfaceCard>
        )}

        {isActive && order.driver_id && (
          <SurfaceCard className="space-y-3">
            <p className="text-tagline text-muted">Ruta del repartidor</p>
            <OrderGpsRouteReplay
              orderId={id}
              destLat={order.dest_latitude}
              destLng={order.dest_longitude}
            />
          </SurfaceCard>
        )}

        {isActive && user?.id === order.customer_id && (
          <OrderIncidentReport orderId={id} />
        )}

        {order.status === 'on_the_way' && user?.id === order.customer_id && order.delivery_otp && (
          <DeliveryOtpPanel readOnlyCode={order.delivery_otp} />
        )}

        {isCourierOrder(order) && order.fare_breakdown && (
          <FareBreakdownCard
            fare={order.fare_breakdown}
            distanceKm={order.distance_km}
            estimatedMinutes={order.estimated_minutes}
          />
        )}

        <SurfaceCard>
          <p className="text-tagline text-muted">Entrega</p>
          <p className="mt-1 font-semibold text-foreground">{order.dest_address}</p>
          <p className="text-sm text-muted">{order.dest_municipio}</p>
        </SurfaceCard>

        <SurfaceCard>
          <p className="text-tagline text-muted">Resumen</p>
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
              <span className="font-semibold text-foreground">Notas del pedido: </span>
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
            <div className="mt-1 flex justify-between text-sm text-primary">
              <span>Descuento</span>
              <span>-{formatCOP(order.discount)}</span>
            </div>
          )}
          {tipAmount > 0 && (
            <div className="mt-1 flex justify-between text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <AppIcon name="delivery" size="xs" />
                Propina domiciliario
              </span>
              <span>{formatCOP(tipAmount)}</span>
            </div>
          )}
          <div className="mt-3 flex justify-between border-t border-border pt-3 font-bold text-foreground">
            <span>Total</span>
            <span>{formatCOP(order.total)}</span>
          </div>
        </SurfaceCard>

        {order.status === 'delivered' && user?.id === order.customer_id && !review && (
          <ReviewForm order={order} userId={user.id} />
        )}

        {review && (
          <SurfaceCard className="space-y-2">
            <p className="text-tagline text-muted">Tu calificación</p>
            <p className="text-sm text-foreground">Tienda:</p>
            <StarRating value={review.business_rating} readOnly size="sm" />
            {review.driver_rating && (
              <>
                <p className="text-sm text-secondary">Mensajero:</p>
                <StarRating value={review.driver_rating} readOnly size="sm" />
              </>
            )}
          </SurfaceCard>
        )}

        {!isCancelled && user?.id && (
          <OrderChat order={order} />
        )}

        {canCancel && (
          <Button
            variant="ghost"
            className="w-full text-red-600"
            disabled={cancelMutation.isPending || isCancelled}
            onClick={() => setConfirmCancel(true)}
          >
            Cancelar pedido
          </Button>
        )}

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

        {canReorder && (
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
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
            }}
          >
            Volver a pedir
          </Button>
        )}

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

        {isDigitalPayment(order.payment_method) && order.payment_status !== 'paid' && user?.id === order.customer_id && (
          <div className="space-y-2">
            {isWompiEnabled() && (
              <Button
                className="w-full"
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
            <Button
              variant="outline"
              className="w-full"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['order', id] })}
            >
              Actualizar estado del pago
            </Button>
          </div>
        )}

        <Link to="/soporte" className="block">
          <Button variant="outline" className="w-full">
            Ayuda y soporte en la app
          </Button>
        </Link>
        <Button
          variant="outline"
          className="w-full"
          onClick={async () => {
            const ok = await copyToClipboard(buildOrderUrl(order.id));
            toast(ok ? 'Link copiado' : 'No se pudo copiar', ok ? 'info' : 'error');
          }}
        >
          Copiar link del pedido
        </Button>
      </div>
    </PageLayout>
  );
}
