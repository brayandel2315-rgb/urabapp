import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

export default function StarRating({ value = 0, onChange, size = 'md', readOnly = false }) {
  const iconSize = { sm: 'xs', md: 'sm', lg: 'md' }[size] ?? 'sm';

  return (
    <div className="flex gap-0.5" role={readOnly ? 'img' : 'group'} aria-label={`${value} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={cn(
              'transition-transform',
              readOnly ? 'cursor-default' : 'hover:scale-110 active:scale-95',
              !filled && 'opacity-30'
            )}
            aria-label={`${star} estrellas`}
          >
            <AppIcon name="star" size={iconSize} className={filled ? 'text-accent' : 'text-muted-foreground'} />
          </button>
        );
      })}
    </div>
  );
}
