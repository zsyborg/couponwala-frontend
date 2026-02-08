"use client";

import { useState, useEffect } from "react";
import { Star, Clock, Heart, ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getAllOffersFromDB, type Offer } from "@/lib/offersApi";

interface Deal {
  id: string;
  brand: string;
  title: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  status: "Trending" | "Hot" | "Limited Time";
  timeLeft?: string;
  isFavorite: boolean;
}

const statusColors = {
  Trending: "bg-purple-500",
  Hot: "bg-red-500",
  "Limited Time": "bg-orange-500",
};

// Helper to determine offer status based on time left
function getOfferStatus(validityEndDate: string): "Trending" | "Hot" | "Limited Time" {
  const endDate = new Date(validityEndDate);
  const now = new Date();
  const hoursLeft = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursLeft < 24) {
    return "Limited Time";
  } else if (hoursLeft < 72) {
    return "Hot";
  }
  return "Trending";
}

// Helper to calculate time left
function getTimeLeft(validityEndDate: string): string | undefined {
  const endDate = new Date(validityEndDate);
  const now = new Date();
  const hoursLeft = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursLeft < 0) return undefined;
  if (hoursLeft < 1) {
    return `${Math.round(hoursLeft * 60)} min left`;
  } else if (hoursLeft < 24) {
    return `${Math.round(hoursLeft)} hours left`;
  } else if (hoursLeft < 48) {
    return "1 day left";
  } else {
    return `${Math.round(hoursLeft / 24)} days left`;
  }
}

// Convert API offer to Deal format
function convertToDeal(offer: Offer): Deal {
  const now = new Date();
  const startDate = new Date(offer.validityStartDate);
  const endDate = new Date(offer.validityEndDate);
  
  // Determine if offer is active and valid
  const isActive = offer.isActive && now >= startDate && now <= endDate;
  const status = isActive ? getOfferStatus(offer.validityEndDate) : "Trending";
  const timeLeft = isActive ? getTimeLeft(offer.validityEndDate) : undefined;
  
  // Generate a status-specific discount string
  const discountString = `${offer.discountPercentage}% OFF`;
  
  return {
    id: offer._id,
    brand: offer.store,
    title: offer.serviceName,
    image: offer.imageUrl || `https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=250&fit=crop`,
    originalPrice: offer.originalPrice,
    discountedPrice: offer.discountedPrice,
    discount: discountString,
    rating: offer.averageRating || 4.5,
    reviews: offer.totalRatings || Math.floor(Math.random() * 10000) + 1000,
    status,
    timeLeft,
    isFavorite: false,
  };
}

export function TrendingDeals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDeals() {
      try {
        setLoading(true);
        const offers = await getAllOffersFromDB(12);
        const convertedDeals = offers.map(convertToDeal);
        setDeals(convertedDeals);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchDeals();
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
              🔥 Trending Now
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hot Deals You Can't Miss
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Grab the best offers before they're gone! Updated daily with the
              freshest deals.
            </p>
          </div>
          
          {/* Loading skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-8 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
              🔥 Trending Now
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hot Deals You Can't Miss
            </h2>
          </div>
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-orange-100 text-orange-600 hover:bg-orange-100">
            🔥 Trending Now
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Hot Deals You Can't Miss
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Grab the best offers before they're gone! Updated daily with the
            freshest deals.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {["Best Selling", "Newest", "Ending Soon", "Highest Discount"].map(
            (filter, index) => (
              <button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  index === 0
                    ? "bg-yellow-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        {/* Empty state */}
        {deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No deals available at the moment.</p>
            <p className="text-gray-400">Check back soon for amazing offers!</p>
          </div>
        ) : (
          <>
            {/* Deals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback image if the offer image fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = `https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=250&fit=crop`;
                      }}
                    />
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`${statusColors[deal.status]} text-white text-xs font-bold px-3 py-1 rounded-full`}
                      >
                        {deal.status}
                      </span>
                    </div>
                    {/* Discount Badge */}
                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                      {deal.discount}
                    </div>
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(deal.id)}
                      className="absolute bottom-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          favorites.has(deal.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                    {/* Timer if Limited Time */}
                    {deal.timeLeft && (
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deal.timeLeft}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded">
                        {deal.brand}
                      </span>
                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs text-gray-600 font-medium">
                          {deal.rating}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({deal.reviews.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {deal.title}
                    </h3>

                    {/* Prices */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(deal.discountedPrice)}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(deal.originalPrice)}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Save {formatPrice(deal.originalPrice - deal.discountedPrice)}
                      </span>
                    </div>

                    {/* Action Button */}
                    <Button className="w-full h-10 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 group-hover:shadow-lg">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Get Deal
                      <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-12">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold rounded-xl transition-all duration-200"
              >
                View All Deals
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
