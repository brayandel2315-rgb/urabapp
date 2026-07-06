/** Google OAuth solo si está habilitado en Supabase y en VITE_AUTH_GOOGLE_ENABLED=true */
export function isGoogleAuthEnabled() {
  return import.meta.env.VITE_AUTH_GOOGLE_ENABLED === 'true';
}

export function isGoogleDisabledMessage(raw) {
  if (!raw) return false;
  const lower = String(raw).toLowerCase();
  return lower.includes('provider is not enabled')
    || lower.includes('unsupported provider')
    || (lower.includes('validation_failed') && lower.includes('provider'));
}

/** Normaliza errores de Supabase Auth (incluye JSON crudo en message). */
export function parseAuthErrorMessage(error) {
  if (!error) return 'Algo salió mal. Intenta de nuevo.';

  let msg = error.message || String(error);

  try {
    const parsed = JSON.parse(msg);
    if (parsed?.msg) msg = parsed.msg;
    else if (parsed?.error_description) msg = parsed.error_description;
    else if (parsed?.message) msg = parsed.message;
  } catch {
    const jsonMatch = msg.match(/\{[\s\S]*"msg"\s*:\s*"([^"]+)"/);
    if (jsonMatch?.[1]) msg = jsonMatch[1];
  }

  if (isGoogleDisabledMessage(msg)) {
    return 'Google no está habilitado en este momento. Usa email y contraseña en /login.';
  }

  return msg;
}
