import { cn } from '@/lib/utils';
import { BRAND } from '@/utils/constants';
import { BRAND_LOGO_SRC } from '@/assets/logo/brand';

/**
 * Logo Urabapp — PNG transparente en todas las variantes y pantallas.
 */
export default function BrandLogo({
  variant = 'full',
  className,
  alt = BRAND.name,
  ...props
}) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={alt}
      className={cn(
        'brand-logo object-contain select-none bg-transparent',
        variant === 'full' && 'h-9 w-auto max-w-[10.5rem] sm:h-10 sm:max-w-[11.5rem]',
        variant === 'compact' && 'h-9 w-auto max-w-[10rem] sm:h-[2.35rem] sm:max-w-[11rem]',
        variant === 'desktop-nav' && 'h-[3.35rem] w-auto max-w-[15rem] lg:h-[3.65rem] lg:max-w-[16.5rem]',
        variant === 'icon' && 'h-9 w-9 sm:h-10 sm:w-10',
        variant === 'nav' && 'h-8 w-8',
        variant === 'nav-featured' && 'h-10 w-10',
        variant === 'auth' && 'h-16 w-auto max-w-[12rem] sm:h-[4.5rem]',
        variant === 'footer' && 'h-10 w-auto max-w-[9rem] opacity-95',
        variant === 'home-hero' && 'h-[6.75rem] w-auto max-w-[min(100%,28rem)] object-left',
        className,
      )}
      draggable={false}
      {...props}
    />
  );
}
