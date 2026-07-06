import {
  BARRIO_ALL_ID,
  LEGACY_ZONE_TO_BARRIOS,
  getGroupForBarrio,
  getAllBarrios,
  isValidBarrio,
  getTodoMunicipioLabel,
} from '../data/uraba-barrios';
import { STORE } from './marketplace-copy';
import { normalizeMunicipio } from './municipio';

const norm = (s) => (s || '').trim().toLowerCase();

/** Coincidencia exacta o legacy (zone antigua en comercios) */
export function barrioMatchesBusinessZone(barrio, businessZone, municipio = 'Apartadó') {
  if (!barrio || !businessZone) return false;
  const b = norm(barrio);
  const z = norm(businessZone);
  if (b === z) return true;
  if (municipio === 'Apartadó') {
    for (const [legacy, barrios] of Object.entries(LEGACY_ZONE_TO_BARRIOS)) {
      if (norm(legacy) === z && barrios.some((name) => norm(name) === b)) return true;
      if (norm(legacy) === b && barrios.some((name) => norm(name) === z)) return true;
    }
  }
  if (norm(businessZone) === 'centro' && norm(barrio) === 'centro') return true;
  return false;
}

/** Comercio sin zone = entrega en todo el municipio */
export function businessIsCitywide(business) {
  return !business?.zone?.trim();
}

export function getBarrioDeliveryTier(business, barrio, municipio) {
  if (!barrio) return 'all';
  if (barrioMatchesBusinessZone(barrio, business?.zone, municipio)) return 'local';
  if (businessIsCitywide(business)) return 'citywide';
  return 'other';
}

export function getOccupiedBarrios(businesses, municipio) {
  const muni = normalizeMunicipio(municipio);
  const catalog = getAllBarrios(muni);
  const occupied = [];

  for (const barrio of catalog) {
    const hasBusiness = (businesses ?? []).some((b) => {
      if (normalizeMunicipio(b.municipio) !== muni) return false;
      const zone = b.zone?.trim();
      if (!zone) return false;
      return barrioMatchesBusinessZone(barrio, zone, muni);
    });
    if (hasBusiness) occupied.push(barrio);
  }

  return occupied;
}

export function isBarrioOccupied(barrio, occupiedBarrios) {
  if (!barrio || !occupiedBarrios?.length) return false;
  return occupiedBarrios.includes(barrio);
}

export function partitionBusinessesByBarrio(businesses, barrio, municipio) {
  if (!barrio) {
    return { local: businesses, citywide: [], other: [] };
  }
  const local = [];
  const citywide = [];
  const other = [];
  for (const b of businesses) {
    const tier = getBarrioDeliveryTier(b, barrio, municipio);
    if (tier === 'local') local.push(b);
    else if (tier === 'citywide') citywide.push(b);
    else other.push(b);
  }
  const byRating = (a, b) => (b.rating || 0) - (a.rating || 0) || (b.total_ratings || 0) - (a.total_ratings || 0);
  local.sort(byRating);
  citywide.sort(byRating);
  other.sort(byRating);
  return { local, citywide, other };
}

/** Solo local + citywide — práctico para el cliente */
export function sortBusinessesByBarrio(businesses, barrio, municipio) {
  if (!barrio) return businesses;
  const { local, citywide } = partitionBusinessesByBarrio(businesses, barrio, municipio);
  return [...local, ...citywide];
}

export function inferBarrioFromGeoLabel(label, municipio = 'Apartadó') {
  if (!label?.trim()) return null;
  const lower = label.toLowerCase();
  const catalog = getAllBarrios(municipio);
  const sorted = [...catalog].sort((a, b) => b.length - a.length);
  for (const barrio of sorted) {
    if (lower.includes(barrio.toLowerCase())) return barrio;
  }
  return null;
}

export function isSpecificBarrio(barrio) {
  return Boolean(barrio?.trim()) && barrio !== BARRIO_ALL_ID;
}

export function getBarrioLabel(barrio, municipio = 'Apartadó') {
  if (!barrio || barrio === BARRIO_ALL_ID) return getTodoMunicipioLabel(municipio);
  return barrio;
}

export function getBarrioSubtitle(barrio, municipio = 'Apartadó') {
  if (!barrio) return STORE.allMunicipio;
  const group = getGroupForBarrio(municipio, barrio);
  if (!group) return municipio;
  if (group.subtitle) return `${group.name} · ${group.subtitle}`;
  return group.name;
}

export { isValidBarrio, getAllBarrios, BARRIO_ALL_ID };

/** @deprecated */
export function isValidApartadoBarrio(barrio) {
  return isValidBarrio('Apartadó', barrio);
}
