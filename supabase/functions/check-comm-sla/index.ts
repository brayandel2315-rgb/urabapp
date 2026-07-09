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

    const newAlerts = (alerts ?? []) as SlaAlert[];
    let notified = 0;
    let webhooks = 0;

    for (const alert of newAlerts) {
      webhooks += await deliverSlaWebhooks(supabase, alert, 'sla_breach_alert');
      const title = `Alerta SLA: ${alert.channel}`;
      const body = alert.message || `Métrica fuera de objetivo en canal ${alert.channel}`;
      notified += await notifyAdminsForAlert(supabase, alert, 'sla_breach_alert', title, body);
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
      escalated: escalatedAlerts.length,
      escalated_notified: escalatedNotified,
      escalated_webhooks: escalatedWebhooks,
      channels: newAlerts.map((a) => a.channel),
    });
  } catch (err) {
    return jsonResponse({ error: String(err), alerts: 0 }, 500);
  }
});
