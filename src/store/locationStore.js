import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { BARRIO_ALL_ID } from '../data/uraba-barrios';
import { DEFAULT_MUNICIPALITY } from '../utils/constants';
import { normalizeMunicipio } from '../utils/municipio';
import { isValidBarrio } from '../utils/barrio';
import { buildCatalogContext, catalogContextFromStore } from '../utils/catalog-location';

/** Municipio activo para barrios, envíos y UI (GPS real o hogar). */
export const selectActiveMunicipio = (state) => {
  if (state.inServiceArea === false && state.detectedCityDisplay) {
    return state.detectedCityDisplay;
  }
  const detected = state.detectedMunicipio ? normalizeMunicipio(state.detectedMunicipio) : null;
  const home = state.homeMunicipio
    ? normalizeMunicipio(state.homeMunicipio)
    : normalizeMunicipio(state.municipio || DEFAULT_MUNICIPALITY);
  return detected || home;
};

export const selectHomeMunicipio = (state) =>
  normalizeMunicipio(state.homeMunicipio || state.municipio || DEFAULT_MUNICIPALITY);

export const selectDetectedMunicipio = (state) =>
  state.detectedMunicipio ? normalizeMunicipio(state.detectedMunicipio) : null;

export const selectCatalogContext = (state) => catalogContextFromStore(state);

export const selectActiveBarrio = (state) => {
  const muni = selectActiveMunicipio(state);
  return state.barriosByMunicipio?.[muni] ?? BARRIO_ALL_ID;
};

export const selectLocationReady = (state) =>
  state.locationStatus === 'granted' || state.locationStatus === 'fallback';

export const selectAwayFromHome = (state) => selectCatalogContext(state).awayFromHome;

