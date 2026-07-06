import { invokeEdgeFunction } from './edge.service';

const DIGITAL_METHODS = new Set(['wompi', 'nequi', 'pse', 'card', 'daviplata', 'cards']);

export function isWompiEnabled() {
  return import.meta.env.VITE_WOMPI_ENABLED === 'true'
    || Boolean(import.meta.env.VITE_WOMPI_PUBLIC_KEY);
}

export function isDigitalPayment(method) {
  return DIGITAL_METHODS.has(method);
}

export async function startWompiCheckout(orderId) {
  if (!isWompiEnabled()) {
    throw new Error('Pagos digitales no están habilitados. Elige efectivo contra entrega o contacta soporte.');
  }
  const result = await invokeEdgeFunction('create-wompi-checkout', { orderId });
  if (!result?.url) {
    throw new Error('No se pudo abrir la pasarela de pago. Intenta de nuevo o paga contra entrega.');
  }
  return result;
}

export async function startShipmentWompiCheckout(shipmentId) {
  if (!isWompiEnabled()) {
    throw new Error('Pagos digitales no están habilitados. Contacta soporte para completar el envío.');
  }
  const result = await invokeEdgeFunction('create-wompi-shipment-checkout', { shipmentId });
  if (!result?.url) {
    throw new Error('No se pudo abrir la pasarela de pago.');
  }
  return result;
}
