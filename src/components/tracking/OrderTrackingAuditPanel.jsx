import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { Badge } from '@/design-system/ui/badge';
import Button from '@/components/ui/Button';
import OrderTimeline from '@/components/tracking/OrderTimeline';
import OrderGpsRouteReplay from '@/components/tracking/OrderGpsRouteReplay';
import OrderEtaHistoryChart from '@/components/tracking/OrderEtaHistoryChart';
import {
  getOrderTrackingAudit,
  closeOrderTracking,
} from '@/services/order-tracking.service';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import { toast } from '@/utils/toast';

function AuditArtifacts({ audit }) {
  const order = audit?.order;
  if (!order) return null;

  const items = [
    { label: 'Foto entrega', url: order.delivery_proof_url },
    { label: 'Firma', url: order.delivery_signature_url },
  ].filter((i) => i.url);

  if (!items.length && !order.delivery_qr_verified_at) return null;

  return (
    <SurfaceCard className="space-y-3">
      <p className="text-sm font-bold text-foreground">Evidencias</p>
      {order.delivery_qr_verified_at && (
        <p className="text-xs text-emerald-600">
          QR validado · {new Date(order.delivery_qr_verified_at).toLocaleString('es-CO')}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <a key={item.label} href={item.url} target="_blank" rel="noreferrer" className="block">
            <img src={item.url} alt={item.label} className="max-h-40 w-full rounded-xl border border-border object-cover" />
            <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
          </a>
        ))}
      </div>
    </SurfaceCard>
  );
}

function AuditSummary({ summary }) {
  if (!summary) return null;
  const chips = [
    summary.duration_min != null && `${summary.duration_min} min total`,
    summary.has_proof && 'Foto',
    summary.has_signature && 'Firma',
    summary.has_qr_verified && 'QR OK',
    summary.incident_count > 0 && `${summary.incident_count} incidencia(s)`,
    summary.is_closed && 'Cerrado',
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((c) => (
        <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
      ))}
      <Badge variant="outline" className="text-xs">{summary.ping_count ?? 0} pings GPS</Badge>
    </div>
  );
}

export default function OrderTrackingAuditPanel({ orderId, onClose }) {
  const queryClient = useQueryClient();

  const { data: audit, isLoading, error } = useQuery({
    queryKey: ['order-tracking-audit', orderId],
    queryFn: () => getOrderTrackingAudit(orderId),
    enabled: Boolean(orderId),
  });

  const closeMutation = useMutation({
    mutationFn: () => closeOrderTracking(orderId),
    onSuccess: (result) => {
      if (!result?.success) {
        toast('No se pudo cerrar el tracking', 'error');
        return;
      }
      toast('Tracking cerrado');
      queryClient.invalidateQueries({ queryKey: ['order-tracking-audit', orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin-tracking-audit-list'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  if (!orderId) {
    return (
      <SurfaceCard className="text-center text-sm text-muted-foreground">
        Selecciona un pedido para ver la auditoría completa.
      </SurfaceCard>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando auditoría…</p>;
  }

  if (error || !audit?.success) {
    return (
      <SurfaceCard className="text-sm text-destructive">
        No se pudo cargar la auditoría del pedido.
      </SurfaceCard>
    );
  }

  const order = audit.order;
  const canClose = ['delivered', 'cancelled'].includes(order.status) && !order.tracking_closed_at;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            {order.order_number || order.id?.slice(0, 8)}
          </p>
          <p className="text-sm text-muted-foreground">
            {order.dest_municipio} · {ORDER_STATUS_LABELS[order.status] || order.status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canClose && (
            <Button size="sm" variant="outline" onClick={() => closeMutation.mutate()} disabled={closeMutation.isPending}>
              Cerrar tracking
            </Button>
          )}
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose}>Volver</Button>
          )}
        </div>
      </div>

      <AuditSummary summary={{ ...audit.summary, ping_count: audit.ping_count }} />

      <OrderTimeline events={audit.events || []} />

      {(audit.incidents?.length ?? 0) > 0 && (
        <SurfaceCard className="space-y-2 border-destructive/20 bg-destructive/5">
          <p className="text-sm font-bold text-destructive">Incidencias</p>
          {audit.incidents.map((inc) => (
            <p key={inc.id} className="text-sm text-foreground">
              {inc.description}
              <span className="ml-2 text-xs text-muted-foreground">
                {new Date(inc.created_at).toLocaleString('es-CO')}
              </span>
            </p>
          ))}
        </SurfaceCard>
      )}

      <AuditArtifacts audit={audit} />

      <SurfaceCard className="space-y-3">
        <p className="text-sm font-bold text-foreground">Replay GPS</p>
        <OrderGpsRouteReplay
          orderId={orderId}
          destLat={order.dest_latitude}
          destLng={order.dest_longitude}
          className="h-56 w-full"
        />
        <p className="text-xs text-muted-foreground">{audit.ping_count} pings registrados</p>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <p className="text-sm font-bold text-foreground">Histórico ETA</p>
        <OrderEtaHistoryChart orderId={orderId} />
      </SurfaceCard>

      {audit.push_notifications > 0 && (
        <p className="text-xs text-muted-foreground">
          {audit.push_notifications} notificación(es) push en cola/historial de proximidad.
        </p>
      )}
    </div>
  );
}
