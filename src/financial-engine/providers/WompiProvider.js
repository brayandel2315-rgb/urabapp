import { startWompiCheckout, startShipmentWompiCheckout, isWompiEnabled } from '@/services/wompi.service';
import { PaymentProvider } from './PaymentProvider';
import { PAYMENT_PROVIDERS } from '../types';

export class WompiProvider extends PaymentProvider {
  get name() {
    return PAYMENT_PROVIDERS.WOMPI;
  }

  supportsSplit() {
    return false;
  }

  async createCheckout({ orderId, shipmentId }) {
    if (!isWompiEnabled()) {
      return { success: false, error: 'wompi_disabled' };
    }
    try {
      if (shipmentId) {
        const { url, paymentId } = await startShipmentWompiCheckout(shipmentId);
        return { success: true, checkoutUrl: url, paymentIntentId: paymentId, providerRef: paymentId };
      }
      const { url, paymentId } = await startWompiCheckout(orderId);
      return { success: true, checkoutUrl: url, paymentIntentId: paymentId, providerRef: paymentId };
    } catch (err) {
      return { success: false, error: err?.message || 'wompi_checkout_failed' };
    }
  }
}
