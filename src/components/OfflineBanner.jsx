import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] bg-secondary px-4 py-2 text-center text-sm font-semibold text-white">
      Sin conexión — los cambios se guardarán cuando vuelvas en línea
    </div>
  );
}
