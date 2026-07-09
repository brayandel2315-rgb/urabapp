import StickerIcon from '@/design-system/stickers/StickerIcon';
import AppIcon from '@/design-system/icons/AppIcon';
import { COURIER_CLIENT_JOURNEY, SHIPMENT_CLIENT_JOURNEY } from '@/data/service-journey';
import { cn } from '@/lib/utils';

const JOURNEY_BY_VARIANT = {
  courier: COURIER_CLIENT_JOURNEY,
  shipment: SHIPMENT_CLIENT_JOURNEY,
};

export default function ServiceJourneyShowcase({
  variant = 'courier',
  activeStep,
  className,
  compact = false,
}) {
  const steps = JOURNEY_BY_VARIANT[variant] || COURIER_CLIENT_JOURNEY;
  const activeIdx = activeStep ? steps.findIndex((s) => s.id === activeStep) : -1;

  return (
    <section className={cn('space-y-3', className)} aria-label="Cómo funciona el servicio">
      {!compact && (
        <div>
          <h2 className="font-display text-lg font-bold text-[#0D2B45]">
            Tu viaje, paso a paso
          </h2>
          <p className="mt-0.5 text-sm text-[#4A6278]">
            Desde que pides el servicio hasta que llega a destino
          </p>
        </div>
      )}

      <ol className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar snap-x snap-mandatory sm:gap-0 sm:overflow-visible sm:pb-0">
        {steps.map((step, i) => {
          const isActive = i === activeIdx;
          const isPast = activeIdx >= 0 && i < activeIdx;
          const isLast = i === steps.length - 1;

          return (
            <li
              key={step.id}
              className={cn(
                'relative flex min-w-[7.25rem] flex-1 snap-center flex-col items-center sm:min-w-0',
                !isLast && 'sm:pr-2',
              )}
            >
              {!isLast && (
                <span
                  className="absolute left-[calc(50%+1.75rem)] top-7 hidden h-0.5 w-[calc(100%-3.5rem)] bg-[#D5E3EF] sm:block"
                  aria-hidden
                />
              )}
              {!isLast && (
                <span
                  className={cn(
                    'absolute right-0 top-7 h-0.5 w-4 translate-x-1/2 bg-[#D5E3EF] sm:hidden',
                    isPast || isActive ? 'bg-[#0E6BA8]/40' : '',
                  )}
                  aria-hidden
                />
              )}

              <div
                className={cn(
                  'relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-white shadow-card transition-colors',
                  isActive && 'border-[#0E6BA8] bg-[#E6F4FF]',
                  isPast && 'border-[#0E6BA8]/50 bg-[#E6F4FF]/60',
                  !isActive && !isPast && 'border-[#D5E3EF]',
                )}
              >
                <StickerIcon name={step.sticker} size="lg" animated={isActive} />
                <span
                  className={cn(
                    'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    isActive || isPast ? 'bg-[#0E6BA8] text-white' : 'bg-[#E6F4FF] text-[#0E6BA8]',
                  )}
                >
                  {i + 1}
                </span>
              </div>

              <p className={cn(
                'mt-2 text-center text-xs font-bold leading-tight',
                isActive ? 'text-[#0E6BA8]' : 'text-[#0D2B45]',
              )}
              >
                {step.title}
              </p>
              {!compact && (
                <p className="mt-0.5 line-clamp-2 text-center text-[10px] leading-snug text-[#4A6278] sm:text-[11px]">
                  {step.caption}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {activeIdx >= 0 && (
        <p className="flex items-center gap-1.5 rounded-xl bg-[#E6F4FF]/70 px-3 py-2 text-xs font-medium text-[#0D2B45] sm:text-sm">
          <AppIcon name="check" size="xs" className="text-[#0E6BA8]" />
          Ahora: {steps[activeIdx]?.title}
        </p>
      )}
    </section>
  );
}
