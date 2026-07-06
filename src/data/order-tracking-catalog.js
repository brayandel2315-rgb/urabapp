/** Catálogo de eventos de tracking — iconos, colores y etiquetas */

export const ORDER_EVENT_META = {
  created: { label: 'Pedido creado', icon: 'package', color: 'text-blue-600', bg: 'bg-blue-100' },
  payment_approved: { label: 'Pago aprobado', icon: 'card', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  sent_to_business: { label: 'Enviado al comercio', icon: 'store', color: 'text-violet-600', bg: 'bg-violet-100' },
  business_received: { label: 'Comercio recibió', icon: 'store', color: 'text-violet-600', bg: 'bg-violet-100' },
  business_accepted: { label: 'Pedido aceptado', icon: 'check', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  preparing: { label: 'En preparación', icon: 'food', color: 'text-amber-600', bg: 'bg-amber-100' },
  order_ready: { label: 'Listo para recoger', icon: 'package', color: 'text-primary', bg: 'bg-primary/15' },
  rider_assigned: { label: 'Repartidor asignado', icon: 'mensajeria', color: 'text-sky-600', bg: 'bg-sky-100' },
  rider_reassigned: { label: 'Repartidor reasignado', icon: 'mensajeria', color: 'text-amber-600', bg: 'bg-amber-100' },
  rider_accepted: { label: 'Repartidor aceptó', icon: 'mensajeria', color: 'text-sky-600', bg: 'bg-sky-100' },
  auto_assigned: { label: 'Asignación automática', icon: 'mensajeria', color: 'text-sky-600', bg: 'bg-sky-100' },
  en_route_to_store: { label: 'En camino al comercio', icon: 'map', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  arrived_at_store: { label: 'Llegó al comercio', icon: 'store', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  picked_up: { label: 'Pedido recogido', icon: 'package', color: 'text-primary', bg: 'bg-primary/15' },
  departed: { label: 'Salió del comercio', icon: 'mensajeria', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  en_route: { label: 'En ruta', icon: 'map', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  gps_ping: { label: 'Ubicación actualizada', icon: 'map', color: 'text-muted-foreground', bg: 'bg-muted' },
  arriving_300m: { label: 'A 300 m', icon: 'map', color: 'text-amber-600', bg: 'bg-amber-100' },
  arriving_100m: { label: 'A 100 m', icon: 'map', color: 'text-amber-600', bg: 'bg-amber-100' },
  arriving_50m: { label: 'A 50 m', icon: 'map', color: 'text-orange-600', bg: 'bg-orange-100' },
  arrived: { label: 'Llegó al destino', icon: 'map', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  otp_validated: { label: 'Código OTP validado', icon: 'lock', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  pin_validated: { label: 'PIN validado', icon: 'lock', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  delivered: { label: 'Entregado', icon: 'check', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  rated: { label: 'Calificado', icon: 'star', color: 'text-amber-500', bg: 'bg-amber-100' },
  closed: { label: 'Cerrado', icon: 'check', color: 'text-muted-foreground', bg: 'bg-muted' },
  cancelled: { label: 'Cancelado', icon: 'close', color: 'text-destructive', bg: 'bg-destructive/10' },
  reassigned: { label: 'Reasignado', icon: 'mensajeria', color: 'text-amber-600', bg: 'bg-amber-100' },
  incident: { label: 'Incidencia', icon: 'alert', color: 'text-destructive', bg: 'bg-destructive/10' },
  delivery_proof: { label: 'Foto de entrega', icon: 'check', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  delivery_signature: { label: 'Firma de entrega', icon: 'check', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  delivery_qr_verified: { label: 'QR validado', icon: 'check', color: 'text-sky-600', bg: 'bg-sky-100' },
  courier_phase: { label: 'Actualización', icon: 'mensajeria', color: 'text-muted-foreground', bg: 'bg-muted' },
};

export const ACTOR_ROLE_LABELS = {
  client: 'Cliente',
  business: 'Comercio',
  rider: 'Repartidor',
  admin: 'Admin',
  system: 'Sistema',
};

export function getEventMeta(eventType) {
  return ORDER_EVENT_META[eventType] || {
    label: eventType?.replace(/_/g, ' ') || 'Evento',
    icon: 'package',
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  };
}

export function formatEventTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-CO', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Eventos visibles en timeline (oculta pings GPS ruidosos) */
export function isTimelineEvent(eventType) {
  return eventType !== 'gps_ping' && eventType !== 'courier_phase';
}
