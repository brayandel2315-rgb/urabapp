import { create } from 'zustand';

const STORAGE_KEY = 'urabapp-theme';
const THEME_COLOR_LIGHT = '#FAF9F6';
const THEME_COLOR_DARK = '#111111';

function readTheme() {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function syncBrowserChrome(theme) {
  if (typeof document === 'undefined') return;
  const isDark = theme === 'dark';
  const color = isDark ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    if (!meta.media) meta.setAttribute('content', color);
  });
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
  syncBrowserChrome(theme);
}

export const useThemeStore = create((set, get) => ({
  theme: readTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));

if (typeof window !== 'undefined') {
  applyTheme(readTheme());
}
