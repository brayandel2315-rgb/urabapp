import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminFinanceCommSummary() {
  if (!isSupabaseConfigured) {
    return {
      finance_events_7d: 0,
      settlements_7d: 0,
      payout_batches_7d: 0,
      refunds_7d: 0,
      pending_payouts: 0,
      revenue_week: 0,
      by_finance_event: {},
      consent_changes_pending: 0,
      recent_finance_events: [],
    };
  }
  return sbFetch(
    supabase.rpc('get_admin_finance_comm_summary'),
    'Tiempo agotado cargando resumen finance+comm',
  );
}
