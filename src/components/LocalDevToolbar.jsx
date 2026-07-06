import { Link } from 'react-router-dom';
import { isDev } from '../utils/env';
import { isMapsEnabled, isRoutingEnabled } from '../services/map.service';
import { isSocketEnabled } from '../services/socket.service';
import { isWompiEnabled } from '../services/wompi.service';
import { isSupabaseConfigured } from '../lib/supabase';
import { STORE } from '../utils/marketplace-copy';

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/admin', label: 'Admin' },
  { to: '/domiciliario', label: 'Mensajero' },
  { to: '/negocio', label: STORE.one },
];

export default function LocalDevToolbar() {
  if (!isDev) return null;

  return (
    <div className="pointer-events-none fixed bottom-20 left-0 right-0 z-40 flex justify-center px-2 lg:bottom-4">
      <div className="pointer-events-auto flex max-w-full flex-wrap items-center justify-center gap-1 rounded-2xl border border-primary/30 bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur-md">
        <span className="px-2 text-[10px] font-bold uppercase tracking-wide text-primary">Local</span>
        {LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-lg px-2 py-1 text-[11px] font-semibold text-foreground hover:bg-primary/10"
          >
            {link.label}
          </Link>
        ))}
        <span className="hidden border-l border-border pl-2 text-[10px] text-muted sm:inline">
          {isMapsEnabled() ? 'OpenFreeMap ✓' : 'mapa off'}
          {isRoutingEnabled() ? ' · ORS ✓' : ''}
          {isSocketEnabled() ? ' · Socket ✓' : ''}
          {' · '}
          {isWompiEnabled() ? 'Wompi ✓' : 'Efectivo'}
          {isSupabaseConfigured ? ' · BD ✓' : ''}
          {' · '}
          Ctrl+K buscar
        </span>
      </div>
    </div>
  );
}
