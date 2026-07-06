import { getEnvConfig } from '../../../utils/env';
import { isSupabaseConfigured } from '../../../lib/supabase';
import {
  getLaunchModeLabel,
  isCashOnlyLaunch,
  isPaymentsReady,
  isWhatsAppDeferred,
  hasOperatorWhatsApp,
} from '../../../utils/launch';
import { PHASE_1_KPIS, PHASE_2_KPIS, PHASE_3_KPIS, PHASE_4_KPIS, PHASE_5_KPIS, PHASE_6_KPIS } from '../../../utils/constants';
import { getAppBaseUrl, copyToClipboard } from '../../../utils/app';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '../../../components/ui/Button';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { StatusBadge } from '@/design-system/patterns/MetricCard';
import { toast } from '../../../utils/toast';

const isDev = import.meta.env.DEV;

function getProductionUrl() {
  const configured = import.meta.env.VITE_APP_URL;
  if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return configured.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') return window.location.origin;
  return '';
}

const CHECKS = [
  { key: 'supabase', label: 'Supabase conectado', required: true, test: () => isSupabaseConfigured },
  {
    key: 'cash',
    label: isCashOnlyLaunch() ? 'Pagos en efectivo contra entrega' : 'Pagos digitales (Wompi)',
    required: true,
    test: () => isPaymentsReady(),
  },
  {
    key: 'appUrl',
    label: isDev ? 'URL local (VITE_APP_URL)' : 'URL pública (VITE_APP_URL)',
    required: true,
    test: () => {
      const url = import.meta.env.VITE_APP_URL;
      if (!url) return false;
      if (isDev) return url.includes('localhost') || url.includes('127.0.0.1');
      return !url.includes('localhost');
    },
  },
  {
    key: 'owner',
    label: 'Email admin (VITE_OWNER_EMAIL)',
    required: true,
    test: () => !!import.meta.env.VITE_OWNER_EMAIL,
  },
  {
    key: 'ogImage',
    label: 'Imagen OG para redes (1200×630)',
    required: true,
    test: () => true,
  },
  {
    key: 'whatsapp',
    label: isWhatsAppDeferred()
      ? 'WhatsApp API — planificado (fase 2)'
      : 'WhatsApp operador',
    required: false,
    test: () => (isWhatsAppDeferred() ? true : hasOperatorWhatsApp()),
  },
];

function phaseProgress(goals) {
  if (!goals.length) return 0;
  const total = goals.reduce((sum, g) => {
    if (!g.goal) return sum;
    return sum + Math.min(100, (g.current / g.goal) * 100);
  }, 0);
  return Math.round(total / goals.length);
}

