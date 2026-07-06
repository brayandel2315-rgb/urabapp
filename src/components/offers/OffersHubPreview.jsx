import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import OfferBadge from './OfferBadge';
import OfferCountdown from './OfferCountdown';
import { formatCOP } from '@/utils/currency';
import { CARD_SHELL, CARD_INTERACTIVE } from '@/design-system/patterns/commerce-card-tokens';
import { cn } from '@/lib/utils';

export default function OffersHubPreview({ feed, className }) {
  const hero = feed?.hero?.[0];
  const featured = feed?.featured?.slice(0, 2) ?? [];
  const flash = feed?.flash?.[0];
  const welcome = feed?.welcome;

  if (!hero && !featured.length && !welcome) return null;

  return (
    <section className={cn('space-y-3', className)}>
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="section-title">Ofertas activas</h2>
          <p className="text-sm text-muted-foreground">¿Qué te conviene comprar ahora?</p>
        </div>
        <Link to="/ofertas" className="shrink-0 text-sm font-bold text-primary hover:underline">
          Ver todas →
        </Link>
      </div>

      <Link to="/ofertas" className={cn(CARD_SHELL, CARD_INTERACTIVE, 'block overflow-hidden')}>
        <div className="relative on-media bg-gradient-to-br from-primary via-emerald-600 to-teal-700 p-5">
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
          <div className="relative flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Hub de promos</p>
              <p className="text-heading mt-1 text-xl leading-tight text-white sm:text-2xl">
                {hero?.title || 'Descubre ofertas cerca de ti'}
              </p>
              <p className="mt-1 text-sm text-white/85 line-clamp-2">
                {hero?.subtitle || 'Flash, combos, misiones y recomendaciones personalizadas'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {flash && <OfferBadge badge="EXPIRA_HOY" />}
                {hero?.badge && <OfferBadge badge={hero.badge} />}
                {welcome && !welcome.link?.includes('used') && (
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[10px] font-bold">ENVÍO GRATIS</span>
                )}
              </div>
            </div>
            {hero?.endsAt && (
              <OfferCountdown
                endsAt={hero.endsAt}
                compact
                className="shrink-0 rounded-xl bg-black/20 px-3 py-2 [&_p]:text-white"
              />
            )}
          </div>
        </div>

        {featured.length > 0 && (
          <div className="grid grid-cols-2 divide-x divide-border border-t border-border bg-card">
            {featured.map((o) => (
              <div key={o.id} className="p-3">
                <p className="line-clamp-1 text-xs font-bold text-foreground">{o.name}</p>
                <p className="line-clamp-1 text-[11px] text-muted-foreground">{o.promoText}</p>
                {o.savings > 0 && (
                  <p className="mt-1 text-xs font-black text-primary">Ahorras {formatCOP(o.savings)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-wrap gap-2">
        {['Flash', 'Cerca', 'Combos', 'Misiones'].map((label) => (
          <Link
            key={label}
            to="/ofertas"
            className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10"
          >
            <AppIcon name="bolt" size="xs" />
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function OffersHubPreviewSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-5 w-40 rounded bg-border/60" />
      <div className="h-36 rounded-2xl bg-border/50" />
    </div>
  );
}
