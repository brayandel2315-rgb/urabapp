import { useMemo, useState } from 'react';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/design-system/ui/dialog';
import { cn } from '@/lib/utils';
import { BARRIO_ALL_ID } from '@/data/uraba-barrios';
import {
  getBarrioGroups,
  getMunicipioBarrioFooter,
  searchBarriosByMunicipio,
  getTodoMunicipioLabel,
  filterPopularBarrios,
  filterBarrioGroups,
  getPopularBarrios,
} from '@/data/uraba-barrios';
import { getBarrioLabel, getBarrioSubtitle, isSpecificBarrio } from '@/utils/barrio';
import { STORE } from '@/utils/marketplace-copy';

const TRIGGER = {
  hero: cn(
    'inline-flex max-w-[10.5rem] items-center gap-1.5 rounded-full border border-white/25',
    'bg-white/15 px-2.5 py-1.5 text-white shadow-md backdrop-blur-md',
    'transition-all hover:bg-white/25 active:scale-[0.98]'
  ),
  default: cn(
    'inline-flex max-w-full items-center gap-2 rounded-xl border border-input bg-background',
    'px-3 py-2 shadow-soft transition-all hover:border-primary/40 hover:bg-muted/30 active:scale-[0.98]'
  ),
  checkout: cn(
    'flex w-full items-center gap-3 rounded-2xl border border-input bg-background',
    'px-4 py-3 shadow-soft transition-all hover:border-primary/40 hover:bg-muted/20 active:scale-[0.99]'
  ),
  inline: cn(
    'inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5',
    'px-3 py-1.5 text-sm font-semibold text-primary transition-all hover:bg-primary/10'
  ),
};