export const useLocationStore = create(
  persist(
    (set, get) => ({
      /** @deprecated Usar homeMunicipio + detectedMunicipio */
      municipio: DEFAULT_MUNICIPALITY,
      homeMunicipio: DEFAULT_MUNICIPALITY,
      detectedMunicipio: null,
      intermunicipalCatalog: false,
      barriosByMunicipio: {},
      address: '',
      latitude: null,
      longitude: null,
      locationAccuracy: null,
      detectedLabel: '',
      detectedCityDisplay: null,
      inServiceArea: true,
      locationStatus: 'idle',
      locationSource: 'default',
      lastDetectedAt: null,
      locationAccuracyTier: null,
      locationHint: null,

      setHomeMunicipio: (municipio) => {
        const muni = normalizeMunicipio(municipio);
        const detected = get().detectedMunicipio;
        set({
          homeMunicipio: muni,
          municipio: detected ? normalizeMunicipio(detected) : muni,
          locationSource: 'manual',
        });
      },

      /** @deprecated Usar setHomeMunicipio */
      setMunicipio: (municipio) => {
        get().setHomeMunicipio(municipio);
      },

      setIntermunicipalCatalog: (enabled) => {
        set({ intermunicipalCatalog: Boolean(enabled) });
      },

      setFromDetection: ({
        municipio,
        latitude,
        longitude,
        label,
        source = 'gps',
        accuracy = null,
        inServiceArea = true,
        detectedCityDisplay = null,
        accuracyTier = null,
        locationHint = null,
      }) => {
        const muni = municipio ? normalizeMunicipio(municipio) : null;
        const prev = get();
        const home = prev.homeMunicipio || prev.municipio || DEFAULT_MUNICIPALITY;
        const isGps = source === 'gps';
        const outsideCoverage = inServiceArea === false;
        const nextHome = isGps && !outsideCoverage && muni
          && (!prev.homeMunicipio || prev.locationSource === 'default')
          ? muni
          : normalizeMunicipio(home);

        const barrioMuni = isGps && muni && !outsideCoverage ? muni : nextHome;
        const barrioEntry = prev.barriosByMunicipio?.[barrioMuni];
        const cityDisplay = detectedCityDisplay || label?.split(',')[0]?.trim() || muni;

        set({
          detectedMunicipio: isGps && !outsideCoverage && muni ? muni : (isGps ? null : prev.detectedMunicipio),
          homeMunicipio: nextHome,
          municipio: isGps && !outsideCoverage && muni ? muni : nextHome,
          latitude: latitude ?? prev.latitude,
          longitude: longitude ?? prev.longitude,
          locationAccuracy: accuracy ?? prev.locationAccuracy,
          detectedLabel: label || prev.detectedLabel,
          detectedCityDisplay: cityDisplay || prev.detectedCityDisplay,
          inServiceArea: outsideCoverage ? false : true,
          locationStatus: source === 'fallback' ? 'fallback' : 'granted',
          locationSource: source,
          lastDetectedAt: Date.now(),
          locationAccuracyTier: accuracyTier ?? prev.locationAccuracyTier,
          locationHint: locationHint ?? null,
          barriosByMunicipio: barrioEntry
            ? prev.barriosByMunicipio
            : { ...prev.barriosByMunicipio, [barrioMuni]: BARRIO_ALL_ID },
        });
      },

      setLocationStatus: (locationStatus) => set({ locationStatus }),

      setBarrio: (barrio) => {
        const muni = selectActiveMunicipio(get());
        const next = barrio && isValidBarrio(muni, barrio) ? barrio : BARRIO_ALL_ID;
        set({
          barriosByMunicipio: {
            ...get().barriosByMunicipio,
            [muni]: next,
          },
        });
      },

      setAddress: (address) => set({ address }),
      setCoords: (latitude, longitude) => set({ latitude, longitude }),

      getCatalogContext: () => catalogContextFromStore(get()),
    }),
    {
      name: 'urabapp-location',
      version: 8,
      onRehydrateStorage: () => (state) => {
        if (state?.locationStatus === 'pending') {
          state.locationStatus = state?.latitude != null ? 'granted' : 'idle';
        }
        if (state?.latitude != null && state?.longitude != null && state.locationStatus === 'idle') {
          state.locationStatus = 'granted';
        }
        if (state?.inServiceArea === false && state?.latitude == null) {
          state.inServiceArea = true;
        }
      },
      migrate: (state, fromVersion) => {
        const muni = normalizeMunicipio(state?.homeMunicipio ?? state?.municipio);
        const barriosByMunicipio = { ...(state?.barriosByMunicipio ?? {}) };
        if (state?.barrio && isValidBarrio(muni, state.barrio)) {
          barriosByMunicipio[muni] = state.barrio;
        }
        const wasGps = state?.locationSource === 'gps' && state?.locationStatus === 'granted';
        const base = fromVersion < 6 ? {
          municipio: muni,
          homeMunicipio: muni,
          detectedMunicipio: wasGps ? muni : (state?.detectedMunicipio ?? null),
          intermunicipalCatalog: state?.intermunicipalCatalog ?? false,
          barriosByMunicipio,
          address: state?.address ?? '',
          latitude: state?.latitude ?? null,
          longitude: state?.longitude ?? null,
          locationAccuracy: state?.locationAccuracy ?? null,
          detectedLabel: state?.detectedLabel ?? '',
          locationStatus: state?.locationStatus ?? (state?.latitude ? 'granted' : 'idle'),
          locationSource: state?.locationSource ?? 'default',
          lastDetectedAt: state?.lastDetectedAt ?? null,
        } : { ...state };

        return {
          ...base,
          homeMunicipio: normalizeMunicipio(base.homeMunicipio ?? base.municipio ?? muni),
          detectedCityDisplay: base.detectedCityDisplay ?? base.detectedLabel?.split(',')[0]?.trim() ?? null,
          inServiceArea: base.inServiceArea !== false,
        };
      },
    }
  )
);

export { buildCatalogContext };
