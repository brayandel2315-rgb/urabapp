import { useEffect, useRef, useState } from 'react';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Suaviza saltos del marcador entre actualizaciones GPS (UX tipo Uber/Rappi). */
export function useInterpolatedLocation(location, { durationMs = 900 } = {}) {
  const [display, setDisplay] = useState(location);
  const frameRef = useRef(null);
  const fromRef = useRef(null);
  const startRef = useRef(0);

  useEffect(() => {
    if (!location?.latitude || !location?.longitude) {
      setDisplay(location);
      return undefined;
    }

    if (!display?.latitude) {
      setDisplay(location);
      return undefined;
    }

    const same =
      display.latitude === location.latitude
      && display.longitude === location.longitude;
    if (same) return undefined;

    fromRef.current = { ...display };
    startRef.current = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      setDisplay({
        ...location,
        latitude: lerp(fromRef.current.latitude, location.latitude, eased),
        longitude: lerp(fromRef.current.longitude, location.longitude, eased),
      });
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [location?.latitude, location?.longitude, location?.updatedAt, durationMs]);

  return display || location;
}
