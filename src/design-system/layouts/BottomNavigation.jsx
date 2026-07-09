import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import ActionButton from '@/design-system/patterns/ActionButton';
import AppIcon from '@/design-system/icons/AppIcon';
import { isClientNavActive } from '@/app/clientNav';
import { useAutoHideBottomNav } from '@/hooks/useAutoHideBottomNav';

const spring = { type: 'spring', damping: 30, stiffness: 380 };

export default function BottomNavigation({ tabs, badges = {} }) {
  const location = useLocation();
  const { visible, reveal } = useAutoHideBottomNav();

  const activeTab = tabs.find((tab) => isClientNavActive(location.pathname, tab.to, tab.exact));

  return (
    <>
      <AnimatePresence>
        {!visible && (
          <motion.button
            type="button"
            key="bottom-nav-peek"
            initial={{ y: 24, opacity: 0, scale: 0.92 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.94 }}
            transition={spring}
            onClick={reveal}
            className="bottom-nav-peek lg:hidden"
            aria-label="Mostrar menú de navegación"
          >
            <span className="bottom-nav-peek__handle" aria-hidden />
            <span className="flex items-center gap-1.5">
              {activeTab && (
                <AppIcon name={activeTab.icon} size={14} className="text-primary" />
              )}
              <AppIcon name="chevronDown" size={12} className="rotate-180 text-[#0D2B45]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4A6278]">
                Menú
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

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
        <div className="bottom-nav-dock__shell pointer-events-auto mx-auto w-full max-w-lg px-3 pb-3 sm:max-w-xl md:max-w-2xl">
          <div className="bottom-nav-dock__panel">
            <div className="bottom-nav-dock__glow" aria-hidden />
            <div className="bottom-nav-dock__grid bottom-nav-dock__grid--elevated">
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
