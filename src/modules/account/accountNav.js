/** Secciones de cuenta — solo visibles con sesión iniciada */
export const ACCOUNT_SECTIONS = [
  { to: '/cuenta/perfil', label: 'Inicio', icon: 'home', hint: 'Resumen de tu cuenta' },
  { to: '/cuenta/notificaciones', label: 'Centro de comunicación', icon: 'bell', hint: 'Bandeja, timeline y avisos' },
  { to: '/cuenta/direcciones', label: 'Direcciones', icon: 'map', hint: 'Casa, trabajo y más' },
  { to: '/cuenta/pagos', label: 'Métodos de pago', icon: 'card', hint: 'Tarjetas y billeteras' },
  { to: '/cuenta/facturacion', label: 'Facturación', icon: 'building', hint: 'Datos y comprobantes' },
  { to: '/cuenta/historial', label: 'Historial', icon: 'orders', hint: 'Pedidos, mandados y envíos' },
  { to: '/cuenta/favoritos', label: 'Favoritos', icon: 'star', hint: 'Tiendas guardadas' },
  { to: '/cuenta/cupones', label: 'Cupones', icon: 'tag', hint: 'Promociones activas' },
  { to: '/cuenta/creditos', label: 'Créditos', icon: 'wallet', hint: 'Saldo UrabApp' },
  { to: '/cuenta/membresia', label: 'UrabApp Pro', icon: 'medalGold', hint: 'Beneficios premium' },
  { to: '/cuenta/preferencias', label: 'Preferencias', icon: 'settings', hint: 'Idioma, tema y GPS' },
  { to: '/cuenta/seguridad', label: 'Seguridad', icon: 'lock', hint: 'Contraseña y privacidad' },
  { to: '/cuenta/ayuda', label: 'Centro de ayuda', icon: 'headset', hint: 'Soporte y preguntas' },
];

export function getAccountSectionTitle(pathname) {
  const section = ACCOUNT_SECTIONS.find((s) => pathname === s.to || pathname.startsWith(`${s.to}/`));
  if (section) return section.label;
  if (pathname.includes('/cuenta/notificaciones')) return 'Centro de comunicación';
  if (pathname.includes('/cuenta/perfil') || pathname === '/cuenta') return 'Mi cuenta';
  return 'Mi cuenta';
}
