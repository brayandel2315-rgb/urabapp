import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { emitCommEvent } from '@/communication';
import { calculateShipmentQuote, mergePricingConfig } from '../utils/shipment-pricing';
import { getMunicipalityDistanceKm, normalizeMunicipioName } from '../data/shipment-catalog';

async function getPricingConfig() {
  if (!isSupabaseConfigured) return null;
  const { data } = await supabase.from('shipment_pricing').select('value').eq('key', 'default').maybeSingle();
  return data?.value ?? null;
}

async function findRoute(origin, dest) {
  const o = normalizeMunicipioName(origin);
  const d = normalizeMunicipioName(dest);
  return sbFetch(
    supabase
      .from('shipment_routes')
      .select('*')
      .eq('origin_municipio', o)
      .eq('dest_municipio', d)
      .eq('is_active', true)
      .maybeSingle(),
    'Tiempo agotado cargando ruta de envío',
  );
}

/** POST /shipment/routes */
export async function getShipmentRoutes() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('shipment_routes')
      .select('*')
      .eq('is_active', true)
      .order('origin_municipio'),
    'Tiempo agotado cargando rutas de envío',
  );
  return data ?? [];
}

/** POST /shipment/quote */
export async function quoteShipment(payload) {
  const origin = normalizeMunicipioName(payload.originMunicipio);
  const dest = normalizeMunicipioName(payload.destMunicipio);
  if (origin === dest) {
    throw new Error('Mismo municipio: usa Mandado local en /mandado');
  }

  const pricing = mergePricingConfig(await getPricingConfig());
  const route = await findRoute(origin, dest);
  const distanceKm = route?.distance_km ?? getMunicipalityDistanceKm(origin, dest);
  const demandFactor = Number(route?.demand_factor) || pricing.demandMultiplier || 1;

  const quote = calculateShipmentQuote({
    originMunicipio: origin,
    destMunicipio: dest,
    distanceKm: Number(distanceKm),
    weightTier: payload.weightTier || '0-2',
    volumeFactor: payload.volumeFactor || 1,
    demandFactor,
    routeBaseFee: route?.base_fee ?? null,
    pricing,
  });

  const row = {
    customer_id: payload.customerId || null,
    origin_municipio: origin,
    dest_municipio: dest,
    route_id: route?.id ?? null,
    distance_km: quote.distanceKm,
    eta_hours: route?.eta_hours ?? quote.etaHours,
    package_type: payload.packageType || 'package',
    weight_tier: payload.weightTier || '0-2',
    price_breakdown: quote.breakdown,
    total_cop: quote.totalCop,
  };

  const result = {
    ...row,
    ...quote,
    route,
    origin_municipio: origin,
    dest_municipio: dest,
    slotsLeft: route ? Math.max(0, route.capacity_slots - route.slots_used) : null,
  };

  if (!isSupabaseConfigured) {
    return { id: `local-${Date.now()}`, ...result, ephemeral: true };
  }

  if (!payload.customerId) {
    return { id: `ephemeral-${Date.now()}`, ...result, ephemeral: true };
  }

  const data = await sbFetch(
    supabase.from('shipment_quotes').insert(row).select().single(),
    'Tiempo agotado guardando cotización de envío',
  );

  return {
    ...data,
    ...quote,
    route,
    slotsLeft: route ? Math.max(0, route.capacity_slots - route.slots_used) : null,
  };
}

