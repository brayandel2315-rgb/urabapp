import { useMemo } from 'react';
import {
  useLocationStore,
  selectActiveMunicipio,
  selectHomeMunicipio,
  selectDetectedMunicipio,
} from '@/store/locationStore';
import { buildCatalogContext } from '@/utils/catalog-location';

/** Contexto de ubicación para catálogo, cobertura y UI. */
export function useCatalogLocation() {
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const detectedMunicipio = useLocationStore(selectDetectedMunicipio);
  const activeMunicipio = useLocationStore(selectActiveMunicipio);
  const intermunicipalCatalog = useLocationStore((s) => s.intermunicipalCatalog);
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const setIntermunicipalCatalog = useLocationStore((s) => s.setIntermunicipalCatalog);
  const setHomeMunicipio = useLocationStore((s) => s.setHomeMunicipio);

  const inServiceArea = useLocationStore((s) => s.inServiceArea);
  const detectedCityDisplay = useLocationStore((s) => s.detectedCityDisplay);

  const catalog = useMemo(
    () => buildCatalogContext({
      homeMunicipio,
      detectedMunicipio,
      intermunicipalCatalog,
      locationStatus,
      inServiceArea,
      detectedCityDisplay,
    }),
    [homeMunicipio, detectedMunicipio, intermunicipalCatalog, locationStatus, inServiceArea, detectedCityDisplay],
  );

  const businessQueryKey = useMemo(
    () => [
      homeMunicipio,
      detectedMunicipio,
      intermunicipalCatalog,
      catalog.mode,
    ],
    [homeMunicipio, detectedMunicipio, intermunicipalCatalog, catalog.mode],
  );

  const getBusinessesParams = useMemo(
    () => ({
      catalog,
      homeMunicipio,
      detectedMunicipio,
      intermunicipalCatalog,
      locationStatus,
      municipio: catalog.viewMunicipio,
    }),
    [catalog, homeMunicipio, detectedMunicipio, intermunicipalCatalog, locationStatus],
  );

  return {
    catalog,
    homeMunicipio,
    detectedMunicipio,
    activeMunicipio,
    intermunicipalCatalog,
    locationStatus,
    setIntermunicipalCatalog,
    setHomeMunicipio,
    businessQueryKey,
    getBusinessesParams,
  };
}
