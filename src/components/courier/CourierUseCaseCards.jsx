import StickerIcon from '@/design-system/stickers/StickerIcon';
import { COURIER_USE_CASES } from '@/data/service-journey';
import { cn } from '@/lib/utils';

export default function CourierUseCaseCards({ onSelect, className }) {
  return (
    <section className={cn('space-y-2', className)} aria-label="Tipos de mandado">
      <h2 className="font-display text-base font-bold text-[#0D2B45]">¿Qué necesitas enviar?</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COURIER_USE_CASES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect?.(item.id)}
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#D5E3EF] bg-white p-3 text-center transition hover:border-[#0E6BA8]/40 hover:bg-[#E6F4FF]/40 active:scale-[0.98]"
          >
            <StickerIcon name={item.sticker} size="md" />
            <span className="text-xs font-bold text-[#0D2B45]">{item.label}</span>
            <span className="text-[10px] leading-tight text-[#4A6278]">{item.hint}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
