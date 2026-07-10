import { create } from 'zustand';

export const useAppExperienceRatingStore = create((set) => ({
  queue: null,
  requestRating: (item) => set({ queue: { ...item, requestedAt: Date.now() } }),
  clearQueue: () => set({ queue: null }),
}));
