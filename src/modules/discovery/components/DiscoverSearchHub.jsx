import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { HOME_CATEGORY_TILES } from '@/data/vertical-catalog';
import { useHomeSearchStore } from '@/modules/home/store/homeSearchStore';
import { getContextualSearchHints } from '@/modules/home/utils/home-context';
import { cn } from '@/lib/utils';

const ROUTE_OVERRIDES = { mensajeria: '/mandado' };

function ChipButton({ term, onSelect, tone = 'default' }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(term)}
      className={cn(
        'rounded-full border px-3.5 py-2 text-xs font-semibold transition',
        tone === 'suggest'
          ? 'border-primary/25 bg-primary/8 text-primary hover:bg-primary/12'
          : 'border-border bg-card text-foreground hover:border-primary/35',
      )}
    >
      {term}
    </button>
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
  const smart = getContextualSearchHints(municipio);

  const trendingTerms = trending.length
    ? trending
    : popular.map((p) => p.term).filter(Boolean);
  const popularTerms = popular.map((p) => p.term).filter(Boolean);
  const suggestionTerms = trendingTerms.length ? trendingTerms.slice(0, 5) : popularTerms.slice(0, 8);

  return (
    <div className={cn('space-y-6 pb-6', className)}>
      <section aria-label="Explorar por categoría">
        <h2 className="mb-3 font-display text-base font-bold text-foreground">Categorías</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {HOME_CATEGORY_TILES.filter((c) => c.id !== 'more').slice(0, 6).map((cat) => {
            const to = ROUTE_OVERRIDES[cat.id] || cat.route;
            return (
              <Link
                key={cat.id}
                to={to}
                className="flex flex-col items-center gap-1.5 rounded-[var(--radius-component)] border border-border bg-card p-2.5 shadow-soft transition hover:border-primary/30 hover:shadow-card"
              >
                <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} size="md" />
                <span className="text-center text-[10px] font-semibold leading-tight text-foreground sm:text-[11px]">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label={smart.title}>
        <h2 className="mb-2 font-display text-base font-bold text-foreground">{smart.title}</h2>
        <p className="mb-2.5 text-xs text-muted-foreground">
          Ideas según la hora · toca para buscar
        </p>
        <div className="flex flex-wrap gap-2">
          {smart.hints.map((term) => (
            <ChipButton key={term} term={term} onSelect={onSelectTerm} tone="suggest" />
          ))}
        </div>
      </section>

      {history.length > 0 && (
        <section aria-label="Búsquedas recientes">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-foreground">Recientes</h2>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs font-semibold text-primary"
            >
              Borrar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 6).map((term) => (
              <ChipButton key={term} term={term} onSelect={onSelectTerm} />
            ))}
          </div>
        </section>
      )}

      {suggestionTerms.length > 0 && (
        <section aria-label="Tendencias">
          <h2 className="mb-2 font-display text-base font-bold text-foreground">
            {trendingTerms.length ? 'Tendencias' : 'Populares'}
            {municipio ? ` en ${municipio}` : ''}
          </h2>
          {trendingTerms.length ? (
            <div className="space-y-1">
              {suggestionTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelectTerm(term)}
                  className="flex w-full items-center gap-2 rounded-[var(--radius-lg)] px-2 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted"
                >
                  <AppIcon name="search" size="xs" className="text-muted-foreground" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {suggestionTerms.map((term) => (
                <ChipButton key={term} term={term} onSelect={onSelectTerm} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="flex flex-wrap gap-4 text-sm">
        <Link to="/mandado" className="font-semibold text-primary">
          Pedir mandado →
        </Link>
        <Link to="/envios" className="font-semibold text-primary">
          Envíos intermunicipales →
        </Link>
      </section>
    </div>
  );
}
