import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import { Card, CardContent } from '@/design-system/ui/card';
import { Badge } from '@/design-system/ui/badge';

function valueTypography(value) {
  if (typeof value === 'number') return 'numeric';
  if (typeof value === 'string' && /^[\d.,]+[%$]?$/.test(value.trim())) return 'numeric';
  if (typeof value === 'string' && value.length <= 4) return 'short';
  return 'text';
}

const ACCOUNT_TONE_STYLES = {
  green: {
    card: 'lg:border-[#28B463]/18 lg:bg-gradient-to-br lg:from-[#E8F9EE]/90 lg:via-white lg:to-white lg:before:bg-[#28B463]',
    icon: 'lg:bg-[#28B463]/12 lg:text-[#28B463] lg:ring-1 lg:ring-[#28B463]/18',
    value: 'lg:text-[#0D2B45]',
    valueAccent: 'lg:text-[#1C9A55]',
  },
  blue: {
    card: 'lg:border-[#0E6BA8]/18 lg:bg-gradient-to-br lg:from-[#E6F4FF]/90 lg:via-white lg:to-white lg:before:bg-[#0E6BA8]',
    icon: 'lg:bg-[#0E6BA8]/12 lg:text-[#0E6BA8] lg:ring-1 lg:ring-[#0E6BA8]/18',
    value: 'lg:text-[#0D2B45]',
    valueAccent: 'lg:text-[#0E6BA8]',
  },
  sky: {
    card: 'lg:border-[#D5E3EF] lg:bg-gradient-to-br lg:from-[#F4F9FD] lg:via-white lg:to-white lg:before:bg-[#0E6BA8]/70',
    icon: 'lg:bg-[#E6F4FF] lg:text-[#0E6BA8] lg:ring-1 lg:ring-[#D5E3EF]',
    value: 'lg:text-[#0D2B45]',
    valueAccent: 'lg:text-[#0E6BA8]',
  },
  promo: {
    card: 'lg:border-[#A8D60E]/28 lg:bg-gradient-to-br lg:from-[#F7FAE8]/95 lg:via-white lg:to-white lg:before:bg-[#A8D60E]',
    icon: 'lg:bg-[#A8D60E]/18 lg:text-[#6B8F00] lg:ring-1 lg:ring-[#A8D60E]/25',
    value: 'lg:text-[#0D2B45]',
    valueAccent: 'lg:text-[#6B8F00]',
  },
};

function MetricCardBody({
  label,
  value,
  icon,
  trend,
  accent,
  valueKind,
}) {
  return (
    <>
      {icon && (
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10',
            accent ? 'bg-primary/15' : 'bg-primary/10',
          )}
        >
          <AppIcon name={icon} size="sm" className="text-primary" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
          {label}
        </p>
        <p
          className={cn(
            'font-display mt-1 font-bold tracking-tight',
            valueKind === 'numeric' && 'text-xl sm:text-2xl',
            valueKind === 'short' && 'text-lg sm:text-xl',
            valueKind === 'text' && 'text-base sm:text-lg',
            accent ? 'text-primary' : 'text-foreground',
          )}
        >
          {value}
        </p>
        {trend && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
            {trend}
          </p>
        )}
      </div>
    </>
  );
}

export function MetricCard({
  label,
  value,
  mobileValue,
  icon,
  trend,
  className,
  accent,
  interactive = false,
  variant = 'default',
  tone = 'green',
}) {
  const displayValue = mobileValue ?? value;
  const valueKind = valueTypography(displayValue);
  const isAccount = variant === 'account';
  const toneStyle = ACCOUNT_TONE_STYLES[tone] || ACCOUNT_TONE_STYLES.green;

  return (
    <Card
      className={cn(
        'flex h-full min-h-[6.75rem] flex-col overflow-hidden sm:min-h-[7.25rem]',
        isAccount && [
          'lg:relative lg:min-h-[11rem] lg:rounded-3xl lg:shadow-soft lg:before:absolute lg:before:inset-x-0 lg:before:top-0 lg:before:h-1 lg:before:rounded-t-3xl',
          toneStyle.card,
        ],
        interactive && 'transition-shadow hover:border-primary/30 hover:shadow-soft',
        interactive && isAccount && 'lg:transition-all lg:duration-200 lg:hover:-translate-y-1 lg:hover:shadow-lift lg:hover:border-primary/25',
        className,
      )}
    >
      <CardContent
        className={cn(
          'flex flex-1 flex-col p-3.5 sm:p-4 md:p-5',
          isAccount && 'lg:p-6',
        )}
      >
        <div
          className={cn(
            'flex min-h-0 flex-1 items-start gap-2.5 sm:gap-3',
            isAccount && 'lg:hidden',
          )}
        >
          <MetricCardBody
            label={label}
            value={displayValue}
            icon={icon}
            trend={trend}
            accent={accent}
            valueKind={valueKind}
          />
        </div>

        {isAccount && (
          <div className="hidden min-h-0 flex-1 flex-col lg:flex">
            <div className="flex items-start justify-between gap-3">
              {icon && (
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary',
                    toneStyle.icon,
                  )}
                >
                  <AppIcon name={icon} size="md" />
                </div>
              )}
              {interactive && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 ring-1 ring-[#D5E3EF]">
                  <AppIcon name="back" size={14} className="rotate-180 text-[#4A6278]" />
                </span>
              )}
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4A6278]">
              {label}
            </p>
            <p
              className={cn(
                'mt-2 font-display text-4xl font-black tabular-nums leading-none tracking-tight',
                accent ? toneStyle.valueAccent : toneStyle.value,
              )}
            >
              {value}
            </p>
            {trend && (
              <p className="mt-3 line-clamp-2 text-sm leading-snug text-[#4A6278]">
                {trend}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Grid responsivo — por defecto 2×2 móvil, 4 columnas en escritorio ancho */
export function MetricGrid({ children, className, layout = 'default' }) {
  return (
    <div
      className={cn(
        'grid auto-rows-fr gap-3 sm:gap-4',
        layout === 'account'
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5'
          : 'grid-cols-2 lg:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function StatusBadge({ status, children }) {
  const variants = {
    success: 'success',
    warning: 'warning',
    error: 'destructive',
    muted: 'muted',
  };
  return <Badge variant={variants[status] || 'muted'}>{children}</Badge>;
}
