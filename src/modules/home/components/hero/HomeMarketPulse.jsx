import { cn } from '@/lib/utils';
import { STORE } from '@/utils/marketplace-copy';

export default function HomeMarketPulse({
  municipio,
  openCount = 0,
  avgDeliveryMin,
  activeOrders,
  className,
  variant = 'default',
}) {
  if (variant === 'hero') {
    if (!avgDeliveryMin && !openCount) {
      return (
        <p className={cn('home-hero-pulse', className)}>
          Locales de {municipio || 'Urabá'} · logística local
        </p>
      );
    }

    return (
      <p className={cn('home-hero-pulse', className)}>
        <span className="home-hero-pulse__mark" aria-hidden>
          🕒
        </span>
        {avgDeliveryMin ? (
          <>
            Entrega en{' '}
            <span className="home-hero-pulse__highlight">~{avgDeliveryMin} min</span>
            {openCount > 0 ? (
              <span className="home-hero-pulse__sep"> · {openCount} abiertos</span>
            ) : null}
          </>
        ) : (
          <span>
            {openCount} abierto{openCount !== 1 ? 's' : ''} ahora
          </span>
        )}
      </p>
    );
  }

  const parts = [];
  if (openCount > 0) parts.push(`${openCount} abierto${openCount !== 1 ? 's' : ''} ahora`);
  if (avgDeliveryMin) parts.push(`~${avgDeliveryMin} min de entrega`);
  if (activeOrders > 0) parts.push(`${activeOrders} pedido${activeOrders !== 1 ? 's' : ''} en curso`);

  if (!parts.length) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        {STORE.many} locales de {municipio || 'Urabá'} · logística local
      </p>
    );
  }

  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      {parts.join(' · ')}
    </p>
  );
}
