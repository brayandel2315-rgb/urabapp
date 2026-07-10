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

  if (isHome) {
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
        <div className="flex h-12 items-center gap-2 sm:h-[3.25rem]">
          <Link to={CLIENT_HOME} className="flex min-w-0 shrink-0 items-center gap-2">
            <BrandLogo variant="compact" className="client-header__logo" />
            <span className="sr-only">{BRAND.name}</span>
          </Link>

          <div className="ml-auto flex items-center gap-0.5">
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

        {!isSearch && (
          <div className="pb-3 pt-0.5">
            <DiscoverSearchTrigger municipio={municipio} />
          </div>
        )}
      </div>
    </header>
  );
}
