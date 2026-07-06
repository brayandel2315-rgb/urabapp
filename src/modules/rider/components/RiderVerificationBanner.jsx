import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import { COURIER_VERIFICATION_STATUS } from '../constants';
import { cn } from '@/lib/utils';

export default function RiderVerificationBanner({ driver }) {
  if (!driver) return null;
  const status = driver.verification_status || (driver.is_verified ? 'approved' : 'pending');
  if (status === 'approved') return null;

  const meta = COURIER_VERIFICATION_STATUS[status] || COURIER_VERIFICATION_STATUS.pending;

  return (
    <SurfaceCard
      className={cn(
        'border-l-4',
        status === 'rejected' && 'border-l-destructive bg-destructive/5',
        status === 'in_review' && 'border-l-amber-500 bg-amber-500/5',
        status === 'corrections' && 'border-l-amber-500 bg-amber-500/5',
        status === 'pending' && 'border-l-primary bg-primary/5'
      )}
    >
      <div className="flex gap-3">
        <AppIcon name="lock" size="md" className="shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">Verificación: {meta.label}</p>
          {status === 'in_review' && (
            <p className="mt-1 text-sm text-muted-foreground">
              Estamos revisando tu cuenta. Si ya tomaste la foto en vivo, vuelve a conectarte en unos minutos.
            </p>
          )}
          {status === 'corrections' && (
            <p className="mt-1 text-sm text-muted-foreground">
              {driver.correction_notes || 'Actualiza tus documentos y vuelve a enviar.'}
            </p>
          )}
          {status === 'rejected' && (
            <p className="mt-1 text-sm text-muted-foreground">
              {driver.rejection_reason || 'Tu solicitud no fue aprobada. Contacta soporte.'}
            </p>
          )}
          {status === 'pending' && (
            <p className="mt-1 text-sm text-muted-foreground">
              Completa el registro en 2 pasos para conectarte y recibir pedidos.
            </p>
          )}
          {['pending', 'corrections'].includes(status) && (
            <Link to="/domiciliario/registro" className="mt-3 inline-block">
              <Button size="sm">Continuar registro</Button>
            </Link>
          )}
        </div>
      </div>
    </SurfaceCard>
  );
}
