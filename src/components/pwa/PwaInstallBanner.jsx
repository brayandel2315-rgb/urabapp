import { usePwaInstallStore } from '@/store/pwaInstallStore';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { APP_ICON_URL } from '@/pwa/install-detect';
import { BRAND } from '@/utils/constants';

/** Banner contextual — solo escritorio; en móvil usar menú de servicios */
export default function PwaInstallBanner() {
  const bannerVisible = usePwaInstallStore((s) => s.bannerVisible);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);
  const platform = usePwaInstallStore((s) => s.platform);
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const dismissPrompt = usePwaInstallStore((s) => s.dismissPrompt);
  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const installing = usePwaInstallStore((s) => s.installing);

  const isIos = platform === 'ios' || platform === 'ios-other';

  const handleInstall = () => {
    triggerInstall();
  };

  if (!bannerVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[45] hidden w-full max-w-sm lg:block">
      <div className="flex items-center gap-3 rounded-2xl border border-primary/25 bg-card/95 p-3 shadow-lift backdrop-blur-md">
        <img src={APP_ICON_URL} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-primary/20" />
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold text-foreground">
            {deferredPrompt ? 'Instala con un toque' : isIos ? 'Agregar a inicio' : `App ${BRAND.name}`}
          </p>
          <p className="text-xs text-muted-foreground">
            {deferredPrompt
              ? 'Icono en inicio o escritorio — sin pasos manuales'
              : isIos
                ? 'Guía paso a paso con el icono de Urabapp'
                : 'Acceso rápido como app nativa'}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <Button size="sm" className="h-8 px-3 text-xs" disabled={installing} onClick={handleInstall}>
            <AppIcon name={isIos && !deferredPrompt ? 'add' : 'download'} size="xs" className="mr-1" />
            {installing ? '…' : isIos && !deferredPrompt ? 'Guía' : 'Instalar'}
          </Button>
          <button
            type="button"
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
            onClick={() => dismissPrompt(7)}
          >
            Después
          </button>
        </div>
      </div>
    </div>
  );
}
