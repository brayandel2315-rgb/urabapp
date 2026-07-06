import { OFFERS_FILTERS } from '@/data/offers-filters';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

export default function OffersFiltersBar({ activeId, onChange, className }) {
  return (
    <div className={cn('min-w-0', className)}>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 snap-x snap-mandatory">
        {OFFERS_FILTERS.map((f) => {
          const active = activeId === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onChange(f.id)}
              className={cn(
                'inline-flex shrink-0 snap-start items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )}
            >
              <AppIcon name={f.icon} size="xs" />
              {f.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
