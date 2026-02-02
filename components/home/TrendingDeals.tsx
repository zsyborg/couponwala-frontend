"use client";

import { useState } from "react";
import { Star, Clock, Heart, ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Deal {
  id: number;
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

const trendingDeals: Deal[] = [
  {
    id: 1,
    brand: "Amazon",
    title: "Up to 80% Off on Electronics Mega Sale",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=250&fit=crop",
    originalPrice: 50000,
    discountedPrice: 15000,
    discount: "70% OFF",
    rating: 4.8,
    reviews: 12543,
    status: "Hot",
    isFavorite: false,
  },
  {
    id: 2,
    brand: "Myntra",
    title: "Flat ₹500 Off on Orders Above ₹2000",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=250&fit=crop",
    originalPrice: 2000,
    discountedPrice: 1500,
    discount: "FLAT ₹500 OFF",
    rating: 4.6,
    reviews: 8234,
    status: "Trending",
    isFavorite: false,
  },
  {
    id: 3,
    brand: "Flipkart",
    title: "BOGO Offer on Footwear Collection",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=250&fit=crop",
    originalPrice: 3000,
    discountedPrice: 1500,
    discount: "BOGO 50%",
    rating: 4.5,
    reviews: 5621,
    status: "Limited Time",
    timeLeft: "2 days left",
    isFavorite: false,
  },
  {
    id: 4,
    brand: "Swiggy",
    title: "₹150 Off on First 3 Orders",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=250&fit=crop",
    originalPrice: 500,
    discountedPrice: 350,
    discount: "₹150 OFF",
    rating: 4.7,
    reviews: 23456,
    status: "Trending",
    isFavorite: false,
  },
  {
    id: 5,
    brand: "MakeMyTrip",
    title: "Up to ₹4000 Off on Flight Bookings",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop",
    originalPrice: 10000,
    discountedPrice: 6000,
    discount: "40% OFF",
    rating: 4.4,
    reviews: 9876,
    status: "Hot",
    isFavorite: false,
  },
  {
    id: 6,
    brand: "Nykaa",
    title: "Buy 2 Get 1 Free on Makeup Essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400&h=250&fit=crop",
    originalPrice: 2500,
    discountedPrice: 1667,
    discount: "BOGO 33%",
    rating: 4.6,
    reviews: 7654,
    status: "Limited Time",
    timeLeft: "5 hours left",
    isFavorite: false,
  },
  {
    id: 7,
    brand: "Zomato",
    title: "30% Off on Orders Above ₹400",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=250&fit=crop",
    originalPrice: 400,
    discountedPrice: 280,
    discount: "30% OFF",
    rating: 4.5,
    reviews: 34567,
    status: "Trending",
    isFavorite: false,
  },
  {
    id: 8,
    brand: "Croma",
    title: "Extra ₹1000 Off with HDFC Card",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=250&fit=crop",
    originalPrice: 25000,
    discountedPrice: 24000,
    discount: "₹1000 OFF",
    rating: 4.7,
    reviews: 4532,
    status: "Hot",
    isFavorite: false,
  },
];

const statusColors = {
  Trending: "bg-purple-500",
  Hot: "bg-red-500",
  "Limited Time": "bg-orange-500",
};

export function TrendingDeals() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const toggleFavorite = (id: number) => {
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

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingDeals.map((deal) => (
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
      </div>
    </section>
  );
}
