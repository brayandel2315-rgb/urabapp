import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminQueueHealthHistory(hours = 24) {
  if (!isSupabaseConfigured) return { series: {}, snapshot_count: 0, hours };
  return sbFetch(
    supabase.rpc('get_admin_queue_health_history', { p_hours: hours }),
    'historial salud de cola',
  );
}

/** Etiquetas legibles para métricas de cola. */
export const QUEUE_METRIC_LABELS = {
  pending_total: 'Cola total',
  tracking_push_pending: 'Push tracking',
  critical_pending: 'Críticos',
  processing_stale: 'Processing atascado',
};

function escapeCsv(value) {
  const str = value == null ? '' : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function rowsToCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map((row) => columns.map((c) => escapeCsv(row[c])).join(','));
  return [header, ...lines].join('\n');
}

export async function downloadQueueHealthCsv(hours = 168) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const rows = await sbFetch(
    supabase.rpc('get_admin_queue_health_export', { p_hours: hours }),
    'export historial cola',
  );
  const list = Array.isArray(rows) ? rows : [];
  const columns = ['captured_at', 'metric_key', 'label', 'current_value', 'threshold_value', 'status', 'utilization_pct'];
  const csv = rowsToCsv(list, columns);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `urabapp-cola-salud-${hours}h.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
