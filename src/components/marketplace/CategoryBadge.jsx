import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { getBusinessCategory } from '@/data/category-catalog';

export default function CategoryBadge({ categoryId, className, size = 'sm' }) {
  const cat = getBusinessCategory(categoryId);
  if (!cat) return null;

  const theme = cat.theme;
  const compact = size === 'xs';

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1 rounded-full font-semibold ring-1 ring-inset',
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        theme.light,
        theme.text,
        theme.ring,
        className
      )}
    >
      <AppIcon name={cat.icon || cat.id} size="xs" className={theme.text} />
      <span className="truncate">{cat.shortName || cat.name}</span>
    </span>
  );
}
