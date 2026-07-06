import { cn } from '@/lib/utils';

const ZONES = [
  { id: 'comida', label: 'Restaurantes', key: 'comida' },
  { id: 'mercado', label: 'Mercados', key: 'mercado' },
  { id: 'mandados', label: 'Mensajería', key: 'mandados', always: true },
  { id: 'envios', label: 'Envíos', key: 'envios', always: true },
];

export default function HomeZoneCoverage({ categoryCounts = {}, className }) {
  const available = ZONES.filter((z) => z.always || (categoryCounts[z.key] ?? 0) > 0);

  if (!available.length) return null;

  return (
    <div className={cn('mt-4', className)}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
        Disponible para tu zona
      </p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {available.map((z) => (
          <li
            key={z.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
          >
            <span className="text-emerald-300" aria-hidden>✓</span>
            {z.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
