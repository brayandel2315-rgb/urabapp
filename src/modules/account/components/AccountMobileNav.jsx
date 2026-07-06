import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { ACCOUNT_SECTIONS } from '@/modules/account/accountNav';

/** Navegación horizontal de cuenta — patrón PanelTabBar para móvil */
export default function AccountMobileNav({ className }) {
  const { pathname } = useLocation();

  return (
    <nav
      className={cn('flex gap-2 overflow-x-auto hide-scrollbar pb-1', className)}
      aria-label="Secciones de cuenta"
    >
      {ACCOUNT_SECTIONS.map((item) => {
        const active = pathname === item.to
          || (item.to !== '/cuenta/perfil' && pathname.startsWith(`${item.to}/`))
          || (item.to === '/cuenta/perfil' && (pathname === '/cuenta' || pathname === '/cuenta/perfil'));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-2xl px-3.5 py-2 text-sm font-semibold transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-card text-muted-foreground ring-1 ring-border/50'
            )}
          >
            <AppIcon name={item.icon} size="xs" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
