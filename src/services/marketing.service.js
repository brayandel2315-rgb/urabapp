import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';

export async function getAllBannersAdmin() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase.from('banners').select('*').order('sort_order'),
    'Tiempo agotado cargando banners',
  );
  return data ?? [];
}

export async function createBanner(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase
      .from('banners')
      .insert({
        title: payload.title,
        subtitle: payload.subtitle || '',
        image_url: payload.image_url || null,
        link: payload.link || null,
        municipio: payload.municipio || null,
        is_active: payload.is_active ?? true,
        sort_order: payload.sort_order ?? 0,
      })
      .select()
      .single(),
    'Tiempo agotado creando banner',
  );
  return data;
}

export async function updateBanner(id, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase
      .from('banners')
      .update(payload)
      .eq('id', id)
      .select()
      .single(),
    'Tiempo agotado actualizando banner',
  );
  return data;
}

export async function deleteBanner(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  await sbExec(
    supabase.from('banners').delete().eq('id', id),
    'Tiempo agotado eliminando banner',
  );
}

export async function getAllCouponsAdmin() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando cupones',
  );
  return data ?? [];
}

export async function createCoupon(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase
      .from('coupons')
      .insert({
        code: payload.code.trim().toUpperCase(),
        description: payload.description || '',
        discount_type: payload.discount_type || 'fixed',
        discount_value: Number(payload.discount_value),
        min_order: Number(payload.min_order) || 0,
        is_active: payload.is_active ?? true,
        expires_at: payload.expires_at || null,
      })
      .select()
      .single(),
    'Tiempo agotado creando cupón',
  );
  return data;
}

export async function updateCoupon(id, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const updates = { ...payload };
  if (updates.code) updates.code = updates.code.trim().toUpperCase();
  const data = await sbFetch(
    supabase
      .from('coupons')
      .update(updates)
      .eq('id', id)
      .select()
      .single(),
    'Tiempo agotado actualizando cupón',
  );
  return data;
}

export async function deleteCoupon(id) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  await sbExec(
    supabase.from('coupons').delete().eq('id', id),
    'Tiempo agotado eliminando cupón',
  );
}

export async function getActiveCoupons() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('coupons')
    .select('code, description, discount_type, discount_value, min_order')
    .eq('is_active', true)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .limit(10);
  if (error) throw error;
  return data ?? [];
}
