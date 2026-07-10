import { cn } from '@/lib/utils';

const DEFAULT_CHIPS = ['Hamburguesa', 'Mercado', 'Ibuprofeno', 'Enviar paquete', 'Turbo'];

export default function HomeTrendingChips({ chips = [], onSelect, className, compact = false }) {
  const items = chips.length ? chips : DEFAULT_CHIPS;

  if (!items.length) return null;

  return (
    <section aria-labelledby="home-trending-title" className={cn('min-w-0', className)}>
      {!compact && (
        <>
          <h2 id="home-trending-title" className="font-display text-lg font-black text-[#111111]">
            Lo que está moviendo Urabá
          </h2>
          <p className="mb-3 text-sm text-[#4B5563]">Tendencias basadas en búsquedas reales</p>
        </>
      )}
      {compact && (
        <p id="home-trending-title" className="mb-2 text-xs font-bold uppercase tracking-wide text-[#4B5563]">
          Búsquedas frecuentes
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {items.slice(0, compact ? 5 : items.length).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSelect?.(chip)}
            className="home-quick-chip"
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
}
