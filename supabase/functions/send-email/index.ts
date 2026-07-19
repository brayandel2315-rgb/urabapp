import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getServiceClient } from '../_shared/supabase.ts';
import { isAdminUser, requireAuthUser } from '../_shared/auth.ts';

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
    if (!subject) {
      return jsonResponse({ error: 'subject requerido' }, 400);
    }

    const supabase = getServiceClient();
    let destination = typeof to === 'string' ? to.trim() : '';

    // Cerrar open relay: destino debe ser el email del caller, o admin hacia userId/to
    if (caller.id === 'service-role') {
      if (!destination) {
        return jsonResponse({ error: 'to requerido para service role', sent: 0 }, 400);
      }
    } else if (await isAdminUser(caller.id)) {
      if (userId) {
        const { data: target } = await supabase
          .from('users')
          .select('email')
          .eq('id', userId)
          .maybeSingle();
        destination = target?.email || destination;
      }
      if (!destination) {
        return jsonResponse({ error: 'Destinatario inválido', sent: 0 }, 400);
      }
    } else {
      const { data: me } = await supabase
        .from('users')
        .select('email')
        .eq('id', caller.id)
        .maybeSingle();
      const ownEmail = (me?.email || caller.email || '').trim().toLowerCase();
      if (!ownEmail) {
        return jsonResponse({ error: 'Sin email en perfil', sent: 0 }, 400);
      }
      if (destination && destination.toLowerCase() !== ownEmail) {
        return jsonResponse({ error: 'Solo puedes enviarte correo a tu cuenta', sent: 0 }, 403);
      }
      destination = ownEmail;
      if (userId && userId !== caller.id) {
        return jsonResponse({ error: 'No autorizado', sent: 0 }, 403);
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
        to: [destination],
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
