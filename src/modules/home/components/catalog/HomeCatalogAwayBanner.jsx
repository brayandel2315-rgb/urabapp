import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function HomeCatalogAwayBanner({
  catalog,
  onEnableIntermunicipal,
  onRefreshLocation,
  className,
}) {
  if (catalog?.mode === 'out_of_coverage') {
    return (
      <section
        aria-label="Fuera de cobertura"
        className={cn(
          'rounded-2xl border border-destructive/25 bg-destructive/5 px-4 py-3',
          className,
        )}
      >
        <p className="text-sm font-semibold text-destructive">Fuera de cobertura</p>
      </section>
    );
  }

  if (!catalog?.awayFromHome) return null;

  if (catalog.mode === 'away_blocked') {
    return (
      <section
        aria-labelledby="catalog-away-title"
        className={cn(
          'rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6',
          className
        )}
      >
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <AppIcon name="map" size="md" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="catalog-away-title" className="font-display text-lg font-bold text-foreground">
              Estás en {catalog.detected}, tu zona de compra es {catalog.home}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Los comercios locales de {catalog.home} no hacen entrega inmediata donde estás ahora.
              Activa envíos entre municipios para ver opciones que llegan a {catalog.detected}.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={onEnableIntermunicipal}>
                Ver envíos intermunicipales
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={onRefreshLocation}>
                Actualizar ubicación
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/envios">Cotizar envío</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (catalog.mode === 'intermunicipal_only') {
    return (
      <section
        className={cn(
          'rounded-2xl border border-teal-500/25 bg-teal-500/10 px-4 py-3 text-sm text-foreground',
          className
        )}
      >
        <span className="font-semibold text-teal-800 dark:text-teal-200">
          Modo intermunicipal activo
        </span>
        <span className="text-muted-foreground">
          {' '}— Mostrando comercios que envían a {catalog.detected} desde otras ciudades.
        </span>
        <button
          type="button"
          onClick={() => onEnableIntermunicipal?.(false)}
          className="ml-2 font-semibold text-teal-700 underline-offset-2 hover:underline dark:text-teal-300"
        >
          Volver a solo mi municipio
        </button>
      </section>
    );
  }

  return null;
}
