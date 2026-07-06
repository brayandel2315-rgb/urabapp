import { useEffect, useRef, useState } from 'react';
import { getDrivingRoute, getDefaultCenter } from '@/services/map.service';
import { shouldRefreshRoute } from '@/utils/routing';
import { createMapProvider } from '@/lib/map-provider';
import { useMapResize } from '@/hooks/useMapResize';
import MapShell from '@/components/maps/MapShell';
import RouteEtaPanel from '@/components/maps/RouteEtaPanel';

const ROUTE_STYLE = { color: '#0ea5e9', weight: 5, opacity: 0.9 };
const PLANNED_STYLE = { color: '#64748b', weight: 4, opacity: 0.5, dashed: true };

const DEFAULT_LAT = getDefaultCenter()[1];
const DEFAULT_LNG = getDefaultCenter()[0];

export default function RiderDeliveryMapInner({ pickup, dropoff, rider }) {
  const containerRef = useRef(null);
  const mapApiRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const lastRouteFromRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeMeta, setRouteMeta] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const centerLat = rider?.lat ?? pickup?.lat ?? dropoff?.lat ?? DEFAULT_LAT;
  const centerLng = rider?.lng ?? pickup?.lng ?? dropoff?.lng ?? DEFAULT_LNG;

  const refreshRoute = async (from, to) => {
    if (!from || !to) return;
    setRouteLoading(true);
    try {
      const fromPt = { latitude: from.lat, longitude: from.lng };
      const toPt = { latitude: to.lat, longitude: to.lng };
      const route = await getDrivingRoute(fromPt, toPt);
      setRouteMeta(route);
      const api = mapApiRef.current;
      if (api?.setRouteGeometry && route?.geometry) {
        const style = route.provider === 'ors' ? ROUTE_STYLE : PLANNED_STYLE;
        await api.setRouteGeometry(route.geometry, style);
      }
      lastRouteFromRef.current = { latitude: from.lat, longitude: from.lng };
    } finally {
      setRouteLoading(false);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return undefined;
    let cancelled = false;

    (async () => {
      try {
        const center = rider || pickup || dropoff || { lat: DEFAULT_LAT, lng: DEFAULT_LNG };
        const api = await createMapProvider(containerRef.current, {
          center: { latitude: center.lat, longitude: center.lng },
          zoom: 13,
        });
        if (cancelled) {
          api.destroy();
          return;
        }
        mapApiRef.current = api;

        if (pickup) {
          await api.addMarker({ latitude: pickup.lat, longitude: pickup.lng }, { color: '#16a34a', title: 'Recoger' });
        }
        if (dropoff) {
          await api.addMarker({ latitude: dropoff.lat, longitude: dropoff.lng }, { color: '#dc2626', title: 'Entregar' });
        }
        if (rider) {
          riderMarkerRef.current = await api.addMarker(
            { latitude: rider.lat, longitude: rider.lng },
            { color: '#0ea5e9', title: 'Tú' },
          );
        }

        const points = [pickup, dropoff, rider].filter(Boolean).map((p) => ({
          latitude: p.lat,
          longitude: p.lng,
        }));
        if (points.length) api.fitToPoints(points, { padding: 48, maxZoom: 14 });

        const routeFrom = rider || pickup;
        const routeTo = dropoff;
        if (routeFrom && routeTo) {
          await refreshRoute(routeFrom, routeTo);
        }
        setMapReady(true);
      } catch {
        if (!cancelled) setMapReady(false);
      }
    })();

    return () => {
      cancelled = true;
      mapApiRef.current?.clearRoute?.();
      mapApiRef.current?.destroy();
      mapApiRef.current = null;
      setMapReady(false);
    };
  }, [pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng]);

  useMapResize(containerRef, mapApiRef, mapReady);

  useEffect(() => {
    if (!riderMarkerRef.current || !rider) return;
    mapApiRef.current?.setMarkerPosition(riderMarkerRef.current, {
      latitude: rider.lat,
      longitude: rider.lng,
    });
    if (dropoff && shouldRefreshRoute(lastRouteFromRef.current, { latitude: rider.lat, longitude: rider.lng })) {
      refreshRoute(rider, dropoff);
    }
  }, [rider?.lat, rider?.lng, dropoff?.lat, dropoff?.lng]);

  return (
    <div className="space-y-2">
      <MapShell
        className="h-52 w-full sm:h-60"
        latitude={centerLat}
        longitude={centerLng}
        label="Entrega"
        mapReady={mapReady}
      >
        <div ref={containerRef} className="absolute inset-0" />
      </MapShell>
      {(routeLoading || routeMeta) && (
        <RouteEtaPanel route={routeMeta} loading={routeLoading} compact />
      )}
    </div>
  );
}
