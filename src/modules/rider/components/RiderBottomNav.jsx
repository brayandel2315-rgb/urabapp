import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

const TABS = [
  { to: '/domiciliario', label: 'Pedidos', icon: 'mensajeria', match: (path) => path === '/domiciliario' || path.startsWith('/domiciliario/entrega') },
  { to: '/domiciliario/ganancias', label: 'Ganancias', icon: 'money', match: (path) => path.startsWith('/domiciliario/ganancias') },
  { to: '/domiciliario/notificaciones', label: 'Avisos', icon: 'bell', match: (path) => path.startsWith('/domiciliario/notificaciones'), badge: true },
  { to: '/domiciliario/cuenta', label: 'Perfil', icon: 'profile', match: (path) => path.startsWith('/domiciliario/cuenta') || path.startsWith('/domiciliario/reputacion') || path.startsWith('/domiciliario/seguridad') },
];

/** Misma dock visual que cliente / tienda / negocio. */
export default function RiderBottomNav({ notificationCount = 0 }) {
  const { pathname } = useLocation();

  return (
    <nav
      data-role="rider"
      aria-label="Navegación repartidor"
      className="bottom-nav-dock fixed inset-x-0 bottom-0 z-50"
    >
      <div className="bottom-nav-dock__shell w-full">
        <div className="bottom-nav-dock__panel">
          <div className="bottom-nav-dock__grid">
            {TABS.map((tab) => {
              const active = tab.match(pathname);
              const badge = tab.badge && notificationCount > 0 ? notificationCount : 0;
              return (
                <Link
                  key={tab.to}
                  to={tab.to}
                  className="bottom-nav-tab"
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'bottom-nav-tab__pill',
                      active && 'bottom-nav-tab__pill--active',
                    )}
                  >
                    <span className="bottom-nav-tab__icon relative flex h-5 w-5 items-center justify-center">
                      <AppIcon
                        name={tab.icon}
                        size={20}
                        className={cn(
                          'bottom-nav-tab__icon-svg',
                          active && 'bottom-nav-tab__icon-svg--active',
                        )}
                      />
                      {badge > 0 && (
                        <span className="bottom-nav-badge absolute -right-1.5 -top-1">
                          {badge > 9 ? '9+' : badge}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        'bottom-nav-tab__label',
                        active && 'bottom-nav-tab__label--active',
                      )}
                    >
                      {tab.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
