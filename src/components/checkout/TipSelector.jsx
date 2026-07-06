import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import Input from '@/components/ui/Input';
import { formatCOP } from '@/utils/currency';

const PRESETS = [0, 2000, 3000, 5000];

export default function TipSelector({ value = 0, onChange, className }) {
  const isPreset = PRESETS.includes(value);
  const showCustom = !isPreset && value > 0;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <AppIcon name="delivery" size="sm" className="text-primary" />
        <div>
          <p className="text-sm font-semibold">Propina para el domiciliario</p>
          <p className="text-xs text-muted-foreground">Opcional — va 100% al mensajero</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((amount) => {
          const active = value === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => onChange(amount)}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-bold transition active:scale-[0.98]',
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/40'
              )}
            >
              {amount === 0 ? 'Sin propina' : formatCOP(amount)}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onChange(showCustom ? value : 1000)}
          className={cn(
            'rounded-xl border px-3 py-2 text-sm font-bold transition active:scale-[0.98]',
            showCustom
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background text-foreground hover:border-primary/40'
          )}
        >
          Otro
        </button>
      </div>
      {showCustom && (
        <Input
          label="Monto personalizado"
          type="number"
          min={0}
          step={500}
          value={value || ''}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          placeholder="Ej: 4000"
        />
      )}
    </div>
  );
}
