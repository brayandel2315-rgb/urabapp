import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { verifyDeliveryOtp } from '@/services/courier.service';
import { toast } from '@/utils/toast';

export default function DeliveryOtpPanel({ orderId, driverId, onVerified, readOnlyCode }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (readOnlyCode) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Código de entrega</p>
        <p className="mt-2 font-mono text-4xl font-black tracking-[0.35em] text-primary">{readOnlyCode}</p>
        <p className="mt-2 text-xs text-muted-foreground">Compártelo solo cuando recibas tu pedido</p>
      </div>
    );
  }

  const handleVerify = async () => {
    if (code.length !== 4) {
      toast('Ingresa el código de 4 dígitos', 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyDeliveryOtp(orderId, code, driverId);
      if (!result?.success) {
        toast('Código incorrecto', 'error');
        return;
      }
      toast('¡Entrega confirmada!');
      onVerified?.();
    } catch (err) {
      toast(err.message || 'Error al verificar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-sm font-bold text-foreground">Confirmar entrega</p>
      <p className="mt-1 text-xs text-muted-foreground">Pide al cliente su código de 4 dígitos</p>
      <Input
        className="mt-3 text-center font-mono text-2xl tracking-widest"
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
        placeholder="0000"
        inputMode="numeric"
        maxLength={4}
      />
      <Button className="mt-3 w-full" disabled={loading} onClick={handleVerify}>
        {loading ? 'Verificando...' : 'Confirmar entrega'}
      </Button>
    </div>
  );
}
