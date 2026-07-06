import { cn } from '@/lib/utils';
import { getHeroDashboardIcon } from '@/data/hero-dashboard-icons';

const TONE_RING = {
  delivery: 'from-emerald-400/30 to-emerald-600/10 ring-emerald-300/25',
  stores: 'from-sky-400/30 to-sky-600/10 ring-sky-300/25',
  shipments: 'from-amber-400/30 to-amber-600/10 ring-amber-300/25',
  offer: 'from-orange-400/35 to-red-500/15 ring-orange-300/30',
};

export default function HeroDashboardIcon({ id, className, size = 'md' }) {
  const src = getHeroDashboardIcon(id);
  if (!src) return null;

  const sizes = {
    sm: { box: 'h-9 w-9', img: 'h-8 w-8' },
    md: { box: 'h-11 w-11', img: 'h-10 w-10' },
  };
  const preset = sizes[size] || sizes.md;

  return (
    <span
      className={cn(
        'hero-dash-icon inline-flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1',
        preset.box,
        TONE_RING[id],
        className,
      )}
    >
      <img
        src={src}
        alt=""
        width={40}
        height={40}
        className={cn(preset.img, 'object-contain drop-shadow-sm')}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </span>
  );
}
