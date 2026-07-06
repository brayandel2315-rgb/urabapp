import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getMunicipioHeroProfile, URABA_HERO_IMAGES } from '@/utils/uraba-brand';

/**
 * Fondo hero con foto local + overlay verde suave.
 */
export default function UrabaHeroBackdrop({
  children,
  className = '',
  image = URABA_HERO_IMAGES.primary,
  objectPosition = 'center center',
  overlayClassName = 'uraba-green-overlay',
}) {
  const [src, setSrc] = useState(image);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSrc(image);
    setLoaded(false);
  }, [image]);

  const handleError = () => {
    if (src !== URABA_HERO_IMAGES.primary) {
      setSrc(URABA_HERO_IMAGES.primary);
      setLoaded(false);
    }
  };

  return (
    <div className={cn('uraba-hero relative min-h-[300px] overflow-hidden sm:min-h-[340px] lg:min-h-[440px]', className)}>
      <img
        key={src}
        src={src}
        alt=""
        aria-hidden
        decoding="async"
        loading="eager"
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
        onError={handleError}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        style={{ objectPosition }}
      />
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-primary/30 via-primary/15 to-secondary/40" aria-hidden />
      )}
      <div className={cn('absolute inset-0', overlayClassName)} aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function MunicipioHeroBackdrop({ municipio, className, children }) {
  const profile = getMunicipioHeroProfile(municipio);
  return (
    <UrabaHeroBackdrop
      className={className}
      image={profile.image}
      objectPosition={profile.objectPosition}
    >
      {children}
    </UrabaHeroBackdrop>
  );
}
