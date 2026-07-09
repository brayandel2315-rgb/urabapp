import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import ServiceIconTile from '@/design-system/patterns/ServiceIconTile';
import { HOME_CATEGORY_TILES } from '@/data/vertical-catalog';
import { useHomeSearchStore } from '@/modules/home/store/homeSearchStore';
import { cn } from '@/lib/utils';

const ROUTE_OVERRIDES = { mensajeria: '/mandado' };

export default function DiscoverSearchHub({
  popular = [],
  trending = [],
  municipio,
  onSelectTerm,
  className,
}) {
  const history = useHomeSearchStore((s) => s.history);
  const clearHistory = useHomeSearchStore((s) => s.clearHistory);

  const trendingTerms = trending.length
    ? trending
    : popular.map((p) => p.term).filter(Boolean);
  const popularTerms = popular.map((p) => p.term).filter(Boolean);
  const suggestionTerms = trendingTerms.length ? trendingTerms.slice(0, 5) : popularTerms.slice(0, 8);

  return (
    <div className={cn('space-y-6 pb-6', className)}>
      <section aria-label="Explorar por categoría">
        <h2 className="mb-3 font-display text-base font-bold text-[#0D2B45]">Categorías</h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {HOME_CATEGORY_TILES.filter((c) => c.id !== 'more').slice(0, 6).map((cat) => {
            const to = ROUTE_OVERRIDES[cat.id] || cat.route;
            return (
              <Link
                key={cat.id}
                to={to}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-[#D5E3EF] bg-white p-2 transition hover:border-[#0E6BA8]/30"
              >
                <ServiceIconTile serviceId={cat.id} name={cat.icon || cat.id} size="md" />
                <span className="text-center text-[10px] font-semibold leading-tight text-[#0D2B45] sm:text-[11px]">
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {history.length > 0 && (
        <section aria-label="Búsquedas recientes">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold text-[#0D2B45]">Recientes</h2>
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs font-semibold text-[#0E6BA8]"
            >
              Borrar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 6).map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSelectTerm(term)}
                className="rounded-full border border-[#D8E2EC] bg-white px-3.5 py-2 text-xs font-semibold text-[#0D2B45] hover:border-[#0E6BA8]/40"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {suggestionTerms.length > 0 && (
        <section aria-label="Sugerencias">
          <h2 className="mb-2 font-display text-base font-bold text-[#0D2B45]">
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
                  className="flex w-full items-center gap-2 rounded-xl px-2 py-2.5 text-left text-sm font-medium text-[#0D2B45] hover:bg-[#E6F4FF]/60"
                >
                  <AppIcon name="search" size="xs" className="text-[#4A6278]" />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {suggestionTerms.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSelectTerm(term)}
                  className="rounded-full border border-[#D8E2EC] bg-white px-3.5 py-2 text-xs font-semibold text-[#0D2B45] hover:border-[#0E6BA8]/40"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="flex flex-wrap gap-4 text-sm">
        <Link to="/mandado" className="font-semibold text-[#0E6BA8]">
          Pedir mandado →
        </Link>
        <Link to="/envios" className="font-semibold text-[#0E6BA8]">
          Envíos intermunicipales →
        </Link>
      </section>
    </div>
  );
}
