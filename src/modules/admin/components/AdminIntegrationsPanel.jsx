import { getEnvConfig } from '../../../utils/env';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { isWompiEnabled } from '../../../services/wompi.service';
import { isMapsEnabled, isRoutingEnabled } from '../../../services/map.service';
import { isSocketEnabled } from '../../../services/socket.service';
import { isPushSupported, getVapidPublicKey } from '../../../services/push.service';
import { isWhatsAppApiEnabled } from '../../../services/whatsapp-api.service';
import { copyToClipboard } from '../../../utils/app';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '../../../components/ui/Button';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { StatusBadge } from '@/design-system/patterns/MetricCard';
import { toast } from '../../../utils/toast';

const INTEGRATIONS = [
  {
    id: 'maps',
    title: 'OpenFreeMap + MapLibre',
    subtitle: 'Mapas vectoriales gratis · Photon para direcciones · Nominatim geocoding',
    icon: 'map',
    enabled: () => isMapsEnabled(),
    env: [],
    secrets: [],
    steps: [
      'OpenFreeMap: tiles vectoriales sin API key',
      'Photon (Komoot): autocompletado de direcciones en checkout y envíos',
      'Edge geocode-proxy: reverse geocode sin CORS',
      'Mapas en home, tracking, mandados y domiciliario',
    ],
  },
  {
    id: 'routing',
    title: 'OpenRouteService — rutas y ETA',
    subtitle: 'Direcciones reales gratis vía Edge Function',
    icon: 'mensajeria',
    enabled: () => isRoutingEnabled() && isSupabaseConfigured,
    env: ['VITE_ORS_ENABLED=true'],
    secrets: ['ORS_API_KEY'],
    steps: [
      'Crea API key gratis en openrouteservice.org (plan estándar)',
      'Supabase secret: supabase secrets set ORS_API_KEY=tu_clave',
      'Deploy: npx supabase functions deploy openroute-directions --project-ref ekqaocauvoajpjyraeyo',
      'Rutas reales + ETA con rango en pedidos, mandados, envíos y panel mensajero',
      'Sin ORS: ETA estimada por calles (Haversine × factor vial) — no solo línea recta',
      'Seguridad: auth JWT, bbox Colombia, máx. 180 km, timeout 9 s',
    ],
  },
  {
    id: 'socket',
    title: 'Socket.IO — tracking en tiempo real',
    subtitle: 'Posición del mensajero vía WebSocket (fallback: Supabase Realtime)',
    icon: 'phone',
    enabled: () => isSocketEnabled(),
    env: ['VITE_SOCKET_URL'],
    secrets: [],
    steps: [
      'Local: npm run dev:socket (puerto 3001) + proxy Vite',
      'Producción: desplegar server/socket-server.mjs en Railway/Fly/Render',
      'VITE_SOCKET_URL=https://tu-socket.ejemplo.com en Vercel',
      'Sin socket: useDriverLocationRealtime usa Supabase Realtime',
    ],
  },
  {
    id: 'push',
    title: 'Push (VAPID + Edge Function)',
    subtitle: 'Notificaciones al cliente y mensajero en cada cambio de estado',
    icon: 'bell',
    enabled: () => Boolean(getVapidPublicKey()),
    env: ['VITE_VAPID_PUBLIC_KEY'],
    secrets: ['VAPID_PUBLIC_KEY', 'VAPID_PRIVATE_KEY', 'VAPID_SUBJECT'],
    steps: [
      'Genera claves: npx web-push generate-vapid-keys',
      'Cliente: VITE_VAPID_PUBLIC_KEY · Secrets Edge: VAPID_*',
      'Solo process-comm-retries (~5 min) procesa cola push tracking y demás canales',
      'dispatch-tracking-push es alias compat → process-comm-retries',
      'Admin → Tracking: botón "Procesar cola" o cron con service role',
      'Usuario activa push en Perfil → Notificaciones',
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp Business API',
    subtitle: 'Confirmaciones automáticas (no solo wa.me manual)',
    icon: 'whatsapp',
    enabled: () => isWhatsAppApiEnabled(),
    env: ['VITE_WHATSAPP_API_ENABLED=true', 'VITE_WHATSAPP_NUMBER'],
    secrets: ['WHATSAPP_API_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'],
    steps: [
      'Meta Business → WhatsApp Cloud API',
      'Plantillas: order_confirmed, order_on_the_way, order_delivered',
      'Secrets en Supabase + despliega send-whatsapp',
      'VITE_WHATSAPP_API_ENABLED=true en cliente',
    ],
  },
  {
    id: 'assignment',
    title: 'Motor de asignación',
    subtitle: 'Ofertas + aceptación — el mensajero que acepta recoge y entrega',
    icon: 'mensajeria',
    enabled: () => isSupabaseConfigured,
    env: [],
    secrets: [],
    steps: [
      'Migración 060: publish_courier_offers unificado (comida + mandado + courier)',
      'Despacho automático al marcar "En preparación" (tienda)',
      'Edge Function auto-assign-rider (fallback admin)',
      'Admin: "Buscar mensajero" publica ofertas a cercanos',
      'Cliente: mapa en vivo cuando el mensajero acepta y comparte GPS',
    ],
  },
  {
    id: 'pwa',
    title: 'App instalable (PWA)',
    subtitle: 'Instalación en un toque · Android, iPhone (Safari) y escritorio',
    icon: 'phone',
    enabled: () => typeof window !== 'undefined' && ('serviceWorker' in navigator),
    env: ['VITE_APP_URL'],
    secrets: [],
    steps: [
      'Manifest + iconos maskable (logo Urabapp en inicio/escritorio)',
      'Android/PC: botón «Instalar app» → un toque (beforeinstallprompt)',
      'iPhone: guía visual Safari «Agregar a inicio»',
      'FAB flotante mientras navegas + Cuenta → Preferencias → Instalar',
      'Push vía push-sw.js en el service worker · actualización auto en deploy',
      'Roadmap: Expo/React Native compartiendo services/',
    ],
  },
  {
    id: 'wompi',
    title: 'Pagos Wompi',
    subtitle: 'Checkout digital + asignación tras pago confirmado',
    icon: 'money',
    enabled: () => isWompiEnabled(),
    env: ['VITE_WOMPI_ENABLED', 'VITE_WOMPI_PUBLIC_KEY'],
    secrets: ['WOMPI_PRIVATE_KEY', 'WOMPI_ENV'],
    steps: [
      'Claves en Wompi dashboard',
      'Edge: create-wompi-checkout + wompi-webhook',
      'Tras pago: la tienda confirma; mandado publica ofertas a mensajeros',
    ],
  },
];

function IntegrationCard({ item }) {
  const active = item.enabled();

  const copyEnv = () => {
    const text = item.env.filter(Boolean).join('\n');
    copyToClipboard(text || item.id).then((ok) => {
      toast(ok ? 'Variables copiadas' : 'No se pudo copiar', ok ? 'info' : 'error');
    });
  };

  return (
    <SurfaceCard className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light">
            <AppIcon name={item.icon} size="md" className="text-primary" />
          </span>
          <div>
            <p className="font-display font-bold text-foreground">{item.title}</p>
            <p className="text-sm text-muted">{item.subtitle}</p>
          </div>
        </div>
        <StatusBadge status={active ? 'success' : 'muted'}>
          {active ? 'Activo' : 'Pendiente'}
        </StatusBadge>
      </div>

      <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
        {item.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      {(item.env.length > 0 || item.secrets.length > 0) && (
        <div className="rounded-xl bg-background p-3 text-xs">
          {item.env.length > 0 && (
            <p><span className="font-semibold text-foreground">Cliente:</span> {item.env.join(' · ')}</p>
          )}
          {item.secrets.length > 0 && (
            <p className="mt-1"><span className="font-semibold text-foreground">Supabase secrets:</span> {item.secrets.join(' · ')}</p>
          )}
        </div>
      )}

      {item.env.length > 0 && (
        <Button size="sm" variant="outline" onClick={copyEnv}>
          Copiar variables
        </Button>
      )}
    </SurfaceCard>
  );
}

export default function AdminIntegrationsPanel() {
  const env = getEnvConfig();
  const activeCount = INTEGRATIONS.filter((i) => i.enabled()).length;
  const pct = Math.round((activeCount / INTEGRATIONS.length) * 100);

  return (
    <div className="space-y-4">
      <SurfaceCard>
        <SectionTitle>Integraciones de plataforma</SectionTitle>
        <p className="mt-1 text-sm text-muted">
          OpenFreeMap, Photon, OpenRouteService, Socket.IO, push, asignación y PWA. Ver INTEGRATIONS.md.
        </p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-semibold text-foreground">{activeCount} / {INTEGRATIONS.length} activas</span>
            <span className="text-primary">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-border">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {!env.isConfigured && env.issues.length > 0 && (
          <ul className="mt-3 space-y-1 text-sm text-amber-700 dark:text-amber-400">
            {env.issues.map((issue) => (
              <li key={issue}>· {issue}</li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">
          Push: {isPushSupported() ? 'soportado' : 'no'} ·
          Mapas: {isMapsEnabled() ? 'OpenFreeMap + Photon' : 'off'} ·
          Rutas: {isRoutingEnabled() ? 'ORS' : 'línea recta'} ·
          Socket: {isSocketEnabled() ? 'conectado' : 'Realtime fallback'} ·
          WA API: {isWhatsAppApiEnabled() ? 'on' : 'off'}
        </p>
      </SurfaceCard>

      <div className="grid gap-4 lg:grid-cols-2">
        {INTEGRATIONS.map((item) => (
          <IntegrationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
