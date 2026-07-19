import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getMonthStart, aggregateEconomics } from '../utils/economics';
import { formatCOP } from '../utils/currency';
import { emitCommEvent } from '@/communication';
import { sendCartRecoveryWhatsApp, isWhatsAppApiEnabled } from './whatsapp-api.service';

export async function getCustomerCrmList({ segment, limit = 50 } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('customer_crm_stats')
    .select('*')
    .order('ltv', { ascending: false })
    .limit(limit);
  if (segment) query = query.eq('segment', segment);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getBusinessCrmList({ municipio, limit = 50 } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('business_crm_stats')
    .select('*')
    .eq('is_active', true)
    .order('orders_total', { ascending: false })
    .limit(limit);
  if (municipio) query = query.eq('municipio', municipio);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getRiderCrmList({ limit = 30 } = {}) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('rider_crm_stats')
    .select('*')
    .order('deliveries_count', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getAbandonedCarts({ limit = 30 } = {}) {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from('abandoned_carts')
    .select('*, users(full_name, phone, email)')
    .is('recovered_at', null)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function upsertAbandonedCart({
  userId,
  businessId,
  businessName,
  businessLogo,
  items,
  subtotal,
  municipio,
}) {
  if (!isSupabaseConfigured || !userId || !items?.length) return;
  const { error } = await supabase.from('abandoned_carts').upsert(
    {
      user_id: userId,
      business_id: businessId,
      business_name: businessName,
      business_logo: businessLogo || null,
      items_json: items,
      subtotal,
      municipio,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
  if (error) {
    // Columna business_logo puede no existir aún — reintenta sin ella
    if (String(error.message || '').includes('business_logo')) {
      const { error: retryError } = await supabase.from('abandoned_carts').upsert(
        {
          user_id: userId,
          business_id: businessId,
          business_name: businessName,
          items_json: items,
          subtotal,
          municipio,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      );
      if (retryError) throw retryError;
      return;
    }
    throw error;
  }
}

export async function clearAbandonedCart(userId) {
  if (!isSupabaseConfigured || !userId) return;
  await supabase
    .from('abandoned_carts')
    .update({ recovered_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('recovered_at', null);
}

/**
 * Recuperación potente — in-app + push + banner. stage: nudge | return | urgent
 */
export async function recoverAbandonedCartInApp(cart, { stage = 'nudge' } = {}) {
  if (!isSupabaseConfigured || !cart?.user_id) {
    throw new Error('Carrito inválido');
  }
  const storePath = cart.business_id ? `/tienda/${cart.business_id}` : '/carrito';
  const subtotalLabel = formatCOP(cart.subtotal || 0);
  const businessName = cart.business_name || 'tu tienda';

  await emitCommEvent('cart_recovery', {
    recipientId: cart.user_id,
    payload: {
      cartId: cart.id,
      subtotal: cart.subtotal,
      subtotalLabel,
      businessId: cart.business_id,
      businessName,
      stage,
      url: storePath,
      ctaLabel: 'Completar pedido',
      imageUrl: (() => {
        const items = Array.isArray(cart.items_json) ? cart.items_json : [];
        const hit = items.find((i) => i?.image_url || i?.imageUrl || i?.image);
        return hit?.image_url || hit?.imageUrl || hit?.image || null;
      })(),
      items: Array.isArray(cart.items_json) ? cart.items_json.slice(0, 3) : [],
    },
  });

  if (cart.id) {
    try {
      await supabase
        .from('abandoned_carts')
        .update({
          last_nudge_at: new Date().toISOString(),
          nudge_count: (cart.nudge_count || 0) + 1,
        })
        .eq('id', cart.id);
    } catch {
      /* columnas nuevas pueden no existir aún */
    }
  }

  return { sent: true, stage, url: storePath };
}

/** Carrito abandonado activo del usuario (para nudge al volver a la app). */
export async function getMyAbandonedCart(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await supabase
    .from('abandoned_carts')
    .select('*')
    .eq('user_id', userId)
    .is('recovered_at', null)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function recoverAbandonedCartWhatsApp(cart) {
  if (!cart?.users?.phone) throw new Error('Sin teléfono registrado');
  if (!isWhatsAppApiEnabled()) throw new Error('WhatsApp API no habilitado (VITE_WHATSAPP_API_ENABLED)');

  const result = await sendCartRecoveryWhatsApp({
    phone: cart.users.phone,
    businessName: cart.business_name,
    subtotal: cart.subtotal,
  });
  if (!result?.sent) throw new Error(result?.error || 'No se pudo enviar por WhatsApp API');

  await emitCommEvent('cart_recovery', {
    recipientId: cart.user_id,
    payload: {
      cartId: cart.id,
      subtotal: cart.subtotal,
      channel: 'whatsapp_api',
    },
  }).catch(() => {});

  return result;
}

export async function getExecutiveDashboard() {
  if (!isSupabaseConfigured) return null;

  const monthStart = getMonthStart();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const [
    monthOrdersRes,
    weekOrdersRes,
    allOrdersRes,
    customersRes,
    businessesRes,
    ridersRes,
    abandonedRes,
    ticketsRes,
    reviewsRes,
    eventsRes,
  ] = await Promise.all([
    supabase.from('orders').select(`
      id, status, total, subtotal, delivery_fee, discount, dest_municipio,
      commission_amount, platform_gross, platform_margin, rider_payout, created_at, source
    `).gte('created_at', monthStart),
    supabase.from('orders').select('id, status, total, created_at')
      .gte('created_at', weekAgo).neq('status', 'cancelled'),
    supabase.from('orders').select('id, status, total, customer_id, created_at')
      .order('created_at', { ascending: false }).limit(500),
    supabase.from('customer_crm_stats').select('segment, ltv, order_count'),
    supabase.from('business_crm_stats').select('id, gmv, orders_total, orders_cancelled, municipio'),
    supabase.from('rider_crm_stats').select('id, is_online, deliveries_count, earnings_month'),
    supabase.from('abandoned_carts').select('id, subtotal').is('recovered_at', null),
    supabase.from('support_tickets').select('id, status').eq('status', 'open'),
    supabase.from('reviews').select('business_rating, driver_rating'),
    supabase.from('analytics_events').select('event_name').gte('created_at', weekAgo),
  ]);

  const monthEconomics = aggregateEconomics(monthOrdersRes.data ?? []);
  const allOrders = allOrdersRes.data ?? [];
  const customers = customersRes.data ?? [];
  const businesses = businessesRes.data ?? [];
  const riders = ridersRes.data ?? [];
  const reviews = reviewsRes.data ?? [];

  const segmentCounts = customers.reduce((acc, c) => {
    acc[c.segment] = (acc[c.segment] || 0) + 1;
    return acc;
  }, {});

  const zoneGmv = (monthOrdersRes.data ?? [])
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => {
      const z = o.dest_municipio || 'Otro';
      acc[z] = (acc[z] || 0) + (o.total || 0);
      return acc;
    }, {});

  const sourceBreakdown = (monthOrdersRes.data ?? [])
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => {
      const s = o.source || 'pwa';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

  const funnel = (eventsRes.data ?? []).reduce((acc, e) => {
    acc[e.event_name] = (acc[e.event_name] || 0) + 1;
    return acc;
  }, {});

  const npsProxy = reviews.length
    ? Math.round((
      reviews.filter((r) => (r.business_rating ?? r.driver_rating ?? 0) >= 4).length / reviews.length
    ) * 100)
    : null;

  const abandonedValue = (abandonedRes.data ?? []).reduce((s, c) => s + (c.subtotal || 0), 0);

  const uniqueCustomers = new Set(allOrders.map((o) => o.customer_id).filter(Boolean));
  const repeatCustomers = allOrders.reduce((acc, o) => {
    if (o.customer_id) acc[o.customer_id] = (acc[o.customer_id] || 0) + 1;
    return acc;
  }, {});
  const retentionRate = uniqueCustomers.size
    ? Math.round((Object.values(repeatCustomers).filter((c) => c > 1).length / uniqueCustomers.size) * 100)
    : 0;

  return {
    gmvMonth: monthEconomics.gmv,
    ordersMonth: monthEconomics.orderCount,
    marginMonth: monthEconomics.platformMargin,
    grossMonth: monthEconomics.platformGross,
    ordersWeek: (weekOrdersRes.data ?? []).length,
    totalCustomers: customers.length,
    totalBusinesses: businesses.length,
    onlineRiders: riders.filter((r) => r.is_online).length,
    totalRiders: riders.length,
    segmentCounts,
    zoneGmv,
    sourceBreakdown,
    funnel,
    npsProxy,
    retentionRate,
    abandonedCarts: abandonedRes.data?.length ?? 0,
    abandonedValue,
    openTickets: ticketsRes.data?.length ?? 0,
    alerts: buildExecutiveAlerts({
      pendingTickets: ticketsRes.data?.length ?? 0,
      abandonedCarts: abandonedRes.data?.length ?? 0,
      onlineRiders: riders.filter((r) => r.is_online).length,
      ordersMonth: monthEconomics.orderCount,
    }),
  };
}

function buildExecutiveAlerts({ pendingTickets, abandonedCarts, onlineRiders, ordersMonth }) {
  const alerts = [];
  if (onlineRiders === 0) {
    alerts.push({ level: 'high', message: 'Sin mensajeros en línea', action: 'Activar riders' });
  }
  if (abandonedCarts > 0) {
    alerts.push({ level: 'medium', message: `${abandonedCarts} carritos abandonados`, action: 'Ver CRM' });
  }
  if (pendingTickets > 0) {
    alerts.push({ level: 'medium', message: `${pendingTickets} tickets abiertos`, action: 'Resolver soporte' });
  }
  if (ordersMonth < 10) {
    alerts.push({ level: 'low', message: 'Volumen bajo este mes', action: 'Impulsar adquisición' });
  }
  return alerts;
}

export async function getSupportTickets({ status = 'open', limit = 20 } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('support_tickets')
    .select('*, users(full_name, phone, email)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateTicketStatus(ticketId, status) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const payload = { status, updated_at: new Date().toISOString() };
  if (status === 'resolved' || status === 'closed') payload.resolved_at = new Date().toISOString();
  const { data, error } = await supabase
    .from('support_tickets')
    .update(payload)
    .eq('id', ticketId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
