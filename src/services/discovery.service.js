/**
 * Discovery API — home feed, verticales, búsquedas trending/popular.
 */
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbQuery } from '@/lib/supabase-query';
import { emitCommEvent } from '@/communication';
import { getBusinesses } from '@/services/business.service';
import { rankBusinessesByRating } from '@/utils/business-rating';
import { isBusinessOpenNow } from '@/utils/schedule';
import { resolveCategoryFilter } from '@/data/category-catalog';
import { DEFAULT_TRENDING } from '@/data/vertical-catalog';
import { SEED_BUSINESSES } from '@/data/seed';
import { fetchActiveOffers } from '@/services/offers.service';
import { groupOffersByMerchant } from '@/utils/offers-engine';
import { searchProducts } from '@/services/search.service';

const HOME_CACHE_MS = 45_000;
let homeCache = { key: '', at: 0, data: null };

function withTimeout(promise, ms, fallback) {
  return Promise.race([
    promise,
    new Promise((resolve) => {
      setTimeout(() => resolve(fallback), ms);
    }),
  ]);
}

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function normalizeQuery(q) {
  return String(q || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function enrichBusiness(b, coords) {
  const open = isBusinessOpenNow(b);
  let distanceKm = null;
  if (coords?.latitude && b.latitude && b.longitude) {
    const R = 6371;
    const dLat = ((b.latitude - coords.latitude) * Math.PI) / 180;
    const dLng = ((b.longitude - coords.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2
      + Math.cos((coords.latitude * Math.PI) / 180)
      * Math.cos((b.latitude * Math.PI) / 180)
      * Math.sin(dLng / 2) ** 2;
    distanceKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return {
    ...b,
    isOpen: open,
    distanceKm,
    etaMin: b.delivery_time || 25,
    promoLabel: b.promo_is_active && b.promo_discount_value
      ? `-${b.promo_discount_value}${b.promo_discount_type === 'percent' ? '%' : ''}`
      : null,
  };
}

async function fetchBusinessPool({
  categories,
  getBusinessesParams,
  catalog,
  municipio,
  barrio,
  coords,
  limit = 40,
}) {
  const category = categories?.length === 1 ? categories[0] : undefined;
  const rows = await getBusinesses({
    ...(getBusinessesParams || { catalog, municipio }),
    category,
    barrio,
    limit: category ? limit : limit * 2,
  });
  const filtered = categories?.length > 1
    ? rows.filter((b) => categories.includes(b.category))
    : rows;
  return filtered.map((b) => enrichBusiness(b, coords));
}

function sortPool(pool, type, coords) {
  const open = pool.filter((b) => b.isOpen);
  switch (type) {
    case 'cerca':
      if (coords?.latitude) {
        return [...pool].sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
      }
      return rankBusinessesByRating(open.length ? open : pool, { limit: 50, requireReviews: false });
    case 'rapida':
      return [...pool].sort((a, b) => (a.etaMin ?? 99) - (b.etaMin ?? 99));
    case 'abiertos':
      return open;
    case 'ofertas':
      return pool.filter((b) => b.promo_is_active && b.promo_discount_value);
    case 'nuevos':
      return [...pool].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    case 'descubiertos':
      return [...pool].sort(() => Math.random() - 0.5);
    case 'demanda':
    case 'pedidos':
      return rankBusinessesByRating(pool, { limit: 50, requireReviews: false });
    case 'recomendados':
      return rankBusinessesByRating(open.length ? open : pool, { limit: 50, requireReviews: true });
    case 'favoritos':
    default:
      return rankBusinessesByRating(pool, { limit: 50, requireReviews: false });
  }
}

export async function getTrendingSearches(municipio, limit = 8) {
  if (!isSupabaseConfigured) {
    return DEFAULT_TRENDING.slice(0, limit);
  }
  try {
    const { data, error } = await supabase.rpc('get_trending_searches', {
      p_municipio: municipio || null,
      p_days: 7,
      p_limit: limit,
    });
    if (error) throw error;
    const terms = (data ?? []).map((r) => r.term).filter(Boolean);
    if (terms.length) return terms;
  } catch {
    /* fallback */
  }
  return DEFAULT_TRENDING.slice(0, limit);
}

export async function getPopularSearches(municipio, limit = 10) {
  if (!isSupabaseConfigured) {
    return DEFAULT_TRENDING.slice(0, limit).map((term) => ({ term, searches: 0, clicks: 0, orders: 0 }));
  }
  try {
    const { data, error } = await supabase.rpc('get_popular_searches', {
      p_municipio: municipio || null,
      p_limit: limit,
    });
    if (error) throw error;
    if (data?.length) return data;
  } catch {
    /* fallback */
  }
  return DEFAULT_TRENDING.slice(0, limit).map((term) => ({ term, searches: 0, clicks: 0, orders: 0 }));
}

export async function trackSearchEvent({
  query,
  municipio,
  vertical,
  userId,
  resultCount = 0,
  clickedBusinessId = null,
  ledToOrder = false,
}) {
  const normalized = normalizeQuery(query);
  if (!normalized || normalized.length < 2) return null;
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await supabase.from('search_events').insert({
      query: query.trim(),
      normalized_query: normalized,
      municipio: municipio || null,
      vertical: vertical || null,
      user_id: userId || null,
      result_count: resultCount,
      clicked_business_id: clickedBusinessId,
      led_to_order: ledToOrder,
    }).select('id').single();
    emitCommEvent('discovery_search', {
      recipientId: userId,
      payload: {
        query: query.trim(),
        municipio,
        vertical,
        resultCount,
        source: 'discovery',
      },
    }).catch(() => {});
    return data?.id ?? null;
  } catch {
    return null;
  }
}

export async function getLightMarketStats(municipio) {
  if (!isSupabaseConfigured) {
    return { activeOrders: 0, onlineRiders: 0, ordersToday: 0, avgDeliveryMin: 25 };
  }
  try {
    const { data, error } = await supabase.rpc('get_home_market_pulse', {
      p_municipio: municipio || null,
    });
    if (error) throw error;
    if (data) {
      return {
        activeOrders: data.activeOrders ?? 0,
        onlineRiders: data.onlineRiders ?? 0,
        ordersToday: data.ordersToday ?? 0,
        avgDeliveryMin: data.avgDeliveryMin ?? 25,
      };
    }
  } catch {
    /* fallback abajo */
  }
  const start = todayStart();
  const [pending, riders, ordersToday] = await Promise.all([
    sbQuery(
      supabase.from('orders').select('id', { count: 'exact', head: true })
        .in('status', ['pending', 'accepted', 'preparing', 'on_the_way']),
      'Tiempo agotado cargando pedidos activos',
    ),
    sbQuery(
      supabase.from('drivers').select('id', { count: 'exact', head: true }).eq('is_online', true),
      'Tiempo agotado cargando mensajeros',
    ),
    sbQuery(
      supabase.from('orders').select('id', { count: 'exact', head: true })
        .gte('created_at', start).neq('status', 'cancelled'),
      'Tiempo agotado cargando pedidos del día',
    ),
  ]);
  return {
    activeOrders: pending.count ?? 0,
    onlineRiders: riders.count ?? 0,
    ordersToday: ordersToday.count ?? 0,
    avgDeliveryMin: 25,
  };
}

function buildHomePromotionsFromOffers(offers) {
  return (offers || []).slice(0, 6);
}

function buildHomeDiscoveryFallback(municipio) {
  const muni = municipio || 'Apartadó';
  const rows = SEED_BUSINESSES.filter((b) => b.municipio === muni);
  const enriched = rows.map((b) => enrichBusiness(b, null));
  const ranked = rankBusinessesByRating(enriched, { limit: 8, requireReviews: false });
  return {
    featured: ranked,
    promotions: buildHomePromotionsFromOffers([]),
    promotionsByMerchant: [],
    trending: DEFAULT_TRENDING.slice(0, 8),
    stats: { activeOrders: 0, onlineRiders: 0, ordersToday: 0, avgDeliveryMin: 25 },
  };
}

async function fetchHomeDiscovery({
  municipio,
  barrio,
  userId,
  profile,
  catalog,
  getBusinessesParams,
  coords,
}) {
  const key = `${municipio}|${barrio || ''}|${catalog?.mode || ''}|${userId || ''}|${profile?.document_number || ''}|${coords?.latitude ?? ''}|${coords?.longitude ?? ''}`;
  const now = Date.now();
  if (homeCache.key === key && now - homeCache.at < HOME_CACHE_MS) {
    return homeCache.data;
  }

  const muni = catalog?.viewMunicipio || municipio;
  const bizParams = { ...(getBusinessesParams || { catalog, municipio: muni }), barrio, limit: 24 };

  const [featuredRows, trending, stats] = await Promise.all([
    getBusinesses(bizParams),
    withTimeout(getTrendingSearches(muni, 8), 5_000, DEFAULT_TRENDING.slice(0, 8)),
    withTimeout(getLightMarketStats(muni), 5_000, {
      activeOrders: 0,
      onlineRiders: 0,
      ordersToday: 0,
      avgDeliveryMin: 25,
    }),
  ]);

  const enriched = featuredRows.map((b) => enrichBusiness(b, coords));
  let ranked = rankBusinessesByRating(enriched, { limit: 12, requireReviews: false });
  if (coords?.latitude) {
    ranked = [...ranked]
      .sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99))
      .slice(0, 8);
  } else {
    ranked = ranked.slice(0, 8);
  }
  const promotions = await withTimeout(
    fetchActiveOffers({ municipio: muni, businesses: enriched }),
    5_000,
    [],
  );
  const promotionsByMerchant = groupOffersByMerchant(promotions);

  const data = {
    featured: ranked,
    promotions,
    promotionsByMerchant,
    trending,
    stats,
  };
  homeCache = { key, at: now, data };
  return data;
}

/** Datos iniciales del home (seed local) mientras carga la red. */
export function getHomeDiscoveryPlaceholder(municipio) {
  return buildHomeDiscoveryFallback(municipio);
}

/** Home feed — comercios, trending, pulso (con fallback si la red falla en móvil). */
export async function getHomeDiscovery(params) {
  const fallback = buildHomeDiscoveryFallback(params?.municipio || params?.catalog?.home);
  try {
    return await withTimeout(fetchHomeDiscovery(params), 12_000, fallback);
  } catch {
    return fallback;
  }
}

export function filterVerticalPool(pool, filterId, coords) {
  if (!filterId || filterId === 'all') return pool;
  return sortPool(pool, filterId, coords);
}

export async function getVerticalSection({
  section,
  categories,
  getBusinessesParams,
  catalog,
  municipio,
  barrio,
  coords,
}) {
  const pool = await fetchBusinessPool({
    categories,
    getBusinessesParams,
    catalog,
    municipio,
    barrio,
    coords,
    limit: 48,
  });
  const sorted = sortPool(pool, section.type, coords);
  return sorted.slice(0, section.limit || 8);
}

async function fetchVerticalDiscovery({
  vertical,
  getBusinessesParams,
  catalog,
  municipio,
  barrio,
  coords,
}) {
  if (!vertical || vertical.serviceOnly) {
    return { sections: [], pool: [] };
  }
  const categories = vertical.categories?.length
    ? vertical.categories
    : resolveCategoryFilter(vertical.id) || [];

  const pool = await withTimeout(
    fetchBusinessPool({
      categories,
      getBusinessesParams,
      catalog,
      municipio,
      barrio,
      coords,
      limit: 56,
    }),
    10_000,
    [],
  );

  const sections = (vertical.sections || []).reduce((acc, section) => {
    const shownIds = new Set(acc.flatMap((s) => s.businesses.map((b) => b.id)));
    const businesses = sortPool(pool, section.type, coords)
      .filter((b) => !shownIds.has(b.id))
      .slice(0, section.limit || 8);
    if (businesses.length > 0) {
      acc.push({ ...section, businesses });
    }
    return acc;
  }, []);

  return { sections, pool };
}

/** Feed de vertical — con timeout global para evitar carga infinita en móvil/PC. */
export async function getVerticalDiscovery(params) {
  const fallback = { sections: [], pool: [] };
  try {
    return await withTimeout(fetchVerticalDiscovery(params), 12_000, fallback);
  } catch {
    return fallback;
  }
}

export async function discoverySearch({
  q,
  municipio,
  catalog,
  getBusinessesParams,
  vertical,
  userId,
  limit = 20,
}) {
  const term = q?.trim();
  if (!term || term.length < 2) {
    return { businesses: [], products: [], total: 0 };
  }

  const categories = vertical?.categories;
  const category = categories?.length === 1 ? categories[0] : undefined;

  const rows = await getBusinesses({
    ...(getBusinessesParams || { catalog, municipio }),
    search: term,
    category,
    limit,
  });

  let filtered = categories?.length > 1
    ? rows.filter((b) => categories.includes(b.category))
    : rows;

  if (!isSupabaseConfigured && !filtered.length) {
    filtered = SEED_BUSINESSES.filter((b) =>
      b.name.toLowerCase().includes(term.toLowerCase()),
    ).slice(0, limit);
  }

  const businesses = filtered.map((b) => ({
    ...enrichBusiness(b),
    to: `/tienda/${b.slug || b.id}`,
  }));

  const products = await searchProducts({
    q: term,
    municipio,
    catalog,
    getBusinessesParams,
    limit: Math.min(limit, 12),
  });

  await trackSearchEvent({
    query: term,
    municipio,
    vertical: vertical?.id,
    userId,
    resultCount: businesses.length + products.length,
  });

  return {
    businesses,
    products,
    total: businesses.length + products.length,
  };
}
