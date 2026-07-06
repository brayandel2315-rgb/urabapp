import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { usePwaInstallStore } from '@/store/pwaInstallStore';
import { detectInstallPlatform, isStandaloneMode } from '@/pwa/install-detect';

/** Sección en Cuenta → Preferencias */
export default function PwaInstallPanel() {
  const triggerInstall = usePwaInstallStore((s) => s.triggerInstall);
  const platform = usePwaInstallStore((s) => s.platform);
  const deferredPrompt = usePwaInstallStore((s) => s.deferredPrompt);
  const installed = platform === 'installed' || isStandaloneMode();

  if (installed) {
    return (
      <SurfaceCard className="space-y-2 p-5">
        <SectionTitle>App instalada</SectionTitle>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <AppIcon name="check" size="sm" className="text-primary" />
          Urabapp está en tu pantalla de inicio o escritorio.
        </p>
      </SurfaceCard>
    );
  }

  const canOneTap = Boolean(deferredPrompt);
  const detected = detectInstallPlatform();

  return (
    <SurfaceCard className="space-y-4 p-5">
      <SectionTitle>Instalar Urabapp</SectionTitle>
      <p className="text-sm text-muted-foreground">
        {canOneTap
          ? 'Un toque y queda el icono en tu dispositivo — pedidos y tracking más rápidos.'
          : detected === 'ios' || detected === 'ios-other'
            ? 'Te guiamos paso a paso en Safari — quedará con el icono de Urabapp.'
            : 'Crea un acceso directo con el logo de Urabapp en tu inicio o escritorio.'}
      </p>
      <Button
        className="w-full sm:w-auto"
        onClick={() => triggerInstall()}
      >
        <AppIcon name="download" size="sm" className="mr-2" />
        {canOneTap ? 'Instalar ahora' : detected === 'ios' || detected === 'ios-other' ? 'Guía paso a paso' : 'Ver cómo instalar'}
      </Button>
    </SurfaceCard>
  );
}
