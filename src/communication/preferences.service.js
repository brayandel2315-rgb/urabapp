import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { useSettingsStore } from '@/store/settingsStore';

const DEFAULT_CATEGORIES = {
  orders: { push: true, in_app: true, email: false },
  messages: { push: true, in_app: true, email: false },
  promotions: { push: true, in_app: true, email: false },
  payments: { push: true, in_app: true, email: false },
  security: { push: true, in_app: true, email: true },
  system: { push: true, in_app: true, email: false },
  account: { push: true, in_app: true, email: false },
  business: { push: true, in_app: true, email: false },
  marketplace: { push: true, in_app: true, email: false },
  support: { push: true, in_app: true, email: false },
  admin: { push: true, in_app: true, email: false },
  errors: { push: true, in_app: true, email: false },
  updates: { push: true, in_app: true, email: false },
  reminders: { push: true, in_app: true, email: false },
  marketing: { push: false, in_app: true, email: false },
};

export async function getCommunicationPreferences(userId) {
  if (!isSupabaseConfigured || !userId) {
    return { categories: DEFAULT_CATEGORIES, marketing_enabled: false };
  }
  const row = await sbFetch(
    supabase.from('communication_preferences').select('*').eq('user_id', userId).maybeSingle(),
    'prefs',
  ).catch(() => null);
  if (!row) return { categories: DEFAULT_CATEGORIES, marketing_enabled: false };
  return row;
}

export async function upsertCommunicationPreferences(userId, patch) {
  if (!isSupabaseConfigured || !userId) return;
  await sbExec(
    supabase.from('communication_preferences').upsert({
      user_id: userId,
      ...patch,
      updated_at: new Date().toISOString(),
    }),
    'Tiempo agotado guardando preferencias',
  );
}

/** Sincroniza prefs locales (settingsStore) → Supabase */
export async function syncLocalPrefsToServer(userId) {
  if (!userId) return;
  const local = useSettingsStore.getState().notifications;
  const categories = { ...DEFAULT_CATEGORIES };
  if (local.orders === false) categories.orders = { ...categories.orders, push: false, in_app: false };
  if (local.offers === false) categories.promotions = { ...categories.promotions, push: false };
  if (local.marketing === false) categories.marketing = { push: false, in_app: false, email: false };
  if (local.push === false) {
    Object.keys(categories).forEach((k) => {
      categories[k] = { ...categories[k], push: false };
    });
  }
  await upsertCommunicationPreferences(userId, {
    categories,
    marketing_enabled: Boolean(local.marketing),
  });
}

export function isQuietHours(prefs) {
  const start = prefs?.quiet_hours_start;
  const end = prefs?.quiet_hours_end;
  if (!start || !end) return false;
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = String(start).split(':').map(Number);
  const [eh, em] = String(end).split(':').map(Number);
  const startMins = sh * 60 + (sm || 0);
  const endMins = eh * 60 + (em || 0);
  if (startMins <= endMins) return mins >= startMins && mins < endMins;
  return mins >= startMins || mins < endMins;
}

export function isChannelAllowed(prefs, category, channel) {
  const cat = prefs?.categories?.[category];
  if (!cat) return true;
  return cat[channel] !== false;
}
