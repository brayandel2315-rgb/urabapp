import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';

export async function getConsentWebhooks() {
  if (!isSupabaseConfigured) return [];
  const data = await sbFetch(
    supabase
      .from('communication_consent_webhooks')
      .select('id, name, url, is_active, created_at')
      .order('created_at', { ascending: false }),
    'webhooks consentimiento',
  );
  return data ?? [];
}

export async function upsertConsentWebhook({ id, name, url, secret = null, isActive = true }) {
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
      supabase.from('communication_consent_webhooks').update(row).eq('id', id).select().single(),
      'actualizar webhook consentimiento',
    );
  }
  const { data: { user } } = await supabase.auth.getUser();
  return sbFetch(
    supabase
      .from('communication_consent_webhooks')
      .insert({ ...row, created_by: user?.id })
      .select()
      .single(),
    'crear webhook consentimiento',
  );
}

export async function deleteConsentWebhook(id) {
  if (!isSupabaseConfigured || !id) return;
  await sbExec(
    supabase.from('communication_consent_webhooks').delete().eq('id', id),
    'eliminar webhook consentimiento',
  );
}
