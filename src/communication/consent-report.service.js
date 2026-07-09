import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

function formatConsentDigestMarkdown(digest) {
  const start = digest.period_start
    ? new Date(digest.period_start).toLocaleDateString('es-CO')
    : '—';
  const end = digest.period_end
    ? new Date(digest.period_end).toLocaleDateString('es-CO')
    : '—';

  const lines = [
    '# Informe semanal — Consentimiento Urabapp',
    `Período: ${start} → ${end}`,
    '',
    '## Resumen',
    `- Cambios registrados: ${digest.changes_total ?? 0}`,
    `- Marketing opt-in actual: ${digest.marketing_opt_in ?? 0}`,
    `- Marketing opt-out actual: ${digest.marketing_opt_out ?? 0}`,
    `- Cambios marketing (7d): ${digest.marketing_changes ?? 0}`,
    `- Cambios digest (7d): ${digest.digest_changes ?? 0}`,
    `- Cambios categorías (7d): ${digest.category_changes ?? 0}`,
    `- Cambios horario silencio (7d): ${digest.quiet_hours_changes ?? 0}`,
    `- Nuevas preferencias (7d): ${digest.new_preferences ?? 0}`,
    `- Webhooks consent. activos: ${digest.webhooks_active ?? 0}`,
    `- Cola pendiente: ${digest.pending_queue ?? 0}`,
    '',
    '## Por tipo de cambio',
  ];

  const byType = digest.by_change_type || {};
  if (!Object.keys(byType).length) {
    lines.push('- Sin cambios en el período');
  } else {
    Object.entries(byType).forEach(([type, cnt]) => {
      lines.push(`- ${type}: ${cnt}`);
    });
  }

  lines.push('', '---', 'Generado por Urabapp Centro de Comunicación');
  return lines.join('\n');
}

function buildConsentDigestSummary(digest) {
  return `${digest.changes_total ?? 0} cambios · marketing ${digest.marketing_changes ?? 0} · digest ${digest.digest_changes ?? 0}`;
}

export async function getConsentWeeklyDigest() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_consent_weekly_digest'),
    'digest consentimiento semanal',
  );
}

export async function downloadConsentDigestMarkdown() {
  const digest = await getConsentWeeklyDigest();
  if (!digest) throw new Error('No se pudo generar el informe de consentimiento');
  const md = formatConsentDigestMarkdown(digest);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urabapp-consentimiento-semanal-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
  return digest;
}

export { formatConsentDigestMarkdown, buildConsentDigestSummary };
