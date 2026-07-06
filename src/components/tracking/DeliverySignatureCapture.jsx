import { useRef, useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { uploadDeliverySignature } from '@/services/storage.service';
import { submitDeliverySignature } from '@/services/order-tracking.service';
import { toast } from '@/utils/toast';

export default function DeliverySignatureCapture({ orderId, onUploaded }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const [loading, setLoading] = useState(false);
  const [hasStroke, setHasStroke] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1C8238';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
  }, []);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    const clientX = touch?.clientX ?? event.clientX;
    const clientY = touch?.clientY ?? event.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDraw = (event) => {
    event.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPoint(event);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (event) => {
    if (!drawing.current) return;
    event.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasStroke(true);
  };

  const endDraw = (event) => {
    if (!drawing.current) return;
    event.preventDefault();
    drawing.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
  };

  const save = async () => {
    if (!hasStroke || !orderId) return;
    setLoading(true);
    try {
      const blob = await new Promise((resolve) => canvasRef.current.toBlob(resolve, 'image/png'));
      const file = new File([blob], 'signature.png', { type: 'image/png' });
      const url = await uploadDeliverySignature(orderId, file);
      await submitDeliverySignature(orderId, url);
      toast('Firma guardada');
      onUploaded?.(url);
    } catch (err) {
      toast(err.message || 'No se pudo guardar la firma', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-4">
      <p className="text-sm font-bold text-foreground">Firma del cliente</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Pide al cliente firmar en pantalla como confirmación de recepción.
      </p>
      <canvas
        ref={canvasRef}
        width={640}
        height={200}
        className="mt-3 w-full touch-none rounded-xl border border-border bg-white"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="outline" onClick={clear} disabled={loading}>
          Limpiar
        </Button>
        <Button type="button" size="sm" onClick={save} disabled={loading || !hasStroke}>
          {loading ? 'Guardando…' : 'Guardar firma'}
        </Button>
      </div>
    </div>
  );
}
