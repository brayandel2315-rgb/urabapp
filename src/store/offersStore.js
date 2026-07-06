import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useOffersStore = create(
  persist(
    (set, get) => ({
      savedOfferIds: [],
      remindOfferIds: [],

      toggleSave: (offerId) => {
        const ids = get().savedOfferIds;
        set({
          savedOfferIds: ids.includes(offerId)
            ? ids.filter((id) => id !== offerId)
            : [...ids, offerId],
        });
      },

      isSaved: (offerId) => get().savedOfferIds.includes(offerId),

      toggleRemind: (offerId) => {
        const ids = get().remindOfferIds;
        set({
          remindOfferIds: ids.includes(offerId)
            ? ids.filter((id) => id !== offerId)
            : [...ids, offerId],
        });
      },

      isReminded: (offerId) => get().remindOfferIds.includes(offerId),
    }),
    { name: 'urabapp-offers' }
  )
);
