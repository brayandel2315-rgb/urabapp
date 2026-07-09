import { Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import { useAuthStore } from '@/store/authStore';
import { getMyNotifications } from '@/services/notification.service';
import AccountStatusGuard from './AccountStatusGuard';
import AccountGuestPage from './components/AccountGuestPage';
import AccountUserCard from './components/AccountUserCard';
import AccountMenu from './components/AccountMenu';
import { getAccountSectionTitle } from './accountNav';

export default function AccountLayout() {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  const isProfileHome = pathname === '/cuenta' || pathname === '/cuenta/perfil';

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getMyNotifications(user.id),
    enabled: !!user?.id,
    staleTime: 30_000,
  });
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (!user) {
    return (
      <PageLayout title="Mi cuenta" backTo="/" maxWidth="md">
        <AccountGuestPage />
      </PageLayout>
    );
  }

  return (
    <AccountStatusGuard>
      <PageLayout
        title={false}
        backTo={isProfileHome ? '/' : '/cuenta/perfil'}
        maxWidth="lg"
        contentClassName="pb-10"
      >
        <div className="lg:grid lg:grid-cols-[minmax(240px,272px)_1fr] lg:items-start lg:gap-8">
          <aside className="hidden lg:block lg:sticky lg:top-20 lg:self-start">
            <AccountUserCard />
            <AccountMenu className="mt-4" unreadCount={unreadCount} />
          </aside>

          <div className="min-w-0">
            {!isProfileHome && (
              <header className="mb-5 border-b border-[#D5E3EF] pb-4">
                <h1 className="font-display text-xl font-bold text-[#0D2B45]">
                  {getAccountSectionTitle(pathname)}
                </h1>
              </header>
            )}
            <Outlet />
          </div>
        </div>
      </PageLayout>
    </AccountStatusGuard>
  );
}
