import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { requireAuthUser, canSendPushTo } from '../_shared/auth.ts';

import webpush from 'npm:web-push@3.6.7';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;
    const caller = authResult;

    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const subject = Deno.env.get('VAPID_SUBJECT') || 'mailto:brayandel001@gmail.com';

    if (!publicKey || !privateKey) {
      return jsonResponse({ error: 'VAPID no configurado', sent: 0 }, 503);
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const bodyJson = await req.json();
    const {
      userId,
      title,
      body,
      data,
      image,
      icon,
      tag,
    } = bodyJson;

    if (!userId || !title) {
      return jsonResponse({ error: 'userId y title requeridos' }, 400);
    }

    if (!(await canSendPushTo(caller.id, userId))) {
      return jsonResponse({ error: 'No autorizado para enviar a este usuario' }, 403);
    }

    const supabase = getServiceClient();
    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, keys')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (!subs?.length) {
      return jsonResponse({ sent: 0, reason: 'no_subscriptions' });
    }

    const orderId = data?.order_id || data?.orderId;
    const resolvedUrl = data?.url
      || data?.deep_link
      || data?.deepLink
      || (orderId ? `/pedidos/${orderId}` : '/pedidos');
    const resolvedImage = image
      || data?.image
      || data?.imageUrl
      || data?.image_url
      || null;
    const resolvedIcon = icon || resolvedImage || '/app-icon.png';
    const resolvedTag = tag || (orderId ? `order-${orderId}` : (data?.event_key || 'urabapp'));

    const payload = JSON.stringify({
      title,
      body: body || '',
      icon: resolvedIcon,
      image: resolvedImage,
      tag: resolvedTag,
      data: {
        ...(data || {}),
        url: resolvedUrl,
        image: resolvedImage,
      },
      url: resolvedUrl,
      actions: [
        { action: 'open', title: 'Ver pedido' },
        { action: 'dismiss', title: 'Cerrar' },
      ],
    });

    let sent = 0;
    const stale: string[] = [];

    await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload,
        );
        sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          stale.push(sub.endpoint);
        }
      }
    }));

    if (stale.length) {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', userId)
        .in('endpoint', stale);
    }

    return jsonResponse({ sent, stale: stale.length });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});
