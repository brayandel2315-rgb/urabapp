import { normalizeMunicipio } from './municipio';
import { buildCatalogContext } from './catalog-location';

function normList(arr) {
  return (arr ?? []).map((m) => normalizeMunicipio(m)).filter(Boolean);
}

/** Cobertura de un comercio hacia un municipio destino (entrega). */
export function getBusinessCoverageForUser(business, destinationMunicipio) {
  const userCity = normalizeMunicipio(destinationMunicipio);
  const bizCity = normalizeMunicipio(business?.municipio);
  const inter = Boolean(business?.intermunicipal_enabled);
  const supported = normList(business?.municipios_soportados);

  if (!userCity) {
    return { available: false, tier: 'unavailable', label: 'Ubicación no disponible' };
  }

  if (bizCity === userCity) {
    return { available: true, tier: 'local', label: 'Entrega local' };
  }

  if (!inter) {
    return {
      available: false,
      tier: 'unavailable',
      label: 'No disponible para tu ubicación',
    };
  }

  if (supported.length === 0 || supported.includes(userCity)) {
    return {
      available: true,
      tier: 'intermunicipal',
      label: `Envío desde ${bizCity}`,
    };
  }

  return {
    available: false,
    tier: 'unavailable',
    label: 'No disponible para tu ubicación',
  };
}

export function isBusinessAvailableInMunicipio(business, destinationMunicipio) {
  return getBusinessCoverageForUser(business, destinationMunicipio).available;
}

/**
 * Filtra comercios según ubicación real del cliente y modo de catálogo.
 * @param {object[]} businesses
 * @param {import('./catalog-location').CatalogMode | object} catalogOrDestination — contexto o municipio legacy
 * @param {string} [legacyDestination]
 */
export function filterBusinessesForCatalog(businesses, catalogOrDestination, legacyDestination) {
  const catalog = typeof catalogOrDestination === 'object' && catalogOrDestination?.mode
    ? catalogOrDestination
    : buildCatalogContext({
        homeMunicipio: legacyDestination || catalogOrDestination,
        detectedMunicipio: legacyDestination || catalogOrDestination,
      });

  if (catalog.mode === 'away_blocked' || catalog.mode === 'unknown') {
    return [];
  }

  if (catalog.mode === 'out_of_coverage') {
    const browseMuni = catalog.home || catalog.viewMunicipio;
    return (businesses ?? [])
      .map((b) => ({
        ...b,
        coverage: getBusinessCoverageForUser(b, browseMuni),
      }))
      .filter((b) => b.coverage.available && b.coverage.tier === 'local');
  }

  const destination = catalog.viewMunicipio;

  return (businesses ?? [])
    .map((b) => ({
      ...b,
      coverage: getBusinessCoverageForUser(b, destination),
    }))
    .filter((b) => {
      if (!b.coverage.available) return false;
      if (catalog.mode === 'home_local') return b.coverage.tier === 'local';
      if (catalog.mode === 'intermunicipal_only') return b.coverage.tier === 'intermunicipal';
      return true;
    });
}

/** @deprecated Usar filterBusinessesForCatalog */
export function filterBusinessesForUser(businesses, userMunicipio) {
  return filterBusinessesForCatalog(
    businesses,
    buildCatalogContext({ homeMunicipio: userMunicipio, detectedMunicipio: userMunicipio })
  );
}

export function annotateBusinessCoverage(businesses, destinationMunicipio) {
  return (businesses ?? []).map((b) => ({
    ...b,
    coverage: getBusinessCoverageForUser(b, destinationMunicipio),
  }));
}

/** ¿El comercio puede mostrarse / pedirse según modo de catálogo actual? */
export function isBusinessOrderableInCatalog(business, catalog) {
  if (!catalog?.viewMunicipio) return false;
  if (catalog.mode === 'away_blocked' || catalog.mode === 'unknown') return false;
  if (catalog.mode === 'out_of_coverage') {
    const coverage = getBusinessCoverageForUser(business, catalog.home || catalog.viewMunicipio);
    return coverage.available && coverage.tier === 'local';
  }

  const coverage = getBusinessCoverageForUser(business, catalog.viewMunicipio);
  if (!coverage.available) return false;
  if (catalog.mode === 'home_local') return coverage.tier === 'local';
  if (catalog.mode === 'intermunicipal_only') return coverage.tier === 'intermunicipal';
  return true;
}
