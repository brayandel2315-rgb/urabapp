import { Link } from 'react-router-dom';
import StickerIcon from '@/design-system/stickers/StickerIcon';
import { cn } from '@/lib/utils';

export default function ServiceCrossSell({ variant = 'courier', className }) {
  const isCourier = variant === 'courier';

  return (
    <Link
      to={isCourier ? '/envios' : '/mandado'}
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-[#D5E3EF] bg-white p-4 shadow-card transition hover:border-[#0E6BA8]/30',
        className,
      )}
    >
      <StickerIcon name={isCourier ? 'envios' : 'mensajeria'} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold text-[#0D2B45]">
          {isCourier ? '¿Va a otro municipio?' : '¿Es en el mismo municipio?'}
        </p>
        <p className="text-xs text-[#4A6278]">
          {isCourier
            ? 'Usa envíos intermunicipales con rastreo completo'
            : 'Un mandado urbano es más rápido y económico'}
        </p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-[#0E6BA8]">Ver →</span>
    </Link>
  );
}
