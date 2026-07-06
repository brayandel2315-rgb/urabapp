/**
 * Catálogo único de categorías — alineado con BD (businesses.category + tabla categories).
 * Verticals de navegación (landing) + tipos de comercio (explorar/filtros).
 */

/** Tipos de comercio en base de datos */
export const BUSINESS_CATEGORIES = {
  comida: {
    id: 'comida',
    name: 'Comida',
    shortName: 'Comida',
    plural: 'Restaurantes y fondas',
    icon: 'comida',
    emoji: '🍔',
    sortOrder: 1,
    theme: {
      bg: 'bg-orange-500',
      light: 'bg-orange-50',
      text: 'text-orange-700',
      ring: 'ring-orange-300',
      active: 'bg-orange-500 text-white shadow-orange-500/30',
    },
  },
  mercado: {
    id: 'mercado',
    name: 'Mercado',
    shortName: 'Mercado',
    plural: 'Mercados y súper',
    icon: 'market',
    emoji: '🛒',
    sortOrder: 2,
    theme: {
      bg: 'bg-emerald-500',
      light: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: 'ring-emerald-300',
      active: 'bg-emerald-600 text-white shadow-emerald-500/30',
    },
  },
  farmacia: {
    id: 'farmacia',
    name: 'Farmacia',
    shortName: 'Farmacia',
    plural: 'Farmacias y droguerías',
    icon: 'pharmacy',
    emoji: '💊',
    sortOrder: 3,
    theme: {
      bg: 'bg-sky-500',
      light: 'bg-sky-50',
      text: 'text-sky-700',
      ring: 'ring-sky-300',
      active: 'bg-sky-600 text-white shadow-sky-500/30',
    },
  },
  licoreria: {
    id: 'licoreria',
    name: 'Licorería',
    shortName: 'Licores',
    plural: 'Licorerías',
    icon: 'beer',
    emoji: '🍺',
    sortOrder: 4,
    theme: {
      bg: 'bg-amber-500',
      light: 'bg-amber-50',
      text: 'text-amber-800',
      ring: 'ring-amber-300',
      active: 'bg-amber-600 text-white shadow-amber-500/30',
    },
  },
  tiendas: {
    id: 'tiendas',
    name: 'Tiendas',
    shortName: 'Tiendas',
    plural: 'Tiendas del barrio',
    icon: 'tiendas',
    emoji: '🏪',
    sortOrder: 5,
    theme: {
      bg: 'bg-violet-500',
      light: 'bg-violet-50',
      text: 'text-violet-700',
      ring: 'ring-violet-300',
      active: 'bg-violet-600 text-white shadow-violet-500/30',
    },
  },
  mascotas: {
    id: 'mascotas',
    name: 'Mascotas',
    shortName: 'Mascotas',
    plural: 'Mascotas',
    icon: 'pet',
    emoji: '🐾',
    sortOrder: 6,
    theme: {
      bg: 'bg-pink-500',
      light: 'bg-pink-50',
      text: 'text-pink-700',
      ring: 'ring-pink-300',
      active: 'bg-pink-600 text-white shadow-pink-500/30',
    },
  },
  tecnologia: {
    id: 'tecnologia',
    name: 'Tecnología',
    shortName: 'Tecno',
    plural: 'Tecnología',
    icon: 'mobile',
    emoji: '📱',
    sortOrder: 7,
    theme: {
      bg: 'bg-slate-600',
      light: 'bg-slate-100',
      text: 'text-slate-700',
      ring: 'ring-slate-300',
      active: 'bg-slate-700 text-white shadow-slate-500/30',
    },
  },
  mandados: {
    id: 'mandados',
    name: 'Mandados',
    shortName: 'Mandado',
    plural: 'Mensajería',
    icon: 'mensajeria',
    emoji: '📦',
    sortOrder: 8,
    serviceOnly: true,
    route: '/mandado',
    theme: {
      bg: 'bg-blue-500',
      light: 'bg-blue-50',
      text: 'text-blue-700',
      ring: 'ring-blue-300',
      active: 'bg-blue-600 text-white shadow-blue-500/30',
    },
  },
  envios: {
    id: 'envios',
    name: 'Envíos',
    shortName: 'Envíos',
    plural: 'Envíos intermunicipales',
    icon: 'envios',
    emoji: '🚚',
    sortOrder: 9,
    serviceOnly: true,
    route: '/envios',
    theme: {
      bg: 'bg-teal-500',
      light: 'bg-teal-50',
      text: 'text-teal-700',
      ring: 'ring-teal-300',
      active: 'bg-teal-600 text-white shadow-teal-500/30',
    },
  },
};

/** IDs visibles en /explorar (comercios + accesos a servicios) */
export const EXPLORE_CATEGORY_IDS = [
  'comida',
  'mercado',
  'farmacia',
  'licoreria',
  'tiendas',
  'mascotas',
  'tecnologia',
  'mandados',
  'envios',
];

