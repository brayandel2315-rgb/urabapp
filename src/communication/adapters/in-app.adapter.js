import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbExec } from '@/lib/supabase-query';

export async function deliverInApp({
  userId,
  title,
  body,
  type,
  category,
  priority,
  data,
  eventId,
  imageUrl,
}) {
  if (!isSupabaseConfigured || !userId) return null;
  const image = imageUrl || data?.imageUrl || data?.image_url || data?.image || null;
  await sbExec(
    supabase.from('notifications').insert({
      user_id: userId,
      title,
      body,
      type: type || category || 'system',
      category: category || type,
      priority: priority || 'medium',
      event_id: eventId || null,
      data: {
        ...(data || {}),
        ...(image ? { imageUrl: image, image_url: image } : {}),
      },
    }),
    'Tiempo agotado guardando notificación in-app',
  );
  return true;
}
