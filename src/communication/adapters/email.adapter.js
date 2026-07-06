import { invokeEdgeFunction } from '@/services/edge.service';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/** Canal email — Resend vía edge function send-email. */
export async function deliverEmail({ to, subject, body, userId }) {
  if (!to || !import.meta.env.VITE_EMAIL_API_ENABLED) return false;
  try {
    const result = await invokeEdgeFunction('send-email', {
      to,
      subject,
      body,
      userId,
    });
    return (result?.sent ?? 0) > 0;
  } catch (err) {
    console.warn('[comm-email]', err.message);
    return false;
  }
}

export async function resolveUserEmail(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data } = await supabase.from('users').select('email').eq('id', userId).maybeSingle();
  return data?.email || null;
}
