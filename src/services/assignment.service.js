import { invokeEdgeFunction } from './edge.service';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { emitCommEvent } from '@/communication';
import { DELIVERY_SEARCH_RADII } from '../utils/courier-constants';

/** Motor de asignación — Edge Function + RPC assign_best_rider (fallback admin) */
export async function requestAutoAssignRider(orderId) {
  if (!orderId) return { assigned: false, reason: 'missing_order_id' };
  try {
    const result = await invokeEdgeFunction('auto-assign-rider', { orderId });
    if (!result?.riderId && !result?.assigned) {
      console.warn('[assignment] sin mensajero disponible para pedido', orderId, result?.reason || result?.error);
    }
    return result ?? { assigned: false };
  } catch (err) {
    console.warn('[assignment] auto-assign falló:', err?.message || err);
    return { assigned: false, riderId: null, error: err?.message || 'assign_failed' };
  }
}

export async function assignBestRider(orderId) {
  return requestAutoAssignRider(orderId);
}

/** Publica ofertas a mensajeros cercanos — el que acepta recoge y entrega */
export async function publishDeliveryOffers(orderId, radiusKm = 5) {
  if (!isSupabaseConfigured || !orderId) return 0;
  const data = await sbFetch(
    supabase.rpc('publish_courier_offers', {
      p_order_id: orderId,
      p_radius_km: radiusKm,
    }),
    'Tiempo agotado publicando ofertas de entrega',
  );
  return Number(data) || 0;
}

async function notifyDriversWithPendingOffers(orderId) {
  const { data: offers } = await supabase
    .from('courier_offers')
    .select('driver_id, drivers(user_id), orders(order_number)')
    .eq('order_id', orderId)
    .eq('status', 'pending');

  const orderNumber = offers?.[0]?.orders?.order_number;

  for (const offer of offers ?? []) {
    const userId = offer.drivers?.user_id;
    if (userId) {
      emitCommEvent('rider_new_offer', {
        recipientId: userId,
        payload: { orderId, orderNumber },
      }).catch(() => {});
    }
  }
}

/** Republica ofertas vencidas para pedidos sin mensajero en el municipio */
export async function refreshOpenOrderOffers(municipio) {
  if (!isSupabaseConfigured || !municipio) return 0;
  const { data, error } = await supabase.rpc('refresh_open_order_offers', {
    p_municipio: municipio,
  });
  if (error) {
    console.warn('[assignment] refresh ofertas:', error.message);
    return 0;
  }
  return Number(data) || 0;
}

/** Expansión progresiva de radio hasta encontrar mensajeros (estilo Rappi/Uber) */
export async function publishDeliveryOffersWithExpansion(orderId, radii = DELIVERY_SEARCH_RADII) {
  if (!isSupabaseConfigured || !orderId) return 0;

  for (const radius of radii) {
    const count = await publishDeliveryOffers(orderId, radius);
    if (count > 0) {
      await notifyDriversWithPendingOffers(orderId);
      return count;
    }
    await new Promise((r) => setTimeout(r, 6000));
  }
  return 0;
}

export function scheduleDeliveryDispatch(order, { immediate = false } = {}) {
  if (!order?.id || !isSupabaseConfigured) return;

  const run = () => publishDeliveryOffersWithExpansion(order.id).catch((err) => {
    console.warn('[assignment] dispatch ofertas falló:', err?.message || err);
  });

  if (immediate) {
    run();
    return;
  }

  setTimeout(run, 0);
}
