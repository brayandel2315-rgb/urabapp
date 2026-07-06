import entregaRapida from '@/assets/hero-dashboard/entrega-rapida.png';
import tiendasAbiertas from '@/assets/hero-dashboard/tiendas-abiertas.png';
import enviosHoy from '@/assets/hero-dashboard/envios-hoy.png';
import ofertaDia from '@/assets/hero-dashboard/oferta-dia.png';

export const HERO_DASHBOARD_ICONS = {
  delivery: entregaRapida,
  stores: tiendasAbiertas,
  shipments: enviosHoy,
  offer: ofertaDia,
};

export function getHeroDashboardIcon(key) {
  return HERO_DASHBOARD_ICONS[key] ?? null;
}
