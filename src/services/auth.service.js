import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mapApiError } from '../utils/errors';
import { sbFetch, sbExec } from '@/lib/supabase-query';
import { isGoogleAuthEnabled, parseAuthErrorMessage } from '../utils/auth-providers';
import { withTimeout } from '../utils/async';
import {
  assertOwnUserId,
  isAdminRole,
  sanitizeProfileUpdates,
} from '../utils/auth-rbac';
import { rememberGuestUserId } from './guest-merge.service';
import { safeRedirectPath } from '../utils/validate';
import { emitCommEvent } from '@/communication';

function normalizePhone(phone) {
  return phone.startsWith('+') ? phone : `+57${phone.replace(/\D/g, '')}`;
}

export async function signInWithGoogle(redirectPath = '/cuenta/perfil') {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado. Crea .env.local');
  if (!isGoogleAuthEnabled()) {
    throw new Error('Google no está habilitado. Usa email y contraseña.');
  }
  const safePath = safeRedirectPath(redirectPath, '/cuenta/perfil');
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${safePath}`,
    },
  });
  if (error) throw new Error(parseAuthErrorMessage(error) || mapApiError(error));
}

export async function signInWithPhone(phone) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado. Crea .env.local');
  const normalized = normalizePhone(phone);
  await sbExec(
    supabase.auth.signInWithOtp({
      phone: normalized,
      options: {
        channel: 'sms',
      },
    }),
    'Tiempo agotado enviando código SMS',
  );
  const { data: { user } } = await supabase.auth.getUser();
  emitCommEvent('auth_otp_sent', {
    recipientId: user?.id,
    payload: { channel: 'sms', phone: normalized },
  }).catch(() => {});
  return normalized;
}

export async function verifyPhoneOtp(phone, token) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const normalized = normalizePhone(phone);
  return sbFetch(
    supabase.auth.verifyOtp({
      phone: normalized,
      token,
      type: 'sms',
    }),
    'Tiempo agotado verificando código SMS',
  );
}

/** Envía OTP: login por SMS o verificación de celular en sesión existente. */
export async function requestPhoneOtp(phone) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const normalized = normalizePhone(phone);
  const { data: { user } } = await supabase.auth.getUser();

  if (user && !user.is_anonymous) {
    await sbExec(
      supabase.auth.updateUser({ phone: normalized }),
      'Tiempo agotado actualizando teléfono',
    );
    return { normalized, mode: 'change' };
  }

  await signInWithPhone(phone);
  return { normalized, mode: 'signin' };
}

/** Confirma OTP según modo (login o cambio de celular). */
export async function confirmPhoneOtp(phone, token, mode = 'signin') {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const normalized = normalizePhone(phone);
  return sbFetch(
    supabase.auth.verifyOtp({
      phone: normalized,
      token,
      type: mode === 'change' ? 'phone_change' : 'sms',
    }),
    'Tiempo agotado confirmando código',
  );
}

export async function signInWithEmail(email, redirectPath = '/cuenta/perfil') {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado. Crea .env.local');
  const safePath = safeRedirectPath(redirectPath, '/cuenta/perfil');
  await sbExec(
    supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${safePath}`,
      },
    }),
    'Tiempo agotado enviando enlace por email',
  );
}

export async function signInWithPassword(email, password) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    }),
    'No pudimos conectar con el servidor. Revisa tu internet e intenta de nuevo.',
    15_000,
  );
}

export async function signUpWithPassword(email, password, metadata = {}) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  return sbFetch(
    supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: metadata },
    }),
    'No pudimos crear la cuenta. Revisa tu internet e intenta de nuevo.',
    15_000,
  );
}

export async function signOut() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function resetPassword(email, redirectPath = '/cuenta/seguridad') {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const safePath = safeRedirectPath(redirectPath, '/cuenta/seguridad');
  await sbExec(
    supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${safePath}`,
    }),
    'Tiempo agotado enviando enlace de recuperación',
  );
  emitCommEvent('auth_otp_sent', {
    payload: { channel: 'email', action: 'password_reset', email: email.trim() },
  }).catch(() => {});
}

export async function updatePassword(newPassword) {
  if (!isSupabaseConfigured) throw new Error('Supabase no configurado');
  const { data: { user } } = await supabase.auth.getUser();
  await sbExec(
    supabase.auth.updateUser({ password: newPassword }),
    'Tiempo agotado actualizando contraseña',
  );
  if (user?.id) {
    emitCommEvent('auth_password_reset', {
      recipientId: user.id,
      actorId: user.id,
    }).catch(() => {});
  }
}

export function isAccountUsable(profile) {
  if (!profile) return true;
  const status = profile.account_status || 'active';
  return status === 'active' || status === 'pending';
}

export async function getProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  const { data, error } = await withTimeout(
    supabase.from('users').select('*').eq('id', userId).maybeSingle(),
    10_000,
    'Tiempo agotado cargando tu perfil',
  );
  if (error) return null;
  return data;
}

/** Crea o recupera el perfil en public.users tras login. */
export async function ensureUserProfile(user) {
  if (!isSupabaseConfigured || !user?.id) return null;

  const existing = await getProfile(user.id);
  if (existing) return existing;

  const payload = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name
      || user.user_metadata?.name
      || user.email?.split('@')[0]
      || 'Usuario',
    avatar_url: user.user_metadata?.avatar_url || null,
    role: 'CLIENT',
  };

  const { data, error } = await withTimeout(
    supabase
      .from('users')
      .insert(payload)
      .select()
      .maybeSingle(),
    10_000,
    'Tiempo agotado creando tu perfil',
  );

  if (error?.code === '23505') {
    return getProfile(user.id);
  }
  if (error) return null;
  return data;
}

export async function updateProfile(userId, updates) {
  if (!isSupabaseConfigured) return null;

  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  if (!sessionUser?.id) throw new Error('Debes iniciar sesión');

  const actorProfile = await getProfile(sessionUser.id);
  const isAdmin = isAdminRole(actorProfile?.role);

  if (!isAdmin) {
    assertOwnUserId(sessionUser.id, userId);
  }

  const safeUpdates = sanitizeProfileUpdates(updates, { isAdmin });

  const result = await sbFetch(
    supabase
      .from('users')
      .update({ ...safeUpdates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single(),
    'Tiempo agotado actualizando perfil',
  );

  emitCommEvent('account_profile_updated', {
    recipientId: userId,
    actorId: sessionUser.id,
    payload: { fields: Object.keys(safeUpdates) },
  }).catch(() => {});

  return result;
}

/** Sesión rápida para pedir sin email — activar Anonymous Auth en Supabase */
export async function ensureCheckoutSession({ fullName, phone }) {
  if (!isSupabaseConfigured) return null;

  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    await updateProfile(session.user.id, { full_name: fullName, phone });
    if (session.user.is_anonymous) {
      rememberGuestUserId(session.user.id);
    }
    return session.user;
  }

  const data = await sbFetch(
    supabase.auth.signInAnonymously(),
    'Tiempo agotado iniciando sesión de invitado',
  );

  await updateProfile(data.user.id, { full_name: fullName, phone });
  rememberGuestUserId(data.user.id);
  return data.user;
}
