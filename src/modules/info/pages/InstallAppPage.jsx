import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/design-system/layouts/PageLayout';
import PageMeta from '@/design-system/patterns/PageMeta';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import { detectInstallPlatform } from '@/pwa/install-detect';
import PwaIosInstallWizard from '@/components/pwa/PwaIosInstallWizard';
import PwaAndroidInstallWizard from '@/components/pwa/PwaAndroidInstallWizard';
import { BRAND } from '@/utils/constants';
import { emitCommEvent } from '@/communication';
import { useAuthStore } from '@/store/authStore';

/** Página pública — guía visual de instalación móvil */
export default function InstallAppPage() {
  const user = useAuthStore((s) => s.user);
  const platform = usePwaInstallStore((s) => s.platform);
  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const openSheet = usePwaInstallStore((s) => s.openSheet);
  const runNativeInstall = usePwaInstallStore((s) => s.runNativeInstall);
  const isStandalone = usePwaInstallStore((s) => s.isStandalone);
  const resetIosWizard = usePwaInstallStore((s) => s.resetIosWizard);
  const resetAndroidWizard = usePwaInstallStore((s) => s.resetAndroidWizard);

  const detected = platform === 'other' ? detectInstallPlatform() : platform;
  const isIos = detected === 'ios' || detected === 'ios-other';
  const isAndroid = detected === 'android';

  useEffect(() => {
    resetIosWizard();
    resetAndroidWizard();
  }, [resetIosWizard, resetAndroidWizard]);

  useEffect(() => {
    if (!user?.id) return;
    emitCommEvent('marketplace_analytics', {
      recipientId: user.id,
      actorId: user.id,
      payload: { page: 'install_app', platform: detected },
      push: false,
    }).catch(() => {});
  }, [user?.id, detected]);

  if (isStandalone) {
    return (
      <PageLayout>
        <PageMeta title={`Instalar ${BRAND.name}`} />
        <div className="mx-auto max-w-lg px-4 py-10 text-center">
          <AppIcon name="check" size="xl" className="mx-auto text-primary" />
          <h1 className="mt-4 font-display text-2xl font-bold">Ya tienes Urabapp instalada</h1>
          <p className="mt-2 text-muted-foreground">Ábrela desde el icono en tu pantalla de inicio.</p>
          <Button asChild className="mt-6">
            <Link to="/explorar">Ir al inicio</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageMeta title={`Instalar ${BRAND.name} en tu celular`} description="Guía paso a paso para Android e iPhone" />
      <div className="mx-auto max-w-lg px-4 py-6 pb-24">
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">Instala Urabapp</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Guía visual paso a paso — como Temu, con dibujos en pantalla
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          {isIos ? (
            <PwaIosInstallWizard
              platform={detected}
              onClose={() => window.history.back()}
              onDismiss={() => window.history.back()}
            />
          ) : isAndroid ? (
            <PwaAndroidInstallWizard
              onClose={() => window.history.back()}
              onDismiss={() => window.history.back()}
              hasNativePrompt={Boolean(deferredPrompt)}
              onNativeInstall={async () => { await runNativeInstall(); }}
            />
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Abre esta página en tu celular (Chrome en Android o Safari en iPhone) para ver la guía animada.
              </p>
              <Button onClick={openSheet}>Abrir asistente</Button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          También desde el menú verde abajo a la izquierda → Instalar app
        </p>
      </div>
    </PageLayout>
  );
}
