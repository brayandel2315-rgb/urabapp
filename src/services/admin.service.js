import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getMonthStart, aggregateEconomics } from '../utils/economics';
import { getRiderLeaderboard } from './rider.service';
import { getWeekStart } from '../utils/riderBonus';
import { MUNICIPALITIES, ECONOMICS } from '../utils/constants';
import { sbFetch } from '@/lib/supabase-query';

export async function getAllOrders() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*), businesses(name, emoji)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function getAllUsers() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getAllBusinesses() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando comercios',
  );
  return data ?? [];
}

export async function getAllDrivers() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('drivers')
    .select('*, users(full_name, email, phone)')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function updateUserRole(userId, role) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data, error } = await supabase
    .from('users')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOperationalKpis() {
  if (!isSupabaseConfigured) return null;

  const monthStart = getMonthStart();
  const nowIso = new Date().toISOString();

  const [
    ordersRes,
    businessesRes,
    usersRes,
    driversRes,
    onlineDriversRes,
    monthOrdersRes,
    expressBusinessesRes,
    monthWaOrdersRes,
    intermunicipalRes,
    reviewsRes,
    gpsOrdersRes,
    activeCouponsRes,
  ] = await Promise.all([
    supabase.from('orders').select('id, status, total, subtotal, created_at, delivered_at, customer_id, business_id'),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id', { count: 'exact', head: true }),
    supabase.from('drivers').select('id', { count: 'exact', head: true }).eq('is_online', true),
    supabase.from('orders').select(`
      id, status, total, subtotal, delivery_fee, discount,
      commission_amount, business_net, rider_payout, platform_gross, platform_margin, created_at
    `).gte('created_at', monthStart),
    supabase
      .from('businesses')
      .select('id, products(id)')
      .gte('created_at', monthStart)
      .eq('is_active', true),
    supabase.from('orders').select('id', { count: 'exact', head: true })
      .gte('created_at', monthStart)
      .in('source', ['whatsapp', 'instagram', 'wa', 'ig']),
    supabase.from('shipment_orders').select('id', { count: 'exact', head: true })
      .gte('created_at', monthStart),
    supabase.from('reviews').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true })
      .gte('created_at', monthStart)
      .not('dest_latitude', 'is', null),
    supabase.from('coupons').select('id', { count: 'exact', head: true })
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${nowIso}`),
  ]);

  const orders = ordersRes.data ?? [];
  const delivered = orders.filter((o) => o.status === 'delivered');
  const pending = orders.filter((o) => o.status === 'pending');
  const activeBusinesses = new Set(
    orders.filter((o) => o.status !== 'cancelled').map((o) => o.business_id)
  ).size;

  const deliveryTimes = delivered
    .filter((o) => o.delivered_at && o.created_at)
    .map((o) => (new Date(o.delivered_at) - new Date(o.created_at)) / 60000);

  const avgDeliveryMin = deliveryTimes.length
    ? Math.round(deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length)
    : null;

  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + (o.total || 0), 0);

  const deliveredSubtotals = delivered
    .map((o) => Number(o.subtotal))
    .filter((v) => v > 0);
  const avgTicket = deliveredSubtotals.length
    ? Math.round(deliveredSubtotals.reduce((a, b) => a + b, 0) / deliveredSubtotals.length)
    : 0;

  const expressBusinessesMonth = (expressBusinessesRes.data ?? []).filter(
    (b) => (b.products?.length ?? 0) >= 1,
  ).length;

  const repeatCustomers = orders.reduce((acc, o) => {
    if (o.customer_id) acc[o.customer_id] = (acc[o.customer_id] || 0) + 1;
    return acc;
  }, {});
  const repeatRate = orders.length
    ? Math.round((Object.values(repeatCustomers).filter((c) => c > 1).length / Object.keys(repeatCustomers).length) * 100)
    : 0;

  const monthEconomics = aggregateEconomics(monthOrdersRes.data ?? []);

  return {
    totalOrders: orders.length,
    pendingOrders: pending.length,
    deliveredOrders: delivered.length,
    activeBusinesses,
    totalBusinesses: businessesRes.count ?? 0,
    totalUsers: usersRes.count ?? 0,
    totalDrivers: driversRes.count ?? 0,
    avgDeliveryMin,
    totalRevenue,
    repeatRate: Number.isNaN(repeatRate) ? 0 : repeatRate,
    avgTicket,
    costPerOrder: avgTicket,
    monthlyOrders: monthEconomics.orderCount,
    monthlyPlatformGross: monthEconomics.platformGross,
    monthlyMargin: monthEconomics.platformMargin,
    monthlyRiderPayouts: monthEconomics.riderPayouts,
    monthlyCommission: monthEconomics.commissionTotal,
    monthlyGmv: monthEconomics.gmv,
    expressBusinessesMonth,
    whatsappOrdersMonth: monthWaOrdersRes.count ?? 0,
    intermunicipalOrdersMonth: intermunicipalRes.count ?? 0,
    onlineRiders: onlineDriversRes.count ?? 0,
    totalReviews: reviewsRes.count ?? 0,
    ordersWithGpsMonth: gpsOrdersRes.count ?? 0,
    activeCoupons: activeCouponsRes.count ?? 0,
  };
}

export async function getZoneCoverage() {
  if (!isSupabaseConfigured) return [];

  const [{ data: businesses }, { data: drivers }, { data: orders }] = await Promise.all([
    supabase.from('businesses').select('municipio, is_published, is_open').eq('is_active', true),
    supabase.from('drivers').select('municipio, is_online, verification_status'),
    supabase.from('orders').select('dest_municipio, status'),
  ]);

  const countBy = (rows, key) => rows.reduce((acc, row) => {
    const k = row[key] || 'Otro';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const bizByMuni = countBy(businesses ?? [], 'municipio');
  const publishedByMuni = (businesses ?? []).reduce((acc, b) => {
    if (!b.is_published) return acc;
    const k = b.municipio || 'Otro';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const driversByMuni = countBy(drivers ?? [], 'municipio');
  const onlineByMuni = (drivers ?? []).reduce((acc, d) => {
    if (!d.is_online) return acc;
    const k = d.municipio || 'Otro';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const ordersByMuni = (orders ?? []).filter((o) => o.status !== 'cancelled').reduce((acc, o) => {
    const k = o.dest_municipio || 'Otro';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  return MUNICIPALITIES.map((municipio) => ({
    municipio,
    businesses: bizByMuni[municipio] || 0,
    published: publishedByMuni[municipio] || 0,
    drivers: driversByMuni[municipio] || 0,
    onlineRiders: onlineByMuni[municipio] || 0,
    orders: ordersByMuni[municipio] || 0,
    ready: (bizByMuni[municipio] || 0) >= 3 && (driversByMuni[municipio] || 0) >= 1,
  }));
}

export async function standardizeBusinessCommissions(targetPct = ECONOMICS.commissionPct) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data, error } = await supabase
    .from('businesses')
    .update({ commission_pct: targetPct })
    .neq('commission_pct', targetPct)
    .select('id');
  if (error) throw error;
  return { updated: data?.length ?? 0, targetPct };
}

export async function createWeeklyRiderBonusPayouts() {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');

  const weekStart = getWeekStart().slice(0, 10);
  const weekEnd = new Date().toISOString().slice(0, 10);
  const reference = `bonus-week-${weekStart}`;
  const leaderboard = await getRiderLeaderboard({ limit: 100 });
  const eligible = leaderboard.filter((r) => r.weeklyBonus > 0);

  if (eligible.length === 0) {
    return { created: 0, skipped: 0, message: 'Sin bonos esta semana' };
  }

  const { data: existing } = await supabase
    .from('courier_payout')
    .select('driver_id')
    .eq('reference', reference);

  const existingIds = new Set((existing ?? []).map((p) => p.driver_id));
  let created = 0;
  let skipped = 0;

  for (const rider of eligible) {
    if (existingIds.has(rider.id)) {
      skipped += 1;
      continue;
    }
    const { error } = await supabase.from('courier_payout').insert({
      driver_id: rider.id,
      amount: rider.weeklyBonus,
      status: 'pending',
      method: 'bonus',
      reference,
      period_start: weekStart,
      period_end: weekEnd,
    });
    if (!error) created += 1;
  }

  return {
    created,
    skipped,
    message: created > 0
      ? `${created} bono(s) creado(s) — revisa en Retiros`
      : 'Bonos ya generados esta semana',
  };
}

export async function getCourierPayoutsAdmin() {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('courier_payout')
    .select('*, drivers(name, users(full_name, email))')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}

export async function processCourierPayout(payoutId, action, notes = null) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data, error } = await supabase.rpc('admin_process_courier_payout', {
    p_payout_id: payoutId,
    p_action: action,
    p_notes: notes,
  });
  if (error) throw error;
  if (!data?.success) throw new Error(data?.error || 'No se pudo procesar el retiro');
  return data;
}
