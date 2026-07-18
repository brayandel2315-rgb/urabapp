import BrandLogo from '@/components/brand/BrandLogo';
import { cn } from '@/lib/utils';

const LOGO_VARIANT = {
  screen: 'auth',
  page: 'auth',
  section: 'compact',
  compact: 'icon',
  overlay: 'icon',
};

const LOGO_CLASS = {
  screen: 'branded-loading__logo--screen',
  page: 'branded-loading__logo--page',
  section: 'branded-loading__logo--section',
  compact: 'branded-loading__logo--compact',
  overlay: 'branded-loading__logo--overlay',
};

/**
 * Pantalla de carga unificada con logo Urabapp.
 * variant: screen (viewport) | page (50vh) | section (panel) | compact | overlay
 */
export default function BrandedLoadingScreen({
  message = 'Cargando Urabapp…',
  variant = 'screen',
  className,
  hideMessage = false,
}) {
  return (
    <div
      className={cn('branded-loading', `branded-loading--${variant}`, className)}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <BrandLogo
        variant={LOGO_VARIANT[variant] || 'compact'}
        className={cn('branded-loading__logo', LOGO_CLASS[variant])}
        alt="Urabapp"
      />
      {!hideMessage && message ? (
        <p className="branded-loading__message">{message}</p>
      ) : null}
      <div className="branded-loading__spinner" aria-hidden="true" />
    </div>
  );
}
