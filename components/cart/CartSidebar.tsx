"use client";

import { useState, useEffect } from "react";
import { X, ShoppingBag, Tag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const savings = getSavings();
  const gst = totalPrice * 0.18;
  const subtotal = totalPrice;
  const discount = appliedCoupon ? totalPrice * 0.1 : 0;
  const finalTotal = subtotal + gst - discount;

  // Predefined coupons for demo
  const availableCoupons = [
    { code: "WELCOME10", discount: 10, description: "10% off" },
    { code: "SAVE20", discount: 20, description: "20% off" },
    { code: "FLAT50", discount: 50, description: "₹50 off" },
  ];

  // Handle sidebar visibility with animation
  useEffect(() => {
    if (isOpen) {
      setShowSidebar(true);
    } else {
      const timer = setTimeout(() => setShowSidebar(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const coupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === couponCode.toUpperCase()
    );

    if (coupon) {
      setAppliedCoupon(coupon.code);
      setCouponCode("");
    } else {
      alert("Invalid coupon code");
    }

    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleCouponSelect = async (code: string) => {
    setCouponCode(code);
    setIsApplyingCoupon(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setAppliedCoupon(code);
    setIsApplyingCoupon(false);
  };

  if (!showSidebar && !isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-background shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 bg-orange-500 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {totalItems > 0 && (
              <span className="text-sm text-orange-100">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="rounded-lg p-2 hover:bg-orange-600 transition-colors"
            aria-label="Close cart"
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
                <Button className="bg-orange-500 hover:bg-orange-600">
                  Browse Offers
                </Button>
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
          <div className="border-t bg-gray-50 p-6 space-y-4">
            {/* Coupon Input */}
            {!appliedCoupon ? (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Apply Coupon
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    {isApplyingCoupon ? "..." : "Apply"}
                  </Button>
                </div>
                {/* Available coupons */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableCoupons.map((coupon) => (
                    <button
                      key={coupon.code}
                      onClick={() => handleCouponSelect(coupon.code)}
                      className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
                    >
                      {coupon.code} - {coupon.description}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {appliedCoupon} applied
                  </span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>You Save</span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link href="/cart" onClick={closeCart} className="block">
                <Button
                  variant="outline"
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
                  size="lg"
                >
                  View Full Cart
                </Button>
              </Link>
              <Link href="/checkout" onClick={closeCart} className="block">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors py-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
