import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { emitCommEvent } from './event-bus';

export async function trackCommunicationEngagement(userId, {
  notificationId = null,
  eventId = null,
  eventKey = null,
  action = 'opened',
  metadata = {},
}) {
  if (!isSupabaseConfigured || !userId) return null;

  const engagementKey = action === 'clicked' ? 'communication_clicked' : 'communication_opened';
  emitCommEvent(engagementKey, {
    recipientId: userId,
    payload: { notificationId, eventId, eventKey, action, ...metadata },
  }).catch(() => {});

  try {
    return await sbFetch(
      supabase.rpc('track_communication_engagement', {
        p_notification_id: notificationId,
        p_event_id: eventId,
        p_event_key: eventKey,
        p_action: action,
        p_metadata: metadata,
      }),
      'Tiempo agotado registrando engagement',
    );
  } catch {
    return null;
  }
}

export async function getEngagementStats(userId, { days = 30 } = {}) {
  if (!isSupabaseConfigured || !userId) {
    return { opened: 0, clicked: 0, delivered: 0 };
  }
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const rows = await sbFetch(
    supabase
      .from('communication_engagement')
      .select('action')
      .eq('user_id', userId)
      .gte('created_at', since)
      .limit(500),
    'engagement stats',
  ).catch(() => []);

  const stats = { opened: 0, clicked: 0, delivered: 0, dismissed: 0 };
  (rows || []).forEach((r) => {
    if (stats[r.action] != null) stats[r.action] += 1;
  });
  const total = stats.opened + stats.clicked;
  const ctr = stats.opened > 0 ? Math.round((stats.clicked / stats.opened) * 100) : 0;
  return { ...stats, ctr };
}
