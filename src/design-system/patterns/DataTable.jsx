import { cn } from '@/lib/utils';
import { Skeleton } from '@/design-system/ui/skeleton';
import { PageState } from '@/design-system/patterns/PageState';

export function DataTable({ columns, rows, isLoading, emptyTitle, emptyDescription, className }) {
  if (isLoading) {
    return (
      <div className={cn('overflow-hidden rounded-2xl border border-border', className)}>
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              {columns.map((col) => (
                <Skeleton key={col.key} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!rows?.length) {
    return (
      <PageState
        type="empty"
        title={emptyTitle || 'Sin registros'}
        description={emptyDescription}
        className="py-10"
      />
    );
  }

  return (
    <div className={cn('overflow-x-auto rounded-2xl border border-border', className)}>
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-semibold text-muted-foreground">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={row.id ?? i} className="transition-colors hover:bg-muted/30">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
