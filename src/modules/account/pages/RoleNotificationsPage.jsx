import { Link } from 'react-router-dom';
import AccountNotificationsPage from './AccountNotificationsPage';
import AppIcon from '@/design-system/icons/AppIcon';

/**
 * Inbox unificado reutilizado en paneles negocio / mensajero.
 */
export default function RoleNotificationsPage({
  backTo = '/',
  backLabel = 'Volver',
  eyebrow = 'Avisos',
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link
          to={backTo}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground"
          aria-label={backLabel}
        >
          <AppIcon name="chevronDown" className="rotate-90" size={18} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="font-display text-xl font-bold text-foreground">Notificaciones</h1>
        </div>
      </div>
      <AccountNotificationsPage />
    </div>
  );
}
