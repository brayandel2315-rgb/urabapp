/**
 * Barrios y zonas urbanas del Urabá — por municipio.
 * Apartadó: división oficial en 4 comunas. Demás municipios: zonas urbanas frecuentes.
 */

import {
  APARTADO_COMUNAS,
  APARTADO_POPULAR_BARRIOS,
  LEGACY_ZONE_TO_BARRIOS,
  BARRIO_ALL_ID,
} from './apartado-barrios';

export { BARRIO_ALL_ID, LEGACY_ZONE_TO_BARRIOS };

const SIMPLE = (id, name, barrios) => [{ id, name, subtitle: '', barrios }];

export const MUNICIPIO_BARRIO_CONFIG = {
  Apartadó: {
    groups: APARTADO_COMUNAS,
    popular: APARTADO_POPULAR_BARRIOS,
    footer: '52 barrios en 4 comunas',
  },
  Turbo: {
    groups: SIMPLE('turbo', 'Zona urbana', [
      'Centro',
      'Puerto',
      'La Ye',
      'Nueva Granada',
      'Currulao',
      'Candelaria',
      'Terronal',
      'Villa Nueva',
      'El Bosque',
      'Pantanillo',
      'Zaragocilla',
      'El Progreso',
    ]),
    popular: ['Centro', 'Puerto', 'La Ye', 'Nueva Granada', 'Currulao'],
    footer: 'Zona portuaria y urbana',
  },
  Carepa: {
    groups: SIMPLE('carepa', 'Zona urbana', [
      'Centro',
      'Buenos Aires',
      'La Ye de Caimán',
      'El Paraíso',
      'Nueva Granada',
      'La Frontera',
      'El Progreso',
      'San José',
    ]),
    popular: ['Centro', 'Buenos Aires', 'La Ye de Caimán', 'El Paraíso'],
    footer: 'A orilla de la troncal',
  },
  Chigorodó: {
    groups: SIMPLE('chigorodo', 'Zona urbana', [
      'Centro',
      'La Ye',
      'El Progreso',
      'Nueva Esperanza',
      'Buenos Aires',
      'San José',
      'Betania',
      'La Unión',
    ]),
    popular: ['Centro', 'La Ye', 'El Progreso', 'Nueva Esperanza'],
    footer: 'Corazón bananero del Urabá',
  },
  Necoclí: {
    groups: [
      {
        id: 'urbano',
        name: 'Zona urbana',
        subtitle: 'Necoclí',
        barrios: ['Centro', 'El Progreso', 'Travesías', 'Las Flores', 'San Sebastián', 'Caribe'],
      },
      {
        id: 'costa',
        name: 'Zona costera',
        subtitle: 'Playas',
        barrios: ['Playa', 'Tolu Viejo', 'El Río', 'Brisas del Mar'],
      },
    ],
    popular: ['Centro', 'Playa', 'Travesías', 'El Progreso', 'Caribe'],
    footer: 'Brisa de golfo y playa',
  },
};

export const MUNICIPIOS_WITH_BARRIOS = Object.keys(MUNICIPIO_BARRIO_CONFIG);

export function getBarrioGroups(municipio) {
  return MUNICIPIO_BARRIO_CONFIG[municipio]?.groups ?? [];
}

export function getPopularBarrios(municipio) {
  return MUNICIPIO_BARRIO_CONFIG[municipio]?.popular ?? [];
}

export function getAllBarrios(municipio) {
  return getBarrioGroups(municipio).flatMap((g) => g.barrios);
}

export function getMunicipioBarrioFooter(municipio) {
  const cfg = MUNICIPIO_BARRIO_CONFIG[municipio];
  if (!cfg) return municipio;
  return `${cfg.footer} · ${municipio}`;
}

export function getGroupForBarrio(municipio, barrio) {
  if (!barrio || !municipio) return null;
  return getBarrioGroups(municipio).find((g) => g.barrios.includes(barrio)) ?? null;
}

export function isValidBarrio(municipio, barrio) {
  if (!barrio) return true;
  return getAllBarrios(municipio).includes(barrio);
}

export function searchBarriosByMunicipio(municipio, query, occupiedBarrios = null) {
  const q = query.trim().toLowerCase();
  const allowed = occupiedBarrios ? new Set(occupiedBarrios) : null;
  const matchOccupied = (barrios) =>
    allowed ? barrios.filter((b) => allowed.has(b)) : barrios;

  const groups = getBarrioGroups(municipio);
  if (!q) {
    return groups
      .map((g) => ({ ...g, barrios: matchOccupied(g.barrios) }))
      .filter((g) => g.barrios.length > 0);
  }
  return groups
    .map((g) => ({
      ...g,
      barrios: matchOccupied(g.barrios).filter((b) => b.toLowerCase().includes(q)),
    }))
    .filter((g) => g.barrios.length > 0);
}

export function filterPopularBarrios(municipio, occupiedBarrios) {
  if (!occupiedBarrios?.length) return [];
  const allowed = new Set(occupiedBarrios);
  return getPopularBarrios(municipio).filter((b) => allowed.has(b));
}

export function filterBarrioGroups(municipio, occupiedBarrios) {
  if (!occupiedBarrios?.length) return [];
  const allowed = new Set(occupiedBarrios);
  return getBarrioGroups(municipio)
    .map((g) => ({ ...g, barrios: g.barrios.filter((b) => allowed.has(b)) }))
    .filter((g) => g.barrios.length > 0);
}

export function getTodoMunicipioLabel(municipio) {
  return `Todo ${municipio}`;
}
