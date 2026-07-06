import { isWompiEnabled } from '@/services/wompi.service';

/** Lanzamiento MVP: efectivo contra entrega, sin Wompi ni WhatsApp API aún */
export function isCashOnlyLaunch() {
  return !isWompiEnabled();
}

export function isWhatsAppDeferred() {
  return import.meta.env.VITE_WHATSAPP_API_ENABLED !== 'true';
}

export function isPaymentsReady() {
  return isCashOnlyLaunch() || isWompiEnabled();
}

export function hasOperatorWhatsApp() {
  const n = import.meta.env.VITE_WHATSAPP_NUMBER;
  return !!n && n !== '573001234567';
}

export function getLaunchModeLabel() {
  if (isCashOnlyLaunch() && isWhatsAppDeferred()) {
    return 'MVP · efectivo · WhatsApp en fase 2';
  }
  if (isCashOnlyLaunch()) return 'MVP · efectivo contra entrega';
  if (isWhatsAppDeferred()) return 'MVP · WhatsApp en fase 2';
  return 'Producción completa';
}
