import { Link, useLocation } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { CLIENT_SERVICE_LINKS } from '@/app/clientNav';
import { cn } from '@/lib/utils';

/** Barra secundaria: mensajería, envíos y ayuda — sin saturar el header */
export default function ClientServicesBar() {
  const { pathname } = useLocation();

  return (
    <div className="hidden border-b border-border/50 bg-muted/30 lg:block">
      <div className="app-container flex items-center gap-1 overflow-x-auto py-1.5 hide-scrollbar">
        <span className="mr-1 hidden shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:inline">
          Servicios
        </span>
        {CLIENT_SERVICE_LINKS.map((link) => {
          const active = pathname === link.to || pathname.startsWith(`${link.to}/`);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              )}
            >
              <AppIcon name={link.icon} size="xs" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
