import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { isWebGLSupported } from '@/lib/maplibre';
import StaticMapFallback from './StaticMapFallback';
import BrandedLoadingScreen from '@/components/feedback/BrandedLoadingScreen';

/**
 * Contenedor de mapa con fallback WebGL → OSM estático.
 */
export default function MapShell({
  className = 'h-56 w-full',
  latitude,
  longitude,
  label = 'Ubicación',
  mapReady = false,
  children,
  showAttribution = true,
}) {
  const [webglOk, setWebglOk] = useState(null);

  useEffect(() => {
    setWebglOk(isWebGLSupported());
  }, []);

  if (webglOk === false && latitude != null && longitude != null) {
    return <StaticMapFallback latitude={latitude} longitude={longitude} label={label} className={className} />;
  }

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border/70 bg-muted/20 shadow-soft', className)}>
      {!mapReady && webglOk !== false && (
        <div className="absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
          <BrandedLoadingScreen variant="overlay" message="Cargando mapa…" className="h-full min-h-0" />
        </div>
      )}
      {children}
      {showAttribution && mapReady && (
        <p className="pointer-events-none absolute bottom-1 right-2 z-20 rounded bg-background/80 px-1.5 py-0.5 text-[9px] text-muted-foreground backdrop-blur-sm">
          © OpenFreeMap · OSM
        </p>
      )}
    </div>
  );
}
