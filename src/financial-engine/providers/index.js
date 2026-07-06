import { PAYMENT_PROVIDERS } from '../types';
import { WompiProvider } from './WompiProvider';
import { EPaycoProvider } from './EPaycoProvider';
import { MockProvider } from './MockProvider';

const registry = {
  [PAYMENT_PROVIDERS.WOMPI]: () => new WompiProvider(),
  [PAYMENT_PROVIDERS.EPAYCO]: () => new EPaycoProvider(),
  [PAYMENT_PROVIDERS.MOCK]: () => new MockProvider(),
};

/**
 * Resuelve el proveedor de pagos activo.
 * VITE_PAYMENT_PROVIDER=wompi|epayco|mock
 */
export function getPaymentProvider(name) {
  const key = (name || import.meta.env.VITE_PAYMENT_PROVIDER || PAYMENT_PROVIDERS.WOMPI).toLowerCase();
  const factory = registry[key] || registry[PAYMENT_PROVIDERS.WOMPI];
  return factory();
}

export { WompiProvider, EPaycoProvider, MockProvider };
