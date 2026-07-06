import { Link } from 'react-router-dom';
import logo from '@/assets/logo/logo-icon.svg';
import { CLIENT_HOME } from '@/app/clientNav';
import { BRAND } from '@/utils/constants';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';
import { Button } from '@/design-system/ui/button';
import { useAutoLocation } from '@/hooks/useAutoLocation';

export default function Topbar({
  search,
  onSearchChange,
  municipio,
  cartCount = 0,
  navLinks = [],
  activePath = '',
  className,
}) {
  const { detect, locationStatus } = useAutoLocation({ auto: false });
  return (
    <header className={cn('sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl', className)}>
      <div className="mx-auto flex h-16 w-full max-w-6xl min-w-0 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to={CLIENT_HOME} className="flex shrink-0 items-center gap-2.5">
          <img src={logo} alt={BRAND.name} className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30" />
          <span className="font-display hidden text-sm font-extrabold tracking-tight sm:block">{BRAND.name}</span>
        </Link>

        {navLinks.length > 0 && (
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  activePath === link.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {onSearchChange && (
          <div className="relative hidden max-w-md flex-1 md:flex">
            <AppIcon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search ?? ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Mecato, farmacia, restaurante..."
              className="h-10 w-full rounded-xl border border-input bg-muted/40 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {municipio && (
          <button
            type="button"
            onClick={() => detect()}
            disabled={locationStatus === 'pending'}
            className="hidden items-center gap-1.5 rounded-xl border border-border/60 bg-muted/40 px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted lg:flex"
            title="Actualizar ubicación GPS"
          >
            <AppIcon name="location" size="xs" className="text-primary" />
            <span className="max-w-[140px] truncate">{municipio}</span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" asChild className="hidden lg:inline-flex">
            <Link to="/carrito" className="relative">
              <AppIcon name="cart" size="sm" />
              Carrito
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/cuenta/perfil"><AppIcon name="profile" size="sm" /></Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
