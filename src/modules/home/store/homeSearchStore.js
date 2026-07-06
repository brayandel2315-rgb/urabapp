import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_HISTORY = 8;

export const useHomeSearchStore = create(
  persist(
    (set, get) => ({
      history: [],
      addHistory: (query) => {
        const q = query?.trim();
        if (!q || q.length < 2) return;
        const next = [q, ...get().history.filter((h) => h !== q)].slice(0, MAX_HISTORY);
        set({ history: next });
      },
      clearHistory: () => set({ history: [] }),
    }),
    { name: 'urabapp-home-search', version: 1 }
  )
);
