import { useEffect, useState } from 'react';
import { useLocationStore } from '@/store/locationStore';

/** Espera a que Zustand persist termine de rehidratar antes de consultas de catálogo. */
export function useLocationHydrated() {
  const [hydrated, setHydrated] = useState(
    () => useLocationStore.persist?.hasHydrated?.() ?? true,
  );

  useEffect(() => {
    if (useLocationStore.persist?.hasHydrated?.()) {
      setHydrated(true);
      return undefined;
    }
    const unsub = useLocationStore.persist?.onFinishHydration?.(() => setHydrated(true));
    const timer = setTimeout(() => setHydrated(true), 2_500);
    return () => {
      unsub?.();
      clearTimeout(timer);
    };
  }, []);

  return hydrated;
}
