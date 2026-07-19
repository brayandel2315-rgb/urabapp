import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SEED_BUSINESSES, SEED_PRODUCTS } from '../data/seed';
import { ECONOMICS } from '../utils/constants';
import { normalizeMunicipio } from '../utils/municipio';
import { escapeIlikePattern } from '../utils/validate';
import { resolveCategoryFilter } from '../data/category-catalog';
import { sortBusinessesByBarrio } from '../utils/barrio';
import { filterBusinessesForCatalog } from '../utils/business-coverage';
import { buildCatalogContext, getCatalogQueryParams } from '../utils/catalog-location';
import { mapApiError } from '../utils/errors';
import { sbFetch, sbQuery } from '@/lib/supabase-query';
import { STORE } from '../utils/marketplace-copy';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function applyBarrioSort(list, { barrio, zone, municipio } = {}) {
  const target = barrio || zone;
  return sortBusinessesByBarrio(list ?? [], target || null, municipio);
}

function resolveCatalogContext(params = {}) {
  if (params.catalog) return params.catalog;
  if (params.homeMunicipio != null || params.detectedMunicipio != null) {
    return buildCatalogContext({
      homeMunicipio: params.homeMunicipio,
      detectedMunicipio: params.detectedMunicipio,
      intermunicipalCatalog: params.intermunicipalCatalog,
      locationStatus: params.locationStatus,
    });
  }
  const legacy = normalizeMunicipio(params.userMunicipio || params.municipio);
  return buildCatalogContext({ homeMunicipio: legacy, detectedMunicipio: legacy });
}

function filterLocal(list, { catalog, category, search, barrio, zone } = {}) {
  let result = filterBusinessesForCatalog(list, catalog);
  const categories = resolveCategoryFilter(category);
  if (categories) result = result.filter((b) => categories.includes(b.category));
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((b) => b.name.toLowerCase().includes(q));
  }
  return applyBarrioSort(result, { barrio, zone, municipio: catalog.viewMunicipio });
}

export async function getBusinesses(params = {}) {
  const catalog = resolveCatalogContext(params);
  const queryPlan = getCatalogQueryParams(catalog);

  if (queryPlan.skip) {
    return [];
  }

  const { viewMunicipio, localMunicipio, intermunicipalOnly } = queryPlan;

  if (!isSupabaseConfigured) {
    return filterLocal(SEED_BUSINESSES, { catalog, ...params });
  }

  let query = supabase.from('businesses').select('*').eq('is_active', true).eq('is_published', true);

  if (intermunicipalOnly && viewMunicipio) {
    query = query.eq('intermunicipal_enabled', true);
  } else if (localMunicipio) {
    query = query.eq('municipio', localMunicipio);
  } else if (viewMunicipio) {
    query = query.or(`municipio.eq."${viewMunicipio}",intermunicipal_enabled.eq.true`);
  }

  const categories = resolveCategoryFilter(params.category);
  if (categories) query = query.in('category', categories);

  if (params.search) {
    const rawTerm = params.search.trim();
    if (rawTerm) {
      const term = escapeIlikePattern(rawTerm);
      const { data: productHits } = await supabase
        .from('products')
        .select('business_id')
        .ilike('name', `%${term}%`)
        .eq('is_available', true)
        .limit(30);
      const bizIds = [...new Set((productHits ?? []).map((p) => p.business_id).filter(Boolean))];
      if (bizIds.length) {
        query = query.or(`name.ilike.%${term}%,id.in.(${bizIds.join(',')})`);
      } else {
        query = query.ilike('name', `%${term}%`);
      }
    }
  }

  if (params.limit) {
    query = query.limit(params.limit);
  }

  let { data, error } = await sbQuery(
    query.order('rating', { ascending: false }),
    'Tiempo agotado cargando comercios',
  );

  if (error?.message?.includes('is_published')) {
    let retry = supabase.from('businesses').select('*').eq('is_active', true);
    if (intermunicipalOnly && viewMunicipio) retry = retry.eq('intermunicipal_enabled', true);
    else if (localMunicipio) retry = retry.eq('municipio', localMunicipio);
    else if (viewMunicipio) retry = retry.or(`municipio.eq."${viewMunicipio}",intermunicipal_enabled.eq.true`);
    if (categories) retry = retry.in('category', categories);
    const res = await retry.order('rating', { ascending: false });
    data = res.data;
    error = res.error;
  }

  if (error?.message?.includes('intermunicipal_enabled')) {
    let fallback = supabase.from('businesses').select('*').eq('is_active', true).eq('is_published', true);
    if (localMunicipio) fallback = fallback.eq('municipio', localMunicipio);
    else if (viewMunicipio && !intermunicipalOnly) fallback = fallback.eq('municipio', viewMunicipio);
    const res = await fallback.order('rating', { ascending: false });
    data = res.data;
    error = res.error;
  }

  if (error) throw error;

  return filterLocal(data ?? [], { catalog, ...params });
}

