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

/** Solo animación de carga usa Lucide (spin más estable) */
const LUCIDE_ONLY = new Set(['loading']);

/**
 * Icono unificado Urabapp.
 * Por defecto usa Solar Bold Duotone (iconos completos para UI).
 * variant="brand" conserva la iconografía SVG del brandboard.
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

  if (ICONIFY_ICONS[key] && !LUCIDE_ONLY.has(key)) {
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

  if (variant === 'brand' && hasBrandIcon(key)) {
    return (
      <UrabappBrandIcon
        name={key}
        size={px}
        className={cn(spin && 'animate-spin', className)}
      />
    );
  }

  if (LUCIDE_ONLY.has(key) || variant === 'lucide') {
    const LucideIcon = LUCIDE_ICONS[key] || LUCIDE_ICONS.store;
    return (
      <LucideIcon
        size={px}
        strokeWidth={strokeWidth}
        className={cn('shrink-0', spin && 'animate-spin', className)}
        aria-hidden
      />
    );
  }

  const LucideIcon = LUCIDE_ICONS[key] || LUCIDE_ICONS.store;
  return (
    <LucideIcon
      size={px}
      strokeWidth={strokeWidth}
      className={cn('shrink-0', spin && 'animate-spin', className)}
      aria-hidden
    />
  );
}
