import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useHomeSearch } from '../../hooks/useHomeSearch';
import { cn } from '@/lib/utils';

const ROTATING = [
  'Busca restaurantes…',
  'Compra mercado…',
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
  const isHero = variant === 'hero';
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
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
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const go = (to, label) => {
    if (label) commitSearch(label);
    setOpen(false);
    navigate(to);
  };

  const showPanel = open && (query.length > 0 || history.length > 0);

  return (
    <div
      ref={wrapRef}
      className={cn(
        'z-40 mx-auto w-full max-w-[1100px]',
        sticky && (isHero ? 'sticky top-0' : 'sticky top-14 sm:top-16'),
        className,
      )}
    >
      <div
        className={cn(
          'home-mega-search flex min-h-[3.5rem] items-center gap-3 px-4 transition-shadow sm:min-h-[4rem] sm:px-5',
          isHero
            ? 'home-mega-search--hero'
            : 'rounded-[24px] border border-input bg-background/95 shadow-lift backdrop-blur-xl focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20',
          showPanel && (isHero ? 'home-mega-search--open' : 'rounded-b-none border-b-0 shadow-none'),
        )}
      >
        <AppIcon
          name="search"
          size="md"
          className={cn('home-mega-search__icon shrink-0', isHero ? 'text-[#28B463]' : 'text-primary')}
        />
        <input
          type="search"
          value={query}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim().length >= 2) {
              commitSearch(query.trim());
              setOpen(false);
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={ROTATING[placeholderIdx]}
          aria-label="Buscar productos, negocios y servicios"
          aria-expanded={showPanel}
          className={cn(
            'home-mega-search__input h-12 w-full bg-transparent text-base font-semibold outline-none sm:h-14 sm:text-lg',
            isHero
              ? 'text-[#0D2B45] placeholder:font-medium placeholder:text-[#4A6278]'
              : 'placeholder:font-medium placeholder:text-muted-foreground',
          )}
        />
        {isLoading && debouncedQuery.length >= 2 && (
          <AppIcon name="loading" size="sm" className="animate-spin text-[#4A6278]" />
        )}
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
            onClick={() => {
              if (query.trim().length >= 2) {
                commitSearch(query.trim());
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              } else {
                setOpen(true);
              }
            }}
          >
            Buscar
          </button>
        </div>
      </div>

      {showPanel && (
        <div
          role="listbox"
          className={cn(
            'max-h-96 overflow-y-auto border border-t-0 bg-white px-2 py-2 shadow-lift',
            isHero
              ? 'home-mega-search__panel rounded-b-[1.5rem] border-[#D5E3EF]'
              : 'rounded-b-2xl border-input bg-popover',
          )}
        >
          {query.length < 2 && history.length > 0 && (
            <div className="mb-2">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4A6278]">Historial</p>
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC]"
                  onClick={() => onQueryChange(h)}
                >
                  <AppIcon name="search" size="xs" className="text-[#4A6278]" />
                  {h}
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && isEmpty && !isLoading && (
            <p className="px-4 py-6 text-center text-sm text-[#4A6278]">
              Sin resultados — prueba otra palabra o pide un mandado
            </p>
          )}

          {results.categories?.map((c) => (
            <button
              key={c.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC]"
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
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC]"
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
              className="flex w-full justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-[#0D2B45] hover:bg-[#F7FAFC]"
              onClick={() => go(p.to, p.name)}
            >
              <span className="flex items-center gap-2">
                <AppIcon name={p.emoji || 'package'} size="xs" />
                {p.name}
              </span>
              <span className="text-xs text-[#4A6278]">{p.businessName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
