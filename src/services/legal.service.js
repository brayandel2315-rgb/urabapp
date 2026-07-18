import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { sbFetch } from '@/lib/supabase-query';

export const LEGAL_DOC_ALIASES = {
  privacidad: 'privacy',
  terminos: 'terms',
  cookies: 'cookies',
  datos: 'data',
  condiciones: 'conditions',
  comercio: 'merchant',
  terceros: 'processors',
};

/** Documentos mínimos a registrar al crear cuenta (Ley 1581). */
export const REQUIRED_SIGNUP_DOC_IDS = ['privacy', 'terms', 'data', 'cookies'];

export function resolveLegalDocId(docId) {
  return LEGAL_DOC_ALIASES[docId] || docId;
}

export async function getLegalDocument(docId) {
  if (!isSupabaseConfigured) return null;
  const resolvedId = resolveLegalDocId(docId);
  const { data } = await supabase
    .from('legal_documents')
    .select('*')
    .eq('id', resolvedId)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

/** Registra aceptación de privacidad, términos, aviso de datos y cookies. */
export async function recordRequiredSignupConsents(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const results = [];
  for (const docId of REQUIRED_SIGNUP_DOC_IDS) {
    try {
      const doc = await getLegalDocument(docId);
      if (!doc?.id) continue;
      const row = await recordConsent(userId, doc.id, doc.version);
      if (row) results.push(row);
    } catch {
      /* no bloquear registro si falla un doc */
    }
  }
  return results;
}

export async function submitPrivacyRequest({ userId, requestType, notes }) {
  if (!isSupabaseConfigured || !userId) throw new Error('Debes iniciar sesión');
  return sbFetch(
    supabase.rpc('submit_privacy_request', {
      p_request_type: requestType,
      p_notes: notes || null,
    }),
    'Tiempo agotado enviando solicitud de habeas data',
  );
}

export async function getMyPrivacyRequests(userId) {
  if (!isSupabaseConfigured || !userId) return [];
  const { data } = await supabase
    .from('privacy_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  return data ?? [];
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
