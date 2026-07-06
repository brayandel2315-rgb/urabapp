import { safeRedirectPath } from './validate';

/** Ruta de login con redirect seguro post-auth. */
export function buildLoginRedirect(path = '/', search = '') {
  const target = safeRedirectPath(`${path}${search}`, '/cuenta/perfil');
  return `/login?redirect=${encodeURIComponent(target)}`;
}
