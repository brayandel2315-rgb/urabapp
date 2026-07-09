import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

function formatReportMarkdown(report) {
  const start = report.period_start
    ? new Date(report.period_start).toLocaleDateString('es-CO')
    : '—';
  const end = report.period_end
    ? new Date(report.period_end).toLocaleDateString('es-CO')
    : '—';

  const lines = [
    '# Informe semanal — Centro de Comunicación Urabapp',
    `Período: ${start} → ${end}`,
    '',
    '## Resumen',
    `- Eventos: ${report.events_total ?? 0}`,
    `- Notificaciones: ${report.notifications_total ?? 0}`,
    `- Entregas: ${report.deliveries_total ?? 0}`,
    `- Tasa de éxito: ${report.delivery_success_rate ?? 0}%`,
    `- Engagement: ${report.engagement_total ?? 0} (${report.opened_total ?? 0} aperturas, ${report.clicked_total ?? 0} clics)`,
    `- Broadcasts completados: ${report.broadcasts_completed ?? 0}`,
    `- Alertas SLA abiertas: ${report.sla_alerts_open ?? 0}`,
    `- Reintentos pendientes: ${report.retries_pending ?? 0}`,
    '',
    '## Cola de entregas',
    `- Fallidos ahora: ${report.queue_failed_now ?? 0}`,
    `- En processing: ${report.queue_processing_now ?? 0}`,
    `- Alertas cola abiertas: ${report.queue_alerts_open ?? 0}`,
    `- Snapshots 7d: ${report.queue_snapshots_7d ?? 0} (${report.queue_breaches_7d ?? 0} fuera de umbral)`,
    `- Archivados 7d: ${report.queue_archived_7d ?? 0}`,
    '',
    '## Entregas por canal',
  ];

  const byChannel = report.by_channel || {};
  if (Object.keys(byChannel).length === 0) {
    lines.push('- Sin datos');
  } else {
    Object.entries(byChannel).forEach(([ch, stats]) => {
      lines.push(`- ${ch}: ${stats.delivered ?? 0} ok / ${stats.failed ?? 0} fallo (${stats.total ?? 0} total)`);
    });
  }

  lines.push('', '## Eventos por categoría');
  const byCategory = report.by_category || {};
  if (Object.keys(byCategory).length === 0) {
    lines.push('- Sin datos');
  } else {
    Object.entries(byCategory).forEach(([cat, cnt]) => {
      lines.push(`- ${cat}: ${cnt}`);
    });
  }

  lines.push('', '## Top eventos');
  const topEvents = report.top_events || [];
  if (!topEvents.length) {
    lines.push('- Sin datos');
  } else {
    topEvents.forEach((row) => {
      lines.push(`- ${row.event_key}: ${row.cnt}`);
    });
  }

  lines.push('', '---', 'Generado por Urabapp Centro de Comunicación');
  return lines.join('\n');
}

export async function getWeeklyCommunicationReport() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_communication_weekly_report'),
    'informe semanal',
  );
}

export async function downloadWeeklyReportMarkdown() {
  const report = await getWeeklyCommunicationReport();
  if (!report) throw new Error('No se pudo generar el informe');
  const md = formatReportMarkdown(report);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urabapp-comunicacion-semanal-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
  return report;
}

export { formatReportMarkdown };
