import { RIDER_BONUSES } from './constants';

export function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export function calculateWeeklyRiderBonus(weekDeliveries, rank = null) {
  let bonus = 0;
  if (weekDeliveries >= RIDER_BONUSES.weeklyDeliveryTarget) {
    bonus += RIDER_BONUSES.weeklyBonus;
  }
  if (rank != null && rank < RIDER_BONUSES.topRiderBonuses.length) {
    bonus += RIDER_BONUSES.topRiderBonuses[rank];
  }
  return bonus;
}

export function getWeeklyBonusProgress(weekDeliveries) {
  const target = RIDER_BONUSES.weeklyDeliveryTarget;
  return {
    current: weekDeliveries,
    target,
    remaining: Math.max(0, target - weekDeliveries),
    unlocked: weekDeliveries >= target,
  };
}
