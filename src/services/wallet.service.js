import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { ServiceError, assertNoError } from '../utils/service-error';

export async function getWallet(userId) {
  if (!isSupabaseConfigured || !userId) return { balance: 0, points: 0, cashback_pending: 0 };
  try {
    return await sbFetch(
      supabase.rpc('ensure_user_wallet', { p_user_id: userId }),
      'Tiempo agotado cargando billetera',
    );
  } catch {
    const row = await sbFetch(
      supabase.from('user_wallet').select('*').eq('user_id', userId).maybeSingle(),
      'Tiempo agotado cargando billetera',
    );
    return row ?? { balance: 0, points: 0, cashback_pending: 0 };
  }
}

export async function getWalletTransactions(userId, limit = 30) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  assertNoError(error);
  return data ?? [];
}

/** Cupones asignados al usuario (personales) + cupones públicos activos no personales */
export async function getUserCoupons(userId) {
  if (!isSupabaseConfigured || !userId) return [];

  const { data: assignments, error: assignError } = await supabase
    .from('user_coupon_assignments')
    .select('id, assigned_at, redeemed_at, coupons(*)')
    .eq('user_id', userId)
    .is('redeemed_at', null)
    .order('assigned_at', { ascending: false });

  assertNoError(assignError);

  const personal = (assignments ?? [])
    .map((a) => a.coupons)
    .filter((c) => c && c.is_active);

  const { data: publicCoupons, error: publicError } = await supabase
    .from('coupons')
    .select('*')
    .eq('is_active', true)
    .eq('is_personal', false)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(10);

  assertNoError(publicError);

  const seen = new Set();
  return [...personal, ...(publicCoupons ?? [])].filter((c) => {
    if (!c?.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

export async function assignWelcomeCoupon(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    return await sbFetch(
      supabase.rpc('assign_welcome_coupon', { p_user_id: userId }),
      'Tiempo agotado asignando cupón de bienvenida',
    );
  } catch (e) {
    throw new ServiceError(e.message);
  }
}
