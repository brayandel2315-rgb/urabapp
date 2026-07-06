import { formatCOP } from './currency';

export function formatBusinessPromoText(business) {
  if (!business?.promo_is_active || !business.promo_discount_type || !business.promo_discount_value) {
    return null;
  }
  const min = Number(business.promo_min_order) || 0;
  const minLabel = min > 0 ? ` · mín. ${formatCOP(min)}` : '';
  if (business.promo_discount_type === 'percent') {
    return `${business.promo_discount_value}% de descuento${minLabel}`;
  }
  return `${formatCOP(business.promo_discount_value)} de descuento${minLabel}`;
}

export function calculateBusinessPromoDiscount(business, subtotal) {
  if (!business?.promo_is_active || !business.promo_discount_type || !business.promo_discount_value) {
    return 0;
  }
  const minOrder = Number(business.promo_min_order) || 0;
  if (subtotal < minOrder) return 0;
  if (business.promo_discount_type === 'percent') {
    return Math.round(subtotal * (Number(business.promo_discount_value) / 100));
  }
  return Math.min(Number(business.promo_discount_value), subtotal);
}

export function isWelcomeDeliveryEligible(profile, subtotal, minOrder = 0) {
  if (!profile?.document_number || profile.welcome_delivery_used_at) return false;
  if (minOrder > 0 && subtotal < minOrder) return false;
  return true;
}
