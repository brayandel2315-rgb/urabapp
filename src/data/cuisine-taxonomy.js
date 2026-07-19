/**
 * Taxonomía de cocina para /restaurantes — clasificación client-side.
 * No requiere campos nuevos en BD: usa name, description y emoji.
 */

export const CUISINE_TYPES = [
  {
    id: 'tipica',
    label: 'Típica',
    shortLabel: 'Típica',
    icon: 'food',
    keywords: [
      'tipic', 'típica', 'casera', 'paisa', 'bandeja', 'sancocho', 'mondongo',
      'frijol', 'ajiaco', 'comida colombiana', 'corrientazo', 'almuerzo',
      'fonda', 'cazuela', 'sopa',
    ],
  },
  {
    id: 'arepas',
    label: 'Arepas',
    shortLabel: 'Arepas',
    icon: 'rice',
    keywords: ['arepa', 'empanada', 'patacon', 'patacón', 'buñuelo', 'envuelto'],
  },
  {
    id: 'pollo',
    label: 'Pollo',
    shortLabel: 'Pollo',
    icon: 'food',
    keywords: ['pollo', 'broaster', 'asadero', 'wings', 'alitas', 'nugget'],
  },
  {
    id: 'hamburguesas',
    label: 'Hamburguesas',
    shortLabel: 'Burgers',
    icon: 'food',
    keywords: ['hamburguesa', 'burger', 'smash', 'hot dog', 'perro', 'combo'],
  },
  {
    id: 'pizza',
    label: 'Pizza y pasta',
    shortLabel: 'Pizza',
    icon: 'food',
    keywords: ['pizza', 'pasta', 'lasagna', 'lasaña', 'italiano', 'napoli', 'roma'],
  },
  {
    id: 'asados',
    label: 'Asados',
    shortLabel: 'Asados',
    icon: 'food',
    keywords: ['asado', 'parrilla', 'carne', 'churrasco', 'bbq', 'res ', 'costilla'],
  },
  {
    id: 'mariscos',
    label: 'Mariscos',
    shortLabel: 'Mar',
    icon: 'food',
    keywords: ['marisco', 'ceviche', 'pescado', 'camaron', 'camarón', 'seafood', 'arroz de mar'],
  },
  {
    id: 'rapida',
    label: 'Comida rápida',
    shortLabel: 'Rápida',
    icon: 'bolt',
    keywords: ['rapida', 'rápida', 'fast food', 'snack', 'salchipapa', 'perro caliente', 'shawarma'],
  },
  {
    id: 'cafe',
    label: 'Café y pan',
    shortLabel: 'Café',
    icon: 'juice',
    keywords: ['cafe', 'café', 'panader', 'panadería', 'pasteler', 'desayuno', 'cafeteria', 'cafetería'],
  },
  {
    id: 'postres',
    label: 'Postres',
    shortLabel: 'Postres',
    icon: 'juice',
    keywords: [
      'helado', 'helader', 'postre', 'dulce', 'milkshake', 'malteada',
      'gelato', 'waffle', 'crepe', 'polar', 'sundae',
    ],
  },
  {
    id: 'jugos',
    label: 'Jugos y bowls',
    shortLabel: 'Jugos',
    icon: 'juice',
    keywords: ['jugo', 'smoothie', 'bowl', 'ensalada', 'saludable', 'veggie', 'vegano', 'natural'],
  },
];

const OTHER = {
  id: 'otros',
  label: 'Otros sabores',
  shortLabel: 'Otros',
  icon: 'store',
  keywords: [],
};

function businessSearchText(business) {
  return [
    business?.name,
    business?.description,
    business?.emoji,
    business?.zone,
    business?.promo_label,
    business?.promoLabel,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function normalizeKeyword(keyword) {
  return String(keyword)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Primera cocina que haga match; si ninguna, `otros`. */
export function resolveCuisineId(business) {
  const haystack = businessSearchText(business);
  if (!haystack) return OTHER.id;

  for (const cuisine of CUISINE_TYPES) {
    if (cuisine.keywords.some((kw) => haystack.includes(normalizeKeyword(kw)))) {
      return cuisine.id;
    }
  }
  return OTHER.id;
}

export function getCuisineById(id) {
  if (id === OTHER.id) return OTHER;
  return CUISINE_TYPES.find((c) => c.id === id) || OTHER;
}

/**
 * Agrupa el pool por cocina. Solo incluye grupos con al menos 1 negocio.
 * Orden: taxonomía definida, `otros` al final.
 */
export function groupBusinessesByCuisine(pool = []) {
  const buckets = new Map();
  for (const cuisine of [...CUISINE_TYPES, OTHER]) {
    buckets.set(cuisine.id, []);
  }

  for (const business of pool) {
    const id = resolveCuisineId(business);
    const list = buckets.get(id) || buckets.get(OTHER.id);
    list.push(business);
  }

  return [...CUISINE_TYPES, OTHER]
    .map((cuisine) => ({
      ...cuisine,
      businesses: buckets.get(cuisine.id) || [],
      count: (buckets.get(cuisine.id) || []).length,
    }))
    .filter((group) => group.count > 0);
}

/** Chips visibles en el rail (con conteo > 0) + Todos. */
export function buildCuisineRailOptions(pool = []) {
  const groups = groupBusinessesByCuisine(pool);
  return [
    { id: 'all', label: 'Todos', shortLabel: 'Todos', icon: 'food', count: pool.length },
    ...groups.map((g) => ({
      id: g.id,
      label: g.label,
      shortLabel: g.shortLabel,
      icon: g.icon,
      count: g.count,
    })),
  ];
}

export function filterPoolByCuisine(pool = [], cuisineId = 'all') {
  if (!cuisineId || cuisineId === 'all') return pool;
  return pool.filter((b) => resolveCuisineId(b) === cuisineId);
}
