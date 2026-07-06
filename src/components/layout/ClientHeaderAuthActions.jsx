import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { Button } from '@/design-system/ui/button';
import { CLIENT_ACCOUNT, CLIENT_NOTIFICATIONS } from '@/app/clientNav';
import { buildLoginRedirect } from '@/utils/auth-routes';

/** Notificaciones + cuenta (login si invitado). */
export function ClientHeaderAuthActions({
  user,
  notificationCount = 0,
  accountLabel = 'Mi cuenta',
  buttonClassName = '',
}) {
  const notificationsTo = user ? CLIENT_NOTIFICATIONS : buildLoginRedirect(CLIENT_NOTIFICATIONS);
  const accountTo = user ? CLIENT_ACCOUNT : buildLoginRedirect(CLIENT_ACCOUNT);

  return (
    <>
      <Button variant="ghost" size="sm" asChild className={buttonClassName}>
        <Link to={notificationsTo} aria-label="Notificaciones" className="relative">
          <AppIcon name="bell" size={20} />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-promo px-1 text-[9px] font-bold text-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </Link>
      </Button>
      <Button variant="ghost" size="sm" asChild className={buttonClassName}>
        <Link to={accountTo} aria-label={accountLabel}>
          <AppIcon name="profile" size={20} />
        </Link>
      </Button>
    </>
  );
}
