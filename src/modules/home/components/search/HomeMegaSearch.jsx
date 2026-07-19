import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useHomeSearch } from '../../hooks/useHomeSearch';
import { cn } from '@/lib/utils';

const ROTATING = [
  '¿Qué necesitas hoy?',
  'Buscar comida…',
  'Comprar mercado…',
  'Enviar paquete…',
  'Buscar farmacia…',
];

export default function HomeMegaSearch({
  query,
  onQueryChange,
  municipio,
  userId,
  className,
  sticky = true,
  variant = 'default',
}) {
  const isHeroMobile = variant === 'hero-mobile';
  const isHero = variant === 'hero' || isHeroMobile;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const wrapRef = useRef(null);
  const { results, history, isLoading, isEmpty, commitSearch, debouncedQuery } = useHomeSearch({
    query,
    municipio,
    enabled: open || query.length > 0,
    userId,
  });

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % ROTATING.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc, { passive: true });
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.searchActive = focused ? 'true' : 'false';
    return () => {
      delete document.documentElement.dataset.searchActive;
    };
  }, [focused]);

  const go = (to, label) => {
    if (label) commitSearch(label);
    setOpen(false);
    navigate(to);
  };

  const goToExplore = () => {
    const term = query.trim();
    if (term.length >= 2) commitSearch(term);
    setOpen(false);
    navigate(term.length >= 2 ? `/search?q=${encodeURIComponent(term)}` : '/search');
  };

  const showPanel = open && (query.length > 0 || history.length > 0);
  const hasResults = (results.categories?.length ?? 0) > 0
    || (results.businesses?.length ?? 0) > 0
    || (results.products?.length ?? 0) > 0;

  return (
    <div
      ref={wrapRef}
      className={cn(
        'relative z-40',
        isHeroMobile && 'w-full',
        isHero && !isHeroMobile && 'w-full',
        !isHero && 'mx-auto w-full max-w-[1100px]',
        sticky && !isHeroMobile && (isHero ? 'sticky top-0' : 'sticky top-14 sm:top-16'),
        className,
      )}
    >
      <div
        className={cn(
          'home-mega-search flex items-center transition-shadow',
          isHeroMobile
            ? 'home-mega-search--hero-mobile min-h-[3rem] gap-2.5 px-3 py-1.5'
            : 'min-h-[3.5rem] gap-3 px-4 sm:min-h-[4rem] sm:px-5',
          isHero && !isHeroMobile && 'home-mega-search--hero rounded-[24px]',
          !isHero && 'rounded-[24px] border border-input bg-background/95 shadow-lift backdrop-blur-xl focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20',
          focused && 'home-mega-search--active',
          showPanel && isHeroMobile && 'home-mega-search--open home-mega-search--hero-mobile-open',
          showPanel && isHero && !isHeroMobile && 'home-mega-search--open',
          showPanel && !isHero && 'rounded-b-none border-b-0 shadow-none',
        )}
      >
        <span
          className={cn(
            'home-mega-search__icon-wrap flex shrink-0 items-center justify-center',
            isHeroMobile ? 'h-8 w-8 rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_10%,white)]' : '',
          )}
        >
          <AppIcon
            name="search"
            size={isHeroMobile ? 'sm' : 'md'}
            className={cn('home-mega-search__icon shrink-0', isHero ? 'text-[var(--brand-primary)]' : 'text-primary')}
          />
        </span>
        <input
          type="search"
          enterKeyHint="search"
          value={query}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              goToExplore();
            }
          }}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder={ROTATING[placeholderIdx]}
          aria-label="Buscar productos, tiendas y servicios"
          aria-expanded={showPanel}
          aria-controls={showPanel ? 'home-mega-search-panel' : undefined}
          className={cn(
            'home-mega-search__input w-full min-w-0 bg-transparent outline-none',
            isHeroMobile
              ? 'h-10 text-[15px] font-semibold text-[#111111] placeholder:font-medium placeholder:text-[#6B7280]'
              : 'h-12 text-base font-semibold sm:h-14 sm:text-lg',
            isHero && !isHeroMobile
              ? 'text-[#111111] placeholder:font-medium placeholder:text-[#4B5563]'
              : !isHeroMobile && 'placeholder:font-medium placeholder:text-muted-foreground',
          )}
        />
        {isLoading && debouncedQuery.length >= 2 && (
          <AppIcon name="loading" size="sm" className="shrink-0 animate-spin text-[#4A6278]" />
        )}
        {isHeroMobile ? (
          <button
            type="button"
            className="home-mega-search__action flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand-primary)_10%,white)] text-[var(--brand-primary)] transition active:scale-95"
            aria-label="Escanear código (próximamente)"
            title="Escáner — próximamente"
          >
            <AppIcon name="qr" size="sm" />
          </button>
        ) : (
          <div className="hidden shrink-0 items-center gap-1 sm:flex">
            <button
              type="button"
              className={cn(
                'rounded-full border p-2.5 transition hover:scale-105',
                isHero
                  ? 'border-[#D5E3EF] text-[#4A6278] hover:bg-[#F7FAFC]'
                  : 'border-border/60 text-muted-foreground hover:bg-muted',
              )}
              aria-label="Búsqueda por voz (próximamente)"
              title="Voz — próximamente"
            >
              <AppIcon name="chat" size="sm" />
            </button>
            <button
              type="button"
              className={cn(
                'rounded-full border p-2.5 transition hover:scale-105',
                isHero
                  ? 'border-[#D5E3EF] text-[#4A6278] hover:bg-[#F7FAFC]'
                  : 'border-border/60 text-muted-foreground hover:bg-muted',
              )}
              aria-label="Escanear código (próximamente)"
              title="Escáner — próximamente"
            >
              <AppIcon name="qr" size="sm" />
            </button>
            <button
              type="button"
              className={cn(
                'hidden rounded-full px-4 py-2.5 text-sm font-bold transition hover:scale-105 md:inline-flex',
                isHero
                  ? 'bg-[#28B463] text-white hover:bg-[#239B56]'
                  : 'bg-primary text-primary-foreground',
              )}
              onClick={goToExplore}
            >
              Buscar
            </button>
          </div>
        )}
      </div>

      {showPanel && (
        <div
          id="home-mega-search-panel"
          role="listbox"
          className={cn(
            'home-mega-search__panel overflow-y-auto border border-t-0 bg-white px-2 py-2 shadow-lift',
            isHeroMobile
              ? 'max-h-[min(18rem,52vh)] rounded-b-[1.25rem] border-[#E5E7EB]'
              : 'max-h-96',
            isHero && !isHeroMobile && 'rounded-b-[1.5rem] border-[#D5E3EF]',
            !isHero && 'rounded-b-2xl border-input bg-popover',
          )}
        >
          {query.length < 2 && history.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4A6278]">Recientes</p>
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC] active:bg-[#F7FAFC]"
                  onClick={() => {
                    onQueryChange(h);
                    setOpen(true);
                  }}
                >
                  <AppIcon name="search" size="xs" className="text-[#4A6278]" />
                  {h}
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && isEmpty && !isLoading && (
            <p className="px-4 py-5 text-center text-sm text-[#4A6278]">
              Sin resultados — prueba otra palabra o explora el catálogo
            </p>
          )}

          {results.categories?.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC] active:bg-[#F7FAFC]"
              onClick={() => go(c.to, c.label)}
            >
              <AppIcon name="envios" size="xs" className="text-[#28B463]" />
              {c.label}
            </button>
          ))}

          {results.businesses?.map((b) => (
            <button
              key={b.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC] active:bg-[#F7FAFC]"
              onClick={() => go(b.to, b.name)}
            >
              <AppIcon name={b.emoji || 'store'} size="xs" className="text-[#28B463]" />
              <span className="font-semibold">{b.name}</span>
            </button>
          ))}

          {results.products?.map((p) => (
            <button
              key={p.id}
              type="button"
              className="flex w-full justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC] active:bg-[#F7FAFC]"
              onClick={() => go(p.to, p.name)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <AppIcon name={p.emoji || 'package'} size="xs" />
                <span className="truncate">{p.name}</span>
              </span>
              <span className="shrink-0 text-xs text-[#4A6278]">{p.businessName}</span>
            </button>
          ))}

          {(query.trim().length >= 2 || hasResults) && (
            <button
              type="button"
              className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-[18px] border-0 bg-[#F7F8FA] px-3 py-2.5 text-sm font-semibold text-[var(--brand-primary)] active:bg-[color-mix(in_srgb,var(--brand-primary)_8%,white)]"
              onClick={goToExplore}
            >
              Ver en Explorar
              <AppIcon name="back" size={14} className="rotate-180" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
