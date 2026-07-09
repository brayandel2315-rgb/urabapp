/**
 * Páginas verticales de descubrimiento — cada categoría tiene su propia ruta.
 */

export const VERTICAL_SECTION_TYPES = {
  FAVORITOS: 'favoritos',
  CERCA: 'cerca',
  RAPIDA: 'rapida',
  ABIERTOS: 'abiertos',
  RECOMENDADOS: 'recomendados',
  DESCUBIERTOS: 'descubiertos',
  DEMANDA: 'demanda',
  NUEVOS: 'nuevos',
  PEDIDOS: 'pedidos',
  OFERTAS: 'ofertas',
};

export const VERTICAL_PAGES = {
  restaurantes: {
    id: 'restaurantes',
    route: '/restaurantes',
    title: 'Sabores cerca de ti',
    subtitle: 'Explora restaurantes disponibles.',
    categories: ['comida'],
    seo: {
      title: 'Restaurantes en Urabá',
      description: 'Pide comida a domicilio de restaurantes y fondas en tu municipio.',
    },
    sections: [
      { type: 'favoritos', title: 'Favoritos de Urabá', limit: 8 },
      { type: 'cerca', title: 'Cerca de ti', limit: 8 },
      { type: 'rapida', title: 'Entrega más rápida', limit: 6 },
      { type: 'abiertos', title: 'Abiertos ahora', limit: 8 },
      { type: 'recomendados', title: 'Recomendados para ti', limit: 6 },
      { type: 'demanda', title: 'Alta demanda', limit: 6 },
    ],
  },
  mercado: {
    id: 'mercado',
    route: '/mercado',
    title: 'Compra mercado sin salir',
    subtitle: 'Todo para tu hogar.',
    categories: ['mercado'],
    seo: {
      title: 'Mercado a domicilio',
      description: 'Mercados y súper en Urabá con entrega a tu puerta.',
    },
    sections: [
      { type: 'favoritos', title: 'Mercados destacados', limit: 8 },
      { type: 'rapida', title: 'Compra rápida', limit: 6 },
      { type: 'cerca', title: 'Cerca de ti', limit: 8 },
      { type: 'abiertos', title: 'Abiertos ahora', limit: 6 },
    ],
  },
  farmacia: {
    id: 'farmacia',
    route: '/farmacia',
    title: 'Salud y bienestar cuando lo necesites',
    subtitle: 'Entrega segura.',
    categories: ['farmacia'],
    seo: {
      title: 'Farmacia a domicilio',
      description: 'Farmacias y droguerías con entrega en Urabá.',
    },
    sections: [
      { type: 'favoritos', title: 'Favoritos de Urabá', limit: 6 },
      { type: 'abiertos', title: 'Abiertos ahora', limit: 8 },
      { type: 'rapida', title: 'Entrega más rápida', limit: 6 },
      { type: 'cerca', title: 'Cerca de ti', limit: 6 },
    ],
  },
  mensajeria: {
    id: 'mensajeria',
    route: '/mandado',
    title: 'Envía lo que necesites',
    subtitle: 'Mandados y entregas.',
    serviceOnly: true,
    serviceRoute: '/mandado',
    categories: [],
    seo: {
      title: 'Mensajería y mandados',
      description: 'Mandados locales con seguimiento en Urabá.',
    },
    sections: [],
  },
  envios: {
    id: 'envios',
    route: '/envios',
    title: 'Conecta municipios',
    subtitle: 'Envía entre ciudades.',
    serviceOnly: true,
    serviceRoute: '/envios',
    categories: [],
    seo: {
      title: 'Envíos intermunicipales',
      description: 'Envíos entre municipios del Urabá.',
    },
    sections: [],
  },
  tiendas: {
    id: 'tiendas',
    route: '/tiendas',
    title: 'Descubre tiendas locales',
    subtitle: 'Compra en Urabá.',
    categories: ['tiendas', 'licoreria', 'mascotas', 'tecnologia'],
    seo: {
      title: 'Tiendas locales',
      description: 'Tiendas, licorerías y venta local en Urabá.',
    },
    sections: [
      { type: 'favoritos', title: 'Favoritos de Urabá', limit: 8 },
      { type: 'nuevos', title: 'Nuevos en UrabApp', limit: 6 },
      { type: 'descubiertos', title: 'Descubiertos hoy', limit: 6 },
      { type: 'cerca', title: 'Cerca de ti', limit: 8 },
      { type: 'pedidos', title: 'Lo más pedido', limit: 6 },
    ],
  },
};

export const HOME_CATEGORY_TILES = [
  { id: 'restaurantes', label: 'Restaurantes', icon: 'comida', route: '/restaurantes' },
  { id: 'mercado', label: 'Mercado', icon: 'market', route: '/mercado' },
  { id: 'farmacia', label: 'Farmacia', icon: 'pharmacy', route: '/farmacia' },
  { id: 'mensajeria', label: 'Mensajería', icon: 'mensajeria', route: '/mandado' },
  { id: 'tiendas', label: 'Tiendas', icon: 'tiendas', route: '/tiendas' },
  { id: 'envios', label: 'Envíos', icon: 'envios', route: '/envios' },
  { id: 'locales', label: 'Locales', icon: 'store', route: '/tiendas' },
  { id: 'more', label: 'Ver más', icon: 'all', route: '/search' },
];

/** Home móvil: 6 categorías sin duplicar rutas ni competir con el FAB de servicios */
export const HOME_CATEGORY_TILES_MOBILE = [
  { id: 'restaurantes', label: 'Comida', icon: 'comida', route: '/restaurantes' },
  { id: 'mercado', label: 'Mercado', icon: 'market', route: '/mercado' },
  { id: 'farmacia', label: 'Farmacia', icon: 'pharmacy', route: '/farmacia' },
  { id: 'tiendas', label: 'Tiendas', icon: 'tiendas', route: '/tiendas' },
  { id: 'ofertas', label: 'Ofertas', icon: 'tag', route: '/ofertas' },
  { id: 'more', label: 'Explorar', icon: 'all', route: '/search' },
];

export const DEFAULT_TRENDING = [
  'Hamburguesa', 'Pollo', 'Sushi', 'Envíos', 'Farmacia', 'Pizza', 'Mercado', 'Mandado',
];

export function getVerticalById(id) {
  return VERTICAL_PAGES[id] ?? null;
}

export function getVerticalByPath(pathname) {
  return Object.values(VERTICAL_PAGES).find((v) => v.route === pathname) ?? null;
}
