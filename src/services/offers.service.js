import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getBusinesses, getBanners } from './business.service';
import { getOrdersByCustomer } from './order.service';
import { trackAnalyticsEvent } from './marketplace.service';
import { normalizeMunicipio } from '../utils/municipio';
import { buildCatalogContext } from '../utils/catalog-location';
import { enrichMarketplaceBanners, buildBusinessPromoBanners } from '../utils/marketplace-banners';
import { DEFAULT_MISSION } from '../data/offers-filters';
import {
  businessToOffer,
  promotionRowToOffer,
  filterActiveOffers,
  rankNearbyOffers,
  rankRecommendedOffers,
  filterOffersByChip,
  buildWelcomeOffer,
  groupOffersByMerchant,
} from '../utils/offers-engine';
import { OFFERS_FILTERS } from '../data/offers-filters';
import { isBusinessOpenNow } from '../utils/schedule';

async function fetchPromotions(municipio) {
  if (!isSupabaseConfigured) return [];
  try {
    let q = supabase
      .from('promotions')
      .select('*, businesses(*)')
      .eq('is_active', true)
      .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
      .order('sort_weight', { ascending: false })
      .limit(40);
    if (municipio) {
      q = q.or(`municipio.eq.${municipio},municipio.is.null`);
    }
    const { data, error } = await q;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

async function fetchUserMission(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data } = await supabase
      .from('user_missions')
      .select('*')
      .eq('user_id', userId)
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

function offersFromBusinesses(businesses) {
  return filterActiveOffers(
    businesses
      .filter((b) => b.promo_is_active && b.promo_discount_type)
      .map((b, i) => businessToOffer(
        { ...b, is_open: isBusinessOpenNow(b) },
        { index: i, isFeatured: i < 3, isFlash: Boolean(b.promo_is_flash) },
      ))
      .filter(Boolean)
  );
}

/** Ofertas activas: tabla promotions + fallback businesses.promo_* */
export async function fetchActiveOffers({ municipio, businesses = [] } = {}) {
  const muni = municipio ? normalizeMunicipio(municipio) : null;
  const promotions = await fetchPromotions(muni);

  let offers = [];
  if (promotions.length) {
    offers = promotions
      .map((p) => promotionRowToOffer(p, p.businesses))
      .filter(Boolean);
  }

  if (!offers.length) {
    offers = offersFromBusinesses(businesses);
  } else {
    const promoBizIds = new Set(offers.map((o) => o.businessId));
    const extra = offersFromBusinesses(businesses.filter((b) => !promoBizIds.has(b.id)));
    offers = [...offers, ...extra];
  }

  return filterActiveOffers(offers);
}

function heroFromBanners(banners, offers) {
  const fromBanners = (banners || []).slice(0, 4).map((b, i) => ({
    id: b.id || `banner-${i}`,
    title: b.title,
    subtitle: b.subtitle,
    imageUrl: b.image_url,
    emoji: b.emoji || '🏷️',
    badge: b.badge || (i === 0 ? 'TOP' : null),
    link: b.link?.startsWith('/') ? b.link : b.link ? `/tienda/${b.link}` : '/ofertas',
    endsAt: new Date(Date.now() + (3 + i) * 3600000).toISOString(),
    ctaLabel: 'Pedir ahora',
    isBanner: true,
  }));
  const fromOffers = offers.filter((o) => o.isFeatured || o.isFlash).slice(0, 3);
  return [...fromOffers, ...fromBanners].slice(0, 6);
}

function buildMission(userId, orderHistory) {
  const weekOrders = (orderHistory || []).filter((o) => {
    const d = new Date(o.created_at);
    return Date.now() - d.getTime() < 7 * 86400000 && o.status !== 'cancelled';
  });
  const progress = weekOrders.length;
  return {
    id: 'mission-weekly-orders',
    ...DEFAULT_MISSION,
    progress_count: Math.min(progress, DEFAULT_MISSION.target_count),
    target_count: DEFAULT_MISSION.target_count,
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
    user_id: userId,
  };
}

export async function getOffersFeed({
  municipio,
  barrio,
  filterId = 'all',
  userId = null,
  profile = null,
  catalog = null,
  getBusinessesParams = null,
} = {}) {
  const muni = municipio ? normalizeMunicipio(municipio) : null;
  const ctx = catalog || buildCatalogContext({ homeMunicipio: muni, detectedMunicipio: muni });
  const bizParams = getBusinessesParams || { catalog: ctx, municipio: ctx.viewMunicipio };

  const [businesses, bannersRaw, promotions, orderHistory, dbMission] = await Promise.all([
    getBusinesses({ ...bizParams, barrio }),
    getBanners(muni),
    fetchPromotions(muni),
    userId ? getOrdersByCustomer(userId).catch(() => []) : Promise.resolve([]),
    fetchUserMission(userId),
  ]);

  const businessPromoBanners = buildBusinessPromoBanners(businesses, { limit: 6 });
  const banners = enrichMarketplaceBanners(bannersRaw, businessPromoBanners);

  let offers = [];
  if (promotions.length) {
    offers = promotions
      .map((p) => promotionRowToOffer(p, p.businesses))
      .filter(Boolean);
  }
  if (!offers.length) {
    offers = offersFromBusinesses(businesses);
  } else {
    const promoBizIds = new Set(offers.map((o) => o.businessId));
    const extra = offersFromBusinesses(businesses.filter((b) => !promoBizIds.has(b.id)));
    offers = [...offers, ...extra];
  }

  offers = filterOffersByChip(offers, filterId, OFFERS_FILTERS);
  const byMerchant = groupOffersByMerchant(offers);

  const nearby = rankNearbyOffers(offers, { barrio, municipio: muni }).slice(0, 12);
  const recommended = rankRecommendedOffers(offers, {
    orderHistory,
    viewedCategories: [...new Set(orderHistory.map((o) => o.businesses?.category).filter(Boolean))],
  }).slice(0, 10);

  const flash = filterActiveOffers(
    offers.filter((o) => o.isFlash || o.badge === 'EXPIRA_HOY')
  ).sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt)).slice(0, 6);

  const featured = filterActiveOffers(offers)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  const bundles = offers.filter((o) => o.isBundle && o.bundleItems?.length);

  const hero = heroFromBanners(banners, offers);
  const welcome = buildWelcomeOffer(profile);
  const mission = dbMission || buildMission(userId, orderHistory);

  return {
    hero,
    featured,
    nearby,
    flash,
    recommended,
    bundles,
    welcome,
    mission,
    all: offers,
    byMerchant,
    meta: {
      municipio: muni,
      barrio,
      total: offers.length,
      filterId,
    },
  };
}

