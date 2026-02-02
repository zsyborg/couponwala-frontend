"use client";

import { useContext } from "react";
import { CartContext, CartItem, Coupon } from "@/contexts/CartContext";

interface UseCartReturn {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  appliedCoupon: Coupon | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (offerId: string, quantity: number, offerDetails?: Partial<CartItem>) => Promise<void>;
  updateItem: (offerId: string, quantity: number) => Promise<void>;
  removeItem: (offerId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isInCart: (offerId: string) => boolean;
  getItemQuantity: (offerId: string) => number;
}

export function useCart(): UseCartReturn {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
