import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapApiError } from '../utils/errors';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { parseCourierRpc } from '../utils/courier-offer-errors';
import { filterActiveCourierOffers } from '../utils/courier-offer-utils';
import { geocodeAddress, getDrivingRoute } from './map.service';
import { calculateCourierFare, haversineKm, loadFareConfigFromSettings } from '../utils/courier-fare';
import { COURIER_SEARCH_RADII } from '../utils/courier-constants';
import { publishDeliveryOffersWithExpansion } from './assignment.service';
import { sanitizeText } from '../utils/validate';
import { createOrder, notifyOperatorNewOrder } from './order.service';
import { emitCommEvent } from '@/communication';

/** Cotización sin crear pedido */
export async function quoteCourierDelivery({
  pickup,
  dropoff,
  municipio,
  priority = 'normal',
  pickupCoords,
  dropoffCoords,
}) {
  let from = pickupCoords;
  let to = dropoffCoords;

  if (!from?.latitude && pickup) {
    from = await geocodeAddress(pickup, { municipio });
  }
  if (!to?.latitude && dropoff) {
    to = await geocodeAddress(dropoff, { municipio });
  }

  if (!from?.latitude || !to?.latitude) {
    throw new Error('No pudimos ubicar las direcciones. Ajusta el pin en el mapa.');
  }

  const route = await getDrivingRoute(from, to);
  const distanceKm = route?.km ?? haversineKm(from, to);
  const estimatedMinutes = route?.minutes ?? Math.max(15, Math.round(distanceKm * 4 + 10));

  const fareConfig = await loadFareConfigFromSettings(isSupabaseConfigured ? supabase : null);
  const fare = calculateCourierFare({ distanceKm, priority, config: fareConfig });

  return {
    pickup: { ...from, label: from.label || pickup },
    dropoff: { ...to, label: to.label || dropoff },
    distanceKm: fare.distanceKm,
    estimatedMinutes,
    fare,
    routeGeometry: route?.geometry ?? null,
  };
}

/** Crear pedido courier y publicar ofertas a mensajeros */
export async function createCourierOrder({
  customerId,
  pickup,
  dropoff,
  municipio,
  phone,
  notes,
  packageType,
  weightTier,
  priority = 'normal',
  pickupCoords,
  dropoffCoords,
  fullName,
}) {
  const quote = await quoteCourierDelivery({
    pickup,
    dropoff,
    municipio,
    priority,
    pickupCoords,
    dropoffCoords,
  });

  const fare = quote.fare;

  const items = [{
    productId: null,
    name: `Mensajería — ${packageType || 'paquete'}`,
    emoji: 'mensajeria',
    price: 0,
    quantity: 1,
  }];

  const address = `Recoger: ${quote.pickup.label} → Entregar: ${quote.dropoff.label}`;
  const orderNotes = [
    sanitizeText(notes, 300),
    `Contacto: ${sanitizeText(phone, 20)}`,
    fullName ? `Cliente: ${sanitizeText(fullName, 80)}` : null,
    `Tipo: ${sanitizeText(packageType, 40)}, Peso: ${sanitizeText(weightTier, 20)}, Prioridad: ${sanitizeText(priority, 20)}`,
  ].filter(Boolean).join('. ');

  if (!isSupabaseConfigured) {
    const localOrder = await createOrder({
      customerId,
      businessId: null,
      items,
      address,
      municipio,
      paymentMethod: 'cash',
      deliveryFee: fare.total,
      notes: orderNotes,
      latitude: quote.dropoff.latitude,
      longitude: quote.dropoff.longitude,
    });
    return { ...localOrder, order_type: 'courier', delivery_otp: '1234', fare_breakdown: fare };
  }

  const order = await sbFetch(
    supabase
      .from('orders')
      .insert({
      customer_id: customerId,
      business_id: null,
      status: 'pending',
      order_type: 'courier',
      dest_municipio: municipio,
      dest_address: address,
      dest_latitude: quote.dropoff.latitude,
      dest_longitude: quote.dropoff.longitude,
      pickup_address: quote.pickup.label,
      pickup_latitude: quote.pickup.latitude,
      pickup_longitude: quote.pickup.longitude,
      distance_km: quote.distanceKm,
      estimated_minutes: quote.estimatedMinutes,
      fare_breakdown: fare,
      courier_package_type: packageType,
      courier_weight_tier: weightTier,
      courier_priority: priority,
      courier_phase: 'searching',
      subtotal: 0,
      delivery_fee: fare.total,
      total: fare.total,
      rider_payout: fare.riderPayout,
      platform_margin: fare.platformMargin,
      commission_pct: 0,
      commission_amount: 0,
      business_net: 0,
      platform_gross: fare.total,
      payment_method: 'cash',
      payment_status: 'pending',
      notes: orderNotes,
    })
    .select()
    .single(),
    'Tiempo agotado creando pedido de mensajería',
  );

  const { error: itemsError } = await supabase.from('order_items').insert({
    order_id: order.id,
    name: items[0].name,
    emoji: items[0].emoji,
    quantity: 1,
    unit_price: 0,
    total_price: 0,
  });

  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    throw new Error(mapApiError(itemsError));
  }

  await publishDeliveryOffersWithExpansion(order.id, COURIER_SEARCH_RADII);

  emitCommEvent('order_created', {
    recipientId: customerId,
    payload: {
      orderId: order.id,
      orderNumber: order.order_number,
      status: 'pending',
      title: 'Buscando mensajero',
      body: 'Tu mandado fue publicado. Te avisamos cuando un mensajero lo acepte.',
    },
  }).catch(() => {});

  return order;
}

