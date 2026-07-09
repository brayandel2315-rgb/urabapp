/** Mensajes claros al aceptar oferta de entrega (mensajero) */
export const COURIER_OFFER_REJECT_REASONS = {
  race_lost: 'Otro mensajero aceptó este pedido antes.',
  offer_expired: 'La oferta expiró. Espera la siguiente.',
  driver_not_available: 'Debes estar en línea y con cuenta aprobada.',
  not_approved: 'Tu cuenta aún no está aprobada. Completa el registro.',
  already_assigned: 'Este pedido ya tiene mensajero.',
  invalid_status: 'El pedido ya no está disponible para aceptar.',
  not_found: 'Pedido no encontrado.',
  unauthorized: 'No tienes permiso para aceptar esta oferta.',
  missing_driver: 'Perfil de mensajero no encontrado.',
  unsupported_type: 'Tipo de pedido no soportado.',
  store_not_ready: 'La tienda aún no marcó el pedido en preparación. Espera un momento.',
  tracking_error: 'Error al registrar el seguimiento. Intenta aceptar de nuevo.',
  server_error: 'Error temporal del servidor. Intenta en unos segundos.',
};

const TRACKING_FK_PATTERN = /order_events_actor_id_fkey|violates foreign key constraint/i;

export function courierOfferErrorMessage(result) {
  if (!result) return 'No se pudo aceptar. Intenta de nuevo.';
  if (typeof result === 'string') {
    if (TRACKING_FK_PATTERN.test(result)) {
      return COURIER_OFFER_REJECT_REASONS.tracking_error;
    }
    try {
      return courierOfferErrorMessage(JSON.parse(result));
    } catch {
      return 'No se pudo aceptar. Intenta de nuevo.';
    }
  }
  if (result.message && typeof result.message === 'string') {
    if (TRACKING_FK_PATTERN.test(result.message)) {
      return COURIER_OFFER_REJECT_REASONS.tracking_error;
    }
    return result.message;
  }
  const reason = result.reason || result.error;
  return COURIER_OFFER_REJECT_REASONS[reason] || 'No se pudo aceptar. Intenta de nuevo.';
}

export function parseCourierRpc(data) {
  if (data == null) return null;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return { success: false, reason: 'parse_error' };
    }
  }
  return data;
}
