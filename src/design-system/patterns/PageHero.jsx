import AppIcon from '@/design-system/icons/AppIcon';
import CatalogImage from '@/components/ui/CatalogImage';
import { SurfaceCard } from './SurfaceCard';
import { cn } from '@/lib/utils';

export default function PageHero({
  icon,
  title,
  description,
  image,
  variant = 'highlight',
  className,
}) {
  return (
    <SurfaceCard variant={variant} className={cn('relative overflow-hidden text-center', className)}>
      {image && (
        <div className="absolute inset-0 opacity-20">
          <CatalogImage src={image} alt="" rounded="none" size="3xl" />
        </div>
      )}
      <div className="relative flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 shadow-soft">
          <AppIcon name={icon || 'store'} size="lg" className="text-primary" />
        </div>
        <h1 className="mt-3 font-display text-xl font-bold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      </div>
    </SurfaceCard>
  );
}
