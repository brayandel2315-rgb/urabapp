import { useState } from 'react';
import OrderTrackingMap from '@/components/maps/OrderTrackingMap';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { useTrackingMap } from '@/hooks/useTrackingMap';

/** Mini-mapa para comercio con posición live del repartidor */
export default function BusinessOrderTrackingMap({ order }) {
  const [routeMeta, setRouteMeta] = useState(null);
  const isLive = Boolean(order?.driver_id) && ['preparing', 'on_the_way'].includes(order?.status);
  const tracking = useTrackingMap({
    driverId: order?.driver_id,
    orderId: order?.id,
    enabled: isLive,
  });

  if (!order?.driver_id) return null;

  const business = order.businesses || order.business;
  const hasDest = order.dest_latitude != null && order.dest_longitude != null;

  if (!hasDest) return null;

  return (
    <SurfaceCard className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 px-3 pt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Seguimiento en vivo
        </p>
        {tracking.source && isLive && (
          <span className="text-[10px] font-medium uppercase text-emerald-600">
            {tracking.source === 'socket' ? 'Tiempo real' : 'Actualizando'}
          </span>
        )}
      </div>
      <OrderTrackingMap
        className="mt-2 h-48 w-full"
        order={order}
        pickupLat={business?.latitude}
        pickupLng={business?.longitude}
        pickupTitle={business?.name || 'Tu tienda'}
        destLat={order.dest_latitude}
        destLng={order.dest_longitude}
        riderLat={tracking.latitude}
        riderLng={tracking.longitude}
        showRoute={order.status === 'on_the_way'}
        showEta={order.status === 'on_the_way'}
        onRoute={setRouteMeta}
      />
      {routeMeta?.durationText && order.status === 'on_the_way' && (
        <p className="px-3 pb-3 text-xs text-muted-foreground">
          ETA estimado: {routeMeta.durationText}
        </p>
      )}
    </SurfaceCard>
  );
}
