import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminQueueThresholds() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.rpc('get_admin_queue_thresholds'),
    'umbrales de cola',
  );
  return Array.isArray(data) ? data : [];
}

export async function upsertQueueThreshold(metricKey, thresholdValue, isActive = true) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('upsert_communication_queue_threshold', {
      p_metric_key: metricKey,
      p_threshold_value: Number(thresholdValue),
      p_is_active: isActive,
    }),
    'guardar umbral de cola',
  );
}

export async function getAdminQueueHealth() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.rpc('get_admin_queue_health'),
    'salud de cola',
  );
  return Array.isArray(data) ? data : [];
}
