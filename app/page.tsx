"use client";

import Link from "next/link";
import { ArrowRight, Mail, Smartphone, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CartSidebar } from "@/components/cart/CartSidebar";

// Import new home page components
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingDeals } from "@/components/home/TrendingDeals";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedCarousel } from "@/components/home/FeaturedCarousel";
import { CouponShowcase } from "@/components/home/CouponCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Header } from "@/components/layout/Header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <CartSidebar />
      <Header/>

      {/* New Hero Section */}
      <HeroSection />

      {/* Featured Carousel */}
      <FeaturedCarousel />

      {/* Trending Deals */}
      <TrendingDeals />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Coupon Showcase */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-green-100 text-green-600 hover:bg-green-100">
              💰 Latest Coupons
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Verified Coupon Codes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our collection of verified coupon codes and start saving on
              your favorite brands.
            </p>
          </div>

          {/* Coupon Cards Grid */}
          <CouponShowcase />

          {/* View All Coupons Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200"
            >
              View All Coupons
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20">
            📧 Stay Updated
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Get Exclusive Deals in Your Inbox
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new
            coupons, flash sales, and exclusive offers!
          </p>

          {/* Newsletter Form */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
            <div className="flex-1 relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full h-12 pl-12 pr-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Subscribe
            </Button>
          </div>

          <p className="text-white/60 text-sm">
            🎁 Get ₹100 Off on your first order after subscription!
          </p>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-white">
                <Badge className="mb-6 bg-orange-500 text-white">
                  📱 Download App
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Shop Smarter with Our Mobile App
                </h2>
                <p className="text-xl text-white/80 mb-8">
                  Get instant notifications for flash sales, exclusive app-only
                  deals, and never miss a coupon again!
                </p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    "Push Notifications",
                    "App-Only Deals",
                    "Price Drop Alerts",
                    "Favorite Stores",
                  ].map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-white/90"
                    >
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* App Store Buttons */}
                <div className="flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 hover:scale-105 transition-transform">
                    <Smartphone className="w-8 h-8 text-gray-900" />
                    <div className="text-left">
                      <div className="text-xs text-gray-500">Download on the</div>
                      <div className="text-lg font-semibold text-gray-900">
                        App Store
                      </div>
                    </div>
                  </button>
                  <button className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3 hover:bg-white/20 transition-colors">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.3,10.84L17.3,9.09L15.39,11L17.3,12.91L20.3,11.16C20.71,10.92 20.71,10.08 20.3,10.84M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                    </svg>
                    <div className="text-left">
                      <div className="text-xs text-white/60">Get it on</div>
                      <div className="text-lg font-semibold text-white">
                        Google Play
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Right - App Mockup */}
              <div className="relative hidden lg:block">
                <div className="relative w-64 h-[500px] mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 border-gray-800">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl"></div>
                  <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <div className="text-6xl mb-4">🏷️</div>
                      <div className="text-2xl font-bold mb-2">
                        CouponWala
                      </div>
                      <div className="text-sm opacity-80">
                        Shop Smart, Save Big!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-orange-500 text-white text-lg font-bold px-4 py-2 rounded-xl shadow-lg animate-bounce-slow">
                  💰 Save 70%
                </div>
                <div className="absolute -bottom-6 -left-6 bg-green-500 text-white text-lg font-bold px-4 py-2 rounded-xl shadow-lg animate-bounce-slow animation-delay-500">
                  🎉 Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start Saving Today!
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of smart shoppers who trust CouponWala for the best
            deals and exclusive discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-12 px-8 bg-white text-orange-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                Create Free Account
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/offers">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200"
              >
                Browse Deals
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Top Stores",
                links: ["Amazon", "Flipkart", "Myntra", "Swiggy", "Zomato"],
              },
              {
                title: "Categories",
                links: ["Fashion", "Electronics", "Food", "Travel", "Beauty"],
              },
              {
                title: "Help",
                links: ["How It Works", "Terms", "Privacy", "Contact", "FAQ"],
              },
              {
                title: "Popular",
                links: ["Hot Deals", "Trending", "New Offers", "BOGO", "Clearance"],
              },
            ].map((group, index) => (
              <div key={index}>
                <h3 className="text-white font-semibold mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
