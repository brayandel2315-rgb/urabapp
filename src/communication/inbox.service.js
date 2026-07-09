import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';

const DATE_SINCE = {
  '24h': () => new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  '7d': () => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  '30d': () => new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export function resolveInboxSince(dateRange) {
  if (!dateRange || dateRange === 'all') return null;
  const fn = DATE_SINCE[dateRange];
  return fn ? fn() : null;
}

/** Bandeja unificada vía RPC (filtros avanzados server-side). */
export async function getUnifiedInbox(userId, {
  limit = 50,
  category = 'all',
  priority = 'all',
  filter = 'all',
  search = '',
  dateRange = 'all',
  sort = 'newest',
} = {}) {
  if (!isSupabaseConfigured || !userId) return [];
  const data = await sbFetch(
    supabase.rpc('get_unified_inbox', {
      p_category: category === 'all' ? null : category,
      p_priority: priority === 'all' ? null : priority,
      p_filter: filter,
      p_search: search.trim() || null,
      p_since: resolveInboxSince(dateRange),
      p_sort: sort,
      p_limit: limit,
    }),
    'Tiempo agotado cargando bandeja unificada',
  );
  return data ?? [];
}

export async function getInboxNotifications(userId, opts = {}) {
  return getUnifiedInbox(userId, opts);
}

export async function updateNotificationMeta(notificationId, patch) {
  if (!isSupabaseConfigured || !notificationId) return;
  await sbExec(
    supabase.from('notifications').update(patch).eq('id', notificationId),
    'Tiempo agotado actualizando notificación',
  );
}

export async function archiveNotification(id) {
  return updateNotificationMeta(id, { is_archived: true });
}

export async function toggleFavoriteNotification(id, value) {
  return updateNotificationMeta(id, { is_favorite: value });
}

export async function toggleMuteNotification(id, value) {
  return updateNotificationMeta(id, { is_muted: value });
}

export async function markNotificationRead(notificationId) {
  return updateNotificationMeta(notificationId, { is_read: true });
}

export async function markAllNotificationsRead(userId) {
  if (!isSupabaseConfigured || !userId) return;
  await sbExec(
    supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false),
    'Tiempo agotado marcando todas',
  );
}

import { normalizeAppPath, resolveOrderPath, resolveShipmentPath } from '@/utils/navigation';

export function notificationDeepLink(n) {
  const raw = n.data?.url || n.data?.deep_link || n.data?.deepLink;
  const normalized = normalizeAppPath(raw);
  if (normalized) return normalized;
  if (n.data?.shipment_id || n.data?.shipmentId) {
    return resolveShipmentPath(n.data);
  }
  if (n.data?.order_id || n.data?.orderId) {
    return resolveOrderPath(n.data);
  }
  if (n.type === 'support' || n.category === 'support') return '/soporte';
  if (n.type === 'shipment') return '/envios';
  return '/cuenta/notificaciones';
}
