import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineBanner({ className }) {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className={cn(
        'fixed left-0 right-0 top-0 z-[60] flex items-center justify-center gap-2 bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground',
        className
      )}
    >
      <AppIcon name="offline" size="sm" />
      Sin conexión — los cambios se sincronizarán al reconectar
    </div>
  );
}
