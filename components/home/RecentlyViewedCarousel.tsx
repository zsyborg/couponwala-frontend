"use client";

import Link from "next/link";
import { Trash2, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useRecentlyViewed } from "@/contexts/RecentlyViewedContext";
import { Offer } from "@/types";

interface RecentlyViewedCarouselProps {
  title?: string;
  maxItems?: number;
}

export function RecentlyViewedCarousel({
  title = "Recently Viewed",
  maxItems = 10,
}: RecentlyViewedCarouselProps) {
  const { recentlyViewed, removeFromRecentlyViewed, clearRecentlyViewed } =
    useRecentlyViewed();

  const displayItems = recentlyViewed.slice(0, maxItems);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {title}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {displayItems.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRecentlyViewed}
              className="text-gray-500 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
            <Link href="/offers">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex items-center gap-2"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayItems.map((offer) => (
            <RecentlyViewedCard
              key={offer.id}
              offer={offer}
              onRemove={() => removeFromRecentlyViewed(offer.id)}
            />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/offers">
            <Button variant="outline" className="w-full">
              View All Offers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

interface RecentlyViewedCardProps {
  offer: Offer;
  onRemove: () => void;
}

function RecentlyViewedCard({ offer, onRemove }: RecentlyViewedCardProps) {
  const savings = offer.originalPrice - offer.discountedPrice;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative">
        <img
          src={offer.imageUrl || "/placeholder-offer.jpg"}
          alt={offer.serviceName}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge className="bg-orange-500 text-white">
            {offer.discountPercentage}% OFF
          </Badge>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove();
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove from recently viewed"
        >
          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
        </button>
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-white/90 text-gray-700 text-xs">
            {offer.store}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {offer.serviceName}
        </h3>
        <p className="text-sm text-gray-500 truncate mb-3">
          {offer.category}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              ₹{offer.discountedPrice}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₹{offer.originalPrice}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-green-600 font-medium">
            Save ₹{savings}
          </span>
          <Link href={`/offers/${offer.id}`}>
            <Button size="sm" variant="outline" className="text-xs h-8">
              View Deal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
