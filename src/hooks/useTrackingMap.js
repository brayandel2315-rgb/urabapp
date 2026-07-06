import { useDriverLocationRealtime } from './useDriverLocationRealtime';
import { useInterpolatedLocation } from './useInterpolatedLocation';

/**
 * Ubicación del repartidor suavizada — compartido entre cliente, comercio y rider.
 */
export function useTrackingMap({ driverId, orderId, enabled = true } = {}) {
  const active = enabled && Boolean(driverId);
  const location = useDriverLocationRealtime(active ? driverId : null, { orderId });
  const smooth = useInterpolatedLocation(location);

  return {
    location,
    smooth,
    latitude: smooth?.latitude ?? location?.latitude ?? null,
    longitude: smooth?.longitude ?? location?.longitude ?? null,
    source: location?.source ?? null,
    updatedAt: location?.updatedAt ?? smooth?.updatedAt ?? null,
  };
}
