import { useState } from 'react';
import Button from '@/components/ui/Button';
import { uploadDeliveryProof } from '@/services/storage.service';
import { submitDeliveryProof } from '@/services/order-tracking.service';
import { toast } from '@/utils/toast';

export default function DeliveryProofCapture({ orderId, onUploaded }) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !orderId) return;
    setLoading(true);
    try {
      const url = await uploadDeliveryProof(orderId, file);
      await submitDeliveryProof(orderId, url);
      toast('Foto de entrega guardada');
      onUploaded?.(url);
    } catch (err) {
      toast(err.message || 'No se pudo subir la foto', 'error');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-bold text-foreground">Evidencia de entrega</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Opcional: foto del paquete entregado para auditoría.
      </p>
      <label className="mt-3 flex cursor-pointer items-center justify-center rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={loading}
          onChange={handleFile}
        />
        {loading ? 'Subiendo…' : 'Tomar o subir foto'}
      </label>
    </div>
  );
}
