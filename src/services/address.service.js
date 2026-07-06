import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { emitCommEvent } from '@/communication';

export async function getUserAddresses(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const data = await sbFetch(
    supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando direcciones',
  );
  return data ?? [];
}

export async function createAddress(userId, {
  municipio,
  barrio,
  address,
  reference,
  label = 'Casa',
  isDefault = false,
  latitude = null,
  longitude = null,
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  if (isDefault) {
    await sbExec(
      supabase.from('addresses').update({ is_default: false }).eq('user_id', userId),
      'Tiempo agotado actualizando direcciones',
    );
  }
  const data = await sbFetch(
    supabase
      .from('addresses')
      .insert({
        user_id: userId,
        municipio,
        barrio: barrio || null,
        address,
        reference: reference || null,
        label,
        is_default: isDefault,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      })
      .select()
      .single(),
    'Tiempo agotado creando dirección',
  );
  emitCommEvent('account_address_added', {
    recipientId: userId,
    actorId: userId,
    payload: { addressId: data?.id, municipio },
  }).catch(() => {});
  return data;
}

export async function deleteAddress(addressId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  await sbExec(
    supabase.from('addresses').delete().eq('id', addressId),
    'Tiempo agotado eliminando dirección',
  );
}

export async function setDefaultAddress(userId, addressId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  await sbExec(
    supabase.from('addresses').update({ is_default: false }).eq('user_id', userId),
    'Tiempo agotado actualizando direcciones',
  );
  const data = await sbFetch(
    supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', userId)
      .select()
      .single(),
    'Tiempo agotado marcando dirección predeterminada',
  );
  return data;
}
