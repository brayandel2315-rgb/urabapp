import AppIcon from '@/design-system/icons/AppIcon';
import { Button } from '@/design-system/ui/button';
import { useLocationStore } from '@/store/locationStore';
import { cn } from '@/lib/utils';
import { useAutoLocation } from '@/hooks/useAutoLocation';

export default function DetectedLocationChip({ variant = 'default', className, onRefresh }) {
  const homeMunicipio = useLocationStore((s) => s.homeMunicipio || s.municipio);
  const detectedMunicipio = useLocationStore((s) => s.detectedMunicipio);
  const detectedLabel = useLocationStore((s) => s.detectedLabel);
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const { detect } = useAutoLocation({ auto: false });

  const isHero = variant === 'hero';
  const pending = locationStatus === 'pending';
  const away = Boolean(detectedMunicipio && homeMunicipio && detectedMunicipio !== homeMunicipio);

  const handleRefresh = () => {
    detect();
    onRefresh?.();
  };

  const primaryLabel = pending
    ? 'Detectando ubicación…'
    : detectedMunicipio
      ? `Estás en ${detectedMunicipio}`
      : locationStatus === 'denied'
        ? 'GPS desactivado'
        : `Zona: ${homeMunicipio}`;

  return (
    <div
      className={cn(
        'inline-flex max-w-full flex-col gap-0.5 rounded-2xl border px-3 py-1.5 text-xs font-bold backdrop-blur-md',
        isHero
          ? 'border-white/25 bg-white/15 text-white'
          : 'border-primary/25 bg-primary/5 text-foreground',
        className
      )}
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <AppIcon name="map" size="xs" className={isHero ? 'text-emerald-300' : 'text-primary'} />
        <span className="min-w-0 truncate">{primaryLabel}</span>
        {locationStatus === 'denied' && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn('h-6 px-2 text-[10px]', isHero && 'text-white hover:bg-white/10')}
            onClick={handleRefresh}
          >
            Activar GPS
          </Button>
        )}
        {(locationStatus === 'granted' || detectedMunicipio) && (
          <button
            type="button"
            onClick={handleRefresh}
            className={cn(
              'shrink-0 text-[10px] font-semibold underline-offset-2 hover:underline',
              isHero ? 'text-white/80' : 'text-muted-foreground'
            )}
            aria-label="Actualizar ubicación"
          >
            Actualizar
          </button>
        )}
      </div>
      {away && (
        <span className={cn('pl-5 text-[10px] font-medium', isHero ? 'text-white/70' : 'text-muted-foreground')}>
          Tu municipio de compra: {homeMunicipio}
        </span>
      )}
      {detectedLabel && locationStatus === 'granted' && !isHero && (
        <span className="max-w-[12rem] truncate pl-5 text-[10px] font-medium text-muted-foreground">
          {detectedLabel.split(',')[0]}
        </span>
      )}
    </div>
  );
}
