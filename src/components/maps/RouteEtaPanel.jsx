import { AnimatePresence, motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  formatArrivalTime,
  formatEtaLabel,
  routeQualityLabel,
  ROUTE_PROVIDER,
} from '@/utils/routing';
import { cn } from '@/lib/utils';
import { spring } from '@/design-system/motion/presets';

/**
 * Barra de ETA unificada — pedidos, mandados y envíos.
 * Muestra rango, distancia, hora de llegada y calidad de la ruta.
 */
export default function RouteEtaPanel({
  route,
  loading = false,
  className,
  compact = false,
}) {
  if (loading) {
    return (
      <div className={cn('flex items-center gap-2 rounded-[var(--radius-component)] bg-muted/40 px-3 py-2 text-sm text-muted-foreground', className)}>
        <AppIcon name="loading" size="sm" spin className="text-primary" />
        Calculando ruta…
      </div>
    );
  }

  if (!route) return null;

  const etaLabel = formatEtaLabel(route);
  const arrival = formatArrivalTime(route.arrivalAt);
  const quality = routeQualityLabel(route.provider);
  const isOrs = route.provider === ROUTE_PROVIDER.ORS;

  if (!etaLabel && !route.km) return null;

  return (
    <div
      className={cn(
        'rounded-[var(--radius-component)] border px-3 py-2.5',
        isOrs
          ? 'border-primary/25 bg-primary/[0.06]'
          : 'border-border/60 bg-muted/30',
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <AppIcon name="mensajeria" size="sm" className="text-primary" />
          </span>
          <div>
            <AnimatePresence mode="wait">
              {etaLabel ? (
                <motion.p
                  key={etaLabel}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={spring}
                  className="font-display text-sm font-bold text-foreground"
                >
                  {compact ? etaLabel : `Llegada ${etaLabel}`}
                </motion.p>
              ) : null}
            </AnimatePresence>
            <p className="text-xs text-muted-foreground">
              {route.km != null && `${route.km} km`}
              {route.km != null && arrival && ' · '}
              {arrival && `~${arrival}`}
            </p>
          </div>
        </div>
        {quality && (
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
              isOrs ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
            )}
          >
            {quality}
          </span>
        )}
      </div>
      {isOrs && !compact && (
        <p className="mt-1.5 text-[10px] text-muted-foreground/80">
          Rutas © OpenRouteService · datos OpenStreetMap
        </p>
      )}
    </div>
  );
}
