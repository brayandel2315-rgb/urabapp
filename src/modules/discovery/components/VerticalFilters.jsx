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
            'shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors',
            value === opt.id
              ? 'bg-primary text-primary-foreground shadow-soft'
              : 'border border-border bg-card text-foreground hover:border-primary/40',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
