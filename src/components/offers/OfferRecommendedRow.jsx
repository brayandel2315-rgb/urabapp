import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { OfferCardHorizontal } from './OfferCard';

export default function OfferRecommendedRow({ offers, onOfferClick }) {
  if (!offers?.length) return null;
  return (
    <section>
      <HomeSectionHeader
        title="Recomendadas para ti"
        subtitle="Según tu historial, ubicación y horario"
      />
      <div className="app-mobile-card-list">
        {offers.map((offer) => (
          <OfferCardHorizontal
            key={offer.id}
            offer={offer}
            onClick={onOfferClick}
            className="w-full"
          />
        ))}
      </div>
    </section>
  );
}
