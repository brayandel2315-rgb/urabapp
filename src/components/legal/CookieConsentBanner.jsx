import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import {
  getCookieConsent,
  hasResolvedCookieConsent,
  setCookieConsent,
} from '@/utils/cookie-consent';
import { initAnalytics } from '@/services/analytics.service';

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasResolvedCookieConsent());
  }, []);

  if (!visible) return null;

  const accept = (level) => {
    setCookieConsent(level);
    setVisible(false);
    if (level === 'all') {
      initAnalytics().catch(() => {});
    }
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-border bg-background/95 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
      role="dialog"
      aria-label="Consentimiento de cookies"
      aria-describedby="cookie-consent-copy"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold text-foreground">Cookies y datos (Ley 1581)</p>
          <p id="cookie-consent-copy" className="text-xs leading-relaxed text-muted-foreground">
            Usamos almacenamiento esencial para sesión, carrito y seguridad. Con tu autorización
            también activamos analítica para mejorar Urabapp. Puedes cambiar esto en{' '}
            <Link to="/legal/cookies" className="font-semibold text-primary underline-offset-2 hover:underline">
              Política de cookies
            </Link>
            . Estado actual: {getCookieConsent() === 'pending' ? 'pendiente' : getCookieConsent()}.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" size="sm" onClick={() => accept('essential')}>
            Solo esenciales
          </Button>
          <Button type="button" size="sm" onClick={() => accept('all')}>
            Aceptar todas
          </Button>
        </div>
      </div>
    </div>
  );
}
