import { Outlet, useLocation } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import ClientPageHeader from '@/design-system/patterns/ClientPageHeader';
import { useAuthStore } from '@/store/authStore';
import AccountStatusGuard from './AccountStatusGuard';
import AccountGuestPage from './components/AccountGuestPage';
import AccountMobileNav from './components/AccountMobileNav';
import { getAccountSectionTitle } from './accountNav';

export default function AccountLayout() {
  const user = useAuthStore((s) => s.user);
  const { pathname } = useLocation();
  const isProfileHome = pathname === '/cuenta' || pathname === '/cuenta/perfil';

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
        contentClassName="space-y-4"
      >
        <ClientPageHeader
          tag="Área de cliente"
          title={isProfileHome ? 'Mi cuenta' : getAccountSectionTitle(pathname)}
          subtitle="Tus datos, pagos y preferencias están protegidos. No puedes modificar roles ni beneficios de terceros."
        />
        <AccountMobileNav />
        <div className="min-w-0">
          <Outlet />
        </div>
      </PageLayout>
    </AccountStatusGuard>
  );
}
