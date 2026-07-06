import BusinessCard from '@/components/BusinessCard';
import HomeSectionHeader from '@/modules/client/components/HomeSectionHeader';
import { BusinessListSkeleton } from '@/components/marketplace/TopBusinessesRow';

export const VERTICAL_CATALOG_LIST = 'flex min-w-0 flex-col gap-3 lg:hidden';
export const VERTICAL_CATALOG_GRID =
  'hidden min-w-0 lg:grid lg:grid-cols-2 lg:gap-4 xl:grid-cols-3 [&_.group]:h-full';

export default function VerticalSectionRow({ section, municipio }) {
  const businesses = section?.businesses ?? [];
  if (!businesses.length) return null;

  return (
    <section aria-labelledby={`section-${section.type}`} className="min-w-0">
      <HomeSectionHeader
        id={`section-${section.type}`}
        title={section.title}
        subtitle={
          businesses.length
            ? `${businesses.length} disponible${businesses.length === 1 ? '' : 's'}${municipio ? ` · ${municipio}` : ''}`
            : undefined
        }
        variant="brand"
      />
      <div className={VERTICAL_CATALOG_LIST}>
        {businesses.map((b, i) => (
          <BusinessCard
            key={b.id}
            business={b}
            layout="list"
            municipio={municipio}
            imageLoading={i < 2 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
      <div className={VERTICAL_CATALOG_GRID}>
        {businesses.map((b, i) => (
          <BusinessCard
            key={`${b.id}-grid`}
            business={b}
            layout="grid"
            municipio={municipio}
            imageLoading={i < 2 ? 'eager' : 'lazy'}
          />
        ))}
      </div>
    </section>
  );
}

export function VerticalSectionsSkeleton() {
  return (
    <div className="space-y-10">
      <BusinessListSkeleton count={3} variant="list" />
      <BusinessListSkeleton count={3} variant="list" />
    </div>
  );
}
