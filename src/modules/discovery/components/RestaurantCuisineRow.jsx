import BusinessCard from '@/components/BusinessCard';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import AppIcon from '@/design-system/icons/AppIcon';

const ROW_LIMIT = 8;

/**
 * Fila horizontal por tipo de cocina — evita listas verticales interminables.
 */
export default function RestaurantCuisineRow({
  group,
  municipio,
  onSeeAll,
}) {
  const items = (group?.businesses ?? []).slice(0, ROW_LIMIT);
  if (!items.length) return null;

  const hasMore = (group.businesses?.length ?? 0) > ROW_LIMIT;

  return (
    <section
      className="restaurant-cuisine-row"
      aria-labelledby={`cuisine-${group.id}`}
    >
      <HomeSectionHeader
        id={`cuisine-${group.id}`}
        title={group.label}
        subtitle={`${group.count} lugar${group.count === 1 ? '' : 'es'}${municipio ? ` · ${municipio}` : ''}`}
        variant="brand"
        aside={(
          <button
            type="button"
            onClick={() => onSeeAll?.(group.id)}
            className="restaurant-cuisine-row__see-all"
          >
            Ver
            <AppIcon name="chevronDown" size={12} className="-rotate-90" aria-hidden />
          </button>
        )}
      />
      <div className="restaurant-cuisine-row__carousel hide-scrollbar" aria-label={group.label}>
        {items.map((business, i) => (
          <div key={business.id} className="restaurant-cuisine-row__card">
            <BusinessCard
              business={business}
              layout="store-tile"
              municipio={municipio}
              imageLoading={i < 2 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        {(hasMore || group.count > 1) && (
          <button
            type="button"
            className="restaurant-cuisine-row__more"
            onClick={() => onSeeAll?.(group.id)}
          >
            <span className="restaurant-cuisine-row__more-icon">
              <AppIcon name="chevronDown" size={18} className="-rotate-90" />
            </span>
            <span className="restaurant-cuisine-row__more-label">
              Ver {group.count}
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
