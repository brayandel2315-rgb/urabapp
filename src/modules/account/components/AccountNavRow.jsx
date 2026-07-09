import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { isAccountNavActive } from '../accountNav';

export default function AccountNavRow({ item, pathname, badge }) {
  const active = isAccountNavActive(pathname, item);

  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 px-4 py-3.5 transition-colors',
        active ? 'bg-[#E6F4FF]/80' : 'hover:bg-[#F7FAFC]',
      )}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          active ? 'bg-[#0E6BA8] text-white' : 'bg-[#F0F4F8] text-[#0D2B45]',
        )}
      >
        <AppIcon name={item.icon} size="sm" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block text-sm font-semibold text-[#0D2B45]">{item.label}</span>
          {badge > 0 && (
            <span className="rounded-full bg-[#0E6BA8] px-1.5 py-0.5 text-[10px] font-bold text-white">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </span>
        {item.hint && (
          <span className="block truncate text-xs text-[#4A6278]">{item.hint}</span>
        )}
      </span>
      <span className="text-[#4A6278]" aria-hidden>›</span>
    </Link>
  );
}
