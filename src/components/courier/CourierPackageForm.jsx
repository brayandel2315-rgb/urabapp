import { COURIER_PACKAGE_TYPES, COURIER_WEIGHT_TIERS, COURIER_PRIORITIES } from '@/utils/courier-constants';
import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';

function ChipGroup({ label, options, value, onChange, renderLabel }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={cn(
                'rounded-xl px-3 py-2 text-xs font-bold transition-all',
                active
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted/70 text-foreground ring-1 ring-border/50 hover:bg-muted'
              )}
            >
              {renderLabel ? renderLabel(opt) : opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CourierPackageForm({ value, onChange }) {
  const v = value || {};
  const set = (key, val) => onChange({ ...v, [key]: val });

  return (
    <div className="space-y-4">
      <ChipGroup
        label="Tipo"
        options={COURIER_PACKAGE_TYPES}
        value={v.packageType || 'package'}
        onChange={(id) => set('packageType', id)}
        renderLabel={(opt) => (
          <span className="inline-flex items-center gap-1.5">
            <AppIcon name={opt.icon} size="xs" />
            {opt.label}
          </span>
        )}
      />
      <ChipGroup
        label="Peso"
        options={COURIER_WEIGHT_TIERS}
        value={v.weightTier || '0-2'}
        onChange={(id) => set('weightTier', id)}
      />
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Prioridad</p>
        <div className="grid grid-cols-2 gap-2">
          {COURIER_PRIORITIES.map((opt) => {
            const active = (v.priority || 'normal') === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => set('priority', opt.id)}
                className={cn(
                  'rounded-xl p-3 text-left transition-all',
                  active
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted/70 ring-1 ring-border/50 hover:bg-muted'
                )}
              >
                <p className="text-sm font-bold">{opt.label}</p>
                <p className={cn('text-[11px]', active ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
