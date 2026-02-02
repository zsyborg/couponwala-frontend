"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, Tag, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

// GST rate (18%)
const GST_RATE = 0.18;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    discount,
    finalPrice,
    appliedCoupon,
    isLoading,
    updateItem,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Calculate totals
  const gstAmount = finalPrice * GST_RATE;
  const totalWithGST = finalPrice + gstAmount;

  const handleQuantityChange = async (offerId: string, newQuantity: number) => {
    if (newQuantity < MIN_QUANTITY || newQuantity > MAX_QUANTITY) return;
    await updateItem(offerId, newQuantity);
  };

  const handleIncrement = async (offerId: string, currentQuantity: number) => {
    if (currentQuantity < MAX_QUANTITY) {
      await handleQuantityChange(offerId, currentQuantity + 1);
    }
  };

  const handleDecrement = async (offerId: string, currentQuantity: number) => {
    if (currentQuantity > MIN_QUANTITY) {
      await handleQuantityChange(offerId, currentQuantity - 1);
    }
  };

  const openRemoveModal = (offerId: string) => {
    setItemToRemove(offerId);
    setRemoveModalOpen(true);
  };

  const handleRemoveConfirm = async () => {
    if (itemToRemove) {
      await removeItem(itemToRemove);
      setRemoveModalOpen(false);
      setItemToRemove(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponError("");
    setIsApplyingCoupon(true);
    const success = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);

    if (success) {
      setCouponCode("");
    }
  };

  const handleClearCart = async () => {
    if (items.length > 0) {
      await clearCart();
    }
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Cart" }]}
          className="mb-8"
        />

        <div className="text-center py-16">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Your cart is empty</h2>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[{ label: "Cart" }]}
        className="mb-8"
      />

      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-orange-500" />
                Cart Items
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearCart}
                disabled={isLoading}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear Cart
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItemRow
                    key={item.offerId}
                    item={item}
                    onIncrement={() => handleIncrement(item.offerId, item.quantity)}
                    onDecrement={() => handleDecrement(item.offerId, item.quantity)}
                    onRemove={() => openRemoveModal(item.offerId)}
                    disabled={isLoading}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Continue Shopping */}
          <Link href="/offers">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-orange-500" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Applied Coupon */}
              {appliedCoupon && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Tag className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.discountType === 'percentage' 
                          ? `${appliedCoupon.discount}% off` 
                          : `₹${appliedCoupon.discount} off`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-700 hover:text-green-900 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Coupon Input */}
              {!appliedCoupon && (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError("");
                    }}
                    error={couponError}
                    disabled={isApplyingCoupon}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleApplyCoupon}
                    isLoading={isApplyingCoupon}
                    disabled={!couponCode.trim()}
                  >
                    Apply Coupon
                  </Button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(totalPrice)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Discount
                    </span>
                    <span className="font-medium">-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="font-medium">{formatCurrency(gstAmount)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-orange-600">{formatCurrency(totalWithGST)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>

              {/* Proceed to Checkout */}
              <Link href="/checkout" className="block">
                <Button className="w-full" size="lg" disabled={isLoading}>
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              {/* Secure Checkout Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>Secure checkout powered by Razorpay</span>
              </div>

              {/* Accepted Payment Methods */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground">We accept:</span>
                <div className="flex gap-2">
                  <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                    UPI
                  </div>
                  <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                    Cards
                  </div>
                  <div className="h-8 px-2 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                    COD
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      <Modal
        isOpen={removeModalOpen}
        onClose={() => setRemoveModalOpen(false)}
        title="Remove Item"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Are you sure you want to remove this item from your cart?
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setRemoveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRemoveConfirm}
              isLoading={isLoading}
            >
              Remove
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Cart Item Row Component
interface CartItemRowProps {
  item: {
    offerId: string;
    quantity: number;
    price: number;
    title: string;
    image: string;
    store: string;
    originalPrice?: number;
  };
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  disabled: boolean;
}

function CartItemRow({ item, onIncrement, onDecrement, onRemove, disabled }: CartItemRowProps) {
  const itemTotal = item.price * item.quantity;
  const savings = item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0;

  return (
    <div className="flex gap-4 p-4 sm:p-6">
      {/* Product Image */}
      <div className="h-24 w-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-orange-50">
            <ShoppingBag className="h-8 w-8 text-orange-300" />
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{item.store}</p>
          </div>
          <button
            onClick={onRemove}
            disabled={disabled}
            className="text-muted-foreground hover:text-red-500 transition-colors p-1 ml-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Price */}
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{formatCurrency(item.price)}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
          </div>
          {item.quantity > 1 && (
            <p className="text-sm text-muted-foreground">
              {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(itemTotal)}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onDecrement}
              disabled={disabled || item.quantity <= MIN_QUANTITY}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center font-medium">{item.quantity}</span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onIncrement}
              disabled={disabled || item.quantity >= MAX_QUANTITY}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {savings > 0 && (
            <span className="text-sm text-green-600 font-medium">
              Save {formatCurrency(savings)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
