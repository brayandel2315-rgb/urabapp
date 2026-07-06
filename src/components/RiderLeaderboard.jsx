import { formatCOP } from '../utils/currency';
import { RIDER_BONUSES } from '../utils/constants';
import AppIcon from '@/design-system/icons/AppIcon';

const MEDAL_ICONS = {
  1: 'medalGold',
  2: 'medalSilver',
  3: 'medalBronze',
};

export default function RiderLeaderboard({ riders = [], highlightId, compact = false }) {
  if (riders.length === 0) {
    return <p className="text-center text-sm text-muted">Sin datos de ranking esta semana.</p>;
  }

  return (
    <div className="space-y-2">
      {!compact && (
        <p className="text-xs text-muted">
          Ranking semanal · bono +{formatCOP(RIDER_BONUSES.weeklyBonus)} desde {RIDER_BONUSES.weeklyDeliveryTarget} entregas
        </p>
      )}
      {riders.map((rider) => {
        const isMe = highlightId && rider.id === highlightId;
        const medalIcon = MEDAL_ICONS[rider.rank];
        return (
          <div
            key={rider.id}
            className={`flex items-center gap-3 rounded-xl p-3 text-sm ${
              isMe ? 'bg-primary-light/50 ring-1 ring-primary/30' : 'bg-background'
            }`}
          >
            <span className="flex w-8 items-center justify-center font-bold text-secondary">
              {medalIcon ? <AppIcon name={medalIcon} size="sm" /> : `${rider.rank}.`}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-secondary">
                {rider.name}
                {rider.is_online && <span className="ml-1 text-xs text-primary">● en línea</span>}
              </p>
              <p className="inline-flex items-center gap-1 text-xs text-muted">
                {rider.municipio} · <AppIcon name="star" size="xs" /> {rider.rating} · {rider.weekDeliveries} esta semana
              </p>
            </div>
            {rider.weeklyBonus > 0 && (
              <span className="shrink-0 text-xs font-bold text-primary">+{formatCOP(rider.weeklyBonus)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
