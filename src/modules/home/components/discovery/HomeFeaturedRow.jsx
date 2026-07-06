import { Link } from 'react-router-dom';
import BusinessCard from '@/components/BusinessCard';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { BusinessListSkeleton } from '@/components/marketplace/TopBusinessesRow';

function FeaturedMobileCarousel({ businesses }) {
  return (
    <div className="home-store-carousel">
      {businesses.slice(0, 8).map((b, i) => (
        <div key={b.id} className="home-store-carousel__item">
          <BusinessCard
            business={b}
            layout="compact"
            rank={i < 3 ? i + 1 : undefined}
            imageLoading={i < 2 ? 'eager' : 'lazy'}
          />
        </div>
      ))}
    </div>
  );
}

function FeaturedMobileList({ businesses }) {
  return (
    <div className="app-mobile-card-list">
      {businesses.slice(0, 6).map((b, i) => (
        <BusinessCard
          key={b.id}
          business={b}
          layout="list"
          rank={i < 3 ? i + 1 : undefined}
          imageLoading={i < 2 ? 'eager' : 'lazy'}
        />
      ))}
    </div>
  );
}

export default function HomeFeaturedRow({ businesses = [], isLoading, municipio, emptyMessage, mobileLayout = 'carousel' }) {
  if (isLoading) {
    return (
      <section aria-labelledby="home-featured-title">
        <HomeSectionHeader id="home-featured-title" title="Descubre lo mejor de tu zona" subtitle="Cargando..." />
        <BusinessListSkeleton count={3} variant="list" />
      </section>
    );
  }

  if (!businesses.length) {
    if (!emptyMessage) return null;
    return (
      <section aria-labelledby="home-featured-title" className="home-surface-card py-8 text-center">
        <HomeSectionHeader id="home-featured-title" title="Sin tiendas cerca" subtitle={emptyMessage} />
      </section>
    );
  }

  return (
    <section aria-labelledby="home-featured-title" className="min-w-0">
      <HomeSectionHeader
        id="home-featured-title"
        title="Descubre lo mejor de tu zona"
        subtitle={`Destacados en ${municipio}`}
        variant="brand"
        aside={(
          <Link to="/restaurantes" className="home-cta-pill">
            Ver todos
          </Link>
        )}
      />
      {mobileLayout === 'carousel' ? (
        <FeaturedMobileCarousel businesses={businesses} />
      ) : (
        <FeaturedMobileList businesses={businesses} />
      )}
    </section>
  );
}
