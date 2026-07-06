export const isProd = import.meta.env.PROD;
export const isDev = import.meta.env.DEV;

import { isCashOnlyLaunch, isWhatsAppDeferred } from './launch';

export function getEnvConfig() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const whatsapp = import.meta.env.VITE_WHATSAPP_NUMBER;
  const appUrl = import.meta.env.VITE_APP_URL;
  const wompi = import.meta.env.VITE_WOMPI_ENABLED === 'true' || import.meta.env.VITE_WOMPI_PUBLIC_KEY;
  const vapid = import.meta.env.VITE_VAPID_PUBLIC_KEY;
  const whatsappApi = import.meta.env.VITE_WHATSAPP_API_ENABLED === 'true';
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const issues = [];
  if (!supabaseUrl || !supabaseKey) {
    issues.push('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY');
  }
  if (isProd && !whatsapp && !isWhatsAppDeferred()) {
    issues.push('Falta VITE_WHATSAPP_NUMBER para contacto operativo');
  }
  if (isProd && !appUrl) {
    issues.push('Falta VITE_APP_URL para links compartibles');
  }
  if (isProd && !wompi && !isCashOnlyLaunch()) {
    issues.push('Wompi no configurado — solo efectivo activo');
  }
  // Push y Socket: recomendados en producción, no bloquean lanzamiento MVP

  return {
    isConfigured: issues.length === 0,
    issues,
    supabaseUrl,
    appUrl,
    integrations: {
      wompi: Boolean(wompi),
      maps: true,
      routing: import.meta.env.VITE_ORS_ENABLED !== 'false',
      socket: Boolean(socketUrl),
      push: Boolean(vapid),
      whatsappApi,
    },
  };
}
