import { useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import ClientScreenHeader from '@/design-system/patterns/ClientScreenHeader';
import { STORE } from '@/utils/marketplace-copy';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import OrderCard from '@/components/OrderCard';
import ShipmentCard from '@/modules/client/components/ShipmentCard';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import GuestOrderRecoveryCard from '@/modules/client/components/GuestOrderRecoveryCard';
import { peekGuestUserId } from '@/services/guest-merge.service';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useOrdersPolling } from '@/hooks/useOrderRealtime';
import { useClientActivity } from '@/hooks/useClientActivity';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { CLIENT_ACCOUNT } from '@/app/clientNav';
import { buildLoginRedirect } from '@/utils/auth-routes';
import PanelTabBar from '@/design-system/patterns/PanelTabBar';

const TABS = [
  { id: 'active', label: 'Activos' },
  { id: 'history', label: 'Historial' },
];

const SERVICE_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'food', label: 'Comida' },
  { id: 'courier', label: 'Mensajería' },
  { id: 'shipment', label: 'Envíos' },
];

export default function OrdersPage() {
  const { user } = useAuthStore();
  const online = useOnlineStatus();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const isHistorialRoute = pathname.includes('/cuenta/historial');
  const initialTab = searchParams.get('tab') === 'history' || isHistorialRoute ? 'history' : 'active';
  const [tab, setTab] = useState(initialTab);
  const [serviceFilter, setServiceFilter] = useState('all');

  useOrdersPolling(user?.id, !!user?.id);

  const {
    orders,
    shipments,
    activeActivities,
    historyActivities,
    isLoading,
    isError,
    refetch,
  } = useClientActivity();

  const visibleActivities = tab === 'active' ? activeActivities : historyActivities;

  const filtered = useMemo(() => {
    if (serviceFilter === 'all') return visibleActivities;
    return visibleActivities.filter((a) => a.service === serviceFilter);
  }, [visibleActivities, serviceFilter]);

  const serviceTypes = useMemo(
    () => new Set(visibleActivities.map((a) => a.service)),
    [visibleActivities],
  );
  const showServiceFilter = serviceTypes.size > 1;

  const hasAny = orders.length > 0 || shipments.length > 0;
  const hasGuestSession = !!peekGuestUserId();
  const showPhoneRecovery = !hasGuestSession;
  const activeCount = activeActivities.length;

  const ordersContent = !user ? (
    <EmptyState
      title="Entra para ver tu actividad"
      description="Pedidos de comida, mensajería y envíos quedan en tu cuenta. Si pediste como invitado en este dispositivo, los vinculamos al entrar."
      icon="orders"
      action={(
        <Link to={buildLoginRedirect(isHistorialRoute ? '/cuenta/historial' : '/pedidos')}>
          <Button size="sm">Entrar</Button>
        </Link>
      )}
    />
  ) : (
    <>
      {isHistorialRoute && showPhoneRecovery && (
        <GuestOrderRecoveryCard
          className="mb-4"
          title="Recuperar pedidos de otro dispositivo"
          description="Si pediste como invitado en otro celular, verifica el mismo número aquí. Solo vinculamos sesiones invitadas con ese celular."
        />
      )}

      <PageExperienceGuard
        online={online}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
        errorDescription="No pudimos cargar tus pedidos. Revisa tu conexión e intenta de nuevo."
        empty={!hasAny ? (
          <div className="space-y-4">
            {!isHistorialRoute && showPhoneRecovery && <GuestOrderRecoveryCard />}
            <EmptyState
              title="Sin actividad aún"
              description="Cuando pidas comida, un mandado o un envío, lo verás aquí con seguimiento en tiempo real."
              icon="cart"
              action={<Link to="/"><Button size="sm">{STORE.explore}</Button></Link>}
            />
          </div>
        ) : null}
      >
        {hasAny && (
        <>
        <ClientActiveOrderBanner className="mb-4" />

        <PanelTabBar
          className="mb-3"
          tabs={TABS.map((t) => ({
            ...t,
            badge: t.id === 'active' ? activeCount : 0,
          }))}
          value={tab}
          onChange={setTab}
        />

        {showServiceFilter && (
          <PanelTabBar
            className="mb-4"
            tabs={SERVICE_FILTERS}
            value={serviceFilter}
            onChange={setServiceFilter}
          />
        )}

        <div className="space-y-3">
          {filtered.map((activity) => (
            activity.service === 'shipment' ? (
              <ShipmentCard key={`s-${activity.id}`} shipment={activity.raw} />
            ) : (
              <OrderCard key={`o-${activity.id}`} order={activity.raw} userId={user?.id} />
            )
          ))}
        </div>
        </>
        )}
      </PageExperienceGuard>
    </>
  );

  if (isHistorialRoute) {
    return <div className="space-y-4">{ordersContent}</div>;
  }

  return (
    <PageLayout title={false} maxWidth="lg">
      <ClientScreenHeader
        tag="Tus pedidos"
        title="Mis pedidos"
        action={user ? (
          <Link to={CLIENT_ACCOUNT} className="text-xs font-semibold text-[#0E6BA8]">
            Mi cuenta
          </Link>
        ) : null}
      />
      {ordersContent}
    </PageLayout>
  );
}