/** Publica ofertas con expansión progresiva de radio */
export async function publishCourierOffersWithExpansion(orderId) {
  return publishDeliveryOffersWithExpansion(orderId, COURIER_SEARCH_RADII);
}

const OFFER_ORDER_SELECT = `
  id, order_number, order_type, dest_address, pickup_address,
  distance_km, estimated_minutes, total, fare_breakdown,
  courier_package_type, courier_priority, dest_municipio,
  business_id, rider_payout,
  businesses (name, address, municipio)
`;

async function hydrateOfferOrders(offers) {
  const missingIds = [...new Set(
    offers.filter((o) => !o.orders && o.order_id).map((o) => o.order_id),
  )];
  if (missingIds.length === 0) return offers;

  const orders = await sbFetch(
    supabase
      .from('orders')
      .select(OFFER_ORDER_SELECT)
      .in('id', missingIds),
    'Tiempo agotado cargando pedidos de ofertas',
  );

  const byId = Object.fromEntries((orders ?? []).map((row) => [row.id, row]));
  return offers.map((offer) => (
    offer.orders ? offer : { ...offer, orders: byId[offer.order_id] ?? null }
  ));
}

export async function getPendingCourierOffers(driverId) {
  if (!isSupabaseConfigured || !driverId) return [];
  const data = await sbFetch(
    supabase
      .from('courier_offers')
      .select(`*, orders (${OFFER_ORDER_SELECT})`)
      .eq('driver_id', driverId)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando ofertas',
  );
  return filterActiveCourierOffers(await hydrateOfferOrders(data ?? []));
}

export async function acceptCourierOffer(orderId, driverId) {
  if (!isSupabaseConfigured) return { success: true };
  const data = await sbFetch(
    supabase.rpc('accept_courier_offer', {
      p_order_id: orderId,
      p_driver_id: driverId,
    }),
    'Tiempo agotado aceptando oferta',
  );
  return parseCourierRpc(data);
}

export async function rejectCourierOffer(orderId, driverId) {
  if (!isSupabaseConfigured) return { success: true };
  const data = await sbFetch(
    supabase.rpc('reject_courier_offer', {
      p_order_id: orderId,
      p_driver_id: driverId,
    }),
    'Tiempo agotado rechazando oferta',
  );
  return parseCourierRpc(data) ?? { success: true };
}

export async function verifyDeliveryOtp(orderId, code, driverId) {
  if (!isSupabaseConfigured) return { success: code === '1234' };
  const data = await sbFetch(
    supabase.rpc('verify_courier_delivery_otp', {
      p_order_id: orderId,
      p_code: code,
      p_driver_id: driverId ?? null,
    }),
    'Tiempo agotado verificando código de entrega',
  );
  return data;
}

export async function setCourierPhase(orderId, phase, eventType, coords) {
  if (!isSupabaseConfigured) return;
  await sbExec(
    supabase.rpc('set_courier_phase', {
      p_order_id: orderId,
      p_phase: phase,
      p_event_type: eventType ?? phase,
      p_lat: coords?.latitude ?? null,
      p_lng: coords?.longitude ?? null,
    }),
    'Tiempo agotado actualizando fase del mandado',
  );
}

export async function getCourierTrackingEvents(orderId) {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('courier_tracking_events')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
    'Tiempo agotado cargando seguimiento del mandado',
  );
  return data ?? [];
}

export function isCourierOrder(order) {
  return order?.order_type === 'courier';
}

export async function submitCourierRequest(form, { customerId, municipio }) {
  const order = await createCourierOrder({
    customerId,
    pickup: form.pickup,
    dropoff: form.dropoff,
    municipio,
    phone: form.phone,
    notes: form.notes,
    packageType: form.packageType,
    weightTier: form.weightTier,
    priority: form.priority,
    pickupCoords: form.pickupCoords,
    dropoffCoords: form.dropoffCoords,
    fullName: form.fullName,
  });
  notifyOperatorNewOrder(order, 'Mensajería UrabApp');
  return order;
}
