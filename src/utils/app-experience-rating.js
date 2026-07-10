const STORAGE_KEY = 'urabapp-app-experience-rating-v1';
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000;
const RECENT_DELIVERY_MS = 3 * 60 * 60 * 1000;

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { promptedIds: [], dismissedUntil: 0 };
  } catch {
    return { promptedIds: [], dismissedUntil: 0 };
  }
}

function writeState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function isAppRatingDismissed() {
  const { dismissedUntil } = readState();
  return dismissedUntil > Date.now();
}

export function wasAppRatingPromptedFor(id) {
  const { promptedIds } = readState();
  return promptedIds.includes(id);
}

export function markAppRatingPrompted(id, score = null) {
  const state = readState();
  const promptedIds = state.promptedIds.includes(id)
    ? state.promptedIds
    : [...state.promptedIds, id].slice(-40);
  writeState({
    ...state,
    promptedIds,
    lastScore: score ?? state.lastScore,
    dismissedUntil: score != null ? Date.now() + 30 * 24 * 60 * 60 * 1000 : state.dismissedUntil,
  });
}

export function dismissAppRatingPrompt() {
  const state = readState();
  writeState({ ...state, dismissedUntil: Date.now() + DISMISS_MS });
}

function isRecentDelivery(timestamp) {
  if (!timestamp) return false;
  return Date.now() - new Date(timestamp).getTime() < RECENT_DELIVERY_MS;
}

export function findEligibleAppRatingDelivery(orders = [], shipments = []) {
  if (isAppRatingDismissed()) return null;

  const deliveredOrder = orders.find((order) => (
    order.status === 'delivered'
    && isRecentDelivery(order.delivered_at || order.updated_at)
    && !wasAppRatingPromptedFor(`order:${order.id}`)
  ));

  if (deliveredOrder) {
    return {
      id: `order:${deliveredOrder.id}`,
      kind: 'order',
      label: deliveredOrder.businesses?.name || 'tu pedido',
      deliveredAt: deliveredOrder.delivered_at || deliveredOrder.updated_at,
    };
  }

  const deliveredShipment = shipments.find((shipment) => (
    ['delivered', 'completed'].includes(shipment.status)
    && isRecentDelivery(shipment.delivered_at || shipment.updated_at)
    && !wasAppRatingPromptedFor(`shipment:${shipment.id}`)
  ));

  if (deliveredShipment) {
    return {
      id: `shipment:${deliveredShipment.id}`,
      kind: 'shipment',
      label: `envío a ${deliveredShipment.dest_municipio || 'destino'}`,
      deliveredAt: deliveredShipment.delivered_at || deliveredShipment.updated_at,
    };
  }

  return null;
}
