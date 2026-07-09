import { COURIER_BOOKING_STEPS, SHIPMENT_BOOKING_STEPS } from '@/data/service-journey';
import { cn } from '@/lib/utils';

const STEPS_BY_VARIANT = {
  courier: COURIER_BOOKING_STEPS,
  shipment: SHIPMENT_BOOKING_STEPS,
};

export default function ServiceBookingStepper({ variant = 'courier', currentStep = 'form', className }) {
  const steps = STEPS_BY_VARIANT[variant] || COURIER_BOOKING_STEPS;
  const currentIdx = Math.max(0, steps.findIndex((s) => s.id === currentStep));

  return (
    <nav aria-label="Progreso del pedido" className={cn('flex items-center gap-1', className)}>
      {steps.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="flex min-w-0 flex-1 items-center gap-1">
            <div className="flex min-w-0 flex-col items-center gap-1">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  done && 'bg-[#0E6BA8] text-white',
                  active && 'bg-[#0E6BA8] text-white ring-4 ring-[#0E6BA8]/20',
                  !done && !active && 'bg-[#E6F4FF] text-[#0E6BA8]',
                )}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={cn(
                  'w-full truncate text-center text-[10px] font-semibold',
                  active ? 'text-[#0E6BA8]' : 'text-[#4A6278]',
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  'mb-4 h-0.5 flex-1 rounded-full',
                  done ? 'bg-[#0E6BA8]' : 'bg-[#D5E3EF]',
                )}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
