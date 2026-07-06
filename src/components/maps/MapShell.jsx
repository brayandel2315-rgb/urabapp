import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { isWebGLSupported } from '@/lib/maplibre';
import StaticMapFallback from './StaticMapFallback';
import AppIcon from '@/design-system/icons/AppIcon';

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
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-muted/40 backdrop-blur-[1px]">
          <AppIcon name="loading" size="lg" className="animate-spin text-primary" />
          <p className="text-xs font-medium text-muted-foreground">Cargando mapa…</p>
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
