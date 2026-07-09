import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function OffersHeader({
  savedCount = 0,
  municipio,
  className,
}) {
  return (
    <header className={cn('flex items-start justify-between gap-3', className)}>
      <div>
        <h1 className="font-display text-2xl font-bold text-[#0D2B45]">
          Ofertas
        </h1>
        <p className="mt-1 text-sm text-[#4A6278]">
          Promociones activas{municipio ? ` en ${municipio}` : ' cerca de ti'}
        </p>
      </div>
      {savedCount > 0 && (
        <Link
          to="/ofertas?tab=guardadas"
          className="shrink-0 rounded-full bg-[#E6F4FF] px-3 py-1.5 text-xs font-semibold text-[#0E6BA8]"
        >
          Guardadas ({savedCount > 9 ? '9+' : savedCount})
        </Link>
      )}
    </header>
  );
}
