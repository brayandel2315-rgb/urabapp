import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';
import { TEMPLATE_PREVIEW_PAYLOADS } from './preview.service';

const VARIABLE_LABELS = {
  orderNumber: 'Número de pedido',
  status: 'Estado',
  body: 'Cuerpo del mensaje',
  title: 'Título',
  reason: 'Motivo',
  amount: 'Monto',
  reference: 'Referencia',
  businessName: 'Nombre del negocio',
  digest_count: 'Cantidad en digest',
  orderId: 'ID del pedido',
};

/** Variables conocidas por evento (cliente, sin red). */
export function getLocalTemplateVariables(eventKey) {
  const payload = TEMPLATE_PREVIEW_PAYLOADS[eventKey] || { title: '', body: '' };
  const keys = Object.keys(payload).length ? Object.keys(payload) : ['title', 'body'];
  return keys.map((key) => ({
    key,
    placeholder: `{{${key}}}`,
    label: VARIABLE_LABELS[key] || key,
    example: payload[key] != null ? String(payload[key]) : '',
  }));
}

export async function getTemplateVariablesForEvent(eventKey) {
  if (!eventKey) return [];
  if (!isSupabaseConfigured) return getLocalTemplateVariables(eventKey);

  const data = await sbFetch(
    supabase.rpc('get_template_variables_for_event', { p_event_key: eventKey }),
    'variables plantilla',
  ).catch(() => null);

  if (!Array.isArray(data) || !data.length) {
    return getLocalTemplateVariables(eventKey);
  }

  const payload = TEMPLATE_PREVIEW_PAYLOADS[eventKey] || {};
  return data.map((row) => ({
    key: row.key,
    placeholder: row.placeholder || `{{${row.key}}}`,
    label: VARIABLE_LABELS[row.key] || row.key,
    example: payload[row.key] != null ? String(payload[row.key]) : '',
  }));
}

export function insertTemplateVariable(currentText, variableKey) {
  const token = `{{${variableKey}}}`;
  if (!currentText) return token;
  return `${currentText}${currentText.endsWith(' ') ? '' : ' '}${token}`;
}
