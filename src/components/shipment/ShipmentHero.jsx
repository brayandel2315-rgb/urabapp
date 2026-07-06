import AppIcon from '@/design-system/icons/AppIcon';
import { SHIPMENT_HERO_TRUST } from '@/data/shipment-catalog';
import { cn } from '@/lib/utils';

export default function ShipmentHero({ onCotizar, className }) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700 p-5 text-white shadow-card sm:p-6',
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" aria-hidden />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Urabá logística</p>
        <h1 className="font-display mt-2 text-2xl font-bold leading-tight sm:text-3xl">Envía entre municipios</h1>
        <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
          Envíos rápidos y seguros entre municipios de Urabá.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {SHIPMENT_HERO_TRUST.map((item) => (
            <li key={item} className="flex items-center gap-1.5 text-[11px] font-semibold text-white/95 sm:text-xs">
              <AppIcon name="check" size="xs" className="shrink-0 text-emerald-200" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {onCotizar && (
          <button
            type="button"
            onClick={onCotizar}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3.5 text-sm font-bold text-teal-800 shadow-lg transition hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
          >
            Cotizar envío
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </section>
  );
}
