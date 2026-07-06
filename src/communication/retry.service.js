import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

const RETRYABLE_CHANNELS = new Set(['push', 'email', 'sms', 'whatsapp', 'webhook']);

/** Encola reintento automático para canales fallidos. */
export async function enqueueCommunicationRetry({
  eventKey,
  recipientId,
  channel,
  payload = {},
  eventId = null,
  error = null,
}) {
  if (!isSupabaseConfigured || !recipientId || !RETRYABLE_CHANNELS.has(channel)) {
    return null;
  }
  try {
    return await sbFetch(
      supabase.rpc('enqueue_communication_retry', {
        p_event_key: eventKey,
        p_recipient_id: recipientId,
        p_channel: channel,
        p_payload: payload,
        p_event_id: eventId,
        p_error: error?.slice?.(0, 500) || error || null,
      }),
      'retry enqueue',
    );
  } catch (err) {
    console.warn('[comm-retry]', err.message);
    return null;
  }
}
