import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { URABA_IDENTITY_CHIPS } from '@/utils/uraba-brand';

export default function UrabaIdentityChips({ className = '', variant = 'light' }) {
  const isLight = variant === 'light';

  return (
    <div className={cn('flex gap-2 overflow-x-auto hide-scrollbar pb-0.5', className)}>
      {URABA_IDENTITY_CHIPS.map((chip) => (
        <span
          key={chip.label}
          className={cn(
            'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold backdrop-blur-sm',
            isLight
              ? 'border border-white/25 bg-white/15 text-white'
              : 'border border-border/60 bg-background/90 text-foreground'
          )}
        >
          <AppIcon name={chip.icon} size="xs" className={isLight ? 'text-white' : 'text-primary'} />
          {chip.label}
        </span>
      ))}
    </div>
  );
}
