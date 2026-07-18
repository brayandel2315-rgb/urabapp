import { useState, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import { getDriverOrders, updateOrderStatus } from '../../../services/order.service';
import {
  getPendingCourierOffers,
  acceptCourierOffer,
  rejectCourierOffer,
  setCourierPhase,
  isCourierOrder,
} from '../../../services/courier.service';
import {
  getPendingShipmentAssignments,
  acceptShipmentAssignment,
  rejectShipmentAssignment,
  getDriverShipments,
  advanceShipmentStatus,
} from '../../../services/shipment.service';
import {
  getRiderStats,
} from '../../../services/rider.service';
import {
  setCourierAvailability,
  getCourierWalletSummary,
  logOfferRejection,
} from '../../../services/courier-panel.service';
import { useRiderLocationShare } from '../../../hooks/useRiderLocationShare';
import { useCourierOffersRealtime } from '../../../hooks/useCourierOffersRealtime';
import { useShipmentAssignmentsRealtime } from '../../../hooks/useShipmentAssignmentsRealtime';
import { useAuthStore } from '../../../store/authStore';
import { supabase } from '../../../lib/supabase';
import { ORDER_STATUS_LABELS, ECONOMICS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import OrderChat from '../../../components/messaging/OrderChat';
import CourierOfferModal from '@/components/courier/CourierOfferModal';
import ShipmentOfferModal from '@/components/shipment/ShipmentOfferModal';
import DeliveryOtpPanel from '@/components/courier/DeliveryOtpPanel';
import { emitCommEvent } from '@/communication';
import { refreshOpenOrderOffers } from '@/services/assignment.service';
import { toast } from '../../../utils/toast';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { SHIPMENT_RIDER_ACTION_LABELS, SHIPMENT_STATUS } from '@/data/shipment-catalog';
import RiderStatusBar from '../components/RiderStatusBar';
import RiderVerificationBanner from '../components/RiderVerificationBanner';
import RiderDashboardMetrics from '../components/RiderDashboardMetrics';
import RiderRejectReasonModal from '../components/RiderRejectReasonModal';
import { renderRiderProfileGate } from '../components/RiderProfileGate';
import { useMyDriverProfile } from '@/hooks/useMyDriverProfile';
import RiderPulseHeader from '../components/RiderPulseHeader';
import RiderWaitingPanel from '../components/RiderWaitingPanel';
import { isCourierApproved } from '../constants';
import { courierOfferErrorMessage } from '@/utils/courier-offer-errors';
import { filterActiveCourierOffers, isCourierOfferActive, offerDismissKey } from '@/utils/courier-offer-utils';
import { getRiderStoreAction } from '@/utils/order-fulfillment';

export default function RiderDashboard() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [activeOffer, setActiveOffer] = useState(null);
  const [activeShipmentOffer, setActiveShipmentOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [dismissedOfferKeys, setDismissedOfferKeys] = useState(() => new Set());

  const driverQuery = useMyDriverProfile();
  const { data: driver } = driverQuery;

  const approved = isCourierApproved(driver);
  const mode = driver?.availability_mode || (driver?.is_online ? 'available' : 'offline');

  const { data: stats } = useQuery({
    queryKey: ['rider-stats', user?.id],
    queryFn: () => getRiderStats(user.id),
    enabled: !!user?.id && !!driver,
  });

  const { data: wallet } = useQuery({
    queryKey: ['courier-wallet', driver?.id],
    queryFn: getCourierWalletSummary,
    enabled: !!driver?.id,
    refetchInterval: 30000,
    retry: 1,
  });

  useRiderLocationShare({
    driverId: driver?.id,
    enabled: Boolean(mode === 'available' && approved),
    intervalMs: 3000,
  });

  const { data: courierOffers = [], refetch: refetchOffers, isError: offersError } = useQuery({
    queryKey: ['courier-offers', driver?.id],
    queryFn: () => getPendingCourierOffers(driver.id),
    enabled: mode === 'available' && !!driver?.id && approved,
    refetchInterval: mode === 'available' ? 3000 : false,
    retry: 2,
  });

  const activeCourierOffers = useMemo(
    () => filterActiveCourierOffers(courierOffers).filter(
      (o) => !dismissedOfferKeys.has(offerDismissKey(o)),
    ),
    [courierOffers, dismissedOfferKeys],
  );

  const dismissOffer = useCallback((offer, { refetch = true } = {}) => {
    const key = offerDismissKey(offer);
    if (key) {
      setDismissedOfferKeys((prev) => new Set(prev).add(key));
    }
    setActiveOffer(null);
    setRejectTarget(null);
    if (refetch) refetchOffers();
  }, [refetchOffers]);

  const handleOfferExpire = useCallback((offer) => {
    toast('La oferta expiró. Buscando más entregas…', 'info');
    dismissOffer(offer);
    if (driver?.municipio) {
      refreshOpenOrderOffers(driver.municipio).then((n) => {
        if (n > 0) refetchOffers();
      }).catch(() => {});
    }
  }, [dismissOffer, driver?.municipio, refetchOffers]);

  useEffect(() => {
    if (offersError) toast('No pudimos cargar ofertas. Revisa tu conexión.', 'error');
  }, [offersError]);

  const handleIncomingOffer = useCallback((offer) => {
    refetchOffers();
    if (offer?.status === 'pending') {
      toast('¡Nueva entrega disponible!', 'info');
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([120, 60, 120]);
      }
    }
  }, [refetchOffers]);

  useCourierOffersRealtime(driver?.id, handleIncomingOffer, refetchOffers);

  useEffect(() => {
    if (mode !== 'available' || !driver?.id || !approved || !driver?.municipio) return undefined;

    const pulse = () => {
      refreshOpenOrderOffers(driver.municipio)
        .then((count) => { if (count > 0) refetchOffers(); })
        .catch(() => {});
    };

    pulse();
    const id = setInterval(pulse, 25_000);
    return () => clearInterval(id);
  }, [mode, driver?.id, driver?.municipio, approved, refetchOffers]);

  const { data: shipmentOffers = [], refetch: refetchShipmentOffers } = useQuery({
    queryKey: ['shipment-offers', driver?.id],
    queryFn: () => getPendingShipmentAssignments(driver.id),
    enabled: mode === 'available' && !!driver?.id && approved,
    refetchInterval: mode === 'available' ? 5000 : false,
  });

  useShipmentAssignmentsRealtime(driver?.id, () => refetchShipmentOffers());

  const { data: shipments = [], refetch: refetchShipments } = useQuery({
    queryKey: ['driver-shipments', driver?.id],
    queryFn: () => getDriverShipments(driver.id),
    enabled: mode === 'available' && !!driver?.id,
    refetchInterval: mode === 'available' ? 10000 : false,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['driver-orders', driver?.id],
    queryFn: () => getDriverOrders(driver?.id),
    enabled: !!driver?.id,
    refetchInterval: mode === 'available' ? 10000 : false,
  });

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));

  useEffect(() => {
    if (mode !== 'available' || !approved || activeOrders.length > 0 || rejectTarget) return;
    const next = activeCourierOffers.find(
      (o) => !dismissedOfferKeys.has(offerDismissKey(o)),
    );
    if (!next || activeOffer) return;
    if (orders.some((o) => o.id === next.order_id)) return;
    if (!isCourierOfferActive(next)) return;
    setActiveOffer(next);
  }, [activeCourierOffers, mode, approved, activeOrders.length, orders, activeOffer, rejectTarget, dismissedOfferKeys]);

  const availabilityMutation = useMutation({
    mutationFn: (nextMode) => setCourierAvailability(nextMode),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-driver'] }),
    onError: (err) => toast(err.message, 'error'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status, {
      driverId: status === 'on_the_way' ? driver.id : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      queryClient.invalidateQueries({ queryKey: ['rider-stats'] });
      queryClient.invalidateQueries({ queryKey: ['courier-wallet'] });
      toast('Pedido actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const handleAcceptOffer = async (offer) => {
    if (!isCourierOfferActive(offer)) {
      handleOfferExpire(offer);
      return;
    }
    setOfferLoading(true);
    try {
      const result = await acceptCourierOffer(offer.order_id, driver.id);
      if (!result?.success) {
        toast(courierOfferErrorMessage(result), 'error');
        if (result?.reason === 'offer_expired') {
          handleOfferExpire(offer);
        } else {
          dismissOffer(offer);
        }
        return;
      }
      toast('¡Pedido aceptado! Tú recoges y entregas.');
      dismissOffer(offer, { refetch: false });
      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      refetchOffers();

      const { data: orderRow } = await supabase
        .from('orders')
        .select('customer_id, order_number')
        .eq('id', offer.order_id)
        .maybeSingle();
      if (orderRow?.customer_id) {
        emitCommEvent('order_status_changed', {
          recipientId: orderRow.customer_id,
          actorId: user?.id,
          payload: {
            orderId: offer.order_id,
            orderNumber: orderRow.order_number,
            status: 'preparing',
            title: 'Mensajero asignado',
            body: `${driver.name} va a recoger tu pedido en la tienda.`,
          },
        }).catch(() => {});
      }
    } catch (err) {
      toast(courierOfferErrorMessage({ message: err.message }), 'error');
    } finally {
      setOfferLoading(false);
    }
  };

  const handleRejectOffer = (offer, expired) => {
    if (expired || !isCourierOfferActive(offer)) {
      handleOfferExpire(offer);
      return;
    }
    setRejectTarget({ offer, type: 'courier' });
  };

  const confirmReject = async (reason) => {
    if (!rejectTarget || rejectLoading) return;
    const { offer, type } = rejectTarget;
    setRejectLoading(true);
    try {
      if (type === 'courier') {
        await rejectCourierOffer(offer.order_id, driver.id);
        logOfferRejection(offer.order_id, reason, 'courier').catch(() => {});
      }
      dismissOffer(offer);
      toast('Oferta rechazada', 'info');
    } catch (err) {
      toast(err.message || 'No se pudo rechazar. Intenta de nuevo.', 'error');
      setRejectTarget(null);
    } finally {
      setRejectLoading(false);
    }
  };

  const handleAcceptShipmentOffer = async (offer) => {
    setOfferLoading(true);
    try {
      await acceptShipmentAssignment(offer.id);
      toast('¡Envío intermunicipal aceptado!');
      setActiveShipmentOffer(null);
      refetchShipmentOffers();
      refetchShipments();
    } catch (err) {
      toast(err.message, 'error');
      setActiveShipmentOffer(null);
      refetchShipmentOffers();
    } finally {
      setOfferLoading(false);
    }
  };

  const handleRejectShipmentOffer = async (offer, expired) => {
    if (!expired) {
      try {
        await rejectShipmentAssignment(offer.id);
        await logOfferRejection(offer.shipment_id, 'Rechazado', 'shipment');
      } catch { /* ignore */ }
    }
    setActiveShipmentOffer(null);
    refetchShipmentOffers();
  };

  const handleAdvanceShipment = async (shipmentId) => {
    try {
      await advanceShipmentStatus(shipmentId, { lat: driver?.latitude, lng: driver?.longitude });
      toast('Estado actualizado');
      refetchShipments();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const showOfferModal = approved && !rejectTarget && (activeOffer || (
    activeCourierOffers[0] && !orders.some((o) => o.id === activeCourierOffers[0].order_id)
  ));
  const modalOffer = activeOffer || activeCourierOffers[0];

  const busyShipmentIds = new Set(shipments.map((s) => s.id));
  const showShipmentOfferModal = activeShipmentOffer
    || (shipmentOffers[0] && !busyShipmentIds.has(shipmentOffers[0].shipment_id));
  const modalShipmentOffer = activeShipmentOffer || shipmentOffers[0];

  const blocked = renderRiderProfileGate(driverQuery);
  if (blocked) return blocked;

  const statsWithActive = { ...stats, activeOrders: activeOrders.length };
  const isWaiting = mode === 'available' && activeOrders.length === 0 && shipments.length === 0;

  return (
    <div className="space-y-4">
      <RiderRejectReasonModal
        open={!!rejectTarget}
        loading={rejectLoading}
        onConfirm={confirmReject}
        onCancel={() => setRejectTarget(null)}
      />

      {showShipmentOfferModal && modalShipmentOffer && (
        <ShipmentOfferModal
          offer={modalShipmentOffer}
          loading={offerLoading}
          onAccept={handleAcceptShipmentOffer}
          onReject={handleRejectShipmentOffer}
        />
      )}

      {showOfferModal && modalOffer && (
        <CourierOfferModal
          offer={modalOffer}
          loading={offerLoading}
          onAccept={handleAcceptOffer}
          onReject={handleRejectOffer}
          onExpire={handleOfferExpire}
        />
      )}

      <RiderPulseHeader driver={driver} wallet={wallet} mode={mode} />

      <RiderVerificationBanner driver={driver} />

      <RiderStatusBar
        mode={mode}
        disabled={!approved}
        loading={availabilityMutation.isPending}
        onChange={(m) => availabilityMutation.mutate(m)}
      />

      <RiderDashboardMetrics
        stats={statsWithActive}
        wallet={wallet}
        driver={driver}
      />

      <SectionTitle>
        {activeOrders.length > 0 ? `Pedidos activos (${activeOrders.length})` : 'Pedidos'}
      </SectionTitle>

      {mode !== 'available' && activeOrders.length === 0 && (
        <p className="rounded-2xl border border-dashed border-border/70 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
          {approved
            ? 'Activa el interruptor para conectarte y recibir pedidos en tu zona'
            : 'Completa tu registro para empezar a recibir ofertas'}
        </p>
      )}

      {isWaiting && (
        <RiderWaitingPanel
          municipio={driver.municipio}
          offers={activeCourierOffers}
          onSelectOffer={setActiveOffer}
        />
      )}

      {(activeOrders.length > 0 || (mode === 'available' && !isWaiting)) && (
        <>
          {shipments.length > 0 && (
            <div className="space-y-3">
              <SectionTitle>Envíos intermunicipales</SectionTitle>
              {shipments.map((shipment) => (
                <SurfaceCard key={shipment.id}>
                  <p className="font-bold text-foreground">{shipment.shipment_number}</p>
                  <p className="text-sm text-teal-700 dark:text-teal-300">
                    {shipment.origin_municipio} → {shipment.dest_municipio}
                  </p>
                  <p className="font-semibold text-primary">{formatCOP(shipment.total_cop)}</p>
                  <p className="text-xs text-muted-foreground">{SHIPMENT_STATUS[shipment.status] || shipment.status}</p>
                  {SHIPMENT_RIDER_ACTION_LABELS[shipment.status] && (
                    <Button size="sm" className="mt-3" onClick={() => handleAdvanceShipment(shipment.id)}>
                      {SHIPMENT_RIDER_ACTION_LABELS[shipment.status]}
                    </Button>
                  )}
                </SurfaceCard>
              ))}
            </div>
          )}

          {activeOrders.length === 0 && shipments.length === 0 ? null : activeOrders.length > 0 ? (
            activeOrders.map((order) => (
              <SurfaceCard key={order.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-foreground">{order.order_number || order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">{order.dest_address}</p>
                    <p className="font-semibold text-primary">{formatCOP(order.rider_payout ?? ECONOMICS.riderPayout)}</p>
                    <p className="text-xs text-muted-foreground">{ORDER_STATUS_LABELS[order.status]}</p>
                  </div>
                  <Link to={`/domiciliario/entrega/${order.id}`}>
                    <Button size="sm" variant="outline">Mapa</Button>
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {isCourierOrder(order) && order.status === 'accepted' && (
                    <Button size="sm" variant="outline" onClick={() => setCourierPhase(order.id, 'arriving_pickup', 'arriving_pickup').then(() => queryClient.invalidateQueries({ queryKey: ['driver-orders'] }))}>
                      Voy a recoger
                    </Button>
                  )}
                  {isCourierOrder(order) && order.status === 'accepted' && (
                    <Button size="sm" onClick={async () => {
                      await setCourierPhase(order.id, 'picked_up', 'picked_up');
                      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
                    }}>
                      Recogido
                    </Button>
                  )}
                  {!isCourierOrder(order) && order.business_id && (() => {
                    const action = getRiderStoreAction(order);
                    if (!action) return null;
                    return (
                      <Button
                        size="sm"
                        onClick={() => statusMutation.mutate({ orderId: order.id, status: action.nextStatus })}
                      >
                        {action.label}
                      </Button>
                    );
                  })()}
                  {!isCourierOrder(order) && !order.business_id && order.status === 'accepted' && (
                    <Button size="sm" onClick={() => statusMutation.mutate({ orderId: order.id, status: 'on_the_way' })}>
                      Recogido
                    </Button>
                  )}
                  {order.status === 'on_the_way' && (
                    <DeliveryOtpPanel
                      orderId={order.id}
                      driverId={driver.id}
                      onVerified={() => queryClient.invalidateQueries({ queryKey: ['driver-orders'] })}
                    />
                  )}
                </div>
                {['accepted', 'preparing', 'on_the_way'].includes(order.status) && (
                  <div className="mt-3"><OrderChat order={order} compact /></div>
                )}
              </SurfaceCard>
            ))
          ) : null}
        </>
      )}
    </div>
  );
}
