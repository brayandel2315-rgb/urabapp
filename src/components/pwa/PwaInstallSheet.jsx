import { useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import BrandLogo from '@/components/brand/BrandLogo';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { BRAND } from '@/utils/constants';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import { INSTALL_COPY } from '@/pwa/install-detect';
import PwaIosInstallWizard from './PwaIosInstallWizard';
import PwaAndroidInstallWizard from './PwaAndroidInstallWizard';
import { toast } from '@/utils/toast';

export default function PwaInstallSheet() {
  const sheetOpen = usePwaInstallStore((s) => s.sheetOpen);
  const closeSheet = usePwaInstallStore((s) => s.closeSheet);
  const platform = usePwaInstallStore((s) => s.platform);
  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const installing = usePwaInstallStore((s) => s.installing);
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const runNativeInstall = usePwaInstallStore((s) => s.runNativeInstall);
  const dismissPrompt = usePwaInstallStore((s) => s.dismissPrompt);
  const resetIosWizard = usePwaInstallStore((s) => s.resetIosWizard);
  const resetAndroidWizard = usePwaInstallStore((s) => s.resetAndroidWizard);

  const isIosFlow = platform === 'ios' || platform === 'ios-other';
  const isAndroidFlow = platform === 'android';
  const copyKey = deferredPrompt ? (platform === 'desktop' ? 'desktop' : 'android') : platform;
  const copy = INSTALL_COPY[copyKey] || INSTALL_COPY.other;

  const handleClose = useCallback(() => {
    closeSheet();
    if (isIosFlow) resetIosWizard();
    if (isAndroidFlow) resetAndroidWizard();
  }, [closeSheet, isIosFlow, isAndroidFlow, resetIosWizard, resetAndroidWizard]);

  const handleDismiss = useCallback(() => {
    dismissPrompt(14);
    handleClose();
  }, [dismissPrompt, handleClose]);

  const handleNativeInstall = useCallback(async () => {
    const { outcome } = await runNativeInstall();
    if (outcome === 'accepted') {
      closeSheet();
      return;
    }
    if (outcome === 'dismissed') {
      toast('Puedes seguir la guía paso a paso cuando quieras', 'info');
      return;
    }
    if (outcome === 'error') {
      toast('No se pudo abrir el instalador. Sigue la guía visual.', 'error');
    }
  }, [runNativeInstall, closeSheet]);

  if (platform === 'installed') return null;

  return (
    <AnimatePresence>
      {sheetOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Cerrar"
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-labelledby="pwa-install-title"
            className="fixed inset-x-0 bottom-0 z-[81] mx-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border/60 bg-card p-5 pb-safe shadow-2xl sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />

            {isIosFlow && !deferredPrompt ? (
              <PwaIosInstallWizard
                platform={platform}
                onClose={handleClose}
                onDismiss={handleDismiss}
              />
            ) : isAndroidFlow ? (
              <PwaAndroidInstallWizard
                onClose={handleClose}
                onDismiss={handleDismiss}
                hasNativePrompt={Boolean(deferredPrompt)}
                onNativeInstall={handleNativeInstall}
              />
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <BrandLogo variant="icon" alt="" className="h-16 w-16 shrink-0 object-contain bg-transparent shadow-md ring-2 ring-primary/20" />
                  <div className="min-w-0">
                    <p id="pwa-install-title" className="font-display text-lg font-bold text-foreground">
                      {copy.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <AppIcon name="check" size="xs" className="text-primary" />
                    Icono {BRAND.name} en inicio o escritorio
                  </li>
                  <li className="flex items-center gap-2">
                    <AppIcon name="check" size="xs" className="text-primary" />
                    Pedidos, tracking y notificaciones más rápidos
                  </li>
                  <li className="flex items-center gap-2">
                    <AppIcon name="check" size="xs" className="text-primary" />
                    Sin descargar de tienda — actualización automática
                  </li>
                </ul>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  {deferredPrompt ? (
                    <Button className="w-full sm:flex-1" disabled={installing} onClick={handleNativeInstall}>
                      {installing ? 'Instalando…' : (copy.cta || 'Instalar ahora')}
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" onClick={handleClose}>
                      {copy.cta || 'Entendido'}
                    </Button>
                  )}
                  <Button variant="ghost" className="w-full sm:w-auto" onClick={handleDismiss}>
                    Ahora no
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
