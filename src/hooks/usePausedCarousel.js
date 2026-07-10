import { useCallback, useEffect, useRef } from 'react';

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Avanza un carrusel horizontal tarjeta a tarjeta con pausa entre slides.
 */
export function usePausedCarousel({
  itemCount,
  intervalMs = 3800,
  enabled = true,
}) {
  const ref = useRef(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const autoEnabled = enabled && !prefersReducedMotion();

  const getStep = useCallback(() => {
    const track = ref.current;
    const first = track?.children[0];
    if (!first) return 0;
    const styles = track ? window.getComputedStyle(track) : null;
    const gap = styles ? parseFloat(styles.columnGap || styles.gap || '0') || 0 : 0;
    return first.getBoundingClientRect().width + gap;
  }, []);

  const scrollToIndex = useCallback((index) => {
    const track = ref.current;
    if (!track || itemCount <= 0) return;
    const step = getStep();
    if (!step) return;
    track.scrollTo({
      left: step * index,
      behavior: 'smooth',
    });
  }, [getStep, itemCount]);

  useEffect(() => {
    if (!autoEnabled || itemCount <= 1) return undefined;

    const tick = () => {
      if (pausedRef.current) return;
      indexRef.current = (indexRef.current + 1) % itemCount;
      scrollToIndex(indexRef.current);
    };

    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [autoEnabled, itemCount, intervalMs, scrollToIndex]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const onScroll = useCallback(() => {
    const track = ref.current;
    if (!track || itemCount <= 0) return;
    const step = getStep();
    if (!step) return;
    const next = Math.round(track.scrollLeft / step);
    indexRef.current = Math.min(Math.max(next, 0), itemCount - 1);
  }, [getStep, itemCount]);

  return { ref, pause, resume, onScroll };
}
