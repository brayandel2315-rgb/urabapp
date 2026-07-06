import { invokeEdgeFunction } from '@/services/edge.service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useSettingsStore } from '@/store/settingsStore';

export async function deliverPush({ userId, title, body, data, priority }) {
  if (!isSupabaseConfigured || !userId) return false;
  const localPush = useSettingsStore.getState().notifications?.push;
  if (localPush === false) return false;
  if (priority === 'silent') return false;
  try {
    await invokeEdgeFunction('send-push', { userId, title, body, data });
    return true;
  } catch (err) {
    console.warn('[comm-push]', err.message);
    return false;
  }
}