export default function UrabaBarrioPicker({
  municipio,
  value = BARRIO_ALL_ID,
  onChange,
  variant = 'default',
  purpose = 'catalog',
  className = '',
  label = 'Elegir barrio de entrega',
  showAllOption = true,
  /** Solo en catálogo: limita a barrios con comercios registrados */
  occupiedBarrios = null,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const isHero = variant === 'hero';
  const isCheckout = purpose === 'checkout';
  const allowAllMunicipio = !isCheckout && showAllOption;
  const filterByOccupancy = !isCheckout && occupiedBarrios != null;
  const hasValue = isSpecificBarrio(value);

  const display = isCheckout && !hasValue
    ? 'Selecciona tu barrio'
    : getBarrioLabel(value, municipio);

  const triggerSubtitle = isCheckout
    ? (hasValue ? getBarrioSubtitle(value, municipio) : 'Requerido para la entrega')
    : (hasValue ? 'Barrio de entrega' : 'Ver todo el municipio');

  const subtitle = getBarrioSubtitle(value, municipio);
  const todoLabel = getTodoMunicipioLabel(municipio);

  const popular = useMemo(
    () => (filterByOccupancy ? filterPopularBarrios(municipio, occupiedBarrios) : getPopularBarrios(municipio)),
    [municipio, occupiedBarrios, filterByOccupancy]
  );

  const allGroups = useMemo(
    () => (filterByOccupancy ? filterBarrioGroups(municipio, occupiedBarrios) : getBarrioGroups(municipio)),
    [municipio, occupiedBarrios, filterByOccupancy]
  );

  const groups = useMemo(
    () => searchBarriosByMunicipio(municipio, query, filterByOccupancy ? occupiedBarrios : null),
    [municipio, query, occupiedBarrios, filterByOccupancy]
  );

  const select = (barrio) => {
    onChange(barrio);
    setOpen(false);
    setQuery('');
  };

  if (!getBarrioGroups(municipio).length) return null;

  const footerHint = filterByOccupancy
    ? occupiedBarrios.length
      ? STORE.withStores(occupiedBarrios.length)
      : 'Aún no hay barrios con tiendas registradas'
    : getMunicipioBarrioFooter(municipio);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(TRIGGER[variant] || TRIGGER.default, className)}
      >
        <AppIcon name="map" size="xs" className={isHero ? 'text-white' : 'text-primary'} />
        <span className="min-w-0 flex-1 text-left">
          <span className={cn(
            'block truncate font-bold leading-tight',
            isHero ? 'text-xs text-white' : isCheckout ? 'text-sm text-foreground' : 'text-xs text-foreground',
          )}
          >
            {allowAllMunicipio || hasValue ? display : 'Selecciona tu barrio'}
          </span>
          {variant !== 'inline' && (
            <span className={cn(
              'block truncate text-[10px] font-medium',
              isHero ? 'text-white/75' : 'text-muted-foreground',
              isCheckout && 'text-xs',
            )}
            >
              {triggerSubtitle}
            </span>
          )}
        </span>
        <AppIcon name="chevronDown" size="xs" className={cn('shrink-0 opacity-70', isHero ? 'text-white' : 'text-muted-foreground')} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            'gap-0 overflow-hidden p-0',
            'fixed inset-x-0 bottom-0 top-auto max-h-[90vh] w-full max-w-none translate-x-0 translate-y-0 rounded-b-none rounded-t-3xl',
            'sm:inset-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[85vh] sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl'
          )}
        >
          <DialogHeader className="border-b border-border/60 px-5 pb-4 pt-5 text-left">
            <DialogTitle className="text-xl">
              {isCheckout ? 'Barrio de entrega' : '¿A qué barrio te entregamos?'}
            </DialogTitle>
            <DialogDescription>
              {isCheckout
                ? `Elige el barrio exacto en ${municipio}. El repartidor lo usa junto con el pin del mapa.`
                : filterByOccupancy
                  ? `Solo barrios con tiendas activas en ${municipio}. También puedes ver todo el municipio.`
                  : `Priorizamos tiendas de tu zona en ${municipio}. Las que entregan en todo el municipio también aparecen.`}
            </DialogDescription>
          </DialogHeader>

          <div className="border-b border-border/40 px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-input bg-muted/30 px-3 py-2.5">
              <AppIcon name="search" size="sm" className="text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar barrio..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[min(58vh,520px)] overflow-y-auto px-4 py-4">
            {!query && allowAllMunicipio && (
              <>
                <button
                  type="button"
                  onClick={() => select(BARRIO_ALL_ID)}
                  className={cn(
                    'mb-4 flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all',
                    !hasValue ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border hover:border-primary/30'
                  )}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <AppIcon name="store" size="sm" />
                  </span>
                  <span className="flex-1">
                    <span className="font-display font-bold text-foreground">{todoLabel}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{STORE.allMunicipio}</span>
                  </span>
                  {!hasValue && <AppIcon name="check" size="sm" className="text-primary" />}
                </button>

                {popular.length > 0 && (
                  <>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {isCheckout ? 'Frecuentes' : STORE.barrioWithStores}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-2">
                      {popular.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => select(b)}
                          className={cn(
                            'rounded-full px-3 py-1.5 text-xs font-bold transition-colors',
                            value === b ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-primary/15'
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {groups.length > 0 ? (
              <div className="space-y-4">
                {(query ? groups : allGroups).map((group) => (
                  <div key={group.id}>
                    <p className="mb-2 text-xs font-bold text-foreground">
                      {group.name}
                      {group.subtitle && (
                        <span className="ml-1.5 font-medium text-muted-foreground">{group.subtitle}</span>
                      )}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {group.barrios.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => select(b)}
                          className={cn(
                            'rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-all',
                            value === b ? 'border-primary bg-primary/10 text-primary' : 'border-border/70 bg-card text-foreground hover:border-primary/35'
                          )}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {query
                  ? 'No encontramos ese barrio. Prueba otro nombre o revisa la ortografía.'
                  : isCheckout
                    ? 'No hay barrios configurados para este municipio. Contacta soporte.'
                    : STORE.noStoresByBarrio}
              </p>
            )}
          </div>

          <div className="border-t border-border/60 bg-muted/20 px-5 py-3">
            <p className="text-center text-[11px] text-muted-foreground">
              {hasValue ? `Entrega en ${display} · ${subtitle}` : footerHint}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
