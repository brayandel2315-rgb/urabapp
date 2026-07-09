import StickerIcon from '@/design-system/stickers/StickerIcon';
import AppIcon from '@/design-system/icons/AppIcon';
import Button from '@/components/ui/Button';
import { COURIER_TRUST_POINTS, SHIPMENT_TRUST_POINTS } from '@/data/service-journey';
import { cn } from '@/lib/utils';

const HERO_COPY = {
  courier: {
    sticker: 'mensajeria',
    title: 'Mandado urbano',
    subtitle: 'Recogemos y entregamos en tu municipio, puerta a puerta.',
    cta: 'Pedir mandado ahora',
    accent: 'from-[#E6F4FF] to-white border-[#0E6BA8]/20',
    trust: COURIER_TRUST_POINTS,
  },
  shipment: {
    sticker: 'envios',
    title: 'Envío intermunicipal',
    subtitle: 'Paquetes entre municipios del Urabá con rastreo y pago seguro.',
    cta: 'Cotizar envío',
    accent: 'from-[#ECFDF5] to-white border-[#0D9488]/20',
    trust: SHIPMENT_TRUST_POINTS,
  },
};

export default function ServiceCommercialHero({
  variant = 'courier',
  municipio,
  onPrimary,
  primaryLabel,
  className,
}) {
  const copy = HERO_COPY[variant] || HERO_COPY.courier;

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-card sm:p-6',
        copy.accent,
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex shrink-0 justify-center sm:justify-start">
          <div className="rounded-3xl bg-white/80 p-3 shadow-soft ring-1 ring-white/60">
            <StickerIcon name={copy.sticker} size="2xl" animated />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold text-[#4A6278]">
            UrabApp · {municipio || 'Urabá'}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-[#0D2B45] sm:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm text-[#4A6278] sm:text-base">
            {copy.subtitle}
          </p>

          <ul className="mt-4 grid grid-cols-2 gap-2">
            {copy.trust.map((item) => (
              <li key={item} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0D2B45] sm:text-xs">
                <AppIcon name="check" size="xs" className="shrink-0 text-[#28B463]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {onPrimary && (
            <Button
              type="button"
              className="mt-5 w-full bg-[#0E6BA8] hover:bg-[#0B5A8C] sm:w-auto"
              size="lg"
              onClick={onPrimary}
            >
              {primaryLabel || copy.cta}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
