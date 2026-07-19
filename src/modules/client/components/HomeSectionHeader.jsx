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
            'font-display font-semibold tracking-tight text-[#111827]',
            variant === 'brand' ? 'text-[0.95rem] sm:text-base' : 'section-title text-base',
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs font-normal leading-snug text-[#6B7280] sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {aside}
    </div>
  );
}
