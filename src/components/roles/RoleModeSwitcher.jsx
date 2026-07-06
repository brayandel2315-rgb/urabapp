import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { getAccessibleOperationalRoles, getRoleMeta, ROLE_META } from '@/app/roleConfig';
import { ROLES } from '@/utils/constants';
import { useAuthStore } from '@/store/authStore';

const ROLE_CARD_STYLES = {
  [ROLES.CLIENT]: 'border-primary/25 bg-primary/5 hover:border-primary/40',
  [ROLES.BUSINESS]: 'border-primary/30 bg-primary-light/80 hover:border-primary/50',
  [ROLES.RIDER]: 'border-sky/30 bg-sky-light/80 hover:border-sky/50',
  [ROLES.ADMIN]: 'border-secondary/20 bg-secondary/5 hover:border-secondary/35',
};

const ROLE_ICON_STYLES = {
  [ROLES.CLIENT]: 'bg-primary text-primary-foreground',
  [ROLES.BUSINESS]: 'bg-primary text-primary-foreground',
  [ROLES.RIDER]: 'bg-sky text-white',
  [ROLES.ADMIN]: 'bg-secondary text-secondary-foreground',
};

function detectActiveRole(pathname) {
  if (pathname.startsWith('/admin')) return ROLES.ADMIN;
  if (pathname.startsWith('/negocio')) return ROLES.BUSINESS;
  if (pathname.startsWith('/domiciliario')) return ROLES.RIDER;
  return ROLES.CLIENT;
}

export default function RoleModeSwitcher() {
  const { profile } = useAuthStore();
  const location = useLocation();
  const dbRole = profile?.role || ROLES.CLIENT;
  const activeRole = detectActiveRole(location.pathname);
  const accessible = getAccessibleOperationalRoles(dbRole);

  const modes = accessible
    .filter((r) => r !== ROLES.CLIENT || accessible.length === 1)
    .map((r) => ROLE_META[r]);

  const showClient = accessible.includes(ROLES.CLIENT);
  const isPureClient = dbRole === ROLES.CLIENT;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-tagline text-muted-foreground">Modo de la app</p>
        <p className="text-sm text-muted-foreground">
          Cada modo tiene su propio panel, colores y permisos. Elige dónde quieres operar.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {showClient && (
          <RoleModeCard
            role={ROLES.CLIENT}
            active={activeRole === ROLES.CLIENT}
            to="/"
          />
        )}
        {modes
          .filter((m) => m.id !== ROLES.CLIENT)
          .map((meta) => (
            <RoleModeCard
              key={meta.id}
              role={meta.id}
              active={activeRole === meta.id}
              to={meta.home}
            />
          ))}
      </div>

      {isPureClient && (
        <div className="grid gap-2 border-t border-border pt-3 sm:grid-cols-2">
          <Link
            to="/negocio/onboarding"
            className="flex items-center gap-3 rounded-xl border border-dashed border-primary/35 bg-background p-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary/5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <AppIcon name="store" size="sm" />
            </span>
            <span>
              Abrir mi tienda
              <span className="mt-0.5 block text-xs font-medium text-muted-foreground">Registro comercio</span>
            </span>
          </Link>
          <Link
            to="/domiciliario/registro"
            className="flex items-center gap-3 rounded-xl border border-dashed border-sky/40 bg-background p-3 text-sm font-semibold text-foreground transition-colors hover:bg-sky-light/50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky/15 text-sky">
              <AppIcon name="mensajeria" size="sm" />
            </span>
            <span>
              Ser mensajero
              <span className="mt-0.5 block text-xs font-medium text-muted-foreground">Registro domiciliario</span>
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}

function RoleModeCard({ role, active, to }) {
  const meta = getRoleMeta(role);

  return (
    <Link
      to={to}
      className={cn(
        'flex items-start gap-3 rounded-2xl border p-4 transition-all',
        ROLE_CARD_STYLES[role],
        active && 'ring-2 ring-[var(--role-accent,hsl(var(--primary)))] ring-offset-2'
      )}
    >
      <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', ROLE_ICON_STYLES[role])}>
        <AppIcon name={meta.icon} size="sm" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-display text-sm font-bold text-foreground">{meta.label}</span>
          {active && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase text-background">
              Activo
            </span>
          )}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{meta.subtitle}</span>
      </span>
    </Link>
  );
}
