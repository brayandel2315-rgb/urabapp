import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireCronServiceOrAdmin } from '../_shared/cron.ts';
import { getServiceClient } from '../_shared/supabase.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const APP_URL = Deno.env.get('APP_URL') || 'https://urabapp.vercel.app';

type DigestRecipient = {
  user_id: string;
  email: string;
  unread_count: number;
  items: Array<{ title: string; body?: string; category?: string; created_at: string }>;
};

function buildDigestBody(recipient: DigestRecipient): string {
  const lines = [
    `Hola, tienes ${recipient.unread_count} notificación(es) sin leer en Urabapp (últimas 24h).`,
    '',
  ];
  for (const item of recipient.items || []) {
    const when = new Date(item.created_at).toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    lines.push(`• ${item.title || 'Notificación'} — ${when}`);
    if (item.body) lines.push(`  ${item.body.slice(0, 120)}`);
  }
  lines.push('', `Ver todo: ${APP_URL}/cuenta/notificaciones`);
  lines.push('', '— Urabapp');
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
    const { data: recipients, error } = await supabase.rpc('get_daily_digest_recipients');

    if (error) {
      return jsonResponse({ error: error.message, sent: 0 }, 500);
    }

    const from = Deno.env.get('RESEND_FROM') || 'Urabapp <noreply@urabapp.com>';
    let sent = 0;

    for (const row of (recipients ?? []) as DigestRecipient[]) {
      const subject = `Tu resumen Urabapp — ${row.unread_count} pendiente(s)`;
      const body = buildDigestBody(row);

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [row.email],
          subject,
          text: body,
        }),
      });

      if (res.ok) {
        sent += 1;
        await supabase.rpc('emit_communication_event', {
          p_event_key: 'daily_digest_sent',
          p_category: 'reminders',
          p_priority: 'low',
          p_recipient_id: row.user_id,
          p_title: subject,
          p_body: `Resumen con ${row.unread_count} notificaciones`,
          p_payload: { digest_count: row.unread_count },
          p_deep_link: '/cuenta/notificaciones',
          p_actor_id: null,
          p_icon: null,
          p_color: null,
          p_channels: ['in_app'],
        }).catch(() => {});
      }
    }

    return jsonResponse({ sent, recipients: (recipients ?? []).length });
  } catch (err) {
    return jsonResponse({ error: String(err), sent: 0 }, 500);
  }
});
