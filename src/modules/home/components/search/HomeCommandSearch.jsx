import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { useHomeSearch } from '../../hooks/useHomeSearch';
import { cn } from '@/lib/utils';
import { STORE } from '@/utils/marketplace-copy';

const SUGGESTIONS = ['Arepas', 'Farmacia', 'Mandado', 'Pizza', 'Mercado'];

export default function HomeCommandSearch({
  query,
  onQueryChange,
  municipio,
  userId,
  className,
  autoFocus = false,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const { results, history, isLoading, isEmpty, commitSearch, debouncedQuery } = useHomeSearch({
    query,
    municipio,
    enabled: open,
    userId,
  });

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
    <div ref={wrapRef} className={cn('relative', className)}>
      <div className="flex items-center gap-2 rounded-2xl border border-input bg-background/95 px-3 py-2.5 shadow-soft backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/25">
        <AppIcon name="search" size="sm" className="shrink-0 text-primary" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="¿Qué necesitas hoy?"
          autoFocus={autoFocus}
          aria-label={`Buscar productos, categorías y ${STORE.manyLower}`}
          aria-expanded={showPanel}
          aria-controls="home-search-results"
          className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-medium placeholder:text-muted-foreground"
        />
        {isLoading && debouncedQuery.length >= 2 && (
          <span className="text-[10px] font-bold text-muted-foreground">…</span>
        )}
      </div>

      {showPanel && (
        <div
          id="home-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-80 overflow-y-auto rounded-2xl border border-border bg-popover p-2 shadow-lift"
        >
          {query.length < 2 && history.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recientes</p>
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  role="option"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    onQueryChange(h);
                    setOpen(true);
                  }}
                >
                  <AppIcon name="search" size="xs" className="text-muted-foreground" />
                  {h}
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && isEmpty && (
            <div className="px-3 py-4 text-center">
              <p className="text-sm font-semibold text-foreground">Sin resultados</p>
              <p className="mt-1 text-xs text-muted-foreground">Prueba con otra palabra o un mandado</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="rounded-full bg-muted px-3 py-1 text-xs font-bold"
                    onClick={() => onQueryChange(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.categories?.map((c) => (
            <button
              key={c.id}
              type="button"
              role="option"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => go(c.to, c.label)}
            >
              <AppIcon name="store" size="xs" className="text-primary" />
              {c.label}
            </button>
          ))}

          {results.businesses?.map((b) => (
            <button
              key={b.id}
              type="button"
              role="option"
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => go(b.to, b.name)}
            >
              <AppIcon name={b.emoji || 'store'} size="xs" className="text-primary" />
              <span className="font-semibold">{b.name}</span>
            </button>
          ))}

          {results.products?.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => go(p.to, p.name)}
            >
              <span className="flex items-center gap-2">
                <AppIcon name={p.emoji || 'package'} size="xs" />
                {p.name}
              </span>
              <span className="text-xs text-muted-foreground">{p.businessName}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
