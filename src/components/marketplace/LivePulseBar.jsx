import { Link } from 'react-router-dom';
import { formatCOP } from '../../utils/currency';
import { formatBusinessPromoText } from '../../utils/promo';
import { WELCOME_BENEFIT } from '../../utils/constants';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import { STORE } from '@/utils/marketplace-copy';

function PulseStat({ label, value, sub, highlight }) {
  return (
    <div className={`rounded-2xl px-3 py-2.5 ${highlight ? 'bg-primary/15 ring-1 ring-primary/30' : 'bg-surface/80'}`}>
      <p className={`text-lg font-black leading-none ${highlight ? 'text-primary-dark' : 'text-secondary'}`}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      {sub && <p className="text-[10px] text-muted">{sub}</p>}
    </div>
  );
}

export default function LivePulseBar({ pulse, municipio, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-border/50" />
        ))}
      </div>
    );
  }

  if (!pulse) return null;

  const zoneLabel = municipio;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
          </span>
          <p className="text-xs font-bold text-secondary">
            Operando en <span className="text-primary-dark">{zoneLabel}</span>
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
          pulse.zoneStatus?.isHealthy ? 'bg-primary-light text-primary-dark' : 'bg-accent/30 text-secondary'
        }`}>
          {pulse.openBusinessesCount} abiertas
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <PulseStat label="Pedidos hoy" value={pulse.ordersToday} highlight />
        <PulseStat label="Entregados" value={pulse.deliveredToday} />
        <PulseStat
          label="Tiempo prom."
          value={pulse.avgDeliveryMin ? `${pulse.avgDeliveryMin}m` : `~${pulse.avgBizDelivery}m`}
          sub="entrega"
        />
        <PulseStat label="En curso" value={pulse.activeOrders} />
        <PulseStat label="Mensajeros" value={pulse.onlineRiders} sub="en línea" />
        <PulseStat label="Nuevos hoy" value={pulse.newUsersToday} sub="usuarios" />
      </div>
    </section>
  );
}

export function ZoneHealthCard({ pulse }) {
  if (!pulse?.zoneStatus) return null;
  const pct = pulse.zoneStatus.totalCount
    ? Math.round((pulse.zoneStatus.openCount / pulse.zoneStatus.totalCount) * 100)
    : 0;

  return (
    <SurfaceCard variant="highlight" className="border-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary-dark">Estado de zona</p>
          <p className="text-subheading mt-1 text-secondary">
            {pulse.zoneStatus.openCount} de {pulse.zoneStatus.totalCount} {STORE.manyLower} abiertas
          </p>
        </div>
        <p className="text-2xl font-black text-primary">{pct}%</p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </SurfaceCard>
  );
}

export function ActiveOffersStrip({ businessPromos, profile }) {
  const promos = businessPromos ?? [];
  const welcomeUsed = !!profile?.welcome_delivery_used_at;
  const welcomeReady = !!profile?.document_number && !welcomeUsed;

  if (!promos.length && welcomeUsed) return null;

  return (
    <section>
      <h2 className="section-title mb-1">Ofertas activas</h2>
      <p className="mb-3 text-sm text-muted">
        Cada tienda define su promo. Urabapp regala la primera entrega al validar tu cédula.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:gap-3 lg:overflow-x-auto lg:hide-scrollbar lg:pb-1 lg:snap-x lg:snap-mandatory">
        {!welcomeUsed && (
          <Link
            to="/cuenta/perfil"
            className={`min-w-0 snap-start overflow-hidden rounded-2xl p-4 shadow-card lg:min-w-[220px] lg:shrink-0 ${
              welcomeReady
                ? 'bg-gradient-to-br from-primary to-emerald-600 text-white'
                : 'bg-gradient-to-br from-sky-100 to-primary/20 text-foreground ring-1 ring-primary/20 dark:from-sky-950/40 dark:to-primary/20'
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-90">Bienvenida Urabapp</p>
            <p className="mt-1 text-lg font-black leading-tight">{WELCOME_BENEFIT.title}</p>
            <p className="mt-1 text-sm font-medium opacity-90">
              {welcomeReady
                ? `Listo en tu primer pedido desde ${formatCOP(WELCOME_BENEFIT.minOrder)}`
                : `Registra tu cédula · mín. ${formatCOP(WELCOME_BENEFIT.minOrder)}`}
            </p>
            <p className="mt-2 text-xs opacity-80">El mensajero recibe bono de pago de Urabapp</p>
          </Link>
        )}
        {promos.map((b) => {
          const promoText = formatBusinessPromoText(b);
          if (!promoText) return null;
          return (
            <Link
              key={b.id}
              to={`/tienda/${b.slug || b.id}`}
              className="min-w-0 snap-start overflow-hidden rounded-2xl bg-gradient-to-br from-accent/90 to-amber-400 p-4 text-amber-950 shadow-card lg:min-w-[220px] lg:shrink-0"
            >
              <p className="text-[10px] font-bold uppercase tracking-wide opacity-80">{STORE.promo}</p>
              <p className="mt-1 text-lg font-black leading-tight">{b.name}</p>
              <p className="mt-1 text-sm font-semibold opacity-90">{promoText}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/** @deprecated Usar ActiveOffersStrip */
export function ActiveCouponsStrip({ coupons }) {
  if (!coupons?.length) return null;

  return (
    <section>
      <h2 className="section-title mb-3">Ofertas activas</h2>
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 snap-x snap-mandatory">
        {coupons.map((c) => (
          <div
            key={c.code}
            className="min-w-[200px] shrink-0 snap-start overflow-hidden rounded-2xl bg-gradient-to-br from-accent/90 to-amber-400 p-4 text-amber-950 shadow-card"
          >
            <p className="font-mono text-lg font-black">{c.code}</p>
            <p className="mt-1 text-sm font-semibold opacity-90">
              {c.discount_type === 'percent'
                ? `${c.discount_value}% de descuento`
                : `${formatCOP(c.discount_value)} off`}
              {c.min_order ? ` · mín ${formatCOP(c.min_order)}` : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
