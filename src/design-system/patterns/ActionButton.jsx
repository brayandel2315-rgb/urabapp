import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import BottomNavIcon from '@/design-system/icons/BottomNavIcon';

/** Tab del dock inferior móvil */
export default function ActionButton({
  to,
  onClick,
  sticker: icon,
  customIcon,
  label,
  badge,
  active = false,
  featured = false,
  className,
  type = 'button',
}) {
  const pill = (
    <span
      className={cn(
        'bottom-nav-tab__pill',
        featured && 'bottom-nav-tab__pill--featured',
        active && 'bottom-nav-tab__pill--active',
      )}
    >
      {featured ? (
        <span className={cn('bottom-nav-featured-btn', active && 'bottom-nav-featured-btn--active')}>
          <BottomNavIcon name={icon} size={20} active={active} featured />
          {badge > 0 && (
            <span className="bottom-nav-badge absolute -right-0.5 -top-0.5">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </span>
      ) : (
        <span className="bottom-nav-tab__icon relative flex h-5 w-5 items-center justify-center overflow-visible">
          {customIcon || <BottomNavIcon name={icon} size={20} active={active} />}
          {badge > 0 && (
            <span className="bottom-nav-badge absolute -right-1.5 -top-1">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </span>
      )}
      <span className={cn('bottom-nav-tab__label', active && 'bottom-nav-tab__label--active')}>
        {label}
      </span>
    </span>
  );

  const classes = cn('bottom-nav-tab', featured && 'bottom-nav-tab--featured', className);

  if (featured && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={classes}
        aria-label={label}
        aria-expanded={active}
      >
        {pill}
      </button>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes} aria-current={active ? 'page' : undefined}>
        {pill}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {pill}
    </button>
  );
}
