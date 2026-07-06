import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { emitCommEvent } from '@/communication';
import { sanitizeText } from '../utils/validate';

const ORDER_PARTICIPANTS_SELECT =
  'customer_id, business_id, driver_id, order_number, businesses(owner_id, name), drivers(user_id)';

async function fetchOrderParticipants(orderId) {
  const { data: order } = await supabase
    .from('orders')
    .select(ORDER_PARTICIPANTS_SELECT)
    .eq('id', orderId)
    .single();
  return order;
}

async function resolveSenderRole(userId, orderId) {
  const order = await fetchOrderParticipants(orderId);

  if (!order) return 'client';
  if (order.customer_id === userId) return 'client';
  if (order.businesses?.owner_id === userId) return 'business';
  if (order.drivers?.user_id === userId) return 'rider';

  const { data: user } = await supabase.from('users').select('role').eq('id', userId).maybeSingle();
  if (user?.role === 'ADMIN') return 'support';
  return 'client';
}

async function notifyOrderChatParticipants(orderId, senderId, body) {
  const order = await fetchOrderParticipants(orderId);
  if (!order) return;

  const recipients = new Set();
  if (order.customer_id && order.customer_id !== senderId) recipients.add(order.customer_id);
  if (order.businesses?.owner_id && order.businesses.owner_id !== senderId) {
    recipients.add(order.businesses.owner_id);
  }
  if (order.drivers?.user_id && order.drivers.user_id !== senderId) {
    recipients.add(order.drivers.user_id);
  }

  const preview = body.length > 80 ? `${body.slice(0, 77)}…` : body;
  await Promise.all([...recipients].map((userId) =>
    emitCommEvent('order_chat_message', {
      recipientId: userId,
      actorId: senderId,
      payload: {
        orderId,
        orderNumber: order.order_number,
        title: `Mensaje — ${order.order_number}`,
        body: preview,
      },
    }).catch(() => {}),
  ));
}

export async function getMySupportTickets(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const data = await sbFetch(
    supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false }),
    'Tiempo agotado cargando consultas de soporte',
  );
  return data ?? [];
}

export async function createSupportTicket(userId, { subject, body, orderId = null }) {
  if (!isSupabaseConfigured || !userId) throw new Error('Debes iniciar sesión');

  const safeSubject = sanitizeText(subject, 120);
  const safeBody = sanitizeText(body, 2000);
  if (!safeSubject || !safeBody) throw new Error('Escribe un asunto y un mensaje');

  const ticket = await sbFetch(
    supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        order_id: orderId,
        subject: safeSubject,
        body: safeBody,
        status: 'open',
      })
      .select()
      .single(),
    'Tiempo agotado creando consulta de soporte',
  );

  await sbExec(
    supabase.from('support_messages').insert({
      ticket_id: ticket.id,
      sender_id: userId,
      is_staff: false,
      body: safeBody,
    }),
    'Tiempo agotado guardando mensaje de soporte',
  );

  emitCommEvent('support_ticket_created', {
    recipientId: userId,
    actorId: userId,
    payload: { ticketId: ticket.id, subject: safeSubject, orderId },
  }).catch(() => {});

  return ticket;
}

export async function getSupportMessages(ticketId) {
  if (!isSupabaseConfigured || !ticketId) return [];
  const data = await sbFetch(
    supabase
      .from('support_messages')
      .select('*, users(full_name, role)')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true }),
    'Tiempo agotado cargando mensajes',
  );
  return data ?? [];
}

export async function sendSupportMessage({ ticketId, senderId, body, isStaff = false }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');

  const safeBody = sanitizeText(body, 2000);
  if (!safeBody) throw new Error('Escribe un mensaje');

  const data = await sbFetch(
    supabase
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        sender_id: senderId,
        is_staff: isStaff,
        body: safeBody,
      })
      .select()
      .single(),
    'Tiempo agotado enviando mensaje de soporte',
  );

  await sbExec(
    supabase
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString(), status: isStaff ? 'in_progress' : 'open' })
      .eq('id', ticketId),
    'Tiempo agotado actualizando ticket de soporte',
  );

  if (isStaff) {
    const { data: ticket } = await supabase
      .from('support_tickets')
      .select('user_id, subject')
      .eq('id', ticketId)
      .single();
    if (ticket?.user_id) {
      const { emitCommEvent } = await import('@/communication');
      await emitCommEvent('support_ticket_reply', {
        recipientId: ticket.user_id,
        actorId: senderId,
        payload: {
          ticketId,
          title: 'Respuesta de soporte',
          body: safeBody.slice(0, 120),
        },
      }).catch(() => {});
    }
  }

  return data;
}

export async function markOrderChatRead(orderId) {
  if (!isSupabaseConfigured || !orderId) return;
  await sbExec(
    supabase.rpc('mark_order_chat_read', { p_order_id: orderId }),
    'Tiempo agotado marcando chat leído',
  ).catch(() => {});
  await markOrderChatNotificationsRead(orderId).catch(() => {});
}

export async function markOrderChatNotificationsRead(orderId) {
  if (!isSupabaseConfigured || !orderId) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return;
  await sbExec(
    supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
      .eq('category', 'messages')
      .contains('data', { orderId }),
    'Tiempo agotado marcando notificaciones de chat',
  ).catch(() => {});
}

export async function getOrderMessages(orderId) {
  if (!isSupabaseConfigured || !orderId) return [];
  const data = await sbFetch(
    supabase
      .from('order_messages')
      .select('*, users(full_name)')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true }),
    'Tiempo agotado cargando mensajes del pedido',
  );
  return data ?? [];
}

export async function sendOrderMessage({ orderId, senderId, body }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');

  const safeBody = sanitizeText(body, 2000);
  if (!safeBody) throw new Error('Escribe un mensaje');

  const senderRole = await resolveSenderRole(senderId, orderId);
  const data = await sbFetch(
    supabase
      .from('order_messages')
      .insert({
        order_id: orderId,
        sender_id: senderId,
        sender_role: senderRole,
        body: safeBody,
      })
      .select()
      .single(),
    'Tiempo agotado enviando mensaje del pedido',
  );

  notifyOrderChatParticipants(orderId, senderId, safeBody).catch(() => {});
  return data;
}

export async function getAllSupportTickets({ status = 'open', limit = 30 } = {}) {
  if (!isSupabaseConfigured) return [];
  let query = supabase
    .from('support_tickets')
    .select('*, users(full_name, phone, email)')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (status !== 'all') query = query.eq('status', status);
  const data = await sbFetch(query, 'Tiempo agotado cargando consultas de soporte');
  return data ?? [];
}
