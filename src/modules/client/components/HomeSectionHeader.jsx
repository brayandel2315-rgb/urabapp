import { cn } from '@/lib/utils';

export default function HomeSectionHeader({
  title,
  subtitle,
  aside,
  className,
  id,
  variant = 'default',
}) {
  return (
    <div className={cn('mb-3.5 flex items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        <h2
          id={id}
          className={cn(
            'font-display font-bold text-[#0D2B45]',
            variant === 'brand' ? 'text-base sm:text-lg brand-swoosh' : 'section-title',
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs font-medium text-[#4A6278] sm:text-sm">{subtitle}</p>
        )}
      </div>
      {aside}
    </div>
  );
}
