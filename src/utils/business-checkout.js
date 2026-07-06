import { isBusinessOpenNow, isBusinessStoreLive } from './schedule';
import { STORE } from './marketplace-copy';

export function assertBusinessAcceptingOrders(business) {
  if (!business) {
    throw new Error(STORE.notFound);
  }
  if (!isBusinessStoreLive(business)) {
    throw new Error(STORE.notPublished);
  }
  if (!business.is_open) {
    throw new Error(STORE.closed);
  }
  if (!isBusinessOpenNow(business)) {
    throw new Error(STORE.closedHours);
  }
  return true;
}

export function canCheckoutWithBusiness(business) {
  if (!business) return false;
  return isBusinessStoreLive(business) && isBusinessOpenNow(business);
}
