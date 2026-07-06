import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAuthOrProjectKey } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthOrProjectKey(req);
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

    const to = phone.startsWith('+') ? phone : `+57${phone.replace(/\D/g, '')}`;
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
