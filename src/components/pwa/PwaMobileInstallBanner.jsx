import { motion, AnimatePresence } from 'motion/react';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { APP_ICON_URL } from '@/pwa/install-detect';
import { BRAND } from '@/utils/constants';

/** Banner móvil — guía visual de instalación (Android / iPhone) */
export default function PwaMobileInstallBanner() {
  const mobileBannerVisible = usePwaInstallStore((s) => s.mobileBannerVisible);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);
  const platform = usePwaInstallStore((s) => s.platform);
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const dismissPrompt = usePwaInstallStore((s) => s.dismissPrompt);
  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const installing = usePwaInstallStore((s) => s.installing);

  const isIos = platform === 'ios' || platform === 'ios-other';
  const label = deferredPrompt ? 'Instalar en un toque' : 'Guía paso a paso';

  if (!mobileBannerVisible || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        className="fixed inset-x-3 z-[48] lg:hidden"
        style={{ bottom: 'calc(var(--mobile-nav-space, 5.25rem) + 0.35rem)' }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-card/95 p-3 shadow-lift backdrop-blur-md">
          <img src={APP_ICON_URL} alt="" className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-primary/20" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-foreground">
              {isIos ? 'Agregar Urabapp al inicio' : `Instala ${BRAND.name}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {label} — dibujos en pantalla como Temu
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <Button size="sm" className="h-8 px-3 text-xs" disabled={installing} onClick={() => triggerInstall()}>
              <AppIcon name={deferredPrompt ? 'download' : 'add'} size="xs" className="mr-1" />
              {installing ? '…' : 'Ver'}
            </Button>
            <button
              type="button"
              className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => dismissPrompt(5)}
            >
              Después
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
