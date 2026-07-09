/** Normaliza deep links y URLs de notificaciones a rutas internas válidas. */
export function normalizeAppPath(raw) {
  if (!raw || typeof raw !== 'string') return null;

  let path = raw.trim();
  if (!path) return null;

  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      const url = new URL(path);
      path = `${url.pathname}${url.search}${url.hash}`;
    } catch {
      return null;
    }
  }

  if (!path.startsWith('/')) path = `/${path}`;

  if (path === '/comercio' || path.startsWith('/comercio/')) {
    path = path.replace(/^\/comercio/, '/negocio');
  }

  return path;
}

export function resolveOrderPath(payload = {}) {
  const orderId = payload.orderId || payload.order_id;
  return orderId ? `/pedidos/${orderId}` : '/pedidos';
}

export function resolveShipmentPath(payload = {}) {
  const shipmentId = payload.shipmentId || payload.shipment_id;
  return shipmentId ? `/envios/${shipmentId}` : '/envios';
}
