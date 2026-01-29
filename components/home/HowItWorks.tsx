"use client";

import { Search, Tag, Copy, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: <Search className="w-8 h-8" />,
    title: "Search for Offers",
    description:
      "Browse through thousands of verified coupons and deals from your favorite brands. Use our smart filters to find exactly what you need.",
  },
  {
    number: "02",
    icon: <Tag className="w-8 h-8" />,
    title: "Select a Coupon",
    description:
      "Choose the best deal that suits your needs. Compare discounts, read reviews, and check validity before making your choice.",
  },
  {
    number: "03",
    icon: <Copy className="w-8 h-8" />,
    title: "Copy the Code",
    description:
      "Click 'Copy' to get your exclusive coupon code. Some deals apply automatically - just click through to the store!",
  },
  {
    number: "04",
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "Shop & Save",
    description:
      "Apply the code at checkout on the retailer's website and watch the price drop. Enjoy your instant savings!",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-orange-600 bg-orange-100 rounded-full px-4 py-2 mb-4">
            📖 Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Saving money with CouponWala is as easy as 1-2-3-4. Follow these
            simple steps to start saving today!
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-orange-300 via-purple-300 to-pink-300"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Step Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-full border border-gray-100 hover:-translate-y-2">
                  {/* Number Badge */}
                  <div className="absolute -top-5 left-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon Circle */}
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow - Desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 transform translate-x-full">
                    <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Start Saving?
            </h3>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Join millions of smart shoppers who trust CouponWala for the best
              deals and exclusive discounts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-12 px-8 bg-white text-purple-600 hover:bg-gray-100 font-semibold rounded-xl shadow-lg transition-all duration-200"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl transition-all duration-200"
              >
                Watch Tutorial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
