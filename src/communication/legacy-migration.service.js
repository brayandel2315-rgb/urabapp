import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminLegacyCommMigrationStats() {
  if (!isSupabaseConfigured) {
    return {
      tracking_outbox_pending: 0,
      tracking_outbox_retired: true,
      comm_queue_tracking_push_pending: 0,
      tracking_events_7d: 0,
      legacy_notifications_7d: 0,
      unified_notification_pct: 100,
    };
  }
  return sbFetch(
    supabase.rpc('get_admin_legacy_comm_migration_stats'),
    'métricas migración legacy',
  );
}
