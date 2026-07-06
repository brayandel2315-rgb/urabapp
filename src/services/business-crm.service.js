import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getBusinessCustomers(businessId, { segment = null } = {}) {
  if (!isSupabaseConfigured || !businessId) return [];
  const data = await sbFetch(
    supabase.rpc('get_business_customers', {
      p_business_id: businessId,
      p_segment: segment,
    }),
    'Tiempo agotado cargando clientes del comercio',
  );
  return data ?? [];
}

export async function getBusinessCrmSummary(businessId) {
  if (!isSupabaseConfigured || !businessId) {
    return {
      total_customers: 0,
      new_customers: 0,
      recurring_customers: 0,
      loyal_customers: 0,
      at_risk_customers: 0,
      repeat_rate: 0,
      total_ltv: 0,
    };
  }
  const data = await sbFetch(
    supabase.rpc('get_business_crm_summary', {
      p_business_id: businessId,
    }),
    'Tiempo agotado cargando resumen CRM',
  );
  return data ?? {};
}
