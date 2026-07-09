import { useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import { PageState } from '@/design-system/patterns/PageState';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getVerticalByPath } from '@/data/vertical-catalog';
import { getVerticalDiscovery, filterVerticalPool } from '@/services/discovery.service';
import VerticalSectionRow, {
  VERTICAL_CATALOG_GRID,
  VERTICAL_CATALOG_LIST,
} from '../components/VerticalSectionRow';
import VerticalFilters from '../components/VerticalFilters';
import HomeCatalogAwayBanner from '@/modules/home/components/catalog/HomeCatalogAwayBanner';
import DetectedLocationChip from '@/components/geo/DetectedLocationChip';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import Button from '@/components/ui/Button';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import BusinessCard from '@/components/BusinessCard';

const VERTICAL_EYEBROW = {
  tiendas: 'Tiendas locales',
  restaurantes: 'Restaurantes',
  mercado: 'Mercado',
  farmacia: 'Farmacia',
  mensajeria: 'Mensajería',
};

export default function VerticalDiscoveryPage() {
  const { pathname } = useLocation();
  const vertical = getVerticalByPath(pathname);
  const [activeFilter, setActiveFilter] = useState('all');
  const online = useOnlineStatus();
  const { detect } = useAutoLocation({ auto: false });
  const {
    catalog,
    homeMunicipio,
    getBusinessesParams,
    businessQueryKey,
    setIntermunicipalCatalog,
  } = useCatalogLocation();
  const { latitude, longitude, hasCoords } = useGeolocation();
  const coords = hasCoords ? { latitude, longitude } : null;
  const municipio = catalog.viewMunicipio || homeMunicipio;

  useEffect(() => {
    setActiveFilter('all');
  }, [pathname]);

  useEffect(() => {
    if (vertical?.seo?.title) {
      document.title = `${vertical.seo.title} · UrabApp`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta && vertical.seo.description) {
        meta.setAttribute('content', vertical.seo.description);
      }
    }
  }, [vertical]);

  const verticalReady = Boolean(
    vertical && !(vertical.serviceOnly && vertical.serviceRoute),
  );

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['vertical-discovery', vertical?.id, ...businessQueryKey],
    queryFn: () => getVerticalDiscovery({
      vertical,
      catalog,
      getBusinessesParams,
      municipio,
      coords,
    }),
    staleTime: 60_000,
    enabled: verticalReady,
    placeholderData: keepPreviousData,
    retry: 1,
  });

  const sectionsLoading = (isLoading || isFetching) && !data && !isError;
  const noLocalBusinesses = catalog.noLocalBusinesses;

  const filteredPool = useMemo(
    () => filterVerticalPool(data?.pool ?? [], activeFilter, coords),
    [data?.pool, activeFilter, coords],
  );

  const hasSections = (data?.sections?.length ?? 0) > 0;
  const showFilteredList = activeFilter !== 'all' && !sectionsLoading && !isError;

  if (!vertical) {
    return <Navigate to="/" replace />;
  }

  if (vertical.serviceOnly && vertical.serviceRoute) {
    return <Navigate to={vertical.serviceRoute} replace />;
  }

  const eyebrow = VERTICAL_EYEBROW[vertical.id] || vertical.seo?.title || 'Urabá';

  return (
    <PageLayout title={false} maxWidth="store">
      <div className="mb-4 space-y-2">
        <p className="text-xs font-semibold text-[#4A6278]">{eyebrow}</p>
        <h1 className="font-display text-2xl font-bold leading-tight text-[#0D2B45]">
          {vertical.title}
        </h1>
        <p className="text-sm text-[#4A6278]">{vertical.subtitle}</p>
        <DetectedLocationChip className="max-w-sm" />
      </div>

      <div className="sticky top-[3.25rem] z-20 -mx-4 bg-[#F7FAFC]/95 px-4 py-3 backdrop-blur-md sm:top-16 lg:top-[4.75rem] lg:-mx-8 lg:px-8">
        <VerticalFilters value={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="mt-4 space-y-10">
        <HomeCatalogAwayBanner
          catalog={catalog}
          onEnableIntermunicipal={setIntermunicipalCatalog}
          onRefreshLocation={detect}
        />

        {noLocalBusinesses && !sectionsLoading && !isError ? (
          <PageState
            type="no-coverage"
            title={`Sin comercios en ${catalog.detected || 'tu zona'}`}
            description="Activa el catálogo intermunicipal o actualiza tu ubicación para ver tiendas disponibles en tu municipio."
            action={(
              <Button variant="primary" onClick={() => setIntermunicipalCatalog(true)}>
                Ver catálogo intermunicipal
              </Button>
            )}
          />
        ) : (
          <PageExperienceGuard
            online={online}
            isLoading={sectionsLoading}
            isError={isError}
            onRetry={refetch}
            loadingRows={5}
            errorDescription="No pudimos cargar los comercios. Revisa tu conexión e intenta de nuevo."
            empty={
              !sectionsLoading && !isError && !showFilteredList && !hasSections ? (
                <PageState
                  type="empty"
                  icon="store"
                  title="Aún no hay comercios aquí"
                  description={`No encontramos ${eyebrow.toLowerCase()} en ${municipio} por ahora. Explora otras categorías o vuelve pronto.`}
                  action={(
                    <Link to="/search">
                      <Button variant="primary">Buscar en Urabá</Button>
                    </Link>
                  )}
                />
              ) : null
            }
          >
            {showFilteredList ? (
              filteredPool.length ? (
                <section className="min-w-0">
                  <HomeSectionHeader
                    title={VERTICAL_FILTER_LABELS[activeFilter] || vertical.title}
                    subtitle={`${filteredPool.length} comercio${filteredPool.length === 1 ? '' : 's'} en ${municipio}`}
                    variant="brand"
                  />
                  <div className={VERTICAL_CATALOG_LIST}>
                    {filteredPool.map((b, i) => (
                      <BusinessCard
                        key={b.id}
                        business={b}
                        layout="list"
                        imageLoading={i < 3 ? 'eager' : 'lazy'}
                      />
                    ))}
                  </div>
                  <div className={VERTICAL_CATALOG_GRID}>
                    {filteredPool.map((b, i) => (
                      <BusinessCard
                        key={`${b.id}-grid`}
                        business={b}
                        layout="grid"
                        imageLoading={i < 3 ? 'eager' : 'lazy'}
                      />
                    ))}
                  </div>
                </section>
              ) : (
                <PageState
                  type="empty"
                  title="Sin resultados con este filtro"
                  description="Prueba otro filtro o vuelve a ver todos los comercios."
                  action={(
                    <Button variant="outline" onClick={() => setActiveFilter('all')}>
                      Ver todos
                    </Button>
                  )}
                />
              )
            ) : (
              <>
                {(data?.sections ?? []).map((section) => (
                  <VerticalSectionRow key={section.type} section={section} municipio={municipio} />
                ))}
              </>
            )}
          </PageExperienceGuard>
        )}
      </div>
    </PageLayout>
  );
}

const VERTICAL_FILTER_LABELS = {
  abiertos: 'Abiertos ahora',
  rapida: 'Entrega rápida',
  ofertas: 'Con oferta',
  cerca: 'Cerca de ti',
};
