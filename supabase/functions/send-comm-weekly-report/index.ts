import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type WeeklyReport = {
  period_start?: string;
  period_end?: string;
  events_total?: number;
  notifications_total?: number;
  deliveries_total?: number;
  delivery_success_rate?: number;
  engagement_total?: number;
  opened_total?: number;
  clicked_total?: number;
  broadcasts_completed?: number;
  sla_alerts_open?: number;
  retries_pending?: number;
  queue_failed_now?: number;
  queue_processing_now?: number;
  queue_alerts_open?: number;
  queue_breaches_7d?: number;
  queue_snapshots_7d?: number;
  queue_archived_7d?: number;
  by_channel?: Record<string, { total?: number; delivered?: number; failed?: number }>;
  by_category?: Record<string, number>;
  top_events?: Array<{ event_key: string; cnt: number }>;
};

function buildReportBody(report: WeeklyReport): string {
  const start = report.period_start
    ? new Date(report.period_start).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
    : '—';
  const end = report.period_end
    ? new Date(report.period_end).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
    : '—';

  const lines = [
    `Informe semanal Centro de Comunicación Urabapp`,
    `Período: ${start} → ${end}`,
    '',
    `Eventos: ${report.events_total ?? 0}`,
    `Notificaciones: ${report.notifications_total ?? 0}`,
    `Entregas: ${report.deliveries_total ?? 0} (${report.delivery_success_rate ?? 0}% éxito)`,
    `Engagement: ${report.engagement_total ?? 0} (${report.opened_total ?? 0} aperturas, ${report.clicked_total ?? 0} clics)`,
    `Broadcasts completados: ${report.broadcasts_completed ?? 0}`,
    `Alertas SLA abiertas: ${report.sla_alerts_open ?? 0}`,
    `Reintentos pendientes: ${report.retries_pending ?? 0}`,
    '',
    'Cola de entregas:',
    `  Fallidos: ${report.queue_failed_now ?? 0}`,
    `  Processing: ${report.queue_processing_now ?? 0}`,
    `  Alertas cola abiertas: ${report.queue_alerts_open ?? 0}`,
    `  Snapshots 7d: ${report.queue_snapshots_7d ?? 0} (${report.queue_breaches_7d ?? 0} fuera de umbral)`,
    `  Archivados 7d: ${report.queue_archived_7d ?? 0}`,
    '',
    'Por canal:',
  ];

  const channels = report.by_channel ?? {};
  for (const [ch, stats] of Object.entries(channels)) {
    lines.push(`  ${ch}: ${stats.delivered ?? 0} ok / ${stats.failed ?? 0} fallo`);
  }

  lines.push('', 'Top eventos:');
  for (const row of report.top_events ?? []) {
    lines.push(`  ${row.event_key}: ${row.cnt}`);
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
    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) {
      return jsonResponse({ error: 'RESEND_API_KEY no configurado', sent: 0 }, 503);
    }

    const supabase = getServiceClient();
    const { data: report, error } = await supabase.rpc('get_admin_communication_weekly_report');

    if (error || !report) {
      return jsonResponse({ error: error?.message || 'report failed', sent: 0 }, 500);
    }

    const { data: admins } = await supabase
      .from('users')
      .select('id, email')
      .eq('role', 'ADMIN')
      .eq('is_active', true);

    const body = buildReportBody(report as WeeklyReport);
    const subject = `Informe semanal Comunicaciones Urabapp — ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}`;
    const from = Deno.env.get('RESEND_FROM') || 'Urabapp <noreply@urabapp.com>';

    let sent = 0;
    for (const admin of admins ?? []) {
      if (!admin.email) continue;
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: [admin.email],
            subject,
            text: body,
          }),
        });
        if (res.ok) {
          sent += 1;
          await emitCommunicationEvent({
            eventKey: 'weekly_comm_report_sent',
            recipientId: admin.id,
            category: 'admin',
            priority: 'low',
            title: 'Informe semanal enviado',
            body: `Te enviamos el resumen de comunicaciones de los últimos 7 días.`,
            deepLink: '/admin',
            payload: { report_summary: report },
            push: false,
          });
        }
      } catch {
        /* ignore per-admin */
      }
    }

    return jsonResponse({ sent, admins: (admins ?? []).length });
  } catch (err) {
    return jsonResponse({ error: String(err), sent: 0 }, 500);
  }
});
