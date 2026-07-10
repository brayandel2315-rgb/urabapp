import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/design-system/ui/badge';
import { formatCOP } from '@/utils/currency';
import CatalogImage from '@/components/ui/CatalogImage';
import BusinessRating from '@/components/reviews/BusinessRating';
import { resolveBusinessCover, resolveBusinessLogo } from '@/utils/catalog-images';
import { isBusinessOpenNow } from '@/utils/schedule';
import { getBarrioDeliveryTier } from '@/utils/barrio';
import { formatDistanceKm } from '@/utils/format-distance';

import { CARD_SHELL, CARD_INTERACTIVE, IMAGE_ASPECT } from '@/design-system/patterns/commerce-card-tokens';

const RANK_STYLES = {
  1: 'bg-amber-400 text-amber-950 ring-amber-300',
  2: 'bg-slate-300 text-slate-800 ring-slate-200',
  3: 'bg-orange-300 text-orange-950 ring-orange-200',
};

function RankBadge({ rank }) {
  if (!rank || rank > 3) return null;
  return (
    <span
      className={cn(
        'absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full font-display text-xs font-black shadow-md ring-2',
        RANK_STYLES[rank]
      )}
      aria-label={`Puesto ${rank}`}
    >
      {rank}
    </span>
  );
}

function OpenBadge({ open }) {
  if (open) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
        Abierto
      </span>
    );
  }
  return <Badge variant="destructive" className="text-[10px]">Cerrado</Badge>;
}

function DeliveryMeta({ business, className, barrio, municipio, coverage }) {
  const time = business.delivery_time || 25;
  const fee = business.delivery_fee != null ? formatCOP(business.delivery_fee) : null;
  const distLabel = formatDistanceKm(business.distanceKm ?? business.distance_km);
  const tier = barrio ? getBarrioDeliveryTier(business, barrio, municipio) : null;
  const cov = coverage || business.coverage;
  const coverageWarn = cov && !cov.available;

  return (
    <div className={cn('flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#4A6278]', className)}>
      <BusinessRating business={business} size="sm" />
      {distLabel && (
        <>
          <span className="text-[#D5E3EF]">·</span>
          <span>{distLabel}</span>
        </>
      )}
      <span className="text-[#D5E3EF]">·</span>
      <span>~{time} min</span>
      {fee && (
        <>
          <span className="text-[#D5E3EF]">·</span>
          <span>{fee}</span>
        </>
      )}
      {coverageWarn && (
        <>
          <span className="text-[#D5E3EF]">·</span>
          <span className="font-semibold text-destructive">Sin cobertura</span>
        </>
      )}
      {tier === 'local' && !coverageWarn && (
        <>
          <span className="text-[#D5E3EF]">·</span>
          <span className="font-medium text-[#28B463]">En tu barrio</span>
        </>
      )}
    </div>
  );
}

function CardImage({ business, open, rank, showLogo = false, imageLoading = 'lazy' }) {
  const cover = resolveBusinessCover(business);
  const logo = showLogo ? resolveBusinessLogo(business) : null;

  return (
    <div className={cn('relative overflow-hidden bg-muted/30', IMAGE_ASPECT)}>
      <CatalogImage
        src={cover}
        emoji={business.emoji || 'store'}
        alt={business.name}
        rounded="none"
        size="lg"
        loading={imageLoading}
        fetchPriority={imageLoading === 'eager' ? 'high' : undefined}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      <RankBadge rank={rank} />
      <div className={cn('absolute z-[1]', rank ? 'left-11 top-2' : 'left-2 top-2')}>
        <OpenBadge open={open} />
      </div>
      {logo && (
        <div className="absolute bottom-2 left-2 h-10 w-10 overflow-hidden rounded-xl bg-card shadow-md ring-2 ring-card">
          <CatalogImage src={logo} emoji={business.emoji || 'store'} alt="" rounded="xl" size="sm" />
        </div>
      )}
    </div>
  );
}

function CardBody({ business, className, compact = false, barrio, municipio, coverage }) {
  return (
    <div className={cn('flex flex-1 flex-col p-3', compact ? 'min-h-[80px]' : 'min-h-[92px]', className)}>
      <h3
        className={cn(
          'font-display font-bold leading-tight text-foreground',
          compact ? 'truncate text-[15px]' : 'line-clamp-2 text-base'
        )}
      >
        {business.name}
      </h3>
      {!compact && business.description && (
        <p className="mt-1 line-clamp-1 flex-1 text-sm text-muted-foreground">{business.description}</p>
      )}
      <DeliveryMeta
        business={business}
        barrio={barrio}
        municipio={municipio}
        coverage={coverage}
        className="mt-auto pt-1.5"
      />
    </div>
  );
}

