"use client";

import { Offer } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShoppingCart, Star, Clock } from "lucide-react";

interface OfferCardProps {
  offer: Offer;
  onAddToCart?: (offer: Offer) => void;
  isLoading?: boolean;
}

export function OfferCard({ offer, onAddToCart, isLoading }: OfferCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateSavings = () => {
    return offer.originalPrice - offer.discountedPrice;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={offer.serviceName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
            <span className="text-4xl font-bold text-orange-500">
              {offer.store.charAt(0)}
            </span>
          </div>
        )}

        {/* Discount Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="bg-orange-500 text-white">
            {offer.discountPercentage}% OFF
          </Badge>
        </div>

        {/* Store Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
            {offer.store}
          </Badge>
        </div>

        {/* Expiring Soon Badge */}
        {offer.expiresAt && new Date(offer.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="error" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Ending Soon
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Category */}
        <div className="mb-2">
          <Badge variant="info" className="text-xs">
            {offer.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {offer.serviceName}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
          {offer.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-orange-600">
            {formatPrice(offer.discountedPrice)}
          </span>
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(offer.originalPrice)}
          </span>
          <span className="text-sm text-green-600 font-medium">
            Save {formatPrice(calculateSavings())}
          </span>
        </div>

        {/* Coupon Code */}
        {offer.couponCode && (
          <div className="mb-4 p-2 bg-orange-50 rounded-lg border border-orange-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono text-orange-700">
                {offer.couponCode}
              </span>
              <button
                className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                onClick={() => navigator.clipboard.writeText(offer.couponCode)}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={() => onAddToCart?.(offer)}
          isLoading={isLoading}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

// Skeleton loader for OfferCard
export function OfferCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-3" />
        <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
}
