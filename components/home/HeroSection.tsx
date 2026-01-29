"use client";

import { useState, useEffect } from "react";
import { Search, Tag, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";

const dynamicTexts = [
  "Unlock Exclusive Savings!",
  "Discover Amazing Offers!",
  "Shop Smart, Save Big!",
  "Your Deal Destination!",
];

export function HeroSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = dynamicTexts[textIndex];
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentText.substring(0, displayText.length + 1));
        if (displayText.length === currentText.length) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        setDisplayText(currentText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, textIndex]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-32 right-1/4 animate-bounce duration-3000">
        <div className="w-16 h-16 bg-orange-500/30 rounded-2xl rotate-12 backdrop-blur-sm"></div>
      </div>
      <div className="absolute bottom-40 left-1/4 animate-bounce duration-3000 delay-700">
        <div className="w-12 h-12 bg-pink-500/30 rounded-full backdrop-blur-sm"></div>
      </div>
      <div className="absolute top-1/3 left-1/6 animate-bounce duration-3000 delay-500">
        <div className="w-8 h-8 bg-yellow-500/30 rounded-lg rotate-45 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Tag className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white/90">
              10,000+ Active Coupons
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Unlock Exclusive Savings &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">
              Discover Amazing Offers!
            </span>
          </h1>

          {/* Dynamic Subheadline */}
          <p className="text-xl sm:text-2xl text-white/80 mb-8 h-8 font-medium">
            {displayText}
            <span className="animate-blink">|</span>
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  placeholder="Search for stores, brands, or coupons..."
                  className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <select className="h-12 px-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-orange-400 transition-colors cursor-pointer">
                <option value="" className="text-gray-900">
                  All Categories
                </option>
                <option value="fashion" className="text-gray-900">
                  Fashion
                </option>
                <option value="electronics" className="text-gray-900">
                  Electronics
                </option>
                <option value="food" className="text-gray-900">
                  Food & Dining
                </option>
                <option value="travel" className="text-gray-900">
                  Travel
                </option>
                <option value="health" className="text-gray-900">
                  Health & Beauty
                </option>
                <option value="home" className="text-gray-900">
                  Home & Living
                </option>
              </select>
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <span className="text-white/60 text-sm">Popular:</span>
            {["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato", "MakeMyTrip"].map(
              (term) => (
                <button
                  key={term}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white/80 text-sm transition-all duration-200 hover:scale-105"
                >
                  {term}
                </button>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="h-14 px-8 bg-white text-purple-900 hover:bg-gray-100 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Explore Deals
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            >
              Sign Up & Save
            </Button>
          </div>

          {/* How It Works Link */}
          <div className="mt-8">
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
            >
              <span>How It Works</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
}
