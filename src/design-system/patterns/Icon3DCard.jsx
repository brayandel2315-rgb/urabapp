import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

const SIZE_PRESETS = {
  sm: { box: 'h-12 w-12', icon: 24 },
  md: { box: 'h-16 w-16', icon: 32 },
  lg: { box: 'h-[4.75rem] w-[4.75rem]', icon: 38 },
  xl: { box: 'h-[5.5rem] w-[5.5rem]', icon: 44 },
  nav: { box: 'h-14 w-14', icon: 30 },
  navFeatured: { box: 'h-16 w-16', icon: 34 },
};

const TAP_SPRING = { type: 'spring', stiffness: 560, damping: 16, mass: 0.75 };

/**
 * Icono dentro de tarjeta 3D con sombra y feedback táctil — patrón app delivery.
 */
export default function Icon3DCard({
  name,
  size = 'md',
  active = false,
  tone = 'text-primary',
  className,
  iconClassName,
  badge,
  pulse = false,
}) {
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.md;

  return (
    <motion.span
      layout
      whileTap={{ scale: 0.8, y: 7, rotateX: 16 }}
      whileHover={{ scale: 1.06, y: -3 }}
      animate={pulse ? { y: [0, -2, 0] } : undefined}
      transition={
        pulse
          ? { y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } }
          : TAP_SPRING
      }
      className={cn(
        'icon-3d-card relative inline-flex shrink-0 items-center justify-center rounded-[1.15rem]',
        preset.box,
        active && 'icon-3d-card--active',
        className,
      )}
    >
      <AppIcon
        name={name}
        size={preset.icon}
        className={cn(tone, iconClassName)}
      />
      {badge > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-promo px-1 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </motion.span>
  );
}
