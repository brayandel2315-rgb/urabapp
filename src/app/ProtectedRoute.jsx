import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loader from '../components/ui/Loader';
import ProfileBootstrap from '../components/auth/ProfileBootstrap';
import { getRoleHome } from './roleConfig';
import { canAccessRoles } from '@/utils/auth-rbac';
import { buildLoginRedirect } from '@/utils/auth-routes';
import { isClientAuthenticated } from '@/app/client-auth-policy';

export default function ProtectedRoute({
  children,
  roles,
  requireAuth = false,
  requireRealAuth = false,
}) {
  const { user, profile, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return <Loader size="lg" message="Verificando sesión…" />;
  }

  const needsAuth = requireAuth || requireRealAuth || roles;
  const authed = requireRealAuth ? isClientAuthenticated(user) : Boolean(user);

  if (needsAuth && !authed) {
    return <Navigate to={buildLoginRedirect(location.pathname, location.search)} replace />;
  }

  const profileReady = profile?.role;

  if (roles && user && !profileReady) {
    return <ProfileBootstrap>{children}</ProfileBootstrap>;
  }

  if (roles && user && profile && !canAccessRoles(profile.role, roles)) {
    return <Navigate to={getRoleHome(profile.role)} replace />;
  }

  return children;
}
