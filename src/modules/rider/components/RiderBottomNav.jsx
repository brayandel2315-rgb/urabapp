import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

const TABS = [
  { to: '/domiciliario', label: 'Pedidos', icon: 'mensajeria', match: (path) => path === '/domiciliario' || path.startsWith('/domiciliario/entrega') },
  { to: '/domiciliario/ganancias', label: 'Ganancias', icon: 'money', match: (path) => path.startsWith('/domiciliario/ganancias') },
  { to: '/domiciliario/cuenta', label: 'Perfil', icon: 'profile', match: (path) => path.startsWith('/domiciliario/cuenta') || path.startsWith('/domiciliario/reputacion') || path.startsWith('/domiciliario/seguridad') },
];

export default function RiderBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      data-role="rider"
      className="rider-bottom-nav fixed inset-x-0 bottom-0 z-40"
      aria-label="Navegación repartidor"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="rider-bottom-nav__inner mx-auto flex max-w-lg items-stretch justify-around px-2 py-1.5">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                'rider-bottom-nav__tab flex min-w-[72px] flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-center transition-colors',
                active && 'rider-bottom-nav__tab--active',
              )}
            >
              <AppIcon name={tab.icon} size="sm" className="rider-bottom-nav__icon" />
              <span className="rider-bottom-nav__label">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
