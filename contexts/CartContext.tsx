"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { cart } from "@/lib/api";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/Toast";

export interface CartItem {
  offerId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
  store: string;
  description?: string;
  originalPrice?: number;
}

export interface Coupon {
  code: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minimumOrder?: number;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discount: number;
  finalPrice: number;
  appliedCoupon: Coupon | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (offerId: string, quantity: number, offerDetails?: Partial<CartItem>) => Promise<void>;
  addToCart: (offerId: string, quantity?: number, offerDetails?: Partial<CartItem>) => Promise<void>;
  updateItem: (offerId: string, quantity: number) => Promise<void>;
  removeItem: (offerId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  isInCart: (offerId: string) => boolean;
  getItemQuantity: (offerId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "couponwala_cart";
const COUPON_STORAGE_KEY = "couponwala_coupon";

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, token } = useAuth();
  const { addToast } = useToast();

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? calculateDiscount(totalPrice, appliedCoupon) : 0;
  const finalPrice = Math.max(0, totalPrice - discount);

  function calculateDiscount(price: number, coupon: Coupon): number {
    if (coupon.minimumOrder && price < coupon.minimumOrder) {
      return 0;
    }
    if (coupon.discountType === 'percentage') {
      return (price * coupon.discount) / 100;
    }
    return coupon.discount;
  }

  // Load cart from localStorage on mount (guest cart)
  useEffect(() => {
    const loadLocalCart = () => {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
        
        if (storedCart) {
          try {
            setItems(JSON.parse(storedCart));
          } catch {
            localStorage.removeItem(CART_STORAGE_KEY);
          }
        }
        
        if (storedCoupon) {
          try {
            setAppliedCoupon(JSON.parse(storedCoupon));
          } catch {
            localStorage.removeItem(COUPON_STORAGE_KEY);
          }
        }
      }
    };

    loadLocalCart();
  }, []);

