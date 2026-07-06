import { Link, useLocation } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { ACCOUNT_SECTIONS } from '../accountNav';

export default function AccountMenu({ className }) {
  const { pathname } = useLocation();

  return (
    <SurfaceCard className={cn('divide-y divide-border p-0', className)}>
      {ACCOUNT_SECTIONS.map((item) => {
        const active = pathname === item.to
          || (item.to !== '/cuenta/perfil' && pathname.startsWith(`${item.to}/`))
          || (item.to === '/cuenta/perfil' && (pathname === '/cuenta' || pathname === '/cuenta/perfil'));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-3 px-4 py-3.5 transition-colors',
              active ? 'bg-primary/5' : 'hover:bg-muted/50'
            )}
          >
            <span className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              active ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
            )}
            >
              <AppIcon name={item.icon} size="sm" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{item.label}</span>
              <span className="block text-xs text-muted-foreground">{item.hint}</span>
            </span>
            <span className="text-muted-foreground" aria-hidden>›</span>
          </Link>
        );
      })}
    </SurfaceCard>
  );
}
