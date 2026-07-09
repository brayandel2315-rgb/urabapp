import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';

type ConsentChange = {
  id: string;
  user_id: string;
  change_type: string;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown>;
};

type ConsentWebhook = {
  id: string;
  url: string;
  secret: string | null;
};

async function deliverConsentWebhooks(
  change: ConsentChange,
): Promise<number> {
  const supabase = getServiceClient();
  const { data: hooks } = await supabase
    .from('communication_consent_webhooks')
    .select('id, url, secret')
    .eq('is_active', true);

  let delivered = 0;
  for (const hook of (hooks ?? []) as ConsentWebhook[]) {
    try {
      const res = await fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Urabapp-Event': 'consent_preferences_changed',
          ...(hook.secret ? { 'X-Urabapp-Secret': hook.secret } : {}),
        },
        body: JSON.stringify({
          event_key: 'consent_preferences_changed',
          change_type: change.change_type,
          user_id: change.user_id,
          before: change.before_state,
          after: change.after_state,
          change_id: change.id,
          at: new Date().toISOString(),
        }),
      });
      if (res.ok) delivered += 1;
    } catch {
      /* ignore per-hook */
    }
  }
  return delivered;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  try {
    const supabase = getServiceClient();
    const { data: rows, error } = await supabase.rpc('claim_pending_consent_changes', { p_limit: 30 });
    if (error) {
      return jsonResponse({ error: error.message, processed: 0 }, 500);
    }

    const changes = (rows ?? []) as ConsentChange[];
    let delivered = 0;
    let failed = 0;

    for (const change of changes) {
      const { count: activeHooks } = await supabase
        .from('communication_consent_webhooks')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true);

      const hookCount = await deliverConsentWebhooks(change);
      const success = (activeHooks ?? 0) === 0 || hookCount > 0;

      await supabase.rpc('finish_consent_change', {
        p_change_id: change.id,
        p_success: success,
        p_webhook_count: hookCount,
      });

      if (success) delivered += 1;
      else failed += 1;
    }

    return jsonResponse({
      claimed: changes.length,
      delivered,
      failed,
      webhooks_hit: delivered,
    });
  } catch (err) {
    return jsonResponse({ error: String(err), processed: 0 }, 500);
  }
});
