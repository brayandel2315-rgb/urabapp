import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminConsentAudit() {
  if (!isSupabaseConfigured) {
    return {
      total_users: 0,
      with_preferences: 0,
      marketing_opt_in: 0,
      digest_subscribers: 0,
      channel_totals: {},
      by_category: {},
    };
  }
  return sbFetch(
    supabase.rpc('get_admin_consent_audit'),
    'Tiempo agotado cargando auditoría de consentimiento',
  );
}

export async function getAdminRetryQueueStats() {
  if (!isSupabaseConfigured) {
    return { pending_total: 0, by_priority: {}, recent: [] };
  }
  return sbFetch(
    supabase.rpc('get_admin_retry_queue_stats'),
    'Tiempo agotado cargando cola de reintentos',
  );
}
