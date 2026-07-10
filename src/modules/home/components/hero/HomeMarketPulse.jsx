import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { STORE } from '@/utils/marketplace-copy';

export default function HomeMarketPulse({
  municipio,
  openCount = 0,
  avgDeliveryMin,
  activeOrders,
  className,
}) {
  const parts = [];
  if (openCount > 0) parts.push(`${openCount} abierto${openCount !== 1 ? 's' : ''} ahora`);
  if (avgDeliveryMin) parts.push(`~${avgDeliveryMin} min de entrega`);
  if (activeOrders > 0) parts.push(`${activeOrders} pedido${activeOrders !== 1 ? 's' : ''} en curso`);

  if (!parts.length) {
    return (
      <p className={cn('text-sm text-[#4B5563]', className)}>
        {STORE.many} locales de {municipio || 'Urabá'} · logística local
      </p>
    );
  }

  return (
    <p className={cn('flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#4B5563]', className)}>
      <AppIcon name="delivery" size="xs" className="text-[#2E7D32]" />
      <span>{parts.join(' · ')}</span>
    </p>
  );
}
