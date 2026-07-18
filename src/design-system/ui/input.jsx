import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-11 min-h-[var(--touch-min)] w-full',
      'rounded-[var(--radius-component)]',
      'border border-input bg-background px-4 py-2',
      'text-sm text-foreground shadow-soft',
      'transition-[border-color,box-shadow] duration-150',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary/40',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = 'Input';
