import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type ScheduledRow = {
  id: string;
  event_key: string;
  recipient_id: string;
  title: string;
  body: string | null;
  payload: Record<string, unknown>;
  category: string;
  priority: string;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  try {
    const supabase = getServiceClient();
    const { data: rows, error } = await supabase.rpc('claim_scheduled_communications', { p_limit: 25 });

    if (error) {
      return jsonResponse({ error: error.message, processed: 0 }, 500);
    }

    let sent = 0;
    let failed = 0;

    for (const row of (rows ?? []) as ScheduledRow[]) {
      try {
        const deepLink = (row.payload?.deep_link as string) || (row.payload?.url as string) || '/cuenta/notificaciones';
        await emitCommunicationEvent({
          eventKey: row.event_key || 'scheduled_communication_sent',
          recipientId: row.recipient_id,
          category: row.category || 'system',
          priority: row.priority || 'medium',
          title: row.title,
          body: row.body || row.title,
          deepLink,
          payload: { ...row.payload, scheduled_id: row.id },
        });
        await supabase.rpc('finish_scheduled_communication', {
          p_id: row.id,
          p_success: true,
        });
        sent += 1;
      } catch (err) {
        await supabase.rpc('finish_scheduled_communication', {
          p_id: row.id,
          p_success: false,
          p_error: String(err).slice(0, 500),
        });
        failed += 1;
      }
    }

    return jsonResponse({ processed: (rows ?? []).length, sent, failed });
  } catch (err) {
    return jsonResponse({ error: String(err), processed: 0 }, 500);
  }
});
