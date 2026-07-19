import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { getCategoryColor } from '@/design-system/tokens/category-colors';
import { getServiceIconImage } from '@/data/service-icons';

/**
 * Icono de servicio — imagen 3D brand cuando existe; Lucide como fallback.
 * Las imágenes se escalan visualmente sin agrandar el slot del layout (la tarjeta no crece).
 */
export default function ServiceIconTile({
  name,
  serviceId,
  tone = 'green',
  active = false,
  size = 'md',
  className,
}) {
  const presets = {
    sm: { box: 'h-11 w-11', icon: 20, imgScale: 'scale-[1.35]' },
    md: { box: 'h-14 w-14', icon: 24, imgScale: 'scale-[1.45]' },
    lg: { box: 'h-16 w-16', icon: 28, imgScale: 'scale-[1.4]' },
  };
  const preset = presets[size] || presets.md;
  const accent = getCategoryColor(serviceId || name, tone === 'blue' ? '#2196F3' : '#1E6F43');
  const imageSrc =
    getServiceIconImage(serviceId) ||
    getServiceIconImage(name) ||
    null;

  return (
    <span
      className={cn(
        'service-icon-tile inline-flex shrink-0 items-center justify-center',
        preset.box,
        imageSrc
          ? 'service-icon-tile--image relative overflow-visible rounded-none bg-transparent shadow-none ring-0'
          : 'rounded-2xl',
        active && 'service-icon-tile--active',
        className,
      )}
      style={
        imageSrc
          ? undefined
          : {
              color: accent,
              background: `color-mix(in srgb, ${accent} 10%, white)`,
            }
      }
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          draggable={false}
          className={cn(
            'pointer-events-none h-full w-full object-contain origin-center',
            preset.imgScale,
          )}
        />
      ) : (
        <AppIcon name={name || serviceId} size={preset.icon} className="text-current" />
      )}
    </span>
  );
}
