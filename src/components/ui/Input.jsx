import { Input as DSInput } from '@/design-system/ui/input';
import { Label } from '@/design-system/ui/label';
import { cn } from '@/lib/utils';

export default function Input({ label, className = '', id, ...props }) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <DSInput id={inputId} {...props} />
    </div>
  );
}
