import adoptionService, { BasketItem } from "@/services/adoptionService";
import { create } from "zustand";

interface BasketState {
  items: BasketItem[];
  count: number;
  loading: boolean;
  refreshing: boolean;

  fetchBasket: () => Promise<void>;
  addToBasket: (listingId: string) => Promise<boolean>;
  removeFromBasket: (listingId: string) => Promise<boolean>;
  reset: () => void;
}

export const useBasketStore = create<BasketState>((set, get) => ({
  items: [],
  count: 0,
  loading: false,
  refreshing: false,

  fetchBasket: async () => {
    set({ loading: true });
    try {
      const response = await adoptionService.getBasket();
      if (response.success) {
        set({
          items: response.data.items,
          count: response.data.items.length,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Failed to fetch basket", error);
      set({ loading: false });
    }
  },

  addToBasket: async (listingId: string) => {
    try {
      const response = await adoptionService.addToBasket(listingId);
      if (response.success) {
        // Refresh basket to get updated state/source of truth
        await get().fetchBasket();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add to basket", error);
      return false;
    }
  },

  removeFromBasket: async (listingId: string) => {
    try {
      const response = await adoptionService.removeFromBasket(listingId);
      if (response.success) {
        // Optimistically update or re-fetch. Re-fetching is safer for sync.
        await get().fetchBasket();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to remove from basket", error);
      return false;
    }
  },

  reset: () => set({ items: [], count: 0 }),
}));