export async function trackOfferEvent(eventType, { promotionId, businessId, userId, municipio, properties = {} }) {
  await trackAnalyticsEvent(`offer_${eventType}`, {
    promotionId,
    businessId,
    municipio,
    ...properties,
  }, userId);

  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('promo_events').insert({
      promotion_id: promotionId || null,
      business_id: businessId || null,
      user_id: userId || null,
      event_type: eventType,
      municipio: municipio || null,
      properties,
    });
  } catch {
    /* noop */
  }
}

export async function getBusinessPromoMetrics(businessId) {
  if (!isSupabaseConfigured || !businessId) {
    return { impressions: 0, clicks: 0, saves: 0, redeems: 0, ctr: 0, conversion: 0 };
  }
  try {
    const { data } = await supabase
      .from('promo_events')
      .select('event_type')
      .eq('business_id', businessId)
      .gte('created_at', new Date(Date.now() - 30 * 86400000).toISOString());

    const counts = (data ?? []).reduce((acc, row) => {
      acc[row.event_type] = (acc[row.event_type] || 0) + 1;
      return acc;
    }, {});

    const impressions = counts.impression || 0;
    const clicks = counts.click || 0;
    const saves = counts.save || 0;
    const redeems = counts.redeem || 0;

    return {
      impressions,
      clicks,
      saves,
      redeems,
      ctr: impressions ? Math.round((clicks / impressions) * 1000) / 10 : 0,
      conversion: clicks ? Math.round((redeems / clicks) * 1000) / 10 : 0,
    };
  } catch {
    return { impressions: 0, clicks: 0, saves: 0, redeems: 0, ctr: 0, conversion: 0 };
  }
}

export async function deactivateBusinessPromotion(businessId) {
  if (!isSupabaseConfigured || !businessId) return;
  try {
    await supabase
      .from('promotions')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('business_id', businessId)
      .eq('is_active', true);
  } catch {
    /* noop */
  }
}

export async function upsertBusinessPromotion(businessId, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');

  const { data: existing } = await supabase
    .from('promotions')
    .select('id')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle();

  const row = {
    business_id: businessId,
    title: payload.title,
    subtitle: payload.subtitle,
    promo_type: payload.promo_type || 'percent',
    discount_value: payload.discount_value,
    min_order: payload.min_order ?? 0,
    is_flash: payload.is_flash ?? false,
    is_featured: payload.is_featured ?? false,
    ends_at: payload.ends_at || null,
    badge: payload.badge || null,
    is_active: payload.is_active ?? true,
    municipio: payload.municipio || null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { data, error } = await supabase
      .from('promotions')
      .update(row)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('promotions')
    .insert(row)
    .select()
    .single();
  if (error) throw error;
  return data;
}
