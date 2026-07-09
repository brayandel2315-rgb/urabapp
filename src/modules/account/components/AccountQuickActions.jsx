import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { CLIENT_ORDERS, CLIENT_NOTIFICATIONS } from '@/app/clientNav';
import { cn } from '@/lib/utils';

const ACTIONS = [
  { key: 'orders', to: CLIENT_ORDERS, label: 'Pedidos', icon: 'orders', badgeKey: 'activeCount' },
  { key: 'notifications', to: CLIENT_NOTIFICATIONS, label: 'Avisos', icon: 'bell', badgeKey: 'unreadCount' },
  { key: 'addresses', to: '/cuenta/direcciones', label: 'Direcciones', icon: 'map', badgeKey: 'addressCount' },
  { key: 'coupons', to: '/cuenta/cupones', label: 'Cupones', icon: 'tag', badgeKey: 'couponCount' },
];

export default function AccountQuickActions({
  activeCount = 0,
  unreadCount = 0,
  addressCount = 0,
  couponCount = 0,
  className,
}) {
  const badges = { activeCount, unreadCount, addressCount, couponCount };

  return (
    <div className={cn('grid grid-cols-4 gap-2', className)}>
      {ACTIONS.map((action) => {
        const badge = badges[action.badgeKey] || 0;
        const showBadge = badge > 0 && action.badgeKey !== 'addressCount';

        return (
          <Link
            key={action.key}
            to={action.to}
            className="relative flex flex-col items-center gap-1.5 rounded-xl border border-[#D5E3EF] bg-white px-2 py-3 text-center transition hover:border-[#0E6BA8]/30"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E6F4FF] text-[#0E6BA8]">
              <AppIcon name={action.icon} size="sm" />
            </span>
            <span className="text-[11px] font-semibold text-[#0D2B45]">{action.label}</span>
            {action.badgeKey === 'addressCount' && addressCount > 0 && (
              <span className="text-[10px] text-[#4A6278]">{addressCount}</span>
            )}
            {showBadge && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0E6BA8] px-1 text-[9px] font-bold text-white">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
