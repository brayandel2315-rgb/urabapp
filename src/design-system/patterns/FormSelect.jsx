import { cn } from '@/lib/utils';
import { Label } from '@/design-system/ui/label';

export default function FormSelect({ label, hint, className, children, id, ...props }) {
  const selectId = id || label?.toLowerCase?.().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && <Label htmlFor={selectId}>{label}</Label>}
      <select
        id={selectId}
        className={cn(
          'flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
