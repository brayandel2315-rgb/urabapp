import { Link, Outlet, useLocation } from 'react-router-dom';
import logo from '@/assets/logo/logo-icon.svg';
import { cn } from '@/lib/utils';
import AppShell from './AppShell';
import { Button } from '@/design-system/ui/button';
import AppIcon from '@/design-system/icons/AppIcon';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';

export default function PanelShell({ title, links }) {
  const location = useLocation();

  return (
    <AppShell>
      <header className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/40" />
            <div>
              <p className="font-display text-sm font-bold">{title}</p>
              <p className="text-label text-primary-foreground/70">Panel Urabapp</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="text-white hover:bg-white/10" />
            <Button variant="secondary" size="sm" asChild className="bg-white/10 text-white hover:bg-white/20">
              <Link to="/"><AppIcon name="home" size="sm" /> App</Link>
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 lg:px-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
                location.pathname === link.to ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white/90 hover:bg-white/15'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl bg-background p-4 pb-8 lg:p-6">
        <Outlet />
      </main>
    </AppShell>
  );
}
