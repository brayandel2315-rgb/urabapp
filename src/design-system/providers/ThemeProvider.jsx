import { useEffect } from 'react';
import { applyTheme, useThemeStore } from '@/store/themeStore';

export default function ThemeProvider({ children }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return children;
}
