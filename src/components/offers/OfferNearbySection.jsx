import { Link } from 'react-router-dom';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import Button from '@/components/ui/Button';
import { STORE } from '@/utils/marketplace-copy';
import { OfferCardHorizontal } from './OfferCard';

export default function OfferNearbySection({ offers, onOfferClick }) {
  if (!offers?.length) return null;
  return (
    <section>
      <HomeSectionHeader
        title="Ofertas cerca"
        subtitle="Ordenadas por cercanía, popularidad y tiempo restante"
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
      <Link to="/" className="mt-3 block">
        <Button variant="outline" className="w-full sm:w-auto">{STORE.browse}</Button>
      </Link>
    </section>
  );
}
