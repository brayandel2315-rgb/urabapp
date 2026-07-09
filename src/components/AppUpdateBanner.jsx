import { useEffect, useState } from 'react';
import { toast } from '@/utils/toast';
import Button from './ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { reloadForUpdate, subscribeSwUpdate } from '@/pwa/swUpdate';
import { STORE } from '@/utils/marketplace-copy';

export default function AppUpdateBanner() {
  const [visible, setVisible] = useState(false);
  const [remoteBuildId, setRemoteBuildId] = useState(null);

  useEffect(() => subscribeSwUpdate(({ needsRefresh, remoteBuildId: remoteId }) => {
    if (!needsRefresh) return;
    setVisible(true);
    if (remoteId) setRemoteBuildId(remoteId);
    toast.info('Nueva versión disponible', {
      id: 'app-update',
      duration: Infinity,
      description: 'Actualiza Urabapp para la mejor experiencia de entrega y pagos.',
      trust: 'Actualización oficial',
      action: {
        label: 'Actualizar ahora',
        onClick: () => reloadForUpdate(),
      },
    });
  }), []);

  if (!visible) return null;

  const handleUpdate = () => {
    toast.dismiss('app-update');
    reloadForUpdate();
  };

  const handleDismiss = () => {
    setVisible(false);
    toast.dismiss('app-update');
  };

  return (
    <div
      className="fixed inset-x-0 top-0 z-[70] border-b border-primary/25 bg-primary px-4 py-3 text-primary-foreground shadow-md sm:top-auto sm:bottom-20 sm:mx-auto sm:max-w-lg sm:rounded-2xl sm:border sm:inset-x-4"
      role="alertdialog"
      aria-labelledby="app-update-title"
      aria-describedby="app-update-desc"
    >
      <div className="mx-auto flex max-w-3xl items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <AppIcon name="loading" size="sm" spin className="text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p id="app-update-title" className="font-display text-sm font-bold">
            Hay una versión nueva de UrabApp
          </p>
          <p id="app-update-desc" className="mt-0.5 text-xs text-white/85">
            Toca actualizar para ver {STORE.manyLower} y cambios recientes.
            {remoteBuildId ? ` (build ${remoteBuildId})` : ''}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              className="bg-white text-primary hover:bg-white/90"
              onClick={handleUpdate}
            >
              Actualizar ahora
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={handleDismiss}
            >
              Después
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
