import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

const GUEST_USER_KEY = 'urabapp_guest_user_id';

export function rememberGuestUserId(userId) {
  if (!userId) return;
  try {
    sessionStorage.setItem(GUEST_USER_KEY, userId);
  } catch {
    /* ignore */
  }
}

export function consumeGuestUserId() {
  try {
    const id = sessionStorage.getItem(GUEST_USER_KEY);
    sessionStorage.removeItem(GUEST_USER_KEY);
    return id || null;
  } catch {
    return null;
  }
}

export function peekGuestUserId() {
  try {
    return sessionStorage.getItem(GUEST_USER_KEY);
  } catch {
    return null;
  }
}

/**
 * Vincula pedidos/envíos de invitado u otra cuenta con el mismo celular.
 * @returns {{ orders: number, shipments: number, addresses: number } | null}
 */
export async function mergeCustomerActivity({ phone, guestUserId } = {}) {
  if (!isSupabaseConfigured) return null;

  const guestId = guestUserId || consumeGuestUserId();
  if (!guestId) return null;

  const data = await sbFetch(
    supabase.rpc('merge_customer_activity', {
      p_phone: phone?.trim() || null,
      p_guest_user_id: guestId,
    }),
    'Tiempo agotado vinculando actividad de invitado',
  );

  if (!data?.success) {
    if (data?.reason === 'phone_mismatch') {
      throw new Error('phone_mismatch');
    }
    return null;
  }

  return {
    orders: Number(data.orders) || 0,
    shipments: Number(data.shipments) || 0,
    addresses: Number(data.addresses) || 0,
    total: (Number(data.orders) || 0) + (Number(data.shipments) || 0),
  };
}

export async function mergeGuestActivityByVerifiedPhone() {
  if (!isSupabaseConfigured) return null;

  const data = await sbFetch(
    supabase.rpc('merge_guest_activity_by_verified_phone'),
    'Tiempo agotado vinculando actividad por teléfono',
  );

  if (!data?.success) {
    if (data?.reason === 'phone_not_verified') {
      throw new Error('phone_not_verified');
    }
    return null;
  }

  return {
    orders: Number(data.orders) || 0,
    shipments: Number(data.shipments) || 0,
    addresses: Number(data.addresses) || 0,
    total: (Number(data.orders) || 0) + (Number(data.shipments) || 0),
  };
}
