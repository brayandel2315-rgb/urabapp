import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapApiError } from '../utils/errors';
import { sbFetch, sbExec, sbQuery } from '@/lib/supabase-query';
import { openWhatsApp, buildOperatorNewOrderMessage } from '../utils/whatsapp';
import { sendOperatorWhatsAppAlert, isWhatsAppApiEnabled } from './whatsapp-api.service';
import { reassignOrderDriver } from './order-tracking.service';
import { emitCommEvent } from '@/communication';
import { scheduleDeliveryDispatch } from './assignment.service';
import { calculateOrderEconomics } from '../utils/economics';
import { ECONOMICS, ORDER_STATUS_LABELS } from '../utils/constants';
import { getReferralSource } from '../utils/referral';
import { clearAbandonedCart } from './crm.service';
import { redeemCoupon } from './coupon.service';
import { markWelcomeDeliveryUsed } from './promo.service';
import { CUSTOMER_CANCELLABLE_STATUSES, BUSINESS_CANCELLABLE_STATUSES } from '../utils/order-client';
import { validateAndPriceOrderItems } from '../utils/order-pricing';
import { sanitizeText } from '../utils/validate';
import { isBusinessOpenNow, isBusinessStoreLive } from '../utils/schedule';
import { isWithinUraba } from '../utils/geo-bounds';
import { RefundService } from '@/services/financial.service';

const ORDER_PUBLIC_COLUMNS = `
  id, order_number, status, order_type, customer_id, business_id, driver_id,
  dest_municipio, dest_address, dest_latitude, dest_longitude,
  pickup_address, pickup_latitude, pickup_longitude,
  distance_km, estimated_minutes, fare_breakdown,
  courier_package_type, courier_weight_tier, courier_priority, courier_phase,
  subtotal, delivery_fee, total, rider_payout, payment_method, payment_status,
  notes, tip_amount, created_at, accepted_at, delivered_at, cancelled_at, picked_up_at
`;

const LOCAL_ORDERS_KEY = 'urabapp-local-orders';

function scheduleAutoAssignRider(order) {
  if (!order?.id) return;
  if (order.order_type === 'courier') return;
  // Pedidos de tienda: la BD publica ofertas cuando la tienda marca "en preparación"
  if (order.business_id) return;
  scheduleDeliveryDispatch(order);
}

function getLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveLocalOrder(order) {
  const orders = getLocalOrders();
  orders.unshift(order);
  localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  return order;
}

async function resolveCustomerPhone(customerId) {
  if (!isSupabaseConfigured || !customerId) return null;
  const { data } = await supabase
    .from('users')
    .select('phone')
    .eq('id', customerId)
    .maybeSingle();
  return data?.phone || null;
}

