import AppIcon from '@/design-system/icons/AppIcon';

const TRUST_ITEMS = [
  { icon: 'money', text: 'Pagas al recibir' },
  { icon: 'banana', text: 'Hecho en Urabá' },
  { icon: 'mensajeria', text: 'Mensajero de acá' },
  { icon: 'store', text: 'Tu tienda, tu barrio' },
];

export default function HomeTrustStrip({ className = '', variant = 'default' }) {
  const isLight = variant === 'light';

  return (
    <div className={`flex gap-2 overflow-x-auto hide-scrollbar pb-0.5 ${className}`}>
      {TRUST_ITEMS.map((item) => (
        <span
          key={item.text}
          className={
            isLight
              ? 'flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm'
              : 'flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/90 px-3 py-1.5 text-[11px] font-semibold text-foreground backdrop-blur-sm'
          }
        >
          <AppIcon name={item.icon} size="xs" className={isLight ? 'text-white' : 'text-primary'} />
          {item.text}
        </span>
      ))}
    </div>
  );
}
