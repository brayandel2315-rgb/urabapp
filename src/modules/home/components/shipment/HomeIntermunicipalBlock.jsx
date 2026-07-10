import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { INTERMUNICIPAL_ROUTES } from '@/utils/constants';
import { formatCOP } from '@/utils/currency';
import Button from '@/components/ui/Button';
import AppIcon from '@/design-system/icons/AppIcon';
import { tween } from '@/design-system/motion/presets';
import RegionalUrabaGoogleMap from './RegionalUrabaGoogleMap';

function RouteTile({ route, index }) {
  return (
    <motion.div
      className="home-regional-route"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...tween, delay: index * 0.06 }}
    >
      <div className="home-regional-route__top">
        <span className="home-regional-route__from">{route.from}</span>
        <span className="home-regional-route__arrow" aria-hidden>→</span>
        <span className="home-regional-route__to">{route.to}</span>
      </div>
      <div className="home-regional-route__meta">
        <span className="home-regional-route__price">Desde {formatCOP(route.fee)}</span>
        <span className="home-regional-route__eta">~{route.etaHours}h</span>
      </div>
    </motion.div>
  );
}

export default function HomeIntermunicipalBlock({ originMunicipio }) {
  const routes = INTERMUNICIPAL_ROUTES.filter(
    (r) => r.from === originMunicipio || r.to === originMunicipio,
  ).slice(0, 3);

  const displayRoutes = routes.length ? routes : INTERMUNICIPAL_ROUTES.slice(0, 3);
  const featured = displayRoutes[0] || INTERMUNICIPAL_ROUTES[0];
  const lowestFee = Math.min(...displayRoutes.map((r) => r.fee));

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={tween}
      aria-labelledby="home-intermunicipal-title"
      className="home-regional-hub"
    >
      <div className="home-regional-hub__glow" aria-hidden />
      <div className="home-regional-hub__inner">
        <div className="home-regional-hub__promo" aria-label="Oferta destacada">
          <AppIcon name="delivery" size="xs" />
          <span>
            Envíos intermunicipales desde <strong>{formatCOP(lowestFee)}</strong> · cotiza en segundos
          </span>
        </div>

        <div className="home-regional-hub__grid">
          <div className="home-regional-hub__copy">
            <div className="home-regional-hub__eyebrow">
              <span className="home-regional-hub__eyebrow-dot" aria-hidden />
              Llegamos a todo el Urabá
            </div>

            <h2 id="home-intermunicipal-title" className="home-regional-hub__title">
              Vende en {originMunicipio},
              <span className="home-regional-hub__title-accent"> entrega en los 7 municipios</span>
            </h2>

            <p className="home-regional-hub__lead">
              Paquetes, mercancía o encargos: salen hoy desde <strong>{originMunicipio}</strong>,
              llegan con precio cerrado, mensajero verificado y seguimiento en vivo. Sin sorpresas al pagar.
            </p>

            <ul className="home-regional-hub__trust" aria-label="Beneficios">
              <li>
                <AppIcon name="shield" size="xs" className="text-[#2E7D32]" />
                Precio fijo al cotizar
              </li>
              <li>
                <AppIcon name="delivery" size="xs" className="text-[#0E6BA8]" />
                Salida el mismo día
              </li>
              <li>
                <AppIcon name="map" size="xs" className="text-[#2E7D32]" />
                Rastreo en tiempo real
              </li>
            </ul>

            <div className="home-regional-hub__actions">
              <Button asChild size="lg" className="home-regional-hub__cta-primary">
                <Link to="/envios" state={{ origin: originMunicipio, dest: featured?.to }}>
                  Cotizar mi envío gratis →
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="home-regional-hub__cta-secondary">
                <Link to="/mandado">Pedir un mandado</Link>
              </Button>
            </div>
          </div>

          <RegionalUrabaGoogleMap originMunicipio={originMunicipio} />
        </div>

        <div className="home-regional-hub__routes-wrap">
          <div className="home-regional-hub__routes-head">
            <p className="home-regional-hub__routes-label">Rutas más pedidas</p>
            <span className="home-regional-hub__origin-chip">
              <AppIcon name="location" size="xs" />
              Salida: {originMunicipio}
            </span>
          </div>
          <div className="home-regional-hub__routes" role="list">
            {displayRoutes.map((route, i) => (
              <RouteTile key={`${route.from}-${route.to}`} route={route} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
