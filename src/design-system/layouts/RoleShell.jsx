import { Link, Outlet, useLocation } from 'react-router-dom';
import BrandLogo from '@/components/brand/BrandLogo';
import { cn } from '@/lib/utils';
import AppShell from './AppShell';
import { Button } from '@/design-system/ui/button';
import AppIcon from '@/design-system/icons/AppIcon';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';
import SkipToContent from '@/design-system/patterns/SkipToContent';
import { getRoleMeta } from '@/app/roleConfig';
import { ROLES } from '@/utils/constants';
import RiderBottomNav from '@/modules/rider/components/RiderBottomNav';

/**
 * Shell de paneles — chrome claro unificado con cliente/tienda.
 * Negocio: header compacto tipo SuperApp (sin ThemeToggle ni franja pesada).
 */
export default function RoleShell({ role }) {
  const location = useLocation();
  const meta = getRoleMeta(role);
  const isAdmin = role === ROLES.ADMIN;
  const isRider = role === ROLES.RIDER;
  const isRiderOnboarding = isRider && location.pathname.startsWith('/domiciliario/registro');
  const showRiderBottomNav = isRider && !isRiderOnboarding;
  const isBusinessPanel = role === ROLES.BUSINESS && !location.pathname.startsWith('/negocio/onboarding');
  const lightChrome = isBusinessPanel || isRider;

  return (
    <AppShell data-role={meta.dataRole} className="role-shell mobile-app-bg">
      <SkipToContent />
      <header
        className={cn(
          'role-shell-header border-b',
          lightChrome ? 'border-border/70 bg-card shadow-soft' : 'border-black/10',
          isBusinessPanel && 'role-shell-header--business',
        )}
      >
        <div
          className={cn(
            'app-container flex flex-col',
            isBusinessPanel ? 'gap-0 py-2.5' : 'gap-3',
            (isRider || isBusinessPanel) ? (isBusinessPanel ? 'py-2.5' : 'py-3') : 'py-4',
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {isBusinessPanel ? (
                <BrandLogo variant="icon" alt="" className="h-9 w-9 shrink-0" />
              ) : (
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                    lightChrome
                      ? 'bg-primary/10 text-primary ring-1 ring-primary/15'
                      : 'bg-white/10 text-white ring-2 ring-white/25',
                  )}
                >
                  <AppIcon
                    name={meta.icon}
                    size="md"
                    className={lightChrome ? 'text-primary' : 'text-white'}
                  />
                </span>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p
                    className={cn(
                      'font-display leading-tight',
                      isBusinessPanel
                        ? 'text-[15px] font-semibold text-foreground'
                        : 'text-base font-semibold lg:text-lg',
                      !isBusinessPanel && (lightChrome ? 'text-foreground' : 'text-white'),
                    )}
                  >
                    {meta.panelTitle}
                  </p>
                  {!isRider && !isBusinessPanel && (
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/90">
                      {meta.label}
                    </span>
                  )}
                </div>
                {!isBusinessPanel && (
                  <p
                    className={cn(
                      'mt-0.5 text-xs sm:text-sm',
                      lightChrome ? 'text-muted-foreground' : 'text-white/75',
                    )}
                  >
                    {meta.subtitle}
                  </p>
                )}
                {isBusinessPanel && (
                  <p className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">
                    {meta.subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {!isBusinessPanel && (
                <ThemeToggle
                  className={lightChrome ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'}
                />
              )}
              <Button
                variant={lightChrome ? 'outline' : 'secondary'}
                size="sm"
                asChild
                className={cn(
                  isBusinessPanel && 'h-9 rounded-xl px-3 text-xs font-semibold',
                  !lightChrome && 'border border-white/20 bg-white/10 text-white hover:bg-white/20',
                )}
              >
                <Link to="/">
                  <AppIcon name="home" size="sm" />
                  <span className="hidden sm:inline">Modo cliente</span>
                </Link>
              </Button>
            </div>
          </div>

          {meta.securityNote && !isBusinessPanel && (
            <div
              className={cn(
                'role-shell-security flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold',
                lightChrome
                  ? 'bg-primary/5 text-foreground'
                  : 'bg-white/12 text-white backdrop-blur-sm',
              )}
            >
              <AppIcon name="lock" size="xs" className="shrink-0 text-primary" />
              <span>{meta.securityNote}</span>
              {isAdmin && (
                <BrandLogo variant="icon" alt="" className="ml-auto h-6 w-6 opacity-80" />
              )}
            </div>
          )}

          {!isRider && !isBusinessPanel && (
            <nav className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
              {meta.nav.map((link) => {
                const active = location.pathname === link.to
                  || (link.to !== meta.home && location.pathname.startsWith(`${link.to}/`))
                  || (link.to === meta.home && location.pathname === meta.home);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={cn(
                      'shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
                      active
                        ? 'role-shell-nav-active shadow-soft'
                        : 'bg-white/10 text-white/90 hover:bg-white/15',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'app-container min-w-0 bg-transparent text-foreground outline-none',
          isBusinessPanel ? 'p-3 sm:p-4 lg:p-6' : 'p-4 lg:p-6',
          showRiderBottomNav || isBusinessPanel ? 'pb-24' : 'pb-8',
        )}
      >
        <Outlet />
      </main>

      {showRiderBottomNav && <RiderBottomNav />}
    </AppShell>
  );
}
