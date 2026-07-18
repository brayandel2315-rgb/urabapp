import AppIcon from '@/design-system/icons/AppIcon';
import BrandedLoadingScreen from '@/components/feedback/BrandedLoadingScreen';
import { cn } from '@/lib/utils';

const VARIANT_BY_SIZE = {
  lg: 'screen',
  md: 'section',
  sm: 'compact',
};

export default function Loader({
  size = 'md',
  branded,
  message,
  className,
  variant,
}) {
  const useBranded = branded ?? size !== 'sm';

  if (!useBranded) {
    const iconSize = size === 'lg' ? 'xl' : size === 'sm' ? 'sm' : 'md';
    return (
      <div className={cn('flex items-center justify-center p-4', className)} role="status" aria-label="Cargando">
        <AppIcon name="loading" size={iconSize} spin className="text-primary" />
      </div>
    );
  }

  return (
    <BrandedLoadingScreen
      variant={variant || VARIANT_BY_SIZE[size] || 'section'}
      message={message}
      className={className}
    />
  );
}
