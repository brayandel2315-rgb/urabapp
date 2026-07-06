import { PaymentProvider } from './PaymentProvider';
import { PAYMENT_PROVIDERS } from '../types';

/** Stub ePayco — implementar API cuando se active el proveedor. */
export class EPaycoProvider extends PaymentProvider {
  get name() {
    return PAYMENT_PROVIDERS.EPAYCO;
  }

  supportsSplit() {
    return true;
  }

  async createCheckout({ orderId, amount, currency = 'COP' }) {
    console.warn('[EPaycoProvider] stub — configure EPAYCO_* env vars');
    return {
      success: false,
      error: 'epayco_not_configured',
      metadata: { orderId, amount, currency },
    };
  }

  async capture(providerRef) {
    return { success: false, status: 'not_implemented', providerRef };
  }

  async refund(providerRef, amount) {
    return { success: false, providerRef, amount };
  }
}
