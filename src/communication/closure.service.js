import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

const STATUS_LABELS = {
  complete: 'Completo',
  healthy: 'Saludable',
  attention: 'Atención',
};

export async function getAdminCommunicationClosureSummary() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_communication_closure_summary'),
    'resumen cierre comunicaciones',
  );
}

export function closureStatusLabel(status) {
  return STATUS_LABELS[status] || status || '—';
}

export function buildClosureReportMarkdown(summary) {
  if (!summary) return '';
  const lines = [
    '# Cierre — Centro de Comunicación Urabapp',
    `Estado: ${closureStatusLabel(summary.status)} (score ${summary.closure_score ?? 0}/100)`,
    '',
    '## Cobertura',
    `- Eventos activos 7d: ${summary.events_active_7d ?? 0} / ${summary.events_defined ?? 58} (${summary.events_coverage_pct ?? 0}%)`,
    `- Módulos activos 7d: ${summary.modules_active_7d ?? 0} / ${summary.modules_total ?? 11} (${summary.modules_coverage_pct ?? 0}%)`,
    `- Notificaciones unificadas: ${summary.unified_notification_pct ?? 0}%`,
    `- Alertas cola abiertas: ${summary.queue_alerts_open ?? 0}`,
    '',
    '## Eventos por módulo (7d)',
  ];

  const modules = summary.module_stats || {};
  if (!Object.keys(modules).length) {
    lines.push('- Sin datos');
  } else {
    Object.entries(modules).forEach(([mod, cnt]) => {
      lines.push(`- ${mod}: ${cnt}`);
    });
  }

  lines.push('', `> ${summary.recommendation || ''}`, '', '---', 'Generado por Urabapp Centro de Comunicación');
  return lines.join('\n');
}

export async function downloadClosureReportMarkdown() {
  const summary = await getAdminCommunicationClosureSummary();
  if (!summary) throw new Error('No se pudo generar el informe de cierre');
  const md = buildClosureReportMarkdown(summary);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urabapp-comunicacion-cierre-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
  return summary;
}
