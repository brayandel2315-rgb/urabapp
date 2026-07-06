/**
 * Calificaciones derivadas de reseñas de clientes (tabla reviews → businesses.rating / total_ratings).
 */

export function getBusinessReviewStats(business) {
  const count = Number(business?.total_ratings ?? business?.review_count ?? 0);
  const rawRating = business?.rating != null ? Number(business.rating) : 0;
  const hasReviews = count > 0;
  const average = hasReviews ? Math.round(rawRating * 10) / 10 : null;

  return { average, count, hasReviews };
}

/**
 * Ordena comercios por mejor calificación (promedio de reseñas, luego volumen).
 */
export function rankBusinessesByRating(businesses, { limit = 3, requireReviews = true } = {}) {
  if (!businesses?.length) return [];

  const scored = businesses.map((business) => {
    const { average, count, hasReviews } = getBusinessReviewStats(business);
    return { business, average: average ?? 0, count, hasReviews };
  });

  const withReviews = scored.filter((item) => item.hasReviews);
  const pool = requireReviews && withReviews.length ? withReviews : scored;

  return pool
    .sort((a, b) => {
      if (b.average !== a.average) return b.average - a.average;
      return b.count - a.count;
    })
    .slice(0, limit)
    .map((item) => item.business);
}

export function formatRatingValue(value) {
  if (value == null || Number.isNaN(value)) return null;
  return (Math.round(Number(value) * 10) / 10).toFixed(1);
}
