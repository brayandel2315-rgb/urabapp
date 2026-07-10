import { useLocation } from 'react-router-dom';
import ActionButton from '@/design-system/patterns/ActionButton';
import { isClientNavActive, CLIENT_ACCOUNT } from '@/app/clientNav';
import { useClientServicesPanelStore } from '@/store/clientServicesPanelStore';
import { useAuthStore } from '@/store/authStore';
import { isClientAuthenticated } from '@/app/client-auth-policy';
import ClientUserAvatar from '@/components/layout/ClientUserAvatar';

export default function BottomNavigation({ tabs, badges = {} }) {
  const location = useLocation();
  const toggleServices = useClientServicesPanelStore((s) => s.toggle);
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const authed = isClientAuthenticated(user);

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
              const isAccountTab = tab.to === CLIENT_ACCOUNT;
              const accountIcon = authed && isAccountTab ? (
                <ClientUserAvatar
                  profile={profile}
                  user={user}
                  size="bottomNav"
                  showOnline
                  active={active}
                />
              ) : null;

              return (
                <ActionButton
                  key={tab.to + tab.label}
                  to={tab.action === 'services' ? undefined : tab.to}
                  onClick={tab.action === 'services' ? toggleServices : undefined}
                  sticker={tab.icon}
                  customIcon={accountIcon}
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
