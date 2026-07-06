import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getRoleHome } from '@/app/roleConfig';
import { ROLES } from '@/utils/constants';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { getRoleMeta } from '@/app/roleConfig';
import { canAccessRoles } from '@/utils/auth-rbac';

export default function RequireRole({ children, roles, fallbackTo }) {
  const profile = useAuthStore((s) => s.profile);
  const role = profile?.role || ROLES.CLIENT;

  if (!canAccessRoles(role, roles)) {
    if (fallbackTo) {
      return <Navigate to={fallbackTo} replace />;
    }

    const meta = getRoleMeta(role);
    return (
      <SurfaceCard className="mx-auto max-w-md text-center">
        <AppIcon name="lock" size="xl" className="mx-auto text-muted-foreground" />
        <h2 className="text-heading mt-4 text-xl">Área restringida</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Esta sección es solo para cuentas de tipo {roles.map((r) => getRoleMeta(r).label).join(' o ')}.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button asChild>
            <Link to={getRoleHome(role)}>Ir a {meta.panelTitle}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">Volver a pedir</Link>
          </Button>
        </div>
      </SurfaceCard>
    );
  }

  return children;
}