/** Verticals de marketing (landing) */
export const NAV_VERTICALS = [
  {
    id: 'comida',
    name: 'Comida',
    icon: 'comida',
    phase: 1,
    tagline: '¿Con hambre?',
    description: 'El almuerzo de la esquina, la pizza del barrio o lo que se te antoje — te lo llevamos a la puerta.',
    cardLine: 'Domicilios de restaurantes y fondas',
    cta: 'Ver restaurantes',
  },
  {
    id: 'mensajeria',
    name: 'Mensajería',
    icon: 'mensajeria',
    phase: 1,
    tagline: '¿Un recado?',
    description: 'Mandamos a alguien de confianza a recoger, pagar o llevar lo que necesites, con seguimiento en la app.',
    cardLine: 'Recogemos, pagamos y entregamos',
    cta: 'Pedir un mandado',
    route: '/mandado',
  },
  {
    id: 'tiendas',
    name: 'Tiendas locales',
    icon: 'tiendas',
    phase: 1,
    tagline: '¿De la tienda?',
    description: 'Mercado, droguería, licorera y el comercio de siempre — sin hacer fila ni salir de casa.',
    cardLine: 'Mercado, droguería y comercio local',
    cta: 'Mirar tiendas',
  },
  {
    id: 'envios',
    name: 'Envíos intermunicipales',
    icon: 'envios',
    phase: 2,
    badge: 'Recién llegó',
    tagline: '¿Paquete lejos?',
    description: 'De Necoclí a Chigorodó — movemos tu paquete por la troncal con alguien que conoce el camino.',
    cardLine: 'Paquetes entre municipios del Urabá',
    cta: 'Enviar paquete',
    route: '/envios',
  },
  {
    id: 'reparaciones',
    name: 'Reparaciones',
    icon: 'reparaciones',
    phase: 3,
    comingSoon: true,
    tagline: '¿Algo dañado en casa?',
    description: 'Plomero, electricista y ayuda en el hogar con personas recomendadas. Lo estamos armando contigo.',
    cardLine: 'Plomero, electricista y más',
    comingLabel: 'Muy pronto',
  },
];

/** Agrupación vertical → categorías BD (compatibilidad URLs antiguas) */
export const CATEGORY_GROUPS = {
  comida: ['comida'],
  mensajeria: ['mandados', 'mensajeria'],
  tiendas: ['mercado', 'farmacia', 'licoreria', 'mascotas', 'tecnologia', 'tiendas'],
  envios: ['envios'],
};

const VERTICAL_LABELS = Object.fromEntries(NAV_VERTICALS.map((v) => [v.id, v.name]));

export function getBusinessCategory(id) {
  return BUSINESS_CATEGORIES[id] ?? null;
}

export function getCategoryLabel(id) {
  if (!id) return 'Todos los comercios';
  return BUSINESS_CATEGORIES[id]?.name ?? VERTICAL_LABELS[id] ?? id;
}

export function getCategoryPlural(id) {
  return BUSINESS_CATEGORIES[id]?.plural ?? getCategoryLabel(id);
}

/** Resuelve filtro de BD para un id de categoría o vertical */
export function resolveCategoryFilter(categoryId) {
  if (!categoryId) return null;
  if (categoryId === 'mensajeria') return CATEGORY_GROUPS.mensajeria;
  if (CATEGORY_GROUPS[categoryId]) return CATEGORY_GROUPS[categoryId];
  if (BUSINESS_CATEGORIES[categoryId]) return [categoryId];
  return [categoryId];
}

export function isServiceCategory(categoryId) {
  return Boolean(BUSINESS_CATEGORIES[categoryId]?.serviceOnly);
}

export function getCategoryRoute(categoryId) {
  const cat = BUSINESS_CATEGORIES[categoryId];
  if (cat?.route) return cat.route;
  const vertical = NAV_VERTICALS.find((v) => v.id === categoryId);
  return vertical?.route ?? null;
}

export function getExploreCategories() {
  return EXPLORE_CATEGORY_IDS.map((id) => BUSINESS_CATEGORIES[id]).filter(Boolean);
}

export function getOnboardingCategories() {
  return Object.values(BUSINESS_CATEGORIES)
    .filter((c) => !c.serviceOnly)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export const VERTICAL_CARD_THEMES = {
  comida: {
    gradient: 'from-[#FF6B35] via-[#F4511E] to-[#E64A19]',
    glow: 'bg-orange-400/25',
    iconWrap: 'bg-white/20 text-white',
    pill: 'bg-white/95 text-orange-700',
  },
  mensajeria: {
    gradient: 'from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]',
    glow: 'bg-blue-400/25',
    iconWrap: 'bg-white/20 text-white',
    pill: 'bg-white/95 text-blue-700',
  },
  tiendas: {
    gradient: 'from-[#1C8238] via-[#166B3A] to-[#0F4D2A]',
    glow: 'bg-emerald-400/20',
    iconWrap: 'bg-white/20 text-white',
    pill: 'bg-white/95 text-emerald-800',
  },
  envios: {
    gradient: 'from-[#0D9488] via-[#0F766E] to-[#115E59]',
    glow: 'bg-teal-300/25',
    iconWrap: 'bg-white/20 text-white',
    pill: 'bg-white/95 text-teal-800',
  },
  reparaciones: {
    gradient: 'from-slate-500 via-slate-600 to-slate-700',
    glow: 'bg-slate-400/15',
    iconWrap: 'bg-white/15 text-white/80',
    pill: 'bg-white/20 text-white',
  },
};
