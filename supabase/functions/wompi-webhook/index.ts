import { jsonResponse } from '../_shared/cors.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';
import { getServiceClient } from '../_shared/supabase.ts';

async function verifyWompiSignature(body: unknown, signature: string | null): Promise<boolean> {
  const secret = Deno.env.get('WOMPI_EVENTS_SECRET');
  if (!secret) {
    console.error('WOMPI_EVENTS_SECRET no configurado — webhook rechazado');
    return false;
  }
  if (!signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(JSON.stringify(body)));
  const hex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex === signature;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const payload = await req.json();
    const event = payload?.event;

    if (event && event !== 'transaction.updated') {
      return jsonResponse({ ok: true, skipped: true, reason: 'event_ignored' });
    }

    const signature = req.headers.get('x-event-checksum');
    const valid = await verifyWompiSignature(payload, signature);
    if (!valid) {
      return jsonResponse({ error: 'invalid signature' }, 401);
    }

    const transaction = payload?.data?.transaction;
    if (!transaction?.reference) {
      return jsonResponse({ ok: true, skipped: true });
    }

    const status = transaction.status;
    const reference = transaction.reference as string;
    const supabase = getServiceClient();

    const { data: shipmentPayment } = await supabase
      .from('shipment_payments')
      .select('id, shipment_id, status')
      .eq('wompi_reference', reference)
      .maybeSingle();

    if (shipmentPayment) {
      const paymentStatus = status === 'APPROVED' ? 'completed'
        : status === 'DECLINED' || status === 'ERROR' ? 'failed'
        : 'pending';

      await supabase.from('shipment_payments').update({
        status: paymentStatus,
        wompi_transaction_id: transaction.id,
        provider_ref: transaction.id,
      }).eq('id', shipmentPayment.id);

      if (paymentStatus === 'failed') {
        const { data: shipment } = await supabase
          .from('shipment_orders')
          .select('id, customer_id')
          .eq('id', shipmentPayment.shipment_id)
          .maybeSingle();
        if (shipment?.customer_id) {
          await emitCommunicationEvent({
            eventKey: 'payment_failed',
            recipientId: shipment.customer_id,
            category: 'payments',
            priority: 'critical',
            title: 'Pago de envío no procesado',
            body: 'Intenta de nuevo o elige otro método de pago.',
            deepLink: `/envios/${shipment.id}`,
            payload: { shipment_id: shipment.id, reference },
          });
        }
        return jsonResponse({ ok: true, paymentStatus, type: 'shipment' });
      }

      if (paymentStatus !== 'completed') {
        return jsonResponse({ ok: true, paymentStatus, type: 'shipment' });
      }

      const { data: shipment } = await supabase
        .from('shipment_orders')
        .update({ payment_status: 'paid', status: 'searching_carrier' })
        .eq('id', shipmentPayment.shipment_id)
        .select('id, shipment_number, customer_id')
        .single();

      await supabase.rpc('publish_shipment_assignments', {
        p_shipment_id: shipmentPayment.shipment_id,
        p_limit: 5,
      });

      await supabase.rpc('log_shipment_event', {
        p_shipment_id: shipmentPayment.shipment_id,
        p_event_type: 'payment_confirmed',
        p_status: 'searching_carrier',
        p_metadata: { reference },
      });

      if (shipment?.customer_id) {
        await emitCommunicationEvent({
          eventKey: 'payment_approved',
          recipientId: shipment.customer_id,
          category: 'payments',
          title: `Pago confirmado — ${shipment.shipment_number}`,
          body: 'Buscando transportista para tu envío intermunicipal.',
          deepLink: `/envios/${shipment.id}`,
          payload: { shipment_id: shipment.id, reference },
        });
      }

      return jsonResponse({ ok: true, paymentStatus, type: 'shipment' });
    }

    const { data: payment } = await supabase
      .from('payments')
      .select('id, order_id, status')
      .eq('wompi_reference', reference)
      .maybeSingle();

    if (!payment) {
      const { data: membershipPayment } = await supabase
        .from('membership_payments')
        .select('id, user_id, plan_id, status')
        .eq('wompi_reference', reference)
        .maybeSingle();

      if (membershipPayment) {
        const paymentStatus = status === 'APPROVED' ? 'paid'
          : status === 'DECLINED' || status === 'ERROR' ? 'failed'
          : 'pending';

        await supabase.from('membership_payments').update({
          status: paymentStatus,
          wompi_transaction_id: transaction.id,
          paid_at: paymentStatus === 'paid' ? new Date().toISOString() : null,
        }).eq('id', membershipPayment.id);

        if (paymentStatus === 'paid') {
          const expires = new Date();
          expires.setMonth(expires.getMonth() + 1);
          await supabase.from('user_subscriptions').upsert({
            user_id: membershipPayment.user_id,
            plan_id: membershipPayment.plan_id,
            status: 'active',
            started_at: new Date().toISOString(),
            expires_at: expires.toISOString(),
            cancelled_at: null,
          }, { onConflict: 'user_id' });

          await emitCommunicationEvent({
            eventKey: 'membership_activated',
            recipientId: membershipPayment.user_id,
            category: 'account',
            title: 'UrabApp Pro activado',
            body: 'Tu membresía Pro está activa. Disfruta envíos reducidos y beneficios exclusivos.',
            deepLink: '/cuenta/membresia',
            payload: { plan_id: membershipPayment.plan_id, reference },
          });
        } else if (paymentStatus === 'failed') {
          await emitCommunicationEvent({
            eventKey: 'payment_failed',
            recipientId: membershipPayment.user_id,
            category: 'payments',
            priority: 'critical',
            title: 'Pago de membresía no procesado',
            body: 'Intenta de nuevo desde tu cuenta.',
            deepLink: '/cuenta/membresia',
            payload: { reference },
          });
        }

        return jsonResponse({ ok: true, paymentStatus, type: 'membership' });
      }

      return jsonResponse({ ok: true, skipped: true, reason: 'payment_not_found' });
    }

    const paymentStatus = status === 'APPROVED' ? 'paid'
      : status === 'DECLINED' || status === 'ERROR' ? 'failed'
      : 'pending';

    await supabase.from('payments').update({
      status: paymentStatus,
      wompi_transaction_id: transaction.id,
      webhook_payload: payload,
    }).eq('id', payment.id);

    if (paymentStatus === 'failed') {
      const { data: order } = await supabase
        .from('orders')
        .select('id, order_number, customer_id')
        .eq('id', payment.order_id)
        .maybeSingle();
      if (order?.customer_id) {
        await emitCommunicationEvent({
          eventKey: 'payment_failed',
          recipientId: order.customer_id,
          category: 'payments',
          priority: 'critical',
          title: 'Pago no procesado',
          body: 'Intenta de nuevo o elige efectivo contra entrega.',
          deepLink: `/pedidos/${order.id}`,
          payload: { order_id: order.id, reference },
        });
      }
      return jsonResponse({ ok: true, paymentStatus });
    }

    if (paymentStatus !== 'paid') {
      return jsonResponse({ ok: true, paymentStatus });
    }

    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, order_number, customer_id, status, order_type, business_id')
      .eq('id', payment.order_id)
      .single();

    const orderUpdates: Record<string, string> = { payment_status: 'paid' };
    if (!existingOrder?.business_id && existingOrder?.order_type !== 'courier') {
      orderUpdates.status = 'accepted';
      orderUpdates.accepted_at = new Date().toISOString();
    }

    const { data: order } = await supabase
      .from('orders')
      .update(orderUpdates)
      .eq('id', payment.order_id)
      .select('id, order_number, customer_id, status, order_type, business_id')
      .single();

    let offersPublished = 0;
    if (order?.order_type === 'courier') {
      const { data: count } = await supabase.rpc('publish_courier_offers', {
        p_order_id: payment.order_id,
        p_radius_km: 5,
      });
      offersPublished = Number(count) || 0;
    }

    if (order?.customer_id) {
      const body = order.business_id
        ? 'Pago confirmado. El comercio preparará tu pedido y te avisamos cuando salga el mensajero.'
        : order.order_type === 'courier'
          ? 'Pago confirmado. Buscando mensajero disponible…'
          : 'Pago confirmado. Buscando mensajero…';

      await emitCommunicationEvent({
        eventKey: 'payment_approved',
        recipientId: order.customer_id,
        category: 'payments',
        title: `Pago confirmado — ${order.order_number || order.id.slice(0, 8)}`,
        body,
        deepLink: `/pedidos/${order.id}`,
        payload: { order_id: order.id, reference },
      });
    }

    if (offersPublished > 0) {
      const { data: offers } = await supabase
        .from('courier_offers')
        .select('driver_id, drivers(user_id)')
        .eq('order_id', payment.order_id)
        .eq('status', 'pending');

      for (const offer of offers ?? []) {
        const userId = offer.drivers?.user_id;
        if (userId) {
          await emitCommunicationEvent({
            eventKey: 'rider_new_offer',
            recipientId: userId,
            category: 'orders',
            priority: 'critical',
            title: 'Nueva entrega disponible',
            body: `Pedido ${order?.order_number || payment.order_id.slice(0, 8)} — acepta en la app`,
            deepLink: '/domiciliario',
            payload: { order_id: payment.order_id },
          });
        }
      }
    }

    return jsonResponse({ ok: true, paymentStatus, offersPublished });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
