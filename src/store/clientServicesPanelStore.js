import { create } from 'zustand';

export const useClientServicesPanelStore = create((set) => ({
  open: false,
  toggle: () => set((state) => ({ open: !state.open })),
  close: () => set({ open: false }),
  openPanel: () => set({ open: true }),
}));
