import { AUTH_INTENT, getAuthIntentMeta } from '@/auth/auth-intents';
import { getPostLoginPath } from '@/app/roleConfig';
import { ROLES } from '@/utils/constants';
import { safeRedirectPath } from '@/utils/validate';

/** Destino tras autenticación según intención de rol */
export function getPostAuthPath({ intent, redirectPath, profileRole }) {
  const meta = getAuthIntentMeta(intent);
  const safe = safeRedirectPath(redirectPath, '');
  const base = safe?.split('?')[0];

  if (safe && base && !['/cuenta/perfil', '/perfil', '/'].includes(base)) {
    return safe;
  }

  if (intent === AUTH_INTENT.BUSINESS) {
    if (profileRole === ROLES.BUSINESS || profileRole === ROLES.ADMIN) return '/negocio';
    return meta.onboardingPath;
  }
  if (intent === AUTH_INTENT.RIDER) {
    if (profileRole === ROLES.RIDER || profileRole === ROLES.ADMIN) return '/domiciliario';
    return meta.onboardingPath;
  }
  return getPostLoginPath(redirectPath, profileRole);
}
