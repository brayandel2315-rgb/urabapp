import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/**
 * Clasificación profesional de cocina — rail sticky, no lista infinita.
 */
export default function RestaurantCuisineRail({
  options = [],
  value = 'all',
  onChange,
  className,
}) {
  if (!options.length) return null;

  return (
    <div
      className={cn('restaurant-cuisine-rail', className)}
      role="tablist"
      aria-label="Tipo de comida"
    >
      <div className="restaurant-cuisine-rail__track hide-scrollbar">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange?.(opt.id)}
              className={cn(
                'restaurant-cuisine-rail__item',
                selected && 'restaurant-cuisine-rail__item--active',
              )}
            >
              <span className="restaurant-cuisine-rail__icon" aria-hidden>
                <AppIcon name={opt.icon || 'food'} size={18} />
              </span>
              <span className="restaurant-cuisine-rail__label">{opt.shortLabel || opt.label}</span>
              {typeof opt.count === 'number' && opt.id !== 'all' ? (
                <span className="restaurant-cuisine-rail__count">{opt.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
