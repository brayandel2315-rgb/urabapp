import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { formatCOP } from '@/utils/currency';
import { financialService, WALLET_OWNER, PAYOUT_CYCLE } from '@/services/financial.service';
import { toast } from '@/utils/toast';

export default function AdminFinancialEnginePanel() {
  const queryClient = useQueryClient();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['fin-platform-dashboard'],
    queryFn: () => financialService.accounting.getPlatformDashboard(),
  });

  const { data: settlements = [] } = useQuery({
    queryKey: ['fin-settlements'],
    queryFn: () => financialService.accounting.listSettlements({ limit: 20 }),
  });

  const { data: rules = [] } = useQuery({
    queryKey: ['fin-commission-rules'],
    queryFn: () => financialService.commission.listRules(),
  });

  const releaseRiderBatch = useMutation({
    mutationFn: () => financialService.payout.releaseBatch(WALLET_OWNER.RIDER, PAYOUT_CYCLE.WEEKLY),
    onSuccess: (res) => {
      if (res?.success) {
        toast(`Lote mensajeros: ${formatCOP(res.total)} · ${res.items} cuentas`);
        queryClient.invalidateQueries({ queryKey: ['fin-platform-dashboard'] });
      } else toast(res?.reason || 'Error en lote', 'error');
    },
    onError: (e) => toast(e.message, 'error'),
  });

  const releaseBusinessBatch = useMutation({
    mutationFn: () => financialService.payout.releaseBatch(WALLET_OWNER.BUSINESS, PAYOUT_CYCLE.WEEKLY),
    onSuccess: (res) => {
      if (res?.success) {
        toast(`Lote comercios: ${formatCOP(res.total)} · ${res.items} cuentas`);
        queryClient.invalidateQueries({ queryKey: ['fin-platform-dashboard'] });
      } else toast(res?.reason || 'Error en lote', 'error');
    },
    onError: (e) => toast(e.message, 'error'),
  });

  if (isLoading) return <Loader />;

  if (!dashboard?.success) {
    return (
      <SurfaceCard>
        <p className="text-sm text-muted-foreground">
          Motor financiero no disponible. Aplica la migración 085_financial_engine en Supabase.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle>Financial Engine — UrabApp</SectionTitle>
      <p className="text-sm text-muted-foreground">
        Liquidación automática al entregar. ePayco/Wompi son solo proveedores de pago; la lógica vive aquí.
      </p>

      <MetricGrid className="grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Ingresos hoy" value={formatCOP(dashboard.revenue_today ?? 0)} icon="money" accent />
        <MetricCard label="Semana" value={formatCOP(dashboard.revenue_week ?? 0)} icon="calendar" />
        <MetricCard label="Mes" value={formatCOP(dashboard.revenue_month ?? 0)} icon="chart" />
        <MetricCard label="Pendiente pagar" value={formatCOP(dashboard.pending_payouts ?? 0)} icon="clock" />
      </MetricGrid>

      <SurfaceCard className="space-y-3">
        <SectionTitle>Lotes de liquidación</SectionTitle>
        <p className="text-xs text-muted-foreground">
          Mueve saldo pendiente → disponible para retiro. Ciclos: diario, semanal, quincenal, mensual (configurable).
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={releaseRiderBatch.isPending}
            onClick={() => releaseRiderBatch.mutate()}
          >
            Liquidar mensajeros (semanal)
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={releaseBusinessBatch.isPending}
            onClick={() => releaseBusinessBatch.mutate()}
          >
            Liquidar comercios (semanal)
          </Button>
        </div>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Reglas de comisión activas ({rules.length})</SectionTitle>
        <ul className="mt-2 space-y-2 text-sm">
          {rules.map((r) => (
            <li key={r.id} className="flex justify-between gap-2 border-b border-border/40 py-2 last:border-0">
              <span className="font-medium">{r.name}</span>
              <span className="text-muted-foreground">
                {r.scope_type}
                {r.percentage != null ? ` · ${r.percentage}%` : ''}
                {r.fixed_amount != null ? ` · ${formatCOP(r.fixed_amount)}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </SurfaceCard>

      <SurfaceCard>
        <SectionTitle>Últimas liquidaciones ({dashboard.settlements_count ?? 0} total)</SectionTitle>
        <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto text-xs">
          {settlements.map((s) => (
            <li key={s.id} className="flex justify-between gap-2 rounded-lg bg-muted/30 px-3 py-2">
              <span>{s.orders?.order_number || s.order_id?.slice(0, 8)}</span>
              <span>
                C:{formatCOP(s.commission_amount)} · M:{formatCOP(s.rider_amount)} · T:{formatCOP(s.business_amount)}
              </span>
            </li>
          ))}
          {settlements.length === 0 && (
            <li className="text-muted-foreground">Sin liquidaciones aún — se crean al marcar pedidos entregados.</li>
          )}
        </ul>
      </SurfaceCard>
    </div>
  );
}
