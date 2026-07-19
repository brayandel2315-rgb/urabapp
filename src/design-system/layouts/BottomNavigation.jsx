import { useLocation } from 'react-router-dom';
import ActionButton from '@/design-system/patterns/ActionButton';
import { isClientNavActive } from '@/app/clientNav';
import { useClientServicesPanelStore } from '@/store/clientServicesPanelStore';

export default function BottomNavigation({ tabs, badges = {} }) {
  const location = useLocation();
  const toggleServices = useClientServicesPanelStore((s) => s.toggle);

  return (
    <nav
      data-role="client"
      aria-label="Navegación principal"
      className="bottom-nav-dock fixed inset-x-0 bottom-0 z-50 lg:hidden"
    >
      <div className="bottom-nav-dock__shell w-full">
        <div className="bottom-nav-dock__panel">
          <div className="bottom-nav-dock__grid">
            {tabs.map((tab) => {
              const active = isClientNavActive(location.pathname, tab.to, tab.exact);
              const badge = tab.badgeKey ? badges[tab.badgeKey] : 0;

              return (
                <ActionButton
                  key={tab.to + tab.label}
                  to={tab.action === 'services' ? undefined : tab.to}
                  onClick={tab.action === 'services' ? toggleServices : undefined}
                  sticker={tab.icon}
                  label={tab.label}
                  badge={badge}
                  active={active}
                  featured={tab.featured}
                />
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
