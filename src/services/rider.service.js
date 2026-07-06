import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ECONOMICS, RIDER_BONUSES } from '../utils/constants';
import { mapApiError } from '../utils/errors';
import { sbFetch } from '@/lib/supabase-query';
import { withTimeout } from '../utils/async';
import { getWeekStart, calculateWeeklyRiderBonus } from '../utils/riderBonus';

const DRIVER_PROFILE_TIMEOUT_MS = 8_000;

async function fetchDriverProfileDirect(userId) {
  return sbFetch(
    supabase.from('drivers').select('*').eq('user_id', userId).maybeSingle(),
    'Tiempo agotado cargando perfil de mensajero',
    DRIVER_PROFILE_TIMEOUT_MS,
  );
}

export async function getMyDriverProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;

  try {
    const { data, error } = await withTimeout(
      supabase.rpc('get_my_driver_profile'),
      DRIVER_PROFILE_TIMEOUT_MS,
      'Tiempo agotado cargando perfil de mensajero',
    );
    if (error) throw error;
    if (!data) return fetchDriverProfileDirect(userId);
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch (rpcErr) {
    try {
      return await fetchDriverProfileDirect(userId);
    } catch {
      if (rpcErr instanceof Error) throw rpcErr;
      throw new Error(mapApiError(rpcErr));
    }
  }
}

export async function getActiveDrivers({ onlineOnly = false } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('drivers')
    .select('id, name, phone, municipio, is_online, is_verified')
    .order('is_online', { ascending: false })
    .order('name');

  if (onlineOnly) {
    query = query.eq('is_online', true);
  }

  const data = await sbFetch(query, 'Tiempo agotado cargando mensajeros');
  return data ?? [];
}

export async function registerDriver(userId, { name, phone, municipio, vehicle = 'moto', plate = '' }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  if (!userId) throw new Error('Debes iniciar sesión');

  const data = await sbFetch(
    supabase.rpc('register_driver', {
      p_name: name,
      p_phone: phone,
      p_municipio: municipio,
      p_vehicle: vehicle,
      p_plate: plate ?? '',
    }),
    'Tiempo agotado registrando mensajero',
  );

  const result = typeof data === 'string' ? JSON.parse(data) : data;
  if (!result?.success) {
    const reason = result?.reason;
    if (reason === 'unauthorized') throw new Error('Debes iniciar sesión');
    if (reason === 'invalid_name') throw new Error('Nombre inválido');
    if (reason === 'invalid_phone') throw new Error('Celular inválido. Usa 10 dígitos');
    if (reason === 'invalid_municipio') throw new Error('Selecciona tu municipio');
    throw new Error('No se pudo completar el registro');
  }

  return result.driver;
}

export async function setDriverOnline(driverId, isOnline) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase
      .from('drivers')
      .update({ is_online: isOnline, updated_at: new Date().toISOString() })
      .eq('id', driverId)
      .select()
      .single(),
    'Tiempo agotado actualizando estado del mensajero',
  );
}

