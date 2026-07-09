import { usePwaInstallStore } from '@/store/pwaInstallStore';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

/** Botón flotante — visible mientras navegas (encima del bottom nav) */
export default function PwaInstallFab({ className }) {
  const fabVisible = usePwaInstallStore((s) => s.fabVisible);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);
  const platform = usePwaInstallStore((s) => s.platform);
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const installing = usePwaInstallStore((s) => s.installing);
  const dismissPrompt = usePwaInstallStore((s) => s.dismissPrompt);

  const isIos = platform === 'ios' || platform === 'ios-other';

  const handleInstall = () => {
    triggerInstall();
  };

  if (!fabVisible || isStandalone) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-[55] flex flex-col items-end gap-2',
        'bottom-[calc(var(--mobile-nav-space,5.25rem)+0.5rem)] right-3',
        'lg:bottom-6 lg:right-6',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleInstall}
        disabled={installing}
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
        aria-label="Instalar Urabapp en tu dispositivo"
      >
        <AppIcon name="download" size="sm" className="text-primary-foreground" />
        {installing ? 'Instalando…' : isIos ? 'Guía iPhone' : 'Instalar app'}
      </button>
      <button
        type="button"
        onClick={() => dismissPrompt(7)}
        className="pointer-events-auto rounded-full bg-background/90 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-sm backdrop-blur"
      >
        Ocultar
      </button>
    </div>
  );
}
