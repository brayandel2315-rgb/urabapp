import { PHASE_3_KPIS } from '../../../utils/constants';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { getEnvConfig } from '../../../utils/env';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { StatusBadge } from '@/design-system/patterns/MetricCard';

const FEATURES = [
  {
    key: 'coupons',
    label: 'Cupones en checkout',
    test: (kpis) => (kpis?.activeCoupons ?? 0) >= 1,
    hint: 'Crea un cupón activo en Marketing',
  },
  {
    key: 'notify',
    label: 'Notificaciones de pedido',
    test: () => isSupabaseConfigured && getEnvConfig().integrations.push,
    hint: 'VAPID + push activo en integraciones',
  },
  {
    key: 'hours',
    label: 'Horarios de tienda',
    test: (kpis) => (kpis?.activeBusinesses ?? 0) >= 1,
    hint: 'Comercios con pedidos activos',
  },
  {
    key: 'cancel',
    label: 'Cancelación por cliente',
    test: () => true,
    hint: 'Disponible en pedidos pendientes/aceptados',
  },
];

export default function AdminPhase3Panel({ kpis }) {
  const checks = FEATURES.map((f) => ({ ...f, ok: f.test(kpis) }));
  const done = checks.filter((c) => c.ok).length;
  const allReady = done === checks.length;

  return (
    <SurfaceCard className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-tagline text-muted">Producto mínimo real</p>
          <SectionTitle>Fase 3 — Operación estable</SectionTitle>
          <p className="mt-1 text-xs text-muted">
            Meta: {PHASE_3_KPIS.orders} pedidos · {PHASE_3_KPIS.activeBusinesses} comercios activos · {PHASE_3_KPIS.repeatRate}% recompra
          </p>
        </div>
        <StatusBadge status={allReady ? 'success' : 'muted'}>
          {done}/{checks.length} listo
        </StatusBadge>
      </div>

      <ul className="space-y-2">
        {checks.map((c) => (
          <li key={c.key} className="flex items-start gap-2 rounded-xl bg-background p-3 text-sm">
            <AppIcon name={c.ok ? 'checkboxOn' : 'checkboxOff'} size="xs" className="mt-0.5 shrink-0" />
            <div>
              <p className={c.ok ? 'font-semibold text-foreground' : 'text-muted'}>{c.label}</p>
              {!c.ok && <p className="text-xs text-muted">{c.hint}</p>}
            </div>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs text-muted">Recompra</p>
          <p className="font-bold text-secondary">{kpis?.repeatRate ?? 0}% / {PHASE_3_KPIS.repeatRate}%</p>
        </div>
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs text-muted">Ticket prom.</p>
          <p className="font-bold text-secondary">
            {(kpis?.avgTicket ?? 0).toLocaleString('es-CO')} / 35.000
          </p>
        </div>
      </div>
    </SurfaceCard>
  );
}
