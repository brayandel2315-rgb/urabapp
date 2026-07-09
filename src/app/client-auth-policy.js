/**
 * Política de acceso del modo cliente (UrabApp).
 *
 * Público sin sesión: descubrir, buscar, ver tiendas, armar carrito local, cotizar mandado/envíos.
 * Requiere sesión verificada: perfil, pedidos, checkout, seguimiento, soporte, favoritos, pagos.
 */
import { isRealAuthenticatedUser } from '@/utils/auth-session';

export function isClientAuthenticated(user) {
  return isRealAuthenticatedUser(user);
}

/** Rutas que exigen sesión verificada (no anónima). */
export const CLIENT_AUTH_REQUIRED_PREFIXES = [
  '/cuenta',
  '/checkout',
  '/pedidos',
  '/envios/', // detalle; /envios (cotizar) sigue público
];

/** Rutas públicas de descubrimiento y conversión temprana. */
export const CLIENT_PUBLIC_BROWSE_PREFIXES = [
  '/',
  '/search',
  '/explorar',
  '/restaurantes',
  '/mercado',
  '/farmacia',
  '/mensajeria',
  '/tiendas',
  '/tienda',
  '/business',
  '/ofertas',
  '/carrito',
  '/mandado',
  '/envios',
  '/quienes-somos',
  '/info',
  '/legal',
  '/recuperar-cuenta',
];

export function pathRequiresClientAuth(pathname) {
  if (!pathname) return false;
  if (pathname === '/checkout') return true;
  if (pathname.startsWith('/cuenta')) return true;
  if (pathname === '/pedidos' || pathname.startsWith('/pedidos/')) return true;
  if (/^\/envios\/[^/]+/.test(pathname)) return true;
  if (pathname === '/soporte') return false; // landing pública; chat exige sesión en la página
  return false;
}
