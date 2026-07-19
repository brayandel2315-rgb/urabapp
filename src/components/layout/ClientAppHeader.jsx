import { Link, useLocation } from 'react-router-dom';
import { BRAND } from '@/utils/constants';
import { cn } from '@/lib/utils';
import BrandLogo from '@/components/brand/BrandLogo';
import DiscoverSearchTrigger from '@/modules/discovery/components/DiscoverSearchTrigger';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { CLIENT_HOME, CLIENT_SEARCH } from '@/app/clientNav';
import { ClientHeaderAuthActions } from '@/components/layout/ClientHeaderAuthActions';
import { useAuthStore } from '@/store/authStore';

export default function ClientAppHeader({ notificationCount = 0 }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const { catalog, homeMunicipio } = useCatalogLocation();
  const municipio = catalog.viewMunicipio || homeMunicipio;
  const isHome = pathname === CLIENT_HOME;
  const isSearch = pathname === CLIENT_SEARCH || pathname.startsWith(`${CLIENT_SEARCH}/`);
  const isStorefront = pathname.startsWith('/tienda/') || pathname.startsWith('/business/');

  /* Cover de tienda ya trae chrome propio; el dock inferior queda como nav global */
  if (isHome || isStorefront) {
    return null;
  }

  return (
    <header
      className={cn(
        'client-header sticky top-0 z-50 lg:hidden',
        'client-header--inner',
      )}
    >
      <div className="client-header__inner">
        <div className="client-header__row">
          <Link to={CLIENT_HOME} className="client-header__brand" aria-label={BRAND.name}>
            <BrandLogo variant="nav" className="client-header__logo" />
          </Link>

          {!isSearch && (
            <DiscoverSearchTrigger
              municipio={municipio}
              compact
              className="client-header__search"
            />
          )}

          <div className="client-header__actions">
            <ClientHeaderAuthActions
              user={user}
              profile={profile}
              notificationCount={notificationCount}
              accountLabel="Perfil"
              buttonClassName="client-header__action"
              showOnlineStatus
            />
          </div>
        </div>
      </div>
    </header>
  );
}
