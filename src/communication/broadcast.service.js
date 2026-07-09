import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export const BROADCAST_SEGMENTS = [
  { value: 'all_active', label: 'Todos los usuarios activos' },
  { value: 'role', label: 'Por rol' },
  { value: 'marketing_opt_in', label: 'Marketing opt-in' },
  { value: 'digest_subscribers', label: 'Suscriptores digest diario' },
  { value: 'municipio', label: 'Por municipio' },
];

export const USER_ROLES = ['CLIENT', 'BUSINESS', 'RIDER', 'ADMIN'];

export const MUNICIPIOS = ['Apartadó', 'Turbo', 'Carepa', 'Chigorodó', 'Necoclí'];

export async function getCommunicationBroadcasts() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.rpc('get_broadcast_history', { p_limit: 50 }),
    'historial broadcasts',
  );
  return Array.isArray(data) ? data : [];
}

export async function countBroadcastRecipients(segmentType, segmentValue = {}) {
  if (!isSupabaseConfigured) return 0;
  const count = await sbFetch(
    supabase.rpc('count_broadcast_recipients', {
      p_segment_type: segmentType,
      p_segment_value: segmentValue,
    }),
    'contar segmento',
  );
  return Number(count) || 0;
}

export async function createCommunicationBroadcast({
  name, title, body, segmentType, segmentValue = {}, eventKey = 'broadcast_segment_sent', scheduledAt = null,
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('create_communication_broadcast', {
      p_name: name,
      p_title: title,
      p_body: body || null,
      p_segment_type: segmentType,
      p_segment_value: segmentValue,
      p_event_key: eventKey,
      p_scheduled_at: scheduledAt,
    }),
    'crear broadcast',
  );
}

export async function cancelCommunicationBroadcast(id) {
  if (!isSupabaseConfigured || !id) return;
  await sbFetch(
    supabase.rpc('cancel_communication_broadcast', { p_id: id }),
    'cancelar broadcast',
  );
}

export async function resendCommunicationBroadcast(id) {
  if (!isSupabaseConfigured || !id) throw new Error('ID requerido');
  return sbFetch(
    supabase.rpc('resend_communication_broadcast', { p_id: id }),
    'reenviar broadcast',
  );
}
