import { motion } from 'motion/react';
import StickerIcon from '@/design-system/stickers/StickerIcon';
import AppIcon from '@/design-system/icons/AppIcon';
import { COURIER_CLIENT_JOURNEY, SHIPMENT_CLIENT_JOURNEY } from '@/data/service-journey';
import { cn } from '@/lib/utils';
import { spring } from '@/design-system/motion/presets';

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
          <h2 className="font-display text-lg font-bold text-foreground">
            Tu viaje, paso a paso
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
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
                  className="absolute left-[calc(50%+1.75rem)] top-7 hidden h-0.5 w-[calc(100%-3.5rem)] bg-border sm:block"
                  aria-hidden
                />
              )}
              {!isLast && (
                <span
                  className={cn(
                    'absolute right-0 top-7 h-0.5 w-4 translate-x-1/2 bg-border sm:hidden',
                    (isPast || isActive) && 'bg-primary/40',
                  )}
                  aria-hidden
                />
              )}

              <motion.div
                layout
                animate={isActive ? { scale: 1.04 } : { scale: 1 }}
                transition={spring}
                className={cn(
                  'relative z-10 flex h-14 w-14 items-center justify-center rounded-[var(--radius-component)] border-2 bg-card shadow-card transition-colors',
                  isActive && 'border-primary bg-primary/10 shadow-soft',
                  isPast && 'border-primary/50 bg-primary/5',
                  !isActive && !isPast && 'border-border',
                )}
              >
                {isActive && (
                  <span
                    className="pointer-events-none absolute -inset-1 rounded-[calc(var(--radius-component)+4px)] ring-2 ring-primary/30"
                    aria-hidden
                  />
                )}
                <StickerIcon name={step.sticker} size="lg" animated={isActive} />
                <span
                  className={cn(
                    'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    isActive || isPast ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
                  )}
                >
                  {i + 1}
                </span>
              </motion.div>

              <p className={cn(
                'mt-2 text-center text-xs font-bold leading-tight',
                isActive ? 'text-primary' : 'text-foreground',
              )}
              >
                {step.title}
              </p>
              {!compact && (
                <p className="mt-0.5 line-clamp-2 text-center text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
                  {step.caption}
                </p>
              )}
            </li>
          );
        })}
      </ol>

      {activeIdx >= 0 && (
        <motion.p
          key={steps[activeIdx]?.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className="flex items-center gap-1.5 rounded-[var(--radius-component)] bg-primary/10 px-3 py-2 text-xs font-medium text-foreground sm:text-sm"
        >
          <AppIcon name="check" size="xs" className="text-primary" />
          Ahora: {steps[activeIdx]?.title}
        </motion.p>
      )}
    </section>
  );
}
