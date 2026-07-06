import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

const RATE_LIMITED_CHANNELS = new Set(['push', 'email', 'sms', 'whatsapp']);

export async function isChannelRateLimited(recipientId, channel) {
  if (!isSupabaseConfigured || !recipientId || !RATE_LIMITED_CHANNELS.has(channel)) {
    return false;
  }
  const allowed = await sbFetch(
    supabase.rpc('check_communication_rate_limit', {
      p_recipient_id: recipientId,
      p_channel: channel,
    }),
    'rate limit',
  ).catch(() => true);
  return allowed === false;
}

export async function logCommunicationDelivery({
  eventKey,
  recipientId,
  channel,
  status,
  eventId = null,
  variantKey = null,
  error = null,
  latencyMs = null,
}) {
  if (!isSupabaseConfigured || !recipientId || !channel) return null;
  try {
    return await sbFetch(
      supabase.rpc('log_communication_delivery', {
        p_event_key: eventKey,
        p_recipient_id: recipientId,
        p_channel: channel,
        p_status: status,
        p_event_id: eventId,
        p_variant_key: variantKey,
        p_error: error?.slice?.(0, 500) || error || null,
        p_latency_ms: latencyMs,
      }),
      'delivery log',
    );
  } catch (err) {
    console.warn('[comm-delivery-log]', err.message);
    return null;
  }
}

export async function getAdminDeliveryMetrics() {
  if (!isSupabaseConfigured) {
    return { by_channel: {}, ab_variants: [], delivery_rate: 0 };
  }
  return sbFetch(
    supabase.rpc('get_admin_delivery_metrics'),
    'delivery metrics',
  );
}
