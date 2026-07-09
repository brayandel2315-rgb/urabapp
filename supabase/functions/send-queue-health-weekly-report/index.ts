import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type QueueHealthReport = {
  snapshots_total?: number;
  breaches_total?: number;
  warnings_total?: number;
  queue_alerts_opened_7d?: number;
  queue_alerts_resolved_7d?: number;
  queue_alerts_open_now?: number;
  pending_total_now?: number;
  by_metric?: Record<string, {
    label?: string;
    breaches?: number;
    peak_value?: number;
    current_value?: number;
  }>;
};

function buildReportBody(report: QueueHealthReport): string {
  const lines = [
    'Informe semanal — Salud de cola Urabapp',
    '',
    `Snapshots: ${report.snapshots_total ?? 0}`,
    `Brechas: ${report.breaches_total ?? 0} · Advertencias: ${report.warnings_total ?? 0}`,
    `Alertas abiertas ahora: ${report.queue_alerts_open_now ?? 0}`,
    `Cola pendiente: ${report.pending_total_now ?? 0}`,
    '',
    'Por métrica:',
  ];

  for (const [key, row] of Object.entries(report.by_metric ?? {})) {
    lines.push(
      `  ${row.label || key}: pico ${row.peak_value ?? 0}, actual ${row.current_value ?? 0}, brechas ${row.breaches ?? 0}`,
    );
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
    const { data: report, error } = await supabase.rpc('get_admin_queue_health_weekly_report');

    if (error || !report) {
      return jsonResponse({ error: error?.message || 'report failed', sent: 0 }, 500);
    }

    const data = report as QueueHealthReport;
    const body = buildReportBody(data);
    const summary = `${data.breaches_total ?? 0} brechas · cola ${data.pending_total_now ?? 0} pendiente`;

    const { data: admins } = await supabase.rpc('get_admin_user_ids');
    const adminIds = (admins ?? []).map((r: { user_id: string }) => r.user_id);
    let notified = 0;

    for (const adminId of adminIds) {
      try {
        await emitCommunicationEvent({
          eventKey: 'queue_health_weekly_report_sent',
          recipientId: adminId,
          category: 'admin',
          priority: 'low',
          title: 'Informe semanal de cola',
          body: summary,
          deepLink: '/admin',
          payload: { ...data, summary, report_body: body },
        });
        notified += 1;
      } catch {
        /* ignore per-admin */
      }
    }

    return jsonResponse({
      sent: notified,
      breaches_total: data.breaches_total ?? 0,
      snapshots_total: data.snapshots_total ?? 0,
      admins: adminIds.length,
    });
  } catch (err) {
    return jsonResponse({ error: String(err), sent: 0 }, 500);
  }
});
