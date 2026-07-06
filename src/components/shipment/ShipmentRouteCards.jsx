import { Link } from 'react-router-dom';
import { formatCOP } from '@/utils/currency';
import { getRouteAvailability } from '@/data/shipment-catalog';
import { cn } from '@/lib/utils';

export default function ShipmentRouteCards({ routes = [], onSelect, className }) {
  if (!routes.length) return null;

  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2', className)}>
      {routes.slice(0, 8).map((route) => {
        const { available, slotsLeft } = getRouteAvailability(route);
        const fee = route.base_fee ?? 15000;
        return (
          <article
            key={route.id}
            className="flex flex-col rounded-2xl border border-border/50 bg-card p-4 shadow-soft ring-1 ring-border/30"
          >
            <div className="flex items-center justify-center gap-3 font-display text-lg font-bold text-foreground">
              <span>{route.origin_municipio}</span>
              <span className="text-primary" aria-hidden>↓</span>
              <span>{route.dest_municipio}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Entrega ~{route.eta_hours}h</span>
              <span className="font-bold text-primary">Desde {formatCOP(fee)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {available ? `${slotsLeft} cupos hoy` : 'Sin cupos — prueba otra ruta'}
            </p>
            <button
              type="button"
              disabled={!available}
              onClick={() => onSelect?.(route)}
              className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              Enviar ahora
            </button>
          </article>
        );
      })}
    </div>
  );
}

export function ShipmentRouteCardLink({ route }) {
  const fee = route.base_fee ?? 15000;
  return (
    <Link
      to="/envios"
      state={{ origin: route.origin_municipio, dest: route.dest_municipio }}
      className="block rounded-2xl border border-border/50 bg-card p-4 shadow-soft"
    >
      <p className="font-display font-bold">{route.origin_municipio} → {route.dest_municipio}</p>
      <p className="mt-1 text-sm text-muted-foreground">Desde {formatCOP(fee)}</p>
    </Link>
  );
}
