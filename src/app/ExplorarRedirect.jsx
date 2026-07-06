import { Navigate, useLocation } from 'react-router-dom';
import { CLIENT_SEARCH } from './clientNav';

/** Compatibilidad: /explorar → /search preservando query string (?category=, ?ref=, etc.) */
export default function ExplorarRedirect() {
  const { search } = useLocation();
  return <Navigate to={`${CLIENT_SEARCH}${search}`} replace />;
}
