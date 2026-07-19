import Button from '../../../components/ui/Button';
import { ORDER_STATUS_LABELS, ECONOMICS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import { getBusinessOpenState } from '../../../utils/schedule';
import { isActiveOrder, countPendingOrders } from '../../../utils/order-filters';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid, StatusBadge } from '@/design-system/patterns/MetricCard';
import { PageState } from '@/design-system/patterns/PageState';

export default function BusinessOverviewPanel({
  business,
  stats,
  statsLoading,
  orders = [],
  onTabChange,
}) {
  const openState = getBusinessOpenState(business);
  const pendingCount = countPendingOrders(orders);
  const activeOrders = orders.filter(isActiveOrder);
  const isNewStore = (stats?.ordersToday ?? 0) === 0 && activeOrders.length === 0;
  const needsVerification = business.verification_status !== 'approved' || business.is_published === false;

  return (
    <div className="space-y-4">
      {pendingCount > 0 && (
        <button
          type="button"
          onClick={() => onTabChange('orders')}
          className="biz-alert-cta"
        >
          <span className="biz-alert-cta__icon">
            <AppIcon name="bell" size="sm" className="text-primary" />
          </span>
          <div className="min-w-0 flex-1 text-left">
            <p className="font-semibold text-foreground">
              {pendingCount} pedido{pendingCount !== 1 ? 's' : ''} por confirmar
            </p>
            <p className="text-xs text-muted-foreground">Gestiona ahora · responde en minutos</p>
          </div>
          <AppIcon name="chevronDown" size="xs" className="-rotate-90 shrink-0 text-primary" />
        </button>
      )}

      {needsVerification && (
        <SurfaceCard className="border-primary/20 bg-primary/5">
          <div className="flex items-start gap-3">
            <AppIcon name="lock" size="sm" className="mt-0.5 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">Verificación pendiente</p>
              <p className="mt-1 text-sm text-muted">
                {business.verification_submitted_at
                  ? 'Tus documentos están en revisión (~48 h). Tu tienda se publicará al aprobarse.'
                  : 'Completa la verificación legal en Configuración para aparecer en el catálogo.'}
              </p>
              {!business.verification_submitted_at && (
                <Button size="sm" className="mt-3" onClick={() => onTabChange('store')}>
                  Completar verificación
                </Button>
              )}
            </div>
          </div>
        </SurfaceCard>
      )}

      <MetricGrid>
        <MetricCard
          label="Pedidos hoy"
          value={statsLoading ? '…' : (stats?.ordersToday ?? 0)}
          icon="package"
        />
        <MetricCard
          label="Ventas hoy"
          value={statsLoading ? '…' : formatCOP(stats?.revenueToday ?? 0)}
          icon="money"
          accent
        />
        <MetricCard
          label="Tu neto hoy"
          value={statsLoading ? '…' : formatCOP(stats?.netToday ?? 0)}
          icon="store"
        />
        <MetricCard
          label={`Comisión (${business.commission_pct ?? ECONOMICS.commissionPct}%)`}
          value={statsLoading ? '…' : formatCOP(stats?.commissionToday ?? 0)}
          icon="chart"
        />
      </MetricGrid>

      {!openState.acceptingOrders && business.is_open && openState.hint && (
        <p className="biz-callout biz-callout--warn text-xs">
          {openState.hint}
        </p>
      )}

      {activeOrders.length > 0 ? (
        <div>
          <SectionTitle>Pedidos en curso</SectionTitle>
          <div className="space-y-2">
            {activeOrders.slice(0, 5).map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => onTabChange('orders')}
                className="flex w-full items-center justify-between gap-3 rounded-2xl bg-card px-4 py-3 text-left ring-1 ring-border/50 transition-colors hover:bg-muted/30"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{order.order_number || order.id?.slice(0, 8)}</p>
                  <p className="truncate text-xs text-muted">{order.dest_address}</p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={order.status === 'pending' ? 'warning' : 'success'}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </StatusBadge>
                  <p className="mt-1 text-sm font-bold text-primary">{formatCOP(order.total)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : isNewStore && !needsVerification && (
        <PageState
          type="new-user"
          title="Listo para vender"
          description="Agrega productos a tu menú y comparte tu tienda con clientes del Urabá."
          icon="store"
          action={(
            <Button onClick={() => onTabChange('products')}>Ir al menú</Button>
          )}
          className="py-10"
        />
      )}
    </div>
  );
}
