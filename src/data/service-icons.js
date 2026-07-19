import restaurantes from '@/assets/services/restaurantes.png';
import comida from '@/assets/services/comida.png';
import mercado from '@/assets/services/mercado.png';
import farmacia from '@/assets/services/farmacia.png';
import mensajeria from '@/assets/services/mensajeria.png';
import tiendas from '@/assets/services/tiendas.png';
import locales from '@/assets/services/locales.png';
import envios from '@/assets/services/envios.png';
import ofertas from '@/assets/services/ofertas.png';
import explorar from '@/assets/services/explorar.png';
import soporte from '@/assets/services/soporte.png';

/** Iconos 3D brandboard por categoría de servicio */
export const SERVICE_ICON_IMAGES = {
  restaurantes,
  comida,
  mercado,
  market: mercado,
  farmacia,
  pharmacy: farmacia,
  mensajeria,
  envios,
  tiendas,
  locales,
  store: locales,
  ofertas,
  promo: ofertas,
  tag: ofertas,
  explorar,
  more: explorar,
  all: explorar,
  search: explorar,
  soporte,
  ayuda: soporte,
  support: soporte,
  headset: soporte,
};

export function getServiceIconImage(id) {
  if (!id) return null;
  return SERVICE_ICON_IMAGES[id] ?? null;
}
