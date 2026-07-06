import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { useAuthStore } from '@/store/authStore';
import { ROLES } from '@/utils/constants';
import { STORE } from '@/utils/marketplace-copy';

const ZONES = [
  { to: '/admin', label: 'Admin', icon: 'settings', match: /^\/admin/ },
  { to: '/', label: 'Cliente', icon: 'home', match: /^\/($|restaurantes|mercado|farmacia|search|business|tienda|carrito|pedidos|mandado|envios|ofertas|cuenta)/ },
  { to: '/negocio', label: STORE.one, icon: 'store', match: /^\/negocio/ },
  { to: '/domiciliario', label: 'Mensajero', icon: 'mensajeria', match: /^\/domiciliario/ },
];

export default function SuperUserStrip({ className }) {
  const profile = useAuthStore((s) => s.profile);
  const location = useLocation();

  if (profile?.role !== ROLES.ADMIN) return null;

  return (
    <div
      className={cn(
        'border-b border-secondary/20 bg-secondary/5 px-3 py-2',
        className,
      )}
      role="navigation"
      aria-label="Navegación superusuario"
    >
      <div className="app-container flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">
          <AppIcon name="lock" size="xs" />
          Superusuario
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ZONES.map((zone) => {
            const active = zone.match.test(location.pathname);
            return (
              <Link
                key={zone.to}
                to={zone.to}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                  active
                    ? 'bg-secondary text-secondary-foreground shadow-soft'
                    : 'bg-background text-foreground ring-1 ring-border hover:bg-muted',
                )}
              >
                <AppIcon name={zone.icon} size="xs" />
                {zone.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
