import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminQueueRecoveryStats() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_queue_recovery_stats'),
    'estadísticas recuperación cola',
  );
}

export async function requeueFailedCommunications(limit = 50, eventKey = null) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('requeue_failed_communications', {
      p_limit: limit,
      p_event_key: eventKey || null,
    }),
    'reencolar fallidos',
  );
}

export async function getAdminFailedQueueItems(limit = 20) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.rpc('get_admin_failed_queue_items', { p_limit: limit }),
    'lista fallidos cola',
  );
  return Array.isArray(data) ? data : [];
}

export async function purgeFailedCommunications(days = 30) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('purge_failed_communications', { p_days: days }),
    'purgar fallidos',
  );
}

export async function getAdminQueueArchiveStats() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_queue_archive_stats'),
    'estadísticas archivo cola',
  );
}
