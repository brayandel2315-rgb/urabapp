import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'rounded-[var(--radius-btn)]',
    'transition-[transform,background-color,box-shadow,border-color,color] duration ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:bg-[var(--brand-disabled)] disabled:text-white disabled:opacity-100',
    'active:scale-[0.99]',
    'min-h-[var(--touch-min)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-[var(--brand-primary)] text-white shadow-none hover:bg-[var(--brand-primary-hover)]',
        secondary:
          'bg-secondary text-secondary-foreground shadow-none hover:bg-muted',
        outline:
          'border border-border bg-background text-foreground hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-[var(--brand-primary)] underline-offset-4 hover:underline min-h-0 rounded-none',
        accent:
          'bg-[var(--brand-secondary)] text-[var(--urab-charcoal)] shadow-none hover:opacity-90',
        urgency:
          'bg-[hsl(var(--urgency))] text-[hsl(var(--urgency-foreground))] shadow-none hover:opacity-90',
        info:
          'bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] shadow-none hover:opacity-90',
      },
      size: {
        default: 'h-12 px-5 text-sm font-semibold',
        sm: 'h-9 min-h-9 rounded-[var(--radius-lg)] px-3 text-xs font-semibold',
        lg: 'h-12 px-8 text-base font-semibold',
        icon: 'h-12 w-12 min-h-[var(--touch-min)] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';