  // Sync with backend on login
  useEffect(() => {
    if (isAuthenticated && token) {
      syncCartWithBackend();
    }
  }, [isAuthenticated, token]);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !isAuthenticated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    }
  }, [items, appliedCoupon, isAuthenticated]);

  // Sync local cart with backend
  const syncCartWithBackend = async () => {
    setIsLoading(true);
    try {
      // First, try to get cart from backend
      const backendCart = await cart.get();
      
      if (items.length > 0) {
        // Merge local cart with backend cart
        for (const item of items) {
          await cart.add(item.offerId, item.quantity);
        }
        // Clear local cart after sync
        setItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      
      // Load backend cart
      if (backendCart.items && backendCart.items.length > 0) {
        // The backend returns basic items, we need to enrich them
        // For now, just use what we have
        setItems(backendCart.items as unknown as CartItem[]);
      }
    } catch {
      // If backend fails, keep local cart
      console.warn("Failed to sync cart with backend");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const response = await cart.get();
      if (response.items && response.items.length > 0) {
        // Items come with offerId and quantity from backend
        // We need to transform them if needed
        const enrichedItems: CartItem[] = response.items.map((item: { offerId: string; quantity: number; offer?: { title?: string; image?: string; store?: { name?: string }; price?: number; originalPrice?: number } }) => ({
          offerId: item.offerId,
          quantity: item.quantity,
          price: (item as any).price || (item.offer?.price as any) || 0,
          title: (item as any).title || (item.offer?.title as any) || "Unknown Offer",
          image: (item as any).image || (item.offer?.image as any) || "",
          store: (item as any).store || (item.offer?.store?.name as any) || "Unknown Store",
          originalPrice: (item as any).originalPrice || (item.offer?.originalPrice as any),
        }));
        setItems(enrichedItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const addItem = useCallback(async (offerId: string, quantity: number, offerDetails?: Partial<CartItem>) => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        await cart.add(offerId, quantity);
        await fetchCart();
        addToast("success", "Item added to cart");
      } else {
        // Guest user - local cart
        setItems((prevItems) => {
          const existingIndex = prevItems.findIndex((item) => item.offerId === offerId);
          
          if (existingIndex >= 0) {
            // Update existing item
            const updatedItems = [...prevItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            addToast("success", "Item quantity updated");
            return updatedItems;
          }
          
          // Add new item
          const newItem: CartItem = {
            offerId,
            quantity,
            price: offerDetails?.price || 0,
            title: offerDetails?.title || "Unknown Offer",
            image: offerDetails?.image || "",
            store: offerDetails?.store || "Unknown Store",
            originalPrice: offerDetails?.originalPrice,
          };
          addToast("success", "Item added to cart");
          return [...prevItems, newItem];
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add item";
      addToast("error", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCart, addToast]);

  const updateItem = useCallback(async (offerId: string, quantity: number) => {
    if (quantity < 1) {
      await removeItem(offerId);
      return;
    }

    setIsLoading(true);
    try {
      if (isAuthenticated) {
        await cart.update(offerId, quantity);
        await fetchCart();
        addToast("success", "Cart updated");
      } else {
        setItems((prevItems) =>
          prevItems.map((item) =>
            item.offerId === offerId ? { ...item, quantity } : item
          )
        );
        addToast("success", "Cart updated");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update item";
      addToast("error", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCart, addToast]);

  const removeItem = useCallback(async (offerId: string) => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        await cart.remove(offerId);
        await fetchCart();
        addToast("success", "Item removed from cart");
      } else {
        setItems((prevItems) => prevItems.filter((item) => item.offerId !== offerId));
        addToast("success", "Item removed from cart");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to remove item";
      addToast("error", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchCart, addToast]);

  const clearCart = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        await cart.clear();
      }
      setItems([]);
      setAppliedCoupon(null);
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
      addToast("success", "Cart cleared");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to clear cart";
      addToast("error", message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, addToast]);

  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validate coupon - in a real app, this would call an API
      // For now, we'll simulate some common coupons
      const coupons: Record<string, Coupon> = {
        'WELCOME10': { code: 'WELCOME10', discount: 10, discountType: 'percentage', minimumOrder: 100 },
        'SAVE20': { code: 'SAVE20', discount: 20, discountType: 'percentage', minimumOrder: 200 },
        'FLAT50': { code: 'FLAT50', discount: 50, discountType: 'fixed', minimumOrder: 150 },
        'FIRST100': { code: 'FIRST100', discount: 100, discountType: 'fixed', minimumOrder: 300 },
      };

      const coupon = coupons[code.toUpperCase()];
      
      if (!coupon) {
        addToast("error", "Invalid coupon code");
        return false;
      }

      if (totalPrice < (coupon.minimumOrder || 0)) {
        addToast("error", `Minimum order of ₹${coupon.minimumOrder} required`);
        return false;
      }

      setAppliedCoupon(coupon);
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
      addToast("success", `Coupon ${coupon.code} applied!`);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to apply coupon";
      addToast("error", message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [totalPrice, addToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    localStorage.removeItem(COUPON_STORAGE_KEY);
    addToast("success", "Coupon removed");
  }, [addToast]);

  const isInCart = useCallback((offerId: string) => {
    return items.some((item) => item.offerId === offerId);
  }, [items]);

  const getItemQuantity = useCallback((offerId: string) => {
    const item = items.find((item) => item.offerId === offerId);
    return item ? item.quantity : 0;
  }, [items]);

  // Clear cart on logout
  useEffect(() => {
    if (!isAuthenticated && token === null && items.length > 0) {
      // User logged out, keep local cart for guest
    }
  }, [isAuthenticated, token, items.length]);

  // Alias for addItem
  const addToCart = useCallback(async (offerId: string, quantity = 1, offerDetails?: Partial<CartItem>) => {
    return addItem(offerId, quantity, offerDetails);
  }, [addItem]);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    discount,
    finalPrice,
    appliedCoupon,
    isLoading,
    fetchCart,
    addItem,
    addToCart,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
