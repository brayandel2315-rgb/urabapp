import { cn } from '@/lib/utils';

/**
 * Marco estándar de contenido — centrado y con ancho máximo consistente en desktop.
 */
export default function AppContainer({
  children,
  className,
  narrow = false,
  as: Component = 'div',
}) {
  return (
    <Component
      className={cn(
        'mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8',
        narrow ? 'max-w-3xl' : 'max-w-6xl',
        className
      )}
    >
      {children}
    </Component>
  );
}
