import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import { verifyDeliveryQr } from '@/services/order-tracking.service';
import { toast } from '@/utils/toast';

export default function DeliveryQrVerify({ orderId }) {
  const [code, setCode] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => verifyDeliveryQr(orderId, code.trim()),
    onSuccess: (result) => {
      if (!result?.success) {
        toast('Código incorrecto', 'error');
        return;
      }
      toast('Código QR validado');
      queryClient.invalidateQueries({ queryKey: ['order-events', orderId] });
      queryClient.invalidateQueries({ queryKey: ['driver-orders'] });
      setCode('');
    },
    onError: (err) => toast(err.message, 'error'),
  });

  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-bold text-foreground">Validar código del cliente</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Escanea el QR o pide el código de 8 caracteres al cliente.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Código"
          maxLength={8}
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 font-mono text-sm uppercase tracking-widest"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => mutation.mutate()}
          disabled={!code.trim() || mutation.isPending}
        >
          Validar
        </Button>
      </div>
    </div>
  );
}
