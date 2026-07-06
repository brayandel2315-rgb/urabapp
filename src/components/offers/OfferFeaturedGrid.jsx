import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { OfferCardFeatured } from './OfferCard';

export default function OfferFeaturedGrid({ offers, onOfferClick, onSave, isSaved, onShare }) {
  if (!offers?.length) return null;
  return (
    <section>
      <HomeSectionHeader title="Ofertas destacadas" subtitle="Las mejores promos del momento" />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {offers.map((offer) => (
          <OfferCardFeatured
            key={offer.id}
            offer={offer}
            onClick={onOfferClick}
            onSave={onSave}
            saved={isSaved?.(offer.id)}
            onShare={onShare}
          />
        ))}
      </div>
    </section>
  );
}
