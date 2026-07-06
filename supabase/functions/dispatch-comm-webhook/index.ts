import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { requireAuthUser } from '../_shared/auth.ts';
import { deliverOutboundWebhooks } from '../_shared/notifications.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;
    const caller = authResult;

    const supabase = getServiceClient();
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', caller.id)
      .maybeSingle();

    if (profile?.role !== 'ADMIN') {
      return jsonResponse({ error: 'Solo administradores', delivered: 0 }, 403);
    }

    const { eventKey, payload = {}, recipientId = null } = await req.json();
    if (!eventKey) {
      return jsonResponse({ error: 'eventKey requerido' }, 400);
    }

    const delivered = await deliverOutboundWebhooks(eventKey, {
      ...payload,
      recipient_id: recipientId,
      relayed_by: caller.id,
    });

    return jsonResponse({ delivered });
  } catch (err) {
    return jsonResponse({ error: String(err), delivered: 0 }, 500);
  }
});
