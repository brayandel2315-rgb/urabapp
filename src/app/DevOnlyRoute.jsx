import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ROLES } from '@/utils/constants';

export default function DevOnlyRoute({ children }) {
  const profile = useAuthStore((s) => s.profile);

  if (import.meta.env.PROD && profile?.role !== ROLES.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return children;
}
