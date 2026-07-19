import { cn } from '@/lib/utils';
import { SurfaceCard } from './SurfaceCard';

export default function PanelHeader({ tag, title, subtitle, action, children, className }) {
  return (
    <SurfaceCard className={cn('border border-[#D5E3EF] bg-white', className)}>
      {tag && <p className="text-tagline text-[#4A6278]">{tag}</p>}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {title && (
            <h1 className="font-display text-2xl font-semibold text-[#111827]">
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-1 text-sm text-[#4A6278]">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </SurfaceCard>
  );
}
