import { useLocationStore } from '@/store/locationStore';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { cn } from '@/lib/utils';

function relativeUpdated(lastDetectedAt) {
  if (!lastDetectedAt) return 'Toca para detectar GPS';
  const sec = Math.max(0, Math.floor((Date.now() - lastDetectedAt) / 1000));
  if (sec < 8) return 'Actualizado hace segundos';
  if (sec < 60) return `Actualizado hace ${sec}s`;
  const min = Math.floor(sec / 60);
  return `Actualizado hace ${min} min`;
}

export default function HomeHeroLocationChip({ className, onRefreshLocation }) {
  const homeMunicipio = useLocationStore((s) => s.homeMunicipio || s.municipio);
  const detectedMunicipio = useLocationStore((s) => s.detectedMunicipio);
  const detectedLabel = useLocationStore((s) => s.detectedLabel);
  const detectedCityDisplay = useLocationStore((s) => s.detectedCityDisplay);
  const inServiceArea = useLocationStore((s) => s.inServiceArea);
  const lastDetectedAt = useLocationStore((s) => s.lastDetectedAt);
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const latitude = useLocationStore((s) => s.latitude);
  const { detect } = useAutoLocation({ auto: false });

  const away = Boolean(
    (detectedMunicipio && homeMunicipio && detectedMunicipio !== homeMunicipio)
    || inServiceArea === false,
  );
  const pending = locationStatus === 'pending';
  const hasGps = latitude != null && (locationStatus === 'granted' || locationStatus === 'fallback' || pending);
  const denied = locationStatus === 'denied';

  const displayCity = inServiceArea === false
    ? (detectedCityDisplay || detectedLabel?.split(',')[0] || 'tu ubicación')
    : (detectedMunicipio || homeMunicipio);
  const shortPlace = detectedCityDisplay || detectedLabel?.split(',')[0];

  const refresh = () => {
    detect();
    onRefreshLocation?.();
  };

  let headline = `Estás en ${displayCity}`;
  if (inServiceArea === false) headline = 'Fuera de cobertura';
  else if (pending && !hasGps) headline = 'Detectando ubicación…';
  else if (denied) headline = 'GPS desactivado';
  else if (hasGps && shortPlace) headline = `Estás en ${shortPlace}`;

  let subline = inServiceArea === false
    ? 'Toca para actualizar'
    : away
      ? `Compras en ${homeMunicipio} · ${relativeUpdated(lastDetectedAt)}`
      : `${relativeUpdated(lastDetectedAt)} · Toca para actualizar`;

  if (denied) subline = 'Toca para activar ubicación';
  else if (inServiceArea !== false && hasGps && shortPlace && detectedMunicipio) {
    subline = `${detectedMunicipio} · ${relativeUpdated(lastDetectedAt)}`;
  }

  return (
    <button
      type="button"
      onClick={refresh}
      className={cn(
        'group inline-flex max-w-full flex-col items-start gap-0.5 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2 text-left backdrop-blur-md transition hover:scale-[1.02] hover:bg-white/15 active:scale-[0.99]',
        denied && 'border-amber-300/40 bg-amber-500/15',
        className,
      )}
      aria-label={`Ubicación: ${displayCity}. Toca para actualizar`}
    >
      <span className="flex items-center gap-1.5 text-sm font-bold text-white">
        <span aria-hidden>{denied ? '⚠️' : '📍'}</span>
        {headline}
      </span>
      <span className="text-[11px] font-medium text-white/70 group-hover:text-white/85">
        {subline}
      </span>
    </button>
  );
}
