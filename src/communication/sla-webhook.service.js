import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getSlaWebhooks() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_sla_webhooks')
      .select('id, name, url, is_active, created_at')
      .order('created_at', { ascending: false }),
    'webhooks SLA',
  );
  return data ?? [];
}

export async function upsertSlaWebhook({ id, name, url, secret = null, isActive = true }) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const row = {
    name: name.trim(),
    url: url.trim(),
    secret: secret || null,
    is_active: isActive,
    updated_at: new Date().toISOString(),
  };
  if (id) {
    return sbFetch(
      supabase.from('communication_sla_webhooks').update(row).eq('id', id).select().single(),
      'actualizar webhook SLA',
    );
  }
  const { data: { user } } = await supabase.auth.getUser();
  return sbFetch(
    supabase
      .from('communication_sla_webhooks')
      .insert({ ...row, created_by: user?.id })
      .select()
      .single(),
    'crear webhook SLA',
  );
}

export async function deleteSlaWebhook(id) {
  if (!isSupabaseConfigured || !id) return;
  await sbFetch(
    supabase.from('communication_sla_webhooks').delete().eq('id', id),
    'eliminar webhook SLA',
  );
}
