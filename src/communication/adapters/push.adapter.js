import { invokeEdgeFunction } from '@/services/edge.service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useSettingsStore } from '@/store/settingsStore';
import { resolveNotifImage } from '@/communication/notification-visuals';

export async function deliverPush({
  userId,
  title,
  body,
  data,
  priority,
  imageUrl,
}) {
  if (!isSupabaseConfigured || !userId) return false;
  const localPush = useSettingsStore.getState().notifications?.push;
  if (localPush === false) return false;
  if (priority === 'silent') return false;

  const image = imageUrl || resolveNotifImage(data) || null;
  const orderId = data?.orderId || data?.order_id;
  const tag = orderId
    ? `order-${orderId}`
    : (data?.event_key || data?.tag || 'urabapp');

  try {
    await invokeEdgeFunction('send-push', {
      userId,
      title,
      body,
      image,
      icon: image || '/app-icon.png',
      tag,
      data: {
        ...(data || {}),
        image,
        url: data?.url || data?.deep_link || data?.deepLink,
      },
    });
    return true;
  } catch (err) {
    console.warn('[comm-push]', err.message);
    return false;
  }
}
