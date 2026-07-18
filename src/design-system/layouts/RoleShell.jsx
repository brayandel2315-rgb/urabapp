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

export default function RoleShell({ role }) {
  const location = useLocation();
  const meta = getRoleMeta(role);
  const isAdmin = role === ROLES.ADMIN;
  const isRider = role === ROLES.RIDER;
  const isRiderOnboarding = isRider && location.pathname.startsWith('/domiciliario/registro');
  const showRiderBottomNav = isRider && !isRiderOnboarding;
  const isBusinessPanel = role === ROLES.BUSINESS && !location.pathname.startsWith('/negocio/onboarding');

  return (
    <AppShell data-role={meta.dataRole} className="role-shell">
      <SkipToContent />
      <header className={cn('role-shell-header border-b border-black/10 shadow-soft', (isRider || isBusinessPanel) && 'pb-3')}>
        <div className={cn('app-container flex flex-col gap-3', (isRider || isBusinessPanel) ? 'py-3' : 'py-4')}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-2 ring-white/25',
                  role === ROLES.RIDER && 'bg-sky/20',
                  role === ROLES.BUSINESS && 'bg-white/15',
                  role === ROLES.ADMIN && 'bg-white/10'
                )}
              >
                <AppIcon name={meta.icon} size="md" className="text-white" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-base font-bold leading-tight text-white lg:text-lg">
                    {meta.panelTitle}
                  </p>
                  {!isRider && !isBusinessPanel && (
                    <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90">
                      {meta.label}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-white/75 sm:text-sm">{meta.subtitle}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle className="text-white hover:bg-white/10" />
              <Button
                variant="secondary"
                size="sm"
                asChild
                className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
              >
                <Link to="/">
                  <AppIcon name="home" size="sm" />
                  <span className="hidden sm:inline">Modo cliente</span>
                </Link>
              </Button>
            </div>
          </div>

          {meta.securityNote && (
            <div className="role-shell-security flex items-center gap-2 rounded-xl bg-white/12 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
              <AppIcon name="lock" size="xs" className="shrink-0 text-[var(--role-accent)]" />
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
                        : 'bg-white/10 text-white/90 hover:bg-white/15'
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
          'app-container min-w-0 bg-background p-4 text-foreground outline-none lg:p-6',
          showRiderBottomNav || isBusinessPanel ? 'pb-24' : 'pb-8',
        )}
      >
        <Outlet />
      </main>

      {showRiderBottomNav && <RiderBottomNav />}
    </AppShell>
  );
}