/** POST /shipment/create */
export async function createShipment(payload) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');

  const origin = normalizeMunicipioName(payload.originMunicipio);
  const dest = normalizeMunicipioName(payload.destMunicipio);

  let quote = null;
  const quoteId = payload.quoteId && !String(payload.quoteId).startsWith('ephemeral')
    ? payload.quoteId
    : payload.quote?.id;

  if (quoteId && !String(quoteId).startsWith('ephemeral')) {
    const q = await sbFetch(
      supabase
        .from('shipment_quotes')
        .select('*')
        .eq('id', quoteId)
        .eq('customer_id', payload.customerId)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle(),
      'Tiempo agotado cargando cotización',
    );
    if (!q) throw new Error('La cotización expiró o no es válida. Vuelve a cotizar.');
    quote = q;
  }

  if (!quote) {
    quote = await quoteShipment({
      customerId: payload.customerId,
      originMunicipio: origin,
      destMunicipio: dest,
      packageType: payload.packageType,
      weightTier: payload.weightTier,
    });
  }

  if (
    normalizeMunicipioName(quote.origin_municipio) !== origin
    || normalizeMunicipioName(quote.dest_municipio) !== dest
  ) {
    throw new Error('La cotización no coincide con la ruta seleccionada');
  }

  if (!quote.id || quote.ephemeral || String(quote.id).startsWith('ephemeral')) {
    throw new Error('Inicia sesión y genera una cotización válida antes de crear el envío');
  }

  const etaAt = new Date();
  etaAt.setHours(etaAt.getHours() + (quote.eta_hours ?? quote.etaHours ?? 4));

  const shipment = await sbFetch(
    supabase
      .from('shipment_orders')
      .insert({
        customer_id: payload.customerId,
        quote_id: quote.ephemeral ? null : (quote.id ?? null),
        route_id: quote.route_id ?? quote.route?.id ?? null,
        origin_municipio: origin,
        dest_municipio: dest,
        status: 'created',
        sender_name: payload.senderName,
        sender_phone: payload.senderPhone,
        sender_whatsapp: payload.senderWhatsapp || payload.senderPhone,
        sender_document: payload.senderDocument || null,
        package_type: payload.packageType || 'package',
        weight_tier: payload.weightTier || '0-2',
        dimensions: payload.dimensions || null,
        declared_value: payload.declaredValue || 0,
        package_notes: payload.packageNotes || null,
        photo_url: payload.photoUrl || null,
        pickup_address: payload.pickupAddress,
        pickup_reference: payload.pickupReference || null,
        delivery_address: payload.deliveryAddress,
        delivery_reference: payload.deliveryReference || null,
        distance_km: quote.distance_km ?? quote.distanceKm,
        eta_hours: quote.eta_hours ?? quote.etaHours,
        eta_at: etaAt.toISOString(),
        price_breakdown: quote.price_breakdown ?? quote.breakdown,
        total_cop: quote.total_cop ?? quote.totalCop,
      })
      .select()
      .single(),
    'Tiempo agotado creando envío',
  );

  await supabase.rpc('log_shipment_event', {
    p_shipment_id: shipment.id,
    p_event_type: 'created',
    p_status: 'created',
    p_metadata: { origin, dest },
  });

  const payMethod = payload.paymentMethod || 'cash';
  const deferCarrier = payMethod === 'wompi';

  if (!deferCarrier) {
    await supabase.rpc('publish_shipment_assignments', { p_shipment_id: shipment.id, p_limit: 5 });
    await supabase.rpc('log_shipment_event', {
      p_shipment_id: shipment.id,
      p_event_type: 'searching_carrier',
      p_status: 'searching_carrier',
    });
  }

  await supabase.from('shipment_payments').insert({
    shipment_id: shipment.id,
    amount_cop: shipment.total_cop,
    method: payMethod,
    status: 'pending',
  });

  return shipment;
}

/** GET /shipment/:id — solo el cliente dueño (o staff vía RLS) */
export async function getShipment(shipmentId, { viewerId } = {}) {
  if (!isSupabaseConfigured || !shipmentId) return null;
  if (!viewerId) return null;

  return sbFetch(
    supabase
      .from('shipment_orders')
      .select(`
      *,
      drivers:assigned_driver_id (id, name, phone, vehicle, rating, latitude, longitude),
      shipment_routes:route_id (origin_municipio, dest_municipio, eta_hours)
    `)
      .eq('id', shipmentId)
      .eq('customer_id', viewerId)
      .maybeSingle(),
    'Tiempo agotado cargando envío',
  );
}

export async function getShipmentEvents(shipmentId) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('shipment_events')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: true }),
    'Tiempo agotado cargando eventos del envío',
  );
  return data ?? [];
}

export async function getShipmentTracking(shipmentId, limit = 20) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('shipment_tracking')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('recorded_at', { ascending: false })
      .limit(limit),
    'Tiempo agotado cargando seguimiento del envío',
  );
  return data ?? [];
}

export async function getCustomerShipments(customerId) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('shipment_orders')
      .select('id, shipment_number, origin_municipio, dest_municipio, status, total_cop, created_at, eta_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando envíos del cliente',
  );
  return data ?? [];
}

