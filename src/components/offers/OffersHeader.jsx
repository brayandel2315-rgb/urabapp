import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { getTimeGreeting, getFirstName } from '@/utils/greeting';
import { cn } from '@/lib/utils';

export default function OffersHeader({
  profile,
  user,
  savedCount = 0,
  className,
}) {
  const greeting = getTimeGreeting();
  const firstName = getFirstName(profile, user);

  return (
    <header className={cn('space-y-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">{greeting}</p>
          <h1 className="text-heading mt-1 text-2xl text-foreground sm:text-3xl">
            {firstName ? `${firstName}, ` : ''}¿Qué te conviene hoy?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Descubre promociones cerca de ti</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            aria-label="Buscar tiendas"
          >
            <AppIcon name="search" size="sm" />
          </Link>
          <Link
            to="/cuenta/perfil"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            aria-label="Alertas"
          >
            <AppIcon name="bell" size="sm" />
          </Link>
          <Link
            to="/ofertas?tab=guardadas"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            aria-label="Ofertas guardadas"
          >
            <AppIcon name="star" size="sm" />
            {savedCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-white">
                {savedCount > 9 ? '9+' : savedCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
