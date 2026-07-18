import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, Navigate } from 'react-router-dom';
import { PageState } from '@/design-system/patterns/PageState';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import { renderRiderProfileGate } from '../components/RiderProfileGate';
import Button from '@/components/ui/Button';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { getDriverOrders } from '@/services/order.service';
import { setCourierPhase, isCourierOrder } from '@/services/courier.service';
import DeliveryOtpPanel from '@/components/courier/DeliveryOtpPanel';
import OrderChat from '@/components/messaging/OrderChat';
import RiderDeliveryMap from '../components/RiderDeliveryMap';
import DeliveryProofCapture from '@/components/tracking/DeliveryProofCapture';
import DeliverySignatureCapture from '@/components/tracking/DeliverySignatureCapture';
import DeliveryQrVerify from '@/components/tracking/DeliveryQrVerify';
import OrderIncidentReport from '@/components/tracking/OrderIncidentReport';
import NavigationLaunchBar from '@/components/tracking/NavigationLaunchBar';
import { useRiderLocationShare } from '@/hooks/useRiderLocationShare';
import { registerRiderTracking } from '@/services/socket.service';
import { ORDER_STATUS_LABELS, ECONOMICS } from '@/utils/constants';
import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { toast } from '@/utils/toast';
import { riderStoreCheckpoint } from '@/services/order-tracking.service';
import { DELIVERY_PHASES } from '../constants';

function resolvePrimaryAction({ order, queryClient, riderCoords }) {
  if (!order || ['delivered', 'cancelled'].includes(order.status)) return null;

  if (isCourierOrder(order) && order.status === 'accepted') {
    if (order.courier_phase === 'arriving_pickup') {
      return {
        label: 'Marcar recogido',
        onClick: async () => {
          await setCourierPhase(order.id, 'picked_up', 'picked_up');
          queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
        },
      };
    }
    return {
      label: 'Voy a recoger',
      onClick: () => setCourierPhase(order.id, 'arriving_pickup', 'arriving_pickup').then(() => {
        queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      }),
    };
  }

  if (!isCourierOrder(order) && order.business_id && order.status === 'preparing' && order.driver_id) {
    return {
      label: 'Pedido recogido',
      onClick: () => riderStoreCheckpoint(
        order.id,
        'picked_up',
        riderCoords ? { latitude: riderCoords.lat, longitude: riderCoords.lng } : {},
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
        toast('Recogida confirmada');
      }),
    };
  }

  if (order.status === 'on_the_way') {
    return {
      label: 'Confirmar entrega (OTP / QR)',
      scrollTo: 'rider-delivery-handoff',
    };
  }

  return null;
}

