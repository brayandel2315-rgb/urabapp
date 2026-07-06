import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo-icon.svg';
import AppIcon from '@/design-system/icons/AppIcon';
import ThemeToggle from '@/design-system/patterns/ThemeToggle';

import { CLIENT_HOME } from '@/app/clientNav';

export default function Navbar({ title, backTo = CLIENT_HOME, right }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl min-w-0 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to={backTo}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors hover:bg-primary/15"
            aria-label="Volver"
          >
            <AppIcon name="home" size="sm" />
          </Link>
          {title ? (
            <h1 className="truncate font-display text-base font-bold text-foreground">{title}</h1>
          ) : (
            <Link to={CLIENT_HOME} className="flex items-center gap-2">
              <img src={logo} alt="Urabapp" className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/30" />
              <span className="font-display text-sm font-bold text-foreground">Urabapp</span>
            </Link>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          {right}
        </div>
      </div>
    </header>
  );
}
