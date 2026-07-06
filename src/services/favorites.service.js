import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbExec } from '@/lib/supabase-query';
import { emitCommEvent } from '@/communication';
import { assertNoError } from '../utils/service-error';

export async function getFavorites(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data, error } = await supabase
    .from('user_favorites')
    .select('*, businesses(id, name, emoji, slug, municipio), products(id, name, price, emoji, business_id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  assertNoError(error);
  return data ?? [];
}

export async function toggleFavoriteBusiness(userId, businessId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('business_id', businessId)
    .maybeSingle();
  if (existing) {
    await supabase.from('user_favorites').delete().eq('id', existing.id);
    emitCommEvent('account_favorite_added', {
      recipientId: userId,
      actorId: userId,
      payload: { businessId, action: 'removed' },
    }).catch(() => {});
    return { favorited: false };
  }
  await sbExec(
    supabase.from('user_favorites').insert({ user_id: userId, business_id: businessId }),
    'Tiempo agotado guardando favorito',
  );
  emitCommEvent('account_favorite_added', {
    recipientId: userId,
    actorId: userId,
    payload: { businessId, action: 'added' },
  }).catch(() => {});
  return { favorited: true };
}

export async function isBusinessFavorited(userId, businessId) {
  if (!isSupabaseConfigured || !userId) return false;
  const { data } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('business_id', businessId)
    .maybeSingle();
  return Boolean(data);
}
