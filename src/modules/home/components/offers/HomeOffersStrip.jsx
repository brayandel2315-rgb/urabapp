import { Link } from 'react-router-dom';
import { OfferCardHorizontal } from '@/components/offers/OfferCard';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { OffersHubPreviewSkeleton } from '@/components/offers/OffersHubPreview';

export default function HomeOffersStrip({ feed, isLoading, municipio }) {
  const items = feed?.featured?.slice(0, 8) ?? feed?.flash?.slice(0, 8) ?? [];

  if (isLoading) return <OffersHubPreviewSkeleton />;

  if (!items.length) return null;

  return (
    <section aria-labelledby="home-offers-title" className="min-w-0">
      <HomeSectionHeader
        id="home-offers-title"
        title="Ofertas"
        subtitle={`Promos activas en ${municipio}`}
        aside={(
          <Link to="/ofertas" className="text-xs font-bold text-primary hover:underline">
            Ver todas
          </Link>
        )}
      />
      <div className="app-mobile-card-list">
        {items.map((offer, i) => (
          <OfferCardHorizontal key={offer.id || i} offer={offer} className="w-full" />
        ))}
      </div>
    </section>
  );
}
