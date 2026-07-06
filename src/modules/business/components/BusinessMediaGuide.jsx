import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

export default function BusinessMediaGuide({ spec, className }) {
  if (!spec) return null;

  return (
    <div className={cn('rounded-xl border border-border/70 bg-muted/30 p-3 text-xs', className)}>
      <div className="flex items-start gap-2">
        <AppIcon name="headset" size="xs" className="mt-0.5 shrink-0 text-primary" />
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-foreground">
            {spec.label}
            {spec.required ? ' · obligatorio' : ' · recomendado'}
          </p>
          <p className="text-muted-foreground">
            Formato {spec.ratio} · {spec.hint}
          </p>
          <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
            {spec.tips?.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
