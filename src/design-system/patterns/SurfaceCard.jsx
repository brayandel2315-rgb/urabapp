import { cn } from '@/lib/utils';

const VARIANTS = {
  default: 'bg-card ring-border/50',
  highlight: 'bg-primary-light/30 ring-primary/20',
  sky: 'bg-sky-light/60 ring-sky/25',
  muted: 'bg-muted/40 ring-border/40',
  accent: 'bg-accent/15 ring-accent/30',
  brand: 'bg-gradient-to-br from-sky-light/80 to-card ring-primary/15',
};

export function SurfaceCard({
  children,
  className,
  variant = 'default',
  padding = true,
  as: Comp = 'div',
  ...props
}) {
  return (
    <Comp
      className={cn(
        'overflow-hidden rounded-[var(--radius-component)] shadow-card ring-1',
        VARIANTS[variant] || VARIANTS.default,
        padding && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function SectionTitle({ children, className, action }) {
  return (
    <div className={cn('mb-3 flex items-center justify-between gap-2', className)}>
      <h2 className="font-display text-lg font-bold text-foreground">{children}</h2>
      {action}
    </div>
  );
}
