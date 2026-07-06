import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ensureUserProfile } from '@/services/auth.service';
import Loader from '@/components/ui/Loader';
import Button from '@/components/ui/Button';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';

/**
 * Evita spinner infinito cuando hay sesión pero falta fila en public.users.
 */
export default function ProfileBootstrap({ children }) {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [timedOut, setTimedOut] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || profile) {
      setTimedOut(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    ensureUserProfile(user)
      .then((row) => {
        if (!cancelled && row) setProfile(row);
      })
      .catch(() => {
        if (!cancelled) setTimedOut(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const timer = setTimeout(() => {
      if (!cancelled) setTimedOut(true);
    }, 8_000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [user, profile, setProfile]);

  if (!user || profile) return children;

  if (timedOut && !loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <SurfaceCard className="max-w-md space-y-4 p-6 text-center">
          <h1 className="font-display text-lg font-bold">No pudimos cargar tu perfil</h1>
          <p className="text-sm text-muted-foreground">
            Tu sesión está activa, pero falta completar el perfil. Intenta de nuevo o vuelve al inicio.
          </p>
          <div className="flex flex-col gap-2">
            <Button type="button" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Ir al inicio</Link>
            </Button>
          </div>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader size="lg" />
    </div>
  );
}
