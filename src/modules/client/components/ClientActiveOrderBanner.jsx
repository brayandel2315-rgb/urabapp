import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AppIcon from '@/design-system/icons/AppIcon';
import { Badge } from '@/design-system/ui/badge';
import { ORDER_STATUS_LABELS } from '@/utils/constants';
import { SHIPMENT_STATUS } from '@/data/shipment-catalog';
import { formatCOP } from '@/utils/currency';
import { useClientActivity } from '@/hooks/useClientActivity';
import { tween } from '@/design-system/motion/presets';

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
        className="group block overflow-hidden rounded-2xl border border-[#28B463]/25 bg-gradient-to-br from-[#E6F4FF] via-white to-[#E8F9EE] p-4 shadow-soft transition hover:border-[#28B463]/40 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                En curso
              </p>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <p className="mt-1 truncate font-display text-base font-bold text-[#0D2B45] group-hover:text-primary">
              {primaryActivity.title}
            </p>
            <p className="mt-0.5 text-sm text-[#4A6278]">
              {statusLabel(primaryActivity)}
              {primaryActivity.amount != null && (
                <>
                  {' · '}
                  {formatCOP(primaryActivity.amount)}
                </>
              )}
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <AppIcon name={primaryActivity.service === 'shipment' ? 'envios' : 'orders'} size="sm" />
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E6F4FF]">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
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