export async function createOrder({
  customerId,
  businessId,
  items,
  address,
  destReference,
  municipio,
  paymentMethod,
  deliveryFee,
  notes,
  barrio,
  zone,
  discount = 0,
  businessDiscount = 0,
  welcomeDeliveryApplied = false,
  deliverySubsidy = 0,
  latitude,
  longitude,
  couponCode,
  couponDiscount = 0,
  tipAmount = 0,
  contactName,
  contactPhone,
}) {
  if (!customerId) throw new Error('Debes iniciar sesión para pedir');

  if (isSupabaseConfigured && !isWithinUraba(latitude, longitude)) {
    throw new Error('Marca tu ubicación exacta en el mapa dentro de Urabá para continuar.');
  }

  let pricedItems = items || [];
  let commissionPct = ECONOMICS.commissionPct;
  let resolvedDeliveryFee = deliveryFee;
  let businessOwnerId = null;
  let businessName = null;

  if (businessId && isSupabaseConfigured) {
    const { data: biz, error: bizError } = await supabase
      .from('businesses')
      .select('commission_pct, delivery_fee, min_order, is_open, is_published, verification_status, opens_at, closes_at, owner_id, name')
      .eq('id', businessId)
      .single();
    if (bizError || !biz) throw new Error(STORE.notFound);
    if (!isBusinessStoreLive(biz)) throw new Error(STORE.unavailable);
    if (!biz.is_open || !isBusinessOpenNow(biz)) {
      throw new Error(`${STORE.closed} o fuera de horario`);
    }
    businessOwnerId = biz.owner_id;
    businessName = biz.name;

    pricedItems = await validateAndPriceOrderItems(businessId, pricedItems);
    const pricedSubtotal = pricedItems.reduce((s, i) => s + i.price * i.quantity, 0);
    if (biz.min_order && pricedSubtotal < Number(biz.min_order)) {
      throw new Error(`El pedido mínimo es ${Number(biz.min_order).toLocaleString('es-CO')}`);
    }
    if (biz.commission_pct != null) commissionPct = biz.commission_pct;
    if (biz.delivery_fee != null) resolvedDeliveryFee = Number(biz.delivery_fee);
  } else if (businessId) {
    pricedItems = await validateAndPriceOrderItems(businessId, pricedItems);
  }

  const businessPromoDiscount = businessDiscount || discount;
  const promoDiscount = businessPromoDiscount + Math.max(0, couponDiscount);
  const customerDeliveryFee = welcomeDeliveryApplied ? 0 : resolvedDeliveryFee;
  const tip = Math.max(0, Number(tipAmount) || 0);
  const subtotal = pricedItems.length
    ? pricedItems.reduce((s, i) => s + i.price * i.quantity, 0)
    : 0;
  const total = Math.max(0, subtotal + customerDeliveryFee - promoDiscount + tip);

  const economics = calculateOrderEconomics({
    subtotal,
    deliveryFee: resolvedDeliveryFee,
    discount: promoDiscount,
    deliverySubsidy: welcomeDeliveryApplied ? deliverySubsidy || resolvedDeliveryFee : 0,
    commissionPct,
    hasBusiness: !!businessId,
  });

  const orderPayload = {
    customer_id: customerId,
    business_id: businessId || null,
    status: 'pending',
    dest_municipio: municipio,
    dest_address: address,
    dest_reference: destReference || null,
    dest_latitude: latitude ?? null,
    dest_longitude: longitude ?? null,
    subtotal,
    delivery_fee: resolvedDeliveryFee,
    discount: promoDiscount,
    business_discount: businessPromoDiscount,
    delivery_subsidy: welcomeDeliveryApplied ? deliverySubsidy || deliveryFee : 0,
    welcome_delivery_applied: welcomeDeliveryApplied,
    total,
    commission_pct: economics.commissionPct,
    commission_amount: economics.commissionAmount,
    business_net: economics.businessNet,
    rider_payout: economics.riderPayout + tip,
    tip_amount: tip,
    platform_gross: economics.platformGross,
    platform_margin: economics.platformMargin,
    payment_method: paymentMethod,
    payment_status: 'pending',
    source: getReferralSource(),
    notes: (() => {
      let merged = sanitizeText(notes, 500);
      const safeContactName = contactName ? sanitizeText(contactName, 80) : '';
      const safeContactPhone = contactPhone ? String(contactPhone).replace(/\D/g, '').slice(0, 12) : '';
      if (safeContactName && safeContactPhone && !merged.includes('Contacto verificado')) {
        merged = merged
          ? `${merged} | Contacto: ${safeContactName} · ${safeContactPhone}`
          : `Contacto: ${safeContactName} · ${safeContactPhone}`;
      }
      const safeBarrio = sanitizeText(barrio || zone, 80);
      if (safeBarrio && !merged.includes('Barrio:') && !merged.includes('[Barrio:')) {
        merged = merged ? `${merged} [Barrio: ${safeBarrio}]` : `[Barrio: ${safeBarrio}]`;
      }
      return merged || null;
    })(),
    coupon_code: couponCode ? String(couponCode).toUpperCase() : null,
  };

  if (!isSupabaseConfigured || !customerId) {
    const localOrder = {
      id: `local-${Date.now()}`,
      order_number: `URA-${Date.now().toString().slice(-5)}`,
      ...orderPayload,
      customer_id: customerId || 'guest',
      items: pricedItems,
      created_at: new Date().toISOString(),
    };
    return saveLocalOrder(localOrder);
  }

  const order = await sbFetch(
    supabase
      .from('orders')
      .insert(orderPayload)
      .select()
      .single(),
    'Tiempo agotado creando pedido',
  );

  const orderItems = pricedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    name: item.name,
    emoji: item.emoji,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    notes: item.modifierSummary || null,
    modifiers_json: item.modifiers?.length ? item.modifiers : [],
    fulfillment_status: 'pending',
  }));

  let { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError?.message?.includes('modifiers_json') || itemsError?.message?.includes('fulfillment_status')) {
    const legacyItems = orderItems.map(({ modifiers_json, notes, ...rest }) => ({
      ...rest,
      notes: notes || (modifiers_json?.length
        ? modifiers_json.map((m) => m.name).join(', ')
        : null),
    }));
    ({ error: itemsError } = await supabase.from('order_items').insert(legacyItems));
  }
  if (itemsError) throw new Error(mapApiError(itemsError));

  clearAbandonedCart(customerId).catch(() => {});

  if (couponCode) {
    redeemCoupon(couponCode, customerId, order.id).catch(() => {});
  }

  if (welcomeDeliveryApplied && customerId) {
    markWelcomeDeliveryUsed(customerId, order.id).catch(() => {});
  }

  resolveCustomerPhone(customerId).then((phone) => {
    emitCommEvent('order_created', {
      recipientId: customerId,
      payload: {
        orderId: order.id,
        orderNumber: order.order_number,
        status: 'pending',
        phone,
      },
    }).catch(() => {});
  });

  if (businessOwnerId) {
    emitCommEvent('business_new_order', {
      recipientId: businessOwnerId,
      payload: {
        orderId: order.id,
        orderNumber: order.order_number,
        businessName,
      },
    }).catch(() => {});
  }

  scheduleAutoAssignRider(order);

  return { ...order, items: items || [] };
}

