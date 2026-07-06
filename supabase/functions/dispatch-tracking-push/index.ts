import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { isServiceRoleRequest, requireAuthUser, isAdminUser } from '../_shared/auth.ts';
import webpush from 'npm:web-push@3.6.7';

async function processOutbox(limit = 25) {
  const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
  const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
  const subject = Deno.env.get('VAPID_SUBJECT') || 'mailto:brayandel001@gmail.com';

  if (!publicKey || !privateKey) {
    return { error: 'VAPID no configurado', processed: 0, sent: 0, status: 503 };
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);

  const supabase = getServiceClient();
  const { data: rows } = await supabase
    .from('tracking_push_outbox')
    .select('id, user_id, title, body, payload')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit);

  if (!rows?.length) {
    return { processed: 0, sent: 0 };
  }

  let sent = 0;
  const processed: string[] = [];

  for (const row of rows) {
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, keys')
      .eq('user_id', row.user_id)
      .eq('is_active', true);

    if (!subs?.length) {
      await supabase
        .from('tracking_push_outbox')
        .update({ status: 'failed', sent_at: new Date().toISOString() })
        .eq('id', row.id);
      processed.push(row.id);
      continue;
    }

    const payload = JSON.stringify({
      title: row.title,
      body: row.body || '',
      data: row.payload || {},
      url: row.payload?.url || (row.payload?.orderId ? `/pedidos/${row.payload.orderId}` : '/pedidos'),
    });

    let rowSent = 0;
    const stale: string[] = [];

    await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload,
        );
        rowSent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) stale.push(sub.endpoint);
      }
    }));

    if (stale.length) {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', row.user_id)
        .in('endpoint', stale);
    }

    await supabase
      .from('tracking_push_outbox')
      .update({
        status: rowSent > 0 ? 'sent' : 'failed',
        sent_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    sent += rowSent;
    processed.push(row.id);
  }

  return { processed: processed.length, sent };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (!isServiceRoleRequest(req)) {
      const authResult = await requireAuthUser(req);
      if (authResult instanceof Response) return authResult;
      if (!(await isAdminUser(authResult.id))) {
        return jsonResponse({ error: 'Solo admin o service role' }, 403);
      }
    }

    const result = await processOutbox();
    if (result.status === 503) {
      return jsonResponse(result, 503);
    }
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
