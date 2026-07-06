import { Link } from 'react-router-dom';
import { BRAND } from '@/utils/constants';
import { HOME_FOOTER_LINKS, HOME_FOOTER_GROUP_LABELS } from '@/modules/home/constants/footer-links';

/** Footer móvil — escritorio usa HomeDesktopFooter */
export default function HomeFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20 lg:hidden">
      <div className="app-container flex flex-col gap-6 py-8">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{BRAND.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{BRAND.shortTagline}</p>
        </div>
        {Object.entries(HOME_FOOTER_LINKS).map(([group, items]) => (
          <div key={group}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {HOME_FOOTER_GROUP_LABELS[group] || group}
            </p>
            <ul className="mt-3 space-y-2">
              {items.map((l) => (
                <li key={`${group}-${l.to}-${l.label}`}>
                  <Link to={l.to} className="text-sm font-medium text-foreground hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {BRAND.name} · Urabá, Antioquia
      </div>
    </footer>
  );
}
