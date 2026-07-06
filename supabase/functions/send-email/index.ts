import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { requireAuthUser } from '../_shared/auth.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('RESEND_API_KEY');
    if (!apiKey) {
      return jsonResponse({ error: 'RESEND_API_KEY no configurado', sent: 0 }, 503);
    }

    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;
    const caller = authResult;

    const { to, subject, body, userId } = await req.json();
    if (!to || !subject) {
      return jsonResponse({ error: 'to y subject requeridos' }, 400);
    }

    if (userId && userId !== caller.id && caller.id !== 'service-role') {
      const supabase = getServiceClient();
      const { data: user } = await supabase.from('users').select('role').eq('id', caller.id).maybeSingle();
      if (user?.role !== 'ADMIN') {
        return jsonResponse({ error: 'No autorizado' }, 403);
      }
    }

    const from = Deno.env.get('RESEND_FROM') || 'Urabapp <noreply@urabapp.com>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text: body || subject,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return jsonResponse({ error: errBody || 'Resend error', sent: 0 }, 502);
    }

    const data = await res.json();
    return jsonResponse({ sent: 1, id: data.id });
  } catch (err) {
    return jsonResponse({ error: String(err), sent: 0 }, 500);
  }
});
