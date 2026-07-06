import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo/logo-icon.svg';
import { BRAND } from '@/utils/constants';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import DiscoverSearchTrigger from '@/modules/discovery/components/DiscoverSearchTrigger';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { Button } from '@/design-system/ui/button';
import {
  CLIENT_HOME,
  CLIENT_NAV_LINKS,
  CLIENT_SEARCH,
} from '@/app/clientNav';
import { ClientHeaderAuthActions } from '@/components/layout/ClientHeaderAuthActions';
import { isClientNavActive } from '@/app/clientNav';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

/** Barra superior solo escritorio — home e interior */
export default function ClientDesktopHeader({ notificationCount = 0 }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.getItemCount());
  const { catalog, homeMunicipio } = useCatalogLocation();
  const municipio = catalog.viewMunicipio || homeMunicipio;
  const isHome = pathname === CLIENT_HOME;
  const isSearch = pathname === CLIENT_SEARCH || pathname.startsWith(`${CLIENT_SEARCH}/`);

  return (
    <header
      className={cn(
        'client-desktop-header sticky top-0 z-50 hidden lg:block',
        isHome ? 'client-desktop-header--home' : 'client-desktop-header--inner',
      )}
    >
      <div className="client-desktop-header__inner">
        <Link to={CLIENT_HOME} className="client-desktop-header__brand">
          <img src={logo} alt={BRAND.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white/40 shadow-soft" />
          <span className="min-w-0">
            <span className="block font-display text-base font-black tracking-tight">{BRAND.name}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] opacity-80">
              Urabá · delivery local
            </span>
          </span>
        </Link>

        <nav className="client-desktop-header__nav" aria-label="Navegación principal">
          {CLIENT_NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'client-desktop-header__link',
                isClientNavActive(pathname, link.to, link.exact) && 'client-desktop-header__link--active',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="client-desktop-header__actions">
          {!isSearch && !isHome && (
            <DiscoverSearchTrigger municipio={municipio} compact className="client-desktop-header__search" />
          )}

          <ClientHeaderAuthActions
            user={user}
            notificationCount={notificationCount}
            buttonClassName="client-desktop-header__icon-btn"
          />

          <Button variant="outline" size="sm" asChild className="client-desktop-header__cart">
            <Link to="/carrito" className="relative gap-2">
              <AppIcon name="cart" size={18} />
              Carrito
              {cartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
