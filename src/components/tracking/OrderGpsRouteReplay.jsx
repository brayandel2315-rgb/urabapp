import { useEffect, useRef, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createMapProvider } from '@/lib/map-provider';
import { getOrderLocationPings } from '@/services/order-tracking.service';
import MapShell from '@/components/maps/MapShell';
import Button from '@/components/ui/Button';

export default function OrderGpsRouteReplay({
  orderId,
  destLat,
  destLng,
  className = 'h-52 w-full',
}) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);

  const { data: pings = [], isLoading } = useQuery({
    queryKey: ['order-gps-pings', orderId],
    queryFn: () => getOrderLocationPings(orderId, { limit: 200 }),
    enabled: Boolean(orderId),
    staleTime: 30_000,
  });

  const trail = useMemo(
    () => [...pings]
      .reverse()
      .filter((p) => p.latitude != null && p.longitude != null)
      .map((p) => ({ latitude: Number(p.latitude), longitude: Number(p.longitude), at: p.recorded_at })),
    [pings],
  );

  const visibleTrail = playIndex >= 0 ? trail.slice(0, playIndex + 1) : trail;

  useEffect(() => {
    if (!containerRef.current || !trail.length) return undefined;

    let cancelled = false;
    const center = trail[trail.length - 1];

    (async () => {
      apiRef.current?.destroy();
      apiRef.current = null;
      setMapReady(false);

      try {
        const api = await createMapProvider(containerRef.current, { center, zoom: 14 });
        if (cancelled) {
          api.destroy();
          return;
        }

        if (visibleTrail.length > 1) {
          await api.drawLine(visibleTrail, { color: '#0ea5e9', weight: 4, opacity: 0.75 });
        }

        const last = visibleTrail[visibleTrail.length - 1];
        if (last) {
          await api.addMarker(last, { color: '#0ea5e9', title: 'Último ping GPS' });
        }

        if (destLat != null && destLng != null) {
          await api.addMarker(
            { latitude: Number(destLat), longitude: Number(destLng) },
            { color: '#1C8238', title: 'Destino' },
          );
        }

        api.fitToPoints(
          [...visibleTrail, destLat != null ? { latitude: Number(destLat), longitude: Number(destLng) } : null].filter(Boolean),
          { padding: 48, maxZoom: 16 },
        );

        apiRef.current = api;
        setMapReady(true);
      } catch {
        setMapReady(false);
      }
    })();

    return () => {
      cancelled = true;
      apiRef.current?.destroy();
      apiRef.current = null;
    };
  }, [trail.length, visibleTrail.length, destLat, destLng]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando ruta GPS…</p>;
  }

  if (!trail.length) {
    return (
      <p className="rounded-xl bg-muted/30 px-3 py-4 text-sm text-muted-foreground">
        Aún no hay pings GPS registrados para este pedido.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <MapShell
        className={className}
        latitude={trail[trail.length - 1]?.latitude}
        longitude={trail[trail.length - 1]?.longitude}
        label="Ruta GPS"
        mapReady={mapReady}
      >
        <div ref={containerRef} className="h-full w-full" />
      </MapShell>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setPlayIndex(-1)}
        >
          Ruta completa
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setPlayIndex((i) => (i < 0 ? 0 : Math.min(i + 5, trail.length - 1)))}
        >
          Reproducir
        </Button>
        <span className="text-xs text-muted-foreground">
          {visibleTrail.length} / {trail.length} puntos
        </span>
      </div>
    </div>
  );
}
