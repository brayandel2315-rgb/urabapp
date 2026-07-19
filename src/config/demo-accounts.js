/** Cuentas demo internas — solo en DEV local con VITE_DEMO_MODE=true */
export const DEMO_ACCOUNTS = [
  {
    id: 'client',
    role: 'CLIENT',
    email: 'test.cliente@urabapp.com',
    label: 'Cliente demo',
    description: 'Pedido entregado con ítem agotado',
    redirect: '/pedidos',
  },
  {
    id: 'business',
    role: 'BUSINESS',
    email: 'test.tienda@urabapp.com',
    label: 'Tienda demo',
    description: 'Restaurante El Bananero',
    redirect: '/negocio',
  },
  {
    id: 'rider',
    role: 'RIDER',
    email: 'test.mensajero@urabapp.com',
    label: 'Mensajero demo',
    description: 'Recogida con demora reportada',
    redirect: '/domiciliario',
  },
];

export function isDemoAccessEnabled() {
  // Nunca en builds de producción (Vercel/Netlify)
  if (import.meta.env.PROD || import.meta.env.MODE === 'production') return false;
  return import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === 'true';
}

export function getDemoPassword() {
  if (!isDemoAccessEnabled()) return '';
  const pwd = import.meta.env.VITE_DEMO_PASSWORD;
  if (!pwd && import.meta.env.DEV) {
    console.warn('[demo] Define VITE_DEMO_PASSWORD en .env.local para cuentas demo');
  }
  return pwd || '';
}
