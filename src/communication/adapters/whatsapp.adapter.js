import { sendOrderWhatsAppUpdate, isWhatsAppApiEnabled } from '@/services/whatsapp-api.service';

/** Canal WhatsApp — plantillas vía edge send-whatsapp. */
export async function deliverWhatsApp({ phone, orderNumber, status, orderId }) {
  if (!isWhatsAppApiEnabled() || !phone) return false;
  try {
    const result = await sendOrderWhatsAppUpdate({ phone, orderNumber, status, orderId });
    return Boolean(result?.sent);
  } catch (err) {
    console.warn('[comm-whatsapp]', err.message);
    return false;
  }
}
