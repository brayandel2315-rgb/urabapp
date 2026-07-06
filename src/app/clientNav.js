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

/** Móvil: barra inferior estilo app delivery */
export const CLIENT_BOTTOM_TABS = [
  { to: CLIENT_HOME, icon: 'home', label: 'Inicio', exact: true },
  { to: CLIENT_ORDERS, icon: 'orders', label: 'Pedidos' },
  { to: CLIENT_SEARCH, icon: 'search', label: 'Explorar', featured: true },
  { to: '/carrito', icon: 'cart', label: 'Carrito', badgeKey: 'cart' },
  { to: CLIENT_ACCOUNT, icon: 'profile', label: 'Cuenta' },
];

export function isClientNavActive(pathname, to, exact = false) {
  if (exact || to === CLIENT_HOME) {
    return pathname === to
      || (to === CLIENT_HOME && (pathname.startsWith('/tienda') || pathname.startsWith('/business')));
  }
  if (to === CLIENT_ACCOUNT) {
    return pathname.startsWith('/cuenta');
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}
