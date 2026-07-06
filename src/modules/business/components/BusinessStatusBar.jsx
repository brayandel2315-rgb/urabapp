import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { buildBusinessPath } from '@/utils/app';
import { StatusBadge } from '@/design-system/patterns/MetricCard';
import { getBusinessOpenState } from '@/utils/schedule';
import { cn } from '@/lib/utils';

const VERIFICATION_META = {
  approved: { label: 'Verificado', status: 'success' },
  pending: { label: 'En revisión', status: 'warning' },
  rejected: { label: 'Rechazado', status: 'danger' },
  suspended: { label: 'Suspendido', status: 'danger' },
};

export default function BusinessStatusBar({
  business,
  isTogglingOpen,
  onToggleOpen,
}) {
  const storePath = buildBusinessPath(business);
  const openState = getBusinessOpenState(business);
  const verification = VERIFICATION_META[business.verification_status] || VERIFICATION_META.pending;
  const isOpen = !!business.is_open;
  const canOperate = business.verification_status === 'approved' && business.is_published !== false;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl bg-card px-1 py-1 ring-1 ring-border/50">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl">
          <AppIcon name={business.emoji || 'store'} size="lg" className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-bold text-foreground">{business.name}</h1>
          <p className="truncate text-xs text-muted-foreground">
            {business.municipio}{business.zone ? ` · ${business.zone}` : ''}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge status={verification.status}>{verification.label}</StatusBadge>
            {business.verification_status === 'approved' && business.is_published !== false && (
              <Link
                to={storePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Ver en catálogo →
              </Link>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={isTogglingOpen || !canOperate}
        onClick={() => canOperate && onToggleOpen(!isOpen)}
        className={cn(
          'relative w-full overflow-hidden rounded-2xl border-2 p-4 text-left transition-all disabled:opacity-60',
          isOpen && canOperate
            ? 'border-emerald-500 bg-emerald-500/10'
            : 'border-border/70 bg-card hover:border-primary/30',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={cn('text-lg font-bold', isOpen && canOperate ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground')}>
              {!canOperate ? 'Pendiente de verificación' : isOpen ? 'Abierta' : 'Cerrada'}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {!canOperate
                ? 'Podrás abrir tu tienda cuando Urabapp apruebe tu documentación.'
                : isOpen ? 'Los clientes pueden pedir ahora' : openState.label}
            </p>
            {isOpen && !openState.acceptingOrders && openState.hint && (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{openState.hint}</p>
            )}
          </div>
          <div
            className={cn(
              'relative h-10 w-[4.5rem] shrink-0 rounded-full transition-colors',
              isOpen ? 'bg-emerald-500' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'absolute top-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform',
                isOpen ? 'left-[calc(100%-2.25rem)]' : 'left-1',
              )}
            />
          </div>
        </div>
      </button>
    </div>
  );
}
