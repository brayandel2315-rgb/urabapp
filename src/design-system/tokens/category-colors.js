/**
 * Category accent map — icon / badge / top-border / image fallbacks.
 * Never use these as full-app background.
 */
export const CATEGORY_COLORS = {
  restaurantes: '#E53935',
  comida: '#E53935',
  mercado: '#2E7D32',
  farmacia: '#2196F3',
  mensajeria: '#FB8C00',
  mandado: '#FB8C00',
  envios: '#6C5CE7',
  hoteles: '#00ACC1',
  transporte: '#1565C0',
  pagos: '#00A86B',
  compras: '#F4B400',
  tiendas: '#F4B400',
  licoreria: '#8E24AA',
  mascotas: '#00897B',
  tecnologia: '#5C6BC0',
  promociones: '#FF7043',
  ofertas: '#FF7043',
  pro: '#D4AF37',
  turismo: '#009966',
  agro: '#E7C547',
  servicios: '#455A64',
  more: '#1E6F43',
  locales: '#1E6F43',
  /** Cocinas / tipos de comida */
  tipica: '#E53935',
  arepas: '#F9A825',
  pollo: '#FB8C00',
  hamburguesas: '#EF6C00',
  pizza: '#C62828',
  asados: '#6D4C41',
  mariscos: '#0288D1',
  rapida: '#FF7043',
  cafe: '#795548',
  postres: '#EC407A',
  jugos: '#43A047',
  otros: '#1E6F43',
  helado: '#EC407A',
  sushi: '#00897B',
};

export function getCategoryColor(id, fallback = '#1E6F43') {
  if (!id) return fallback;
  return CATEGORY_COLORS[String(id).toLowerCase()] || fallback;
}
