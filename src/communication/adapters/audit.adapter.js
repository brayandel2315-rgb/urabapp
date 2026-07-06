import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const auditBuffer = [];

export async function deliverAudit({ key, actorId, recipientId, payload, meta }) {
  const entry = {
    event_key: key,
    actor_id: actorId,
    recipient_id: recipientId,
    payload,
    meta,
    at: new Date().toISOString(),
  };
  auditBuffer.push(entry);
  if (auditBuffer.length > 200) auditBuffer.shift();

  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('analytics_events').insert({
      event_name: `audit_${key}`,
      user_id: recipientId || actorId,
      properties: entry,
    });
  } catch {
    /* no bloquear */
  }
}

export function getAuditBuffer() {
  return [...auditBuffer];
}
