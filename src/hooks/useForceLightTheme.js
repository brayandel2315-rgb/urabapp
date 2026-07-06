import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

/** Fuerza tema claro brandboard (evita texto claro sobre fondos claros en dark mode). */
export function useForceLightTheme() {
  const storedTheme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains('dark');
    root.classList.remove('dark');
    return () => {
      if (wasDark || storedTheme === 'dark') root.classList.add('dark');
    };
  }, [storedTheme]);
}
