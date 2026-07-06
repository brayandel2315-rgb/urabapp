import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { requireAuthUser, isAdminUser } from '../_shared/auth.ts';

const WOMPI_API = Deno.env.get('WOMPI_ENV') === 'test'
  ? 'https://sandbox.wompi.co/v1'
  : 'https://production.wompi.co/v1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;
    const caller = authResult;

    const privateKey = Deno.env.get('WOMPI_PRIVATE_KEY');
    if (!privateKey) {
      return jsonResponse({ error: 'Wompi no configurado' }, 503);
    }

    const { orderId } = await req.json();
    if (!orderId) return jsonResponse({ error: 'orderId requerido' }, 400);

    const supabase = getServiceClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, total, dest_municipio, payment_status, customer_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) return jsonResponse({ error: 'Pedido no encontrado' }, 404);
    if (caller.id !== 'service-role' && order.customer_id !== caller.id && !(await isAdminUser(caller.id))) {
      return jsonResponse({ error: 'No autorizado' }, 403);
    }
    if (order.payment_status === 'paid') {
      return jsonResponse({ error: 'Pedido ya pagado', paid: true }, 400);
    }

    const appUrl = Deno.env.get('APP_URL') || 'https://urabapp.vercel.app';
    const reference = `urabapp-${order.id}-${Date.now()}`;

    const wompiRes = await fetch(`${WOMPI_API}/payment_links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Pedido ${order.order_number}`,
        description: `Urabapp · ${order.dest_municipio}`,
        single_use: true,
        collect_shipping: false,
        currency: 'COP',
        amount_in_cents: Math.round(order.total * 100),
        redirect_url: `${appUrl}/pedidos/${order.id}?payment=return`,
        reference,
        sku: order.id,
      }),
    });

    const wompiData = await wompiRes.json();
    if (!wompiRes.ok) {
      return jsonResponse({ error: wompiData?.error?.reason || 'Error Wompi' }, 502);
    }

    const checkoutUrl = wompiData?.data?.checkout_url
      || (wompiData?.data?.id ? `https://checkout.wompi.co/l/${wompiData.data.id}` : null);

    if (!checkoutUrl) {
      return jsonResponse({ error: 'Sin URL de checkout' }, 502);
    }

    await supabase.from('payments').insert({
      order_id: order.id,
      amount: order.total,
      method: 'wompi',
      status: 'pending',
      reference,
      checkout_url: checkoutUrl,
      wompi_reference: reference,
    });

    await supabase.from('orders').update({
      payment_method: 'wompi',
      payment_status: 'pending',
    }).eq('id', order.id);

    return jsonResponse({ url: checkoutUrl, reference });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
