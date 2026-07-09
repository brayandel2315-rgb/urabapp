import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AppIcon from '@/design-system/icons/AppIcon';
import {
  confirmCustomerDelivery,
  getCustomerDeliveryHandoff,
} from '@/services/order.service';
import { toast } from '@/utils/toast';

export default function ClientDeliveryHandoffPanel({ orderId, compact = false }) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['delivery-handoff', orderId],
    queryFn: () => getCustomerDeliveryHandoff(orderId),
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === 'on_the_way' ? 5000 : false;
    },
  });

  const confirmMutation = useMutation({
    mutationFn: () => confirmCustomerDelivery(orderId),
    onSuccess: (result) => {
      setConfirmOpen(false);
      if (!result?.success) {
        toast('No se pudo confirmar la entrega', 'error');
        return;
      }
      toast('¡Pedido recibido! Gracias por usar UrabApp');
      queryClient.invalidateQueries({ queryKey: ['delivery-handoff', orderId] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      refetch();
    },
    onError: (err) => toast(err.message || 'Error al confirmar', 'error'),
  });

  if (!orderId || isLoading) return null;
  if (!data?.success) return null;

  if (data.status === 'delivered') {
    if (compact) return null;
    return (
      <SurfaceCard className="border-[#28B463]/30 bg-[#E8F9EE]/60 p-4 text-center">
        <AppIcon name="check" className="mx-auto text-primary" size="md" />
        <p className="mt-2 font-display font-bold text-foreground">Pedido entregado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {data.order_number ? `Pedido ${data.order_number}` : 'Tu pedido fue recibido correctamente.'}
        </p>
      </SurfaceCard>
    );
  }

  if (data.status !== 'on_the_way') return null;

  return (
    <>
      <SurfaceCard
        className={
          compact
            ? 'space-y-3 border-primary/30 bg-gradient-to-br from-primary/10 via-white to-[#E8F9EE] p-4'
            : 'space-y-4 border-primary/30 bg-gradient-to-br from-primary/10 via-white to-[#E8F9EE] p-5'
        }
      >
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <AppIcon name="mensajeria" size="sm" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
              Entrega en curso
            </p>
            <p className="mt-0.5 font-display text-base font-bold text-foreground">
              {data.order_number ? `Pedido ${data.order_number}` : 'Tu pedido va en camino'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Comparte el código con el mensajero o confirma cuando lo tengas en tus manos.
            </p>
          </div>
        </div>

        {data.otp ? (
          <div className="rounded-2xl border border-primary/25 bg-white/80 p-4 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Tu código de entrega
            </p>
            <p className="mt-2 font-mono text-4xl font-black tracking-[0.35em] text-primary">
              {data.otp}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Díselo al mensajero solo cuando recibas el pedido
            </p>
          </div>
        ) : (
          <p className="rounded-xl bg-muted/50 p-3 text-center text-sm text-muted-foreground">
            Generando código de entrega…
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {data.can_confirm && (
            <Button
              className="flex-1"
              onClick={() => setConfirmOpen(true)}
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending ? 'Confirmando…' : 'Recibí mi pedido'}
            </Button>
          )}
          {!compact && (
            <Button asChild variant="outline" className="flex-1">
              <Link to={`/pedidos/${orderId}`}>Ver seguimiento completo</Link>
            </Button>
          )}
        </div>
      </SurfaceCard>

      <ConfirmModal
        open={confirmOpen}
        title="¿Recibiste tu pedido?"
        message="Confirma solo si ya tienes el pedido en tus manos. Esto cerrará la entrega."
        confirmLabel="Sí, lo recibí"
        variant="primary"
        loading={confirmMutation.isPending}
        onConfirm={() => confirmMutation.mutate()}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
