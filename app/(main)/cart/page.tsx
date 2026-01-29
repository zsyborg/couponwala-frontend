"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const {
    items,
    getTotalItems,
    getTotalPrice,
    getSavings,
    clearCart,
  } = useCartStore();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const savings = getSavings();
  const gst = totalPrice * 0.18;
  const finalTotal = totalPrice + gst;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added any offers to your cart yet.
            Browse our amazing deals and start saving today!
          </p>
          <Link href="/offers">
            <Button size="lg">
              Browse Offers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Link href="/offers">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <span>{formatCurrency(gst)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(finalTotal)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-center text-xs text-muted-foreground">
                  <p>Secure checkout powered by Stripe</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );
}
