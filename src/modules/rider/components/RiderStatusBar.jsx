import { cn } from '@/lib/utils';
import { COURIER_AVAILABILITY } from '../constants';

export default function RiderStatusBar({ mode = 'offline', onChange, loading, disabled }) {
  const isOnline = mode === 'available';
  const isPaused = mode === 'paused';

  const toggleOnline = () => {
    if (disabled || loading) return;
    onChange?.(isOnline ? 'offline' : 'available');
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={disabled || loading}
        onClick={toggleOnline}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border-2 p-4 text-left transition-all',
          isOnline
            ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]'
            : 'border-border/70 bg-card hover:border-primary/30',
          disabled && 'opacity-50',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={cn('text-lg font-bold', isOnline ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground')}>
              {isOnline ? 'En línea' : 'Desconectado'}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {isOnline
                ? 'Recibes pedidos en tu zona'
                : disabled
                  ? 'Completa tu registro para conectarte'
                  : 'Toca para empezar a recibir pedidos'}
            </p>
          </div>
          <div
            className={cn(
              'relative h-10 w-[4.5rem] shrink-0 rounded-full transition-colors',
              isOnline ? 'bg-emerald-500' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'absolute top-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform',
                isOnline ? 'left-[calc(100%-2.25rem)]' : 'left-1',
              )}
            />
          </div>
        </div>
      </button>

      {isOnline && (
        <button
          type="button"
          disabled={loading}
          onClick={() => onChange?.(isPaused ? 'available' : 'paused')}
          className={cn(
            'w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
            isPaused
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border/60 bg-card text-muted-foreground hover:text-foreground',
          )}
        >
          {isPaused ? COURIER_AVAILABILITY.paused.label : 'Pausar un momento'}
          {!isPaused && (
            <span className="ml-1 font-normal text-muted-foreground">— {COURIER_AVAILABILITY.paused.description}</span>
          )}
        </button>
      )}
    </div>
  );
}
