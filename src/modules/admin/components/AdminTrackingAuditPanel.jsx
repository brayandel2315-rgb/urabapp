import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { getOrdersForTrackingAudit } from '@/services/order-tracking.service';
import OrderTrackingAuditPanel from '@/components/tracking/OrderTrackingAuditPanel';
import { ORDER_STATUS_LABELS } from '@/utils/constants';

export default function AdminTrackingAuditPanel() {
  const [selectedId, setSelectedId] = useState(null);
  const [days, setDays] = useState(7);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-tracking-audit-list', days],
    queryFn: () => getOrdersForTrackingAudit({ days }),
    staleTime: 30_000,
  });

  if (selectedId) {
    return (
      <OrderTrackingAuditPanel
        orderId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Pedidos entregados o cancelados — auditoría y replay unificado.
        </p>
        <select
          className="rounded-xl border border-border bg-background px-3 py-1.5 text-sm"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value={3}>Últimos 3 días</option>
          <option value={7}>Últimos 7 días</option>
          <option value={14}>Últimos 14 días</option>
          <option value={30}>Últimos 30 días</option>
        </select>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando historial…</p>}

      {!isLoading && orders.length === 0 && (
        <SurfaceCard className="text-center text-sm text-muted-foreground">
          No hay pedidos finalizados en este período.
        </SurfaceCard>
      )}

      <div className="grid gap-2">
        {orders.map((order) => (
          <button
            key={order.id}
            type="button"
            onClick={() => setSelectedId(order.id)}
            className="rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-foreground">{order.order_number || order.id.slice(0, 8)}</span>
              <span className="text-xs font-semibold text-primary">
                {ORDER_STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{order.dest_municipio}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {order.delivered_at && (
                <span>Entregado {new Date(order.delivered_at).toLocaleDateString('es-CO')}</span>
              )}
              {order.has_incident && <span className="text-destructive">· Incidencia</span>}
              {order.tracking_closed_at && <span className="text-muted-foreground">· Cerrado</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
