import ServiceCommercialHero from '@/components/services/ServiceCommercialHero';

/** @deprecated Usa ServiceCommercialHero directamente */
export default function ShipmentHero({ onCotizar, onPrimary, ...props }) {
  return (
    <ServiceCommercialHero
      variant="shipment"
      onPrimary={onPrimary || onCotizar}
      {...props}
    />
  );
}
