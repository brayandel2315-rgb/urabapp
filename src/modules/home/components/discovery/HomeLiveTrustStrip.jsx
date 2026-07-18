import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/**
 * Indicadores reales del marketplace (reemplaza trust pills estáticas con emoji).
 */
export default function HomeLiveTrustStrip({
  openCount = 0,
  avgDeliveryMin,
  activeOrders = 0,
  className,
}) {
  const items = [
    {
      id: 'eta',
      icon: 'pending',
      value: avgDeliveryMin ? `~${avgDeliveryMin}` : '—',
      unit: avgDeliveryMin ? 'min' : '',
      label: 'Entrega est.',
    },
    {
      id: 'open',
      icon: 'store',
      value: openCount > 0 ? String(openCount) : '—',
      unit: '',
      label: openCount === 1 ? 'Abierto' : 'Abiertos',
    },
    {
      id: 'live',
      icon: 'orders',
      value: activeOrders > 0 ? String(activeOrders) : '0',
      unit: '',
      label: activeOrders === 1 ? 'En curso' : 'En curso',
    },
    {
      id: 'safe',
      icon: 'verified',
      value: 'OK',
      unit: '',
      label: 'Pago seguro',
    },
  ];

  return (
    <div className={cn('home-live-trust', className)} aria-label="Estado del marketplace">
      {items.map((item) => (
        <div key={item.id} className="home-live-trust__pill">
          <span className="home-live-trust__icon" aria-hidden>
            <AppIcon name={item.icon} size={16} className="text-primary" />
          </span>
          <div className="home-live-trust__copy">
            <p className="home-live-trust__value">
              {item.value}
              {item.unit ? <span className="home-live-trust__unit">{item.unit}</span> : null}
            </p>
            <p className="home-live-trust__label">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
