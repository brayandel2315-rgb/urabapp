import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getOperationalKpis } from './admin.service';
import { ROLES } from '../utils/constants';

/** Métricas públicas (RLS anon) */
export async function getPublicProjectStatus() {
  if (!isSupabaseConfigured) return null;

  const [businesses, products] = await Promise.all([
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalBusinesses: businesses.count ?? 0,
    totalProducts: products.count ?? 0,
  };
}

/** KPIs completos — solo si el usuario es ADMIN (RLS) */
export async function getProjectStatus(role) {
  const publicStats = await getPublicProjectStatus();

  if (role === ROLES.ADMIN) {
    try {
      const kpis = await getOperationalKpis();
      return { ...publicStats, ...kpis, isFull: true };
    } catch {
      return { ...publicStats, isFull: false };
    }
  }

  return { ...publicStats, isFull: false };
}
