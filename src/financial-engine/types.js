/** Estados financieros del Settlement Engine */
export const FINANCIAL_STATUS = {
  PENDING: 'PENDING',
  AUTHORIZED: 'AUTHORIZED',
  CAPTURED: 'CAPTURED',
  HELD: 'HELD',
  SPLIT_PENDING: 'SPLIT_PENDING',
  SETTLED: 'SETTLED',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  PARTIALLY_REFUNDED: 'PARTIALLY_REFUNDED',
  CANCELLED: 'CANCELLED',
};

export const WALLET_OWNER = {
  CLIENT: 'client',
  BUSINESS: 'business',
  RIDER: 'rider',
  PLATFORM: 'platform',
};

export const PAYOUT_CYCLE = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
};

export const FIN_EVENTS = {
  ORDER_SETTLED: 'finance_order_settled',
  SETTLEMENT_CREATED: 'finance_settlement_created',
  PAYOUT_BATCH_RELEASED: 'finance_payout_batch_released',
  REFUND_PROCESSED: 'finance_refund_processed',
  WALLET_CREDITED: 'finance_wallet_credited',
  WALLET_AVAILABLE: 'finance_wallet_available',
};

export const PAYMENT_PROVIDERS = {
  WOMPI: 'wompi',
  EPAYCO: 'epayco',
  PAYU: 'payu',
  STRIPE: 'stripe',
  MOCK: 'mock',
};
