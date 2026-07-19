import { cn } from '@/lib/utils';
import BottomNavIcon from '@/design-system/icons/BottomNavIcon';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: 'home' },
  { id: 'orders', label: 'Pedidos', icon: 'pedidos' },
  { id: 'products', label: 'Menú', icon: 'menu' },
  { id: 'store', label: 'Tienda', icon: 'tienda' },
];

/**
 * Dock inferior del panel negocio — misma visual que cliente:
 * iconos brand, gris inactivo / color activo.
 */
export default function BusinessBottomNav({ activeTab, pendingCount = 0, onChange }) {
  const tab = activeTab || 'inicio';

  return (
    <nav
      data-role="business"
      aria-label="Navegación del negocio"
      className="bottom-nav-dock fixed inset-x-0 bottom-0 z-50"
    >
      <div className="bottom-nav-dock__shell w-full">
        <div className="bottom-nav-dock__panel">
          <div className="bottom-nav-dock__grid">
            {TABS.map((item) => {
              const active = tab === item.id;
              const badge = item.id === 'orders' && pendingCount > 0 ? pendingCount : 0;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange?.(item.id)}
                  className="bottom-nav-tab"
                  aria-current={active ? 'page' : undefined}
                  aria-label={item.label}
                >
                  <span
                    className={cn(
                      'bottom-nav-tab__pill',
                      active && 'bottom-nav-tab__pill--active',
                    )}
                  >
                    <span className="bottom-nav-tab__icon relative flex h-5 w-5 items-center justify-center overflow-visible">
                      <BottomNavIcon name={item.icon} size={20} active={active} />
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
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
