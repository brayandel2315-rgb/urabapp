import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { getOrdersByCustomer } from '@/services/order.service';
import { getCustomerShipments } from '@/services/shipment.service';
import { isCourierOrder } from '@/services/courier.service';

const ORDER_TERMINAL = new Set(['delivered', 'cancelled']);
const SHIPMENT_TERMINAL = new Set(['delivered', 'completed', 'cancelled']);

function orderKind(order) {
  if (isCourierOrder(order)) return 'courier';
  return 'food';
}

function toOrderActivity(order) {
  return {
    id: order.id,
    kind: orderKind(order),
    service: orderKind(order) === 'courier' ? 'courier' : 'food',
    status: order.status,
    createdAt: order.created_at,
    title: orderKind(order) === 'courier'
      ? 'Mensajería UrabApp'
      : (order.businesses?.name || 'Pedido de comida'),
    subtitle: order.dest_address,
    amount: order.total,
    href: `/pedidos/${order.id}`,
    raw: order,
  };
}

function toShipmentActivity(shipment) {
  return {
    id: shipment.id,
    kind: 'shipment',
    service: 'shipment',
    status: shipment.status,
    createdAt: shipment.created_at,
    title: `Envío ${shipment.shipment_number || shipment.id.slice(0, 8)}`,
    subtitle: `${shipment.origin_municipio} → ${shipment.dest_municipio}`,
    amount: shipment.total_cop,
    href: `/envios/${shipment.id}`,
    raw: shipment,
  };
}

export function useClientActivity(options = {}) {
  const { enabled = true, refetchInterval = 15_000 } = options;
  const user = useAuthStore((s) => s.user);

  const ordersQuery = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getOrdersByCustomer(user.id),
    enabled: enabled && !!user?.id,
    refetchInterval: user?.id ? refetchInterval : false,
    staleTime: 10_000,
  });

  const shipmentsQuery = useQuery({
    queryKey: ['shipments', user?.id],
    queryFn: () => getCustomerShipments(user.id),
    enabled: enabled && !!user?.id,
    refetchInterval: user?.id ? refetchInterval : false,
    staleTime: 10_000,
  });

  const { data: orders = [], isLoading: ordersLoading, isFetching: ordersFetching, isError: ordersError, refetch: refetchOrders } = ordersQuery;
  const { data: shipments = [], isLoading: shipmentsLoading, isFetching: shipmentsFetching, isError: shipmentsError, refetch: refetchShipments } = shipmentsQuery;

  const orderActivities = useMemo(() => orders.map(toOrderActivity), [orders]);
  const shipmentActivities = useMemo(() => shipments.map(toShipmentActivity), [shipments]);

  const allActivities = useMemo(() => {
    return [...orderActivities, ...shipmentActivities]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orderActivities, shipmentActivities]);

  const activeActivities = useMemo(
    () => allActivities.filter((a) => {
      if (a.service === 'shipment') return !SHIPMENT_TERMINAL.has(a.status);
      return !ORDER_TERMINAL.has(a.status);
    }),
    [allActivities]
  );

  const historyActivities = useMemo(
    () => allActivities.filter((a) => !activeActivities.some((x) => x.id === a.id && x.service === a.service)),
    [allActivities, activeActivities]
  );

  const activeOrders = useMemo(
    () => orders.filter((o) => !ORDER_TERMINAL.has(o.status)),
    [orders]
  );

  const activeShipments = useMemo(
    () => shipments.filter((s) => !SHIPMENT_TERMINAL.has(s.status)),
    [shipments]
  );

  return {
    orders,
    shipments,
    orderActivities,
    shipmentActivities,
    allActivities,
    activeActivities,
    historyActivities,
    activeOrders,
    activeShipments,
    activeCount: activeActivities.length,
    hasActive: activeActivities.length > 0,
    primaryActivity: activeActivities[0] ?? null,
    isLoading: (ordersLoading || shipmentsLoading) && !!user?.id,
    isFetching: ordersFetching || shipmentsFetching,
    isError: ordersError || shipmentsError,
    refetch: () => Promise.all([refetchOrders(), refetchShipments()]),
  };
}
