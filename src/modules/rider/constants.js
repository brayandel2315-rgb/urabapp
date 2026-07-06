export const COURIER_VERIFICATION_STATUS = {
  pending: { label: 'Pendiente', color: 'muted' },
  in_review: { label: 'En revisión', color: 'warning' },
  approved: { label: 'Aprobado', color: 'success' },
  rejected: { label: 'Rechazado', color: 'destructive' },
  corrections: { label: 'Correcciones', color: 'warning' },
};

export const COURIER_AVAILABILITY = {
  available: { label: 'Disponible', icon: 'check', description: 'Recibes pedidos' },
  paused: { label: 'Pausado', icon: 'pause', description: 'Sin nuevos pedidos' },
  offline: { label: 'Desconectado', icon: 'offline', description: 'Fuera de servicio' },
};

export const VEHICLE_TYPES = [
  { value: 'moto', label: 'Moto' },
  { value: 'carro', label: 'Carro' },
  { value: 'bicicleta', label: 'Bicicleta' },
  { value: 'pie', label: 'A pie' },
];

export const DOCUMENT_TYPES = [
  { key: 'id_front', label: 'Cédula (frontal)', required: true },
  { key: 'id_back', label: 'Cédula (reverso)', required: true },
  { key: 'license', label: 'Licencia de conducción', required: false, vehicles: ['moto', 'carro'] },
  { key: 'vehicle_registration', label: 'Tarjeta de propiedad', required: false, vehicles: ['moto', 'carro'] },
  { key: 'soat', label: 'SOAT vigente', required: false, vehicles: ['moto', 'carro'] },
  { key: 'insurance', label: 'Seguro', required: false, vehicles: ['carro'] },
  { key: 'profile_photo', label: 'Foto de perfil', required: true },
  { key: 'vehicle_photo', label: 'Foto del vehículo', required: false, vehicles: ['moto', 'carro', 'bicicleta'] },
];

export const REJECT_REASONS = [
  'Muy lejos',
  'Pago bajo',
  'Tráfico / clima',
  'Vehículo no apto',
  'Horario',
  'Otro',
];

export const DELIVERY_PHASES = [
  { key: 'accepted', label: 'Aceptado' },
  { key: 'arriving_pickup', label: 'En camino a recoger' },
  { key: 'picked_up', label: 'Recogido' },
  { key: 'on_the_way', label: 'En entrega' },
  { key: 'delivered', label: 'Finalizado' },
];

export const COURIER_LEVELS = [
  { level: 1, name: 'Bronce', minDeliveries: 0 },
  { level: 2, name: 'Plata', minDeliveries: 25 },
  { level: 3, name: 'Oro', minDeliveries: 100 },
  { level: 4, name: 'Platino', minDeliveries: 300 },
];

export function getCourierLevel(totalDeliveries = 0) {
  let current = COURIER_LEVELS[0];
  for (const l of COURIER_LEVELS) {
    if (totalDeliveries >= l.minDeliveries) current = l;
  }
  return current;
}

export function isCourierApproved(driver) {
  if (!driver) return false;
  return driver.verification_status === 'approved' || driver.is_verified === true;
}

export function formatOnlineTime(totalSeconds = 0) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min`;
}
