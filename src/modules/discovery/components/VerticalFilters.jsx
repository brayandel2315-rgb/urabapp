import { cn } from '@/lib/utils';

export const VERTICAL_FILTER_OPTIONS = [
  { id: 'all', label: 'Todos' },
  { id: 'abiertos', label: 'Abiertos ahora' },
  { id: 'rapida', label: 'Entrega rápida' },
  { id: 'ofertas', label: 'Con oferta' },
  { id: 'cerca', label: 'Cerca de ti' },
];

export default function VerticalFilters({ value = 'all', onChange, className }) {
  return (
    <div
      className={cn('flex gap-2 overflow-x-auto hide-scrollbar pb-0.5', className)}
      role="tablist"
      aria-label="Filtros de comercios"
    >
      {VERTICAL_FILTER_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          role="tab"
          aria-selected={value === opt.id}
          onClick={() => onChange?.(opt.id)}
          className={cn(
            'urab-chip-tab shrink-0 text-xs',
            value === opt.id
              ? 'urab-chip-tab--active shadow-soft'
              : 'urab-chip-tab--idle border border-border',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
