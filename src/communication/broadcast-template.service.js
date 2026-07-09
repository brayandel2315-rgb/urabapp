import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getBroadcastTemplates() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_broadcast_templates')
      .select('id, name, title, body, segment_type, segment_value, event_key, is_active, updated_at')
      .eq('is_active', true)
      .order('name'),
    'plantillas broadcast',
  );
  return data ?? [];
}

export async function saveBroadcastTemplate({
  id, name, title, body, segmentType, segmentValue = {}, eventKey = 'broadcast_segment_sent',
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('upsert_broadcast_template', {
      p_id: id || null,
      p_name: name,
      p_title: title,
      p_body: body || null,
      p_segment_type: segmentType,
      p_segment_value: segmentValue,
      p_event_key: eventKey,
      p_is_active: true,
    }),
    'guardar plantilla broadcast',
  );
}

export async function createBroadcastFromTemplate(templateId, { scheduledAt = null, nameSuffix = null } = {}) {
  if (!isSupabaseConfigured || !templateId) throw new Error('Plantilla requerida');
  return sbFetch(
    supabase.rpc('create_broadcast_from_template', {
      p_template_id: templateId,
      p_scheduled_at: scheduledAt,
      p_name_suffix: nameSuffix,
    }),
    'broadcast desde plantilla',
  );
}

export async function saveCurrentBroadcastAsTemplate(broadcast) {
  const segmentValue = broadcast.segment_value || {};
  return saveBroadcastTemplate({
    name: `${broadcast.name} (plantilla)`,
    title: broadcast.title,
    body: broadcast.body,
    segmentType: broadcast.segment_type,
    segmentValue,
    eventKey: broadcast.event_key || 'broadcast_segment_sent',
  });
}
