import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import { ensureDeliveryQr } from '@/services/order-tracking.service';
import { buildOrderUrl } from '@/utils/app';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

export default function DeliveryQrPanel({ orderId }) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['delivery-qr', orderId],
    queryFn: () => ensureDeliveryQr(orderId),
    enabled: Boolean(orderId),
    staleTime: 60_000,
  });

  const token = data?.token || data?.short_code;

  useEffect(() => {
    if (!token || !orderId) return;
    const payload = JSON.stringify({
      type: 'urabapp_delivery',
      orderId,
      token,
      url: buildOrderUrl(orderId),
    });
    QRCode.toDataURL(payload, { width: 200, margin: 1, color: { dark: '#1C8238' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [token, orderId]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Generando código de entrega…</p>;
  }

  if (!data?.success || !token) return null;

  return (
    <SurfaceCard className="space-y-3 text-center">
      <p className="text-sm font-bold text-foreground">Código de entrega</p>
      <p className="text-xs text-muted-foreground">
        Muéstrale este QR al repartidor o comparte el código de 8 dígitos.
      </p>
      {qrDataUrl && (
        <img src={qrDataUrl} alt="QR de entrega" className="mx-auto h-48 w-48 rounded-xl border border-border bg-white p-2" />
      )}
      <p className="font-mono text-2xl font-black tracking-widest text-primary">{token}</p>
    </SurfaceCard>
  );
}
