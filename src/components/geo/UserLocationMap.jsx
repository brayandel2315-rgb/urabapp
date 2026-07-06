import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '@/store/locationStore';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { createMapProvider } from '@/lib/map-provider';
import { useMapResize } from '@/hooks/useMapResize';
import { getDefaultCenter } from '@/services/map.service';
import { isGeolocationAvailable, isSecureContextForGeo } from '@/services/location.service';
import { Button } from '@/design-system/ui/button';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

export default function UserLocationMap({ className, compact = false }) {
  const containerRef = useRef(null);
  const mapApiRef = useRef(null);
  const markerRef = useRef(null);
  const [ready, setReady] = useState(false);

  const latitude = useLocationStore((s) => s.latitude);
  const longitude = useLocationStore((s) => s.longitude);
  const detectedMunicipio = useLocationStore((s) => s.detectedMunicipio);
  const detectedLabel = useLocationStore((s) => s.detectedLabel);
  const detectedCityDisplay = useLocationStore((s) => s.detectedCityDisplay);
  const inServiceArea = useLocationStore((s) => s.inServiceArea);
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const accuracy = useLocationStore((s) => s.locationAccuracy);
  const { detect } = useAutoLocation({ auto: false });

  const hasCoords = latitude != null && longitude != null;
  const pending = locationStatus === 'pending';
  const denied = locationStatus === 'denied';
  const needsPermission = !hasCoords && (locationStatus === 'idle' || denied || locationStatus === 'error');

  useEffect(() => {
    if (!containerRef.current || !hasCoords) return undefined;

    let cancelled = false;

    (async () => {
      const api = await createMapProvider(containerRef.current, {
        center: { latitude, longitude },
        zoom: compact ? 13 : 14,
      });
      if (cancelled) {
        api.destroy();
        return;
      }

      mapApiRef.current = api;
      markerRef.current = await api.addMarker(
        { latitude, longitude },
        { color: '#1C8238', title: 'Tu ubicación' },
      );
      setReady(true);
    })();

    return () => {
      cancelled = true;
      mapApiRef.current?.destroy();
      mapApiRef.current = null;
      markerRef.current = null;
      setReady(false);
    };
  }, [hasCoords, compact]);

  useMapResize(containerRef, mapApiRef, ready);

  useEffect(() => {
    if (!ready || !hasCoords || !markerRef.current) return;
    mapApiRef.current?.setMarkerPosition(markerRef.current, { latitude, longitude });
    mapApiRef.current?.setCenter({ latitude, longitude });
  }, [latitude, longitude, ready, hasCoords]);

  const heightClass = compact ? 'h-40' : 'h-52 sm:h-60';

  if (needsPermission) {
    const secure = isSecureContextForGeo();
    const geoOk = isGeolocationAvailable();

    return (
      <section
        className={cn(
          'overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-4 shadow-sm',
          className,
        )}
        aria-label="Activar ubicación"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AppIcon name="map" size="md" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-foreground">
              {denied ? 'Activa tu ubicación' : 'Muéstrame dónde estás'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {!secure
                ? 'Abre Urabapp con HTTPS para usar GPS.'
                : !geoOk
                  ? 'Tu navegador no soporta geolocalización.'
                  : denied
                    ? 'Ve a Configuración del sitio → Ubicación → Permitir para urabapp.vercel.app'
                    : 'Urabapp usa tu GPS para ubicarte en el Urabá y ordenar por cercanía.'}
            </p>
            {secure && geoOk && (
              <Button
                type="button"
                size="sm"
                className="mt-3"
                disabled={pending}
                onClick={() => detect()}
              >
                {pending ? 'Detectando…' : 'Usar mi ubicación'}
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (pending && !hasCoords) {
    return (
      <section
        className={cn(
          'overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-card p-4 shadow-sm',
          className,
        )}
        aria-label="Detectando ubicación"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AppIcon name="map" size="md" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-foreground">Detectando ubicación…</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Esto puede tardar unos segundos. Mientras tanto puedes seguir explorando la app.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!hasCoords) {
    return (
      <section className={cn('rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground', className)}>
        Ubicación no disponible. Toca «Usar mi ubicación» arriba cuando quieras activar el GPS.
      </section>
    );
  }

  if (inServiceArea === false) {
    return null;
  }

  const shortLabel = detectedCityDisplay || detectedLabel?.split(',')[0] || detectedMunicipio;
  const coverageNote = detectedMunicipio
    ? `Cobertura en ${detectedMunicipio}`
    : 'Dentro del Urabá';

  return (
    <section className={cn('overflow-hidden rounded-2xl border border-border bg-card shadow-sm', className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Tu ubicación</p>
          <p className="truncate text-sm font-semibold text-foreground">
            {shortLabel}
          </p>
          <p className={cn('text-xs font-medium text-primary')}>
            {coverageNote}
          </p>
        </div>
        <button
          type="button"
          onClick={() => detect()}
          disabled={pending}
          className="shrink-0 text-xs font-bold text-primary hover:underline disabled:opacity-50"
        >
          {pending ? '…' : 'Actualizar'}
        </button>
      </div>
      <div ref={containerRef} className={cn('w-full', heightClass)} />
      {accuracy != null && (
        <p className="px-3 py-2 text-[11px] text-muted-foreground">
          {latitude.toFixed(5)}, {longitude.toFixed(5)} · Precisión ~{Math.round(accuracy)} m
        </p>
      )}
    </section>
  );
}

/** Mapa estático de fallback cuando aún no hay coords (Apartadó) */
export function UrabaRegionMap({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    let cancelled = false;
    let api;

    (async () => {
      const center = { latitude: getDefaultCenter()[1], longitude: getDefaultCenter()[0] };
      api = await createMapProvider(containerRef.current, { center, zoom: 10, interactive: false });
      if (cancelled) api.destroy();
    })();

    return () => {
      cancelled = true;
      api?.destroy();
    };
  }, []);

  return <div ref={containerRef} className={cn('h-32 w-full rounded-xl', className)} aria-hidden />;
}
