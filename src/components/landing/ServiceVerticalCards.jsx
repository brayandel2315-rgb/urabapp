import { Link } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { CATEGORIES, VERTICALS_INTRO, VERTICAL_CARD_THEMES } from '@/utils/constants';

const CARD_THEMES = VERTICAL_CARD_THEMES;

function getCategoryLink(cat) {
  if (cat.route) return cat.route;
  if (cat.id === 'envios') return '/envios';
  if (cat.id === 'mensajeria') return '/mandado';
  if (cat.id === 'tiendas') return '/?category=mercado';
  return `/?category=${cat.id}`;
}

function ServiceVerticalCard({ cat }) {
  const theme = CARD_THEMES[cat.id] ?? CARD_THEMES.tiendas;
  const line = cat.cardLine ?? cat.description;

  const inner = (
  <>
    <div
      className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} ${cat.comingSoon ? 'opacity-80' : ''}`}
      aria-hidden
    />
    <div className={`pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full blur-2xl ${theme.glow}`} aria-hidden />
    <div className="pointer-events-none absolute -bottom-2 right-0 opacity-20" aria-hidden>
      <AppIcon name={cat.icon} size={80} className="text-white" />
    </div>

    <div className="relative z-10 flex min-h-[7.25rem] flex-col justify-between p-4 sm:min-h-[7.75rem] sm:p-5">
      <div className="max-w-[68%] sm:max-w-[72%]">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {(cat.badge || cat.comingSoon) && (
            <span className="rounded-full bg-black/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
              {cat.comingSoon ? (cat.comingLabel ?? 'Próximamente') : cat.badge}
            </span>
          )}
          {cat.tagline && !cat.comingSoon && (
            <span className="text-[11px] font-semibold text-white/85">{cat.tagline}</span>
          )}
        </div>
        <h3 className="font-display text-lg font-bold leading-tight text-white sm:text-xl">{cat.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-snug text-white/85 sm:text-sm">{line}</p>
      </div>

      {!cat.comingSoon && (
        <span
          className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-sm transition-transform group-hover:scale-[1.02] ${theme.pill}`}
        >
          {cat.cta}
          <span aria-hidden>→</span>
        </span>
      )}
    </div>

    <div
      className={`pointer-events-none absolute bottom-3 right-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg backdrop-blur-sm sm:h-16 sm:w-16 ${theme.iconWrap}`}
      aria-hidden
    >
      <AppIcon name={cat.icon} size="lg" />
    </div>
  </>
  );

  const className = `group relative block overflow-hidden rounded-2xl shadow-card transition-all duration-200 ${
    cat.comingSoon
      ? 'cursor-default opacity-90'
      : 'hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99]'
  }`;

  if (cat.comingSoon) {
    return <article className={className}>{inner}</article>;
  }

  return (
    <Link to={getCategoryLink(cat)} className={className}>
      {inner}
    </Link>
  );
}

export default function ServiceVerticalCards() {
  return (
    <section className="app-container py-10 lg:py-14">
      <div className="mb-6 lg:mb-8">
        <h2 className="text-heading text-2xl text-secondary lg:text-3xl">{VERTICALS_INTRO.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted lg:text-lg">{VERTICALS_INTRO.subtitle}</p>
      </div>

      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:gap-5">
        {CATEGORIES.map((cat) => (
          <ServiceVerticalCard key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}
