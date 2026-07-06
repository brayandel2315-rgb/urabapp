import { formatBusinessPromoText, calculateBusinessPromoDiscount } from './promo';
import { resolveBusinessCover } from './catalog-images';
import { OFFER_BADGES } from '../data/offers-filters';

const AVG_TICKET = 28000;

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
}

function endOfFlashWindow(minutes = 45) {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function estimatePrices(business, subtotal = AVG_TICKET) {
  const discount = calculateBusinessPromoDiscount(business, subtotal);
  return {
    originalPrice: subtotal,
    offerPrice: Math.max(subtotal - discount, 0),
    savings: discount,
  };
}

function inferBadge(business, { isNew = false, isFlash = false } = {}) {
  if (business.promo_badge && OFFER_BADGES[business.promo_badge]) {
    return business.promo_badge;
  }
  if (isFlash) return 'EXPIRA_HOY';
  if (Number(business.rating) >= 4.7) return 'TOP';
  if (isNew) return 'NUEVO';
  if (Number(business.promo_discount_value) >= 15) return 'HOT';
  return null;
}

function inferPromoType(business) {
  if (business.promo_is_flash) return 'flash';
  if (business.promo_discount_type === 'percent') return 'percent';
  if (business.promo_discount_type === 'fixed') return 'fixed';
  return 'percent';
}

export function businessToOffer(business, options = {}) {
  if (!business?.promo_is_active && !options.forcePromo) return null;
  if (!business.promo_discount_type && !options.promotion) return null;

  const promoText = formatBusinessPromoText(business);
  if (!promoText && !options.promotion) return null;

  const isFlash = options.isFlash ?? business.promo_is_flash ?? false;
  const endsAt = options.endsAt
    ?? business.promo_ends_at
    ?? (isFlash ? endOfFlashWindow(15 + (options.index || 0) * 7) : endOfDay());

  const prices = estimatePrices(business);
  const badge = inferBadge(business, { isFlash, isNew: options.isNew });

  return {
    id: options.promotion?.id || `biz-${business.id}`,
    promotionId: options.promotion?.id || null,
    businessId: business.id,
    slug: business.slug || business.id,
    name: business.name,
    emoji: business.emoji || '🏪',
    category: business.category,
    municipio: business.municipio,
    zone: business.zone,
    rating: Number(business.rating) || 0,
    totalRatings: business.total_ratings || 0,
    deliveryTime: business.delivery_time || 25,
    deliveryFee: business.delivery_fee ?? 3000,
    imageUrl: options.promotion?.image_url || resolveBusinessCover(business),
    title: options.promotion?.title || business.promo_title || promoText?.split(' ·')[0] || `${business.name}`,
    subtitle: options.promotion?.subtitle || business.promo_subtitle || business.description?.slice(0, 80) || promoText,
    promoType: options.promotion?.promo_type || inferPromoType(business),
    promoText,
    discountPercent: business.promo_discount_type === 'percent' ? Number(business.promo_discount_value) : null,
    discountFixed: business.promo_discount_type === 'fixed' ? Number(business.promo_discount_value) : null,
    minOrder: Number(business.promo_min_order) || 0,
    ...prices,
    badge,
    endsAt,
    isFlash,
    isFeatured: options.isFeatured ?? business.promo_is_featured ?? false,
    isBundle: false,
    bundleItems: [],
    isOpen: business.is_open !== false,
    distanceKm: options.distanceKm ?? null,
    score: options.score ?? 0,
    ctaLabel: 'Pedir ahora',
  };
}

export function promotionRowToOffer(promotion, business) {
  if (!business) return null;
  const discountType = promotion.promo_type === 'fixed' ? 'fixed' : 'percent';
  const merged = {
    ...business,
    promo_is_active: true,
    promo_discount_type: discountType,
    promo_discount_value: promotion.discount_value,
    promo_min_order: promotion.min_order,
    promo_title: promotion.title,
    promo_subtitle: promotion.subtitle,
    promo_ends_at: promotion.ends_at,
    promo_badge: promotion.badge,
    promo_is_flash: promotion.is_flash,
    promo_is_featured: promotion.is_featured,
  };
  const offer = businessToOffer(merged, {
    promotion,
    isFlash: promotion.is_flash,
    isFeatured: promotion.is_featured,
    endsAt: promotion.ends_at,
  });
  if (!offer) return null;
  if (promotion.is_bundle && Array.isArray(promotion.bundle_items) && promotion.bundle_items.length) {
    return {
      ...offer,
      isBundle: true,
      bundleItems: promotion.bundle_items,
      title: promotion.title || offer.title,
      subtitle: promotion.subtitle || offer.subtitle,
      promoType: 'combo',
    };
  }
  return offer;
}

export function groupOffersByMerchant(offers) {
  const map = new Map();
  for (const offer of filterActiveOffers(offers || [])) {
    if (!offer?.businessId || offer.isWelcome) continue;
    const key = offer.businessId;
    if (!map.has(key)) {
      map.set(key, {
        businessId: offer.businessId,
        slug: offer.slug,
        name: offer.name,
        emoji: offer.emoji,
        category: offer.category,
        municipio: offer.municipio,
        rating: offer.rating,
        deliveryTime: offer.deliveryTime,
        imageUrl: offer.imageUrl,
        isOpen: offer.isOpen,
        zone: offer.zone,
        offers: [],
      });
    }
    map.get(key).offers.push(offer);
  }
  return [...map.values()].sort((a, b) => {
    const ratingDiff = (b.rating || 0) - (a.rating || 0);
    if (ratingDiff !== 0) return ratingDiff;
    return b.offers.length - a.offers.length;
  });
}

export function createBundleOffer(business, index = 0) {
  const base = businessToOffer(business, { forcePromo: true, isFeatured: true });
  if (!base) return null;
  const bundles = [
    { items: ['2 hamburguesas', '1 bebida'], discount: 20 },
    { items: ['Combo familiar', 'Postre'], discount: 15 },
    { items: ['Almuerzo', 'Jugo natural'], discount: 18 },
  ];
  const bundle = bundles[index % bundles.length];
  return {
    ...base,
    id: `bundle-${business.id}-${index}`,
    isBundle: true,
    title: 'Compra más y ahorra',
    subtitle: bundle.items.join(' + '),
    bundleItems: bundle.items,
    discountPercent: bundle.discount,
    promoType: 'combo',
    savings: Math.round(base.originalPrice * (bundle.discount / 100)),
    offerPrice: Math.round(base.originalPrice * (1 - bundle.discount / 100)),
    badge: 'HOT',
    ctaLabel: 'Ver combo',
  };
}

export function isOfferExpired(offer) {
  if (!offer?.endsAt) return false;
  return new Date(offer.endsAt).getTime() <= Date.now();
}

export function filterActiveOffers(offers) {
  return (offers || []).filter((o) => o && !isOfferExpired(o));
}

function barrioDistance(business, barrio) {
  if (!barrio) return 2.5;
  if (business.zone === barrio) return 0.8;
  if (business.municipio && business.zone?.toLowerCase().includes(barrio.toLowerCase().slice(0, 4))) {
    return 1.2;
  }
  return 3.5;
}

export function scoreNearby(offer, { barrio, municipio }) {
  let score = 0;
  if (offer.municipio === municipio) score += 40;
  if (barrio && offer.zone === barrio) score += 35;
  score += Math.min(offer.rating * 4, 20);
  score += offer.isOpen ? 10 : 0;
  score += Math.max(0, 30 - (offer.deliveryTime || 30));
  if (offer.endsAt) {
    const hoursLeft = (new Date(offer.endsAt) - Date.now()) / 3600000;
    if (hoursLeft < 24) score += 10;
  }
  return score;
}

export function rankNearbyOffers(offers, { barrio, municipio }) {
  return filterActiveOffers(offers)
    .map((o) => ({
      ...o,
      distanceKm: barrioDistance(o, barrio),
      score: scoreNearby(o, { barrio, municipio }),
    }))
    .sort((a, b) => b.score - a.score);
}

export function rankRecommendedOffers(offers, { orderHistory = [], viewedCategories = [], hour = new Date().getHours() }) {
  const orderedBizIds = new Set(orderHistory.map((o) => o.business_id).filter(Boolean));
  const orderedCategories = orderHistory.reduce((acc, o) => {
    const cat = o.businesses?.category || o.category;
    if (cat) acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  return filterActiveOffers(offers)
    .map((o) => {
      let score = o.rating * 10;
      if (orderedBizIds.has(o.businessId)) score += 50;
      if (orderedCategories[o.category]) score += 30;
      if (viewedCategories.includes(o.category)) score += 15;
      if (hour >= 11 && hour <= 14 && o.category === 'comida') score += 20;
      if (hour >= 18 && hour <= 21 && o.category === 'comida') score += 25;
      if (o.badge === 'TOP') score += 10;
      return { ...o, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function filterOffersByChip(offers, filterId, filters) {
  if (!filterId || filterId === 'all') return offers;
  const filter = filters.find((f) => f.id === filterId);
  if (!filter) return offers;

  return offers.filter((o) => {
    if (filter.categories?.length) return filter.categories.includes(o.category);
    if (filter.expressOnly) return (o.deliveryTime || 99) <= 25;
    if (filter.minRating) return o.rating >= filter.minRating;
    return true;
  });
}

export function buildWelcomeOffer(profile) {
  if (profile?.welcome_delivery_used_at) return null;
  const ready = !!profile?.document_number;
  return {
    id: 'welcome-urabapp',
    isWelcome: true,
    title: ready ? 'Primera entrega gratis' : 'Registra tu cédula',
    subtitle: ready ? 'Listo para tu primer pedido' : 'Y obtén envío gratis en tu primer pedido',
    badge: 'NUEVO',
    ctaLabel: ready ? 'Pedir ahora' : 'Activar beneficio',
    link: '/cuenta/perfil',
    endsAt: endOfDay(),
    imageUrl: null,
    emoji: '🎁',
  };
}

export function getCountdownParts(endsAt) {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return {
    total: diff,
    hours: String(h).padStart(2, '0'),
    minutes: String(m).padStart(2, '0'),
    seconds: String(s).padStart(2, '0'),
    label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`,
  };
}
