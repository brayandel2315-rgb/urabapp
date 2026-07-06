/** Horario de apertura del negocio (HH:MM en BD) */
export function isBusinessOpenNow(business) {
  if (!business?.is_open) return false;
  if (!business.opens_at || !business.closes_at) return true;

  const now = new Date();
  const [openH, openM] = String(business.opens_at).slice(0, 5).split(':').map(Number);
  const [closeH, closeM] = String(business.closes_at).slice(0, 5).split(':').map(Number);
  const minutes = now.getHours() * 60 + now.getMinutes();
  const openMin = openH * 60 + openM;
  const closeMin = closeH * 60 + closeM;

  if (closeMin > openMin) {
    return minutes >= openMin && minutes < closeMin;
  }
  return minutes >= openMin || minutes < closeMin;
}

export function formatBusinessHours(business) {
  if (!business?.opens_at || !business?.closes_at) return 'Horario no definido';
  const open = String(business.opens_at).slice(0, 5);
  const close = String(business.closes_at).slice(0, 5);
  return `${open} – ${close}`;
}

/** Estado compuesto para panel comercio (is_open + horario). */
export function getBusinessOpenState(business) {
  if (!business?.is_open) {
    return {
      acceptingOrders: false,
      label: 'Cerrado',
      variant: 'muted',
      hint: 'Abre tu tienda para recibir pedidos nuevos.',
    };
  }
  if (!isBusinessOpenNow(business)) {
    return {
      acceptingOrders: false,
      label: 'Fuera de horario',
      variant: 'warning',
      hint: `Los clientes no pueden pedir ahora. Horario: ${formatBusinessHours(business)}.`,
    };
  }
  return {
    acceptingOrders: true,
    label: 'Abierto',
    variant: 'success',
    hint: null,
  };
}

export function isBusinessStoreLive(business) {
  return business?.verification_status === 'approved' && business?.is_published !== false;
}

export function getBusinessEtaMinutes(business) {
  return business?.prep_time_minutes ?? business?.delivery_time ?? 25;
}
