import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { countOpenBusinesses, filterOpenBusinesses, averageOpenDeliveryMinutes } from '@/utils/business-availability';
import { rankBusinessesByRating } from '../utils/business-rating';
import { SEED_BUSINESSES } from '../data/seed';
import { normalizeMunicipio } from '../utils/municipio';
import { sortBusinessesByBarrio } from '../utils/barrio';
import { getBusinesses } from './business.service';
import { buildCatalogContext } from '../utils/catalog-location';

function todayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function anonymize(name) {
  if (!name?.trim()) return 'Cliente';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return `${parts[0][0]}***`;
  return `${parts[0]} ${parts[1]?.[0] ?? ''}.`;
}

export async function getMarketplacePulse({ municipio, barrio, zone, catalog, getBusinessesParams } = {}) {
  const ctx = catalog || buildCatalogContext({ homeMunicipio: municipio, detectedMunicipio: municipio });
  const muni = ctx.viewMunicipio || (municipio ? normalizeMunicipio(municipio) : null);

  if (!isSupabaseConfigured) {
    return getLocalPulseFallback(muni, ctx);
  }

  const start = todayStart();
  const bizParams = getBusinessesParams || { catalog: ctx, municipio: muni };

  const businessesFromCatalog = await getBusinesses(bizParams);

  const [
    ordersTodayRes,
    deliveredTodayRes,
    ridersRes,
    recentDeliveredRes,
    usersTodayRes,
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', start)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('id, created_at, delivered_at, dest_municipio, total, businesses(name, emoji)')
      .eq('status', 'delivered')
      .gte('delivered_at', start)
      .order('delivered_at', { ascending: false })
      .limit(8),
    supabase
      .from('drivers')
      .select('id', { count: 'exact', head: true })
      .eq('is_online', true),
    supabase
      .from('orders')
      .select('id, order_number, delivered_at, dest_municipio, businesses(name, emoji), users(full_name)')
      .eq('status', 'delivered')
      .order('delivered_at', { ascending: false })
      .limit(6),
    supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', start),
  ]);

  const businesses = sortBusinessesByBarrio(businessesFromCatalog, barrio || zone || null, muni);
  const promoBusinesses = businesses
    .filter((b) => b.promo_is_active && b.promo_discount_type && b.promo_discount_value)
    .slice(0, 8);
  const openBusinesses = filterOpenBusinesses(businesses);
  const topRatedBusinesses = rankBusinessesByRating(openBusinesses, { limit: 3, requireReviews: true });
  const topRatedFallback = topRatedBusinesses.length
    ? topRatedBusinesses
    : rankBusinessesByRating(openBusinesses, { limit: 3, requireReviews: false });
  const deliveredToday = deliveredTodayRes.data ?? [];

  const deliveryTimes = deliveredToday
    .filter((o) => o.delivered_at && o.created_at)
    .map((o) => (new Date(o.delivered_at) - new Date(o.created_at)) / 60000);
  const avgDeliveryMin = deliveryTimes.length
    ? Math.round(deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length)
    : null;

  const avgBizDelivery = averageOpenDeliveryMinutes(businesses);

  const recentActivity = (recentDeliveredRes.data ?? []).map((o) => ({
    id: o.id,
    type: 'delivered',
    label: `${anonymize(o.users?.full_name)} ya recibió su pedido`,
    detail: o.businesses?.name ? o.businesses.name : 'Mandado',
    municipio: o.dest_municipio,
    at: o.delivered_at,
  }));

  const pendingRes = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .in('status', ['pending', 'accepted', 'preparing', 'on_the_way']);

  return {
    ordersToday: ordersTodayRes.count ?? 0,
    deliveredToday: deliveredToday.length,
    openBusinessesCount: countOpenBusinesses(businesses),
    totalBusinessesCount: businesses.length,
    onlineRiders: ridersRes.count ?? 0,
    activeOrders: pendingRes.count ?? 0,
    newUsersToday: usersTodayRes.count ?? 0,
    avgDeliveryMin,
    avgBizDelivery,
    topBusinesses: openBusinesses.slice(0, 6),
    topRatedBusinesses: topRatedFallback,
    recentActivity,
    activeCoupons: promoBusinesses,
    businessPromos: promoBusinesses,
    zoneStatus: {
      municipio: muni,
      zone,
      openCount: openBusinesses.length,
      totalCount: businesses.length,
      isHealthy: openBusinesses.length >= 3,
    },
  };
}

function getLocalPulseFallback(municipio, catalog) {
  const ctx = catalog || buildCatalogContext({ homeMunicipio: municipio, detectedMunicipio: municipio });
  if (ctx.mode === 'away_blocked') {
    return {
      ordersToday: 0,
      deliveredToday: 0,
      openBusinessesCount: 0,
      totalBusinessesCount: 0,
      onlineRiders: 0,
      activeOrders: 0,
      newUsersToday: 0,
      avgDeliveryMin: null,
      avgBizDelivery: 25,
      topBusinesses: [],
      topRatedBusinesses: [],
      recentActivity: [],
      activeCoupons: [],
      businessPromos: [],
      zoneStatus: { municipio, zone: null, openCount: 0, totalCount: 0, isHealthy: false },
    };
  }
  const businesses = SEED_BUSINESSES.filter((b) => !municipio || b.municipio === municipio);
  const openBusinesses = filterOpenBusinesses(businesses);
  return {
    ordersToday: 0,
    deliveredToday: 0,
    openBusinessesCount: openBusinesses.length,
    totalBusinessesCount: businesses.length,
    onlineRiders: 0,
    activeOrders: 0,
    newUsersToday: 0,
    avgDeliveryMin: null,
    avgBizDelivery: 25,
    topBusinesses: openBusinesses.slice(0, 6),
    topRatedBusinesses: rankBusinessesByRating(openBusinesses, { limit: 3, requireReviews: false }),
    recentActivity: [],
    activeCoupons: [],
    businessPromos: [],
    zoneStatus: { municipio, zone: null, openCount: openBusinesses.length, totalCount: businesses.length, isHealthy: openBusinesses.length >= 3 },
  };
}

export async function trackAnalyticsEvent(eventName, properties = {}, userId = null) {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      user_id: userId,
      properties,
      municipio: properties.municipio ?? null,
      source: properties.source ?? null,
      session_id: properties.sessionId ?? null,
    });
  } catch {
    /* no bloquear UX */
  }
}
