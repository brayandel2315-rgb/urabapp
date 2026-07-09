import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type BroadcastRow = {
  id: string;
  title: string;
  body: string | null;
  event_key: string;
  category: string;
  priority: string;
  segment_type: string;
  segment_value: Record<string, unknown>;
  batch_offset: number;
  recipients_total: number;
};

const BATCH_SIZE = 20;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  try {
    const supabase = getServiceClient();
    const { data: claimed, error: claimErr } = await supabase.rpc('claim_pending_broadcast');

    if (claimErr) {
      return jsonResponse({ error: claimErr.message, processed: 0 }, 500);
    }

    const broadcast = Array.isArray(claimed) ? claimed[0] : claimed;
    if (!broadcast) {
      return jsonResponse({ processed: 0, message: 'no pending broadcasts' });
    }

    const row = broadcast as BroadcastRow;
    const { data: recipients, error: batchErr } = await supabase.rpc('get_broadcast_recipient_batch', {
      p_segment_type: row.segment_type,
      p_segment_value: row.segment_value ?? {},
      p_offset: row.batch_offset,
      p_limit: BATCH_SIZE,
    });

    if (batchErr) {
      await supabase.rpc('advance_broadcast_batch', {
        p_id: row.id,
        p_sent: 0,
        p_failed: 0,
        p_next_offset: row.batch_offset,
        p_done: false,
        p_error: batchErr.message.slice(0, 500),
      });
      return jsonResponse({ error: batchErr.message, processed: 0 }, 500);
    }

    const ids = (recipients ?? []).map((r: { user_id: string }) => r.user_id);
    if (!ids.length) {
      await supabase.rpc('advance_broadcast_batch', {
        p_id: row.id,
        p_sent: 0,
        p_failed: 0,
        p_next_offset: row.batch_offset,
        p_done: true,
      });
      return jsonResponse({ broadcast_id: row.id, sent: 0, failed: 0, completed: true });
    }

    let sent = 0;
    let failed = 0;

    for (const recipientId of ids) {
      try {
        await emitCommunicationEvent({
          eventKey: row.event_key || 'broadcast_segment_sent',
          recipientId,
          category: row.category || 'system',
          priority: row.priority || 'medium',
          title: row.title,
          body: row.body || row.title,
          deepLink: '/cuenta/notificaciones',
          payload: {
            broadcast_id: row.id,
            title: row.title,
            body: row.body,
          },
        });
        sent += 1;
      } catch {
        failed += 1;
      }
    }

    const nextOffset = row.batch_offset + ids.length;
    const done = nextOffset >= row.recipients_total || ids.length < BATCH_SIZE;

    await supabase.rpc('advance_broadcast_batch', {
      p_id: row.id,
      p_sent: sent,
      p_failed: failed,
      p_next_offset: nextOffset,
      p_done: done,
    });

    return jsonResponse({
      broadcast_id: row.id,
      batch: ids.length,
      sent,
      failed,
      next_offset: nextOffset,
      completed: done,
    });
  } catch (err) {
    return jsonResponse({ error: String(err), processed: 0 }, 500);
  }
});
