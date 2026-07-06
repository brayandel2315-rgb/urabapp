import { PHASE_5_KPIS } from '../../../utils/constants';
import { getRiderLeaderboard } from '../../../services/rider.service';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RiderLeaderboard from '../../../components/RiderLeaderboard';
import WhatsappFunnel from '../../../components/WhatsappFunnel';
import Button from '../../../components/ui/Button';
import { createWeeklyRiderBonusPayouts } from '../../../services/admin.service';
import { toast } from '../../../utils/toast';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

function Metric({ label, current, goal }) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  return (
    <div className="rounded-xl bg-background p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-bold text-secondary">{current} / {goal}</p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDifferentiatorsPanel({ kpis }) {
  const queryClient = useQueryClient();
  const { data: leaderboard = [] } = useQuery({
    queryKey: ['admin-rider-leaderboard'],
    queryFn: () => getRiderLeaderboard({ limit: 5 }),
    refetchInterval: 60000,
  });

  const bonusMutation = useMutation({
    mutationFn: createWeeklyRiderBonusPayouts,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-courier-payouts'] });
      toast(result.message, result.created > 0 ? 'success' : 'info');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-tagline text-muted">Diferenciadores</p>
          <SectionTitle>Fase 5 — Métricas</SectionTitle>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Tiendas Express (mes)" current={kpis?.expressBusinessesMonth ?? 0} goal={PHASE_5_KPIS.expressBusinesses} />
          <Metric label="Pedidos WhatsApp (mes)" current={kpis?.whatsappOrdersMonth ?? 0} goal={PHASE_5_KPIS.whatsappOrders} />
          <Metric label="Envíos intermunicipales" current={kpis?.intermunicipalOrdersMonth ?? 0} goal={PHASE_5_KPIS.intermunicipalOrders} />
          <Metric label="Mensajeros activos" current={kpis?.totalDrivers ?? 0} goal={PHASE_5_KPIS.activeRiders} />
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-tagline text-muted">Ranking mensajeros</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bonusMutation.mutate()}
            disabled={bonusMutation.isPending}
          >
            Generar bonos semanales
          </Button>
        </div>
        <RiderLeaderboard riders={leaderboard} />
      </SurfaceCard>

      <WhatsappFunnel />
    </div>
  );
}
