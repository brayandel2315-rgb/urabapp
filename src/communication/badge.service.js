import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { getInboxNotifications } from '@/communication/inbox.service';

/** Badge unificado: notificaciones (sin mensajes) + chats pendientes + soporte activo. */
export async function getCommunicationBadgeCount(userId) {
  if (!isSupabaseConfigured || !userId) return 0;

  const [notifications, tickets, chatUnread] = await Promise.all([
    getInboxNotifications(userId, { filter: 'unread', limit: 99 }).catch(() => []),
    sbFetch(
      supabase
        .from('support_tickets')
        .select('id, status')
        .eq('user_id', userId)
        .in('status', ['open', 'in_progress'])
        .limit(20),
      'badge tickets',
    ).catch(() => []),
    sbFetch(
      supabase.rpc('count_unread_order_chat_threads', { p_user_id: userId }),
      'badge chat',
    ).catch(() => 0),
  ]);

  const notifUnread = (notifications || []).filter(
    (n) => !n.is_muted && n.category !== 'messages',
  ).length;
  const supportOpen = (tickets || []).length;
  const chatThreads = Number(chatUnread) || 0;
  return notifUnread + supportOpen + chatThreads;
}

export async function getUnreadNotificationCount(userId) {
  if (!isSupabaseConfigured || !userId) return 0;
  const rows = await getInboxNotifications(userId, { filter: 'unread', limit: 99 }).catch(() => []);
  return (rows || []).filter((n) => !n.is_muted).length;
}
