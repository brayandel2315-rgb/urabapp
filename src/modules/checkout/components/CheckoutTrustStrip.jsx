import AppIcon from '@/design-system/icons/AppIcon';

const TRUST_ITEMS = [
  { icon: 'lock', label: 'Cuenta verificada', sub: 'Pedido vinculado a tu perfil' },
  { icon: 'map', label: 'GPS obligatorio', sub: 'El repartidor llega al punto exacto' },
  { icon: 'bell', label: 'Seguimiento en vivo', sub: 'Estado del pedido en la app' },
];

export default function CheckoutTrustStrip({ className = '' }) {
  return (
    <div className={`grid gap-2 sm:grid-cols-3 ${className}`}>
      {TRUST_ITEMS.map((item) => (
        <div
          key={item.label}
          className="flex items-start gap-2.5 rounded-[var(--radius-component)] border border-border/50 bg-muted/20 px-3 py-2.5"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <AppIcon name={item.icon} size="sm" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">{item.label}</p>
            <p className="text-[11px] leading-snug text-muted-foreground">{item.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
