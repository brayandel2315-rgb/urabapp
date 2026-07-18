import { lazy, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExecutiveDashboard } from '../../../services/crm.service';
import Loader from '../../../components/ui/Loader';
import Button from '../../../components/ui/Button';
import { formatCOP } from '../../../utils/currency';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';

const AdminExecutiveCharts = lazy(() => import('./AdminExecutiveCharts'));

export default function AdminExecutivePanel() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['executive-dashboard'],
    queryFn: getExecutiveDashboard,
    refetchInterval: 60000,
  });

  if (isLoading) return <Loader variant="section" message="Cargando métricas…" />;
  if (isError || !data) {
    return (
      <SurfaceCard className="text-center">
        <p className="text-muted">Ejecuta la migración 018 en Supabase para activar el dashboard ejecutivo.</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>Reintentar</Button>
      </SurfaceCard>
    );
  }
  return (
    <div className="space-y-4">
      <SurfaceCard className="bg-secondary text-white ring-secondary">
        <p className="text-tagline text-primary-bright">Dashboard CEO</p>
        <h2 className="font-display text-2xl font-bold">Vista ejecutiva</h2>
        <p className="mt-1 text-sm text-white/75">GMV, margen, retención y alertas operativas.</p>
      </SurfaceCard>

      {data.alerts?.length > 0 && (
        <div className="space-y-2">
          {data.alerts.map((a) => (
            <div
              key={a.message}
              className={`rounded-2xl border px-4 py-3 text-sm ${
                a.level === 'high' ? 'border-destructive/40 bg-destructive/10 text-destructive dark:text-red-300' :
                a.level === 'medium' ? 'border-accent/50 bg-accent/15 text-secondary dark:text-foreground' :
                'border-border bg-surface text-muted'
              }`}
            >
              <span className="font-bold">{a.message}</span>
              <span className="text-muted"> — {a.action}</span>
            </div>
          ))}
        </div>
      )}

      <MetricGrid>
        <MetricCard label="GMV mes" value={formatCOP(data.gmvMonth)} accent />
        <MetricCard label="Pedidos mes" value={data.ordersMonth} icon="package" />
        <MetricCard label="Margen mes" value={formatCOP(data.marginMonth)} icon="money" />
        <MetricCard label="Pedidos semana" value={data.ordersWeek} icon="chart" />
        <MetricCard label="Clientes CRM" value={data.totalCustomers} icon="profile" />
        <MetricCard label="Comercios" value={data.totalBusinesses} icon="store" />
        <MetricCard label="Retención" value={`${data.retentionRate}%`} trend="clientes con 2+ pedidos" />
        <MetricCard label="NPS proxy" value={data.npsProxy != null ? `${data.npsProxy}%` : '—'} trend="reseñas de 4 estrellas o más" />
      </MetricGrid>

      <Suspense fallback={<Loader variant="section" message="Cargando gráficos…" className="py-8" />}>
        <AdminExecutiveCharts zoneGmv={data.zoneGmv} segmentCounts={data.segmentCounts} />
      </Suspense>

      <div className="grid gap-4 lg:grid-cols-2">
        <SurfaceCard>
          <SectionTitle>Canal de adquisición</SectionTitle>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(data.sourceBreakdown || {}).map(([src, n]) => (
              <span key={src} className="rounded-full bg-primary-light px-3 py-1 text-xs font-bold text-primary-dark">
                {src}: {n}
              </span>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard>
          <SectionTitle>Recuperación</SectionTitle>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-background p-3">
              <p className="text-xl font-black text-secondary">{data.abandonedCarts}</p>
              <p className="text-xs text-muted">Carritos abandonados</p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="text-xl font-black text-primary">{formatCOP(data.abandonedValue)}</p>
              <p className="text-xs text-muted">Valor en riesgo</p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="text-xl font-black text-secondary">{data.onlineRiders}</p>
              <p className="text-xs text-muted">Riders en línea</p>
            </div>
            <div className="rounded-xl bg-background p-3">
              <p className="text-xl font-black text-secondary">{data.openTickets}</p>
              <p className="text-xs text-muted">Tickets abiertos</p>
            </div>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
