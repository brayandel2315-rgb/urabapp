import { useLocationStore } from '@/store/locationStore';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { Button } from '@/design-system/ui/button';
import AppIcon from '@/design-system/icons/AppIcon';
import { isGeolocationAvailable, isSecureContextForGeo } from '@/services/location.service';

export default function LocationPromptBanner() {
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const latitude = useLocationStore((s) => s.latitude);
  const { catalog } = useCatalogLocation();
  const { detect } = useAutoLocation({ auto: false });

  const hasCoords = latitude != null;
  const pending = locationStatus === 'pending';

  if (hasCoords) return null;
  if (catalog.mode === 'away_blocked' || catalog.mode === 'out_of_coverage') return null;

  const secure = isSecureContextForGeo();
  const geoOk = isGeolocationAvailable();

  let title = 'Activa tu ubicación';
  let body = 'Así te mostramos comercios cerca y tu posición en el mapa del Urabá.';

  if (!secure) {
    title = 'HTTPS requerido';
    body = 'La geolocalización solo funciona en conexión segura (https://).';
  } else if (!geoOk) {
    title = 'GPS no disponible';
    body = 'Tu navegador no permite detectar ubicación en este dispositivo.';
  } else if (locationStatus === 'denied') {
    body = 'Si ya diste permiso y no funciona, abre Configuración del sitio en tu navegador y activa Ubicación para urabapp.vercel.app.';
  } else if (locationStatus === 'error') {
    body = 'No pudimos fijar tu ubicación exacta. Activa el GPS del teléfono, sal cerca de una ventana o ingresa la dirección manualmente.';
  } else if (pending) {
    title = 'Buscando señal GPS…';
    body = 'Primero red/WiFi, luego GPS de alta precisión. Puede tardar unos segundos.';
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 dark:border-amber-900/50 dark:bg-amber-950/40 sm:flex-row sm:items-center sm:justify-between"
      role="status"
      aria-live="polite"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
          <AppIcon name="map" size="sm" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-foreground">{title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
      {secure && geoOk && locationStatus !== 'pending' && (
        <Button type="button" size="sm" variant="default" className="shrink-0" onClick={() => detect()}>
          {locationStatus === 'denied' ? 'Reintentar GPS' : 'Activar ubicación'}
        </Button>
      )}
    </div>
  );
}
