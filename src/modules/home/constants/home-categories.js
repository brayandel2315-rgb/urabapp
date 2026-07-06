/** Grid de categorías del HOME MVP — máximo 8, navegación inmediata */
import { STORE } from '@/utils/marketplace-copy';

export const HOME_MVP_CATEGORIES = [
  { id: 'comida', label: 'Restaurantes', icon: 'comida', filter: 'comida' },
  { id: 'mercado', label: 'Mercados', icon: 'market', filter: 'mercado' },
  { id: 'farmacia', label: 'Farmacia', icon: 'pharmacy', filter: 'farmacia' },
  { id: 'mandados', label: 'Mensajería', icon: 'mensajeria', route: '/mandado' },
  { id: 'tiendas', label: 'Tiendas', icon: 'tiendas', filter: 'tiendas' },
  { id: 'licoreria', label: 'Locales', icon: 'store', filter: 'licoreria' },
  { id: 'envios', label: 'Envíos', icon: 'envios', route: '/envios' },
  { id: 'more', label: 'Ver más', icon: 'all', route: '/ofertas' },
];

export const HOME_TRUST_SIGNALS = [
  { id: 'today', label: 'Entrega hoy', icon: 'delivery' },
  { id: 'inter', label: 'Envíos intermunicipales', icon: 'envios' },
  { id: 'verified', label: STORE.verified, icon: 'check' },
  { id: 'live', label: 'Rastreo en vivo', icon: 'map' },
];
