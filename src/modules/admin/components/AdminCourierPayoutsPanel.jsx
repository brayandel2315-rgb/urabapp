import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { DataTable } from '@/design-system/patterns/DataTable';
import {
  getCourierPayoutsAdmin,
  processCourierPayout,
} from '@/services/admin.service';
import { formatCOP } from '@/utils/currency';
import { toast } from '@/utils/toast';

const STATUS_LABEL = {
  pending: 'Pendiente',
  processing: 'Procesando',
  paid: 'Pagado',
  failed: 'Fallido',
  cancelled: 'Cancelado',
};

export default function AdminCourierPayoutsPanel() {
  const queryClient = useQueryClient();
  const { data: payouts = [], isLoading } = useQuery({
    queryKey: ['admin-courier-payouts'],
    queryFn: getCourierPayoutsAdmin,
    refetchInterval: 20000,
  });

  const mutation = useMutation({
    mutationFn: ({ id, action, notes }) => processCourierPayout(id, action, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courier-payouts'] });
      toast('Retiro actualizado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const pending = payouts.filter((p) => p.status === 'pending' || p.status === 'processing');

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader /></div>;
  }

  return (
    <div className="space-y-4">
      <SurfaceCard>
        <SectionTitle>Retiros mensajeros</SectionTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          {pending.length} pendiente{pending.length === 1 ? '' : 's'} · {payouts.length} total
        </p>
      </SurfaceCard>

      {pending.length > 0 && (
        <div className="space-y-3">
          {pending.map((p) => (
            <SurfaceCard key={p.id} className="space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-foreground">{formatCOP(p.amount)}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.drivers?.name || p.drivers?.users?.full_name || 'Mensajero'}
                    {' · '}
                    {new Date(p.created_at).toLocaleString('es-CO')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {p.bank_name} · {p.account_type || 'ahorros'} · {p.account_number}
                    {p.account_holder ? ` · ${p.account_holder}` : ''}
                  </p>
                </div>
                <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-bold text-amber-700">
                  {STATUS_LABEL[p.status] || p.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => mutation.mutate({ id: p.id, action: 'paid' })}>
                  Marcar pagado
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => mutation.mutate({ id: p.id, action: 'cancelled', notes: 'Cancelado por admin' })}
                >
                  Cancelar y reembolsar
                </Button>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}

      <SurfaceCard>
        <SectionTitle>Historial</SectionTitle>
        <DataTable
          className="mt-3"
          columns={[
            { key: 'created_at', label: 'Fecha', render: (r) => new Date(r.created_at).toLocaleDateString('es-CO') },
            { key: 'driver', label: 'Mensajero', render: (r) => r.drivers?.name || '—' },
            { key: 'amount', label: 'Monto', render: (r) => formatCOP(r.amount) },
            { key: 'bank', label: 'Banco', render: (r) => r.bank_name || '—' },
            { key: 'status', label: 'Estado', render: (r) => STATUS_LABEL[r.status] || r.status },
          ]}
          rows={payouts}
          emptyDescription="Sin retiros registrados"
        />
      </SurfaceCard>
    </div>
  );
}
