import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { signInWithGoogle } from '@/services/auth.service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isGoogleAuthEnabled } from '@/utils/auth-providers';
import { toast } from '@/utils/toast';
import { buildLoginRedirect, buildRegisterRedirect, buildAuthEntryUrl } from '@/utils/auth-routes';
import { AUTH_INTENT } from '@/auth/auth-intents';

const LOGIN_REDIRECT = '/cuenta/perfil';

export default function AccountGuestPage() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogle = async () => {
    if (!isSupabaseConfigured) {
      toast('Configura .env.local con credenciales Supabase', 'error');
      return;
    }
    setGoogleLoading(true);
    try {
      await signInWithGoogle(LOGIN_REDIRECT);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('provider is not enabled') || msg.includes('Unsupported provider')) {
        toast('Google no está habilitado. Usa email y contraseña.', 'error');
      } else {
        toast(msg, 'error');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <SurfaceCard className="space-y-4 p-5 text-center sm:p-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <AppIcon name="profile" size="xl" className="text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Tu perfil de cliente</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Para ver pedidos, direcciones y pagos necesitas una cuenta de <strong>cliente</strong>.
            Si quieres vender o repartir, el registro es otro perfil.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild className="w-full sm:flex-1">
            <Link to={buildRegisterRedirect(LOGIN_REDIRECT, AUTH_INTENT.CLIENT)}>
              Crear cuenta de cliente
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:flex-1">
            <Link to={buildLoginRedirect(LOGIN_REDIRECT, '', AUTH_INTENT.CLIENT)}>
              Ya tengo cuenta
            </Link>
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleGoogle}
          disabled={googleLoading || !isGoogleAuthEnabled()}
        >
          {googleLoading ? 'Conectando…' : isGoogleAuthEnabled() ? 'Continuar con Google' : 'Google (próximamente)'}
        </Button>
      </SurfaceCard>

      <SurfaceCard className="p-4">
        <p className="mb-3 text-center text-sm font-semibold text-foreground">¿Buscas otro perfil?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            to={buildAuthEntryUrl({ basePath: '/registro', intent: AUTH_INTENT.BUSINESS, mode: 'signup' })}
            className="rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted/40"
          >
            <AppIcon name="store" size="sm" className="text-primary" />
            <p className="mt-2 text-sm font-bold">Comercio</p>
            <p className="text-xs text-muted-foreground">Registrar mi tienda</p>
          </Link>
          <Link
            to={buildAuthEntryUrl({ basePath: '/registro', intent: AUTH_INTENT.RIDER, mode: 'signup' })}
            className="rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted/40"
          >
            <AppIcon name="mensajeria" size="sm" className="text-primary" />
            <p className="mt-2 text-sm font-bold">Domiciliario</p>
            <p className="text-xs text-muted-foreground">Quiero repartir</p>
          </Link>
        </div>
      </SurfaceCard>

      <SurfaceCard className="divide-y divide-border p-0">
        {[
          { icon: 'orders', text: 'Sigue tus pedidos en tiempo real' },
          { icon: 'map', text: 'Guarda direcciones de entrega' },
          { icon: 'card', text: 'Administra métodos de pago' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground">
            <AppIcon name={item.icon} size="sm" className="shrink-0 text-primary" />
            {item.text}
          </div>
        ))}
      </SurfaceCard>
    </div>
  );
}