export async function createMandadoOrder({ customerId, description, pickup, dropoff, municipio, phone, deliveryFee, zone }) {
  const address = `Recoger: ${pickup} → Entregar: ${dropoff}`;
  const notes = `Mandado: ${description}. Contacto: ${phone}`;
  const items = [{
    productId: null,
    name: `Mandado — ${description}`,
    emoji: 'mensajeria',
    price: 0,
    quantity: 1,
  }];

  return createOrder({
    customerId,
    businessId: null,
    items,
    address,
    municipio,
    paymentMethod: 'cash',
    deliveryFee,
    notes,
    zone,
  }).then(async (order) => {
    if (isSupabaseConfigured && order?.id && !String(order.id).startsWith('local-')) {
      await updateOrderStatus(order.id, 'accepted');
      return { ...order, status: 'accepted', accepted_at: new Date().toISOString() };
    }
    return { ...order, status: 'accepted' };
  });
}

export async function createEnvioOrder({
  customerId,
  description,
  pickup,
  dropoff,
  originMunicipio,
  destMunicipio,
  phone,
  deliveryFee,
}) {
  const address = `Origen (${originMunicipio}): ${pickup} → Destino (${destMunicipio}): ${dropoff}`;
  const notes = `Envío intermunicipal: ${description}. Contacto: ${phone}. Ruta: ${originMunicipio} → ${destMunicipio}`;
  const items = [{
    productId: null,
    name: `Envío ${originMunicipio} → ${destMunicipio}`,
    emoji: 'envios',
    price: 0,
    quantity: 1,
  }];

  return createOrder({
    customerId,
    businessId: null,
    items,
    address,
    municipio: destMunicipio,
    paymentMethod: 'cash',
    deliveryFee,
    notes,
    zone: null,
  }).then(async (order) => {
    if (isSupabaseConfigured && order?.id && !String(order.id).startsWith('local-')) {
      await updateOrderStatus(order.id, 'accepted');
      return { ...order, status: 'accepted', accepted_at: new Date().toISOString() };
    }
    return { ...order, status: 'accepted' };
  });
}

export async function notifyOperatorNewOrder(order, businessName) {
  if (typeof window === 'undefined') return;
  const message = buildOperatorNewOrderMessage(order, businessName);
  const operatorPhone = import.meta.env.VITE_WHATSAPP_NUMBER?.replace(/\D/g, '');

  if (isWhatsAppApiEnabled() && operatorPhone) {
    sendOperatorWhatsAppAlert({ phone: operatorPhone, message }).catch(() => {});
    return;
  }

  if (import.meta.env.VITE_AUTO_WHATSAPP_NOTIFY === 'true') {
    openWhatsApp(message);
  }
}

