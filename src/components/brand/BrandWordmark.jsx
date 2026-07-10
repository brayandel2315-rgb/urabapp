import { cn } from '@/lib/utils';

/** Logotipo tipográfico URABAPP — sin fondo, para hero móvil */
export default function BrandWordmark({ className, size = 'hero' }) {
  return (
    <span
      className={cn(
        'brand-wordmark inline-flex items-baseline',
        size === 'hero' && 'brand-wordmark--hero',
        size === 'compact' && 'brand-wordmark--compact',
        className,
      )}
      aria-hidden
    >
      <span className="brand-wordmark__urab">URAB</span>
      <span className="brand-wordmark__app">APP</span>
    </span>
  );
}
