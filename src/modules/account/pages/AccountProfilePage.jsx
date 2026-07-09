import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RoleModeSwitcher from '@/components/roles/RoleModeSwitcher';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import AccountUserCard from '@/modules/account/components/AccountUserCard';
import AccountQuickActions from '@/modules/account/components/AccountQuickActions';
import AccountHubMenu from '@/modules/account/components/AccountHubMenu';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/services/auth.service';
import { getMyNotifications } from '@/services/notification.service';
import { getUserAddresses } from '@/services/address.service';
import { getUserCoupons } from '@/services/wallet.service';
import { useClientActivity } from '@/hooks/useClientActivity';

export default function AccountProfilePage() {
  const { user, logout } = useAuthStore();
  const { activeCount } = useClientActivity();

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: () => getUserAddresses(user.id),
    enabled: !!user?.id,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getMyNotifications(user.id),
    enabled: !!user?.id,
  });

  const { data: coupons = [] } = useQuery({
    queryKey: ['user-coupons', user?.id],
    queryFn: () => getUserCoupons(user.id),
    enabled: !!user?.id,
    staleTime: 60_000,
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  if (!user) return null;

  return (
    <div className="space-y-5">
      <div className="lg:hidden">
        <AccountUserCard showEditLink />
      </div>

      <ClientActiveOrderBanner />

      <AccountQuickActions
        activeCount={activeCount}
        unreadCount={unreadCount}
        addressCount={addresses.length}
        couponCount={coupons.length}
      />

      <div className="lg:hidden">
        <AccountHubMenu unreadCount={unreadCount} />
      </div>

      <div className="hidden lg:block">
        <SurfaceCard className="space-y-3 p-5">
          <SectionTitle>Resumen</SectionTitle>
          <p className="text-sm text-[#4A6278]">
            Usa el menú lateral para administrar pedidos, pagos, direcciones y preferencias.
            En móvil, las mismas secciones aparecen agrupadas abajo.
          </p>
          <RoleModeSwitcher />
        </SurfaceCard>
      </div>

      <div className="lg:hidden">
        <RoleModeSwitcher />
      </div>

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </div>
  );
}