/** POST /shipment/status */
export async function updateShipmentStatus(shipmentId, status, metadata = {}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  await sbExec(
    supabase.rpc('log_shipment_event', {
      p_shipment_id: shipmentId,
      p_event_type: 'status_update',
      p_status: status,
      p_lat: metadata.lat ?? null,
      p_lng: metadata.lng ?? null,
      p_metadata: metadata,
    }),
    'Tiempo agotado actualizando estado del envío',
  );
  const { data: updated } = await supabase.from('shipment_orders').select('*').eq('id', shipmentId).single();
  if (updated?.customer_id) {
    emitCommEvent('shipment_status_changed', {
      recipientId: updated.customer_id,
      payload: {
        shipmentId: updated.id,
        shipmentNumber: updated.shipment_number,
        status,
      },
    }).catch(() => {});
  }
  return updated;
}

export async function acceptShipmentAssignment(assignmentId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) throw new Error('Debes iniciar sesión como transportista');

  return sbFetch(
    supabase.rpc('accept_shipment_assignment', {
      p_assignment_id: assignmentId,
      p_driver_user_id: user.user.id,
    }),
    'Tiempo agotado aceptando asignación de envío',
  );
}

export async function rejectShipmentAssignment(assignmentId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) throw new Error('Debes iniciar sesión como transportista');

  await sbExec(
    supabase.rpc('reject_shipment_assignment', {
      p_assignment_id: assignmentId,
      p_driver_user_id: user.user.id,
    }),
    'Tiempo agotado rechazando asignación de envío',
  );
}

export async function getPendingShipmentAssignments(driverId) {
  if (!isSupabaseConfigured || !driverId) return [];
  const data = await sbFetch(
    supabase
      .from('shipment_assignments')
      .select(`
      *,
      shipment_orders (
        id, shipment_number, origin_municipio, dest_municipio,
        pickup_address, delivery_address, total_cop, distance_km, eta_hours,
        package_type, price_breakdown, status
      )
    `)
      .eq('driver_id', driverId)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('rank_score', { ascending: false }),
    'Tiempo agotado cargando asignaciones de envío',
  );
  return data ?? [];
}

export async function getDriverShipments(driverId) {
  if (!isSupabaseConfigured || !driverId) return [];
  const data = await sbFetch(
    supabase
      .from('shipment_orders')
      .select('*')
      .eq('assigned_driver_id', driverId)
      .in('status', ['accepted', 'pickup', 'at_hub', 'in_transit', 'arriving', 'delivered'])
      .order('updated_at', { ascending: false }),
    'Tiempo agotado cargando envíos del transportista',
  );
  return data ?? [];
}

export async function advanceShipmentStatus(shipmentId, { lat, lng } = {}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user?.id) throw new Error('Debes iniciar sesión como transportista');

  return sbFetch(
    supabase.rpc('advance_shipment_status', {
      p_shipment_id: shipmentId,
      p_driver_user_id: user.user.id,
      p_lat: lat ?? null,
      p_lng: lng ?? null,
    }),
    'Tiempo agotado avanzando estado del envío',
  );
}

export async function getShipmentPayment(shipmentId) {
  if (!isSupabaseConfigured || !shipmentId) return null;
  return sbFetch(
    supabase
      .from('shipment_payments')
      .select('*')
      .eq('shipment_id', shipmentId)
      .maybeSingle(),
    'Tiempo agotado cargando pago del envío',
  );
}

/** Admin / operador */
export async function getAllShipments({ status, limit = 100 } = {}) {
  if (!isSupabaseConfigured) return [];
  let q = supabase
    .from('shipment_orders')
    .select('*, drivers:assigned_driver_id(name, phone)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status) q = q.eq('status', status);
  const data = await sbFetch(q, 'Tiempo agotado cargando envíos');
  return data ?? [];
}

export async function getShipmentOperatorStats() {
  if (!isSupabaseConfigured) return null;
  const [pending, inTransit, today, routes] = await Promise.all([
    supabase.from('shipment_orders').select('id', { count: 'exact', head: true }).in('status', ['created', 'searching_carrier', 'accepted', 'pickup']),
    supabase.from('shipment_orders').select('id', { count: 'exact', head: true }).in('status', ['in_transit', 'arriving', 'at_hub']),
    supabase.from('shipment_orders').select('total_cop').gte('created_at', new Date().toISOString().slice(0, 10)),
    supabase.from('shipment_routes').select('*').eq('is_active', true),
  ]);
  const revenue = (today.data ?? []).reduce((s, r) => s + (r.total_cop || 0), 0);
  return {
    pending: pending.count ?? 0,
    inTransit: inTransit.count ?? 0,
    revenueToday: revenue,
    routes: routes.data ?? [],
  };
}
