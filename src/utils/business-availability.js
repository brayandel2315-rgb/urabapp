import { isBusinessOpenNow } from '@/utils/schedule';

/** Enriquece un comercio con disponibilidad, distancia y promo para listados. */
export function enrichBusinessAvailability(business, coords = null) {
  const open = isBusinessOpenNow(business);
  let distanceKm = null;

  if (coords?.latitude && business?.latitude && business?.longitude) {
    const R = 6371;
    const dLat = ((business.latitude - coords.latitude) * Math.PI) / 180;
    const dLng = ((business.longitude - coords.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2
      + Math.cos((coords.latitude * Math.PI) / 180)
      * Math.cos((business.latitude * Math.PI) / 180)
      * Math.sin(dLng / 2) ** 2;
    distanceKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  return {
    ...business,
    isOpen: open,
    distanceKm,
    etaMin: business?.delivery_time || 25,
    promoLabel: business?.promo_is_active && business?.promo_discount_value
      ? `-${business.promo_discount_value}${business.promo_discount_type === 'percent' ? '%' : ''}`
      : null,
  };
}

export function countOpenBusinesses(businesses = []) {
  return businesses.filter((b) => isBusinessOpenNow(b)).length;
}

export function filterOpenBusinesses(businesses = []) {
  return businesses.filter((b) => isBusinessOpenNow(b));
}

export function averageOpenDeliveryMinutes(businesses = []) {
  const open = filterOpenBusinesses(businesses);
  if (!open.length) return 25;
  return Math.round(
    open.reduce((sum, b) => sum + (b.delivery_time || 25), 0) / open.length,
  );
}
