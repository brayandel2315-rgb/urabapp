import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { buildLoginRedirect } from '@/utils/auth-routes';
import { STORE } from '@/utils/marketplace-copy';

/** Puerta de autenticación antes de operaciones sensibles (mandado, envíos, pago). */
export default function ClientAuthGateCard({
  title = 'Inicia sesión para continuar',
  description = `Por tu seguridad y la de la ${STORE.oneLower}, necesitamos verificar tu identidad antes de confirmar.`,
  redirectPath,
  icon = 'lock',
}) {
  const loginTo = buildLoginRedirect(redirectPath || '/');

  return (
    <SurfaceCard className="space-y-4 border border-primary/20 bg-primary/[0.04] p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <AppIcon name={icon} size="md" />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link to={loginTo}>
          <Button>Entrar o crear cuenta</Button>
        </Link>
        <Link to="/info/seguridad">
          <Button variant="outline">Por qué es seguro</Button>
        </Link>
      </div>
    </SurfaceCard>
  );
}
