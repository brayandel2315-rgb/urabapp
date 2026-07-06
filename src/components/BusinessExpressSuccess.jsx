import Button from './ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { buildBusinessUrl } from '../utils/app';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

export default function BusinessExpressSuccess({ business, onClose }) {
  if (!business) return null;

  const storeLink = buildBusinessUrl(business);
  const pendingReview = business.verification_status !== 'approved';

  return (
    <SurfaceCard className="space-y-4 ring-2 ring-primary/20">
      <div className="text-center">
        <AppIcon name="check" size="3xl" className="mx-auto text-primary" />
        <h2 className="font-display mt-3 text-xl font-bold text-foreground">
          {business.name} registrado
        </h2>
        <p className="mt-2 text-sm text-muted">
          {pendingReview
            ? 'Tu solicitud fue recibida. Revisaremos tus documentos en aprox. 48 h y te avisaremos cuando tu tienda esté publicada.'
            : 'Tu tienda está activa en Urabapp.'}
        </p>
      </div>
      {pendingReview && (
        <div className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          Mientras tanto puedes configurar tu menú y preparar tu operación desde el panel.
        </div>
      )}
      <Button className="w-full" onClick={onClose}>
        Ir al panel
      </Button>
      {!pendingReview && (
        <p className="break-all text-center font-mono text-[11px] text-muted">{storeLink}</p>
      )}
    </SurfaceCard>
  );
}
