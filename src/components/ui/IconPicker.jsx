import AppIcon from '@/design-system/icons/AppIcon';
import { ICON_PICKER_OPTIONS } from '@/design-system/icons/icon-map';
import { cn } from '@/lib/utils';

export default function IconPicker({ value, onChange, label = 'Icono' }) {
  return (
    <div>
      {label && <p className="mb-2 text-sm font-semibold text-foreground">{label}</p>}
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {ICON_PICKER_OPTIONS.map((iconKey) => {
          const selected = value === iconKey;
          return (
            <button
              key={iconKey}
              type="button"
              onClick={() => onChange(iconKey)}
              className={cn(
                'flex items-center justify-center rounded-xl border-2 p-2 transition-all',
                selected ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/40'
              )}
              aria-label={iconKey}
              aria-pressed={selected}
            >
              <AppIcon name={iconKey} size="sm" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
