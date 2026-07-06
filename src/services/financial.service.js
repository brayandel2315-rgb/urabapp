/**
 * Fachada de aplicación — único punto de entrada recomendado desde UI/servicios.
 */
export {
  WalletService,
  LedgerService,
  SettlementEngine,
  PayoutEngine,
  RefundService,
  CommissionEngine,
  AccountingService,
  AuditService,
  TransactionService,
  FinanceNotificationService,
} from '@/financial-engine';

export { getPaymentProvider } from '@/financial-engine/providers';
export { FINANCIAL_STATUS, WALLET_OWNER, PAYOUT_CYCLE, FIN_EVENTS } from '@/financial-engine/types';

import {
  WalletService,
  SettlementEngine,
  PayoutEngine,
  RefundService,
  CommissionEngine,
  AccountingService,
  AuditService,
} from '@/financial-engine';
import { getPaymentProvider } from '@/financial-engine/providers';

export const financialService = {
  wallet: WalletService,
  settlement: SettlementEngine,
  payout: PayoutEngine,
  refund: RefundService,
  commission: CommissionEngine,
  accounting: AccountingService,
  audit: AuditService,
  getPaymentProvider,
};

export default financialService;
