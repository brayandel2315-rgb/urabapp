/** Recorrido comercial del cliente — mandado urbano */
export const COURIER_CLIENT_JOURNEY = [
  {
    id: 'plan',
    sticker: 'mensajeria',
    title: 'Indica tu ruta',
    caption: 'Marca recogida y entrega en el mapa',
  },
  {
    id: 'quote',
    sticker: 'pago',
    title: 'Precio al instante',
    caption: 'Ves la tarifa antes de confirmar',
  },
  {
    id: 'match',
    sticker: 'notificaciones',
    title: 'Mensajero asignado',
    caption: 'Un conductor de tu zona acepta',
  },
  {
    id: 'track',
    sticker: 'pedido',
    title: 'Seguimiento en vivo',
    caption: 'Mapa, chat y avisos en tiempo real',
  },
  {
    id: 'done',
    sticker: 'favoritos',
    title: 'Entrega segura',
    caption: 'Confirmas al recibir tu paquete',
  },
];

/** Recorrido comercial del cliente — envío intermunicipal */
export const SHIPMENT_CLIENT_JOURNEY = [
  {
    id: 'route',
    sticker: 'envios',
    title: 'Elige tu ruta',
    caption: 'Origen y destino entre municipios',
  },
  {
    id: 'package',
    sticker: 'mercado',
    title: 'Describe el paquete',
    caption: 'Tipo, peso y foto si quieres',
  },
  {
    id: 'pay',
    sticker: 'pago',
    title: 'Cotiza y paga',
    caption: 'Efectivo o pago digital seguro',
  },
  {
    id: 'transit',
    sticker: 'mensajeria',
    title: 'Va en camino',
    caption: 'Transportista y trazabilidad GPS',
  },
  {
    id: 'receive',
    sticker: 'pedido',
    title: 'Llega a destino',
    caption: 'Confirmación y soporte incluidos',
  },
];

export const COURIER_BOOKING_STEPS = [
  { id: 'home', label: 'Inicio' },
  { id: 'form', label: 'Tu ruta' },
  { id: 'quote', label: 'Confirmar' },
];

export const SHIPMENT_BOOKING_STEPS = [
  { id: 'home', label: 'Inicio' },
  { id: 'form', label: 'Datos' },
  { id: 'quote', label: 'Pago' },
];

export const COURIER_USE_CASES = [
  { id: 'document', sticker: 'search', label: 'Documentos', hint: 'Papeles y trámites' },
  { id: 'package', sticker: 'envios', label: 'Paquetes', hint: 'Cajas y encomiendas' },
  { id: 'quick_buy', sticker: 'tiendas', label: 'Compra rápida', hint: 'Pide en una tienda' },
  { id: 'grocery', sticker: 'mercado', label: 'Mercado', hint: 'Compras del barrio' },
];

export const COURIER_TRUST_POINTS = [
  'Mismo municipio',
  'Precio antes de pedir',
  'Rastreo en mapa',
  'Mensajeros verificados',
];

export const SHIPMENT_TRUST_POINTS = [
  'Rutas activas en Urabá',
  'Trazabilidad completa',
  'Pago seguro',
  'Soporte en la app',
];
