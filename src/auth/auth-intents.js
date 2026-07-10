import { ROLES } from '@/utils/constants';
import { STORE } from '@/utils/marketplace-copy';

/** Intenciones de registro / inicio de sesión */
export const AUTH_INTENT = {
  CLIENT: 'client',
  BUSINESS: 'business',
  RIDER: 'rider',
};

export const AUTH_INTENT_META = {
  [AUTH_INTENT.CLIENT]: {
    id: AUTH_INTENT.CLIENT,
    role: ROLES.CLIENT,
    label: 'Cliente',
    headline: 'Quiero pedir y rastrear',
    subtitle: 'Crea tu perfil para pedidos, direcciones, pagos y seguimiento en vivo.',
    icon: 'home',
    tone: 'primary',
    onboardingPath: '/cuenta/perfil',
    benefits: [
      'Pedidos, mandados y envíos en el Urabá',
      'Mapa y mensajero en tiempo real',
      'Direcciones y métodos de pago guardados',
    ],
    signupTitle: 'Crea tu cuenta de cliente',
    loginTitle: 'Entra a tu cuenta de cliente',
  },
  [AUTH_INTENT.BUSINESS]: {
    id: AUTH_INTENT.BUSINESS,
    role: ROLES.BUSINESS,
    label: 'Comercio',
    headline: 'Quiero vender en Urabapp',
    subtitle: 'Registra tu tienda, menú y recibe pedidos con panel propio.',
    icon: 'store',
    tone: 'emerald',
    onboardingPath: '/negocio/onboarding',
    benefits: [
      'Panel para pedidos y menú digital',
      'Visibilidad en tu municipio',
      'Cobros y métricas de tu tienda',
    ],
    signupTitle: 'Crear cuenta de comercio',
    loginTitle: 'Entrar como comercio',
  },
  [AUTH_INTENT.RIDER]: {
    id: AUTH_INTENT.RIDER,
    role: ROLES.RIDER,
    label: 'Domiciliario',
    headline: 'Quiero repartir y ganar',
    subtitle: 'Únete como mensajero verificado y recibe entregas cerca de ti.',
    icon: 'mensajeria',
    tone: 'sky',
    onboardingPath: '/domiciliario/registro',
    benefits: [
      'Pedidos asignados en tu zona',
      'Ganancias y reputación visibles',
      'Entregas con verificación y seguridad',
    ],
    signupTitle: 'Crear cuenta de domiciliario',
    loginTitle: 'Entrar como domiciliario',
  },
};

export function getAuthIntentMeta(intent) {
  return AUTH_INTENT_META[intent] || AUTH_INTENT_META[AUTH_INTENT.CLIENT];
}

export function inferAuthIntentFromPath(path = '') {
  const p = path.split('?')[0];
  if (p.startsWith('/negocio') || p.startsWith('/info/registrar-comercio')) return AUTH_INTENT.BUSINESS;
  if (p.startsWith('/domiciliario') || p.startsWith('/info/ser-domiciliario')) return AUTH_INTENT.RIDER;
  if (p.startsWith('/cuenta') || p.startsWith('/checkout') || p.startsWith('/pedidos')) return AUTH_INTENT.CLIENT;
  return null;
}

export function isValidAuthIntent(intent) {
  return intent === AUTH_INTENT.CLIENT
    || intent === AUTH_INTENT.BUSINESS
    || intent === AUTH_INTENT.RIDER;
}
