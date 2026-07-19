import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import UrabappBrandIcon, { hasBrandIcon } from './brand/UrabappBrandIcon';
import { ICONIFY_ICONS, LUCIDE_ICONS, resolveIconKey } from './icon-map';

const SIZE_MAP = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  '2xl': 44,
  '3xl': 56,
  '4xl': 72,
};

/**
 * Icono unificado — Lucide stroke 2px (familia única).
 * variant="brand" conserva SVGs del brandboard cuando se pide explícitamente.
 * variant="duotone" usa Solar solo si no hay Lucide.
 */
export default function AppIcon({
  name,
  size = 'md',
  className,
  strokeWidth = 2,
  spin = false,
  variant = 'ui',
}) {
  const key = resolveIconKey(name);
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] ?? SIZE_MAP.md);
  const LucideIcon = LUCIDE_ICONS[key];

  if (variant === 'brand' && hasBrandIcon(key)) {
    return (
      <UrabappBrandIcon
        name={key}
        size={px}
        className={cn(spin && 'animate-spin', className)}
      />
    );
  }

  if (LucideIcon) {
    return (
      <LucideIcon
        size={px}
        strokeWidth={strokeWidth}
        className={cn('shrink-0 text-current', spin && 'animate-spin', className)}
        aria-hidden
      />
    );
  }

  if (variant === 'duotone' && ICONIFY_ICONS[key]) {
    return (
      <Icon
        icon={ICONIFY_ICONS[key]}
        width={px}
        height={px}
        className={cn('shrink-0', spin && 'animate-spin', className)}
        aria-hidden
      />
    );
  }

  if (ICONIFY_ICONS[key]) {
    return (
      <Icon
        icon={ICONIFY_ICONS[key]}
        width={px}
        height={px}
        className={cn('shrink-0', spin && 'animate-spin', className)}
        aria-hidden
      />
    );
  }

  const Fallback = LUCIDE_ICONS.store;
  return (
    <Fallback
      size={px}
      strokeWidth={strokeWidth}
      className={cn('shrink-0 text-current', spin && 'animate-spin', className)}
      aria-hidden
    />
  );
}
