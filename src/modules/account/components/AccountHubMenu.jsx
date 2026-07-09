import { useLocation } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { ACCOUNT_GROUPS } from '../accountNav';
import AccountNavRow from './AccountNavRow';
import { cn } from '@/lib/utils';

export default function AccountHubMenu({ unreadCount = 0, className }) {
  const { pathname } = useLocation();

  return (
    <div className={cn('space-y-5', className)}>
      {ACCOUNT_GROUPS.map((group) => (
        <section key={group.id}>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-[#4A6278]">
            {group.title}
          </h2>
          <SurfaceCard className="divide-y divide-[#D5E3EF] p-0">
            {group.items.map((item) => (
              <AccountNavRow
                key={item.to}
                item={item}
                pathname={pathname}
                badge={item.to === '/cuenta/notificaciones' ? unreadCount : 0}
              />
            ))}
          </SurfaceCard>
        </section>
      ))}
    </div>
  );
}
