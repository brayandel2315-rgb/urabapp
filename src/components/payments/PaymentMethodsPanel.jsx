import { cn } from '@/lib/utils';
import {
  PAYMENT_METHODS,
  PAYMENT_METHODS_UPCOMING,
  PAYMENT_SECTIONS,
  PAYMENT_TRUST_COPY,
  isWompiEnabled,
} from '../../utils/paymentsDisplay';
import AppIcon from '@/design-system/icons/AppIcon';
import { SurfaceCard, SectionTitle } from '@/design-system/patterns/SurfaceCard';
import { Badge } from '@/design-system/ui/badge';

function MethodRow({ method, isSelectable, selected, onSelect }) {
  const Tag = isSelectable ? 'label' : 'div';
  return (
    <Tag
      className={cn(
        'flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3 transition-colors',
        isSelectable && 'cursor-pointer hover:border-primary/40',
        selected && 'border-primary ring-2 ring-primary/20'
      )}
    >
      {isSelectable && (
        <input
          type="radio"
          name="payment"
          value={method.id}
          checked={selected}
          onChange={() => onSelect?.(method.id)}
          className="accent-primary"
        />
      )}
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <AppIcon name={method.icon} size="sm" className="text-primary" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{method.name}</p>
        <p className="text-xs text-muted">{method.description}</p>
      </div>
      <Badge variant="success">Activo</Badge>
    </Tag>
  );
}

export default function PaymentMethodsPanel({
  variant = 'display',
  selectedId,
  onSelect,
  showUpcoming = true,
  compact = false,
  embedded = false,
}) {
  const isSelectable = variant === 'selectable';

  const inner = (
    <>
      <header>
        <p className="text-tagline text-muted">Medios de pago</p>
        <SectionTitle>
          {isSelectable ? 'Elige cómo pagar' : 'Recibimos estos medios de pago'}
        </SectionTitle>
        {!compact && (
          <p className="text-sm text-muted">{PAYMENT_TRUST_COPY.body}</p>
        )}
      </header>

      <section aria-labelledby="payment-available">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h3 id="payment-available" className="text-sm font-semibold text-foreground">
            {PAYMENT_SECTIONS.available.title}
          </h3>
          <span className="text-xs font-medium text-primary">{PAYMENT_SECTIONS.available.subtitle}</span>
        </div>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <MethodRow
              key={method.id}
              method={method}
              isSelectable={isSelectable}
              selected={selectedId === method.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      </section>

      {showUpcoming && (
        <section aria-labelledby="payment-digital">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 id="payment-digital" className="text-sm font-semibold text-foreground">
              {PAYMENT_SECTIONS.digital.title}
            </h3>
            <span className="text-xs text-muted">{PAYMENT_SECTIONS.digital.subtitle}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {PAYMENT_METHODS_UPCOMING.map((method) => (
              <div
                key={method.id}
                className={`relative rounded-xl border p-3 text-center ${
                  isWompiEnabled()
                    ? 'border-border/60 bg-background'
                    : 'border-dashed border-border bg-muted/20 opacity-75'
                }`}
                title={isWompiEnabled() ? 'Disponible vía Wompi' : 'Próximamente'}
              >
                <div className="flex justify-center" aria-hidden>
                  <AppIcon name={method.icon} size="md" className={isWompiEnabled() ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <p className="mt-2 text-xs font-semibold leading-tight text-foreground">{method.name}</p>
                {method.detail && (
                  <p className="mt-0.5 text-[10px] leading-tight text-muted">{method.detail}</p>
                )}
                <Badge variant={isWompiEnabled() ? 'success' : 'muted'} className="mt-2 text-[10px]">
                  {isWompiEnabled() ? 'Wompi' : 'Pronto'}
                </Badge>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="border-t border-border/50 pt-4">
        <p className="text-sm font-semibold text-foreground">{PAYMENT_TRUST_COPY.headline}</p>
        <p className="mt-1 text-xs text-muted">{PAYMENT_TRUST_COPY.footnote}</p>
      </footer>
    </>
  );

  if (embedded) {
    return <div className={cn(compact ? 'space-y-4' : 'space-y-5')}>{inner}</div>;
  }

  return (
    <SurfaceCard className={cn(compact ? 'space-y-4' : 'space-y-5')}>
      {inner}
    </SurfaceCard>
  );
}
