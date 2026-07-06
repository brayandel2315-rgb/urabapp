import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { CLIENT_SEARCH } from '@/app/clientNav';

const PLACEHOLDERS = [
  'Corrientazo con patacón…',
  'Farmacia cerca de ti…',
  'Mercado del barrio…',
  'Mandado urgente…',
  'Jugos y arepas…',
];

export default function DiscoverSearchTrigger({ className, municipio, compact = false }) {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % PLACEHOLDERS.length), 2800);
    return () => clearInterval(id);
  }, []);

  const go = () => navigate(CLIENT_SEARCH, { state: { focus: true } });

  if (compact) {
    return (
      <button
        type="button"
        onClick={go}
        aria-label="Explorar tiendas y productos"
        className={cn('discover-search-trigger discover-search-trigger--compact', className)}
      >
        <span className="discover-search-trigger__icon">
          <AppIcon name="search" size={20} className="text-[#28B463]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-sm text-[#4A6278]">
          {PLACEHOLDERS[idx]}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Explorar tiendas, productos y servicios en Urabá"
      className={cn('discover-search-trigger', className)}
    >
      <span className="discover-search-trigger__icon">
        <AppIcon name="search" size={22} className="text-[#28B463]" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-bold text-[#0D2B45]">
          ¿Qué se te antoja{municipio ? ` en ${municipio}` : ''}?
        </span>
        <span
          key={idx}
          className="discover-search-trigger__hint block truncate text-xs text-[#4A6278]"
        >
          {PLACEHOLDERS[idx]}
        </span>
      </span>
      <span className="discover-search-trigger__chip hidden sm:inline-flex">
        <AppIcon name="filter" size="xs" />
        Explorar
      </span>
    </button>
  );
}
