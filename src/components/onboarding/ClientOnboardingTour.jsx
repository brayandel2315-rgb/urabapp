import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import { Button } from '@/design-system/ui/button';
import { useOnboardingStore } from '@/store/onboardingStore';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { useLocationStore, selectHomeMunicipio } from '@/store/locationStore';
import { useSettingsStore } from '@/store/settingsStore';
import { tween } from '@/design-system/motion/presets';
import { STORE } from '@/utils/marketplace-copy';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    id: 'welcome',
    icon: 'profile',
    title: 'Bienvenido a UrabApp',
    body: 'Pedidos, mercado, farmacia y envíos en el Urabá — rápido, local y confiable.',
  },
  {
    id: 'location',
    icon: 'map',
    title: 'Tu ubicación automática',
    body: `Detectamos tu zona por GPS para mostrarte ${STORE.manyLower} con cobertura real. Sin elegir ciudad manualmente.`,
    action: 'location',
  },
  {
    id: 'notifications',
    icon: 'bell',
    title: 'Mantente al día',
    body: 'Te avisamos cuando tu pedido avanza, llega el mensajero o hay ofertas cerca.',
    action: 'notifications',
  },
  {
    id: 'search',
    icon: 'search',
    title: 'Busca y descubre',
    body: 'Usa el buscador del inicio para restaurantes, farmacias, mercados o mandados.',
  },
  {
    id: 'orders',
    icon: 'orders',
    title: 'Sigue tu pedido en vivo',
    body: 'En Pedidos verás el mapa, el mensajero y el ETA. Puedes dejar propina al confirmar.',
  },
  {
    id: 'install',
    icon: 'download',
    title: 'Instala Urabapp en tu celular',
    body: 'Te guiamos paso a paso con dibujos en pantalla — Android o iPhone, sin Play Store ni App Store.',
    action: 'install',
  },
];

const SKIP_PATHS = ['/login', '/registro', '/checkout', '/carrito', '/negocio', '/domiciliario', '/admin'];

export default function ClientOnboardingTour() {
  const location = useLocation();
  const completed = useOnboardingStore((s) => s.completed);
  const complete = useOnboardingStore((s) => s.complete);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const { detect, locationStatus } = useAutoLocation({ auto: false });
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const setNotificationPref = useSettingsStore((s) => s.setNotificationPref);
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);

  useEffect(() => {
    if (completed) return undefined;
    if (SKIP_PATHS.some((p) => location.pathname.startsWith(p))) return undefined;
    const timer = window.setTimeout(() => setOpen(true), 1400);
    return () => window.clearTimeout(timer);
  }, [completed, location.pathname]);

  useEffect(() => {
    if (!open || completed) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open, completed]);

  const current = STEPS[step];
  const isLast = step >= STEPS.length - 1;

  const handleNext = async () => {
    if (current.action === 'location' && locationStatus !== 'granted') {
      detect().catch(() => {});
    }
    if (current.action === 'notifications') {
      setNotificationPref('orders', true);
      setNotificationPref('push', true);
    }
    if (current.action === 'install' && !isStandalone) {
      complete();
      setOpen(false);
      triggerInstall();
      return;
    }
    if (isLast) {
      complete();
      setOpen(false);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSkip = () => {
    complete();
    setOpen(false);
  };

  if (!open || completed) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Cerrar tutorial"
        onClick={handleSkip}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={tween}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-lift"
        >
          <div className="bg-gradient-to-br from-primary/10 via-card to-card px-6 pb-2 pt-8 text-center">
            <AppIcon name={current.icon} size="xl" className="mx-auto text-primary" />
            <h2 id="onboarding-title" className="mt-4 font-display text-xl font-bold text-foreground">
              {current.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
            {current.id === 'location' && homeMunicipio && (
              <p className="mt-3 rounded-xl bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                Zona detectada: {homeMunicipio}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-1.5 px-6 py-4">
            {STEPS.map((s, i) => (
              <span
                key={s.id}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted'
                )}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-border px-6 pb-6 pt-2">
            <Button type="button" className="w-full" onClick={handleNext}>
              {current.action === 'location' && locationStatus !== 'granted'
                ? 'Activar ubicación'
                : current.action === 'install'
                  ? 'Ver guía de instalación'
                : isLast
                  ? 'Empezar a pedir'
                  : 'Continuar'}
            </Button>
            {current.id === 'notifications' && (
              <Link
                to="/cuenta/preferencias"
                className="text-center text-xs font-semibold text-primary"
                onClick={() => { complete(); setOpen(false); }}
              >
                Configurar notificaciones →
              </Link>
            )}
            <button
              type="button"
              className="text-center text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={handleSkip}
            >
              Omitir tutorial
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
