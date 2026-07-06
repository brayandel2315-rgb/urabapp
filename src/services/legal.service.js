import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export async function getLegalDocument(docId) {
  if (!isSupabaseConfigured) return null;
  const LEGAL_DOC_ALIASES = {
    privacidad: 'privacy',
    terminos: 'terms',
    cookies: 'cookies',
    datos: 'data',
    condiciones: 'conditions',
    comercio: 'merchant',
  };
  const resolvedId = LEGAL_DOC_ALIASES[docId] || docId;
  const { data } = await supabase
    .from('legal_documents')
    .select('*')
    .eq('id', resolvedId)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getAllLegalDocuments() {
  if (!isSupabaseConfigured) return [];
  const { data } = await supabase.from('legal_documents').select('*').order('id');
  return data ?? [];
}

export async function recordConsent(userId, documentId, documentVersion) {
  if (!isSupabaseConfigured || !userId) return null;
  const data = await sbFetch(
    supabase
      .from('user_consents')
      .upsert(
        {
          user_id: userId,
          document_id: documentId,
          document_version: documentVersion,
          accepted_at: new Date().toISOString(),
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        },
        { onConflict: 'user_id,document_id,document_version' },
      )
      .select()
      .single(),
    'Tiempo agotado registrando consentimiento',
  );
  return data;
}

export async function getUserConsents(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data } = await supabase.from('user_consents').select('*').eq('user_id', userId);
  return data ?? [];
}

export async function approveBusiness(businessId) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('approve_business', { p_business_id: businessId }),
    'Tiempo agotado aprobando comercio',
  );
}

export async function rejectBusiness(businessId, reason) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.rpc('reject_business', {
      p_business_id: businessId,
      p_reason: reason || null,
    }),
    'Tiempo agotado rechazando comercio',
  );
}
