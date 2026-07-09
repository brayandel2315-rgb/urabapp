import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import PageExperienceGuard from '@/design-system/patterns/PageExperienceGuard';
import OffersHeader from '@/components/offers/OffersHeader';
import OffersFiltersBar from '@/components/offers/OffersFiltersBar';
import OfferHeroCarousel from '@/components/offers/OfferHeroCarousel';
import OfferFeaturedGrid from '@/components/offers/OfferFeaturedGrid';
import OfferFlashSection from '@/components/offers/OfferFlashSection';
import OfferMerchantSection from '@/components/offers/OfferMerchantSection';
import OfferBundlesSection from '@/components/offers/OfferBundlesSection';
import OfferMissionsSection from '@/components/offers/OfferMissionsSection';
import OffersSkeleton from '@/components/offers/OffersSkeleton';
import { OffersEmptyState } from '@/components/offers/OffersEmptyState';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { getOffersFeed, trackOfferEvent } from '@/services/offers.service';
import { useCatalogLocation } from '@/hooks/useCatalogLocation';
import { useLocationStore, selectActiveBarrio } from '@/store/locationStore';
import { useAuthStore } from '@/store/authStore';
import { useOffersStore } from '@/store/offersStore';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { toast } from '@/utils/toast';
import { OFFERS_FILTERS } from '@/data/offers-filters';
import { WELCOME_BENEFIT } from '@/utils/constants';
import { formatCOP } from '@/utils/currency';
import { STORE } from '@/utils/marketplace-copy';

export default function OffersPage() {
  const online = useOnlineStatus();
  const { user, profile } = useAuthStore();
  const { catalog, getBusinessesParams, activeMunicipio, businessQueryKey } = useCatalogLocation();
  const activeBarrio = useLocationStore(selectActiveBarrio);
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');

  const [filterId, setFilterId] = useState('all');
  const savedOfferIds = useOffersStore((s) => s.savedOfferIds);
  const toggleSave = useOffersStore((s) => s.toggleSave);
  const isSaved = useOffersStore((s) => s.isSaved);

  const { data: feed, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['offers-feed', ...businessQueryKey, activeBarrio, filterId, user?.id],
    queryFn: () => getOffersFeed({
      municipio: catalog.viewMunicipio,
      barrio: activeBarrio,
      filterId,
      userId: user?.id,
      profile,
      catalog,
      getBusinessesParams,
    }),
    refetchInterval: 60000,
    staleTime: 30000,
  });

  const handleFilter = (id) => {
    const filter = OFFERS_FILTERS.find((f) => f.id === id);
    if (filter?.route) {
      window.location.href = filter.route;
      return;
    }
    setFilterId(id);
  };

  const trackClick = useCallback((offer) => {
    trackOfferEvent('click', {
      promotionId: offer.promotionId,
      businessId: offer.businessId,
      userId: user?.id,
      municipio: activeMunicipio,
      properties: { offerId: offer.id, section: 'offers-hub' },
    });
  }, [user?.id, activeMunicipio]);

  const handleSave = useCallback((offer) => {
    toggleSave(offer.id);
    trackOfferEvent(isSaved(offer.id) ? 'unsave' : 'save', {
      promotionId: offer.promotionId,
      businessId: offer.businessId,
      userId: user?.id,
      municipio: activeMunicipio,
      properties: { offerId: offer.id },
    });
    toast(isSaved(offer.id) ? 'Oferta quitada de favoritos' : 'Oferta guardada');
  }, [toggleSave, isSaved, user, activeMunicipio]);

  const handleShare = useCallback(async (offer) => {
    const url = `${window.location.origin}/tienda/${offer.slug || offer.businessId}`;
    const text = `${offer.title || offer.name} — ${offer.promoText || 'Promo en Urabapp'}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: offer.name, text, url });
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        toast('Enlace copiado');
      }
      trackOfferEvent('share', {
        businessId: offer.businessId,
        userId: user?.id,
        municipio: activeMunicipio,
        properties: { offerId: offer.id },
      });
    } catch {
      /* cancelado */
    }
  }, [user, activeMunicipio]);

  const savedOffers = useMemo(() => {
    if (!feed?.all) return [];
    return feed.all.filter((o) => savedOfferIds.includes(o.id));
  }, [feed, savedOfferIds]);

  const showSaved = tab === 'guardadas';

  return (
    <PageLayout title={false} maxWidth="full" contentClassName="space-y-8 pb-10">
      <OffersHeader profile={profile} user={user} savedCount={savedOfferIds.length} />

      <div className="flex items-center justify-between gap-2">
        <OffersFiltersBar activeId={filterId} onChange={handleFilter} className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="shrink-0"
        >
          {isFetching ? '…' : '↻'}
        </Button>
      </div>

      <PageExperienceGuard
        online={online}
        isError={isError && !feed}
        onRetry={refetch}
        offlineDescription="Conéctate para ver ofertas y promos activas en tu zona."
        errorDescription="No pudimos cargar las ofertas. Desliza para reintentar o toca ↻."
      >
        {isLoading ? <OffersSkeleton /> : null}

        {!isLoading && feed && (
        <>
          {showSaved ? (
            <section>
              <h2 className="section-title mb-3">Ofertas guardadas</h2>
              {savedOffers.length ? (
                <OfferFeaturedGrid
                  offers={savedOffers}
                  onOfferClick={trackClick}
                  onSave={handleSave}
                  isSaved={isSaved}
                  onShare={handleShare}
                />
              ) : (
                <OffersEmptyState />
              )}
            </section>
          ) : (
            <>
              {!feed.byMerchant?.length && !feed.hero?.length && !feed.featured?.length && !feed.welcome ? (
                <OffersEmptyState />
              ) : (
                <>
                  {feed.welcome && (
                    <Link to={feed.welcome.link || '/cuenta/perfil'}>
                      <SurfaceCard variant="highlight" className="border-primary/20 bg-gradient-to-br from-primary/10 to-emerald-50 text-foreground dark:from-primary/20 dark:to-emerald-950/40">
                        <p className="text-xs font-bold uppercase text-primary">Bienvenida Urabapp</p>
                        <p className="text-subheading mt-1 text-foreground">{WELCOME_BENEFIT.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {feed.welcome.subtitle} · mín. {formatCOP(WELCOME_BENEFIT.minOrder)}
                        </p>
                      </SurfaceCard>
                    </Link>
                  )}

                  <OfferHeroCarousel
                    items={feed.hero}
                    onOfferClick={trackClick}
                    onSave={handleSave}
                    isSaved={isSaved}
                    onShare={handleShare}
                  />

                  <OfferFlashSection offers={feed.flash} onOfferClick={trackClick} />

                  <OfferMerchantSection
                    groups={feed.byMerchant ?? []}
                    title={`Ofertas por ${STORE.oneLower}`}
                    subtitle={`Promos activas en ${activeMunicipio}`}
                    onOfferClick={trackClick}
                  />

                  {feed.featured?.length > 0 && (
                    <OfferFeaturedGrid
                      offers={feed.featured}
                      onOfferClick={trackClick}
                      onSave={handleSave}
                      isSaved={isSaved}
                      onShare={handleShare}
                    />
                  )}

                  {feed.bundles?.length > 0 && (
                    <OfferBundlesSection offers={feed.bundles} onOfferClick={trackClick} />
                  )}

                  <OfferMissionsSection mission={feed.mission} />
                </>
              )}
            </>
          )}
        </>
      )}
      </PageExperienceGuard>
    </PageLayout>
  );
}
