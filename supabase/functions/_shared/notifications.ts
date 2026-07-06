import { getServiceClient } from './supabase.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

type EmitParams = {
  eventKey: string;
  recipientId: string;
  category?: string;
  priority?: string;
  title: string;
  body: string;
  deepLink?: string;
  payload?: Record<string, unknown>;
  push?: boolean;
};

/** Emite evento al Centro de Comunicación (in-app + push). */
export async function emitCommunicationEvent({
  eventKey,
  recipientId,
  category = 'payments',
  priority = 'high',
  title,
  body,
  deepLink,
  payload = {},
  push = true,
}: EmitParams) {
  if (!recipientId) return;

  const supabase = getServiceClient();
  const enrichedPayload = {
    ...payload,
    url: deepLink,
    event_key: eventKey,
  };

  await supabase.rpc('emit_communication_event', {
    p_event_key: eventKey,
    p_category: category,
    p_priority: priority,
    p_recipient_id: recipientId,
    p_title: title,
    p_body: body,
    p_payload: enrichedPayload,
    p_deep_link: deepLink ?? null,
    p_actor_id: null,
    p_icon: null,
    p_color: null,
    p_channels: ['in_app'],
  });

  if (!push) return;

  await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      apikey: SERVICE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: recipientId,
      title,
      body,
      data: enrichedPayload,
    }),
  }).catch(() => {});

  await deliverOutboundWebhooks(eventKey, {
    ...enrichedPayload,
    recipient_id: recipientId,
    title,
    body,
    category,
    priority,
  });
}

/** Webhooks salientes registrados por admin (n8n, Zapier, etc.). */
export async function deliverOutboundWebhooks(
  eventKey: string,
  payload: Record<string, unknown>,
): Promise<number> {
  const supabase = getServiceClient();
  const { data: hooks } = await supabase
    .from('communication_webhooks')
    .select('id, url, secret, event_keys')
    .eq('is_active', true);

  let delivered = 0;
  for (const hook of hooks ?? []) {
    const keys = hook.event_keys as string[] | null;
    if (keys?.length && !keys.includes(eventKey)) continue;
    try {
      const res = await fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Urabapp-Event': eventKey,
          ...(hook.secret ? { 'X-Urabapp-Secret': hook.secret } : {}),
        },
        body: JSON.stringify({
          event_key: eventKey,
          payload,
          at: new Date().toISOString(),
        }),
      });
      if (res.ok) delivered += 1;
    } catch {
      /* ignore per-hook failures */
    }
  }
  return delivered;
}

/** @deprecated Usar emitCommunicationEvent */
export async function notifyUser(userId: string, {
  title,
  body,
  type = 'order',
  orderId,
  url,
  eventKey = 'payment_approved',
}: {
  title: string;
  body: string;
  type?: string;
  orderId?: string;
  url?: string;
  eventKey?: string;
}) {
  return emitCommunicationEvent({
    eventKey,
    recipientId: userId,
    category: type === 'order' ? 'payments' : type,
    title,
    body,
    deepLink: url,
    payload: { order_id: orderId },
  });
}
