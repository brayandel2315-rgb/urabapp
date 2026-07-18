import { cn } from '@/lib/utils';
import AppIcon from '@/design-system/icons/AppIcon';
import BrandedLoadingScreen from '@/components/feedback/BrandedLoadingScreen';
import { Button } from '@/design-system/ui/button';
import { Skeleton } from '@/design-system/ui/skeleton';
import { SlideUp } from '@/design-system/motion/Fade';

const STATE_CONFIG = {
  empty: { icon: 'search', defaultTitle: 'Sin resultados' },
  error: { icon: 'alert', defaultTitle: 'Algo salió mal' },
  offline: { icon: 'offline', defaultTitle: 'Sin conexión' },
  loading: { icon: 'loading', defaultTitle: 'Cargando…' },
  success: { icon: 'check', defaultTitle: 'Listo' },
  'no-coverage': { icon: 'map', defaultTitle: 'Sin cobertura aquí' },
  'permissions-denied': { icon: 'lock', defaultTitle: 'Ubicación desactivada' },
  cancelled: { icon: 'orders', defaultTitle: 'Pedido cancelado' },
  'new-user': { icon: 'profile', defaultTitle: 'Bienvenido a UrabApp' },
  retry: { icon: 'alert', defaultTitle: 'No pudimos cargar' },
};

export function PageState({
  type = 'empty',
  title,
  description,
  action,
  icon,
  sticker,
  className,
}) {
  const config = STATE_CONFIG[type] || STATE_CONFIG.empty;
  const iconName = icon || sticker || config.icon;

  if (type === 'loading') {
    return (
      <BrandedLoadingScreen
        variant="page"
        message={title || config.defaultTitle}
        className={className}
      />
    );
  }

  return (
    <SlideUp className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted/80 shadow-soft">
        <AppIcon
          name={iconName}
          size="xl"
          spin={type === 'loading'}
          className="text-primary"
        />
      </div>
      <h3 className="font-display text-lg font-bold text-[#0D2B45]">{title || config.defaultTitle}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-[#4A6278]">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </SlideUp>
  );
}

export function PageLoader({ rows = 4, message = 'Cargando…' }) {
  void rows;
  return <BrandedLoadingScreen variant="section" message={message} />;
}

export function SearchBar({ value, onChange, placeholder = 'Buscar...', className, onSubmit }) {
  return (
    <form
      className={cn('relative', className)}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(value); }}
    >
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
        <AppIcon name="search" size="xs" className="text-muted-foreground" />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </form>
  );
}

export function RetryButton({ onClick, children = 'Reintentar' }) {
  return (
    <Button type="button" variant="outline" onClick={onClick}>
      {children}
    </Button>
  );
}

export function ListSkeleton({ count = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 rounded-2xl border border-border p-3">
          <Skeleton className="h-14 w-14 rounded-xl" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}