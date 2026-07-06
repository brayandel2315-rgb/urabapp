import { useState } from 'react';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import FormSelect from '@/design-system/patterns/FormSelect';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';
import { useSettingsStore, LANGUAGES, CURRENCIES } from '@/store/settingsStore';
import { syncLocalPrefsToServer } from '@/communication/preferences.service';
import { useAuthStore } from '@/store/authStore';
import { useLocationStore, selectHomeMunicipio } from '@/store/locationStore';
import { useAutoLocation } from '@/hooks/useAutoLocation';
import { useOnboardingStore } from '@/store/onboardingStore';
import PushNotificationsPanel from '../components/PushNotificationsPanel';
import PwaInstallPanel from '@/components/pwa/PwaInstallPanel';
import { toast } from '@/utils/toast';

export default function AccountPreferencesPage() {
  const { user } = useAuthStore();
  const { language, currency, notifications, setLanguage, setCurrency, setNotificationPref } = useSettingsStore();
  const homeMunicipio = useLocationStore(selectHomeMunicipio);
  const locationStatus = useLocationStore((s) => s.locationStatus);
  const { detect } = useAutoLocation({ auto: false });
  const resetOnboarding = useOnboardingStore((s) => s.reset);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(true);
    if (user?.id) {
      await syncLocalPrefsToServer(user.id).catch(() => {});
    }
    toast('Preferencias guardadas');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Idioma y moneda</SectionTitle>
        <FormSelect
          label="Idioma"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          options={LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
        />
        <FormSelect
          label="Moneda"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          options={CURRENCIES.map((c) => ({ value: c.id, label: c.label }))}
        />
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Notificaciones</SectionTitle>
        {Object.entries(notifications).map(([key, value]) => (
          <label key={key} className="flex items-center justify-between text-sm">
            <span className="capitalize">{key.replace('_', ' ')}</span>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => setNotificationPref(key, e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
          </label>
        ))}
      </SurfaceCard>

      <PushNotificationsPanel />

      <PwaInstallPanel />

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Ubicación</SectionTitle>
        <p className="text-sm text-muted-foreground">
          UrabApp detecta tu zona automáticamente por GPS. Zona actual: <strong>{homeMunicipio}</strong>
        </p>
        <Button variant="outline" size="sm" onClick={() => detect()} disabled={locationStatus === 'pending'}>
          {locationStatus === 'pending' ? 'Detectando…' : 'Actualizar ubicación'}
        </Button>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 p-5">
        <SectionTitle>Tutorial</SectionTitle>
        <p className="text-sm text-muted-foreground">
          Vuelve a ver la guía de bienvenida con ubicación, búsqueda y pedidos.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            resetOnboarding();
            toast('Tutorial activado — ve al inicio para verlo');
          }}
        >
          Ver tutorial de nuevo
        </Button>
      </SurfaceCard>

      <SurfaceCard className="flex items-center justify-between p-5">
        <div>
          <p className="font-semibold">Tema visual</p>
          <p className="text-sm text-muted-foreground">Modo claro u oscuro</p>
        </div>
        <ThemeToggle />
      </SurfaceCard>

      <Button onClick={handleSave} disabled={saved}>{saved ? 'Guardado' : 'Guardar preferencias'}</Button>
    </div>
  );
}
