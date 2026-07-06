import { supabase, isSupabaseConfigured } from '../lib/supabase';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function isPushSupported() {
  return (
    typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window
    && 'Notification' in window
  );
}

export function getVapidPublicKey() {
  return import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
}

export async function subscribeToPush(userId) {
  if (!isSupabaseConfigured || !userId) throw new Error('Debes iniciar sesión');
  if (!isPushSupported()) throw new Error('Tu navegador no soporta notificaciones push');

  const vapidKey = getVapidPublicKey();
  if (!vapidKey) throw new Error('Push no configurado en el servidor (VITE_VAPID_PUBLIC_KEY)');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permiso de notificaciones denegado');

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });
  }

  const json = subscription.toJSON();
  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      user_id: userId,
      endpoint: json.endpoint,
      keys: json.keys,
      user_agent: navigator.userAgent,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,endpoint' }
  );
  if (error) throw error;

  return subscription;
}

export async function unsubscribeFromPush(userId) {
  if (!isSupabaseConfigured || !userId) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) await subscription.unsubscribe();

  await supabase
    .from('push_subscriptions')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
}

export async function getPushSubscriptionStatus(userId) {
  if (!userId || !isPushSupported()) return { subscribed: false, supported: isPushSupported() };

  const { data } = await supabase
    .from('push_subscriptions')
    .select('id, is_active')
    .eq('user_id', userId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  const registration = await navigator.serviceWorker?.ready?.catch(() => null);
  const browserSub = registration ? await registration.pushManager.getSubscription() : null;

  return {
    supported: true,
    subscribed: Boolean(data?.is_active && browserSub),
    permission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
  };
}
