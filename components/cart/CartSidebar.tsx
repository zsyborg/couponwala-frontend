"use client";

import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "./CartItem";
import { formatCurrency } from "@/lib/utils";

export function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    getTotalItems,
    getTotalPrice,
    getSavings,
    clearCart,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const savings = getSavings();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-xl animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {totalItems > 0 && (
              <span className="text-sm text-muted-foreground">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add some amazing offers to get started
              </p>
              <Link href="/offers" onClick={closeCart}>
                <Button>Browse Offers</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>You Save</span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>{formatCurrency(totalPrice * 0.18)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(totalPrice * 1.18)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link href="/checkout" onClick={closeCart} className="block">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/cart" onClick={closeCart} className="block">
                <Button variant="outline" className="w-full" size="lg">
                  View Cart
                </Button>
              </Link>
            </div>

            <button
              onClick={clearCart}
              className="w-full text-center text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
