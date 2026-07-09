import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getCommunicationSlaAlerts(limit = 30) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.rpc('get_communication_sla_alerts', { p_limit: limit }),
    'alertas SLA',
  );
  return Array.isArray(data) ? data : [];
}

export async function acknowledgeSlaAlert(id) {
  if (!isSupabaseConfigured || !id) return;
  await sbFetch(
    supabase.rpc('acknowledge_sla_alert', { p_id: id }),
    'reconocer alerta SLA',
  );
}
