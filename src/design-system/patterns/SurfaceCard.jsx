import { cn } from '@/lib/utils';

const VARIANTS = {
  default: 'bg-card',
  highlight: 'bg-[color-mix(in_srgb,var(--brand-primary)_6%,white)]',
  sky: 'bg-muted',
  muted: 'bg-muted',
  accent: 'bg-[color-mix(in_srgb,var(--brand-secondary)_12%,white)]',
  brand: 'bg-card',
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
        'overflow-hidden rounded-[var(--radius-component)] border border-border shadow-soft',
        VARIANTS[variant] || VARIANTS.default,
        padding && 'p-6',
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
      <h2 className="urab-section-title">{children}</h2>
      {action}
    </div>
  );
}
