import { useState } from 'react';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { iconForCategory, resolveIconKey } from '@/design-system/icons/icon-map';
import { getCategoryColor } from '@/design-system/tokens/category-colors';

const CUISINE_ICONS = {
  tipica: 'food',
  arepas: 'rice',
  pollo: 'food',
  hamburguesas: 'food',
  pizza: 'food',
  asados: 'food',
  mariscos: 'food',
  rapida: 'bolt',
  cafe: 'juice',
  postres: 'juice',
  jugos: 'juice',
  otros: 'store',
  helado: 'juice',
  sushi: 'food',
};

export default function CatalogImage({
  src,
  emoji,
  categoryFallback,
  visualKey,
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

  const themeKey = visualKey || categoryFallback || 'comida';
  const accent = getCategoryColor(themeKey, '#1E6F43');

  const fallbackIcon = CUISINE_ICONS[themeKey]
    || (categoryFallback ? iconForCategory(categoryFallback) : 'store');
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

  const iconBox = size === 'sm'
    ? 'h-9 w-9'
    : (size === 'lg' || size === '2xl' || size === '3xl')
      ? 'h-14 w-14'
      : 'h-11 w-11';

  return (
    <span
      className={cn(
        'catalog-image-fallback flex h-full w-full items-center justify-center',
        radius,
        className,
      )}
      style={{
        background: `linear-gradient(145deg, color-mix(in srgb, ${accent} 30%, white) 0%, color-mix(in srgb, ${accent} 14%, #f7f8fa) 55%, #ffffff 100%)`,
        color: accent,
      }}
    >
      <span
        className={cn('flex items-center justify-center rounded-2xl', iconBox)}
        style={{
          background: `color-mix(in srgb, ${accent} 18%, white)`,
          boxShadow: `0 4px 14px color-mix(in srgb, ${accent} 24%, transparent)`,
        }}
      >
        <AppIcon name={iconName} size={size} className="text-current" />
      </span>
    </span>
  );
}
