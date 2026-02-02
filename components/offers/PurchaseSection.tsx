'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency } from '@/lib/utils';
import { Offer } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Minus, Plus, ShoppingCart, Zap, Shield, Clock, Check } from 'lucide-react';

interface PurchaseSectionProps {
  offer: Offer;
  onAddToCart?: () => void;
}

export function PurchaseSection({ offer, onAddToCart }: PurchaseSectionProps) {
  const router = useRouter();
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const maxQuantity = 10; // Could be dynamic based on stock
  const savings = offer.originalPrice - offer.discountedPrice;
  const totalPrice = offer.discountedPrice * quantity;
  const totalSavings = savings * quantity;
  const isInStock = true; // Could be dynamic

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(maxQuantity, prev + delta)));
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Add to cart quantity times
    for (let i = 0; i < quantity; i++) {
      addItem(offer);
    }
    onAddToCart?.();
    
    // Show feedback and open cart
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 500);
  };

  const handleBuyNow = () => {
    // Add single item to cart and go to checkout
    addItem(offer);
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <Badge variant="success" className="bg-green-100 text-green-700">
            <Check className="w-3 h-3 mr-1" />
            In Stock
          </Badge>
        ) : (
          <Badge variant="error" className="bg-red-100 text-red-700">
            Out of Stock
          </Badge>
        )}
        <span className="text-sm text-gray-500">
          {Math.floor(Math.random() * 50) + 10} people bought this recently
        </span>
      </div>

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Quantity:</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= maxQuantity}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Total Price */}
      <Card className="bg-gray-50">
        <CardBody className="p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price per item:</span>
            <span className="font-medium">{formatCurrency(offer.discountedPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quantity:</span>
            <span className="font-medium">× {quantity}</span>
          </div>
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Total:</span>
              <span className="font-bold text-2xl text-orange-600">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            {totalSavings > 0 && (
              <p className="text-green-600 text-sm mt-1">
                You save {formatCurrency(totalSavings)} on this order!
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          isLoading={isAdding}
          disabled={!isInStock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-50"
          onClick={handleBuyNow}
          disabled={!isInStock}
        >
          <Zap className="w-5 h-5 mr-2" />
          Buy Now
        </Button>
      </div>

      {/* Benefits */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-500" />
          <span>100% Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Instant Delivery via Email</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Check className="w-4 h-4 text-orange-500" />
          <span>Valid for 12 Months</span>
        </div>
      </div>
    </div>
  );
}
