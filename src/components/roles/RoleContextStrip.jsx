import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useAuthStore } from '@/store/authStore';
import { getAccessibleOperationalRoles, getRoleMeta } from '@/app/roleConfig';
import { ROLES } from '@/utils/constants';

import { cn } from '@/lib/utils';

/** Indicador discreto cuando el usuario también opera comercio, mensajería o admin */
export default function RoleContextStrip({ className }) {
  const profile = useAuthStore((s) => s.profile);
  const role = profile?.role || ROLES.CLIENT;
  const accessible = getAccessibleOperationalRoles(role);
  const hasOps = accessible.some((r) => r !== ROLES.CLIENT);

  if (!profile || !hasOps) return null;

  const shortcuts = accessible.filter((r) => r !== ROLES.CLIENT);

  return (
    <div
      data-role="client"
      className={cn(
        'border-b border-border/40 bg-gradient-to-r from-emerald-50/80 via-background to-background dark:from-emerald-950/30',
        className,
      )}
    >
      <div className="app-container flex flex-wrap items-center justify-between gap-2 py-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm sm:text-xs">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <AppIcon name="home" size="xs" />
          </span>
          <span>
            <span className="text-primary">Área de cliente</span>
            <span className="text-muted-foreground"> · pedir y recibir</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {shortcuts.map((r) => {
            const meta = getRoleMeta(r);
            return (
              <Link
                key={r}
                to={meta.home}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1 text-[11px] font-bold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <AppIcon name={meta.icon} size="xs" className="text-primary" />
                {meta.clientNavLabel}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
