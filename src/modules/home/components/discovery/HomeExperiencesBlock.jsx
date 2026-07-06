import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { tween } from '@/design-system/motion/presets';

const EXPERIENCES = [
  {
    id: 'rapida',
    title: 'Entrega rápida',
    description: 'Pedidos locales con mensajero en minutos.',
    emoji: '⚡',
    to: '/restaurantes',
    gradient: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'inter',
    title: 'Intermunicipal',
    description: 'Paquetes entre municipios del Urabá.',
    emoji: '🚚',
    to: '/envios',
    gradient: 'from-teal-600 to-teal-900',
  },
  {
    id: 'programado',
    title: 'Programado',
    description: 'Agenda tu mandado o compra para más tarde.',
    emoji: '📅',
    to: '/mandado',
    gradient: 'from-blue-600 to-indigo-800',
  },
];

export default function HomeExperiencesBlock({ className }) {
  return (
    <section aria-labelledby="home-experiences-title" className={cn('min-w-0', className)}>
      <h2 id="home-experiences-title" className="font-display text-xl font-bold text-foreground">
        Pídelo y te lo acercamos
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">Experiencias disponibles en UrabApp</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {EXPERIENCES.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...tween, delay: i * 0.06 }}
          >
            <Link
              to={exp.to}
              className={cn(
                'flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br p-4 text-white shadow-soft transition hover:scale-[1.01] hover:shadow-lift',
                exp.gradient,
              )}
            >
              <span className="text-2xl" aria-hidden>{exp.emoji}</span>
              <div className="mt-4">
                <p className="font-display text-base font-bold">{exp.title}</p>
                <p className="mt-1 text-xs text-white/85">{exp.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