export async function updateDriverLocation(driverId, { latitude, longitude }) {
  if (!isSupabaseConfigured || !driverId) return null;
  return sbFetch(
    supabase
      .from('drivers')
      .update({
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', driverId)
      .select('id, latitude, longitude')
      .single(),
    'Tiempo agotado actualizando ubicación del mensajero',
  );
}

export async function getRiderStats(userId) {
  if (!isSupabaseConfigured) return { deliveries: 0, earnings: 0 };
  const { data: driver } = await supabase
    .from('drivers')
    .select('id, total_deliveries')
    .eq('user_id', userId)
    .maybeSingle();

  if (!driver) return { deliveries: 0, earnings: 0 };

  const { count } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('driver_id', driver.id)
    .eq('status', 'delivered');

  const { data: payouts } = await supabase
    .from('orders')
    .select('rider_payout')
    .eq('driver_id', driver.id)
    .eq('status', 'delivered');

  const deliveries = count ?? driver.total_deliveries ?? 0;
  const earnings = (payouts ?? []).reduce(
    (sum, o) => sum + (o.rider_payout || ECONOMICS.riderPayout),
    0,
  );

  return { deliveries, earnings };
}

export async function getRiderLeaderboard({ municipio, limit = 10 } = {}) {
  if (!isSupabaseConfigured) return [];

  const weekStart = getWeekStart();

  try {
    const data = await sbFetch(
      supabase.rpc('get_rider_leaderboard', {
        p_municipio: municipio || null,
        p_limit: limit,
      }),
      'Tiempo agotado cargando ranking de mensajeros',
    );
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    const riders = result?.riders ?? (result?.success ? result.riders : null);
    if (Array.isArray(riders)) {
      return riders.map((d, index) => ({
        ...d,
        weekDeliveries: d.week_deliveries ?? d.weekDeliveries ?? 0,
        rank: d.rank ?? index + 1,
        weeklyBonus: calculateWeeklyRiderBonus(d.week_deliveries ?? d.weekDeliveries ?? 0, (d.rank ?? index + 1) - 1),
        bonusUnlocked: (d.week_deliveries ?? d.weekDeliveries ?? 0) >= RIDER_BONUSES.weeklyDeliveryTarget,
      }));
    }
  } catch {
    /* fallback directo */
  }

  let driverQuery = supabase
    .from('drivers')
    .select('id, name, municipio, rating, total_deliveries, is_online, is_verified')
    .order('total_deliveries', { ascending: false });

  if (municipio) driverQuery = driverQuery.eq('municipio', municipio);

  const [drivers, weekOrders] = await Promise.all([
    sbFetch(driverQuery, 'Tiempo agotado cargando mensajeros'),
    sbFetch(
      supabase
        .from('orders')
        .select('driver_id')
        .eq('status', 'delivered')
        .gte('delivered_at', weekStart)
        .not('driver_id', 'is', null),
      'Tiempo agotado cargando entregas de la semana',
    ),
  ]);

  const weekCounts = (weekOrders ?? []).reduce((acc, o) => {
    if (o.driver_id) acc[o.driver_id] = (acc[o.driver_id] || 0) + 1;
    return acc;
  }, {});

  const ranked = (drivers ?? [])
    .map((d) => ({
      ...d,
      weekDeliveries: weekCounts[d.id] || 0,
    }))
    .sort((a, b) => b.weekDeliveries - a.weekDeliveries || b.rating - a.rating || b.total_deliveries - a.total_deliveries)
    .slice(0, limit)
    .map((d, index) => ({
      ...d,
      rank: index + 1,
      weeklyBonus: calculateWeeklyRiderBonus(d.weekDeliveries, index),
      bonusUnlocked: d.weekDeliveries >= RIDER_BONUSES.weeklyDeliveryTarget,
    }));

  return ranked;
}

export async function adminUpdateDriver(driverId, updates) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase
      .from('drivers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', driverId)
      .select()
      .single(),
    'Tiempo agotado actualizando mensajero',
  );
}

export async function getRiderWeeklyProgress(userId) {
  if (!isSupabaseConfigured || !userId) {
    return { weekDeliveries: 0, weeklyBonus: 0, rank: null };
  }

  const { data: driver } = await supabase
    .from('drivers')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!driver) return { weekDeliveries: 0, weeklyBonus: 0, rank: null };

  const leaderboard = await getRiderLeaderboard({ limit: 100 });
  const me = leaderboard.find((d) => d.id === driver.id);
  const weekDeliveries = me?.weekDeliveries ?? 0;
  const rank = me?.rank ?? null;

  return {
    weekDeliveries,
    weeklyBonus: calculateWeeklyRiderBonus(weekDeliveries, rank != null ? rank - 1 : null),
    rank,
    bonusUnlocked: weekDeliveries >= RIDER_BONUSES.weeklyDeliveryTarget,
  };
}
