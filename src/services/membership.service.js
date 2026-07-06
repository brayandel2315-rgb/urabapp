import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { ServiceError, assertNoError } from '../utils/service-error';
import { invokeEdgeFunction } from './edge.service';
import { isWompiEnabled } from './wompi.service';
import { emitCommEvent } from '@/communication';

export async function getMembershipPlans() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('membership_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  assertNoError(error);
  return data ?? [];
}

export async function getUserSubscription(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*, membership_plans(*)')
    .eq('user_id', userId)
    .maybeSingle();
  assertNoError(error);
  return data;
}

export async function subscribeToPlan(userId, planId) {
  if (!isSupabaseConfigured) throw new ServiceError('Supabase no configurado');

  const { data: plan, error: planError } = await supabase
    .from('membership_plans')
    .select('price_monthly')
    .eq('id', planId)
    .maybeSingle();
  assertNoError(planError);

  if (plan?.price_monthly > 0 && isWompiEnabled()) {
    throw new ServiceError('Usa el pago digital para activar este plan', { code: 'payment_required' });
  }

  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);
  try {
    const result = await sbFetch(
      supabase
        .from('user_subscriptions')
        .upsert(
          {
            user_id: userId,
            plan_id: planId,
            status: 'active',
            started_at: new Date().toISOString(),
            expires_at: expires.toISOString(),
            cancelled_at: null,
          },
          { onConflict: 'user_id' },
        )
        .select('*, membership_plans(*)')
        .single(),
      'Tiempo agotado activando suscripción',
    );
    emitCommEvent('membership_activated', {
      recipientId: userId,
      actorId: userId,
      payload: { planId },
    }).catch(() => {});
    return result;
  } catch (e) {
    throw new ServiceError(e.message);
  }
}

export async function startMembershipCheckout(planId = 'pro') {
  if (!isWompiEnabled()) {
    throw new ServiceError('Pagos digitales no habilitados. Configura Wompi o contacta soporte.');
  }
  const result = await invokeEdgeFunction('create-wompi-membership-checkout', { planId });
  if (!result?.url) throw new ServiceError('No se pudo abrir la pasarela de pago');
  return result;
}

export async function cancelSubscription(userId) {
  if (!isSupabaseConfigured) throw new ServiceError('Supabase no configurado');
  try {
    const result = await sbFetch(
      supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single(),
      'Tiempo agotado cancelando suscripción',
    );
    emitCommEvent('membership_cancelled', {
      recipientId: userId,
      actorId: userId,
    }).catch(() => {});
    return result;
  } catch (e) {
    throw new ServiceError(e.message);
  }
}

export function isProActive(subscription) {
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  if (!subscription.expires_at) return subscription.plan_id === 'pro';
  return new Date(subscription.expires_at) > new Date();
}
