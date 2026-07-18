import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import { Badge } from '@/design-system/ui/badge';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import { SHIPMENT_STATUS } from '@/data/shipment-catalog';
import { formatCOP } from '@/utils/currency';
import { useClientActivity } from '@/hooks/useClientActivity';
import { spring, tween } from '@/design-system/motion/presets';

const ORDER_STEPS = ['pending', 'accepted', 'preparing', 'on_the_way', 'delivered'];
const SHIPMENT_STEPS = ['created', 'searching_carrier', 'accepted', 'pickup', 'in_transit', 'arriving', 'delivered'];

function progressFor(activity) {
  const steps = activity.service === 'shipment' ? SHIPMENT_STEPS : ORDER_STEPS;
  const i = steps.indexOf(activity.status);
  return ((i >= 0 ? i : 0) + 1) / steps.length * 100;
}

function statusLabel(activity) {
  if (activity.service === 'shipment') {
    return SHIPMENT_STATUS[activity.status] || activity.status;
  }
  return ORDER_STATUS_LABELS[activity.status] || activity.status;
}

const SERVICE_BADGE = {
  food: { label: 'Comida', variant: 'secondary' },
  courier: { label: 'Mensajería', variant: 'success' },
  shipment: { label: 'Envío', variant: 'warning' },
};

export default function ClientActiveOrderBanner({ className }) {
  const { primaryActivity, hasActive, isLoading } = useClientActivity();

  if (isLoading || !hasActive || !primaryActivity) return null;

  const badge = SERVICE_BADGE[primaryActivity.service] || SERVICE_BADGE.food;
  const progress = progressFor(primaryActivity);
  const isOnTheWay = primaryActivity.status === 'on_the_way'
    || primaryActivity.status === 'in_transit'
    || primaryActivity.status === 'arriving';

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={tween}
      className={className}
      aria-label="Actividad en curso"
    >
      <Link
        to={primaryActivity.href}
        className="group block overflow-hidden rounded-[var(--radius-component)] border border-border/60 bg-card p-4 shadow-card transition hover:border-primary/35 hover:shadow-soft"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              <p className="text-sm font-semibold text-muted-foreground">
                {statusLabel(primaryActivity)}
              </p>
              {isOnTheWay && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" aria-hidden />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
                  </span>
                  En vivo
                </span>
              )}
            </div>
            <p className="mt-1 truncate font-display text-base font-bold text-foreground">
              {primaryActivity.title}
            </p>
            {primaryActivity.amount != null && (
              <p className="mt-0.5 text-sm tabular-nums text-muted-foreground">
                {formatCOP(primaryActivity.amount)}
              </p>
            )}
          </div>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            {isOnTheWay && (
              <span className="absolute inset-0 animate-ping rounded-xl bg-primary/30" aria-hidden />
            )}
            <AppIcon
              name={primaryActivity.service === 'shipment' ? 'envios' : 'orders'}
              size="sm"
              className="relative"
            />
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={spring}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-primary">
          {primaryActivity.status === 'on_the_way'
            ? 'Ver código de entrega →'
            : 'Ver seguimiento →'}
        </p>
      </Link>
    </motion.section>
  );
}
