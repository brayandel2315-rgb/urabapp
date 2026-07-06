/**
 * Contrato PaymentProvider — el resto del sistema nunca depende de Wompi/ePayco directamente.
 * @typedef {object} CheckoutParams
 * @property {string} orderId
 * @property {number} amount
 * @property {string} [currency]
 * @property {string} [customerEmail]
 * @property {object} [metadata]
 *
 * @typedef {object} CheckoutResult
 * @property {boolean} success
 * @property {string} [checkoutUrl]
 * @property {string} [paymentIntentId]
 * @property {string} [providerRef]
 * @property {string} [error]
 */

export class PaymentProvider {
  /** @returns {string} */
  get name() {
    throw new Error('PaymentProvider.name not implemented');
  }

  /** @returns {boolean} */
  supportsSplit() {
    return false;
  }

  /** @param {CheckoutParams} _params @returns {Promise<CheckoutResult>} */
  async createCheckout(_params) {
    throw new Error('PaymentProvider.createCheckout not implemented');
  }

  /** @param {string} _providerRef @returns {Promise<{ success: boolean; status?: string }>} */
  async capture(_providerRef) {
    throw new Error('PaymentProvider.capture not implemented');
  }

  /** @param {string} _providerRef @param {number} _amount @returns {Promise<{ success: boolean }>} */
  async refund(_providerRef, _amount) {
    throw new Error('PaymentProvider.refund not implemented');
  }

  /** @param {object} _payload @returns {Promise<{ valid: boolean; event?: object }>} */
  async verifyWebhook(_payload) {
    return { valid: false };
  }
}
