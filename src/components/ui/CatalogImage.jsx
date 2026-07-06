import { useState } from 'react';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { resolveIconKey } from '@/design-system/icons/icon-map';

export default function CatalogImage({
  src,
  emoji,
  categoryFallback,
  alt = '',
  className = '',
  imgClassName = '',
  size = 'md',
  rounded = 'xl',
  loading = 'lazy',
  fetchPriority,
}) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;

  const radius = {
    none: '',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  }[rounded] || 'rounded-xl';

  const fallbackIcon = categoryFallback
    ? iconForCategory(categoryFallback)
    : 'store';
  const iconName = resolveIconKey(emoji) === 'store' && emoji && emoji.length <= 2
    ? fallbackIcon
    : resolveIconKey(emoji || fallbackIcon);

  if (showImg) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', radius, imgClassName, className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary-light to-muted/40',
        radius,
        className
      )}
    >
      <AppIcon name={iconName} size={size} className="text-primary" />
    </span>
  );
}
