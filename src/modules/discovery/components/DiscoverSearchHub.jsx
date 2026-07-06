import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { HOME_CATEGORY_TILES } from '@/data/vertical-catalog';
import { useHomeSearchStore } from '@/modules/home/store/homeSearchStore';
import { cn } from '@/lib/utils';

const ROUTE_OVERRIDES = { mensajeria: '/mandado' };

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2">
        {icon && <AppIcon name={icon} size="sm" className="text-primary" />}
        <h2 className="font-display text-base font-bold text-foreground sm:text-lg">{title}</h2>
      </div>
      {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export default function DiscoverSearchHub({
  popular = [],
  trending = [],
  municipio,
  onSelectTerm,
  className,
}) {
  const history = useHomeSearchStore((s) => s.history);
  const clearHistory = useHomeSearchStore((s) => s.clearHistory);

  const trendingItems = trending.length ? trending : popular.map((p) => p.term).filter(Boolean);
  const popularItems = popular.length ? popular : [];

  return (
    <div className={cn('space-y-8 pb-6', className)}>
      {/* Atajos por categoría */}
      <section aria-label="Explorar por categoría">
        <SectionTitle
          icon="filter"
          title="Explora por categoría"
          subtitle="Lo mismo que en las mejores apps de delivery"
        />
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 md:gap-4">
          {HOME_CATEGORY_TILES.filter((c) => c.id !== 'more').slice(0, 8).map((cat) => {
            const to = ROUTE_OVERRIDES[cat.id] || cat.route;
            return (
              <Link
                key={cat.id}
                to={to}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-card p-2.5 ring-1 ring-border/50 transition-all hover:-translate-y-0.5 hover:ring-primary/30 hover:shadow-soft sm:p-3"
              >
                <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} size="lg" />
                <span className="text-center text-[10px] font-bold leading-tight text-foreground sm:text-[11px]">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Historial */}
      {history.length > 0 && (
        <section aria-label="Búsquedas recientes">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <AppIcon name="orders" size="sm" className="text-primary" />
                <h2 className="font-display text-base font-bold text-foreground sm:text-lg">Búsquedas recientes</h2>
              </div>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="shrink-0 text-xs font-bold text-primary"
            >
              Borrar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSelectTerm(term)}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-3.5 py-2 text-xs font-bold text-foreground ring-1 ring-border/40 transition-colors hover:bg-primary/10 hover:ring-primary/30"
              >
                <AppIcon name="search" size="xs" className="text-muted-foreground" />
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Tendencias */}
      {trendingItems.length > 0 && (
        <section aria-label="Tendencias">
          <SectionTitle
            icon="trend"
            title="Tendencias en Urabá"
            subtitle={municipio ? `Lo más buscado en ${municipio}` : 'Basado en búsquedas reales'}
          />
          <div className="space-y-2">
            {trendingItems.slice(0, 6).map((term, i) => (
              <button
                key={term}
                type="button"
                onClick={() => onSelectTerm(term)}
                className="discover-trend-row group"
              >
                <span className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black',
                  i < 3 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-foreground">
                  {term}
                </span>
                <AppIcon
                  name="back"
                  size="xs"
                  className="rotate-180 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Populares con pills */}
      {popularItems.length > 0 && (
        <section aria-label="Más buscado">
          <SectionTitle
            icon="tag"
            title="Más buscado ahora"
            subtitle="Toca para buscar al instante"
          />
          <div className="flex flex-wrap gap-2">
            {popularItems.map((p, i) => (
              <button
                key={p.term}
                type="button"
                onClick={() => onSelectTerm(p.term)}
                className={cn(
                  'rounded-full px-4 py-2.5 text-xs font-bold shadow-soft ring-1 transition-transform active:scale-95',
                  i === 0
                    ? 'bg-primary text-primary-foreground ring-primary/30'
                    : 'bg-card text-foreground ring-border/40 hover:ring-primary/25',
                )}
              >
                {p.term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Servicios rápidos */}
      <section aria-label="Servicios">
        <SectionTitle icon="mensajeria" title="¿No encuentras lo que buscas?" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/mandado"
            className="discover-service-card discover-service-card--blue"
          >
            <AppIcon name="mensajeria" size="md" />
            <div>
              <p className="font-bold text-foreground">Mensajería</p>
              <p className="text-xs text-muted-foreground">Mandados en tu municipio</p>
            </div>
          </Link>
          <Link
            to="/envios"
            className="discover-service-card discover-service-card--green"
          >
            <AppIcon name="envios" size="md" />
            <div>
              <p className="font-bold text-foreground">Envíos</p>
              <p className="text-xs text-muted-foreground">Entre municipios del Urabá</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
