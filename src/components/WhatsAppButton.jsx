import { buildSupportMessage, openWhatsApp } from '../utils/whatsapp';
import AppIcon from '@/design-system/icons/AppIcon';

export default function WhatsAppButton() {
  return (
    <button
      type="button"
      onClick={() => openWhatsApp(buildSupportMessage())}
      className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-glow transition-transform hover:scale-105 active:scale-95"
      aria-label="Contactar por WhatsApp"
    >
      <AppIcon name="whatsapp" size="lg" />
    </button>
  );
}
