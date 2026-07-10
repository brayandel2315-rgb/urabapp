import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { tween } from '@/design-system/motion/presets';
import { cn } from '@/lib/utils';
import HeroDashboardIcon from './HeroDashboardIcon';

function StatCard({ children, className, delay = 0, href, accent }) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...tween, delay }}
      className={cn(
        'hero-dash-card flex min-h-[120px] flex-col justify-between rounded-[22px] border p-4',
        accent === 'stores' && 'hero-dash-card--stores',
        accent === 'delivery' && 'hero-dash-card--delivery',
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

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard delay={0.05} href="/restaurantes" accent="stores">
        <HeroDashboardIcon id="stores" />
        <div>
          <p className="font-display text-sm font-bold text-[#111111]">Tiendas abiertas</p>
          <p className="mt-2 text-3xl font-black tabular-nums leading-none text-[#2E7D32]">{openCount}</p>
          <p className="mt-1 text-[11px] font-medium text-[#4B5563]">en {municipio}</p>
        </div>
      </StatCard>

      <StatCard delay={0.1} accent="delivery">
        <HeroDashboardIcon id="delivery" />
        <div>
          <p className="font-display text-sm font-bold text-[#111111]">Entrega en zona</p>
          <p className="mt-2 text-3xl font-black tabular-nums leading-none text-[#2E7D32]">
            ~{eta}
            <span className="ml-1 text-lg font-bold">min</span>
          </p>
          <p className="mt-1 text-[11px] font-medium text-[#4B5563]">
            {activeOrders > 0 ? `${activeOrders} pedido${activeOrders !== 1 ? 's' : ''} en curso` : 'Operando ahora'}
          </p>
        </div>
      </StatCard>

      <StatCard delay={0.15} className="col-span-2" accent="delivery">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm font-bold text-[#111111]">Confianza UrabApp</p>
            <p className="mt-1 text-xs text-[#4B5563]">⭐ 4.9 · +320 comercios · Pago seguro</p>
          </div>
          <div className="flex gap-2 text-lg" aria-hidden>
            <span>🏪</span>
            <span>🏍️</span>
            <span>✅</span>
          </div>
        </div>
      </StatCard>
    </div>
  );
}
