import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { buildLoginRedirect, buildRegisterRedirect } from '@/utils/auth-routes';
import { AUTH_INTENT } from '@/auth/auth-intents';
import { STORE } from '@/utils/marketplace-copy';

/** Puerta de autenticación antes de operaciones sensibles (mandado, envíos, pago). */
export default function ClientAuthGateCard({
  title = 'Necesitas una cuenta de cliente',
  description = `Para continuar crea tu perfil de cliente o entra si ya tienes cuenta. Vender o repartir usa otro registro.`,
  redirectPath,
  icon = 'lock',
  intent = AUTH_INTENT.CLIENT,
}) {
  const target = redirectPath || '/';
  const registerTo = buildRegisterRedirect(target, intent);
  const loginTo = buildLoginRedirect(target, '', intent);

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
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link to={registerTo} className="sm:flex-1">
          <Button className="w-full">Crear cuenta de cliente</Button>
        </Link>
        <Link to={loginTo} className="sm:flex-1">
          <Button variant="outline" className="w-full">Ya tengo cuenta</Button>
        </Link>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        ¿{STORE.register} o ser domiciliario?{' '}
        <Link to={buildRegisterRedirect('/negocio/onboarding', AUTH_INTENT.BUSINESS)} className="font-semibold text-primary">
          Comercio
        </Link>
        {' · '}
        <Link to={buildRegisterRedirect('/domiciliario/registro', AUTH_INTENT.RIDER)} className="font-semibold text-primary">
          Domiciliario
        </Link>
      </p>
    </SurfaceCard>
  );
}
