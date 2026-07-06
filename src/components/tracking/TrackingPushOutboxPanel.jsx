import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import {
  getTrackingPushOutboxStats,
  dispatchTrackingPushOutbox,
} from '@/services/order-tracking.service';
import { toast } from '@/utils/toast';

export default function TrackingPushOutboxPanel() {
  const queryClient = useQueryClient();

  const { data: stats = { pending: 0, sent: 0, failed: 0 } } = useQuery({
    queryKey: ['tracking-push-outbox-stats'],
    queryFn: getTrackingPushOutboxStats,
    refetchInterval: 30_000,
  });

  const mutation = useMutation({
    mutationFn: dispatchTrackingPushOutbox,
    onSuccess: (result) => {
      const sent = result?.sent ?? 0;
      const processed = result?.processed ?? 0;
      toast(
        processed > 0
          ? `Push procesados: ${sent} enviados de ${processed}`
          : 'No hay push pendientes en la cola',
        processed > 0 ? 'success' : 'info',
      );
      queryClient.invalidateQueries({ queryKey: ['tracking-push-outbox-stats'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <SurfaceCard className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-foreground">Cola push de proximidad</p>
        <p className="text-xs text-muted-foreground">
          Pendientes: {stats.pending} · Enviados: {stats.sent} · Fallidos: {stats.failed}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || stats.pending === 0}
      >
        {mutation.isPending ? 'Procesando…' : 'Procesar cola'}
      </Button>
    </SurfaceCard>
  );
}
