import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { CLIENT_HOME } from '@/app/clientNav';

/** Barra compacta en páginas internas — escritorio; móvil usa header + bottom nav */
export default function ClientSubheader({ title, backTo = CLIENT_HOME, right }) {
  const useChevron = backTo !== CLIENT_HOME && backTo !== '/';

  return (
    <div className="hidden border-b border-border/50 bg-card/80 backdrop-blur-sm lg:block">
      <div className="mx-auto flex h-12 w-full max-w-6xl min-w-0 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          to={backTo}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary ring-1 ring-border/60 transition-transform active:scale-95"
          aria-label="Volver"
        >
          <AppIcon name={useChevron ? 'chevronDown' : 'home'} size="sm" className={useChevron ? '-rotate-90' : ''} />
        </Link>
        {title && <h1 className="truncate font-display text-base font-bold text-foreground">{title}</h1>}
        {right && <div className="ml-auto shrink-0">{right}</div>}
      </div>
    </div>
  );
}
