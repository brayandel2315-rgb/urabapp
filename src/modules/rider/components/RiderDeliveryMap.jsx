import { lazy, Suspense } from 'react';
import Loader from '@/components/ui/Loader';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

const MapInner = lazy(() => import('./RiderDeliveryMapInner'));

export default function RiderDeliveryMap({ order, driverCoords, className }) {
  if (!order) return null;

  const pickup = order.pickup_latitude && order.pickup_longitude
    ? { lat: Number(order.pickup_latitude), lng: Number(order.pickup_longitude) }
    : null;
  const dropoff = order.dest_latitude && order.dest_longitude
    ? { lat: Number(order.dest_latitude), lng: Number(order.dest_longitude) }
    : null;

  return (
    <SurfaceCard className={className}>
      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">Ruta en vivo · actualiza cada 3s</p>
      <Suspense fallback={<div className="flex h-48 items-center justify-center"><Loader /></div>}>
        <MapInner pickup={pickup} dropoff={dropoff} rider={driverCoords} />
      </Suspense>
      {order.estimated_minutes && (
        <p className="mt-2 text-sm text-muted-foreground">ETA ~{order.estimated_minutes} min · {order.distance_km} km</p>
      )}
    </SurfaceCard>
  );
}
