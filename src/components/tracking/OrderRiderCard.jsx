import { Link } from 'react-router-dom';
import { SurfaceCard } from '@/design-system/patterns/SurfaceCard';
import StarRating from '@/components/reviews/StarRating';
import AppIcon from '@/design-system/icons/AppIcon';
import { buildLoginRedirect } from '@/utils/auth-routes';

export default function OrderRiderCard({ order, onChat, onCall, onReport }) {
  const driver = order?.drivers;
  if (!driver?.id && !order?.driver_id) return null;

  const phone = driver?.phone?.replace(/\D/g, '');
  const telHref = phone ? `tel:+57${phone.length === 10 ? phone : phone}` : null;

  return (
    <SurfaceCard className="ring-1 ring-primary/15">
      <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Tu repartidor
      </p>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl">
          🛵
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold text-foreground">
            {driver?.name || 'Repartidor'}
          </p>
          {driver?.rating != null && (
            <div className="mt-1 flex items-center gap-2">
              <StarRating value={driver.rating} size="sm" />
              <span className="text-xs text-muted-foreground">
                {driver.total_deliveries ?? 0} entregas
              </span>
            </div>
          )}
          {(driver?.vehicle || driver?.plate) && (
            <p className="mt-1 text-sm text-muted-foreground">
              {[driver.vehicle, driver.plate].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {onChat ? (
          <button
            type="button"
            onClick={onChat}
            className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10"
          >
            <AppIcon name="chat" size="sm" />
            Chat
          </button>
        ) : (
          <Link
            to={buildLoginRedirect(`/pedidos/${order.id}#chat`)}
            className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 py-2.5 text-xs font-semibold text-foreground"
          >
            <AppIcon name="chat" size="sm" />
            Chat
          </Link>
        )}
        {telHref ? (
          <a
            href={telHref}
            onClick={onCall}
            className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10"
          >
            <AppIcon name="phone" size="sm" />
            Llamar
          </a>
        ) : (
          <button type="button" disabled className="flex flex-col items-center gap-1 rounded-xl bg-muted/30 py-2.5 text-xs font-semibold text-muted-foreground">
            <AppIcon name="phone" size="sm" />
            Llamar
          </button>
        )}
        <button
          type="button"
          onClick={onReport}
          className="flex flex-col items-center gap-1 rounded-xl bg-muted/50 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-destructive/10"
        >
          <AppIcon name="alert" size="sm" />
          Reportar
        </button>
      </div>
    </SurfaceCard>
  );
}
