import { ROLES } from '@/utils/constants';
import { STORE } from '@/utils/marketplace-copy';
import { getAccessibleOperationalRoles as getAccessibleRolesFromRbac } from '@/utils/auth-rbac';
import { safeRedirectPath } from '@/utils/validate';

/** Configuración central por rol — navegación, copy y shell visual */
export const ROLE_META = {
  [ROLES.CLIENT]: {
    id: ROLES.CLIENT,
    dataRole: 'client',
    home: '/',
    label: 'Cliente',
    panelTitle: 'Modo cliente',
    subtitle: 'Pide, rastrea y paga en tu municipio',
    icon: 'home',
    accent: 'primary',
    clientNavLabel: 'Pedir',
    securityNote: 'Compra verificada · perfil protegido contra cambios de privilegio',
    nav: [],
    commandItems: [
      { label: 'Inicio', to: '/', icon: 'home' },
      { label: 'Mis pedidos', to: '/pedidos', icon: 'orders' },
      { label: 'Carrito', to: '/carrito', icon: 'cart' },
      { label: 'Perfil', to: '/cuenta/perfil', icon: 'profile' },
      { label: 'Mensajería', to: '/mandado', icon: 'mensajeria' },
      { label: 'Envíos', to: '/envios', icon: 'envios' },
    ],
  },
  [ROLES.BUSINESS]: {
    id: ROLES.BUSINESS,
    dataRole: 'business',
    home: '/negocio',
    label: 'Tienda',
    panelTitle: 'UrabApp Tiendas',
    subtitle: 'Gestiona pedidos, menú y ventas de tu tienda',
    icon: 'store',
    accent: 'primary',
    clientNavLabel: STORE.mine,
    securityNote: 'Sesión segura · solo tu tienda registrada',
    nav: [
      { to: '/negocio', label: 'Panel' },
    ],
    commandItems: [
      { label: STORE.panel, to: '/negocio', icon: 'store' },
    ],
  },
  [ROLES.RIDER]: {
    id: ROLES.RIDER,
    dataRole: 'rider',
    home: '/domiciliario',
    label: 'Mensajero',
    panelTitle: 'UrabApp Repartidor',
    subtitle: 'Conéctate, recibe pedidos y cobra por cada entrega',
    icon: 'mensajeria',
    accent: 'sky',
    clientNavLabel: 'Entregas',
    securityNote: 'Sesión de mensajero · entregas verificadas',
    nav: [
      { to: '/domiciliario', label: 'Pedidos' },
      { to: '/domiciliario/ganancias', label: 'Ganancias' },
      { to: '/domiciliario/cuenta', label: 'Perfil' },
    ],
    commandItems: [
      { label: 'Pedidos', to: '/domiciliario', icon: 'mensajeria' },
      { label: 'Ganancias', to: '/domiciliario/ganancias', icon: 'money' },
      { label: 'Perfil', to: '/domiciliario/cuenta', icon: 'profile' },
    ],
  },
  [ROLES.ADMIN]: {
    id: ROLES.ADMIN,
    dataRole: 'admin',
    home: '/admin',
    label: 'Superusuario',
    panelTitle: 'Centro de control',
    subtitle: 'Administración global · revisión y pruebas en todos los modos',
    icon: 'settings',
    accent: 'secondary',
    clientNavLabel: 'Admin',
    securityNote: 'Superusuario · acceso total para operación y QA',
    nav: [
      { to: '/admin', label: 'Dashboard' },
      { to: '/', label: 'Cliente' },
      { to: '/negocio', label: 'Tienda' },
      { to: '/domiciliario', label: 'Mensajero' },
      { to: '/cuenta/perfil', label: 'Mi cuenta' },
    ],
    commandItems: [
      { label: 'Panel admin', to: '/admin', icon: 'settings' },
      { label: 'Inicio cliente', to: '/', icon: 'home' },
      { label: STORE.panel, to: '/negocio', icon: 'store' },
      { label: 'Panel mensajero', to: '/domiciliario', icon: 'mensajeria' },
      { label: 'Mis pedidos', to: '/pedidos', icon: 'orders' },
      { label: 'Mi perfil', to: '/cuenta/perfil', icon: 'profile' },
    ],
  },
};

export function getRoleMeta(role) {
  return ROLE_META[role] || ROLE_META[ROLES.CLIENT];
}

export function getRoleHome(role) {
  return getRoleMeta(role).home;
}

export function getRoleLabel(role) {
  return getRoleMeta(role).label;
}

/** Rutas operativas disponibles según el rol en base de datos */
export function getAccessibleOperationalRoles(profileRole) {
  return getAccessibleRolesFromRbac(profileRole);
}

export function getPostLoginPath(redirectPath, profileRole) {
  const safe = safeRedirectPath(redirectPath, '');
  const accountPaths = ['/perfil', '/cuenta', '/cuenta/perfil'];
  const normalized = safe?.split('?')[0];
  if (safe && !accountPaths.includes(normalized) && normalized !== '/') {
    return safe;
  }
  if (safe && accountPaths.includes(normalized)) {
    return '/cuenta/perfil';
  }
  return getRoleHome(profileRole);
}

export function getCommandNavItems(profileRole) {
  const items = [...ROLE_META[ROLES.CLIENT].commandItems];
  const accessible = getAccessibleOperationalRoles(profileRole);
  if (accessible.includes(ROLES.BUSINESS)) {
    items.push(...ROLE_META[ROLES.BUSINESS].commandItems);
  }
  if (accessible.includes(ROLES.RIDER)) {
    items.push(...ROLE_META[ROLES.RIDER].commandItems);
  }
  if (accessible.includes(ROLES.ADMIN)) {
    items.push(...ROLE_META[ROLES.ADMIN].commandItems);
  }
  const seen = new Set();
  return items.filter((item) => {
    const key = item.to + item.label;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
