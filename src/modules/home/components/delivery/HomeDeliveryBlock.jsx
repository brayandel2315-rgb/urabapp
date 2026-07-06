import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatCOP } from '@/utils/currency';
import { homeDeliveryQuote } from '../../services/home-api.service';
import { toast } from '@/utils/toast';
import { tween } from '@/design-system/motion/presets';

export default function HomeDeliveryBlock({ municipio, onQuoted }) {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);

  const handleQuote = async () => {
    if (!pickup.trim() || !dropoff.trim()) {
      toast.error('Indica origen y destino');
      return;
    }
    setLoading(true);
    try {
      const result = await homeDeliveryQuote({ pickup, dropoff, municipio });
      setQuote(result);
      onQuoted?.(result);
    } catch (e) {
      toast.error(e.message || 'No pudimos cotizar el envío');
    } finally {
      setLoading(false);
    }
  };

  const continueMandado = () => {
    navigate('/mandado', { state: { pickup, dropoff, quote } });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={tween}
      aria-labelledby="home-delivery-title"
      className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-sky-light/60 via-card to-primary/5 p-5 shadow-soft sm:p-6"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <AppIcon name="mensajeria" size="md" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="home-delivery-title" className="font-display text-xl font-bold text-foreground">
            Mensajería
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Cotiza un envío local en segundos — sin salir del home.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Input label="Origen" placeholder="Ej: Centro, calle 100" value={pickup} onChange={(e) => setPickup(e.target.value)} />
        <Input label="Destino" placeholder="Ej: Laureles, barrio X" value={dropoff} onChange={(e) => setDropoff(e.target.value)} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={handleQuote} disabled={loading}>
          {loading ? 'Cotizando…' : 'Cotizar envío'}
        </Button>
        {quote && (
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="font-bold text-foreground">{formatCOP(quote.fare?.total)}</span>
            <span className="text-muted-foreground">~{quote.estimatedMinutes} min</span>
            <Button type="button" variant="outline" size="sm" onClick={continueMandado}>
              Continuar
            </Button>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        ¿Envío intermunicipal?{' '}
        <Link to="/envios" className="font-semibold text-primary hover:underline">
          Ver rutas Turbo ↔ Apartadó
        </Link>
      </p>
    </motion.section>
  );
}
