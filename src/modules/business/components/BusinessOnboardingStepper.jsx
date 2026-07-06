import { ONBOARDING_STEPS } from '@/utils/business-registration';
import { cn } from '@/lib/utils';

export default function BusinessOnboardingStepper({ step }) {
  return (
    <div className="flex flex-wrap gap-2">
      {ONBOARDING_STEPS.map(({ id, label }) => {
        const active = step === id;
        const done = step > id;
        return (
          <div
            key={id}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors',
              active && 'bg-primary text-primary-foreground',
              done && !active && 'bg-primary/15 text-primary',
              !active && !done && 'bg-muted text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-5 w-5 items-center justify-center rounded-full text-[10px]',
                active && 'bg-primary-foreground/20',
                done && !active && 'bg-primary/20',
                !active && !done && 'bg-background',
              )}
            >
              {done ? '✓' : id}
            </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}
