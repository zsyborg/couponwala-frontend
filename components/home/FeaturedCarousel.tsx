"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Tag, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FeaturedDeal {
  id: number;
  brand: string;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
  discount: string;
  code?: string;
  timeLeft: string;
  description: string;
}

const featuredDeals: FeaturedDeal[] = [
  {
    id: 1,
    brand: "Amazon Prime Day",
    title: "Mega Sale Live Now!",
    subtitle: "Up to 80% Off on Everything",
    image:
      "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=800&h=500&fit=crop",
    backgroundColor: "from-blue-900 via-indigo-900 to-purple-900",
    discount: "80% OFF",
    code: "PRIME80",
    timeLeft: "2 days left",
    description:
      "Shop the biggest sale of the year! Get unbeatable prices on electronics, fashion, home & more.",
  },
  {
    id: 2,
    brand: "Myntra End of Season Sale",
    title: "Fashion at Flat 60% Off",
    subtitle: "Premium Brands at Unbeatable Prices",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
    backgroundColor: "from-pink-900 via-rose-900 to-red-900",
    discount: "60% OFF",
    timeLeft: "3 days left",
    description:
      "Upgrade your wardrobe with the hottest trends at prices you'll love. Limited time offer!",
  },
  {
    id: 3,
    brand: "Swiggy Food Festival",
    title: "Flat ₹300 Off",
    subtitle: "On Orders Above ₹599",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=500&fit=crop",
    backgroundColor: "from-orange-900 via-amber-900 to-yellow-900",
    discount: "FLAT ₹300 OFF",
    code: "SWIGGY300",
    timeLeft: "5 hours left",
    description:
      "Craving something delicious? Get amazing discounts on your favorite foods from top restaurants.",
  },
  {
    id: 4,
    brand: "MakeMyTrip Summer Sale",
    title: "Fly for Less!",
    subtitle: "Up to ₹4000 Off on Flights",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=500&fit=crop",
    backgroundColor: "from-cyan-900 via-teal-900 to-emerald-900",
    discount: "₹4000 OFF",
    timeLeft: "1 week left",
    description:
      "Plan your next adventure with massive savings on domestic and international flights.",
  },
];

export function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDeals.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? featuredDeals.length - 1 : prev - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredDeals.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const currentDeal = featuredDeals[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-red-100 text-red-600 hover:bg-red-100">
            ⏰ Limited Time
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Featured Offers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these exclusive, time-limited deals. Grab them
            before they're gone!
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative overflow-hidden rounded-3xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Slides Container */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {featuredDeals.map((deal) => (
              <div
                key={deal.id}
                className={`w-full flex-shrink-0 bg-gradient-to-br ${deal.backgroundColor} relative overflow-hidden`}
              >
                <div className="absolute inset-0">
                  <img
                    src={deal.image}
                    alt={deal.title}
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:px-12 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
                  {/* Left Content */}
                  <div className="flex-1 text-white">
                    {/* Brand Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium">{deal.brand}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                      {deal.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl text-white/80 mb-6">
                      {deal.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-white/70 mb-8 max-w-lg">
                      {deal.description}
                    </p>

                    {/* Discount Badge */}
                    <div className="inline-flex items-center gap-4 mb-8">
                      <span className="text-5xl font-bold text-orange-400">
                        {deal.discount}
                      </span>
                      {deal.code && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                          <span className="text-xs text-white/60 block">
                            Use Code
                          </span>
                          <span className="text-lg font-bold text-yellow-400">
                            {deal.code}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timer */}
                    <div className="flex items-center gap-2 mb-8 text-orange-300">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">{deal.timeLeft}</span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        size="lg"
                        className="h-14 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Grab Now
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Right Visual */}
                  <div className="hidden lg:block flex-1">
                    <div className="relative">
                      <div className="w-full h-[400px] bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                        <img
                          src={deal.image}
                          alt={deal.title}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      </div>
                      {/* Floating Badge */}
                      <div className="absolute -bottom-6 -left-6 bg-orange-500 text-white text-2xl font-bold px-6 py-4 rounded-2xl shadow-2xl transform -rotate-3">
                        {deal.discount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
            {featuredDeals.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper component for Badge since we're using it
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${className}`}
    >
      {children}
    </span>
  );
}
