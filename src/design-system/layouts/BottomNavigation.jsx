import { useLocation } from 'react-router-dom';
import ActionButton from '@/design-system/patterns/ActionButton';
import { isClientNavActive } from '@/app/clientNav';

export default function BottomNavigation({ tabs, badges = {} }) {
  const location = useLocation();

  return (
    <nav
      data-role="client"
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      aria-label="Navegación principal"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="bottom-nav__accent" aria-hidden />
      <div className="bottom-nav__inner mx-auto w-full max-w-lg px-3 sm:max-w-xl md:max-w-2xl">
        <div className="bottom-nav__dock flex h-[4.5rem] items-stretch justify-between gap-0.5">
          {tabs.map((tab) => {
            const active = isClientNavActive(location.pathname, tab.to, tab.exact);
            const badge = tab.badgeKey ? badges[tab.badgeKey] : 0;
            return (
              <ActionButton
                key={tab.to}
                to={tab.to}
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
    </nav>
  );
}
