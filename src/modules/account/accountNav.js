/** Navegación de cuenta — agrupada por intención del cliente */

export const ACCOUNT_GROUPS = [
  {
    id: 'activity',
    title: 'Actividad',
    items: [
      { to: '/pedidos', label: 'Mis pedidos', icon: 'orders', hint: 'Seguimiento en vivo' },
      { to: '/cuenta/historial', label: 'Historial', icon: 'orders', hint: 'Pedidos, mandados y envíos' },
      { to: '/cuenta/favoritos', label: 'Favoritos', icon: 'star', hint: 'Tiendas guardadas' },
    ],
  },
  {
    id: 'wallet',
    title: 'Pagos y beneficios',
    items: [
      { to: '/cuenta/pagos', label: 'Métodos de pago', icon: 'card', hint: 'Tarjetas y billeteras' },
      { to: '/cuenta/cupones', label: 'Cupones', icon: 'tag', hint: 'Promociones activas' },
      { to: '/cuenta/creditos', label: 'Créditos', icon: 'wallet', hint: 'Saldo UrabApp' },
      { to: '/cuenta/membresia', label: 'UrabApp Pro', icon: 'medalGold', hint: 'Beneficios premium' },
      { to: '/cuenta/facturacion', label: 'Facturación', icon: 'building', hint: 'Datos y comprobantes' },
    ],
  },
  {
    id: 'profile',
    title: 'Tu cuenta',
    items: [
      { to: '/cuenta/datos', label: 'Datos personales', icon: 'profile', hint: 'Nombre, teléfono y cédula' },
      { to: '/cuenta/direcciones', label: 'Direcciones', icon: 'map', hint: 'Casa, trabajo y más' },
      { to: '/cuenta/notificaciones', label: 'Notificaciones', icon: 'bell', hint: 'Avisos y bandeja' },
      { to: '/cuenta/preferencias', label: 'Preferencias', icon: 'settings', hint: 'Tema, idioma y GPS' },
      { to: '/cuenta/seguridad', label: 'Seguridad', icon: 'lock', hint: 'Contraseña y privacidad' },
    ],
  },
  {
    id: 'help',
    title: 'Ayuda',
    items: [
      { to: '/cuenta/ayuda', label: 'Centro de ayuda', icon: 'headset', hint: 'Preguntas frecuentes' },
      { to: '/soporte', label: 'Soporte en la app', icon: 'chat', hint: 'Chat con el equipo' },
    ],
  },
];

/** Lista plana para títulos y búsqueda */
export const ACCOUNT_SECTIONS = ACCOUNT_GROUPS.flatMap((g) => g.items);

export function getAccountSectionTitle(pathname) {
  if (pathname === '/cuenta' || pathname === '/cuenta/perfil') return 'Mi cuenta';
  const section = ACCOUNT_SECTIONS.find(
    (s) => pathname === s.to || pathname.startsWith(`${s.to}/`),
  );
  return section?.label || 'Mi cuenta';
}

export function isAccountNavActive(pathname, item) {
  if (item.to === '/cuenta/perfil') {
    return pathname === '/cuenta' || pathname === '/cuenta/perfil';
  }
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}
