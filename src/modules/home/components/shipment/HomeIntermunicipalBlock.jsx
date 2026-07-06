import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { INTERMUNICIPAL_ROUTES } from '@/utils/constants';
import { formatCOP } from '@/utils/currency';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { tween } from '@/design-system/motion/presets';

export default function HomeIntermunicipalBlock({ originMunicipio }) {
  const routes = INTERMUNICIPAL_ROUTES.filter(
    (r) => r.from === originMunicipio || r.to === originMunicipio
  ).slice(0, 3);

  const featured = routes[0] || INTERMUNICIPAL_ROUTES[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={tween}
      aria-labelledby="home-intermunicipal-title"
      className="overflow-hidden rounded-3xl border border-teal-500/25 bg-gradient-to-br from-teal-950 via-teal-900/90 to-emerald-950 p-6 text-white shadow-soft sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-200/80">Envíos intermunicipales</p>
          <h2 id="home-intermunicipal-title" className="font-display mt-2 text-2xl font-bold">
            Desde {originMunicipio} a toda la región
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/75">
            Origen detectado automáticamente. Elige destino y activa el envío en segundos.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md">
          <AppIcon name="map" size="sm" className="text-teal-300" />
          Origen: {originMunicipio}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {(routes.length ? routes : INTERMUNICIPAL_ROUTES.slice(0, 3)).map((r) => (
          <div
            key={`${r.from}-${r.to}`}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
          >
            <p className="font-display text-lg font-bold">{r.from} → {r.to}</p>
            <p className="mt-2 text-sm text-teal-100">
              Desde {formatCOP(r.fee)}
            </p>
            <p className="text-xs text-white/60">~{r.etaHours}h estimado</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg" className="rounded-2xl bg-white text-teal-900 hover:bg-white/95">
          <Link to="/envios" state={{ origin: originMunicipio, dest: featured?.to }}>
            Cotizar envío intermunicipal
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl border-white/30 text-white hover:bg-white/10">
          <Link to="/mandado">Mandado local</Link>
        </Button>
      </div>
    </motion.section>
  );
}
