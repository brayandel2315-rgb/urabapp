import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { INTERMUNICIPAL_ROUTES } from '@/utils/constants';
import { tween } from '@/design-system/motion/presets';
import { cn } from '@/lib/utils';
import HeroDashboardIcon from './HeroDashboardIcon';

const CARD_ACCENTS = {
  delivery: 'hero-dash-card--delivery',
  stores: 'hero-dash-card--stores',
  shipments: 'hero-dash-card--shipments',
  offer: 'hero-dash-card--offer',
};

function GlassCard({ children, className, delay = 0, href, accent }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...tween, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'hero-dash-card flex h-full min-h-[132px] flex-col justify-between rounded-[22px] border p-4 backdrop-blur-xl transition-shadow',
        CARD_ACCENTS[accent],
        className,
      )}
    >
      {children}
    </motion.div>
  );
  if (href) {
    return (
      <Link to={href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default function HomeHeroDashboard({ pulse, municipio }) {
  const activeOrders = pulse?.activeOrders ?? 0;
  const eta = pulse?.avgDeliveryMin ?? pulse?.avgBizDelivery ?? 25;
  const openCount = pulse?.openBusinessesCount ?? 0;
  const shipmentsToday = pulse?.shipmentsToday ?? 0;
  const route = INTERMUNICIPAL_ROUTES.find((r) => r.from === municipio || r.to === municipio)
    || INTERMUNICIPAL_ROUTES[0];
  const topPromo = pulse?.businessPromos?.[0] || pulse?.activeCoupons?.[0];
  const promoLabel = topPromo?.promo_discount_value
    ? `${topPromo.promo_discount_value}${topPromo.promo_discount_type === 'percent' ? '%' : ''} OFF`
    : topPromo?.title
      ? topPromo.title.slice(0, 22)
      : topPromo?.name
        ? topPromo.name.slice(0, 18)
        : 'Ver ofertas';

  return (
    <div className="grid min-h-[300px] grid-cols-2 gap-3 sm:gap-4">
      <GlassCard delay={0.05} accent="delivery">
        <div className="flex items-start justify-between gap-2">
          <HeroDashboardIcon id="delivery" />
          <span className="rounded-full bg-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-200">
            En vivo
          </span>
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">Entrega rápida</p>
          <p className="mt-2 text-2xl font-black tabular-nums leading-none text-white">{activeOrders}</p>
          <p className="mt-1 text-[11px] font-medium text-white/75">pedidos activos</p>
          <p className="mt-1.5 inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-200">
            ETA ~{eta} min
          </p>
        </div>
      </GlassCard>

      <GlassCard delay={0.12} href="/restaurantes" accent="stores">
        <div className="flex items-start justify-between gap-2">
          <HeroDashboardIcon id="stores" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">Tiendas abiertas</p>
          <p className="mt-2 text-2xl font-black tabular-nums leading-none text-white">{openCount}</p>
          <p className="mt-1 text-[11px] font-medium text-white/75">disponibles ahora</p>
        </div>
      </GlassCard>

      <GlassCard delay={0.18} href="/envios" accent="shipments">
        <div className="flex items-start justify-between gap-2">
          <HeroDashboardIcon id="shipments" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">Envíos hoy</p>
          <p className="mt-2 text-2xl font-black tabular-nums leading-none text-white">
            {shipmentsToday}
          </p>
          <p className="mt-1 text-[11px] font-medium text-white/75">
            {route.from} → {route.to}
          </p>
        </div>
      </GlassCard>

      <GlassCard delay={0.24} href="/ofertas" accent="offer">
        <div className="flex items-start justify-between gap-2">
          <HeroDashboardIcon id="offer" />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">Oferta del día</p>
          <p className="mt-2 text-xl font-black leading-none text-amber-300">{promoLabel}</p>
        </div>
      </GlassCard>
    </div>
  );
}
