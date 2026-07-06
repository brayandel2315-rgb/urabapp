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

    const { shipmentId } = await req.json();
    if (!shipmentId) return jsonResponse({ error: 'shipmentId requerido' }, 400);

    const supabase = getServiceClient();
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipment_orders')
      .select('id, shipment_number, total_cop, origin_municipio, dest_municipio, payment_status, customer_id')
      .eq('id', shipmentId)
      .single();

    if (shipmentError || !shipment) return jsonResponse({ error: 'Envío no encontrado' }, 404);
    if (caller.id !== 'service-role' && shipment.customer_id !== caller.id && !(await isAdminUser(caller.id))) {
      return jsonResponse({ error: 'No autorizado' }, 403);
    }
    if (shipment.payment_status === 'paid') {
      return jsonResponse({ error: 'Envío ya pagado', paid: true }, 400);
    }

    const appUrl = Deno.env.get('APP_URL') || 'https://urabapp.vercel.app';
    const reference = `urabapp-shp-${shipment.id}-${Date.now()}`;

    const wompiRes = await fetch(`${WOMPI_API}/payment_links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Envío ${shipment.shipment_number}`,
        description: `Urabapp · ${shipment.origin_municipio} → ${shipment.dest_municipio}`,
        single_use: true,
        collect_shipping: false,
        currency: 'COP',
        amount_in_cents: Math.round(shipment.total_cop * 100),
        redirect_url: `${appUrl}/envios/${shipment.id}?payment=return`,
        reference,
        sku: shipment.id,
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

    await supabase.from('shipment_payments').upsert({
      shipment_id: shipment.id,
      amount_cop: shipment.total_cop,
      method: 'wompi',
      status: 'pending',
      wompi_reference: reference,
      checkout_url: checkoutUrl,
    }, { onConflict: 'shipment_id' });

    return jsonResponse({ url: checkoutUrl, reference });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
