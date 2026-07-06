import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { sendTestPush } from '@/services/notification.service';
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  getPushSubscriptionStatus,
  getVapidPublicKey,
} from '@/services/push.service';
import { toast } from '@/utils/toast';

export default function PushNotificationsPanel() {
  const user = useAuthStore((s) => s.user);
  const [pushLoading, setPushLoading] = useState(false);
  const [testPushLoading, setTestPushLoading] = useState(false);

  const { data: pushStatus, refetch: refetchPush } = useQuery({
    queryKey: ['push-status', user?.id],
    queryFn: () => getPushSubscriptionStatus(user.id),
    enabled: !!user?.id,
  });

  if (!user || !isPushSupported()) return null;

  const handlePushToggle = async () => {
    setPushLoading(true);
    try {
      if (pushStatus?.subscribed) {
        await unsubscribeFromPush(user.id);
        toast('Notificaciones push desactivadas');
      } else {
        await subscribeToPush(user.id);
        toast('Notificaciones push activadas');
      }
      refetchPush();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setPushLoading(false);
    }
  };

  return (
    <SurfaceCard className="space-y-3 p-5">
      <SectionTitle>Notificaciones push</SectionTitle>
      <p className="text-sm text-muted-foreground">
        Recibe alertas de pedidos y envíos aunque no tengas la app abierta.
      </p>
      {!getVapidPublicKey() ? (
        <p className="rounded-xl bg-accent/15 p-3 text-xs text-muted-foreground">
          Push pendiente de configuración en el servidor (VITE_VAPID_PUBLIC_KEY).
        </p>
      ) : (
        <Button
          variant={pushStatus?.subscribed ? 'outline' : 'primary'}
          className="w-full"
          disabled={pushLoading}
          onClick={handlePushToggle}
        >
          {pushLoading
            ? 'Procesando…'
            : pushStatus?.subscribed
              ? 'Desactivar notificaciones push'
              : 'Activar notificaciones push'}
        </Button>
      )}
      {getVapidPublicKey() && pushStatus?.subscribed && (
        <Button
          variant="outline"
          className="w-full"
          disabled={testPushLoading}
          onClick={async () => {
            setTestPushLoading(true);
            try {
              await sendTestPush(user.id);
              toast('Notificación de prueba enviada');
            } catch (err) {
              toast(err.message, 'error');
            } finally {
              setTestPushLoading(false);
            }
          }}
        >
          {testPushLoading ? 'Enviando…' : 'Probar notificación'}
        </Button>
      )}
      {pushStatus?.permission === 'denied' && (
        <p className="text-xs text-destructive">
          Permiso bloqueado en el navegador. Habilítalo en ajustes del sitio.
        </p>
      )}
    </SurfaceCard>
  );
}
