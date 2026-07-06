import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { STORE } from '@/utils/marketplace-copy';

export default function BusinessCoverageBanner({ catalog, business, canOrder, className }) {
  if (canOrder) return null;

  const isAway = catalog?.awayFromHome && catalog?.mode === 'away_blocked';
  const isUnknown = catalog?.mode === 'unknown';

  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        isUnknown
          ? 'border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100'
          : 'border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100',
        className,
      )}
    >
      <div className="flex gap-3">
        <AppIcon name="map" size="sm" className="mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="font-bold">
            {isUnknown
              ? 'Activa tu ubicación para pedir'
              : isAway
                ? 'Estás lejos de esta tienda'
                : 'Sin cobertura en tu zona'}
          </p>
          <p className="mt-1 text-xs opacity-90">
            {isUnknown
              ? 'Puedes ver el catálogo. Para comprar, permite GPS o elige tu municipio en inicio.'
              : isAway
                ? `Estás en ${catalog.detected || 'otra zona'} y ${business.name} opera en ${business.municipio}.`
                : `${business.name} en ${business.municipio} no entrega a ${catalog.viewMunicipio || 'tu ubicación'}.`}
          </p>
          <Link to="/" className="mt-2 inline-block text-xs font-bold underline">
            {STORE.browseNearby}
          </Link>
        </div>
      </div>
    </div>
  );
}
