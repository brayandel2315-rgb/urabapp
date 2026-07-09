import { useQuery } from '@tanstack/react-query';
import { getBusinessFinanceSummary } from '@/services/business.service';
import { financialService } from '@/services/financial.service';
import { formatCOP } from '@/utils/currency';
import { PageState, PageLoader } from '@/design-system/patterns/PageState';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';

function PeriodBlock({ label, data }) {
  return (
    <SurfaceCard className="space-y-3">
      <p className="text-sm font-bold text-foreground">{label}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Pedidos entregados</p>
          <p className="font-bold text-foreground">{data.orders}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Ventas brutas</p>
          <p className="font-bold text-primary">{formatCOP(data.revenue)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tu neto</p>
          <p className="font-bold text-foreground">{formatCOP(data.net)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Comisión Urabapp</p>
          <p className="font-bold text-muted-foreground">{formatCOP(data.commission)}</p>
        </div>
      </div>
    </SurfaceCard>
  );
}

export default function BusinessFinancesPanel({ business }) {
  const { data, isLoading } = useQuery({
    queryKey: ['business-finance', business?.id],
    queryFn: () => getBusinessFinanceSummary(business.id),
    enabled: !!business?.id,
    refetchInterval: 60000,
  });

  const { data: walletFin } = useQuery({
    queryKey: ['business-fin-wallet', business?.id],
    queryFn: () => financialService.wallet.getBusinessDashboard(business.id),
    enabled: !!business?.id,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return <PageLoader rows={3} />;
  }

  const payoutMode = business.payout_mode || 'manual';
  const settlement = business.settlement_frequency || 'semanal';
  const balancePending = Number(walletFin?.balance_pending ?? walletFin?.wallet?.balance_pending ?? 0);
  const balanceAvailable = Number(walletFin?.balance_available ?? walletFin?.wallet?.balance_available ?? 0);

  return (
    <div className="space-y-4">
      <MetricGrid>
        <MetricCard label="Neto hoy" value={formatCOP(data?.today?.net ?? 0)} icon="money" accent />
        <MetricCard label="Neto 7 días" value={formatCOP(data?.week?.net ?? 0)} icon="chart" />
        <MetricCard label="Neto 30 días" value={formatCOP(data?.month?.net ?? 0)} icon="store" />
        <MetricCard label="Saldo pendiente" value={formatCOP(balancePending)} icon="clock" />
      </MetricGrid>

      <SurfaceCard className="space-y-2 text-sm">
        <SectionTitle>Billetera UrabApp</SectionTitle>
        <p className="text-muted-foreground">
          Disponible: <strong className="text-primary">{formatCOP(balanceAvailable)}</strong>
          {' · '}
          Pendiente: <strong className="text-foreground">{formatCOP(balancePending)}</strong>
        </p>
        {walletFin?.next_settlement_date && (
          <p className="text-xs text-primary">
            Próxima liquidación: {new Date(walletFin.next_settlement_date).toLocaleDateString('es-CO')}
          </p>
        )}
      </SurfaceCard>

      <PeriodBlock label="Hoy" data={data?.today ?? { orders: 0, revenue: 0, net: 0, commission: 0 }} />
      <PeriodBlock label="Últimos 7 días" data={data?.week ?? { orders: 0, revenue: 0, net: 0, commission: 0 }} />
      <PeriodBlock label="Últimos 30 días" data={data?.month ?? { orders: 0, revenue: 0, net: 0, commission: 0 }} />

      <SurfaceCard className="space-y-2 text-sm">
        <SectionTitle>Retiros y liquidación</SectionTitle>
        <p className="text-muted-foreground">
          Modo de pago: <strong className="text-foreground">{payoutMode === 'wompi' ? 'Wompi' : 'Transferencia manual'}</strong>
          {' · '}
          Frecuencia: <strong className="text-foreground">{settlement}</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          Los retiros se coordinan con el equipo Urabapp. Aquí ves cuánto has generado antes de comisión.
        </p>
      </SurfaceCard>

      <SectionTitle>Últimos pedidos liquidados</SectionTitle>
      {(data?.recentPayouts ?? []).length === 0 ? (
        <PageState
          type="empty"
          icon="money"
          title="Sin pedidos entregados este mes"
          description="Cuando completes entregas, verás aquí tu historial de liquidación."
          className="py-8"
        />
      ) : (
        data.recentPayouts.map((row) => (
          <SurfaceCard key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-semibold text-foreground">{row.orderNumber || row.id.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(row.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary">{formatCOP(row.net ?? row.total)}</p>
              <p className="text-xs text-muted-foreground">neto</p>
            </div>
          </SurfaceCard>
        ))
      )}

      <SurfaceCard className="flex items-start gap-3 border-primary/20 bg-primary/5 text-sm">
        <AppIcon name="alert" size="sm" className="mt-0.5 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          <strong className="text-foreground">¿Cuánto gané?</strong> Tu neto = venta del pedido − comisión Urabapp − descuentos que financiaste.
        </p>
      </SurfaceCard>
    </div>
  );
}
