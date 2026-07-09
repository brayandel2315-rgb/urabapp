import { useEffect, useState } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import { PageState } from '@/design-system/patterns/PageState';
import Button from '@/components/ui/Button';
import DetectedLocationChip from '@/components/geo/DetectedLocationChip';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { useAuthStore } from '@/store/authStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  discoverySearch,
  getPopularSearches,
  getTrendingSearches,
} from '@/services/discovery.service';
import DiscoverSearchBar from '../components/DiscoverSearchBar';
import DiscoverSearchHub from '../components/DiscoverSearchHub';
import DiscoverSearchResults from '../components/DiscoverSearchResults';
import { STORE } from '@/utils/marketplace-copy';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialQ = searchParams.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const online = useOnlineStatus();
  const { user } = useAuthStore();
  const { catalog, homeMunicipio, getBusinessesParams, businessQueryKey } = useCatalogLocation();
  const municipio = catalog.viewMunicipio || homeMunicipio;
  const autoFocus = location.state?.focus === true;

  useEffect(() => {
    setQ(searchParams.get('q') || '');
  }, [searchParams]);

  const debouncedQ = q.trim();

  const { data: popular = [] } = useQuery({
    queryKey: ['popular-searches', municipio],
    queryFn: () => getPopularSearches(municipio, 12),
    staleTime: 120_000,
  });

  const { data: trending = [] } = useQuery({
    queryKey: ['trending-searches', municipio],
    queryFn: () => getTrendingSearches(municipio, 8),
    staleTime: 120_000,
  });

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ['discovery-search', debouncedQ, ...businessQueryKey],
    queryFn: () => discoverySearch({
      q: debouncedQ,
      municipio,
      catalog,
      getBusinessesParams,
      userId: user?.id,
      limit: 24,
    }),
    enabled: debouncedQ.length >= 2,
    staleTime: 30_000,
  });

  const handleSubmit = (term) => {
    const value = (term ?? q).trim();
    if (value) setSearchParams({ q: value }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const handleChip = (chip) => {
    setQ(chip);
    setSearchParams({ q: chip }, { replace: true });
  };

  const showHub = debouncedQ.length < 2;

  return (
    <PageLayout title={false} maxWidth="xl">
      <div className="mb-4 space-y-2">
        <h1 className="font-display text-2xl font-bold leading-tight text-[#0D2B45]">
          ¿Qué se te antoja hoy?
        </h1>
        <p className="text-sm text-[#4A6278]">
          {STORE.many} y productos en {municipio}
        </p>
        <DetectedLocationChip className="max-w-xs" />
      </div>

      <div className="sticky top-[3.25rem] z-30 -mx-4 bg-background/90 px-4 py-3 backdrop-blur-xl sm:top-16 lg:top-[4.75rem] lg:-mx-8 lg:px-8">
        <DiscoverSearchBar
          value={q}
          onChange={setQ}
          onSubmit={handleSubmit}
          municipio={municipio}
          userId={user?.id}
          catalog={catalog}
          getBusinessesParams={getBusinessesParams}
          autoFocus={autoFocus}
          showDropdown={showHub}
        />
      </div>

      {showHub ? (
        <DiscoverSearchHub
          popular={popular}
          trending={trending}
          municipio={municipio}
          onSelectTerm={handleChip}
          className="mt-6"
        />
      ) : (
        <PageExperienceGuard
          online={online}
          isLoading={isLoading || isFetching}
          isError={isError}
          onRetry={refetch}
          loadingRows={6}
          empty={
            !isLoading && !data?.businesses?.length && !data?.products?.length ? (
              <PageState
                type="empty"
                title={`Sin resultados para “${debouncedQ}”`}
                description="Prueba otra palabra, explora por categoría o pide un mandado."
                action={(
                  <Link to="/mandado">
                    <Button variant="primary">Pedir mandado</Button>
                  </Link>
                )}
              />
            ) : null
          }
        >
          {(data?.businesses?.length > 0 || data?.products?.length > 0) && (
            <DiscoverSearchResults
              className="mt-6"
              query={debouncedQ}
              businesses={data.businesses}
              products={data.products}
              total={data.total}
            />
          )}
        </PageExperienceGuard>
      )}
    </PageLayout>
  );
}
