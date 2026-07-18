import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import BrandLogo from '@/components/brand/BrandLogo';
import Loader from '../components/ui/Loader';
import LaunchChecklist from '../modules/admin/components/LaunchChecklist';
import { useAuthStore } from '../store/authStore';
import { getProjectStatus } from '../services/project.service';
import { getEnvConfig } from '../utils/env';
import { isSupabaseConfigured } from '../lib/supabase';
import { BRAND, ROLES } from '../utils/constants';
import { formatCOP } from '../utils/currency';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { MetricCard, MetricGrid } from '@/design-system/patterns/MetricCard';
import { buildLoginRedirect } from '@/utils/auth-routes';

const PHASES = [
  { id: 0, name: 'Posicionamiento', status: 'done', items: ['Landing', 'Tagline', 'Verticales UI'] },
  { id: 1, name: 'Validación', status: 'done', items: ['Catálogo', 'Checkout', 'Paneles', 'WhatsApp'] },
  { id: 2, name: 'Zonas Apartadó', status: 'done', items: ['50 comercios', 'Envíos', 'Direcciones'] },
  { id: 3, name: 'Producto mínimo', status: 'done', items: ['Cupones', 'Notificaciones', 'Horarios tienda'] },
  { id: 4, name: 'Modelo económico', status: 'done', items: ['Comisiones', 'Márgenes', 'KPIs admin'] },
  { id: 5, name: 'Diferenciadores', status: 'done', items: ['Comercio Express', 'Ranking riders', 'Funnel WA'] },
  { id: 6, name: 'Post-MVP', status: 'progress', items: ['Reseñas', 'GPS + mapas', 'Wompi + push', 'CRM + realtime'] },
];

const FEATURES = [
  { name: 'PWA + deploy Vercel', status: 'done' },
  { name: 'Supabase + migraciones 001–025', status: 'done' },
  { name: 'Login Google / email / invitado', status: 'done' },
  { name: '50 comercios activos', status: 'done' },
  { name: 'Envíos intermunicipales', status: 'done' },
  { name: 'Panel admin con KPIs', status: 'done' },
  { name: 'Cupones + reseñas', status: 'done' },
  { name: 'GPS en checkout', status: 'done' },
  { name: 'Analytics + embudo BD', status: 'done' },
  { name: 'CRM recuperación carritos', status: 'done' },
  { name: 'Pagos Wompi', status: 'progress' },
  { name: 'SMS / Twilio', status: 'pending' },
];

function StatusPill({ status }) {
  if (status === 'done') {
    return <span className="rounded-full bg-primary-light px-2 py-0.5 text-xs font-semibold text-primary-dark">Listo</span>;
  }
  if (status === 'progress') {
    return <span className="rounded-full bg-accent/25 px-2 py-0.5 text-xs font-semibold text-secondary">En curso</span>;
  }
  return <span className="rounded-full bg-border px-2 py-0.5 text-xs font-semibold text-muted">Pendiente</span>;
}

