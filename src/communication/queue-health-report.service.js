import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { QUEUE_METRIC_LABELS } from '@/communication/queue-health.service';

function formatQueueHealthReportMarkdown(report) {
  const start = report.period_start
    ? new Date(report.period_start).toLocaleDateString('es-CO')
    : '—';
  const end = report.period_end
    ? new Date(report.period_end).toLocaleDateString('es-CO')
    : '—';

  const lines = [
    '# Informe semanal — Salud de cola Urabapp',
    `Período: ${start} → ${end}`,
    '',
    '## Resumen',
    `- Snapshots registrados: ${report.snapshots_total ?? 0}`,
    `- Brechas detectadas: ${report.breaches_total ?? 0}`,
    `- Advertencias: ${report.warnings_total ?? 0}`,
    `- Alertas cola abiertas (7d): ${report.queue_alerts_opened_7d ?? 0}`,
    `- Alertas resueltas (7d): ${report.queue_alerts_resolved_7d ?? 0}`,
    `- Alertas abiertas ahora: ${report.queue_alerts_open_now ?? 0}`,
    `- Cola pendiente ahora: ${report.pending_total_now ?? 0}`,
    '',
    '## Por métrica',
  ];

  const byMetric = report.by_metric || {};
  if (!Object.keys(byMetric).length) {
    lines.push('- Sin snapshots en el período');
  } else {
    Object.entries(byMetric).forEach(([key, row]) => {
      const label = row.label || QUEUE_METRIC_LABELS[key] || key;
      lines.push(
        `### ${label}`,
        `- Muestras: ${row.snapshots ?? 0} · brechas: ${row.breaches ?? 0} · warnings: ${row.warnings ?? 0}`,
        `- Pico: ${row.peak_value ?? 0} · promedio: ${row.avg_value ?? 0} · umbral: ${row.threshold_value ?? '—'}`,
        `- Valor actual: ${row.current_value ?? 0}`,
        '',
      );
    });
  }

  lines.push('---', 'Generado por Urabapp Centro de Comunicación');
  return lines.join('\n');
}

function buildQueueHealthReportSummary(report) {
  return `${report.breaches_total ?? 0} brechas · ${report.snapshots_total ?? 0} snapshots · cola ${report.pending_total_now ?? 0}`;
}

export async function getQueueHealthWeeklyReport() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_queue_health_weekly_report'),
    'informe semanal cola',
  );
}

export async function downloadQueueHealthReportMarkdown() {
  const report = await getQueueHealthWeeklyReport();
  if (!report) throw new Error('No se pudo generar el informe de cola');
  const md = formatQueueHealthReportMarkdown(report);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urabapp-cola-semanal-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
  return report;
}

export { formatQueueHealthReportMarkdown, buildQueueHealthReportSummary };
