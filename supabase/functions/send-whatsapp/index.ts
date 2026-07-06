import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { requireAuthUser, canSendWhatsAppTo } from '../_shared/auth.ts';

const GRAPH = 'https://graph.facebook.com/v21.0';

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('57')) return digits;
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

async function sendWhatsAppMessage(
  phoneId: string,
  token: string,
  body: Record<string, unknown>,
) {
  const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `WhatsApp API ${res.status}`);
  }
  return data;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authResult = await requireAuthUser(req);
    if (authResult instanceof Response) return authResult;
    const caller = authResult;

    const token = Deno.env.get('WHATSAPP_API_TOKEN');
    const phoneId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (!token || !phoneId) {
      return jsonResponse({ sent: false, reason: 'whatsapp_api_not_configured' });
    }

    const { to, template, variables, text } = await req.json();
    if (!to) return jsonResponse({ error: 'to requerido' }, 400);

    if (!(await canSendWhatsAppTo(caller.id, String(to)))) {
      return jsonResponse({ error: 'No autorizado para enviar a este número' }, 403);
    }

    const recipient = normalizePhone(String(to));
    const useTemplates = Deno.env.get('WHATSAPP_USE_TEMPLATES') !== 'false';

    if (template && useTemplates) {
      const components = [];
      if (variables && typeof variables === 'object') {
        const bodyParams = Object.values(variables).map((value) => ({
          type: 'text',
          text: String(value ?? ''),
        }));
        if (bodyParams.length) {
          components.push({ type: 'body', parameters: bodyParams });
        }
      }

      const data = await sendWhatsAppMessage(phoneId, token, {
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'template',
        template: {
          name: template,
          language: { code: Deno.env.get('WHATSAPP_TEMPLATE_LANG') || 'es' },
          ...(components.length ? { components } : {}),
        },
      });

      return jsonResponse({ sent: true, messageId: data.messages?.[0]?.id, mode: 'template' });
    }

    if (!text) {
      return jsonResponse({ sent: false, reason: 'text_or_template_required' }, 400);
    }

    const data = await sendWhatsAppMessage(phoneId, token, {
      messaging_product: 'whatsapp',
      to: recipient,
      type: 'text',
      text: { body: String(text) },
    });

    return jsonResponse({ sent: true, messageId: data.messages?.[0]?.id, mode: 'text' });
  } catch (err) {
    return jsonResponse({ sent: false, error: String(err) }, 500);
  }
});
