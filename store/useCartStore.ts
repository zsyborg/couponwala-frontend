import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Offer } from "@/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (offer: Offer) => void;
  removeItem: (offerId: string) => void;
  updateQuantity: (offerId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSavings: () => number;
  getItem: (offerId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (offer: Offer) => {
        const items = get().items;
        const existingItem = items.find((item) => item.offer.id === offer.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.offer.id === offer.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${offer.id}-${Date.now()}`,
            offer,
            quantity: 1,
            addedAt: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (offerId: string) => {
        set({ items: get().items.filter((item) => item.offer.id !== offerId) });
      },

      updateQuantity: (offerId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(offerId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.offer.id === offerId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.offer.discountedPrice * item.quantity,
          0
        );
      },

      getSavings: () => {
        return get().items.reduce(
          (total, item) =>
            total +
            (item.offer.originalPrice - item.offer.discountedPrice) *
              item.quantity,
          0
        );
      },

      getItem: (offerId: string) => {
        return get().items.find((item) => item.offer.id === offerId);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
