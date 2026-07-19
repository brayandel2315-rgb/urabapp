import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/**
 * Trust / benefit cards — estilo mockup premium (Grab / Uber Eats).
 */
export default function HomeLiveTrustStrip({
  openCount = 0,
  avgDeliveryMin,
  className,
}) {
  const eta = avgDeliveryMin ? `~${avgDeliveryMin} min` : '~25 min';
  const stores = openCount > 0 ? `${openCount}+` : '18+';

  const items = [
    {
      id: 'eta',
      icon: 'pending',
      value: eta,
      label: 'Entrega estimada',
    },
    {
      id: 'open',
      icon: 'store',
      value: stores,
      label: 'Tiendas abiertas',
    },
    {
      id: 'safe',
      icon: 'verified',
      value: 'Pago seguro',
      label: 'Protegido',
    },
    {
      id: 'support',
      icon: 'headset',
      value: 'Soporte 24/7',
      label: 'Siempre online',
    },
  ];

  return (
    <div className={cn('home-live-trust', className)} aria-label="Beneficios Urabapp">
      {items.map((item) => (
        <div key={item.id} className="home-live-trust__pill">
          <span className="home-live-trust__icon" aria-hidden>
            <AppIcon name={item.icon} size={18} className="text-[#1E6F43]" />
          </span>
          <div className="home-live-trust__copy">
            <p className="home-live-trust__value">{item.value}</p>
            <p className="home-live-trust__label">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
