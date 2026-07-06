import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { assertNoError } from '../utils/service-error';

export async function getPaymentMethods(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('user_payment_methods')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });
  assertNoError(error);
  return data ?? [];
}

export async function savePaymentMethod(userId, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  if (payload.is_default) {
    await supabase.from('user_payment_methods').update({ is_default: false }).eq('user_id', userId);
  }
  const data = await sbFetch(
    supabase
      .from('user_payment_methods')
      .insert({
        user_id: userId,
        type: payload.type || 'cash',
        label: payload.label,
        last_four: payload.last_four || null,
        brand: payload.brand || null,
        is_default: Boolean(payload.is_default),
        metadata: payload.metadata || {},
      })
      .select()
      .single(),
    'Tiempo agotado guardando método de pago',
  );
  return data;
}

export async function deletePaymentMethod(id) {
  if (!isSupabaseConfigured) return;
  await supabase.from('user_payment_methods').delete().eq('id', id);
}

export async function setDefaultPaymentMethod(userId, id) {
  if (!isSupabaseConfigured) return;
  await supabase.from('user_payment_methods').update({ is_default: false }).eq('user_id', userId);
  await supabase.from('user_payment_methods').update({ is_default: true }).eq('id', id);
}
