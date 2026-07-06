import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '@/design-system/icons/AppIcon';
import { cn } from '@/lib/utils';
import { useHomeSearch } from '@/modules/home/hooks/useHomeSearch';
import { formatCOP } from '@/utils/currency';

const PLACEHOLDERS = [
  'Busca comida, mercado, farmacia…',
  '¿Patacón, sancocho o jugo?',
  'Tiendas y productos locales…',
  'Mandados y envíos…',
];

function ResultSection({ title, children }) {
  if (!children) return null;
  return (
    <div className="py-1">
      <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

export default function DiscoverSearchBar({
  value,
  onChange,
  onSubmit,
  municipio,
  userId,
  catalog,
  getBusinessesParams,
  autoFocus = false,
  className,
  showDropdown = true,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  const { results, history, isLoading, isEmpty, commitSearch, debouncedQuery } = useHomeSearch({
    query: value,
    municipio,
    catalog,
    getBusinessesParams,
    enabled: showDropdown && (open || value.length > 0),
    userId,
  });

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  useEffect(() => {
    const id = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const submit = (term) => {
    const q = (term ?? value).trim();
    if (q.length < 2) return;
    commitSearch(q);
    setOpen(false);
    onSubmit?.(q);
  };

  const go = (to, label) => {
    if (label) commitSearch(label);
    setOpen(false);
    navigate(to);
  };

  const showPanel = showDropdown && open && (value.length > 0 || history.length > 0);
  const hasLive = debouncedQuery.length >= 2 && (results.businesses?.length || results.products?.length || results.categories?.length);

  return (
    <div ref={wrapRef} className={cn('relative z-20', className)}>
      <form
        className={cn('discover-search-bar', showPanel && 'discover-search-bar--open')}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <span className="discover-search-bar__lens">
          <AppIcon name="search" size="md" className="text-primary" />
        </span>
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={PLACEHOLDERS[placeholderIdx]}
          aria-label="Buscar tiendas, productos y servicios"
          aria-expanded={showPanel}
          aria-autocomplete="list"
          className="discover-search-bar__input"
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="discover-search-bar__clear"
            aria-label="Limpiar búsqueda"
          >
            <AppIcon name="close" size="xs" />
          </button>
        )}
        {isLoading && debouncedQuery.length >= 2 && (
          <AppIcon name="loading" size="sm" className="mr-2 animate-spin text-primary" />
        )}
        <button type="submit" className="discover-search-bar__submit">
          <span className="hidden sm:inline">Buscar</span>
          <AppIcon name="search" size="sm" className="sm:hidden" />
        </button>
      </form>

      {showPanel && (
        <div className="discover-search-panel" role="listbox">
          {value.length < 2 && history.length > 0 && (
            <ResultSection title="Recientes">
              {history.map((h) => (
                <button
                  key={h}
                  type="button"
                  className="discover-search-panel__item"
                  onClick={() => {
                    onChange(h);
                    submit(h);
                  }}
                >
                  <AppIcon name="orders" size="xs" className="text-muted-foreground" />
                  <span className="font-semibold">{h}</span>
                </button>
              ))}
            </ResultSection>
          )}

          {debouncedQuery.length >= 2 && isEmpty && !isLoading && (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Sin coincidencias — prueba otra palabra o explora por categoría abajo
            </p>
          )}

          {hasLive && (
            <>
              {results.categories?.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="discover-search-panel__item discover-search-panel__item--accent"
                  onClick={() => go(c.to, c.label)}
                >
                  <AppIcon name="mensajeria" size="xs" className="text-brand-blue" />
                  <span className="font-semibold">{c.label}</span>
                  <AppIcon name="back" size="xs" className="ml-auto rotate-180 text-muted-foreground" />
                </button>
              ))}

              {results.businesses?.length > 0 && (
                <ResultSection title="Tiendas">
                  {results.businesses.slice(0, 5).map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className="discover-search-panel__item"
                      onClick={() => go(b.to, b.name)}
                    >
                      <AppIcon name={b.emoji || 'store'} size="xs" className="text-primary" />
                      <span className="min-w-0 flex-1 truncate font-semibold">{b.name}</span>
                      {b.isOpen === false && (
                        <span className="text-[10px] font-bold text-muted-foreground">Cerrado</span>
                      )}
                    </button>
                  ))}
                </ResultSection>
              )}

              {results.products?.length > 0 && (
                <ResultSection title="Productos">
                  {results.products.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="discover-search-panel__item"
                      onClick={() => go(p.to, p.name)}
                    >
                      <AppIcon name={p.emoji || 'package'} size="xs" />
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className="shrink-0 text-xs font-bold text-primary">{formatCOP(p.price)}</span>
                    </button>
                  ))}
                </ResultSection>
              )}

              <button
                type="button"
                className="discover-search-panel__footer"
                onClick={() => submit()}
              >
                Ver todos los resultados para “{debouncedQuery}”
                <AppIcon name="back" size="xs" className="rotate-180" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
