import { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import LocationPromptBanner from '@/components/geo/LocationPromptBanner';
import BusinessCard from '@/components/BusinessCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { STORE } from '@/utils/marketplace-copy';
import { CLIENT_OFFERS, CLIENT_SEARCH } from '@/app/clientNav';

const QUICK_LINKS = [
  {
    to: '/mandado',
    icon: 'mensajeria',
    title: 'Mensajería',
    desc: 'Mandados en tu municipio',
    tone: 'blue',
  },
  {
    to: '/envios',
    icon: 'envios',
    title: 'Envíos',
    desc: 'Entre municipios del Urabá',
    tone: 'green',
  },
  {
    to: CLIENT_OFFERS,
    icon: 'tag',
    title: 'Ofertas',
    desc: 'Promos de tiendas locales',
    tone: 'promo',
  },
];

export default function HomeDesktopView({
  user,
  firstName,
  viewMuni,
  homeMunicipio,
  headerLocation,
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
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleExplore = useCallback(() => {
    navigate(CLIENT_SEARCH);
  }, [navigate]);

  const heroPulse = {
    activeOrders: user ? myActiveOrders : pulse?.activeOrders,
    avgDeliveryMin: pulse?.avgDeliveryMin,
    avgBizDelivery: pulse?.avgBizDelivery,
    openBusinessesCount: openNow,
    shipmentsToday: pulse?.shipmentsToday,
    businessPromos: discovery?.promotions,
  };

  const stores = topRestaurants.slice(0, 9);

  return (
    <div className="home-desktop min-h-0 w-full">
      <HomeMvpHero
        municipio={viewMuni}
        catalog={catalog}
        pulse={heroPulse}
        search={search}
        onSearchChange={setSearch}
        userId={user?.id}
        onExplore={handleExplore}
        onRefreshLocation={onDetect}
        firstName={firstName}
      />

      <div className="home-desktop__body">
        {user && (
          <div className="home-desktop__section">
            <ClientActiveOrderBanner />
          </div>
        )}

        <HomeCatalogAwayBanner
          catalog={catalog}
          onEnableIntermunicipal={onEnableIntermunicipal}
          onRefreshLocation={onDetect}
        />

        <LocationPromptBanner />

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
                  ? 'Ninguna tienda está abierta en este momento. Vuelve en su horario o prueba Mensajería.'
                  : noLocalBusinesses
                    ? 'Activa envíos intermunicipales para ver tiendas que lleguen a tu ubicación.'
                    : 'Pronto habrá más tiendas en tu zona. Mientras tanto, prueba Mensajería o Envíos.'
              }
            />
          )}
        </section>

        <section className="home-desktop__section home-desktop-split">
          <div className="home-desktop-panel">
            <HomeSectionHeader
              title="Populares en tu zona"
              subtitle="Lo más buscado en Urabá hoy"
              variant="brand"
            />
            <HomeTrendingChips
              chips={discovery?.trending ?? []}
              onSelect={onTrending}
            />
          </div>

          <div className="home-desktop-panel">
            <HomeSectionHeader
              title="Acceso rápido"
              subtitle="Servicios logísticos y promos"
              variant="brand"
            />
            <div className="home-desktop-quick-links">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`home-desktop-quick-link home-desktop-quick-link--${item.tone}`}
                >
                  <span className="home-desktop-quick-link__icon">
                    <AppIcon name={item.icon} size="md" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-bold text-[#0D2B45]">
                      {item.title}
                    </span>
                    <span className="block text-xs text-[#4A6278]">{item.desc}</span>
                  </span>
                  <AppIcon name="back" size={14} className="ml-auto shrink-0 rotate-180 text-[#4A6278]" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="home-desktop__section">
          <HomeFeedbackCard />
        </section>

        <section className="home-desktop__section home-desktop-trust">
          <div className="home-desktop-trust__copy">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0E6BA8]">
              Urabá conectado
            </p>
            <h2 className="mt-2 font-display text-2xl font-black text-[#0D2B45]">
              {user && firstName
                ? `${firstName}, pedimos local y llega rápido`
                : `Delivery local en ${viewMuni}`}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4A6278]">
              Tiendas verificadas, mensajeros con seguimiento en vivo y envíos intermunicipales
              cuando lo necesites.
            </p>
          </div>
          <div className="home-desktop-trust__stats">
            <div className="home-desktop-stat">
              <span className="home-desktop-stat__value">{openNow}</span>
              <span className="home-desktop-stat__label">Tiendas abiertas</span>
            </div>
            <div className="home-desktop-stat">
              <span className="home-desktop-stat__value">
                {pulse?.avgDeliveryMin ? `~${pulse.avgDeliveryMin}m` : '—'}
              </span>
              <span className="home-desktop-stat__label">Entrega promedio</span>
            </div>
            <div className="home-desktop-stat">
              <span className="home-desktop-stat__value">{headerLocation.split(',')[0]}</span>
              <span className="home-desktop-stat__label">Tu zona</span>
            </div>
          </div>
        </section>
      </div>

      <HomeDesktopFooter />
    </div>
  );
}
