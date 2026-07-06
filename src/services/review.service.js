import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch, sbQuery } from '@/lib/supabase-query';
import { mapApiError } from '../utils/errors';
import { emitCommEvent } from '@/communication';

export async function getReviewForOrder(orderId) {
  if (!isSupabaseConfigured || !orderId) return null;
  const data = await sbFetch(
    supabase
      .from('reviews')
      .select('*')
      .eq('order_id', orderId)
      .maybeSingle(),
    'Tiempo agotado cargando reseña del pedido',
  );
  return data;
}

export async function getBusinessReviews(businessId, { limit = 3 } = {}) {
  if (!isSupabaseConfigured || !businessId) return [];
  const data = await sbFetch(
    supabase
      .from('reviews')
      .select('*, users(full_name)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(limit),
    'Tiempo agotado cargando reseñas',
  );
  return data ?? [];
}

export async function getBusinessRatingSummary(businessId) {
  if (!isSupabaseConfigured || !businessId) return { average: 0, count: 0 };
  const data = await sbFetch(
    supabase
      .from('reviews')
      .select('business_rating')
      .eq('business_id', businessId)
      .not('business_rating', 'is', null),
    'Tiempo agotado cargando calificaciones',
  );
  const ratings = (data ?? []).map((r) => r.business_rating).filter(Boolean);
  if (!ratings.length) return { average: 0, count: 0 };
  const average = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
  return { average, count: ratings.length };
}

export async function createReview({
  orderId,
  userId,
  businessId,
  driverId,
  businessRating,
  driverRating,
  comment,
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  if (!businessRating || businessRating < 1 || businessRating > 5) {
    throw new Error('Califica la tienda de 1 a 5 estrellas');
  }

  const data = await sbFetch(
    supabase
      .from('reviews')
      .insert({
        order_id: orderId,
        user_id: userId,
        business_id: businessId || null,
        driver_id: driverId || null,
        business_rating: businessRating,
        driver_rating: driverRating || null,
        comment: comment?.trim() || null,
      })
      .select()
      .single(),
    'Tiempo agotado guardando reseña',
  );

  emitCommEvent('review_submitted', {
    recipientId: userId,
    payload: {
      orderId,
      businessId,
      driverId,
      businessRating,
      driverRating,
    },
  }).catch(() => {});

  return data;
}

export async function getReviewStats() {
  if (!isSupabaseConfigured) return { total: 0 };
  const { count, error } = await sbQuery(
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    'Tiempo agotado cargando estadísticas de reseñas',
  );
  if (error) throw new Error(mapApiError(error));
  return { total: count ?? 0 };
}
