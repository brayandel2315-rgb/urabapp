import { useEffect, useRef, useState, useMemo } from 'react';
import { createMapProvider } from '@/lib/map-provider';
import { getDefaultCenter } from '@/services/map.service';
import MapShell from '@/components/maps/MapShell';

const STATUS_COLORS = {
  pending: '#f59e0b',
  accepted: '#3b82f6',
  preparing: '#8b5cf6',
  on_the_way: '#1C8238',
};

const SHIPMENT_COLORS = {
  pickup: '#f97316',
  in_transit: '#6366f1',
  arriving: '#1C8238',
};

function addHeatLayer(map, points, cleanupFns) {
  if (!points?.length || !map) return;
  const sourceId = `heat-${Date.now()}`;
  const features = points
    .filter((p) => p.latitude != null && p.longitude != null)
    .map((p) => ({
      type: 'Feature',
      properties: { weight: Number(p.weight) || 1 },
      geometry: {
        type: 'Point',
        coordinates: [Number(p.longitude), Number(p.latitude)],
      },
    }));

  if (!features.length) return;

  map.addSource(sourceId, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features },
  });
  map.addLayer({
    id: `${sourceId}-circles`,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['get', 'weight'], 1, 6, 10, 18],
      'circle-color': '#f97316',
      'circle-opacity': 0.28,
      'circle-blur': 0.6,
    },
  });
  cleanupFns.push(() => {
    if (map.getLayer(`${sourceId}-circles`)) map.removeLayer(`${sourceId}-circles`);
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  });
}

export default function AdminOperationsMap({
  orders = [],
  shipments = [],
  heatPoints = [],
  showHeatmap = true,
  className = 'h-72 w-full',
}) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  const mapKey = useMemo(
    () => [
      orders.map((o) => `${o.id}:${o.status}:${o.drivers?.latitude}`).join('|'),
      shipments.map((s) => `${s.id}:${s.status}:${s.current_latitude}`).join('|'),
      heatPoints.length,
      showHeatmap,
    ].join('::'),
    [orders, shipments, heatPoints.length, showHeatmap],
  );

  useEffect(() => {
    if (!containerRef.current) return undefined;

    let cancelled = false;
    const dc = getDefaultCenter();
    const heatCleanup = [];

    (async () => {
      apiRef.current?.destroy();
      apiRef.current = null;
      setMapReady(false);

      try {
        const api = await createMapProvider(containerRef.current, {
          center: { latitude: dc[1], longitude: dc[0] },
          zoom: 12,
        });
        if (cancelled) {
          api.destroy();
          return;
        }

        const points = [];

        for (const order of orders) {
          const destLat = order.dest_latitude != null ? Number(order.dest_latitude) : null;
          const destLng = order.dest_longitude != null ? Number(order.dest_longitude) : null;
          if (destLat != null && destLng != null) {
            await api.addMarker(
              { latitude: destLat, longitude: destLng },
              {
                color: STATUS_COLORS[order.status] || '#64748b',
                title: `${order.order_number || 'Pedido'} · destino`,
              },
            );
            points.push({ latitude: destLat, longitude: destLng });
          }

          const rider = order.drivers;
          if (rider?.latitude != null && rider?.longitude != null) {
            await api.addMarker(
              { latitude: Number(rider.latitude), longitude: Number(rider.longitude) },
              { color: '#0ea5e9', title: `🛵 ${rider.name || 'Repartidor'}` },
            );
            points.push({ latitude: Number(rider.latitude), longitude: Number(rider.longitude) });
          }
        }

        for (const shipment of shipments) {
          const lat = shipment.current_latitude != null
            ? Number(shipment.current_latitude)
            : shipment.drivers?.latitude != null
              ? Number(shipment.drivers.latitude)
              : null;
          const lng = shipment.current_longitude != null
            ? Number(shipment.current_longitude)
            : shipment.drivers?.longitude != null
              ? Number(shipment.drivers.longitude)
              : null;

          if (lat != null && lng != null) {
            await api.addMarker(
              { latitude: lat, longitude: lng },
              {
                color: SHIPMENT_COLORS[shipment.status] || '#6366f1',
                title: `📦 ${shipment.shipment_number || 'Envío'} · ${shipment.status}`,
              },
            );
            points.push({ latitude: lat, longitude: lng });
          }
        }

        if (showHeatmap && heatPoints.length && api.instance) {
          addHeatLayer(api.instance, heatPoints, heatCleanup);
        }

        if (points.length) api.fitToPoints(points, { padding: 56, maxZoom: 14 });

        apiRef.current = api;
        setMapReady(true);
      } catch {
        setMapReady(false);
      }
    })();

    return () => {
      cancelled = true;
      heatCleanup.forEach((fn) => fn());
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, [mapKey, orders, shipments, heatPoints, showHeatmap]);

  const dc = getDefaultCenter();
  return (
    <MapShell
      className={className}
      latitude={dc[1]}
      longitude={dc[0]}
      label="Operaciones Urabá"
      mapReady={mapReady}
    >
      <div ref={containerRef} className="h-full w-full" />
    </MapShell>
  );
}
