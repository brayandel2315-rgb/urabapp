import { PaymentProvider } from './PaymentProvider';
import { PAYMENT_PROVIDERS } from '../types';

/** Proveedor mock para desarrollo y tests. */
export class MockProvider extends PaymentProvider {
  get name() {
    return PAYMENT_PROVIDERS.MOCK;
  }

  supportsSplit() {
    return true;
  }

  async createCheckout({ orderId, amount }) {
    return {
      success: true,
      checkoutUrl: `/pedidos/${orderId}?payment=mock`,
      paymentIntentId: `mock_${orderId}`,
      providerRef: `mock_${orderId}`,
      metadata: { amount },
    };
  }

  async capture(providerRef) {
    return { success: true, status: 'CAPTURED', providerRef };
  }

  async refund(providerRef, amount) {
    return { success: true, providerRef, amount };
  }
}
