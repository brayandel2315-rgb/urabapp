import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbExec } from '@/lib/supabase-query';

export async function deliverInApp({ userId, title, body, type, category, priority, data, eventId }) {
  if (!isSupabaseConfigured || !userId) return null;
  await sbExec(
    supabase.from('notifications').insert({
      user_id: userId,
      title,
      body,
      type: type || category || 'system',
      category: category || type,
      priority: priority || 'medium',
      event_id: eventId || null,
      data,
    }),
    'Tiempo agotado guardando notificación in-app',
  );
  return true;
}
