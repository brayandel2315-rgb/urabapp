import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { toast as sonnerToast } from 'sonner';

const TYPE_STYLES = {
  success: {
    icon: 'check',
    iconWrap: 'bg-primary/15 text-primary ring-primary/25',
    accent: 'border-l-primary',
  },
  error: {
    icon: 'alert',
    iconWrap: 'bg-destructive/12 text-destructive ring-destructive/20',
    accent: 'border-l-destructive',
  },
  warning: {
    icon: 'map',
    iconWrap: 'bg-amber-500/15 text-amber-700 ring-amber-500/25 dark:text-amber-300',
    accent: 'border-l-amber-500',
  },
  info: {
    icon: 'help',
    iconWrap: 'bg-sky-500/12 text-sky-800 ring-sky-500/20 dark:text-sky-200',
    accent: 'border-l-sky-500',
  },
  trust: {
    icon: 'verified',
    iconWrap: 'bg-secondary/10 text-secondary ring-secondary/20 dark:text-sky-100',
    accent: 'border-l-secondary',
  },
};

export function UrabappToast({
  toastId,
  title,
  description,
  type = 'info',
  trust,
  action,
}) {
  const style = TYPE_STYLES[type] || TYPE_STYLES.info;

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-[min(100vw-1.5rem,22rem)] gap-3 rounded-2xl border border-border/70',
        'border-l-[3px] bg-card/95 p-3.5 shadow-lift backdrop-blur-md',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        style.accent,
      )}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1',
          style.iconWrap,
        )}
      >
        <AppIcon name={style.icon} size="sm" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        {(trust || type === 'trust') && (
          <p className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <AppIcon name="verified" size="xs" className="text-primary" />
            {trust || 'Urabapp · confiable'}
          </p>
        )}
        <p className="font-display text-sm font-bold leading-snug text-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        )}
        {action?.label && (
          <button
            type="button"
            className="mt-2.5 text-xs font-bold text-primary hover:underline"
            onClick={() => {
              action.onClick?.();
              sonnerToast.dismiss(toastId);
            }}
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        type="button"
        className="shrink-0 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Cerrar"
        onClick={() => sonnerToast.dismiss(toastId)}
      >
        <AppIcon name="close" size="xs" />
      </button>
    </div>
  );
}
