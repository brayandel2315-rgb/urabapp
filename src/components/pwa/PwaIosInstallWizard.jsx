import { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { BRAND } from '@/utils/constants';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import {
  APP_ICON_URL,
  IOS_OTHER_STEP,
  IOS_WIZARD_STEPS,
} from '@/pwa/install-detect';
import PwaSafariCoachMark from './PwaSafariCoachMark';
import PwaInstallBrushProgress, { PwaInstallBrushFrame } from './PwaInstallBrushProgress';
import PwaInstallFeedback from './PwaInstallFeedback';
import { toast } from '@/utils/toast';

function HomeScreenPreview({ success = false }) {
  return (
    <PwaInstallBrushFrame>
      <div className="mx-auto w-full max-w-[220px] rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 p-4 shadow-inner">
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

function ShareSheetMock() {
  return (
    <PwaInstallBrushFrame>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
      <div className="border-b border-border/40 px-4 py-2 text-center text-xs font-semibold text-muted-foreground">
        Compartir
      </div>
      <div className="space-y-0.5 p-2">
        {['Copiar', 'Mensajes', 'WhatsApp'].map((label) => (
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
            <AppIcon name="add" size="sm" className="text-primary" />
          </span>
          <span className="text-sm font-bold text-foreground">Agregar a inicio</span>
          <AppIcon name="chevronDown" size="xs" className="ml-auto rotate-[-90deg] text-primary" />
        </motion.div>
      </div>
    </div>
    </PwaInstallBrushFrame>
  );
}

function ConfirmSheetMock() {
  return (
    <PwaInstallBrushFrame>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/30">
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5">
        <span className="text-sm text-muted-foreground">Cancelar</span>
        <span className="text-sm font-bold text-foreground">Agregar a inicio</span>
        <motion.span
          className="text-sm font-bold text-primary"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Agregar
        </motion.span>
      </div>
      <div className="flex flex-col items-center gap-3 p-6">
        <img
          src={APP_ICON_URL}
          alt=""
          className="h-20 w-20 rounded-[22px] object-cover shadow-lg ring-2 ring-primary/25"
        />
        <div className="w-full rounded-xl border border-border/50 bg-background px-3 py-2 text-center text-sm font-semibold">
          {BRAND.name}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          urabapp.vercel.app
        </p>
      </div>
    </div>
    </PwaInstallBrushFrame>
  );
}

function IosOtherBrowserPanel({ onCopy }) {
  return (
    <div className="mt-4 space-y-3 rounded-2xl bg-amber-500/10 p-4 ring-1 ring-amber-500/25">
      <p className="text-sm font-medium text-foreground">{IOS_OTHER_STEP.subtitle}</p>
      <ol className="space-y-2 text-sm text-muted-foreground">
        <li className="flex gap-2">
          <span className="font-bold text-primary">1.</span>
          Copia el enlace de Urabapp
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-primary">2.</span>
          Pégalo en Safari
        </li>
        <li className="flex gap-2">
          <span className="font-bold text-primary">3.</span>
          Sigue la guía paso a paso
        </li>
      </ol>
      <Button className="w-full" onClick={onCopy}>
        <AppIcon name="link" size="sm" className="mr-2" />
        {IOS_OTHER_STEP.cta}
      </Button>
    </div>
  );
}

/** Asistente paso a paso para Safari en iPhone/iPad */
export default function PwaIosInstallWizard({ platform, onClose, onDismiss }) {
  const iosStep = usePwaInstallStore((s) => s.iosStep);
  const setIosStep = usePwaInstallStore((s) => s.setIosStep);
  const refreshStandalone = usePwaInstallStore((s) => s.refreshStandalone);

  const step = IOS_WIZARD_STEPS[iosStep] ?? IOS_WIZARD_STEPS[0];
  const isLast = iosStep >= IOS_WIZARD_STEPS.length - 1;
  const showCoach = step.coach === 'share';

  const handleNext = useCallback(() => {
    if (isLast) {
      refreshStandalone();
      onClose();
      return;
    }
    setIosStep(iosStep + 1);
  }, [iosStep, isLast, setIosStep, refreshStandalone, onClose]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      toast('Enlace copiado — ábrelo en Safari', 'success');
    } catch {
      toast('Copia manual: urabapp.vercel.app', 'info');
    }
  }, []);

  useEffect(() => {
    if (platform !== 'ios') return undefined;
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshStandalone();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [platform, refreshStandalone]);

  useEffect(() => {
    if (iosStep !== 3) return undefined;
    const id = window.setInterval(refreshStandalone, 2000);
    return () => window.clearInterval(id);
  }, [iosStep, refreshStandalone]);

  if (platform === 'ios-other') {
    return (
      <div>
        <div className="flex items-start gap-4">
          <img src={APP_ICON_URL} alt="" className="h-16 w-16 shrink-0 rounded-2xl shadow-md ring-2 ring-primary/20" />
          <div>
            <p className="font-display text-lg font-bold">{IOS_OTHER_STEP.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{IOS_OTHER_STEP.subtitle}</p>
          </div>
        </div>
        <IosOtherBrowserPanel onCopy={handleCopyLink} />
        <div className="mt-6 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onDismiss}>Ahora no</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PwaSafariCoachMark visible={showCoach} />

      <div className={showCoach ? 'pb-24' : ''}>
        <PwaInstallBrushProgress steps={IOS_WIZARD_STEPS} currentStep={iosStep} />

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
                {step.hint && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                    <AppIcon name="alert" size="xs" />
                    {step.hint}
                  </p>
                )}
              </div>
            </div>

            {step.showHomePreview && <HomeScreenPreview success={step.success} />}
            {step.mock === 'share-sheet' && <ShareSheetMock />}
            {step.mock === 'confirm-sheet' && <ConfirmSheetMock />}
          </motion.div>
        </AnimatePresence>

        {step.id === 'done' && (
          <PwaInstallFeedback platform="ios" stepReached={iosStep} />
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button className="w-full" onClick={handleNext}>
            {step.cta}
          </Button>
          {iosStep > 0 && !isLast && (
            <Button variant="ghost" className="w-full" onClick={() => setIosStep(iosStep - 1)}>
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
