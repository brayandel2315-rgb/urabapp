import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapApiError } from '../utils/errors';
import { sbFetch } from '@/lib/supabase-query';
import { normalizeDocumentNumber, isValidColombianDocument } from '../utils/validate';
import { calculateBusinessPromoDiscount } from '../utils/promo';
import { isProActive } from './membership.service';
import { PRO_DELIVERY_DISCOUNT_PCT } from '../utils/constants';

export async function saveUserDocument(userId, documentNumber) {
  if (!isSupabaseConfigured || !userId) {
    throw new Error('Debes iniciar sesión para registrar tu cédula');
  }
  const normalized = normalizeDocumentNumber(documentNumber);
  if (!isValidColombianDocument(normalized)) {
    throw new Error('Ingresa una cédula válida (6 a 10 dígitos)');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('document_number, welcome_delivery_used_at')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.welcome_delivery_used_at) {
    throw new Error('Ya usaste tu entrega gratis de bienvenida');
  }
  if (profile?.document_number && profile.document_number !== normalized) {
    throw new Error('Tu cédula ya está registrada y no se puede cambiar');
  }

  const { data, error } = await supabase
    .from('users')
    .update({
      document_number: normalized,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Esta cédula ya está registrada en otra cuenta');
    }
    throw new Error(mapApiError(error));
  }
  return data;
}

export function resolveCheckoutPromos({
  business,
  profile,
  subscription,
  subtotal,
  deliveryFee,
  minWelcomeOrder,
  couponDiscount = 0,
  tipAmount = 0,
}) {
  const businessDiscount = business ? calculateBusinessPromoDiscount(business, subtotal) : 0;
  const welcomeEligible = profile?.document_number
    && !profile.welcome_delivery_used_at
    && subtotal >= minWelcomeOrder;
  const welcomeDeliveryApplied = welcomeEligible;
  const proActive = isProActive(subscription);
  const proDeliveryDiscount = proActive && !welcomeDeliveryApplied
    ? Math.round(deliveryFee * (PRO_DELIVERY_DISCOUNT_PCT / 100))
    : 0;
  const customerDeliveryFee = welcomeDeliveryApplied
    ? 0
    : Math.max(0, deliveryFee - proDeliveryDiscount);
  const deliverySubsidy = welcomeDeliveryApplied ? deliveryFee : proDeliveryDiscount;
  const discount = businessDiscount + Math.max(0, couponDiscount);
  const tip = Math.max(0, Number(tipAmount) || 0);
  const total = Math.max(0, subtotal + customerDeliveryFee - discount + tip);

  return {
    businessDiscount,
    couponDiscount: Math.max(0, couponDiscount),
    discount,
    welcomeDeliveryApplied,
    proActive,
    proDeliveryDiscount,
    customerDeliveryFee,
    deliverySubsidy,
    tipAmount: tip,
    total,
  };
}

export async function markWelcomeDeliveryUsed(userId, orderId = null) {
  if (!isSupabaseConfigured || !userId) return;

  if (!orderId) {
    console.warn('[promo] markWelcomeDeliveryUsed requiere orderId');
    return;
  }

  const data = await sbFetch(
    supabase.rpc('mark_welcome_delivery_used', {
      p_order_id: orderId,
    }),
    'Tiempo agotado marcando entrega de bienvenida',
  );
  if (!data?.success) {
    console.warn('[promo] welcome delivery no aplicada:', data?.error);
  }
}

export async function getActiveBusinessPromos({ municipio, limit = 8 } = {}) {
  if (!isSupabaseConfigured) return [];

  let query = supabase
    .from('businesses')
    .select('id, slug, name, emoji, municipio, promo_discount_type, promo_discount_value, promo_min_order, promo_is_active')
    .eq('is_active', true)
    .eq('promo_is_active', true)
    .not('promo_discount_type', 'is', null)
    .not('promo_discount_value', 'is', null)
    .order('rating', { ascending: false })
    .limit(limit);

  if (municipio) query = query.eq('municipio', municipio);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
