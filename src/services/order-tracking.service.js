import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { invokeEdgeFunction } from './edge.service';

export async function getOrderEvents(orderId, { limit = 100 } = {}) {
  if (!isSupabaseConfigured || !orderId) return [];
  const data = await sbFetch(
    supabase
      .from('order_events')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })
      .limit(limit),
    'Tiempo agotado cargando historial del pedido',
  );
  return data ?? [];
}

export async function getOrderLocationPings(orderId, { limit = 50 } = {}) {
  if (!isSupabaseConfigured || !orderId) return [];
  const data = await sbFetch(
    supabase
      .from('order_location_pings')
      .select('*')
      .eq('order_id', orderId)
      .order('recorded_at', { ascending: false })
      .limit(limit),
    'Tiempo agotado cargando ruta GPS',
  );
  return data ?? [];
}

export async function recordOrderLocationPing(orderId, payload) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('record_order_location_ping', {
    p_order_id: orderId,
    p_latitude: payload.latitude,
    p_longitude: payload.longitude,
    p_accuracy_m: payload.accuracy ?? payload.accuracy_m ?? null,
    p_speed_mps: payload.speed ?? payload.speed_mps ?? null,
    p_heading: payload.heading ?? null,
    p_altitude_m: payload.altitude ?? payload.altitude_m ?? null,
    p_battery_level: payload.batteryLevel ?? payload.battery_level ?? null,
    p_connection_state: payload.connectionState ?? payload.connection_state ?? null,
    p_gps_state: payload.gpsState ?? payload.gps_state ?? null,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function markOrderReady(orderId) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('mark_order_ready', { p_order_id: orderId });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function riderStoreCheckpoint(orderId, checkpoint, coords = {}) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('rider_store_checkpoint', {
    p_order_id: orderId,
    p_checkpoint: checkpoint,
    p_latitude: coords.latitude ?? null,
    p_longitude: coords.longitude ?? null,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function submitDeliveryProof(orderId, proofUrl) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('submit_delivery_proof', {
    p_order_id: orderId,
    p_proof_url: proofUrl,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function reassignOrderDriver(orderId, driverId) {
  if (!isSupabaseConfigured || !orderId || !driverId) return null;
  const { data, error } = await supabase.rpc('reassign_order_driver', {
    p_order_id: orderId,
    p_new_driver_id: driverId,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function getActiveOrdersForTracking({ municipio } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('orders')
    .select(`
      id, order_number, status, courier_phase, driver_id, business_id,
      dest_address, dest_latitude, dest_longitude, dest_municipio,
      created_at, eta_seconds, tracking_flags,
      drivers (id, name, phone, latitude, longitude, rating, vehicle, plate),
      businesses (id, name, latitude, longitude)
    `)
    .in('status', ['pending', 'accepted', 'preparing', 'on_the_way'])
    .order('created_at', { ascending: false })
    .limit(80);

  if (municipio) {
    query = query.eq('dest_municipio', municipio);
  }

  const data = await sbFetch(query, 'Tiempo agotado cargando pedidos activos');
  return data ?? [];
}

export async function reportOrderIncident(orderId, reason, notes) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('report_order_incident', {
    p_order_id: orderId,
    p_reason: reason,
    p_notes: notes ?? null,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function getTrackingHeatmapPoints(hours = 2) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.rpc('get_tracking_heatmap_points', { p_hours: hours });
  if (error) throw error;
  return data ?? [];
}

export async function getActiveShipmentsForTracking({ municipio } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('shipment_orders')
    .select(`
      id, shipment_number, status, origin_municipio, dest_municipio,
      pickup_address, delivery_address,
      current_latitude, current_longitude,
      created_at, assigned_driver_id,
      drivers:assigned_driver_id (id, name, latitude, longitude)
    `)
    .in('status', ['searching_carrier', 'accepted', 'pickup', 'in_transit', 'arriving'])
    .order('created_at', { ascending: false })
    .limit(40);

  if (municipio) {
    query = query.or(`origin_municipio.eq.${municipio},dest_municipio.eq.${municipio}`);
  }

  const data = await sbFetch(query, 'Tiempo agotado cargando envíos activos');
  return data ?? [];
}

export async function ensureDeliveryQr(orderId) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('ensure_delivery_qr', { p_order_id: orderId });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function verifyDeliveryQr(orderId, token) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('verify_delivery_qr', {
    p_order_id: orderId,
    p_token: token,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function submitDeliverySignature(orderId, signatureUrl) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('submit_delivery_signature', {
    p_order_id: orderId,
    p_signature_url: signatureUrl,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function getOrderEtaHistory(orderId, limit = 40) {
  if (!isSupabaseConfigured || !orderId) return [];
  const { data, error } = await supabase.rpc('get_order_eta_history', {
    p_order_id: orderId,
    p_limit: limit,
  });
  if (error) throw error;
  return data ?? [];
}

export async function getMunicipioEtaBaseline(municipio) {
  if (!isSupabaseConfigured || !municipio) return 0;
  const { data, error } = await supabase.rpc('get_municipio_eta_baseline', {
    p_municipio: municipio,
  });
  if (error) return 0;
  return Number(data) || 0;
}

export async function getOrderTrackingAudit(orderId) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('get_order_tracking_audit', {
    p_order_id: orderId,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function closeOrderTracking(orderId) {
  if (!isSupabaseConfigured || !orderId) return null;
  const { data, error } = await supabase.rpc('close_order_tracking', {
    p_order_id: orderId,
  });
  if (error) throw error;
  return typeof data === 'string' ? JSON.parse(data) : data;
}

export async function getOrdersForTrackingAudit({ days = 7, limit = 40 } = {}) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.rpc('get_orders_for_tracking_audit', {
    p_days: days,
    p_limit: limit,
  });
  if (error) throw error;
  return data ?? [];
}

export async function getTrackingPushQueueStats() {
  if (!isSupabaseConfigured) {
    return {
      queue_pending: 0,
      queue_processing: 0,
      queue_completed_7d: 0,
      queue_failed_7d: 0,
      archive_rows: 0,
      outbox_retired: true,
    };
  }
  const { data, error } = await supabase.rpc('get_tracking_push_queue_stats');
  if (error) {
    return {
      queue_pending: 0,
      queue_processing: 0,
      queue_completed_7d: 0,
      queue_failed_7d: 0,
      archive_rows: 0,
      outbox_retired: true,
    };
  }
  return typeof data === 'string' ? JSON.parse(data) : (data ?? { queue_pending: 0, outbox_retired: true });
}

/** @deprecated usar getTrackingPushQueueStats */
export const getTrackingPushOutboxStats = getTrackingPushQueueStats;

export async function dispatchTrackingPushQueue() {
  if (!isSupabaseConfigured) return null;
  return invokeEdgeFunction('process-comm-retries', {});
}

/** @deprecated usar dispatchTrackingPushQueue */
export const dispatchTrackingPushOutbox = dispatchTrackingPushQueue;
