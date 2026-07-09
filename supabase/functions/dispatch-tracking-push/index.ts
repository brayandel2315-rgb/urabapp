import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';

/**
 * Compat alias — ciclo 21 delega en process-comm-retries (procesador unificado).
 * Mantener para crons legacy que aún apunten a dispatch-tracking-push.
 */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
    'Content-Type': 'application/json',
  };
  const cronSecret = req.headers.get('X-Cron-Secret');
  if (cronSecret) headers['X-Cron-Secret'] = cronSecret;

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/process-comm-retries`, {
      method: 'POST',
      headers,
      body: '{}',
    });
    const data = await res.json().catch(() => ({}));
    return jsonResponse({
      ...data,
      compat_alias: 'dispatch-tracking-push',
      unified_processor: 'process-comm-retries',
    }, res.status);
  } catch (err) {
    return jsonResponse({ error: String(err), processed: 0 }, 500);
  }
});
