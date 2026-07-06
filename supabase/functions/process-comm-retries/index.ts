import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { deliverOutboundWebhooks } from '../_shared/notifications.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

type QueueRow = {
  id: string;
  event_key: string;
  recipient_id: string;
  channel: string;
  payload: Record<string, unknown>;
};

async function retryChannel(row: QueueRow): Promise<{ ok: boolean; error?: string }> {
  const p = row.payload || {};

  if (row.channel === 'push') {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: row.recipient_id,
        title: p.title,
        body: p.body,
        data: p,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && (data.sent ?? 0) > 0, error: data.error };
  }

  if (row.channel === 'email') {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: p.to,
        subject: p.subject,
        body: p.body,
        userId: row.recipient_id,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && (data.sent ?? 0) > 0, error: data.error };
  }

  if (row.channel === 'sms') {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-sms`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: p.phone,
        body: p.body,
        eventKey: row.event_key,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && (data.sent ?? 0) > 0, error: data.error };
  }

  if (row.channel === 'whatsapp') {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/send-whatsapp`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        apikey: SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: p.phone,
        orderNumber: p.orderNumber,
        status: p.status,
        orderId: p.orderId,
        text: p.body,
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && (data.sent ?? 0) > 0, error: data.error };
  }

  if (row.channel === 'webhook') {
    const n = await deliverOutboundWebhooks(row.event_key, {
      ...p,
      recipient_id: row.recipient_id,
      retry: true,
    });
    return { ok: n > 0, error: n > 0 ? undefined : 'no_webhooks_delivered' };
  }

  return { ok: false, error: 'unknown_channel' };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  try {
    const supabase = getServiceClient();
    const { data: rows, error } = await supabase.rpc('claim_communication_retries', { p_limit: 25 });

    if (error) {
      return jsonResponse({ error: error.message, processed: 0 }, 500);
    }

    let completed = 0;
    let failed = 0;

    for (const row of (rows ?? []) as QueueRow[]) {
      const result = await retryChannel(row);
      await supabase.rpc('finish_communication_retry', {
        p_queue_id: row.id,
        p_success: result.ok,
        p_error: result.error ?? null,
      });
      if (result.ok) completed += 1;
      else failed += 1;
    }

    return jsonResponse({
      processed: (rows ?? []).length,
      completed,
      failed,
    });
  } catch (err) {
    return jsonResponse({ error: String(err), processed: 0 }, 500);
  }
});
