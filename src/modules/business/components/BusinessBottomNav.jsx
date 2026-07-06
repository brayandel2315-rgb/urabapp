import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: 'home', match: (path, tab) => tab === 'inicio' || (!tab && path === '/negocio') },
  { id: 'orders', label: 'Pedidos', icon: 'orders', match: (_, tab) => tab === 'orders' },
  { id: 'products', label: 'Menú', icon: 'food', match: (_, tab) => tab === 'products' },
  { id: 'store', label: 'Tienda', icon: 'store', match: (_, tab) => tab === 'store' },
];

export default function BusinessBottomNav({ activeTab, pendingCount = 0, onChange }) {
  const { pathname } = useLocation();
  const tab = activeTab || 'inicio';

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1">
        {TABS.map((item) => {
          const active = item.match(pathname, tab);
          const badge = item.id === 'orders' && pendingCount > 0 ? pendingCount : 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                'relative flex min-w-[72px] flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-center transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <AppIcon name={item.icon} size="sm" className={active ? 'text-primary' : undefined} />
              <span className={cn('text-[10px] font-bold', active && 'text-primary')}>{item.label}</span>
              {badge > 0 && (
                <span className="absolute right-3 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
