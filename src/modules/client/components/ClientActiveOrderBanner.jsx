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
        className="group block overflow-hidden rounded-2xl border border-[#D5E3EF] bg-white p-4 shadow-card transition hover:border-[#0E6BA8]/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              <p className="text-sm font-semibold text-[#4A6278]">
                {statusLabel(primaryActivity)}
              </p>
            </div>
            <p className="mt-1 truncate font-display text-base font-bold text-[#0D2B45]">
              {primaryActivity.title}
            </p>
            {primaryActivity.amount != null && (
              <p className="mt-0.5 text-sm text-[#4A6278]">
                {formatCOP(primaryActivity.amount)}
              </p>
            )}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0E6BA8] text-white">
            <AppIcon name={primaryActivity.service === 'shipment' ? 'envios' : 'orders'} size="sm" />
          </span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#E6F4FF]">
          <div
            className="h-full rounded-full bg-[#0E6BA8] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs font-semibold text-[#0E6BA8]">
          {primaryActivity.status === 'on_the_way'
            ? 'Ver código de entrega →'
            : 'Ver seguimiento →'}
        </p>
      </Link>
    </motion.section>
  );
}
