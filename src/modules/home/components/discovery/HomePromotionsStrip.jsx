import { Link } from 'react-router-dom';
import { OfferCardHorizontal } from '@/components/offers/OfferCard';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import OfferMerchantSection from '@/components/offers/OfferMerchantSection';
import { OffersHubPreviewSkeleton } from '@/components/offers/OffersHubPreview';
import { groupOffersByMerchant } from '@/utils/offers-engine';

export default function HomePromotionsStrip({ promotions = [], promotionsByMerchant, isLoading, municipio }) {
  if (isLoading) return <OffersHubPreviewSkeleton />;

  const groups = promotionsByMerchant?.length
    ? promotionsByMerchant
    : groupOffersByMerchant(promotions);

  if (!groups.length && !promotions.length) return null;

  if (groups.length) {
    return (
      <OfferMerchantSection
        groups={groups.slice(0, 4)}
        title="Promos del día"
        subtitle={`Promos reales en ${municipio}`}
        compact
        aside={(
          <Link to="/ofertas" className="text-xs font-bold text-primary hover:underline">
            Ver todas
          </Link>
        )}
      />
    );
  }

  const items = promotions.slice(0, 6);
  return (
    <section aria-labelledby="home-promos-title" className="min-w-0">
      <HomeSectionHeader
        id="home-promos-title"
        title="Promos del día"
        subtitle={`Promos en ${municipio}`}
        aside={(
          <Link to="/ofertas" className="text-xs font-bold text-primary hover:underline">
            Ver todas
          </Link>
        )}
      />
      <div className="app-mobile-card-list">
        {items.map((offer, i) => (
          <OfferCardHorizontal key={offer.id || i} offer={offer} hidePrice className="w-full" />
        ))}
      </div>
    </section>
  );
}
