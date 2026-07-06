import { Link, useLocation } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { CLIENT_ORDERS, CLIENT_ACCOUNT } from '@/app/clientNav';
import { CLIENT_SERVICE_LINKS } from '@/app/clientNav';
import { useClientActivity } from '@/hooks/useClientActivity';

const PRIMARY = [
  { to: CLIENT_ORDERS, label: 'Mis pedidos', icon: 'orders', badgeKey: 'orders' },
  { to: CLIENT_SERVICE_LINKS[0].to, label: 'Mensajería', icon: 'mensajeria' },
  { to: CLIENT_SERVICE_LINKS[1].to, label: 'Envíos', icon: 'envios' },
  { to: CLIENT_ACCOUNT, label: 'Mi cuenta', icon: 'profile', badgeKey: 'account' },
];

export default function ClientHubShortcuts({ className, variant = 'default' }) {
  const { pathname } = useLocation();
  const { activeCount } = useClientActivity();
  const isCompact = variant === 'compact';

  return (
    <nav
      aria-label="Accesos del área de cliente"
      className={cn(
        'grid grid-cols-4 gap-2 sm:gap-3',
        isCompact && 'grid-cols-2 sm:grid-cols-4',
        className
      )}
    >
      {PRIMARY.map((item) => {
        const active = pathname === item.to || pathname.startsWith(`${item.to}/`)
          || (item.to === CLIENT_ACCOUNT && pathname.startsWith('/cuenta'));
        const badge = item.badgeKey === 'orders' && activeCount > 0 ? activeCount : null;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'relative flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-center transition',
              active
                ? 'border-primary/30 bg-primary/10 shadow-sm'
                : 'border-border/60 bg-card hover:border-primary/20 hover:bg-muted/40'
            )}
          >
            <span
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl',
                active ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
              )}
            >
              <AppIcon name={item.icon} size="sm" />
            </span>
            <span className="text-[11px] font-bold leading-tight text-foreground sm:text-xs">
              {item.label}
            </span>
            {badge != null && (
              <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
