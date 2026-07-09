import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

/** Tab del dock inferior móvil — estándar o carrito central elevado */
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
        whileTap={{ scale: 0.92 }}
        className="bottom-nav-tab bottom-nav-tab--featured relative flex min-w-0 flex-1 flex-col items-center justify-end pb-0.5"
      >
        <Link
          to={to}
          className={cn(
            'flex flex-col items-center gap-1',
            active && 'bottom-nav-tab--featured-active',
          )}
          aria-label={label}
          aria-current={active ? 'page' : undefined}
        >
          <span className="bottom-nav-featured-btn relative flex items-center justify-center">
            <AppIcon name={icon} size={26} className="text-white" />
            {badge > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#E74C3C] px-1 text-[10px] font-bold text-white ring-[2.5px] ring-white">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </span>
          <span className="bottom-nav-tab__label bottom-nav-tab__label--featured">{label}</span>
        </Link>
      </motion.div>
    );
  }

  const content = (
    <>
      <span
        className={cn(
          'bottom-nav-tab__icon relative flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-200',
          active && 'bottom-nav-tab__icon--active',
        )}
      >
        <AppIcon name={icon} size={20} className="bottom-nav-tab__icon-svg" />
      </span>
      <span className="bottom-nav-tab__label">{label}</span>
      {active && <span className="bottom-nav-tab__dot" aria-hidden />}
    </>
  );

  const classes = cn(
    'bottom-nav-tab relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1',
    active && 'bottom-nav-tab--active',
    className,
  );

  if (to) {
    return (
      <motion.div whileTap={{ scale: 0.94 }} className="flex min-w-0 flex-1">
        <Link to={to} className={classes} aria-current={active ? 'page' : undefined}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button type={type} whileTap={{ scale: 0.94 }} onClick={onClick} className={classes}>
      {content}
    </motion.button>
  );
}
