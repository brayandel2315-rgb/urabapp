/**
 * Push de prueba y re-exports de bandeja.
 * Para nuevos eventos usar emitCommEvent desde @/communication.
 */
import { invokeEdgeFunction } from './edge.service';
import { isSupabaseConfigured } from '../lib/supabase';

export {
  getInboxNotifications as getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/communication/inbox.service';

export async function sendTestPush(userId) {
  if (!isSupabaseConfigured || !userId) {
    throw new Error('Debes iniciar sesión');
  }
  const result = await invokeEdgeFunction('send-push', {
    userId,
    title: 'Urabapp — prueba push',
    body: 'Las notificaciones están funcionando correctamente.',
    data: { url: '/cuenta/notificaciones' },
  });
  if (result?.error) throw new Error(result.error);
  if (result?.sent === 0) {
    throw new Error(result.reason === 'no_subscriptions'
      ? 'Activa push primero con el botón de arriba'
      : 'No se pudo enviar la notificación');
  }
  return result;
}
