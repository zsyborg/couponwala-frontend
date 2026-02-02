"use client";

import { Offer } from "@/types";
import { OfferCard, OfferCardSkeleton } from "./OfferCard";
import { Button } from "@/components/ui/Button";
import { Search, Package } from "lucide-react";

interface OfferGridProps {
  offers: Offer[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onAddToCart?: (offer: Offer) => void;
  searchQuery?: string;
}

export function OfferGrid({
  offers,
  isLoading,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onAddToCart,
  searchQuery = "",
}: OfferGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <OfferCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {searchQuery ? "No offers found" : "No offers available"}
        </h3>
        <p className="text-gray-500 max-w-md">
          {searchQuery
            ? `We couldn't find any offers matching "${searchQuery}". Try adjusting your search or filters.`
            : "Check back later for amazing deals and discounts on your favorite services."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{offers.length}</span> offers
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            isLoading={isLoadingMore}
          >
            Load More Offers
          </Button>
        </div>
      )}
    </div>
  );
}
