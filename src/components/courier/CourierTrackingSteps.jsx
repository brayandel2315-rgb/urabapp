import { COURIER_TRACKING_STEPS, COURIER_PHASE } from '@/utils/courier-constants';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';

const PHASE_ORDER = Object.values(COURIER_PHASE);

export default function CourierTrackingSteps({ phase = 'searching', className }) {
  const currentIdx = Math.max(0, PHASE_ORDER.indexOf(phase));

  return (
    <ol className={cn('flex gap-1', className)}>
      {COURIER_TRACKING_STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={step.key} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all',
                done && 'bg-primary text-primary-foreground',
                active && 'bg-primary text-primary-foreground ring-4 ring-primary/25',
                !done && !active && 'bg-muted text-muted-foreground'
              )}
            >
              <AppIcon name={step.icon} size="xs" />
            </span>
            <span
              className={cn(
                'w-full truncate text-center text-[9px] font-bold leading-tight',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
