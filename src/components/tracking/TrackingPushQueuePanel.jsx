import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import {
  getTrackingPushQueueStats,
  dispatchTrackingPushQueue,
} from '@/services/order-tracking.service';
import { toast } from '@/utils/toast';

export default function TrackingPushQueuePanel() {
  const queryClient = useQueryClient();

  const { data: stats = {
    queue_pending: 0,
    queue_processing: 0,
    queue_completed_7d: 0,
    queue_failed_7d: 0,
    archive_rows: 0,
    outbox_retired: true,
  } } = useQuery({
    queryKey: ['tracking-push-queue-stats'],
    queryFn: getTrackingPushQueueStats,
    refetchInterval: 30_000,
  });

  const mutation = useMutation({
    mutationFn: dispatchTrackingPushQueue,
    onSuccess: (result) => {
      const completed = result?.completed ?? 0;
      const processed = result?.processed ?? 0;
      const tracking = result?.tracking;
      const trackingNote = tracking?.processed
        ? ` (${tracking.completed ?? 0} tracking)`
        : '';
      toast(
        processed > 0
          ? `Cola: ${completed} enviados de ${processed}${trackingNote}`
          : 'No hay push pendientes en la cola',
        processed > 0 ? 'success' : 'info',
      );
      queryClient.invalidateQueries({ queryKey: ['tracking-push-queue-stats'] });
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const pending = stats.queue_pending ?? 0;

  return (
    <SurfaceCard className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-foreground">Cola push de tracking</p>
        <p className="text-xs text-muted-foreground">
          Pendientes: {pending} · Procesando: {stats.queue_processing ?? 0}
          {' · '}Enviados 7d: {stats.queue_completed_7d ?? 0}
          {' · '}Fallidos 7d: {stats.queue_failed_7d ?? 0}
          {stats.archive_rows > 0 ? ` · Archivo legacy: ${stats.archive_rows}` : ''}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || pending === 0}
      >
        {mutation.isPending ? 'Procesando…' : 'Procesar cola'}
      </Button>
    </SurfaceCard>
  );
}
