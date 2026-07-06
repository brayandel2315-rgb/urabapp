import { useEffect, useRef, useState, useCallback } from 'react';
import { getDrivingRoute } from '@/services/map.service';
import { shouldRefreshRoute } from '@/utils/routing';
import { createMapProvider } from '@/lib/map-provider';
import { useMapResize } from '@/hooks/useMapResize';
import MapShell from './MapShell';
import RouteEtaPanel from './RouteEtaPanel';

const ROUTE_STYLE = { color: '#1C8238', weight: 5, opacity: 0.88 };
const PLANNED_STYLE = { color: '#64748b', weight: 4, opacity: 0.55, dashed: true };

function toPoint(lat, lng, fallbackTitle) {
  if (lat == null || lng == null) return null;
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude, title: fallbackTitle };
}

/**
 * Mapa de tracking con rutas ORS, recálculo al mover mensajero y ETA en vivo.
 */
export default function OrderTrackingMap({
  destLat,
  destLng,
  riderLat,
  riderLng,
  pickupLat,
  pickupLng,
  pickupTitle = 'Recoger',
  destTitle = 'Entrega',
  riderTitle = 'Mensajero',
  className = 'h-56 w-full',
  showRoute = true,
  showEta = true,
  order,
  onRoute,
}) {
  const resolvedDest = toPoint(
    destLat ?? order?.dest_latitude,
    destLng ?? order?.dest_longitude,
    destTitle,
  );
  const resolvedPickup = toPoint(
    pickupLat ?? order?.pickup_latitude ?? order?.businesses?.latitude,
    pickupLng ?? order?.pickup_longitude ?? order?.businesses?.longitude,
    pickupTitle,
  );
  const resolvedRider = toPoint(riderLat, riderLng, riderTitle);

  const containerRef = useRef(null);
  const mapApiRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const lastRouteFromRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeMeta, setRouteMeta] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const refreshRoute = useCallback(async (from, to) => {
    if (!showRoute || !from || !to) {
      setRouteMeta(null);
      return;
    }
    setRouteLoading(true);
    try {
      const route = await getDrivingRoute(from, to);
      setRouteMeta(route);
      onRoute?.(route);
      const api = mapApiRef.current;
      if (api && route?.geometry) {
        const style = route.provider === 'ors' ? ROUTE_STYLE : PLANNED_STYLE;
        await api.setRouteGeometry(route.geometry, style);
      }
      lastRouteFromRef.current = { ...from };
    } finally {
      setRouteLoading(false);
    }
  }, [showRoute, onRoute]);

  useEffect(() => {
    if (!containerRef.current || !resolvedDest) return undefined;

    let cancelled = false;

    (async () => {
      try {
        const api = await createMapProvider(containerRef.current, {
          center: resolvedDest,
          zoom: 13,
        });
        if (cancelled) {
          api.destroy();
          return;
        }
        mapApiRef.current = api;

        if (resolvedPickup) {
          await api.addMarker(resolvedPickup, { color: '#0d9488', title: resolvedPickup.title });
        }
        await api.addMarker(resolvedDest, { color: '#1C8238', title: resolvedDest.title });

        if (resolvedRider) {
          riderMarkerRef.current = await api.addMarker(resolvedRider, {
            color: '#166B3A',
            title: resolvedRider.title,
          });
        }

        const points = [resolvedDest, resolvedPickup, resolvedRider].filter(Boolean);
        api.fitToPoints(points, { padding: 52, maxZoom: 15 });

        if (showRoute) {
          if (resolvedRider) {
            await refreshRoute(resolvedRider, resolvedDest);
          } else if (resolvedPickup) {
            await refreshRoute(resolvedPickup, resolvedDest);
          }
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
      riderMarkerRef.current = null;
      setMapReady(false);
    };
  }, [
    resolvedDest?.latitude,
    resolvedDest?.longitude,
    resolvedPickup?.latitude,
    resolvedPickup?.longitude,
    showRoute,
    refreshRoute,
  ]);

  useMapResize(containerRef, mapApiRef, mapReady);

  useEffect(() => {
    if (!resolvedRider || !mapApiRef.current) return;
    if (riderMarkerRef.current) {
      mapApiRef.current.setMarkerPosition(riderMarkerRef.current, resolvedRider);
    }
    if (!showRoute || !resolvedDest) return;

    const prev = lastRouteFromRef.current;
    if (shouldRefreshRoute(prev, resolvedRider)) {
      refreshRoute(resolvedRider, resolvedDest);
    }
  }, [
    resolvedRider?.latitude,
    resolvedRider?.longitude,
    resolvedDest,
    showRoute,
    refreshRoute,
  ]);

  if (!resolvedDest) {
    return (
      <div className={`flex items-center justify-center rounded-xl bg-muted/30 text-sm text-muted ${className}`}>
        Mapa en vivo — confirma la dirección de entrega
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MapShell
        className={className}
        latitude={resolvedDest.latitude}
        longitude={resolvedDest.longitude}
        label={destTitle}
        mapReady={mapReady}
      >
        <div ref={containerRef} className="absolute inset-0" />
      </MapShell>
      {showEta && (routeLoading || routeMeta) && (
        <RouteEtaPanel route={routeMeta} loading={routeLoading} compact />
      )}
    </div>
  );
}
