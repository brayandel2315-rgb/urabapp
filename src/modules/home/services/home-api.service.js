/**
 * Facade API del HOME — contrato alineado con NestJS (/search, /offers, /businesses/near, /delivery/quote).
 */
import { globalSearch } from '@/services/search.service';
import { getOffersFeed } from '@/services/offers.service';
import { getBusinesses } from '@/services/business.service';
import { emitCommEvent } from '@/communication';
import { getMarketplacePulse } from '@/services/marketplace.service';
import { quoteCourierDelivery } from '@/services/courier.service';
import { enrichBusinessAvailability } from '@/utils/business-availability';
import { sortBusinessesByBarrio } from '@/utils/barrio';
import {
  getHomeDiscovery,
  getTrendingSearches,
  getPopularSearches,
  discoverySearch,
  trackSearchEvent,
} from '@/services/discovery.service';

export { getHomeDiscovery, getTrendingSearches, getPopularSearches, discoverySearch, trackSearchEvent };

const OFFERS_CACHE_MS = 60_000;
let offersCache = { key: '', at: 0, data: null };

export async function homeSearch({ q, municipio, catalog, getBusinessesParams, limit = 12 }) {
  const term = q?.trim();
  if (!term || term.length < 2) {
    return { businesses: [], products: [], categories: [], suggestions: [] };
  }

  const { businesses, products } = await globalSearch({
    q: term,
    municipio,
    catalog,
    getBusinessesParams,
    limit,
  });

  const categories = [];
  const lower = term.toLowerCase();
  if (/mandado|mensaj|envío|envio|paquete/.test(lower)) {
    categories.push({ type: 'category', id: 'mandados', label: 'Mensajería', to: '/mandado' });
  }
  if (/envío|envio|intermunicipal|turbo|carepa/.test(lower)) {
    categories.push({ type: 'category', id: 'envios', label: 'Envíos intermunicipales', to: '/envios' });
  }

  return {
    businesses,
    products,
    categories,
    suggestions: businesses.slice(0, 4).map((b) => b.name),
  };
}

export async function homeOffers({
  municipio,
  barrio,
  userId,
  profile,
  catalog,
  getBusinessesParams,
}) {
  const key = `${municipio}|${barrio || ''}|${userId || ''}|${catalog?.mode || ''}`;
  const now = Date.now();
  if (offersCache.key === key && now - offersCache.at < OFFERS_CACHE_MS) {
    return offersCache.data;
  }
  const data = await getOffersFeed({
    municipio,
    barrio,
    userId,
    profile,
    catalog,
    getBusinessesParams,
  });
  offersCache = { key, at: now, data };
  return data;
}

export async function homeNearbyBusinesses({
  municipio,
  barrio,
  limit = 12,
  coords,
  catalog,
  getBusinessesParams,
} = {}) {
  const rows = await getBusinesses({ ...(getBusinessesParams || { catalog, municipio }), barrio });
  const sorted = sortBusinessesByBarrio(rows, barrio, catalog?.viewMunicipio || municipio);

  const withMeta = sorted.map((b) => enrichBusinessAvailability(b, coords));

  if (coords?.latitude) {
    withMeta.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
  } else {
    const ranked = rankBusinessesByRating(withMeta.filter((b) => b.isOpen), { limit: 50, requireReviews: false });
    const openIds = new Set(ranked.map((b) => b.id));
    withMeta.sort((a, b) => {
      const ao = openIds.has(a.id) ? 0 : 1;
      const bo = openIds.has(b.id) ? 0 : 1;
      return ao - bo || (b.rating || 0) - (a.rating || 0);
    });
  }

  return withMeta.slice(0, limit);
}

export async function homeDeliveryQuote(payload) {
  return quoteCourierDelivery(payload);
}

export async function homePulse({ municipio, barrio, catalog, getBusinessesParams }) {
  return getMarketplacePulse({
    municipio,
    barrio,
    catalog,
    getBusinessesParams,
  });
}

export function homeTrack(eventName, properties = {}, userId = null) {
  const payload = { ...properties, source: 'home_mvp', home_event: eventName };
  if (eventName === 'search') {
    return emitCommEvent('discovery_search', { recipientId: userId, payload }).catch(() => {});
  }
  if (eventName === 'home_feedback') {
    return emitCommEvent('home_feedback', { recipientId: userId, payload }).catch(() => {});
  }
  return emitCommEvent('marketplace_analytics', { recipientId: userId, payload }).catch(() => {});
}
