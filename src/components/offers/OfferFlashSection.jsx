import { useState } from 'react';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { OfferCardFlash } from './OfferCard';

export default function OfferFlashSection({ offers, onOfferClick }) {
  const [hidden, setHidden] = useState({});
  const visible = (offers ?? []).filter((o) => !hidden[o.id]);

  if (!visible.length) return null;

  return (
    <section>
      <HomeSectionHeader title="Ofertas flash" subtitle="Tiempo limitado — no te las pierdas" />
      <div className="app-mobile-card-list">
        {visible.map((offer) => (
          <OfferCardFlash
            key={offer.id}
            offer={offer}
            onClick={onOfferClick}
            onExpire={() => setHidden((h) => ({ ...h, [offer.id]: true }))}
          />
        ))}
      </div>
    </section>
  );
}