/** Carrusel horizontal — móvil */
function CompactCard({ business, href, className, rank, barrio, municipio }) {
  const open = isBusinessOpenNow(business);

  return (
    <Link
      to={href}
      className={cn(
        'group block w-full min-w-0',
        className
      )}
    >
      <article className={cn(CARD_SHELL, CARD_INTERACTIVE, 'flex h-full flex-col')}>
        <CardImage business={business} open={open} rank={rank} />
        <CardBody business={business} compact barrio={barrio} municipio={municipio} />
      </article>
    </Link>
  );
}

/** Grid — desktop y destacados */
function GridCard({ business, href, className, rank, barrio, municipio, imageLoading = 'lazy' }) {
  const open = isBusinessOpenNow(business);

  return (
    <Link to={href} className={cn('group block h-full', className)}>
      <article className={cn(CARD_SHELL, CARD_INTERACTIVE, 'flex h-full flex-col')}>
        <CardImage business={business} open={open} rank={rank} showLogo imageLoading={imageLoading} />
        <CardBody business={business} barrio={barrio} municipio={municipio} />
      </article>
    </Link>
  );
}

/** Tile compacto — carrusel de tiendas en home */
function StoreTileCard({ business, href, className, barrio, municipio, imageLoading = 'lazy' }) {
  const cover = resolveBusinessCover(business);
  const open = isBusinessOpenNow(business);
  const time = business.delivery_time || 25;

  return (
    <Link to={href} className={cn('home-store-tile-link block min-w-0', className)}>
      <article className="home-store-tile">
        <div className="home-store-tile__media">
          <CatalogImage
            src={cover}
            emoji={business.emoji || 'store'}
            alt={business.name}
            rounded="none"
            size="lg"
            loading={imageLoading}
            fetchPriority={imageLoading === 'eager' ? 'high' : undefined}
          />
          {open ? (
            <span className="home-store-tile__badge">Abierto</span>
          ) : (
            <span className="home-store-tile__badge home-store-tile__badge--closed">Cerrado</span>
          )}
        </div>
        <div className="home-store-tile__body">
          <h3 className="home-store-tile__name">{business.name}</h3>
          <div className="home-store-tile__meta">
            <BusinessRating business={business} size="sm" />
            <span className="home-store-tile__dot" aria-hidden>·</span>
            <span>~{time} min</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

/** Lista vertical — feed principal móvil */
function ListCard({ business, href, className, rank, barrio, municipio }) {
  const cover = resolveBusinessCover(business);
  const open = isBusinessOpenNow(business);

  return (
    <Link to={href} className={cn('group block', className)}>
      <article className={cn(CARD_SHELL, 'flex gap-3 p-3', CARD_INTERACTIVE)}>
        <div className="relative h-[104px] w-[104px] shrink-0 overflow-hidden rounded-xl bg-muted/30 sm:h-[96px] sm:w-[96px]">
          <CatalogImage src={cover} emoji={business.emoji || 'store'} alt={business.name} size="lg" />
          {!open && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="text-[10px] font-bold uppercase text-white">Cerrado</span>
            </div>
          )}
          {rank && (
            <span
              className={cn(
                'absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full font-display text-[10px] font-black shadow ring-1',
                RANK_STYLES[rank]
              )}
            >
              {rank}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-0.5">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-display text-base font-bold leading-tight text-foreground">
              {business.name}
            </h3>
            {open ? (
              <span className="shrink-0 text-[10px] font-bold text-[#28B463]">Abierto</span>
            ) : (
              <Badge variant="destructive" className="shrink-0 text-[10px]">Cerrado</Badge>
            )}
          </div>
          {business.description && (
            <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{business.description}</p>
          )}
          <DeliveryMeta
            business={business}
            barrio={barrio}
            municipio={municipio}
            className="mt-1.5"
          />
        </div>
      </article>
    </Link>
  );
}

export default function MarketplaceCard({
  business,
  layout = 'grid',
  className,
  rank,
  barrio,
  municipio,
  imageLoading = 'lazy',
}) {
  const href = `/tienda/${business.slug || business.id}`;
  const muni = municipio || business.municipio;

  if (layout === 'compact') {
    return <CompactCard business={business} href={href} className={className} rank={rank} barrio={barrio} municipio={muni} />;
  }
  if (layout === 'grid') {
    return (
      <GridCard
        business={business}
        href={href}
        className={className}
        rank={rank}
        barrio={barrio}
        municipio={muni}
        imageLoading={imageLoading}
      />
    );
  }
  if (layout === 'store-tile') {
    return (
      <StoreTileCard
        business={business}
        href={href}
        className={className}
        barrio={barrio}
        municipio={muni}
        imageLoading={imageLoading}
      />
    );
  }
  return <ListCard business={business} href={href} className={className} rank={rank} barrio={barrio} municipio={muni} />;
}
