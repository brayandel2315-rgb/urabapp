import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { CLIENT_SEARCH } from '@/app/clientNav';

export default function DiscoverSearchTrigger({ className, compact = false, variant = 'default' }) {
  const navigate = useNavigate();

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
          <AppIcon name="search" size={20} className="text-[#2E7D32]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-[#4B5563]">
          ¿Qué necesitas hoy?
        </span>
      </button>
    );
  }

  if (variant === 'integrated') {
    return (
      <button
        type="button"
        onClick={go}
        aria-label="Buscar comida, mercado, farmacia, envíos y más en Urabá"
        className={cn('discover-search-trigger discover-search-trigger--integrated', className)}
      >
        <span className="discover-search-trigger__icon discover-search-trigger__icon--integrated">
          <AppIcon name="search" size={16} className="text-[#2E7D32]" />
        </span>
        <span className="min-w-0 flex-1 truncate text-left text-xs font-medium text-[#6B7280]">
          ¿Qué necesitas hoy?
        </span>
        <span className="discover-search-trigger__scan discover-search-trigger__scan--integrated shrink-0">
          <AppIcon name="qr" size={16} className="text-[#2E7D32]" />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={go}
      aria-label="Buscar comida, mercado, farmacia, envíos y más en Urabá"
      className={cn('discover-search-trigger', className)}
    >
      <span className="discover-search-trigger__icon">
        <AppIcon name="search" size={22} className="text-[#2E7D32]" />
      </span>
      <span className="min-w-0 flex-1 truncate text-left text-base font-semibold text-[#4B5563]">
        ¿Qué necesitas hoy?
      </span>
      <span className="discover-search-trigger__scan hidden shrink-0 sm:flex">
        <AppIcon name="qr" size={20} className="text-[#4B5563]" />
      </span>
    </button>
  );
}