export async function getBusinessById(id) {
  if (!isSupabaseConfigured) {
    return SEED_BUSINESSES.find((b) => b.id === id) || null;
  }
  const { data, error } = await sbQuery(
    supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single(),
    'Tiempo agotado cargando el comercio',
  );
  if (error) return null;
  return data;
}

export async function getBusinessForCheckout(id) {
  const business = await getBusinessById(id);
  if (!business) return null;
  if (business.is_published === false || business.verification_status !== 'approved') {
    throw new Error(STORE.unavailable);
  }
  return business;
}

export async function getBusinessByIdOrSlug(idOrSlug) {
  if (!isSupabaseConfigured) {
    return SEED_BUSINESSES.find((b) => b.id === idOrSlug || b.slug === idOrSlug) || null;
  }
  if (UUID_RE.test(idOrSlug)) {
    return getBusinessById(idOrSlug);
  }
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', idOrSlug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data;
}

export async function createBusiness(ownerId, payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data, error } = await supabase
    .from('businesses')
    .insert({
      owner_id: ownerId,
      name: payload.name,
      category: payload.category,
      description: payload.description || '',
      emoji: payload.emoji || 'store',
      phone: payload.phone,
      municipio: payload.municipio,
      zone: payload.zone,
      address: payload.address,
      delivery_fee: payload.delivery_fee ?? ECONOMICS.defaultDeliveryFee,
      min_order: payload.min_order ?? 10000,
      delivery_time: payload.delivery_time ?? payload.prep_time_minutes ?? 25,
      prep_time_minutes: payload.prep_time_minutes ?? payload.delivery_time ?? 25,
      intermunicipal_enabled: Boolean(payload.intermunicipal_enabled),
      municipios_soportados: payload.municipios_soportados ?? [],
      daily_capacity: payload.daily_capacity ?? 100,
      delivery_radius_km: payload.delivery_radius_km ?? 8,
      commission_pct: ECONOMICS.commissionPct,
      is_open: false,
      is_active: true,
      is_published: false,
      verification_status: 'pending',
    })
    .select()
    .single();
  if (error?.message?.includes('intermunicipal') || error?.message?.includes('prep_time') || error?.message?.includes('is_published') || error?.message?.includes('verification_status')) {
    const { data: fallback, error: err2 } = await supabase
      .from('businesses')
      .insert({
        owner_id: ownerId,
        name: payload.name,
        category: payload.category,
        description: payload.description || '',
        emoji: payload.emoji || 'store',
        phone: payload.phone,
        municipio: payload.municipio,
        zone: payload.zone,
        address: payload.address,
        delivery_fee: payload.delivery_fee ?? ECONOMICS.defaultDeliveryFee,
        min_order: payload.min_order ?? 10000,
        delivery_time: payload.delivery_time ?? payload.prep_time_minutes ?? 25,
        prep_time_minutes: payload.prep_time_minutes ?? payload.delivery_time ?? 25,
        commission_pct: ECONOMICS.commissionPct,
        is_open: false,
        is_active: true,
        is_published: false,
        verification_status: 'pending',
      })
      .select()
      .single();
    if (err2) throw err2;
    return fallback;
  }
  if (error) throw new Error(mapApiError(error));
  return data;
}

export async function updateBusiness(businessId, updates) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const data = await sbFetch(
    supabase
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
      .select()
      .maybeSingle(),
    'Tiempo agotado actualizando comercio',
  );
  if (!data) {
    const row = await sbFetch(
      supabase
        .from('businesses')
        .select('*')
        .eq('id', businessId)
        .maybeSingle(),
      'Tiempo agotado cargando comercio',
    );
    if (!row) throw new Error('No se pudo guardar la tienda. Verifica tu sesión e intenta de nuevo.');
    return row;
  }
  return data;
}

