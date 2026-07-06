import { SHIPMENT_STATUS, SHIPMENT_STATUS_FLOW } from '@/data/shipment-catalog';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

export default function ShipmentStatusSteps({ status, className }) {
  const currentIdx = SHIPMENT_STATUS_FLOW.indexOf(status);
  const isCancelled = status === 'cancelled';

  return (
    <ol className={cn('space-y-0', className)}>
      {SHIPMENT_STATUS_FLOW.map((step, idx) => {
        const done = currentIdx > idx || status === 'completed';
        const active = step === status;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                  done && 'bg-primary text-primary-foreground',
                  active && !done && 'bg-primary/15 text-primary ring-2 ring-primary',
                  !done && !active && 'bg-muted text-muted-foreground'
                )}
              >
                {done ? <AppIcon name="check" size="xs" /> : idx + 1}
              </span>
              {idx < SHIPMENT_STATUS_FLOW.length - 1 && (
                <span className={cn('my-1 w-0.5 flex-1 min-h-[1.25rem]', done ? 'bg-primary' : 'bg-border')} />
              )}
            </div>
            <div className="pb-4 pt-1">
              <p className={cn('text-sm font-semibold', active ? 'text-foreground' : 'text-muted-foreground')}>
                {SHIPMENT_STATUS[step]}
              </p>
            </div>
          </li>
        );
      })}
      {isCancelled && (
        <p className="text-sm font-semibold text-destructive">Envío cancelado</p>
      )}
    </ol>
  );
}
