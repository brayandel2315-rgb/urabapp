import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';
import { useAuthStore } from '@/store/authStore';
import { COMM_CATEGORY_LABELS } from '@/communication';
import {
  getCommunicationPreferences,
  upsertCommunicationPreferences,
} from '@/communication/preferences.service';
import { emitCommEvent } from '@/communication';
import { toast } from '@/utils/toast';

const PREF_CATEGORIES = [
  'orders', 'messages', 'payments', 'promotions', 'support', 'security', 'marketing',
];

const CHANNEL_LABELS = { push: 'Push', in_app: 'En app', email: 'Email' };

export default function CommunicationPreferencesPanel() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState({});
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [quietStart, setQuietStart] = useState('');
  const [quietEnd, setQuietEnd] = useState('');

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['comm-prefs', user?.id],
    queryFn: () => getCommunicationPreferences(user.id),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!prefs) return;
    setCategories(prefs.categories || {});
    setMarketingEnabled(Boolean(prefs.marketing_enabled));
    setDailyDigest(Boolean(prefs.daily_digest_enabled));
    setQuietStart(prefs.quiet_hours_start?.slice(0, 5) || '');
    setQuietEnd(prefs.quiet_hours_end?.slice(0, 5) || '');
  }, [prefs]);

  const saveMutation = useMutation({
    mutationFn: () => upsertCommunicationPreferences(user.id, {
      categories,
      marketing_enabled: marketingEnabled,
      daily_digest_enabled: dailyDigest,
      quiet_hours_start: quietStart || null,
      quiet_hours_end: quietEnd || null,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comm-prefs'] });
      toast('Preferencias de comunicación guardadas');
      emitCommEvent('consent_preferences_changed', {
        recipientId: user.id,
        actorId: user.id,
        payload: {
          marketing_enabled: marketingEnabled,
          daily_digest_enabled: dailyDigest,
          categories,
        },
        push: false,
      }).catch(() => {});
    },
    onError: (err) => toast(err.message, 'error'),
  });

  const toggleChannel = (catId, channel) => {
    setCategories((prev) => ({
      ...prev,
      [catId]: {
        ...(prev[catId] || { push: true, in_app: true, email: false }),
        [channel]: !(prev[catId]?.[channel] !== false),
      },
    }));
  };

  if (!user) return null;

  return (
    <SurfaceCard className="space-y-4 p-5">
      <SectionTitle>Preferencias por categoría</SectionTitle>
      <p className="text-sm text-muted-foreground">
        Controla cómo te llegan pedidos, mensajes, pagos y promociones.
      </p>

      {isLoading ? (
        <Loader variant="section" message="Cargando preferencias…" className="min-h-[8rem]" />
      ) : (
        <div className="space-y-4">
          {PREF_CATEGORIES.map((catId) => (
            <div key={catId} className="rounded-xl border border-border p-3">
              <p className="mb-2 text-sm font-semibold">{COMM_CATEGORY_LABELS[catId] || catId}</p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(CHANNEL_LABELS).map(([ch, label]) => (
                  <label key={ch} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={categories[catId]?.[ch] !== false}
                      onChange={() => toggleChannel(catId, ch)}
                      className="h-4 w-4 rounded border-border"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <label className="flex items-center justify-between text-sm">
            <span>Resumen diario por email</span>
            <input
              type="checkbox"
              checked={dailyDigest}
              onChange={(e) => setDailyDigest(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
          </label>
          <p className="text-xs text-muted-foreground -mt-2">
            Recibe un email con tus notificaciones pendientes de las últimas 24 horas.
          </p>

          <label className="flex items-center justify-between text-sm">
            <span>Recibir marketing y ofertas</span>
            <input
              type="checkbox"
              checked={marketingEnabled}
              onChange={(e) => setMarketingEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Horario silencioso — desde</span>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3"
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Hasta</span>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3"
              />
            </label>
          </div>

          <Button
            onClick={() => saveMutation.mutate()}
            loading={saveMutation.isPending}
            className="w-full sm:w-auto"
          >
            Guardar preferencias
          </Button>
        </div>
      )}
    </SurfaceCard>
  );
}
