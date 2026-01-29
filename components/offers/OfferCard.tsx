"use client";

import Link from "next/link";
import { ShoppingCart, Tag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Offer } from "@/types";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const { addItem } = useCartStore();
  const discount = calculateDiscount(offer.originalPrice, offer.discountedPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(offer);
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Image Section */}
      <div className="relative h-48 bg-muted overflow-hidden">
        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={offer.serviceName}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Tag className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        {/* Discount Badge */}
        <Badge className="absolute top-3 left-3" variant="destructive">
          {discount}% OFF
        </Badge>
        {/* Store Badge */}
        <Badge className="absolute top-3 right-3" variant="secondary">
          {offer.store}
        </Badge>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 mb-1">
          {offer.serviceName}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {offer.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">
            {formatCurrency(offer.discountedPrice)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatCurrency(offer.originalPrice)}
          </span>
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/offers/${offer.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Button onClick={handleAddToCart} className="flex-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
