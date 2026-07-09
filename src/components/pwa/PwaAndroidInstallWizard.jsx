import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { BRAND } from '@/utils/constants';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import { APP_ICON_URL, ANDROID_WIZARD_STEPS } from '@/pwa/install-detect';
import { getInstallWizardVariant } from '@/pwa/install-loop';
import PwaAndroidCoachMark from './PwaAndroidCoachMark';
import PwaInstallBrushProgress, { PwaInstallBrushFrame } from './PwaInstallBrushProgress';
import PwaInstallFeedback from './PwaInstallFeedback';

function HomeScreenPreview({ success = false }) {
  return (
    <PwaInstallBrushFrame>
      <div className="overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-4">
        <div className="mb-3 grid grid-cols-4 gap-2.5">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="aspect-square rounded-[14px] bg-white/10" />
          ))}
          <div className="relative aspect-square">
            <motion.img
              src={APP_ICON_URL}
              alt=""
              className="h-full w-full rounded-[14px] object-cover shadow-lg ring-1 ring-white/20"
              initial={success ? { scale: 0.6, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            />
            {success && (
              <motion.span
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AppIcon name="check" size="xs" />
              </motion.span>
            )}
          </div>
        </div>
        <p className="truncate text-center text-[10px] font-medium text-white/80">{BRAND.name}</p>
      </div>
    </PwaInstallBrushFrame>
  );
}

function ChromeMenuMock() {
  return (
    <PwaInstallBrushFrame>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
        <div className="border-b border-border/40 px-4 py-2 text-xs font-semibold text-muted-foreground">
          Menú de Chrome
        </div>
        <div className="space-y-0.5 p-2">
          {['Nueva pestaña', 'Historial', 'Descargas'].map((label) => (
            <div key={label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground">
              <span className="h-8 w-8 rounded-lg bg-muted" />
              {label}
            </div>
          ))}
          <motion.div
            className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5 ring-2 ring-primary/40"
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <AppIcon name="download" size="sm" className="text-primary" />
            </span>
            <span className="text-sm font-bold text-foreground">Instalar app</span>
          </motion.div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground">
            <span className="h-8 w-8 rounded-lg bg-muted" />
            Agregar a pantalla de inicio
          </div>
        </div>
      </div>
    </PwaInstallBrushFrame>
  );
}

function ConfirmDialogMock() {
  return (
    <PwaInstallBrushFrame>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30 p-5">
        <div className="flex flex-col items-center gap-3">
          <img
            src={APP_ICON_URL}
            alt=""
            className="h-16 w-16 rounded-2xl object-cover shadow-lg ring-2 ring-primary/25"
          />
          <p className="text-center text-sm font-bold text-foreground">¿Instalar Urabapp?</p>
          <p className="text-center text-xs text-muted-foreground">
            Se agregará a tu pantalla de inicio
          </p>
          <div className="mt-1 flex w-full gap-2">
            <span className="flex-1 rounded-xl border border-border py-2.5 text-center text-sm text-muted-foreground">
              Cancelar
            </span>
            <motion.span
              className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-primary-foreground"
              animate={{ opacity: [1, 0.65, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Instalar
            </motion.span>
          </div>
        </div>
      </div>
    </PwaInstallBrushFrame>
  );
}

/** Guía visual paso a paso para Android — estilo Temu */
export default function PwaAndroidInstallWizard({ onClose, onDismiss, hasNativePrompt, onNativeInstall }) {
  const androidStep = usePwaInstallStore((s) => s.androidStep);
  const setAndroidStep = usePwaInstallStore((s) => s.setAndroidStep);
  const refreshStandalone = usePwaInstallStore((s) => s.refreshStandalone);
  const variant = getInstallWizardVariant();

  const steps = ANDROID_WIZARD_STEPS;
  const step = steps[androidStep] ?? steps[0];
  const isLast = androidStep >= steps.length - 1;
  const showCoach = step.coach === 'chrome-menu';

  const handleNext = useCallback(() => {
    if (isLast) {
      refreshStandalone();
      onClose();
      return;
    }
    setAndroidStep(androidStep + 1);
  }, [androidStep, isLast, setAndroidStep, refreshStandalone, onClose]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshStandalone();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refreshStandalone]);

  useEffect(() => {
    if (androidStep !== steps.length - 2) return undefined;
    const id = window.setInterval(refreshStandalone, 2000);
    return () => window.clearInterval(id);
  }, [androidStep, steps.length, refreshStandalone]);

  return (
    <>
      <PwaAndroidCoachMark visible={showCoach} target={step.coach} />

      <div className={showCoach ? 'pt-2' : ''}>
        <PwaInstallBrushProgress
          steps={steps}
          currentStep={androidStep}
          label={variant === 'detailed' ? `Guía Android · paso ${androidStep + 1}` : undefined}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-start gap-4">
              <img
                src={APP_ICON_URL}
                alt=""
                className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-md ring-2 ring-primary/20"
              />
              <div className="min-w-0">
                <p className="font-display text-lg font-bold text-foreground">{step.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{step.subtitle}</p>
                {step.hint && variant === 'detailed' && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                    <AppIcon name="alert" size="xs" />
                    {step.hint}
                  </p>
                )}
              </div>
            </div>

            {step.showHomePreview && <HomeScreenPreview success={step.success} />}
            {step.mock === 'chrome-menu' && <ChromeMenuMock />}
            {step.mock === 'confirm-dialog' && <ConfirmDialogMock />}
          </motion.div>
        </AnimatePresence>

        {step.feedback && (
          <PwaInstallFeedback platform="android" stepReached={androidStep} />
        )}

        <div className="mt-6 flex flex-col gap-2">
          {hasNativePrompt && androidStep === 0 && (
            <Button className="w-full" onClick={onNativeInstall}>
              Instalar en un toque
            </Button>
          )}
          <Button className="w-full" variant={hasNativePrompt && androidStep === 0 ? 'outline' : 'default'} onClick={handleNext}>
            {step.cta}
          </Button>
          {androidStep > 0 && !isLast && (
            <Button variant="ghost" className="w-full" onClick={() => setAndroidStep(androidStep - 1)}>
              Paso anterior
            </Button>
          )}
          {!isLast && (
            <button
              type="button"
              className="text-center text-xs font-semibold text-muted-foreground hover:text-foreground"
              onClick={onDismiss}
            >
              Ahora no
            </button>
          )}
        </div>
      </div>
    </>
  );
}
