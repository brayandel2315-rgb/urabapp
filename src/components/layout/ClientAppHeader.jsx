import { Link, useLocation } from 'react-router-dom';
import logo from '@/assets/logo/logo-icon.svg';
import { BRAND } from '@/utils/constants';
import { cn } from '@/lib/utils';
import DiscoverSearchTrigger from '@/modules/discovery/components/DiscoverSearchTrigger';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { CLIENT_HOME, CLIENT_SEARCH } from '@/app/clientNav';
import { ClientHeaderAuthActions } from '@/components/layout/ClientHeaderAuthActions';
import { useAuthStore } from '@/store/authStore';

export default function ClientAppHeader({ notificationCount = 0 }) {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const { catalog, homeMunicipio } = useCatalogLocation();
  const municipio = catalog.viewMunicipio || homeMunicipio;
  const isHome = pathname === CLIENT_HOME;
  const isSearch = pathname === CLIENT_SEARCH || pathname.startsWith(`${CLIENT_SEARCH}/`);

  return (
    <header
      className={cn(
        'client-header sticky top-0 z-50 lg:hidden',
        isHome ? 'client-header--home' : 'client-header--inner',
      )}
    >
      <div className="client-header__inner">
        <div className="flex h-12 items-center gap-2 sm:h-[3.25rem]">
          <Link to={CLIENT_HOME} className="flex min-w-0 shrink-0 items-center gap-2.5">
            <img
              src={logo}
              alt={BRAND.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/25 shadow-soft"
            />
            <span className="min-w-0 font-display text-sm font-black tracking-tight text-[#0D2B45]">
              <span className="block truncate leading-none">{BRAND.name}</span>
              {!isHome && (
                <span className="mt-0.5 block truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-[#4A6278]">
                  Conexión local
                </span>
              )}
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-0.5">
            <ClientHeaderAuthActions
              user={user}
              notificationCount={notificationCount}
              accountLabel="Perfil"
              buttonClassName="client-header__action"
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
