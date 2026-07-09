import { cn } from '@/lib/utils';

const DEFAULT_CHIPS = ['Arepas', 'Farmacia 24h', 'Mandado', 'Pizza', 'Mercado', 'Licores'];

export default function HomeTrendingChips({ chips = [], onSelect, className, compact = false }) {
  const items = chips.length ? chips : DEFAULT_CHIPS;

  if (!items.length) return null;

  return (
    <section aria-labelledby="home-trending-title" className={cn('min-w-0', className)}>
      {!compact && (
        <>
          <h2 id="home-trending-title" className="font-display text-lg font-bold text-[#0D2B45]">
            Lo que está moviendo Urabá
          </h2>
          <p className="mb-3 text-sm text-[#4A6278]">Tendencias basadas en búsquedas reales</p>
        </>
      )}
      {compact && (
        <p id="home-trending-title" className="mb-2 text-xs font-bold uppercase tracking-wide text-[#4A6278]">
          Populares en tu zona
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {items.slice(0, compact ? 4 : items.length).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => onSelect?.(chip)}
            className="rounded-full border border-[#D5E3EF] bg-[#E6F4FF]/60 px-3 py-1.5 text-xs font-semibold text-[#0D2B45] transition-colors hover:border-[#28B463]/40 hover:bg-[#E6F4FF] active:bg-[#D5EBFF]"
          >
            {chip}
          </button>
        ))}
      </div>
    </section>
  );
}
