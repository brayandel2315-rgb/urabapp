import { useState } from 'react';
import { Link } from 'react-router-dom';
import HomeMvpHero from './components/hero/HomeMvpHero';
import HomeDiscoveryCategoryGrid from './components/categories/HomeDiscoveryCategoryGrid';
import HomePromotionsStrip from './components/discovery/HomePromotionsStrip';
import HomeFeaturedRow from './components/discovery/HomeFeaturedRow';
import HomeTrendingChips from './components/trending/HomeTrendingChips';
import HomeFeedbackCard from './components/feedback/HomeFeedbackCard';
import HomeCatalogAwayBanner from './components/catalog/HomeCatalogAwayBanner';
import HomeDesktopFooter from './components/footer/HomeDesktopFooter';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import ClientActiveOrderBanner from '@/modules/client/components/ClientActiveOrderBanner';
import BusinessCard from '@/components/BusinessCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { STORE } from '@/utils/marketplace-copy';

export default function HomeDesktopView({
  user,
  firstName,
  viewMuni,
  homeMunicipio,
  catalog,
  outsideCoverage,
  noLocalBusinesses,
  discovery,
  discoveryLoading,
  featuredBusinesses,
  topRestaurants,
  hasPromos,
  openNow,
  pulse,
  myActiveOrders,
  onDetect,
  onEnableIntermunicipal,
  onCategoryNavigate,
  onTrending,
}) {
  const [search, setSearch] = useState('');

  const heroPulse = {
    activeOrders: user ? myActiveOrders : pulse?.activeOrders,
    avgDeliveryMin: pulse?.avgDeliveryMin,
    avgBizDelivery: pulse?.avgBizDelivery,
    openBusinessesCount: openNow,
    shipmentsToday: pulse?.shipmentsToday,
    businessPromos: discovery?.promotions,
  };

  const stores = topRestaurants.slice(0, 9);
  const showAwayBanner = catalog?.awayFromHome || catalog?.mode === 'out_of_coverage';

  return (
    <div className="home-desktop min-h-0 w-full">
      <HomeMvpHero
        municipio={viewMuni}
        catalog={catalog}
        pulse={heroPulse}
        search={search}
        onSearchChange={setSearch}
        userId={user?.id}
        onRefreshLocation={onDetect}
        firstName={firstName}
      />

      <div className="home-desktop__body">
        {user && (
          <div className="home-desktop__section">
            <ClientActiveOrderBanner />
          </div>
        )}

        {showAwayBanner && (
          <HomeCatalogAwayBanner
            catalog={catalog}
            onEnableIntermunicipal={onEnableIntermunicipal}
            onRefreshLocation={onDetect}
          />
        )}

        <section className="home-desktop__section">
          <HomeSectionHeader
            title={`Abiertos ahora en ${outsideCoverage ? homeMunicipio : viewMuni}`}
            subtitle={
              openNow > 0
                ? STORE.readyCount(openNow)
                : stores.length > 0
                  ? 'Hay tiendas en tu zona, pero ninguna abierta ahora'
                  : 'Entrega local con seguimiento en vivo'
            }
            variant="brand"
            aside={(
              <Link to="/restaurantes" className="home-desktop-cta">
                Ver todas las tiendas
                <AppIcon name="back" size={14} className="rotate-180" />
              </Link>
            )}
          />

          {stores.length > 0 ? (
            <div className="home-desktop-stores-grid">
              {stores.map((business, i) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  layout="grid"
                  rank={i < 3 ? i + 1 : undefined}
                  imageLoading={i < 4 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
          ) : (
            <HomeFeaturedRow
              businesses={featuredBusinesses}
              isLoading={discoveryLoading}
              municipio={outsideCoverage ? homeMunicipio : viewMuni}
              emptyMessage={
                openNow === 0 && !noLocalBusinesses
                  ? 'Ninguna tienda está abierta en este momento. Vuelve en su horario o usa mensajería.'
                  : noLocalBusinesses
                    ? 'Activa envíos intermunicipales para ver tiendas que lleguen a tu ubicación.'
                    : 'Pronto habrá más tiendas en tu zona.'
              }
            />
          )}
        </section>

        {(hasPromos || discoveryLoading) && (
          <section className="home-desktop__section">
            <HomePromotionsStrip
              promotions={discovery?.promotions ?? []}
              promotionsByMerchant={discovery?.promotionsByMerchant ?? []}
              isLoading={discoveryLoading}
              municipio={viewMuni}
            />
          </section>
        )}

        <section className="home-desktop__section">
          <HomeDiscoveryCategoryGrid onNavigate={onCategoryNavigate} />
        </section>

        {(discovery?.trending?.length ?? 0) > 0 && (
          <section className="home-desktop__section">
            <HomeSectionHeader
              title="Populares en tu zona"
              subtitle="Lo más buscado hoy"
              variant="brand"
            />
            <HomeTrendingChips
              chips={discovery?.trending ?? []}
              onSelect={onTrending}
            />
          </section>
        )}

        <section className="home-desktop__section">
          <HomeFeedbackCard deferUntilVisit={2} />
        </section>
      </div>

      <HomeDesktopFooter />
    </div>
  );
}
