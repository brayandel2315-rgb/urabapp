import AppIcon from '@/design-system/icons/AppIcon';
import { formatCOP } from '@/utils/currency';
import { formatBusinessHours } from '@/utils/schedule';
import {
  getPreviewMerchantLevel,
  getPreviewStory,
  isOnboardingPreview,
} from '@/utils/onboarding-preview';
import { cn } from '@/lib/utils';

function SocialLink({ href, label, icon }) {
  if (!href) return null;
  const url = href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')
    ? href
    : href.startsWith('@')
      ? `https://instagram.com/${href.slice(1)}`
      : href;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      <AppIcon name={icon} size={12} aria-hidden />
      {label}
    </a>
  );
}

/**
 * Perfil legible de tienda (historia, horario, radio, redes) — pensado para móvil.
 */
export default function BusinessStoreProfile({ business, className }) {
  if (!business) return null;

  const preview = isOnboardingPreview(business);
  const story = getPreviewStory(business);
  const hours = formatBusinessHours(business);
  const radius = business.delivery_radius_km ?? business.delivery_radius;
  const minOrder = Number(business.min_order) > 0 ? formatCOP(business.min_order) : null;
  const phone = business.phone || business.whatsapp;
  const whatsapp = business.whatsapp || business.phone;
  const instagram = business.instagram;
  const facebook = business.facebook;
  const website = business.website;
  const address = business.address;
  const level = preview ? getPreviewMerchantLevel(business) : null;

  const hasSocial = Boolean(whatsapp || instagram || facebook || website || phone);

  return (
    <section
      className={cn('space-y-3 rounded-2xl border border-border/80 bg-card/80 p-3.5 sm:p-4', className)}
      aria-labelledby="store-profile-title"
    >
      <div className="flex items-center justify-between gap-2">
        <h2 id="store-profile-title" className="font-display text-base font-bold text-foreground">
          Sobre la tienda
        </h2>
        {preview && level ? (
          <span className="shrink-0 rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
            {level}
          </span>
        ) : null}
      </div>

      {story ? (
        <p className="text-sm leading-relaxed text-muted-foreground">{story}</p>
      ) : null}

      <dl className="grid grid-cols-2 gap-2 text-xs">
        {hours && hours !== 'Horario no definido' ? (
          <div className="rounded-xl bg-muted/40 px-2.5 py-2">
            <dt className="font-semibold text-muted-foreground">Horario</dt>
            <dd className="mt-0.5 font-bold text-foreground">{hours}</dd>
          </div>
        ) : null}
        {radius != null && Number(radius) > 0 ? (
          <div className="rounded-xl bg-muted/40 px-2.5 py-2">
            <dt className="font-semibold text-muted-foreground">Radio</dt>
            <dd className="mt-0.5 font-bold text-foreground">{Number(radius)} km</dd>
          </div>
        ) : null}
        {minOrder ? (
          <div className="rounded-xl bg-muted/40 px-2.5 py-2">
            <dt className="font-semibold text-muted-foreground">Pedido mín.</dt>
            <dd className="mt-0.5 font-bold text-foreground">{minOrder}</dd>
          </div>
        ) : null}
        {business.delivery_time || business.prep_time_minutes ? (
          <div className="rounded-xl bg-muted/40 px-2.5 py-2">
            <dt className="font-semibold text-muted-foreground">Entrega est.</dt>
            <dd className="mt-0.5 font-bold text-foreground">
              ~{business.delivery_time || business.prep_time_minutes} min
            </dd>
          </div>
        ) : null}
      </dl>

      {address ? (
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <AppIcon name="map" size={14} className="mt-0.5 shrink-0 text-primary" aria-hidden />
          <span>
            {address}
            {business.municipio ? ` · ${business.municipio}` : ''}
          </span>
        </p>
      ) : null}

      {hasSocial ? (
        <div className="flex flex-wrap gap-2" aria-label="Contacto y redes">
          {whatsapp ? (
            <SocialLink
              href={`https://wa.me/${String(whatsapp).replace(/\D/g, '')}`}
              label="WhatsApp"
              icon="whatsapp"
            />
          ) : null}
          {phone && phone !== whatsapp ? (
            <SocialLink href={`tel:${phone}`} label="Llamar" icon="phone" />
          ) : null}
          {instagram ? (
            <SocialLink href={instagram} label="Instagram" icon="instagram" />
          ) : null}
          {facebook ? (
            <SocialLink href={facebook} label="Facebook" icon="link" />
          ) : null}
          {website ? (
            <SocialLink href={website} label="Sitio web" icon="link" />
          ) : null}
        </div>
      ) : null}

      {preview ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-2.5 py-2 text-[11px] leading-relaxed text-muted-foreground">
          Logo y fotos oficiales se confirman con el kit del comercio (web, Instagram o Google Business).
          No usamos assets de marketplaces competidores.
        </p>
      ) : null}
    </section>
  );
}
