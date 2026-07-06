import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { buildLoginRedirect } from '@/utils/auth-routes';

/**
 * Garantiza que solo usuarios autenticados accedan al área de cuenta.
 * Cada sesión ve únicamente su propio perfil (datos filtrados por auth.uid() en servicios).
 */
export default function RequireOwnAccount({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return <Navigate to={buildLoginRedirect(location.pathname, location.search)} replace />;
  }

  return children;
}
