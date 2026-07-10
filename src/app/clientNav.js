/** Rutas y navegación del modo cliente — fuente única */
export const CLIENT_HOME = '/';
export const CLIENT_ABOUT = '/quienes-somos';
export const CLIENT_OFFERS = '/ofertas';
export const CLIENT_ORDERS = '/pedidos';
export const CLIENT_SEARCH = '/search';
export const CLIENT_ACCOUNT = '/cuenta/perfil';
export const CLIENT_NOTIFICATIONS = '/cuenta/notificaciones';

/** Escritorio: IA principal del área de cliente */
export const CLIENT_NAV_LINKS = [
  { to: CLIENT_HOME, label: 'Inicio', icon: 'home', exact: true },
  { to: CLIENT_SEARCH, label: 'Explorar', icon: 'search' },
  { to: CLIENT_OFFERS, label: 'Ofertas', icon: 'tag' },
  { to: CLIENT_ORDERS, label: 'Mis pedidos', icon: 'orders' },
  { to: CLIENT_ACCOUNT, label: 'Mi cuenta', icon: 'profile' },
];

/** Servicios logísticos (secundarios en barra de servicios) */
export const CLIENT_SERVICE_LINKS = [
  { to: '/mandado', label: 'Mensajería', icon: 'mensajeria', hint: 'Mandados locales' },
  { to: '/envios', label: 'Envíos', icon: 'envios', hint: 'Entre municipios' },
  { to: '/soporte', label: 'Ayuda', icon: 'headset', hint: 'Soporte en app' },
];

/** Móvil: dock estilo app premium — Inicio · Explorar · Servicios · Pedidos · Mi cuenta */
export const CLIENT_BOTTOM_TABS = [
  { to: CLIENT_HOME, icon: 'home', label: 'Inicio', exact: true },
  { to: CLIENT_SEARCH, icon: 'search', label: 'Explorar' },
  { to: '/mandado', icon: 'services', label: 'Servicios', featured: true, action: 'services' },
  { to: CLIENT_ORDERS, icon: 'pedidos', label: 'Pedidos' },
  { to: CLIENT_ACCOUNT, icon: 'profile', label: 'Mi cuenta' },
];

/** Rutas que pertenecen a Explorar (búsqueda y verticales) */
const CLIENT_EXPLORE_PREFIXES = [
  '/search',
  '/restaurantes',
  '/mercado',
  '/farmacia',
  '/mensajeria',
  '/tiendas',
  '/ofertas',
  '/carrito',
];

function isExploreRoute(pathname) {
  if (CLIENT_EXPLORE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  return pathname.startsWith('/business/') || pathname.startsWith('/tienda/');
}

function isServicesRoute(pathname) {
  return pathname === '/mandado'
    || pathname.startsWith('/mandado/')
    || pathname === '/envios'
    || pathname.startsWith('/envios/')
    || pathname === '/soporte'
    || pathname.startsWith('/soporte/');
}

function isOrdersRoute(pathname) {
  return pathname === '/pedidos' || pathname.startsWith('/pedidos/');
}

export function isClientNavActive(pathname, to, exact = false) {
  if (to === CLIENT_HOME || exact) {
    return pathname === CLIENT_HOME;
  }
  if (to === CLIENT_SEARCH) {
    return isExploreRoute(pathname);
  }
  if (to === CLIENT_ACCOUNT) {
    return pathname.startsWith('/cuenta');
  }
  if (to === CLIENT_ORDERS) {
    return isOrdersRoute(pathname);
  }
  if (to === '/carrito') {
    return pathname === '/carrito' || pathname === '/checkout';
  }
  if (to === '/mandado' || to === '/envios' || to === '/soporte') {
    return isServicesRoute(pathname);
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}
