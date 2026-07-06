import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOperationalKpis,
  getAllOrders,
  getAllUsers,
  getAllBusinesses,
  getAllDrivers,
  updateUserRole,
} from '../../../services/admin.service';
import { updateOrderStatus, assignDriverToOrder } from '../../../services/order.service';
import { emitCommEvent } from '@/communication';
import { useAuthStore } from '../../../store/authStore';
import { requestAutoAssignRider, publishDeliveryOffersWithExpansion } from '../../../services/assignment.service';
import { STORE } from '@/utils/marketplace-copy';
import { getActiveDrivers, adminUpdateDriver } from '../../../services/rider.service';
import LaunchChecklist from '../components/LaunchChecklist';
import AdminEconomicsPanel from '../components/AdminEconomicsPanel';
import AdminDifferentiatorsPanel from '../components/AdminDifferentiatorsPanel';
import AdminPhase6Panel from '../components/AdminPhase6Panel';
import AdminPhase3Panel from '../components/AdminPhase3Panel';
import AdminZonesPanel from '../components/AdminZonesPanel';
import AdminCrmPanel from '../components/AdminCrmPanel';
import AdminExecutivePanel from '../components/AdminExecutivePanel';
import AdminMarketingPanel from '../components/AdminMarketingPanel';
import AdminCategoriesPanel from '../components/AdminCategoriesPanel';
import AdminShipmentsPanel from '../components/AdminShipmentsPanel';
import AdminIntegrationsPanel from '../components/AdminIntegrationsPanel';
import AdminSupportPanel from '../components/AdminSupportPanel';
import AdminCourierReview from '../components/AdminCourierReview';
import AdminCourierPayoutsPanel from '../components/AdminCourierPayoutsPanel';
import AdminBusinessReview from '../components/AdminBusinessReview';
import AdminLiveTrackingPanel from '../components/AdminLiveTrackingPanel';
import AdminCommunicationsPanel from '../components/AdminCommunicationsPanel';
import AdminFinancialEnginePanel from '../components/AdminFinancialEnginePanel';
import AdminOrderActions from '../components/AdminOrderActions';
import { MUNICIPALITIES, BRAND, PHASE_1_KPIS, ORDER_STATUS_LABELS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import Loader from '../../../components/ui/Loader';
import ErrorState from '../../../components/ErrorState';
import SectionErrorBoundary from '../../../components/SectionErrorBoundary';
import Button from '../../../components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import PanelHeader from '@/design-system/patterns/PanelHeader';
import PanelTabBar from '@/design-system/patterns/PanelTabBar';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { DataTable } from '@/design-system/patterns/DataTable';
import { useAdminOrdersRealtime } from '../../../hooks/useAdminOrdersRealtime';
import { toast } from '../../../utils/toast';

const TABS = [
  { id: 'finanzas', label: 'Finanzas' },
  'resumen',
  'soporte',
  'integraciones',
  { id: 'comunicacion', label: 'Comunicación' },
  'ejecutivo',
  'crm',
  'marketing',
  { id: 'categorias', label: 'Categorías' },
  { id: 'envios', label: 'Envíos' },
  'pedidos',
  { id: 'tracking', label: 'Tracking' },
  { id: 'comercios', label: 'Tiendas' },
  'mensajeros',
  { id: 'retiros', label: 'Retiros' },
  'usuarios',
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('resumen');
  const queryClient = useQueryClient();
  const adminUser = useAuthStore((s) => s.user);

  const logAdminAction = (action, payload = {}) => {
    emitCommEvent('admin_action', {
      recipientId: adminUser?.id,
      actorId: adminUser?.id,
      payload: { action, ...payload },
    }).catch(() => {});
  };

  useAdminOrdersRealtime(tab === 'resumen' || tab === 'pedidos');

  const { data: kpis, isLoading: loadingKpis } = useQuery({
    queryKey: ['admin-kpis'],
    queryFn: getOperationalKpis,
    refetchInterval: 30000,
  });

  const { data: orders = [], isLoading: loadingOrders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
    enabled: tab === 'pedidos' || tab === 'resumen',
    refetchInterval: 15000,
  });

  const { data: businesses = [], isLoading: loadingBusinesses, isError: businessesError, refetch: refetchBusinesses } = useQuery({
    queryKey: ['admin-businesses'],
    queryFn: getAllBusinesses,
    enabled: tab === 'comercios',
    staleTime: 0,
    retry: 2,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
    enabled: tab === 'usuarios',
  });

  const { data: drivers = [] } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: getActiveDrivers,
    enabled: tab === 'resumen' || tab === 'pedidos',
  });

  const { data: allDrivers = [] } = useQuery({
    queryKey: ['admin-all-drivers'],
    queryFn: getAllDrivers,
    enabled: tab === 'mensajeros',
  });

  const assignMutation = useMutation({
    mutationFn: ({ orderId, driverId }) => assignDriverToOrder(orderId, driverId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast('Mensajero asignado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const autoAssignMutation = useMutation({
    mutationFn: async (orderId) => {
      const offers = await publishDeliveryOffersWithExpansion(orderId);
      if (offers > 0) return { assigned: true, offers };
      return requestAutoAssignRider(orderId);
    },
    onSuccess: (result) => {
      toast(result?.offers > 0 || result?.riderId ? 'Despacho iniciado' : 'Sin mensajeros disponibles', result?.offers > 0 || result?.riderId ? 'success' : 'error');
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId, status }) => {
      logAdminAction('order_status_update', { orderId, status });
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
      toast('Pedido actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRole(userId, role),
    onSuccess: (_, { userId, role }) => {
      logAdminAction('user_role_update', { userId, role });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast('Rol actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const adminDriverMutation = useMutation({
    mutationFn: ({ driverId, updates }) => adminUpdateDriver(driverId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-drivers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-drivers'] });
      queryClient.invalidateQueries({ queryKey: ['admin-kpis'] });
      toast('Mensajero actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));

  const handleStatus = (orderId, status) => statusMutation.mutate({ orderId, status });
  const handleAssign = (orderId, driverId) => assignMutation.mutate({ orderId, driverId });
  const handleAutoAssign = (orderId) => autoAssignMutation.mutate(orderId);

  return (
    <div className="space-y-4">
      <PanelHeader tag="Administración" title="Operación Urabapp" subtitle={BRAND.tagline} />

      <PanelTabBar tabs={TABS} value={tab} onChange={setTab} />

      {tab === 'soporte' && <AdminSupportPanel />}

      {tab === 'integraciones' && <AdminIntegrationsPanel />}

      {tab === 'comunicacion' && <AdminCommunicationsPanel />}

      {tab === 'finanzas' && <AdminFinancialEnginePanel />}

      {tab === 'ejecutivo' && <AdminExecutivePanel />}

      {tab === 'crm' && <AdminCrmPanel />}

      {tab === 'marketing' && <AdminMarketingPanel />}

      {tab === 'categorias' && <AdminCategoriesPanel />}

      {tab === 'retiros' && <AdminCourierPayoutsPanel />}

      {tab === 'resumen' && (
        <>
          <LaunchChecklist kpis={kpis} onOpenTab={setTab} />
          <AdminZonesPanel />
          <AdminPhase3Panel kpis={kpis} />
          <AdminEconomicsPanel kpis={kpis} />
          <AdminDifferentiatorsPanel kpis={kpis} />
          <AdminPhase6Panel kpis={kpis} />

          {loadingKpis ? (
            <div className="flex justify-center py-8"><Loader /></div>
          ) : (
            <MetricGrid>
              {[
                { label: 'Pedidos', value: kpis?.totalOrders ?? 0, goal: PHASE_1_KPIS.orders },
                { label: 'Pendientes', value: kpis?.pendingOrders ?? 0 },
                { label: STORE.adminTab, value: kpis?.totalBusinesses ?? 0, goal: PHASE_1_KPIS.businesses },
                { label: 'Mensajeros', value: kpis?.totalDrivers ?? 0, goal: PHASE_1_KPIS.riders },
                { label: 'Usuarios', value: kpis?.totalUsers ?? 0, goal: PHASE_1_KPIS.users },
                { label: 'Tiempo prom.', value: kpis?.avgDeliveryMin ? `${kpis.avgDeliveryMin} min` : '—' },
                { label: 'Recompra', value: `${kpis?.repeatRate ?? 0}%` },
                { label: 'Ticket prom.', value: formatCOP(kpis?.costPerOrder ?? 0) },
              ].map((stat) => (
                <MetricCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  trend={stat.goal != null ? `Meta: ${stat.goal}` : undefined}
                  accent
                />
              ))}
            </MetricGrid>
          )}

          {activeOrders.length > 0 && (
            <SurfaceCard>
              <SectionTitle>Pedidos activos ({activeOrders.length})</SectionTitle>
              <div className="mt-3 space-y-2">
                {activeOrders.slice(0, 8).map((order) => (
                  <div key={order.id} className="rounded-xl bg-background p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-secondary">{order.order_number}</p>
                        <p className="text-xs text-muted">
                          {order.businesses?.name || 'Mandado'} · {formatCOP(order.total)}
                        </p>
                        <p className="text-xs text-muted">{ORDER_STATUS_LABELS[order.status]}</p>
                      </div>
                    </div>
                    <AdminOrderActions
                      order={order}
                      drivers={drivers}
                      onStatus={handleStatus}
                      onAssign={handleAssign}
                      onAutoAssign={handleAutoAssign}
                      compact
                    />
                  </div>
                ))}
              </div>
            </SurfaceCard>
          )}

          {pendingOrders.length === 0 && activeOrders.length === 0 && (
            <SurfaceCard className="text-center text-sm text-muted">
              Sin pedidos aún. Prueba el flujo en <strong>/search</strong> o <strong>/mandado</strong>.
            </SurfaceCard>
          )}

          <SurfaceCard>
            <SectionTitle>Municipios</SectionTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {MUNICIPALITIES.map((m) => (
                <span key={m} className="rounded-full bg-primary-light px-3 py-1 text-sm font-semibold text-primary-dark">
                  {m}
                </span>
              ))}
            </div>
          </SurfaceCard>
        </>
      )}

      {tab === 'pedidos' && (
        loadingOrders ? <Loader /> : orders.length === 0 ? (
          <p className="text-center text-muted">No hay pedidos registrados.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <SurfaceCard key={order.id}>
                <div className="flex justify-between">
                  <p className="font-bold text-secondary">{order.order_number}</p>
                  <span className="text-xs font-semibold text-primary">{ORDER_STATUS_LABELS[order.status]}</span>
                </div>
                <p className="text-sm text-muted">{order.businesses?.name || 'Mandado'} · {order.dest_address}</p>
                <p className="font-semibold text-primary">{formatCOP(order.total)}</p>
                <AdminOrderActions
                  order={order}
                  drivers={drivers}
                  onStatus={handleStatus}
                  onAssign={handleAssign}
                  onAutoAssign={handleAutoAssign}
                />
              </SurfaceCard>
            ))}
          </div>
        )
      )}

      {tab === 'envios' && <AdminShipmentsPanel />}

      {tab === 'tracking' && (
        <SectionErrorBoundary label="Tracking en vivo">
          <AdminLiveTrackingPanel />
        </SectionErrorBoundary>
      )}

      {tab === 'comercios' && (
        <SectionErrorBoundary label="la pestaña Tiendas" onRetry={() => refetchBusinesses()}>
        <div className="space-y-4">
          <AdminBusinessReview businesses={businesses} />
          {businessesError ? (
            <ErrorState onRetry={() => refetchBusinesses()} />
          ) : loadingBusinesses ? (
            <Loader />
          ) : (
        <DataTable
          columns={[
            {
              key: 'name',
              label: STORE.one,
              render: (b) => (
                <span className="inline-flex items-center gap-2 font-semibold">
                  <AppIcon name={b.emoji || 'store'} size="xs" />
                  {b.name}
                </span>
              ),
            },
            {
              key: 'location',
              label: 'Ubicación',
              render: (b) => `${b.municipio} · ${b.zone || '—'}`,
            },
            {
              key: 'status',
              label: 'Estado',
              render: (b) => `${b.verification_status || '—'} · ${b.is_published ? 'Publicado' : 'Oculto'}`,
            },
            {
              key: 'slug',
              label: 'Slug',
              render: (b) => `/tienda/${b.slug || b.id}`,
            },
          ]}
          rows={businesses}
          emptyTitle={`Sin ${STORE.manyLower}`}
          emptyDescription={STORE.adminEmpty}
        />
          )}
        </div>
        </SectionErrorBoundary>
      )}

      {tab === 'mensajeros' && (
        <div className="space-y-4">
          <AdminCourierReview />
          <SectionTitle>Todos los mensajeros</SectionTitle>
        <div className="space-y-3">
          {allDrivers.length === 0 ? (
            <SurfaceCard className="text-center text-sm text-muted">
              Sin mensajeros. Regístrate en <strong>/domiciliario/registro</strong> para probar entregas.
            </SurfaceCard>
          ) : (
            allDrivers.map((d) => (
              <SurfaceCard key={d.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-secondary">{d.name}</p>
                  <p className="text-xs text-muted">
                    {d.phone} · {d.municipio} · {d.is_online ? (
                      <span className="font-semibold text-primary">En línea</span>
                    ) : (
                      'Offline'
                    )}
                    {d.is_verified ? ' · Verificado' : ' · Sin verificar'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-primary">{d.total_deliveries ?? 0} entregas</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => adminDriverMutation.mutate({
                      driverId: d.id,
                      updates: { is_online: !d.is_online },
                    })}
                  >
                    {d.is_online ? 'Desconectar' : 'En línea'}
                  </Button>
                  {!d.is_verified && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => adminDriverMutation.mutate({
                        driverId: d.id,
                        updates: { is_verified: true },
                      })}
                    >
                      Verificar
                    </Button>
                  )}
                </div>
              </SurfaceCard>
            ))
          )}
        </div>
        </div>
      )}

      {tab === 'usuarios' && (
        <DataTable
          columns={[
            { key: 'name', label: 'Usuario', render: (u) => u.full_name },
            { key: 'contact', label: 'Contacto', render: (u) => u.email || u.phone || '—' },
            {
              key: 'role',
              label: 'Rol',
              render: (u) => (
                <select
                  value={u.role}
                  onChange={(e) => roleMutation.mutate({ userId: u.id, role: e.target.value })}
                  className="h-9 rounded-xl border border-input bg-background px-3 text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {['CLIENT', 'BUSINESS', 'RIDER', 'ADMIN'].map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              ),
            },
          ]}
          rows={users}
          emptyTitle="Sin usuarios"
        />
      )}
    </div>
  );
}
