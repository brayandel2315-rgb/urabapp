import { cn } from '@/lib/utils';

/**
 * Enlace de salto al contenido principal (teclado / lectores de pantalla).
 */
export default function SkipToContent({
  href = '#main-content',
  label = 'Saltar al contenido',
  className,
}) {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]',
        'focus:rounded-[var(--radius-component)] focus:bg-primary focus:px-4 focus:py-2.5',
        'focus:text-sm focus:font-bold focus:text-primary-foreground focus:shadow-float',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      {label}
    </a>
  );
}
