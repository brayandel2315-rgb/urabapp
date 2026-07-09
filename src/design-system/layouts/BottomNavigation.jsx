import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import ActionButton from '@/design-system/patterns/ActionButton';
import { isClientNavActive } from '@/app/clientNav';
import { useAutoHideBottomNav } from '@/hooks/useAutoHideBottomNav';

const spring = { type: 'spring', damping: 30, stiffness: 380 };

export default function BottomNavigation({ tabs, badges = {} }) {
  const location = useLocation();
  const { visible } = useAutoHideBottomNav();

  return (
    <>
      <motion.nav
        data-role="client"
        aria-label="Navegación principal"
        aria-hidden={!visible}
        initial={false}
        animate={{
          y: visible ? 0 : 'calc(100% + 2rem)',
          opacity: visible ? 1 : 0,
        }}
        transition={spring}
        className="bottom-nav-dock pointer-events-none fixed inset-x-0 bottom-0 z-50 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="bottom-nav-dock__shell pointer-events-auto mx-auto w-full px-4 pb-3">
          <div className="bottom-nav-dock__panel">
            <div className="bottom-nav-dock__grid">
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
        </div>
      </motion.nav>
    </>
  );
}
