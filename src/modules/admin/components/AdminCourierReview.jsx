import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { getCouriersPendingReview, adminReviewCourier } from '@/services/courier-panel.service';
import { toast } from '@/utils/toast';
import { COURIER_VERIFICATION_STATUS } from '@/modules/rider/constants';

export default function AdminCourierReview() {
  const queryClient = useQueryClient();

  const { data: pending = [], isLoading } = useQuery({
    queryKey: ['admin-courier-review'],
    queryFn: getCouriersPendingReview,
    refetchInterval: 60000,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ driverId, action, notes }) => adminReviewCourier(driverId, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courier-review'] });
      queryClient.invalidateQueries({ queryKey: ['admin-all-drivers'] });
      toast('Revisión actualizada');
    },
    onError: (e) => toast(e.message, 'error'),
  });

  if (isLoading) return <p className="text-sm text-muted">Cargando solicitudes…</p>;

  if (pending.length === 0) {
    return (
      <SurfaceCard className="text-center text-sm text-muted">
        No hay mensajeros pendientes de revisión documental.
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-3">
      <SectionTitle>Revisión documental mensajeros</SectionTitle>
      {pending.map((d) => {
        const status = COURIER_VERIFICATION_STATUS[d.verification_status] || COURIER_VERIFICATION_STATUS.pending;
        const docs = d.courier_documents || [];
        return (
          <SurfaceCard key={d.id} className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-bold text-foreground">{d.name}</p>
                <p className="text-xs text-muted">{d.phone} · {d.municipio} · {d.vehicle}</p>
                <p className="text-xs font-semibold text-primary">{status.label}</p>
                {d.document_number && (
                  <p className="text-xs text-muted">{d.document_type} {d.document_number}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => reviewMutation.mutate({ driverId: d.id, action: 'approve' })}
                  disabled={reviewMutation.isPending}
                >
                  Aprobar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const notes = window.prompt('Notas de corrección para el mensajero:');
                    if (notes) reviewMutation.mutate({ driverId: d.id, action: 'corrections', notes });
                  }}
                >
                  Correcciones
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    const notes = window.prompt('Motivo de rechazo:');
                    if (notes) reviewMutation.mutate({ driverId: d.id, action: 'reject', notes });
                  }}
                >
                  Rechazar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reviewMutation.mutate({ driverId: d.id, action: 'suspend' })}
                >
                  Suspender
                </Button>
              </div>
            </div>
            {docs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {docs.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-border/50 px-2 py-1 text-xs font-medium text-primary hover:underline"
                  >
                    {doc.doc_type}
                  </a>
                ))}
              </div>
            )}
          </SurfaceCard>
        );
      })}
    </div>
  );
}
