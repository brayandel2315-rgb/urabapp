import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '@/design-system/layouts/PageLayout';
import Button from '@/components/ui/Button';
import CatalogImage from '@/components/ui/CatalogImage';
import CategoryBadge from '@/components/marketplace/CategoryBadge';
import AppIcon from '@/design-system/icons/AppIcon';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  ONBOARDING_PREVIEW_DISCLAIMER,
  ONBOARDING_PREVIEW_STORES,
} from '@/utils/onboarding-preview';
import { resolveBusinessCover } from '@/utils/catalog-images';
import { iconForCategory } from '@/design-system/icons/icon-map';
import { DEMO_ACCOUNTS } from '@/config/demo-accounts';
import { cn } from '@/lib/utils';

const DEMO_ROLES = [
  { role: 'Administrador', note: 'Dueño / cuenta tienda demo' },
  { role: 'Manager', note: 'Roadmap — permisos de equipo' },
  { role: 'Cajero', note: 'Roadmap — POS en local' },
  { role: 'Cocina', note: 'Roadmap — cola de preparación' },
  { role: 'Despachador', note: 'Roadmap — listo para mensajero' },
  { role: 'Soporte', note: 'Roadmap — chat con cliente' },
  { role: 'Marketing', note: 'Roadmap — cupones y promos' },
  { role: 'Jefe de mensajeros', note: 'Roadmap — asignación flota' },
];

async function fetchPreviewBusinesses() {
  if (!isSupabaseConfigured) {
    return ONBOARDING_PREVIEW_STORES.map((s) => ({
      ...s,
      rating: 4.5,
      cover_url: null,
      logo_url: null,
      is_published: true,
      is_active: true,
    }));
  }
  const slugs = ONBOARDING_PREVIEW_STORES.map((s) => s.slug);
  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, slug, municipio, category, rating, cover_url, logo_url, emoji, is_published, is_active, zone')
    .in('slug', slugs);
  if (error) throw error;
  const bySlug = Object.fromEntries((data || []).map((b) => [b.slug, b]));
  return ONBOARDING_PREVIEW_STORES.map((meta) => ({
    ...meta,
    ...(bySlug[meta.slug] || {}),
    name: (bySlug[meta.slug]?.name || meta.name).replace(/\s*·\s*Preview UrabApp\s*$/i, ''),
  }));
}

/**
 * Índice de ventas: vitrinas preview para mostrar al comercio en reunión.
 */
export default function OnboardingVitrinasPage() {
  const { data: stores = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['onboarding-vitrinas'],
    queryFn: fetchPreviewBusinesses,
    staleTime: 60_000,
  });

  const tiendaDemo = DEMO_ACCOUNTS.find((a) => a.id === 'business');

  return (
    <PageLayout title="Vitrinas onboarding" backTo="/" maxWidth="lg">
      <div className="space-y-5 pb-8">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            Equipo de lanzamiento · Urabá
          </p>
          <h1 className="font-display text-2xl font-black leading-tight text-foreground sm:text-3xl">
            Muéstrale al dueño su tienda ya armada
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Previews listos para reunión de venta. El comercio ve cómo se vería en el celular
            de sus clientes y puede activar cuando apruebe logo, menú y horarios.
          </p>
        </header>

        <aside className="rounded-2xl border border-primary/25 bg-primary/8 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
          {ONBOARDING_PREVIEW_DISCLAIMER}
        </aside>

        {isLoading ? (
          <div className="space-y-3" aria-busy="true" aria-label="Cargando vitrinas">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : null}

        {isError ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
            <p className="font-semibold text-foreground">No pudimos cargar las vitrinas</p>
            <Button type="button" size="sm" className="mt-2" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : null}

        <ul className="space-y-3" aria-label="Lista de vitrinas preview">
          {stores.map((store) => {
            const cover = resolveBusinessCover(store);
            const icon = iconForCategory(store.category);
            const live = store.is_published !== false && store.is_active !== false;
            return (
              <li key={store.slug}>
                <Link
                  to={`/tienda/${store.slug}`}
                  className={cn(
                    'flex gap-3 overflow-hidden rounded-2xl border border-border bg-card p-2.5 shadow-soft transition-colors',
                    'active:bg-muted/40 hover:border-primary/35',
                  )}
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <CatalogImage
                      src={cover}
                      emoji={icon}
                      alt=""
                      rounded="none"
                      size="lg"
                      imgClassName="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <CategoryBadge categoryId={store.category} />
                      {live ? (
                        <span className="text-[10px] font-bold uppercase text-primary">Lista</span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Pendiente seed
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-display text-base font-bold leading-snug text-foreground">
                      {store.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {store.municipio}
                      {store.zone ? ` · ${store.zone}` : ''}
                      {store.rating ? ` · ★ ${Number(store.rating).toFixed(1)}` : ''}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-primary">
                      Ver vitrina →
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <section
          className="space-y-3 rounded-2xl border border-border bg-card p-4"
          aria-labelledby="demo-roles-title"
        >
          <h2 id="demo-roles-title" className="font-display text-lg font-bold text-foreground">
            Cuentas y roles (script de venta)
          </h2>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Para mostrar el panel comercio usa la cuenta demo de tienda. Los roles de equipo
            (cajero, cocina, etc.) están roadmap — no Auth real aún.
          </p>
          {tiendaDemo ? (
            <div className="rounded-xl bg-muted/50 px-3 py-2.5 text-sm">
              <p className="font-semibold text-foreground">{tiendaDemo.label}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{tiendaDemo.email}</p>
              <Link to="/negocio" className="mt-2 inline-flex text-xs font-semibold text-primary">
                Ir al panel comercio →
              </Link>
            </div>
          ) : null}
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEMO_ROLES.map((item) => (
              <li
                key={item.role}
                className="rounded-xl border border-border/80 px-3 py-2 text-xs"
              >
                <p className="font-bold text-foreground">{item.role}</p>
                <p className="text-muted-foreground">{item.note}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/info/registrar-comercio" className="flex-1">
            <Button className="w-full min-h-11 font-bold">
              <AppIcon name="store" size={16} className="mr-1.5" aria-hidden />
              Activar comercio real
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button variant="outline" className="w-full min-h-11 font-semibold">
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
