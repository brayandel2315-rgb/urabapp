import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { buildLoginRedirect } from '@/utils/auth-routes';
import { isClientAuthenticated } from '@/app/client-auth-policy';
import Loader from '@/components/ui/Loader';

/**
 * Bloquea rutas de cliente que requieren identidad verificada (no sesión anónima).
 */
export default function RequireClientAuth({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) {
    return <Loader variant="page" message="Verificando sesión…" className="min-h-[40vh]" />;
  }

  if (!isClientAuthenticated(user)) {
    return <Navigate to={buildLoginRedirect(location.pathname, location.search)} replace />;
  }

  return children;
}
