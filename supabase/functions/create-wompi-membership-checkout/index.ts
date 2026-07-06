import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { requireAuthUser } from '../_shared/auth.ts';

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

    const { planId = 'pro' } = await req.json();
    const supabase = getServiceClient();

    const { data: plan, error: planError } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .maybeSingle();

    if (planError || !plan) {
      return jsonResponse({ error: 'Plan no encontrado' }, 404);
    }

    if (!plan.price_monthly || plan.price_monthly <= 0) {
      return jsonResponse({ error: 'Este plan no requiere pago' }, 400);
    }

    const appUrl = Deno.env.get('APP_URL') || 'https://urabapp.vercel.app';
    const reference = `urabapp-pro-${caller.id}-${Date.now()}`;

    const wompiRes = await fetch(`${WOMPI_API}/payment_links`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `UrabApp ${plan.name}`,
        description: 'Membresía mensual UrabApp Pro',
        single_use: true,
        collect_shipping: false,
        currency: 'COP',
        amount_in_cents: Math.round(plan.price_monthly * 100),
        redirect_url: `${appUrl}/cuenta/membresia?payment=return`,
        reference,
        sku: `membership-${planId}`,
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

    await supabase.from('membership_payments').insert({
      user_id: caller.id,
      plan_id: planId,
      amount: plan.price_monthly,
      status: 'pending',
      wompi_reference: reference,
      checkout_url: checkoutUrl,
    });

    return jsonResponse({ url: checkoutUrl, reference });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
