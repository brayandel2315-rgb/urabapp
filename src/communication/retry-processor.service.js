import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getCommRetryProcessorStats() {
  if (!isSupabaseConfigured) {
    return {
      queue_pending_total: 0,
      queue_tracking_push_pending: 0,
      queue_processing: 0,
      queue_completed_7d: 0,
      queue_failed_7d: 0,
      by_channel: {},
      by_event_key: {},
      unified_processor: 'process-comm-retries',
    };
  }
  return sbFetch(
    supabase.rpc('get_comm_retry_processor_stats'),
    'métricas procesador unificado',
  );
}
