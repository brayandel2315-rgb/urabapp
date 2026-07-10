import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { Button } from '@/design-system/ui/button';
import { CLIENT_ACCOUNT, CLIENT_NOTIFICATIONS } from '@/app/clientNav';
import { buildLoginRedirect, buildRegisterRedirect } from '@/utils/auth-routes';
import { isClientAuthenticated } from '@/app/client-auth-policy';
import { AUTH_INTENT } from '@/auth/auth-intents';
import { cn } from '@/lib/utils';
import ClientUserAvatar from '@/components/layout/ClientUserAvatar';

/** Notificaciones + cuenta (login/registro si invitado). */
export function ClientHeaderAuthActions({
  user,
  profile,
  notificationCount = 0,
  accountLabel = 'Mi cuenta',
  buttonClassName = '',
  layout = 'mobile',
  headerTone = 'inner',
  showOnlineStatus = false,
}) {
  const authed = isClientAuthenticated(user);
  const notificationsTo = authed ? CLIENT_NOTIFICATIONS : buildLoginRedirect(CLIENT_NOTIFICATIONS, '', AUTH_INTENT.CLIENT);
  const accountTo = authed ? CLIENT_ACCOUNT : buildLoginRedirect(CLIENT_ACCOUNT, '', AUTH_INTENT.CLIENT);
  const registerTo = buildRegisterRedirect(CLIENT_ACCOUNT, AUTH_INTENT.CLIENT);
  const isDesktop = layout === 'desktop';
  const isHomeTone = headerTone === 'home';

  if (!authed) {
    if (isDesktop) {
      return (
        <div className="client-header-auth-guest client-header-auth-guest--desktop">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              'client-header-auth-guest__register h-9 rounded-xl px-3.5 text-sm font-semibold',
              isHomeTone
                ? 'text-white/90 hover:bg-white/10 hover:text-white'
                : 'text-[#0E6BA8] hover:bg-[#E6F4FF]',
            )}
          >
            <Link to={registerTo}>Registrarse</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className={cn(
              'client-header-auth-guest__login h-9 rounded-xl px-4 text-sm font-bold',
              isHomeTone
                ? 'bg-white text-[#0D2B45] hover:bg-white/90'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            )}
          >
            <Link to={accountTo}>Entrar</Link>
          </Button>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        asChild
        className="h-9 rounded-full px-3.5 text-xs font-bold"
      >
        <Link to={accountTo}>Entrar</Link>
      </Button>
    );
  }

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
      <Button
        variant="ghost"
        size="sm"
        asChild
        className={cn(buttonClassName, showOnlineStatus && 'client-header-auth__profile-btn')}
      >
        <Link
          to={accountTo}
          aria-label={showOnlineStatus ? `${accountLabel}, en línea` : accountLabel}
          title={showOnlineStatus ? 'En línea' : undefined}
        >
          {showOnlineStatus ? (
            <ClientUserAvatar profile={profile} user={user} size="md" showOnline />
          ) : (
            <AppIcon name="profile" size={20} />
          )}
          {showOnlineStatus && <span className="sr-only">En línea</span>}
        </Link>
      </Button>
    </>
  );
}
