/**
 * Medios de pago — Wompi (Nequi, PSE, tarjetas) + efectivo contra entrega.
 */

export function isWompiEnabled() {
  return import.meta.env.VITE_WOMPI_ENABLED === 'true'
    || Boolean(import.meta.env.VITE_WOMPI_PUBLIC_KEY);
}

export const PAYMENT_SECTIONS = {
  available: {
    id: 'available',
    title: 'Disponible ahora',
    subtitle: isWompiEnabled() ? 'Efectivo o pago digital' : 'Checkout contra entrega',
  },
  digital: {
    id: 'digital',
    title: 'Pagos digitales',
    subtitle: isWompiEnabled() ? 'Procesado por Wompi' : 'Próximamente en Urabapp',
  },
};

const WOMPI_METHOD = {
  id: 'wompi',
  name: 'Pago digital (Wompi)',
  description: 'Nequi, PSE, tarjetas, Daviplata, Bancolombia',
  icon: 'card',
  section: 'available',
  active: true,
};

/** Métodos activos en checkout */
export const PAYMENT_METHODS = [
  {
    id: 'cash',
    name: 'Efectivo contra entrega',
    description: 'Pagas al recibir tu pedido',
    icon: 'cash',
    section: 'available',
    active: true,
  },
  ...(isWompiEnabled() ? [WOMPI_METHOD] : []),
];

/** Métodos digitales — informativos cuando Wompi está activo */
export const PAYMENT_METHODS_UPCOMING = [
  { id: 'nequi', name: 'Nequi', icon: 'nequi', group: 'digital' },
  { id: 'pse', name: 'PSE', icon: 'pse', group: 'digital' },
  { id: 'daviplata', name: 'Daviplata', icon: 'daviplata', group: 'digital' },
  { id: 'cards', name: 'Tarjetas crédito y débito', icon: 'card', group: 'digital', detail: 'Visa · Mastercard · Amex' },
  { id: 'qr_bancolombia', name: 'QR Bancolombia', icon: 'qr', group: 'digital' },
  { id: 'bancolombia', name: 'Transferencia Bancolombia', icon: 'building', group: 'digital' },
  { id: 'corresponsal', name: 'Efectivo en corresponsal', icon: 'corresponsal', group: 'digital' },
];

export const PAYMENT_TRUST_COPY = {
  headline: 'Aquí puedes pedir con confianza',
  body: isWompiEnabled()
    ? 'Paga contra entrega o con medios digitales seguros vía Wompi.'
    : 'Hoy aceptamos pago contra entrega. Los medios digitales se habilitarán próximamente.',
  footnote: 'Urabapp — entregado localmente en Urabá',
};
