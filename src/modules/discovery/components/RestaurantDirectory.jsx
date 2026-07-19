import { useMemo } from 'react';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import BusinessCard from '@/components/BusinessCard';
import Button from '@/components/ui/Button';
import { PageState } from '@/design-system/patterns/PageState';
import {
  buildCuisineRailOptions,
  filterPoolByCuisine,
  getCuisineById,
  groupBusinessesByCuisine,
} from '@/data/cuisine-taxonomy';
import RestaurantCuisineRail from './RestaurantCuisineRail';
import RestaurantCuisineRow from './RestaurantCuisineRow';
import {
  VERTICAL_CATALOG_GRID,
  VERTICAL_CATALOG_LIST,
} from './VerticalSectionRow';

const FEATURED_SECTION_TYPES = ['cerca', 'abiertos'];
const FEATURED_LIMIT = 8;

/**
 * Directorio clasificado de restaurantes — rail + filas horizontales por cocina.
 */
export default function RestaurantDirectory({
  pool = [],
  sections = [],
  municipio,
  cuisineId = 'all',
  onCuisineChange,
  onOperationalFilter,
}) {
  const railOptions = useMemo(() => buildCuisineRailOptions(pool), [pool]);
  const cuisineGroups = useMemo(() => groupBusinessesByCuisine(pool), [pool]);
  const cuisinePool = useMemo(
    () => filterPoolByCuisine(pool, cuisineId),
    [pool, cuisineId],
  );

  const featuredRows = useMemo(() => {
    const byType = new Map((sections || []).map((s) => [s.type, s]));
    return FEATURED_SECTION_TYPES
      .map((type) => {
        const section = byType.get(type);
        const businesses = (section?.businesses || []).slice(0, FEATURED_LIMIT);
        if (!businesses.length) return null;
        return {
          id: type,
          label: type === 'cerca' ? 'Cerca de ti' : 'Abiertos ahora',
          count: section.businesses?.length ?? businesses.length,
          businesses,
        };
      })
      .filter(Boolean);
  }, [sections]);

  const activeCuisine = cuisineId !== 'all' ? getCuisineById(cuisineId) : null;

  return (
    <div className="restaurant-directory space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Clasificación
        </p>
        <RestaurantCuisineRail
          options={railOptions}
          value={cuisineId}
          onChange={onCuisineChange}
        />
      </div>

      {activeCuisine ? (
        cuisinePool.length ? (
          <section className="min-w-0 space-y-3">
            <HomeSectionHeader
              title={activeCuisine.label}
              subtitle={`${cuisinePool.length} restaurante${cuisinePool.length === 1 ? '' : 's'}${municipio ? ` · ${municipio}` : ''}`}
              variant="brand"
              aside={(
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-xl text-xs font-semibold"
                  onClick={() => onCuisineChange?.('all')}
                >
                  Ver tipos
                </Button>
              )}
            />
            <div className={VERTICAL_CATALOG_LIST}>
              {cuisinePool.map((b, i) => (
                <BusinessCard
                  key={b.id}
                  business={b}
                  layout="list"
                  municipio={municipio}
                  imageLoading={i < 3 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <div className={VERTICAL_CATALOG_GRID}>
              {cuisinePool.map((b, i) => (
                <BusinessCard
                  key={`${b.id}-grid`}
                  business={b}
                  layout="grid"
                  municipio={municipio}
                  imageLoading={i < 3 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          </section>
        ) : (
          <PageState
            type="empty"
            icon="food"
            title={`Sin ${activeCuisine.label.toLowerCase()} por ahora`}
            description="Prueba otro tipo de comida o vuelve a ver todos."
            action={(
              <Button variant="outline" onClick={() => onCuisineChange?.('all')}>
                Ver tipos
              </Button>
            )}
          />
        )
      ) : (
        <>
          {featuredRows.map((group) => (
            <RestaurantCuisineRow
              key={`feat-${group.id}`}
              group={group}
              municipio={municipio}
              onSeeAll={(id) => onOperationalFilter?.(id)}
            />
          ))}

          <div className="space-y-8">
            <div>
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                Carta de sabores
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Elige un tipo · sin listas interminables.
              </p>
            </div>
            {cuisineGroups.map((group) => (
              <RestaurantCuisineRow
                key={group.id}
                group={group}
                municipio={municipio}
                onSeeAll={onCuisineChange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
