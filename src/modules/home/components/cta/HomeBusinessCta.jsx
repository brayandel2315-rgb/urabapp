import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { tween } from '@/design-system/motion/presets';

const BUSINESS_BENEFITS = [
  { icon: 'trend', text: 'Más ventas con delivery local' },
  { icon: 'users', text: 'Clientes de tu barrio y municipio' },
  { icon: 'store', text: 'Catálogo y pedidos en un solo panel' },
];

const RIDER_BENEFITS = [
  { icon: 'delivery', text: 'Entregas en tu municipio' },
  { icon: 'bolt', text: 'Ganancia por pedido completado' },
  { icon: 'mensajeria', text: 'Red de mensajeros Urabapp' },
];

function JoinCard({ title, description, benefits, to, ctaLabel, accent }) {
  return (
    <div className={`flex flex-col rounded-2xl border p-5 sm:p-6 ${accent}`}>
      <h3 className="font-display text-xl font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/80">{description}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {benefits.map((b) => (
          <li key={b.text} className="flex items-center gap-2 text-sm font-medium text-white/90">
            <AppIcon name={b.icon} size="sm" className="shrink-0 text-emerald-300" />
            {b.text}
          </li>
        ))}
      </ul>
      <Button asChild size="lg" className="mt-6 w-full rounded-2xl bg-white text-emerald-900 hover:bg-white/95">
        <Link to={to}>{ctaLabel}</Link>
      </Button>
    </div>
  );
}

export default function HomeBusinessCta() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={tween}
      aria-labelledby="home-join-network"
      className="space-y-4"
    >
      <div className="text-center sm:text-left">
        <h2 id="home-join-network" className="font-display text-2xl font-bold text-foreground">
          Únete a la red Urabapp
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vende con delivery local o reparte pedidos en tu zona del Urabá.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <JoinCard
          title="¿Tienes un negocio?"
          description="Registra tu tienda, sube productos y recibe pedidos con entrega local."
          benefits={BUSINESS_BENEFITS}
          to="/negocio/onboarding"
          ctaLabel="Registrar negocio"
          accent="border-white/10 bg-gradient-to-br from-slate-900 to-emerald-950"
        />
        <JoinCard
          title="¿Quieres ser mensajero?"
          description="Únete como domiciliario y conecta comercios con clientes de tu municipio."
          benefits={RIDER_BENEFITS}
          to="/domiciliario/registro"
          ctaLabel="Inscribirme como mensajero"
          accent="border-sky-500/20 bg-gradient-to-br from-slate-900 to-sky-950"
        />
      </div>
    </motion.section>
  );
}
