import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppShell from '@/design-system/layouts/AppShell';
import BottomNavigation from '@/design-system/layouts/BottomNavigation';
import { CommandMenu } from '@/design-system/providers/CommandMenu';
import OfflineBanner from '@/design-system/patterns/OfflineBanner';
import CommunicationBanner from '@/components/communication/CommunicationBanner';
import ClientServicesFab from '../components/layout/ClientServicesFab';
import AbandonedCartSync from '../hooks/useAbandonedCartSync';
import { useNotificationsRealtime } from '../hooks/useNotificationsRealtime';
import { useCommunicationBadge } from '../hooks/useCommunicationBadge';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import ClientAppHeader from '../components/layout/ClientAppHeader';
import ClientDesktopHeader from '../components/layout/ClientDesktopHeader';
import GeoBootstrap from '../components/geo/GeoBootstrap';
import ClientOnboardingTour from '../components/onboarding/ClientOnboardingTour';
import { CLIENT_BOTTOM_TABS } from '@/app/clientNav';
import { useClientLightTheme } from '@/hooks/useClientLightTheme';
import { useMarketplaceLiveRefresh } from '@/hooks/useMarketplaceLiveRefresh';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';

export default function ClientLayout() {
  const cartCount = useCartStore((s) => s.getItemCount());
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const communicationBadge = useCommunicationBadge(user?.id);

  useClientLightTheme();
  useNotificationsRealtime(user?.id);
  const { activeMunicipio } = useCatalogLocation();
  useMarketplaceLiveRefresh(activeMunicipio);

  const badges = {
    cart: cartCount,
    notifications: communicationBadge,
  };

  return (
    <AppShell data-role="client" className="mobile-app-bg bg-[#F7FAFC] text-[#0D2B45] lg:pb-0">
      <ClientAppHeader notificationCount={communicationBadge} />
      <ClientDesktopHeader notificationCount={communicationBadge} />
      <GeoBootstrap />
      <ClientOnboardingTour />
      <OfflineBanner />
      <CommunicationBanner />
      <AbandonedCartSync />
      <div className="app-client-route min-w-0 w-full">
        <Outlet context={{ search, setSearch }} />
      </div>
      <div className="lg:hidden">
        <ClientServicesFab />
      </div>
      <BottomNavigation tabs={CLIENT_BOTTOM_TABS} badges={badges} />
      <CommandMenu />
    </AppShell>
  );
}
