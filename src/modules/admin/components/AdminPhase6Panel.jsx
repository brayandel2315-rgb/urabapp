import { PHASE_6_KPIS } from '../../../utils/constants';
import PaymentMethodsPanel from '../../../components/payments/PaymentMethodsPanel';
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

export default function AdminPhase6Panel({ kpis }) {
  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4">
        <div>
          <p className="text-tagline text-muted">Post-MVP</p>
          <SectionTitle>Fase 6 — Reseñas, GPS y pagos digitales</SectionTitle>
          <p className="mt-1 text-xs text-muted">
            Wompi integrado · reseñas · GPS en checkout · tracking en vivo
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Metric label="Reseñas" current={kpis?.totalReviews ?? 0} goal={PHASE_6_KPIS.reviews} />
          <Metric label="Pedidos con GPS (mes)" current={kpis?.ordersWithGpsMonth ?? 0} goal={PHASE_6_KPIS.ordersWithGps} />
        </div>
      </SurfaceCard>
      <PaymentMethodsPanel compact embedded />
    </div>
  );
}
