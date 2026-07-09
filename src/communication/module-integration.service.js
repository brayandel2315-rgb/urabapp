import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getAdminModuleEventStats() {
  if (!isSupabaseConfigured) return null;
  return sbFetch(
    supabase.rpc('get_admin_module_event_stats'),
    'estadísticas módulos',
  );
}
