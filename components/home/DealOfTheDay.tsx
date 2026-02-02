"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Offer } from "@/types";
import { useCartStore } from "@/store/useCartStore";

// Demo Deal of the Day offer
const dealOfTheDay: Offer = {
  id: "deal-of-day",
  serviceName: "Netflix 1 Month Premium Subscription - Deal of the Day",
  description: "Get 1 month of Netflix premium subscription at 50% off. Valid for new users only. Enjoy unlimited access to thousands of TV shows, movies, and Netflix originals on all your devices.",
  originalPrice: 799,
  discountedPrice: 399,
  discountPercentage: 50,
  category: "Streaming",
  store: "Netflix",
  couponCode: "DEAL50",
  imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&h=500&fit=crop",
  rating: 4.5,
  reviewCount: 234,
  isActive: true,
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
};

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3">
      {[
        { value: timeLeft.hours, label: "HRS" },
        { value: timeLeft.minutes, label: "MIN" },
        { value: timeLeft.seconds, label: "SEC" },
      ].map((item, index) => (
        <div key={item.label} className="text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
            <span className="text-2xl font-bold text-white">
              {String(item.value).padStart(2, "0")}
            </span>
          </div>
          <span className="text-xs text-white/80 mt-1 block">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DealOfTheDay() {
  const { addItem, openCart } = useCartStore();
  const [timeLeft, setTimeLeft] = useState<Date | null>(null);

  useEffect(() => {
    // Set target time to end of today (midnight)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setTimeLeft(tomorrow);
  }, []);

  const handleAddToCart = () => {
    addItem(dealOfTheDay);
    openCart();
  };

  return (
    <section className="py-12 bg-gradient-to-r from-orange-500 to-pink-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2 bg-white/20 text-white border-white/30">
              ⏰ Limited Time Offer
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Deal of the Day
            </h2>
          </div>
          <Link
            href="/offers"
            className="hidden sm:flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            View All Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Deal Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative h-64 lg:h-auto">
              <img
                src={dealOfTheDay.imageUrl || "/placeholder-offer.jpg"}
                alt={dealOfTheDay.serviceName}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white text-lg px-3 py-1">
                  {dealOfTheDay.discountPercentage}% OFF
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-gray-900">
                    {dealOfTheDay.rating}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({dealOfTheDay.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 lg:p-8 flex flex-col justify-between">
              <div>
                {/* Store & Category */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <span>{dealOfTheDay.store}</span>
                  <span>•</span>
                  <span>{dealOfTheDay.category}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {dealOfTheDay.serviceName.replace(" - Deal of the Day", "")}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {dealOfTheDay.description}
                </p>

                {/* Coupon Code */}
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Use Coupon Code</p>
                  <div className="flex items-center gap-3">
                    <code className="text-xl font-bold text-orange-600 bg-white px-4 py-2 rounded-lg border-2 border-orange-200">
                      {dealOfTheDay.couponCode}
                    </code>
                    <span className="text-sm text-gray-500">
                      or get {dealOfTheDay.discountPercentage}% off directly
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Countdown Timer */}
                {timeLeft && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Offer ends in:</span>
                    <CountdownTimer targetDate={timeLeft} />
                  </div>
                )}

                {/* Price & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{dealOfTheDay.discountedPrice}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      ₹{dealOfTheDay.originalPrice}
                    </span>
                    <Badge variant="success" className="ml-2">
                      Save ₹{dealOfTheDay.originalPrice - dealOfTheDay.discountedPrice}
                    </Badge>
                  </div>
                  <div className="flex-1" />
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/offers"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            View All Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
