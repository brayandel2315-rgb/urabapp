/**
 * Tracking unificado — pedido, mandado y envío.
 */
import { useState } from 'react';
import { motion } from 'motion/react';
import OrderTrackingMap from '@/components/maps/OrderTrackingMap';
import ShipmentTrackingMap from '@/components/shipment/ShipmentTrackingMap';
import CourierTrackingSteps from '@/components/courier/CourierTrackingSteps';
import ShipmentStatusSteps from '@/components/shipment/ShipmentStatusSteps';
import LiveTrackingHeader from '@/components/tracking/LiveTrackingHeader';
import NavigationLaunchBar from '@/components/tracking/NavigationLaunchBar';
import { useTrackingMap } from '@/hooks/useTrackingMap';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { tween } from '@/design-system/motion/presets';

export default function UnifiedTrackingPanel({
  type = 'order',
  order,
  shipment,
  courierPhase,
  viewer = 'client',
}) {
  const driverId = order?.driver_id ?? shipment?.assigned_driver_id;
  const trackOrderId = order?.id ?? shipment?.id;
  const tracking = useTrackingMap({ driverId, orderId: trackOrderId });
  const riderLocation = tracking.location;
  const smoothRider = tracking.smooth;
  const [routeMeta, setRouteMeta] = useState(null);

  const isActiveOrder = order && !['delivered', 'cancelled'].includes(order.status);
  const isActiveShipment = shipment && shipment.status !== 'delivered' && shipment.status !== 'cancelled';
  const isActive = isActiveOrder || isActiveShipment;

  const dest = order
    ? {
        latitude: order.dest_latitude ? Number(order.dest_latitude) : null,
        longitude: order.dest_longitude ? Number(order.dest_longitude) : null,
        address: order.dest_address,
        label: 'Entrega',
      }
    : shipment
      ? {
          latitude: shipment.delivery_latitude ? Number(shipment.delivery_latitude) : null,
          longitude: shipment.delivery_longitude ? Number(shipment.delivery_longitude) : null,
          address: shipment.delivery_address,
          label: shipment.dest_municipio,
        }
      : null;

  const pickup = order
    ? {
        latitude: (order.pickup_latitude ?? order.businesses?.latitude)
          ? Number(order.pickup_latitude ?? order.businesses?.latitude)
          : null,
        longitude: (order.pickup_longitude ?? order.businesses?.longitude)
          ? Number(order.pickup_longitude ?? order.businesses?.longitude)
          : null,
        address: order.pickup_address || order.businesses?.name,
        label: order.businesses?.name || 'Recoger',
      }
    : null;

  const navTarget = viewer === 'rider'
    ? (order?.status === 'accepted' || order?.courier_phase === 'arriving_pickup' ? pickup : dest)
    : dest;

  if (type === 'shipment' && shipment) {
    return (
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tween}
      >
        <LiveTrackingHeader
          title="Envío intermunicipal"
          subtitle={`${shipment.origin_municipio} → ${shipment.dest_municipio}`}
          riderName={shipment.drivers?.name}
          location={riderLocation}
          route={routeMeta}
          isActive={isActiveShipment}
        />
        <ShipmentStatusSteps status={shipment.status} />
        <SurfaceCard className="overflow-hidden rounded-[var(--radius-component)] p-0">
          <ShipmentTrackingMap
            shipment={shipment}
            className="h-64 w-full rounded-none sm:h-72"
            onRoute={setRouteMeta}
          />
        </SurfaceCard>
        {isActiveShipment && viewer === 'client' && (
          <NavigationLaunchBar destination={dest} label="Seguir envío en mapa externo" />
        )}
      </motion.div>
    );
  }

  if (type === 'courier' || order?.order_type === 'courier') {
    return (
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={tween}
      >
        <LiveTrackingHeader
          title="Mandado urbano"
          subtitle={order?.pickup_address ? `Recoger en ${order.pickup_municipio || 'Urabá'}` : undefined}
          riderName={order?.drivers?.name}
          location={riderLocation}
          route={routeMeta}
          isActive={isActiveOrder}
        />
        <CourierTrackingSteps phase={courierPhase || order?.courier_phase} status={order?.status} />
        <SurfaceCard className="overflow-hidden rounded-[var(--radius-component)] p-0">
          <OrderTrackingMap
            className="h-64 w-full sm:h-72"
            order={order}
            pickupLat={order?.pickup_latitude}
            pickupLng={order?.pickup_longitude}
            destLat={order?.dest_latitude}
            destLng={order?.dest_longitude}
            riderLat={smoothRider?.latitude}
            riderLng={smoothRider?.longitude}
            pickupTitle="Recoger"
            showRoute
            showEta
            onRoute={setRouteMeta}
          />
        </SurfaceCard>
        {isActive && (
          <NavigationLaunchBar
            destination={navTarget}
            label={viewer === 'rider' ? 'Navegar con Waze' : 'Ver ruta en Waze'}
          />
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tween}
    >
      <LiveTrackingHeader
        title="Tu pedido va en camino"
        subtitle={order?.businesses?.name || order?.business?.name}
        riderName={order?.drivers?.name}
        location={riderLocation}
        route={routeMeta}
        isActive={isActiveOrder}
      />
      <SurfaceCard className="overflow-hidden rounded-[var(--radius-component)] p-0">
        <OrderTrackingMap
          className="h-64 w-full sm:h-72"
          order={order}
          pickupLat={order?.businesses?.latitude}
          pickupLng={order?.businesses?.longitude}
          pickupTitle={order?.businesses?.name || 'Tienda'}
          destLat={order?.dest_latitude}
          destLng={order?.dest_longitude}
          riderLat={smoothRider?.latitude}
          riderLng={smoothRider?.longitude}
          showRoute={Boolean(order?.driver_id)}
          showEta
          onRoute={setRouteMeta}
        />
      </SurfaceCard>
      {isActive && (
        <NavigationLaunchBar destination={dest} label="Abrir entrega en Waze" />
      )}
    </motion.div>
  );
}
