import { DEFAULT_MUNICIPALITY } from './constants';
import { normalizeMunicipio } from './municipio';

/** @typedef {'home_local' | 'away_blocked' | 'intermunicipal_only' | 'out_of_coverage' | 'unknown'} CatalogMode */

/**
 * @param {object} params
 * @param {string} [params.homeMunicipio]
 * @param {string|null} [params.detectedMunicipio]
 * @param {boolean} [params.intermunicipalCatalog]
 * @param {string} [params.locationStatus]
 * @param {boolean} [params.inServiceArea]
 * @param {string|null} [params.detectedCityDisplay]
 * @returns {{
 *   mode: CatalogMode,
 *   home: string|null,
 *   detected: string|null,
 *   detectedCityDisplay: string|null,
 *   viewMunicipio: string|null,
 *   awayFromHome: boolean,
 *   inServiceArea: boolean,
 *   intermunicipalCatalog: boolean,
 *   needsGps: boolean,
 *   noLocalBusinesses: boolean,
 *   outsideCoverage?: boolean,
 * }}
 */
export function buildCatalogContext({
  homeMunicipio,
  detectedMunicipio,
  intermunicipalCatalog = false,
  locationStatus = 'idle',
  inServiceArea = true,
  detectedCityDisplay = null,
} = {}) {
  const home = homeMunicipio ? normalizeMunicipio(homeMunicipio) : null;
  const detected = detectedMunicipio ? normalizeMunicipio(detectedMunicipio) : null;
  const cityLabel = detectedCityDisplay || detected || null;

  if (inServiceArea === false) {
    return {
      mode: 'out_of_coverage',
      home,
      detected: cityLabel,
      detectedCityDisplay: cityLabel,
      viewMunicipio: home,
      awayFromHome: true,
      inServiceArea: false,
      outsideCoverage: true,
      intermunicipalCatalog,
      needsGps: false,
      noLocalBusinesses: false,
    };
  }

  const viewMunicipio = detected || home || null;

  if (!viewMunicipio) {
    return {
      mode: 'unknown',
      home,
      detected,
      detectedCityDisplay: cityLabel,
      viewMunicipio: null,
      awayFromHome: false,
      inServiceArea: true,
      intermunicipalCatalog,
      needsGps: locationStatus === 'denied' || locationStatus === 'idle',
      noLocalBusinesses: false,
    };
  }

  const awayFromHome = Boolean(detected && home && detected !== home);

  if (awayFromHome && !intermunicipalCatalog) {
    return {
      mode: 'away_blocked',
      home,
      detected,
      detectedCityDisplay: detected,
      viewMunicipio: home,
      awayFromHome: true,
      inServiceArea: true,
      intermunicipalCatalog,
      needsGps: false,
      noLocalBusinesses: true,
    };
  }

  if (awayFromHome && intermunicipalCatalog) {
    return {
      mode: 'intermunicipal_only',
      home,
      detected,
      detectedCityDisplay: detected,
      viewMunicipio: detected,
      awayFromHome: true,
      inServiceArea: true,
      intermunicipalCatalog: true,
      needsGps: false,
      noLocalBusinesses: false,
    };
  }

  return {
    mode: 'home_local',
    home: home || viewMunicipio,
    detected: detected || home || viewMunicipio,
    detectedCityDisplay: detected || home || viewMunicipio,
    viewMunicipio: home || viewMunicipio,
    awayFromHome: false,
    inServiceArea: true,
    intermunicipalCatalog,
    needsGps: locationStatus === 'denied' && !detected,
    noLocalBusinesses: false,
  };
}

export function catalogContextFromStore(state) {
  const labelCity = state.detectedLabel?.split(',')[0]?.trim() || null;
  return buildCatalogContext({
    homeMunicipio: state.homeMunicipio ?? state.municipio ?? DEFAULT_MUNICIPALITY,
    detectedMunicipio: state.detectedMunicipio ?? null,
    intermunicipalCatalog: state.intermunicipalCatalog ?? false,
    locationStatus: state.locationStatus ?? 'idle',
    inServiceArea: state.inServiceArea !== false,
    detectedCityDisplay: state.detectedCityDisplay || labelCity,
  });
}

export function getCatalogQueryParams(catalog) {
  if (catalog.mode === 'intermunicipal_only') {
    return { intermunicipalOnly: true, viewMunicipio: catalog.viewMunicipio };
  }
  return { localMunicipio: catalog.viewMunicipio, viewMunicipio: catalog.viewMunicipio };
}
