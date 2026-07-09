import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getCommunicationTrends(days = 30) {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_communication_trends', { p_days: days }),
    'tendencias comunicación',
  );
}

/** Fusiona series diarias en filas unificadas por día. */
export function mergeTrendSeries(trends) {
  if (!trends) return [];
  const map = new Map();

  (trends.daily_events || []).forEach((row) => {
    const key = row.day;
    map.set(key, { day: key, events: row.total || 0, deliveries: 0, delivered: 0, failed: 0, engagement: 0, opened: 0, clicked: 0 });
  });

  (trends.daily_deliveries || []).forEach((row) => {
    const key = row.day;
    const cur = map.get(key) || { day: key, events: 0, deliveries: 0, delivered: 0, failed: 0, engagement: 0, opened: 0, clicked: 0 };
    cur.deliveries = row.total || 0;
    cur.delivered = row.delivered || 0;
    cur.failed = row.failed || 0;
    map.set(key, cur);
  });

  (trends.daily_engagement || []).forEach((row) => {
    const key = row.day;
    const cur = map.get(key) || { day: key, events: 0, deliveries: 0, delivered: 0, failed: 0, engagement: 0, opened: 0, clicked: 0 };
    cur.engagement = row.total || 0;
    cur.opened = row.opened || 0;
    cur.clicked = row.clicked || 0;
    map.set(key, cur);
  });

  return [...map.values()].sort((a, b) => String(a.day).localeCompare(String(b.day)));
}

export function getTrendMax(rows, key) {
  return rows.reduce((max, row) => Math.max(max, row[key] || 0), 1);
}