export async function createProduct(businessId, product) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data, error } = await supabase
    .from('products')
    .insert({
      business_id: businessId,
      name: product.name,
      description: product.description || '',
      emoji: product.emoji || 'package',
      image_url: product.image_url || null,
      price: product.price,
      category: product.category || 'General',
      is_available: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProduct(productId, updates) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(productId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) throw error;
}

export async function getProductsByBusiness(businessId, { includeUnavailable = false } = {}) {
  if (!isSupabaseConfigured) {
    return SEED_PRODUCTS[businessId] || [];
  }
  let query = supabase
    .from('products')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order');
  if (!includeUnavailable) query = query.eq('is_available', true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    emoji: p.emoji,
    image_url: p.image_url,
    price: p.price,
    compare_at_price: p.compare_at_price,
    category: p.category,
    is_available: p.is_available,
    sort_order: p.sort_order,
  }));
}

export async function getBanners(municipio) {
  if (!isSupabaseConfigured) return null;
  const muni = municipio ? normalizeMunicipio(municipio) : null;
  let query = supabase.from('banners').select('*').eq('is_active', true);
  if (muni) {
    query = query.or(`municipio.eq."${muni}",municipio.is.null`);
  }
  const { data, error } = await query.order('sort_order');
  if (error) throw error;
  return data;
}

export async function getMyBusinesses(userId) {
  if (!isSupabaseConfigured) {
    return SEED_BUSINESSES.filter((b) => b.id === 'biz-1');
  }
  if (!userId) return [];
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1);
  if (error) throw error;
  return data ?? [];
}

export async function getAdminStats() {
  if (!isSupabaseConfigured) return null;
  const [businesses, products, orders, activeBusinesses] = await Promise.all([
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('is_open', true),
  ]);
  return {
    businesses: businesses.count ?? 0,
    products: products.count ?? 0,
    orders: orders.count ?? 0,
    activeBusinesses: activeBusinesses.count ?? 0,
  };
}

export async function getBusinessStats(businessId) {
  if (!isSupabaseConfigured || !businessId) {
    return { ordersToday: 0, revenueToday: 0, pending: 0 };
  }
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { data, error } = await supabase
    .from('orders')
    .select('total, status, commission_amount, business_net')
    .eq('business_id', businessId)
    .gte('created_at', startOfDay.toISOString());
  if (error) throw error;
  const today = data ?? [];
  const active = today.filter((o) => o.status !== 'cancelled');
  return {
    ordersToday: active.length,
    revenueToday: active.reduce((sum, o) => sum + (o.total || 0), 0),
    pending: today.filter((o) => !['delivered', 'cancelled'].includes(o.status)).length,
    commissionToday: active.reduce((sum, o) => sum + (o.commission_amount || 0), 0),
    netToday: active.reduce((sum, o) => sum + (o.business_net || 0), 0),
  };
}

function aggregateFinanceOrders(orders) {
  const delivered = (orders ?? []).filter((o) => o.status === 'delivered');
  return {
    orders: delivered.length,
    revenue: delivered.reduce((sum, o) => sum + (o.total || 0), 0),
    net: delivered.reduce((sum, o) => sum + (o.business_net || 0), 0),
    commission: delivered.reduce((sum, o) => sum + (o.commission_amount || 0), 0),
  };
}

export async function getBusinessFinanceSummary(businessId) {
  if (!isSupabaseConfigured || !businessId) {
    return {
      today: { orders: 0, revenue: 0, net: 0, commission: 0 },
      week: { orders: 0, revenue: 0, net: 0, commission: 0 },
      month: { orders: 0, revenue: 0, net: 0, commission: 0 },
      recentPayouts: [],
    };
  }

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  const startOfMonth = new Date(now);
  startOfMonth.setDate(startOfMonth.getDate() - 30);

  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, total, status, commission_amount, business_net, created_at')
    .eq('business_id', businessId)
    .gte('created_at', startOfMonth.toISOString())
    .order('created_at', { ascending: false });
  if (error) throw error;

  const orders = data ?? [];
  const todayOrders = orders.filter((o) => new Date(o.created_at) >= startOfDay);
  const weekOrders = orders.filter((o) => new Date(o.created_at) >= startOfWeek);

  return {
    today: aggregateFinanceOrders(todayOrders),
    week: aggregateFinanceOrders(weekOrders),
    month: aggregateFinanceOrders(orders),
    recentPayouts: orders
      .filter((o) => o.status === 'delivered')
      .slice(0, 8)
      .map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        total: o.total,
        net: o.business_net,
        commission: o.commission_amount,
        createdAt: o.created_at,
      })),
  };
}

export async function duplicateProduct(businessId, productId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data: source, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('business_id', businessId)
    .single();
  if (error || !source) throw new Error('Producto no encontrado');
  return createProduct(businessId, {
    name: `${source.name} (copia)`,
    description: source.description,
    emoji: source.emoji,
    image_url: source.image_url,
    price: source.price,
    category: source.category || 'General',
  });
}
