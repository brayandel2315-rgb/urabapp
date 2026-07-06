import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { signInWithGoogle } from '@/services/auth.service';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isGoogleAuthEnabled } from '@/utils/auth-providers';
import { toast } from '@/utils/toast';
import { buildLoginRedirect } from '@/utils/auth-routes';

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
        toast('Google no está habilitado. Usa email y contraseña en /login', 'error');
      } else {
        toast(msg, 'error');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4">
      <SurfaceCard className="space-y-5 p-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <AppIcon name="profile" size="xl" className="text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Tu área de cliente</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Inicia sesión para pedir, seguir entregas y administrar direcciones, pagos y preferencias en un solo lugar.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link to={buildLoginRedirect(LOGIN_REDIRECT)}>
              Iniciar sesión
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogle}
            disabled={googleLoading || !isGoogleAuthEnabled()}
          >
            {googleLoading ? 'Conectando…' : isGoogleAuthEnabled() ? 'Continuar con Google' : 'Google (próximamente)'}
          </Button>
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

      <p className="text-center text-xs text-muted-foreground">
        ¿Necesitas ayuda?{' '}
        <Link to="/soporte" className="font-semibold text-primary">Centro de soporte</Link>
        {' · '}
        <Link to="/info/faq" className="font-semibold text-primary">Preguntas frecuentes</Link>
      </p>
    </div>
  );
}
