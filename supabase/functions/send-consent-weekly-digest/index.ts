import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type ConsentDigest = {
  changes_total?: number;
  marketing_opt_in?: number;
  marketing_opt_out?: number;
  marketing_changes?: number;
  digest_changes?: number;
  category_changes?: number;
  quiet_hours_changes?: number;
  new_preferences?: number;
  pending_queue?: number;
  by_change_type?: Record<string, number>;
};

function buildDigestBody(digest: ConsentDigest): string {
  const lines = [
    'Informe semanal de consentimiento — Urabapp',
    '',
    `Cambios totales: ${digest.changes_total ?? 0}`,
    `Marketing opt-in: ${digest.marketing_opt_in ?? 0} | opt-out: ${digest.marketing_opt_out ?? 0}`,
    `Cambios marketing: ${digest.marketing_changes ?? 0}`,
    `Cambios digest: ${digest.digest_changes ?? 0}`,
    `Cambios categorías: ${digest.category_changes ?? 0}`,
    `Horario silencio: ${digest.quiet_hours_changes ?? 0}`,
    `Nuevas preferencias: ${digest.new_preferences ?? 0}`,
    `Cola webhooks pendiente: ${digest.pending_queue ?? 0}`,
    '',
    'Por tipo:',
  ];

  for (const [type, cnt] of Object.entries(digest.by_change_type ?? {})) {
    lines.push(`  ${type}: ${cnt}`);
  }

  lines.push('', '— Urabapp Admin');
  return lines.join('\n');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  try {
    const supabase = getServiceClient();
    const { data: digest, error } = await supabase.rpc('get_admin_consent_weekly_digest');

    if (error || !digest) {
      return jsonResponse({ error: error?.message || 'digest failed', sent: 0 }, 500);
    }

    const report = digest as ConsentDigest;
    const body = buildDigestBody(report);
    const summary = `${report.changes_total ?? 0} cambios de consentimiento esta semana`;

    const { data: admins } = await supabase.rpc('get_admin_user_ids');
    const adminIds = (admins ?? []).map((r: { user_id: string }) => r.user_id);
    let notified = 0;

    for (const adminId of adminIds) {
      try {
        await emitCommunicationEvent({
          eventKey: 'consent_weekly_digest_sent',
          recipientId: adminId,
          category: 'admin',
          priority: 'silent',
          title: 'Informe semanal de consentimiento',
          body: summary,
          deepLink: '/admin',
          payload: { ...report, summary },
        });
        notified += 1;
      } catch {
        /* ignore per-admin */
      }
    }

    return jsonResponse({
      sent: notified,
      changes_total: report.changes_total ?? 0,
      admins: adminIds.length,
    });
  } catch (err) {
    return jsonResponse({ error: String(err), sent: 0 }, 500);
  }
});
