import { ECONOMICS, PHASE_4_KPIS } from '../../../utils/constants';
import { formatCOP } from '../../../utils/currency';
import { calculateOrderEconomics } from '../../../utils/economics';
import { useMutation } from '@tanstack/react-query';
import Button from '../../../components/ui/Button';
import { standardizeBusinessCommissions } from '../../../services/admin.service';
import { toast } from '../../../utils/toast';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';

function ProgressBar({ current, goal, label }) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold text-secondary">{formatCOP(current)} / {formatCOP(goal)}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminEconomicsPanel({ kpis }) {
  const example = calculateOrderEconomics({
    subtotal: ECONOMICS.exampleTicket - ECONOMICS.defaultDeliveryFee,
    deliveryFee: ECONOMICS.defaultDeliveryFee,
    hasBusiness: true,
  });

  const commissionMutation = useMutation({
    mutationFn: () => standardizeBusinessCommissions(PHASE_4_KPIS.commissionPct),
    onSuccess: (result) => toast(
      result.updated > 0
        ? `${result.updated} tienda(s) actualizadas a ${result.targetPct}%`
        : `Todas las tiendas ya tienen ${result.targetPct}%`,
      'success',
    ),
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <SurfaceCard className="space-y-4">
      <div>
        <p className="text-tagline text-muted">Modelo económico</p>
        <SectionTitle>Fase 4 — Unit economics</SectionTitle>
        <p className="mt-1 text-xs text-muted">
          Meta: {PHASE_4_KPIS.monthlyOrders.toLocaleString('es-CO')} pedidos/mes · comisión {ECONOMICS.commissionPct}%
        </p>
      </div>

      <div className="rounded-xl bg-background p-3 text-sm">
        <p className="text-caption text-muted">Ejemplo pedido {formatCOP(ECONOMICS.exampleTicket)}</p>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between"><span>Comisión ({ECONOMICS.commissionPct}%)</span><span>{formatCOP(example.commissionAmount)}</span></div>
          <div className="flex justify-between"><span>Domicilio</span><span>{formatCOP(ECONOMICS.defaultDeliveryFee)}</span></div>
          <div className="flex justify-between font-semibold text-secondary"><span>Ingresos plataforma</span><span>{formatCOP(example.platformGross)}</span></div>
          <div className="flex justify-between text-muted"><span>− Mensajero</span><span>{formatCOP(ECONOMICS.riderPayout)}</span></div>
          <div className="flex justify-between text-muted"><span>− Infraestructura</span><span>{formatCOP(ECONOMICS.infraCostPerOrder)}</span></div>
          <div className="flex justify-between text-muted"><span>− Marketing</span><span>{formatCOP(ECONOMICS.marketingCostPerOrder)}</span></div>
          <div className="flex justify-between border-t border-border pt-2 font-bold text-primary">
            <span>Margen estimado</span><span>{formatCOP(example.platformMargin)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-caption text-muted">Este mes (entregados)</p>
        <ProgressBar
          label="Pedidos entregados"
          current={kpis?.monthlyOrders ?? 0}
          goal={PHASE_4_KPIS.monthlyOrders}
        />
        <ProgressBar
          label="Ingresos plataforma"
          current={kpis?.monthlyPlatformGross ?? 0}
          goal={PHASE_4_KPIS.monthlyPlatformGross}
        />
        <ProgressBar
          label="Margen plataforma"
          current={kpis?.monthlyMargin ?? 0}
          goal={PHASE_4_KPIS.monthlyMargin}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs text-muted">Comisiones</p>
          <p className="font-bold text-secondary">{formatCOP(kpis?.monthlyCommission ?? 0)}</p>
        </div>
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs text-muted">Pagos mensajeros</p>
          <p className="font-bold text-secondary">{formatCOP(kpis?.monthlyRiderPayouts ?? 0)}</p>
        </div>
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs text-muted">GMV mes</p>
          <p className="font-bold text-secondary">{formatCOP(kpis?.monthlyGmv ?? 0)}</p>
        </div>
        <div className="rounded-xl bg-background p-3">
          <p className="text-xs text-muted">Margen / pedido</p>
          <p className="font-bold text-primary">
            {kpis?.monthlyOrders
              ? formatCOP(Math.round((kpis.monthlyMargin || 0) / kpis.monthlyOrders))
              : formatCOP(PHASE_4_KPIS.avgMarginPerOrder)}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => commissionMutation.mutate()}
        disabled={commissionMutation.isPending}
      >
        Aplicar comisión {PHASE_4_KPIS.commissionPct}% a todas las tiendas
      </Button>
    </SurfaceCard>
  );
}
