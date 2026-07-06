import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const ONBOARDING_VERSION = 1;

export const useOnboardingStore = create(
  persist(
    (set) => ({
      completed: false,
      version: ONBOARDING_VERSION,
      complete: () => set({ completed: true }),
      reset: () => set({ completed: false }),
    }),
    {
      name: 'urabapp-client-onboarding',
      version: ONBOARDING_VERSION,
      migrate: (persisted) => {
        if (!persisted || persisted.version !== ONBOARDING_VERSION) {
          return { completed: false, version: ONBOARDING_VERSION };
        }
        return persisted;
      },
    }
  )
);
