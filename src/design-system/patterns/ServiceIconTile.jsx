import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { getServiceIconImage } from '@/data/service-icons';

/**
 * Icono de servicio — imagen 3D brandboard o fallback vectorial.
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
    sm: { box: 'h-10 w-10', icon: 20, img: 'h-10 w-10' },
    md: { box: 'h-[4.75rem] w-[4.75rem]', icon: 28, img: 'h-[4.75rem] w-[4.75rem]' },
    lg: { box: 'h-[4.75rem] w-[4.75rem]', icon: 32, img: 'h-[4.75rem] w-[4.75rem]' },
  };
  const preset = presets[size] || presets.md;
  const imageSrc = getServiceIconImage(serviceId) || getServiceIconImage(name);

  if (imageSrc) {
    return (
      <span
        className={cn(
          'inline-flex shrink-0 items-center justify-center',
          preset.box,
          active && 'scale-95',
          className,
        )}
      >
        <img
          src={imageSrc}
          alt=""
          className={cn(preset.img, 'service-icon-3d object-contain')}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </span>
    );
  }

  return (
    <span
      className={cn(
        'service-icon-tile inline-flex shrink-0 items-center justify-center',
        preset.box,
        tone === 'blue' && 'service-icon-tile--blue',
        active && 'service-icon-tile--active',
        className,
      )}
    >
      <AppIcon
        name={name}
        size={preset.icon}
        className={tone === 'blue' ? 'text-[#0E6BA8]' : 'text-[#28B463]'}
      />
    </span>
  );
}
