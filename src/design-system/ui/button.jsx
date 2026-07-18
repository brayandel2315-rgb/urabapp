import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'rounded-[var(--radius-component)]',
    'transition-[transform,background-color,box-shadow,border-color] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    'min-h-[var(--touch-min)]',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/90',
        outline:
          'border-2 border-foreground/12 bg-background text-foreground hover:bg-muted',
        ghost: 'hover:bg-muted hover:text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        link: 'text-primary underline-offset-4 hover:underline min-h-0 rounded-none',
        accent:
          'bg-accent text-accent-foreground shadow-soft hover:bg-accent/90',
        urgency:
          'bg-[hsl(var(--urgency))] text-[hsl(var(--urgency-foreground))] shadow-soft hover:opacity-90',
        info:
          'bg-[hsl(var(--info))] text-[hsl(var(--info-foreground))] shadow-soft hover:opacity-90',
      },
      size: {
        default: 'h-11 px-5 text-sm',
        sm: 'h-9 min-h-9 rounded-[var(--radius-lg)] px-3 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-11 w-11 min-h-[var(--touch-min)] p-0',
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
