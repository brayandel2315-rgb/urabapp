import { cn } from '@/lib/utils';

export default function RiderOnboardingStepper({ step, total = 4 }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <div key={n} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                done && 'bg-primary text-primary-foreground',
                current && 'bg-primary/15 text-primary ring-2 ring-primary',
                !done && !current && 'bg-muted text-muted-foreground'
              )}
            >
              {done ? '✓' : n}
            </div>
            {n < total && (
              <div className={cn('h-0.5 flex-1 rounded', done ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        );
      })}
    </div>
  );
}
