import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const LANGUAGES = [
  { id: 'es', label: 'Español' },
  { id: 'en', label: 'English' },
];

export const CURRENCIES = [
  { id: 'COP', label: 'Peso colombiano (COP)', symbol: '$' },
];

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      language: 'es',
      currency: 'COP',
      notifications: {
        orders: true,
        offers: true,
        marketing: false,
        push: true,
        email: true,
      },
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setNotificationPref: (key, value) =>
        set({ notifications: { ...get().notifications, [key]: value } }),
      resetNotifications: () =>
        set({
          notifications: {
            orders: true,
            offers: true,
            marketing: false,
            push: true,
            email: true,
          },
        }),
    }),
    { name: 'urabapp-settings', version: 1 }
  )
);

export function getCurrencySymbol(currencyId) {
  return CURRENCIES.find((c) => c.id === currencyId)?.symbol ?? '$';
}
