import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/design-system/ui/button';
import { SlideUp } from '@/design-system/motion/Fade';

export function HeroSection({
  tagline,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  variant = 'default',
  className,
}) {
  const isGradient = variant === 'gradient';

  return (
    <SlideUp className={cn(
        'relative overflow-hidden px-4 py-10 lg:px-8 lg:py-16',
        isGradient
          ? 'bg-gradient-brand text-white brand-wave-bg'
          : 'border-b border-border bg-surface',
        className
      )}
    >
      {isGradient && (
        <>
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-black/20 to-transparent" />
        </>
      )}
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div>
          {tagline && (
            <p className={cn('text-label font-semibold', isGradient ? 'text-primary-bright' : 'text-primary')}>
              {tagline}
            </p>
          )}
          <h1 className={cn('text-heading mt-2 text-3xl leading-tight lg:text-5xl', isGradient && 'text-white')}>
            {title}
          </h1>
          {description && (
            <p className={cn('mt-4 max-w-lg text-base lg:text-lg', isGradient ? 'text-white/85' : 'text-muted-foreground')}>
              {description}
            </p>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {primaryAction && (
                primaryAction.to ? (
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link to={primaryAction.to}>{primaryAction.label}</Link>
                  </Button>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto" onClick={primaryAction.onClick}>
                    {primaryAction.label}
                  </Button>
                )
              )}
              {secondaryAction && (
                secondaryAction.to ? (
                  <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                    <Link to={secondaryAction.to}>{secondaryAction.label}</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={secondaryAction.onClick}>
                    {secondaryAction.label}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
        {media && <div className="relative">{media}</div>}
      </div>
    </SlideUp>
  );
}