function GoalGrid({ title, goals, highlight = false }) {
  return (
    <div className={highlight ? 'rounded-xl ring-2 ring-primary/30 p-1' : ''}>
      <p className={`text-caption mb-2 px-1 ${highlight ? 'font-semibold text-primary' : 'text-muted'}`}>{title}</p>
      <div className="grid grid-cols-2 gap-2">
        {goals.map((g) => {
          const pct = g.goal ? Math.min(100, Math.round((g.current / g.goal) * 100)) : 0;
          const done = g.goal ? g.current >= g.goal : false;
          return (
            <div key={g.label} className="rounded-xl bg-background p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted">{g.label}</p>
                {done && <AppIcon name="check" size="xs" className="text-primary" />}
              </div>
              <p className={`font-bold ${done ? 'text-primary' : 'text-secondary'}`}>
                {g.goal ? `${g.current} / ${g.goal}` : g.current}
              </p>
              {g.goal > 0 && (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LaunchChecklist({ kpis, onOpenTab }) {
  const { issues } = getEnvConfig();
  const checks = CHECKS.map((c) => ({ ...c, ok: c.test() }));
  const requiredChecks = checks.filter((c) => c.required !== false);
  const launchConfigPct = requiredChecks.length
    ? Math.round((requiredChecks.filter((c) => c.ok).length / requiredChecks.length) * 100)
    : 0;
  const allTech = launchConfigPct >= 100 && issues.length === 0;
  const appUrl = getAppBaseUrl();
  const ogPreviewUrl = `${appUrl.replace(/\/$/, '')}/og-image.png`;

  const phase1Goals = [
    { label: 'Comercios', current: kpis?.totalBusinesses ?? 0, goal: PHASE_1_KPIS.businesses },
    { label: 'Mensajeros', current: kpis?.totalDrivers ?? 0, goal: PHASE_1_KPIS.riders },
    { label: 'Pedidos', current: kpis?.totalOrders ?? 0, goal: PHASE_1_KPIS.orders },
    { label: 'Usuarios', current: kpis?.totalUsers ?? 0, goal: PHASE_1_KPIS.users },
  ];

  const phase2Goals = [
    { label: 'Comercios', current: kpis?.totalBusinesses ?? 0, goal: PHASE_2_KPIS.businesses },
    { label: 'Mensajeros', current: kpis?.totalDrivers ?? 0, goal: PHASE_2_KPIS.riders },
    { label: 'Usuarios', current: kpis?.totalUsers ?? 0, goal: PHASE_2_KPIS.users },
    { label: 'Pedidos', current: kpis?.totalOrders ?? 0, goal: PHASE_2_KPIS.orders },
  ];

  const phase3Goals = [
    { label: 'Pedidos', current: kpis?.totalOrders ?? 0, goal: PHASE_3_KPIS.orders },
    { label: 'Comercios activos', current: kpis?.activeBusinesses ?? 0, goal: PHASE_3_KPIS.activeBusinesses },
    { label: 'Recompra %', current: kpis?.repeatRate ?? 0, goal: PHASE_3_KPIS.repeatRate },
    { label: 'Ticket prom.', current: kpis?.avgTicket ?? kpis?.costPerOrder ?? 0, goal: 35000 },
  ];

  const phase4Goals = [
    { label: 'Pedidos/mes', current: kpis?.monthlyOrders ?? 0, goal: PHASE_4_KPIS.monthlyOrders },
    { label: 'Ingresos plataforma', current: kpis?.monthlyPlatformGross ?? 0, goal: PHASE_4_KPIS.monthlyPlatformGross },
    { label: 'Margen/mes', current: kpis?.monthlyMargin ?? 0, goal: PHASE_4_KPIS.monthlyMargin },
    { label: 'Margen/pedido', current: kpis?.monthlyOrders ? Math.round((kpis.monthlyMargin || 0) / kpis.monthlyOrders) : 0, goal: PHASE_4_KPIS.avgMarginPerOrder },
  ];

  const phase1Done = phase1Goals.every((g) => g.current >= g.goal);
  const phase2Done = phase2Goals.every((g) => g.current >= g.goal);
  const phase3Done = phase3Goals.every((g) => g.current >= g.goal);
  const phase4Done = phase4Goals.every((g) => g.current >= g.goal);
  const phase5Goals = [
    { label: 'Comercio Express', current: kpis?.expressBusinessesMonth ?? 0, goal: PHASE_5_KPIS.expressBusinesses },
    { label: 'Pedidos WhatsApp', current: kpis?.whatsappOrdersMonth ?? 0, goal: PHASE_5_KPIS.whatsappOrders },
    { label: 'Envíos intermuni.', current: kpis?.intermunicipalOrdersMonth ?? 0, goal: PHASE_5_KPIS.intermunicipalOrders },
    { label: 'Mensajeros', current: kpis?.totalDrivers ?? 0, goal: PHASE_5_KPIS.activeRiders },
  ];
  const phase5Done = phase5Goals.every((g) => g.current >= g.goal);
  const phase6Goals = [
    { label: 'Reseñas', current: kpis?.totalReviews ?? 0, goal: PHASE_6_KPIS.reviews },
    { label: 'GPS (mes)', current: kpis?.ordersWithGpsMonth ?? 0, goal: PHASE_6_KPIS.ordersWithGps },
    { label: 'Cupones activos', current: kpis?.activeCoupons ?? 0, goal: 1 },
    { label: 'Medios pago', current: isPaymentsReady() ? 1 : 0, goal: 1 },
  ];
  const phase6Done = phase6Goals.every((g) => g.current >= g.goal);
  const opsReady = isDev
    ? (kpis?.totalBusinesses ?? 0) >= PHASE_2_KPIS.businesses * 0.8
    : phase2Done;

  const activePhase = !allTech
    ? 0
    : phase6Done
      ? 6
      : phase5Done
        ? 6
        : phase4Done
          ? 5
          : phase3Done
            ? 4
            : phase2Done
              ? 3
              : phase1Done
                ? 2
                : 1;

  const phaseActions = {
    2: [
      { tab: 'envios', label: 'Envíos intermunicipales' },
      { tab: 'comercios', label: 'Revisar tiendas' },
      { tab: 'mensajeros', label: 'Mensajeros' },
    ],
    3: [
      { tab: 'marketing', label: 'Cupones' },
      { tab: 'pedidos', label: 'Pedidos' },
      { tab: 'comercios', label: 'Horarios tienda' },
    ],
    4: [
      { tab: 'ejecutivo', label: 'Economía' },
      { tab: 'pedidos', label: 'Pedidos del mes' },
    ],
    5: [
      { tab: 'integraciones', label: 'WhatsApp / Express' },
      { tab: 'envios', label: 'Envíos' },
      { tab: 'retiros', label: 'Bonos mensajeros' },
    ],
    6: [
      { tab: 'integraciones', label: 'Wompi / pagos' },
      { tab: 'marketing', label: 'Cupones' },
    ],
  };

  const launchTitle = allTech
    ? (phase6Done
      ? 'Fase 6 completa'
      : phase5Done
        ? 'Fase 6 en curso'
        : phase4Done
          ? 'Fase 5 en curso'
          : phase3Done
            ? 'Fase 4 en curso'
            : phase2Done
              ? 'Fase 3 en curso'
              : phase1Done
                ? 'Fase 2 en curso'
                : 'Lanzamiento MVP listo — expandir operación')
    : 'Completar configuración';

  const handleCopyUrl = async () => {
    const ok = await copyToClipboard(isDev ? appUrl : (getProductionUrl() || appUrl));
    toast(ok ? 'Link copiado' : 'No se pudo copiar', ok ? 'success' : 'error');
  };

  return (
    <SurfaceCard className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-tagline text-muted">Lanzamiento</p>
          <SectionTitle>{launchTitle}</SectionTitle>
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge status={allTech ? 'success' : 'warning'}>
            {allTech ? 'Infra lista' : 'Config pendiente'}
          </StatusBadge>
          <StatusBadge status={launchConfigPct >= 100 ? 'success' : 'muted'}>
            Progreso · {launchConfigPct}%
          </StatusBadge>
          {allTech && activePhase > 0 && (
            <StatusBadge status="success">Fase {activePhase} activa</StatusBadge>
          )}
          {allTech && (
            <StatusBadge status="muted">{getLaunchModeLabel()}</StatusBadge>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <div>
          <p className="text-caption mb-2 text-muted">Infraestructura</p>
          <ul className="space-y-1">
            {checks.map((c) => (
              <li key={c.key} className="flex items-center gap-2 text-sm">
                <AppIcon name={c.ok ? 'checkboxOn' : 'checkboxOff'} size="xs" />
                <span className={c.ok ? 'text-foreground' : 'text-muted'}>
                  {c.label}
                  {c.required === false && (
                    <span className="ml-1 text-[10px] font-semibold text-muted-foreground">(opcional)</span>
                  )}
                </span>
              </li>
            ))}
            {issues.map((issue) => (
              <li key={issue} className="flex items-center gap-2 text-sm text-destructive">
                <AppIcon name="alert" size="xs" />
                {issue}
              </li>
            ))}
          </ul>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-background p-2">
          <p className="text-caption mb-2 px-1 text-muted">Vista previa OG</p>
          <img
            src="/og-image.png"
            alt="Urabapp — imagen para compartir en redes"
            className="w-full max-w-[200px] rounded-lg"
          />
          <a
            href={ogPreviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-center text-xs font-semibold text-primary hover:underline"
          >
            Abrir imagen
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyUrl}>
          Copiar link app
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={isDev ? '/search' : (getProductionUrl() ? `${getProductionUrl()}/search` : '/search')} target="_blank" rel="noopener noreferrer">
            Abrir PWA
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={getProductionUrl() || '/'} target="_blank" rel="noopener noreferrer">
            Sitio producción
          </a>
        </Button>
      </div>

      <GoalGrid
        title={`Fase 1${phase1Done ? ' — listo' : ` — operación ${phaseProgress(phase1Goals)}%`}`}
        goals={phase1Goals}
        highlight={activePhase === 1}
      />
      <GoalGrid
        title={`Fase 2 — expansión por zonas${phase2Done ? ' — listo' : ` · ${phaseProgress(phase2Goals)}%`}`}
        goals={phase2Goals}
        highlight={activePhase === 2}
      />
      <GoalGrid
        title={`Fase 3 — producto mínimo real${phase3Done ? ' — listo' : ` · ${phaseProgress(phase3Goals)}%`}`}
        goals={phase3Goals}
        highlight={activePhase === 3}
      />
      <GoalGrid
        title={`Fase 4 — modelo económico${phase4Done ? ' — listo' : ` · ${phaseProgress(phase4Goals)}%`}`}
        goals={phase4Goals}
        highlight={activePhase === 4}
      />
      <GoalGrid
        title={`Fase 5 — diferenciadores${phase5Done ? ' — listo' : ` · ${phaseProgress(phase5Goals)}%`}`}
        goals={phase5Goals}
        highlight={activePhase === 5}
      />
      <GoalGrid
        title={`Fase 6 — post-MVP${phase6Done ? ' — listo' : ` · ${phaseProgress(phase6Goals)}%`}`}
        goals={phase6Goals}
        highlight={activePhase === 6}
      />

      {allTech && activePhase > 0 && phaseActions[activePhase]?.length > 0 && onOpenTab && (
        <div className="flex flex-wrap gap-2">
          <p className="w-full text-caption text-muted">Acciones fase {activePhase}</p>
          {phaseActions[activePhase].map((action) => (
            <Button key={action.tab} variant="outline" size="sm" onClick={() => onOpenTab(action.tab)}>
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {!allTech && (
        <p className="text-xs text-muted">
          Obligatorio: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_APP_URL, VITE_OWNER_EMAIL.
          {' '}
          MVP: VITE_WOMPI_ENABLED=false y VITE_WHATSAPP_API_ENABLED=false (efectivo, sin WhatsApp API).
        </p>
      )}
      {allTech && isCashOnlyLaunch() && (
        <p className="text-xs text-primary">
          Pagos activos en efectivo contra entrega. Wompi y WhatsApp API quedan para una fase posterior.
        </p>
      )}
      {allTech && !opsReady && (
        <p className="text-xs text-muted">
          Fase 2: meta {PHASE_2_KPIS.businesses} comercios, {PHASE_2_KPIS.riders} mensajeros, envíos en /envios
        </p>
      )}
      {allTech && opsReady && !phase3Done && (
        <p className="text-xs text-muted">
          Fase 3: cupones en checkout, notificaciones de pedido, horarios de tienda, cancelación por cliente
        </p>
      )}
      {allTech && phase3Done && !phase4Done && (
        <p className="text-xs text-muted">
          Fase 4: comisión {PHASE_4_KPIS.commissionPct}% · meta {PHASE_4_KPIS.monthlyOrders} pedidos/mes · margen ~{PHASE_4_KPIS.avgMarginPerOrder.toLocaleString('es-CO')}/pedido
        </p>
      )}
      {allTech && phase4Done && !phase5Done && (
        <p className="text-xs text-muted">
          Fase 5: Comercio Express, funnel WhatsApp, envíos intermunicipales, ranking mensajeros con bonos
        </p>
      )}
      {allTech && phase5Done && !phase6Done && (
        <p className="text-xs text-muted">
          Fase 6: reseñas, GPS, pagos digitales (Wompi) y tracking en vivo cuando actives esas integraciones
        </p>
      )}
    </SurfaceCard>
  );
}
