import { cn } from '@/lib/utils';
import { STICKER_COMPONENTS } from './StickerArt';
import { resolveStickerId } from './sticker-map';

const SIZE_MAP = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 52,
  xl: 64,
  '2xl': 72,
};

/**
 * Icono premium UrabApp — stickers vectoriales IA (sin emojis).
 */
export default function StickerIcon({
  name,
  size = 'md',
  className,
  animated = false,
}) {
  const id = resolveStickerId(name);
  const Component = STICKER_COMPONENTS[id] || STICKER_COMPONENTS.comercio;
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] ?? SIZE_MAP.md);

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        animated && 'motion-safe:animate-[sticker-float_3s_ease-in-out_infinite]',
        className
      )}
      aria-hidden
    >
      <Component size={px} />
    </span>
  );
}
