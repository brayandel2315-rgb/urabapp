import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { requireAuthUser, isAdminUser } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;
    const caller = authResult;

    const { orderId } = await req.json();
    if (!orderId) return jsonResponse({ error: 'orderId requerido' }, 400);

    const supabase = getServiceClient();

    if (caller.id !== 'service-role') {
      const { data: order } = await supabase
        .from('orders')
        .select('customer_id, business_id')
        .eq('id', orderId)
        .maybeSingle();

      if (!order) return jsonResponse({ error: 'Pedido no encontrado' }, 404);

      const isAdmin = await isAdminUser(caller.id);
      let allowed = isAdmin;

      if (!allowed && order.customer_id === caller.id) {
        allowed = true;
      }

      if (!allowed && order.business_id) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('owner_id')
          .eq('id', order.business_id)
          .maybeSingle();
        allowed = biz?.owner_id === caller.id;
      }

      if (!allowed) {
        return jsonResponse({ error: 'No autorizado' }, 403);
      }
    }

    const { data: riderId, error } = await supabase.rpc('assign_best_rider', {
      p_order_id: orderId,
    });

    if (error) return jsonResponse({ error: error.message }, 500);

    return jsonResponse({ riderId: riderId || null, assigned: Boolean(riderId) });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
