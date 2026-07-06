import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { getAuthUser, isAdminUser } from '../_shared/auth.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type CustomerRow = {
  customer_id: string;
  segment: string;
};

function aggregateCustomers(
  orders: Array<{ customer_id: string; total: number; status: string; created_at: string }>,
): CustomerRow[] {
  const map = new Map<string, {
    order_count: number;
    last_order_at: string;
  }>();

  for (const o of orders) {
    if (!o.customer_id || o.status === 'cancelled') continue;
    const prev = map.get(o.customer_id) || { order_count: 0, last_order_at: '' };
    prev.order_count += 1;
    if (!prev.last_order_at || o.created_at > prev.last_order_at) {
      prev.last_order_at = o.created_at;
    }
    map.set(o.customer_id, prev);
  }

  const now = Date.now();
  const rows: CustomerRow[] = [];
  for (const [customer_id, stats] of map.entries()) {
    const daysSince = (now - new Date(stats.last_order_at).getTime()) / (1000 * 60 * 60 * 24);
    let segment = 'recurring';
    if (stats.order_count <= 1) segment = 'new';
    else if (stats.order_count >= 3) segment = 'loyal';
    if (daysSince > 30) segment = 'at_risk';
    rows.push({ customer_id, segment });
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const user = await getAuthUser(req);
    if (!user) return jsonResponse({ error: 'No autorizado' }, 401);

    const body = await req.json();
    const businessId = body.businessId as string;
    const message = String(body.message || '').trim();
    const campaignType = (body.campaignType as string) || 'winback';
    const targetSegment = body.targetSegment as string | null;
    const customerIds = body.customerIds as string[] | undefined;

    if (!businessId || !message) {
      return jsonResponse({ error: 'businessId y message requeridos' }, 400);
    }
    if (message.length > 500) {
      return jsonResponse({ error: 'Mensaje máximo 500 caracteres' }, 400);
    }

    const supabase = getServiceClient();
    const { data: business, error: bizErr } = await supabase
      .from('businesses')
      .select('id, name, slug, owner_id')
      .eq('id', businessId)
      .single();

    if (bizErr || !business) return jsonResponse({ error: 'Comercio no encontrado' }, 404);
    if (business.owner_id !== user.id && !(await isAdminUser(user.id))) {
      return jsonResponse({ error: 'No autorizado' }, 403);
    }

    const { data: orders } = await supabase
      .from('orders')
      .select('customer_id, total, status, created_at')
      .eq('business_id', businessId);

    const aggregated = aggregateCustomers(orders ?? []);
    let targets = aggregated;

    if (customerIds?.length) {
      const allowed = new Set(aggregated.map((r) => r.customer_id));
      targets = customerIds.filter((id) => allowed.has(id)).map((id) => ({
        customer_id: id,
        segment: aggregated.find((r) => r.customer_id === id)?.segment || 'recurring',
      }));
    } else if (targetSegment) {
      targets = aggregated.filter((r) => r.segment === targetSegment);
    }

    if (targets.length > 25) {
      return jsonResponse({ error: 'Máximo 25 clientes por campaña' }, 400);
    }
    if (!targets.length) {
      return jsonResponse({ sent: 0, notified: 0, reason: 'no_targets' });
    }

    const storePath = business.slug ? `/tienda/${business.slug}` : `/business/${business.id}`;
    const title = `${business.name} te extraña`;
    let notified = 0;

    for (const target of targets) {
      await emitCommunicationEvent({
        eventKey: 'business_campaign_sent',
        recipientId: target.customer_id,
        category: 'marketing',
        priority: 'medium',
        title,
        body: message,
        deepLink: storePath,
        payload: {
          business_id: businessId,
          campaign_type: campaignType,
          segment: target.segment,
        },
      });

      await supabase.from('business_customer_campaigns').insert({
        business_id: businessId,
        customer_id: target.customer_id,
        message,
        campaign_type: campaignType,
        created_by: user.id,
      });

      notified += 1;
    }

    return jsonResponse({
      sent: targets.length,
      notified,
      pushed: notified,
      storePath,
      targets: targets.map((t) => t.customer_id),
    });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
