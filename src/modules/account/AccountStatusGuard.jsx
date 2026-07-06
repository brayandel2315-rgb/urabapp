import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { signOut } from '@/services/auth.service';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';

const STATUS_COPY = {
  blocked: {
    title: 'Cuenta bloqueada',
    body: 'Tu cuenta fue suspendida. Contacta soporte si crees que es un error.',
  },
  deleted: {
    title: 'Cuenta eliminada',
    body: 'Esta cuenta ya no está activa en UrabApp.',
  },
};

export default function AccountStatusGuard({ children }) {
  const { profile, logout } = useAuthStore();
  const status = profile?.account_status || 'active';

  if (status === 'active' || status === 'pending') {
    return children;
  }

  const copy = STATUS_COPY[status] || STATUS_COPY.blocked;

  const handleLogout = async () => {
    await signOut();
    logout();
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-12">
      <SurfaceCard className="w-full space-y-4 p-6 text-center">
        <AppIcon name="lock" size="lg" className="mx-auto text-destructive" />
        <h1 className="font-display text-xl font-bold">{copy.title}</h1>
        <p className="text-sm text-muted-foreground">{copy.body}</p>
        <div className="flex flex-col gap-2">
          <Button asChild variant="primary">
            <Link to="/soporte">Contactar soporte</Link>
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </SurfaceCard>
    </div>
  );
}
