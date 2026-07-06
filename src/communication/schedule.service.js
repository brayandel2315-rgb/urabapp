import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getCommunicationRateLimits() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.rpc('get_communication_rate_limits'),
    'rate limits',
  );
  return data ?? [];
}

export async function saveCommunicationRateLimit({ channel, maxPerHour, isActive = true }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  await sbFetch(
    supabase.rpc('upsert_communication_rate_limit', {
      p_channel: channel,
      p_max_per_hour: maxPerHour,
      p_is_active: isActive,
    }),
    'guardar rate limit',
  );
}

export async function getScheduledCommunications() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_scheduled')
      .select('id, event_key, recipient_id, title, body, scheduled_at, status, sent_at, created_at')
      .order('scheduled_at', { ascending: false })
      .limit(50),
    'scheduled comms',
  );
  return data ?? [];
}

export async function scheduleCommunication({
  recipientId, title, body, scheduledAt, eventKey = 'system_announcement', category = 'system',
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('schedule_communication', {
      p_recipient_id: recipientId,
      p_title: title,
      p_body: body || null,
      p_scheduled_at: scheduledAt,
      p_event_key: eventKey,
      p_category: category,
    }),
    'programar comunicación',
  );
}

export async function cancelScheduledCommunication(id) {
  if (!isSupabaseConfigured || !id) return;
  await sbFetch(
    supabase.rpc('cancel_scheduled_communication', { p_id: id }),
    'cancelar programada',
  );
}

export function rowsToCsv(rows, columns) {
  const escape = (v) => {
    const s = v == null ? '' : String(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((c) => escape(row[c])).join(','));
  return [header, ...lines].join('\n');
}

export async function downloadDeliveryMetricsCsv(days = 7) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const rows = await sbFetch(
    supabase.rpc('get_admin_delivery_export', { p_days: days }),
    'export delivery',
  );
  const list = Array.isArray(rows) ? rows : [];
  const columns = ['created_at', 'event_key', 'channel', 'status', 'variant_key', 'latency_ms', 'recipient_id', 'error'];
  const csv = rowsToCsv(list, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urabapp-entregas-${days}d.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
