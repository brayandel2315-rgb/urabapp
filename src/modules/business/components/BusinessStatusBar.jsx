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
    <div className="biz-status space-y-3">
      <div className="biz-status__identity">
        <div className="biz-status__logo">
          <AppIcon name={business.emoji || 'store'} size="lg" className="text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-bold tracking-tight text-foreground">
            {business.name}
          </h1>
          <p className="truncate text-xs text-muted-foreground">
            {business.municipio}{business.zone ? ` · ${business.zone}` : ''}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge status={verification.status}>{verification.label}</StatusBadge>
            {canOperate && (
              <Link
                to={storePath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                Ver vitrina
                <AppIcon name="chevronDown" size={10} className="-rotate-90" aria-hidden />
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
          'biz-status__toggle',
          isOpen && canOperate && 'biz-status__toggle--open',
          !canOperate && 'biz-status__toggle--locked',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className={cn(
              'text-base font-bold',
              isOpen && canOperate ? 'text-primary' : 'text-foreground',
            )}
            >
              {!canOperate ? 'Pendiente de verificación' : isOpen ? 'Tienda abierta' : 'Tienda cerrada'}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {!canOperate
                ? 'Podrás abrir cuando UrabApp apruebe tu documentación.'
                : isOpen ? 'Recibiendo pedidos de clientes' : openState.label}
            </p>
            {isOpen && !openState.acceptingOrders && openState.hint && (
              <p className="mt-1 text-xs font-medium text-muted-foreground">{openState.hint}</p>
            )}
          </div>
          <div
            className={cn(
              'biz-status__switch',
              isOpen && canOperate && 'biz-status__switch--on',
            )}
            aria-hidden
          >
            <span className="biz-status__knob" />
          </div>
        </div>
      </button>
    </div>
  );
}
