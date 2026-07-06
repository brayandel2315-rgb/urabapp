import { isSupabaseConfigured } from '../lib/supabase';
import { isDev, isProd } from '../utils/env';

function devOrigin() {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return import.meta.env.VITE_APP_URL || 'http://localhost:5173';
}

export default function ConfigBanner() {
  if (isDev) {
    return (
      <div className="border-b border-primary/30 bg-primary/10 px-4 py-2 text-center text-xs font-semibold text-primary-dark">
        Desarrollo local — cambios en vivo (HMR) · {devOrigin()}
      </div>
    );
  }

  if (isProd && !isSupabaseConfigured) {
    return (
      <div className="border-b border-red-300 bg-red-50 px-4 py-2 text-center text-xs font-semibold text-red-700">
        Sin conexión a base de datos — configura Supabase en Vercel
      </div>
    );
  }

  return null;
}
