import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { emitCommEvent } from '@/communication';
import { sbFetch } from '@/lib/supabase-query';

export async function validateCoupon(code, subtotal, userId = null) {
  if (!isSupabaseConfigured || !code?.trim()) {
    throw new Error('Cupón inválido');
  }
  const normalized = code.trim().toUpperCase();
  const data = await sbFetch(
    supabase
      .from('coupons')
      .select('*')
      .eq('code', normalized)
      .eq('is_active', true)
      .maybeSingle(),
    'Tiempo agotado validando cupón',
  );
  if (!data) throw new Error('Cupón no encontrado o inactivo');
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    throw new Error('Cupón expirado');
  }
  if (data.min_order && subtotal < data.min_order) {
    throw new Error(`Pedido mínimo para este cupón: $${data.min_order.toLocaleString('es-CO')}`);
  }
  if (data.max_uses != null && (data.uses_count ?? 0) >= data.max_uses) {
    throw new Error('Este cupón ya alcanzó el límite de usos');
  }

  if (data.is_personal && userId) {
    const assignment = await sbFetch(
      supabase
        .from('user_coupon_assignments')
        .select('id, redeemed_at')
        .eq('user_id', userId)
        .eq('coupon_id', data.id)
        .maybeSingle(),
      'Tiempo agotado verificando cupón personal',
    );
    if (!assignment || assignment.redeemed_at) {
      throw new Error('Este cupón no está asignado a tu cuenta');
    }
  } else if (data.is_personal && !userId) {
    throw new Error('Inicia sesión para usar este cupón personal');
  }

  const discount = data.discount_type === 'percent'
    ? Math.round(subtotal * (data.discount_value / 100))
    : data.discount_value;
  return { discount, coupon: data };
}

export async function redeemCoupon(code, userId = null, orderId = null) {
  if (!isSupabaseConfigured || !code?.trim()) return;
  const normalized = code.trim().toUpperCase();

  if (userId) {
    const { data, error } = await supabase.rpc('redeem_user_coupon', {
      p_user_id: userId,
      p_coupon_code: normalized,
      p_order_id: orderId,
    });
    if (!error && data?.success) {
      emitCommEvent('promo_applied', {
        recipientId: userId,
        actorId: userId,
        payload: { code: normalized, orderId },
      }).catch(() => {});
      return;
    }
  }

  const { data: coupon } = await supabase
    .from('coupons')
    .select('id, uses_count, max_uses, is_personal')
    .eq('code', normalized)
    .maybeSingle();
  if (!coupon || coupon.is_personal) return;
  if (coupon.max_uses != null && (coupon.uses_count ?? 0) >= coupon.max_uses) return;

  await supabase
    .from('coupons')
    .update({ uses_count: (coupon.uses_count ?? 0) + 1 })
    .eq('id', coupon.id);
}
