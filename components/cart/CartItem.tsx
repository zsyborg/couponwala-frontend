"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CartItem as CartItemType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.offer.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.offer.id, item.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(item.offer.id);
  };

  return (
    <div className="flex gap-4 p-4 border-b last:border-b-0">
      {/* Image */}
      <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
        {item.offer.imageUrl ? (
          <img
            src={item.offer.imageUrl}
            alt={item.offer.serviceName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-2xl">🎁</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.offer.serviceName}</h4>
        <p className="text-sm text-muted-foreground mt-1">{item.offer.store}</p>

        {/* Price */}
        <div className="mt-2">
          <span className="font-semibold">{formatCurrency(item.offer.discountedPrice)}</span>
          {item.quantity > 1 && (
            <span className="text-sm text-muted-foreground ml-2">
              × {item.quantity} = {formatCurrency(item.offer.discountedPrice * item.quantity)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end gap-2">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleDecrement}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive transition-colors p-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