export async function getOrdersByCustomer(customerId) {
  if (!isSupabaseConfigured || !customerId) {
    return getLocalOrders();
  }
  const data = await sbFetch(
    supabase
      .from('orders')
      .select('*, order_items(*), businesses(id, name)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando pedidos',
  );
  return data ?? [];
}

export async function getOrderById(orderId, { viewerId } = {}) {
  if (!orderId) return null;
  if (!isSupabaseConfigured || orderId.startsWith('local-')) {
    const local = getLocalOrders().find((o) => o.id === orderId) || null;
    if (!local) return null;
    if (viewerId && local.customer_id && local.customer_id !== viewerId) return null;
    return local;
  }
  if (!viewerId) return null;

  const { data, error } = await sbQuery(
    supabase
      .from('orders')
      .select(`${ORDER_PUBLIC_COLUMNS}, order_items(*), drivers(id, name, phone)`)
      .eq('id', orderId)
      .single(),
    'Tiempo agotado cargando el pedido',
  );
  if (error || !data) return null;

  if (data.customer_id && data.customer_id !== viewerId) {
    return null;
  }

  const handoff = await getCustomerDeliveryHandoff(orderId).catch(() => null);
  if (handoff?.success && handoff.otp) {
    return {
      ...data,
      delivery_otp: handoff.otp,
      delivery_otp_verified_at: handoff.verified ? data.delivered_at : null,
    };
  }
  return data;
}

export async function getCustomerDeliveryHandoff(orderId) {
  if (!isSupabaseConfigured || !orderId || orderId.startsWith('local-')) {
    const local = getLocalOrders().find((o) => o.id === orderId);
    if (!local) return { success: false, reason: 'not_found' };
    return {
      success: true,
      status: local.status,
      otp: local.delivery_otp || (local.status === 'on_the_way' ? '1234' : null),
      can_confirm: local.status === 'on_the_way' && Boolean(local.driver_id),
      order_number: local.order_number,
    };
  }
  const data = await sbFetch(
    supabase.rpc('get_customer_delivery_handoff', { p_order_id: orderId }),
    'Tiempo agotado cargando código de entrega',
  );
  return data ?? { success: false };
}

export async function confirmCustomerDelivery(orderId) {
  if (!isSupabaseConfigured || orderId.startsWith('local-')) {
    const orders = getLocalOrders().map((o) =>
      o.id === orderId && o.status === 'on_the_way'
        ? { ...o, status: 'delivered', delivered_at: new Date().toISOString() }
        : o,
    );
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return { success: true };
  }
  const data = await sbFetch(
    supabase.rpc('customer_confirm_delivery', { p_order_id: orderId }),
    'Tiempo agotado confirmando entrega',
  );
  return data ?? { success: false };
}

export async function updateOrderStatus(orderId, status, { driverId } = {}) {
  if (!isSupabaseConfigured || orderId.startsWith('local-')) {
    const orders = getLocalOrders().map((o) =>
      o.id === orderId ? { ...o, status, driver_id: driverId || o.driver_id } : o
    );
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    return;
  }

  const before = await sbFetch(
    supabase
      .from('orders')
      .select('customer_id, order_number, status, business_id, businesses(owner_id, name)')
      .eq('id', orderId)
      .single(),
    'Tiempo agotado cargando pedido',
  );

  const updates = { status };
  const now = new Date().toISOString();
  if (status === 'accepted') updates.accepted_at = now;
  if (status === 'delivered') updates.delivered_at = now;
  if (status === 'cancelled') updates.cancelled_at = now;
  if (driverId) updates.driver_id = driverId;

  await sbExec(
    supabase.from('orders').update(updates).eq('id', orderId),
    'Tiempo agotado actualizando estado del pedido',
  );

  if (status === 'preparing') {
    const { data: orderRow } = await supabase
      .from('orders')
      .select('id, business_id, driver_id, order_type, status')
      .eq('id', orderId)
      .maybeSingle();
    if (orderRow?.business_id && !orderRow.driver_id && orderRow.order_type !== 'courier') {
      scheduleDeliveryDispatch(orderRow, { immediate: true });
    }
  }

  if (status === 'cancelled' && before.status === 'delivered') {
    RefundService.processRefund(orderId, 'Pedido cancelado post-entrega').catch(() => {});
  }

  if (before?.customer_id && before.status !== status) {
    const customerPayload = {
      orderId,
      orderNumber: before.order_number,
      status,
      statusLabel: ORDER_STATUS_LABELS[status] || status,
    };
    resolveCustomerPhone(before.customer_id).then((phone) => {
      const payload = { ...customerPayload, phone };
      if (status === 'cancelled') {
        emitCommEvent('order_cancelled', {
          recipientId: before.customer_id,
          payload,
        }).catch(() => {});
      } else {
        emitCommEvent('order_status_changed', {
          recipientId: before.customer_id,
          payload,
        }).catch(() => {});
      }
    });
  }

  const ownerId = before?.businesses?.owner_id;
  const businessNotifyStatuses = ['cancelled', 'on_the_way', 'delivered'];
  if (ownerId && before.status !== status && businessNotifyStatuses.includes(status)) {
    emitCommEvent('order_status_changed', {
      recipientId: ownerId,
      payload: {
        orderId,
        orderNumber: before.order_number,
        status,
        url: '/negocio',
      },
    }).catch(() => {});
  }
}

export async function fallbackOrderToCashPayment(orderId) {
  if (!isSupabaseConfigured || orderId.startsWith('local-')) return;
  await sbExec(
    supabase
      .from('orders')
      .update({ payment_method: 'cash', payment_status: 'pending' })
      .eq('id', orderId),
    'Tiempo agotado actualizando método de pago',
  );
}

export async function cancelOrderByCustomer(orderId, customerId) {
  if (!isSupabaseConfigured || orderId.startsWith('local-')) {
    const order = getLocalOrders().find((o) => o.id === orderId);
    if (!order || order.customer_id !== customerId) throw new Error('No autorizado');
    if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new Error('Ya no puedes cancelar este pedido');
    }
    await updateOrderStatus(orderId, 'cancelled');
    return getLocalOrders().find((o) => o.id === orderId) ?? null;
  }

  const order = await sbFetch(
    supabase
      .from('orders')
      .select('status, customer_id')
      .eq('id', orderId)
      .single(),
    'Tiempo agotado cargando pedido',
  );
  if (order.customer_id !== customerId) throw new Error('No autorizado');
  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new Error('Ya no puedes cancelar este pedido');
  }
  await updateOrderStatus(orderId, 'cancelled');
  return getOrderById(orderId, { viewerId: customerId });
}

