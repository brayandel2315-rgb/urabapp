import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { CHECKOUT_STEPS } from '../constants';

const STEP_ICONS = {
  map: 'map',
  card: 'card',
  check: 'check',
};

export default function CheckoutStepper({ currentStep, onStepClick, completedSteps = [] }) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Pasos del checkout" className="rounded-xl border border-border/40 bg-card/80 p-2">
      <div className="flex items-center">
        {CHECKOUT_STEPS.map((step, index) => {
          const done = completedSteps.includes(step.id) || index < currentIndex;
          const active = step.id === currentStep;
          const clickable = (done || index <= currentIndex) && onStepClick && index < currentIndex;

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick(step.id)}
                className={cn(
                  'flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center transition-colors',
                  clickable && 'cursor-pointer hover:bg-muted/50',
                  !clickable && 'cursor-default'
                )}
              >
                <span
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
                    active && 'border-primary bg-primary text-primary-foreground shadow-soft',
                    done && !active && 'border-primary/30 bg-primary/10 text-primary',
                    !done && !active && 'border-border bg-muted/30 text-muted-foreground'
                  )}
                >
                  {done && !active ? (
                    <AppIcon name="check" size="sm" />
                  ) : (
                    <AppIcon name={STEP_ICONS[step.icon] || 'map'} size="sm" />
                  )}
                </span>
                <span
                  className={cn(
                    'truncate text-[10px] font-semibold uppercase tracking-wide sm:text-xs',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </button>
              {index < CHECKOUT_STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-1 h-0.5 w-full max-w-[2.5rem] shrink rounded-full',
                    index < currentIndex ? 'bg-primary' : 'bg-border'
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
