import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { OfferCardBundle } from './OfferCard';

export default function OfferBundlesSection({ offers, onOfferClick }) {
  if (!offers?.length) return null;
  return (
    <section>
      <HomeSectionHeader title="Compra más y ahorra" subtitle="Combos con descuento en tiendas seleccionadas" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((offer) => (
          <OfferCardBundle key={offer.id} offer={offer} onClick={onOfferClick} />
        ))}
      </div>
    </section>
  );
}
