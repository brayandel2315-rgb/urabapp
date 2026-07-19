import { safeRedirectPath } from './validate';
import { AUTH_INTENT, inferAuthIntentFromPath, isValidAuthIntent } from '@/auth/auth-intents';

function buildQuery({ redirect, intent, mode, extra = {} }) {
  const params = new URLSearchParams();
  if (redirect) params.set('redirect', safeRedirectPath(redirect, '/'));
  if (intent && isValidAuthIntent(intent)) params.set('intent', intent);
  if (mode) params.set('mode', mode);
  Object.entries(extra).forEach(([k, v]) => {
    if (v != null && v !== '') params.set(k, String(v));
  });
  const q = params.toString();
  return q ? `?${q}` : '';
}

/** URL unificada de entrada — login o registro con intención de rol */
export function buildAuthEntryUrl({
  basePath = '/login',
  redirect,
  intent,
  mode,
  extra,
} = {}) {
  const resolvedIntent = intent || inferAuthIntentFromPath(redirect || '') || AUTH_INTENT.CLIENT;
  return `${basePath}${buildQuery({ redirect, intent: resolvedIntent, mode, extra })}`;
}

/** Ruta de login con redirect seguro post-auth. */
export function buildLoginRedirect(path = '/', search = '', intent) {
  const target = safeRedirectPath(`${path}${search}`, '/cuenta/perfil');
  const resolvedIntent = intent || inferAuthIntentFromPath(target) || AUTH_INTENT.CLIENT;
  return buildAuthEntryUrl({ basePath: '/login', redirect: target, intent: resolvedIntent, mode: 'login' });
}

/** Registro explícito — siempre muestra flujo de crear cuenta */
export function buildRegisterRedirect(path = '/cuenta/perfil', intent = AUTH_INTENT.CLIENT) {
  return buildAuthEntryUrl({
    basePath: '/registro',
    redirect: path,
    intent: intent || inferAuthIntentFromPath(path) || AUTH_INTENT.CLIENT,
    mode: 'signup',
  });
}

export function parseAuthSearchParams(searchParams) {
  const redirect = searchParams.get('redirect');
  const intentParam = searchParams.get('intent');
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const intent = isValidAuthIntent(intentParam)
    ? intentParam
    : inferAuthIntentFromPath(redirect || '') || null;
  return {
    redirect: safeRedirectPath(redirect, '/cuenta/perfil'),
    intent,
    mode,
  };
}
