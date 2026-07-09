import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { emitCommunicationEvent } from '../_shared/notifications.ts';

type SlaAlert = {
  id: string;
  channel: string;
  alert_type: string;
  metric_value: number;
  threshold_value: number;
  message: string | null;
  escalation_level?: number;
};

type SlaWebhook = {
  id: string;
  url: string;
  secret: string | null;
};

async function deliverSlaWebhooks(
  supabase: ReturnType<typeof getServiceClient>,
  alert: SlaAlert,
  eventKey: string,
): Promise<number> {
  const { data: hooks } = await supabase
    .from('communication_sla_webhooks')
    .select('id, url, secret')
    .eq('is_active', true);

  let delivered = 0;
  for (const hook of (hooks ?? []) as SlaWebhook[]) {
    try {
      const res = await fetch(hook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Urabapp-Event': eventKey,
          ...(hook.secret ? { 'X-Urabapp-Secret': hook.secret } : {}),
        },
        body: JSON.stringify({
          event_key: eventKey,
          alert,
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

async function notifyAdminsForAlert(
  supabase: ReturnType<typeof getServiceClient>,
  alert: SlaAlert,
  eventKey: string,
  title: string,
  body: string,
): Promise<number> {
  const { data: admins } = await supabase.rpc('get_admin_user_ids');
  const adminIds = (admins ?? []).map((r: { user_id: string }) => r.user_id);
  let notified = 0;

  for (const adminId of adminIds) {
    try {
      await emitCommunicationEvent({
        eventKey,
        recipientId: adminId,
        category: 'admin',
        priority: eventKey === 'sla_alert_escalated' ? 'critical' : 'high',
        title,
        body,
        deepLink: '/admin',
        payload: {
          alert_id: alert.id,
          channel: alert.channel,
          alert_type: alert.alert_type,
          metric_value: alert.metric_value,
          threshold_value: alert.threshold_value,
          escalation_level: alert.escalation_level ?? 0,
        },
      });
      notified += 1;
    } catch {
      /* ignore per-admin */
    }
  }

  return notified;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const denied = await requireCronServiceOrAdmin(req);
  if (denied) return denied;

  try {
    const supabase = getServiceClient();

    const { data: alerts, error } = await supabase.rpc('check_communication_sla_breaches', { p_days: 7 });
    if (error) {
      return jsonResponse({ error: error.message, alerts: 0 }, 500);
    }

    const { data: queueAlerts, error: queueErr } = await supabase.rpc('check_communication_queue_thresholds');
    if (queueErr) {
      return jsonResponse({ error: queueErr.message, alerts: 0 }, 500);
    }

    const { data: resolvedQueueAlerts, error: resolveErr } = await supabase.rpc('auto_resolve_queue_threshold_alerts');
    if (resolveErr) {
      return jsonResponse({ error: resolveErr.message, alerts: 0 }, 500);
    }

    const { data: snapshotCount, error: snapErr } = await supabase.rpc('record_queue_health_snapshot');
    if (snapErr) {
      return jsonResponse({ error: snapErr.message, alerts: 0 }, 500);
    }

    const { data: staleReset, error: staleErr } = await supabase.rpc('reset_stale_communication_queue', {
      p_stale_minutes: 15,
    });
    if (staleErr) {
      return jsonResponse({ error: staleErr.message, alerts: 0 }, 500);
    }

    const { data: autoPurged, error: purgeErr } = await supabase.rpc('auto_purge_failed_communications', {
      p_days: 30,
    });
    if (purgeErr) {
      return jsonResponse({ error: purgeErr.message, alerts: 0 }, 500);
    }

    const newAlerts = (alerts ?? []) as SlaAlert[];
    const newQueueAlerts = (queueAlerts ?? []) as SlaAlert[];
    let notified = 0;
    let webhooks = 0;

    for (const alert of newAlerts) {
      webhooks += await deliverSlaWebhooks(supabase, alert, 'sla_breach_alert');
      const title = `Alerta SLA: ${alert.channel}`;
      const body = alert.message || `Métrica fuera de objetivo en canal ${alert.channel}`;
      notified += await notifyAdminsForAlert(supabase, alert, 'sla_breach_alert', title, body);
    }

    let queueNotified = 0;
    let queueWebhooks = 0;
    for (const alert of newQueueAlerts) {
      queueWebhooks += await deliverSlaWebhooks(supabase, alert, 'queue_threshold_alert');
      const title = 'Alerta cola de comunicaciones';
      const body = alert.message || `Umbral superado en métrica ${alert.alert_type}`;
      queueNotified += await notifyAdminsForAlert(
        supabase, alert, 'queue_threshold_alert', title, body,
      );
    }

    const resolvedAlerts = (resolvedQueueAlerts ?? []) as SlaAlert[];
    let resolvedNotified = 0;
    for (const alert of resolvedAlerts) {
      const title = 'Cola normalizada';
      const body = alert.message
        ? `${alert.message} — métrica por debajo del umbral`
        : `Alerta ${alert.alert_type} resuelta automáticamente`;
      resolvedNotified += await notifyAdminsForAlert(
        supabase, alert, 'queue_threshold_resolved', title, body,
      );
    }

    const staleResetCount = staleReset ?? 0;
    let staleResetNotified = 0;
    if (staleResetCount > 0) {
      const title = 'Processing atascado recuperado';
      const body = `${staleResetCount} entrega(s) devuelta(s) a pending tras >15 min en processing`;
      const { data: admins } = await supabase.rpc('get_admin_user_ids');
      for (const row of admins ?? []) {
        const adminId = (row as { user_id: string }).user_id;
        try {
          await emitCommunicationEvent({
            eventKey: 'queue_stale_reset',
            recipientId: adminId,
            category: 'admin',
            priority: 'medium',
            title,
            body,
            deepLink: '/admin',
            payload: { reset_count: staleResetCount },
          });
          staleResetNotified += 1;
        } catch {
          /* ignore */
        }
      }
    }

    const autoPurgedCount = autoPurged ?? 0;
    let autoPurgedNotified = 0;
    if (autoPurgedCount > 0) {
      const title = 'Fallidos archivados automáticamente';
      const body = `${autoPurgedCount} entrega(s) fallida(s) >30d movidas al archivo por cron`;
      const { data: admins } = await supabase.rpc('get_admin_user_ids');
      for (const row of admins ?? []) {
        const adminId = (row as { user_id: string }).user_id;
        try {
          await emitCommunicationEvent({
            eventKey: 'queue_failed_purged',
            recipientId: adminId,
            category: 'admin',
            priority: 'silent',
            title,
            body,
            deepLink: '/admin',
            payload: { purged_count: autoPurgedCount, source: 'auto_purge' },
            push: false,
          });
          autoPurgedNotified += 1;
        } catch {
          /* ignore */
        }
      }
    }

    const { data: escalated, error: escErr } = await supabase.rpc('escalate_stale_sla_alerts', { p_hours: 48 });
    if (escErr) {
      return jsonResponse({ error: escErr.message, alerts: newAlerts.length, notified, webhooks }, 500);
    }

    const escalatedAlerts = (escalated ?? []) as SlaAlert[];
    let escalatedNotified = 0;
    let escalatedWebhooks = 0;

    for (const alert of escalatedAlerts) {
      escalatedWebhooks += await deliverSlaWebhooks(supabase, alert, 'sla_alert_escalated');
      const level = alert.escalation_level ?? 1;
      const title = `SLA escalado (nivel ${level}): ${alert.channel}`;
      const body = alert.message
        ? `${alert.message} — sin reconocer tras 48h`
        : `Alerta SLA en ${alert.channel} escalada por falta de reconocimiento`;
      escalatedNotified += await notifyAdminsForAlert(
        supabase, alert, 'sla_alert_escalated', title, body,
      );
    }

    return jsonResponse({
      alerts: newAlerts.length,
      notified,
      webhooks,
      queue_alerts: newQueueAlerts.length,
      queue_notified: queueNotified,
      queue_webhooks: queueWebhooks,
      queue_resolved: resolvedAlerts.length,
      queue_resolved_notified: resolvedNotified,
      queue_snapshots_recorded: snapshotCount ?? 0,
      queue_stale_reset: staleResetCount,
      queue_stale_notified: staleResetNotified,
      queue_auto_purged: autoPurgedCount,
      queue_auto_purged_notified: autoPurgedNotified,
      escalated: escalatedAlerts.length,
      escalated_notified: escalatedNotified,
      escalated_webhooks: escalatedWebhooks,
      channels: newAlerts.map((a) => a.channel),
    });
  } catch (err) {
    return jsonResponse({ error: String(err), alerts: 0 }, 500);
  }
});
