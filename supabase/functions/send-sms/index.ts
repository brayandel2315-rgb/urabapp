import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAuthUser, isAdminUser, isServiceRoleRequest } from '../_shared/auth.ts';
import { getServiceClient } from '../_shared/supabase.ts';

function normalizeDigits(phone: string): string {
  return String(phone || '').replace(/\D/g, '').slice(-10);
}

/** Solo service/admin, teléfono propio, o cliente de pedido del caller (negocio). */
async function canSendSmsTo(callerId: string, phone: string): Promise<boolean> {
  if (callerId === 'service-role') return true;
  if (await isAdminUser(callerId)) return true;

  const digits = normalizeDigits(phone);
  if (digits.length < 10) return false;

  const supabase = getServiceClient();
  const { data: user } = await supabase
    .from('users')
    .select('phone')
    .eq('id', callerId)
    .maybeSingle();

  const own = normalizeDigits(user?.phone || '');
  if (own && own === digits) return true;

  const sinceWeek = new Date(Date.now() - 7 * 24 * 3600000).toISOString();
  const { data: bizOrders } = await supabase
    .from('orders')
    .select('users!customer_id(phone), businesses!inner(owner_id)')
    .eq('businesses.owner_id', callerId)
    .gte('created_at', sinceWeek)
    .limit(100);

  return Boolean(bizOrders?.some((row) => {
    const p = normalizeDigits((row.users as { phone?: string } | null)?.phone || '');
    return p === digits;
  }));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Nunca aceptar solo apikey anon — JWT o service role obligatorios
    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;

    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const fromNumber = Deno.env.get('TWILIO_FROM_NUMBER');

    if (!accountSid || !authToken || !fromNumber) {
      return jsonResponse({ error: 'Twilio no configurado', sent: 0 }, 503);
    }

    const { phone, body, eventKey } = await req.json();
    if (!phone || !body) {
      return jsonResponse({ error: 'phone y body requeridos' }, 400);
    }

    if (!isServiceRoleRequest(req)) {
      const allowed = await canSendSmsTo(authResult.id, phone);
      if (!allowed) {
        return jsonResponse({ error: 'No autorizado para este destinatario', sent: 0 }, 403);
      }
    }

    const to = phone.startsWith('+') ? phone : `+57${String(phone).replace(/\D/g, '')}`;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const creds = btoa(`${accountSid}:${authToken}`);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: to,
        From: fromNumber,
        Body: String(body).slice(0, 1600),
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return jsonResponse({ error: errBody || 'Twilio error', sent: 0, eventKey }, 502);
    }

    const data = await res.json();
    return jsonResponse({ sent: 1, sid: data.sid, eventKey });
  } catch (err) {
    return jsonResponse({ error: String(err), sent: 0 }, 500);
  }
});