export async function cancelOrderByBusiness(orderId, businessId) {
  if (!isSupabaseConfigured || orderId.startsWith('local-')) {
    const order = getLocalOrders().find((o) => o.id === orderId);
    if (!order || order.business_id !== businessId) throw new Error('No autorizado');
    if (!BUSINESS_CANCELLABLE_STATUSES.includes(order.status)) {
      throw new Error('Este pedido ya no se puede cancelar');
    }
    return updateOrderStatus(orderId, 'cancelled');
  }

  const order = await sbFetch(
    supabase
      .from('orders')
      .select('status, business_id')
      .eq('id', orderId)
      .single(),
    'Tiempo agotado cargando pedido',
  );
  if (order.business_id !== businessId) throw new Error('No autorizado');
  if (!BUSINESS_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new Error('Este pedido ya no se puede cancelar');
  }
  return updateOrderStatus(orderId, 'cancelled');
}

export async function assignDriverToOrder(orderId, driverId) {
  if (!isSupabaseConfigured) return;

  const order = await sbFetch(
    supabase
      .from('orders')
      .select('status, business_id, driver_id')
      .eq('id', orderId)
      .single(),
    'Tiempo agotado cargando pedido',
  );

  if (order.driver_id && order.driver_id !== driverId) {
    const result = await reassignOrderDriver(orderId, driverId);
    if (!result?.success) throw new Error('No se pudo reasignar el mensajero');
    return;
  }

  if (order.business_id && order.status !== 'preparing') {
    throw new Error('La tienda debe aceptar y marcar el pedido en preparación antes de asignar mensajero');
  }

  const updates = { driver_id: driverId };
  const now = new Date().toISOString();

  if (!order.business_id && order.status === 'pending') {
    updates.status = 'accepted';
    updates.accepted_at = now;
  }

  await sbExec(
    supabase.from('orders').update(updates).eq('id', orderId),
    'Tiempo agotado asignando mensajero',
  );

  if (driverId) {
    const { data: rider } = await supabase
      .from('drivers')
      .select('user_id, name')
      .eq('id', driverId)
      .maybeSingle();
    const { data: assigned } = await supabase
      .from('orders')
      .select('order_number')
      .eq('id', orderId)
      .single();
    if (rider?.user_id) {
      emitCommEvent('rider_new_offer', {
        recipientId: rider.user_id,
        payload: { orderId, orderNumber: assigned?.order_number },
      }).catch(() => {});
    }
  }
}

export async function getBusinessOrders(businessId) {
  if (!isSupabaseConfigured) {
    return getLocalOrders().filter((o) => o.business_id === businessId);
  }
  const data = await sbFetch(
    supabase
      .from('orders')
      .select('*, order_items(*), drivers(id, name, phone)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando pedidos',
  );
  return data ?? [];
}

export async function getDriverOrders(driverId) {
  if (!isSupabaseConfigured) {
    return getLocalOrders().filter((o) => ['accepted', 'preparing', 'on_the_way'].includes(o.status));
  }
  let query = supabase
    .from('orders')
    .select(`${ORDER_PUBLIC_COLUMNS}, order_items(*)`)
    .in('status', ['accepted', 'preparing', 'on_the_way'])
    .order('created_at', { ascending: false });

  if (driverId) {
    query = query.eq('driver_id', driverId);
  }

  const data = await sbFetch(
    query,
    'Tiempo agotado cargando entregas',
  );
  return data ?? [];
}