export default function RiderDelivery() {
  const { orderId } = useParams();
  const queryClient = useQueryClient();

  const driverQuery = useMyDriverProfile();
  const { data: driver } = driverQuery;

  const { data: orders = [], isLoading: loadingOrders, isFetched: ordersFetched } = useQuery({
    queryKey: ['driver-orders', driver?.id],
    queryFn: () => getDriverOrders(driver.id),
    enabled: !!driver?.id,
    refetchInterval: 3000,
  });

  const order = orders.find((o) => o.id === orderId);

  const deliveryActive = Boolean(
    order && !['delivered', 'cancelled'].includes(order.status),
  );

  const liveGps = useRiderLocationShare({
    driverId: driver?.id,
    orderId: order?.id,
    enabled: Boolean(driver?.id && deliveryActive),
    intervalMs: 3000,
  });

  useEffect(() => {
    if (!driver?.id || !order?.id || !deliveryActive) return undefined;
    let cancelled = false;
    let cleanup = () => {};
    registerRiderTracking(driver.id, order.id).then((fn) => {
      if (cancelled) fn();
      else cleanup = fn;
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [driver?.id, order?.id, deliveryActive]);

  const blocked = renderRiderProfileGate(driverQuery);
  if (blocked) return blocked;

  if (loadingOrders && !ordersFetched) {
    return <PageState type="loading" title="Cargando tu entrega…" />;
  }

  if (!order) return <Navigate to="/domiciliario" replace />;

  const riderCoords = liveGps
    ? { lat: liveGps.latitude, lng: liveGps.longitude }
    : driver?.latitude && driver?.longitude
      ? { lat: Number(driver.latitude), lng: Number(driver.longitude) }
      : null;

  const navTarget = order?.status === 'accepted' || order?.courier_phase === 'arriving_pickup'
    ? {
        latitude: order.pickup_latitude ? Number(order.pickup_latitude) : null,
        longitude: order.pickup_longitude ? Number(order.pickup_longitude) : null,
        address: order.pickup_address,
      }
    : {
        latitude: order.dest_latitude ? Number(order.dest_latitude) : null,
        longitude: order.dest_longitude ? Number(order.dest_longitude) : null,
        address: order.dest_address,
      };

  const currentPhase = isCourierOrder(order) ? order.courier_phase || order.status : order.status;

  const tipAmount = Number(order.tip_amount) || 0;
  const basePayout = Math.max(0, (order.rider_payout ?? ECONOMICS.riderPayout) - tipAmount);
  const primaryAction = resolvePrimaryAction({ order, queryClient, riderCoords });

  const handlePrimary = () => {
    if (!primaryAction) return;
    if (primaryAction.scrollTo) {
      document.getElementById(primaryAction.scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    primaryAction.onClick?.();
  };

  return (
    <div className={`space-y-4 ${deliveryActive && primaryAction ? 'pb-28' : 'pb-8'}`}>
      <PanelHeader
        tag="Entrega activa"
        title={order.order_number || order.id.slice(0, 8)}
        subtitle={ORDER_STATUS_LABELS[order.status]}
      />

      <RiderDeliveryMap order={order} driverCoords={riderCoords} />

      {deliveryActive && (
        <NavigationLaunchBar
          destination={navTarget}
          label="Navegar con Waze o Google Maps"
        />
      )}

      <SurfaceCard className="rounded-[var(--radius-component)]">
        <div className="flex items-center gap-2">
          <AppIcon name="delivery" size="sm" className="text-primary" />
          <p className="text-sm font-bold text-primary">
            {formatCOP(order.rider_payout ?? ECONOMICS.riderPayout)} ganancia total
          </p>
        </div>
        {tipAmount > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Incluye propina del cliente: {formatCOP(tipAmount)} · base {formatCOP(basePayout)}
          </p>
        )}
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Direcciones</p>
          <p className="text-sm font-semibold text-foreground">
            Recoger: {order.pickup_address || order.business?.name || '—'}
          </p>
          <p className="text-sm text-muted-foreground">Entregar: {order.dest_address}</p>
        </div>
      </SurfaceCard>

      <SurfaceCard className="rounded-[var(--radius-component)]">
        <p className="text-xs font-bold uppercase text-muted-foreground">Progreso</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {DELIVERY_PHASES.map((phase) => {
            const active = currentPhase === phase.key || order.status === phase.key;
            return (
              <span
                key={phase.key}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {phase.label}
              </span>
            );
          })}
        </div>
        <div id="rider-delivery-handoff" className="mt-4 flex flex-wrap gap-2">
          {isCourierOrder(order) && order.status === 'accepted' && (
            <Button
              className="min-h-11"
              variant="outline"
              onClick={() => setCourierPhase(order.id, 'arriving_pickup', 'arriving_pickup').then(() => queryClient.invalidateQueries({ queryKey: ['driver-orders'] }))}
            >
              Voy a recoger
            </Button>
          )}
          {isCourierOrder(order) && order.status === 'accepted' && (
            <Button
              className="min-h-11"
              onClick={async () => {
                await setCourierPhase(order.id, 'picked_up', 'picked_up');
                queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
              }}
            >
              Recogido
            </Button>
          )}
          {!isCourierOrder(order) && order.business_id && order.status === 'preparing' && order.driver_id && (
            <>
              <Button
                className="min-h-11"
                variant="outline"
                onClick={() => riderStoreCheckpoint(order.id, 'arrived_at_store', riderCoords ? { latitude: riderCoords.lat, longitude: riderCoords.lng } : {}).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
                  toast('Llegada al comercio registrada');
                })}
              >
                Llegué al comercio
              </Button>
              <Button
                className="min-h-11"
                onClick={() => riderStoreCheckpoint(order.id, 'picked_up', riderCoords ? { latitude: riderCoords.lat, longitude: riderCoords.lng } : {}).then(() => {
                  queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
                  toast('Recogida confirmada');
                })}
              >
                Pedido recogido
              </Button>
            </>
          )}
          {order.status === 'on_the_way' && (
            <>
              <DeliveryOtpPanel orderId={order.id} driverId={driver.id} onVerified={() => queryClient.invalidateQueries({ queryKey: ['driver-orders'] })} />
              <DeliveryQrVerify orderId={order.id} />
              <DeliverySignatureCapture orderId={order.id} />
              <DeliveryProofCapture orderId={order.id} />
              <OrderIncidentReport orderId={order.id} compact />
            </>
          )}
          {order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'on_the_way' && (
            <OrderIncidentReport orderId={order.id} compact />
          )}
        </div>
      </SurfaceCard>

      <OrderChat order={order} />

      <Link to="/domiciliario">
        <Button variant="outline" className="min-h-11 w-full">Volver al panel</Button>
      </Link>

      {deliveryActive && primaryAction && (
        <div
          className="fixed inset-x-0 z-40 border-t border-border/60 bg-card/95 px-4 py-3 shadow-float backdrop-blur-xl"
          style={{ bottom: 'calc(4.25rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <div className="mx-auto flex max-w-lg gap-2">
            <Button className="h-12 min-h-11 flex-1 rounded-[var(--radius-component)] text-base font-bold" onClick={handlePrimary}>
              {primaryAction.label}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
