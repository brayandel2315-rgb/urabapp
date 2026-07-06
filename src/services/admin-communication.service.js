import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { invokeEdgeFunction } from '@/services/edge.service';

export async function getAdminCommunicationOverview() {
  if (!isSupabaseConfigured) {
    return {
      events_7d: 0,
      notifications_7d: 0,
      engagement_7d: 0,
      opened_7d: 0,
      clicked_7d: 0,
      campaigns_7d: 0,
      webhooks_active: 0,
      templates_active: 0,
      retries_pending: 0,
      digest_subscribers: 0,
      deliveries_7d: 0,
      delivery_success_rate: 0,
      ab_variants_active: 0,
      scheduled_pending: 0,
      by_category: {},
      recent_events: [],
    };
  }
  return sbFetch(
    supabase.rpc('get_admin_communication_overview'),
    'Tiempo agotado cargando overview de comunicaciones',
  );
}

export async function getCommunicationWebhooks() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_webhooks')
      .select('id, name, url, event_keys, is_active, created_at')
      .order('created_at', { ascending: false }),
    'Tiempo agotado cargando webhooks',
  );
  return data ?? [];
}

export async function upsertCommunicationWebhook({ id, name, url, eventKeys = [], secret = null, isActive = true }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const row = {
    name: name.trim(),
    url: url.trim(),
    event_keys: eventKeys,
    secret: secret || null,
    is_active: isActive,
    updated_at: new Date().toISOString(),
  };
  if (id) {
    return sbFetch(
      supabase.from('communication_webhooks').update(row).eq('id', id).select().single(),
      'Tiempo agotado actualizando webhook',
    );
  }
  const { data: { user } } = await supabase.auth.getUser();
  return sbFetch(
    supabase
      .from('communication_webhooks')
      .insert({ ...row, created_by: user?.id })
      .select()
      .single(),
    'Tiempo agotado creando webhook',
  );
}

export async function deleteCommunicationWebhook(id) {
  if (!isSupabaseConfigured || !id) return;
  await sbExec(
    supabase.from('communication_webhooks').delete().eq('id', id),
    'Tiempo agotado eliminando webhook',
  );
}

export async function getCommunicationTemplates() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_templates')
      .select('id, event_key, title_template, body_template, channels_override, is_active, updated_at')
      .order('event_key'),
    'Tiempo agotado cargando plantillas',
  );
  return data ?? [];
}

export async function saveCommunicationTemplate({ eventKey, titleTemplate, bodyTemplate, isActive = true }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('upsert_communication_template', {
      p_event_key: eventKey.trim(),
      p_title_template: titleTemplate.trim(),
      p_body_template: bodyTemplate?.trim() || null,
      p_channels_override: null,
      p_is_active: isActive,
    }),
    'Tiempo agotado guardando plantilla',
  );
}

export async function triggerCommRetryProcessor() {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return invokeEdgeFunction('process-comm-retries', {});
}

export async function triggerDailyDigest() {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return invokeEdgeFunction('send-daily-digest', {});
}

export async function getAdminDeliveryMetrics() {
  if (!isSupabaseConfigured) {
    return { by_channel: {}, ab_variants: [], delivery_rate: 0 };
  }
  return sbFetch(
    supabase.rpc('get_admin_delivery_metrics'),
    'Tiempo agotado cargando métricas de entrega',
  );
}

export async function getTemplateVariants() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_template_variants')
      .select('id, event_key, variant_key, title_template, body_template, weight, is_active')
      .eq('is_active', true)
      .order('event_key'),
    'Tiempo agotado cargando variantes',
  );
  return data ?? [];
}

export async function saveTemplateVariant({
  eventKey, variantKey, titleTemplate, bodyTemplate, weight = 50,
}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('upsert_template_variant', {
      p_event_key: eventKey.trim(),
      p_variant_key: variantKey.trim(),
      p_title_template: titleTemplate.trim(),
      p_body_template: bodyTemplate?.trim() || null,
      p_weight: weight,
      p_is_active: true,
    }),
    'Tiempo agotado guardando variante',
  );
}

export {
  getCommunicationRateLimits,
  saveCommunicationRateLimit,
  getScheduledCommunications,
  scheduleCommunication,
  cancelScheduledCommunication,
  downloadDeliveryMetricsCsv,
} from '@/communication/schedule.service';

export async function triggerScheduledProcessor() {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return invokeEdgeFunction('process-scheduled-comms', {});
}
