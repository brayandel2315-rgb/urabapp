import { cn } from '@/lib/utils';

export default function PanelTabBar({ tabs, value, onChange, className }) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto hide-scrollbar', className)}>
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id;
        const label = typeof tab === 'string' ? tab : tab.label;
        const badge = typeof tab === 'string' ? null : tab.badge;
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'relative shrink-0 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-soft'
                : 'bg-white text-[#4A6278] ring-1 ring-[#D5E3EF] hover:bg-[#E6F4FF]'
            )}
          >
            {label}
            {badge > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
