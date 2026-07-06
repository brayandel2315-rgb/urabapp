import { useEffect, useRef, useState, useCallback } from 'react';
import { geocodeAddress, getDefaultCenter, reverseGeocode } from '../../services/map.service';
import { createMapProvider } from '@/lib/map-provider';
import { useMapResize } from '@/hooks/useMapResize';
import MapShell from './MapShell';
import Button from '../ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';

export default function AddressMapPicker({
  municipio,
  latitude,
  longitude,
  onChange,
  addressHint = '',
}) {
  const containerRef = useRef(null);
  const mapApiRef = useRef(null);
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [placing, setPlacing] = useState(false);

  const defaultLat = getDefaultCenter()[1];
  const defaultLng = getDefaultCenter()[0];
  const displayLat = latitude ?? defaultLat;
  const displayLng = longitude ?? defaultLng;

  const placePin = useCallback(async (lat, lng) => {
    setPlacing(true);
    try {
      const label = await reverseGeocode(lat, lng);
      const payload = { latitude: lat, longitude: lng, label: label || '' };
      if (markerRef.current) {
        mapApiRef.current?.setMarkerPosition(markerRef.current, payload);
      }
      mapApiRef.current?.flyTo(payload, 16);
      onChange?.(payload);
    } finally {
      setPlacing(false);
    }
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    let cancelled = false;

    (async () => {
      const center = latitude != null && longitude != null
        ? { latitude, longitude }
        : { latitude: defaultLat, longitude: defaultLng };

      try {
        const api = await createMapProvider(containerRef.current, { center, zoom: 15 });
        if (cancelled) {
          api.destroy();
          return;
        }

        mapApiRef.current = api;
        markerRef.current = await api.addMarker(center, {
          color: '#1C8238',
          draggable: true,
          title: 'Tu entrega',
          onDragEnd: ({ latitude: lat, longitude: lng }) => placePin(lat, lng),
        });

        api.onClick(({ latitude: lat, longitude: lng }) => placePin(lat, lng));
        setReady(true);
      } catch {
        if (!cancelled) setReady(false);
      }
    })();

    return () => {
      cancelled = true;
      mapApiRef.current?.destroy();
      mapApiRef.current = null;
      markerRef.current = null;
      setReady(false);
    };
  }, []);

  useMapResize(containerRef, mapApiRef, ready);

  useEffect(() => {
    if (!ready || latitude == null || longitude == null) return;
    mapApiRef.current?.setMarkerPosition(markerRef.current, { latitude, longitude });
    mapApiRef.current?.setCenter({ latitude, longitude });
  }, [latitude, longitude, ready]);

  const handleGeocode = async () => {
    if (!addressHint?.trim()) return;
    setLoading(true);
    try {
      const result = await geocodeAddress(addressHint, { municipio });
      if (result) {
        await placePin(result.latitude, result.longitude);
        if (result.label) onChange?.(result);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasPin = latitude != null && longitude != null;

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-foreground">Ubicación en el mapa</p>
          <p className="text-xs text-muted-foreground">
            Toca el mapa, arrastra el pin o centra con tu dirección. El repartidor llega exacto.
          </p>
        </div>
        {hasPin && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
            <AppIcon name="check" size="xs" />
            Marcado
          </span>
        )}
      </div>

      <MapShell
        className="h-64 w-full sm:h-72"
        latitude={displayLat}
        longitude={displayLng}
        label="Entrega"
        mapReady={ready}
      >
        <div ref={containerRef} className="absolute inset-0" />
      </MapShell>

      {(placing || loading) && (
        <p className="text-center text-xs font-medium text-muted-foreground">
          {placing ? 'Obteniendo dirección…' : 'Ubicando en el mapa…'}
        </p>
      )}

      {addressHint && (
        <Button type="button" variant="outline" size="sm" disabled={loading || placing} onClick={handleGeocode} className="w-full sm:w-auto">
          <AppIcon name="map" size="sm" />
          {loading ? 'Ubicando…' : 'Centrar con mi dirección escrita'}
        </Button>
      )}
    </div>
  );
}
