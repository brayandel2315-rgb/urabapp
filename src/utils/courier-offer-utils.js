/** Utilidades de ofertas courier — sincronizadas con TTL del servidor */

export function isCourierOfferActive(offer, now = Date.now()) {
  if (!offer || offer.status !== 'pending') return false;
  if (!offer.expires_at) return true;
  return new Date(offer.expires_at).getTime() > now;
}

export function remainingOfferSeconds(offer, now = Date.now()) {
  if (!offer?.expires_at) return 0;
  return Math.max(0, Math.ceil((new Date(offer.expires_at).getTime() - now) / 1000));
}

export function offerDismissKey(offer) {
  if (!offer) return '';
  return offer.id || `${offer.order_id}:${offer.driver_id}`;
}

export function filterActiveCourierOffers(offers = []) {
  const now = Date.now();
  return offers.filter((o) => isCourierOfferActive(o, now));
}
