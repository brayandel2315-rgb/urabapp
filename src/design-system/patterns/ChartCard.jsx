import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/design-system/ui/card';
import { Skeleton } from '@/design-system/ui/skeleton';

export function ChartCard({ title, description, icon = 'chart', children, isLoading, className, footer }) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
          <AppIcon name={icon} size="sm" className="text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ) : children || (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            Sin datos para mostrar
          </div>
        )}
        {footer && <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  );
}
