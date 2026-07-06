import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PaymentMethodsPanel from '@/components/payments/PaymentMethodsPanel';
import { useAuthStore } from '@/store/authStore';
import { getPaymentMethods, savePaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } from '@/services/payment-methods.service';
import { isWompiEnabled } from '@/utils/paymentsDisplay';
import { toast } from '@/utils/toast';
import AppIcon from '@/design-system/icons/AppIcon';

export default function AccountPaymentsPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [label, setLabel] = useState('Efectivo al recibir');

  const { data: methods = [] } = useQuery({
    queryKey: ['payment-methods', user?.id],
    queryFn: () => getPaymentMethods(user.id),
    enabled: !!user?.id,
  });

  const addMutation = useMutation({
    mutationFn: () => savePaymentMethod(user.id, { type: 'cash', label, is_default: methods.length === 0 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      toast('Método guardado');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['payment-methods'] }),
  });

  if (!user) return <p className="text-sm text-muted-foreground">Inicia sesión para ver métodos de pago.</p>;

  return (
    <div className="space-y-4">
      <SurfaceCard className="p-5">
        <PaymentMethodsPanel compact />
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Métodos guardados</SectionTitle>
        {methods.length === 0 ? (
          <p className="text-sm text-muted-foreground">Guarda tu preferencia de pago para checkout más rápido.</p>
        ) : (
          <ul className="space-y-2">
            {methods.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-xl border border-border p-3">
                <div className="flex items-center gap-2">
                  <AppIcon name={m.type === 'card' ? 'card' : 'money'} size="sm" />
                  <div>
                    <p className="font-medium">{m.label}</p>
                    {m.last_four && <p className="text-xs text-muted-foreground">•••• {m.last_four}</p>}
                  </div>
                  {m.is_default && <span className="text-xs text-primary">Principal</span>}
                </div>
                <div className="flex gap-1">
                  {!m.is_default && (
                    <Button size="sm" variant="ghost" onClick={() => setDefaultPaymentMethod(user.id, m.id).then(() => queryClient.invalidateQueries({ queryKey: ['payment-methods'] }))}>
                      Principal
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => deleteMutation.mutate(m.id)}>Eliminar</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <Input label="Etiqueta" value={label} onChange={(e) => setLabel(e.target.value)} />
          <Button className="self-end" onClick={() => addMutation.mutate()} loading={addMutation.isPending}>Agregar</Button>
        </div>
        {!isWompiEnabled() && (
          <p className="text-xs text-muted-foreground">Tarjetas y transferencia se habilitarán cuando Wompi esté activo en producción.</p>
        )}
      </SurfaceCard>
    </div>
  );
}
