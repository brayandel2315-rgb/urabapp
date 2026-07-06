import { useCallback, useEffect, useRef, useState } from 'react';
import { searchAddressSuggestions } from '@/services/map.service';
import { cn } from '@/lib/utils';

/**
 * Autocompletado de direcciones — Photon (Komoot/OSM, gratis, sin API key).
 */
export default function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Buscar dirección…',
  className,
  inputClassName,
  disabled,
  id,
  name,
  municipio,
  biasCoords,
  'aria-label': ariaLabel,
}) {
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const debounceRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchSuggestions = useCallback(async (text) => {
    const q = String(text || '').trim();
    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const results = await searchAddressSuggestions(q, {
        municipio,
        lat: biasCoords?.latitude,
        lon: biasCoords?.longitude,
      });
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIndex(-1);
    } finally {
      setLoading(false);
    }
  }, [municipio, biasCoords?.latitude, biasCoords?.longitude]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 280);
    return () => clearTimeout(debounceRef.current);
  }, [value, fetchSuggestions]);

  const selectSuggestion = (place) => {
    onPlaceSelect?.(place);
    onChange?.(place.label);
    setOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!open || !suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!listRef.current?.contains(e.target) && e.target !== inputRef.current) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className={cn('relative', className)} ref={listRef}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel || placeholder}
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="street-address"
        className={cn(
          'w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20',
          inputClassName,
        )}
      />
      {loading && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          …
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-lift"
          role="listbox"
        >
          {suggestions.map((place, index) => (
            <li key={`${place.latitude}-${place.longitude}-${index}`} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                className={cn(
                  'w-full px-3 py-2.5 text-left text-sm hover:bg-muted/60',
                  index === activeIndex && 'bg-primary/10 text-primary',
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(place)}
              >
                {place.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
