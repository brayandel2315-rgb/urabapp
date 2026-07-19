import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyBusinesses, updateBusiness, getBusinessStats } from '../../../services/business.service';
import { getBusinessOrders } from '../../../services/order.service';
import { useAuthStore } from '../../../store/authStore';
import { useBusinessOrdersRealtime } from '../../../hooks/useBusinessOrdersRealtime';
import { isSupabaseConfigured } from '../../../lib/supabase';
import Button from '../../../components/ui/Button';
import Loader from '../../../components/ui/Loader';
import ErrorState from '../../../components/ErrorState';
import BusinessProducts from '../components/BusinessProducts';
import BusinessStoreSettings from '../components/BusinessStoreSettings';
import BusinessGrowthPanel from '../components/BusinessGrowthPanel';
import BusinessOrdersPanel from '../components/BusinessOrdersPanel';
import BusinessOverviewPanel from '../components/BusinessOverviewPanel';
import BusinessStatusBar from '../components/BusinessStatusBar';
import BusinessBottomNav from '../components/BusinessBottomNav';
import BusinessExpressSuccess from '../../../components/BusinessExpressSuccess';
import { buildBusinessUrl } from '../../../utils/app';
import { countPendingOrders } from '../../../utils/order-filters';
import { toast } from '../../../utils/toast';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { STORE } from '@/utils/marketplace-copy';

const VALID_TAB_IDS = new Set(['inicio', 'orders', 'products', 'store']);
const LEGACY_TAB_MAP = { crecer: 'store' };

export default function BusinessDashboard() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [expressBusiness, setExpressBusiness] = useState(null);
  const seenOrderIdsRef = useRef(new Set());
  const ordersSeededRef = useRef(false);
  const initialTab = searchParams.get('tab');
  const resolvedTab = LEGACY_TAB_MAP[initialTab] || initialTab;
  const tab = VALID_TAB_IDS.has(resolvedTab) ? resolvedTab : 'inicio';

  const setTab = (id) => {
    setSearchParams(id === 'inicio' ? {} : { tab: id }, { replace: true });
  };

  useEffect(() => {
    if (location.state?.newBusiness) {
      setExpressBusiness(location.state.newBusiness);
      navigate(location.pathname, { replace: true, state: {} });
    }
    if (location.state?.tab && VALID_TAB_IDS.has(location.state.tab)) {
      setTab(location.state.tab);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const { data: businesses = [], isLoading: loadingBusiness } = useQuery({
    queryKey: ['my-businesses', user?.id],
    queryFn: () => getMyBusinesses(user.id),
    enabled: !!user?.id,
  });

  const business = businesses[0] ?? null;

  const {
    data: orders = [],
    isLoading: loadingOrders,
    isError: ordersError,
    refetch: refetchOrders,
  } = useQuery({
    queryKey: ['business-orders', business?.id],
    queryFn: () => getBusinessOrders(business.id),
    enabled: !!business?.id,
    refetchInterval: isSupabaseConfigured ? false : 30000,
  });

  useBusinessOrdersRealtime(business?.id, !!business?.id);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['business-stats', business?.id],
    queryFn: () => getBusinessStats(business.id),
    enabled: !!business?.id,
    refetchInterval: 60000,
  });

  useEffect(() => {
    seenOrderIdsRef.current = new Set();
    ordersSeededRef.current = false;
  }, [business?.id]);

  useEffect(() => {
    if (!orders.length) return;
    if (!ordersSeededRef.current) {
      orders.forEach((o) => seenOrderIdsRef.current.add(o.id));
      ordersSeededRef.current = true;
      return;
    }
    const freshPending = orders.filter(
      (o) => o.status === 'pending' && !seenOrderIdsRef.current.has(o.id),
    );
    freshPending.forEach((o) => {
      toast(`Nuevo pedido ${o.order_number || ''}`, 'info');
    });
    orders.forEach((o) => seenOrderIdsRef.current.add(o.id));
  }, [orders]);

  const pendingCount = countPendingOrders(orders);

  useEffect(() => {
    if (pendingCount > 0 && tab === 'inicio' && !initialTab) {
      setTab('orders');
    }
  }, [pendingCount, tab, initialTab]);

  const toggleOpenMutation = useMutation({
    mutationFn: (isOpen) => updateBusiness(business.id, { is_open: isOpen }),
    onSuccess: (_, isOpen) => {
      queryClient.invalidateQueries({ queryKey: ['my-businesses'] });
      toast(isOpen ? 'Tienda abierta — recibiendo pedidos' : 'Tienda cerrada');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  if (loadingBusiness) {
    return <Loader variant="page" message="Cargando panel…" />;
  }

  if (!business) {
    return (
      <SurfaceCard className="text-center">
        <AppIcon name="store" size="3xl" className="mx-auto text-primary" />
        <h2 className="font-display mt-3 text-xl font-bold text-foreground">{STORE.open}</h2>
        <p className="mt-2 text-sm text-muted">Un solo registro por cuenta. En minutos tu tienda estará lista en Urabá.</p>
        <Link to="/negocio/onboarding" className="mt-4 block">
          <Button className="w-full">{STORE.registerCta}</Button>
        </Link>
      </SurfaceCard>
    );
  }

  const storeLink = buildBusinessUrl(business);

  return (
    <div className="biz-dashboard space-y-4 pb-2">
      {expressBusiness && (
        <BusinessExpressSuccess
          business={expressBusiness}
          onClose={() => setExpressBusiness(null)}
        />
      )}

      <BusinessStatusBar
        business={business}
        isTogglingOpen={toggleOpenMutation.isPending}
        onToggleOpen={(next) => toggleOpenMutation.mutate(next)}
      />

      {tab === 'inicio' && (
        <BusinessOverviewPanel
          business={business}
          stats={stats}
          statsLoading={statsLoading}
          orders={orders}
          onTabChange={setTab}
        />
      )}

      {tab === 'orders' && (
        ordersError ? (
          <ErrorState onRetry={() => refetchOrders()} />
        ) : (
          <BusinessOrdersPanel
            businessId={business.id}
            orders={orders}
            isLoading={loadingOrders}
          />
        )
      )}

      {tab === 'products' && (
        <BusinessProducts key={business.id} businessId={business.id} business={business} />
      )}

      {tab === 'store' && (
        <div className="space-y-4">
          <BusinessGrowthPanel key={`growth-${business.id}`} business={business} />
          <BusinessStoreSettings key={`store-${business.id}`} business={business} storeLink={storeLink} />
        </div>
      )}

      <BusinessBottomNav
        activeTab={tab}
        pendingCount={pendingCount}
        onChange={setTab}
      />
    </div>
  );
}
