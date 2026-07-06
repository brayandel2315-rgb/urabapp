import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

/**
 * Tab de navegación inferior — dock premium brandboard.
 */
export default function ActionButton({
  to,
  onClick,
  sticker: icon,
  label,
  badge,
  active = false,
  featured = false,
  className,
  type = 'button',
}) {
  if (featured) {
    return (
      <motion.div
        whileTap={{ scale: 0.94 }}
        className="relative flex flex-1 items-end justify-center"
      >
        <Link
          to={to}
          className={cn(
            'bottom-nav-tab bottom-nav-tab--featured flex flex-col items-center gap-1 pb-1',
            active && 'bottom-nav-tab--featured-active',
          )}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
        >
          <span className="bottom-nav-featured flex h-[3.35rem] w-[3.35rem] items-center justify-center">
            <AppIcon name={icon} size={24} className="text-white" />
          </span>
          <span className="bottom-nav-tab__label bottom-nav-tab__label--featured">
            {label}
          </span>
        </Link>
      </motion.div>
    );
  }

  const content = (
    <>
      <span
        className={cn(
          'bottom-nav-tab__icon relative flex h-9 w-9 items-center justify-center rounded-xl transition-all',
          active && 'bottom-nav-tab__icon--active',
        )}
      >
        <AppIcon name={icon} size={22} className="bottom-nav-tab__icon-svg text-inherit" />
        {badge > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-[#E74C3C] px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </span>
      <span className="bottom-nav-tab__label">{label}</span>
    </>
  );

  const classes = cn(
    'bottom-nav-tab relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-1.5',
    active && 'bottom-nav-tab--active',
    className,
  );

  if (to) {
    return (
      <motion.div whileTap={{ scale: 0.96 }} className="flex min-w-0 flex-1">
        <Link to={to} className={classes} aria-current={active ? 'page' : undefined}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button type={type} whileTap={{ scale: 0.96 }} onClick={onClick} className={classes}>
      {content}
    </motion.button>
  );
}
