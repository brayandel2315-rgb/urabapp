import { useEffect, useRef, useState } from 'react';
import { geocodeAddress, getDrivingRoute } from '@/services/map.service';
import { getMunicipioCoords } from '@/data/shipment-catalog';
import { createMapProvider } from '@/lib/map-provider';
import { useMapResize } from '@/hooks/useMapResize';
import { useDriverLocationRealtime } from '@/hooks/useDriverLocationRealtime';
import { useInterpolatedLocation } from '@/hooks/useInterpolatedLocation';
import { shouldRefreshRoute } from '@/utils/routing';
import MapShell from '@/components/maps/MapShell';
import RouteEtaPanel from '@/components/maps/RouteEtaPanel';

export default function ShipmentTrackingMap({
  shipment,
  className = 'h-56 w-full rounded-xl',
  showRoute = true,
  riderLat: riderLatProp,
  riderLng: riderLngProp,
  onRoute,
}) {
  const driverId = shipment?.assigned_driver_id;
  const liveDriver = useDriverLocationRealtime(driverId);
  const smoothRider = useInterpolatedLocation(liveDriver);
  const riderLat = riderLatProp ?? smoothRider?.latitude ?? shipment?.current_latitude ?? shipment?.drivers?.latitude;
  const riderLng = riderLngProp ?? smoothRider?.longitude ?? shipment?.current_longitude ?? shipment?.drivers?.longitude;
  const containerRef = useRef(null);
  const mapApiRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const lastRouteFromRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeMeta, setRouteMeta] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (!shipment) return undefined;
    let cancelled = false;

    (async () => {
      const originFallback = getMunicipioCoords(shipment.origin_municipio);
      const destFallback = getMunicipioCoords(shipment.dest_municipio);

      const [pickup, delivery] = await Promise.all([
        geocodeAddress(shipment.pickup_address, { municipio: shipment.origin_municipio }),
        geocodeAddress(shipment.delivery_address, { municipio: shipment.dest_municipio }),
      ]);

      if (cancelled) return;

      setCoords({
        originLat: pickup?.latitude ?? originFallback.lat,
        originLng: pickup?.longitude ?? originFallback.lng,
        destLat: delivery?.latitude ?? destFallback.lat,
        destLng: delivery?.longitude ?? destFallback.lng,
        riderLat: null,
        riderLng: null,
      });
    })();

    return () => { cancelled = true; };
  }, [
    shipment?.id,
    shipment?.pickup_address,
    shipment?.delivery_address,
    shipment?.origin_municipio,
    shipment?.dest_municipio,
    shipment?.current_latitude,
    shipment?.current_longitude,
    shipment?.drivers?.latitude,
    shipment?.drivers?.longitude,
  ]);

  useEffect(() => {
    if (!containerRef.current || !coords) return undefined;

    let cancelled = false;

    (async () => {
      const { originLat, originLng, destLat, destLng } = coords;
      const api = await createMapProvider(containerRef.current, {
        center: { latitude: originLat, longitude: originLng },
        zoom: 9,
      });
      if (cancelled) {
        api.destroy();
        return;
      }
      mapApiRef.current = api;

      await api.addMarker({ latitude: originLat, longitude: originLng }, {
        color: '#0d9488',
        title: `Origen · ${shipment.origin_municipio}`,
      });
      await api.addMarker({ latitude: destLat, longitude: destLng }, {
        color: '#1C8238',
        title: `Destino · ${shipment.dest_municipio}`,
      });
      if (riderLat != null && riderLng != null) {
        riderMarkerRef.current = await api.addMarker(
          { latitude: Number(riderLat), longitude: Number(riderLng) },
          { color: '#166B3A', title: 'Transportista' },
        );
      }

      const points = [
        { latitude: originLat, longitude: originLng },
        { latitude: destLat, longitude: destLng },
      ];
      if (riderLat != null && riderLng != null) {
        points.push({ latitude: Number(riderLat), longitude: Number(riderLng) });
      }
      api.fitToPoints(points, { padding: 48, maxZoom: 12 });

      if (!showRoute) return;

      setRouteLoading(true);
      try {
        const from = riderLat != null && riderLng != null
          ? { latitude: Number(riderLat), longitude: Number(riderLng) }
          : { latitude: originLat, longitude: originLng };
        const to = { latitude: destLat, longitude: destLng };
        const route = await getDrivingRoute(from, to);
        setRouteMeta(route);
        onRoute?.(route);
        lastRouteFromRef.current = from;
        if (route?.geometry && api.setRouteGeometry) {
          const style = route.provider === 'ors'
            ? { color: '#0d9488', weight: 5, opacity: 0.88 }
            : { color: '#0d9488', weight: 4, opacity: 0.55, dashed: true };
          await api.setRouteGeometry(route.geometry, style);
        }
      } finally {
        setRouteLoading(false);
      }
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      mapApiRef.current?.destroy();
      mapApiRef.current = null;
      setMapReady(false);
    };
  }, [coords, showRoute, shipment?.origin_municipio, shipment?.dest_municipio]);

  useEffect(() => {
    if (!mapApiRef.current || riderLat == null || riderLng == null) return;
    const point = { latitude: Number(riderLat), longitude: Number(riderLng) };
    if (riderMarkerRef.current) {
      mapApiRef.current.setMarkerPosition(riderMarkerRef.current, point);
    }
    if (!coords || !showRoute) return;
    const dest = { latitude: coords.destLat, longitude: coords.destLng };
    if (shouldRefreshRoute(lastRouteFromRef.current, point)) {
      getDrivingRoute(point, dest).then((route) => {
        setRouteMeta(route);
        onRoute?.(route);
        if (route?.geometry) {
          mapApiRef.current?.setRouteGeometry?.(route.geometry, {
            color: '#0d9488',
            weight: 5,
            opacity: 0.88,
          });
        }
        lastRouteFromRef.current = point;
      });
    }
  }, [riderLat, riderLng, coords, showRoute, onRoute]);

  useMapResize(containerRef, mapApiRef, mapReady);

  if (!shipment) {
    return (
      <div className={`flex items-center justify-center bg-muted/40 text-sm text-muted-foreground ${className}`}>
        Sin datos de ruta
      </div>
    );
  }

  if (!coords) {
    return (
      <div className={`flex items-center justify-center bg-muted/40 text-sm text-muted-foreground ${className}`}>
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MapShell
        className={className}
        latitude={coords.destLat}
        longitude={coords.destLng}
        label={`${shipment.origin_municipio} → ${shipment.dest_municipio}`}
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
