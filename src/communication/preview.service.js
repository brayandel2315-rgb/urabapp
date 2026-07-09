import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { applyTemplateString } from './templates.service';
import { resolveEventMessage } from './event-library';

/** Payloads de ejemplo para vista previa de plantillas por evento. */
export const TEMPLATE_PREVIEW_PAYLOADS = {
  order_created: { orderNumber: 'UA-1042', body: 'Tu pedido fue recibido.' },
  order_status_changed: { orderNumber: 'UA-1042', status: 'en camino', body: 'El repartidor va hacia ti.' },
  order_cancelled: { orderNumber: 'UA-1042', reason: 'Sin stock' },
  payment_approved: { amount: '$45.000', reference: 'WOM-8821' },
  payment_failed: { amount: '$45.000', reason: 'Fondos insuficientes' },
  business_campaign_sent: { businessName: 'Panadería El Urabá', body: '20% de descuento hoy' },
  system_announcement: { title: 'Mantenimiento programado', body: 'Urabapp estará en mantenimiento el domingo de 2 a 4 AM.' },
  scheduled_communication_sent: { title: 'Recordatorio', body: 'No olvides completar tu pedido.' },
  broadcast_segment_sent: { title: 'Novedades Urabapp', body: 'Nueva función de seguimiento en tiempo real.' },
  daily_digest_sent: { digest_count: 5, body: 'Tienes 5 notificaciones pendientes.' },
  auth_password_reset: {},
  account_address_added: {},
};

export function getPreviewPayloadForEvent(eventKey) {
  if (TEMPLATE_PREVIEW_PAYLOADS[eventKey]) {
    return { ...TEMPLATE_PREVIEW_PAYLOADS[eventKey] };
  }
  const lib = resolveEventMessage(eventKey, {});
  return {
    title: lib.title || 'Título de ejemplo',
    body: lib.body || 'Cuerpo de ejemplo para vista previa.',
    orderNumber: 'UA-1000',
    status: 'confirmado',
  };
}

/** Vista previa local (rápida, sin red). */
export function previewTemplateLocal(titleTemplate, bodyTemplate, eventKey, customPayload = {}) {
  const payload = { ...getPreviewPayloadForEvent(eventKey), ...customPayload };
  return {
    title: applyTemplateString(titleTemplate, payload),
    body: applyTemplateString(bodyTemplate || '', payload),
    payload,
  };
}

/** Vista previa vía RPC (misma lógica que servidor). */
export async function previewTemplateRemote(titleTemplate, bodyTemplate, eventKey, customPayload = {}) {
  const payload = { ...getPreviewPayloadForEvent(eventKey), ...customPayload };
  if (!isSupabaseConfigured) {
    return previewTemplateLocal(titleTemplate, bodyTemplate, eventKey, customPayload);
  }
  const data = await sbFetch(
    supabase.rpc('preview_communication_template', {
      p_title_template: titleTemplate,
      p_body_template: bodyTemplate || null,
      p_payload: payload,
    }),
    'preview plantilla',
  );
  return { ...data, payload };
}
