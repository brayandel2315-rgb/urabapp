import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function invokeEdgeFunction(name, body = {}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase no configurado. Revisa VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');
  }
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    throw new Error(error.message || `Error en función ${name}`);
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  return data;
}