export default function Informe() {
  const { user, profile } = useAuthStore();
  const { issues } = getEnvConfig();
  const isAdmin = profile?.role === ROLES.ADMIN;

  const { data: status, isLoading, isError } = useQuery({
    queryKey: ['project-status', profile?.role],
    queryFn: () => getProjectStatus(profile?.role),
    refetchInterval: 60000,
  });

  const deployUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  const isProd = import.meta.env.PROD;

  return (
    <div className="min-h-screen bg-background pb-16 font-sans">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm font-semibold text-primary">← {BRAND.name}</Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="text-sm font-semibold text-secondary">Admin →</Link>
            )}
            <BrandLogo variant="compact" alt="" className="h-8" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        <div className="rounded-3xl on-media bg-secondary p-6">
          <p className="text-tagline text-sky">Estado del proyecto</p>
          <h1 className="text-heading mt-1 text-2xl text-white">¿Cómo va Urabapp?</h1>
          <p className="mt-3 text-sm opacity-90">
            Resumen en vivo de fases, métricas y checklist de lanzamiento.
            {isProd && ' Disponible en producción.'}
          </p>
          <p className="mt-2 text-xs text-white/70">
            Deploy: {deployUrl}
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="rounded-2xl border border-accent bg-accent/15 p-4 text-sm text-secondary">
            Supabase no configurado — métricas limitadas.
          </div>
        )}

        {issues.length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {issues.map((i) => <p key={i}>⚠️ {i}</p>)}
          </div>
        )}

        {isLoading ? (
          <Loader variant="page" message="Cargando informe…" />
        ) : isError ? (
          <SurfaceCard className="text-center text-sm text-muted">
            No se pudieron cargar todas las métricas.
            {!user && (
              <p className="mt-2">
                <Link to={buildLoginRedirect('/informe')} className="font-semibold text-primary">Entra como admin</Link>
                {' '}para ver KPIs completos.
              </p>
            )}
          </SurfaceCard>
        ) : (
          <>
            <MetricGrid>
              {[
                { label: 'Comercios', value: status?.totalBusinesses ?? '—' },
                { label: 'Productos', value: status?.totalProducts ?? '—' },
                { label: 'Pedidos', value: status?.isFull ? status.totalOrders : null, locked: !status?.isFull },
                { label: 'Usuarios', value: status?.isFull ? status.totalUsers : null, locked: !status?.isFull },
              ].map((s) => (
                <MetricCard
                  key={s.label}
                  label={s.label}
                  value={s.locked ? <AppIcon name="lock" size="md" className="mx-auto" /> : s.value}
                  accent={!s.locked}
                />
              ))}
            </MetricGrid>

            {status?.isFull && (
              <MetricGrid className="grid-cols-2">
                <MetricCard label="Pedidos este mes" value={status.monthlyOrders ?? 0} icon="package" />
                <MetricCard label="Margen plataforma (mes)" value={formatCOP(status.monthlyMargin ?? 0)} icon="money" />
                <MetricCard label="Reseñas" value={status.totalReviews ?? 0} icon="star" />
                <MetricCard label="Recompra" value={`${status.repeatRate ?? 0}%`} icon="chart" />
              </MetricGrid>
            )}

            {!status?.isFull && (
              <SurfaceCard className="text-sm text-muted">
                <p>
                  Métricas de pedidos y operación visibles solo para <strong>ADMIN</strong>.
                </p>
                {!user ? (
                  <Link to={buildLoginRedirect('/informe')} className="mt-2 inline-block font-semibold text-primary">
                    Entrar como administrador →
                  </Link>
                ) : (
                  <p className="mt-2">Tu rol actual: {profile?.role || 'CLIENT'}</p>
                )}
              </SurfaceCard>
            )}
          </>
        )}

        {status?.isFull && <LaunchChecklist kpis={status} />}

        <section className="space-y-3">
          <SectionTitle>Roadmap por fases</SectionTitle>
          {PHASES.map((phase) => (
            <SurfaceCard key={phase.id}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-secondary">Fase {phase.id} — {phase.name}</h3>
                <StatusPill status={phase.status} />
              </div>
              <p className="mt-2 text-xs text-muted">{phase.items.join(' · ')}</p>
            </SurfaceCard>
          ))}
        </section>

        <section className="space-y-2">
          <SectionTitle>Funcionalidades</SectionTitle>
          {FEATURES.map((f) => (
            <SurfaceCard key={f.name} className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-secondary">{f.name}</span>
              <StatusPill status={f.status === 'done' ? 'done' : 'pending'} />
            </SurfaceCard>
          ))}
        </section>

        <SurfaceCard className="space-y-2 text-sm">
          <SectionTitle>Próximos pasos</SectionTitle>
          <ul className="list-inside list-disc space-y-1 text-muted">
            <li>Configurar Supabase Auth con URL de producción</li>
            <li>WhatsApp real en variables Vercel</li>
            <li>Operación: primeros 100 pedidos reales (Fase 1)</li>
            <li>Wompi cuando quieras pagos digitales</li>
          </ul>
        </SurfaceCard>
      </main>
    </div>
  );
}
