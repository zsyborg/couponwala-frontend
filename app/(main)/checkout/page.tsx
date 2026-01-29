"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Shield, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, getTotalPrice, getSavings, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const subtotal = getTotalPrice();
  const savings = getSavings();
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsComplete(true);
    clearCart();
  };

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Thank you for your purchase. Your order has been confirmed and you will
          receive an email with your coupon codes shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/offers">
            <Button size="lg">Continue Shopping</Button>
          </Link>
          <Link href="/profile">
            <Button variant="outline" size="lg">
              View Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Add some offers to your cart before checkout
        </p>
        <Link href="/offers">
          <Button>Browse Offers</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/cart"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cart
      </Link>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input label="Full Name" placeholder="Enter your full name" required />
                </div>
                <div className="md:col-span-2">
                  <Input label="Email" type="email" placeholder="Enter your email" required />
                </div>
                <div>
                  <Input label="Phone" type="tel" placeholder="Enter your phone" required />
                </div>
                <div>
                  <Input label="Alternate Phone (Optional)" type="tel" placeholder="Alternate number" />
                </div>
                <div className="md:col-span-2">
                  <Input label="Address" placeholder="Enter your address" required />
                </div>
                <div>
                  <Input label="City" placeholder="City" required />
                </div>
                <div>
                  <Input label="State" placeholder="State" required />
                </div>
                <div>
                  <Input label="Pincode" placeholder="Pincode" required />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    This is a demo checkout. No actual payment will be processed.
                    In production, Stripe payment integration would appear here.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Your payment is secured with SSL encryption</span>
                </div>
                <Input label="Card Number" placeholder="1234 5678 9012 3456" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Expiry Date" placeholder="MM/YY" />
                  <Input label="CVV" placeholder="123" type="password" />
                </div>
                <Input label="Cardholder Name" placeholder="Name on card" />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate flex-1">
                        {item.offer.serviceName} × {item.quantity}
                      </span>
                      <span className="font-medium ml-4">
                        {formatCurrency(item.offer.discountedPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
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
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  isLoading={isProcessing}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Pay {formatCurrency(total)}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
